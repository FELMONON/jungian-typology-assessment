import type { VercelRequest, VercelResponse } from '@vercel/node';
import { enforceRateLimit } from './rate-limit.js';
import {
  getStripePaymentMethodConfigurationId,
  getStripeSecretKey,
  resolveCheckoutBaseUrl,
} from '../../server/checkout.js';
import { PRICING } from '../../data/pricing.js';
import { discountedAmount, formatCadAmount } from '../../data/discount.js';
import { guardPaidReportCheckout } from './report-availability.js';

const CHECKOUT_SESSION_EXPIRATION_SECONDS = 24 * 60 * 60;

// Post-purchase upgrade: an Insight buyer pays only the difference to Mastery.
// Charged as a one-time delta (no TYPEJUNG30 — both sides are already the
// discounted prices) and recorded as a Mastery purchase so premium status,
// which reads the most recent completed purchase, reflects the upgrade.
export const masteryUpgradeAmount = () =>
  Math.round((discountedAmount(PRICING.mastery.amount) - discountedAmount(PRICING.insight.amount)) * 100) / 100;

function cleanEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().toLowerCase();
  if (!cleaned || cleaned.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned)) return null;
  return cleaned;
}

function cleanToken(value: unknown, max = 80): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  return value.trim().replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').slice(0, max) || undefined;
}

export async function createMasteryUpgradeSession(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (enforceRateLimit(req, res, {
    keyPrefix: 'checkout:mastery-upgrade',
    limit: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Too many upgrade attempts. Please wait and try again.',
  })) return;

  try {
    const stripeSecretKey = getStripeSecretKey();
    if (!stripeSecretKey) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    if (!await guardPaidReportCheckout(res)) return;

    const customerEmail = cleanEmail(req.body?.email ?? req.body?.customerEmail);
    const source = cleanToken(req.body?.source) || 'success_upsell';
    const amount = masteryUpgradeAmount();
    const baseUrl = resolveCheckoutBaseUrl(req.headers.origin, req.headers.host);
    const expiresAt = Math.floor(Date.now() / 1000) + CHECKOUT_SESSION_EXPIRATION_SECONDS;
    const paymentMethodConfigurationId = getStripePaymentMethodConfigurationId();

    const metadata: Record<string, string> = {
      product: 'typejung_premium',
      tier: 'mastery',
      upgrade: 'insight_to_mastery',
      amount_cad: String(amount),
      source,
    };

    const params = new URLSearchParams({
      'mode': 'payment',
      'line_items[0][price_data][currency]': PRICING.mastery.currency.toLowerCase(),
      'line_items[0][price_data][unit_amount]': String(Math.round(amount * 100)),
      'line_items[0][price_data][product_data][name]': 'TypeJung Mastery Upgrade',
      'line_items[0][price_data][product_data][description]': 'Upgrade from Insight to Mastery: AI Type Guide, individuation roadmap, growth exercises, and practice support.',
      'line_items[0][quantity]': '1',
      'submit_type': 'pay',
      'success_url': `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${baseUrl}/results`,
      'expires_at': String(expiresAt),
      'custom_text[submit][message]': 'One-time CAD upgrade to Mastery. No subscription.',
      'payment_intent_data[description]': 'TypeJung Mastery Upgrade',
    });

    Object.entries(metadata).forEach(([key, value]) => {
      if (!value) return;
      params.set(`metadata[${key}]`, value);
      params.set(`payment_intent_data[metadata][${key}]`, value);
    });

    if (customerEmail) {
      params.set('customer_email', customerEmail);
      params.set('customer_creation', 'always');
    }
    if (paymentMethodConfigurationId) {
      params.set('payment_method_configuration', paymentMethodConfigurationId);
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const session = await response.json();
    if (!response.ok) {
      console.error('Stripe mastery upgrade error:', session);
      return res.status(response.status).json({ error: session.error?.message || 'Stripe error' });
    }

    return res.status(200).json({ sessionId: session.id, url: session.url, expiresAt: session.expires_at || expiresAt });
  } catch (error: any) {
    console.error('Mastery upgrade error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create upgrade session' });
  }
}
