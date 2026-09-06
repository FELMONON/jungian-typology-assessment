import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock3,
  FileText,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { discountedPriceLabel } from '../data/discount';
import { PRICING } from '../data/pricing';
import { PAGE_SEO, useSEO } from '../hooks/useSEO';
import { pathWithSource } from '../lib/acquisition-source';
import { AnalyticsEvents, trackEvent } from '../lib/analytics';

const insightPrice = discountedPriceLabel(PRICING.insight.amount);
const exampleStack = [
  { code: 'Ti', role: 'Lead', name: 'Find the logic', width: 86 },
  { code: 'Ne', role: 'Support', name: 'Explore possibilities', width: 68 },
  { code: 'Si', role: 'Balance', name: 'Draw on experience', width: 47 },
  { code: 'Fe', role: 'Growth', name: 'Connect with others', width: 28 },
];
const exampleReadings = [
  {
    label: 'Everyday',
    title: 'You want it to make sense.',
    text: 'You might check the reasoning behind an idea before deciding whether to trust it. A clear explanation can matter more to you than a confident delivery.',
  },
  {
    label: 'Under stress',
    title: 'Clarity can turn into distance.',
    text: 'When a conversation gets tense, you might keep explaining your point while missing the need for reassurance. Notice whether more analysis is helping you reconnect.',
  },
  {
    label: 'Try this',
    title: 'Make room for one more question.',
    text: 'Before offering your explanation, ask: “What matters most to you here?” Then reflect back what you heard. Observe what changes in the conversation.',
  },
];
const guides = [
  [
    '/jungian-cognitive-functions-test',
    'Jungian cognitive functions test',
    'How the assessment works',
  ],
  [
    '/cognitive-function-test',
    'Cognitive function test',
    'Understand the eight functions',
  ],
  [
    '/inferior-function-test',
    'Your inferior function',
    'Explore patterns under stress',
  ],
  [
    '/mbti-test-alternative',
    'When your MBTI keeps changing',
    'A different way to read your result',
  ],
  [
    '/best-cognitive-functions-test',
    'Compare cognitive function tests',
    'Choose a useful starting point',
  ],
  ['/guides', 'The TypeJung library', 'Type comparisons and practical guides'],
];
const faqs = [
  [
    'What will I get for free?',
    'The full 42-question assessment, your function-stack map, the dominant–inferior pattern, and an introductory interpretation. No account or payment is required to see your result.',
  ],
  [
    'What if I get a different result from another test?',
    'Use the differences as questions to explore. TypeJung combines answers about everyday behavior, stress, body cues, and attention direction. The result is a working interpretation of your answers, and may change with your context.',
  ],
  [
    'Does this measure eight functions independently?',
    'The assessment scores four function channels and attention direction, then derives a map showing all eight function-attitudes. The eight displayed values are not eight independent psychological measurements. You can inspect the method before you start.',
  ],
  [
    'Do I have to buy the report?',
    `No. Your core map is free. The optional Insight report is ${insightPrice}, paid once, and adds ten AI-generated interpretation sections. You can read an illustrative sample first. TypeJung is for educational self-reflection, not diagnosis.`,
  ],
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [exampleIndex, setExampleIndex] = useState(0);
  useSEO(PAGE_SEO.home);
  useEffect(() => {
    trackEvent('home_wedge_viewed', {
      source: 'home',
      promise: 'mbti_alternative_function_stack',
      version: '2026_09_clarity',
    });
  }, []);
  const start = (source: string) => {
    const destination = pathWithSource('/assessment', source);
    trackEvent('assessment_start_intent', {
      source,
      promise: 'mbti_alternative_function_stack',
    });
    AnalyticsEvents.ctaClicked('start_assessment', source, {
      buttonText: 'Find my pattern',
      destination,
    });
    navigate(destination);
  };

  return (
    <div className="journey-home">
      <section className="lab-container grid items-center gap-12 py-12 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div>
          <p className="journey-eyebrow">
            The free Jungian cognitive functions test
          </p>
          <h1 className="mt-6 max-w-2xl font-display text-[43px] leading-[1.07] tracking-[-0.035em] text-jung-dark sm:text-6xl lg:text-[72px]">
            Your type keeps changing.
            <br />
            <span className="font-normal italic text-jung-accent">
              Find the pattern underneath.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-jung-secondary sm:text-lg sm:leading-8">
            Explore how you take in the world, make decisions, and respond to
            stress. Get a map of your cognitive functions—and a clearer place to
            begin.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button
              variant="accent"
              size="lg"
              onClick={() => start('home_hero')}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Find my pattern
            </Button>
            <a
              href="#example-map"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-jung-secondary underline decoration-jung-border underline-offset-4 hover:text-jung-accent"
            >
              Explore an example <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-5 flex items-center gap-2 text-xs leading-6 text-jung-muted sm:text-sm">
            <Clock3 className="h-4 w-4 shrink-0" />
            42 questions · 20–25 minutes · Saves as you go
          </p>
          <p className="mt-1 text-xs leading-6 text-jung-muted sm:text-sm">
            Free results. No signup or card required.
          </p>
        </div>
        <div
          id="example-map"
          className="journey-example scroll-mt-28 rounded-2xl border border-jung-border bg-jung-surface p-5 sm:p-8"
        >
          <div className="flex items-center justify-between gap-3 border-b border-jung-border-light pb-5">
            <div>
              <p className="journey-eyebrow">A map you can read</p>
              <h2 className="mt-2 font-display text-2xl">
                The thoughtful explorer
              </h2>
            </div>
            <span className="rounded-full bg-jung-surface-alt px-3 py-1.5 text-[11px] font-medium text-jung-secondary">
              Illustrative example
            </span>
          </div>
          <div
            className="my-6 space-y-4"
            aria-label="Illustrative Ti–Ne–Si–Fe pattern, not a personal result"
          >
            {exampleStack.map((fn, i) => (
              <div key={fn.code} className="flex items-center gap-4">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-xl ${i === 0 ? 'bg-jung-accent text-white' : 'bg-jung-surface-alt text-jung-accent'}`}
                >
                  {fn.code}
                </span>
                <div className="flex-1">
                  <div className="mb-2 flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium">{fn.name}</span>
                    <span className="text-[11px] text-jung-muted">
                      {fn.role}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-jung-border-light">
                    <div
                      className={`h-full rounded-full ${i === 3 ? 'bg-jung-gold/70' : 'bg-jung-accent'}`}
                      style={{ width: `${fn.width}%`, opacity: 1 - i * 0.13 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-jung-accent-light p-4 sm:p-5">
            <div
              className="flex gap-1 border-b border-jung-accent/15 pb-3"
              aria-label="Explore the example"
            >
              {exampleReadings.map((item, i) => (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={exampleIndex === i}
                  onClick={() => {
                    setExampleIndex(i);
                    trackEvent('home_preview_explored', { topic: item.label });
                  }}
                  className={`min-h-11 flex-1 rounded-lg px-2 text-xs font-semibold transition-colors ${exampleIndex === i ? 'bg-jung-accent text-white' : 'text-jung-accent hover:bg-white/70'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div
              className="min-h-[145px] pt-4"
              aria-live="polite"
              aria-atomic="true"
            >
              <h3 className="font-display text-xl text-jung-accent">
                {exampleReadings[exampleIndex].title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-jung-secondary">
                {exampleReadings[exampleIndex].text}
              </p>
            </div>
          </div>
          <p className="mt-4 text-[11px] leading-5 text-jung-muted">
            An example of the reading experience. Your map comes from your own
            answers.
          </p>
        </div>
      </section>
      <section className="border-y border-jung-border-light bg-jung-surface">
        <div className="lab-container grid gap-7 py-10 md:grid-cols-3 md:gap-12">
          {[
            [
              '01',
              'Notice your natural strengths.',
              'See which ways of thinking and noticing you rely on most.',
            ],
            [
              '02',
              'Recognize the stress pattern.',
              'Explore the less familiar side that may surface under pressure.',
            ],
            [
              '03',
              'Give yourself a starting point.',
              'Use your map as a prompt for observation in everyday life.',
            ],
          ].map(([number, title, body]) => (
            <div key={number} className="flex gap-4">
              <span className="pt-1 font-mono text-xs text-jung-gold">
                {number}
              </span>
              <div>
                <h2 className="font-display text-xl">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-jung-secondary">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="lab-container grid gap-10 py-16 md:py-24 lg:grid-cols-[0.85fr_1fr] lg:gap-24">
        <div>
          <p className="journey-eyebrow">From curiosity to clarity</p>
          <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
            Begin with your
            <br className="hidden sm:block" /> everyday life.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-jung-secondary">
            No theory to memorize. Choose what feels closest to your actual
            experience.
          </p>
          <Link
            to="/methodology"
            className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-jung-accent underline underline-offset-4"
          >
            Read how the map is made <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <ol className="divide-y divide-jung-border">
          {[
            [
              'Answer 42 real-life questions',
              'Work through decisions, relationships, attention, and stress. Pause whenever you need; your answers save on this device.',
            ],
            [
              'Read your free function map',
              'Explore your leading patterns, supporting functions, and growth edge. Treat the result as something to test against your experience.',
            ],
            [
              'Go deeper if it feels useful',
              `Keep the free map, or add a personalized Insight report for ${insightPrice}. Read a sample before you decide.`,
            ],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-5 py-6 first:pt-0">
              <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-jung-border text-sm text-jung-accent">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-jung-secondary">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section id="pricing" className="bg-jung-accent text-white">
        <div className="lab-container grid items-center gap-10 py-14 md:py-20 lg:grid-cols-[1fr_0.85fr] lg:gap-24">
          <div>
            <p className="journey-eyebrow !text-white/70">
              The optional Insight report
            </p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Make the map
              <br />
              mean something to you.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/80">
              Ten AI-generated sections connect your result to stress,
              relationships, work, and growth. Practical reflections you can
              return to at your own pace.
            </p>
            <Link
              to={pathWithSource('/sample-report', 'home_paid_preview')}
              className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline decoration-white/40 underline-offset-4"
            >
              Read the sample report <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl bg-jung-surface p-6 text-jung-dark sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Insight</span>
              <FileText className="h-5 w-5 text-jung-accent" />
            </div>
            <p className="mt-4 font-display text-5xl">
              {insightPrice}
              <span className="ml-3 font-sans text-sm text-jung-muted">
                one time · CAD
              </span>
            </p>
            <p className="mt-2 text-xs text-jung-muted">
              Current offer · {PRICING.insight.price} regular price
            </p>
            <ul className="my-6 space-y-3">
              {[
                'Ten personalized interpretation sections',
                'Stress and recovery reflections',
                'Relationship, work, and growth prompts',
                'The Function Stack in Depth guide (PDF)',
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-6 text-jung-secondary"
                >
                  <Check className="mt-1 h-4 w-4 shrink-0 text-jung-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              variant="accent"
              className="w-full"
              onClick={() => start('home_pricing_insight')}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Start with my free map
            </Button>
            <p className="mt-4 text-center text-xs leading-5 text-jung-muted">
              No subscription. 7-day refund policy.
            </p>
            <Link
              to="/pricing"
              className="mt-2 flex min-h-11 items-center justify-center text-xs font-semibold text-jung-accent underline underline-offset-4"
            >
              Compare all options
            </Link>
          </div>
        </div>
      </section>
      <section className="lab-container py-16 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="journey-eyebrow">Follow your curiosity</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              A little context can help.
            </h2>
          </div>
          <Link
            to="/learn"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-jung-accent"
          >
            Learn the theory <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-x-10 md:grid-cols-2">
          {guides.map(([href, title, subtitle]) => (
            <a
              key={href}
              href={href}
              className="group flex items-center justify-between gap-4 border-t border-jung-border py-5"
              onClick={() =>
                trackEvent('home_seo_path_clicked', {
                  source: 'home_search_paths',
                  destination: href,
                  title,
                })
              }
            >
              <div>
                <h3 className="font-display text-xl group-hover:text-jung-accent">
                  {title}
                </h3>
                <p className="mt-1 text-xs text-jung-muted">{subtitle}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-jung-accent" />
            </a>
          ))}
        </div>
        <details className="mt-5 border-t border-jung-border pt-3">
          <summary className="cursor-pointer py-3 text-sm font-medium text-jung-secondary">
            Browse all eight functions and sixteen types
          </summary>
          <div className="flex flex-wrap gap-2 py-4">
            {['Ni', 'Ne', 'Si', 'Se', 'Ti', 'Te', 'Fi', 'Fe'].map((code) => (
              <a
                key={code}
                href={`/functions/${code.toLowerCase()}`}
                className="inline-flex min-h-11 items-center rounded-lg border border-jung-border px-4 text-sm hover:bg-jung-accent-light"
              >
                {code}
              </a>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 pb-4">
            {[
              'INTJ',
              'INTP',
              'ENTJ',
              'ENTP',
              'INFJ',
              'INFP',
              'ENFJ',
              'ENFP',
              'ISTJ',
              'ISFJ',
              'ESTJ',
              'ESFJ',
              'ISTP',
              'ISFP',
              'ESTP',
              'ESFP',
            ].map((code) => (
              <a
                key={code}
                href={`/types/${code.toLowerCase()}`}
                className="inline-flex min-h-11 items-center rounded-lg border border-jung-border px-4 text-sm hover:bg-jung-accent-light"
              >
                {code}
              </a>
            ))}
          </div>
        </details>
      </section>
      <section className="border-y border-jung-border-light bg-jung-surface">
        <div className="lab-container grid gap-8 py-14 md:py-20 lg:grid-cols-[0.7fr_1fr] lg:gap-20">
          <div>
            <p className="journey-eyebrow">Before you begin</p>
            <h2 className="mt-4 font-display text-4xl">
              A few fair questions.
            </h2>
          </div>
          <div>
            {faqs.map(([question, answer]) => (
              <details
                key={question}
                className="group border-b border-jung-border first:border-t"
              >
                <summary className="cursor-pointer py-5 text-base font-medium text-jung-dark">
                  {question}
                </summary>
                <p className="max-w-2xl pb-5 text-sm leading-7 text-jung-secondary">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="lab-container py-14 text-center md:py-20">
        <p className="journey-eyebrow">Your next step</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
          Start with one honest answer.
        </h2>
        <Button
          variant="accent"
          size="lg"
          className="mt-7"
          onClick={() => start('home_final_cta')}
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Find my pattern
        </Button>
        <p className="mt-4 text-xs text-jung-muted">
          42 questions. Your core map is free.
        </p>
      </section>
    </div>
  );
};
