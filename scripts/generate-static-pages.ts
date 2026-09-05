#!/usr/bin/env node
/**
 * Static HTML Page Generator for TypeJung SEO
 * Generates individual HTML files for all functions and types
 */

import { functionSEO, functionData, typeSEO, typeData } from '../data/seo-config.js';
import { seoLandingPages } from './seo-data.mjs';
import { standaloneAnalyticsSnippet } from './standalone-analytics.mjs';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const siteConfig = {
  url: 'https://typejung.com',
  name: 'TypeJung',
  description: 'Free Jungian function-stack map that shows cognitive functions, dominant-inferior tension, and stress patterns for educational self-reflection',
  sameAs: [
    'https://x.com/typejung',
    'https://www.reddit.com/user/typejung',
    'https://github.com/felmonon/jungian-typology-assessment',
    'https://github.com/felmonon',
    'https://www.linkedin.com/in/felmonfekadu/',
  ],
};
const buildDate = new Date().toISOString().split('T')[0];

const escapeHtml = (value: unknown): string =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const renderJsonLd = (value: unknown): string =>
  JSON.stringify(value, null, 2).replace(/</g, '\\u003c');

const absoluteUrl = (path: string): string =>
  path === '/' ? `${siteConfig.url}/` : `${siteConfig.url}${path}`;

const breadcrumbSchema = (items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

const sourceSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const sourceFor = (page: { slug: string }, placement: string): string =>
  `seo_${sourceSlug(page.slug)}_${sourceSlug(placement)}`.slice(0, 80);

const withSource = (href: string, page: { slug: string }, placement: string): string => {
  const conversionPaths = ['/assessment', '/pricing', '/sample-report', '/debrief'];
  const [path] = href.split('?');

  if (!conversionPaths.includes(path)) return href;

  const separator = href.includes('?') ? '&' : '?';
  return `${href}${separator}source=${encodeURIComponent(sourceFor(page, placement))}`;
};

const coreClusterLinks = [
  {
    href: '/jungian-cognitive-functions-test',
    label: 'Jungian cognitive functions test',
    description: 'Map the full function-attitude pattern behind a likely type result.',
  },
  {
    href: '/jungian-test',
    label: 'Jungian test',
    description: 'Start with the broad Jungian assessment page and compare type, function, and stress evidence.',
  },
  {
    href: '/cognitive-function-test',
    label: 'Cognitive function test',
    description: 'See how TypeJung maps Ni, Ne, Si, Se, Ti, Te, Fi, and Fe in one function-stack view.',
  },
  {
    href: '/cognitive-functions-test',
    label: 'Cognitive functions test',
    description: 'Use the plural-query page when you want a Jungian personality functions test, not a clinical memory screen.',
  },
  {
    href: '/cognitive-functions-quiz',
    label: 'Cognitive functions quiz',
    description: 'Use a quiz-style entry point when you want the function map first, not only a four-letter result.',
  },
  {
    href: '/free-cognitive-function-test',
    label: 'Free cognitive function test',
    description: 'Start the no-payment assessment path and see the free function map first.',
  },
  {
    href: '/function-stack-test',
    label: 'Function stack test',
    description: 'Compare dominant, auxiliary, tertiary, and inferior signals from the full map.',
  },
  {
    href: '/dominant-function-test',
    label: 'Dominant function test',
    description: 'Use the full map to test which function is most likely leading your pattern.',
  },
  {
    href: '/jungian-personality-test',
    label: 'Jungian personality test',
    description: 'Use the broader Jungian personality route when you want type plus function evidence.',
  },
  {
    href: '/mbti-test-alternative',
    label: 'MBTI test alternative',
    description: 'Use TypeJung when MBTI-style quizzes keep changing and you want function evidence before a label.',
  },
  {
    href: '/mbti-alternative',
    label: 'MBTI alternative',
    description: 'Compare TypeJung as a function-based alternative to label-first MBTI-style typology.',
  },
  {
    href: '/16personalities-alternative',
    label: '16Personalities alternative',
    description: 'Compare a free function-stack map against broad 16Personalities-style type summaries.',
  },
  {
    href: '/sakinorva-alternative',
    label: 'Sakinorva alternative',
    description: 'Compare TypeJung as a free-first cognitive-functions test and interpretation path.',
  },
  {
    href: '/mbti-mistype-test',
    label: 'MBTI mistype test',
    description: 'Use function evidence to check whether a changing or competing type label is really a mistype.',
  },
  {
    href: '/inferior-function-test',
    label: 'Inferior function test',
    description: 'Use the dominant-inferior axis to understand stress, grip patterns, and development.',
  },
];

// Common head template
const getHead = (title: string, description: string, path: string, keywords?: string[]) => `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="keywords" content="${escapeHtml((keywords && keywords.length > 0 ? keywords : ['Jung personality test', 'cognitive functions', title.split(' - ')[0].toLowerCase(), 'psychological types']).join(', '))}">
<meta name="author" content="TypeJung">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${siteConfig.url}${path}">
<meta property="og:type" content="article">
<meta property="og:url" content="${siteConfig.url}${path}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${siteConfig.url}/og-image.png">
<meta property="og:site_name" content="TypeJung">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${siteConfig.url}/og-image.png">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;1,8..60,400&family=Schibsted+Grotesk:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">
<style>
  :root {
    --jung-base: #fafaf8;
    --jung-surface: #ffffff;
    --jung-surface-alt: #f4f4f2;
    --jung-dark: #1a1a1a;
    --jung-secondary: #555d56;
    --jung-muted: #666666;
    --jung-border: #d4d4d2;
    --jung-border-light: #e8e8e6;
    --jung-accent: #2d5a3d;
    --jung-accent-hover: #234832;
    --jung-accent-light: #e8f1ea;
    --jung-accent-muted: #7fa085;
    --jung-gold: #a17932;
  }
  * { box-sizing: border-box; }
  body {
    font-family: "Schibsted Grotesk", Verdana, sans-serif;
    line-height: 1.75;
    color: var(--jung-dark);
    max-width: 980px;
    margin: 0 auto;
    padding: 32px 20px 48px;
    background:
      linear-gradient(180deg, rgba(244,244,242,0.72) 0%, rgba(250,250,248,0) 360px),
      var(--jung-base);
  }
  h1, h2, h3 { font-family: "Fraunces", Georgia, serif; font-weight: 600; letter-spacing: 0; overflow-wrap: anywhere; }
  h1 { color: var(--jung-dark); font-size: clamp(2.35rem, 7vw, 4.4rem); line-height: 0.98; margin: 0 0 0.35em; }
  h2 { color: var(--jung-dark); border-bottom: 1px solid var(--jung-border); padding-bottom: 12px; margin-top: 48px; font-size: clamp(1.55rem, 3.5vw, 2.25rem); line-height: 1.1; }
  h3 { color: var(--jung-dark); margin-top: 30px; font-size: 1.2rem; line-height: 1.25; }
  p, li { color: var(--jung-secondary); font-family: "Source Serif 4", Georgia, serif; overflow-wrap: anywhere; }
  a { color: var(--jung-accent); text-decoration-thickness: 0.08em; text-underline-offset: 0.18em; overflow-wrap: anywhere; }
  .subtitle { color: var(--jung-secondary); font-family: "Source Serif 4", Georgia, serif; font-size: clamp(1.1rem, 2.6vw, 1.35rem); line-height: 1.65; margin-bottom: 22px; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  .breadcrumb { color: var(--jung-muted); margin-bottom: 28px; font-size: 0.92rem; }
  .breadcrumb a { color: var(--jung-accent); text-decoration: none; font-weight: 600; }
  .eyebrow { color: var(--jung-accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.78rem; margin-bottom: 14px; }
  .cta-box { background: var(--jung-dark); color: white; padding: clamp(24px, 5vw, 40px); border-radius: 8px; margin: 38px 0; border: 1px solid var(--jung-dark); box-shadow: 0 24px 60px -36px rgb(29 38 32 / 0.55); }
  .cta-box p, .cta-box h2, .cta-box h3 { color: white; }
  .cta-box h2 { border: 0; margin-top: 0; padding-bottom: 0; }
  .cta-box h3 { margin-top: 0; }
  .hero-actions, .cta-actions { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 24px 0 0; }
  .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 12px 22px; background: var(--jung-accent); color: white; text-decoration: none; border-radius: 8px; font-weight: 700; box-shadow: 0 18px 50px -34px rgb(47 111 88 / 0.7); }
  .btn:hover { background: var(--jung-accent-hover); }
  .secondary-btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 12px 20px; background: var(--jung-surface); color: var(--jung-dark); text-decoration: none; border: 1px solid var(--jung-border); border-radius: 8px; font-weight: 700; }
  .secondary-btn:hover { border-color: var(--jung-accent-muted); color: var(--jung-accent); }
  .cta-box .secondary-btn { background: transparent; color: white; border-color: rgba(255,255,255,0.32); }
  .cta-box .secondary-btn:hover { border-color: rgba(255,255,255,0.72); color: white; }
  .text-link { color: var(--jung-accent-light); font-weight: 700; margin-left: 16px; }
  .proof-strip { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0 0; padding: 0; list-style: none; }
  .proof-strip li { margin: 0; padding: 7px 10px; border: 1px solid var(--jung-border-light); border-radius: 8px; background: rgba(255,255,255,0.72); color: var(--jung-secondary); font-family: "Schibsted Grotesk", Verdana, sans-serif; font-size: 0.82rem; font-weight: 600; line-height: 1.25; }
  .save-link-panel { display: grid; gap: 14px; margin: 24px 0 0; padding: 18px; border: 1px solid var(--jung-accent-muted); border-radius: 8px; background: color-mix(in srgb, var(--jung-accent-light) 56%, white); }
  .save-link-panel h2 { border: 0; margin: 0; padding: 0; font-family: "Schibsted Grotesk", Verdana, sans-serif; font-size: 1.04rem; line-height: 1.25; }
  .save-link-panel p { margin: 0; font-size: 0.98rem; line-height: 1.55; }
  .save-link-form { display: grid; gap: 10px; }
  .save-link-form-row { display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr) auto; }
  .save-link-form input[type="email"] { min-height: 44px; width: 100%; border: 1px solid var(--jung-border); border-radius: 8px; background: var(--jung-surface); color: var(--jung-dark); font: 600 0.95rem "Schibsted Grotesk", Verdana, sans-serif; padding: 0 12px; }
  .save-link-form button { min-height: 44px; border: 0; border-radius: 8px; background: var(--jung-accent); color: white; cursor: pointer; font: 700 0.92rem "Schibsted Grotesk", Verdana, sans-serif; padding: 0 16px; }
  .save-link-form button:disabled { cursor: wait; opacity: 0.72; }
  .save-link-status { min-height: 1.35rem; color: var(--jung-secondary); font-size: 0.86rem !important; }
  .honeypot { display: none; }
  .creator-share-kit { margin: 30px 0 36px; padding: clamp(20px, 4vw, 28px); border: 1px solid var(--jung-border); border-radius: 8px; background: var(--jung-surface); box-shadow: 0 16px 50px -42px rgb(29 38 32 / 0.4); }
  .creator-share-kit h2 { border: 0; margin: 0; padding: 0; font-size: clamp(1.35rem, 3vw, 1.85rem); }
  .creator-share-kit-intro { margin: 8px 0 0; max-width: 740px; }
  .creator-public-link { margin: 16px 0 0; padding: 12px 14px; border: 1px solid var(--jung-border-light); border-radius: 8px; background: var(--jung-surface-alt); font-family: "Schibsted Grotesk", Verdana, sans-serif; font-size: 0.9rem; }
  .creator-public-link strong { display: block; margin-bottom: 3px; color: var(--jung-dark); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; }
  .copy-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; margin: 18px 0 0; }
  .copy-card { display: grid; gap: 10px; min-height: 100%; padding: 15px; border: 1px solid var(--jung-border-light); border-radius: 8px; background: color-mix(in srgb, var(--jung-accent-light) 22%, white); }
  .copy-card h3 { margin: 0; font-family: "Schibsted Grotesk", Verdana, sans-serif; font-size: 1rem; }
  .copy-template { min-height: 172px; width: 100%; resize: vertical; border: 1px solid var(--jung-border); border-radius: 8px; background: white; color: var(--jung-secondary); font: 500 0.9rem/1.55 "Source Serif 4", Georgia, serif; padding: 12px; }
  .copy-action-row { display: grid; gap: 7px; align-items: center; }
  .copy-action-row button { justify-self: start; min-height: 40px; border: 0; border-radius: 8px; background: var(--jung-dark); color: white; cursor: pointer; font: 700 0.88rem "Schibsted Grotesk", Verdana, sans-serif; padding: 0 14px; }
  .copy-status { min-height: 1.25rem; margin: 0; color: var(--jung-muted); font-size: 0.82rem !important; }
  .related-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin: 20px 0; }
  .related-card { background: var(--jung-surface); padding: 16px; border-radius: 8px; border: 1px solid var(--jung-border-light); box-shadow: 0 1px 2px 0 rgb(29 38 32 / 0.05); }
  .related-card a { color: var(--jung-dark); text-decoration: none; font-weight: 700; }
  .intent-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; margin: 28px 0 32px; }
  .intent-card { background: var(--jung-surface); border: 1px solid var(--jung-border-light); border-radius: 8px; padding: 18px; box-shadow: 0 1px 2px 0 rgb(29 38 32 / 0.05); }
  .intent-card strong { display: block; margin-bottom: 7px; font-family: "Schibsted Grotesk", Verdana, sans-serif; color: var(--jung-dark); font-size: 0.86rem; text-transform: uppercase; letter-spacing: 0.06em; }
  .intent-card span { display: block; color: var(--jung-secondary); font-family: "Source Serif 4", Georgia, serif; line-height: 1.6; }
  .cluster-nav { background: color-mix(in srgb, var(--jung-accent-light) 48%, white); border: 1px solid color-mix(in srgb, var(--jung-accent-muted) 55%, white); border-radius: 8px; padding: 18px; margin: 28px 0 36px; }
  .cluster-nav h2 { border: 0; margin: 0 0 12px; padding: 0; font-size: 1.12rem; font-family: "Schibsted Grotesk", Verdana, sans-serif; }
  .cluster-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; }
  .cluster-link { display: block; min-height: 100%; padding: 14px; border-radius: 8px; background: rgba(255,255,255,0.72); border: 1px solid var(--jung-border-light); color: var(--jung-dark); text-decoration: none; }
  .cluster-link strong { display: block; margin-bottom: 6px; font-family: "Schibsted Grotesk", Verdana, sans-serif; }
  .cluster-link span { display: block; color: var(--jung-secondary); font-family: "Source Serif 4", Georgia, serif; font-size: 0.95rem; line-height: 1.45; }
  .debrief-cta { margin: 30px 0 36px; padding: clamp(22px, 4vw, 30px); border: 1px solid var(--jung-accent-muted); border-radius: 8px; background: linear-gradient(135deg, color-mix(in srgb, var(--jung-accent-light) 64%, white), var(--jung-surface)); box-shadow: 0 18px 54px -42px rgb(29 38 32 / 0.52); }
  .debrief-cta-grid { display: grid; gap: 18px; align-items: center; grid-template-columns: minmax(0, 1fr) auto; }
  .debrief-cta h2 { border: 0; margin: 0; padding: 0; font-size: clamp(1.45rem, 3vw, 2rem); }
  .debrief-cta p { margin: 10px 0 0; }
  .debrief-cta ul { display: grid; gap: 7px; margin: 16px 0 0; padding-left: 20px; }
  .debrief-price-card { min-width: 176px; padding: 16px; border: 1px solid var(--jung-border); border-radius: 8px; background: white; text-align: right; }
  .debrief-price-card strong { display: block; color: var(--jung-dark); font-family: "Fraunces", Georgia, serif; font-size: 2rem; line-height: 1; }
  .debrief-price-card span { display: block; margin-top: 8px; color: var(--jung-muted); font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; }
  .context-links { margin: 18px 0 0; padding: 14px 16px; background: var(--jung-surface); border: 1px solid var(--jung-border-light); border-radius: 8px; }
  .context-links strong { display: block; margin-bottom: 8px; font-family: "Schibsted Grotesk", Verdana, sans-serif; font-size: 0.86rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--jung-muted); }
  .context-links ul { margin: 0; padding-left: 20px; }
  .context-links li { margin: 4px 0; }
  .faq-item { background: var(--jung-surface); padding: 18px; border-radius: 8px; margin-bottom: 14px; border: 1px solid var(--jung-border-light); }
  .faq-item h3 { margin: 0 0 8px; font-size: 1.05rem; }
  .comparison-table { display: block; width: 100%; max-width: 100%; border-collapse: collapse; margin: 22px 0; background: var(--jung-surface); border: 1px solid var(--jung-border); border-radius: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .comparison-table thead, .comparison-table tbody { display: table; width: 100%; min-width: min(620px, 100%); }
  .comparison-table th { background: var(--jung-dark); color: white; padding: 13px; text-align: left; }
  .comparison-table td { padding: 13px; border-bottom: 1px solid var(--jung-border-light); vertical-align: top; color: var(--jung-secondary); }
  .comparison-table tr:nth-child(even) { background: var(--jung-surface-alt); }
  .trait-list { columns: 2; column-gap: 30px; }
  .trait-list li { break-inside: avoid; margin-bottom: 10px; }
  footer { margin-top: 50px; padding-top: 22px; border-top: 1px solid var(--jung-border); color: var(--jung-muted); text-align: center; }
  nav { background: rgba(255,255,255,0.88); padding: 12px; border: 1px solid var(--jung-border); border-radius: 8px; margin-bottom: 30px; box-shadow: 0 1px 2px 0 rgb(29 38 32 / 0.05); }
  nav a { display: inline-flex; align-items: center; min-height: 40px; padding: 0 6px; color: var(--jung-secondary); text-decoration: none; margin-right: 12px; font-weight: 700; font-size: 0.92rem; }
  nav a:hover { color: var(--jung-accent); }
  .breadcrumb a { display: inline-flex; align-items: center; min-height: 36px; }
  @media (max-width: 640px) {
    body { padding: 20px 16px 40px; }
    nav { display: flex; flex-wrap: wrap; gap: 10px 14px; }
    nav a { margin-right: 0; }
    .intent-grid { grid-template-columns: 1fr; }
    .trait-list { columns: 1; }
    .hero-actions > a, .cta-actions > a { width: 100%; }
    .save-link-form-row { grid-template-columns: 1fr; }
    .copy-action-row button { width: 100%; }
    .text-link { display: inline-block; margin: 14px 0 0; }
    .debrief-cta-grid { grid-template-columns: 1fr; }
    .debrief-price-card { text-align: left; }
  }
</style>
`;

const debriefGuideSlugs = new Set([
  'cognitive-function-test',
  'jungian-cognitive-functions-test',
  'sakinorva-alternative',
  '16personalities-alternative',
  'infj-vs-infp-test',
  'intj-vs-intp-test',
  'inferior-function-test',
  'mbti-keeps-changing',
  'mbti-mistype-test',
  'best-cognitive-functions-test',
  'why-do-i-get-different-mbti-results',
  'am-i-infj-or-infp',
  'mbti-changes-with-mood',
]);

function renderDebriefGuideCta(page: any) {
  if (!debriefGuideSlugs.has(page.slug)) return '';

  return `<section class="debrief-cta" aria-labelledby="${escapeHtml(page.slug)}-debrief-title">
    <div class="debrief-cta-grid">
      <div>
        <p class="eyebrow">Human-reviewed option</p>
        <h2 id="${escapeHtml(page.slug)}-debrief-title">Still stuck between two types?</h2>
        <p>
          If this guide sounds familiar but you still do not know how to read your result, get a Personal Type Debrief.
          I review your TypeJung map, likely mistype risks, and stress edge, then send a 10-minute video or written breakdown within 72 hours.
        </p>
        <ul>
          <li>Best for INFJ vs INFP, INTJ vs INTP, or Sakinorva/16Personalities confusion.</li>
          <li>Start with the free map first; use the Debrief when you want a second read.</li>
          <li>Educational self-reflection, not a clinical or diagnostic assessment.</li>
        </ul>
        <div class="cta-actions">
          <a href="${escapeHtml(withSource('/debrief', page, 'guide_debrief'))}" class="btn">Get a personal debrief</a>
          <a href="${escapeHtml(withSource('/assessment', page, 'guide_debrief_assessment'))}" class="secondary-btn">Take the free map first</a>
        </div>
      </div>
      <div class="debrief-price-card">
        <strong>CA$129</strong>
        <span>Limited to 5/week</span>
      </div>
    </div>
  </section>`;
}

function renderIntentPanel(page: any) {
  if (!page.intent) return '';

  return `<section class="intent-grid" aria-label="Quick assessment fit">
    <div class="intent-card">
      <strong>Best for</strong>
      <span>${escapeHtml(page.intent.bestFor)}</span>
    </div>
    <div class="intent-card">
      <strong>Maps</strong>
      <span>${escapeHtml(page.intent.measures)}</span>
    </div>
    <div class="intent-card">
      <strong>Privacy</strong>
      <span>${escapeHtml(page.intent.privacy)}</span>
    </div>
  </section>`;
}

function renderClusterNav(currentSlug: string) {
  const links = coreClusterLinks.filter(link => link.href !== `/${currentSlug}`);

  return `<section class="cluster-nav" aria-label="Jungian test topic cluster">
    <h2>Related Jungian assessment guides</h2>
    <div class="cluster-grid">
      ${links.map((link) => `<a class="cluster-link" href="${escapeHtml(link.href)}"><strong>${escapeHtml(link.label)}</strong><span>${escapeHtml(link.description)}</span></a>`).join('\n      ')}
    </div>
  </section>`;
}

function renderSaveLinkPanel(page: any) {
  const saveLink = page.saveLink || {};
  const title = saveLink.title || 'Want the free map later?';
  const body = saveLink.body || `Email yourself the assessment link and ${'TYPEJUNG30'} code. Start free, then decide after the result.`;
  const button = saveLink.button || 'Email the free link';
  const tier = saveLink.tier || 'insight';

  return `<section class="save-link-panel" aria-labelledby="${escapeHtml(page.slug)}-save-link-title">
    <div>
      <h2 id="${escapeHtml(page.slug)}-save-link-title">${escapeHtml(title)}</h2>
      <p>${escapeHtml(body)}</p>
    </div>
    <form class="save-link-form" data-discount-lead-form data-source="${escapeHtml(sourceFor(page, 'email_code'))}" data-tier="${escapeHtml(tier)}">
      <label class="sr-only" for="${escapeHtml(page.slug)}-save-link-email">Email address</label>
      <div class="save-link-form-row">
        <input id="${escapeHtml(page.slug)}-save-link-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
        <button type="submit">${escapeHtml(button)}</button>
      </div>
      <input class="honeypot" name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
      <p class="save-link-status" aria-live="polite"></p>
    </form>
  </section>`;
}

function renderCreatorShareKit(page: any) {
  if (!page.creatorKit) return '';

  const kit = page.creatorKit;
  const publicPath = kit.publicPath || '/mbti-mistype-test';
  const defaultCampaign = kit.defaultCampaign || 'creator_outreach_2026_05';
  const snippets = Array.isArray(kit.snippets) ? kit.snippets : [];

  return `<section class="creator-share-kit" data-creator-share-kit data-public-path="${escapeHtml(publicPath)}" data-default-campaign="${escapeHtml(defaultCampaign)}" aria-labelledby="${escapeHtml(page.slug)}-creator-share-title">
    <h2 id="${escapeHtml(page.slug)}-creator-share-title">${escapeHtml(kit.title || 'Safe mention kit')}</h2>
    <p class="creator-share-kit-intro">${escapeHtml(kit.body || 'Use these snippets only after you have reviewed the free map and decided the tool is useful for your audience.')}</p>
    <p class="creator-public-link">
      <strong>Tracked public link</strong>
      <a href="${escapeHtml(publicPath)}" data-public-link>${escapeHtml(`${siteConfig.url}${publicPath}`)}</a>
    </p>
    <div class="copy-grid">
      ${snippets.map((snippet: any, index: number) => {
        const copyId = `${page.slug}-copy-${index + 1}`;
        return `<div class="copy-card">
        <h3>${escapeHtml(snippet.label || `Snippet ${index + 1}`)}</h3>
        <textarea class="copy-template" data-copy-id="${escapeHtml(copyId)}" readonly>${escapeHtml(snippet.copy || '')}</textarea>
        <div class="copy-action-row">
          <button type="button" data-copy-button="${escapeHtml(copyId)}">Copy safe mention</button>
          <p class="copy-status" data-copy-status="${escapeHtml(copyId)}" aria-live="polite"></p>
        </div>
      </div>`;
      }).join('\n      ')}
    </div>
  </section>`;
}

const landingAttributionScript = `<script>
    (() => {
      const cleanToken = (value, maxLength = 100) => {
        if (typeof value !== 'string') return '';
        return value
          .trim()
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_+|_+$/g, '')
          .slice(0, maxLength);
      };
      const cleanSourceChain = (value) => {
        if (typeof value !== 'string') return '';
        return Array.from(new Set(value
          .split('>')
          .map((token) => cleanToken(token, 80))
          .filter(Boolean)))
          .join('>')
          .slice(0, 240);
      };
      const appendSourceChain = (...values) => {
        return Array.from(new Set(values.flatMap((value) => {
          const chain = cleanSourceChain(value);
          return chain ? chain.split('>') : [];
        }))).join('>').slice(0, 240);
      };
      const currentParams = new URLSearchParams(window.location.search);
      const currentSource = cleanToken(currentParams.get('source'), 80);
      const currentParentSource = cleanToken(currentParams.get('parent_source'), 80);
      const currentSourceChain = appendSourceChain(
        currentParams.get('source_chain'),
        currentParentSource,
        currentSource,
      );
      const preservedKeys = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term', 'ref', 'shared_result', 'parent_source'];
      const preserved = new URLSearchParams();
      preservedKeys.forEach((key) => {
        const value = cleanToken(currentParams.get(key));
        if (value) preserved.set(key, value);
      });
      if (currentSourceChain) preserved.set('source_chain', currentSourceChain);
      const hasPreserved = Array.from(preserved.keys()).length > 0;
      if (!hasPreserved && !currentSource) return;

      document.querySelectorAll('a[href]').forEach((link) => {
        const rawHref = link.getAttribute('href') || '';
        if (!rawHref.startsWith('/') || rawHref.startsWith('//') || rawHref.startsWith('/api/')) return;

        const url = new URL(rawHref, window.location.origin);
        preserved.forEach((value, key) => {
          if (!url.searchParams.has(key)) url.searchParams.set(key, value);
        });

        const linkSource = cleanToken(url.searchParams.get('source'), 80);
        if (currentSource && linkSource && linkSource !== currentSource && !url.searchParams.has('parent_source')) {
          url.searchParams.set('parent_source', currentSource);
        }
        if (currentSource && !linkSource) {
          url.searchParams.set('source', currentSource);
        }
        const finalSource = cleanToken(url.searchParams.get('source'), 80);
        const finalSourceChain = appendSourceChain(
          currentSourceChain,
          finalSource && finalSource !== currentSource ? finalSource : '',
        );
        if (finalSourceChain) url.searchParams.set('source_chain', finalSourceChain);

        link.setAttribute('href', url.pathname + url.search + url.hash);
      });
    })();
  </script>`;

const creatorShareKitScript = `<script>
    (() => {
      const root = document.querySelector('[data-creator-share-kit]');
      if (!root) return;

      const cleanToken = (value, maxLength = 100) => {
        if (typeof value !== 'string') return '';
        return value
          .trim()
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_+|_+$/g, '')
          .slice(0, maxLength);
      };
      const cleanSourceChain = (value) => {
        if (typeof value !== 'string') return '';
        return Array.from(new Set(value
          .split('>')
          .map((token) => cleanToken(token, 80))
          .filter(Boolean)))
          .join('>')
          .slice(0, 240);
      };
      const appendSourceChain = (...values) => {
        return Array.from(new Set(values.flatMap((value) => {
          const chain = cleanSourceChain(value);
          return chain ? chain.split('>') : [];
        }))).join('>').slice(0, 240);
      };
      const params = new URLSearchParams(window.location.search);
      const publicPath = root.getAttribute('data-public-path') || '/mbti-mistype-test';
      const defaultCampaign = root.getAttribute('data-default-campaign') || 'creator_outreach_2026_05';
      const currentSource = cleanToken(params.get('source'), 80) || 'creator_review_invite';
      const utmSource = cleanToken(params.get('utm_source')) || 'creator_review';
      const utmCampaign = cleanToken(params.get('utm_campaign')) || cleanToken(defaultCampaign);
      const sourceChain = appendSourceChain(params.get('source_chain'), currentSource, 'creator_safe_mention');
      const url = new URL(publicPath, '${siteConfig.url}');

      url.searchParams.set('source', 'creator_safe_mention');
      url.searchParams.set('utm_source', utmSource);
      url.searchParams.set('utm_campaign', utmCampaign);
      url.searchParams.set('parent_source', currentSource);
      if (sourceChain) url.searchParams.set('source_chain', sourceChain);

      const publicLink = url.toString();
      const trackCreatorCopy = (copyId, snippetLabel) => {
        try {
          fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify({
              event: 'creator_safe_mention_copied',
              source: 'creator_share_kit',
              copyId,
              snippetLabel,
              publicPath: url.pathname,
              pagePath: window.location.pathname,
              utmSource,
              utmCampaign,
              parentSource: currentSource,
              sourceChain,
            }),
          }).catch(() => {});
        } catch {
          // Measurement should never block copying.
        }
      };
      root.querySelectorAll('[data-public-link]').forEach((element) => {
        element.textContent = publicLink;
        if (element instanceof HTMLAnchorElement) element.href = publicLink;
      });
      root.querySelectorAll('[data-copy-id]').forEach((field) => {
        const original = field instanceof HTMLTextAreaElement ? field.value : field.textContent || '';
        const rendered = original.replaceAll('{public_link}', publicLink);
        if (field instanceof HTMLTextAreaElement) field.value = rendered;
        field.textContent = rendered;
      });

      root.addEventListener('click', async (event) => {
        const button = event.target instanceof Element ? event.target.closest('[data-copy-button]') : null;
        if (!(button instanceof HTMLButtonElement)) return;

        const copyId = button.getAttribute('data-copy-button') || '';
        const field = root.querySelector('[data-copy-id="' + copyId.replace(/["\\\\]/g, '') + '"]');
        const status = root.querySelector('[data-copy-status="' + copyId.replace(/["\\\\]/g, '') + '"]');
        const text = field instanceof HTMLTextAreaElement ? field.value : field?.textContent || '';
        if (!text.trim()) return;

        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
          } else if (field instanceof HTMLTextAreaElement) {
            field.focus();
            field.select();
            document.execCommand('copy');
          }
          const previousLabel = button.textContent || 'Copy safe mention';
          button.textContent = 'Copied';
          if (status) status.textContent = 'Copied. Use only if the review feels like a fit.';
          trackCreatorCopy(copyId, button.closest('.copy-card')?.querySelector('h3')?.textContent || '');
          window.setTimeout(() => {
            button.textContent = previousLabel;
            if (status) status.textContent = '';
          }, 2400);
        } catch {
          if (status) status.textContent = 'Select the text and copy it manually.';
        }
      });
    })();
  </script>`;

function renderLandingSection(section: any, page: any, sectionIndex: number) {
  const paragraphs = section.body
    .map((paragraph: string) => `<p>${escapeHtml(paragraph)}</p>`)
    .join('\n  ');
  const bullets = section.bullets
    ? `<ul>\n    ${section.bullets.map((item: string) => `<li>${escapeHtml(item)}</li>`).join('\n    ')}\n  </ul>`
    : '';
  const table = section.table
    ? `<table class="comparison-table">
    <thead>
      <tr>${section.table.headers.map((header: string) => `<th>${escapeHtml(header)}</th>`).join('')}</tr>
    </thead>
    <tbody>
      ${section.table.rows.map((row: string[]) => `<tr>${row.map((cell: string) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('\n      ')}
    </tbody>
  </table>`
    : '';
  const links = section.links
    ? `<div class="context-links">
    <strong>Useful next reads</strong>
    <ul>
      ${section.links.map((link: any) => `<li><a href="${escapeHtml(withSource(link.href, page, `section_${sectionIndex + 1}`))}">${escapeHtml(link.label)}</a></li>`).join('\n      ')}
    </ul>
  </div>`
    : '';
  const sectionContent = [paragraphs, bullets, table, links].filter(Boolean).join('\n  ');

  return `<section>
  <h2>${escapeHtml(section.heading)}</h2>
  ${sectionContent}
</section>`;
}

function generateLandingPage(page: any) {
  const path = `/${page.slug}`;
  const schemaKeywords = Array.isArray(page.keywords) && page.keywords.length > 0
    ? page.keywords
    : [page.query].filter(Boolean);
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: page.query, path },
  ]);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.description,
    keywords: schemaKeywords.join(', '),
    about: schemaKeywords.slice(0, 8).map((keyword: string) => ({
      '@type': 'Thing',
      name: keyword,
    })),
    url: `${siteConfig.url}${path}`,
    inLanguage: 'en',
    dateModified: buildDate,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
      sameAs: siteConfig.sameAs,
    },
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
${getHead(page.title, page.description, path, page.keywords)}
<script type="application/ld+json">
${renderJsonLd(webPageSchema)}
</script>
<script type="application/ld+json">
${renderJsonLd(breadcrumbs)}
</script>
<script type="application/ld+json">
${renderJsonLd(faqSchema)}
</script>
${standaloneAnalyticsSnippet}
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="${escapeHtml(withSource('/assessment', page, 'nav'))}">Take Assessment</a>
    <a href="/learn">Learn</a>
    <a href="${escapeHtml(withSource('/pricing', page, 'nav'))}">Pricing</a>
    <a href="/blog/">Blog</a>
  </nav>

  <div class="breadcrumb">
    <a href="/">Home</a> › ${escapeHtml(page.query)}
  </div>

  <header>
    <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
    <h1>${escapeHtml(page.h1)}</h1>
    ${page.intro.map((paragraph: string) => `<p class="subtitle">${escapeHtml(paragraph)}</p>`).join('\n    ')}
    <div class="hero-actions">
      <a href="${escapeHtml(withSource('/assessment', page, 'hero'))}" class="btn">Start the free assessment</a>
      <a href="${escapeHtml(withSource('/sample-report', page, 'hero_sample'))}" class="secondary-btn">View sample report</a>
    </div>
    <ul class="proof-strip" aria-label="Assessment proof points">
      <li>42-question map</li>
      <li>No payment first</li>
      <li>CA$7 Insight with TYPEJUNG30</li>
    </ul>
    ${renderSaveLinkPanel(page)}
  </header>

  ${renderIntentPanel(page)}

  ${renderDebriefGuideCta(page)}

  ${renderCreatorShareKit(page)}

  ${renderClusterNav(page.slug)}

  ${page.sections.map((section: any, index: number) => renderLandingSection(section, page, index)).join('\n\n  ')}

  <div class="cta-box">
    <h2>Start with your own function profile</h2>
    <p>Take the free TypeJung assessment first. If the function-stack map feels useful, Insight is currently CA$7 with TYPEJUNG30 and Mastery is CA$20.30 with the same Stripe code.</p>
    <div class="cta-actions">
      <a href="${escapeHtml(withSource('/assessment', page, 'final'))}" class="btn">Take the free assessment</a>
      <a href="${escapeHtml(withSource('/sample-report', page, 'final_sample'))}" class="secondary-btn">View sample report</a>
      <a href="${escapeHtml(withSource('/pricing', page, 'final_pricing'))}" class="text-link">See pricing</a>
    </div>
  </div>

  <section>
    <h2>Frequently Asked Questions</h2>
    ${page.faqs.map((faq: any) => `<div class="faq-item">
      <h3>${escapeHtml(faq.question)}</h3>
      <p>${escapeHtml(faq.answer)}</p>
    </div>`).join('\n    ')}
  </section>

  <section>
    <h2>Related TypeJung Pages</h2>
    <div class="related-grid">
      ${page.relatedLinks.map((link: any) => `<div class="related-card"><a href="${escapeHtml(withSource(link.href, page, 'related'))}">${escapeHtml(link.label)}</a></div>`).join('\n      ')}
    </div>
  </section>

  <footer>
    <p>&copy; 2026 TypeJung. A tool for self-exploration based on Jung's Psychological Types.</p>
    <p><a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a></p>
  </footer>
  <script>
    (() => {
      const attributionPayload = () => {
        const params = new URLSearchParams(window.location.search);
        const cleanToken = (value) => {
          if (typeof value !== 'string') return '';
          return value
            .trim()
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_+|_+$/g, '')
            .slice(0, 100);
        };
        const cleanSourceChain = (value) => {
          if (typeof value !== 'string') return '';
          return Array.from(new Set(value
            .split('>')
            .map((token) => cleanToken(token).slice(0, 80))
            .filter(Boolean)))
            .join('>')
            .slice(0, 240);
        };
        const utmSource = cleanToken(params.get('utm_source'));
        const utmCampaign = cleanToken(params.get('utm_campaign'));
        const parentSource = cleanToken(params.get('parent_source')) || cleanToken(params.get('source'));
        const sourceChain = cleanSourceChain(params.get('source_chain'));

        return {
          ...(utmSource ? { utmSource } : {}),
          ...(utmCampaign ? { utmCampaign } : {}),
          ...(parentSource ? { parentSource } : {}),
          ...(sourceChain ? { sourceChain } : {}),
        };
      };
      const forms = document.querySelectorAll('[data-discount-lead-form]');
      forms.forEach((form) => {
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const email = form.querySelector('input[name="email"]')?.value || '';
          const website = form.querySelector('input[name="website"]')?.value || '';
          const button = form.querySelector('button[type="submit"]');
          const status = form.querySelector('.save-link-status');
          const source = form.getAttribute('data-source') || 'seo_email_code';
          const tierIntent = form.getAttribute('data-tier') || 'insight';

          if (status) status.textContent = 'Sending the link...';
          if (button) button.disabled = true;

          try {
            const response = await fetch('/api/auth/discount-lead', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ email, website, source, tierIntent, ...attributionPayload() }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || 'Could not send the link.');
            if (status) status.textContent = 'Sent. Check your inbox for the free assessment link and code.';
            form.setAttribute('data-sent', 'true');
          } catch (error) {
            if (status) status.textContent = error.message || 'Could not send the link. Try again in a moment.';
            if (button) button.disabled = false;
          }
        });
      });
    })();
  </script>
  ${page.creatorKit ? creatorShareKitScript : ''}
  ${landingAttributionScript}
</body>
</html>`;

  return html.replace(/^[ \t]+$/gm, '');
}

// Generate function page HTML
function generateFunctionPage(fn: string) {
  const seo = functionSEO[fn];
  const data = functionData[fn];
  const path = `/functions/${fn}`;
  const sourcePage = { slug: `function-${fn}` };
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Learn Jungian typology', path: '/learn' },
    { name: data.fullName, path },
  ]);
  
  const attitudeCounterpartMap: Record<string, string> = {
    ni: 'ne', ne: 'ni', si: 'se', se: 'si',
    ti: 'te', te: 'ti', fi: 'fe', fe: 'fi'
  };
  const inferiorCounterpartMap: Record<string, string> = {
    ni: 'se', ne: 'si', si: 'ne', se: 'ni',
    ti: 'fe', te: 'fi', fi: 'te', fe: 'ti'
  };
  const attitudeCounterpartFn = attitudeCounterpartMap[fn];
  const attitudeCounterpartSeo = functionSEO[attitudeCounterpartFn];
  const inferiorCounterpartFn = inferiorCounterpartMap[fn];
  const inferiorCounterpartSeo = functionSEO[inferiorCounterpartFn];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
${getHead(seo.title, seo.description, path)}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${seo.name}",
  "description": "${seo.description}",
  "url": "${siteConfig.url}${path}",
  "dateModified": "${buildDate}",
  "author": { "@type": "Organization", "name": "TypeJung", "url": "${siteConfig.url}", "sameAs": ${JSON.stringify(siteConfig.sameAs)} },
  "publisher": { "@type": "Organization", "name": "TypeJung", "url": "${siteConfig.url}", "sameAs": ${JSON.stringify(siteConfig.sameAs)}, "logo": { "@type": "ImageObject", "url": "${siteConfig.url}/logo.png" } },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "${siteConfig.url}${path}" }
}
</script>
<script type="application/ld+json">
${renderJsonLd(breadcrumbs)}
</script>
${standaloneAnalyticsSnippet}
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/learn">Learn</a>
    <a href="${escapeHtml(withSource('/assessment', sourcePage, 'nav'))}">Take Assessment</a>
    <a href="${escapeHtml(withSource('/pricing', sourcePage, 'nav'))}">Pricing</a>
  </nav>

  <div class="breadcrumb">
    <a href="/">Home</a> › <a href="/learn">Learn</a> › ${data.fullName}
  </div>

  <h1>${data.fullName}</h1>
  <p class="subtitle">${data.archetype} | ${data.category} Function | ${data.motto}</p>

  <p>${data.description}</p>

  <h2>Core Characteristics</h2>
  <ul>
    ${data.characteristics.map(c => `<li>${c}</li>`).join('\n    ')}
  </ul>

  <h2>Strengths</h2>
  <ul>
    ${data.strengths.map(s => `<li>${s}</li>`).join('\n    ')}
  </ul>

  <h2>Challenges & Growth Areas</h2>
  <ul>
    ${data.challenges.map(c => `<li>${c}</li>`).join('\n    ')}
  </ul>

  <h2>The Grip: ${data.code} Under Stress</h2>
  <p>${data.inTheGrip}</p>

  <h2>Personality Types with ${data.code}</h2>
  
  <h3>Dominant ${data.code}</h3>
  <div class="related-grid">
    ${data.dominantIn.map(type => {
      const typeKey = type.toLowerCase();
      const typeInfo = typeSEO[typeKey];
      return `<div class="related-card">
        <a href="/types/${typeKey}">${type}</a> - ${typeInfo?.name?.split(' - ')[1] || 'Personality Type'}
      </div>`;
    }).join('\n    ')}
  </div>

  <h3>Auxiliary ${data.code}</h3>
  <div class="related-grid">
    ${data.auxiliaryIn.map(type => {
      const typeKey = type.toLowerCase();
      const typeInfo = typeSEO[typeKey];
      return `<div class="related-card">
        <a href="/types/${typeKey}">${type}</a> - ${typeInfo?.name?.split(' - ')[1] || 'Personality Type'}
      </div>`;
    }).join('\n    ')}
  </div>

  <h2>Function Relationships</h2>
  <p>The attitude counterpart of ${data.fullName} is <a href="/functions/${attitudeCounterpartFn}">${attitudeCounterpartSeo.name}</a>. Both functions work in the same broad domain, but one turns inward first and the other tests itself in the outer world.</p>
  <p>The inferior counterpart often paired with ${data.code} in Jungian type patterns is <a href="/functions/${inferiorCounterpartFn}">${inferiorCounterpartSeo.name}</a>. This relationship is different from the attitude counterpart: it names the dominant-inferior axis that can become most visible under pressure.</p>

  <div class="cta-box">
    <h3>Discover Your ${data.code} Score</h3>
    <p>Take the free 42-question assessment to see how ${data.fullName} appears in your TypeJung function-stack map, including function strength, attitude direction, and stress-edge context. The free map comes first; the paid report is optional after you can judge the result.</p>
    <div class="cta-actions">
      <a href="${escapeHtml(withSource('/assessment', sourcePage, 'function_cta'))}" class="btn">Take the free assessment</a>
      <a href="${escapeHtml(withSource('/sample-report', sourcePage, 'function_sample'))}" class="secondary-btn">View sample report</a>
      <a href="${escapeHtml(withSource('/pricing', sourcePage, 'function_pricing'))}" class="text-link">See pricing</a>
    </div>
  </div>

  <h2>Explore Other Cognitive Functions</h2>
  <div class="related-grid">
    ${['ni','ne','si','se','ti','te','fi','fe'].filter(f => f !== fn).map(f => {
      const fSeo = functionSEO[f];
      return `<div class="related-card">
        <a href="/functions/${f}">${fSeo.name}</a>
      </div>`;
    }).join('\n    ')}
  </div>

  <footer>
    <p>&copy; 2026 TypeJung. A tool for self-exploration based on Jung's Psychological Types.</p>
    <p><a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a></p>
  </footer>
  ${landingAttributionScript}
</body>
</html>`;

  return html;
}

// Generate type page HTML
function generateTypePage(type: string) {
  const seo = typeSEO[type];
  const data = typeData[type];
  const path = `/types/${type}`;
  const sourcePage = { slug: `type-${type}` };
  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Learn Jungian typology', path: '/learn' },
    { name: `${data.code} Personality Type`, path },
  ]);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
${getHead(seo.title, seo.description, path)}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${data.code} - ${data.name}",
  "description": "${seo.description}",
  "url": "${siteConfig.url}${path}",
  "dateModified": "${buildDate}",
  "author": { "@type": "Organization", "name": "TypeJung", "url": "${siteConfig.url}", "sameAs": ${JSON.stringify(siteConfig.sameAs)} },
  "publisher": { "@type": "Organization", "name": "TypeJung", "url": "${siteConfig.url}", "sameAs": ${JSON.stringify(siteConfig.sameAs)}, "logo": { "@type": "ImageObject", "url": "${siteConfig.url}/logo.png" } },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "${siteConfig.url}${path}" }
}
</script>
<script type="application/ld+json">
${renderJsonLd(breadcrumbs)}
</script>
${standaloneAnalyticsSnippet}
</head>
<body>
  <nav>
    <a href="/">Home</a>
    <a href="/learn">Learn</a>
    <a href="${escapeHtml(withSource('/assessment', sourcePage, 'nav'))}">Take Assessment</a>
    <a href="${escapeHtml(withSource('/pricing', sourcePage, 'nav'))}">Pricing</a>
  </nav>

  <div class="breadcrumb">
    <a href="/">Home</a> › <a href="/learn">Learn</a> › ${data.code} Personality Type
  </div>

  <h1>${data.code} - ${data.name}</h1>
  <p class="subtitle">${data.nickname} | ${data.stack.join('-')} Function Stack</p>

  <p>${data.description}</p>

  <h2>Cognitive Function Stack</h2>
  <p>The ${data.code} type uses these cognitive functions in order of development:</p>
  <ol>
    ${data.stack.map((fn, i) => {
      const fnLower = fn.toLowerCase();
      const position = i === 0 ? 'Dominant' : i === 1 ? 'Auxiliary' : i === 2 ? 'Tertiary' : 'Inferior';
      return `<li><strong><a href="/functions/${fnLower}">${fn}</a></strong> - ${position} (${functionData[fnLower].archetype})</li>`;
    }).join('\n    ')}
  </ol>

  <h2>Key Strengths</h2>
  <ul>
    ${data.strengths.map(s => `<li>${s}</li>`).join('\n    ')}
  </ul>

  <h2>Growth Challenges</h2>
  <ul>
    ${data.challenges.map(c => `<li>${c}</li>`).join('\n    ')}
  </ul>

  <h2>${data.code} in Relationships</h2>
  <p>${data.inRelationships}</p>

  <h2>Under Stress (The Grip)</h2>
  <p>${data.underStress}</p>

  <h2>Individuation Notes</h2>
  <p>${data.growthPath}</p>

  <h2>Well-Known ${data.code}s</h2>
  <p>${data.famousExamples.join(', ')}</p>

  <div class="cta-box">
    <h3>Are You an ${data.code}?</h3>
    <p>Take the free Jungian cognitive function assessment to compare your result with the ${data.code} pattern. Unlike simplified four-letter tests, TypeJung maps all 8 functions before any paid report is offered.</p>
    <div class="cta-actions">
      <a href="${escapeHtml(withSource('/assessment', sourcePage, 'type_cta'))}" class="btn">Take the free assessment</a>
      <a href="${escapeHtml(withSource('/sample-report', sourcePage, 'type_sample'))}" class="secondary-btn">View sample report</a>
      <a href="${escapeHtml(withSource('/pricing', sourcePage, 'type_pricing'))}" class="text-link">See pricing</a>
    </div>
  </div>

  <h2>Related Personality Types</h2>
  <div class="related-grid">
    ${['intj','intp','entj','entp','infj','infp','enfj','enfp','istj','isfj','estj','esfj','istp','isfp','estp','esfp']
      .filter(t => t !== type)
      .slice(0, 7)
      .map(t => {
        const tData = typeData[t];
        return `<div class="related-card">
          <a href="/types/${t}">${tData.code}</a> - ${tData.name}
        </div>`;
      }).join('\n    ')}
  </div>

  <footer>
    <p>&copy; 2026 TypeJung. A tool for self-exploration based on Jung's Psychological Types.</p>
    <p><a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Service</a></p>
  </footer>
  ${landingAttributionScript}
</body>
</html>`;

  return html;
}

// Main execution
console.log('🚀 Generating static HTML pages for SEO...\n');

// Generate function pages
console.log('Generating function pages...');
for (const fn of ['ni', 'ne', 'si', 'se', 'ti', 'te', 'fi', 'fe']) {
  const html = generateFunctionPage(fn);
  const path = `${__dirname}/../public/functions/${fn}/index.html`;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
  console.log(`  ✅ /functions/${fn}/index.html`);
}

// Generate type pages
console.log('\nGenerating type pages...');
for (const type of ['intj','intp','entj','entp','infj','infp','enfj','enfp','istj','isfj','estj','esfj','istp','isfp','estp','esfp']) {
  const html = generateTypePage(type);
  const path = `${__dirname}/../public/types/${type}/index.html`;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
  console.log(`  ✅ /types/${type}/index.html`);
}

// Generate high-intent SEO landing pages
console.log('\nGenerating high-intent landing pages...');
for (const page of seoLandingPages) {
  const html = generateLandingPage(page);
  const path = `${__dirname}/../public/${page.slug}/index.html`;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, html);
  console.log(`  ✅ /${page.slug}/index.html`);
}

console.log(`\n✨ Generated ${24 + seoLandingPages.length} static HTML pages for SEO!`);
console.log('\nNext steps:');
console.log('  1. Run your build process');
console.log('  2. Deploy to Vercel');
console.log('  3. Submit updated sitemap to Google Search Console');
