import { beforeEach, describe, expect, it, vi } from 'vitest';
import handler from '../../api/ai/[action]';
import { generateGeminiText } from '../../api/_lib/gemini';
import { findCompletedPurchaseForUser } from '../../api/_lib/purchases';
import { PREMIUM_REPORT_KEYS } from '../../lib/premium-report';

vi.mock('../../api/_lib/gemini', () => ({ generateGeminiText: vi.fn() }));
vi.mock('../../api/_lib/auth', () => ({ getSessionUser: vi.fn(async () => ({ id: 'buyer' })) }));
vi.mock('../../api/_lib/purchases', () => ({
  findCompletedPurchaseForUser: vi.fn(),
  isCheckoutSessionRedeemableBy: vi.fn(),
  resolveTierFromCheckoutSession: vi.fn(),
}));
vi.mock('../../api/_lib/supabase', () => ({ getSupabaseAdminClient: vi.fn(() => ({})), hasSupabaseAdminConfig: vi.fn(() => true) }));
vi.mock('../../api/_lib/rate-limit', () => ({ enforceRateLimit: vi.fn(() => false) }));

const section = 'You may notice a preference for checking the reasoning behind a decision before committing to it. When that pattern is useful, it gives you a way to separate observations from assumptions. When it becomes rigid, you might keep refining an explanation instead of asking what another person needs from the conversation. Try recording one recent example, the evidence you used, and one detail that could change your interpretation. Treat this as a possibility to observe over a week, rather than a fixed description of your personality.';
const completeReport = Object.fromEntries(PREMIUM_REPORT_KEYS.map(key => [key, section]));
const request = { method: 'POST', headers: {}, query: { action: 'premium-analysis' }, body: { scores: [], stack: {} } };
const response = () => {
  const res: any = { statusCode: 200, body: null, headers: {} };
  res.status = (status: number) => { res.statusCode = status; return res; };
  res.json = (body: unknown) => { res.body = body; return res; };
  res.setHeader = (key: string, value: string) => { res.headers[key] = value; };
  return res;
};

beforeEach(() => {
  vi.mocked(findCompletedPurchaseForUser).mockResolvedValue({ tier: 'insight' } as any);
});

describe('paid report delivery', () => {
  it('returns a recoverable error when the provider has no credits, with no template sold as a report', async () => {
    vi.mocked(generateGeminiText).mockRejectedValue(new Error('prepayment credits are depleted'));
    const res = response();
    await handler(request as any, res);
    expect(res.statusCode).toBe(503);
    expect(res.headers['Retry-After']).toBe('60');
    expect(res.body.code).toBe('report_temporarily_unavailable');
    expect(res.body).not.toHaveProperty('analysis');
    expect(JSON.stringify(res.body)).not.toContain('credits');
  });

  it.each(['{}', '{"overview":"Short partial report."}', 'not valid JSON', 'null'])('rejects incomplete output: %s', async output => {
    vi.mocked(generateGeminiText).mockResolvedValue(output);
    const res = response();
    await handler(request as any, res);
    expect(res.statusCode).toBe(503);
    expect(res.body).not.toHaveProperty('analysis');
  });

  it('rejects a report with a truncated section even if the JSON parses', async () => {
    vi.mocked(generateGeminiText).mockResolvedValue(JSON.stringify({ ...completeReport, dreams: section.slice(0, -1) }));
    const res = response();
    await handler(request as any, res);
    expect(res.statusCode).toBe(503);
  });

  it('delivers all ten complete sections after the provider recovers', async () => {
    vi.mocked(generateGeminiText).mockResolvedValue(JSON.stringify(completeReport));
    const res = response();
    await handler(request as any, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.analysis).toEqual(completeReport);
    expect(res.body.generationSource).toBe('gemini');
  });

  it('still requires a verified purchase before generating a report', async () => {
    vi.mocked(findCompletedPurchaseForUser).mockResolvedValue(null);
    const res = response();
    await handler(request as any, res);
    expect(res.statusCode).toBe(403);
    expect(generateGeminiText).not.toHaveBeenCalled();
  });
});
