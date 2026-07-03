import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Clock, CreditCard, LogIn, LogOut, Menu, Trophy, User, X } from 'lucide-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { TypeJungMark } from '../brand/TypeJungMark';
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

const navigation = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learn' },
  { to: '/pricing', label: 'Pricing' },
];

const externalProofLinks = [
  { href: 'https://github.com/felmonon/jungian-typology-assessment', label: 'GitHub source' },
  { href: 'https://github.com/felmonon', label: 'Creator GitHub' },
  { href: 'https://www.linkedin.com/in/felmonfekadu/', label: 'Creator LinkedIn' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState<PendingCheckout | null>(null);
  const [assessmentProgress, setAssessmentProgress] = useState<ResumableAssessmentProgress | null>(null);

  usePageTracking();

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
    window.addEventListener('typejung:pending-checkout-changed', refreshOnReturn);

    return () => {
      window.removeEventListener('focus', refreshOnReturn);
      window.removeEventListener('pageshow', refreshOnReturn);
      window.removeEventListener('storage', refreshOnReturn);
      window.removeEventListener('typejung:pending-checkout-changed', refreshOnReturn);
    };
  }, []);

  const shouldShowPendingCheckout = Boolean(
    pendingCheckout
      && !location.pathname.startsWith('/checkout')
      && location.pathname !== '/success'
  );
  const shouldShowAssessmentResume = Boolean(
    assessmentProgress
      && !shouldShowPendingCheckout
      && !location.pathname.startsWith('/assessment')
      && !location.pathname.startsWith('/checkout')
      && location.pathname !== '/results'
      && location.pathname !== '/success'
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
      ...(pendingCheckout.utmCampaign ? { utm_campaign: pendingCheckout.utmCampaign } : {}),
      ...(pendingCheckout.utmSource ? { utm_source: pendingCheckout.utmSource } : {}),
      ...(pendingCheckout.sharedResult ? { shared_result: pendingCheckout.sharedResult } : {}),
      parent_source: pendingCheckout.parentSource || pendingCheckout.source,
    };
  }, [pendingCheckout]);

  useEffect(() => {
    if (!pendingCheckout || !shouldShowPendingCheckout || !pendingCheckoutViewKey) return;

    try {
      if (sessionStorage.getItem(pendingCheckoutViewKey)) return;
      sessionStorage.setItem(pendingCheckoutViewKey, 'true');
    } catch {
      // If sessionStorage is unavailable, still send the first visible render.
    }

    trackEvent('pending_checkout_banner_viewed', {
      ...(pendingCheckoutEventParams || {}),
    });
  }, [pendingCheckout, pendingCheckoutEventParams, pendingCheckoutViewKey, shouldShowPendingCheckout]);

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
    `inline-flex min-h-10 items-center border-b-2 px-1 pt-0.5 text-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-all ${
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
          <img src={user.profileImageUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <User className="h-4 w-4" />
        )}
        <span className="max-w-24 truncate">{user?.firstName || 'Profile'}</span>
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
          <Link to="/" className="flex min-h-11 items-center gap-3" aria-label="TypeJung home">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-jung-border bg-jung-surface shadow-sm sm:h-10 sm:w-10">
              <TypeJungMark size="sm" />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-xl leading-none text-jung-dark sm:text-2xl">TypeJung</span>
              <span className="text-[11px] font-medium text-jung-muted sm:text-xs">Free function-stack map</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navLinkClass}>
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
            <Link
              to="/assessment"
              className="btn-premium hidden !min-h-10 !py-2 text-sm sm:inline-flex"
            >
              Start free
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-jung-border bg-jung-surface text-jung-dark transition-colors hover:bg-jung-surface-alt lg:hidden"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="lab-container pb-4 pt-3">
              <div className="rounded-lg border border-jung-border bg-jung-surface p-2 shadow-lg">
                {navigation.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'} className={mobileNavLinkClass}>
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
                {pendingCheckout.status === 'expired' ? 'Restart checkout' : 'Resume payment'}
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
                  Your free assessment is {assessmentProgress.progressPercent}% complete.
                </p>
                <p className="mt-1 text-xs leading-5 text-jung-secondary">
                  Resume from {assessmentProgress.answeredCount} of {assessmentProgress.totalQuestions} answered questions and finish the map before deciding on any upgrade.
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

      <footer className="rule-double bg-jung-surface/70 pt-12 pb-28 md:pb-12">
        <div className="lab-container grid gap-8 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="mb-4 inline-flex min-h-11 items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-jung-border bg-jung-surface">
                <TypeJungMark size="sm" className="scale-90" />
              </span>
              <span className="font-display text-2xl text-jung-dark">TypeJung</span>
            </Link>
            <p className="annotation max-w-sm text-sm">
              A Jungian cognitive function assessment for mapping strengths, stress edges, and growth patterns.
            </p>
          </div>

	          <nav aria-label="Explore">
	            <h2 className="text-label mb-4">Explore</h2>
	            <div className="grid gap-2 text-sm text-jung-secondary">
	              <Link to="/assessment" className="inline-flex min-h-11 items-center hover:text-jung-accent">Assessment</Link>
	              <Link to="/pricing" className="inline-flex min-h-11 items-center hover:text-jung-accent">Pricing</Link>
	              <Link to="/methodology" className="inline-flex min-h-11 items-center hover:text-jung-accent">Methodology</Link>
	              <Link to="/debrief" className="inline-flex min-h-11 items-center hover:text-jung-accent">Personal Type Debrief</Link>
	              <Link to="/learn" className="inline-flex min-h-11 items-center hover:text-jung-accent">Learn the theory</Link>
	            </div>
	          </nav>

	          <nav aria-label="Guides">
	            <h2 className="text-label mb-4">Guides</h2>
	            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-jung-secondary lg:grid-cols-1 lg:gap-2">
	              <a href="/guides" className="inline-flex min-h-11 items-center hover:text-jung-accent">All guides</a>
	              <a href="/jungian-cognitive-functions-test" className="inline-flex min-h-11 items-center hover:text-jung-accent">Jungian cognitive functions test</a>
	              <a href="/free-cognitive-function-test" className="inline-flex min-h-11 items-center hover:text-jung-accent">Free cognitive function test</a>
	              <a href="/cognitive-function-test" className="inline-flex min-h-11 items-center hover:text-jung-accent">Cognitive function test</a>
	              <a href="/inferior-function-test" className="inline-flex min-h-11 items-center hover:text-jung-accent">Inferior function test</a>
	              <a href="/best-cognitive-functions-test" className="inline-flex min-h-11 items-center hover:text-jung-accent">Best cognitive functions test</a>
	              <a href="/mbti-test-alternative" className="inline-flex min-h-11 items-center hover:text-jung-accent">MBTI test alternative</a>
	              <a href="/sakinorva-alternative" className="inline-flex min-h-11 items-center hover:text-jung-accent">Sakinorva alternative</a>
	              <a href="/16personalities-alternative" className="inline-flex min-h-11 items-center hover:text-jung-accent">16Personalities alternative</a>
	              <a href="/infj-vs-infp-test" className="inline-flex min-h-11 items-center hover:text-jung-accent">INFJ vs INFP test</a>
	              <a href="/intj-vs-intp-test" className="inline-flex min-h-11 items-center hover:text-jung-accent">INTJ vs INTP test</a>
	            </div>
	          </nav>

	          <nav aria-label="Account">
	            <h2 className="text-label mb-4">Account</h2>
	            <div className="grid gap-2 text-sm text-jung-secondary">
	              <Link to="/auth" className="inline-flex min-h-11 items-center hover:text-jung-accent">Sign in</Link>
	              <Link to="/privacy" className="inline-flex min-h-11 items-center hover:text-jung-accent">Privacy</Link>
	              <Link to="/terms" className="inline-flex min-h-11 items-center hover:text-jung-accent">Terms</Link>
                  {externalProofLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center hover:text-jung-accent"
                    >
                      {link.label}
                    </a>
                  ))}
	              <a
	                href="https://x.com/typejung"
	                target="_blank"
	                rel="noopener noreferrer"
	                className="inline-flex min-h-11 items-center gap-1.5 hover:text-jung-accent"
	              >
	                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
	                @typejung on X
	              </a>
	            </div>
	          </nav>
        </div>
        <div className="lab-container mt-10 flex flex-col gap-3 border-t border-jung-border pt-6 text-xs text-jung-muted sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} TypeJung</span>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/typejung"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 text-jung-muted hover:text-jung-accent transition-colors"
              aria-label="TypeJung on X"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              @typejung
            </a>
            <span className="inline-flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5" />
              Not a four-letter label
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
