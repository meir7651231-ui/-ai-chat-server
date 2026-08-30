import { detectRecurringHok as __pure_detectRecurringHok } from './detect-recurring-hok.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_detectRecurringHok_DETECT_RECURRING_HOK_T = {
  k1: "card",
  k2: "הו״ק ",
  k3: "סליקה",
  k4: " (זוהה מהיסטוריה · ",
  k5: " חודשים)",
  k6: "auto",
  k7: 28,
  k8: 10,
};
const detectRecurringHok = (...a) => __pure_detectRecurringHok(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_detectRecurringHok_DETECT_RECURRING_HOK_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// השקעים — מימושי-המקור (nedarimSync.ts)
const clearingProviders = ['נדרים', 'סולה'];
const modeOf = (nums) => {
  const c = new Map(); let best = nums[0] ?? 1; let bestN = 0;
  for (const n of nums) { const k = (c.get(n) ?? 0) + 1; c.set(n, k); if (k > bestN) { bestN = k; best = n; } }
  return best;
};
const modeStr = (strs) => {
  const c = new Map(); let best = strs[0] ?? ''; let bestN = 0;
  for (const s of strs) { const k = (c.get(s) ?? 0) + 1; c.set(s, k); if (k > bestN) { bestN = k; best = s; } }
  return best;
};
const monthsAgo = (dateIso, todayIso) => {
  const [y1, m1] = dateIso.slice(0, 7).split('-').map(Number);
  const [y2, m2] = todayIso.slice(0, 7).split('-').map(Number);
  if (!y1 || !m1 || !y2 || !m2) return 999;
  return (y2 - y1) * 12 + (m2 - m1);
};
const run = (sps, min = 3) => detectRecurringHok(sps, '2026-08-24', min, clearingProviders, modeStr, modeOf, monthsAgo);
// 1) תבנית 3 חודשים ⇒ הו"ק מזוהה
const sp1 = { id: 's1', hist: [
  { a: 100, c: '₪', d: '2026-05-10', clearer: 'נדרים' },
  { a: 100, c: '₪', d: '2026-06-10', clearer: 'נדרים' },
  { a: 100, c: '₪', d: '2026-07-10', clearer: 'נדרים' },
] };
const r1 = run([sp1]);
ok(r1.detected === 1, '1: detected ≠ 1');
const h1 = r1.supporters[0].hok;
ok(h1.amount === 100 && h1.cur === '₪' && h1.day === 10 && h1.method === 'card', '1: amount/cur/day/method שגויים');
ok(h1.note === 'הו״ק נדרים (זוהה מהיסטוריה · 3 חודשים)', '1: note שגוי: ' + h1.note);
ok(h1.active === true, '1: active ≠ true (חודש אחרון 2026-07)');
ok(h1.startedAt === '2026-05-10' && h1.kevaId === 'auto', '1: startedAt/kevaId שגויים');
ok(r1.supporters[0] !== sp1, '1: התורם לא שוכפל');
// 2) רק 2 חודשים בלי kevaId ⇒ לא מזוהה, אותה רפרנס
const sp2 = { id: 's2', hist: [
  { a: 100, c: '₪', d: '2026-05-10', clearer: 'נדרים' },
  { a: 100, c: '₪', d: '2026-06-10', clearer: 'נדרים' },
] };
const r2 = run([sp2]);
ok(r2.detected === 0 && r2.supporters[0] === sp2, '2: זוהה בטעות / לא אותה רפרנס');
// 3) חיוב-בודד עם kevaId ⇒ ודאי; active=false (6 חודשים)
const sp3 = { id: 's3', hist: [{ a: 52, c: '$', d: '2026-02-15', clearer: 'סולה', kevaId: 'K9' }] };
const r3 = run([sp3]);
const h3 = r3.supporters[0].hok;
ok(r3.detected === 1, '3: detected ≠ 1');
ok(h3.amount === 52 && h3.cur === '$' && h3.day === 15, '3: amount/cur/day שגויים');
ok(h3.note === 'הו״ק סולה · K9' && h3.kevaId === 'K9', '3: note/kevaId שגויים: ' + h3.note);
ok(h3.active === false && h3.startedAt === '2026-02-15', '3: active/startedAt שגויים');
// 4) הו"ק ידני (בלי kevaId) לא נדרס
const sp4 = { id: 's4', hok: { amount: 50 }, hist: sp1.hist };
const r4 = run([sp4]);
ok(r4.detected === 0 && r4.supporters[0] === sp4, '4: הו"ק ידני נדרס');
// 5) כבילת-יום: יום-30 ⇒ 28
const sp5 = { id: 's5', hist: [
  { a: 200, c: '₪', d: '2026-03-30', clearer: 'נדרים' },
  { a: 200, c: '₪', d: '2026-04-30', clearer: 'נדרים' },
  { a: 200, c: '₪', d: '2026-05-30', clearer: 'נדרים' },
] };
ok(run([sp5]).supporters[0].hok.day === 28, '5: day לא נכבל ל-28');
// 6) clearer לא-מוכר ⇒ לא נוגעים
const sp6 = { id: 's6', hist: [
  { a: 100, c: '₪', d: '2026-05-10', clearer: 'מזומן' },
  { a: 100, c: '₪', d: '2026-06-10', clearer: 'מזומן' },
  { a: 100, c: '₪', d: '2026-07-10', clearer: 'מזומן' },
] };
const r6 = run([sp6]);
ok(r6.detected === 0 && r6.supporters[0] === sp6, '6: clearer זר זוהה בטעות');
if (f) process.exit(1);
console.log('✓ detect-recurring-hok: 6 דוגמאות-חוזה — ירוק');
