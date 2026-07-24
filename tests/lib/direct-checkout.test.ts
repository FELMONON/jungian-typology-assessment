import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  buildDirectCheckoutAttribution,
  createDirectCheckoutSession,
} from '../../lib/direct-checkout';

const acquisition = {
  source: 'seo_inferior_function_test_hero',
  entryPage: '/inferior-function-test',
  capturedAt: '2026-07-23T00:00:00.000Z',
  ref: 'search_result',
  utmCampaign: 'organic_test',
  utmSource: 'google',
  sharedResult: 'demo-map',
  parentSource: 'google',
  sourceChain: 'google>seo_inferior_function_test_hero',
};

describe('direct checkout', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('preserves acquisition context and appends the paid CTA source once', () => {
    expect(buildDirectCheckoutAttribution(acquisition, 'results_mobile_sticky')).toEqual({
      source: 'seo_inferior_function_test_hero',
      ref: 'search_result',
      utmCampaign: 'organic_test',
      utmSource: 'google',
      sharedResult: 'demo-map',
      parentSource: 'google',
      sourceChain: 'google>seo_inferior_function_test_hero>results_mobile_sticky',
    });
  });

  it('creates a Stripe session without making recovery email a gate', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        sessionId: 'cs_test_direct',
        url: 'https://checkout.stripe.com/c/pay/cs_test_direct',
        expiresAt: 1780000000,
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await createDirectCheckoutSession({
      tier: 'insight',
      source: 'results_locked_preview',
      acquisition,
      customerEmail: 'buyer@example.com',
      anonymousId: 'anon-123',
    });

    expect(result.session.url).toBe('https://checkout.stripe.com/c/pay/cs_test_direct');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const request = fetchMock.mock.calls[0][1];
    const body = JSON.parse(String(request.body));
    expect(body).toMatchObject({
      tier: 'insight',
      source: 'results_locked_preview',
      customerEmail: 'buyer@example.com',
      anonymousId: 'anon-123',
      recoveryEmailOptIn: false,
    });
    expect(body.attribution.sourceChain).toBe(
      'google>seo_inferior_function_test_hero>results_locked_preview',
    );
  });

  it('rejects API errors and non-Stripe destinations', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Promotion unavailable' }),
    }));

    await expect(createDirectCheckoutSession({
      tier: 'insight',
      source: 'results_locked_preview',
    })).rejects.toThrow('Promotion unavailable');

    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: 'https://example.com/not-stripe' }),
    }));

    await expect(createDirectCheckoutSession({
      tier: 'insight',
      source: 'results_locked_preview',
    })).rejects.toThrow('Stripe did not return a secure checkout link');
  });
});
