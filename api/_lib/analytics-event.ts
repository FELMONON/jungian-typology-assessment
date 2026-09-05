import { track as trackVercelServerEvent } from '@vercel/analytics/server';
import { randomUUID } from 'node:crypto';
import { isFunnelEventName, type FunnelEventInput } from './funnel-events.js';

type AnalyticsProperty = string | number | boolean | null;

export type NormalizedAnalyticsEvent = {
  eventName: string;
  properties: Record<string, AnalyticsProperty>;
  funnelEvent?: FunnelEventInput;
};

const CREATOR_EVENT_NAMES = new Set([
  'creator_safe_mention_copied',
]);

const WEB_VITAL_NAMES = new Set([
  'CLS',
  'FCP',
  'FID',
  'INP',
  'LCP',
  'TTFB',
  'PAGE_LOAD',
]);

const cleanToken = (value: unknown, maxLength = 100): string | undefined => {
  if (typeof value !== 'string') return undefined;

  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, maxLength);

  return cleaned || undefined;
};

const cleanSourceChain = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;

  const tokens = value
    .split('>')
    .map((token) => cleanToken(token, 80))
    .filter((token): token is string => Boolean(token));
  const uniqueTokens = Array.from(new Set(tokens));
  const cleaned = uniqueTokens.join('>').slice(0, 240);

  return cleaned || undefined;
};

const cleanPath = (value: unknown, maxLength = 500): string | undefined => {
  if (typeof value !== 'string') return undefined;

  const cleaned = value.trim().slice(0, maxLength);
  if (!cleaned || cleaned.startsWith('//')) return undefined;
  if (!cleaned.startsWith('/')) return undefined;
  return cleaned;
};

const cleanLabel = (value: unknown, maxLength = 160): string | undefined => {
  if (typeof value !== 'string') return undefined;

  const cleaned = value
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);

  return cleaned || undefined;
};

const cleanNumber = (value: unknown, min = 0, max = 120_000): number | undefined => {
  const numeric = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric)) return undefined;
  return Math.min(max, Math.max(min, numeric));
};

const cleanCurrency = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(cleaned) ? cleaned : undefined;
};

const cleanOccurredAt = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};

const cleanAnalyticsProperties = (value: unknown): Record<string, AnalyticsProperty> => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([key, propertyValue]) => {
      const cleanedKey = cleanToken(key, 80);
      if (!cleanedKey) return [];
      if (propertyValue === null || typeof propertyValue === 'boolean') return [[cleanedKey, propertyValue]];
      if (typeof propertyValue === 'number') return Number.isFinite(propertyValue) ? [[cleanedKey, propertyValue]] : [];
      if (typeof propertyValue === 'string') return [[cleanedKey, propertyValue.slice(0, 500)]];
      return [];
    }),
  ) as Record<string, AnalyticsProperty>;
};

const firstDefined = (...values: unknown[]): unknown => values.find((value) => value !== undefined && value !== null);

const normalizeObjectBody = (body: unknown): Record<string, unknown> | null => {
  if (!body) return null;

  if (Buffer.isBuffer(body)) {
    return normalizeObjectBody(body.toString('utf8'));
  }

  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      return normalizeObjectBody(parsed);
    } catch {
      return null;
    }
  }

  if (typeof body !== 'object' || Array.isArray(body)) return null;
  return body as Record<string, unknown>;
};

function normalizeCreatorEvent(input: Record<string, unknown>, eventName: string): NormalizedAnalyticsEvent {
  const properties = {
    source: cleanToken(input.source) || 'creator_share_kit',
    ...(cleanToken(input.copyId ?? input.copy_id) ? { copy_id: cleanToken(input.copyId ?? input.copy_id) } : {}),
    ...(cleanLabel(input.snippetLabel ?? input.snippet_label) ? { snippet_label: cleanLabel(input.snippetLabel ?? input.snippet_label) } : {}),
    ...(cleanPath(input.publicPath ?? input.public_path) ? { public_path: cleanPath(input.publicPath ?? input.public_path) } : {}),
    ...(cleanPath(input.pagePath ?? input.page_path) ? { page_path: cleanPath(input.pagePath ?? input.page_path) } : {}),
    ...(cleanToken(input.utmSource ?? input.utm_source) ? { utm_source: cleanToken(input.utmSource ?? input.utm_source) } : {}),
    ...(cleanToken(input.utmCampaign ?? input.utm_campaign) ? { utm_campaign: cleanToken(input.utmCampaign ?? input.utm_campaign) } : {}),
    ...(cleanToken(input.parentSource ?? input.parent_source) ? { parent_source: cleanToken(input.parentSource ?? input.parent_source) } : {}),
    ...(cleanSourceChain(input.sourceChain ?? input.source_chain) ? { source_chain: cleanSourceChain(input.sourceChain ?? input.source_chain) } : {}),
  };

  return {
    eventName,
    properties,
  };
}

function normalizeWebVitalEvent(input: Record<string, unknown>): NormalizedAnalyticsEvent | null {
  const metricName = cleanToken(input.name, 40)?.toUpperCase();
  if (!metricName || !WEB_VITAL_NAMES.has(metricName)) return null;

  return {
    eventName: 'web_vital_reported',
    properties: {
      metric_name: metricName,
      ...(cleanNumber(input.value) !== undefined ? { metric_value: cleanNumber(input.value)! } : {}),
      ...(cleanNumber(input.delta) !== undefined ? { metric_delta: cleanNumber(input.delta)! } : {}),
      ...(cleanToken(input.rating, 40) ? { metric_rating: cleanToken(input.rating, 40)! } : {}),
      ...(cleanToken(input.id, 100) ? { metric_id: cleanToken(input.id, 100)! } : {}),
    },
  };
}

function normalizeFunnelEvent(input: Record<string, unknown>, eventName: string): NormalizedAnalyticsEvent | null {
  if (!isFunnelEventName(eventName)) return null;

  const properties = cleanAnalyticsProperties(input.properties);
  const source = cleanToken(firstDefined(input.source, properties.source, properties.acquisition_source), 120);
  const path = cleanPath(firstDefined(input.path, input.pagePath, input.page_path, properties.page_path, properties.entry_page));
  const tier = cleanToken(firstDefined(input.tier, properties.tier, properties.plan), 80);
  const checkoutIntentId = cleanToken(firstDefined(input.checkoutIntentId, input.checkout_intent_id, properties.checkout_intent_id), 120);
  const stripeSessionId = cleanToken(firstDefined(input.stripeSessionId, input.stripe_session_id, properties.stripe_session_id), 160);
  const purchaseId = cleanToken(firstDefined(input.purchaseId, input.purchase_id, properties.purchase_id), 120);
  const dominantFunction = cleanToken(firstDefined(input.dominantFunction, input.dominant_function, properties.dominant_function), 40);
  const inferiorFunction = cleanToken(firstDefined(input.inferiorFunction, input.inferior_function, properties.inferior_function), 40);
  const reliability = cleanToken(firstDefined(input.reliability, properties.reliability), 80);
  const value = cleanNumber(firstDefined(input.value, properties.value, input.price, properties.price), 0, 100_000);
  const currency = cleanCurrency(firstDefined(input.currency, properties.currency));
  const eventId = typeof input.eventId === 'string' && input.eventId.trim()
    ? input.eventId.trim().slice(0, 180)
    : typeof input.event_id === 'string' && input.event_id.trim()
      ? input.event_id.trim().slice(0, 180)
      : `server:${eventName}:${randomUUID()}`;

  return {
    eventName,
    properties,
    funnelEvent: {
      eventId,
      eventName,
      anonymousId: cleanToken(firstDefined(input.anonymousId, input.anonymous_id), 160),
      source,
      path,
      tier,
      checkoutIntentId,
      stripeSessionId,
      purchaseId,
      dominantFunction,
      inferiorFunction,
      reliability,
      value,
      currency,
      properties,
      occurredAt: cleanOccurredAt(firstDefined(input.occurredAt, input.occurred_at)),
    },
  };
}

export function normalizeAnalyticsEvent(body: unknown): NormalizedAnalyticsEvent | null {
  const input = normalizeObjectBody(body);
  if (!input) return null;

  const eventName = cleanToken(input.eventName ?? input.event ?? input.name, 80);
  if (eventName === 'result_reaction_submitted') {
    const properties = input.properties as Record<string, unknown> | undefined;
    const reaction = properties?.reaction;
    if (reaction !== 'yes' && reaction !== 'somewhat' && reaction !== 'not_yet') return null;

    // Keep this first-party feedback record free of assessment and contact data.
    // Do not pass arbitrary top-level fields or URL query parameters through.
    return normalizeFunnelEvent({
      eventId: input.eventId ?? input.event_id,
      anonymousId: input.anonymousId ?? input.anonymous_id,
      occurredAt: input.occurredAt ?? input.occurred_at,
      path: '/results',
      properties: { reaction },
    }, eventName);
  }

  if (eventName && CREATOR_EVENT_NAMES.has(eventName)) {
    return normalizeCreatorEvent(input, eventName);
  }

  if (eventName && isFunnelEventName(eventName)) {
    return normalizeFunnelEvent(input, eventName);
  }

  return normalizeWebVitalEvent(input);
}

export async function trackNormalizedAnalyticsEvent(event: NormalizedAnalyticsEvent): Promise<void> {
  // The existing browser event already reaches Vercel; this endpoint only adds
  // first-party persistence for result feedback, not a second Vercel event.
  if (event.eventName === 'result_reaction_submitted') return;
  await trackVercelServerEvent(event.eventName, event.properties);
}
