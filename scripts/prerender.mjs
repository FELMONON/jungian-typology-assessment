import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { functionData, typeData, pageData } from './seo-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist', 'public');

// All routes to prerender
const routes = [
  '/',
  '/assessment',
  '/results',
  '/learn',
  '/pricing',
  '/privacy',
  '/terms',
  '/functions/ni',
  '/functions/ne',
  '/functions/si',
  '/functions/se',
  '/functions/ti',
  '/functions/te',
  '/functions/fi',
  '/functions/fe',
  '/types/intj',
  '/types/intp',
  '/types/entj',
  '/types/entp',
  '/types/infj',
  '/types/infp',
  '/types/enfj',
  '/types/enfp',
  '/types/istj',
  '/types/isfj',
  '/types/estj',
  '/types/esfj',
  '/types/istp',
  '/types/isfp',
  '/types/estp',
  '/types/esfp',
];

function createStaticServer(dir, port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };

  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let filePath = join(dir, req.url === '/' ? 'index.html' : req.url);
      if (!existsSync(filePath) || !req.url.includes('.')) {
        filePath = join(dir, 'index.html');
      }
      try {
        const content = readFileSync(filePath);
        const ext = filePath.substring(filePath.lastIndexOf('.'));
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
        res.end(content);
      } catch (err) {
        res.writeHead(404);
        res.end('Not found');
      }
    });
    server.listen(port, () => {
      console.log(`Static server running on http://localhost:${port}`);
      resolve(server);
    });
  });
}

// Generate comprehensive noscript for homepage
function generateHomepageNoscript() {
  return `<noscript>
  <div style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: Georgia, serif; line-height: 1.8; color: #333;">
    <header style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #b45309; padding-bottom: 30px;">
      <h1 style="font-size: 2.5em; color: #451a03;">TypeJung - Free Jungian Function-Stack Map</h1>
      <p style="font-size: 1.3em; color: #57534e;">When your MBTI result keeps changing, map the pattern underneath.</p>
      <p><a href="/assessment" style="display: inline-block; padding: 15px 30px; background: #451a03; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Take the Free Assessment</a></p>
    </header>

    <section style="margin-bottom: 40px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 10px;">Why TypeJung is Different</h2>
      <p>Unlike simplified 4-letter type indicators, TypeJung combines behavioral scenarios, inferior-function stress signals, somatic indicators, and attitude questions to build a function-stack map you can inspect.</p>
      <ul>
        <li>No forced binary choices between only two traits</li>
        <li>No credit card required for the free map</li>
        <li>See the function pattern beneath your type label</li>
        <li>Upgrade only after the result feels useful</li>
      </ul>
    </section>

    <section style="margin-bottom: 40px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 10px;">The 8 Cognitive Functions</h2>
      <h3>Perceiving Functions</h3>
      ${Object.entries(functionData).filter(([k]) => ['ni', 'ne', 'si', 'se'].includes(k)).map(([key, fn]) => `
      <article style="margin-bottom: 15px; padding: 12px; background: #fbfaf8; border-left: 4px solid #b45309;">
        <h4 style="margin: 0;"><a href="/functions/${key}" style="color: #451a03;">${fn.code} - ${fn.name}</a> (${fn.nickname})</h4>
        <p style="margin: 8px 0 0 0;">${fn.description} <strong>Dominant in:</strong> ${fn.dominantTypes.join(', ')}</p>
      </article>`).join('')}

      <h3>Judging Functions</h3>
      ${Object.entries(functionData).filter(([k]) => ['ti', 'te', 'fi', 'fe'].includes(k)).map(([key, fn]) => `
      <article style="margin-bottom: 15px; padding: 12px; background: #fbfaf8; border-left: 4px solid #451a03;">
        <h4 style="margin: 0;"><a href="/functions/${key}" style="color: #451a03;">${fn.code} - ${fn.name}</a> (${fn.nickname})</h4>
        <p style="margin: 8px 0 0 0;">${fn.description} <strong>Dominant in:</strong> ${fn.dominantTypes.join(', ')}</p>
      </article>`).join('')}
    </section>

    <section style="margin-bottom: 40px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 10px;">The 16 Personality Types</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
        ${Object.entries(typeData).map(([key, type]) => `
        <a href="/types/${key}" style="display: block; padding: 12px; background: #f5f5f4; text-decoration: none; color: #333; border-radius: 5px;"><strong>${type.code}</strong> - ${type.name}<br><small>${type.stack}</small></a>`).join('')}
      </div>
    </section>

    <section style="margin-bottom: 40px; padding: 25px; background: #fef3c7; border-radius: 10px;">
      <h2 style="color: #451a03; margin-top: 0;">Pricing Plans</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 15px;">
        <div style="padding: 15px; border: 2px solid #e7e5e4; border-radius: 8px; background: white;">
          <h3 style="margin-top: 0;">Free</h3>
          <p style="font-size: 2em; font-weight: bold; color: #451a03; margin: 8px 0;">CA$0</p>
          <ul style="padding-left: 18px; margin: 0;"><li>42-question assessment</li><li>Function-stack map</li><li>Dominant-inferior axis</li></ul>
        </div>
        <div style="padding: 15px; border: 2px solid #b45309; border-radius: 8px; background: #fffbeb;">
          <h3 style="margin-top: 0;">Insight</h3>
          <p style="font-size: 2em; font-weight: bold; color: #451a03; margin: 8px 0;">CA$7 today</p>
          <p style="color: #57534e; margin: 0 0 8px;">CA$10 regular price. TYPEJUNG30 before Stripe.</p>
          <ul style="padding-left: 18px; margin: 0;"><li>Developmental edge report</li><li>Stress-pattern map</li><li>Practice prompts</li></ul>
        </div>
        <div style="padding: 15px; border: 2px solid #451a03; border-radius: 8px; background: #fef3c7;">
          <h3 style="margin-top: 0;">Mastery</h3>
          <p style="font-size: 2em; font-weight: bold; color: #451a03; margin: 8px 0;">CA$20.30 today</p>
          <p style="color: #57534e; margin: 0 0 8px;">CA$29 regular price. TYPEJUNG30 before Stripe.</p>
          <ul style="padding-left: 18px; margin: 0;"><li>AI Type Guide</li><li>Practice roadmap</li><li>Account-based guide access</li></ul>
        </div>
      </div>
      <p style="text-align: center; margin-top: 15px;"><a href="/pricing">View full pricing details</a></p>
    </section>

    <nav style="margin-bottom: 40px; padding: 20px; background: #f5f5f4; border-radius: 10px;">
      <h2 style="margin-top: 0; color: #451a03;">Site Navigation</h2>
      <ul style="columns: 2; column-gap: 30px;">
        <li><a href="/">Home</a></li>
        <li><a href="/assessment">Take Assessment</a></li>
        <li><a href="/learn">Learn Theory</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
      </ul>
    </nav>

    <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #e7e5e4; color: #57534e;">
      <p><strong>Note:</strong> This application requires JavaScript for the full interactive experience.</p>
      <p>&copy; 2026 TypeJung. Based on Carl Jung's Psychological Types.</p>
    </footer>
  </div>
</noscript>`;
}

// Generate noscript for function pages
function generateFunctionNoscript(functionKey) {
  const fn = functionData[functionKey];
  if (!fn) return generateGenericNoscript(`/functions/${functionKey}`, {});

  return `<noscript>
  <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: Georgia, serif; line-height: 1.8; color: #333;">
    <nav style="margin-bottom: 20px;"><a href="/">Home</a> &gt; <a href="/learn">Learn</a> &gt; ${fn.code}</nav>

    <h1 style="color: #451a03; font-size: 2.2em; margin-bottom: 10px;">${fn.code} - ${fn.name}</h1>
    <p style="font-size: 1.4em; color: #b45309; margin-bottom: 25px;">${fn.nickname}</p>

    <p style="font-size: 1.15em; color: #57534e; margin-bottom: 30px;">${fn.description}</p>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Key Characteristics</h2>
      <ul>
        ${fn.characteristics.map(c => `<li>${c}</li>`).join('\n        ')}
      </ul>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Strengths</h2>
      <ul>
        ${fn.strengths.map(s => `<li>${s}</li>`).join('\n        ')}
      </ul>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Potential Challenges</h2>
      <ul>
        ${fn.challenges.map(c => `<li>${c}</li>`).join('\n        ')}
      </ul>
    </section>

    <section style="margin-bottom: 35px; padding: 20px; background: #fef3c7; border-radius: 8px;">
      <h2 style="color: #451a03; margin-top: 0;">Types with ${fn.code}</h2>
      <p><strong>Dominant:</strong> ${fn.dominantTypes.join(', ')}</p>
      <p><strong>Auxiliary:</strong> ${fn.auxiliaryTypes.join(', ')}</p>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Related Keywords</h2>
      <p>${fn.keywords.join(' | ')}</p>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">All 8 Cognitive Functions</h2>
      <ul style="columns: 2;">
        ${Object.entries(functionData).map(([key, f]) => `<li><a href="/functions/${key}">${f.code} - ${f.name}</a></li>`).join('\n        ')}
      </ul>
    </section>

    <nav style="margin-top: 40px; padding: 20px; background: #f5f5f4; border-radius: 8px;">
      <p><strong>Navigation:</strong></p>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/assessment">Take Assessment</a></li>
        <li><a href="/learn">Learn Theory</a></li>
        <li><a href="/pricing">Pricing</a></li>
      </ul>
    </nav>

    <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4; color: #57534e;">
      <p>&copy; 2026 TypeJung. Based on Carl Jung's Psychological Types.</p>
    </footer>
  </div>
</noscript>`;
}

// Generate noscript for type pages
function generateTypeNoscript(typeKey) {
  const type = typeData[typeKey];
  if (!type) return generateGenericNoscript(`/types/${typeKey}`, {});

  return `<noscript>
  <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: Georgia, serif; line-height: 1.8; color: #333;">
    <nav style="margin-bottom: 20px;"><a href="/">Home</a> &gt; <a href="/learn">Learn</a> &gt; ${type.code}</nav>

    <h1 style="color: #451a03; font-size: 2.2em; margin-bottom: 10px;">${type.code} - ${type.name}</h1>
    <p style="font-size: 1.2em; color: #b45309; margin-bottom: 10px;">Cognitive Stack: ${type.stack}</p>

    <p style="font-size: 1.15em; color: #57534e; margin-bottom: 30px;">${type.description}</p>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Cognitive Function Stack</h2>
      <ol>
        ${type.cognitiveStack.map(fn => `<li><strong>${fn.position} (${fn.function}):</strong> ${fn.description}</li>`).join('\n        ')}
      </ol>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Key Strengths</h2>
      <ul>
        ${type.strengths.map(s => `<li>${s}</li>`).join('\n        ')}
      </ul>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Potential Challenges</h2>
      <ul>
        ${type.challenges.map(c => `<li>${c}</li>`).join('\n        ')}
      </ul>
    </section>

    <section style="margin-bottom: 35px; padding: 20px; background: #fef3c7; border-radius: 8px;">
      <h2 style="color: #451a03; margin-top: 0;">Career Paths</h2>
      <p>${type.careers.join(' | ')}</p>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Famous ${type.code}s</h2>
      <p>${type.famousExamples.join(', ')}</p>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Keywords</h2>
      <p>${type.keywords.join(' | ')}</p>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">All 16 Types</h2>
      <ul style="columns: 2;">
        ${Object.entries(typeData).map(([key, t]) => `<li><a href="/types/${key}">${t.code} - ${t.name}</a></li>`).join('\n        ')}
      </ul>
    </section>

    <nav style="margin-top: 40px; padding: 20px; background: #f5f5f4; border-radius: 8px;">
      <p><strong>Navigation:</strong></p>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/assessment">Take Assessment</a></li>
        <li><a href="/learn">Learn Theory</a></li>
        <li><a href="/pricing">Pricing</a></li>
      </ul>
    </nav>

    <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4; color: #57534e;">
      <p>&copy; 2026 TypeJung. Based on Carl Jung's Psychological Types.</p>
    </footer>
  </div>
</noscript>`;
}

// Generate noscript for assessment page
function generateAssessmentNoscript() {
  return `<noscript>
  <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: Georgia, serif; line-height: 1.8; color: #333;">
    <h1 style="color: #451a03; font-size: 2.2em; margin-bottom: 20px;">Jungian Cognitive Function Assessment</h1>

    <p style="font-size: 1.15em; color: #57534e; margin-bottom: 30px;">Take our free 42-question assessment to map your self-reported cognitive-function profile across all 8 functions.</p>

    <section style="margin-bottom: 35px; padding: 25px; background: #fef3c7; border-radius: 10px;">
      <h2 style="color: #451a03; margin-top: 0;">What You'll Learn</h2>
      <ul>
        <li>Your scores for all 8 cognitive functions (Ni, Ne, Si, Se, Ti, Te, Fi, Fe)</li>
        <li>Your dominant and auxiliary functions</li>
        <li>Your best-fit personality type based on your function profile</li>
        <li>A readable synthesis of your cognitive patterns</li>
        <li>A function-stack map of your strengths and stress edge</li>
      </ul>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">How It Works</h2>
      <ol>
        <li><strong>Answer 42 questions</strong> - Rate how much each statement describes you (20-25 minutes)</li>
        <li><strong>Get your results</strong> - See your cognitive function scores in a function-stack map</li>
        <li><strong>Explore insights</strong> - Read the synthesis of your dominant-inferior pattern</li>
        <li><strong>Share your results</strong> - Get a unique link to share with others</li>
      </ol>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Tips for Accurate Results</h2>
      <ul>
        <li>Answer based on how you naturally are, not how you wish to be</li>
        <li>Don't overthink - go with your first instinct</li>
        <li>Consider your behavior across different contexts</li>
        <li>There are no right or wrong answers</li>
      </ul>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">The 8 Cognitive Functions</h2>
      <ul style="columns: 2;">
        ${Object.entries(functionData).map(([key, fn]) => `<li><a href="/functions/${key}">${fn.code} - ${fn.name}</a></li>`).join('\n        ')}
      </ul>
    </section>

    <p style="text-align: center; padding: 20px;"><strong>Note:</strong> JavaScript is required to take the interactive assessment.</p>

    <nav style="margin-top: 40px; padding: 20px; background: #f5f5f4; border-radius: 8px;">
      <p><strong>Navigation:</strong></p>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/learn">Learn Theory</a></li>
        <li><a href="/pricing">Pricing</a></li>
      </ul>
    </nav>

    <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4; color: #57534e;">
      <p>&copy; 2026 TypeJung. Based on Carl Jung's Psychological Types.</p>
    </footer>
  </div>
</noscript>`;
}

// Generate noscript for pricing page
function generatePricingNoscript() {
  return `<noscript>
  <div style="max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: Georgia, serif; line-height: 1.8; color: #333;">
    <h1 style="color: #451a03; font-size: 2.2em; margin-bottom: 20px; text-align: center;">TypeJung Pricing Plans</h1>

    <p style="font-size: 1.15em; color: #57534e; margin-bottom: 30px; text-align: center;">Take the free assessment first. Upgrade only after the map feels useful.</p>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 40px;">
      <div style="padding: 25px; border: 2px solid #e7e5e4; border-radius: 10px; background: white;">
        <h2 style="margin-top: 0; color: #451a03;">Free</h2>
        <p style="font-size: 2.5em; font-weight: bold; color: #451a03; margin: 15px 0;">CA$0</p>
        <p style="color: #57534e;">No card required</p>
        <ul style="padding-left: 20px;">
          <li>42-question assessment</li>
          <li>Function-stack map</li>
          <li>Dominant-inferior axis</li>
          <li>Shareable results link</li>
          <li>Your best-fit type</li>
        </ul>
        <p><a href="/assessment" style="display: block; text-align: center; padding: 12px; background: #451a03; color: white; text-decoration: none; border-radius: 5px;">Start Free Assessment</a></p>
      </div>

      <div style="padding: 25px; border: 3px solid #b45309; border-radius: 10px; background: #fffbeb;">
        <h2 style="margin-top: 0; color: #451a03;">Insight</h2>
        <p style="font-size: 2.5em; font-weight: bold; color: #451a03; margin: 15px 0;">CA$7</p>
        <p style="color: #57534e;">One-time payment with TYPEJUNG30. CA$10 before code.</p>
        <ul style="padding-left: 20px;">
          <li>Everything in Free, plus:</li>
          <li>Developmental edge report</li>
          <li>Stress pattern map</li>
          <li>Relationship-pattern reflection</li>
          <li>Practical reflection prompts</li>
          <li>Lifetime unlocked result access</li>
        </ul>
        <p><a href="/assessment" style="display: block; text-align: center; padding: 12px; background: #b45309; color: white; text-decoration: none; border-radius: 5px;">Start free first</a></p>
      </div>

      <div style="padding: 25px; border: 3px solid #451a03; border-radius: 10px; background: #fef3c7;">
        <h2 style="margin-top: 0; color: #451a03;">Mastery</h2>
        <p style="font-size: 2.5em; font-weight: bold; color: #451a03; margin: 15px 0;">CA$20.30</p>
        <p style="color: #57534e;">One-time payment with TYPEJUNG30. CA$29 before code.</p>
        <ul style="padding-left: 20px;">
          <li>Everything in Insight, plus:</li>
          <li>AI Type Guide chat</li>
          <li>Individuation roadmap</li>
          <li>Growth exercises tailored to your cognitive stack</li>
          <li>Practice support</li>
          <li>Account-based guide access after sign-in</li>
        </ul>
        <p><a href="/assessment" style="display: block; text-align: center; padding: 12px; background: #451a03; color: white; text-decoration: none; border-radius: 5px;">Start free first</a></p>
      </div>
    </div>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">Frequently Asked Questions</h2>

      <h3>Is the assessment really free?</h3>
      <p>Yes. The core 42-question assessment, function-stack map, and dominant-inferior axis are free. No credit card required.</p>

      <h3>What's the difference between plans?</h3>
      <p>Free gives you your function scores and function-stack map. Insight is currently CA$7 with TYPEJUNG30 and adds the deeper report, stress-pattern reflection, and practices. Mastery is currently CA$20.30 with the same code and adds the AI Type Guide and ongoing practice support.</p>

      <h3>Is it a subscription?</h3>
      <p>No. Insight and Mastery are one-time payments. Sign in with the purchase email to restore paid access across devices.</p>
    </section>

    <nav style="margin-top: 40px; padding: 20px; background: #f5f5f4; border-radius: 8px;">
      <p><strong>Navigation:</strong></p>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/assessment">Take Assessment</a></li>
        <li><a href="/learn">Learn Theory</a></li>
      </ul>
    </nav>

    <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4; color: #57534e;">
      <p>&copy; 2026 TypeJung. Based on Carl Jung's Psychological Types.</p>
    </footer>
  </div>
</noscript>`;
}

// Generate noscript for learn/theory page
function generateLearnNoscript() {
  return `<noscript>
  <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: Georgia, serif; line-height: 1.8; color: #333;">
    <h1 style="color: #451a03; font-size: 2.2em; margin-bottom: 20px;">Learn Jungian Typology</h1>

    <p style="font-size: 1.15em; color: #57534e; margin-bottom: 30px;">Understand Carl Jung's theory of psychological types and how the 8 cognitive functions shape personality.</p>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">The History</h2>
      <p>In 1921, Swiss psychiatrist Carl Gustav Jung published "Psychological Types," introducing the concept of cognitive functions. Unlike later simplified interpretations, Jung saw type as a dynamic system where all functions exist but develop at different rates.</p>
      <p>TypeJung keeps the function-first spirit of Jungian typology while adding behavioral, stress, somatic, and attitude evidence so the result can be read as a practical self-reflection map.</p>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">The 8 Cognitive Functions</h2>

      <h3>Perceiving Functions (How You Take In Information)</h3>
      <ul>
        ${Object.entries(functionData).filter(([k]) => ['ni', 'ne', 'si', 'se'].includes(k)).map(([key, fn]) =>
          `<li><a href="/functions/${key}"><strong>${fn.code} - ${fn.name}</strong></a>: ${fn.description}</li>`).join('\n        ')}
      </ul>

      <h3>Judging Functions (How You Make Decisions)</h3>
      <ul>
        ${Object.entries(functionData).filter(([k]) => ['ti', 'te', 'fi', 'fe'].includes(k)).map(([key, fn]) =>
          `<li><a href="/functions/${key}"><strong>${fn.code} - ${fn.name}</strong></a>: ${fn.description}</li>`).join('\n        ')}
      </ul>
    </section>

    <section style="margin-bottom: 35px;">
      <h2 style="color: #451a03; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px;">The 16 Types</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px;">
        ${Object.entries(typeData).map(([key, type]) =>
          `<a href="/types/${key}" style="display: block; padding: 10px; background: #f5f5f4; text-decoration: none; color: #333; border-radius: 5px;"><strong>${type.code}</strong> - ${type.name}</a>`).join('\n        ')}
      </div>
    </section>

    <section style="margin-bottom: 35px; padding: 25px; background: #fef3c7; border-radius: 10px;">
      <h2 style="color: #451a03; margin-top: 0;">Ready to Discover Your Type?</h2>
      <p>Take our free assessment to see your cognitive function profile.</p>
      <p><a href="/assessment" style="display: inline-block; padding: 12px 25px; background: #451a03; color: white; text-decoration: none; border-radius: 5px;">Take Free Assessment</a></p>
    </section>

    <nav style="margin-top: 40px; padding: 20px; background: #f5f5f4; border-radius: 8px;">
      <p><strong>Navigation:</strong></p>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/assessment">Take Assessment</a></li>
        <li><a href="/pricing">Pricing</a></li>
      </ul>
    </nav>

    <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4; color: #57534e;">
      <p>&copy; 2026 TypeJung. Based on Carl Jung's Psychological Types.</p>
    </footer>
  </div>
</noscript>`;
}

// Generate generic noscript for other pages (privacy, terms, results)
function generateGenericNoscript(route, pageData) {
  const info = pageData[route] || { title: 'TypeJung', description: '' };
  const title = pageData.title || info.title || 'TypeJung';
  const description = pageData.description || info.description || '';

  return `<noscript>
  <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; font-family: Georgia, serif; line-height: 1.8; color: #333;">
    <h1 style="color: #451a03; font-size: 2em; margin-bottom: 20px;">${title.replace(' | TypeJung', '')}</h1>
    <p style="font-size: 1.1em; color: #57534e; margin-bottom: 30px;">${description}</p>

    <p>This page requires JavaScript for full functionality.</p>

    <nav style="margin-top: 40px; padding: 20px; background: #f5f5f4; border-radius: 8px;">
      <p><strong>Navigation:</strong></p>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/assessment">Take Assessment</a></li>
        <li><a href="/learn">Learn Theory</a></li>
        <li><a href="/pricing">Pricing</a></li>
      </ul>
    </nav>

    <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4; color: #57534e;">
      <p>&copy; 2026 TypeJung. Based on Carl Jung's Psychological Types.</p>
    </footer>
  </div>
</noscript>`;
}

// Get the appropriate noscript generator for a route
function getNoscriptForRoute(route, extractedData) {
  if (route === '/') return generateHomepageNoscript();
  if (route === '/assessment') return generateAssessmentNoscript();
  if (route === '/pricing') return generatePricingNoscript();
  if (route === '/learn') return generateLearnNoscript();

  if (route.startsWith('/functions/')) {
    const functionKey = route.split('/')[2];
    return generateFunctionNoscript(functionKey);
  }

  if (route.startsWith('/types/')) {
    const typeKey = route.split('/')[2];
    return generateTypeNoscript(typeKey);
  }

  return generateGenericNoscript(route, extractedData);
}

async function prerender() {
  console.log('Starting prerender...');

  const port = 3456;
  const server = await createStaticServer(distDir, port);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const route of routes) {
      console.log(`Prerendering: ${route}`);

      const page = await browser.newPage();

      await page.goto(`http://localhost:${port}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      await page.waitForSelector('#root > *', { timeout: 10000 });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Debug: log the current URL and title
      const currentUrl = await page.url();
      const currentTitle = await page.title();
      console.log(`  URL: ${currentUrl}, Title: ${currentTitle}`);

      // Extract page content for metadata
      const extractedData = await page.evaluate(() => {
        const title = document.title || 'TypeJung';
        const metaDesc = document.querySelector('meta[name="description"]');
        const description = metaDesc ? metaDesc.getAttribute('content') : '';
        return { title, description };
      });

      // Get the rendered HTML
      let html = await page.content();

      console.log(`  extractedData.title: ${extractedData.title}`);

      // Generate page-specific noscript using our comprehensive templates
      const newNoscript = getNoscriptForRoute(route, extractedData);

      // Escape dollar signs in replacement string ($ is special in regex replacement)
      const escapedNoscript = newNoscript.replace(/\$/g, '$$$$');

      // Remove the old noscript block - match various patterns
      html = html.replace(
        /<!-- (Comprehensive|Page-specific) Noscript (Fallback )?for SEO -->\s*<noscript>[\s\S]*?<div style="max-width: (800|900)px;[\s\S]*?<\/noscript>/g,
        `<!-- Page-specific Noscript for SEO -->\n${escapedNoscript}`
      );

      // Determine output path
      let outputPath;
      if (route === '/') {
        outputPath = join(distDir, 'index.html');
      } else {
        const routeDir = join(distDir, route);
        if (!existsSync(routeDir)) {
          mkdirSync(routeDir, { recursive: true });
        }
        outputPath = join(routeDir, 'index.html');
      }

      writeFileSync(outputPath, html);
      console.log(`  -> Saved: ${outputPath}`);

      await page.close();
    }

    console.log('\nPrerendering complete!');
  } finally {
    await browser.close();
    server.close();
  }
}

prerender().catch(console.error);
