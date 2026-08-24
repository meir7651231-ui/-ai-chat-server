/** בדיקת-קצה: מנוע-הסנכרון המלא דרך הקופסה בלבד — כל דוגמאות-החוזה. */
import * as NED from './lib-nedarim-sync.mjs';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';

let f = 0;
const chk = (name, fn) => { try { fn(); } catch (e) { console.error('✗ ' + name + ': ' + e.message); f = 1; } };

// דוגמה 1 · תווית-סליקה
chk('providerClearer', () => {
  assert.strictEqual(NED.providerClearer('sola'), 'סולה');
  assert.strictEqual(NED.providerClearer(''), 'נדרים');
  assert.strictEqual(NED.providerClearer(undefined), 'נדרים');
  assert.deepStrictEqual([...NED.CLEARING_PROVIDERS], ['נדרים', 'סולה']);
});

// דוגמה 2 · מפתח-דדופ
chk('chargeDedupKey', () => {
  assert.strictEqual(NED.chargeDedupKey({ txnId: 'T1' }), 'txn:T1');
  assert.strictEqual(NED.chargeDedupKey({ reference: 'R1' }), 'ref:R1');
  assert.strictEqual(NED.chargeDedupKey({}), '');
});

// דוגמה 3 · chargeToHist (מטבע קידוד-נדרים '2'⇒$, ספק-סולה)
chk('chargeToHist', () => {
  const h = NED.chargeToHist({ amount: 50, currency: '2', d: '2026-03-05', txnId: 'T7', provider: 'sola' });
  assert.deepStrictEqual(h, { d: '2026-03-05', a: 50, c: '$', clearer: 'סולה', txn: 'T7' });
});

// דוגמה 4 · planNedarimSync — יצירה + חיוב
chk('planNedarimSync-create', () => {
  const p = NED.planNedarimSync([], [{ toremId: '55', name: 'רחל בן צבי' }],
    [{ amount: 100, toremId: '55', txnId: 'X1', d: '2026-01-10', id: 'c1' }]);
  assert.strictEqual(p.summary.newSupporters, 1);
  assert.strictEqual(p.summary.chargesAdded, 1);
  assert.strictEqual(p.summary.ilsAdded, 100);
  assert.strictEqual(p.supporters[0].id, 'sup-ned-55');
  assert.strictEqual(p.supporters[0].hist[0].a, 100);
  assert.deepStrictEqual(p.handledChargeIds, ['c1']);
});

// דוגמה 5 · שם חסין-סדר — התאמה לכרטיס קיים בסדר-מילים הפוך (לא כפול)
chk('planNedarimSync-nameOrder', () => {
  const existing = [{ id: 's1', name: 'רחל בן צבי', phone: '', email: '', idNum: '', extId: '', city: '', count: 0, ils: 0, usd: 0, donations: [] }];
  const p = NED.planNedarimSync(existing, [{ toremId: '77', name: 'בן צבי רחל' }], []);
  assert.strictEqual(p.summary.newSupporters, 0);
  assert.strictEqual(p.summary.updatedSupporters, 1);
  assert.strictEqual(p.supporters.length, 1);
  assert.strictEqual(p.supporters[0].extId, '77'); // extId מולא-אם-ריק
});

// דוגמה 6 · פאזה-מודעת-כסף — ביטול + זיכוי
chk('planNedarimSync-money', () => {
  const existing = [{ id: 's1', name: 'משה כהן', phone: '0501112233', email: '', idNum: '', extId: '', city: '', count: 0, ils: 0, usd: 0, donations: [], hist: [] }];
  const p = NED.planNedarimSync(existing, [],
    [{ amount: 0, phone: '0501112233', txnId: 'Z0', id: 'z' }, // ביטול
     { amount: -30, phone: '0501112233', txnId: 'Z1', d: '2026-02-02', id: 'r' }]); // זיכוי
  assert.strictEqual(p.summary.chargesNonPositive, 1);
  assert.strictEqual(p.summary.refundsApplied, 1);
  assert.strictEqual(p.summary.ilsAdded, -30);
  assert.strictEqual(p.supporters[0].hist.length, 1); // רק הזיכוי נכנס ל-hist
});

// דוגמה 7 · דדופ-גלובלי C2 באצווה
chk('attachChargesBulk-C2', () => {
  const sups = [
    { id: 'a', name: 'א', hist: [] },
    { id: 'b', name: 'ב', hist: [] },
  ];
  const charge = { amount: 40, txnId: 'DUP' };
  const r = NED.attachChargesBulk(sups, [{ supId: 'a', charge }, { supId: 'b', charge }]);
  assert.strictEqual(r.added, 1); // אותו txn לא נרשם פעמיים
});

// קצה · attachOnly — שם-בלבד נשאר pending
chk('planNedarimSync-attachOnly', () => {
  const existing = [{ id: 's1', name: 'שרה לוי', phone: '', email: '', idNum: '', extId: '', city: '', count: 0, ils: 0, usd: 0, donations: [], hist: [] }];
  const full = NED.planNedarimSync(existing, [], [{ amount: 20, name: 'שרה לוי', txnId: 'N1' }]);
  assert.strictEqual(full.summary.chargesAdded, 1); // סנכרון-מלא: שם מחבר
  const only = NED.planNedarimSync(existing, [], [{ amount: 20, name: 'שרה לוי', txnId: 'N2' }], { attachOnly: true });
  assert.strictEqual(only.summary.chargesSkipped, 1); // חיבור-חי: שם-בלבד ⇒ pending
  assert.strictEqual(only.summary.chargesAdded, 0);
});

// קצה · detectRecurringHok — kevaId ⇒ ודאי; היום מוזרק (אין Date.now)
chk('detectRecurringHok', () => {
  const sups = [{ id: 's1', name: 'דוד', hist: [{ d: '2026-06-01', a: 100, c: '₪', clearer: 'נדרים', kevaId: 'K9' }] }];
  const r = NED.detectRecurringHok(sups, '2026-07-01');
  assert.strictEqual(r.detected, 1);
  assert.strictEqual(r.supporters[0].hok.active, true);
  assert.strictEqual(r.supporters[0].hok.kevaId, 'K9');
});

// קצה · עברי/null/ריק — לא קורס
chk('edge-empty-null', () => {
  const empty = NED.planNedarimSync([], [], []);
  assert.strictEqual(empty.supporters.length, 0);
  assert.strictEqual(empty.summary.chargesIn, 0);
  assert.strictEqual(NED.strongMatchForCharge({ name: 'רק שם' }, []), null); // שם-בלבד אינו מפתח-חזק
  assert.deepStrictEqual(NED.autoMatchCharges([], []), []);
});

/* 🛡 מגן-הכרעה: מקור-הקופסה מחזיק את ההכרעות verbatim (חוק-4, דפוס theme.test). */
const src = readFileSync(new URL('./lib-nedarim-sync.mjs', import.meta.url), 'utf8');
const must = [
  "raw === '$' || raw === '2'",        // curOf — קידוד-נדרים
  "'sup-ned-' + d.toremId",             // מזהה דטרמיניסטי (תורם)
  "'sup-ned-unassigned'",               // איגום אנונימי
  "'sup-ned-txn-'",                     // כרטיס-לפי-עסקה
  'ph.length >= 7',                     // סף-טלפון במפתח-שיוך
  "ks.push('ext:' + ext)",              // מפתח-חזק ext
  '_nameSortKey(t, normSearch, NAME_TITLES)', // חיווט מילון-התוויות
];
for (const m of must) {
  if (!src.includes(m)) { console.error('✗ מגן-הכרעה: חסר verbatim ' + JSON.stringify(m)); f = 1; }
}
// סדר-חיווט: מילון-התוויות מוזרק לפני הגדרת planNedarimSync (הכרעה חתומה)
if (src.indexOf('const NAME_TITLES') > src.indexOf('const planNedarimSync')) {
  console.error('✗ מגן: NAME_TITLES הוגדר אחרי החיווט'); f = 1;
}
// אין import של קופסה אחרת (חוק-2/3) — רק atoms
if (/from '\.\.\/boxes\//.test(src)) { console.error('✗ מגן: ייבוא-קופסה אסור'); f = 1; }

if (f) process.exit(1);
console.log('✓ lib-nedarim-sync: כל דוגמאות-החוזה + מגן-הכרעה — ירוק');
