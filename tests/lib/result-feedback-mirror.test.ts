import { beforeEach, describe, expect, it, vi } from 'vitest';
import { track as trackVercelEvent } from '@vercel/analytics';
import { setAnalyticsEnabled, trackEvent } from '../../lib/analytics';

vi.mock('@vercel/analytics', () => ({ track: vi.fn() }));

const beacon = vi.fn();

describe('result-feedback mirroring', () => {
  beforeEach(() => {
    vi.mocked(trackVercelEvent).mockReset();
    beacon.mockReset().mockReturnValue(false);
    Object.defineProperty(navigator, 'sendBeacon', { configurable: true, value: beacon });
    setAnalyticsEnabled(true);
  });

  it('falls back to fetch when a beacon is not queued, without sending personal properties', () => {
    trackEvent('result_reaction_submitted', { reaction: 'yes', email: 'private@example.com', answers: 'private' });
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, request] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe('/api/analytics');
    const payload = JSON.parse(request!.body as string);
    expect(payload.path).toBe('/results');
    expect(payload.properties).toEqual({ reaction: 'yes' });
    expect(JSON.stringify(payload)).not.toContain('private');
  });

  it('does not fall back when a beacon was queued', () => {
    beacon.mockReturnValue(true);
    trackEvent('result_reaction_submitted', { reaction: 'somewhat' });
    expect(beacon).toHaveBeenCalledTimes(1);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('keeps first-party feedback independent of a failing third-party SDK', () => {
    vi.mocked(trackVercelEvent).mockImplementation(() => { throw new Error('SDK unavailable'); });
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    trackEvent('result_reaction_submitted', { reaction: 'not_yet' });
    expect(fetch).toHaveBeenCalledTimes(1);
    error.mockRestore();
  });

  it('respects the existing analytics-disabled control', () => {
    setAnalyticsEnabled(false);
    trackEvent('result_reaction_submitted', { reaction: 'yes' });
    expect(beacon).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
