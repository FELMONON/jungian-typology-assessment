import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Copy, CreditCard, FileText, Loader2, Lock, Mail, RefreshCcw, ShieldCheck, Tag } from 'lucide-react';
import { TypeJungMark } from '../components/brand/TypeJungMark';
import { DiscountCaptureCard } from '../components/discount/DiscountCaptureCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/use-auth';
import { useSEO } from '../hooks/useSEO';
import { AnalyticsEvents, getFunnelAnonymousId, trackEvent } from '../lib/analytics';
import { captureAcquisitionSourceFromLocation, pathWithSource, sourceForCheckout } from '../lib/acquisition-source';
import { ATTITUDE_LABELS, FUNCTION_LABELS } from '../data/depthAssessment';
import { isPaidTierId, PRICING } from '../data/pricing';
import type { PaidTierId } from '../data/pricing';
import { discountedAmount, discountedPriceLabel, discountSavingsAmount, EMAIL_CAPTURE_OFFER, formatCadAmount } from '../data/discount';
import { SUPPORT_EMAIL } from '../data/support';
import { writePendingCheckout } from '../lib/pending-checkout';
import { writeUpgradeIntent } from '../lib/upgrade-intent';
import { STORAGE_KEYS } from '../lib/validation';
import { DepthAssessmentResult, isDepthAssessmentResult } from '../utils/depthScoring';

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
    headline: 'Get the ten-section interpretation behind the free map you just saw.',
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
      { title: 'Grip sequence and recovery', body: 'A separate read of early pressure signals, escalation, and the grounded move that can restore choice.' },
      { title: 'Relationship and work patterns', body: 'Two distinct sections for conflict, repair, feedback, pacing, and the conditions that strain your weaker channel.' },
      { title: 'Shadow and growth prompts', body: 'Archetypal, shadow, individuation, growth, and dream-reflection sections that go beyond the free hierarchy.' },
    ],
    nextStep: 'Stripe handles payment securely in one step. After checkout, return to TypeJung and sign in with the purchase email if prompted so the ten-section report can be attached to your account.',
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
      { title: 'AI Type Guide', body: 'Follow-up questions about the result, with reflection prompts grounded in your mapped stack.' },
      { title: 'Individuation roadmap', body: 'A practice sequence for using the report after the first read-through.' },
      { title: 'Tracking over time', body: 'Reassessment context so later maps can be compared against the current one.' },
    ],
    nextStep: 'Stripe handles payment securely. After checkout, return to TypeJung and sign in with the purchase email if prompted so Mastery features can be enabled on your account.',
  },
};

const DISCOUNT_CAPTURE_STORAGE_KEY = 'typejung_discount_capture';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const APPROX_USD_PRICE: Record<PaidTierId, string> = {
  insight: 'US$7',
  mastery: 'US$21',
};
const APPROX_DISCOUNTED_USD_PRICE: Record<PaidTierId, string> = {
  insight: 'US$5',
  mastery: 'US$15',
};

const readCapturedDiscountEmail = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    const saved = JSON.parse(localStorage.getItem(DISCOUNT_CAPTURE_STORAGE_KEY) || '{}');
    const email = typeof saved.email === 'string' ? saved.email.trim().toLowerCase() : '';
    return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : null;
  } catch {
    return null;
  }
};

const readSavedDepthResult = (): DepthAssessmentResult | null => {
  if (typeof window === 'undefined') return null;

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || 'null');
    return isDepthAssessmentResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tier } = useParams<{ tier: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const paidTier = isPaidTierId(tier) ? tier : null;
  const [isOpeningStripe, setIsOpeningStripe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountCopyStatus, setDiscountCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [capturedEmail] = useState(readCapturedDiscountEmail);
  const [checkoutRecoveryEmail, setCheckoutRecoveryEmail] = useState(() => capturedEmail || '');
  const [checkoutRecoveryOptIn, setCheckoutRecoveryOptIn] = useState(false);
  const [showRecoveryEmailControls, setShowRecoveryEmailControls] = useState(false);
  const checkoutAxisTrackedRef = useRef<string | null>(null);
  const checkoutOpeningRef = useRef(false);
  const checkoutEmailInputRef = useRef<HTMLInputElement>(null);
  const [recoveryEmailError, setRecoveryEmailError] = useState<string | null>(null);
  const [checkoutRecoverySaveStatus, setCheckoutRecoverySaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [savedDepthResult] = useState(readSavedDepthResult);
  const hasLocalResults = Boolean(savedDepthResult);
  const returnedFromStripe = new URLSearchParams(location.search).get('checkout') === 'cancelled';
  const acquisition = useMemo(() => {
    if (typeof window === 'undefined') return null;

    const path = `${location.pathname}${location.search}${location.hash}`;
    return captureAcquisitionSourceFromLocation(location.search, path, document.referrer);
  }, [location.hash, location.pathname, location.search]);
  const acquisitionSource = acquisition?.source || null;
  const checkoutAttribution = useMemo(() => acquisition ? {
    source: acquisition.source,
    ref: acquisition.ref,
    utmCampaign: acquisition.utmCampaign,
    utmSource: acquisition.utmSource,
    sharedResult: acquisition.sharedResult,
    parentSource: acquisition.parentSource,
    sourceChain: acquisition.sourceChain,
  } : undefined, [
    acquisition?.source,
    acquisition?.ref,
    acquisition?.utmCampaign,
    acquisition?.utmSource,
    acquisition?.sharedResult,
    acquisition?.parentSource,
    acquisition?.sourceChain,
  ]);

  const checkoutDetails = paidTier ? CHECKOUT_DETAILS[paidTier] : null;
  const tierPrice = paidTier ? PRICING[paidTier] : null;
  const savedResultAxis = useMemo(() => {
    if (!savedDepthResult) return null;

    const inferiorPosition = savedDepthResult.hierarchy.find((item) => item.position === 'inferior');
    return {
      dominantLabel: `${ATTITUDE_LABELS[savedDepthResult.attitude.dominant]} ${FUNCTION_LABELS[savedDepthResult.dominant]}`,
      inferiorLabel: `${ATTITUDE_LABELS[inferiorPosition?.attitude ?? 'extraverted']} ${FUNCTION_LABELS[savedDepthResult.inferior]}`,
      dominantChannel: savedDepthResult.dominant,
      inferiorChannel: savedDepthResult.inferior,
      reliability: savedDepthResult.reliability.label,
    };
  }, [savedDepthResult]);
  const acquisitionTrace = [
    acquisitionSource,
    checkoutAttribution?.source,
    checkoutAttribution?.parentSource,
    checkoutAttribution?.sourceChain,
  ].filter(Boolean).join('>');
  const cameFromDevelopmentalEdge = acquisitionTrace.includes('results_premium_preview_developmental_edge');
  const cameFromMobileSticky = acquisitionTrace.includes('results_mobile_sticky');
  const checkoutContextCallout = useMemo(() => {
    if (!paidTier) return null;

    const axisPhrase = savedResultAxis
      ? `${savedResultAxis.dominantLabel} to ${savedResultAxis.inferiorLabel}`
      : 'your saved result axis';

    if (paidTier === 'insight' && cameFromDevelopmentalEdge) {
      return {
        eyebrow: 'Developmental edge selected',
        title: 'You are unlocking the edge behind this exact result.',
        body: `You clicked from the developmental-edge preview, so Insight opens the full ${axisPhrase} edge first, then connects it to stress signals, relationship repair, and practice prompts.`,
        bullets: [
          'Full edge interpretation first',
          'Stress map tied to that edge',
          'Practice prompts for this week',
        ],
      };
    }

    if (paidTier === 'insight' && cameFromMobileSticky) {
      return {
        eyebrow: 'Result path continued',
        title: 'You are still buying the report for the map saved in this browser.',
        body: `The mobile unlock button brought you here from the results page. Stripe is only the payment step; the report stays attached to the ${axisPhrase} map.`,
        bullets: [
          'Review the exact price here',
          'Pay once on Stripe',
          'Return to unlock the saved result',
        ],
      };
    }

    return null;
  }, [cameFromDevelopmentalEdge, cameFromMobileSticky, paidTier, savedResultAxis]);

  useEffect(() => {
    if (!checkoutRecoveryEmail && user?.email) {
      setCheckoutRecoveryEmail(user.email);
      setShowRecoveryEmailControls(false);
    }
  }, [checkoutRecoveryEmail, user?.email]);

  // Auto-focus the email input when the page mounts and no email is pre-captured.
  // Reduces friction for users who arrive without a saved email.
  useEffect(() => {
    if (!capturedEmail && !user?.email && showRecoveryEmailControls) {
      const timer = window.setTimeout(() => {
        checkoutEmailInputRef.current?.focus();
      }, 350);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useSEO({
    title: checkoutDetails ? `Checkout - ${checkoutDetails.packageName} | TypeJung` : 'Checkout | TypeJung',
    description: 'Review your TypeJung order before continuing to secure Stripe payment.',
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
  }, [acquisition?.parentSource, acquisition?.ref, acquisition?.sharedResult, acquisition?.sourceChain, acquisition?.utmCampaign, acquisition?.utmSource, acquisitionSource, hasLocalResults, navigate, paidTier, returnedFromStripe]);

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
  }, [acquisition?.utmCampaign, acquisition?.utmSource, acquisitionSource, paidTier, savedDepthResult, savedResultAxis]);

  const orderRows = useMemo(() => {
    if (!tierPrice || !checkoutDetails) return [];

    return [
      ['Subtotal', tierPrice.price],
      [`${EMAIL_CAPTURE_OFFER.code} (${EMAIL_CAPTURE_OFFER.percentOff}% off)`, `-${formatCadAmount(discountSavingsAmount(tierPrice.amount))}`],
      ['After code', formatCadAmount(discountedAmount(tierPrice.amount))],
    ];
  }, [checkoutDetails, tierPrice]);

  const recoveryEmailPreview = checkoutRecoveryEmail.trim() || user?.email || capturedEmail || '';
  const checkoutEmailCandidate = recoveryEmailPreview.trim();
  const hasCheckoutEmail = EMAIL_PATTERN.test(checkoutEmailCandidate.toLowerCase());
  const checkoutEmailDisplay = hasCheckoutEmail ? checkoutEmailCandidate : '';
  const checkoutEmailCardTitle = hasCheckoutEmail
    ? checkoutRecoverySaveStatus === 'saved' ? 'Optional recovery saved' : 'Optional recovery email ready'
    : checkoutEmailCandidate ? 'Fix optional recovery email' : 'Optional recovery email';
  const checkoutEmailCardDescription = hasCheckoutEmail
    ? checkoutRecoverySaveStatus === 'saved'
      ? 'TypeJung saved the result axis, discount code, and checkout path so this session can be recovered if Stripe expires.'
      : `You can email yourself the ${EMAIL_CAPTURE_OFFER.code} backup and this result path before Stripe. This is optional and never blocks payment.`
    : checkoutEmailCandidate
      ? 'That email is not valid yet. Fix it only if you want the optional recovery link.'
      : 'Stripe collects the receipt email on the next screen. Add one here only if you also want TypeJung to save a recovery path before payment.';
  const checkoutEmailStatusLabel = hasCheckoutEmail
    ? checkoutRecoverySaveStatus === 'saved' ? 'Saved' : 'Optional'
    : checkoutEmailCandidate ? 'Fix email' : 'Optional';
  const checkoutHandoffItems = [
    {
      icon: CreditCard,
      label: 'Stripe receipt',
      body: (
        <>
          Prefilled to <span className="break-all font-semibold text-jung-dark">{checkoutEmailDisplay}</span>.
        </>
      ),
    },
    {
      icon: FileText,
      label: 'Report unlock',
      body: 'Return from Stripe to unlock this saved result.',
    },
    {
      icon: checkoutRecoveryOptIn ? RefreshCcw : Lock,
      label: checkoutRecoveryOptIn ? 'Recovery link' : 'Recovery off',
      body: checkoutRecoveryOptIn
        ? 'One TypeJung link if checkout expires.'
        : 'Stripe still gets the receipt email.',
    },
  ] as const;
  const finalPriceLabel = tierPrice ? discountedPriceLabel(tierPrice.amount) : '';
  const paymentButtonText = finalPriceLabel ? `Continue to Stripe - ${finalPriceLabel}` : 'Continue to Stripe';
  const mobilePaymentButtonText = isOpeningStripe
    ? 'Opening'
    : finalPriceLabel ? `Pay ${finalPriceLabel}` : 'Pay';
  const checkoutSteps = [
    {
      icon: Check,
      label: 'Map',
      caption: 'Ready',
      state: 'complete',
    },
    {
      icon: CreditCard,
      label: 'Stripe',
      caption: 'Payment',
      state: 'active',
    },
    {
      icon: FileText,
      label: 'Unlock',
      caption: 'Report',
      state: 'pending',
    },
  ] as const;
  const mobileStickyHint = `${EMAIL_CAPTURE_OFFER.code} applied. Stripe collects the receipt email.`;

  const copyDiscountCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_CAPTURE_OFFER.code);
      setDiscountCopyStatus('copied');
      trackEvent('checkout_discount_code_copied', {
        tier: paidTier || 'unknown',
        percent_off: EMAIL_CAPTURE_OFFER.percentOff,
      });
      window.setTimeout(() => setDiscountCopyStatus('idle'), 1800);
    } catch {
      setDiscountCopyStatus('idle');
    }
  }, [paidTier]);

  const rememberCheckoutRecoveryEmail = useCallback((email: string) => {
    if (!paidTier) return;

    try {
      localStorage.setItem(DISCOUNT_CAPTURE_STORAGE_KEY, JSON.stringify({
        email,
        discountCode: EMAIL_CAPTURE_OFFER.code,
        capturedAt: new Date().toISOString(),
        source: 'checkout_recovery_prestripe',
        tierIntent: paidTier,
      }));
    } catch {
      // Non-critical persistence.
    }
  }, [paidTier]);

  const sendCheckoutRecoveryLead = useCallback(async (email: string): Promise<boolean> => {
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
          parentSource: checkoutAttribution?.parentSource || checkoutAttribution?.source,
          sourceChain: checkoutAttribution?.sourceChain,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        trackEvent('checkout_recovery_lead_failed', {
          tier: paidTier,
          status: response.status,
          reason: typeof data?.error === 'string' ? data.error : 'request_failed',
        });
        return false;
      }

      trackEvent('checkout_recovery_lead_captured', {
        tier: paidTier,
        captured: Boolean(data?.captured),
        email_sent: Boolean(data?.sent),
        capture_reason: typeof data?.captureReason === 'string' ? data.captureReason : 'unknown',
        skip_reason: typeof data?.reason === 'string' ? data.reason : 'none',
      });
      return true;
    } catch (error) {
      trackEvent('checkout_recovery_lead_failed', {
        tier: paidTier,
        status: 'network',
        reason: error instanceof Error ? error.message.substring(0, 120) : 'network_error',
      });
      // Checkout recovery capture is best-effort; Stripe should still open.
      return false;
    }
  }, [
    checkoutAttribution?.parentSource,
    checkoutAttribution?.source,
    checkoutAttribution?.sourceChain,
    checkoutAttribution?.utmCampaign,
    checkoutAttribution?.utmSource,
    paidTier,
    savedResultAxis?.dominantLabel,
    savedResultAxis?.inferiorLabel,
  ]);

  const saveCheckoutRecoveryPath = useCallback(async (source: string) => {
    if (!paidTier) return false;

    const email = checkoutEmailCandidate.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(email)) {
      setShowRecoveryEmailControls(true);
      setRecoveryEmailError('Enter a valid email address before Stripe.');
      window.requestAnimationFrame(() => {
        checkoutEmailInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    setRecoveryEmailError('The checkout path could not be emailed yet. You can still continue to Stripe.');
    return false;
  }, [
    checkoutAttribution?.source,
    checkoutAttribution?.utmCampaign,
    checkoutAttribution?.utmSource,
    checkoutEmailCandidate,
    paidTier,
    rememberCheckoutRecoveryEmail,
    savedResultAxis,
    sendCheckoutRecoveryLead,
  ]);

  const viewSampleReport = useCallback(() => {
    const destination = pathWithSource('/sample-report', 'checkout_sample_report');
    AnalyticsEvents.ctaClicked('view_sample_report', 'checkout_review', {
      buttonText: 'View sample report',
      destination,
    });
    navigate(destination);
  }, [navigate]);

  const startAssessmentFirst = useCallback(() => {
    if (!paidTier) return;

    const destination = pathWithSource('/assessment', 'checkout_without_result', { tier: paidTier });
    writeUpgradeIntent(paidTier, 'checkout_without_result');
    AnalyticsEvents.ctaClicked('start_assessment_before_checkout', 'checkout_without_result', {
      buttonText: 'Start free assessment',
      destination,
      tier: paidTier,
    });
    trackEvent('checkout_without_result_assessment_started', {
      tier: paidTier,
      acquisition_source: checkoutAttribution?.source || 'unknown',
      utm_campaign: checkoutAttribution?.utmCampaign || 'unknown',
      utm_source: checkoutAttribution?.utmSource || 'unknown',
      parent_source: checkoutAttribution?.parentSource || 'none',
      source_chain: checkoutAttribution?.sourceChain || 'none',
    });
    navigate(destination);
  }, [checkoutAttribution?.parentSource, checkoutAttribution?.source, checkoutAttribution?.sourceChain, checkoutAttribution?.utmCampaign, checkoutAttribution?.utmSource, navigate, paidTier]);

  const startStripeCheckout = useCallback(async () => {
    if (!paidTier || !tierPrice) return;
    if (checkoutOpeningRef.current) return;

    const checkoutSource = sourceForCheckout();
    const typedRecoveryEmail = checkoutRecoveryEmail.trim().toLowerCase();
    const validTypedRecoveryEmail = EMAIL_PATTERN.test(typedRecoveryEmail) ? typedRecoveryEmail : '';
    const checkoutCustomerEmail = validTypedRecoveryEmail || readCapturedDiscountEmail() || capturedEmail || user?.email || undefined;

    try {
      checkoutOpeningRef.current = true;
      setIsOpeningStripe(true);
      setError(null);
      setRecoveryEmailError(null);
      AnalyticsEvents.purchaseStarted(paidTier, tierPrice.amount);
      AnalyticsEvents.ctaClicked('continue_to_secure_payment', 'checkout_review', {
        buttonText: `Pay ${finalPriceLabel || tierPrice.price}`,
        destination: 'stripe_checkout',
      });

      const recoveryEmail = checkoutCustomerEmail;
      const shouldUseSiteRecoveryConsent = checkoutRecoveryOptIn && Boolean(recoveryEmail);

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
        sessionId: typeof data.sessionId === 'string' ? data.sessionId : undefined,
        expiresAt: typeof data.expiresAt === 'number' || typeof data.expiresAt === 'string' ? data.expiresAt : undefined,
        source: checkoutSource,
        attribution: checkoutAttribution,
      });
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      checkoutOpeningRef.current = false;
      setIsOpeningStripe(false);
    }
  }, [capturedEmail, checkoutAttribution, checkoutRecoveryEmail, checkoutRecoveryOptIn, finalPriceLabel, paidTier, rememberCheckoutRecoveryEmail, savedResultAxis, sendCheckoutRecoveryLead, tierPrice, user?.email]);

  const handleCheckoutActionClick = useCallback(() => {
    trackEvent('checkout_direct_stripe_clicked', {
      source: 'checkout_primary_button',
      tier: paidTier || 'unknown',
      has_prefilled_email: hasCheckoutEmail,
      recovery_opted_in: checkoutRecoveryOptIn,
    });
    void startStripeCheckout();
  }, [checkoutRecoveryOptIn, hasCheckoutEmail, paidTier, startStripeCheckout]);

  const handleMobilePaymentClick = useCallback(() => {
    trackEvent('checkout_direct_stripe_clicked', {
      source: 'checkout_mobile_sticky',
      tier: paidTier || 'unknown',
      has_prefilled_email: hasCheckoutEmail,
      recovery_opted_in: checkoutRecoveryOptIn,
    });
    void startStripeCheckout();
  }, [checkoutRecoveryOptIn, hasCheckoutEmail, paidTier, startStripeCheckout]);

  const checkoutEmailCard = (
    <div className="mt-5 rounded-lg border border-jung-border bg-jung-base p-4">
      <div className="flex gap-3">
        <Mail className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-jung-dark">
                {checkoutEmailCardTitle}
              </p>
              <p className="mt-1 text-xs leading-5 text-jung-secondary">
                {checkoutEmailCardDescription}
              </p>
            </div>
            <span className="rounded-lg bg-jung-accent-light px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-jung-accent">
              {checkoutEmailStatusLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowRecoveryEmailControls((value) => !value)}
            className="mt-3 text-xs font-semibold text-jung-accent hover:underline"
          >
            {showRecoveryEmailControls ? 'Hide recovery options' : hasCheckoutEmail ? 'Edit optional recovery' : 'Add optional recovery email'}
          </button>
        </div>
      </div>
      {showRecoveryEmailControls && (
        <div className="mt-3">
          <label className="sr-only" htmlFor="checkout-recovery-email">
            Optional recovery email
          </label>
          <input
            ref={checkoutEmailInputRef}
            id="checkout-recovery-email"
            type="email"
            value={checkoutRecoveryEmail}
            onChange={(event) => {
              setCheckoutRecoveryEmail(event.target.value);
              setCheckoutRecoverySaveStatus('idle');
              if (recoveryEmailError) setRecoveryEmailError(null);
            }}
            placeholder={user?.email || capturedEmail || 'you@example.com'}
            aria-invalid={Boolean(recoveryEmailError)}
            aria-describedby={recoveryEmailError ? 'checkout-recovery-email-error' : undefined}
            className="h-11 w-full rounded-lg border border-jung-border bg-jung-surface px-3 text-sm text-jung-dark outline-none transition focus:border-jung-accent focus:ring-2 focus:ring-jung-accent/20"
          />
          {recoveryEmailError && (
            <p id="checkout-recovery-email-error" className="mt-2 text-xs leading-5 text-error">
              {recoveryEmailError}
            </p>
          )}
          <label className="mt-3 flex items-start gap-3 text-xs leading-5 text-jung-secondary">
            <input
              type="checkbox"
              checked={checkoutRecoveryOptIn}
              onChange={(event) => {
                setCheckoutRecoveryOptIn(event.target.checked);
                if (!event.target.checked) setCheckoutRecoverySaveStatus('idle');
              }}
              className="mt-1 h-4 w-4 rounded border-jung-border text-jung-accent accent-jung-accent focus:ring-jung-accent"
            />
            <span>
              Optionally email me this result path and {EMAIL_CAPTURE_OFFER.code} backup before Stripe. Payment continues even when this is off.
            </span>
          </label>
          {checkoutRecoveryOptIn && hasCheckoutEmail && (
            <Button
              type="button"
              variant={checkoutRecoverySaveStatus === 'saved' ? 'secondary' : 'accent'}
              size="sm"
              className="mt-3 w-full"
              onClick={() => void saveCheckoutRecoveryPath('checkout_email_card')}
              disabled={checkoutRecoverySaveStatus === 'saving'}
              leftIcon={checkoutRecoverySaveStatus === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : checkoutRecoverySaveStatus === 'saved' ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            >
              {checkoutRecoverySaveStatus === 'saving'
                ? 'Saving result path'
                : checkoutRecoverySaveStatus === 'saved'
                  ? 'Result path saved'
                  : `Email my result path + ${EMAIL_CAPTURE_OFFER.code}`}
            </Button>
          )}
          {!checkoutRecoveryOptIn && (
            <p className="mt-2 text-xs leading-5 text-jung-muted">
              TypeJung recovery emails are off. Stripe will still receive this email for receipt and checkout prefill.
            </p>
          )}
        </div>
      )}
      {hasCheckoutEmail && (
        <div className="mt-4 border-t border-jung-border pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-jung-subtle">After Stripe</p>
          <div className="mt-2 grid gap-2">
            {checkoutHandoffItems.map(({ icon: Icon, label, body }) => (
              <div key={label} className="flex gap-2">
                <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-jung-dark">{label}</p>
                  <p className="mt-0.5 text-xs leading-5 text-jung-secondary">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="mt-3 text-[11px] leading-5 text-jung-muted">
        {hasCheckoutEmail
          ? 'Optional TypeJung recovery is ready. Payment is still one click.'
          : 'Stripe collects the receipt email on the next screen. No TypeJung recovery email is required.'}
      </p>
    </div>
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
                  Take the assessment before paying for {checkoutDetails.packageName}.
                </h1>
                <p className="mt-5 max-w-2xl text-body-lg text-jung-secondary">
                  The paid report is built from your TypeJung result. Complete the free 42-question map first, then the {PRICING[paidTier].name} upgrade stays selected if the result feels worth keeping.
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
                <h2 className="mt-3 text-heading text-2xl text-jung-dark">{checkoutDetails.packageName}</h2>
                <p className="mt-3 text-sm leading-6 text-jung-secondary">{checkoutDetails.headline}</p>
                <div className="mt-5 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4">
                  <p className="text-sm font-semibold text-jung-dark">
                    {EMAIL_CAPTURE_OFFER.code} price: {discountedPriceLabel(PRICING[paidTier].amount)}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-jung-secondary">
                    One-time CAD purchase after your free result. No subscription.
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
    <div className="min-h-screen bg-jung-base pb-28 lg:pb-0">
      <section className="section-rule py-8 sm:py-10">
        <div className="mx-auto w-full max-w-[1160px] px-4 sm:px-8">
          <Link
            to="/pricing"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-jung-secondary transition-colors hover:text-jung-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to pricing
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1160px] px-4 py-10 sm:px-8 lg:py-14">
        <div className="grid w-full max-w-full min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start">
          <div className="mx-auto min-w-0 w-full max-w-full rounded-lg border border-jung-border bg-jung-surface p-5 shadow-sm sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-lg border border-jung-border bg-jung-base px-3 py-2 text-sm font-semibold text-jung-secondary">
              <TypeJungMark size="xs" />
              TypeJung secure checkout
            </div>

            <h1 className="mt-6 max-w-3xl break-words text-display text-3xl text-jung-dark sm:text-5xl">
              Review {checkoutDetails.packageName} before Stripe.
            </h1>
            <p className="mt-5 max-w-2xl break-words text-body-lg text-jung-secondary">
              {checkoutDetails.headline}
            </p>
            <p className="mt-4 max-w-2xl break-words text-sm leading-7 text-jung-secondary">
              {checkoutDetails.description}
            </p>

            {checkoutContextCallout && (
              <div className="mt-6 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-5 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-lg bg-jung-surface px-3 py-1.5 text-xs font-semibold text-jung-accent">
                  <Lock className="h-3.5 w-3.5" />
                  {checkoutContextCallout.eyebrow}
                </div>
                <h2 className="mt-4 text-2xl font-semibold leading-tight text-jung-dark">
                  {checkoutContextCallout.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-jung-secondary">
                  {checkoutContextCallout.body}
                </p>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {checkoutContextCallout.bullets.map((bullet) => (
                    <div key={bullet} className="flex min-h-11 items-center gap-2 rounded-lg border border-jung-border bg-jung-surface px-3 py-2 text-xs font-semibold text-jung-secondary">
                      <Check className="h-3.5 w-3.5 flex-none text-jung-accent" />
                      <span className="min-w-0">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 rounded-lg border border-jung-dark bg-jung-dark p-5 text-white shadow-xl sm:p-6">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/55">Before Stripe</p>
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-2">
                    {tierPrice && (
                      <span className="text-lg font-medium text-white/45 line-through decoration-white/40">{tierPrice.price}</span>
                    )}
                    <span className="text-display text-4xl text-white sm:text-5xl">{finalPriceLabel}</span>
                    <span className="inline-flex items-center rounded-full bg-jung-accent px-2.5 py-1 text-xs font-semibold text-white">
                      {EMAIL_CAPTURE_OFFER.code} · {EMAIL_CAPTURE_OFFER.percentOff}% off
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-white/80">
                    One-time payment, not a subscription.{paidTier ? ` About ${APPROX_DISCOUNTED_USD_PRICE[paidTier]} on non-Canadian cards after the discount.` : ''}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Secure checkout via Stripe. Apple Pay, Google Pay, and Link appear when your browser supports them.
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/10 p-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 flex-none text-jung-subtle" />
                    <p className="text-sm font-semibold text-white">7-day money-back guarantee</p>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-white/65">
                    If the paid report does not feel useful, email {SUPPORT_EMAIL} with the Stripe receipt within 7 days for a full refund.
                  </p>
                  <p className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-5 text-white/50">
                    Educational self-reflection, not a clinical or diagnostic assessment.
                  </p>
                </div>
              </div>
              <ul className="mt-5 grid gap-3 text-sm leading-6 text-white/75 sm:grid-cols-2">
                {checkoutDetails.includes.slice(0, paidTier === 'insight' ? 4 : 5).map((item) => (
                  <li key={item} className="flex gap-3">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-jung-subtle" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {savedResultAxis && (
              <div className="mt-6 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-5 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-lg bg-jung-surface px-3 py-1.5 text-xs font-semibold text-jung-accent">
                  <FileText className="h-3.5 w-3.5" />
                  Built from your free map
                </div>
                <h2 className="mt-4 text-2xl font-semibold leading-tight text-jung-dark">
                  This report expands your {savedResultAxis.dominantLabel} to {savedResultAxis.inferiorLabel} axis.
                </h2>
                <p className="mt-3 text-sm leading-6 text-jung-secondary">
                  Stripe is only the payment step. The paid report stays tied to the free map already saved in this browser.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-jung-border bg-jung-surface p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">Dominant</p>
                    <p className="mt-1 text-sm font-semibold text-jung-dark">{savedResultAxis.dominantLabel}</p>
                  </div>
                  <div className="rounded-lg border border-jung-border bg-jung-surface p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">Growth edge</p>
                    <p className="mt-1 text-sm font-semibold text-jung-dark">{savedResultAxis.inferiorLabel}</p>
                  </div>
                  <div className="rounded-lg border border-jung-border bg-jung-surface p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">Signal</p>
                    <p className="mt-1 text-sm font-semibold text-jung-dark">{savedResultAxis.reliability}</p>
                  </div>
                </div>
              </div>
            )}

            {returnedFromStripe && (
              <div className="mt-6 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4">
                <div className="flex gap-3">
                  <RefreshCcw className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />
                  <div>
                    <p className="text-sm font-semibold text-jung-dark">Payment was not completed.</p>
                    <p className="mt-1 text-sm leading-6 text-jung-secondary">
                      Your {EMAIL_CAPTURE_OFFER.code} discount is still ready. Continue when you are ready, or view the sample report first.
                    </p>
                  </div>
                </div>
                <DiscountCaptureCard
                  source="checkout_cancel_return"
                  compact
                  minimal
                  dominantLabel={savedResultAxis?.dominantLabel}
                  inferiorLabel={savedResultAxis?.inferiorLabel}
                  preferredTier={paidTier}
                  showCheckoutButtons={false}
                  className="mt-4 border-t border-jung-accent-muted pt-4"
                />
              </div>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: CreditCard, label: 'One-time CAD', body: 'No subscription or renewal.' },
                { icon: ShieldCheck, label: 'Secure checkout via Stripe', body: 'You confirm payment on Stripe next.' },
                { icon: Lock, label: 'Private by default', body: 'Your result stays tied to your TypeJung access.' },
                { icon: RefreshCcw, label: '7-day guarantee', body: 'Contact support if the paid report is not useful.' },
              ].map(({ icon: Icon, label, body }) => (
                <div key={label} className="rounded-lg border border-jung-border bg-jung-base p-4">
                  <Icon className="h-4 w-4 text-jung-accent" />
                  <p className="mt-3 text-sm font-semibold text-jung-dark">{label}</p>
                  <p className="mt-1 text-xs leading-5 text-jung-muted">{body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-jung-border bg-jung-base p-5">
              <h2 className="text-lg font-semibold text-jung-dark">Included</h2>
              <ul className="mt-4 grid gap-3">
                {checkoutDetails.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-6 text-jung-secondary">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-lg border border-jung-border bg-jung-base p-5">
              <h2 className="text-lg font-semibold text-jung-dark">Preview modules</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {checkoutDetails.previewModules.map((module) => (
                  <div key={module.title} className="rounded-lg border border-jung-border bg-jung-surface p-4">
                    <p className="text-sm font-semibold text-jung-dark">{module.title}</p>
                    <p className="mt-2 text-xs leading-5 text-jung-secondary">{module.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-jung-border bg-jung-surface p-5">
              <p className="text-sm font-semibold text-jung-dark">What happens next</p>
              <p className="mt-2 text-sm leading-6 text-jung-secondary">{checkoutDetails.nextStep}</p>
            </div>
          </div>

          <aside className="order-first mx-auto min-w-0 w-full max-w-full rounded-lg border border-jung-border bg-jung-surface p-5 shadow-md sm:p-6 lg:sticky lg:top-28 lg:order-none">
            <p className="text-label">Order summary</p>
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg border border-jung-border bg-jung-base p-2 text-center">
              {checkoutSteps.map(({ icon: Icon, label, caption, state }) => (
                <div
                  key={label}
                  className={`rounded-lg border px-2 py-2 ${
                    state === 'complete'
                      ? 'border-jung-accent-muted bg-jung-accent-light'
                      : state === 'active'
                        ? 'border-jung-accent bg-jung-surface shadow-sm'
                        : 'border-transparent bg-jung-surface'
                  }`}
                >
                  <Icon className={`mx-auto h-4 w-4 ${state === 'pending' ? 'text-jung-muted' : 'text-jung-accent'}`} />
                  <p className="mt-1 text-[11px] font-semibold text-jung-secondary">{label}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-jung-muted">{caption}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-start justify-between gap-4 border-b border-jung-border pb-5">
              <div>
                <h2 className="text-heading text-2xl text-jung-dark">{checkoutDetails.packageName}</h2>
                <p className="mt-2 text-sm leading-6 text-jung-secondary">
                  One-time TypeJung upgrade
                </p>
                <p className="mt-1 text-xs leading-5 text-jung-muted">
                  {tierPrice.price} ≈ {APPROX_USD_PRICE[paidTier]} list price
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-jung-dark">{finalPriceLabel}</p>
                <p className="mt-1 text-xs text-jung-muted line-through">{tierPrice.price}</p>
              </div>
            </div>

            {checkoutContextCallout && (
              <div className="mt-5 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4 lg:hidden">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-accent">
                  {checkoutContextCallout.eyebrow}
                </p>
                <p className="mt-2 text-sm font-semibold leading-5 text-jung-dark">
                  {checkoutContextCallout.title}
                </p>
                <p className="mt-2 text-xs leading-5 text-jung-secondary">
                  Review the price here, then Stripe handles payment.
                </p>
              </div>
            )}

            <div className="mt-5 grid gap-3 border-b border-jung-border pb-5">
              {orderRows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 text-sm">
                  <span className={label === 'After code' ? 'font-semibold text-jung-dark' : 'text-jung-secondary'}>
                    {label}
                  </span>
                  <span className={label === 'After code' ? 'font-semibold text-jung-dark' : 'text-jung-secondary'}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <Button
              variant="accent"
              size="lg"
              className="mt-5 w-full"
              onClick={handleCheckoutActionClick}
              disabled={isOpeningStripe}
              rightIcon={!isOpeningStripe ? <ArrowRight className="h-5 w-5" /> : undefined}
            >
              {isOpeningStripe ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Opening Stripe
                </>
              ) : (
                paymentButtonText
              )}
            </Button>

            <p className="mt-3 text-center text-xs leading-5 text-jung-muted">
              One click opens secure Stripe. Stripe collects the receipt email and shows the discounted total before payment.
            </p>

            {checkoutEmailCard}

            <div className="mt-5 border-y border-jung-border py-5">
              <div className="flex gap-3">
                <Tag className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-jung-dark">
                    {EMAIL_CAPTURE_OFFER.code} is applied on Stripe for {EMAIL_CAPTURE_OFFER.percentOff}% off.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-jung-secondary">
                    Continue to Stripe and confirm the discounted total before payment. Copy the code only if Stripe asks for it.
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="flex min-h-11 min-w-0 items-center rounded-lg border border-jung-border bg-jung-base px-3 font-mono text-sm font-semibold tracking-[0.12em] text-jung-dark">
                      {EMAIL_CAPTURE_OFFER.code}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyDiscountCode}
                      leftIcon={discountCopyStatus === 'copied' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    >
                      {discountCopyStatus === 'copied' ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4">
              <div className="flex gap-3">
                <RefreshCcw className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />
                <p className="text-xs leading-5 text-jung-secondary">
                  If the paid report does not feel helpful, email {SUPPORT_EMAIL} within 7 days with your Stripe receipt.
                </p>
              </div>
            </div>

            {!authLoading && user?.email && (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-jung-accent-light px-4 py-3 text-sm text-jung-accent">
                <Mail className="h-4 w-4 flex-none" />
                <span className="min-w-0 truncate">Logged in as {user.email}</span>
              </div>
            )}

            {!authLoading && !user?.email && capturedEmail && (
              <div className="mt-4 flex items-center gap-3 rounded-lg bg-jung-accent-light px-4 py-3 text-sm text-jung-accent">
                <Mail className="h-4 w-4 flex-none" />
                <span className="min-w-0 truncate">Stripe email prefilled from {capturedEmail}</span>
              </div>
            )}

            {error && (
              <div className="mt-4 rounded-lg border border-error/20 bg-error/5 p-4 text-sm text-error" role="alert">
                {error}
              </div>
            )}

            <Button
              variant="secondary"
              size="md"
              className="mt-5 w-full"
              onClick={viewSampleReport}
              leftIcon={<FileText className="h-4 w-4" />}
            >
              View sample report
            </Button>

            <p className="mt-4 text-xs leading-5 text-jung-muted">
              Stripe may offer Link saved checkout. Choose Pay without Link on Stripe if you prefer to enter card details manually.
            </p>
          </aside>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-jung-border bg-jung-surface/95 shadow-[0_-12px_32px_rgba(41,28,18,0.14)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-screen-sm items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-jung-dark">
              {checkoutDetails.packageName} - {finalPriceLabel}
            </p>
            <p className="mt-0.5 text-xs leading-4 text-jung-muted">
              {mobileStickyHint}
            </p>
          </div>
          <Button
            variant="accent"
            size="sm"
            className="flex-none"
            onClick={handleMobilePaymentClick}
            disabled={isOpeningStripe}
            rightIcon={!isOpeningStripe ? <ArrowRight className="h-4 w-4" /> : undefined}
          >
            {mobilePaymentButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
