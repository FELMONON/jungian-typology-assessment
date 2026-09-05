/**
 * Vercel Web Analytics for generated standalone HTML only.
 *
 * The SPA already mounts @vercel/analytics, so generators should include this
 * snippet only in their standalone SEO and blog templates.
 */
export const standaloneAnalyticsSnippet = `<script data-typejung-standalone-analytics>
  (() => {
    const productionHosts = new Set(['typejung.com', 'www.typejung.com']);
    const privacySignal = ['1', 'yes'].includes(navigator.doNotTrack)
      || ['1', 'yes'].includes(window.doNotTrack)
      || navigator.globalPrivacyControl === true
      || window.globalPrivacyControl === true;

    if (!productionHosts.has(window.location.hostname) || privacySignal) return;
    if (document.querySelector('script[data-typejung-standalone-analytics="true"]')) return;

    window.va = window.va || function () {
      (window.vaq = window.vaq || []).push(arguments);
    };

    // Preserve aggregate page paths while excluding query and hash identifiers.
    window.va('beforeSend', (event) => ({ ...event, url: window.location.origin + window.location.pathname }));

    const analyticsScript = document.createElement('script');
    analyticsScript.defer = true;
    analyticsScript.src = '/_vercel/insights/script.js';
    analyticsScript.dataset.typejungStandaloneAnalytics = 'true';
    document.head.appendChild(analyticsScript);
  })();
</script>`;

/** Refresh the snippet in legacy standalone pages without rewriting their content. */
export function withStandaloneAnalytics(html) {
  if (!html.includes('</head>')) throw new Error('Standalone HTML requires a closing head tag.');
  const withoutPreviousSnippet = html.replace(/<script data-typejung-standalone-analytics>[\s\S]*?<\/script>\n?/g, '');
  return withoutPreviousSnippet.replace('</head>', `${standaloneAnalyticsSnippet}\n</head>`);
}
