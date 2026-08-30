import { eligibleAssignmentsForDay as __pure_eligibleAssignmentsForDay } from './eligible-assignments-for-day.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_eligibleAssignmentsForDay_ELIGIBLE_ASSIGNMENTS_FOR_DAY_T = {
  k1: "active",
};
const eligibleAssignmentsForDay = (...a) => __pure_eligibleAssignmentsForDay(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_eligibleAssignmentsForDay_ELIGIBLE_ASSIGNMENTS_FOR_DAY_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const a1 = { id: 'a1', status: 'active' };
const a2 = { id: 'a2', status: 'active' };
const a3 = { id: 'a3', status: 'done' };
const db = { shopAssignments: [a1, a2, a3], deliveries: [{ dayId: 'd1', assignmentId: 'a1' }] };
const ids = (arr) => arr.map((a) => a.id).join(',');
ok(ids(eligibleAssignmentsForDay(db, 'd1')) === 'a2', "d1 ⇒ רק a2 (a1 נמסר, a3 לא-active)");
ok(ids(eligibleAssignmentsForDay(db, 'd2')) === 'a1,a2', 'יום אחר ⇒ a1 חוזר להיות זמין');
ok(ids(eligibleAssignmentsForDay({ shopAssignments: [a1, a2, a3], deliveries: [] }, 'd1')) === 'a1,a2', 'בלי מסירות ⇒ כל הפעילים');
ok(eligibleAssignmentsForDay({ shopAssignments: [], deliveries: [] }, 'd1').length === 0, 'בלי שיוכים ⇒ ריק');
ok(eligibleAssignmentsForDay(db, 'd2')[0] === a1, 'הפלט מצביע לאובייקט-המקור (לא עותק)');
if (f) process.exit(1);
console.log('✓ eligible-assignments-for-day: 5 דוגמאות-חוזה — ירוק');
