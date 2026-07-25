import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Info, Layers3, Loader2, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DiscountCaptureCard } from '../components/discount/DiscountCaptureCard';
import { Button } from '../components/ui/Button';
import { type DepthAnswerOption, type DepthLayer, depthLayerMeta, depthQuestions } from '../data/depthAssessment';
import { EMAIL_CAPTURE_OFFER } from '../data/discount';
import { isPaidTierId } from '../data/pricing';
import { PAGE_SEO, useSEO } from '../hooks/useSEO';
import { useAssessmentTracking } from '../hooks/useAnalytics';
import { useAuth } from '../hooks/use-auth';
import { assessmentEntryContextFromSource } from '../lib/assessment-entry-context';
import {
  ASSESSMENT_PROGRESS_STORAGE_KEY,
  countAssessmentAnswers,
  readAssessmentProgress,
  writeAssessmentProgress,
} from '../lib/assessment-progress';
import { readAcquisitionSource, sourceFromSearch } from '../lib/acquisition-source';
import { ASSESSMENT_INTENTS, readAssessmentIntent, writeAssessmentIntent, type AssessmentIntentId } from '../lib/assessment-intent';
import { trackEvent } from '../lib/analytics';
import { readUpgradeIntent, writeUpgradeIntent } from '../lib/upgrade-intent';
import { calculateDepthResults } from '../utils/depthScoring';

const DESKTOP_QUESTIONS_PER_PAGE = 6;
const MOBILE_QUESTIONS_PER_PAGE = 1;
const HISTORY_KEY = 'jungian_depth_results_history';
const RESULTS_KEY = 'jungian_assessment_results';
const LIFECYCLE_EMAIL_ENDPOINT = '/api/lifecycle-email';
const ABANDONED_EMAIL_DELAY_MS = 30 * 60 * 1000;
const ABANDONED_EMAIL_ATTEMPT_PREFIX = 'typejung_lifecycle_email_abandoned_';
const EMAIL_NUDGE_MIN_ANSWERS = 18;

const layerOrder: DepthLayer[] = ['behavioral', 'inferior', 'somatic', 'attitude'];

const rotateOptions = (options: DepthAnswerOption[], questionId: string): DepthAnswerOption[] => {
  const noneOptions = options.filter((option) => option.id === 'none');
  const scoredOptions = options.filter((option) => option.id !== 'none');
  if (scoredOptions.length <= 1) return options;

  const seed = Array.from(questionId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const offset = seed % scoredOptions.length;
  return [
    ...scoredOptions.slice(offset),
    ...scoredOptions.slice(0, offset),
    ...noneOptions,
  ];
};

const preflightCards = [
  {
    icon: Layers3,
    label: '42 prompts · about 20-25 minutes',
    body: 'Attention, decisions, conflict, stress, body signal, and attitude direction.',
  },
  {
    icon: Sparkles,
    label: 'Free map first',
    body: 'See the function-stack pattern before any optional paid report.',
  },
  {
    icon: ShieldCheck,
    label: 'Private by default',
    body: 'No card required. Progress saves on this device while you answer.',
  },
];

const layerProgress = (answers: Record<string, string>) => layerOrder.map((layer) => {
  const layerQuestions = depthQuestions.filter((question) => question.layer === layer);
  const answered = layerQuestions.filter((question) => answers[question.id]).length;
  return {
    layer,
    answered,
    total: layerQuestions.length,
    complete: answered === layerQuestions.length,
  };
});

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

export const Assessment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlTierIntent = useMemo(() => {
    const tierParam = new URLSearchParams(location.search).get('tier');
    return isPaidTierId(tierParam) ? tierParam : null;
  }, [location.search]);
  const entrySource = useMemo(() => (
    sourceFromSearch(location.search) || readAcquisitionSource()?.source || null
  ), [location.search]);
  const entryAttribution = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const stored = readAcquisitionSource();

    return {
      parentSource: params.get('parent_source') || stored?.parentSource || null,
      utmCampaign: params.get('utm_campaign') || stored?.utmCampaign || null,
      utmSource: params.get('utm_source') || stored?.utmSource || null,
      sourceChain: params.get('source_chain') || stored?.sourceChain || null,
    };
  }, [location.search]);
  const entryContext = useMemo(() => (
    assessmentEntryContextFromSource(entrySource, entryAttribution)
  ), [entryAttribution, entrySource]);
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showCompletion, setShowCompletion] = useState(false);
  const [flagUnanswered, setFlagUnanswered] = useState(false);
  const [resumedAnswered, setResumedAnswered] = useState<number | null>(null);
  const [isCompactViewport, setIsCompactViewport] = useState(false);
  const [sectionReward, setSectionReward] = useState<{ completed: DepthLayer; next: DepthLayer | null } | null>(null);
  const [assessmentIntent, setAssessmentIntent] = useState<AssessmentIntentId | null>(() => readAssessmentIntent()?.id ?? null);
  const hasLoadedProgressRef = useRef(false);
  const hasTrackedStartRef = useRef(false);
  const hasTrackedEntryContextRef = useRef(false);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const sectionRewardTimerRef = useRef<number | null>(null);
  const [upgradeIntent] = useState(() => {
    const savedIntent = readUpgradeIntent();
    if (savedIntent) return savedIntent;
    if (!urlTierIntent) return null;
    return {
      tier: urlTierIntent,
      source: 'assessment_discount_email',
      createdAt: new Date().toISOString(),
    };
  });
  const { trackStart, trackProgress, trackComplete } = useAssessmentTracking();
  const { user, isLoading: authLoading } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const scrollBehavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

  useSEO(PAGE_SEO.assessment);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const compactQuery = window.matchMedia('(max-width: 639px)');
    const syncCompactViewport = () => setIsCompactViewport(compactQuery.matches);
    syncCompactViewport();
    compactQuery.addEventListener('change', syncCompactViewport);

    return () => compactQuery.removeEventListener('change', syncCompactViewport);
  }, []);

  useEffect(() => {
    if (urlTierIntent) {
      writeUpgradeIntent(urlTierIntent, 'assessment_discount_email');
    }
  }, [urlTierIntent]);

  const questionsPerPage = isCompactViewport ? MOBILE_QUESTIONS_PER_PAGE : DESKTOP_QUESTIONS_PER_PAGE;
  const totalPages = Math.ceil(depthQuestions.length / questionsPerPage);
  const currentQuestions = useMemo(() => (
    depthQuestions
      .slice(
        currentPage * questionsPerPage,
        (currentPage + 1) * questionsPerPage,
      )
      .map((question) => ({
        ...question,
        options: rotateOptions(question.options, question.id),
      }))
  ), [currentPage, questionsPerPage]);

  const totalAnswered = countAssessmentAnswers(answers);
  const overallProgress = Math.round((totalAnswered / depthQuestions.length) * 100);
  // Calibrated to the observed production median of roughly 23 minutes for 42 prompts.
  // Only surfaced past the halfway point so it reads as encouragement, not pressure.
  const remainingQuestions = depthQuestions.length - totalAnswered;
  const minutesLeft = Math.max(1, Math.round((remainingQuestions * 33) / 60));
  const showTimeEstimate = overallProgress >= 50 && remainingQuestions > 0;
  const isPageComplete = currentQuestions.every((question) => answers[question.id]);
  const currentLayer = currentQuestions[0]?.layer ?? 'behavioral';
  const currentLayerMeta = depthLayerMeta[currentLayer];
  const currentLayerProgress = useMemo(() => layerProgress(answers), [answers]);
  const shouldShowEmailNudge = totalAnswered >= EMAIL_NUDGE_MIN_ANSWERS && totalAnswered < depthQuestions.length;
  const preferredTier = upgradeIntent?.tier ?? 'insight';
  const showPreflight = currentPage === 0 && totalAnswered === 0;

  const pageRange = useMemo(() => {
    const start = currentPage * questionsPerPage + 1;
    const end = Math.min((currentPage + 1) * questionsPerPage, depthQuestions.length);
    return `${start}-${end}`;
  }, [currentPage, questionsPerPage]);
  const pageLabel = questionsPerPage === 1
    ? `Question ${currentPage + 1} of ${depthQuestions.length}`
    : `Questions ${pageRange} of ${depthQuestions.length}`;
  const actionHint = !isPageComplete
    ? isCompactViewport
      ? 'Select the best fit to move forward.'
      : `Answer all ${currentQuestions.length} prompts to continue.`
    : isCompactViewport && currentPage < totalPages - 1
      ? 'Selected. Moving to the next prompt.'
      : currentPage === totalPages - 1
        ? 'Ready to build your function-stack map.'
        : `Section ${currentPage + 1} of ${totalPages} complete.`;

  useEffect(() => {
    setCurrentPage((page) => Math.max(0, Math.min(page, totalPages - 1)));
  }, [totalPages]);

  useEffect(() => () => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
    }
    if (sectionRewardTimerRef.current !== null) {
      window.clearTimeout(sectionRewardTimerRef.current);
    }
  }, []);

  const celebrateSectionIfComplete = useCallback((
    questionLayer: DepthLayer,
    nextAnswers: Record<string, string>,
    prevAnswers: Record<string, string>,
  ) => {
    const layerQuestions = depthQuestions.filter((question) => question.layer === questionLayer);
    const wasComplete = layerQuestions.every((question) => prevAnswers[question.id]);
    const nowComplete = layerQuestions.every((question) => nextAnswers[question.id]);
    if (wasComplete || !nowComplete) return;

    const layerIndex = layerOrder.indexOf(questionLayer);
    const next = layerIndex >= 0 ? layerOrder[layerIndex + 1] ?? null : null;
    setSectionReward({ completed: questionLayer, next });
    trackEvent('assessment_section_completed', {
      layer: questionLayer,
      answered: countAssessmentAnswers(nextAnswers),
    });

    if (sectionRewardTimerRef.current !== null) {
      window.clearTimeout(sectionRewardTimerRef.current);
    }
    sectionRewardTimerRef.current = window.setTimeout(() => {
      sectionRewardTimerRef.current = null;
      setSectionReward(null);
    }, 2800);
  }, []);

  useEffect(() => {
    if (hasLoadedProgressRef.current) return;
    const saved = readAssessmentProgress();
    if (saved) {
      setAnswers(saved.answers);
      setCurrentPage(Math.max(0, Math.min(saved.currentPage, totalPages - 1)));

      const savedAnswered = countAssessmentAnswers(saved.answers);
      if (savedAnswered > 0 && savedAnswered < depthQuestions.length) {
        setResumedAnswered(savedAnswered);
        trackEvent('assessment_progress_resumed', {
          answered: savedAnswered,
          progress_percent: Math.round((savedAnswered / depthQuestions.length) * 100),
          resumed_page: Math.max(0, Math.min(saved.currentPage, totalPages - 1)) + 1,
        });
      }
    }
    hasLoadedProgressRef.current = true;
  }, [totalPages]);

  useEffect(() => {
    if (!hasTrackedStartRef.current) {
      trackStart();
      hasTrackedStartRef.current = true;
    }
  }, [trackStart]);

  useEffect(() => {
    if (!entryContext || hasTrackedEntryContextRef.current) return;
    trackEvent('assessment_entry_context_viewed', {
      source: entrySource || 'unknown',
      context_category: entryContext.category,
      ...(entryAttribution.parentSource ? { parent_source: entryAttribution.parentSource } : {}),
      ...(entryAttribution.utmCampaign ? { utm_campaign: entryAttribution.utmCampaign } : {}),
      ...(entryAttribution.utmSource ? { utm_source: entryAttribution.utmSource } : {}),
      ...(entryAttribution.sourceChain ? { source_chain: entryAttribution.sourceChain } : {}),
    });
    hasTrackedEntryContextRef.current = true;
  }, [entryAttribution, entryContext, entrySource]);

  useEffect(() => {
    if (authLoading || !user?.email || showCompletion || totalAnswered === 0 || totalAnswered >= depthQuestions.length) {
      return;
    }

    const progress = readAssessmentProgress();
    if (!progress) return;

    const startedAt = progress.startedAt || progress.updatedAt || new Date().toISOString();
    const updatedAt = progress.updatedAt || startedAt;
    const attemptKey = `${ABANDONED_EMAIL_ATTEMPT_PREFIX}${startedAt}`;

    if (localStorage.getItem(attemptKey)) return;

    const updatedAtTime = Date.parse(updatedAt);
    const dueAt = (Number.isFinite(updatedAtTime) ? updatedAtTime : Date.now()) + ABANDONED_EMAIL_DELAY_MS;
    const delay = Math.max(0, dueAt - Date.now());

    const timer = window.setTimeout(() => {
      const latestProgress = readAssessmentProgress();
      if (!latestProgress) return;

      const answeredCount = countAssessmentAnswers(latestProgress.answers);
      if (answeredCount === 0 || answeredCount >= depthQuestions.length) return;

      const latestStartedAt = latestProgress.startedAt || startedAt;
      const latestAttemptKey = `${ABANDONED_EMAIL_ATTEMPT_PREFIX}${latestStartedAt}`;
      if (localStorage.getItem(latestAttemptKey)) return;

      void postLifecycleEmail({
        lifecycle: 'abandoned-assessment',
        idempotencyKey: latestAttemptKey,
        progressPercent: Math.round((answeredCount / depthQuestions.length) * 100),
        completedAt: latestProgress.updatedAt,
      }).then((ok) => {
        if (ok) {
          localStorage.setItem(latestAttemptKey, new Date().toISOString());
        }
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [answers, authLoading, showCompletion, totalAnswered, user?.email]);

  useEffect(() => {
    if (isPageComplete) setFlagUnanswered(false);
  }, [isPageComplete]);

  const persist = useCallback((nextAnswers: Record<string, string>, nextPage = currentPage) => {
    writeAssessmentProgress(nextAnswers, nextPage);
  }, [currentPage]);

  const handleAnswer = useCallback((questionId: string, answerId: string, questionNumber: number) => {
    const nextAnswers = { ...answers, [questionId]: answerId };
    const answeredLayer = depthQuestions.find((question) => question.id === questionId)?.layer;

    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
    }

    setAnswers(nextAnswers);
    persist(nextAnswers);
    trackProgress(questionNumber, depthQuestions.length);
    if (answeredLayer) {
      celebrateSectionIfComplete(answeredLayer, nextAnswers, answers);
    }

    if (isCompactViewport && currentPage < totalPages - 1) {
      autoAdvanceTimerRef.current = window.setTimeout(() => {
        const nextPage = currentPage + 1;
        autoAdvanceTimerRef.current = null;
        setFlagUnanswered(false);
        setResumedAnswered(null);
        setCurrentPage(nextPage);
        persist(nextAnswers, nextPage);
        window.scrollTo({ top: 0, behavior: scrollBehavior });
      }, prefersReducedMotion ? 80 : 260);
      return;
    }

    // Desktop (multi-question page): glide to the next still-unanswered prompt
    // that comes after this one, so answering in order keeps its momentum
    // without jumping backward when an earlier answer is revised.
    if (!isCompactViewport && typeof document !== 'undefined') {
      const answeredIndex = currentQuestions.findIndex((question) => question.id === questionId);
      const nextUnanswered = currentQuestions.find(
        (question, index) => index > answeredIndex && !nextAnswers[question.id],
      );
      if (nextUnanswered) {
        window.requestAnimationFrame(() => {
          document
            .getElementById(`assessment-q-${nextUnanswered.id}`)
            ?.scrollIntoView({ behavior: scrollBehavior, block: 'center' });
        });
      }
    }
  }, [answers, celebrateSectionIfComplete, currentPage, currentQuestions, isCompactViewport, persist, prefersReducedMotion, scrollBehavior, totalPages, trackProgress]);

  const completeAssessment = useCallback(() => {
    setShowCompletion(true);
    trackComplete();

    window.setTimeout(() => {
      const results = calculateDepthResults(answers);
      localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
      localStorage.removeItem(ASSESSMENT_PROGRESS_STORAGE_KEY);

      try {
        const historyRaw = localStorage.getItem(HISTORY_KEY);
        const history = historyRaw ? JSON.parse(historyRaw) : [];
        const nextHistory = Array.isArray(history) ? [results, ...history].slice(0, 12) : [results];
        localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
      } catch {
        localStorage.setItem(HISTORY_KEY, JSON.stringify([results]));
      }

      navigate('/results');
    }, 900);
  }, [answers, navigate, trackComplete]);

  const handleNext = useCallback(() => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (!isPageComplete) {
      const firstUnanswered = currentQuestions.find((question) => !answers[question.id]);
      setFlagUnanswered(true);
      if (firstUnanswered && typeof document !== 'undefined') {
        document
          .getElementById(`assessment-q-${firstUnanswered.id}`)
          ?.scrollIntoView({ behavior: scrollBehavior, block: 'center' });
      }
      trackEvent('assessment_incomplete_advance_blocked', {
        page: currentPage + 1,
        answered_on_page: currentQuestions.filter((question) => answers[question.id]).length,
      });
      return;
    }

    setFlagUnanswered(false);
    setResumedAnswered(null);

    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      persist(answers, nextPage);
      window.scrollTo({ top: 0, behavior: scrollBehavior });
      return;
    }

    completeAssessment();
  }, [answers, completeAssessment, currentPage, currentQuestions, isPageComplete, persist, scrollBehavior, totalPages]);

  const handleBack = useCallback(() => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (currentPage > 0) {
      const nextPage = currentPage - 1;
      setFlagUnanswered(false);
      setCurrentPage(nextPage);
      persist(answers, nextPage);
      window.scrollTo({ top: 0, behavior: scrollBehavior });
    }
  }, [answers, currentPage, persist, scrollBehavior]);

  return (
    <div className="min-h-screen bg-jung-base">
      <AnimatePresence>
        {showCompletion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-jung-base/95 px-6 backdrop-blur"
          >
            <div className="max-w-sm rounded-lg border border-jung-border bg-jung-surface p-8 text-center shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
              <h2 className="mt-6 text-heading text-3xl text-jung-dark">Mapping your energy</h2>
              <p className="mt-3 text-sm leading-6 text-jung-secondary">
                Behavioral, inferior, somatic, and attitude signals are being combined now.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sectionReward && !showCompletion && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.24 }}
            className="pointer-events-none fixed inset-x-0 top-[68px] z-[60] flex justify-center px-4 sm:top-[80px]"
            role="status"
            aria-live="polite"
          >
            <div className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-jung-accent-muted bg-jung-dark px-4 py-2 text-sm font-semibold text-white shadow-lg">
              <Sparkles className="h-4 w-4 flex-none text-jung-accent-muted" />
              <span>
                {depthLayerMeta[sectionReward.completed].shortLabel} layer complete.
                {sectionReward.next
                  ? ` Next: ${depthLayerMeta[sectionReward.next].label.toLowerCase()}.`
                  : ' Last section — build your map.'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showPreflight && (
        <section className="border-b border-jung-border bg-jung-dark text-white">
          <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:py-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
                Free cognitive functions test
              </p>
              <h1 className="mt-3 text-heading text-2xl text-white sm:text-4xl">
                Before the first question, know what this assessment is testing.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72">
                TypeJung is an independent Jungian self-reflection tool, not an official MBTI instrument.
                It looks for a repeatable function pattern across four evidence layers, then shows the free
                map before any optional upgrade.
              </p>
              <p className="mt-3 max-w-3xl text-xs leading-6 text-white/55">
                Educational self-reflection, not a clinical or diagnostic assessment.
              </p>
              {entryContext && (
                <p className="mt-4 rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-xs leading-5 text-white/70">
                  {entryContext.body}
                </p>
              )}

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/55">
                  What brought you here? <span className="font-normal normal-case text-white/40">(optional)</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ASSESSMENT_INTENTS.map((intent) => {
                    const active = assessmentIntent === intent.id;
                    return (
                      <button
                        key={intent.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          const next = active ? null : intent.id;
                          setAssessmentIntent(next);
                          if (next) {
                            writeAssessmentIntent(next);
                            trackEvent('assessment_intent_selected', { intent: next });
                          }
                        }}
                        className={`inline-flex min-h-11 items-center rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                          active
                            ? 'border-jung-accent-muted bg-white text-jung-dark'
                            : 'border-white/15 bg-white/8 text-white/75 hover:border-white/35 hover:text-white'
                        }`}
                      >
                        {intent.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {preflightCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="rounded-lg border border-white/12 bg-white/8 p-4">
                    <div className="flex items-start gap-3">
                      <Icon className="mt-0.5 h-4 w-4 flex-none text-jung-accent-muted" />
                      <div>
                        <p className="text-sm font-semibold text-white">{card.label}</p>
                        <p className="mt-1 text-xs leading-5 text-white/64">{card.body}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Button
                variant="inverted"
                size="lg"
                onClick={() => document.getElementById('assessment-questions')?.scrollIntoView({ behavior: scrollBehavior, block: 'start' })}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Begin the free map
              </Button>
            </div>
          </div>
        </section>
      )}

      <header className="sticky top-[61px] z-40 border-b border-jung-border bg-jung-base/95 py-3 shadow-sm backdrop-blur sm:top-[69px] sm:py-4 lg:top-[73px]">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-jung-accent">{pageLabel}</p>
                <div className="flex flex-none items-baseline gap-1 rounded-lg border border-jung-border bg-jung-surface px-2.5 py-1 text-jung-dark lg:hidden">
                  <span className="text-lg font-semibold leading-none">{overallProgress}%</span>
                  <span className="text-[11px] text-jung-muted">done</span>
                  {showTimeEstimate && (
                    <span className="ml-1 border-l border-jung-border pl-1.5 text-[11px] font-medium text-jung-accent">~{minutesLeft}m</span>
                  )}
                </div>
              </div>
              <h1 className="mt-1 truncate text-heading text-xl text-jung-dark sm:text-3xl">{currentLayerMeta.label}</h1>
              <p className="mt-2 hidden max-w-2xl text-sm leading-6 text-jung-secondary sm:block">{currentLayerMeta.description}</p>
              <p className="mt-2 hidden text-xs font-medium text-jung-muted sm:block">
                Progress saves on this device. The full map has {depthQuestions.length} focused prompts.
              </p>
            </div>
            <div className="hidden min-w-[10rem] text-left lg:block lg:text-right">
              <p className="text-3xl font-semibold text-jung-dark">{overallProgress}%</p>
              <p className="text-sm text-jung-muted">{totalAnswered} of {depthQuestions.length} answered</p>
              {showTimeEstimate && (
                <p className="mt-1 text-xs font-medium text-jung-accent">~{minutesLeft} min left</p>
              )}
            </div>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-jung-border-light sm:mt-4 sm:h-2">
            <motion.div
              className="h-full rounded-full bg-jung-accent"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <div className="mt-3 hidden grid-cols-4 gap-1.5 sm:mt-4 sm:grid sm:gap-2">
            {currentLayerProgress.map((item) => {
              const meta = depthLayerMeta[item.layer];
              const active = item.layer === currentLayer;

              return (
                <div
                  key={item.layer}
                  className={`min-w-0 rounded-lg border px-2 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs ${
                    active
                      ? 'border-jung-accent-muted bg-jung-accent-light text-jung-accent'
                      : item.complete
                        ? 'border-jung-border bg-jung-surface text-jung-dark'
                        : 'border-jung-border bg-jung-surface/60 text-jung-muted'
                  }`}
                >
                  <span className="block truncate font-semibold sm:inline">{meta.shortLabel}</span>
                  <span className="block tabular-nums sm:ml-2 sm:inline">{item.answered}/{item.total}</span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <main id="assessment-questions" className="mx-auto w-full max-w-5xl scroll-mt-44 px-3 pb-32 pt-3 sm:scroll-mt-48 sm:px-6 sm:py-10 lg:py-14">
        {resumedAnswered !== null && !showCompletion && (
          <div className="mb-8 flex items-start gap-3 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4 shadow-sm">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-jung-dark">Welcome back — your progress is saved on this device.</p>
              <p className="mt-1 text-sm leading-6 text-jung-secondary">
                Picking up where you left off, with {resumedAnswered} of {depthQuestions.length} answered. Nothing was lost.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setResumedAnswered(null)}
              className="-m-1.5 flex-none rounded-lg p-1.5 text-jung-muted transition-colors hover:text-jung-dark"
              aria-label="Dismiss resume notice"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {currentPage === 0 && (
          <div className="mb-4 rounded-lg border border-jung-border bg-jung-surface p-3 sm:mb-8 sm:p-4">
            <div className="flex items-start gap-3 text-sm text-jung-secondary">
              <Info className="mt-0.5 h-4 w-4 flex-none text-jung-accent" />
              <p className="text-[13px] leading-5 sm:text-sm sm:leading-6">
                Answer from the first pattern that actually happens, not the version you think you should have. The "none" option is valid when the question misses you.
              </p>
            </div>
          </div>
        )}

        {entryContext && currentPage === 0 && (
          <div className="mb-5 hidden rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4 shadow-sm sm:mb-8 sm:block sm:p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-1 h-4 w-4 flex-none text-jung-accent" />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-jung-accent">
                  {entryContext.eyebrow}
                </p>
                <h2 className="mt-1 text-lg font-semibold leading-6 text-jung-dark">
                  {entryContext.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-jung-secondary">
                  {entryContext.body}
                </p>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="grid gap-4 sm:gap-5"
          >
            {currentQuestions.map((question, qIndex) => {
              const questionNumber = currentPage * questionsPerPage + qIndex + 1;
              const selectedAnswer = answers[question.id];
              const isFlagged = flagUnanswered && !selectedAnswer;

              return (
                <section
                  key={question.id}
                  id={`assessment-q-${question.id}`}
                  className={`card-premium p-3 transition-shadow sm:p-6 ${
                    isFlagged ? 'ring-2 ring-jung-accent ring-offset-2 ring-offset-jung-base' : ''
                  }`}
                >
                  <div className="min-w-0">
                    <div className="mb-2.5 flex min-w-0 items-center gap-2 sm:mb-4">
                      <span
                        className={`flex h-9 w-9 flex-none items-center justify-center rounded-lg text-sm font-semibold sm:h-11 sm:w-11 ${
                          selectedAnswer
                            ? 'bg-jung-accent text-white'
                            : 'bg-jung-accent-light text-jung-accent'
                        }`}
                      >
                        {selectedAnswer ? <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" /> : questionNumber}
                      </span>

                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="rounded-lg border border-jung-border bg-jung-surface-alt px-2.5 py-1 text-[11px] font-semibold text-jung-secondary sm:text-xs">
                          {depthLayerMeta[question.layer].shortLabel}
                        </span>
                        <span className="max-w-full truncate text-[11px] font-medium text-jung-muted sm:text-xs">{question.domain}</span>
                      </div>
                    </div>

                      <h2 className="text-lg font-semibold leading-6 text-jung-dark sm:text-2xl sm:leading-8">
                        {question.prompt}
                      </h2>
                      {question.context && (
                        <p className="mt-2 text-sm leading-6 text-jung-secondary sm:text-base">{question.context}</p>
                      )}

                      {isFlagged && (
                        <p className="mt-3 text-sm font-medium text-jung-accent" role="alert">
                          Pick one option to continue. Choose "none" if it does not fit.
                        </p>
                      )}

                      <div className="mt-4 grid gap-1.5 sm:mt-6 sm:gap-2">
                        {question.options.map((option) => {
                          const isActive = selectedAnswer === option.id;

                          return (
                            <button
                              key={option.id}
                              type="button"
                              aria-pressed={isActive}
                              aria-label={`Question ${questionNumber}: ${option.label}${isActive ? ', selected' : ''}`}
                              onClick={() => handleAnswer(question.id, option.id, questionNumber)}
                              className={`group flex min-h-11 w-full items-start gap-2.5 rounded-lg border px-3 py-2 text-left transition-all sm:min-h-14 sm:gap-3 sm:px-4 sm:py-3 ${
                                isActive
                                  ? 'border-jung-accent bg-jung-accent text-white shadow-md'
                                  : 'border-jung-border bg-jung-surface shadow-sm hover:-translate-y-px hover:border-jung-accent-muted hover:bg-jung-accent-light hover:shadow-md'
                              }`}
                            >
                              <span className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full ${
                                isActive ? 'text-white' : 'text-jung-muted group-hover:text-jung-accent'
                              }`}>
                                {isActive ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-4 w-4" />}
                              </span>
                              <span className={`text-[15px] leading-5 sm:text-base sm:leading-6 ${isActive ? 'text-white' : 'text-jung-dark'}`}>
                                {option.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                  </div>
                </section>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {shouldShowEmailNudge && (
          <div className="mt-8 rounded-lg border border-jung-accent-muted bg-jung-accent-light/70 p-4 shadow-sm sm:p-5">
            <DiscountCaptureCard
              source="assessment_progress_email_code"
              compact
              minimal
              minimalTitle="Keep your return link and upgrade code"
              minimalDescription={`You are ${overallProgress}% through. Email yourself a return link plus ${EMAIL_CAPTURE_OFFER.code}, then finish the free map before deciding on any paid report.`}
              minimalSubmitLabel="Email my link"
              minimalFootnote="Optional. Your answers still save on this device, and the email brings you back here."
              minimalSentMessage="Return link sent. Finish the assessment here; the email keeps the discounted report path handy if you leave."
              preferredTier={preferredTier}
              showCheckoutButtons={false}
            />
          </div>
        )}

        <div
          data-testid="assessment-action-bar"
          className="sticky bottom-0 z-30 -mx-3 mt-8 border-t border-jung-border bg-jung-base/96 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-14px_30px_-28px_rgb(29_38_32_/_0.65)] backdrop-blur sm:-mx-6 sm:mt-10 sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-4 sm:px-6 sm:pb-4 sm:pt-4 lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-6 lg:shadow-none lg:backdrop-blur-0"
        >
          <div className="mb-2 text-center text-xs font-medium text-jung-muted sm:hidden">
            {actionHint}
          </div>
          <div className="grid grid-cols-[0.82fr_1.18fr] gap-2 sm:contents">
          <Button
            variant="outline"
            size="md"
            onClick={handleBack}
            disabled={currentPage === 0}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="w-full px-4 sm:w-auto"
          >
            Back
          </Button>

          <div className="hidden text-center text-sm text-jung-muted sm:block">
            {actionHint}
          </div>

          <Button
            variant={isPageComplete ? 'accent' : 'secondary'}
            size="md"
            onClick={handleNext}
            aria-disabled={!isPageComplete}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="w-full px-4 sm:w-auto"
          >
            {currentPage === totalPages - 1 ? 'Build my free map' : isCompactViewport ? 'Next' : 'Continue'}
          </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
