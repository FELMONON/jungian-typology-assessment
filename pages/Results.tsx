import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Copy, CreditCard, Download, FileText, Link2, Loader2, Lock, LogIn, RefreshCcw, Save, Share2, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { ChatBot } from '../components/ChatBot';
import { DiscountCaptureCard } from '../components/discount/DiscountCaptureCard';
import { Button } from '../components/ui/Button';
import { ATTITUDE_LABELS, AttitudeDirection, FUNCTION_LABELS, FunctionChannel, depthLayerMeta } from '../data/depthAssessment';
import { discountedPriceLabel, EMAIL_CAPTURE_OFFER } from '../data/discount';
import { DEBRIEF_OFFER } from '../data/debrief';
import { readAssessmentIntent, INTENT_RESULT_FRAMING } from '../lib/assessment-intent';
import { PRICING, type PaidTierId } from '../data/pricing';
import { SUPPORT_EMAIL } from '../data/support';
import { useAiAnalysis, type AnalysisInput, type PremiumAnalysis } from '../hooks/use-ai-analysis';
import { useAuth } from '../hooks/use-auth';
import { usePremiumStatus } from '../hooks/use-premium-status';
import { AnalyticsEvents, trackEvent } from '../lib/analytics';
import { pathWithSource, readAcquisitionSource } from '../lib/acquisition-source';
import { resultUpgradeContextFromSource, type ResultUpgradeContext } from '../lib/result-upgrade-context';
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
    description: 'Best when you want the deeper report after the free map feels accurate.',
    features: ['Developmental edge', 'Stress-pattern map', 'Practice prompts'],
    preview: 'Unlocks a detailed interpretation of your inferior-function edge, stress-pattern reflection, and practice prompts.',
  },
  {
    tier: 'mastery',
    label: 'Mastery',
    description: 'Best when you want the report plus AI Type Guide reflection prompts and exercises.',
    features: ['Everything in Insight', 'AI Type Guide', 'Practice roadmap'],
    preview: 'Adds guide questions, tailored exercises, and a roadmap for working with the result over time.',
  },
];

const paidTierPrice = (tier: PaidTierId) => discountedPriceLabel(PRICING[tier].amount);

const premiumReportSectionConfig: Array<{ key: keyof PremiumAnalysis; title: string }> = [
  { key: 'overview', title: 'Overview' },
  { key: 'functionAnalysis', title: 'Function analysis' },
  { key: 'archetypes', title: 'Archetypal pattern' },
  { key: 'theGrip', title: 'Grip and stress pattern' },
  { key: 'relationships', title: 'Relationships' },
  { key: 'career', title: 'Work and vocation' },
  { key: 'individuation', title: 'Individuation path' },
  { key: 'shadow', title: 'Shadow material' },
  { key: 'growth', title: 'Growth practices' },
  { key: 'dreams', title: 'Dream and symbol lens' },
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

const axisCopy: Record<FunctionChannel, string> = {
  thinking: 'Thinking holds the most conscious energy here. Feeling is the opposite pole and the likely site of value, attachment, shame, or relational development.',
  feeling: 'Feeling holds the most conscious energy here. Thinking is the opposite pole and the likely site of clarity, precision, judgment, or intellectual development.',
  sensation: 'Sensation holds the most conscious energy here. Intuition is the opposite pole and the likely site of meaning, possibility, dread, or symbolic development.',
  intuition: 'Intuition holds the most conscious energy here. Sensation is the opposite pole and the likely site of embodiment, limits, appetite, and concrete follow-through.',
};

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

const sentenceParts = (value: string) =>
  value
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
    ?.map((part) => part.trim())
    .filter(Boolean) || [];

const previewSentences = (value: string, fallback: string, count = 2) => {
  const parts = sentenceParts(value);
  return (parts.length ? parts : [fallback]).slice(0, count);
};

const lockedSentences = (value: string, fallback: string, offset = 2) => {
  const parts = sentenceParts(value).slice(offset);
  return parts.length ? parts : [fallback];
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
}> = ({ results, dominantLabel, inferiorLabel, intendedTier, onUnlock, onViewSampleReport }) => {
  const primaryName = PRICING[intendedTier].name;
  const functionStackLabel = results.hierarchy
    .map((item) => getFunctionCode(item.channel, item.attitude))
    .join('-');
  const inferiorChannelLabel = FUNCTION_LABELS[results.inferior];
  const dominantEnergy = results.energy.find((item) => item.channel === results.dominant)?.score ?? results.hierarchy[0]?.score ?? 0;
  const inferiorEnergy = results.energy.find((item) => item.channel === results.inferior)?.score ?? results.hierarchy[3]?.score ?? 0;
  const listPrice = PRICING[intendedTier].price;
  const offerPrice = paidTierPrice(intendedTier);
  const lockedSections = [
    {
      title: 'Developmental edge',
      eyebrow: `${dominantEnergy}% dominant / ${inferiorEnergy}% edge`,
      location: 'results_premium_preview_developmental_edge',
      ctaLabel: `Unlock my edge - ${offerPrice}`,
      lockedLabel: 'Full edge locked',
      featured: true,
      proof: `Start here: this is where the ${dominantLabel} to ${inferiorLabel} map turns into a concrete practice target.`,
      visibleLines: previewSentences(
        results.narrative.developmentalEdge,
        `${inferiorLabel} is the low-energy edge in this map, so the full report starts with what that function asks you to practice.`,
      ),
      lockedLines: lockedSentences(
        results.narrative.practice,
        `The full section connects that edge to a concrete weekly practice for the ${dominantLabel} to ${inferiorLabel} axis.`,
        0,
      ),
    },
    {
      title: 'Stress pattern',
      eyebrow: `${inferiorChannelLabel} under pressure`,
      location: 'results_premium_preview_stress_pattern',
      ctaLabel: `Unlock stress map - ${offerPrice}`,
      lockedLabel: 'Full stress map locked',
      featured: false,
      proof: `The full section connects the edge to the pressure loop that usually appears before behavior changes.`,
      visibleLines: previewSentences(
        results.narrative.complexVulnerability,
        `Stress is likely to collect around the ${inferiorChannelLabel.toLowerCase()} side of this result, especially when the dominant pattern has been overextended.`,
      ),
      lockedLines: lockedSentences(
        results.narrative.somaticSignature,
        `The full section names the body signal that tends to appear before the stress loop gets louder.`,
        0,
      ),
    },
    {
      title: 'Relationship repair cue',
      eyebrow: `${dominantLabel} to ${inferiorLabel}`,
      location: 'results_premium_preview_relationship_repair_cue',
      ctaLabel: `Unlock repair cue - ${offerPrice}`,
      lockedLabel: 'Full repair cue locked',
      featured: false,
      proof: 'The full section gives one repair sentence and one observation prompt tied to this stack.',
      visibleLines: [
        axisCopy[results.dominant],
        `The paid report translates that axis into the moment you are most likely to defend, withdraw, overexplain, or push for control.`,
      ],
      lockedLines: [
        `It then gives a repair sentence and one observation prompt for catching the pattern before the interaction hardens.`,
        `This part is personalized to the ${functionStackLabel} stack and ${results.reliability.label.toLowerCase()} consistency signal.`,
      ],
    },
  ];

  return (
    <section className="mb-8 overflow-hidden rounded-lg border border-jung-dark bg-jung-dark text-white shadow-xl">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="p-5 sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-jung-subtle">
            <Lock className="h-3.5 w-3.5" />
            Locked report preview
          </div>
          <h2 className="mt-4 text-heading text-3xl text-white">
            Your paid report starts inside this {functionStackLabel} result.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-white/70">
            The free map names the pattern. The locked report previews below use the actual language generated from your scores, then fades where the full interpretation continues.
          </p>

          <div className="mt-6 rounded-lg border border-jung-subtle/20 bg-white/[0.06] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-jung-subtle">Most useful first unlock</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/76">
                  Read the free map, then decide from the developmental edge. That is the section that explains why this exact inferior side matters.
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
                    className="mt-4 min-h-11 w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-jung-dark shadow-sm transition hover:-translate-y-px hover:bg-jung-subtle focus:outline-none focus:ring-2 focus:ring-white/60"
                  >
                    {section.ctaLabel}
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
                        className="min-h-11 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                      >
                        {section.ctaLabel}
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
            Your free map is already complete. Unlock the developmental edge only if this axis feels worth keeping.
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
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Unlock my edge - {offerPrice}
          </Button>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold text-jung-secondary">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-jung-accent" />7-day money-back</span>
            <span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-jung-accent" />One-time, no subscription</span>
            <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-jung-accent" />Secure via Stripe</span>
          </div>
          <button
            type="button"
            onClick={() => onUnlock(intendedTier, 'results_locked_preview_price_note')}
            className="mt-3 w-full rounded-lg border border-jung-border bg-jung-base px-3 py-2 text-xs font-semibold text-jung-secondary transition hover:border-jung-accent hover:text-jung-accent"
          >
            Continue to review the price before Stripe
          </button>
          <p className="mt-3 text-xs leading-5 text-jung-muted">
            {listPrice} before {EMAIL_CAPTURE_OFFER.code}. You review the discounted order first; no subscription is created.
          </p>
          <button
            type="button"
            onClick={() => onViewSampleReport('results_locked_preview')}
            className="mt-4 text-xs font-semibold text-jung-accent hover:underline"
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

const UpgradeStrip: React.FC<{
  dominantLabel: string;
  inferiorLabel: string;
  intendedTier?: PaidTierId;
  upgradeContext?: ResultUpgradeContext | null;
  onUnlock: (tier: PaidTierId, location: string) => void;
  onViewSampleReport: (location: string) => void;
}> = ({ dominantLabel, inferiorLabel, intendedTier, upgradeContext, onUnlock, onViewSampleReport }) => {
  const primaryTier = intendedTier ?? 'insight';
  const secondaryTier: PaidTierId = primaryTier === 'insight' ? 'mastery' : 'insight';
  const primaryName = PRICING[primaryTier].name;
  const secondaryName = PRICING[secondaryTier].name;
  const eyebrow = upgradeContext?.eyebrow || (intendedTier ? `${primaryName} selected` : 'Your map is ready');
  const headline = upgradeContext?.headline || (intendedTier ? `Continue to ${primaryName} from your result.` : 'Unlock the meaning behind this exact pattern.');
  const body = upgradeContext?.stripBody(primaryName, dominantLabel, inferiorLabel)
    || `Your free result shows the map. ${primaryName} adds the meaning behind the ${dominantLabel} to ${inferiorLabel} pattern: stress-pattern reflection, relationship patterns, and practical next steps.`;
  const modules = [
    {
      title: 'Axis interpretation',
      body: `How the ${dominantLabel} to ${inferiorLabel} pattern can show up when the free map feels accurate but still incomplete.`,
    },
    {
      title: 'Stress and repair',
      body: `What tends to pull ${dominantLabel} into ${inferiorLabel} pressure, plus the early signals and repair moves to watch.`,
    },
    {
      title: 'Practice plan',
      body: 'Concrete prompts for work, conflict, relationships, and self-observation so the result becomes usable.',
    },
  ];
  const reportQuestions = [
    `What does my ${dominantLabel} lead actually mean in daily decisions?`,
    `Where does ${inferiorLabel} pressure make my behavior look inconsistent?`,
    'Which relationship and work patterns should I watch first?',
    'What should I practice this week so the map turns into action?',
  ];

  return (
    <section className="mb-10 overflow-hidden rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_25rem]">
        <div>
          <div className="p-5 sm:p-7">
            <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-jung-surface px-3 py-1.5 text-xs font-semibold text-jung-accent">
              <Sparkles className="h-3.5 w-3.5" />
              {eyebrow}
            </div>
            <h2 className="text-heading text-2xl text-jung-dark sm:text-3xl">
              {headline}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-jung-secondary">
              {body}
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {modules.map((module, index) => (
                <div key={module.title} className="rounded-lg border border-jung-border bg-jung-surface p-4">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-jung-accent-light text-xs font-semibold text-jung-accent">
                    {index + 1}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-jung-dark">{module.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-jung-secondary">{module.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg border border-jung-border bg-jung-surface p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-jung-dark">Questions the paid report answers</p>
                  <p className="mt-1 text-xs leading-5 text-jung-muted">
                    Use this only if the free map feels worth keeping.
                  </p>
                </div>
                <span className="w-fit rounded-lg bg-jung-accent-light px-2.5 py-1 text-xs font-semibold text-jung-accent">
                  Built from this result
                </span>
              </div>
              <ul className="mt-4 grid gap-2 text-sm leading-6 text-jung-secondary sm:grid-cols-2">
                {reportQuestions.map((question) => (
                  <li key={question} className="flex min-w-0 gap-2">
                    <Check className="mt-1 h-3.5 w-3.5 flex-none text-jung-accent" />
                    <span className="min-w-0">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-jung-muted">
              {[`${EMAIL_CAPTURE_OFFER.code} auto-applied`, 'One-time CAD purchase', 'No subscription', '7-day guarantee'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-lg border border-jung-border bg-jung-surface px-3 py-1.5">
                  <Check className="h-3.5 w-3.5 text-jung-accent" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-jung-accent-muted bg-jung-surface p-5 sm:p-6 lg:border-l lg:border-t-0">
          <p className="text-label">Recommended next step</p>
          <h3 className="mt-2 text-heading text-2xl text-jung-dark">
            {primaryName} - {paidTierPrice(primaryTier)}
          </h3>
          <p className="mt-2 text-xs leading-5 text-jung-muted">
            <span className="line-through">{PRICING[primaryTier].price}</span> before {EMAIL_CAPTURE_OFFER.code}. Stripe applies the code before payment.
          </p>
          <div className="mt-4 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4">
            <p className="text-sm font-semibold text-jung-dark">Report starts from your axis</p>
            <p className="mt-2 text-xs leading-5 text-jung-secondary">
              {dominantLabel} to {inferiorLabel} stays visible through the paid interpretation.
            </p>
          </div>

          <Button
            variant="accent"
            size="lg"
            className="mt-5 w-full"
            onClick={() => onUnlock(primaryTier, 'results_upgrade_strip')}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Unlock my {primaryName} report
          </Button>

          <div className="mt-3 grid gap-2">
            <button
              type="button"
              onClick={() => onUnlock(secondaryTier, 'results_upgrade_strip_secondary')}
              className="min-h-11 rounded-lg border border-jung-border bg-jung-base px-4 text-sm font-semibold text-jung-secondary transition hover:border-jung-accent hover:text-jung-accent"
            >
              {secondaryName} instead - {paidTierPrice(secondaryTier)}
            </button>
            <button
              type="button"
              onClick={() => onViewSampleReport('results_upgrade_strip')}
              className="min-h-11 rounded-lg border border-jung-border bg-white px-4 text-sm font-semibold text-jung-secondary transition hover:border-jung-accent hover:text-jung-accent"
            >
              Preview before buying
            </button>
          </div>

          <DiscountCaptureCard
            source="results_upgrade_strip"
            dominantLabel={dominantLabel}
            inferiorLabel={inferiorLabel}
            compact
            minimal
            minimalTitle="Not paying right now?"
            minimalDescription={`Email the ${dominantLabel} to ${inferiorLabel} axis, the ${EMAIL_CAPTURE_OFFER.code} code, and the ${primaryName} link.`}
            minimalSubmitLabel="Email my result path"
            minimalFootnote="One email with the backup code and report link. No spam."
            minimalSentMessage={`Result path sent. The email links back to ${primaryName} with the discount ready.`}
            preferredTier={primaryTier}
            showCheckoutButtons={false}
            className="mt-5 border-t border-jung-border pt-5"
          />
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
  const referralPromptTrackedRef = useRef<string | null>(null);
  const upgradeOfferTrackedRef = useRef<string | null>(null);
  const upgradeContextTrackedRef = useRef<string | null>(null);
  const lockedPreviewTrackedRef = useRef<string | null>(null);
  const inboundSharedResultSlug = acquisition?.sharedResult && acquisition.sharedResult !== shareSlug
    ? acquisition.sharedResult
    : null;
  const intendedTier = upgradeIntent?.tier ?? 'insight';
  const intendedTierName = PRICING[intendedTier].name;
  const orderedUpgradeOptions = useMemo(() => {
    if (!upgradeIntent) return upgradeOptions;
    return [
      ...upgradeOptions.filter((option) => option.tier === upgradeIntent.tier),
      ...upgradeOptions.filter((option) => option.tier !== upgradeIntent.tier),
    ];
  }, [upgradeIntent]);
  const primaryUpgradeOption = orderedUpgradeOptions[0] ?? upgradeOptions[0];
  const secondaryUpgradeOptions = orderedUpgradeOptions.slice(1);
  const upgradeContext = useMemo(
    () => resultUpgradeContextFromSource(acquisition?.source, {
      parentSource: acquisition?.parentSource,
      utmCampaign: acquisition?.utmCampaign,
      utmSource: acquisition?.utmSource,
      sourceChain: acquisition?.sourceChain,
    }),
    [acquisition?.parentSource, acquisition?.source, acquisition?.sourceChain, acquisition?.utmCampaign, acquisition?.utmSource],
  );

  const openUpgradeCheckout = useCallback((paidTier: PaidTierId, location: string) => {
    const destination = pathWithSource(`/checkout/${paidTier}`, location);
    trackEvent('results_unlock_clicked', {
      source: location,
      tier: paidTier,
      destination,
      value: PRICING[paidTier].amount,
      currency: PRICING[paidTier].currency,
      price_cad: PRICING[paidTier].amount,
      displayed_price: PRICING[paidTier].price,
      discounted_price: paidTierPrice(paidTier),
    });
    AnalyticsEvents.upgradeClicked(location, paidTier);
    AnalyticsEvents.ctaClicked(`unlock_${paidTier}`, location, {
      buttonText: `Unlock ${PRICING[paidTier].name} - ${paidTierPrice(paidTier)}`,
      destination,
    });
    navigate(destination);
  }, [navigate]);

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
                  minimalSentMessage={`Result path sent. The email links back to ${intendedTierName} with the discount ready.`}
                  preferredTier={intendedTier}
                  showCheckoutButtons={false}
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
                  minimalSentMessage={`Result path sent. The email links back to ${intendedTierName} with the discount ready.`}
                  preferredTier={intendedTier}
                  showCheckoutButtons={false}
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
            <LockedPremiumPreview
              results={results}
              dominantLabel={dominantLabel}
              inferiorLabel={inferiorLabel}
              intendedTier={intendedTier}
              onUnlock={openUpgradeCheckout}
              onViewSampleReport={viewSampleReport}
            />

            <section className="mb-10 rounded-lg border border-jung-accent-muted bg-jung-accent-light/60 p-5 shadow-sm sm:p-6">
              <div className="mb-5 max-w-3xl">
                <p className="text-label">Choose the right next step</p>
                <h2 className="mt-2 text-2xl font-semibold text-jung-dark">Did this result settle the typing question?</h2>
                <p className="mt-2 text-sm leading-6 text-jung-secondary">
                  Your free map is complete. Use the branch that matches your actual reaction instead of buying more than you need.
                </p>
                {intentFraming && (
                  <p className="mt-3 rounded-lg border border-jung-accent-muted bg-jung-surface px-4 py-3 text-sm leading-6 text-jung-dark">
                    {intentFraming.line}
                  </p>
                )}
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                <article className="flex min-h-full flex-col rounded-lg border border-jung-border bg-jung-surface p-4">
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent">
                    <FileText className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold text-jung-dark">It helped, but I want the meaning.</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-jung-secondary">
                    Unlock Insight when the map feels accurate and you want the developmental edge, stress pattern, and practice prompts.
                  </p>
                  <Button
                    variant="accent"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => openUpgradeCheckout('insight', 'results_branch_meaning')}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Insight - {paidTierPrice('insight')}
                  </Button>
                </article>

                <article className="flex min-h-full flex-col rounded-lg border border-jung-border bg-jung-surface p-4">
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold text-jung-dark">I want to keep working with it.</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-jung-secondary">
                    Choose Mastery if you want the deeper report plus AI Type Guide, practice roadmap, and follow-up support.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => openUpgradeCheckout('mastery', 'results_branch_practice')}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Mastery - {paidTierPrice('mastery')}
                  </Button>
                </article>

                <article className="flex min-h-full flex-col rounded-lg border border-jung-accent-muted bg-jung-base p-4">
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-jung-surface text-jung-accent">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <h3 className="text-base font-semibold text-jung-dark">I am still stuck between two types.</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-jung-secondary">
                    Get a founder-reviewed Debrief when the automated map is interesting but you want a second read.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => {
                      trackEvent('debrief_cta_clicked', { source: 'results_branch_still_stuck' });
                      navigate(pathWithSource('/debrief', 'results_branch_still_stuck'));
                    }}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Debrief - {DEBRIEF_OFFER.price}
                  </Button>
                </article>
              </div>
            </section>

            <section className="mb-10 rounded-lg border border-jung-border bg-jung-surface p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-label">Prefer a human read</p>
                  <h2 className="mt-2 text-2xl font-semibold text-jung-dark">Still stuck between two types?</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-jung-secondary">
                    If you do not trust automated interpretation, get a founder-reviewed Personal Type Debrief of this
                    exact map, your likely mistypes, and your stress edge — within {DEBRIEF_OFFER.deliveryHours} hours.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-none"
                  onClick={() => {
                    trackEvent('debrief_cta_clicked', { source: 'results_still_confused' });
                    navigate('/debrief');
                  }}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Get a debrief - {DEBRIEF_OFFER.price}
                </Button>
              </div>
            </section>
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
              <div className="rounded-lg border border-error/30 bg-jung-base p-4 text-sm leading-6 text-error">
                Premium report unavailable: {premiumError}
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
                  Unlock only after the free map earns it. Paid access is a one-time CAD purchase handled by Stripe, with no hidden subscription.
                </p>
                <DiscountCaptureCard
                  source="results_paid_report_card"
                  dominantLabel={dominantLabel}
                  inferiorLabel={inferiorLabel}
                  compact
                  preferredTier={intendedTier}
                  className="mt-5"
                />
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ['Pay after value', 'Read your free map first. Upgrade only if it feels worth keeping.'],
                    ['One-time CAD', `Insight is ${paidTierPrice('insight')} and Mastery is ${paidTierPrice('mastery')} with ${EMAIL_CAPTURE_OFFER.code}. No renewal or hidden subscription.`],
                    ['7-day guarantee', `If the paid report is not useful, email ${SUPPORT_EMAIL} with your Stripe receipt within 7 days.`],
                  ].map(([label, copy]) => (
                    <div key={label} className="rounded-lg border border-jung-border bg-jung-base p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-jung-dark">
                        <Check className="h-3.5 w-3.5 text-jung-accent" />
                        {label}
                      </div>
                      <p className="mt-2 text-xs leading-5 text-jung-muted">{copy}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-jung-dark px-2.5 py-1 text-xs font-semibold text-white">
                      {upgradeIntent?.tier === primaryUpgradeOption.tier ? 'Selected path' : 'Recommended first unlock'}
                    </span>
                    <span className="rounded-lg bg-jung-surface px-2.5 py-1 text-xs font-semibold text-jung-accent">
                      {paidTierPrice(primaryUpgradeOption.tier)} one-time
                    </span>
                    <span className="rounded-lg border border-jung-accent-muted bg-jung-base px-2.5 py-1 text-xs font-semibold text-jung-muted">
                      <span className="line-through">{PRICING[primaryUpgradeOption.tier].price}</span> before code
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-jung-dark">
                    {upgradeIntent?.tier === primaryUpgradeOption.tier ? `Continue to ${primaryUpgradeOption.label}` : `Start with ${primaryUpgradeOption.label}`}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-jung-secondary">
                    {primaryUpgradeOption.preview} It opens the paid report from the {dominantLabel} to {inferiorLabel} axis already shown above.
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
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Review {primaryUpgradeOption.label} - {paidTierPrice(primaryUpgradeOption.tier)}
                  </Button>
                  <p className="mt-3 text-xs leading-5 text-jung-muted">
                    Next step is the checkout review page, then secure Stripe. 7-day guarantee, no subscription.
                  </p>
                </div>
                {secondaryUpgradeOptions.length > 0 && (
                  <div className="mt-3 divide-y divide-jung-border rounded-lg border border-jung-border bg-jung-base">
                    {secondaryUpgradeOptions.map((option) => (
                      <div key={option.tier} className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-jung-dark">{option.label}</h3>
                            <span className="rounded-lg bg-jung-accent-light px-2 py-1 text-xs font-semibold text-jung-accent">
                              {paidTierPrice(option.tier)}
                            </span>
                          </div>
                          <p className="mt-2 text-xs leading-5 text-jung-secondary">{option.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => openUpgradeCheckout(option.tier, 'results_paid_report_card_secondary')}
                          rightIcon={<ArrowRight className="h-4 w-4" />}
                        >
                          Review {option.label}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      AnalyticsEvents.ctaClicked('compare_pricing', 'results_paid_report_card', {
                        buttonText: 'Compare plans',
                        destination: '/pricing#compare',
                      });
                      navigate('/pricing#compare');
                    }}
                    leftIcon={<Sparkles className="h-4 w-4" />}
                  >
                    Compare all plans
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => viewSampleReport('results_paid_report_card')}
                    leftIcon={<FileText className="h-4 w-4" />}
                  >
                    View sample report
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="mt-8 grid gap-5 lg:grid-cols-3">
          <div className="rounded-lg border border-jung-border bg-jung-surface p-6">
            <p className="text-label">Developmental edge</p>
            <h2 className="mt-3 text-2xl font-semibold text-jung-dark">{FUNCTION_LABELS[results.inferior]} asks for development</h2>
            <p className="mt-4 text-sm leading-7 text-jung-secondary">{results.narrative.developmentalEdge}</p>
          </div>

          <div className="rounded-lg border border-jung-border bg-jung-surface p-6">
            <p className="text-label">Pressure pattern</p>
            <h2 className="mt-3 text-2xl font-semibold text-jung-dark">Where overreaction is likely</h2>
            <p className="mt-4 text-sm leading-7 text-jung-secondary">{results.narrative.complexVulnerability}</p>
          </div>

          <div className="rounded-lg border border-jung-border bg-jung-surface p-6">
            <p className="text-label">Somatic signal</p>
            <h2 className="mt-3 text-2xl font-semibold text-jung-dark">Where the body speaks</h2>
            <p className="mt-4 text-sm leading-7 text-jung-secondary">{results.narrative.somaticSignature}</p>
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-jung-border bg-jung-surface p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="text-label">Dominant-inferior tension</p>
              <h2 className="mt-3 text-heading text-3xl text-jung-dark">
                {FUNCTION_LABELS[results.dominant]} to {FUNCTION_LABELS[results.inferior]}
              </h2>
              <p className="mt-4 text-sm leading-7 text-jung-secondary">
                {axisCopy[results.dominant]}
              </p>
            </div>
            <div className="rounded-lg border border-jung-border bg-jung-base p-5">
              <p className="text-sm font-semibold text-jung-dark">Practice for this edge</p>
              <p className="mt-3 text-sm leading-7 text-jung-secondary">{results.narrative.practice}</p>
            </div>
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
                Unlock {FUNCTION_LABELS[results.inferior].toLowerCase()} edge — {paidTierPrice(intendedTier)}
              </p>
              <p className="mt-0.5 text-xs leading-4 text-jung-muted">
                7-day guarantee ·{' '}
                <button
                  type="button"
                  onClick={() => viewSampleReport('results_mobile_sticky')}
                  className="link-ink font-semibold text-jung-secondary underline-offset-2 transition hover:text-jung-accent"
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
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Unlock
            </Button>
          </div>
        </div>
      )}
      {isAuthenticated && hasMasteryAccess && chatProfile && <ChatBot userProfile={chatProfile} />}
    </div>
  );
};
