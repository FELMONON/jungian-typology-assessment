import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Eye,
  FileText,
  Lock,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Button } from '../components/ui/Button';
import { FunctionAtlas } from '../components/home/FunctionAtlas';
import { FunctionRadial } from '../components/home/FunctionRadial';
import { PRICING } from '../data/pricing';
import type { PaidTierId, PricingTierId } from '../data/pricing';
import { discountedPriceLabel, EMAIL_CAPTURE_OFFER } from '../data/discount';
import { DEBRIEF_OFFER } from '../data/debrief';
import { AnalyticsEvents, trackEvent } from '../lib/analytics';
import { pathWithSource } from '../lib/acquisition-source';
import { writeUpgradeIntent } from '../lib/upgrade-intent';
import { STORAGE_KEYS } from '../lib/validation';
import { isDepthAssessmentResult } from '../utils/depthScoring';
import { PAGE_SEO, useSEO } from '../hooks/useSEO';

const DiscountCaptureCard = lazy(() => import('../components/discount/DiscountCaptureCard').then(({ DiscountCaptureCard }) => ({ default: DiscountCaptureCard })));

// Single source of truth for the price shown to users: the post-code amount
// charged at checkout (TYPEJUNG30 applied before Stripe). Keeps homepage copy
// consistent with the discounted "today" framing used on every other page.
const INSIGHT_PRICE_TODAY = discountedPriceLabel(PRICING.insight.amount);
const DEBRIEF_PRICE = DEBRIEF_OFFER.price;

const sampleProfile = [
  { name: 'Ti', label: 'Thinking inward', value: 82, role: 'Dominant' },
  { name: 'Ne', label: 'Possibility scanning', value: 71, role: 'Auxiliary' },
  { name: 'Si', label: 'Memory and pattern recall', value: 58, role: 'Support' },
  { name: 'Te', label: 'External structure', value: 54, role: 'Available' },
  { name: 'Ni', label: 'Long-range synthesis', value: 49, role: 'Available' },
  { name: 'Se', label: 'Present contact', value: 44, role: 'Pressure' },
  { name: 'Fi', label: 'Personal value signal', value: 38, role: 'Quiet' },
  { name: 'Fe', label: 'Interpersonal attunement', value: 24, role: 'Inferior' },
];

type PublicStats = {
  assessmentCount: number | null;
  paidReportCount: number | null;
  payingCustomerCount: number | null;
  updatedAt: string;
};

const formatProofNumber = (value: number | null | undefined, fallback: string) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return fallback;
  if (value >= 1000) return `${Math.floor(value / 100) / 10}k+`;
  if (value >= 100) return `${Math.floor(value / 10) * 10}+`;
  return String(value);
};

const diagnosticSignals = [
  {
    label: 'Likely stack hypothesis',
    value: 'Ti-Ne',
    note: 'A working pattern, not a costume or final identity claim.',
  },
  {
    label: 'Dominant -> inferior edge',
    value: 'Ti to Fe',
    note: 'Where precision tightens into social pressure.',
  },
  {
    label: 'Upgrade trigger',
    value: 'After result',
    note: 'Paid depth appears when the free map has context.',
  },
];

const steps = [
  ['01', 'Answer the assessment', 'Move through 42 prompts about attention, stress, decisions, and relationships.'],
  ['02', 'Read the free function-stack map', 'Get your full function pattern, dominant-inferior axis, and a plain-language summary.'],
  ['03', 'Upgrade for depth', 'Unlock guided interpretation, growth practices, and the AI Type Guide when useful.'],
];

const painPaths = [
  {
    eyebrow: 'Changing result',
    title: '“My MBTI keeps changing.”',
    body: 'Start with the free map. The goal is not another label — it is seeing which function pattern keeps producing the confusion.',
    cta: 'Map the pattern',
    source: 'home_path_changing_type',
  },
  {
    eyebrow: 'Mistype tension',
    title: '“I am stuck between two types.”',
    body: 'Take the map first. If the result still feels hard to interpret, use the Personal Type Debrief for a human second read.',
    cta: 'Start free, then compare',
    source: 'home_path_stuck_between_types',
  },
  {
    eyebrow: 'Stress edge',
    title: '“I want to know what happens under pressure.”',
    body: 'TypeJung reads the dominant-inferior axis so your result points to the edge that tends to tighten under stress.',
    cta: 'Find the stress edge',
    source: 'home_path_stress_edge',
  },
];

const reportQuestions = [
  'Your developmental edge starts from the dominant-inferior axis in your actual scores.',
  'Your stress pattern is framed as concrete signals, not vague type lore.',
  'Relationship reflection translates the map into conflict and repair patterns.',
  'Practice prompts turn the result into one thing to test this week.',
  'The Function Stack in Depth: a 15-page theory guide (PDF) comes with every report.',
];

const lockedPreview = [
  {
    title: 'Developmental edge',
    unlocked:
      'Strong Ti can protect clarity by staying detached. Growth starts when precision can name impact without losing rigor.',
    locked: 'The full report ties this to your inferior-function pressure, repair pattern, and first practice.',
  },
  {
    title: 'Stress pattern',
    unlocked:
      'The Ti -> Fe edge often shows up as suddenly reading tone, approval, or exclusion as more dangerous than the actual facts.',
    locked: 'Unlock the detailed map of early, middle, and repair signals for your own score pattern.',
  },
];

const searchPathCards = [
  {
    href: '/jungian-cognitive-functions-test',
    eyebrow: 'Main test page',
    title: 'Jungian cognitive functions test',
    description: 'Start here if you want the full Ni, Ne, Si, Se, Ti, Te, Fi, and Fe map.',
  },
  {
    href: '/cognitive-function-test',
    eyebrow: 'High-impression query',
    title: 'Cognitive function test',
    description: 'A direct entry for people searching for a test that measures all eight functions.',
  },
  {
    href: '/inferior-function-test',
    eyebrow: 'Stress pattern',
    title: 'Inferior function test',
    description: 'Use this when your search is about grip stress, pressure, or the weak edge of type.',
  },
  {
    href: '/best-cognitive-functions-test',
    eyebrow: 'Comparison intent',
    title: 'Best cognitive functions test',
    description: 'Compare TypeJung with Sakinorva, Keys2Cognition, and other function tests.',
  },
  {
    href: '/mbti-test-alternative',
    eyebrow: 'Switching from MBTI',
    title: 'MBTI test alternative',
    description: 'For people whose four-letter label keeps changing and who want the function pattern.',
  },
  {
    href: '/guides',
    eyebrow: 'All public guides',
    title: 'Browse the TypeJung guides',
    description: 'Find type comparisons, function guides, MBTI alternatives, and stress-pattern pages.',
  },
];

type HomePricingTier = {
  id: PricingTierId;
  name: string;
  price: string;
  originalPrice?: string;
  priceNote?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

const pricingTiers: HomePricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: PRICING.free.price,
    description: 'Take the full assessment and decide from the function-stack map.',
    features: ['42 questions', 'Eight-function map', 'Dominant-inferior axis', 'No card required'],
    cta: 'Start free',
  },
  {
    id: 'insight',
    name: PRICING.insight.name,
    price: discountedPriceLabel(PRICING.insight.amount),
    originalPrice: PRICING.insight.price,
    priceNote: `${EMAIL_CAPTURE_OFFER.code} auto-applies on Stripe`,
    description: 'Add ten personalized interpretation sections that start where the free map stops.',
    features: ['10 report sections', 'Grip and recovery', 'Relationship + work patterns', 'Type Depth Guide (PDF)'],
    cta: `View Insight — ${discountedPriceLabel(PRICING.insight.amount)}`,
    highlighted: true,
  },
  {
    id: 'mastery',
    name: PRICING.mastery.name,
    price: discountedPriceLabel(PRICING.mastery.amount),
    originalPrice: PRICING.mastery.price,
    priceNote: `${EMAIL_CAPTURE_OFFER.code} auto-applies on Stripe`,
    description: 'Use the report with guided follow-up support.',
    features: ['Everything in Insight', 'AI Type Guide', 'Growth exercises', 'Individuation roadmap'],
    cta: `View Mastery — ${discountedPriceLabel(PRICING.mastery.amount)}`,
  },
];

const hasValidLocalResult = (): boolean => {
  if (typeof window === 'undefined') return false;

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || 'null');
    return isDepthAssessmentResult(parsed);
  } catch {
    return false;
  }
};

const faqs = [
  {
    question: 'Is this just another MBTI test?',
    answer:
      'No. TypeJung does not stop at a four-letter label. It maps all eight functions and shows the dominant-inferior tension behind the result.',
  },
  {
    question: 'Do I need to pay first?',
    answer:
      'No. The full assessment starts free. Paid reports are optional upgrades after you have seen whether the free map feels useful.',
  },
  {
    question: 'Is this clinical or diagnostic?',
    answer:
      'No. TypeJung is an educational self-reflection tool. It is meant to help you observe patterns, not diagnose a condition.',
  },
  {
    question: 'How long does it take?',
    answer:
      'Most people should set aside about 20 to 25 minutes. Progress saves on this device, so you can pause and return without losing your answers.',
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [hasLocalResults] = useState(hasValidLocalResult);
  const [showMobileCta, setShowMobileCta] = useState(false);
  const [publicStats, setPublicStats] = useState<PublicStats | null>(null);

  useSEO(PAGE_SEO.home);

  useEffect(() => {
    trackEvent('home_wedge_viewed', {
      source: 'home',
      promise: 'mbti_alternative_function_stack',
      version: '2026_06_remake',
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/leaderboard')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (cancelled || !data) return;
        const assessmentCount = typeof data.total === 'number' ? data.total : null;
        setPublicStats({
          assessmentCount,
          paidReportCount: null,
          payingCustomerCount: null,
          updatedAt: new Date().toISOString(),
        });
        trackEvent('home_public_stats_loaded', {
          has_assessment_count: typeof assessmentCount === 'number',
          has_paid_report_count: false,
        });
      })
      .catch(() => {
        // Social proof is additive; the page should never depend on this request.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Reveal the persistent mobile CTA once the hero button has scrolled away,
  // so the primary action is always one tap from the free map on mobile.
  useEffect(() => {
    const onScroll = () => setShowMobileCta(window.scrollY > 520);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const startAssessment = (location: string) => {
    const destination = pathWithSource('/assessment', location);
    trackEvent('assessment_start_intent', {
      source: location,
      promise: 'mbti_alternative_function_stack',
    });
    AnalyticsEvents.ctaClicked('start_assessment', location, {
      buttonText: 'Get my free map',
      destination,
    });
    navigate(destination);
  };

  const continuePaidTier = (tier: PaidTierId) => {
    const source = `home_pricing_${tier}`;
    writeUpgradeIntent(tier, source);
    trackEvent('upgrade_intent_saved', {
      source,
      tier,
      has_local_results: hasLocalResults,
    });

    const pricingDestination = `${pathWithSource('/pricing', source, { tier })}#plans`;
    const destination = hasLocalResults
      ? pathWithSource(`/checkout/${tier}`, source, { tier })
      : pricingDestination;

    AnalyticsEvents.ctaClicked(hasLocalResults ? `unlock_${tier}` : `view_${tier}_pricing`, 'home_pricing_section', {
      buttonText: pricingTiers.find((item) => item.id === tier)?.cta || `View ${PRICING[tier].name}`,
      destination,
      tier,
    });
    AnalyticsEvents.upgradeClicked('home_pricing_section', tier);
    trackEvent(hasLocalResults ? 'home_result_checkout_clicked' : 'home_pricing_paid_tier_clicked', {
      source,
      tier,
      has_local_results: hasLocalResults,
      destination: hasLocalResults ? 'checkout_review' : 'pricing_plans',
    });
    navigate(destination);
  };

  const viewSampleReport = (location: string) => {
    const destination = pathWithSource('/sample-report', location);
    AnalyticsEvents.ctaClicked('view_sample_report', location, {
      buttonText: 'View sample report',
      destination,
    });
    navigate(destination);
  };

  const trackGuideClick = (href: string, title: string) => {
    trackEvent('home_seo_path_clicked', {
      source: 'home_search_paths',
      destination: href,
      title,
    });
  };

  const proofMetrics = [
    {
      value: formatProofNumber(publicStats?.assessmentCount, '20+'),
      label: 'cognitive-function maps generated',
      note: 'all eight functions, every map',
    },
    {
      value: 'Free',
      label: 'result before any paywall',
      note: 'no card to see your map',
    },
    {
      value: '7 days',
      label: 'money-back guarantee',
      note: 'one-time CAD, no subscription',
    },
  ];

  return (
    <ErrorBoundary>
      <div className="relative overflow-hidden pb-20 md:pb-0">
        <section className="relative border-b border-jung-border-light bg-jung-base">
          <div className="lab-container grid gap-8 py-8 md:py-10 lg:grid-cols-[0.86fr_1fr] lg:items-center lg:py-5">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex min-h-8 items-center gap-2 rounded-lg border border-jung-border bg-jung-surface px-3 text-xs font-semibold text-jung-secondary shadow-sm">
                  <BarChart3 className="h-3.5 w-3.5 text-jung-accent" />
                  <span className="sm:hidden">Free map</span>
                  <span className="hidden sm:inline">Free function-stack map</span>
                </span>
                <span className="inline-flex min-h-8 items-center gap-2 rounded-lg bg-jung-accent-light px-3 text-xs font-semibold text-jung-accent">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="sm:hidden">No card first</span>
                  <span className="hidden sm:inline">No card before results</span>
                </span>
              </div>

              <h1 className="reveal reveal-1 max-w-4xl text-balance font-display text-[34px] font-semibold leading-[0.98] tracking-[-0.015em] text-jung-dark sm:text-5xl lg:text-[72px]">
                Your MBTI keeps changing because the label is hiding the pattern.
              </h1>

              <p className="reveal reveal-2 mt-4 max-w-2xl text-[15px] leading-6 text-jung-secondary md:text-lg md:leading-8">
                TypeJung maps all 8 cognitive functions, your dominant-inferior axis, and the stress edge behind your result.
                Take the free 42-question assessment first. Upgrade only if the map explains something real.
              </p>
              <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-jung-dark">
                Stop retaking tests. Read the function pattern that keeps creating the confusion.
              </p>

              <div className="reveal reveal-3 mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => startAssessment('home_hero')}
                  variant="accent"
                  size="lg"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                  className="w-full sm:w-auto"
                >
                  Get my free map
                </Button>
                <Button
                  onClick={() => viewSampleReport('home_hero')}
                  variant="inverted"
                  size="lg"
                  className="w-full border border-jung-border sm:w-auto"
                  rightIcon={<FileText className="h-4 w-4" />}
                >
                  View paid sample
                </Button>
              </div>
              <p className="mt-3 text-sm leading-6 text-jung-muted">
                42 prompts, usually 20-25 minutes. Progress saves on this device. No card before the free result.
              </p>

              <div className="reveal reveal-4 mt-6 grid max-w-2xl gap-2 sm:grid-cols-3" aria-label="TypeJung early proof metrics">
                {proofMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-jung-border bg-jung-surface p-3 shadow-sm">
                    <p className="font-display text-3xl font-semibold leading-none text-jung-dark">{metric.value}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.08em] text-jung-secondary">{metric.label}</p>
                    <p className="mt-1 text-[11px] leading-4 text-jung-muted">{metric.note}</p>
                  </div>
                ))}
              </div>

              <div className="reveal reveal-5 mt-8 rounded-lg border border-jung-dark bg-jung-dark p-3 text-white shadow-lg shadow-jung-dark/10 lg:hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-white/50">Mobile result preview</p>
                    <h2 className="mt-1 font-display text-2xl font-semibold text-white">Free map, then locked depth.</h2>
                  </div>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-jung-dark">
                    <Eye className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-4 grid gap-2">
                  {sampleProfile.slice(0, 2).map((fn) => (
                    <div key={fn.name} className="rounded-lg border border-white/10 bg-white/10 p-2.5">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white font-display italic text-jung-accent">
                            {fn.name}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{fn.label}</p>
                            <p className="text-xs text-white/50">{fn.role}</p>
                          </div>
                        </div>
                        <span className="font-mono text-sm text-white">{fn.value}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-lg bg-white/10">
                        <div className="h-full rounded-lg bg-jung-accent-muted" style={{ width: `${fn.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-lg bg-jung-surface p-3 text-jung-dark">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase text-jung-muted">
                    <Lock className="h-3.5 w-3.5 text-jung-accent" />
                    Paid preview
                  </div>
                  <p className="mt-2 text-sm leading-6 text-jung-secondary">
                    Developmental edge: Strong Ti can protect clarity by staying detached...
                    <span className="ml-1 text-jung-muted blur-[2px]">full stress map unlocks after review.</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mandala-backdrop reveal reveal-2 hidden rounded-lg border border-jung-dark bg-jung-dark p-2.5 text-white shadow-xl shadow-jung-dark/20 lg:block">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3.5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="figure-label !text-white/55">Fig. 01 — Product preview</p>
                    <h2 className="mt-1 font-display text-3xl font-semibold text-white">
                      What the result page feels like
                    </h2>
                  </div>
                  <span className="inline-flex min-h-8 items-center gap-2 rounded-lg bg-white px-3 text-xs font-semibold text-jung-dark">
                    <Eye className="h-3.5 w-3.5" />
                    Before paywall
                  </span>
                </div>

                <div className="grid gap-2 md:grid-cols-3">
                  {diagnosticSignals.map((signal) => (
                    <div key={signal.label} className="rounded-lg border border-white/10 bg-white/10 px-3 py-2.5">
                      <p className="text-[11px] font-semibold uppercase text-white/50">
                        {signal.label}
                      </p>
                      <p className="mt-1 font-display text-xl font-semibold text-white">{signal.value}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/60">{signal.note}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
                  <div className="rounded-lg border border-white/10 bg-jung-surface p-2.5">
                    <div className="mx-auto w-full max-w-[200px]">
                      <FunctionRadial
                        data={sampleProfile.map(({ name, label, value }) => ({ name, label, value }))}
                        size={228}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase text-white/50">
                      Top signals
                    </p>
                    {sampleProfile.slice(0, 3).map((fn) => (
                      <div key={fn.name} className="rounded-lg border border-white/10 bg-white/10 p-2">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white font-display text-sm italic text-jung-accent shadow-sm">
                              {fn.name}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-white">{fn.label}</p>
                              <p className="text-xs text-white/50">{fn.role}</p>
                            </div>
                          </div>
                          <span className="font-mono text-sm text-white">{fn.value}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-lg bg-white/10">
                          <div className="h-full rounded-lg bg-jung-accent-muted" style={{ width: `${fn.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-jung-border bg-jung-surface p-3.5 text-jung-dark">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase text-jung-muted">Locked paid depth</p>
                      <h3 className="mt-1 font-display text-xl font-semibold">Preview first, then open secure checkout.</h3>
                      <p className="mt-1 max-w-lg text-sm leading-6 text-jung-secondary">
                        The results page shows a real excerpt from your developmental edge and stress pattern before the {INSIGHT_PRICE_TODAY} Stripe step.
                      </p>
                    </div>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent">
                      <Lock className="h-4 w-4" />
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-jung-border-light pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-jung-secondary">
                      This is the paywall moment: personalized preview first, then one click to secure Stripe at {INSIGHT_PRICE_TODAY}.
                    </p>
                    <Button
                      onClick={() => viewSampleReport('home_hero_locked_preview')}
                      variant="accent"
                      size="sm"
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      See sample
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <section className="border-b border-jung-border-light bg-jung-base py-10 lg:py-14">
          <div className="lab-container">
            <div className="mb-7 max-w-3xl">
              <p className="figure-label">Fig. 02 — Choose your path</p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-jung-dark md:text-5xl">
                Start from the problem that brought you here.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-jung-secondary">
                Different searches need different next steps. TypeJung keeps the first move the same: free map first, then the right interpretation path.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {painPaths.map((path) => (
                <article key={path.title} className="flex min-h-full flex-col rounded-lg border border-jung-border bg-jung-surface p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-jung-muted">{path.eyebrow}</p>
                  <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-jung-dark">{path.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-jung-secondary">{path.body}</p>
                  <Button
                    onClick={() => startAssessment(path.source)}
                    variant="primary"
                    size="md"
                    className="mt-5 w-full"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    {path.cta}
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-jung-base py-12 lg:py-20">
          <div className="lab-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="figure-label">Fig. 03 — How it works</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight text-jung-dark md:text-5xl">
                A clear path from curiosity to usable insight.
              </h2>
            </div>
            <div className="grid gap-4">
              {steps.map(([number, title, description]) => (
                <div key={number} className="rounded-lg border border-jung-border bg-white p-5 shadow-sm">
                  <div className="flex gap-4">
                    <span className="mt-1 font-mono text-xs font-semibold text-jung-accent">{number}</span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-jung-dark">{title}</h3>
                      <p className="mt-2 text-sm leading-7 text-jung-secondary">{description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FunctionAtlas
          figure="Fig. 04"
          onStart={() => startAssessment('home_function_atlas')}
          onGuideClick={() => trackGuideClick('/cognitive-functions', 'Jungian cognitive functions guide')}
        />

        <section className="border-b border-jung-border-light bg-jung-base py-12 lg:py-16">
          <div className="lab-container">
            <div className="mb-8 grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <p className="figure-label">Fig. 05 — Search paths</p>
                <h2 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight text-jung-dark md:text-5xl">
                  Pick the guide closest to the question you searched.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-jung-secondary">
                  TypeJung has public pages for the main search paths: cognitive-function tests,
                  Jungian alternatives, inferior-function stress, and common comparison questions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => startAssessment('home_search_paths')}
                className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full bg-jung-dark px-5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-jung-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jung-accent"
              >
                Start with the free map
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-jung-border bg-jung-surface shadow-sm">
              {searchPathCards.map((card, index) => (
                <a
                  key={card.href}
                  href={card.href}
                  onClick={() => trackGuideClick(card.href, card.title)}
                  className="group grid items-center gap-x-6 gap-y-1 border-b border-jung-border-light px-5 py-4 transition-colors last:border-b-0 hover:bg-jung-accent-light/60 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-jung-accent sm:grid-cols-[2.25rem_minmax(0,0.9fr)_minmax(0,1.1fr)_auto] sm:px-6"
                >
                  <span className="hidden font-mono text-xs font-semibold text-jung-subtle sm:block">
                    0{index + 1}
                  </span>
                  <span className="flex flex-col gap-0.5">
                    <span className="text-mono text-[10px] font-medium uppercase tracking-[0.14em] text-jung-muted">
                      {card.eyebrow}
                    </span>
                    <span className="font-display text-xl font-semibold leading-tight text-jung-dark sm:text-2xl">
                      {card.title}
                    </span>
                  </span>
                  <span className="hidden text-sm leading-6 text-jung-secondary md:block">
                    {card.description}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-jung-accent sm:mt-0">
                    <span className="sm:hidden">Open guide</span>
                    <span className="hidden sm:inline">Open</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-jung-border-light bg-white py-12 lg:py-20">
          <div className="lab-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent">
                <FileText className="h-5 w-5" />
              </div>
              <p className="figure-label">Fig. 06 — Paid report preview</p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight text-jung-dark md:text-5xl">
                The upgrade has to earn its place.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-jung-secondary">
                Insight and Mastery are not a second test. They explain the result you already saw:
                the edge, stress pattern, relationship reflection, and next practice.
              </p>
              <Button
                onClick={() => viewSampleReport('home_paid_preview')}
                variant="secondary"
                size="md"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                className="mt-7"
              >
                View sample report
              </Button>
            </div>

            <div className="rounded-lg border border-jung-dark bg-jung-dark p-3 text-white shadow-lg shadow-jung-dark/10">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 md:p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-white/50">Insight report preview</p>
                    <h3 className="mt-1 font-display text-3xl font-semibold text-white">Locked, but specific.</h3>
                  </div>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-jung-dark">
                    <Lock className="h-4 w-4" />
                  </span>
                </div>

                <div className="grid gap-3">
                  {lockedPreview.map((item) => (
                    <div key={item.title} className="rounded-lg border border-white/10 bg-white/10 p-4">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/75">{item.unlocked}</p>
                      <p className="mt-2 select-none text-xs leading-5 text-white/45 blur-[2px]">
                        {item.locked}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg bg-jung-surface p-4 text-jung-dark">
                  <p className="text-xs font-semibold uppercase text-jung-muted">What unlocks</p>
                  <div className="mt-3 grid gap-3">
                    {reportQuestions.map((question) => (
                      <div key={question} className="flex items-start gap-3 text-sm leading-6 text-jung-secondary">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-jung-accent" />
                        <span>{question}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="border-b border-jung-border-light bg-white py-12 lg:py-20">
          <div className="lab-container">
            <div className="mb-10 max-w-2xl">
              <p className="figure-label">Fig. 07 — Pricing</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-jung-dark md:text-5xl">
                Buy the interpretation only if the free map makes sense.
              </h2>
              <p className="mt-4 text-sm leading-6 text-jung-muted">
                One-time CAD payments · 7-day money-back guarantee · Secure Stripe checkout
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {pricingTiers.map((tier) => {
                const highlighted = tier.highlighted;
                return (
                  <div
                    key={tier.id}
                    className={`relative flex flex-col rounded-lg border p-6 shadow-sm ${
                      highlighted
                        ? 'border-jung-accent bg-jung-accent text-white shadow-jung-accent/20'
                        : 'border-jung-border bg-jung-base text-jung-dark'
                    }`}
                  >
                    {highlighted && (
                      <span className="absolute right-5 top-5 rounded-full bg-white/14 px-3 py-1 text-xs font-semibold">
                        Recommended
                      </span>
                    )}
                    <h3 className="font-display text-3xl font-semibold">{tier.name}</h3>
                    <p className={`mt-2 text-sm ${highlighted ? 'text-white/76' : 'text-jung-secondary'}`}>
                      {tier.description}
                    </p>
                    <div className="mt-7 flex items-end gap-2">
                      <span className="font-display text-4xl font-semibold sm:text-5xl">{tier.price}</span>
                      <span className={`mb-2 text-xs font-semibold ${highlighted ? 'text-white/60' : 'text-jung-muted'}`}>
                        {tier.id === 'free' ? 'to start' : 'one-time'}
                      </span>
                    </div>
                    {tier.originalPrice && (
                      <p className={`mt-2 text-xs leading-5 ${highlighted ? 'text-white/70' : 'text-jung-muted'}`}>
                        List price <span className="line-through">{tier.originalPrice}</span> — {tier.priceNote}.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        tier.id === 'free'
                          ? startAssessment('home_pricing_free')
                          : continuePaidTier(tier.id)
                      }
                      className={`mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-5 text-sm font-semibold transition-all ${
                        highlighted
                          ? 'bg-white text-jung-accent hover:bg-white/92'
                          : tier.id === 'free'
                            ? 'border border-jung-border bg-jung-surface text-jung-dark hover:border-jung-accent hover:text-jung-accent'
                            : 'bg-jung-dark text-white hover:bg-jung-accent'
                      }`}
                    >
                      {tier.id === 'free' ? 'Get my free map' : tier.cta}
                    </button>
                    <ul className={`mt-7 space-y-3 border-t pt-6 ${highlighted ? 'border-white/16' : 'border-jung-border'}`}>
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <Check className={`mt-0.5 h-4 w-4 shrink-0 ${highlighted ? 'text-white' : 'text-jung-accent'}`} />
                          <span className={highlighted ? 'text-white/90' : 'text-jung-secondary'}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <Suspense fallback={<div className="mx-auto mt-8 min-h-[180px] max-w-3xl rounded-lg border border-jung-border bg-jung-surface" aria-hidden="true" />}>
              <DiscountCaptureCard source="home_pricing_section" compact className="mx-auto mt-8 max-w-3xl" />
            </Suspense>
          </div>
        </section>

        <section className="border-b border-jung-border-light bg-jung-base py-10 lg:py-14">
          <div className="lab-container">
            <div className="grid gap-6 rounded-lg border border-jung-accent-muted bg-jung-accent-light/60 p-6 shadow-sm md:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-jung-surface px-3 py-1.5 text-xs font-semibold text-jung-accent">
                  <UserCheck className="h-3.5 w-3.5" />
                  Human-reviewed option
                </span>
                <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-jung-dark md:text-4xl">
                  Still stuck after the map?
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-jung-secondary">
                  Most people only need the free result or Insight. But if you are still stuck between two types,
                  the Personal Type Debrief gives you a founder-reviewed read of your map, likely mistypes, and stress edge.
                </p>
                <p className="mt-2 text-xs leading-5 text-jung-muted">
                  {DEBRIEF_PRICE}, one-time CAD. Limited to 5 per week. Educational self-reflection, not a clinical assessment.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[25rem]">
                <Button
                  onClick={() => {
                    trackEvent('debrief_cta_clicked', { source: 'home_debrief_section' });
                    navigate(pathWithSource('/debrief', 'home_debrief_section'));
                  }}
                  variant="accent"
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Get a debrief — {DEBRIEF_PRICE}
                </Button>
                <Button
                  onClick={() => startAssessment('home_debrief_section_free_map')}
                  variant="ghost"
                  size="md"
                >
                  Take free map first
                </Button>
              </div>
            </div>
          </div>
        </section>


        <section className="bg-jung-base py-12 lg:py-20">
          <div className="lab-container grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <p className="figure-label">Fig. 08 — Before you start</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-jung-dark md:text-5xl">
                Straight answers, no personality-test hype.
              </h2>
            </div>
            <div className="divide-y divide-jung-border overflow-hidden rounded-lg border border-jung-border bg-white">
              {faqs.map((faq, index) => {
                const open = openFaq === index;
                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : index)}
                      className="flex w-full items-start justify-between gap-5 px-5 py-5 text-left transition-colors hover:bg-jung-surface-alt"
                      aria-expanded={open}
                    >
                      <span className="font-display text-xl font-semibold text-jung-dark">{faq.question}</span>
                      <ChevronDown className={`mt-1 h-5 w-5 shrink-0 text-jung-muted transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>
                    {open && (
                      <div className="px-5 pb-6">
                        <p className="max-w-2xl text-sm leading-7 text-jung-secondary">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-jung-accent py-12 text-white lg:py-16">
          <div className="lab-container flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">
                <Lock className="h-3.5 w-3.5" />
                Private by default
              </div>
              <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight md:text-5xl">
                Take the assessment before you decide anything.
              </h2>
              <p className="mt-4 max-w-xl text-white/74">
                You will know quickly whether the function-stack map gives you something more precise
                than another type label.
              </p>
              <p className="mt-5 max-w-xl font-display text-lg font-semibold italic text-white/90">
                Stop collecting labels. Read the pattern. Work with the stress edge.
              </p>
            </div>
            <button
              type="button"
              onClick={() => startAssessment('home_final_cta')}
              className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-jung-accent transition-transform hover:-translate-y-0.5"
            >
              Get my free map
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>

      {/* Persistent mobile CTA: keeps the free-first action reachable on the
          main entry page, matching the result/sample/checkout pages. */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-jung-border bg-jung-surface/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_32px_rgba(41,28,18,0.14)] backdrop-blur transition-all duration-300 md:hidden ${
          showMobileCta ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-5 text-jung-dark">Free map first</p>
            <p className="text-xs leading-4 text-jung-muted">No card before results</p>
          </div>
          <Button
            onClick={() => startAssessment('home_sticky_mobile')}
            variant="accent"
            size="md"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="shrink-0"
          >
            Get my free map
          </Button>
        </div>
      </div>
    </ErrorBoundary>
  );
};
