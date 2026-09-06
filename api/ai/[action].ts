import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSessionUser } from '../_lib/auth.js';
import { generateGeminiText } from '../_lib/gemini.js';
import { findCompletedPurchaseForUser, isCheckoutSessionRedeemableBy, resolveTierFromCheckoutSession } from '../_lib/purchases.js';
import { enforceRateLimit } from '../_lib/rate-limit.js';
import { getSupabaseAdminClient, hasSupabaseAdminConfig } from '../_lib/supabase.js';
import { getStripeSecretKey } from '../../server/checkout.js';
import { PREMIUM_REPORT_KEYS, readCompletePremiumReport } from '../../lib/premium-report.js';

interface FunctionScore {
  function: string;
  score: number;
  rawPreference?: number;
  rawInferior?: number;
  normalized?: number;
}

interface Stack {
  dominant: FunctionScore;
  auxiliary: FunctionScore;
  tertiary: FunctionScore;
  inferior: FunctionScore;
  resultVersion?: string;
  depthResult?: any;
}

interface AnalysisInput {
  scores: FunctionScore[];
  stack: Stack;
  attitudeScore?: number;
  isUndifferentiated?: boolean;
  resultVersion?: string;
  depthResult?: any;
  checkoutSessionId?: string;
}

const FUNCTION_NAMES: Record<string, string> = {
  Te: 'Extraverted Thinking',
  Ti: 'Introverted Thinking',
  Fe: 'Extraverted Feeling',
  Fi: 'Introverted Feeling',
  Se: 'Extraverted Sensing',
  Si: 'Introverted Sensing',
  Ne: 'Extraverted Intuition',
  Ni: 'Introverted Intuition',
};

const CHANNEL_NAMES: Record<string, string> = {
  thinking: 'Thinking',
  feeling: 'Feeling',
  sensation: 'Sensation',
  intuition: 'Intuition',
};

function actionName(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] : value || '';
}

function formatScoresForPrompt(input: AnalysisInput): string {
  const sortedScores = [...input.scores].sort((a, b) => b.score - a.score);
  const scoresList = sortedScores
    .map((s, i) => `${i + 1}. ${FUNCTION_NAMES[s.function] || s.function} (${s.function}): ${s.score.toFixed(1)}%`)
    .join('\n');

  const stackInfo = `
Cognitive Stack:
- Dominant: ${FUNCTION_NAMES[input.stack.dominant.function] || input.stack.dominant.function} (${input.stack.dominant.function}) - ${input.stack.dominant.score.toFixed(1)}%
- Auxiliary: ${FUNCTION_NAMES[input.stack.auxiliary.function] || input.stack.auxiliary.function} (${input.stack.auxiliary.function}) - ${input.stack.auxiliary.score.toFixed(1)}%
- Tertiary: ${FUNCTION_NAMES[input.stack.tertiary.function] || input.stack.tertiary.function} (${input.stack.tertiary.function}) - ${input.stack.tertiary.score.toFixed(1)}%
- Inferior: ${FUNCTION_NAMES[input.stack.inferior.function] || input.stack.inferior.function} (${input.stack.inferior.function}) - ${input.stack.inferior.score.toFixed(1)}%`;

  const attitude = (input.attitudeScore || 0) > 0 ? 'Extraverted' : 'Introverted';
  const depth = input.depthResult || input.stack?.depthResult;
  const depthBlock = depth ? `
Depth Function-Stack Map:
- Dominant channel: ${depth.dominant}
- Auxiliary channel: ${depth.auxiliary}
- Inferior channel: ${depth.inferior}
- Answer consistency signal: ${depth.reliability?.score}% (${depth.reliability?.label})
- Developmental edge: ${depth.narrative?.developmentalEdge}
- Pressure pattern: ${depth.narrative?.complexVulnerability}
` : '';

  return `
Assessment Results:
${scoresList}

${stackInfo}

Overall Attitude: ${attitude} (score: ${(input.attitudeScore || 0).toFixed(1)})
Differentiation Status: ${input.isUndifferentiated ? 'Undifferentiated (scores are relatively even)' : 'Differentiated'}
${depthBlock}
`;
}

function extractJson(text: string): Record<string, string> | null {
  try {
    const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    return JSON.parse(cleaned);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function getDepth(input: AnalysisInput): any {
  return input.depthResult || input.stack?.depthResult || null;
}

function fallbackFreeAnalysis(input: AnalysisInput): string {
  const depth = getDepth(input);
  const dominant = depth?.dominant ? CHANNEL_NAMES[depth.dominant] || depth.dominant : FUNCTION_NAMES[input.stack.dominant.function] || input.stack.dominant.function;
  const auxiliary = depth?.auxiliary ? CHANNEL_NAMES[depth.auxiliary] || depth.auxiliary : FUNCTION_NAMES[input.stack.auxiliary.function] || input.stack.auxiliary.function;
  const inferior = depth?.inferior ? CHANNEL_NAMES[depth.inferior] || depth.inferior : FUNCTION_NAMES[input.stack.inferior.function] || input.stack.inferior.function;
  const edge = depth?.narrative?.developmentalEdge || `Your developmental work sits around ${inferior}, the channel with the least conscious energy in this result.`;
  const vulnerability = depth?.narrative?.complexVulnerability || 'Stress is most likely to pull attention into the inferior channel before you can respond from your stronger functions.';

  return `Your function-stack map is led by ${dominant}, supported by ${auxiliary}. This means your strongest movement is not a fixed personality label but a repeated channel of attention, judgment, and effort. The important tension is the opposite pole: ${inferior}. ${edge} ${vulnerability} Use the result as a practice map. When stress rises, notice whether you are trying to solve the situation only through the dominant channel. The useful move is to give the inferior function a small, concrete role before it takes over in a primitive form.`;
}

function isUsableFreeAnalysis(text: string | undefined): text is string {
  const trimmed = text?.trim() || '';
  const words = trimmed.split(/\s+/).filter(Boolean).length;

  return (
    words >= 80 &&
    trimmed.length >= 350 &&
    /[.!?]["')\]]?$/.test(trimmed) &&
    !/unable to generate/i.test(trimmed)
  );
}

function cleanCheckoutSessionId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^cs_[A-Za-z0-9_]+$/.test(trimmed)) return null;
  return trimmed.slice(0, 200);
}

async function verifyPaidCheckoutSession(sessionId: unknown): Promise<boolean> {
  const cleanedSessionId = cleanCheckoutSessionId(sessionId);
  if (!cleanedSessionId) return false;

  const stripeSecretKey = getStripeSecretKey();
  if (!stripeSecretKey) return false;

  const query = new URLSearchParams({
    'expand[]': 'line_items.data.price',
  });
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${cleanedSessionId}?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${stripeSecretKey}`,
    },
  });
  const session = await response.json();

  if (!response.ok) {
    console.error('Stripe session unlock check failed:', session?.error?.message || response.status);
    return false;
  }

  if (session.payment_status !== 'paid') return false;
  return Boolean(resolveTierFromCheckoutSession(session));
}

async function handleFreeAnalysis(req: VercelRequest, res: VercelResponse) {
  const { scores, stack, attitudeScore, isUndifferentiated, resultVersion, depthResult } = req.body as AnalysisInput;

  if (!scores || !stack) {
    return res.status(400).json({ error: 'Invalid assessment data format' });
  }

  const prompt = `Write as an educational Jungian typology guide. Based on the following TypeJung self-reflection results, provide a brief but insightful personalized analysis.

${formatScoresForPrompt({ scores, stack, attitudeScore: attitudeScore || 0, isUndifferentiated: isUndifferentiated || false, resultVersion, depthResult })}

Write a personalized analysis in 150-200 words that:
1. Identifies where their psychic energy flows most strongly
2. Names the inferior-function developmental edge without reducing them to a four-letter label
3. Offers one practical observation about how they likely experience stress, the body, or value

Keep the tone direct, psychologically grounded, and useful. Use second person ("you"). Clearly treat the result as educational self-reflection, not diagnosis, therapy, or a clinical assessment. Avoid certainty, treatment advice, and claims of scientific validation. Do not mention that this is a free or limited analysis. Do not use bullet points, headers, or any markdown formatting like asterisks. Write in plain flowing paragraphs only.`;

  const fallbackInput = { scores, stack, attitudeScore, isUndifferentiated, resultVersion, depthResult };
  let analysis = fallbackFreeAnalysis(fallbackInput);
  let generationSource: 'gemini' | 'template' = 'template';

  try {
    const generated = await generateGeminiText(prompt, {
      temperature: 0.7,
      maxOutputTokens: 500,
    });

    if (isUsableFreeAnalysis(generated)) {
      analysis = generated.trim();
      generationSource = 'gemini';
    } else {
      console.error('Using fallback free analysis: generated response was incomplete');
    }
  } catch (error: any) {
    console.error('Using fallback free analysis:', error?.message || error);
  }

  return res.status(200).json({ analysis, generationSource });
}

async function handlePremiumAnalysis(req: VercelRequest, res: VercelResponse) {
  const user = await getSessionUser(req.headers.cookie);
  const { scores, stack, attitudeScore, isUndifferentiated, depthResult, checkoutSessionId } = req.body || {};

  if (!scores || !stack) {
    return res.status(400).json({ error: 'Invalid assessment data format' });
  }

  let hasPremiumAccess = false;

  if (user?.id) {
    const supabase = getSupabaseAdminClient();
    hasPremiumAccess = Boolean(await findCompletedPurchaseForUser(supabase, user));
  }

  if (!hasPremiumAccess) {
    hasPremiumAccess = await verifyPaidCheckoutSession(checkoutSessionId);

    // A paid session bound to another account must not unlock premium for
    // this requester, even though the session id itself checks out on Stripe.
    if (hasPremiumAccess && hasSupabaseAdminConfig()) {
      const cleanedSessionId = cleanCheckoutSessionId(checkoutSessionId);
      if (cleanedSessionId) {
        hasPremiumAccess = await isCheckoutSessionRedeemableBy(
          getSupabaseAdminClient(),
          cleanedSessionId,
          user,
        );
      }
    }
  }

  if (!hasPremiumAccess) {
    return res.status(403).json({ error: 'Premium access required' });
  }

  const prompt = `Write as an educational Jungian typology guide. Create a premium TypeJung self-reflection report from this result.

Return valid JSON only with these exact string keys:
${PREMIUM_REPORT_KEYS.join(', ')}

Each value should be 120-180 words, direct, psychologically grounded, and second-person. Frame interpretations as possibilities for reflection, not clinical findings. Do not diagnose, provide therapy, or claim scientific validation.

Compatibility scores:
${JSON.stringify({ scores, stack, attitudeScore, isUndifferentiated }, null, 2)}

Depth function-stack map:
${JSON.stringify(depthResult || stack.depthResult || null, null, 2)}
`;

  const text = await generateGeminiText(prompt, {
    temperature: 0.65,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  }).catch((error) => {
    console.error('Premium report generation unavailable:', error?.message || error);
    return '';
  });

  const analysis = readCompletePremiumReport(extractJson(text));
  if (!analysis) {
    console.error('Premium report delivery failed: a complete ten-section report was not generated');
    res.setHeader('Retry-After', '60');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({
      code: 'report_temporarily_unavailable',
      error: 'Your personalized report could not be completed. Your purchase is saved. Please try again later, or contact support for help or a refund.',
    });
  }

  return res.status(200).json({ analysis, generationSource: 'gemini' });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const action = actionName(req.query.action);
    if (action === 'free-analysis') {
      if (enforceRateLimit(req, res, {
        keyPrefix: 'ai:free-analysis',
        limit: 20,
        windowMs: 60 * 60 * 1000,
        message: 'Too many analysis requests. Please wait and try again.',
      })) return;

      return await handleFreeAnalysis(req, res);
    }

    if (action === 'premium-analysis') {
      if (enforceRateLimit(req, res, {
        keyPrefix: 'ai:premium-analysis',
        limit: 12,
        windowMs: 60 * 60 * 1000,
        message: 'Too many premium report requests. Please wait and try again.',
      })) return;

      return await handlePremiumAnalysis(req, res);
    }

    return res.status(404).json({ error: 'AI action not found' });
  } catch (error: any) {
    console.error('AI route error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate analysis',
    });
  }
}
