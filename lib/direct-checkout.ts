import type { PaidTierId } from '../data/pricing';
import type { AcquisitionSource } from './acquisition-source';

export type DirectCheckoutAttribution = {
  source?: string;
  ref?: string;
  utmCampaign?: string;
  utmSource?: string;
  sharedResult?: string;
  parentSource?: string;
  sourceChain?: string;
};

export type DirectCheckoutSession = {
  sessionId?: string;
  url: string;
  expiresAt?: number | string;
};

type DirectCheckoutInput = {
  tier: PaidTierId;
  source: string;
  acquisition?: AcquisitionSource | null;
  customerEmail?: string | null;
  anonymousId?: string | null;
};

const cleanToken = (value: unknown, maxLength = 80): string | undefined => {
  if (typeof value !== 'string') return undefined;

  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, maxLength);

  return cleaned || undefined;
};

const buildSourceChain = (...values: Array<string | null | undefined>): string | undefined => {
  const tokens = values.flatMap((value) => (
    typeof value === 'string'
      ? value.split('>').map((token) => cleanToken(token)).filter((token): token is string => Boolean(token))
      : []
  ));
  const cleaned = Array.from(new Set(tokens)).join('>').slice(0, 240);
  return cleaned || undefined;
};

export const buildDirectCheckoutAttribution = (
  acquisition: AcquisitionSource | null | undefined,
  checkoutSource: string,
): DirectCheckoutAttribution => {
  if (!acquisition) return {};

  const cleanedCheckoutSource = cleanToken(checkoutSource);
  const parentSource = acquisition.parentSource || acquisition.source;
  const sourceChain = buildSourceChain(
    acquisition.sourceChain,
    acquisition.parentSource,
    acquisition.source,
    cleanedCheckoutSource,
  );

  return {
    source: acquisition.source,
    ...(acquisition.ref ? { ref: acquisition.ref } : {}),
    ...(acquisition.utmCampaign ? { utmCampaign: acquisition.utmCampaign } : {}),
    ...(acquisition.utmSource ? { utmSource: acquisition.utmSource } : {}),
    ...(acquisition.sharedResult ? { sharedResult: acquisition.sharedResult } : {}),
    ...(parentSource ? { parentSource } : {}),
    ...(sourceChain ? { sourceChain } : {}),
  };
};

const isStripeCheckoutUrl = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && parsed.hostname === 'checkout.stripe.com';
  } catch {
    return false;
  }
};

export async function createDirectCheckoutSession({
  tier,
  source,
  acquisition,
  customerEmail,
  anonymousId,
}: DirectCheckoutInput): Promise<{ session: DirectCheckoutSession; attribution: DirectCheckoutAttribution }> {
  const attribution = buildDirectCheckoutAttribution(acquisition, source);
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      tier,
      source,
      attribution,
      ...(customerEmail?.trim() ? { customerEmail: customerEmail.trim() } : {}),
      recoveryEmailOptIn: false,
      ...(anonymousId?.trim() ? { anonymousId: anonymousId.trim() } : {}),
    }),
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(typeof payload?.error === 'string' ? payload.error : 'Unable to open secure checkout');
  }

  if (!isStripeCheckoutUrl(payload?.url)) {
    throw new Error('Stripe did not return a secure checkout link');
  }

  return {
    session: {
      url: payload.url,
      ...(typeof payload.sessionId === 'string' ? { sessionId: payload.sessionId } : {}),
      ...(typeof payload.expiresAt === 'number' || typeof payload.expiresAt === 'string'
        ? { expiresAt: payload.expiresAt }
        : {}),
    },
    attribution,
  };
}
