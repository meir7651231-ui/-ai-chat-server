import { eligibleFamilies as __pure_eligibleFamilies } from './eligible-families.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_eligibleFamilies_ELIGIBLE_FAMILIES_T = {
  k1: "active",
};
const eligibleFamilies = (...a) => __pure_eligibleFamilies(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_eligibleFamilies_ELIGIBLE_FAMILIES_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const db = {
  families: [
    { id: 'f1', name: 'כהן', status: 'active', members: [{ id: 'm1' }, { id: 'm2' }] },
    { id: 'f2', name: 'לוי', status: 'active', members: [{ id: 'm3' }] },
    { id: 'f3', name: 'מזרחי', status: 'inactive', members: [] },
  ],
  shopAssignments: [
    { famId: 'f1', productId: 'p9', status: 'active', criterionIds: ['c1'] },
    { famId: 'f1', productId: 'p1', status: 'active', criterionIds: ['c2'] },
    { famId: 'f2', productId: 'p1', status: 'canceled', criterionIds: ['c1'] },
  ],
};
const ids = (arr) => arr.map((x) => x.famId).join(',');
ok(ids(eligibleFamilies(db, [], 'p9')) === 'f2', 'p9 ⇒ רק f2 (f1 כבר משויכת, f3 לא-פעילה)');
ok(ids(eligibleFamilies(db, [], 'p2')) === 'f1,f2', 'בלי קריטריון ⇒ כל הפעילות הלא-משויכות');
ok(ids(eligibleFamilies(db, ['c1', 'c2'], 'p2')) === 'f1', 'רק f1 מחזיקה את שניהם (איחוד שיוכים)');
ok(eligibleFamilies(db, ['c3'], 'p2').length === 0, 'קריטריון שאיש לא מחזיק ⇒ ריק');
const out = eligibleFamilies(db, [], 'p2')[0];
ok(JSON.stringify(out) === JSON.stringify({ famId: 'f1', name: 'כהן', memberIds: ['m1', 'm2'] }), 'צורת-הפלט {famId,name,memberIds}');
if (f) process.exit(1);
console.log('✓ eligible-families: 5 דוגמאות-חוזה — ירוק');
