import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers3, Compass, Activity, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';
import { depthLayerMeta, depthQuestions, type DepthLayer } from '../data/depthAssessment';

const layerOrder: DepthLayer[] = ['behavioral', 'inferior', 'somatic', 'attitude'];

const layerIcon: Record<DepthLayer, React.ComponentType<{ className?: string }>> = {
  behavioral: Layers3,
  inferior: ShieldAlert,
  somatic: Activity,
  attitude: Compass,
};

export const Methodology: React.FC = () => {
  useSEO(PAGE_SEO.methodology);

  const totalQuestions = depthQuestions.length;
  const layerCounts = layerOrder.map((layer) => ({
    layer,
    meta: depthLayerMeta[layer],
    count: depthQuestions.filter((question) => question.layer === layer).length,
  }));

  return (
    <div className="editorial-container py-12 md:py-20">
      <header className="mb-14 max-w-3xl md:mb-20">
        <p className="text-label mb-4">Methodology</p>
        <h1 className="text-display text-4xl sm:text-5xl md:text-6xl">
          How TypeJung reads {totalQuestions} answers into a function-stack map
        </h1>
        <p className="annotation mt-6 max-w-2xl text-lg not-italic">
          The map is built to be inspected, not believed. This page lays out exactly how the prompts
          are grouped, how the dominant and inferior functions are inferred, what the reliability
          signal means, and — just as importantly — what TypeJung does not claim.
        </p>
      </header>

      {/* Four evidence layers */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-heading text-2xl text-jung-dark sm:text-3xl">Four evidence layers</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-jung-secondary">
          Rather than asking you to self-label, the assessment gathers four kinds of evidence and looks
          for the function pattern they agree on. Each prompt belongs to one layer.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {layerCounts.map(({ layer, meta, count }, index) => {
            const Icon = layerIcon[layer];
            return (
              <div key={layer} className="card-premium p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-label">Layer {index + 1} · {count} prompts</p>
                    <h3 className="mt-1 font-display text-xl font-semibold text-jung-dark">{meta.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-jung-secondary">{meta.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How the prompts are grouped */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-heading text-2xl text-jung-dark sm:text-3xl">How the prompts are grouped</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-jung-border bg-jung-surface p-6">
            <p className="text-label">Scenario, not self-label</p>
            <p className="mt-3 text-sm leading-6 text-jung-secondary">
              Each prompt describes a concrete situation and asks what you actually notice or do first —
              not which trait word you identify with. Behaviour is harder to flatter than a label.
            </p>
          </div>
          <div className="rounded-lg border border-jung-border bg-jung-surface p-6">
            <p className="text-label">Rotated options</p>
            <p className="mt-3 text-sm leading-6 text-jung-secondary">
              Answer options are deterministically rotated per question so the same function is not always
              in the first slot. This reduces position bias without making the test feel random.
            </p>
          </div>
          <div className="rounded-lg border border-jung-border bg-jung-surface p-6">
            <p className="text-label">"None fits" is valid</p>
            <p className="mt-3 text-sm leading-6 text-jung-secondary">
              Every prompt lets you say none of the options match. Honest gaps are more useful than a
              forced pick — and repeated "none" answers visibly lower the reliability signal.
            </p>
          </div>
        </div>
      </section>

      {/* Dominant / inferior inference */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-heading text-2xl text-jung-dark sm:text-3xl">How dominant and inferior are inferred</h2>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="prose-editorial max-w-none text-sm leading-7 text-jung-secondary">
            <p>
              Behavioural and somatic answers are scored across the four function channels — thinking,
              feeling, sensation, and intuition — and combined into an energy profile. The strongest
              channel becomes the candidate <strong>dominant</strong> function.
            </p>
            <p className="mt-4">
              The <strong>inferior</strong> is not simply the lowest bar. Jung's model puts the inferior
              opposite the dominant, and it shows up most clearly under stress. TypeJung weights the
              inferior-detection layer most heavily and cross-checks it against the dominant: when your
              stress answers and your everyday energy point at the same opposing channel, confidence is
              high. When they disagree, the edge is resolved structurally and the tension is reported as a
              note rather than hidden.
            </p>
            <p className="mt-4">
              Attitude direction (introverted / extraverted) then orients the stack into specific
              function-attitude codes such as Ni or Te. When the introversion–extraversion split is within
              a few points, the result is reported as <strong>balanced</strong> — a working hypothesis, not
              a fixed identity claim.
            </p>
          </div>
          <div className="rounded-lg border border-jung-dark bg-jung-dark p-6 text-white">
            <p className="text-label !text-white/60">The chain, in order</p>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-white/80">
              <li><span className="font-mono text-jung-subtle">01</span> &nbsp;Score channels from behaviour + somatic evidence</li>
              <li><span className="font-mono text-jung-subtle">02</span> &nbsp;Take the strongest channel as candidate dominant</li>
              <li><span className="font-mono text-jung-subtle">03</span> &nbsp;Detect the inferior from stress triggers, opposite the dominant</li>
              <li><span className="font-mono text-jung-subtle">04</span> &nbsp;Orient with attitude direction into function-attitude codes</li>
              <li><span className="font-mono text-jung-subtle">05</span> &nbsp;Keep all eight functions visible so close signals stay inspectable</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Reliability */}
      <section className="mb-16 md:mb-20">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-heading text-2xl text-jung-dark sm:text-3xl">What the reliability signal means</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-jung-secondary">
              Every result carries a consistency label — High, Moderate, or Exploratory — that reflects how
              much the four layers agreed with each other, not how "good" your type is.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-jung-border bg-jung-surface p-5">
            <p className="font-display text-lg font-semibold text-jung-dark">Raises it</p>
            <p className="mt-2 text-sm leading-6 text-jung-secondary">
              Behavioural, stress, somatic, and attitude evidence converging on the same dominant–inferior axis.
            </p>
          </div>
          <div className="rounded-lg border border-jung-border bg-jung-surface p-5">
            <p className="font-display text-lg font-semibold text-jung-dark">Lowers it</p>
            <p className="mt-2 text-sm leading-6 text-jung-secondary">
              Layers pointing at different functions, lots of "none" answers, or a near-even attitude split.
            </p>
          </div>
          <div className="rounded-lg border border-jung-border bg-jung-surface p-5">
            <p className="font-display text-lg font-semibold text-jung-dark">How to use it</p>
            <p className="mt-2 text-sm leading-6 text-jung-secondary">
              Treat an Exploratory result as a prompt to re-read the evidence, not a verdict to defend.
            </p>
          </div>
        </div>
      </section>

      {/* What TypeJung does not claim */}
      <section className="mb-16 md:mb-20">
        <div className="rounded-lg border border-jung-tension/40 bg-jung-tension-light/60 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-jung-surface text-jung-tension">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-heading text-2xl text-jung-dark sm:text-3xl">What TypeJung does not claim</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-jung-secondary sm:grid-cols-2">
                <li>It is educational self-reflection, <strong>not</strong> a clinical or diagnostic assessment.</li>
                <li>It does not measure intelligence, mental health, fit for a job, or compatibility.</li>
                <li>A function-stack code is a working hypothesis, not a fixed identity or a verdict.</li>
                <li>It is an independent Jungian tool, not the official MBTI® instrument or a substitute for it.</li>
                <li>Balanced or low-confidence results are reported as such instead of forcing a winner.</li>
                <li>No result here should be used to make medical, hiring, or relationship decisions.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-lg border border-jung-border bg-jung-surface p-6 text-center sm:p-10">
        <h2 className="text-heading text-2xl text-jung-dark sm:text-3xl">See the method on your own answers</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-jung-secondary">
          The free map shows every layer and the reliability signal before any optional paid report.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/assessment" className="btn-premium">
            Build my free map
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/sample-report" className="inline-flex min-h-11 items-center text-sm font-semibold text-jung-accent hover:underline">
            See a full sample report
          </Link>
        </div>
      </section>
    </div>
  );
};
