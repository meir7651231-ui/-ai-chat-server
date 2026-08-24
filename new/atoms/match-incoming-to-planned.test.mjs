import { matchIncomingToPlanned } from './match-incoming-to-planned.mjs';
// שקעים אמיתיים/מתועדים (מקומיים — הבדיקה מייבאת רק את האטום שלה)
const nameMatches = (a, b) => a === b; // חוזה: שקע-דמיון (כאן: זהות פשוטה)
const dayDiff = (a, b) => {           // מימוש-אמת של maor: מרחק-ימים מוחלט
  const [ay, am, ad] = a.split('-').map((n) => parseInt(n, 10));
  const [by, bm, bd] = b.split('-').map((n) => parseInt(n, 10));
  const da = new Date(ay, (am || 1) - 1, ad || 1, 12);
  const db = new Date(by, (bm || 1) - 1, bd || 1, 12);
  return Math.abs(Math.round((da.getTime() - db.getTime()) / 86400000));
};
const ref = (id, amount, date, name) => ({ entityType: 'supporter', entityId: 'e' + id, plan: { id, amount, date }, name });
const inc = (id, amount, at, name) => ({ id, amount, at, name });

let f = 0;
const bad = (msg) => { console.error('✗ ' + msg); f = 1; };

// 1) התאמה-יחידה תאריך-זהה → confidence 100
let m = matchIncomingToPlanned(inc('i1', 100, '2026-08-24', 'כהן'), [ref('p1', 100, '2026-08-24', 'כהן')], nameMatches, dayDiff);
if (!m || m.confidence !== 100 || m.plan.id !== 'p1' || m.incomingId !== 'i1' || m.entityId !== 'ep1') bad(`התאמה-יחידה: ${JSON.stringify(m)}`);

// 2) סכום שונה → null
if (matchIncomingToPlanned(inc('i2', 100, '2026-08-24', 'כהן'), [ref('p2', 200, '2026-08-24', 'כהן')], nameMatches, dayDiff) !== null) bad('סכום-שונה היה אמור להיות null');

// 3) שם שונה → null
if (matchIncomingToPlanned(inc('i3', 100, '2026-08-24', 'כהן'), [ref('p3', 100, '2026-08-24', 'לוי')], nameMatches, dayDiff) !== null) bad('שם-שונה היה אמור להיות null');

// 4) תאריך מחוץ-לחלון (6 ימים) → null
if (matchIncomingToPlanned(inc('i4', 100, '2026-08-24', 'כהן'), [ref('p4', 100, '2026-08-18', 'כהן')], nameMatches, dayDiff) !== null) bad('מחוץ-לחלון היה אמור להיות null');

// 5) אמביגואי (2 מועמדים) → null
if (matchIncomingToPlanned(inc('i5', 100, '2026-08-24', 'כהן'), [ref('p5a', 100, '2026-08-24', 'כהן'), ref('p5b', 100, '2026-08-23', 'כהן')], nameMatches, dayDiff) !== null) bad('אמביגואי היה אמור להיות null');

// 6) מרחק 2 ימים → confidence 80
m = matchIncomingToPlanned(inc('i6', 100, '2026-08-24', 'כהן'), [ref('p6', 100, '2026-08-22', 'כהן')], nameMatches, dayDiff);
if (!m || m.confidence !== 80) bad(`dd=2 conf: ${JSON.stringify(m)}`);

// 7) מרחק 3 ימים (קצה-החלון) → confidence 70, עדיין מוחזר
m = matchIncomingToPlanned(inc('i7', 100, '2026-08-24', 'כהן'), [ref('p7', 100, '2026-08-21', 'כהן')], nameMatches, dayDiff);
if (!m || m.confidence !== 70) bad(`dd=3 conf: ${JSON.stringify(m)}`);

if (f) process.exit(1);
console.log('✓ match-incoming-to-planned: 7 דוגמאות-חוזה — ירוק');
