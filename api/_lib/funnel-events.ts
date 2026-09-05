import type { SupabaseClient } from '@supabase/supabase-js';

type FunnelEventProperties = Record<string, string | number | boolean | null>;

export type FunnelEventInput = {
  eventId: string;
  eventName: string;
  anonymousId?: string | null;
  source?: string | null;
  path?: string | null;
  tier?: string | null;
  checkoutIntentId?: string | null;
  stripeSessionId?: string | null;
  purchaseId?: string | null;
  dominantFunction?: string | null;
  inferiorFunction?: string | null;
  reliability?: string | null;
  value?: number | null;
  currency?: string | null;
  properties?: FunnelEventProperties;
  occurredAt?: string | null;
};

const FUNNEL_EVENT_NAMES = new Set([
  'result_reaction_submitted',
  'assessment_started',
  'assessment_completed',
  'results_viewed',
  'results_premium_preview_viewed',
  'results_unlock_clicked',
  'checkout_review_viewed',
  'checkout_session_created',
  'purchase',
]);

function cleanToken(value: unknown, maxLength = 120): string | null {
  if (typeof value !== 'string') return null;

  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, maxLength);

  return cleaned || null;
}

function cleanPath(value: unknown): string | null {
  if (typeof value !== 'string') return null;

  const cleaned = value.trim().slice(0, 500);
  if (!cleaned || cleaned.startsWith('//')) return null;
  if (!cleaned.startsWith('/')) return null;
  return cleaned;
}

function cleanCurrency(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim().toUpperCase();
  return /^[A-Z]{3}$/.test(cleaned) ? cleaned : null;
}

function cleanNumber(value: unknown): number | null {
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function cleanOccurredAt(value: unknown): string {
  if (typeof value !== 'string') return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function cleanProperties(properties: FunnelEventInput['properties']): FunnelEventProperties {
  if (!properties || typeof properties !== 'object') return {};

  return Object.fromEntries(
    Object.entries(properties).flatMap(([key, value]) => {
      const cleanedKey = cleanToken(key, 80);
      if (!cleanedKey) return [];
      if (value === null || typeof value === 'boolean') return [[cleanedKey, value]];
      if (typeof value === 'number') return Number.isFinite(value) ? [[cleanedKey, value]] : [];
      if (typeof value === 'string') return [[cleanedKey, value.slice(0, 500)]];
      return [];
    }),
  ) as FunnelEventProperties;
}

export function isFunnelEventName(eventName: string): boolean {
  return FUNNEL_EVENT_NAMES.has(eventName);
}

export async function recordFunnelEvent(
  supabase: SupabaseClient,
  input: FunnelEventInput,
): Promise<void> {
  const eventName = cleanToken(input.eventName, 80);
  const eventId = typeof input.eventId === 'string' && input.eventId.trim()
    ? input.eventId.trim().slice(0, 180)
    : null;

  if (!eventName || !FUNNEL_EVENT_NAMES.has(eventName) || !eventId) {
    return;
  }

  const row = {
    event_id: eventId,
    anonymous_id: cleanToken(input.anonymousId, 160),
    event_name: eventName,
    source: cleanToken(input.source, 120),
    path: cleanPath(input.path),
    tier: cleanToken(input.tier, 80),
    checkout_intent_id: cleanToken(input.checkoutIntentId, 120),
    stripe_session_id: cleanToken(input.stripeSessionId, 160),
    purchase_id: cleanToken(input.purchaseId, 120),
    dominant_function: cleanToken(input.dominantFunction, 40),
    inferior_function: cleanToken(input.inferiorFunction, 40),
    reliability: cleanToken(input.reliability, 80),
    value: cleanNumber(input.value),
    currency: cleanCurrency(input.currency),
    properties: cleanProperties(input.properties),
    occurred_at: cleanOccurredAt(input.occurredAt),
  };

  const { error } = await supabase
    .from('funnel_events')
    .upsert(row, { onConflict: 'event_id' });

  if (error) {
    throw error;
  }
}
