import { reenrollListText as __pure_reenrollListText } from './reenroll-list-text.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_reenrollListText_REENROLL_LIST_TEXT_T = {
  k1: "yes",
  k2: "ממשיך",
  k3: "לא ממשיך",
  k4: "hold",
  k5: "בהמתנה",
  k6: "טרם הוחלט",
};
const reenrollListText = (...a) => __pure_reenrollListText(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_reenrollListText_REENROLL_LIST_TEXT_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

const r1 = { memberName: 'דוד', courseName: 'ציור', summary: { presents: 12, absences: 2 }, decision: 'yes', renewed: true };
const r2 = { memberName: 'רות', courseName: 'מוזיקה', summary: { presents: 0, absences: 5 }, renewed: false };

ok(reenrollListText([r1]) === 'דוד · ציור — נוכחות 12, חיסורים 2 · ממשיך ✓נרשם', 'שורת r1: ' + reenrollListText([r1]));
ok(reenrollListText([r2]) === 'רות · מוזיקה — נוכחות 0, חיסורים 5 · טרם הוחלט', 'שורת r2: ' + reenrollListText([r2]));
ok(reenrollListText([{ ...r2, decision: 'no' }]).endsWith('· לא ממשיך'), "decision 'no'");
ok(reenrollListText([{ ...r2, decision: 'hold' }]).endsWith('· בהמתנה'), "decision 'hold'");
const two = reenrollListText([r1, r2]);
ok(two === reenrollListText([r1]) + '\n' + reenrollListText([r2]), 'חיבור ב-\\n: ' + JSON.stringify(two));
ok(reenrollListText([]) === '', 'rows=[] ⇒ מחרוזת ריקה');

if (f) process.exit(1);
console.log('✓ reenroll-list-text: 6 דוגמאות-חוזה — ירוק');
