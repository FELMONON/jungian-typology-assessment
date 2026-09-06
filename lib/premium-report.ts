export const PREMIUM_REPORT_KEYS = [
  'overview', 'functionAnalysis', 'archetypes', 'theGrip', 'relationships',
  'career', 'individuation', 'shadow', 'growth', 'dreams',
] as const;

export type PremiumAnalysis = Record<(typeof PREMIUM_REPORT_KEYS)[number], string>;

// The offer promises ten developed sections. Missing, empty, or truncated
// sections must not be silently replaced with templates in a paid report.
export function readCompletePremiumReport(value: unknown): PremiumAnalysis | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const report = value as Record<string, unknown>;
  const result = {} as PremiumAnalysis;
  for (const key of PREMIUM_REPORT_KEYS) {
    const text = typeof report[key] === 'string' ? report[key].trim() : '';
    if (text.split(/\s+/).filter(Boolean).length < 80 || !/[.!?]["')\]]?$/.test(text)) return null;
    result[key] = text;
  }
  return result;
}
