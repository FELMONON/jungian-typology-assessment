import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';
import { growthBlogArticles } from '../../scripts/growth-blog-data.mjs';
import { seoLandingPages } from '../../scripts/seo-data.mjs';
import { standaloneAnalyticsSnippet, withStandaloneAnalytics } from '../../scripts/standalone-analytics.mjs';

type AnalyticsWindow = Window & { vaq?: IArguments[] };

const runSnippet = (url: string, signals: { dnt?: string; gpc?: boolean } = {}): AnalyticsWindow => {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url, runScripts: 'outside-only' });
  const { window } = dom;

  if (signals.dnt !== undefined) {
    Object.defineProperty(window.navigator, 'doNotTrack', {
      configurable: true,
      value: signals.dnt,
    });
  }
  if (signals.gpc !== undefined) {
    Object.defineProperty(window.navigator, 'globalPrivacyControl', {
      configurable: true,
      value: signals.gpc,
    });
  }

  const code = standaloneAnalyticsSnippet.match(/^<script[^>]*>([\s\S]*)<\/script>$/)?.[1];
  if (!code) throw new Error('Expected one executable analytics script.');
  window.eval(code);
  window.eval(code); // Re-execution must not install a second tracker.
  return window as unknown as AnalyticsWindow;
};

describe('standalone generated-page analytics', () => {
  it('loads only on the production hosts and queues a path-only beforeSend hook', () => {
    const window = runSnippet('https://typejung.com/jungian-test?email=person@example.com#private');
    const injected = window.document.querySelectorAll('script[data-typejung-standalone-analytics="true"]');

    expect(injected).toHaveLength(1);
    expect(window.vaq).toHaveLength(1);
    const beforeSend = window.vaq[0][1] as (event: { url: string; [key: string]: unknown }) => { url: string };
    expect(beforeSend({ url: 'https://typejung.com/jungian-test?email=person@example.com#private' }).url)
      .toBe('https://typejung.com/jungian-test');
  });

  it('does not load for local previews or when DNT or global privacy control is enabled', () => {
    const local = runSnippet('http://localhost:4173/jungian-test');
    const dnt = runSnippet('https://www.typejung.com/jungian-test', { dnt: '1' });
    const gpc = runSnippet('https://typejung.com/jungian-test', { gpc: true });

    for (const window of [local, dnt, gpc]) {
      expect(window.document.querySelector('script[data-typejung-standalone-analytics="true"]')).toBeNull();
      expect(window.vaq).toBeUndefined();
    }
  });

  it('keeps generated assessment duration copy consistent at 20-25 minutes', () => {
    const landingData = JSON.stringify(seoLandingPages);
    const prerenderSource = readFileSync(join(process.cwd(), 'scripts/prerender.mjs'), 'utf8');

    expect(landingData).toContain('20 to 25 minutes');
    expect(landingData).not.toContain('12 to 16 minutes');
    expect(prerenderSource).toContain('20-25 minutes');
    expect(prerenderSource).not.toContain('12-16 minutes');
  });

  it('refreshes legacy-page instrumentation without duplicate scripts or editorial changes', () => {
    const original = '<html><head><title>Original article</title></head><body>Original text</body></html>';
    const once = withStandaloneAnalytics(original);
    expect(withStandaloneAnalytics(once)).toBe(once);
    expect(once).toContain('<title>Original article</title>');
    expect(once).toContain('<body>Original text</body>');
  });

  it('injects the snippet exactly once in every generated standalone template', () => {
    const generatedPages = [
      'public/functions/ni/index.html',
      'public/types/intj/index.html',
      `public/${seoLandingPages[0].slug}/index.html`,
      'public/blog/index.html',
      'public/blog/singer-loomis-vs-mbti.html',
      'public/blog/understanding-the-grip.html',
      `public/blog/${growthBlogArticles[0].slug}.html`,
    ];

    for (const page of generatedPages) {
      const html = readFileSync(join(process.cwd(), page), 'utf8');
      expect((html.match(/<script data-typejung-standalone-analytics>/g) || []).length, page).toBe(1);
      expect(html).toContain('/_vercel/insights/script.js');
      expect(html).not.toContain('@vercel/analytics');
    }

    const spaShell = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    expect(spaShell).not.toContain('data-typejung-standalone-analytics');
  });
});
