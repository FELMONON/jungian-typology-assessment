import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  LogIn,
  LogOut,
  Menu,
  Trophy,
  User,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { usePageTracking } from '../../hooks/useAnalytics';
import { trackEvent } from '../../lib/analytics';
import {
  dismissAssessmentResumePrompt,
  readResumableAssessmentProgress,
  type ResumableAssessmentProgress,
} from '../../lib/assessment-progress';
import {
  clearPendingCheckout,
  pendingCheckoutName,
  pendingCheckoutPriceLabel,
  pendingCheckoutRestartPath,
  readPendingCheckout,
  type PendingCheckout,
} from '../../lib/pending-checkout';
import { TypeJungMark } from '../brand/TypeJungMark';

const navigation = [
  { to: '/methodology', label: 'How it works' },
  { to: '/sample-report', label: 'Sample report' },
  { to: '/pricing', label: 'Pricing' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isFocusedJourney =
    location.pathname === '/assessment' ||
    location.pathname.startsWith('/checkout') ||
    location.pathname === '/success';
  const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pendingCheckout, setPendingCheckout] =
    useState<PendingCheckout | null>(null);
  const [assessmentProgress, setAssessmentProgress] =
    useState<ResumableAssessmentProgress | null>(null);

  usePageTracking();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMobileMenuOpen(false);
      document.getElementById('site-menu-toggle')?.focus();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const refreshRecoveryPrompts = () => {
    setPendingCheckout(readPendingCheckout());
    setAssessmentProgress(readResumableAssessmentProgress());
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    refreshRecoveryPrompts();
  }, [location.pathname]);

  useEffect(() => {
    refreshRecoveryPrompts();

    const refreshOnReturn = () => refreshRecoveryPrompts();

    window.addEventListener('focus', refreshOnReturn);
    window.addEventListener('pageshow', refreshOnReturn);
    window.addEventListener('storage', refreshOnReturn);
    window.addEventListener(
      'typejung:pending-checkout-changed',
      refreshOnReturn,
    );

    return () => {
      window.removeEventListener('focus', refreshOnReturn);
      window.removeEventListener('pageshow', refreshOnReturn);
      window.removeEventListener('storage', refreshOnReturn);
      window.removeEventListener(
        'typejung:pending-checkout-changed',
        refreshOnReturn,
      );
    };
  }, []);

  const shouldShowPendingCheckout = Boolean(
    pendingCheckout &&
      !isFocusedJourney &&
      !location.pathname.startsWith('/checkout') &&
      location.pathname !== '/success',
  );
  const shouldShowAssessmentResume = Boolean(
    assessmentProgress &&
      !shouldShowPendingCheckout &&
      !location.pathname.startsWith('/assessment') &&
      !location.pathname.startsWith('/checkout') &&
      location.pathname !== '/results' &&
      location.pathname !== '/success',
  );
  const pendingCheckoutViewKey = useMemo(() => {
    if (!pendingCheckout || !shouldShowPendingCheckout) return null;
    return [
      'typejung_pending_checkout_banner_viewed',
      pendingCheckout.tier,
      pendingCheckout.status,
      pendingCheckout.sessionId || pendingCheckout.createdAt,
    ].join('_');
  }, [pendingCheckout, shouldShowPendingCheckout]);
  const pendingCheckoutEventParams = useMemo(() => {
    if (!pendingCheckout) return null;

    return {
      tier: pendingCheckout.tier,
      status: pendingCheckout.status,
      source: 'global_recovery_banner',
      original_checkout_source: pendingCheckout.source,
      ...(pendingCheckout.utmCampaign
        ? { utm_campaign: pendingCheckout.utmCampaign }
        : {}),
      ...(pendingCheckout.utmSource
        ? { utm_source: pendingCheckout.utmSource }
        : {}),
      ...(pendingCheckout.sharedResult
        ? { shared_result: pendingCheckout.sharedResult }
        : {}),
      parent_source: pendingCheckout.parentSource || pendingCheckout.source,
    };
  }, [pendingCheckout]);

  useEffect(() => {
    if (
      !pendingCheckout ||
      !shouldShowPendingCheckout ||
      !pendingCheckoutViewKey
    )
      return;

    try {
      if (sessionStorage.getItem(pendingCheckoutViewKey)) return;
      sessionStorage.setItem(pendingCheckoutViewKey, 'true');
    } catch {
      // If sessionStorage is unavailable, still send the first visible render.
    }

    trackEvent('pending_checkout_banner_viewed', {
      ...(pendingCheckoutEventParams || {}),
    });
  }, [
    pendingCheckout,
    pendingCheckoutEventParams,
    pendingCheckoutViewKey,
    shouldShowPendingCheckout,
  ]);

  const resumePendingCheckout = () => {
    if (!pendingCheckout) return;

    if (pendingCheckout.status === 'expired') {
      trackEvent('pending_checkout_restart_clicked', {
        ...(pendingCheckoutEventParams || {}),
      });
      const restartPath = pendingCheckoutRestartPath(pendingCheckout);
      clearPendingCheckout();
      setPendingCheckout(null);
      navigate(restartPath);
      return;
    }

    trackEvent('pending_checkout_resume_clicked', {
      ...(pendingCheckoutEventParams || {}),
    });
    window.location.href = pendingCheckout.url;
  };

  const dismissPendingCheckout = () => {
    if (pendingCheckout) {
      trackEvent('pending_checkout_dismissed', {
        ...(pendingCheckoutEventParams || {}),
      });
    }
    clearPendingCheckout();
    setPendingCheckout(null);
  };

  const resumeAssessment = () => {
    if (!assessmentProgress) return;

    trackEvent('assessment_resume_clicked', {
      source: 'global_resume_banner',
      progress_percent: assessmentProgress.progressPercent,
      answered_count: assessmentProgress.answeredCount,
    });
    navigate('/assessment?source=global_resume_banner');
  };

  const dismissAssessmentResume = () => {
    if (assessmentProgress) {
      trackEvent('assessment_resume_dismissed', {
        source: 'global_resume_banner',
        progress_percent: assessmentProgress.progressPercent,
        answered_count: assessmentProgress.answeredCount,
      });
    }
    dismissAssessmentResumePrompt();
    setAssessmentProgress(null);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex min-h-10 items-center border-b-2 px-1 pt-0.5 text-sm font-medium transition-all ${
      isActive
        ? 'border-jung-tension text-jung-dark'
        : 'border-transparent text-jung-muted hover:border-jung-border hover:text-jung-dark'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-11 w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-jung-accent-light text-jung-accent'
        : 'text-jung-secondary hover:bg-jung-surface-alt hover:text-jung-dark'
    }`;

  const accountAction = isAuthenticated ? (
    <div className="hidden lg:flex items-center gap-2">
      <Link
        to="/profile"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-jung-border bg-jung-surface px-3 text-sm font-medium text-jung-dark transition-colors hover:border-jung-accent-muted hover:bg-jung-accent-light"
      >
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt=""
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <User className="h-4 w-4" />
        )}
        <span className="max-w-24 truncate">
          {user?.firstName || 'Profile'}
        </span>
      </Link>
      <button
        type="button"
        onClick={() => logout()}
        disabled={isLoggingOut}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-jung-muted transition-colors hover:bg-jung-surface-alt hover:text-jung-dark disabled:opacity-50"
        aria-label="Sign out"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  ) : (
    <Link
      to="/auth"
      className="hidden h-10 items-center gap-2 rounded-lg border border-jung-border bg-jung-surface px-4 text-sm font-semibold text-jung-dark transition-colors hover:border-jung-accent-muted hover:bg-jung-accent-light lg:inline-flex"
    >
      <LogIn className="h-4 w-4" />
      Sign in
    </Link>
  );

  if (isFocusedJourney) {
    return (
      <div className="min-h-screen bg-jung-base text-jung-dark">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-jung-surface focus:p-3"
        >
          Skip to content
        </a>
        <header className="border-b border-jung-border-light bg-jung-surface/80">
          <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
            <Link
              to="/"
              aria-label="TypeJung home"
              className="flex min-h-11 items-center gap-2"
            >
              <TypeJungMark size="sm" />
              <span className="font-display text-xl">TypeJung</span>
            </Link>
            <Link
              to={location.pathname === '/assessment' ? '/' : '/results'}
              className="inline-flex min-h-11 items-center text-xs font-medium text-jung-secondary hover:text-jung-accent"
            >
              {location.pathname === '/assessment'
                ? 'Save & exit'
                : 'Back to my map'}
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 border-t border-jung-border-light px-5 py-6 text-xs text-jung-muted sm:px-8">
          <span>TypeJung · Educational self-reflection</span>
          <div className="flex gap-5">
            <Link to="/privacy">Privacy</Link>
            <a href="mailto:support@typejung.com">Support</a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jung-base text-jung-dark">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:border focus:border-jung-accent focus:bg-jung-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-jung-dark focus:shadow-lg"
      >
        Skip to content
      </a>
      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? 'glass border-jung-border py-3 shadow-sm'
            : 'border-jung-border/60 bg-jung-base/95 py-4'
        }`}
      >
        <div className="lab-container flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex min-h-11 items-center gap-3"
            aria-label="TypeJung home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-jung-border bg-jung-surface shadow-sm sm:h-10 sm:w-10">
              <TypeJungMark size="sm" />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-xl leading-none text-jung-dark sm:text-2xl">
                TypeJung
              </span>
              <span className="text-[11px] font-medium text-jung-muted sm:text-xs">
                Free function-stack map
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="hidden h-10 w-24 animate-pulse rounded-lg bg-jung-surface-alt lg:block" />
            ) : (
              accountAction
            )}
            <div className="hidden sm:block">
              <Link
                to="/assessment"
                className="btn-premium !min-h-10 !py-2 text-sm"
              >
                Start free
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-jung-border bg-jung-surface text-jung-dark transition-colors hover:bg-jung-surface-alt lg:hidden"
              aria-expanded={mobileMenuOpen}
              id="site-menu-toggle"
              aria-controls="site-mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div id="site-mobile-menu" className="lg:hidden">
            <div className="lab-container pb-4 pt-3">
              <div className="rounded-lg border border-jung-border bg-jung-surface p-2 shadow-lg">
                {navigation.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={mobileNavLinkClass}
                  >
                    {item.label}
                  </NavLink>
                ))}
                {isAuthenticated && (
                  <>
                    <NavLink to="/profile" className={mobileNavLinkClass}>
                      <span className="inline-flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile settings
                      </span>
                    </NavLink>
                    <NavLink to="/history" className={mobileNavLinkClass}>
                      <span className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        History
                      </span>
                    </NavLink>
                    <NavLink to="/leaderboard" className={mobileNavLinkClass}>
                      <span className="inline-flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Results data
                      </span>
                    </NavLink>
                  </>
                )}
                <div className="mt-2 grid gap-2 border-t border-jung-border pt-2">
                  <Link
                    to="/assessment"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg bg-jung-accent px-4 text-sm font-semibold text-white"
                  >
                    Start free assessment
                  </Link>
                  {isAuthenticated ? (
                    <button
                      type="button"
                      onClick={() => logout()}
                      disabled={isLoggingOut}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-jung-border px-4 text-sm font-semibold text-jung-dark disabled:opacity-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  ) : (
                    <Link
                      to="/auth"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-jung-border px-4 text-sm font-semibold text-jung-dark"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {shouldShowPendingCheckout && pendingCheckout && (
        <section className="border-b border-jung-accent-muted bg-jung-accent-light/80">
          <div className="lab-container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-jung-surface text-jung-accent shadow-sm">
                <CreditCard className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-jung-dark">
                  {pendingCheckout.status === 'expired'
                    ? `Your ${pendingCheckoutName(pendingCheckout.tier)} checkout expired.`
                    : `Your ${pendingCheckoutName(pendingCheckout.tier)} checkout is still open.`}
                </p>
                <p className="mt-1 text-xs leading-5 text-jung-secondary">
                  {pendingCheckout.status === 'expired'
                    ? `Start a fresh secure Stripe step for ${pendingCheckoutPriceLabel(pendingCheckout.tier)}. No subscription.`
                    : `Resume the secure Stripe step for ${pendingCheckoutPriceLabel(pendingCheckout.tier)}. No subscription.`}
                </p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-2">
              <button
                type="button"
                onClick={resumePendingCheckout}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-jung-accent px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-jung-accent-hover"
              >
                {pendingCheckout.status === 'expired'
                  ? 'Restart checkout'
                  : 'Resume payment'}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={dismissPendingCheckout}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-jung-border bg-jung-surface text-jung-muted transition hover:text-jung-dark"
                aria-label="Dismiss pending checkout"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {shouldShowAssessmentResume && assessmentProgress && (
        <section className="border-b border-jung-border bg-jung-surface">
          <div className="lab-container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-jung-accent-light text-jung-accent shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-jung-dark">
                  Your free assessment is {assessmentProgress.progressPercent}%
                  complete.
                </p>
                <p className="mt-1 text-xs leading-5 text-jung-secondary">
                  Resume from {assessmentProgress.answeredCount} of{' '}
                  {assessmentProgress.totalQuestions} answered questions and
                  finish the map before deciding on any upgrade.
                </p>
              </div>
            </div>
            <div className="flex flex-none items-center gap-2">
              <button
                type="button"
                onClick={resumeAssessment}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-jung-accent px-4 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-jung-accent-hover"
              >
                Resume assessment
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={dismissAssessmentResume}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-jung-border bg-jung-surface text-jung-muted transition hover:text-jung-dark"
                aria-label="Dismiss assessment reminder"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      <main id="main-content">{children}</main>

      <footer className="border-t border-jung-border bg-jung-surface">
        <div className="lab-container grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex min-h-11 items-center gap-2">
              <TypeJungMark size="sm" />
              <span className="font-display text-2xl">TypeJung</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-jung-muted">
              Explore the pattern behind your personality. A tool for
              educational self-reflection.
            </p>
            <a
              href="mailto:support@typejung.com"
              className="mt-3 inline-flex min-h-11 items-center text-xs text-jung-accent"
            >
              support@typejung.com
            </a>
          </div>
          <nav aria-label="Explore TypeJung">
            <p className="journey-eyebrow mb-3">Explore</p>
            <div className="grid grid-cols-2 gap-x-4 text-xs text-jung-secondary">
              {[
                ['/assessment', 'Free assessment'],
                ['/pricing', 'Pricing'],
                ['/sample-report', 'Sample report'],
                ['/methodology', 'Methodology'],
                ['/learn', 'Learn the theory'],
                ['/debrief', 'Personal debrief'],
              ].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="inline-flex min-h-11 items-center hover:text-jung-accent"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
          <nav aria-label="Help and resources">
            <p className="journey-eyebrow mb-3">Good to know</p>
            <div className="grid grid-cols-2 gap-x-4 text-xs text-jung-secondary">
              {[
                ['/about', 'About TypeJung'],
                ['/auth', 'Account'],
                ['/privacy', 'Privacy'],
                ['/terms', 'Terms'],
              ].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="inline-flex min-h-11 items-center hover:text-jung-accent"
                >
                  {label}
                </Link>
              ))}
              <a
                href="/guides"
                className="inline-flex min-h-11 items-center hover:text-jung-accent"
              >
                All guides
              </a>
              <a
                href="https://github.com/felmonon/jungian-typology-assessment"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center hover:text-jung-accent"
              >
                View source
              </a>
            </div>
          </nav>
        </div>
        <div className="lab-container flex flex-wrap justify-between gap-3 border-t border-jung-border-light py-5 text-[11px] text-jung-muted">
          <span>© {new Date().getFullYear()} TypeJung</span>
          <span>Made for curiosity and reflection.</span>
        </div>
      </footer>
    </div>
  );
};
