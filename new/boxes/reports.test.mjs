/** בדיקת-קצה: מסך-הדוחות דרך הקופסה בלבד (13 חוטים) + עדשה-עוינת + מגן-הכרעה.
 *  DoD: node reports.test.mjs => exit 0. */
import * as R from './reports.mjs';
import { readFileSync } from 'node:fs';
let f = 0;
const eq = (got, exp, msg) => {
  const g = JSON.stringify(got), e = JSON.stringify(exp);
  if (g !== e) { console.error(`✗ ${msg}: ציפינו ${e}, קיבלנו ${g}`); f = 1; }
};

// isoLocal-סטאב (זהה date-util:17-20) לשקע-הזמן
const p2 = (n) => String(n).padStart(2, '0');
const isoLocal = (d) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
eq(R.isoToday(isoLocal, new Date(2026, 7, 24, 12, 0, 0)), '2026-08-24', 'isoToday');
eq(R.isoToday(isoLocal, new Date(2026, 0, 1, 3, 0, 0)), '2026-01-01', 'isoToday גבול-לילה');

// fmtDate — כולל עדשה-עוינת: ריק=>'' · שבור=>כמו-שהוא (לא '—')
eq(R.fmtDate('2026-08-24'), '24/08/2026', 'fmtDate תקין');
eq(R.fmtDate('2026-08-24T12:00:00'), '24/08/2026', 'fmtDate עם-שעה');
eq(R.fmtDate(''), '', 'fmtDate ריק');
eq(R.fmtDate('שטויות'), 'שטויות', 'fmtDate שבור=>כמו-שהוא');
eq(R.fmtDate('2026-08'), '2026-08', 'fmtDate חלקי=>כמו-שהוא');

// inRange
eq(R.inRange('2026-05-01', { from: '2026-01-01', to: '2026-12-31' }), true, 'inRange בטווח');
eq(R.inRange('2025-12-31', { from: '2026-01-01', to: '' }), false, 'inRange מתחת');
eq(R.inRange('', { from: '', to: '' }), false, 'inRange ריק');

// rangeLabel (שקע fmtDate של הקופסה)
eq(R.rangeLabel({ from: '', to: '' }), 'כל התאריכים', 'rangeLabel ריק');
eq(R.rangeLabel({ from: '2026-01-01', to: '2026-03-01' }), '01/01/2026 – 01/03/2026', 'rangeLabel מלא');
eq(R.rangeLabel({ from: '2026-01-01', to: '' }), 'מ-01/01/2026', 'rangeLabel מ');
eq(R.rangeLabel({ from: '', to: '2026-03-01' }), 'עד 01/03/2026', 'rangeLabel עד');

// paidOf — עדשה-עוינת: NaN מדולג · payments חסר
eq(R.paidOf({ payments: [{ amount: 100 }, { amount: 50 }] }), 150, 'paidOf');
eq(R.paidOf({ payments: [{ amount: 100 }, { amount: NaN }] }), 100, 'paidOf NaN מדולג');
eq(R.paidOf({}), 0, 'paidOf ללא-payments');

// round2
eq(R.round2(0.1 + 0.2), 0.3, 'round2 float');

// paidInRange (שקע inRange)
eq(R.paidInRange({ payments: [{ amount: 100, date: '2026-02-01' }, { amount: 50, date: '2025-01-01' }] }, { from: '2026-01-01', to: '' }), 100, 'paidInRange');

// balanceOf (שקע paidOf) — לא-שלילי
eq(R.balanceOf({ totalDue: 200, payments: [{ amount: 50 }] }), 150, 'balanceOf');
eq(R.balanceOf({ totalDue: 100, payments: [{ amount: 300 }] }), 0, 'balanceOf לא-שלילי');
eq(R.balanceOf({}), 0, 'balanceOf ריק');

// monthKey / monthLabel
eq(R.monthKey('2026-08-24'), '2026-08', 'monthKey');
eq(R.monthLabel('2026-08'), '08/2026', 'monthLabel');

// nameIndex (שקע allMembers)
const allMembers = (db) => {
  const out = [];
  for (const fam of db.families) for (const m of fam.members) out.push({ ...m, famId: fam.id, famName: fam.name });
  return out;
};
const idx = R.nameIndex({ families: [{ id: 'f', name: 'כהן', members: [{ id: 'm1' }] }] }, allMembers);
eq(idx.get('m1'), { id: 'm1', famId: 'f', famName: 'כהן' }, 'nameIndex');
eq(idx.size, 1, 'nameIndex גודל');

// STATUS_LABEL — עברית verbatim
eq(R.STATUS_LABEL, { active: 'פעילה', pending: 'ממתינה', inactive: 'לא פעילה' }, 'STATUS_LABEL');

// countBy — ממוין יורד
eq(R.countBy([{ s: 'a' }, { s: 'a' }, { s: 'b' }], (x) => x.s), [['a', 2], ['b', 1]], 'countBy');
eq(R.countBy([], (x) => x.s), [], 'countBy ריק');

// ── 🛡 מגן-הכרעה: מקור-הקופסה נקרא ומאושר verbatim ──
const src = readFileSync(new URL('./reports.mjs', import.meta.url), 'utf8');
// (1) הכרעת-fmtDate: ריק=>'' ושבור=>iso, לא '—' (בידול מאטום fmt-date)
if (!/if \(!iso\) return '';/.test(src) || !/if \(!y \|\| !m \|\| !d\) return iso;/.test(src)) {
  console.error("✗ מגן: הכרעת-fmtDate (''/iso) שונתה"); f = 1;
}
if (src.includes("return '—'")) { console.error("✗ מגן: fmtDate החזיר '—' (סטיית-אטום)"); f = 1; }
// (2) מילון-התוויות בעברית מגיע דרך אותו קבוע-אטום
if (!src.includes("STATUS_LABEL as STATUS_LABEL_A")) { console.error('✗ מגן: STATUS_LABEL לא מהאטום'); f = 1; }
// (3) חוק-2: אין ייבוא-קופסה (רק ../atoms/)
for (const m of src.matchAll(/from '([^']+)'/g)) {
  if (!m[1].startsWith('../atoms/')) { console.error(`✗ מגן: ייבוא לא-אטומי ${m[1]}`); f = 1; }
}

if (f) process.exit(1);
console.log('✓ קופסת-הדוחות: 13 חוטים דרך הקופסה + עדשה-עוינת (ריק/NaN/שבור/עברית) + מגן-הכרעה — ירוק');
