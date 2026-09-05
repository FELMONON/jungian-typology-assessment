// Google Analytics 4 integration with validation
import { track as trackVercelEvent } from '@vercel/analytics';
import { z } from 'zod';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    __typejungFunnelAnonymousId?: string;
  }
}

const DEFAULT_GA_MEASUREMENT_ID = 'G-3CQKPQZ942';
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || DEFAULT_GA_MEASUREMENT_ID;

// Validation schemas for analytics events
const EventParamsSchema = z.record(
  z.string(),
  z.union([z.string(), z.number(), z.boolean()])
);

const PageViewSchema = z.object({
  page_path: z.string().min(1).max(500),
  page_title: z.string().min(1).max(200),
});

const AssessmentEventSchema = z.object({
  time_spent_seconds: z.number().min(0).max(7200).optional(), // Max 2 hours
  duration_seconds: z.number().min(0).max(7200).optional(),
  question_number: z.number().min(1).max(200).optional(),
  progress_percent: z.number().min(0).max(100).optional(),
  source: z.string().min(1).max(100).optional(),
  entry_page: z.string().min(1).max(500).optional(),
  utm_campaign: z.string().min(1).max(100).optional(),
  utm_source: z.string().min(1).max(100).optional(),
  shared_result: z.string().min(1).max(100).optional(),
  parent_source: z.string().min(1).max(100).optional(),
  source_chain: z.string().min(1).max(240).optional(),
  result_type: z.string().min(1).max(50).optional(),
});

const ResultsEventSchema = z.object({
  dominant_function: z.string().min(1).max(20).optional(),
  share_method: z.string().min(1).max(50).optional(),
});

const ResultSaveEventSchema = z.object({
  source: z.string().min(1).max(100).optional(),
  has_share_slug: z.boolean().optional(),
});

const PricingViewEventSchema = z.object({
  source: z.string().min(1).max(100).optional(),
  referrer: z.string().max(500).optional(),
});

const SignupEventSchema = z.object({
  method: z.string().min(1).max(50).optional(),
  source: z.string().min(1).max(100).optional(),
});

const EcommerceItemSchema = z.object({
  item_id: z.string().min(1).max(100),
  item_name: z.string().min(1).max(150),
  item_brand: z.string().min(1).max(100).optional(),
  item_category: z.string().min(1).max(100).optional(),
  item_category2: z.string().min(1).max(100).optional(),
  item_variant: z.string().min(1).max(100).optional(),
  price: z.number().min(0).max(10000),
  quantity: z.number().int().min(1).max(99),
});

const PurchaseEventSchema = z.object({
  plan: z.string().min(1).max(50),
  tier: z.string().min(1).max(50).optional(),
  value: z.number().min(0).max(10000),
  price: z.number().min(0).max(10000).optional(),
  currency: z.string().length(3).default('CAD'),
  transaction_id: z.string().min(1).max(100).optional(),
  items: z.array(EcommerceItemSchema).min(1).max(10).optional(),
});

const UpgradeEventSchema = z.object({
  location: z.string().min(1).max(100),
  tier: z.string().min(1).max(50),
});

const CTAEventSchema = z.object({
  cta_name: z.string().min(1).max(100),
  location: z.string().min(1).max(100),
  button_text: z.string().min(1).max(150).optional(),
  destination: z.string().min(1).max(500).optional(),
  tier: z.string().min(1).max(50).optional(),
});

function vercelEventProperties(params?: Record<string, any>): Record<string, string | number | boolean | null> {
  if (!params) return {};

  return Object.fromEntries(
    Object.entries(params).flatMap(([key, value]) => {
      if (value === undefined) return [];
      if (value === null || typeof value === 'boolean') return [[key, value]];
      if (typeof value === 'number') return Number.isFinite(value) ? [[key, value]] : [];
      if (typeof value === 'string') return [[key, value.substring(0, 500)]];
      return [];
    }),
  );
}

const FUNNEL_ANONYMOUS_ID_STORAGE_KEY = 'typejung_funnel_anonymous_id';
const FUNNEL_MIRROR_EVENT_NAMES = new Set([
  'result_reaction_submitted',
  'assessment_started',
  'assessment_completed',
  'results_viewed',
  'results_premium_preview_viewed',
  'results_unlock_clicked',
  'checkout_review_viewed',
]);

function randomFunnelToken(): string {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `anon_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

export function getFunnelAnonymousId(): string {
  if (typeof window === 'undefined') return randomFunnelToken();
  if (window.__typejungFunnelAnonymousId) return window.__typejungFunnelAnonymousId;

  try {
    const existing = localStorage.getItem(FUNNEL_ANONYMOUS_ID_STORAGE_KEY);
    if (existing) {
      window.__typejungFunnelAnonymousId = existing;
      return existing;
    }

    const generated = randomFunnelToken();
    localStorage.setItem(FUNNEL_ANONYMOUS_ID_STORAGE_KEY, generated);
    window.__typejungFunnelAnonymousId = generated;
    return generated;
  } catch {
    const generated = randomFunnelToken();
    window.__typejungFunnelAnonymousId = generated;
    return generated;
  }
}

function mirrorFunnelEvent(eventName: string, params?: Record<string, any>): void {
  if (typeof window === 'undefined' || !FUNNEL_MIRROR_EVENT_NAMES.has(eventName)) return;

  const isResultReaction = eventName === 'result_reaction_submitted';
  const reaction = params?.reaction;
  if (isResultReaction && !['yes', 'somewhat', 'not_yet'].includes(reaction)) return;
  // Result feedback needs only an enum, not scores, answers, or contact details.
  const properties = isResultReaction ? { reaction } : vercelEventProperties(params);
  const body = JSON.stringify({
    eventName,
    eventId: `client:${eventName}:${randomFunnelToken()}`,
    anonymousId: getFunnelAnonymousId(),
    path: isResultReaction ? '/results' : `${window.location.pathname}${window.location.search}`,
    occurredAt: new Date().toISOString(),
    properties,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon('/api/analytics', blob)) return;
    }

    void fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
  } catch (error) {
    console.warn('Analytics: Failed to mirror funnel event:', eventName, error);
  }
}

// Safe tracking helper with validation
function safeTrackEvent(
  eventName: string,
  params?: Record<string, any>,
  schema?: z.ZodSchema<any>
): boolean {
  if (!analyticsEnabled || !canTrackEvent() || typeof window === 'undefined') {
    return false;
  }

  try {
    let eventParams = params || {};

    // Validate params if schema provided
    if (schema && params) {
      const result = schema.safeParse(params);
      if (!result.success) {
        console.warn(`Analytics: Invalid params for event "${eventName}":`, result.error.format());
        // Still track the event, but without invalid params.
        eventParams = {};
      }
    }

    let tracked = false;

    // First-party funnel data must not depend on a third-party SDK succeeding.
    mirrorFunnelEvent(eventName, eventParams);

    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', eventName, eventParams);
      tracked = true;
    }

    trackVercelEvent(eventName, vercelEventProperties(eventParams));
    tracked = true;

    if (tracked) {
      analyticsState.lastEventTime = Date.now();
      analyticsState.eventCount += 1;
    }

    return tracked;
  } catch (error) {
    console.error(`Analytics: Failed to track event "${eventName}":`, error);
    analyticsState.errors.push(error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Initialize Google Analytics
export function initAnalytics(): boolean {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined') {
    console.warn('Analytics: GA_MEASUREMENT_ID not configured');
    return false;
  }

  try {
    const analyticsConfig = {
      send_page_view: false, // We'll handle page views manually for SPA
      cookie_flags: 'SameSite=None;Secure',
      allow_google_signals: false, // Privacy focused
      allow_ad_personalization_signals: false, // Privacy focused
    };

    // Check if already initialized
    if (window.gtag && window.dataLayer) {
      window.gtag('config', GA_MEASUREMENT_ID, analyticsConfig);
      analyticsState.isInitialized = true;
      return true;
    }

    // Add gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, analyticsConfig);
    analyticsState.isInitialized = true;

    return true;
  } catch (error) {
    console.error('Analytics: Failed to initialize:', error);
    analyticsState.errors.push(error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Track page views (call on route change)
export function trackPageView(path: string, title?: string): boolean {
  const params = {
    page_path: path,
    page_title: title || document.title,
  };

  const validation = PageViewSchema.safeParse(params);
  if (!validation.success) {
    console.warn('Analytics: Invalid page view params:', validation.error.format());
    return false;
  }

  return safeTrackEvent('page_view', params);
}

// Track custom events
export function trackEvent(
  eventName: string,
  params?: Record<string, any>
): boolean {
  // Validate event name
  if (!eventName || typeof eventName !== 'string' || eventName.length > 100) {
    console.warn('Analytics: Invalid event name');
    return false;
  }

  // Sanitize event name (GA4 requirements)
  const sanitizedName = eventName
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .substring(0, 40);

  return safeTrackEvent(sanitizedName, params);
}

function buildEcommerceItems(plan: string, price: number) {
  const normalizedPlan = String(plan || 'premium')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .substring(0, 50) || 'premium';
  const planLabel = normalizedPlan === 'mastery'
    ? 'Mastery'
    : normalizedPlan === 'insight'
      ? 'Insight'
      : String(plan || 'Premium').substring(0, 50);
  const safePrice = Math.max(0, Number(price));

  return [
    {
      item_id: `typejung_${normalizedPlan}`,
      item_name: `TypeJung ${planLabel} Package`,
      item_brand: 'TypeJung',
      item_category: 'Digital assessment',
      item_category2: 'Jungian typology report',
      item_variant: planLabel,
      price: safePrice,
      quantity: 1,
    },
  ];
}

// Predefined events for the assessment with validation
export const AnalyticsEvents = {
  // Assessment funnel
  assessmentStarted: (
    source = 'assessment_page',
    entryPage?: string,
    attribution?: { utmCampaign?: string; utmSource?: string; sharedResult?: string; parentSource?: string; sourceChain?: string },
  ) => {
    const params = {
      source: String(source).substring(0, 100),
      ...(entryPage ? { entry_page: String(entryPage).substring(0, 500) } : {}),
      ...(attribution?.utmCampaign ? { utm_campaign: String(attribution.utmCampaign).substring(0, 100) } : {}),
      ...(attribution?.utmSource ? { utm_source: String(attribution.utmSource).substring(0, 100) } : {}),
      ...(attribution?.sharedResult ? { shared_result: String(attribution.sharedResult).substring(0, 100) } : {}),
      ...(attribution?.parentSource ? { parent_source: String(attribution.parentSource).substring(0, 100) } : {}),
      ...(attribution?.sourceChain ? { source_chain: String(attribution.sourceChain).substring(0, 240) } : {}),
    };
    return safeTrackEvent('assessment_started', params, AssessmentEventSchema);
  },
  
  assessmentCompleted: (
    timeSpentSeconds: number,
    source?: string,
    entryPage?: string,
    attribution?: { utmCampaign?: string; utmSource?: string; sharedResult?: string; parentSource?: string; sourceChain?: string },
  ) => {
    const seconds = Math.round(timeSpentSeconds);
    const params = {
      time_spent_seconds: seconds,
      duration_seconds: seconds,
      result_type: 'depth_energy_map',
      ...(source ? { source: String(source).substring(0, 100) } : {}),
      ...(entryPage ? { entry_page: String(entryPage).substring(0, 500) } : {}),
      ...(attribution?.utmCampaign ? { utm_campaign: String(attribution.utmCampaign).substring(0, 100) } : {}),
      ...(attribution?.utmSource ? { utm_source: String(attribution.utmSource).substring(0, 100) } : {}),
      ...(attribution?.sharedResult ? { shared_result: String(attribution.sharedResult).substring(0, 100) } : {}),
      ...(attribution?.parentSource ? { parent_source: String(attribution.parentSource).substring(0, 100) } : {}),
      ...(attribution?.sourceChain ? { source_chain: String(attribution.sourceChain).substring(0, 240) } : {}),
    };
    const validation = AssessmentEventSchema.safeParse(params);
    if (!validation.success) {
      console.warn('Analytics: Invalid completion params:', validation.error.format());
    }
    return safeTrackEvent('assessment_completed', params, AssessmentEventSchema);
  },
  
  assessmentAbandoned: (
    questionNumber: number,
    source?: string,
    attribution?: { utmCampaign?: string; utmSource?: string; sharedResult?: string; parentSource?: string; sourceChain?: string },
  ) => {
    const params = {
      question_number: Math.round(questionNumber),
      ...(source ? { source: String(source).substring(0, 100) } : {}),
      ...(attribution?.utmCampaign ? { utm_campaign: String(attribution.utmCampaign).substring(0, 100) } : {}),
      ...(attribution?.utmSource ? { utm_source: String(attribution.utmSource).substring(0, 100) } : {}),
      ...(attribution?.sharedResult ? { shared_result: String(attribution.sharedResult).substring(0, 100) } : {}),
      ...(attribution?.parentSource ? { parent_source: String(attribution.parentSource).substring(0, 100) } : {}),
      ...(attribution?.sourceChain ? { source_chain: String(attribution.sourceChain).substring(0, 240) } : {}),
    };
    return safeTrackEvent('assessment_abandoned', params, AssessmentEventSchema);
  },

  // Question progress
  questionAnswered: (questionNumber: number, totalQuestions: number) => {
    const progressPercent = totalQuestions > 0 
      ? Math.round((questionNumber / totalQuestions) * 100)
      : 0;
    
    const params = {
      question_number: Math.round(questionNumber),
      progress_percent: Math.min(100, Math.max(0, progressPercent)),
    };
    return safeTrackEvent('question_answered', params, AssessmentEventSchema);
  },

  // Results
  resultsViewed: (dominantFunction: string) => {
    const validFunctions = ['Te', 'Ti', 'Fe', 'Fi', 'Se', 'Si', 'Ne', 'Ni'];
    const func = validFunctions.includes(dominantFunction) ? dominantFunction : 'unknown';
    const params = { dominant_function: func };
    return safeTrackEvent('results_viewed', params, ResultsEventSchema);
  },
  
  resultsShared: (method: 'link' | 'twitter' | 'facebook' | 'linkedin') => {
    const validMethods = ['link', 'twitter', 'facebook', 'linkedin'];
    const shareMethod = validMethods.includes(method) ? method : 'unknown';
    const params = { share_method: shareMethod };
    return safeTrackEvent('results_shared', params, ResultsEventSchema);
  },
  
  resultsSaved: () => {
    const params = { source: 'legacy_hook' };
    const canonicalEventTracked = safeTrackEvent('result_saved', params, ResultSaveEventSchema);
    const legacyEventTracked = safeTrackEvent('results_saved', params, ResultSaveEventSchema);
    return canonicalEventTracked || legacyEventTracked;
  },

  resultSaved: (source = 'results_page', hasShareSlug?: boolean) => {
    const params = {
      source: String(source).substring(0, 100),
      ...(typeof hasShareSlug === 'boolean' ? { has_share_slug: hasShareSlug } : {}),
    };
    const canonicalEventTracked = safeTrackEvent('result_saved', params, ResultSaveEventSchema);
    const legacyEventTracked = safeTrackEvent('results_saved', params, ResultSaveEventSchema);
    return canonicalEventTracked || legacyEventTracked;
  },

  // Conversions
  pricingViewed: (source = 'direct', referrer?: string) => {
    const cleanedReferrer = typeof referrer === 'string' && referrer.trim()
      ? referrer.trim().substring(0, 500)
      : undefined;
    const params = {
      source: String(source).substring(0, 100),
      ...(cleanedReferrer ? { referrer: cleanedReferrer } : {}),
    };
    return safeTrackEvent('pricing_viewed', params, PricingViewEventSchema);
  },

  signupStarted: (method = 'email', source?: string) => {
    const params = {
      method: String(method).substring(0, 50),
      ...(source ? { source: String(source).substring(0, 100) } : {}),
    };
    return safeTrackEvent('signup_started', params, SignupEventSchema);
  },
  
  signupCompleted: (method = 'email', source?: string) => {
    const params = {
      method: String(method).substring(0, 50),
      ...(source ? { source: String(source).substring(0, 100) } : {}),
    };
    return safeTrackEvent('signup_completed', params, SignupEventSchema);
  },
  
  purchaseStarted: (plan: string, price: number) => {
    const params = {
      plan: String(plan).substring(0, 50),
      tier: String(plan).substring(0, 50),
      value: Math.max(0, Number(price)),
      price: Math.max(0, Number(price)),
      currency: 'CAD',
      items: buildEcommerceItems(plan, price),
    };
    const recommendedEventTracked = safeTrackEvent('begin_checkout', params, PurchaseEventSchema);
    const customEventTracked = safeTrackEvent('checkout_started', params, PurchaseEventSchema);
    return recommendedEventTracked || customEventTracked;
  },
  
  purchaseCompleted: (plan: string, price: number, transactionId?: string | null, currency = 'CAD') => {
    const cleanedTransactionId = typeof transactionId === 'string'
      ? transactionId.trim().substring(0, 100)
      : '';
    const cleanedCurrency = /^[A-Z]{3}$/.test(currency) ? currency : 'CAD';
    const params = {
      plan: String(plan).substring(0, 50),
      tier: String(plan).substring(0, 50),
      value: Math.max(0, Number(price)),
      price: Math.max(0, Number(price)),
      currency: cleanedCurrency,
      ...(cleanedTransactionId ? { transaction_id: cleanedTransactionId } : {}),
      items: buildEcommerceItems(plan, price),
    };
    const recommendedEventTracked = safeTrackEvent('purchase', params, PurchaseEventSchema);
    const customEventTracked = safeTrackEvent('purchase_completed', params, PurchaseEventSchema);
    return recommendedEventTracked || customEventTracked;
  },

  upgradeClicked: (location: string, tier: string) => {
    const params = {
      location: String(location).substring(0, 100),
      tier: String(tier).substring(0, 50),
    };
    return safeTrackEvent('upgrade_clicked', params, UpgradeEventSchema);
  },

  // Engagement
  theoryPageViewed: () => {
    return safeTrackEvent('theory_page_viewed');
  },
  
  aboutPageViewed: () => {
    return safeTrackEvent('about_page_viewed');
  },
  
  ctaClicked: (ctaName: string, location: string, options?: { buttonText?: string; destination?: string; tier?: string }) => {
    const params = {
      cta_name: String(ctaName).substring(0, 100),
      location: String(location).substring(0, 100),
      ...(options?.buttonText ? { button_text: String(options.buttonText).substring(0, 150) } : {}),
      ...(options?.destination ? { destination: String(options.destination).substring(0, 500) } : {}),
      ...(options?.tier ? { tier: String(options.tier).substring(0, 50) } : {}),
    };
    return safeTrackEvent('cta_clicked', params, CTAEventSchema);
  },

  // Error tracking
  errorOccurred: (errorType: string, errorMessage?: string) => {
    const params = {
      error_type: String(errorType).substring(0, 50),
      error_message: errorMessage ? String(errorMessage).substring(0, 150) : undefined,
    };
    return safeTrackEvent('error_occurred', params);
  },

  // Performance tracking
  pageLoadTime: (loadTimeMs: number) => {
    const params = {
      load_time_ms: Math.round(loadTimeMs),
    };
    return safeTrackEvent('page_load_time', params);
  },

  // Feature usage
  featureUsed: (featureName: string) => {
    const params = {
      feature_name: String(featureName).substring(0, 50),
    };
    return safeTrackEvent('feature_used', params);
  },
};

// Analytics state tracking
interface AnalyticsState {
  isInitialized: boolean;
  lastEventTime: number;
  eventCount: number;
  errors: string[];
}

const analyticsState: AnalyticsState = {
  isInitialized: false,
  lastEventTime: 0,
  eventCount: 0,
  errors: [],
};

// Rate limiting helper
export function canTrackEvent(): boolean {
  const now = Date.now();
  const timeSinceLastEvent = now - analyticsState.lastEventTime;
  
  // Limit to 100 events per minute
  if (timeSinceLastEvent < 600 && analyticsState.eventCount > 100) {
    return false;
  }
  
  // Reset counter after a minute
  if (timeSinceLastEvent > 60000) {
    analyticsState.eventCount = 0;
  }
  
  return true;
}

// Get analytics status (for debugging)
export function getAnalyticsStatus(): AnalyticsState {
  return { ...analyticsState };
}

// Enable/disable analytics
let analyticsEnabled = true;

export function setAnalyticsEnabled(enabled: boolean): void {
  analyticsEnabled = enabled;
  if (!enabled && typeof window !== 'undefined') {
    // Clear any pending events
    window.dataLayer = [];
  }
}

export function isAnalyticsEnabled(): boolean {
  return analyticsEnabled;
}
