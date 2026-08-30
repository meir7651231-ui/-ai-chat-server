import { distributionListLines as __pure_distributionListLines } from './distribution-list-lines.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_distributionListLines_DISTRIBUTION_LIST_LINES_T = {
  k1: "רשימת חלוקה — ",
  k2: "active",
  k3: "☐ נמסר",
  k4: "אין שיוכים פעילים לחבילה",
};
const distributionListLines = (...a) => __pure_distributionListLines(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_distributionListLines_DISTRIBUTION_LIST_LINES_T);
// שקעים (מדמים את שכני-המקור): itemOf פותר רכיב לפריט-קטלוג; beneficiaryLabel = שם-המשפחה.
const itemOf = (db, c) => db.shopItems.find((i) => i.id === c.itemId) ?? { name: '' };
const beneficiaryLabel = (db, a) => db.families.find((f) => f.id === a.famId)?.name ?? '';
const db = {
  shopProducts: [{ id: 'p1', name: 'סל חג', components: [{ itemId: 'i1' }, { itemId: 'i2' }] }],
  shopItems: [{ id: 'i1', name: 'עוף' }, { id: 'i2', name: 'יין' }],
  families: [
    { id: 'f1', name: 'כהן', address: 'הרצל 3', city: 'צפת', phone: '050-1' },
    { id: 'f2', name: 'לוי', address: '', city: '', phone: '' },
  ],
  shopAssignments: [
    { id: 'a1', productId: 'p1', famId: 'f1', status: 'active' },
    { id: 'a2', productId: 'p1', famId: 'f2', status: 'active' },
    { id: 'a3', productId: 'p1', famId: 'f1', status: 'redeemed' },
    { id: 'a4', productId: 'p2', famId: 'f1', status: 'active' },
  ],
};
let f = 0;
const eq = (name, got, want) => {
  if (JSON.stringify(got) !== JSON.stringify(want)) { console.error(`✗ ${name}: ${JSON.stringify(got)} ≠ ${JSON.stringify(want)}`); f = 1; }
};
// דוגמאות 1+2 — חבילה עם 2 שיוכים active (ה-redeemed לא נספר; ריקים מסוננים)
eq('p1', distributionListLines(db, 'p1', undefined, itemOf, beneficiaryLabel), [
  'רשימת חלוקה — סל חג',
  '='.repeat(30),
  'כהן · הרצל 3, צפת · 050-1 · עוף + יין · ☐ נמסר',
  'לוי · עוף + יין · ☐ נמסר',
]);
// דוגמה 3 — חבילה לא-קיימת ובלי שיוכים
eq('p3', distributionListLines(db, 'p3', undefined, itemOf, beneficiaryLabel), [
  'רשימת חלוקה — ', '='.repeat(30), 'אין שיוכים פעילים לחבילה',
]);
// דוגמה 4 — שיוך active לחבילה שאינה בקטלוג ⇒ בלי שם-חבילה ובלי רכיבים
eq('p2', distributionListLines(db, 'p2', undefined, itemOf, beneficiaryLabel), [
  'רשימת חלוקה — ', '='.repeat(30), 'כהן · הרצל 3, צפת · 050-1 · ☐ נמסר',
]);
if (f) process.exit(1);
console.log('✓ distribution-list-lines: 4 דוגמאות-חוזה — ירוק');
