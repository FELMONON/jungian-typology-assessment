// Read-only business reporting. No customer identities or credentials are
// written to the report. Run from the repository root with --output <path>.
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

config({ path: '.env.local', quiet: true });
const now = new Date();
const since = new Date(now.getTime() - 90 * 864e5).toISOString();
const errors = {};
const db = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } }) : null;
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { timeout: 30000, maxNetworkRetries: 1 }) : null;
const round = n => Math.round(n * 100) / 100;
const ratio = (n, d) => d ? round(n / d * 100) : null;
const counts = (rows, key) => Object.fromEntries([...rows.reduce((m, row) => {
  const value = key(row) || 'unknown'; m.set(value, (m.get(value) || 0) + 1); return m;
}, new Map())].sort((a, b) => b[1] - a[1]));

async function readRows(table, select, timeColumn = 'created_at') {
  if (!db) throw new Error('missing_configuration');
  const rows = [];
  for (let offset = 0; offset < 50000; offset += 1000) {
    const { data, error } = await db.from(table).select(select).gte(timeColumn, since)
      .lte(timeColumn, now.toISOString()).order(timeColumn).order('id').range(offset, offset + 999);
    if (error) throw new Error(error.code || 'database_read_failed');
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
  throw new Error('row_limit_reached');
}

async function readSales() {
  if (!stripe) throw new Error('missing_configuration');
  const sales = [];
  let scanned = 0;
  for await (const charge of stripe.charges.list({ created: { gte: Math.floor(Date.parse(since) / 1000), lte: Math.floor(now.getTime() / 1000) }, limit: 100 })) {
    if (++scanned > 50000) throw new Error('row_limit_reached');
    if (!charge.livemode || !charge.paid || !charge.captured || charge.amount <= 0) continue;
    if (!['typejung_premium', 'typejung_debrief'].includes(charge.metadata?.product)) continue;
    sales.push({
      date: new Date(charge.created * 1000).toISOString(),
      amount: charge.amount, refunded: charge.amount_refunded, currency: charge.currency,
      tier: charge.metadata.tier || charge.metadata.product,
      // Used only in memory to join against the purchase ledger.
      paymentIntentId: typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id,
    });
  }
  return sales;
}

const readers = {
  sales: readSales,
  purchases: () => readRows('purchases', 'id,status,amount,tier,payment_intent_id,source,acquisition_source,utm_source,created_at'),
  events: () => readRows('funnel_events', 'id,event_name,anonymous_id,source,occurred_at', 'occurred_at'),
  intents: () => readRows('checkout_intents', 'id,status,tier,has_customer_email,recovery_email_consent,created_at'),
  debriefs: () => readRows('debrief_requests', 'id,status,paid_at,delivered_at,created_at'),
};
const data = {};
await Promise.all(Object.entries(readers).map(async ([name, read]) => {
  try { data[name] = await read(); }
  catch (error) { errors[name] = error.type || (/^[a-z0-9_]+$/i.test(error.message) ? error.message : 'read_failed'); }
}));

const report = {
  generatedAt: now.toISOString(),
  target: { monthlyRevenueCad: 3000, realizedInsightPriceCad: 7, insightOrdersNeeded: 429, basis: 'One-time sales, not subscription MRR or profit.' },
  methodology: [
    'Revenue uses captured live Stripe charges tagged typejung_premium or typejung_debrief, dated by charge creation.',
    'Refunds are the current refunded amounts for those sales, not all refund cash flows occurring in the window.',
    'Revenue is before processor fees, tax remittances, hosting and AI costs. Untagged charges are excluded.',
    'Browser counts are unique first-party anonymous IDs per event; they are not people or an ordered conversion cohort.',
    'Source labels identify entry links; a home_hero label alone does not identify the external acquisition channel.',
    'Unavailable sources are null, never zero. No customer identifiers are saved in this report.',
  ],
  errors,
  windows: {},
};
for (const days of [7, 30, 90]) {
  const start = new Date(now.getTime() - days * 864e5).toISOString();
  const filter = (name, column = 'created_at') => data[name]?.filter(r => r[column] >= start) ?? null;
  const sales = filter('sales', 'date');
  const events = filter('events', 'occurred_at');
  const purchases = filter('purchases')?.filter(p => p.status === 'completed' && p.amount > 0) ?? null;
  const browsers = events ? Object.fromEntries([...new Set(events.map(e => e.event_name))].map(name => [name,
    new Set(events.filter(e => e.event_name === name && e.anonymous_id).map(e => e.anonymous_id)).size])) : null;
  const cadSales = sales?.filter(s => s.currency === 'cad') ?? null;
  const grossCad = cadSales ? round(cadSales.reduce((n, s) => n + s.amount, 0) / 100) : null;
  const intents = filter('intents');
  const debriefs = filter('debriefs');
  report.windows[days] = {
    since: start,
    revenue: sales ? {
      livePaidOrders: sales.length, grossCad,
      refundedCad: round(cadSales.reduce((n, s) => n + s.refunded, 0) / 100),
      revenueAfterRefundsCad: round(cadSales.reduce((n, s) => n + s.amount - s.refunded, 0) / 100),
      averageOrderCad: cadSales.length ? round(grossCad / cadSales.length) : null,
      ordersByTier: counts(sales, s => s.tier), otherCurrencyOrders: sales.length - cadSales.length,
      goalPercent: days === 30 ? ratio(grossCad, 3000) : null,
      salesMissingPurchaseRecord: data.purchases ? sales.filter(s => s.tier !== 'typejung_debrief' && !data.purchases.some(p => p.status === 'completed' && p.payment_intent_id === s.paymentIntentId)).length : null,
    } : null,
    browsersByEvent: browsers,
    directionalRates: browsers ? {
      completionPercent: ratio(browsers.assessment_completed || 0, browsers.assessment_started || 0),
      resultToUpgradePercent: ratio(browsers.results_unlock_clicked || 0, browsers.results_viewed || 0),
      resultToPaidOrderPercent: sales ? ratio(sales.length, browsers.results_viewed || 0) : null,
    } : null,
    topEntryLinks: events ? Object.entries(counts(events.filter(e => e.event_name === 'assessment_started'), e => e.source)).slice(0, 10).map(([source, starts]) => ({ source, starts })) : null,
    paidAcquisitionLabels: purchases ? counts(purchases, p => p.utm_source || p.acquisition_source || p.source) : null,
    checkoutIntents: intents ? { count: intents.length, byStatus: counts(intents, i => i.status), withRecoveryConsent: intents.filter(i => i.has_customer_email && ['site_opt_in', 'stripe_opt_in'].includes(i.recovery_email_consent)).length } : null,
    paidUndeliveredDebriefs: debriefs ? debriefs.filter(d => d.paid_at && !d.delivered_at).length : null,
  };
}

const outputIndex = process.argv.indexOf('--output');
if (outputIndex !== -1) {
  const outputPath = process.argv[outputIndex + 1];
  if (!outputPath || outputPath.startsWith('--')) throw new Error('--output requires a file path');
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(report, null, 2) + '\n');
}
console.log(JSON.stringify(report, null, 2));
if (Object.keys(errors).length) process.exitCode = 1;
