// Generates the Type Depth Guide PDF included with Insight and Mastery.
// Content is TypeJung's in-house theory material from data/questions.ts,
// rendered with the site's "Analyst's Archive" visual language.
//
// Usage: npx tsx scripts/generate-type-depth-guide.ts
// Output: public/downloads/typejung-type-depth-guide.pdf

import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import {
  ATTITUDE_DESCRIPTIONS,
  FUNCTION_DESCRIPTIONS,
  INDIVIDUATION_GUIDANCE,
  STACK_POSITIONS,
  THE_GRIP,
  TYPE_PHENOMENOLOGY,
  ACTIVE_IMAGINATION_PROMPTS,
} from '../data/questions';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'public', 'downloads');
const OUTPUT_PATH = join(OUTPUT_DIR, 'typejung-type-depth-guide.pdf');

const FUNCTION_ORDER = ['Ti', 'Te', 'Fi', 'Fe', 'Si', 'Se', 'Ni', 'Ne'] as const;
const GRIP_ORDER = ['Ti', 'Te', 'Fi', 'Fe', 'Si', 'Se', 'Ni', 'Ne'] as const;

const esc = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const FUNCTION_PAIRS: Array<[string, string, string]> = [
  ['Ti', 'Te', 'Thinking'],
  ['Fi', 'Fe', 'Feeling'],
  ['Si', 'Se', 'Sensation'],
  ['Ni', 'Ne', 'Intuition'],
];

const functionBlock = (code: string) => {
  const fn = FUNCTION_DESCRIPTIONS[code];
  return `
    <div class="fn-block">
      <div class="fn-head">
        <span class="fn-glyph">${code}</span>
        <h2>${esc(fn.title)}</h2>
      </div>
      <p class="body">${esc(fn.desc)}</p>
      <blockquote>&ldquo;${esc(fn.quote)}&rdquo;<span class="attr">— C.&thinsp;G. Jung, Psychological Types</span></blockquote>
      <div class="two-col">
        <div>
          <p class="label">At its best</p>
          <p class="body small">${esc(fn.positive)}</p>
        </div>
        <div>
          <p class="label tension">The shadow side</p>
          <p class="body small">${esc(fn.negative)}</p>
        </div>
      </div>
    </div>`;
};

const functionPages = FUNCTION_PAIRS.map(([intro, extra, family], index) => `
  <section class="sheet">
    <p class="figure-label">Fig. ${String(index + 2).padStart(2, '0')} — ${family}, inward and outward</p>
    ${functionBlock(intro)}
    <hr class="pair-rule">
    ${functionBlock(extra)}
  </section>`).join('\n');

const typePages = FUNCTION_ORDER.map((code) => {
  const t = TYPE_PHENOMENOLOGY[code];
  if (!t) return '';
  return `
  <article class="type-entry">
    <div class="type-head">
      <span class="fn-glyph sm">${code}</span>
      <h3>${esc(t.typeName)}</h3>
    </div>
    <dl>
      <dt>Orientation</dt><dd>${esc(t.focus)}</dd>
      <dt>How it looks in life</dt><dd>${esc(t.behavior)}</dd>
      <dt>Where it gets stuck</dt><dd>${esc(t.neurosis)}</dd>
      <dt>You have met this type in</dt><dd>${esc(t.historicalExample)}</dd>
    </dl>
  </article>`;
}).join('\n');

const stackEntries = (['dominant', 'auxiliary', 'tertiary', 'inferior'] as const).map((key, i) => {
  const s = STACK_POSITIONS[key];
  return `
  <article class="stack-entry">
    <div class="stack-head">
      <span class="stack-num">0${i + 1}</span>
      <div>
        <h3>${esc(s.name)} <span class="archetype">· ${esc(s.archetype)}</span></h3>
      </div>
    </div>
    <p class="body small">${esc(s.description)}</p>
    <div class="two-col">
      <div><p class="label">Development</p><p class="body small">${esc(s.development)}</p></div>
      <div><p class="label tension">Shadow</p><p class="body small">${esc(s.shadow)}</p></div>
    </div>
  </article>`;
}).join('\n');

const gripEntry = (code: string) => {
  const g = THE_GRIP[code];
  if (!g) return '';
  return `
  <article class="grip-entry">
    <h3><span class="fn-glyph sm">${code}</span> dominant → inferior ${esc(g.inferiorFunction)}</h3>
    <p class="body small"><strong>Ordinarily:</strong> ${esc(g.normalState)}</p>
    <p class="body small"><strong>In the grip:</strong> ${esc(g.gripDescription)}</p>
    <div class="two-col">
      <div><p class="label tension">Common triggers</p><p class="body small">${esc(g.triggers)}</p></div>
      <div><p class="label">What helps</p><p class="body small">${esc(g.recovery)}</p></div>
    </div>
  </article>`;
};

// 3 + 3 + 2 across three sheets so no page carries a lone orphaned entry.
const gripEntriesFirst = GRIP_ORDER.slice(0, 3).map(gripEntry).join('\n');
const gripEntriesSecond = GRIP_ORDER.slice(3, 6).map(gripEntry).join('\n');
const gripEntriesThird = GRIP_ORDER.slice(6).map(gripEntry).join('\n');

const individuationStages = INDIVIDUATION_GUIDANCE.stages.map((stage) => `
  <article class="stage-entry">
    <h3>${esc(stage.name)}</h3>
    <p class="body small">${esc(stage.description)}</p>
    <p class="body small task"><strong>The task:</strong> ${esc(stage.task)}</p>
  </article>`).join('\n');

const prompts = ACTIVE_IMAGINATION_PROMPTS.slice(0, 6).map((p: { title?: string; prompt?: string } | string) => {
  const text = typeof p === 'string' ? p : (p.prompt || p.title || '');
  const title = typeof p === 'string' ? '' : (p.title || '');
  return `<li>${title ? `<strong>${esc(title)}.</strong> ` : ''}${esc(text)}</li>`;
}).join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Schibsted+Grotesk:wght@400;500;600;700&family=Spline+Sans+Mono:wght@400;500;600&display=swap');

  :root {
    --paper: #faf8f2;
    --surface: #fffefa;
    --ink: #15190f;
    --secondary: #4a5142;
    --muted: #646b5b;
    --border: #d8d4c4;
    --border-light: #e8e5da;
    --green: #20492f;
    --green-light: #ecf2e9;
    --tension: #b23c1a;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Schibsted Grotesk', sans-serif;
    color: var(--ink);
    background: var(--paper);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .sheet { page-break-after: always; padding: 52px 56px; min-height: 100vh; background: var(--paper); }
  .sheet:last-child { page-break-after: auto; }

  h1, h2, h3 { font-family: 'Fraunces', serif; font-weight: 600; color: var(--ink); }
  h1 { font-size: 44px; line-height: 1.02; letter-spacing: -0.015em; }
  h2 { font-size: 30px; line-height: 1.1; }
  h3 { font-size: 17px; line-height: 1.25; }

  .figure-label {
    font-family: 'Spline Sans Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--muted);
    display: flex; align-items: center; gap: 8px; margin-bottom: 26px;
  }
  .figure-label::before { content: ""; width: 7px; height: 7px; background: var(--tension); flex: none; }

  .label {
    font-family: 'Spline Sans Mono', monospace;
    font-size: 9.5px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--green); margin-bottom: 6px;
  }
  .label.tension { color: var(--tension); }

  .body { font-size: 12.5px; line-height: 1.72; color: var(--secondary); }
  .body.small { font-size: 11.5px; line-height: 1.65; }
  .body strong { color: var(--ink); font-weight: 600; }

  blockquote {
    font-family: 'Fraunces', serif; font-style: italic; font-size: 15px;
    line-height: 1.55; color: var(--ink);
    border-left: 2px solid var(--green); padding: 4px 0 4px 18px; margin: 20px 0;
  }
  blockquote .attr {
    display: block; margin-top: 8px; font-family: 'Spline Sans Mono', monospace;
    font-style: normal; font-size: 9px; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted);
  }

  .pair-rule { border: none; border-top: 1px solid var(--border); margin: 26px 0; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--border-light); }

  .fn-head { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
  .fn-glyph {
    font-family: 'Fraunces', serif; font-style: italic; font-weight: 600;
    font-size: 26px; color: var(--green); background: var(--green-light);
    border: 1px solid var(--border); border-radius: 8px;
    width: 54px; height: 54px; display: inline-flex; align-items: center; justify-content: center; flex: none;
  }
  .fn-glyph.sm { width: 30px; height: 30px; font-size: 14px; border-radius: 6px; }

  /* Cover */
  .cover { position: relative; display: flex; flex-direction: column; justify-content: space-between; background: var(--paper); overflow: hidden; }
  .cover-plate { position: absolute; right: -110px; top: 96px; width: 460px; height: 460px; }
  .cover .brand { display: flex; align-items: baseline; gap: 10px; }
  .cover .brand .name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 20px; }
  .cover .brand .tag { font-family: 'Spline Sans Mono', monospace; font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
  .cover-mid h1 { font-size: 52px; max-width: 520px; margin: 18px 0 22px; }
  .cover-mid .sub { font-size: 14px; line-height: 1.7; color: var(--secondary); max-width: 440px; }
  .cover-rule { border: none; border-top: 1px solid var(--ink); position: relative; margin: 26px 0; }
  .cover-glyphs { display: flex; gap: 8px; margin-top: 30px; }
  .cover-foot { font-family: 'Spline Sans Mono', monospace; font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); display: flex; justify-content: space-between; }

  /* TOC + intro */
  .toc { list-style: none; margin-top: 8px; }
  .toc li { display: flex; align-items: baseline; gap: 12px; padding: 9px 0; border-bottom: 1px solid var(--border-light); font-size: 13px; }
  .toc .n { font-family: 'Spline Sans Mono', monospace; font-size: 10px; color: var(--tension); }
  .intro-note { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px 20px; margin-top: 26px; }

  .type-entry, .grip-entry, .stack-entry, .stage-entry { padding: 16px 0; border-bottom: 1px solid var(--border-light); page-break-inside: avoid; }
  .type-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  dl { display: grid; grid-template-columns: 128px 1fr; gap: 4px 14px; }
  dt { font-family: 'Spline Sans Mono', monospace; font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); padding-top: 2px; }
  dd { font-size: 11.5px; line-height: 1.6; color: var(--secondary); }

  .stack-head { display: flex; gap: 14px; align-items: baseline; margin-bottom: 8px; }
  .stack-num { font-family: 'Spline Sans Mono', monospace; font-size: 11px; font-weight: 600; color: var(--tension); }
  .archetype { font-style: italic; font-weight: 400; color: var(--muted); font-size: 14px; }

  .grip-entry h3 { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }

  .stage-entry .task { margin-top: 6px; }

  ol.prompts { margin: 14px 0 0 18px; }
  ol.prompts li { font-size: 12px; line-height: 1.65; color: var(--secondary); padding: 7px 0; }

  .closing-card { background: #12160e; color: #f2efe5; border-radius: 12px; padding: 30px 32px; margin-top: 28px; }
  .closing-card h3 { color: #fff; font-size: 22px; margin-bottom: 10px; }
  .closing-card p { color: rgba(242, 239, 229, 0.78); font-size: 12px; line-height: 1.7; }
  .closing-card .url { font-family: 'Spline Sans Mono', monospace; color: #fff; font-size: 12px; margin-top: 14px; display: block; }

  .disclaimer { margin-top: 22px; font-size: 9.5px; line-height: 1.6; color: var(--muted); }
</style>
</head>
<body>

<section class="sheet cover">
    <svg class="cover-plate" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="200" cy="200" r="37.5" fill="none" stroke="#20492f" stroke-width="0.6" stroke-dasharray="2 4" opacity="0.24"/>
      <circle cx="200" cy="200" r="75.0" fill="none" stroke="#20492f" stroke-width="0.6" stroke-dasharray="2 4" opacity="0.24"/>
      <circle cx="200" cy="200" r="112.5" fill="none" stroke="#20492f" stroke-width="0.6" stroke-dasharray="2 4" opacity="0.24"/>
      <circle cx="200" cy="200" r="150.0" fill="none" stroke="#20492f" stroke-width="1" stroke-dasharray="none" opacity="0.34"/>
      <line x1="200" y1="200" x2="200.0" y2="50.0" stroke="#20492f" stroke-width="0.6" opacity="0.28"/>
      <line x1="200" y1="200" x2="306.1" y2="93.9" stroke="#20492f" stroke-width="0.6" opacity="0.28"/>
      <line x1="200" y1="200" x2="350.0" y2="200.0" stroke="#20492f" stroke-width="0.6" opacity="0.28"/>
      <line x1="200" y1="200" x2="306.1" y2="306.1" stroke="#20492f" stroke-width="0.6" opacity="0.28"/>
      <line x1="200" y1="200" x2="200.0" y2="350.0" stroke="#20492f" stroke-width="0.6" opacity="0.28"/>
      <line x1="200" y1="200" x2="93.9" y2="306.1" stroke="#20492f" stroke-width="0.6" opacity="0.28"/>
      <line x1="200" y1="200" x2="50.0" y2="200.0" stroke="#20492f" stroke-width="0.6" opacity="0.28"/>
      <line x1="200" y1="200" x2="93.9" y2="93.9" stroke="#20492f" stroke-width="0.6" opacity="0.28"/>
      <polygon points="200.0,77.0 275.3,124.7 287.0,200.0 257.3,257.3 200.0,273.5 153.3,246.7 143.0,200.0 174.5,174.5" fill="#20492f" fill-opacity="0.07" stroke="#20492f" stroke-width="1.1" stroke-opacity="0.42" stroke-linejoin="round"/>
      <circle cx="200.0" cy="77.0" r="3" fill="#20492f" opacity="0.5"/>
      <circle cx="275.3" cy="124.7" r="3" fill="#20492f" opacity="0.5"/>
      <circle cx="287.0" cy="200.0" r="3" fill="#20492f" opacity="0.5"/>
      <circle cx="257.3" cy="257.3" r="3" fill="#20492f" opacity="0.5"/>
      <circle cx="200.0" cy="273.5" r="3" fill="#20492f" opacity="0.5"/>
      <circle cx="153.3" cy="246.7" r="3" fill="#20492f" opacity="0.5"/>
      <circle cx="143.0" cy="200.0" r="3" fill="#20492f" opacity="0.5"/>
      <circle cx="174.5" cy="174.5" r="3" fill="#20492f" opacity="0.5"/>
    </svg>
  <div class="brand">
    <span class="name">TypeJung</span>
    <span class="tag">Free function-stack map</span>
  </div>
  <div class="cover-mid">
    <p class="figure-label">Insight companion — included with your report</p>
    <h1>The Function Stack in Depth</h1>
    <p class="sub">A field guide to Jung&rsquo;s eight cognitive functions: how each one perceives or judges, how they arrange into a stack, what happens at the dominant&ndash;inferior edge under stress, and how the pattern matures over a life.</p>
    <div class="cover-glyphs">
      ${FUNCTION_ORDER.map((c) => `<span class="fn-glyph sm">${c}</span>`).join('')}
    </div>
  </div>
  <div>
    <hr class="cover-rule">
    <div class="cover-foot">
      <span>typejung.com</span>
      <span>Educational self-reflection · not a clinical instrument</span>
    </div>
  </div>
</section>

<section class="sheet">
  <p class="figure-label">Fig. 01 — How to read this guide</p>
  <h2>The label is the doorway, not the room.</h2>
  <p class="body" style="margin-top:16px;">
    Your TypeJung result is a hypothesis about energy: which of the eight cognitive functions
    your attention reaches for first, which ones support it, and which one sits least developed
    at the bottom of the stack. This guide is the theory behind that map. It follows Jung&rsquo;s
    Psychological Types, in plain language, and it is meant to be read next to your own result.
  </p>
  <ul class="toc">
    <li><span class="n">I</span> The two attitudes — introversion and extraversion</li>
    <li><span class="n">II</span> The eight functions, one by one</li>
    <li><span class="n">III</span> The eight type patterns in life</li>
    <li><span class="n">IV</span> The stack — dominant, auxiliary, tertiary, inferior</li>
    <li><span class="n">V</span> The grip — what stress does to each pattern</li>
    <li><span class="n">VI</span> Individuation — how the pattern matures</li>
    <li><span class="n">VII</span> Practice — working with your own map</li>
  </ul>
  <div class="intro-note">
    <p class="label">Part I — The two attitudes</p>
    <p class="body small" style="margin-top:8px;"><strong>Extraversion.</strong> ${esc(ATTITUDE_DESCRIPTIONS.E.desc)}</p>
    <p class="body small" style="margin-top:10px;"><strong>Introversion.</strong> ${esc(ATTITUDE_DESCRIPTIONS.I.desc)}</p>
    <p class="body small" style="margin-top:10px;">Every function below exists in both attitudes. That is what turns four functions into eight, and what makes two people with &ldquo;the same&rdquo; thinking look nothing alike.</p>
  </div>
</section>

${functionPages}

<section class="sheet">
  <p class="figure-label">Fig. 06 — The eight type patterns</p>
  <h2>Part III — How each dominant looks in a life.</h2>
  <p class="body" style="margin:14px 0 6px;">Jung described eight characteristic types, one for each dominant function. Read yours, then read the one across the axis from it &mdash; that is the pattern your stress borrows from.</p>
  ${typePages}
</section>

<section class="sheet">
  <p class="figure-label">Fig. 07 — The stack</p>
  <h2>Part IV — Four positions, four characters.</h2>
  <p class="body" style="margin:14px 0 6px;">The stack is a hierarchy of consciousness. Each position carries its own archetypal flavor &mdash; and its own way of failing.</p>
  ${stackEntries}
</section>

<section class="sheet">
  <p class="figure-label">Fig. 08 — The grip</p>
  <h2>Part V — What stress does to each pattern.</h2>
  <p class="body" style="margin:14px 0 6px;">When the dominant function is exhausted or defeated, the inferior erupts &mdash; archaic, moody, and unlike your ordinary self. Jung&rsquo;s followers call this the grip. Find your dominant below.</p>
  ${gripEntriesFirst}
</section>

<section class="sheet">
  <p class="figure-label">Fig. 08 — The grip, continued</p>
  ${gripEntriesSecond}
</section>

<section class="sheet">
  <p class="figure-label">Fig. 08 — The grip, continued</p>
  ${gripEntriesThird}
  <div class="intro-note" style="margin-top:24px;">
    <p class="label">Reading your own grip</p>
    <p class="body small" style="margin-top:8px;">The grip is a state, not a verdict. It passes fastest when it is recognized early and named plainly: &ldquo;my inferior function is up.&rdquo; Match your dominant above, learn your two or three earliest signals, and keep the recovery moves somewhere you will actually see them under stress.</p>
  </div>
</section>

<section class="sheet">
  <p class="figure-label">Fig. 09 — Individuation</p>
  <h2>Part VI — How the pattern matures.</h2>
  <p class="body" style="margin:14px 0 6px;">${esc(INDIVIDUATION_GUIDANCE.intro)}</p>
  ${individuationStages}
  <div class="intro-note" style="margin-top:20px;">
    <p class="label">On the inferior function</p>
    <p class="body small" style="margin-top:8px;">${esc(INDIVIDUATION_GUIDANCE.inferiorFunctionWork)}</p>
  </div>
</section>

<section class="sheet">
  <p class="figure-label">Fig. 10 — Practice</p>
  <h2>Part VII — Working with your own map.</h2>
  <p class="body" style="margin:14px 0 4px;">Theory becomes useful the week you test it. Pick one prompt, hold it for seven days, and watch your own stack respond.</p>
  <ol class="prompts">
    ${prompts}
  </ol>
  <div class="closing-card">
    <h3>Your map is the starting point.</h3>
    <p>This guide describes the general pattern. Your Insight report applies it to your actual scores: your developmental edge, your stress signals, and the one practice worth testing first. Retake the assessment after a season of practice and compare the maps.</p>
    <span class="url">typejung.com/results</span>
  </div>
  <p class="disclaimer">
    TypeJung is an educational self-reflection tool grounded in C.&thinsp;G. Jung&rsquo;s Psychological Types.
    It is not a clinical instrument and does not diagnose any condition. Function-stack results are
    hypotheses to inspect, not fixed identities. &copy; TypeJung.
  </p>
</section>

</body>
</html>`;

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: OUTPUT_PATH,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `
        <div style="width:100%; padding:0 56px; display:flex; justify-content:space-between; font-family:monospace; font-size:7px; letter-spacing:0.12em; color:#646b5b; text-transform:uppercase;">
          <span>TypeJung — The Function Stack in Depth</span>
          <span class="pageNumber"></span>
        </div>`,
      margin: { top: '0mm', bottom: '14mm', left: '0mm', right: '0mm' },
    });
    console.log(`Generated ${OUTPUT_PATH}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
