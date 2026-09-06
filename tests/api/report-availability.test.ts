import { describe, expect, it, vi } from 'vitest';
import handler from '../../api/create-checkout-session';
import { generateGeminiText } from '../../api/_lib/gemini';
import { guardPaidReportCheckout } from '../../api/_lib/report-availability';

vi.mock('../../api/_lib/gemini', () => ({ generateGeminiText: vi.fn() }));
vi.mock('../../api/_lib/rate-limit', () => ({ enforceRateLimit: vi.fn(() => false) }));

const response = () => {
  const res: any = { statusCode: 200, body: null, headers: {} };
  res.status = (status: number) => { res.statusCode = status; return res; };
  res.json = (body: unknown) => { res.body = body; return res; };
  res.setHeader = (key: string, value: string) => { res.headers[key] = value; };
  return res;
};

describe('report availability before payment', () => {
  it.each([{ tier: 'insight' }, { tier: 'mastery' }, { product: 'mastery_upgrade' }])('does not contact Stripe during an outage: %j', async body => {
    vi.mocked(generateGeminiText).mockRejectedValue(new Error('credits depleted'));
    const res = response();
    await handler({ method: 'POST', headers: {}, body } as any, res);
    expect(res.statusCode).toBe(503);
    expect(res.body.code).toBe('reports_temporarily_unavailable');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('allows checkout to proceed once generation is available again', async () => {
    vi.mocked(generateGeminiText).mockResolvedValue('READY');
    const res = response();
    expect(await guardPaidReportCheckout(res)).toBe(true);
    expect(res.body).toBeNull();
  });

  it('rejects empty or incomplete readiness responses', async () => {
    vi.mocked(generateGeminiText).mockResolvedValue('Unable to generate analysis at this time.');
    expect(await guardPaidReportCheckout(response())).toBe(false);
  });

  it('validates the tier before spending a provider request', async () => {
    const res = response();
    await handler({ method: 'POST', headers: {}, body: { tier: 'invalid' } } as any, res);
    expect(res.statusCode).toBe(400);
    expect(generateGeminiText).not.toHaveBeenCalled();
  });
});
