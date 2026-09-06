import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ATTITUDE_LABELS, FUNCTION_LABELS } from '../data/depthAssessment';
import {
  discountedPriceLabel,
  discountSavingsAmount,
  EMAIL_CAPTURE_OFFER,
  formatCadAmount,
} from '../data/discount';
import type { PaidTierId } from '../data/pricing';
import { isPaidTierId, PRICING } from '../data/pricing';
import { SUPPORT_EMAIL } from '../data/support';
import { useAuth } from '../hooks/use-auth';
import { useSEO } from '../hooks/useSEO';
import {
  captureAcquisitionSourceFromLocation,
  pathWithSource,
  sourceForCheckout,
} from '../lib/acquisition-source';
import {
  AnalyticsEvents,
  getFunnelAnonymousId,
  trackEvent,
} from '../lib/analytics';
import { writePendingCheckout } from '../lib/pending-checkout';
import { writeUpgradeIntent } from '../lib/upgrade-intent';
import { STORAGE_KEYS } from '../lib/validation';
import {
  DepthAssessmentResult,
  isDepthAssessmentResult,
} from '../utils/depthScoring';

type CheckoutTierDetails = {
  packageName: string;
  headline: string;
  description: string;
  includes: string[];
  previewModules: Array<{ title: string; body: string }>;
  nextStep: string;
};

const CHECKOUT_DETAILS: Record<PaidTierId, CheckoutTierDetails> = {
  insight: {
    packageName: 'Insight Report',
    headline:
      'Get the ten-section interpretation behind the free map you just saw.',
    description:
      'The free map shows your scores, hierarchy, dominant-inferior axis, and consistency signal. Insight starts after that boundary with ten personalized sections across function dynamics, archetypes, grip and recovery, relationships, work, individuation, shadow, growth, and dream reflection.',
    includes: [
      'Ten personalized interpretation sections',
      'Grip sequence with pressure and recovery cues',
      'Relationship and work-pattern reflections',
      'Archetype, shadow, individuation, growth, and dream prompts',
      'The Function Stack in Depth — 15-page theory guide (PDF)',
      'Unlocked result access in this browser, with account restore after sign-in',
    ],
    previewModules: [
      {
        title: 'Grip sequence and recovery',
        body: 'A separate read of early pressure signals, escalation, and the grounded move that can restore choice.',
      },
      {
        title: 'Relationship and work patterns',
        body: 'Two distinct sections for conflict, repair, feedback, pacing, and the conditions that strain your weaker channel.',
      },
      {
        title: 'Shadow and growth prompts',
        body: 'Archetypal, shadow, individuation, growth, and dream-reflection sections that go beyond the free hierarchy.',
      },
    ],
    nextStep:
      'Stripe handles payment securely in one step. After checkout, return to TypeJung and sign in with the purchase email if prompted so the ten-section report can be attached to your account.',
  },
  mastery: {
    packageName: 'Mastery Report',
    headline: 'The ten-section report plus ongoing practice tools.',
    description:
      'Mastery includes everything in Insight plus the AI Type Guide, tailored growth exercises, and a practice roadmap for working with your cognitive stack.',
    includes: [
      'Everything in Insight',
      'AI Type Guide for follow-up reflection questions',
      'Individuation roadmap and practice plan',
      'Growth exercises tailored to your cognitive stack',
      'The Function Stack in Depth — 15-page theory guide (PDF)',
      'Account-based guide access after sign-in',
    ],
    previewModules: [
      {
        title: 'AI Type Guide',
        body: 'Follow-up questions about the result, with reflection prompts grounded in your mapped stack.',
      },
      {
        title: 'Individuation roadmap',
        body: 'A practice sequence for using the report after the first read-through.',
      },
      {
        title: 'Tracking over time',
        body: 'Reassessment context so later maps can be compared against the current one.',
      },
    ],
    nextStep:
      'Stripe handles payment securely. After checkout, return to TypeJung and sign in with the purchase email if prompted so Mastery features can be enabled on your account.',
  },
};

const DISCOUNT_CAPTURE_STORAGE_KEY = 'typejung_discount_capture';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const readCapturedDiscountEmail = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const saved = JSON.parse(
      localStorage.getItem(DISCOUNT_CAPTURE_STORAGE_KEY) || '{}',
    );
    const email =
      typeof saved.email === 'string' ? saved.email.trim().toLowerCase() : '';
    return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : null;
  } catch {
    return null;
  }
};

const readSavedDepthResult = (): DepthAssessmentResult | null => {
  if (typeof window === 'undefined') return null;

  try {
    const parsed = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.RESULTS) || 'null',
    );
    return isDepthAssessmentResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tier } = useParams<{ tier: string }>();
  const { user } = useAuth();
  const paidTier = isPaidTierId(tier) ? tier : null;
  const [isOpeningStripe, setIsOpeningStripe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedEmail] = useState(readCapturedDiscountEmail);
  const [checkoutRecoveryEmail, setCheckoutRecoveryEmail] = useState(
    () => capturedEmail || '',
  );
  const [checkoutRecoveryOptIn, setCheckoutRecoveryOptIn] = useState(false);

  const checkoutAxisTrackedRef = useRef<string | null>(null);
  const checkoutOpeningRef = useRef(false);
  const checkoutEmailInputRef = useRef<HTMLInputElement>(null);
  const [recoveryEmailError, setRecoveryEmailError] = useState<string | null>(
    null,
  );
  const [checkoutRecoverySaveStatus, setCheckoutRecoverySaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const [savedDepthResult] = useState(readSavedDepthResult);
  const hasLocalResults = Boolean(savedDepthResult);
  const returnedFromStripe =
    new URLSearchParams(location.search).get('checkout') === 'cancelled';
  const acquisition = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const path = `${location.pathname}${location.search}${location.hash}`;
    return captureAcquisitionSourceFromLocation(
      location.search,
      path,
      document.referrer,
    );
  }, [location.hash, location.pathname, location.search]);
  const acquisitionSource = acquisition?.source || null;
  const checkoutAttribution = useMemo(
    () =>
      acquisition
        ? {
            source: acquisition.source,
            ref: acquisition.ref,
            utmCampaign: acquisition.utmCampaign,
            utmSource: acquisition.utmSource,
            sharedResult: acquisition.sharedResult,
            parentSource: acquisition.parentSource,
            sourceChain: acquisition.sourceChain,
          }
        : undefined,
    [
      acquisition?.source,
      acquisition?.ref,
      acquisition?.utmCampaign,
      acquisition?.utmSource,
      acquisition?.sharedResult,
      acquisition?.parentSource,
      acquisition?.sourceChain,
    ],
  );

  const checkoutDetails = paidTier ? CHECKOUT_DETAILS[paidTier] : null;
  const tierPrice = paidTier ? PRICING[paidTier] : null;
  const savedResultAxis = useMemo(() => {
    if (!savedDepthResult) return null;

    const inferiorPosition = savedDepthResult.hierarchy.find(
      (item) => item.position === 'inferior',
    );
    return {
      dominantLabel: `${ATTITUDE_LABELS[savedDepthResult.attitude.dominant]} ${FUNCTION_LABELS[savedDepthResult.dominant]}`,
      inferiorLabel: `${ATTITUDE_LABELS[inferiorPosition?.attitude ?? 'extraverted']} ${FUNCTION_LABELS[savedDepthResult.inferior]}`,
      dominantChannel: savedDepthResult.dominant,
      inferiorChannel: savedDepthResult.inferior,
      reliability: savedDepthResult.reliability.label,
    };
  }, [savedDepthResult]);

  useEffect(() => {
    if (!checkoutRecoveryEmail && user?.email) {
      setCheckoutRecoveryEmail(user.email);
    }
  }, [checkoutRecoveryEmail, user?.email]);

  useSEO({
    title: checkoutDetails
      ? `Checkout - ${checkoutDetails.packageName} | TypeJung`
      : 'Checkout | TypeJung',
    description:
      'Review your TypeJung order before continuing to secure Stripe payment.',
    noIndex: true,
  });

  useEffect(() => {
    if (!paidTier) {
      navigate('/pricing', { replace: true });
      return;
    }

    trackEvent('checkout_review_viewed', {
      tier: paidTier,
      value: PRICING[paidTier].amount,
      currency: PRICING[paidTier].currency,
      returned_from_stripe: returnedFromStripe,
      acquisition_source: acquisitionSource || 'unknown',
      acquisition_ref: acquisition?.ref || 'unknown',
      utm_campaign: acquisition?.utmCampaign || 'unknown',
      utm_source: acquisition?.utmSource || 'unknown',
      shared_result: acquisition?.sharedResult || 'none',
      parent_source: acquisition?.parentSource || 'none',
      source_chain: acquisition?.sourceChain || 'none',
      has_local_results: hasLocalResults,
    });
  }, [
    acquisition?.parentSource,
    acquisition?.ref,
    acquisition?.sharedResult,
    acquisition?.sourceChain,
    acquisition?.utmCampaign,
    acquisition?.utmSource,
    acquisitionSource,
    hasLocalResults,
    navigate,
    paidTier,
    returnedFromStripe,
  ]);

  useEffect(() => {
    if (!paidTier || !returnedFromStripe) return;

    trackEvent('stripe_checkout_returned_without_payment', {
      tier: paidTier,
      source: 'stripe_cancel_url',
    });
  }, [paidTier, returnedFromStripe]);

  useEffect(() => {
    if (!paidTier || !savedDepthResult || !savedResultAxis) return;

    const trackedKey = `${paidTier}_${savedDepthResult.completedAt}`;
    if (checkoutAxisTrackedRef.current === trackedKey) return;
    checkoutAxisTrackedRef.current = trackedKey;

    trackEvent('checkout_result_axis_context_viewed', {
      tier: paidTier,
      dominant_channel: savedResultAxis.dominantChannel,
      inferior_channel: savedResultAxis.inferiorChannel,
      reliability: savedResultAxis.reliability,
      acquisition_source: acquisitionSource || 'unknown',
      utm_campaign: acquisition?.utmCampaign || 'unknown',
      utm_source: acquisition?.utmSource || 'unknown',
    });
  }, [
    acquisition?.utmCampaign,
    acquisition?.utmSource,
    acquisitionSource,
    paidTier,
    savedDepthResult,
    savedResultAxis,
  ]);

  const recoveryEmailPreview =
    checkoutRecoveryEmail.trim() || user?.email || capturedEmail || '';
  const checkoutEmailCandidate = recoveryEmailPreview.trim();
  const hasCheckoutEmail = EMAIL_PATTERN.test(
    checkoutEmailCandidate.toLowerCase(),
  );
  const finalPriceLabel = tierPrice
    ? discountedPriceLabel(tierPrice.amount)
    : '';

  const rememberCheckoutRecoveryEmail = useCallback(
    (email: string) => {
      if (!paidTier) return;

      try {
        localStorage.setItem(
          DISCOUNT_CAPTURE_STORAGE_KEY,
          JSON.stringify({
            email,
            discountCode: EMAIL_CAPTURE_OFFER.code,
            capturedAt: new Date().toISOString(),
            source: 'checkout_recovery_prestripe',
            tierIntent: paidTier,
          }),
        );
      } catch {
        // Non-critical persistence.
      }
    },
    [paidTier],
  );

  const sendCheckoutRecoveryLead = useCallback(
    async (email: string): Promise<boolean> => {
      if (!paidTier) return false;

      try {
        const response = await fetch('/api/auth/discount-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email,
            website: '',
            source: 'checkout_recovery_prestripe',
            tierIntent: paidTier,
            dominantLabel: savedResultAxis?.dominantLabel,
            inferiorLabel: savedResultAxis?.inferiorLabel,
            utmSource: checkoutAttribution?.utmSource,
            utmCampaign: checkoutAttribution?.utmCampaign,
            parentSource:
              checkoutAttribution?.parentSource || checkoutAttribution?.source,
            sourceChain: checkoutAttribution?.sourceChain,
          }),
        });

        const data = await response.json().catch(() => null);
        if (!response.ok) {
          trackEvent('checkout_recovery_lead_failed', {
            tier: paidTier,
            status: response.status,
            reason:
              typeof data?.error === 'string' ? data.error : 'request_failed',
          });
          return false;
        }

        trackEvent('checkout_recovery_lead_captured', {
          tier: paidTier,
          captured: Boolean(data?.captured),
          email_sent: Boolean(data?.sent),
          capture_reason:
            typeof data?.captureReason === 'string'
              ? data.captureReason
              : 'unknown',
          skip_reason: typeof data?.reason === 'string' ? data.reason : 'none',
        });
        return true;
      } catch (error) {
        trackEvent('checkout_recovery_lead_failed', {
          tier: paidTier,
          status: 'network',
          reason:
            error instanceof Error
              ? error.message.substring(0, 120)
              : 'network_error',
        });
        // Checkout recovery capture is best-effort; Stripe should still open.
        return false;
      }
    },
    [
      checkoutAttribution?.parentSource,
      checkoutAttribution?.source,
      checkoutAttribution?.sourceChain,
      checkoutAttribution?.utmCampaign,
      checkoutAttribution?.utmSource,
      paidTier,
      savedResultAxis?.dominantLabel,
      savedResultAxis?.inferiorLabel,
    ],
  );

  const saveCheckoutRecoveryPath = useCallback(
    async (source: string) => {
      if (!paidTier) return false;

      const email = checkoutEmailCandidate.trim().toLowerCase();
      if (!EMAIL_PATTERN.test(email)) {
        setRecoveryEmailError('Enter a valid email address before Stripe.');
        window.requestAnimationFrame(() => {
          checkoutEmailInputRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          checkoutEmailInputRef.current?.focus();
        });
        return false;
      }

      setCheckoutRecoverySaveStatus('saving');
      setRecoveryEmailError(null);
      rememberCheckoutRecoveryEmail(email);
      const captured = await sendCheckoutRecoveryLead(email);

      if (captured) {
        setCheckoutRecoverySaveStatus('saved');
        trackEvent('checkout_recovery_path_saved', {
          tier: paidTier,
          source,
          acquisition_source: checkoutAttribution?.source || 'unknown',
          utm_campaign: checkoutAttribution?.utmCampaign || 'unknown',
          utm_source: checkoutAttribution?.utmSource || 'unknown',
          has_result_axis: Boolean(savedResultAxis),
        });
        return true;
      }

      setCheckoutRecoverySaveStatus('error');
      setRecoveryEmailError(
        'The checkout path could not be emailed yet. You can still continue to Stripe.',
      );
      return false;
    },
    [
      checkoutAttribution?.source,
      checkoutAttribution?.utmCampaign,
      checkoutAttribution?.utmSource,
      checkoutEmailCandidate,
      paidTier,
      rememberCheckoutRecoveryEmail,
      savedResultAxis,
      sendCheckoutRecoveryLead,
    ],
  );

  const viewSampleReport = useCallback(() => {
    const destination = pathWithSource(
      '/sample-report',
      'checkout_sample_report',
    );
    AnalyticsEvents.ctaClicked('view_sample_report', 'checkout_review', {
      buttonText: 'View sample report',
      destination,
    });
    navigate(destination);
  }, [navigate]);

  const startAssessmentFirst = useCallback(() => {
    if (!paidTier) return;

    const destination = pathWithSource(
      '/assessment',
      'checkout_without_result',
      { tier: paidTier },
    );
    writeUpgradeIntent(paidTier, 'checkout_without_result');
    AnalyticsEvents.ctaClicked(
      'start_assessment_before_checkout',
      'checkout_without_result',
      {
        buttonText: 'Start free assessment',
        destination,
        tier: paidTier,
      },
    );
    trackEvent('checkout_without_result_assessment_started', {
      tier: paidTier,
      acquisition_source: checkoutAttribution?.source || 'unknown',
      utm_campaign: checkoutAttribution?.utmCampaign || 'unknown',
      utm_source: checkoutAttribution?.utmSource || 'unknown',
      parent_source: checkoutAttribution?.parentSource || 'none',
      source_chain: checkoutAttribution?.sourceChain || 'none',
    });
    navigate(destination);
  }, [
    checkoutAttribution?.parentSource,
    checkoutAttribution?.source,
    checkoutAttribution?.sourceChain,
    checkoutAttribution?.utmCampaign,
    checkoutAttribution?.utmSource,
    navigate,
    paidTier,
  ]);

  const startStripeCheckout = useCallback(async () => {
    if (!paidTier || !tierPrice) return;
    if (checkoutOpeningRef.current) return;

    const checkoutSource = sourceForCheckout();
    const typedRecoveryEmail = checkoutRecoveryEmail.trim().toLowerCase();
    const validTypedRecoveryEmail = EMAIL_PATTERN.test(typedRecoveryEmail)
      ? typedRecoveryEmail
      : '';
    const checkoutCustomerEmail =
      validTypedRecoveryEmail ||
      readCapturedDiscountEmail() ||
      capturedEmail ||
      user?.email ||
      undefined;

    try {
      checkoutOpeningRef.current = true;
      setIsOpeningStripe(true);
      setError(null);
      setRecoveryEmailError(null);
      AnalyticsEvents.purchaseStarted(paidTier, tierPrice.amount);
      AnalyticsEvents.ctaClicked(
        'continue_to_secure_payment',
        'checkout_review',
        {
          buttonText: `Pay ${finalPriceLabel || tierPrice.price}`,
          destination: 'stripe_checkout',
        },
      );

      const recoveryEmail = checkoutCustomerEmail;
      const shouldUseSiteRecoveryConsent =
        checkoutRecoveryOptIn && Boolean(recoveryEmail);

      if (shouldUseSiteRecoveryConsent) {
        rememberCheckoutRecoveryEmail(recoveryEmail);
        void sendCheckoutRecoveryLead(recoveryEmail);
        trackEvent('checkout_recovery_email_opted_in', {
          tier: paidTier,
          source: checkoutSource,
          acquisition_source: checkoutAttribution?.source || 'unknown',
          shared_result: checkoutAttribution?.sharedResult || 'none',
          utm_campaign: checkoutAttribution?.utmCampaign || 'unknown',
          utm_source: checkoutAttribution?.utmSource || 'unknown',
          source_chain: checkoutAttribution?.sourceChain || 'none',
          has_logged_in_email: Boolean(user?.email),
          has_result_axis: Boolean(savedResultAxis),
          dominant_channel: savedResultAxis?.dominantChannel || 'unknown',
          inferior_channel: savedResultAxis?.inferiorChannel || 'unknown',
          reliability: savedResultAxis?.reliability || 'unknown',
        });
      } else if (checkoutRecoveryOptIn) {
        trackEvent('checkout_recovery_email_skipped', {
          tier: paidTier,
          source: checkoutSource,
          acquisition_source: checkoutAttribution?.source || 'unknown',
          has_logged_in_email: Boolean(user?.email),
          has_captured_email: Boolean(capturedEmail),
          has_result_axis: Boolean(savedResultAxis),
        });
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tier: paidTier,
          source: checkoutSource,
          attribution: checkoutAttribution,
          customerEmail: recoveryEmail,
          recoveryEmailOptIn: shouldUseSiteRecoveryConsent,
          anonymousId: getFunnelAnonymousId(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to start checkout');
      }

      if (!data.url) {
        throw new Error('Stripe did not return a checkout URL');
      }

      writePendingCheckout({
        tier: paidTier,
        url: data.url,
        sessionId:
          typeof data.sessionId === 'string' ? data.sessionId : undefined,
        expiresAt:
          typeof data.expiresAt === 'number' ||
          typeof data.expiresAt === 'string'
            ? data.expiresAt
            : undefined,
        source: checkoutSource,
        attribution: checkoutAttribution,
      });
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      checkoutOpeningRef.current = false;
      setIsOpeningStripe(false);
    }
  }, [
    capturedEmail,
    checkoutAttribution,
    checkoutRecoveryEmail,
    checkoutRecoveryOptIn,
    finalPriceLabel,
    paidTier,
    rememberCheckoutRecoveryEmail,
    savedResultAxis,
    sendCheckoutRecoveryLead,
    tierPrice,
    user?.email,
  ]);

  const handleCheckoutActionClick = useCallback(() => {
    trackEvent('checkout_direct_stripe_clicked', {
      source: 'checkout_primary_button',
      tier: paidTier || 'unknown',
      has_prefilled_email: hasCheckoutEmail,
      recovery_opted_in: checkoutRecoveryOptIn,
    });
    void startStripeCheckout();
  }, [checkoutRecoveryOptIn, hasCheckoutEmail, paidTier, startStripeCheckout]);

  const checkoutEmailCard = (
    <details className="mt-5 border-t border-jung-border pt-3">
      <summary className="cursor-pointer py-2 text-xs font-medium text-jung-secondary">
        Email me a link to return later (optional)
      </summary>
      <label
        htmlFor="checkout-recovery-email"
        className="mt-3 block text-xs font-medium"
      >
        Email address
      </label>
      <input
        ref={checkoutEmailInputRef}
        id="checkout-recovery-email"
        type="email"
        autoComplete="email"
        value={checkoutRecoveryEmail}
        onChange={(event) => {
          setCheckoutRecoveryEmail(event.target.value);
          setCheckoutRecoverySaveStatus('idle');
          setRecoveryEmailError(null);
        }}
        placeholder="you@example.com"
        aria-invalid={Boolean(recoveryEmailError)}
        aria-describedby={
          recoveryEmailError ? 'checkout-recovery-email-error' : undefined
        }
        className="mt-2 h-11 w-full rounded-lg border border-jung-border bg-jung-surface px-3 text-sm"
      />
      <label className="mt-3 flex gap-3 text-xs leading-5 text-jung-secondary">
        <input
          type="checkbox"
          checked={checkoutRecoveryOptIn}
          onChange={(event) => setCheckoutRecoveryOptIn(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-jung-accent"
        />
        Email me my result link and reminders about this optional report.
      </label>
      {checkoutRecoveryOptIn && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full"
          onClick={() => void saveCheckoutRecoveryPath('checkout_email_card')}
          disabled={checkoutRecoverySaveStatus === 'saving'}
        >
          {checkoutRecoverySaveStatus === 'saving'
            ? 'Sending…'
            : checkoutRecoverySaveStatus === 'saved'
              ? 'Link sent'
              : 'Send my return link'}
        </Button>
      )}
      {recoveryEmailError && (
        <p
          id="checkout-recovery-email-error"
          role="alert"
          className="mt-2 text-xs leading-5 text-error"
        >
          {recoveryEmailError}
        </p>
      )}
      <p className="mt-3 text-xs leading-5 text-jung-muted">
        Stripe collects your receipt email during payment. This extra email is
        optional.
      </p>
    </details>
  );

  if (!paidTier || !checkoutDetails || !tierPrice) {
    return null;
  }

  if (!hasLocalResults) {
    return (
      <div className="min-h-screen bg-jung-base">
        <section className="section-rule py-8 sm:py-10">
          <div className="mx-auto w-full max-w-[960px] px-4 sm:px-8">
            <Link
              to="/pricing"
              className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-jung-secondary transition-colors hover:text-jung-accent"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to pricing
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[960px] px-4 py-12 sm:px-8 lg:py-16">
          <div className="rounded-lg border border-jung-border bg-jung-surface p-6 shadow-sm sm:p-9">
            <div className="inline-flex items-center gap-2 rounded-lg border border-jung-accent-muted bg-jung-accent-light px-3 py-1.5 text-xs font-semibold text-jung-accent">
              <ShieldCheck className="h-4 w-4" />
              Free map needed first
            </div>
            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
              <div>
                <h1 className="text-display text-4xl text-jung-dark sm:text-5xl">
                  Take the assessment before paying for{' '}
                  {checkoutDetails.packageName}.
                </h1>
                <p className="mt-5 max-w-2xl text-body-lg text-jung-secondary">
                  The paid report is built from your TypeJung result. Complete
                  the free 42-question map first, then the{' '}
                  {PRICING[paidTier].name} upgrade stays selected if the result
                  feels worth keeping.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button
                    variant="accent"
                    size="lg"
                    onClick={startAssessmentFirst}
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Start free assessment
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={viewSampleReport}
                    leftIcon={<FileText className="h-5 w-5" />}
                  >
                    View sample report
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-jung-border bg-jung-base p-5">
                <p className="text-label">Selected upgrade</p>
                <h2 className="mt-3 text-heading text-2xl text-jung-dark">
                  {checkoutDetails.packageName}
                </h2>
                <p className="mt-3 text-sm leading-6 text-jung-secondary">
                  {checkoutDetails.headline}
                </p>
                <div className="mt-5 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4">
                  <p className="text-sm font-semibold text-jung-dark">
                    {EMAIL_CAPTURE_OFFER.code} price:{' '}
                    {discountedPriceLabel(PRICING[paidTier].amount)}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-jung-secondary">
                    One-time CAD purchase after your free result. No
                    subscription.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8">
        <p className="journey-eyebrow">One last look</p>
        <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
          Your map. A deeper understanding.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-jung-secondary">
          Add {checkoutDetails.packageName} to the result you have already
          completed.
        </p>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_23rem] lg:gap-14">
        <div>
          {savedResultAxis && (
            <div className="rounded-xl bg-jung-accent-light p-5 sm:p-6">
              <p className="journey-eyebrow">Based on your saved map</p>
              <p className="mt-3 font-display text-2xl text-jung-accent">
                {savedResultAxis.dominantLabel}
              </p>
              <p className="mt-2 text-sm leading-6 text-jung-secondary">
                With {savedResultAxis.inferiorLabel.toLowerCase()} as your
                growth edge.
              </p>
              <Link
                to="/results"
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-jung-accent underline underline-offset-4"
              >
                Read my free map <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
          <h2 className="mt-7 font-display text-2xl">What you will receive</h2>
          <ul className="mt-5 space-y-4">
            {checkoutDetails.includes.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm leading-6 text-jung-secondary"
              >
                <Check className="mt-1 h-4 w-4 shrink-0 text-jung-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-6 text-jung-muted">
            Your interpretation is generated by AI from your assessment result.
            Use it for self-reflection and compare it with your experience.
          </p>
          <Button
            variant="ghost"
            className="mt-2 !px-0"
            onClick={viewSampleReport}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Read the sample report
          </Button>
          <details className="mt-5 border-t border-jung-border">
            <summary className="cursor-pointer py-4 text-sm font-medium">
              What happens after I pay?
            </summary>
            <p className="pb-4 text-sm leading-7 text-jung-secondary">
              Stripe returns you to TypeJung to generate your report. Keep this
              browser's saved map and your receipt. Sign in with the purchase
              email to restore paid access on another device. Contact support if
              you need help.
            </p>
          </details>
        </div>
        <aside className="order-first rounded-2xl border border-jung-border bg-jung-surface p-6 shadow-lg sm:p-7 lg:order-none">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-2xl">
              {checkoutDetails.packageName}
            </h2>
            <FileText className="mt-1 h-5 w-5 shrink-0 text-jung-accent" />
          </div>
          <p className="mt-5 font-display text-5xl">{finalPriceLabel}</p>
          <p className="mt-2 text-sm text-jung-muted">
            One payment · Canadian dollars
          </p>
          <div className="mt-5 space-y-2 border-y border-jung-border py-4 text-xs text-jung-secondary">
            <p className="flex justify-between gap-3">
              <span>Regular price</span>
              <span>{tierPrice.price}</span>
            </p>
            <p className="flex justify-between gap-3">
              <span>{EMAIL_CAPTURE_OFFER.percentOff}% offer applied</span>
              <span>
                −{formatCadAmount(discountSavingsAmount(tierPrice.amount))}
              </span>
            </p>
            <p className="flex justify-between gap-3 font-semibold text-jung-dark">
              <span>Report total</span>
              <span>{finalPriceLabel}</span>
            </p>
          </div>
          {returnedFromStripe && (
            <p
              className="mt-4 rounded-lg bg-jung-accent-light p-3 text-xs leading-6 text-jung-secondary"
              role="status"
            >
              Payment was not completed. Your free map is still saved, and you
              can return whenever you are ready.
            </p>
          )}
          {error && (
            <div
              id="checkout-error"
              className="mt-5 rounded-lg border border-error/20 bg-error/5 p-4 text-sm leading-6 text-error"
              role="alert"
            >
              <p>{error}</p>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="mt-2 inline-flex min-h-11 items-center font-medium underline underline-offset-4"
              >
                Contact support
              </a>
            </div>
          )}
          <Button
            variant="accent"
            size="lg"
            className="mt-5 w-full"
            onClick={handleCheckoutActionClick}
            disabled={isOpeningStripe}
            rightIcon={
              isOpeningStripe ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )
            }
          >
            {isOpeningStripe
              ? 'Checking availability…'
              : error
                ? 'Try checkout again'
                : 'Continue to payment'}
          </Button>
          <p className="mt-3 text-center text-xs leading-5 text-jung-muted">
            Secure payment with Stripe. Review the final total before paying.
          </p>
          <p className="mt-5 flex items-center gap-2 text-xs text-jung-secondary">
            <ShieldCheck className="h-4 w-4 shrink-0 text-jung-accent" />
            No subscription. 7-day refund policy.
          </p>
          <p className="mt-2 text-xs leading-6 text-jung-muted">
            If the report is not useful, email{' '}
            <a
              className="underline underline-offset-2"
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              support
            </a>{' '}
            within 7 days with your receipt.
          </p>
          {checkoutEmailCard}
        </aside>
      </div>
    </div>
  );
};
