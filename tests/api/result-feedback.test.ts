import { describe, expect, it, vi } from 'vitest';
import { track } from '@vercel/analytics/server';
import { normalizeAnalyticsEvent, trackNormalizedAnalyticsEvent } from '../../api/_lib/analytics-event';
import { recordFunnelEvent } from '../../api/_lib/funnel-events';

vi.mock('@vercel/analytics/server', () => ({ track: vi.fn() }));

describe('first-party result feedback', () => {
  it.each(['yes', 'somewhat', 'not_yet'])('preserves only the %s reaction and anonymous context', async (reaction) => {
    const event = normalizeAnalyticsEvent({
      eventName: 'result_reaction_submitted', eventId: 'client:feedback:test',
      anonymousId: 'anonymous-example', path: '/results?email=private@example.com',
      properties: { reaction, email: 'private@example.com', answers: 'private', dominant_function: 'Ni' },
      source: 'private@example.com', dominantFunction: 'Ni', purchaseId: 'private-purchase',
    });
    expect(event?.properties).toEqual({ reaction });
    expect(event?.funnelEvent).toMatchObject({
      eventId: 'client:feedback:test', anonymousId: 'anonymous-example', path: '/results', properties: { reaction },
    });
    expect(JSON.stringify(event)).not.toContain('private');
    const upsert = vi.fn().mockResolvedValue({ error: null });
    await recordFunnelEvent({ from: vi.fn().mockReturnValue({ upsert }) } as any, event!.funnelEvent!);
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
      event_name: 'result_reaction_submitted', path: '/results', properties: { reaction },
    }), { onConflict: 'event_id' });
    await trackNormalizedAnalyticsEvent(event!);
    expect(track).not.toHaveBeenCalled();
  });

  it.each(['email@example.com', '', null, 1])('rejects non-enumerated feedback: %s', (reaction) => {
    expect(normalizeAnalyticsEvent({ eventName: 'result_reaction_submitted', properties: { reaction } })).toBeNull();
  });
});
