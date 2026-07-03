import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, CheckCircle, Copy, Loader2, XCircle, FileText, Layers, AlertTriangle, Heart, Briefcase, Compass, RefreshCcw, Download, Shield, Share2, Sparkles, type LucideIcon } from 'lucide-react';
import { TypeJungMark } from '../components/brand/TypeJungMark';
import { Button } from '../components/ui/Button';
import { isPaidTierId, PRICING, type PaidTierId } from '../data/pricing';
import { discountedAmount, formatCadAmount } from '../data/discount';
import { SUPPORT_EMAIL } from '../data/support';

const MASTERY_UPGRADE_LABEL = formatCadAmount(
  Math.round((discountedAmount(PRICING.mastery.amount) - discountedAmount(PRICING.insight.amount)) * 100) / 100,
);
import { FUNCTION_DESCRIPTIONS } from '../data/questions';
import { ATTITUDE_LABELS, FUNCTION_LABELS } from '../data/depthAssessment';
import { AnalyticsEvents, trackEvent } from '../lib/analytics';
import { pathWithSource } from '../lib/acquisition-source';
import { clearPendingCheckout } from '../lib/pending-checkout';
import { clearUpgradeIntent } from '../lib/upgrade-intent';
import { depthResultToLegacyAnalysisInput } from '../utils/depthCompatibility';
import { extractDepthResult } from '../utils/depthCompatibility';
import { DepthAssessmentResult } from '../utils/depthScoring';
import { useAuth } from '../hooks/use-auth';

const UNLOCKED_FEATURES = {
  insight: [
    { icon: FileText, text: 'Detailed TypeJung depth report' },
    { icon: Layers, text: 'Energy hierarchy and dominant-inferior axis' },
    { icon: AlertTriangle, text: 'Stress-pattern reflection' },
    { icon: Heart, text: 'Relationship-pattern reflection' },
    { icon: Briefcase, text: 'Work-pattern reflection prompts' },
    { icon: Compass, text: 'Practical reflection prompts' },
    { icon: Download, text: 'The Function Stack in Depth guide (PDF)' },
    { icon: RefreshCcw, text: 'Restore access by signing in with the purchase email' },
  ],
  mastery: [
    { icon: FileText, text: 'Everything in the Insight depth report' },
    { icon: Sparkles, text: 'AI Type Guide for follow-up reflection questions' },
    { icon: Compass, text: 'Individuation roadmap and practice plan' },
    { icon: AlertTriangle, text: 'Stress-pattern reflection' },
    { icon: Heart, text: 'Relationship-pattern reflection' },
    { icon: Briefcase, text: 'Work-pattern reflection prompts' },
    { icon: Download, text: 'The Function Stack in Depth guide (PDF)' },
    { icon: RefreshCcw, text: 'Restore access by signing in with the purchase email' },
  ],
} satisfies Record<PaidTierId, Array<{ icon: LucideIcon; text: string }>>;

const TYPE_DEPTH_GUIDE_URL = '/downloads/typejung-type-depth-guide.pdf';

const POST_PURCHASE_INVITE_GOAL = 3;
const POST_PURCHASE_CAMPAIGN = 'customer_referral';

type VerifySessionResponse = {
  paid?: boolean;
  product?: string;
  tier?: string;
  metadata?: {
    tier?: string;
  };
  transactionId?: string;
  amountPaid?: number | null;
  currency?: string | null;
  discountCode?: string | null;
  customerEmail?: string;
};

function purchaseTrackingKey(transactionId: string): string {
  return `jungian_assessment_purchase_tracked_${transactionId}`;
}

export const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [purchasedTier, setPurchasedTier] = useState<PaidTierId>('insight');
  const [isDebrief, setIsDebrief] = useState(false);
  const [debriefEmail, setDebriefEmail] = useState<string | null>(null);
  const [dominantFunction, setDominantFunction] = useState<string | null>(null);
  const [savedDepthResult, setSavedDepthResult] = useState<DepthAssessmentResult | null>(null);
  const [shareSlug, setShareSlug] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('jungian_assessment_share_slug');
  });
  const [isPreparingInvite, setIsPreparingInvite] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const startMasteryUpgrade = useCallback(async () => {
    setUpgrading(true);
    setUpgradeError(null);
    trackEvent('mastery_upgrade_clicked', { source: 'success_upsell' });
    try {
      const email = (typeof window !== 'undefined' && localStorage.getItem('jungian_assessment_customer_email')) || undefined;
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ product: 'mastery_upgrade', email, source: 'success_upsell' }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'Could not start the upgrade. Please try again.');
      }
      window.location.href = data.url;
    } catch (error) {
      setUpgradeError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      setUpgrading(false);
    }
  }, []);

  useEffect(() => {
    // Try multiple ways to get session_id (hash routing can be tricky)
    let sessionId = searchParams.get('session_id');

    // Fallback: parse from window.location.hash
    if (!sessionId) {
      const hash = window.location.hash;
      const match = hash.match(/session_id=([^&]+)/);
      if (match) {
        sessionId = match[1];
      }
    }

    // Fallback: parse from window.location.search
    if (!sessionId) {
      const urlParams = new URLSearchParams(window.location.search);
      sessionId = urlParams.get('session_id');
    }

    const savedResults = localStorage.getItem('jungian_assessment_results');
    if (savedResults) {
      try {
        const results = JSON.parse(savedResults);
        const depthResult = extractDepthResult(results);
        if (depthResult) {
          setSavedDepthResult(depthResult);
          setDominantFunction(FUNCTION_LABELS[depthResult.dominant]);
        } else if (results.stack?.dominant?.function) {
          setDominantFunction(results.stack.dominant.function);
        }
      } catch {
        // Failed to parse saved results
      }
    }

    if (!sessionId) {
      setStatus('error');
      setError('No session ID found');
      return;
    }
    const verifiedSessionId = sessionId;

    const verifySession = async () => {
      try {
        const response = await fetch('/api/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: verifiedSessionId })
        });
        const data = await response.json() as VerifySessionResponse;

        if (data.paid && data.product === 'debrief') {
          // Service purchase: no premium unlock, no referral prompt — just confirm.
          setIsDebrief(true);
          setDebriefEmail(data.customerEmail || null);
          clearPendingCheckout();
          setStatus('success');
          trackEvent('debrief_purchase_completed', {
            transaction_id: data.transactionId || verifiedSessionId,
          });
          return;
        }

        if (data.paid) {
          const verifiedTier = data.tier || data.metadata?.tier;
          const tier = isPaidTierId(verifiedTier) ? verifiedTier : 'insight';
          const transactionId = data.transactionId || verifiedSessionId;
          setPurchasedTier(tier);
          localStorage.setItem('jungian_assessment_tier', tier);
          localStorage.setItem('jungian_assessment_unlocked', 'true');
          localStorage.setItem('jungian_assessment_unlock_date', new Date().toISOString());
          localStorage.setItem('jungian_assessment_checkout_session_id', verifiedSessionId);
          localStorage.setItem('jungian_assessment_send_email', 'true');
          if (user?.id) {
            localStorage.setItem('jungian_assessment_unlock_user_id', user.id);
          }
          if (data.customerEmail) {
            localStorage.setItem('jungian_assessment_customer_email', data.customerEmail);
          }
          clearPendingCheckout();
          clearUpgradeIntent();
          if (tier === 'insight' || tier === 'mastery') {
            const trackingKey = purchaseTrackingKey(transactionId);
            if (localStorage.getItem(trackingKey) !== 'true') {
              const amountPaid = typeof data.amountPaid === 'number' && Number.isFinite(data.amountPaid)
                ? data.amountPaid
                : PRICING[tier].amount;
              const tracked = AnalyticsEvents.purchaseCompleted(
                tier,
                amountPaid,
                transactionId,
                typeof data.currency === 'string' ? data.currency : 'CAD',
              );
              if (tracked) {
                localStorage.setItem(trackingKey, 'true');
              }
            }
          }
          setStatus('success');
          trackEvent('post_purchase_referral_prompt_viewed', {
            tier,
            has_share_slug: Boolean(localStorage.getItem('jungian_assessment_share_slug')),
            has_result: Boolean(savedResults),
          });
        } else {
          setStatus('error');
          setError('Payment not completed');
        }
      } catch {
        setStatus('error');
        setError('Unable to verify payment right now. Please refresh or contact support with your Stripe receipt.');
      }
    };

    verifySession();
  }, [searchParams, navigate, user?.id]);

  const ensureShareSlug = useCallback(async (): Promise<string | null> => {
    if (shareSlug) return shareSlug;
    if (!savedDepthResult) return null;

    setIsPreparingInvite(true);

    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...depthResultToLegacyAnalysisInput(savedDepthResult),
          shareOnly: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'Failed to create share link');
      }

      const saved = await response.json();
      if (!saved?.shareSlug) {
        throw new Error('Share link was not returned');
      }

      localStorage.setItem('jungian_assessment_share_slug', saved.shareSlug);
      setShareSlug(saved.shareSlug);
      trackEvent('post_purchase_share_link_created', {
        source: 'checkout_success',
        has_result: true,
      });
      return saved.shareSlug;
    } catch (error) {
      console.error('Failed to create post-purchase share link:', error);
      return null;
    } finally {
      setIsPreparingInvite(false);
    }
  }, [savedDepthResult, shareSlug]);

  const copyCustomerInvite = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const nextShareSlug = await ensureShareSlug();
    const sharePath = nextShareSlug
      ? pathWithSource(`/share/${nextShareSlug}`, 'post_purchase_referral', {
        ref: 'customer_referral',
        utm_campaign: POST_PURCHASE_CAMPAIGN,
      })
      : pathWithSource('/assessment', 'post_purchase_referral', {
        ref: 'customer_referral',
        utm_campaign: POST_PURCHASE_CAMPAIGN,
      });
    const url = `${window.location.origin}${sharePath}`;
    const axisText = savedDepthResult
      ? `My TypeJung map came out as ${ATTITUDE_LABELS[savedDepthResult.attitude.dominant]} ${FUNCTION_LABELS[savedDepthResult.dominant]} to ${ATTITUDE_LABELS[savedDepthResult.hierarchy.find((item) => item.position === 'inferior')?.attitude ?? 'extraverted']} ${FUNCTION_LABELS[savedDepthResult.inferior]}.`
      : 'I used TypeJung to map the cognitive-function pattern behind my type.';
    const text = `${axisText} I kept the deeper report after the free map felt useful. Take the free assessment first and compare yours with mine: ${url}`;

    try {
      await navigator.clipboard.writeText(text);
      setInviteCopied(true);
      window.setTimeout(() => setInviteCopied(false), 2400);
      trackEvent('post_purchase_referral_copied', {
        source: 'checkout_success',
        has_share_slug: Boolean(nextShareSlug),
        invite_goal: POST_PURCHASE_INVITE_GOAL,
      });
    } catch (error) {
      console.error('Failed to copy post-purchase invite:', error);
    }
  }, [ensureShareSlug, savedDepthResult]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-jung-base px-4">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-jung-accent md:h-16 md:w-16" />
        <h1 className="mb-2 text-center text-heading text-2xl text-jung-dark">
          Verifying your payment...
        </h1>
        <p className="text-sm text-jung-secondary md:text-base">This usually takes a few seconds.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-jung-base px-4">
        <div className="mb-6 rounded-lg bg-error/5 p-4">
          <XCircle className="h-12 w-12 text-error md:h-16 md:w-16" />
        </div>
        <h1 className="mb-2 text-center text-heading text-2xl text-jung-dark">
          We could not verify the payment
        </h1>
        <p className="mb-6 max-w-md text-center text-sm text-jung-secondary md:text-base">{error || 'Unable to verify payment'}</p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={() => navigate('/results')} variant="primary">
            Back to Results
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isDebrief) {
    return (
      <div className="min-h-[60vh] bg-jung-base py-12">
        <div className="editorial-container mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent shadow-sm">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-heading text-4xl text-jung-dark">Your Personal Type Debrief is booked</h1>
          <p className="mx-auto mb-6 max-w-md text-sm leading-7 text-jung-secondary md:text-base">
            Thank you — your payment went through and your intake is in. I review each debrief personally and
            send your founder-reviewed breakdown within 72 hours{debriefEmail ? <> to <span className="font-semibold text-jung-dark">{debriefEmail}</span></> : ''}.
          </p>

          <div className="mb-8 rounded-lg border border-jung-border bg-jung-surface p-6 text-left shadow-sm">
            <h2 className="text-lg font-semibold text-jung-dark">What happens next</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-jung-secondary">
              <li className="flex items-start gap-3"><CheckCircle className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />I read your result, tested types, and where you feel stuck.</li>
              <li className="flex items-start gap-3"><CheckCircle className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />I record a 10-minute video or write a breakdown of your map, mistype risks, and stress edge.</li>
              <li className="flex items-start gap-3"><CheckCircle className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />It lands in your inbox within 72 hours. Reply any time with follow-up questions.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => navigate('/results')} variant="accent" size="lg">Back to my result</Button>
            <Button onClick={() => navigate('/')} variant="outline" size="lg">Return home</Button>
          </div>

          <p className="mt-8 text-xs text-jung-muted">
            Educational self-reflection, not a clinical or diagnostic assessment. Questions? Email {SUPPORT_EMAIL}.
          </p>
        </div>
      </div>
    );
  }

  const funcTitle = dominantFunction ? FUNCTION_DESCRIPTIONS[dominantFunction]?.title || dominantFunction : null;
  const unlockedFeatures = UNLOCKED_FEATURES[purchasedTier];

  return (
    <div className="min-h-[60vh] bg-jung-base py-12">
      <div className="editorial-container max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent shadow-sm">
            <CheckCircle className="h-8 w-8" />
          </div>

          <h1 className="mb-4 text-heading text-4xl text-jung-dark">
            Your report is unlocked
          </h1>

          {dominantFunction && funcTitle && (
            <p className="mb-3 text-lg font-medium text-jung-accent">
              Based on your <span className="font-bold">{funcTitle}</span> profile...
            </p>
          )}

          <div className="mb-4 flex items-center justify-center gap-2 text-jung-accent">
            <TypeJungMark size="xs" />
            <span className="font-medium">Premium access is active</span>
          </div>

          <p className="text-sm text-jung-muted">
            You can return to this unlocked result from this browser. Sign in with the purchase email to restore access across devices{purchasedTier === 'mastery' ? ' and use the AI Type Guide' : ''}.
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-jung-dark bg-jung-dark p-5 text-white shadow-lg sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
                Included with your report
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-white">
                The Function Stack in Depth
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                A field guide to all eight functions, the stack positions, the grip under stress,
                and how the pattern matures. Keep it next to your report.
              </p>
            </div>
            <a
              href={TYPE_DEPTH_GUIDE_URL}
              download
              onClick={() =>
                trackEvent('type_depth_guide_downloaded', {
                  source: 'checkout_success',
                  tier: purchasedTier,
                })
              }
              className="inline-flex min-h-12 flex-none items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-jung-dark transition hover:-translate-y-px hover:bg-jung-accent-light"
            >
              <Download className="h-4 w-4" />
              Download the guide (PDF)
            </a>
          </div>
        </div>

        {purchasedTier === 'insight' && (
          <div className="mb-8 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-jung-surface px-3 py-1.5 text-xs font-semibold text-jung-accent">
                  <Sparkles className="h-3.5 w-3.5" />
                  Upgrade to Mastery
                </div>
                <h2 className="text-heading text-2xl text-jung-dark">Keep working with your result for {MASTERY_UPGRADE_LABEL} more.</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-jung-secondary">
                  Add the AI Type Guide, individuation roadmap, growth exercises, and practice support. You only pay the difference from Insight.
                </p>
                {upgradeError && (
                  <p className="mt-2 text-sm font-medium text-error" role="alert">{upgradeError}</p>
                )}
              </div>
              <Button
                onClick={startMasteryUpgrade}
                disabled={upgrading}
                variant="accent"
                size="lg"
                className="flex-none"
                rightIcon={upgrading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              >
                {upgrading ? 'Starting checkout' : `Add Mastery — ${MASTERY_UPGRADE_LABEL}`}
              </Button>
            </div>
          </div>
        )}

        {!user && (
          <div className="mb-8 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-5">
            <h2 className="text-lg font-semibold text-jung-dark">Save the unlock to your account</h2>
            <p className="mt-2 text-sm leading-6 text-jung-secondary">
              Your Stripe receipt verifies the purchase in this browser. To keep access in history, restore it later{purchasedTier === 'mastery' ? ', and use the AI Type Guide' : ''}, sign in with the same email used at checkout.
            </p>
            <Button
              onClick={() => navigate('/auth')}
              variant="outline"
              className="mt-4"
            >
              Sign in with purchase email
            </Button>
          </div>
        )}

        <div className="mb-8 rounded-lg border border-jung-border bg-jung-surface p-6 shadow-md">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-jung-dark">
            <CheckCircle className="h-5 w-5 text-jung-accent" />
            What you unlocked
          </h2>

          <div className="space-y-4">
            {unlockedFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-jung-accent-light">
                    <Icon className="h-4 w-4 text-jung-accent" />
                  </div>
                  <span className="text-jung-secondary leading-relaxed">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <Button
            onClick={() => navigate('/results')}
            variant="accent"
            size="lg"
            className="flex-1"
          >
            <Compass className="mr-2 h-5 w-5" />
            View Your Complete Analysis
          </Button>
        </div>

        <div className="mb-8 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-jung-surface px-3 py-1.5 text-xs font-semibold text-jung-accent">
                <Share2 className="h-3.5 w-3.5" />
                Customer referral
              </div>
              <h2 className="text-heading text-2xl text-jung-dark">
                Invite {POST_PURCHASE_INVITE_GOAL} people who would compare maps with you.
              </h2>
              <p className="mt-3 text-sm leading-7 text-jung-secondary">
                The strongest time to share TypeJung is right after the free map earned enough trust to keep the deeper report. Your invite sends people to the free map first.
              </p>
            </div>
            <div className="grid gap-3">
              <Button
                variant="accent"
                size="lg"
                onClick={copyCustomerInvite}
                disabled={isPreparingInvite}
                leftIcon={isPreparingInvite ? <Loader2 className="h-4 w-4 animate-spin" /> : inviteCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              >
                {isPreparingInvite ? 'Preparing invite' : inviteCopied ? 'Invite copied' : 'Copy customer invite'}
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate('/results')}
              >
                Open results
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-jung-muted">
            <Shield className="h-4 w-4 text-jung-accent" />
            <span className="text-sm">30-Day Money-Back Guarantee</span>
          </div>
          <p className="text-xs text-jung-muted">
            Not insightful? Email {SUPPORT_EMAIL} within 30 days with your Stripe receipt.
          </p>
        </div>
      </div>
    </div>
  );
};
