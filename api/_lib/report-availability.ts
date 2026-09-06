import type { VercelResponse } from '@vercel/node';
import { generateGeminiText } from './gemini.js';

// A tiny request to the same provider/model checks billing and availability
// before a new paid checkout is created. No customer data is sent in the probe.
export async function guardPaidReportCheckout(res: VercelResponse): Promise<boolean> {
  try {
    const response = await generateGeminiText('Reply with exactly the word READY.', {
      temperature: 0,
      maxOutputTokens: 16,
      thinkingBudget: 0,
      timeoutMs: 8000,
    });
    if (/^READY[.!]?$/i.test(response.trim())) return true;
  } catch {
    // Provider details stay out of customer responses.
  }
  console.error('Paid checkout paused: report generation service is unavailable');
  res.setHeader('Retry-After', '60');
  res.setHeader('Cache-Control', 'no-store');
  res.status(503).json({
    code: 'reports_temporarily_unavailable',
    error: 'Personalized reports are temporarily unavailable. Please try again later. The free assessment and your saved map remain available.',
  });
  return false;
}
