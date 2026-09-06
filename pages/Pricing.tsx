import { ArrowRight, Check, Minus, ShieldCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { discountedPriceLabel, EMAIL_CAPTURE_OFFER } from '../data/discount';
import { PRICING, type PaidTierId } from '../data/pricing';
import { SUPPORT_EMAIL } from '../data/support';
import { PAGE_SEO, useSEO } from '../hooks/useSEO';
import { pathWithSource } from '../lib/acquisition-source';
import { AnalyticsEvents, trackEvent } from '../lib/analytics';
import { writeUpgradeIntent } from '../lib/upgrade-intent';
import { isDepthAssessmentResult } from '../utils/depthScoring';

const COMPARISON_FEATURES = [
  {
    name: '42-question assessment and function map',
    free: true,
    insight: true,
    mastery: true,
  },
  {
    name: 'Ten personalized interpretation sections',
    free: false,
    insight: true,
    mastery: true,
  },
  {
    name: 'The Function Stack in Depth guide (PDF)',
    free: false,
    insight: true,
    mastery: true,
  },
  {
    name: 'AI Type Guide and practice tools',
    free: false,
    insight: false,
    mastery: true,
  },
  // prettier-ignore
  { name: 'Saved assessment history (account required)', free: true, insight: true, mastery: true },
];
const plans = [
  {
    id: 'free',
    name: 'Your free map',
    eyebrow: 'A place to begin',
    price: PRICING.free.price,
    description:
      'Find the pattern in your answers and see whether it resonates.',
    features: [
      'All 42 questions',
      'Function-stack map and growth edge',
      'Introductory interpretation',
      'No signup or card required',
    ],
  },
  {
    id: 'insight',
    name: 'Insight',
    eyebrow: 'Understand your result',
    price: discountedPriceLabel(PRICING.insight.amount),
    description: 'A personal report to connect the map to your everyday life.',
    features: [
      'Everything in your free map',
      'Ten AI-generated interpretation sections',
      'Stress, relationships, work, and growth',
      'The Function Stack in Depth guide (PDF)',
    ],
  },
] as const;

export const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [hasResults] = useState(() => {
    try {
      return isDepthAssessmentResult(
        JSON.parse(
          localStorage.getItem('jungian_assessment_results') || 'null',
        ),
      );
    } catch {
      return false;
    }
  });
  useSEO(PAGE_SEO.pricing);
  useEffect(() => {
    trackEvent('pricing_page_viewed', {
      has_local_results: hasResults,
      version: '2026_09_clarity',
    });
  }, [hasResults]);
  const choose = (tier: 'free' | PaidTierId) => {
    const source = 'pricing_tier_card';
    if (tier !== 'free') writeUpgradeIntent(tier, source);
    const destination =
      tier === 'free'
        ? pathWithSource(hasResults ? '/results' : '/assessment', source)
        : pathWithSource(
            hasResults ? `/checkout/${tier}` : '/assessment',
            source,
            { tier },
          );
    AnalyticsEvents.ctaClicked(
      tier === 'free' ? 'start_assessment' : `unlock_${tier}`,
      source,
      { destination, tier },
    );
    if (tier !== 'free') AnalyticsEvents.upgradeClicked(source, tier);
    navigate(destination);
  };
  return (
    <div className="lab-container pb-16">
      <header className="mx-auto max-w-2xl py-12 text-center sm:py-16">
        <p className="journey-eyebrow">Simple, one-time pricing</p>
        <h1 className="mt-4 font-display text-5xl leading-[1.08] sm:text-6xl">
          Your map is free.
          <br />
          <span className="font-normal italic text-jung-accent">
            The next step is yours.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-jung-secondary">
          Read your result first. Add a deeper interpretation when you want to
          explore what it could mean in your life.
        </p>
      </header>
      {hasResults && (
        <div className="mx-auto mb-6 flex max-w-4xl flex-wrap items-center justify-between gap-3 rounded-xl bg-jung-accent-light px-5 py-4 text-sm">
          <span>Your map is saved on this device.</span>
          <Link
            to="/results"
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-jung-accent"
          >
            Read my result <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
      <section
        id="plans"
        className="mx-auto grid max-w-4xl scroll-mt-28 gap-5 md:grid-cols-2"
      >
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`flex flex-col rounded-2xl border p-6 sm:p-8 ${plan.id === 'insight' ? 'border-jung-accent bg-jung-surface shadow-lg' : 'border-jung-border bg-jung-surface/60'}`}
          >
            <p className="journey-eyebrow">{plan.eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl">{plan.name}</h2>
            <p className="mt-3 min-h-12 text-sm leading-6 text-jung-secondary">
              {plan.description}
            </p>
            <p className="mt-6 font-display text-5xl">
              {plan.price}
              <span className="ml-2 font-sans text-xs text-jung-muted">
                {plan.id === 'free' ? 'always free' : 'one time · CAD'}
              </span>
            </p>
            <p className="mt-2 min-h-5 text-xs text-jung-muted">
              {plan.id === 'insight'
                ? `Current offer · ${PRICING.insight.price} regular price`
                : 'No payment needed to see your result'}
            </p>
            <ul className="my-7 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex gap-3 text-sm leading-6 text-jung-secondary"
                >
                  <Check className="mt-1 h-4 w-4 shrink-0 text-jung-accent" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              variant={plan.id === 'insight' ? 'accent' : 'outline'}
              size="lg"
              className="w-full"
              onClick={() => choose(plan.id)}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {plan.id === 'free'
                ? hasResults
                  ? 'Read my free map'
                  : 'Start free assessment'
                : hasResults
                  ? `Get Insight — ${plan.price}`
                  : 'Start free, decide after'}
            </Button>
            {plan.id === 'insight' && (
              <Link
                to={pathWithSource('/sample-report', 'pricing_paid_preview')}
                className="mt-2 flex min-h-11 items-center justify-center text-xs font-semibold text-jung-accent underline underline-offset-4"
              >
                Read the sample first
              </Link>
            )}
          </article>
        ))}
      </section>
      <section className="mx-auto mt-5 flex max-w-4xl flex-col justify-between gap-5 rounded-2xl border border-jung-border bg-jung-surface-alt p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="max-w-lg">
          <p className="journey-eyebrow">For continued reflection</p>
          <h2 className="mt-2 font-display text-2xl">
            Mastery{' '}
            <span className="ml-2 whitespace-nowrap font-sans text-sm font-normal text-jung-secondary">
              {discountedPriceLabel(PRICING.mastery.amount)} once
            </span>
          </h2>
          <p className="mt-2 text-sm leading-6 text-jung-secondary">
            Everything in Insight, plus the AI Type Guide, growth exercises, and
            an individuation roadmap. An account is required for guide access.
          </p>
        </div>
        <Button
          variant="outline"
          className="shrink-0"
          onClick={() => choose('mastery')}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Explore Mastery
        </Button>
      </section>
      <p className="mx-auto mt-6 flex max-w-4xl items-start justify-center gap-2 text-center text-xs leading-6 text-jung-muted">
        <ShieldCheck className="mt-1 h-4 w-4 shrink-0" />
        Payments in Canadian dollars. No subscription. 7-day refund policy.
      </p>
      <section id="compare" className="mx-auto mt-14 max-w-4xl scroll-mt-28">
        <details className="rounded-xl border border-jung-border bg-jung-surface p-5 sm:p-7">
          <summary className="cursor-pointer font-display text-2xl">
            Compare everything included
          </summary>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <caption className="sr-only">
                Features included in Free, Insight, and Mastery
              </caption>
              <thead>
                <tr className="border-b border-jung-border">
                  <th className="py-3 font-medium">Included</th>
                  {['Free', 'Insight', 'Mastery'].map((tier) => (
                    <th
                      key={tier}
                      className="px-2 py-3 text-center font-medium"
                    >
                      {tier}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((feature) => (
                  <tr
                    key={feature.name}
                    className="border-b border-jung-border-light last:border-0"
                  >
                    <th
                      scope="row"
                      className="py-4 pr-4 font-normal text-jung-secondary"
                    >
                      {feature.name}
                    </th>
                    {(['free', 'insight', 'mastery'] as const).map((tier) => (
                      <td key={tier} className="px-2 text-center">
                        {feature[tier] ? (
                          <Check
                            aria-label="Included"
                            className="mx-auto h-4 w-4 text-jung-accent"
                          />
                        ) : (
                          <Minus
                            aria-label="Not included"
                            className="mx-auto h-4 w-4 text-jung-muted"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>
      <section className="mx-auto mt-14 max-w-4xl">
        <h2 className="mb-5 font-display text-3xl">
          Good to know before you buy.
        </h2>
        {[
          [
            'How is my report written?',
            'The paid report uses AI to interpret your assessment result across ten sections. It is an educational reflection tool. Read it critically and compare it with your own experience.',
          ],
          [
            'What happens after payment?',
            'Stripe confirms payment, then returns you to TypeJung to generate your report from the map saved in this browser. Use the purchase email when signing in to restore paid access. Keep your receipt.',
          ],
          [
            'Do I need a discount code?',
            `The ${EMAIL_CAPTURE_OFFER.code} offer is applied automatically. Insight is ${discountedPriceLabel(PRICING.insight.amount)} and Mastery is ${discountedPriceLabel(PRICING.mastery.amount)}. Review the final amount on Stripe before paying.`,
          ],
          [
            'What if the report is not useful?',
            `Email ${SUPPORT_EMAIL} within 7 days of purchase with your Stripe receipt to request a refund.`,
          ],
        ].map(([q, a]) => (
          <details key={q} className="border-b border-jung-border">
            <summary className="cursor-pointer py-5 text-sm font-semibold">
              {q}
            </summary>
            <p className="max-w-2xl pb-5 text-sm leading-7 text-jung-secondary">
              {a}
            </p>
          </details>
        ))}
      </section>
      <p className="mx-auto mt-10 max-w-4xl text-sm leading-7 text-jung-secondary">
        Prefer a written second perspective from the founder?{' '}
        <Link
          to="/debrief"
          className="inline-flex min-h-11 items-center text-jung-accent underline underline-offset-4"
        >
          Read about the Personal Type Debrief
        </Link>
        .
      </p>
    </div>
  );
};
