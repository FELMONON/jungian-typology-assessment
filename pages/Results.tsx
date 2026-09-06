import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Copy, CreditCard, Download, FileText, Link2, Loader2, Lock, LogIn, RefreshCcw, Save, Share2, ShieldCheck, Sparkles } from 'lucide-react';
import { ChatBot } from '../components/ChatBot';
import { DiscountCaptureCard } from '../components/discount/DiscountCaptureCard';
import { Button } from '../components/ui/Button';
import { ATTITUDE_LABELS, AttitudeDirection, FUNCTION_LABELS, FunctionChannel, depthLayerMeta } from '../data/depthAssessment';
import { discountedPriceLabel, EMAIL_CAPTURE_OFFER } from '../data/discount';
import { readAssessmentIntent, INTENT_RESULT_FRAMING } from '../lib/assessment-intent';
import { PRICING, type PaidTierId } from '../data/pricing';
import { SUPPORT_EMAIL } from '../data/support';
import { useAiAnalysis, type AnalysisInput, type PremiumAnalysis } from '../hooks/use-ai-analysis';
import { useAuth } from '../hooks/use-auth';
import { usePremiumStatus } from '../hooks/use-premium-status';
import { AnalyticsEvents, getFunnelAnonymousId, trackEvent } from '../lib/analytics';
import { pathWithSource, readAcquisitionSource } from '../lib/acquisition-source';
import { createDirectCheckoutSession } from '../lib/direct-checkout';
import { writePendingCheckout } from '../lib/pending-checkout';
import { resultUpgradeContextFromSource } from '../lib/result-upgrade-context';
import { readUpgradeIntent } from '../lib/upgrade-intent';
import { depthResultToLegacyAnalysisInput } from '../utils/depthCompatibility';
import { DepthAssessmentResult, isDepthAssessmentResult } from '../utils/depthScoring';

const RESULTS_KEY = 'jungian_assessment_results';
const CHECKOUT_SESSION_KEY = 'jungian_assessment_checkout_session_id';
const LIFECYCLE_EMAIL_ENDPOINT = '/api/lifecycle-email';
const RESULT_READY_EMAIL_ATTEMPT_PREFIX = 'typejung_lifecycle_email_result_ready_';
const UPGRADE_EMAIL_DUE_PREFIX = 'typejung_lifecycle_email_upgrade_due_';
const UPGRADE_EMAIL_ATTEMPT_PREFIX = 'typejung_lifecycle_email_upgrade_';
const UPGRADE_EMAIL_DELAY_MS = 36 * 60 * 60 * 1000;
const PUBLIC_SHARE_SLUG_PREFIX = 'typejung_public_share_slug_';
const REFERRAL_INVITE_GOAL = 3;
const REFERRAL_INVITE_CAMPAIGN = 'friend_compare';
type InviteShareLocation = 'results_compare_banner' | 'results_invite_card';

const inviteSourceByLocation: Record<InviteShareLocation, string> = {
  results_compare_banner: 'result_compare_banner',
  results_invite_card: 'result_compare_card',
};

const upgradeOptions: Array<{
  tier: PaidTierId;
  label: string;
  description: string;
  features: string[];
  preview: string;
}> = [
  {
    tier: 'insight',
    label: 'Insight',
    description: 'Ten personalized interpretation sections that begin where the free score map stops.',
    features: [
      'Function dynamics and archetypal pattern',
      'Grip, relationship, and work reflections',
      'Shadow, individuation, growth, and dream prompts',
      '15-page Type Depth Guide (PDF)',
    ],
    preview: 'Adds ten distinct sections across function dynamics, grip and recovery, relationships, work, shadow, growth, individuation, and dream reflection.',
  },
  {
    tier: 'mastery',
    label: 'Mastery',
    description: 'The same ten-section report plus the AI Type Guide and ongoing practice tools.',
    features: ['Everything in Insight', 'AI Type Guide', 'Practice roadmap'],
    preview: 'Adds follow-up guide questions, tailored exercises, and a roadmap for working with the report over time.',
  },
];

const paidTierPrice = (tier: PaidTierId) => discountedPriceLabel(PRICING[tier].amount);

const premiumReportSectionConfig: Array<{ key: keyof PremiumAnalysis; title: string }> = [
  { key: 'overview', title: 'Pattern synthesis' },
  { key: 'functionAnalysis', title: 'Function dynamics' },
  { key: 'archetypes', title: 'Archetypal pattern' },
  { key: 'theGrip', title: 'Grip sequence and recovery' },
  { key: 'relationships', title: 'Relationship pattern and repair' },
  { key: 'career', title: 'Work conditions and friction' },
  { key: 'individuation', title: 'Individuation path' },
  { key: 'shadow', title: 'Shadow triggers and integration' },
  { key: 'growth', title: 'Growth practices' },
  { key: 'dreams', title: 'Dream reflection prompts' },
];

type ResultsState =
  | { status: 'loading' }
  | { status: 'no-results' }
  | { status: 'legacy' }
  | { status: 'ready'; results: DepthAssessmentResult };

const positionLabels = {
  dominant: 'Dominant',
  auxiliary: 'Auxiliary',
  tertiary: 'Tertiary',
  inferior: 'Inferior',
} as const;

const functionCodeByChannel: Record<FunctionChannel, Record<AttitudeDirection, string>> = {
  thinking: {
    introverted: 'Ti',
    extraverted: 'Te',
  },
  feeling: {
    introverted: 'Fi',
    extraverted: 'Fe',
  },
  sensation: {
    introverted: 'Si',
    extraverted: 'Se',
  },
  intuition: {
    introverted: 'Ni',
    extraverted: 'Ne',
  },
};

const getFunctionCode = (channel: FunctionChannel, attitude: AttitudeDirection) =>
  functionCodeByChannel[channel]?.[attitude] ?? 'unknown';

const formatDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return 'Recently completed';
  }
};

const readResults = (): ResultsState => {
  try {
    const raw = localStorage.getItem(RESULTS_KEY);
    if (!raw) return { status: 'no-results' };
    const parsed = JSON.parse(raw);
    if (isDepthAssessmentResult(parsed)) return { status: 'ready', results: parsed };
    return { status: 'legacy' };
  } catch {
    return { status: 'no-results' };
  }
};

const readCheckoutSessionId = (): string | undefined => {
  try {
    const value = localStorage.getItem(CHECKOUT_SESSION_KEY)?.trim();
    return value || undefined;
  } catch {
    return undefined;
  }
};

const postLifecycleEmail = async (body: Record<string, unknown>) => {
  try {
    const response = await fetch(LIFECYCLE_EMAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);
    return response.ok && !!data && (data.sent === true || data.skipped === true);
  } catch {
    return false;
  }
};

const EnergyBars: React.FC<{ results: DepthAssessmentResult }> = ({ results }) => (
  <div className="card-premium p-6 sm:p-8">
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-label">Energy distribution</p>
        <h2 className="mt-2 text-heading text-3xl text-jung-dark">Your function-stack map</h2>
      </div>
      <div className="rounded-lg bg-jung-accent-light px-3 py-2 text-sm font-semibold text-jung-accent">
        {results.reliability.score}% consistency
      </div>
    </div>

    <div className="space-y-5">
      {results.energy.map((item) => {
        const isDominant = item.channel === results.dominant;
        const isInferior = item.channel === results.inferior;

        return (
          <div key={item.channel}>
            <div className="mb-2 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-jung-dark">{item.label}</span>
                {isDominant && <span className="rounded-lg bg-jung-accent px-2 py-1 text-[11px] font-semibold text-white">Dominant</span>}
                {isInferior && <span className="rounded-lg border border-jung-border px-2 py-1 text-[11px] font-semibold text-jung-muted">Inferior</span>}
              </div>
              <span className="font-mono text-sm font-semibold text-jung-muted">{item.score}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-jung-border-light">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.score}%` }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full ${isInferior ? 'bg-jung-accent-muted' : 'bg-jung-accent'}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const Hierarchy: React.FC<{ results: DepthAssessmentResult }> = ({ results }) => (
  <div className="grid gap-4 lg:grid-cols-4">
    {results.hierarchy.map((item) => (
      <div key={item.position} className={`rounded-lg border p-5 ${item.position === 'dominant' ? 'border-jung-accent-muted bg-jung-accent-light/70' : 'border-jung-border bg-jung-surface'}`}>
        <p className="text-sm font-semibold text-jung-muted">{positionLabels[item.position]}</p>
        <h3 className="mt-3 text-2xl font-semibold text-jung-dark">{item.label}</h3>
        <p className="mt-2 text-sm leading-6 text-jung-secondary">
          {ATTITUDE_LABELS[item.attitude]} channel, {item.score}% of mapped energy.
        </p>
      </div>
    ))}
  </div>
);

const SignalGrid: React.FC<{ results: DepthAssessmentResult }> = ({ results }) => {
  const signals = useMemo(() => ([
    ['behavioral', results.layerSignals.behavioral ? FUNCTION_LABELS[results.layerSignals.behavioral as FunctionChannel] : 'Mixed'],
    ['inferior', results.layerSignals.inferior ? FUNCTION_LABELS[results.layerSignals.inferior as FunctionChannel] : FUNCTION_LABELS[results.inferior]],
    ['somatic', results.layerSignals.somatic ? FUNCTION_LABELS[results.layerSignals.somatic as FunctionChannel] : 'Mixed'],
    ['attitude', ATTITUDE_LABELS[results.attitude.dominant]],
  ] as const), [results]);

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {signals.map(([layer, value]) => {
        const meta = depthLayerMeta[layer as keyof typeof depthLayerMeta];
        return (
          <div key={layer} className="rounded-lg border border-jung-border bg-jung-surface p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">{meta.shortLabel}</p>
            <p className="mt-2 text-lg font-semibold text-jung-dark">{value}</p>
          </div>
        );
      })}
    </div>
  );
};

const LockedPremiumPreview: React.FC<{
  results: DepthAssessmentResult;
  dominantLabel: string;
  inferiorLabel: string;
  intendedTier: PaidTierId;
  onUnlock: (tier: PaidTierId, location: string) => void;
  onViewSampleReport: (location: string) => void;
  checkoutOpeningTier: PaidTierId | null;
  checkoutError: string | null;
}> = ({
  results,
  dominantLabel,
  inferiorLabel,
  intendedTier,
  onUnlock,
  onViewSampleReport,
  checkoutOpeningTier,
  checkoutError,
}) => {
  const primaryName = PRICING[intendedTier].name;
  const functionStackLabel = results.hierarchy
    .map((item) => getFunctionCode(item.channel, item.attitude))
    .join('-');
  const inferiorChannelLabel = FUNCTION_LABELS[results.inferior];
  const listPrice = PRICING[intendedTier].price;
  const offerPrice = paidTierPrice(intendedTier);
  const isOpeningCheckout = checkoutOpeningTier === intendedTier;
  const lockedSections = [
    {
      title: 'Grip sequence and recovery',
      eyebrow: `${inferiorChannelLabel} under pressure`,
      location: 'results_insight_grip_sequence',
      ctaLabel: `Get my full report - ${offerPrice}`,
      lockedLabel: 'Sequence locked',
      featured: true,
      proof: 'The report separates the first warning signal, the escalation pattern, and the recovery move instead of repeating your score map.',
      visibleLines: [
        `Your free map identifies ${inferiorLabel} as the developmental edge. Insight follows that edge through a concrete pressure sequence.`,
        `It shows what tends to happen before, during, and after the ${dominantLabel} pattern becomes overextended.`,
      ],
      lockedLines: [
        `Early signal: the specific shift in attention, body state, or interpretation that tends to arrive first.`,
        `Recovery move: one grounded action for restoring choice before the pattern hardens.`,
      ],
    },
    {
      title: 'Relationship and work patterns',
      eyebrow: 'Two real-life contexts',
      location: 'results_insight_relationship_work',
      ctaLabel: `Get the applied patterns - ${offerPrice}`,
      lockedLabel: 'Applied patterns locked',
      featured: false,
      proof: 'Two separate sections translate the same axis into conflict, repair, feedback, pacing, and work conditions.',
      visibleLines: [
        `The relationship section looks at where ${inferiorLabel} pressure can create overreading, withdrawal, control, or repair attempts.`,
        `The work section looks at where ${dominantLabel} has room to operate and where the environment repeatedly strains the weaker channel.`,
      ],
      lockedLines: [
        'A reflection cue for catching the pattern before a conversation hardens.',
        'Conditions to observe at work without turning the result into career advice.',
      ],
    },
    {
      title: 'Shadow, growth, and dream prompts',
      eyebrow: `${functionStackLabel} beyond the label`,
      location: 'results_insight_shadow_growth',
      ctaLabel: `Get all 10 sections - ${offerPrice}`,
      lockedLabel: 'Growth sections locked',
      featured: false,
      proof: 'Insight adds distinct sections for archetypes, shadow material, individuation, growth practices, and dream reflection.',
      visibleLines: [
        `These sections go beyond the free hierarchy and ask how the less-conscious side of the ${functionStackLabel} pattern may show up over time.`,
        `The goal is a set of observations and practices, not another fixed identity claim.`,
      ],
      lockedLines: [
        'Shadow trigger and integration prompts tied to the inferior side.',
        'A practical growth sequence plus dream-journaling questions for continued reflection.',
      ],
    },
  ];

  return (
    <section className="mb-8 overflow-hidden rounded-lg border border-jung-dark bg-jung-dark text-white shadow-xl">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="p-5 sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-jung-subtle">
            <Lock className="h-3.5 w-3.5" />
            10-section report preview
          </div>
          <h2 className="mt-4 text-heading text-3xl text-white">
            Your {primaryName} report starts where the free map stops.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            The free map gives you the scores, hierarchy, axis, and consistency signal. {primaryName} adds ten distinct interpretation sections for grip and recovery, relationships, work, archetypes, shadow, growth, and dream reflection.
          </p>

          <div className="mt-6 rounded-lg border border-jung-subtle/20 bg-white/[0.06] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-jung-subtle">Clear free-versus-paid boundary</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/76">
                  No second test and no repeated score summary. The paid report applies this {functionStackLabel} map across ten deeper, non-clinical reflection sections.
                </p>
              </div>
              <span className="w-fit rounded-lg bg-white px-3 py-2 text-xs font-semibold text-jung-dark">
                {offerPrice} today
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.875fr_0.875fr]">
            {lockedSections.map((section) => (
              <article
                key={section.title}
                className={`rounded-lg border p-4 ${
                  section.featured
                    ? 'border-jung-subtle/60 bg-white/[0.14] shadow-[0_18px_50px_rgba(0,0,0,0.22)]'
                    : 'border-white/10 bg-white/[0.08]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-jung-subtle">{section.eyebrow}</p>
                    <h3 className="mt-2 text-base font-semibold leading-6 text-white">{section.title}</h3>
                  </div>
                  {section.featured ? (
                    <span className="mt-0.5 rounded-lg bg-jung-subtle px-2 py-1 text-[11px] font-semibold text-jung-dark">
                      Start here
                    </span>
                  ) : (
                    <Lock className="mt-1 h-4 w-4 flex-none text-jung-subtle" />
                  )}
                </div>
                <p className="mt-3 text-xs leading-5 text-jung-subtle/90">{section.proof}</p>
                <div className="mt-3 space-y-2 text-xs leading-5 text-white/72">
                  {section.visibleLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                {section.featured && (
                  <button
                    type="button"
                    onClick={() => onUnlock(intendedTier, section.location)}
                    disabled={isOpeningCheckout}
                    className="mt-4 min-h-11 w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-jung-dark shadow-sm transition hover:-translate-y-px hover:bg-jung-subtle focus:outline-none focus:ring-2 focus:ring-white/60 disabled:cursor-wait disabled:opacity-70"
                  >
                    {isOpeningCheckout ? 'Opening secure Stripe…' : section.ctaLabel}
                  </button>
                )}
                <div className="relative mt-4 overflow-hidden rounded-lg border border-white/10 bg-black/[0.18] p-4">
                  <div aria-hidden="true" className="space-y-2 select-none text-xs leading-5 text-white/75 blur-[3px]">
                    {section.lockedLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-jung-dark/20 via-jung-dark/55 to-jung-dark/85 px-4 text-center">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-jung-dark shadow-sm">
                      <Lock className="h-3.5 w-3.5" />
                      {section.lockedLabel}
                    </span>
                    {!section.featured && (
                      <button
                        type="button"
                        onClick={() => onUnlock(intendedTier, section.location)}
                        disabled={isOpeningCheckout}
                        className="min-h-11 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 disabled:cursor-wait disabled:opacity-70"
                      >
                        {isOpeningCheckout ? 'Opening Stripe…' : section.ctaLabel}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 bg-white p-5 text-jung-dark sm:p-6 lg:border-l lg:border-t-0">
          <p className="text-label">Keep reading</p>
          <h3 className="mt-2 text-heading text-2xl text-jung-dark">
            {primaryName} - {offerPrice}
          </h3>
          <p className="mt-3 text-sm leading-6 text-jung-secondary">
            Your free map is already complete. This purchase adds ten personalized interpretation sections without making you retake the assessment.
          </p>
          <div className="mt-5 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4">
            <p className="text-sm font-semibold text-jung-dark">Built from this result</p>
            <p className="mt-2 text-xs leading-5 text-jung-secondary">
              {results.reliability.label} consistency signal. {dominantLabel} to {inferiorLabel}.
            </p>
          </div>
          <Button
            variant="accent"
            size="lg"
            className="mt-5 w-full"
            onClick={() => onUnlock(intendedTier, 'results_locked_preview')}
            disabled={isOpeningCheckout}
            rightIcon={isOpeningCheckout ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          >
            {isOpeningCheckout ? 'Opening secure Stripe' : `Get my 10-section report - ${offerPrice}`}
          </Button>
          {checkoutError && (
            <p className="mt-3 rounded-lg border border-error/30 bg-error/5 p-3 text-xs leading-5 text-error" role="alert">
              {checkoutError} Your result is safe. Try the button again.
            </p>
          )}
          <p className="mt-3 text-xs leading-5 text-jung-secondary">
            Includes <span className="font-semibold text-jung-dark">The Function Stack in Depth</span> — a 15-page theory guide (PDF) covering all eight functions, the stack, and the grip.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold text-jung-secondary">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-jung-accent" />7-day money-back</span>
            <span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-jung-accent" />One-time, no subscription</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-jung-accent" />Secure via Stripe</span>
          </div>
          <button
            type="button"
            onClick={() => onUnlock(intendedTier, 'results_locked_preview_price_note')}
            disabled={isOpeningCheckout}
            className="mt-3 w-full rounded-lg border border-jung-border bg-jung-base px-3 py-2 text-xs font-semibold text-jung-secondary transition hover:border-jung-accent hover:text-jung-accent disabled:cursor-wait disabled:opacity-70"
          >
            {isOpeningCheckout ? 'Opening Stripe…' : 'Open secure Stripe directly'}
          </button>
          <p className="mt-3 text-xs leading-5 text-jung-muted">
            {listPrice} before {EMAIL_CAPTURE_OFFER.code}. Stripe shows the discounted total before payment; no subscription is created.
          </p>
          <button
            type="button"
            onClick={() => onViewSampleReport('results_locked_preview')}
            className="mt-2 inline-flex min-h-11 items-center text-xs font-semibold text-jung-accent hover:underline"
          >
            See a full sample report
          </button>
          <p className="mt-4 border-t border-jung-border-light pt-3 text-[11px] leading-5 text-jung-muted">
            Educational self-reflection, not a clinical or diagnostic assessment.
          </p>
        </div>
      </div>
    </section>
  );
};

// Lightweight reaction prompt seeded as analytics (and a trust signal). Kept as
// its own component so its hooks stay valid regardless of the parent's early
// returns. Stores the answer per-result so it is asked once.
const ResultReaction: React.FC<{ completedAt: string }> = ({ completedAt }) => {
  const storageKey = `typejung_result_reaction_${completedAt}`;
  const [reaction, setReaction] = useState<string | null>(null);

  useEffect(() => {
    try { setReaction(localStorage.getItem(storageKey)); } catch { /* storage unavailable */ }
  }, [storageKey]);

  const submit = (value: 'yes' | 'somewhat' | 'not_yet') => {
    try { localStorage.setItem(storageKey, value); } catch { /* storage unavailable */ }
    setReaction(value);
    trackEvent('result_reaction_submitted', { reaction: value });
  };

  const options: Array<{ value: 'yes' | 'somewhat' | 'not_yet'; label: string }> = [
    { value: 'yes', label: 'Yes' },
    { value: 'somewhat', label: 'Somewhat' },
    { value: 'not_yet', label: 'Not yet' },
  ];

  return (
    <section className="mb-10 rounded-lg border border-jung-border bg-jung-surface p-5 shadow-sm sm:p-6">
      {reaction ? (
        <div className="flex items-start gap-3">
          <Check className="mt-0.5 h-5 w-5 flex-none text-jung-accent" />
          <div>
            <p className="text-sm font-semibold text-jung-dark">Thanks — that helps tune the map.</p>
            <p className="mt-1 text-sm leading-6 text-jung-secondary">
              {reaction === 'not_yet'
                ? 'If the map missed you, the dominant–inferior axis and reliability signal below are the best places to inspect why.'
                : 'Glad it named something real. Read the evidence layers below to see why the pattern resolved this way.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-jung-dark">Did this map name something real?</p>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => submit(option.value)}
                className="rounded-full border border-jung-border bg-jung-base px-4 py-1.5 text-sm font-medium text-jung-dark transition-colors hover:border-jung-accent hover:text-jung-accent"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export const Results: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<ResultsState>({ status: 'loading' });
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { tier, isPremium, isLoading: premiumLoading } = usePremiumStatus();
  const {
    freeAnalysis,
    premiumAnalysis,
    isLoadingFree,
    isLoadingPremium,
    freeError,
    premiumError,
    fetchFreeAnalysis,
    fetchPremiumAnalysis,
  } = useAiAnalysis();
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error' | 'skipped'>('idle');
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [returnCopied, setReturnCopied] = useState(false);
  const [shareLinkState, setShareLinkState] = useState<'idle' | 'creating' | 'error'>('idle');
  const [upgradeIntent] = useState(readUpgradeIntent);
  const [acquisition] = useState(readAcquisitionSource);
  const [checkoutOpeningTier, setCheckoutOpeningTier] = useState<PaidTierId | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const referralPromptTrackedRef = useRef<string | null>(null);
  const upgradeOfferTrackedRef = useRef<string | null>(null);
  const upgradeContextTrackedRef = useRef<string | null>(null);
  const lockedPreviewTrackedRef = useRef<string | null>(null);
  const inboundSharedResultSlug = acquisition?.sharedResult && acquisition.sharedResult !== shareSlug
    ? acquisition.sharedResult
    : null;
  const intendedTier = upgradeIntent?.tier ?? 'insight';
  const intendedTierName = PRICING[intendedTier].name;
  const primaryUpgradeOption = upgradeOptions.find((option) => option.tier === intendedTier) ?? upgradeOptions[0];
  const upgradeContext = useMemo(
    () => resultUpgradeContextFromSource(acquisition?.source, {
      parentSource: acquisition?.parentSource,
      utmCampaign: acquisition?.utmCampaign,
      utmSource: acquisition?.utmSource,
      sourceChain: acquisition?.sourceChain,
    }),
    [acquisition?.parentSource, acquisition?.source, acquisition?.sourceChain, acquisition?.utmCampaign, acquisition?.utmSource],
  );

  const openUpgradeCheckout = useCallback(async (paidTier: PaidTierId, ctaSource: string) => {
    if (checkoutOpeningTier) return;

    const destination = 'secure_stripe_checkout';
    trackEvent('results_unlock_clicked', {
      source: ctaSource,
      tier: paidTier,
      destination,
      checkout_mode: 'direct',
      value: PRICING[paidTier].amount,
      currency: PRICING[paidTier].currency,
      price_cad: PRICING[paidTier].amount,
      displayed_price: PRICING[paidTier].price,
      discounted_price: paidTierPrice(paidTier),
    });
    AnalyticsEvents.upgradeClicked(ctaSource, paidTier);
    AnalyticsEvents.purchaseStarted(paidTier, PRICING[paidTier].amount);
    AnalyticsEvents.ctaClicked(`unlock_${paidTier}`, ctaSource, {
      buttonText: `Get ${PRICING[paidTier].name} - ${paidTierPrice(paidTier)}`,
      destination,
    });

    setCheckoutError(null);
    setCheckoutOpeningTier(paidTier);

    try {
      const { session, attribution } = await createDirectCheckoutSession({
        tier: paidTier,
        source: ctaSource,
        acquisition,
        customerEmail: user?.email,
        anonymousId: getFunnelAnonymousId(),
      });

      writePendingCheckout({
        tier: paidTier,
        url: session.url,
        sessionId: session.sessionId,
        expiresAt: session.expiresAt,
        source: ctaSource,
        attribution,
      });
      trackEvent('results_direct_checkout_created', {
        source: ctaSource,
        tier: paidTier,
        has_account_email: Boolean(user?.email),
      });
      window.location.assign(session.url);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Secure checkout could not open. Please try again.';
      setCheckoutError(message);
      setCheckoutOpeningTier(null);
      trackEvent('results_direct_checkout_failed', {
        source: ctaSource,
        tier: paidTier,
        reason: message.slice(0, 120),
      });
    }
  }, [acquisition, checkoutOpeningTier, user?.email]);

  const viewSampleReport = useCallback((location: string) => {
    const destination = pathWithSource('/sample-report', location);
    AnalyticsEvents.ctaClicked('view_sample_report', location, {
      buttonText: 'View sample report',
      destination,
    });
    navigate(destination);
  }, [navigate]);

  useEffect(() => {
    setState(readResults());
  }, []);

  const currentResults = state.status === 'ready' ? state.results : null;
  const legacyInput = useMemo(
    () => currentResults ? depthResultToLegacyAnalysisInput(currentResults) : null,
    [currentResults],
  );
  const premiumAnalysisInput = useMemo<AnalysisInput | null>(() => {
    if (!legacyInput) return null;
    const checkoutSessionId = readCheckoutSessionId();
    return checkoutSessionId ? { ...legacyInput, checkoutSessionId } : legacyInput;
  }, [legacyInput]);
  const hasVerifiedCheckoutSession = Boolean(premiumAnalysisInput?.checkoutSessionId);

  useEffect(() => {
    if (!currentResults) return;

    const dominantFunction = getFunctionCode(currentResults.dominant, currentResults.attitude.dominant);
    const viewedKey = `typejung_results_viewed_${currentResults.completedAt}`;

    try {
      if (sessionStorage.getItem(viewedKey)) return;
      AnalyticsEvents.resultsViewed(dominantFunction);
      sessionStorage.setItem(viewedKey, 'true');
    } catch {
      AnalyticsEvents.resultsViewed(dominantFunction);
    }
  }, [currentResults]);

  useEffect(() => {
    if (!currentResults || !inboundSharedResultSlug) return;

    trackEvent('inbound_shared_result_prompt_viewed', {
      source: acquisition?.source || 'unknown',
      shared_result: inboundSharedResultSlug,
      utm_campaign: acquisition?.utmCampaign || 'unknown',
      dominant_function: getFunctionCode(currentResults.dominant, currentResults.attitude.dominant),
    });
  }, [acquisition?.source, acquisition?.utmCampaign, currentResults, inboundSharedResultSlug]);

  useEffect(() => {
    if (!currentResults || premiumLoading || isPremium) return;

    const trackedKey = `${currentResults.completedAt}_${intendedTier}_${upgradeContext?.category || 'default'}`;
    if (upgradeOfferTrackedRef.current === trackedKey) return;
    upgradeOfferTrackedRef.current = trackedKey;

    trackEvent('result_upgrade_offer_viewed', {
      source: acquisition?.source || 'unknown',
      intended_tier: intendedTier,
      context_category: upgradeContext?.category || 'default',
      has_context: Boolean(upgradeContext),
      dominant_function: getFunctionCode(currentResults.dominant, currentResults.attitude.dominant),
      has_upgrade_intent: Boolean(upgradeIntent),
      ...(acquisition?.parentSource ? { parent_source: acquisition.parentSource } : {}),
      ...(acquisition?.utmCampaign ? { utm_campaign: acquisition.utmCampaign } : {}),
      ...(acquisition?.utmSource ? { utm_source: acquisition.utmSource } : {}),
      ...(acquisition?.sourceChain ? { source_chain: acquisition.sourceChain } : {}),
    });
  }, [acquisition, currentResults, intendedTier, isPremium, premiumLoading, upgradeContext, upgradeIntent]);

  useEffect(() => {
    if (!currentResults || premiumLoading || isPremium) return;

    const trackedKey = `${currentResults.completedAt}_${intendedTier}`;
    if (lockedPreviewTrackedRef.current === trackedKey) return;
    lockedPreviewTrackedRef.current = trackedKey;

    const previewPayload = {
      source: acquisition?.source || 'unknown',
      preview_source: 'results_locked_preview',
      intended_tier: intendedTier,
      tier: intendedTier,
      value: PRICING[intendedTier].amount,
      currency: PRICING[intendedTier].currency,
      dominant_function: getFunctionCode(currentResults.dominant, currentResults.attitude.dominant),
      inferior_function: getFunctionCode(
        currentResults.inferior,
        currentResults.hierarchy.find((item) => item.position === 'inferior')?.attitude ?? 'extraverted',
      ),
      reliability: currentResults.reliability.label,
      has_upgrade_intent: Boolean(upgradeIntent),
      context_category: upgradeContext?.category || 'default',
      ...(acquisition?.parentSource ? { parent_source: acquisition.parentSource } : {}),
      ...(acquisition?.utmCampaign ? { utm_campaign: acquisition.utmCampaign } : {}),
      ...(acquisition?.utmSource ? { utm_source: acquisition.utmSource } : {}),
      ...(acquisition?.sourceChain ? { source_chain: acquisition.sourceChain } : {}),
    };

    trackEvent('results_premium_preview_viewed', previewPayload);
    trackEvent('result_locked_preview_viewed', previewPayload);
  }, [acquisition, currentResults, intendedTier, isPremium, premiumLoading, upgradeContext?.category, upgradeIntent]);

  useEffect(() => {
    if (!currentResults) return;

    const trackedKey = `${currentResults.completedAt}_${shareSlug || 'no_share_slug'}`;
    if (referralPromptTrackedRef.current === trackedKey) return;
    referralPromptTrackedRef.current = trackedKey;

    trackEvent('result_referral_prompt_viewed', {
      source: 'results_page',
      dominant_function: getFunctionCode(currentResults.dominant, currentResults.attitude.dominant),
      has_share_slug: Boolean(shareSlug),
      invite_goal: REFERRAL_INVITE_GOAL,
    });
  }, [currentResults, shareSlug]);

  useEffect(() => {
    if (!currentResults || premiumLoading || isPremium || !upgradeContext) return;

    const trackedKey = `${currentResults.completedAt}_${upgradeContext.category}`;
    if (upgradeContextTrackedRef.current === trackedKey) return;
    upgradeContextTrackedRef.current = trackedKey;

    trackEvent('result_upgrade_context_viewed', {
      source: acquisition?.source || 'unknown',
      context_category: upgradeContext.category,
      intended_tier: intendedTier,
      dominant_function: getFunctionCode(currentResults.dominant, currentResults.attitude.dominant),
      ...(acquisition?.parentSource ? { parent_source: acquisition.parentSource } : {}),
      ...(acquisition?.utmCampaign ? { utm_campaign: acquisition.utmCampaign } : {}),
      ...(acquisition?.utmSource ? { utm_source: acquisition.utmSource } : {}),
      ...(acquisition?.sourceChain ? { source_chain: acquisition.sourceChain } : {}),
    });
  }, [acquisition, currentResults, intendedTier, isPremium, premiumLoading, upgradeContext]);

  const lifecycleEmailSummary = useMemo(() => {
    if (!currentResults) return null;

    return {
      dominantLabel: `${ATTITUDE_LABELS[currentResults.attitude.dominant]} ${FUNCTION_LABELS[currentResults.dominant]}`,
      inferiorLabel: `${ATTITUDE_LABELS[currentResults.hierarchy.find((item) => item.position === 'inferior')?.attitude ?? 'extraverted']} ${FUNCTION_LABELS[currentResults.inferior]}`,
    };
  }, [currentResults]);

  useEffect(() => {
    if (!currentResults || shareSlug) return;

    try {
      const savedPublicSlug = localStorage.getItem(`${PUBLIC_SHARE_SLUG_PREFIX}${currentResults.completedAt}`);
      if (savedPublicSlug) {
        setShareSlug(savedPublicSlug);
      }
    } catch {
      // Share links are helpful but should never block the result page.
    }
  }, [currentResults, shareSlug]);

  useEffect(() => {
    if (!currentResults || !legacyInput || authLoading) return;

    if (!isAuthenticated) {
      setSaveState('skipped');
      return;
    }

    const savedKey = `jungian_depth_saved_${currentResults.completedAt}`;
    const savedSlug = localStorage.getItem(`${savedKey}_share_slug`);
    if (localStorage.getItem(savedKey)) {
      setSaveState('saved');
      setShareSlug(savedSlug);
      return;
    }

    let cancelled = false;
    setSaveState('saving');

    fetch('/api/results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(legacyInput),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          throw new Error(data?.message || 'Failed to save result');
        }
        return response.json();
      })
      .then((saved) => {
        if (cancelled) return;
        localStorage.setItem(savedKey, 'true');
        if (saved?.shareSlug) {
          localStorage.setItem(`${savedKey}_share_slug`, saved.shareSlug);
          localStorage.setItem('jungian_assessment_share_slug', saved.shareSlug);
          setShareSlug(saved.shareSlug);
        }
        AnalyticsEvents.resultSaved('auto_save_after_result', Boolean(saved?.shareSlug));
        setSaveState('saved');
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Failed to save depth result:', error);
        setSaveState('error');
      });

    return () => {
      cancelled = true;
    };
  }, [authLoading, currentResults, isAuthenticated, legacyInput]);

  useEffect(() => {
    if (!legacyInput || freeAnalysis || freeError || isLoadingFree) return;
    fetchFreeAnalysis(legacyInput);
  }, [fetchFreeAnalysis, freeAnalysis, freeError, isLoadingFree, legacyInput]);

  useEffect(() => {
    if (!premiumAnalysisInput || !isPremium || premiumLoading || premiumAnalysis || premiumError || isLoadingPremium) return;
    if (!isAuthenticated && !premiumAnalysisInput.checkoutSessionId) return;
    fetchPremiumAnalysis(premiumAnalysisInput);
  }, [fetchPremiumAnalysis, isAuthenticated, isLoadingPremium, isPremium, premiumAnalysis, premiumAnalysisInput, premiumError, premiumLoading]);

  useEffect(() => {
    if (!currentResults || !lifecycleEmailSummary || authLoading || !user?.email) return;

    const attemptKey = `${RESULT_READY_EMAIL_ATTEMPT_PREFIX}${currentResults.completedAt}`;
    if (localStorage.getItem(attemptKey)) return;

    void postLifecycleEmail({
      lifecycle: 'result-ready',
      idempotencyKey: attemptKey,
      completedAt: currentResults.completedAt,
      dominantLabel: lifecycleEmailSummary.dominantLabel,
      inferiorLabel: lifecycleEmailSummary.inferiorLabel,
    }).then((ok) => {
      if (ok) {
        localStorage.setItem(attemptKey, new Date().toISOString());
      }
    });
  }, [authLoading, currentResults, lifecycleEmailSummary, user?.email]);

  useEffect(() => {
    if (!currentResults || !lifecycleEmailSummary || authLoading || premiumLoading || !user?.email) return;

    const dueKey = `${UPGRADE_EMAIL_DUE_PREFIX}${currentResults.completedAt}`;
    const attemptKey = `${UPGRADE_EMAIL_ATTEMPT_PREFIX}${currentResults.completedAt}`;

    if (isPremium) {
      localStorage.removeItem(dueKey);
      return;
    }

    if (localStorage.getItem(attemptKey)) return;

    const savedDueAt = Number(localStorage.getItem(dueKey));
    const dueAt = Number.isFinite(savedDueAt) && savedDueAt > 0
      ? savedDueAt
      : Date.now() + UPGRADE_EMAIL_DELAY_MS;

    if (!Number.isFinite(savedDueAt) || savedDueAt <= 0) {
      localStorage.setItem(dueKey, String(dueAt));
    }

    const timer = window.setTimeout(() => {
      if (localStorage.getItem('jungian_assessment_unlocked') === 'true') return;
      if (localStorage.getItem(attemptKey)) return;

      void postLifecycleEmail({
        lifecycle: 'free-result-upgrade',
        idempotencyKey: attemptKey,
        completedAt: currentResults.completedAt,
        dominantLabel: lifecycleEmailSummary.dominantLabel,
        inferiorLabel: lifecycleEmailSummary.inferiorLabel,
      }).then((ok) => {
        if (ok) {
          localStorage.setItem(attemptKey, new Date().toISOString());
        }
      });
    }, Math.max(0, dueAt - Date.now()));

    return () => window.clearTimeout(timer);
  }, [authLoading, currentResults, isPremium, lifecycleEmailSummary, premiumLoading, user?.email]);

  const downloadResults = useCallback(() => {
    if (state.status !== 'ready') return;
    const blob = new Blob([JSON.stringify(state.results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `typejung-function-stack-map-${state.results.completedAt.slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const copyShareUrl = useCallback(async () => {
    if (!shareSlug || typeof window === 'undefined') return;

    const url = `${window.location.origin}/share/${shareSlug}`;

    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      AnalyticsEvents.resultsShared('link');
      window.setTimeout(() => setShareCopied(false), 2400);
    } catch (error) {
      console.error('Failed to copy share URL:', error);
    }
  }, [shareSlug]);

  const ensureShareSlug = useCallback(async (source = 'results_share_card'): Promise<string | null> => {
    if (shareSlug) return shareSlug;
    if (!legacyInput || !currentResults) return null;

    setShareLinkState('creating');

    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...legacyInput,
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

      localStorage.setItem(`${PUBLIC_SHARE_SLUG_PREFIX}${currentResults.completedAt}`, saved.shareSlug);
      localStorage.setItem('jungian_assessment_share_slug', saved.shareSlug);
      setShareSlug(saved.shareSlug);
      setShareLinkState('idle');
      AnalyticsEvents.resultSaved('public_compare_link_created', true);
      trackEvent('result_compare_link_created', {
        source,
        signed_in: Boolean(isAuthenticated),
      });
      return saved.shareSlug;
    } catch (error) {
      console.error('Failed to create share link:', error);
      setShareLinkState('error');
      trackEvent('result_compare_link_failed', {
        source,
        signed_in: Boolean(isAuthenticated),
      });
      return null;
    }
  }, [currentResults, isAuthenticated, legacyInput, shareSlug]);

  const createShareLink = useCallback((source = 'results_share_card') => {
    void ensureShareSlug(source);
  }, [ensureShareSlug]);

  const openShareWindow = useCallback((method: 'twitter' | 'linkedin') => {
    if (!shareSlug || typeof window === 'undefined') return;

    const url = `${window.location.origin}/share/${shareSlug}`;
    const text = 'I mapped my Jungian function-stack pattern with TypeJung. It shows cognitive functions, inferior-function stress, and a growth edge.';
    const shareUrl = method === 'twitter'
      ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
      : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

    AnalyticsEvents.resultsShared(method);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }, [shareSlug]);

  const buildInviteUrls = useCallback((location: InviteShareLocation, slug: string | null) => {
    if (typeof window === 'undefined') {
      return { assessmentUrl: '', sharedResultUrl: null as string | null };
    }

    const inviteSource = inviteSourceByLocation[location];
    const assessmentPath = pathWithSource('/assessment', inviteSource, {
      ref: 'result_share',
      utm_campaign: REFERRAL_INVITE_CAMPAIGN,
      compare: slug,
    });
    const sharedResultPath = slug
      ? pathWithSource(`/share/${slug}`, inviteSource, {
        ref: 'result_share',
        utm_campaign: REFERRAL_INVITE_CAMPAIGN,
      })
      : null;

    return {
      assessmentUrl: `${window.location.origin}${assessmentPath}`,
      sharedResultUrl: sharedResultPath ? `${window.location.origin}${sharedResultPath}` : null,
    };
  }, []);

  const shareAssessmentInvite = useCallback(async (location: InviteShareLocation = 'results_invite_card') => {
    if (typeof window === 'undefined') return;

    const nextShareSlug = shareSlug ?? await ensureShareSlug(`invite_${location}`);
    const { assessmentUrl, sharedResultUrl } = buildInviteUrls(location, nextShareSlug);
    const url = sharedResultUrl ?? assessmentUrl;
    const axisText = lifecycleEmailSummary
      ? `My TypeJung map came out as ${lifecycleEmailSummary.dominantLabel} with ${lifecycleEmailSummary.inferiorLabel} as the growth edge.`
      : 'I just mapped my Jungian function-stack pattern with TypeJung.';
    const text = sharedResultUrl
      ? `${axisText} Compare your map with mine here: ${url}`
      : `${axisText} Take the free assessment and compare your map with mine: ${url}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Compare TypeJung maps',
          text,
          url,
        });
        trackEvent('assessment_invite_shared', {
          source: location,
          method: 'native',
          invite_source: inviteSourceByLocation[location],
          has_share_slug: Boolean(nextShareSlug),
          invite_goal: REFERRAL_INVITE_GOAL,
        });
        return;
      }

      await navigator.clipboard.writeText(text);
      setInviteCopied(true);
      window.setTimeout(() => setInviteCopied(false), 2400);
      trackEvent('assessment_invite_shared', {
        source: location,
        method: 'copy',
        invite_source: inviteSourceByLocation[location],
        has_share_slug: Boolean(nextShareSlug),
        invite_goal: REFERRAL_INVITE_GOAL,
      });
    } catch (error) {
      console.error('Failed to share assessment invite:', error);
    }
  }, [buildInviteUrls, ensureShareSlug, lifecycleEmailSummary, shareSlug]);

  const copyResultSummary = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const nextShareSlug = shareSlug ?? await ensureShareSlug('result_summary_share');
    const inviteSource = 'result_summary_share';
    const sharedResultPath = nextShareSlug
      ? pathWithSource(`/share/${nextShareSlug}`, inviteSource, {
        ref: 'result_share',
        utm_campaign: REFERRAL_INVITE_CAMPAIGN,
      })
      : null;
    const assessmentPath = pathWithSource('/assessment', inviteSource, {
      ref: 'result_share',
      utm_campaign: REFERRAL_INVITE_CAMPAIGN,
      compare: nextShareSlug,
    });
    const url = `${window.location.origin}${sharedResultPath ?? assessmentPath}`;
    const axisText = lifecycleEmailSummary
      ? `My TypeJung map came out as ${lifecycleEmailSummary.dominantLabel} to ${lifecycleEmailSummary.inferiorLabel}.`
      : 'I mapped my Jungian cognitive function pattern with TypeJung.';
    const text = nextShareSlug
      ? `${axisText} It maps all 8 cognitive functions before any paid report. Compare your map with mine: ${url}`
      : `${axisText} It maps all 8 cognitive functions before any paid report. Try the free assessment and compare yours: ${url}`;

    try {
      await navigator.clipboard.writeText(text);
      setSummaryCopied(true);
      window.setTimeout(() => setSummaryCopied(false), 2400);
      trackEvent('result_summary_shared', {
        source: 'results_page',
        method: 'copy',
        invite_source: 'result_summary_share',
        has_share_slug: Boolean(nextShareSlug),
        invite_goal: REFERRAL_INVITE_GOAL,
      });
    } catch (error) {
      console.error('Failed to copy result summary:', error);
    }
  }, [ensureShareSlug, lifecycleEmailSummary, shareSlug]);

  const copyReturnCompareReply = useCallback(async () => {
    if (typeof window === 'undefined' || !inboundSharedResultSlug) return;

    const nextShareSlug = shareSlug ?? await ensureShareSlug('inbound_result_reply');
    if (!nextShareSlug) return;

    const ownSharePath = pathWithSource(`/share/${nextShareSlug}`, 'inbound_result_reply', {
      ref: 'shared_result_reply',
      utm_campaign: REFERRAL_INVITE_CAMPAIGN,
      parent_source: acquisition?.source || 'shared_result_cta',
      shared_result: inboundSharedResultSlug,
    });
    const originalSharePath = pathWithSource(`/share/${inboundSharedResultSlug}`, 'result_reply_original', {
      ref: 'shared_result_reply',
      utm_campaign: REFERRAL_INVITE_CAMPAIGN,
    });
    const ownShareUrl = `${window.location.origin}${ownSharePath}`;
    const originalShareUrl = `${window.location.origin}${originalSharePath}`;
    const axisText = lifecycleEmailSummary
      ? `I took TypeJung too. My map came out as ${lifecycleEmailSummary.dominantLabel} to ${lifecycleEmailSummary.inferiorLabel}.`
      : 'I took TypeJung too and made my own function-stack map.';
    const text = `${axisText} Here is mine so we can compare both maps: ${ownShareUrl}\n\nYour original map: ${originalShareUrl}`;

    try {
      await navigator.clipboard.writeText(text);
      setReturnCopied(true);
      window.setTimeout(() => setReturnCopied(false), 2400);
      trackEvent('inbound_shared_result_reply_copied', {
        source: acquisition?.source || 'unknown',
        shared_result: inboundSharedResultSlug,
        reply_share_slug: nextShareSlug,
        utm_campaign: REFERRAL_INVITE_CAMPAIGN,
      });
    } catch (error) {
      console.error('Failed to copy shared-result reply:', error);
    }
  }, [acquisition?.source, ensureShareSlug, inboundSharedResultSlug, lifecycleEmailSummary, shareSlug]);

  const openInboundSharedResult = useCallback(() => {
    if (typeof window === 'undefined' || !inboundSharedResultSlug) return;

    const originalSharePath = pathWithSource(`/share/${inboundSharedResultSlug}`, 'result_reply_original', {
      ref: 'shared_result_reply',
      utm_campaign: REFERRAL_INVITE_CAMPAIGN,
    });
    trackEvent('inbound_shared_result_original_opened', {
      source: acquisition?.source || 'unknown',
      shared_result: inboundSharedResultSlug,
    });
    window.location.href = originalSharePath;
  }, [acquisition?.source, inboundSharedResultSlug]);

  if (state.status === 'loading') {
    return (
      <div className="min-h-[60vh] bg-jung-base px-4 py-20">
        <div className="editorial-container">
          <div className="card-premium mx-auto max-w-xl p-8 text-center">
            <div className="mx-auto h-12 w-12 animate-pulse rounded-lg bg-jung-accent-light" />
            <p className="mt-5 text-sm font-semibold text-jung-muted">Loading results</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === 'no-results') {
    return (
      <div className="min-h-[60vh] bg-jung-base px-4 py-20">
        <div className="editorial-container">
          <div className="card-premium mx-auto max-w-xl p-8 text-center">
            <h1 className="text-heading text-3xl text-jung-dark">No function-stack map yet</h1>
            <p className="mt-3 text-sm leading-6 text-jung-secondary">
              Complete the assessment first, then your result will appear here.
            </p>
            <Button className="mt-6" variant="accent" onClick={() => navigate('/assessment')} rightIcon={<ArrowRight className="h-5 w-5" />}>
              Start assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (state.status === 'legacy') {
    return (
      <div className="min-h-[60vh] bg-jung-base px-4 py-20">
        <div className="editorial-container">
          <div className="card-premium mx-auto max-w-xl p-8 text-center">
            <h1 className="text-heading text-3xl text-jung-dark">Retake for the new function-stack map</h1>
            <p className="mt-3 text-sm leading-6 text-jung-secondary">
              Your saved result was created with the older 8-function scorer. The redesigned flow uses the new 42-question depth model.
            </p>
            <Button className="mt-6" variant="accent" onClick={() => navigate('/assessment')} rightIcon={<RefreshCcw className="h-5 w-5" />}>
              Retake assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { results } = state;
  const shareUrl = shareSlug && typeof window !== 'undefined' ? `${window.location.origin}/share/${shareSlug}` : null;
  const inboundOriginalShareUrl = inboundSharedResultSlug && typeof window !== 'undefined'
    ? `${window.location.origin}${pathWithSource(`/share/${inboundSharedResultSlug}`, 'result_reply_original', {
      ref: 'shared_result_reply',
      utm_campaign: REFERRAL_INVITE_CAMPAIGN,
    })}`
    : null;
  const isPreparingReferral = shareLinkState === 'creating' && !shareSlug;
  // Plain const (not a hook) — this runs after the early returns above, so it
  // must not be useMemo. readAssessmentIntent is a cheap localStorage read.
  const resultIntent = readAssessmentIntent();
  const intentFraming = resultIntent ? INTENT_RESULT_FRAMING[resultIntent.id] : null;
  const dominantLabel = lifecycleEmailSummary?.dominantLabel ?? `${ATTITUDE_LABELS[results.attitude.dominant]} ${FUNCTION_LABELS[results.dominant]}`;
  const inferiorLabel = lifecycleEmailSummary?.inferiorLabel ?? `${ATTITUDE_LABELS[results.hierarchy.find((item) => item.position === 'inferior')?.attitude ?? 'extraverted']} ${FUNCTION_LABELS[results.inferior]}`;
  const chatProfile = legacyInput ? {
    dominantFunction: legacyInput.stack.dominant.function,
    auxiliaryFunction: legacyInput.stack.auxiliary.function,
    tertiaryFunction: legacyInput.stack.tertiary.function,
    inferiorFunction: legacyInput.stack.inferior.function,
    scores: legacyInput.scores.map((score) => ({ function: score.function, score: score.score })),
    attitudeScore: legacyInput.attitudeScore,
  } : null;
  const functionStackCodes = results.hierarchy.map((item) => getFunctionCode(item.channel, item.attitude));
  const functionStackLabel = functionStackCodes.join('-');
  const allFunctionScores = legacyInput
    ? [...legacyInput.scores].sort((left, right) => right.score - left.score)
    : [];
  const premiumReportSections = premiumAnalysis
    ? premiumReportSectionConfig
      .map((section) => ({
        ...section,
        body: premiumAnalysis[section.key],
      }))
      .filter((section) => Boolean(section.body && section.body.trim()))
    : [];
  const hasMasteryAccess = tier === 'mastery';

  return (
    <div className={`min-h-screen bg-jung-base ${!premiumLoading && !isPremium ? 'pb-28 md:pb-20' : 'pb-20'}`}>
      <div className="editorial-container py-10 lg:py-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 sm:mb-10">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="min-h-11 justify-start px-0 text-jung-muted hover:text-jung-accent">
            Return home
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadResults} leftIcon={<Download className="h-4 w-4" />} className="min-h-11">
              <span className="sm:hidden">Download</span>
              <span className="hidden sm:inline">Download result file</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/assessment')} leftIcon={<RefreshCcw className="h-4 w-4" />} className="min-h-11">
              Retake
            </Button>
          </div>
        </div>

        <section className="mb-10 rounded-lg border border-jung-border bg-jung-dark p-7 text-white shadow-xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-white/60">{formatDate(results.completedAt)}</p>
              <h1 className="mt-4 text-display text-5xl text-white sm:text-6xl">Your function-stack map</h1>
              {!premiumLoading && !isPremium && (
                <DiscountCaptureCard
                  source="results_hero_mobile_save_path"
                  dominantLabel={dominantLabel}
                  inferiorLabel={inferiorLabel}
                  compact
                  minimal
                  minimalTone="dark"
                  minimalTitle="Email yourself this result before checkout"
                  minimalDescription={`Email the ${dominantLabel} to ${inferiorLabel} axis, the ${EMAIL_CAPTURE_OFFER.code} code, and the ${intendedTierName} checkout path before you leave.`}
                  minimalSubmitLabel="Send map"
                  minimalFootnote="One private email with this result path and code. No subscription."
                  minimalSentMessage={`Result path sent. Continue to secure checkout now, or use the email later.`}
                  preferredTier={intendedTier}
                  showCheckoutButtons
                  onCheckout={(paidTier) => openUpgradeCheckout(paidTier, 'results_hero_mobile_save_path')}
                  checkoutButtonLabel={`Continue to secure checkout - ${paidTierPrice(intendedTier)}`}
                  className="mt-6 hidden border-t border-white/10 pt-5 md:block lg:hidden"
                />
              )}
              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">
                {results.narrative.energyMap}
              </p>
            </div>
            <div className="rounded-lg border border-white/15 bg-white/10 p-5">
              <p className="text-sm font-semibold text-white/60">Shareable stack signal</p>
              <p className="mt-3 font-mono text-3xl font-semibold tracking-[0.08em] text-white">
                {functionStackLabel}
              </p>
              <p className="mt-3 text-xs leading-5 text-white/55">
                Nearest function pattern, not a fixed identity label. Use it to inspect the evidence below.
              </p>
              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-sm font-semibold text-white/60">Dominant-inferior axis</p>
                <p className="mt-3 text-2xl font-semibold">{dominantLabel}</p>
                <p className="my-2 text-sm text-white/45">to</p>
                <p className="text-2xl font-semibold text-jung-subtle">{inferiorLabel}</p>
              </div>
              {!premiumLoading && !isPremium && (
                <DiscountCaptureCard
                  source="results_hero_axis_save_path"
                  dominantLabel={dominantLabel}
                  inferiorLabel={inferiorLabel}
                  compact
                  minimal
                  minimalTone="dark"
                  minimalTitle="Email yourself this result before checkout"
                  minimalDescription={`Email the ${dominantLabel} to ${inferiorLabel} axis, the ${EMAIL_CAPTURE_OFFER.code} code, and the ${intendedTierName} checkout path before you leave.`}
                  minimalSubmitLabel="Send map"
                  minimalFootnote="One private email with this result path and code. No subscription."
                  minimalSentMessage={`Result path sent. Continue to secure checkout now, or use the email later.`}
                  preferredTier={intendedTier}
                  showCheckoutButtons
                  onCheckout={(paidTier) => openUpgradeCheckout(paidTier, 'results_hero_axis_save_path')}
                  checkoutButtonLabel={`Continue to secure checkout - ${paidTierPrice(intendedTier)}`}
                  className="mt-5 hidden border-t border-white/10 pt-5 lg:block"
                />
              )}
            </div>
          </div>
        </section>

        <ResultReaction completedAt={results.completedAt} />


        {inboundSharedResultSlug && (
          <section className="mb-8 overflow-hidden rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[1fr_26rem]">
              <div className="p-5 sm:p-6">
                <p className="text-label">Reply to the shared map</p>
                <h2 className="mt-2 text-2xl font-semibold text-jung-dark">Send your map back while the comparison is fresh.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-jung-secondary">
                  You arrived from someone else's TypeJung result. Share your own map back so both dominant-inferior axes can sit in the same conversation.
                </p>
              </div>
              <div className="border-t border-jung-accent-muted bg-jung-surface p-5 sm:p-6 lg:border-l lg:border-t-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-jung-dark">
                  <Share2 className="h-4 w-4 text-jung-accent" />
                  Return-share prompt
                </div>
                <p className="mt-3 text-sm leading-6 text-jung-secondary">
                  This creates your compare page and copies a reply that includes both maps.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="accent"
                    className="w-full"
                    onClick={copyReturnCompareReply}
                    disabled={isPreparingReferral}
                    leftIcon={isPreparingReferral ? <Loader2 className="h-4 w-4 animate-spin" /> : returnCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  >
                    {isPreparingReferral ? 'Preparing reply' : returnCopied ? 'Reply copied' : 'Copy reply'}
                  </Button>
                  {inboundOriginalShareUrl && (
                    <Button variant="outline" className="w-full" onClick={openInboundSharedResult} leftIcon={<Link2 className="h-4 w-4" />}>
                      Open their map
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}


        <p className="figure-label mb-5 mt-2">Part 01 — Your free map</p>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.72fr]">
          <EnergyBars results={results} />

          <div className="grid gap-6">
            <div className="card-premium p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-label">Answer consistency signal</p>
                  <h2 className="text-2xl font-semibold text-jung-dark">{results.reliability.label}</h2>
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-jung-border-light">
                <div className="h-full rounded-full bg-jung-accent" style={{ width: `${results.reliability.score}%` }} />
              </div>
              <div className="mt-5 space-y-3">
                {results.reliability.notes.map((note) => (
                  <p key={note} className="text-sm leading-6 text-jung-secondary">{note}</p>
                ))}
              </div>
            </div>

            <div className="card-premium p-6 sm:p-8">
              <p className="text-label">Attitude</p>
              <h2 className="mt-2 text-2xl font-semibold text-jung-dark">
                {(results.attitude.balanced ?? Math.abs(results.attitude.introverted - results.attitude.extraverted) <= 6)
                  ? 'Balanced direction'
                  : `${ATTITUDE_LABELS[results.attitude.dominant]} direction`}
              </h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-jung-border bg-jung-surface p-4">
                  <p className="text-sm text-jung-muted">Introverted</p>
                  <p className="mt-2 text-3xl font-semibold text-jung-dark">{results.attitude.introverted}%</p>
                </div>
                <div className="rounded-lg border border-jung-border bg-jung-surface p-4">
                  <p className="text-sm text-jung-muted">Extraverted</p>
                  <p className="mt-2 text-3xl font-semibold text-jung-dark">{results.attitude.extraverted}%</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-jung-secondary">{results.attitude.summary}</p>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <Hierarchy results={results} />
        </section>

        <section className="mt-8">
          <SignalGrid results={results} />
        </section>

        {allFunctionScores.length > 0 && (
          <section className="mt-8 rounded-lg border border-jung-border bg-jung-surface p-5 shadow-sm sm:p-6">
            <div className="grid gap-6 lg:grid-cols-[0.72fr_1fr] lg:items-start">
              <div>
                <p className="text-label">Eight-function view</p>
                <h2 className="mt-3 text-heading text-3xl text-jung-dark">
                  {functionStackLabel} is the stack signal. The full map stays visible.
                </h2>
                <p className="mt-4 text-sm leading-7 text-jung-secondary">
                  TypeJung derives the function-attitude pattern from your energy channels and attitude direction,
                  then keeps all eight functions visible so close signals are easier to inspect.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {allFunctionScores.map((score) => (
                  <div key={score.function} className="rounded-lg border border-jung-border bg-jung-base p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="font-display text-xl font-semibold italic text-jung-dark">{score.function}</span>
                      <span className="font-mono text-sm font-semibold text-jung-muted">{score.score}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-jung-border-light">
                      <div className="h-full rounded-full bg-jung-accent" style={{ width: `${score.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {!premiumLoading && !isPremium && (
          <>
            <p className="figure-label mb-5 mt-10">Part 02 — Optional paid depth</p>
            {intentFraming && (
              <p className="mb-5 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 px-4 py-3 text-sm leading-6 text-jung-dark">
                {intentFraming.line}
              </p>
            )}
            <LockedPremiumPreview
              results={results}
              dominantLabel={dominantLabel}
              inferiorLabel={inferiorLabel}
              intendedTier={intendedTier}
              onUnlock={openUpgradeCheckout}
              onViewSampleReport={viewSampleReport}
              checkoutOpeningTier={checkoutOpeningTier}
              checkoutError={checkoutError}
            />

          </>
        )}

        <p className="figure-label mb-5 mt-10">Part 03 — Share, save, and next steps</p>

        <section className="mb-8 overflow-hidden rounded-lg border border-jung-border bg-jung-surface shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1fr_28rem]">
            <div className="p-5 sm:p-6">
              <p className="text-label">Compare maps</p>
              <h2 className="mt-2 text-2xl font-semibold text-jung-dark">Invite {REFERRAL_INVITE_GOAL} people who would actually compare maps.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-jung-secondary">
                Your axis is {dominantLabel} to {inferiorLabel}. A shared result gives them a concrete starting point before they take the free assessment.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ['1', 'Share your map'],
                  ['2', 'Ask for their axis'],
                  ['3', 'Compare stress edges'],
                ].map(([step, label]) => (
                  <div key={step} className="rounded-lg border border-jung-border bg-jung-base px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-jung-muted">Step {step}</p>
                    <p className="mt-1 text-sm font-semibold text-jung-dark">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-jung-border bg-jung-base p-5 sm:p-6 lg:border-l lg:border-t-0">
              <div className="flex items-center gap-2 text-sm font-semibold text-jung-dark">
                <Sparkles className="h-4 w-4 text-jung-accent" />
                Ready-to-send invite
              </div>
              <p className="mt-3 text-sm leading-6 text-jung-secondary">
                Start with your result, then let them bring their own map back to the same conversation.
              </p>
              {shareUrl && (
                <a className="mt-3 block break-all text-xs leading-5 text-jung-accent hover:underline" href={shareUrl}>
                  {shareUrl}
                </a>
              )}
              {shareLinkState === 'error' && !shareUrl && (
                <p className="mt-3 text-xs leading-5 text-error">
                  The compare page could not be created, so the invite will use the free assessment link instead.
                </p>
              )}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={() => shareAssessmentInvite('results_compare_banner')}
                  disabled={isPreparingReferral}
                  leftIcon={isPreparingReferral ? <Loader2 className="h-4 w-4 animate-spin" /> : inviteCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                >
                  {isPreparingReferral ? 'Preparing invite' : inviteCopied ? 'Invite copied' : 'Share invite'}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={copyResultSummary}
                  disabled={isPreparingReferral}
                  leftIcon={isPreparingReferral ? <Loader2 className="h-4 w-4 animate-spin" /> : summaryCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                >
                  {isPreparingReferral ? 'Preparing link' : summaryCopied ? 'Summary copied' : 'Copy summary'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {isPremium && (
          <section id="premium-report" className="mt-8 rounded-lg border border-jung-accent-muted bg-jung-surface p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-label">Unlocked report</p>
                <h2 className="mt-2 text-heading text-3xl text-jung-dark">
                  Your full {tier || 'Premium'} interpretation
                </h2>
              </div>
              <span className="w-fit rounded-lg bg-jung-accent-light px-3 py-2 text-xs font-semibold text-jung-accent">
                {hasVerifiedCheckoutSession ? 'Stripe session verified' : 'Account access verified'}
              </span>
            </div>

            {isLoadingPremium && (
              <div className="flex items-center gap-3 rounded-lg border border-jung-border bg-jung-base p-4 text-sm text-jung-secondary">
                <Loader2 className="h-4 w-4 animate-spin text-jung-accent" />
                Generating the full premium report.
              </div>
            )}

            {!isLoadingPremium && premiumError && (
              <div role="alert" className="rounded-lg border border-jung-border bg-jung-base p-5 text-sm leading-6 text-jung-secondary">
                <h3 className="text-base font-semibold text-jung-dark">Your report could not be completed yet</h3>
                <p className="mt-2">{premiumError}</p>
                <p className="mt-2">You do not need to buy again or retake the assessment. Your free map and Type Depth Guide are still available.</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button
                    variant="accent"
                    disabled={!premiumAnalysisInput}
                    onClick={() => premiumAnalysisInput && fetchPremiumAnalysis(premiumAnalysisInput)}
                    leftIcon={<RefreshCcw className="h-4 w-4" />}
                  >
                    Try my report again
                  </Button>
                  <a className="inline-flex min-h-11 items-center px-2 font-semibold text-jung-accent hover:underline" href={`mailto:${SUPPORT_EMAIL}?subject=Help%20with%20my%20paid%20TypeJung%20report`}>
                    Get help or request a refund
                  </a>
                </div>
              </div>
            )}

            {!isLoadingPremium && !premiumError && premiumReportSections.length > 0 && (
              <div className="grid gap-4 lg:grid-cols-2">
                {premiumReportSections.map((section) => (
                  <article key={section.key} className="rounded-lg border border-jung-border bg-jung-base p-5">
                    <h3 className="text-lg font-semibold text-jung-dark">{section.title}</h3>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-jung-secondary">{section.body}</p>
                  </article>
                ))}
              </div>
            )}

            {!isLoadingPremium && !premiumError && premiumReportSections.length === 0 && (
              <p className="rounded-lg border border-jung-border bg-jung-base p-4 text-sm leading-6 text-jung-secondary">
                Your paid access is active. The full report will appear here when the analysis is available.
              </p>
            )}
          </section>
        )}

        <section className="mt-8 grid gap-5 lg:grid-cols-3 lg:items-start">
          <div className="rounded-lg border border-jung-border bg-jung-surface p-6">
            <p className="text-label">Account</p>
            <h2 className="mt-3 text-2xl font-semibold text-jung-dark">Save this result</h2>
            <div className="mt-4 text-sm leading-7 text-jung-secondary">
              {authLoading && 'Checking your session.'}
              {!authLoading && !user && 'Create a compare link without signing in, or sign in if you want this result saved to account history and restored across devices.'}
              {isAuthenticated && saveState === 'saving' && 'Saving this result to your account history.'}
              {isAuthenticated && saveState === 'saved' && 'Saved to your account history.'}
              {isAuthenticated && saveState === 'error' && 'The result is ready, but it could not be saved to your account right now.'}
            </div>
            <div className="mt-5 flex flex-col gap-3">
              {!authLoading && !user && (
                <Button variant="outline" onClick={() => navigate('/auth')} leftIcon={<LogIn className="h-4 w-4" />}>
                  Sign in
                </Button>
              )}
              {isAuthenticated && (
                <Button variant="outline" onClick={() => navigate('/history')} leftIcon={saveState === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}>
                  Open history
                </Button>
              )}
              <div className="rounded-lg border border-jung-border bg-jung-base p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-jung-dark">
                  <Share2 className="h-4 w-4 text-jung-accent" />
                  Send the test to someone
                </div>
                <p className="mt-2 text-xs leading-5 text-jung-secondary">
                  If this map felt accurate, send the free assessment to three people who would want to compare their own result.
                </p>
                <Button
                  variant="accent"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => shareAssessmentInvite('results_invite_card')}
                  disabled={isPreparingReferral}
                  leftIcon={isPreparingReferral ? <Loader2 className="h-4 w-4 animate-spin" /> : inviteCopied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                >
                  {isPreparingReferral ? 'Preparing invite' : inviteCopied ? 'Copied invite' : 'Share free assessment'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={copyResultSummary}
                  disabled={isPreparingReferral}
                  leftIcon={isPreparingReferral ? <Loader2 className="h-4 w-4 animate-spin" /> : summaryCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                >
                  {isPreparingReferral ? 'Preparing link' : summaryCopied ? 'Summary copied' : 'Copy result summary'}
                </Button>
              </div>
              {!shareUrl && (
                <div className="rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-jung-dark">
                    <Link2 className="h-4 w-4 text-jung-accent" />
                    Create a compare link
                  </div>
                  <p className="mt-2 text-xs leading-5 text-jung-secondary">
                    Generate an unlisted share page for this map so someone can put their result beside yours. Anyone with the link can view it, so do not share it if you want the result kept private.
                  </p>
                  <Button
                    variant="accent"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => createShareLink('results_account_card')}
                    disabled={shareLinkState === 'creating'}
                    leftIcon={shareLinkState === 'creating' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                  >
                    {shareLinkState === 'creating' ? 'Creating link' : 'Create compare link'}
                  </Button>
                  {shareLinkState === 'error' && (
                    <p className="mt-2 text-xs leading-5 text-error">
                      The share link could not be created. Try again, or use the invite copy above.
                    </p>
                  )}
                </div>
              )}
              {shareUrl && (
                <div className="rounded-lg border border-jung-border bg-jung-base p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-jung-dark">
                    <Share2 className="h-4 w-4 text-jung-accent" />
                    Launch-ready share link
                  </div>
                  <a className="mt-3 block break-all text-xs leading-5 text-jung-accent hover:underline" href={shareUrl}>
                    {shareUrl}
                  </a>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <Button variant="outline" size="sm" onClick={copyShareUrl} leftIcon={shareCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}>
                      {shareCopied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openShareWindow('twitter')}>
                      Share on X
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openShareWindow('linkedin')}>
                      LinkedIn
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-jung-border bg-jung-surface p-6">
            <p className="text-label">First read</p>
            <h2 className="mt-3 text-2xl font-semibold text-jung-dark">Pattern synthesis</h2>
            {isLoadingFree ? (
              <div className="mt-5 flex items-center gap-3 text-sm text-jung-secondary">
                <Loader2 className="h-4 w-4 animate-spin text-jung-accent" />
                Generating a live synthesis.
              </div>
            ) : freeAnalysis ? (
              <p className="mt-4 text-sm leading-7 text-jung-secondary">{freeAnalysis}</p>
            ) : (
              <p className="mt-4 text-sm leading-7 text-jung-secondary">
                {freeError ? `Pattern synthesis unavailable: ${freeError}` : 'A short synthesis will appear here when it is ready.'}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-jung-border bg-jung-surface p-6">
            <p className="text-label">Paid report</p>
            <h2 className="mt-3 text-2xl font-semibold text-jung-dark">{isPremium ? `${tier} access` : 'Detailed report'}</h2>
            {premiumLoading ? (
              <div className="mt-5 flex items-center gap-3 text-sm text-jung-secondary">
                <Loader2 className="h-4 w-4 animate-spin text-jung-accent" />
                Checking premium status.
              </div>
            ) : isPremium && (isAuthenticated || hasVerifiedCheckoutSession) ? (
              <div className="mt-4 text-sm leading-7 text-jung-secondary">
                {isLoadingPremium && 'Generating premium analysis.'}
                {premiumAnalysis?.overview || premiumAnalysis?.growth || (premiumError
                  ? `Premium analysis unavailable: ${premiumError}`
                  : 'Premium status is active. Your deeper report APIs are available.')}
                {!isAuthenticated && (
                  <p className="mt-4 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4 text-xs leading-5 text-jung-secondary">
                    This paid report is unlocked in this browser. Sign in with the Stripe purchase email to save access across devices{hasMasteryAccess ? ' and use the AI Type Guide' : ''}.
                  </p>
                )}
              </div>
            ) : isPremium ? (
              <div className="mt-4 text-sm leading-7 text-jung-secondary">
                Your paid status is active in this browser. Sign in with the purchase email to save the unlock to your account{hasMasteryAccess ? ' and use the AI Type Guide across devices' : ' and restore the report across devices'}.
              </div>
            ) : (
              <>
                <p className="mt-4 text-sm leading-7 text-jung-secondary">
                  Your free score map is complete. {primaryUpgradeOption.label} adds ten personalized interpretation sections rather than repeating the hierarchy you already saw.
                </p>
                <div className="mt-5 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-jung-dark px-2.5 py-1 text-xs font-semibold text-white">
                      10 personalized sections
                    </span>
                    <span className="rounded-lg bg-jung-surface px-2.5 py-1 text-xs font-semibold text-jung-accent">
                      {paidTierPrice(primaryUpgradeOption.tier)} one-time
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-jung-dark">
                    {primaryUpgradeOption.label}: the interpretation behind this map
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-jung-secondary">
                    {primaryUpgradeOption.preview}
                  </p>
                  <div className="mt-4 grid gap-2">
                    {primaryUpgradeOption.features.map((feature) => (
                      <div key={feature} className="flex min-h-11 items-center gap-2 rounded-lg border border-jung-accent-muted bg-jung-surface px-3 py-2 text-xs font-semibold text-jung-secondary">
                        <Check className="h-3.5 w-3.5 flex-none text-jung-accent" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="accent"
                    size="lg"
                    className="mt-4 w-full"
                    onClick={() => openUpgradeCheckout(primaryUpgradeOption.tier, 'results_paid_report_card')}
                    disabled={checkoutOpeningTier === primaryUpgradeOption.tier}
                    rightIcon={checkoutOpeningTier === primaryUpgradeOption.tier
                      ? <Loader2 className="h-5 w-5 animate-spin" />
                      : <ArrowRight className="h-5 w-5" />}
                  >
                    {checkoutOpeningTier === primaryUpgradeOption.tier
                      ? 'Opening secure Stripe'
                      : `Get my report - ${paidTierPrice(primaryUpgradeOption.tier)}`}
                  </Button>
                  {checkoutError && (
                    <p className="mt-3 rounded-lg border border-error/30 bg-error/5 p-3 text-xs leading-5 text-error" role="alert">
                      {checkoutError} Your result is safe. Try again.
                    </p>
                  )}
                  <p className="mt-3 text-xs leading-5 text-jung-muted">
                    The next click opens secure Stripe directly. One-time CAD, 7-day guarantee, no subscription.
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-2 w-full"
                    onClick={() => viewSampleReport('results_paid_report_card')}
                    leftIcon={<FileText className="h-4 w-4" />}
                  >
                    View the sample first
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-3">
          {[
            ['How to read this result', 'The percentages are not fixed traits. They are a map of where this assessment found habitual energy, stress vulnerability, body signal, and attitude direction.'],
            ['Why the inferior matters', 'The inferior function is usually less differentiated, so it often appears through stress, projection, attraction, embarrassment, or body symptoms before it becomes conscious skill.'],
            ['What to do next', 'Use the developmental edge as a practice target, then reassess later. The goal is not to change labels but to see whether energy distribution becomes more flexible.'],
          ].map(([title, body]) => (
            <details key={title} className="rounded-lg border border-jung-border bg-jung-surface p-5">
              <summary className="flex min-h-11 cursor-pointer list-none items-center text-base font-semibold text-jung-dark">{title}</summary>
              <p className="mt-3 text-sm leading-6 text-jung-secondary">{body}</p>
            </details>
          ))}
        </section>
      </div>
      {!premiumLoading && !isPremium && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-jung-border bg-jung-surface/95 shadow-[0_-12px_32px_rgba(41,28,18,0.14)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-screen-sm items-center gap-3 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-5 text-jung-dark">
                10-section {intendedTierName} report — {paidTierPrice(intendedTier)}
              </p>
              <p className="mt-0.5 text-xs leading-4 text-jung-muted">
                7-day guarantee ·{' '}
                <button
                  type="button"
                  onClick={() => viewSampleReport('results_mobile_sticky')}
                  className="link-ink -my-3.5 inline-block py-3.5 font-semibold text-jung-secondary underline-offset-2 transition hover:text-jung-accent"
                >
                  See sample
                </button>
              </p>
            </div>
            <Button
              variant="accent"
              size="sm"
              className="min-h-11 flex-none"
              onClick={() => openUpgradeCheckout(intendedTier, 'results_mobile_sticky')}
              disabled={checkoutOpeningTier === intendedTier}
              rightIcon={checkoutOpeningTier === intendedTier
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <ArrowRight className="h-4 w-4" />}
            >
              {checkoutOpeningTier === intendedTier ? 'Opening' : 'Get report'}
            </Button>
          </div>
        </div>
      )}
      {isAuthenticated && hasMasteryAccess && chatProfile && <ChatBot userProfile={chatProfile} />}
    </div>
  );
};
