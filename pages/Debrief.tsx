import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Loader2, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useSEO, PAGE_SEO } from '../hooks/useSEO';
import { DEBRIEF_FIELD_MAX, DEBRIEF_OFFER, type DebriefIntake } from '../data/debrief';
import { ATTITUDE_LABELS, FUNCTION_LABELS } from '../data/depthAssessment';
import { isDepthAssessmentResult } from '../utils/depthScoring';
import { trackEvent } from '../lib/analytics';

const RESULTS_KEY = 'jungian_assessment_results';

function readStoredResultSummary(): string {
  if (typeof window === 'undefined') return '';
  try {
    const raw = window.localStorage.getItem(RESULTS_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!isDepthAssessmentResult(parsed)) return '';
    const dominant = FUNCTION_LABELS[parsed.dominant] ?? parsed.dominant;
    const inferior = FUNCTION_LABELS[parsed.inferior] ?? parsed.inferior;
    const attitude = ATTITUDE_LABELS[parsed.attitude.dominant] ?? '';
    return `${attitude} ${dominant} dominant → ${inferior} inferior; ${parsed.reliability.label} consistency.`.trim();
  } catch {
    return '';
  }
}

const includes = [
  'Founder-reviewed interpretation of your TypeJung map',
  'Likely mistype comparison for the types you bounce between',
  'Dominant–inferior breakdown in plain language',
  'Stress-edge explanation tied to your result',
  `10-minute video or written debrief within ${DEBRIEF_OFFER.deliveryHours} hours`,
];

export const Debrief: React.FC = () => {
  useSEO(PAGE_SEO.debrief);
  const location = useLocation();
  const cancelled = useMemo(() => new URLSearchParams(location.search).get('checkout') === 'cancelled', [location.search]);

  const [form, setForm] = useState<DebriefIntake>({
    email: '',
    resultSummary: '',
    testedAs: '',
    stuckBetween: '',
    feltAccurate: '',
    feltConfusing: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const summary = readStoredResultSummary();
    if (summary) setForm((prev) => ({ ...prev, resultSummary: summary }));
    trackEvent('debrief_intake_viewed', { has_result: summary ? 'yes' : 'no', cancelled });
  }, [cancelled]);

  const update = (field: keyof DebriefIntake) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailValid || submitting) {
      if (!emailValid) setError('Enter a valid email so the debrief can be delivered.');
      return;
    }

    setSubmitting(true);
    setError(null);
    trackEvent('debrief_checkout_started', { source: 'debrief_page' });

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...form, product: 'debrief', source: 'debrief_page' }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.url) {
        throw new Error(data?.error || 'Could not start checkout. Please try again.');
      }

      window.location.href = data.url;
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="editorial-container py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <header className="lg:sticky lg:top-24">
          <p className="text-label mb-4">Personal Type Debrief</p>
          <h1 className="text-display text-4xl sm:text-5xl">Still stuck between two types?</h1>
          <p className="annotation mt-5 max-w-md text-lg not-italic">
            If your free map is interesting but you are still unsure how to read it, you may not need another
            test — you may need a second read. I will review your TypeJung result, your likely mistypes, and
            your stress edge personally.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-display text-3xl font-semibold text-jung-dark">{DEBRIEF_OFFER.price}</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-jung-border bg-jung-surface px-3 py-1 text-xs font-semibold text-jung-secondary">
              <Clock className="h-3.5 w-3.5 text-jung-accent" /> Within {DEBRIEF_OFFER.deliveryHours} hours
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-jung-border bg-jung-surface px-3 py-1 text-xs font-semibold text-jung-secondary">
              <UserCheck className="h-3.5 w-3.5 text-jung-accent" /> Limited to {DEBRIEF_OFFER.weeklyCap}/week
            </span>
          </div>

          <ul className="mt-6 grid gap-2.5">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-jung-secondary">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs leading-5 text-jung-muted">
            Educational self-reflection, not a clinical or diagnostic assessment. One-time CAD purchase, no subscription.
          </p>
          <p className="mt-2 text-xs leading-5 text-jung-muted">
            No result yet?{' '}
            <Link to="/assessment" className="inline-block -my-3 py-3 font-semibold text-jung-accent hover:underline">Take the free map first</Link>.
          </p>

          <section className="mt-8 rounded-lg border border-jung-border bg-jung-surface p-5 shadow-sm">
            <p className="text-label">Sample debrief excerpt</p>
            <h2 className="mt-2 text-heading text-2xl text-jung-dark">What the read can sound like</h2>
            <p className="mt-3 text-sm leading-7 text-jung-secondary">
              Fictional example: “Your TypeJung map points toward Ni-Fe-Ti-Se, but the INFP confusion makes sense
              because your language around values is strong. The question is whether the pattern starts from
              personal value judgment, or from convergent pattern perception that then checks relational impact.
              In your answers, the stress edge matters: the result keeps circling back to embodiment, limits, and
              concrete follow-through rather than Te-style external execution. That is why I would treat INFJ vs
              INFP as a real comparison, but read the current map as Ni-first unless your lived examples show
              value judgment arriving before pattern synthesis.”
            </p>
            <p className="mt-3 text-xs leading-5 text-jung-muted">
              Your debrief is written from your own map and intake answers. It is a second read, not a promise of a final true type.
            </p>
          </section>
        </header>

        <form onSubmit={handleSubmit} className="card-premium p-6 sm:p-8">
          <h2 className="text-heading text-2xl text-jung-dark">Tell me where you are stuck</h2>
          <p className="mt-2 text-sm leading-6 text-jung-secondary">
            The more context you give, the sharper the debrief. Everything except email is optional.
          </p>

          {cancelled && (
            <p className="mt-4 rounded-lg border border-jung-border bg-jung-surface-alt px-4 py-3 text-sm text-jung-secondary">
              Checkout was cancelled — your details are still here. Continue whenever you are ready.
            </p>
          )}

          <div className="mt-6 grid gap-5">
            <label className="block">
              <span className="text-sm font-semibold text-jung-dark">Email for delivery <span className="text-jung-tension">*</span></span>
              <input
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                placeholder="you@example.com"
                className="input-premium mt-2"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-jung-dark">Your TypeJung result</span>
              <textarea
                value={form.resultSummary}
                onChange={update('resultSummary')}
                maxLength={DEBRIEF_FIELD_MAX}
                rows={2}
                placeholder="Prefilled from your free map if you took it on this device."
                className="input-premium mt-2 min-h-[3.5rem] resize-y"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-jung-dark">Types you have tested as before</span>
              <input
                type="text"
                value={form.testedAs}
                onChange={update('testedAs')}
                maxLength={DEBRIEF_FIELD_MAX}
                placeholder="e.g. INFJ on one test, INFP on another"
                className="input-premium mt-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-jung-dark">The two types you are most stuck between</span>
              <input
                type="text"
                value={form.stuckBetween}
                onChange={update('stuckBetween')}
                maxLength={DEBRIEF_FIELD_MAX}
                placeholder="e.g. INFJ vs INFP"
                className="input-premium mt-2"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-jung-dark">What part of your result felt accurate?</span>
              <textarea
                value={form.feltAccurate}
                onChange={update('feltAccurate')}
                maxLength={DEBRIEF_FIELD_MAX}
                rows={2}
                className="input-premium mt-2 min-h-[3.5rem] resize-y"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-jung-dark">What part felt confusing?</span>
              <textarea
                value={form.feltConfusing}
                onChange={update('feltConfusing')}
                maxLength={DEBRIEF_FIELD_MAX}
                rows={2}
                className="input-premium mt-2 min-h-[3.5rem] resize-y"
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 text-sm font-medium text-jung-tension" role="alert">{error}</p>
          )}

          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={submitting}
            className="mt-6 w-full"
            rightIcon={submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          >
            {submitting ? 'Starting secure checkout' : `Get my personal debrief — ${DEBRIEF_OFFER.price}`}
          </Button>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-semibold text-jung-secondary">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-jung-accent" />Secure via Stripe</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-jung-accent" />Delivered within {DEBRIEF_OFFER.deliveryHours}h</span>
          </div>
        </form>
      </div>
    </div>
  );
};
