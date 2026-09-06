import { ArrowRight, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { discountedPriceLabel } from '../data/discount';
import { PRICING } from '../data/pricing';
import { PAGE_SEO, useSEO } from '../hooks/useSEO';
import { pathWithSource } from '../lib/acquisition-source';
import { AnalyticsEvents, trackEvent } from '../lib/analytics';
import { writeUpgradeIntent } from '../lib/upgrade-intent';
import { isDepthAssessmentResult } from '../utils/depthScoring';

const excerpts = [
  {
    id: 'strength',
    number: '01',
    title: 'The strength you reach for first',
    category: 'Function dynamics',
    paragraphs: [
      'You may feel most at ease when you can take an idea apart and understand how its pieces fit. In this example, introverted thinking (Ti) leads the pattern: an explanation earns your trust when it holds together, even if it comes from an unexpected person.',
      'That preference can give you patience for difficult problems and an eye for contradictions. It can also make it easy to stay in analysis after you have enough information to act. Notice the difference between a question that brings new clarity and one that postpones a decision you already understand.',
    ],
    practice:
      'Pick a decision you have been revisiting. Write down what you know, what is still uncertain, and the smallest step you could take without settling every question.',
  },
  {
    id: 'stress',
    number: '02',
    title: 'When clarity becomes distance',
    category: 'Stress and recovery',
    paragraphs: [
      'Imagine a colleague says your feedback sounded dismissive. Your first response might be to explain why the feedback was technically correct. As the conversation becomes more tense, you find yourself rehearsing a better argument while becoming increasingly concerned about what the colleague thinks of you.',
      'A Ti–Fe interpretation invites you to notice that shift: precision is still important, but the conversation may now need reassurance. More explanation can leave both people feeling unheard. This is a possibility to observe, not a prediction that every stressful conversation will follow the same sequence.',
    ],
    practice:
      'Pause before defending the conclusion. Try: “I want to understand how that landed. Which part felt dismissive?” Listen for the impact before returning to your reasoning.',
  },
  {
    id: 'relationships',
    number: '03',
    title: 'Let people see the care behind the thought',
    category: 'Relationships',
    paragraphs: [
      'You might show care by solving a problem, making an explanation clearer, or noticing something another person overlooked. The other person may be looking for a different sign of care: a moment of listening, an acknowledgment, or an invitation to say more.',
      'Neither response tells the whole story about your relationship. The useful question is whether your intention is reaching the other person. The feeling side of this sample pattern offers a practice in making that intention explicit, without having to abandon the careful thinking you value.',
    ],
    practice:
      'In your next difficult conversation, ask: “Would it help more if I listened, or if we worked through possible solutions?” Check what they actually need.',
  },
  {
    id: 'practice',
    number: '04',
    title: 'A small experiment for the coming week',
    category: 'Growth practices',
    paragraphs: [
      'Choose one ordinary situation where you tend to stay in your head: giving feedback, asking for help, or responding to disagreement. Keep the experiment small enough that you can try it more than once.',
      'Afterward, write three short notes: what happened, what you assumed, and what you could ask next time. Look for examples that challenge the interpretation as well as examples that fit. A useful map should help you observe more clearly; it should not become a reason to explain away every experience with your type.',
    ],
    practice:
      'At the end of the week, keep one thing that helped and drop one assumption that did not fit. Your observations matter more than making the report sound right.',
  },
];

export const SampleReport: React.FC = () => {
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
  const price = discountedPriceLabel(PRICING.insight.amount);
  useSEO(PAGE_SEO.sampleReport);
  useEffect(() => {
    trackEvent('sample_report_viewed', {
      has_local_results: hasResults,
      version: '2026_09_clarity',
    });
  }, [hasResults]);
  const continueToReport = () => {
    const source = 'sample_report';
    writeUpgradeIntent('insight', source);
    const destination = pathWithSource(
      hasResults ? '/checkout/insight' : '/assessment',
      source,
      { tier: 'insight' },
    );
    AnalyticsEvents.ctaClicked('get_insight_report', source, {
      destination,
      tier: 'insight',
    });
    if (hasResults) {
      AnalyticsEvents.upgradeClicked(source, 'insight');
      trackEvent('sample_report_checkout_clicked', { tier: 'insight', source });
    }
    navigate(destination);
  };
  return (
    <div className="lab-container py-10 sm:py-16">
      <header className="mx-auto max-w-3xl">
        <p className="journey-eyebrow">Inside an Insight report</p>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-6xl">
          A map becomes useful
          <br />
          <span className="font-normal italic text-jung-accent">
            when you can live with it.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-jung-secondary">
          Read four illustrative excerpts below. Your paid report contains ten
          AI-generated sections based on your own assessment result.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-y border-jung-border py-4">
          <span className="font-display text-xl text-jung-accent">
            Ti · Ne · Si · Fe
          </span>
          <span className="text-xs text-jung-muted">
            Fictional example · Not your personal result
          </span>
        </div>
      </header>
      <div className="mx-auto mt-10 grid max-w-5xl items-start gap-10 lg:grid-cols-[12rem_1fr] lg:gap-16">
        <nav
          aria-label="Sample report contents"
          className="rounded-xl bg-jung-surface-alt p-5 lg:sticky lg:top-28"
        >
          <p className="journey-eyebrow">In this sample</p>
          <ol className="mt-3">
            {excerpts.map((section) => (
              <li key={section.id}>
                <a
                  href={`#sample-${section.id}`}
                  className="flex min-h-11 items-center gap-3 text-xs leading-5 text-jung-secondary hover:text-jung-accent"
                >
                  <span className="font-mono text-jung-gold">
                    {section.number}
                  </span>
                  {section.category}
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-4 border-t border-jung-border pt-4 text-xs leading-6 text-jung-muted">
            Educational self-reflection. This is a format example, not a
            diagnosis or a customer testimonial.
          </p>
        </nav>
        <div>
          {excerpts.map((section) => (
            <article
              key={section.id}
              id={`sample-${section.id}`}
              className="mb-12 scroll-mt-28 border-b border-jung-border pb-12"
            >
              <p className="journey-eyebrow">
                {section.number} / {section.category}
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
                {section.title}
              </h2>
              <div className="mt-5 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-8 text-jung-secondary"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-6 rounded-xl border-l-2 border-jung-accent bg-jung-accent-light p-5">
                <h3 className="text-xs font-semibold text-jung-accent">
                  Try this
                </h3>
                <p className="mt-2 text-sm leading-7 text-jung-secondary">
                  {section.practice}
                </p>
              </div>
            </article>
          ))}
          <section className="rounded-2xl bg-jung-accent p-6 text-white sm:p-8">
            <FileText className="h-5 w-5 text-white/70" />
            <h2 className="mt-4 font-display text-3xl">
              What could your map help you notice?
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/80">
              Insight includes ten sections: overview, function dynamics,
              archetypes, stress, relationships, work, individuation, shadow,
              growth, and dream reflection. The Function Stack in Depth PDF
              guide is also included.
            </p>
            <Button
              variant="inverted"
              className="mt-6"
              onClick={continueToReport}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              {hasResults
                ? `Get my Insight report — ${price}`
                : 'Start with my free map'}
            </Button>
            <p className="mt-4 text-xs leading-6 text-white/70">
              {price} once · CAD · No subscription · 7-day refund policy
            </p>
          </section>
          <Link
            to={hasResults ? '/results' : '/pricing'}
            className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-jung-accent underline underline-offset-4"
          >
            {hasResults
              ? 'Return to my free result'
              : 'Compare pricing options'}
          </Link>
        </div>
      </div>
    </div>
  );
};
