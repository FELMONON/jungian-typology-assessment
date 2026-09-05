import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Mechanical-copy regression checks, not psychometric validation.
describe('current depth-assessment claims', () => {
  const source = readFileSync(join(process.cwd(), 'pages/About.tsx'), 'utf8');

  it('explains four-channel scoring and the derived eight-function display', () => {
    expect(source).toContain('Four Channel Scores and a Derived Function Stack');
    expect(source).toContain('it does not');
    expect(source).toContain('independently measure Te, Ti, Fe, Fi, Se, Si, Ne, and Ni.');
    expect(source).not.toContain('All 8 processes are scored separately');
    expect(source).not.toContain('Independent Measurement of 8 Processes');
    expect(source).not.toContain('scoring each process (Te, Ti, Fe, etc.) separately');
  });

  it('does not present the consistency heuristic as validated accuracy', () => {
    expect(source).toContain('Consistency Is Not Accuracy');
    expect(source).toContain('rule-based agreement signal across answer layers');
    expect(source).toContain('not the probability that your type is correct or a validated accuracy score');
  });
});
