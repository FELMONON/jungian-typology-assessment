import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// A copy regression check: saved history is account-gated, not payment-gated.
// This intentionally does not claim to test runtime authorization.
describe('pricing history claim', () => {
  it('does not sell existing free account history as a Mastery-only feature', () => {
    const source = readFileSync(join(process.cwd(), 'pages/Pricing.tsx'), 'utf8');
    expect(source).toContain(
      "{ name: 'Saved assessment history (account required)', free: true, insight: true, mastery: true }",
    );
    expect(source).not.toContain(
      "{ name: 'Reassessment tracking', free: false, insight: false, mastery: true }",
    );
  });
});
