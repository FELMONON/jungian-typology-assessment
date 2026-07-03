import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  Check,
  Compass,
  FileText,
  Heart,
  MessageCircle,
  Sparkles,
  Target,
} from 'lucide-react';
import { DiscountCaptureCard } from '../components/discount/DiscountCaptureCard';
import { Button } from '../components/ui/Button';
import { discountedPriceLabel, EMAIL_CAPTURE_OFFER } from '../data/discount';
import { DEBRIEF_OFFER } from '../data/debrief';
import { PRICING, type PaidTierId } from '../data/pricing';
import { ATTITUDE_LABELS, FUNCTION_LABELS } from '../data/depthAssessment';
import { PAGE_SEO, useSEO } from '../hooks/useSEO';
import { AnalyticsEvents, trackEvent } from '../lib/analytics';
import { pathWithSource } from '../lib/acquisition-source';
import { writeUpgradeIntent } from '../lib/upgrade-intent';
import { STORAGE_KEYS } from '../lib/validation';
import { DepthAssessmentResult, isDepthAssessmentResult } from '../utils/depthScoring';

const SAMPLE_FUNCTIONS = [
  { code: 'Ti', name: 'Introverted Thinking', score: 88, note: 'tests ideas for clean internal structure' },
  { code: 'Ne', name: 'Extraverted Intuition', score: 74, note: 'opens alternatives and edge cases quickly' },
  { code: 'Si', name: 'Introverted Sensation', score: 57, note: 'checks whether a pattern has held up before' },
  { code: 'Fe', name: 'Extraverted Feeling', score: 34, note: 'becomes loudest when approval, belonging, or tone feels unsafe' },
];

const INSIGHT_SECTIONS = [
  {
    icon: Compass,
    eyebrow: 'Insight report',
    title: 'Developmental edge',
    body:
      'This INTP sample suggests a person who trusts precise internal structure first, then reaches for shared feeling and social repair only when pressure rises. The report names where inferior Fe can become useful practice instead of embarrassment or self-criticism.',
    bullets: [
      'Notice when precision becomes a shield against being affected.',
      'Name one value or relational need before explaining the whole model.',
      'Treat the inferior function as a training edge, not a flaw.',
    ],
  },
  {
    icon: Target,
    eyebrow: 'Insight report',
    title: 'Stress pattern map',
    body:
      'Under load, the fictional INTP profile may move from calm analysis into sudden sensitivity to tone, approval, exclusion, or being misunderstood. The paid report turns that pattern into concrete signals to watch.',
    bullets: [
      'Early signal: rehearsing the perfect explanation before naming the feeling.',
      'Mid signal: reading neutral feedback as rejection or social judgment.',
      'Repair signal: ask one direct relational question before withdrawing.',
    ],
  },
  {
    icon: Heart,
    eyebrow: 'Insight report',
    title: 'Relationship-pattern reflection',
    body:
      'The sample explains how the Ti-Fe axis can show up in conflict: wanting clean distinctions while also feeling exposed when the room asks for warmth, reassurance, or faster emotional response.',
    bullets: [
      'Translate the thought into one human-facing sentence.',
      'Separate a real objection from a tone-based threat response.',
      'Ask what repair is needed before defending the conclusion.',
    ],
  },
  {
    icon: FileText,
    eyebrow: 'Insight report',
    title: 'Practice plan',
    body:
      'The report closes with a small practice sequence. For this fictional INTP map, the first step is not a full personality overhaul. It is a repeatable way to keep thought precise while letting feeling stay in the room.',
    bullets: [
      'Write one claim, one piece of evidence, and one limitation.',
      'Name one value or impact before continuing the analysis.',
      'Make one repair attempt while the conversation is still workable.',
    ],
  },
];

const COACH_MESSAGES = [
  {
    speaker: 'You',
    text: 'I get cold or overly explanatory when someone says I sound dismissive. What should I practice?',
  },
  {
    speaker: 'AI Type Guide',
    text:
      'Start with a bridge sentence: "I am trying to be precise, not dismissive. What part landed badly?" That keeps Ti online while giving Fe a direct repair channel.',
  },
  {
    speaker: 'AI Type Guide',
    text:
      'For the next week, pick one conversation per day where you answer with one distinction, one value, and one question about the other person\'s experience.',
  },
];

const CTA_LOCATION = 'sample_report';
const INSIGHT_PRICE = discountedPriceLabel(PRICING.insight.amount);
const MASTERY_PRICE = discountedPriceLabel(PRICING.mastery.amount);

const readSavedDepthResult = (): DepthAssessmentResult | null => {
  if (typeof window === 'undefined') return null;

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || 'null');
    return isDepthAssessmentResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const SampleReport: React.FC = () => {
  const navigate = useNavigate();
  const [savedResult] = useState(readSavedDepthResult);

  useSEO(PAGE_SEO.sampleReport);

  const resultContext = useMemo(() => {
    if (!savedResult) return null;

    const inferiorPosition = savedResult.hierarchy.find((item) => item.position === 'inferior');
    return {
      dominantLabel: `${ATTITUDE_LABELS[savedResult.attitude.dominant]} ${FUNCTION_LABELS[savedResult.dominant]}`,
      inferiorLabel: `${ATTITUDE_LABELS[inferiorPosition?.attitude ?? 'extraverted']} ${FUNCTION_LABELS[savedResult.inferior]}`,
      reliabilityLabel: savedResult.reliability.label,
    };
  }, [savedResult]);

  useEffect(() => {
    if (!savedResult || !resultContext) return;

    const viewedKey = `typejung_sample_report_result_context_${savedResult.completedAt}`;
    try {
      if (sessionStorage.getItem(viewedKey)) return;
      sessionStorage.setItem(viewedKey, 'true');
    } catch {
      // If sessionStorage is unavailable, still track the visible context.
    }

    trackEvent('sample_report_result_context_viewed', {
      source: 'sample_report',
      dominant_channel: savedResult.dominant,
      inferior_channel: savedResult.inferior,
      reliability: resultContext.reliabilityLabel,
    });
  }, [resultContext, savedResult]);

  const startAssessment = (location: string) => {
    const destination = pathWithSource('/assessment', location);
    AnalyticsEvents.ctaClicked('start_assessment', location, {
      buttonText: 'Start free assessment',
      destination,
    });
    navigate(destination);
  };

  const getPaidReport = (tier: PaidTierId, location: string) => {
    const hasResults = typeof window !== 'undefined' && Boolean(localStorage.getItem(STORAGE_KEYS.RESULTS));
    const price = tier === 'insight' ? INSIGHT_PRICE : MASTERY_PRICE;
    const destination = hasResults
      ? pathWithSource(`/checkout/${tier}`, location, { result_context: 'local_result' })
      : pathWithSource('/assessment', location, { tier });

    AnalyticsEvents.ctaClicked(`get_${tier}_report`, location, {
      buttonText: `Get my ${PRICING[tier].name} report - ${price}`,
      destination,
      tier,
    });

    if (hasResults) {
      AnalyticsEvents.upgradeClicked(location, tier);
      trackEvent('sample_report_checkout_clicked', {
        tier,
        source: location,
        result_context: 'local_result',
        dominant_channel: savedResult?.dominant || 'unknown',
        inferior_channel: savedResult?.inferior || 'unknown',
        reliability: savedResult?.reliability.label || 'unknown',
      });
      navigate(destination);
      return;
    }

    writeUpgradeIntent(tier, location);
    navigate(destination);
  };

  const getInsightReport = (location: string) => {
    getPaidReport('insight', location);
  };

  const getMasteryReport = (location: string) => {
    getPaidReport('mastery', location);
  };

  const getContextInsightReport = () => {
    const destination = pathWithSource('/checkout/insight', 'sample_report_result_context', {
      result_context: 'local_result',
    });

    AnalyticsEvents.upgradeClicked('sample_report_result_context', 'insight');
    AnalyticsEvents.ctaClicked('get_context_insight_report', 'sample_report_result_context', {
      buttonText: `Get Insight for my map - ${INSIGHT_PRICE}`,
      destination,
      tier: 'insight',
    });
    trackEvent('sample_report_context_checkout_clicked', {
      tier: 'insight',
      dominant_channel: savedResult?.dominant || 'unknown',
      inferior_channel: savedResult?.inferior || 'unknown',
      reliability: savedResult?.reliability.label || 'unknown',
    });

    navigate(destination);
  };

  const getContextMasteryReport = () => {
    const destination = pathWithSource('/checkout/mastery', 'sample_report_result_context', {
      result_context: 'local_result',
    });

    AnalyticsEvents.upgradeClicked('sample_report_result_context', 'mastery');
    AnalyticsEvents.ctaClicked('get_context_mastery_report', 'sample_report_result_context', {
      buttonText: `Get Mastery for my map - ${MASTERY_PRICE}`,
      destination,
      tier: 'mastery',
    });
    trackEvent('sample_report_context_checkout_clicked', {
      tier: 'mastery',
      dominant_channel: savedResult?.dominant || 'unknown',
      inferior_channel: savedResult?.inferior || 'unknown',
      reliability: savedResult?.reliability.label || 'unknown',
    });
    navigate(destination);
  };

  return (
    <div className="min-h-screen bg-jung-base pb-28 md:pb-0">
      <section className="section-rule py-10 lg:py-16">
        <div className="editorial-container grid gap-10 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="text-label">Sample report</p>
            <h1 className="mt-4 text-display text-5xl text-jung-dark sm:text-6xl">
              Preview the paid depth before you buy.
            </h1>
            <p className="mt-5 text-body-lg text-jung-secondary">
              This fictional INTP sample shows how TypeJung turns a function-stack map into stress-pattern reflection, relationship-pattern reflection, practices, and follow-up prompts.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="accent"
                size="lg"
                onClick={() => getInsightReport('sample_report_hero')}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Get my Insight report - {INSIGHT_PRICE}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => startAssessment('sample_report_hero')}
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Start free assessment
              </Button>
            </div>
            <p className="mt-3 text-xs leading-5 text-jung-muted">
              No result yet? Insight stays selected while you complete the free map first.
            </p>
            {resultContext && (
              <div className="mt-6 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-5 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-lg bg-jung-surface px-3 py-1.5 text-xs font-semibold text-jung-accent">
                  <Check className="h-3.5 w-3.5" />
                  Your free map is ready
                </div>
                <h2 className="mt-4 text-2xl font-semibold leading-tight text-jung-dark">
                  Use the sample to decide on your {resultContext.dominantLabel} to {resultContext.inferiorLabel} report.
                </h2>
                <p className="mt-3 text-sm leading-6 text-jung-secondary">
                  The sample shows the format. Your paid report would apply that depth to the axis from your own free map.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-jung-border bg-jung-surface p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">Dominant</p>
                    <p className="mt-1 text-sm font-semibold text-jung-dark">{resultContext.dominantLabel}</p>
                  </div>
                  <div className="rounded-lg border border-jung-border bg-jung-surface p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">Growth edge</p>
                    <p className="mt-1 text-sm font-semibold text-jung-dark">{resultContext.inferiorLabel}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={getContextInsightReport}
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Get Insight - {INSIGHT_PRICE}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={getContextMasteryReport}
                  >
                    Get Mastery - {MASTERY_PRICE}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-jung-border bg-jung-base p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">Insight</p>
                <p className="mt-2 text-2xl font-semibold text-jung-dark">{discountedPriceLabel(PRICING.insight.amount)}</p>
                <p className="mt-1 text-xs leading-5 text-jung-secondary">
                  <span className="line-through">{PRICING.insight.price}</span> before {EMAIL_CAPTURE_OFFER.code}. Depth report, stress-pattern map, relationship-pattern reflection, practices, plus the 15-page Function Stack in Depth guide (PDF).
                </p>
              </div>
              <div className="rounded-lg border border-jung-border bg-jung-base p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">Mastery</p>
                <p className="mt-2 text-2xl font-semibold text-jung-dark">{discountedPriceLabel(PRICING.mastery.amount)}</p>
                <p className="mt-1 text-xs leading-5 text-jung-secondary">
                  <span className="line-through">{PRICING.mastery.price}</span> before {EMAIL_CAPTURE_OFFER.code}. Insight plus AI guide and practice tools.
                </p>
              </div>
            </div>
            <Link
              to="/debrief"
              onClick={() => trackEvent('debrief_cta_clicked', { source: 'sample_report_debrief' })}
              className="flex items-center justify-between gap-3 rounded-lg border border-jung-border bg-jung-base p-4 transition hover:border-jung-accent-muted"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">Personal Type Debrief</p>
                <p className="mt-1 text-xs leading-5 text-jung-secondary">
                  Prefer a human read? Founder-reviewed breakdown within {DEBRIEF_OFFER.deliveryHours}h — {DEBRIEF_OFFER.price}.
                </p>
              </div>
              <ArrowRight className="h-4 w-4 flex-none text-jung-accent" />
            </Link>
            <div className="rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4 shadow-sm">
              <DiscountCaptureCard
                source="sample_report_email_code"
                compact
                minimal
                minimalTitle="Email yourself the sample path"
                minimalDescription={`Keep the ${EMAIL_CAPTURE_OFFER.code} code and a link back to the free assessment. Use it only if your own map makes Insight worth unlocking.`}
                minimalSubmitLabel="Email code"
                minimalFootnote="One email with the code and next step. No subscription, no spam."
                minimalSentMessage="Code sent. The email brings you back through the free assessment with Insight ready."
                preferredTier="insight"
                showCheckoutButtons={false}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-container py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="text-label">Fictional result context</p>
            <h2 className="mt-3 text-heading text-4xl text-jung-dark">The report starts from the map you already saw.</h2>
            <p className="mt-4 text-sm leading-7 text-jung-secondary">
              In this sample, the free map points to a strong Ti-Ne pattern with Fe pressure. The paid report does not replace the map. It explains what the map may mean in daily life.
            </p>
          </div>

          <div className="grid gap-3">
            {SAMPLE_FUNCTIONS.map((item) => (
              <div key={item.code} className="rounded-lg border border-jung-border bg-jung-surface p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-jung-dark">
                      {item.code} - {item.name}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-jung-muted">{item.note}</p>
                  </div>
                  <p className="text-sm font-semibold text-jung-accent">{item.score}/100</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-jung-surface-alt">
                  <div className="h-full rounded-full bg-jung-accent" style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-jung-border bg-jung-surface py-10 lg:py-14">
        <div className="editorial-container">
          <div className="max-w-2xl">
            <p className="text-label">Inside Insight</p>
            <h2 className="mt-3 text-heading text-4xl text-jung-dark">A deeper read, written for practical use.</h2>
            <p className="mt-4 text-sm leading-7 text-jung-secondary">
              Insight is meant to answer the question behind the scores: what pattern is this pointing at, where does it tighten, and what should I try next?
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {INSIGHT_SECTIONS.map(({ icon: Icon, eyebrow, title, body, bullets }) => (
              <article key={title} className="rounded-lg border border-jung-border bg-jung-base p-5 sm:p-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-jung-accent">
                  <Icon className="h-4 w-4" />
                  {eyebrow}
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-jung-dark">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-jung-secondary">{body}</p>
                <ul className="mt-5 grid gap-3">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-6 text-jung-secondary">
                      <Check className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-lg border border-jung-border bg-jung-base p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-jung-dark">Want this style of report for your own result?</p>
              <p className="mt-1 text-xs leading-5 text-jung-secondary">
                Insight is {INSIGHT_PRICE} with {EMAIL_CAPTURE_OFFER.code} applied on Stripe.
              </p>
            </div>
            <Button
              variant="accent"
              size="md"
              onClick={() => getInsightReport('sample_report_insight_section')}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Get Insight - {INSIGHT_PRICE}
            </Button>
          </div>
        </div>
      </section>

      <section className="editorial-container py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="text-label">Mastery sample</p>
            <h2 className="mt-3 text-heading text-4xl text-jung-dark">Mastery adds a guide loop after the report.</h2>
            <p className="mt-4 text-sm leading-7 text-jung-secondary">
              Mastery is for people who want to keep working with the result after reading it. The AI Type Guide uses the result context to suggest reflection prompts and practice next steps.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                'Ask follow-up questions about your mapped pattern.',
                'Turn report language into a weekly practice plan.',
                'Revisit the result when a stress pattern shows up again.',
              ].map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6 text-jung-secondary">
                  <Sparkles className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-jung-accent-light px-3 py-2 text-sm font-semibold text-jung-accent">
              <Brain className="h-4 w-4" />
              AI Type Guide sample
            </div>
            {COACH_MESSAGES.map((message) => (
              <div
                key={message.text}
                className={`rounded-lg border p-4 shadow-sm ${
                  message.speaker === 'You'
                    ? 'border-jung-border bg-jung-surface'
                    : 'border-jung-accent-muted bg-jung-accent-light/70'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {message.speaker}
                </div>
                <p className="mt-3 text-sm leading-6 text-jung-secondary">{message.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-jung-dark py-12 lg:py-16">
        <div className="editorial-container grid gap-8 text-white lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-white/60">Ready to see your own map?</p>
            <h2 className="mt-3 text-heading text-4xl text-white">Start free, then decide from your actual result.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Insight and Mastery unlock after you can see whether the free assessment feels useful. No card is needed for the free map.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button
              variant="inverted"
              size="lg"
              onClick={() => getInsightReport(`${CTA_LOCATION}_final`)}
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Get Insight - {INSIGHT_PRICE}
            </Button>
            <Button
              variant="accent"
              size="lg"
              onClick={() => getMasteryReport(`${CTA_LOCATION}_final`)}
              rightIcon={<ArrowRight className="h-5 w-5" />}
            >
              Get Mastery - {MASTERY_PRICE}
            </Button>
          </div>
        </div>
      </section>

      <section className="editorial-container py-8">
        <p className="text-xs leading-5 text-jung-muted">
          TypeJung is for reflection and self-understanding, not medical, therapeutic, hiring, or diagnostic decision-making. See the{' '}
          <Link className="font-semibold text-jung-accent hover:text-jung-accent-hover" to="/terms">
            Terms
          </Link>{' '}
          and{' '}
          <Link className="font-semibold text-jung-accent hover:text-jung-accent-hover" to="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-jung-border bg-jung-surface/95 shadow-[0_-12px_32px_rgba(41,28,18,0.14)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-screen-sm gap-2 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-jung-dark">
                {savedResult ? `Unlock your ${FUNCTION_LABELS[savedResult.inferior].toLowerCase()} edge - ${INSIGHT_PRICE}` : `Free map first - Insight is ${INSIGHT_PRICE}`}
              </p>
              <p className="mt-0.5 text-xs leading-4 text-jung-muted">
                {savedResult ? 'Your map is ready. 7-day guarantee.' : 'See your result before checkout. No subscription.'}
              </p>
            </div>
            <Button
              variant="accent"
              size="sm"
              className="flex-none"
              onClick={() => (savedResult ? getInsightReport('sample_report_mobile_sticky') : startAssessment('sample_report_mobile_sticky'))}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {savedResult ? 'Unlock' : 'Start free'}
            </Button>
          </div>
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {(savedResult ? ['Your map', 'Edge', 'Practice'] : ['Free result', 'Sample first', 'No card']).map((item) => (
              <span key={item} className="inline-flex min-h-7 items-center gap-1 rounded-lg border border-jung-border bg-jung-base px-2 text-[11px] font-semibold text-jung-muted">
                <Check className="h-3 w-3 text-jung-accent" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
