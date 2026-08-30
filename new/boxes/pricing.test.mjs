/** בדיקת-קצה · קופסת-pricing — מוכיחה את דוגמאות-החוזה דרך הקופסה בלבד.
 *  DoD: node pricing.test.mjs ⇒ exit 0, כל האסרטים עוברים + מגן-הכרעה verbatim. */
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { DEFAULT_INTEGRATION_PRICES } from '../atoms/integration-prices.mjs';
import {
  DEFAULT_PRICES, sizeLabels, shekel, normalize, quote, readPrices, writePrices,
} from './pricing.mjs';

let f = 0;
const check = (name, fn) => { try { fn(); } catch (e) { console.error('✗ ' + name + ': ' + e.message); f = 1; } };

// ── DEFAULT_PRICES (1-5) ──
check('base+setup', () => { assert.strictEqual(DEFAULT_PRICES.base, 290); assert.strictEqual(DEFAULT_PRICES.setup, 1500); });
check('modules', () => {
  assert.deepStrictEqual(DEFAULT_PRICES.modules, {
    families: 0, calendar: 0, courses: 120, diary: 70, supporters: 180, reports: 60, tzedaka: 90, shop: 90, shop7: 80,
  });
});
check('sizeMult', () => assert.deepStrictEqual(DEFAULT_PRICES.sizeMult, { small: 1, medium: 1.6, large: 2.4 }));
check('enterprise', () => assert.deepStrictEqual(DEFAULT_PRICES.enterprise, { oneTime: 55000, annualMaintenance: 9000 }));
check('integrations', () => {
  assert.strictEqual(DEFAULT_PRICES.integrations.ai, 120);
  assert.strictEqual(DEFAULT_PRICES.integrations.receipts, 60);
  assert.strictEqual(Object.keys(DEFAULT_PRICES.integrations).length, 12);
});

// ── sizeLabels (6) ──
check('sizeLabels', () => assert.deepStrictEqual(sizeLabels, { small: 'קטן', medium: 'בינוני', large: 'גדול' }));

// ── shekel (7-8) ──
check('shekel', () => {
  assert.strictEqual(shekel(470), '₪470');
  assert.strictEqual(shekel(1024), '₪1,024');
  assert.strictEqual(shekel(0), '₪0');
  assert.strictEqual(shekel('אבג'), '₪NaN');
});

// ── normalize (9-14) ──
check('normalize(null)=defaults', () => assert.deepStrictEqual(normalize(null), DEFAULT_PRICES));
check('normalize negative/valid base', () => {
  assert.strictEqual(normalize({ base: -5 }).base, 290);
  assert.strictEqual(normalize({ base: 350 }).base, 350);
});
check('normalize zero valid', () => assert.strictEqual(normalize({ modules: { courses: 0 } }).modules.courses, 0));
check('normalize string rejected', () => assert.strictEqual(normalize({ base: '100' }).base, 290));
check('normalize foreign module dropped', () => {
  const m = normalize({ modules: { shop: 999, junk: 5 } }).modules;
  assert.strictEqual(m.shop, 999);
  assert.ok(!('junk' in m));
});
check('normalize integrations', () => {
  const g = normalize({ integrations: { whatsapp: 70, junk: 5 } }).integrations;
  assert.strictEqual(g.whatsapp, 70);
  assert.strictEqual(g.ai, 120);
  assert.ok(!('junk' in g));
});

// ── quote (15-19; nameOf = m⇒m) ──
check('quote small, courses off', () => {
  const q = quote({ modules: { courses: false } }, 'small', DEFAULT_PRICES, (m) => m);
  assert.ok(!q.lines.some((l) => l.key === 'courses'), 'courses מוסר');
  assert.ok(q.included.some((l) => l.key === 'families'), 'families כלול');
  assert.ok(q.included.some((l) => l.key === 'calendar'), 'calendar כלול');
  assert.strictEqual(q.modulesSubtotal, 570);
  assert.strictEqual(q.base, 290);
  assert.strictEqual(q.sizeMult, 1);
  assert.strictEqual(q.monthly, 860);
  assert.strictEqual(q.firstPayment, 2360);
  assert.strictEqual(q.yearly, 10320);
  assert.strictEqual(q.yearlyDiscounted, 8600);
});
check('quote medium + whatsapp addon', () => {
  const q = quote({}, 'medium', DEFAULT_PRICES, (m) => m, [{ key: 'whatsapp', label: 'וואטסאפ' }]);
  const wa = q.lines.find((l) => l.key === 'whatsapp');
  assert.ok(wa && wa.kind === 'integration' && wa.price === 50, 'שורת-וואטסאפ');
  assert.strictEqual(q.sizeMult, 1.6);
  assert.strictEqual(q.monthly, Math.round((290 + 740) * 1.6));
});
check('quote unknown size falls to 1', () => {
  const q = quote({}, 'huge', DEFAULT_PRICES, (m) => m);
  assert.strictEqual(q.sizeMult, 1);
});
check('quote priceless addon dropped', () => {
  const q = quote({}, 'small', DEFAULT_PRICES, (m) => m, [{ key: 'zzz', label: 'לא-קיים' }]);
  assert.ok(!q.lines.some((l) => l.key === 'zzz'));
});
check('quote enterprise passthrough', () => {
  const q = quote({}, 'small', DEFAULT_PRICES, (m) => m, [], 'enterprise');
  assert.strictEqual(q.mode, 'enterprise');
  assert.strictEqual(q.enterpriseOneTime, 55000);
  assert.strictEqual(q.enterpriseAnnual, 9000);
});

// ── readPrices / writePrices (20-24; שקעי-IO מוזרקים) ──
check('readPrices empty=default', () => assert.deepStrictEqual(readPrices(() => null), DEFAULT_PRICES));
check('readPrices stored', () => {
  const t = readPrices(() => JSON.stringify({ base: 350 }));
  assert.strictEqual(t.base, 350);
  assert.strictEqual(t.setup, 1500);
});
check('readPrices bad JSON=default', () => assert.deepStrictEqual(readPrices(() => 'לא-JSON-תקין'), DEFAULT_PRICES));
check('writePrices calls setItem', () => {
  let seenKey, seenVal;
  writePrices((k, v) => { seenKey = k; seenVal = v; }, { base: 500 });
  assert.strictEqual(seenKey, 'maor_prices');
  assert.deepStrictEqual(JSON.parse(seenVal), { base: 500 });
});
check('writePrices swallows throw', () => {
  assert.doesNotThrow(() => writePrices(() => { throw new Error('חסום'); }, { base: 1 }));
});
check('round-trip write→read', () => {
  const store = {};
  const p = { base: 400, modules: { courses: 200 } };
  writePrices((k, v) => { store[k] = v; }, p);
  const back = readPrices((k) => store[k] ?? null);
  assert.deepStrictEqual(back, normalize(p));
});

/* 🛡 מגן-הכרעה: מילון-מחירי-ההרחבות ומפתח-האחסון חיים בקוד-הקופסה verbatim מהמקור. */
const src = readFileSync(new URL('./pricing.mjs', import.meta.url), 'utf8');
const guards = ["const PRICES_LS_KEY = 'maor_prices';"];
for (const g of guards) if (!src.includes(g)) { console.error('✗ מגן-הכרעה: חסר ' + JSON.stringify(g)); f = 1; }
// הכרעה 19: מחירי-ההרחבות נשמרים על ערך-הדאטה
const PRICE_EXPECT = { receipts: 60, payments: 90, whatsapp: 50, sms: 40, phone: 90, gcal: 30, drive: 30, sheets: 40, maps: 40, esign: 60, ai: 120, campaign: 60 };
for (const [k2, v2] of Object.entries(PRICE_EXPECT)) if (DEFAULT_INTEGRATION_PRICES[k2] !== v2) { console.error('✗ מגן-הכרעה: מחיר ' + k2 + ' סטה'); f = 1; }
// טוהר-חיווט: הקופסה מייבאת רק אטומים (חוק-2), אפס ייבוא-קופסה.
if (/from '\.\/[a-z-]+\.mjs'/.test(src)) { console.error('✗ מגן: ייבוא-קופסה אסור'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת-תמחור: 24 דוגמאות-חוזה + מגן-הכרעה (מילון-הרחבות ומפתח-אחסון verbatim) עברו');
