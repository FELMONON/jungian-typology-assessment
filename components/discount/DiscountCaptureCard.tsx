import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Copy, Mail, ShieldCheck, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { EMAIL_CAPTURE_OFFER } from '../../data/discount';
import { isPaidTierId, type PaidTierId } from '../../data/pricing';
import { useAuth } from '../../hooks/use-auth';
import { AnalyticsEvents, trackEvent } from '../../lib/analytics';
import { pathWithSource, readAcquisitionSource } from '../../lib/acquisition-source';

type DiscountCaptureCardProps = {
  source: string;
  dominantLabel?: string;
  inferiorLabel?: string;
  compact?: boolean;
  showCheckoutButtons?: boolean;
  onCheckout?: (tier: PaidTierId) => void;
  checkoutButtonLabel?: string;
  minimal?: boolean;
  minimalTitle?: string;
  minimalDescription?: string;
  minimalSubmitLabel?: string;
  minimalFootnote?: string;
  minimalSentMessage?: string;
  minimalTone?: 'light' | 'dark';
  preferredTier?: PaidTierId;
  className?: string;
};

type SubmitState = 'idle' | 'submitting' | 'sent' | 'error';

const STORAGE_KEY = 'typejung_discount_capture';

type CapturedDiscount = {
  email: string;
  discountCode: string;
  source?: string;
  tierIntent?: PaidTierId;
};

function readCapturedDiscount(): CapturedDiscount {
  if (typeof window === 'undefined') return { email: '', discountCode: '' };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const tierIntent = isPaidTierId(saved.tierIntent) ? saved.tierIntent : undefined;
    return {
      email: typeof saved.email === 'string' ? saved.email : '',
      discountCode: typeof saved.discountCode === 'string' ? saved.discountCode : '',
      source: typeof saved.source === 'string' ? saved.source : undefined,
      tierIntent,
    };
  } catch {
    return { email: '', discountCode: '' };
  }
}

export const DiscountCaptureCard: React.FC<DiscountCaptureCardProps> = ({
  source,
  dominantLabel,
  inferiorLabel,
  compact = false,
  showCheckoutButtons = true,
  onCheckout,
  checkoutButtonLabel,
  minimal = false,
  minimalTitle,
  minimalDescription,
  minimalSubmitLabel,
  minimalFootnote,
  minimalSentMessage,
  minimalTone = 'light',
  preferredTier,
  className = '',
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const savedDiscount = useMemo(readCapturedDiscount, []);
  const hasSavedDiscount = Boolean(savedDiscount.email && savedDiscount.discountCode);
  const [email, setEmail] = useState(savedDiscount.email || user?.email || '');
  const [discountCode, setDiscountCode] = useState(savedDiscount.discountCode || EMAIL_CAPTURE_OFFER.code);
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<SubmitState>(hasSavedDiscount ? 'sent' : 'idle');
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const viewTrackedRef = useRef(false);

  useEffect(() => {
    if (!email && user?.email) setEmail(user.email);
  }, [email, user?.email]);

  useEffect(() => {
    if (viewTrackedRef.current) return;
    viewTrackedRef.current = true;

    trackEvent('discount_capture_card_viewed', {
      source,
      tier: preferredTier || 'unknown',
      minimal,
      show_checkout_buttons: showCheckoutButtons,
      has_email_prefill: Boolean(email),
      has_axis_context: Boolean(dominantLabel && inferiorLabel),
      has_saved_discount: hasSavedDiscount,
    });
  }, [dominantLabel, email, hasSavedDiscount, inferiorLabel, minimal, preferredTier, showCheckoutButtons, source]);

  const checkoutCopy = `${EMAIL_CAPTURE_OFFER.code}: ${EMAIL_CAPTURE_OFFER.percentOff}% off ${EMAIL_CAPTURE_OFFER.appliesTo}`;
  const preferredTierName = preferredTier ? (preferredTier === 'insight' ? 'Insight' : 'Mastery') : null;
  const minimalTitleCopy = minimalTitle || 'Not ready to pay yet?';
  const minimalDescriptionCopy = minimalDescription || `Email yourself the ${EMAIL_CAPTURE_OFFER.code} code and come back when you want ${preferredTierName ? `the ${preferredTierName} report` : 'the deeper report'}.`;
  const minimalSubmitLabelCopy = minimalSubmitLabel || 'Email code';
  const minimalFootnoteCopy = minimalFootnote || 'We will send the backup code by email, plus result follow-up when it is relevant. No spam.';
  const minimalSentMessageCopy = minimalSentMessage || `Backup code sent. ${preferredTierName ? `The email links back to ${preferredTierName} with the discount ready.` : 'Stripe still applies the discount automatically when you continue.'}`;
  const hasAxisContext = Boolean(dominantLabel && inferiorLabel);
  const minimalIsDark = minimalTone === 'dark';
  const minimalPrimaryText = minimalIsDark ? 'text-white' : 'text-jung-dark';
  const minimalSecondaryText = minimalIsDark ? 'text-white/70' : 'text-jung-secondary';
  const minimalMutedText = minimalIsDark ? 'text-white/50' : 'text-jung-muted';
  const minimalSentStyles = minimalIsDark
    ? 'border border-white/10 bg-white/5 text-white/70'
    : 'bg-jung-surface text-jung-secondary';
  const minimalInputStyles = minimalIsDark
    ? 'border-white/15 bg-white/5 text-white placeholder:text-white/35 focus:border-jung-accent focus:ring-jung-accent/30'
    : 'border-jung-border bg-jung-surface text-jung-dark focus:border-jung-accent focus:ring-jung-accent/20';
  const minimalButtonClass = minimalIsDark ? 'border-white/15 text-white hover:border-white/30 hover:bg-white/10' : '';

  const copyDiscountCode = async () => {
    if (!discountCode) return;

    try {
      await navigator.clipboard.writeText(discountCode);
      setCopyStatus('copied');
      trackEvent('discount_code_copied', { source });
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    } catch {
      setCopyStatus('idle');
    }
  };

  const goToCheckout = (tier: PaidTierId) => {
    const destination = onCheckout
      ? 'secure_stripe_checkout'
      : pathWithSource(`/checkout/${tier}`, `${source}_${tier}_checkout`);
    AnalyticsEvents.ctaClicked(`open_${tier}_checkout_after_discount_email`, source, {
      buttonText: checkoutButtonLabel || `Open ${tier} checkout`,
      destination,
    });

    if (onCheckout) {
      onCheckout(tier);
      return;
    }

    navigate(destination);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setError(null);
    trackEvent('discount_lead_submit', {
      source,
      tier: preferredTier || 'unknown',
      has_axis_context: hasAxisContext,
    });

    try {
      const acquisition = readAcquisitionSource();
      const response = await fetch('/api/auth/discount-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          website,
          source,
          dominantLabel,
          inferiorLabel,
          tierIntent: preferredTier,
          utmSource: acquisition?.utmSource,
          utmCampaign: acquisition?.utmCampaign,
          parentSource: acquisition?.parentSource || acquisition?.source,
          sourceChain: acquisition?.sourceChain,
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Could not send the code. Please try again.');
      }

      trackEvent('discount_lead_request_completed', {
        source,
        tier: preferredTier || 'unknown',
        captured: Boolean(data?.captured),
        capture_reason: typeof data?.captureReason === 'string' ? data.captureReason : 'unknown',
        email_sent: Boolean(data?.sent),
        skip_reason: typeof data?.reason === 'string' ? data.reason : 'none',
        has_axis_context: hasAxisContext,
      });

      const returnedDiscountCode = typeof data?.discountCode === 'string' ? data.discountCode : EMAIL_CAPTURE_OFFER.code;
      setDiscountCode(returnedDiscountCode);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          email,
          discountCode: returnedDiscountCode,
          capturedAt: new Date().toISOString(),
          source,
          ...(preferredTier ? { tierIntent: preferredTier } : {}),
        }));
      } catch {
        // Non-critical persistence.
      }

      if (data?.captured === true) {
        trackEvent('discount_lead_captured', {
          source,
          tier: preferredTier || 'unknown',
          percent_off: EMAIL_CAPTURE_OFFER.percentOff,
          has_axis_context: hasAxisContext,
        });
      }
      if (data?.sent === true) {
        trackEvent('discount_lead_email_sent', {
          source,
          tier: preferredTier || 'unknown',
          percent_off: EMAIL_CAPTURE_OFFER.percentOff,
          has_axis_context: hasAxisContext,
        });
      }
      setStatus('sent');
    } catch (err: any) {
      setError(err.message || 'Could not send the code. Please try again.');
      setStatus('error');
      AnalyticsEvents.errorOccurred('discount_lead_capture_failed', err.message);
    }
  };

  if (minimal) {
    return (
      <div className={className}>
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />
          <div className="min-w-0">
            <p className={`text-sm font-semibold ${minimalPrimaryText}`}>{minimalTitleCopy}</p>
            <p className={`mt-1 text-xs leading-5 ${minimalSecondaryText}`}>
              {minimalDescriptionCopy}
            </p>
          </div>
        </div>

        {status === 'sent' ? (
          <div className={`mt-3 grid gap-3 rounded-lg px-3 py-3 text-xs leading-5 ${minimalSentStyles}`}>
            <div className="flex items-start gap-2">
              <Check className="mt-0.5 h-3.5 w-3.5 flex-none text-jung-accent" />
              <span>{minimalSentMessageCopy}</span>
            </div>
            {showCheckoutButtons && preferredTier && (
              <Button
                type="button"
                variant="accent"
                size="sm"
                className="w-full"
                onClick={() => goToCheckout(preferredTier)}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {checkoutButtonLabel || `Continue to ${preferredTierName} - discounted`}
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={submit} className="mt-3 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <label className="sr-only" htmlFor={`${source}-discount-email`}>
              Email address
            </label>
            <input
              id={`${source}-discount-email`}
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={`h-12 w-full rounded-lg border px-3 text-sm outline-none transition focus:ring-2 ${minimalInputStyles}`}
            />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className={minimalButtonClass}
              disabled={status === 'submitting'}
              isLoading={status === 'submitting'}
            >
              {minimalSubmitLabelCopy}
            </Button>
            <input
              aria-hidden="true"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              className="hidden"
              name="website"
            />
            {error && <p className="text-xs leading-5 text-error sm:col-span-2">{error}</p>}
            <p className={`text-xs leading-5 sm:col-span-2 ${minimalMutedText}`}>
              {minimalFootnoteCopy}
            </p>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-5 shadow-sm ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg bg-jung-surface px-3 py-1.5 text-xs font-semibold text-jung-accent">
            <Tag className="h-3.5 w-3.5" />
            {checkoutCopy}
          </div>
          <h3 className={`${compact ? 'mt-3 text-xl' : 'mt-4 text-2xl'} font-semibold text-jung-dark`}>
            Use the current upgrade offer.
          </h3>
          <p className={`${compact ? 'mt-2 text-xs leading-5' : 'mt-3 text-sm leading-6'} text-jung-secondary`}>
            Stripe applies {EMAIL_CAPTURE_OFFER.code} automatically before payment. Keep the code here, or email yourself a backup copy.
          </p>
        </div>
        <ShieldCheck className="hidden h-5 w-5 flex-none text-jung-accent sm:block" />
      </div>

      <div className="mt-5 rounded-lg border border-jung-border bg-jung-surface p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">Promotion code</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="flex min-h-12 items-center rounded-lg border border-jung-border bg-jung-base px-4 font-mono text-lg font-semibold tracking-[0.12em] text-jung-dark">
            {discountCode}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={copyDiscountCode}
            leftIcon={copyStatus === 'copied' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          >
            {copyStatus === 'copied' ? 'Copied' : 'Copy code'}
          </Button>
        </div>
        <p className="mt-3 text-xs leading-5 text-jung-secondary">
          You will confirm the discounted total on Stripe before payment is collected.
        </p>
      </div>

      {status === 'sent' ? (
        <div className="mt-5 grid gap-4">
          <div className="rounded-lg border border-jung-border bg-jung-surface p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent">
                <Check className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-jung-dark">
                  Backup email sent.
                </p>
                <p className="mt-2 text-xs leading-5 text-jung-secondary">
                  {email ? `Sent to ${email}. ` : ''}Stripe still applies the code automatically on the checkout step.
                </p>
              </div>
            </div>
          </div>
          {showCheckoutButtons && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                variant="accent"
                size="sm"
                onClick={() => goToCheckout('insight')}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Open Insight checkout
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToCheckout('mastery')}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Open Mastery checkout
              </Button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={submit} className="mt-5 grid gap-3">
          <label className="sr-only" htmlFor={`${source}-discount-email`}>
            Email address
          </label>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-jung-muted" />
              <input
                id={`${source}-discount-email`}
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-lg border border-jung-border bg-jung-surface pl-10 pr-3 text-sm text-jung-dark outline-none transition focus:border-jung-accent focus:ring-2 focus:ring-jung-accent/20"
              />
            </div>
            <Button type="submit" variant="accent" disabled={status === 'submitting'} isLoading={status === 'submitting'}>
              Email backup code
            </Button>
          </div>
          <input
            aria-hidden="true"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            className="hidden"
            name="website"
          />
          {error && <p className="text-xs leading-5 text-error">{error}</p>}
          <p className="text-xs leading-5 text-jung-muted">
            We will send the backup code by email, plus result follow-up when it is relevant. No spam.
          </p>
        </form>
      )}
    </div>
  );
};
