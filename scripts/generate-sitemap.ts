#!/usr/bin/env node
/**
 * Automated Sitemap Generator for TypeJung
 * Generates sitemap.xml with all pages including static HTML files
 */

import { existsSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { seoLandingPages } from './seo-data.mjs';
import { growthBlogArticles } from './growth-blog-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://typejung.com';
const TODAY = new Date().toISOString().split('T')[0];

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// Define all site URLs
const entries: SitemapEntry[] = [
  // Main pages
  { loc: '/', lastmod: TODAY, changefreq: 'weekly', priority: 1.0 },
  { loc: '/assessment', lastmod: TODAY, changefreq: 'monthly', priority: 0.9 },
  { loc: '/learn', lastmod: TODAY, changefreq: 'monthly', priority: 0.8 },
  { loc: '/pricing', lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
  { loc: '/sample-report', lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
  { loc: '/methodology', lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
  { loc: '/debrief', lastmod: TODAY, changefreq: 'monthly', priority: 0.7 },
  { loc: '/leaderboard', lastmod: TODAY, changefreq: 'daily', priority: 0.6 },
  { loc: '/ai-run-store', lastmod: TODAY, changefreq: 'weekly', priority: 0.6 },
  { loc: '/about', lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },

  // Note: /content.txt and /llms.txt are intentionally excluded from the HTML sitemap.
  // They are plain-text files for AI/LLM consumption, not pages Google should index.

  // Blog pages
  { loc: '/blog/', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
  { loc: '/blog/singer-loomis-vs-mbti', lastmod: '2026-01-15', changefreq: 'monthly', priority: 0.7 },
  { loc: '/blog/understanding-the-grip', lastmod: '2026-01-10', changefreq: 'monthly', priority: 0.7 },
];

for (const article of growthBlogArticles) {
  entries.push({
    loc: `/blog/${article.slug}`,
    lastmod: article.date,
    changefreq: 'monthly',
    priority: 0.75
  });
}

// Add high-intent SEO landing pages.
// Strategy: keep the strongest, most differentiated hubs in the sitemap so crawl
// budget concentrates on pages that can rank and convert. Near-identical
// "X vs Y test" comparison pages that look like duplicates to Google are
// excluded from the sitemap (the pages still exist and stay internally linked,
// just not sitemap-promoted).
const sitemapExcludedLanding = new Set([
  // Redundant low-traffic comparison "hub" pages (breadcrumb targets, not ranking)
  'guides',
  'creator-preview',
]);

for (const page of seoLandingPages) {
  const slug = page.slug;
  // Skip generic X-vs-Y type-comparison test pages (near-duplicate clusters)
  if (/^[a-z]+-vs-[a-z]+-test$/.test(slug)) continue;
  if (sitemapExcludedLanding.has(slug)) continue;
  entries.push({
    loc: `/${slug}`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: 0.85
  });
}

// Add function pages
const functions = ['ni', 'ne', 'si', 'se', 'ti', 'te', 'fi', 'fe'];
for (const fn of functions) {
  entries.push({
    loc: `/functions/${fn}`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: 0.8
  });
}

// Add type pages
const types = [
  'intj', 'intp', 'entj', 'entp',
  'infj', 'infp', 'enfj', 'enfp',
  'istj', 'isfj', 'estj', 'esfj',
  'istp', 'isfp', 'estp', 'esfp'
];
for (const type of types) {
  entries.push({
    loc: `/types/${type}`,
    lastmod: TODAY,
    changefreq: 'monthly',
    priority: 0.8
  });
}

// Generate sitemap XML
function generateSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map(entry => `  <url>
    <loc>${BASE_URL}${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<!--
  TypeJung Sitemap
  Generated: ${new Date().toISOString()}
  Total URLs: ${entries.length}
-->
${urls}
</urlset>`;
}

// Generate and save sitemap
const sitemap = generateSitemap(entries);
const outputPath = `${__dirname}/../public/sitemap.xml`;
writeFileSync(outputPath, sitemap);

const distOutputPath = join(__dirname, '..', 'dist', 'public', 'sitemap.xml');
if (existsSync(dirname(distOutputPath))) {
  writeFileSync(distOutputPath, sitemap);
}

console.log('✅ Sitemap generated successfully!');
console.log(`📄 Location: ${outputPath}`);
console.log(`🔗 Total URLs: ${entries.length}`);
console.log('\nBreakdown:');
console.log(`  • Main pages: 10`);
console.log(`  • Blog articles: ${growthBlogArticles.length + 2}`);
console.log(`  • High-intent landing pages: ${seoLandingPages.length}`);
console.log(`  • Function pages: ${functions.length}`);
console.log(`  • Type pages: ${types.length}`);
console.log('\nNext steps:');
console.log('  1. Submit sitemap to Google Search Console');
console.log('  2. Submit sitemap to Bing Webmaster Tools');
console.log('  3. Run this script after adding new content');
