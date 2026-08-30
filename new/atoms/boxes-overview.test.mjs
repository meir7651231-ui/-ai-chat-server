import { boxesOverview as __pure_boxesOverview } from './boxes-overview.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_boxes_overview_T = {
  k1: 10,
};
const boxesOverview = (...a) => __pure_boxesOverview(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_boxes_overview_T);

// שקעים מקומיים לבדיקה (הבדיקה מייבאת רק את האטום שלה)
const lastCollectionIso = (box) => {
  let last = '';
  for (const c of box.collections) if (c.date > last) last = c.date;
  return last;
};
const boxTotal = (box) => box.collections.reduce((a, c) => a + (Number.isFinite(c.amount) ? c.amount : 0), 0);
const smartFilter = (q, items, getTerms) =>
  !q ? items.slice() : items.filter((it) => getTerms(it).some((t) => String(t).includes(q)));

const db = {
  tzBoxes: [
    { num: '12', coordinatorId: 'c1', famId: 'f1', status: 'active',
      collections: [{ date: '2026-01-01', amount: 100 }, { date: '2026-03-01', amount: 50 }] },
    { num: '3', coordinatorId: 'c2', famId: 'f2', status: 'returned', collections: [] },
    { num: '7', coordinatorId: 'c1', famId: '', status: 'active',
      collections: [{ date: '2026-02-01', amount: 200 }] },
  ],
  tzCoordinators: [{ id: 'c1', name: 'רבקה כהן' }, { id: 'c2', name: 'שרה לוי' }],
  families: [{ id: 'f1', name: 'משפחת פרץ' }, { id: 'f2', name: 'משפחת גל' }],
};
const S = [lastCollectionIso, boxTotal, smartFilter];
const nums = (rows) => rows.map((r) => r.box.num);
let f = 0;
const eq = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${name}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
};

// 1 — מיון מספרי + שורת '12' מלאה
const r1 = boxesOverview(db, '', '', 'num', ...S);
eq('דוגמה 1 · סדר num', nums(r1), ['3', '7', '12']);
const b12 = r1.find((r) => r.box.num === '12');
eq('דוגמה 1 · שורת 12', { c: b12.coordName, fam: b12.famName, last: b12.last, total: b12.total },
  { c: 'רבקה כהן', fam: 'משפחת פרץ', last: '2026-03-01', total: 150 });
// 2 — famId ריק ⇒ famName ''
eq('דוגמה 2 · famName ריק', r1.find((r) => r.box.num === '7').famName, '');
// 3 — סינון סטטוס
eq('דוגמה 3 · status=active', nums(boxesOverview(db, '', 'active', 'num', ...S)), ['7', '12']);
// 4 — מיון total יורד
eq('דוגמה 4 · sort=total', nums(boxesOverview(db, '', '', 'total', ...S)), ['7', '12', '3']);
// 5 — מיון lastCollection: מעולם-לא ראשון
eq('דוגמה 5 · sort=lastCollection', nums(boxesOverview(db, '', '', 'lastCollection', ...S)), ['3', '7', '12']);
// 6 — חיפוש דרך שקע-smartFilter
eq('דוגמה 6 · q=רבקה', nums(boxesOverview(db, 'רבקה', '', 'num', ...S)), ['7', '12']);

if (f) process.exit(1);
console.log('✓ boxes-overview: 6 דוגמאות-חוזה — ירוק');
