import { groupsHintFromAudience as __pure_groupsHintFromAudience } from './groups-hint-from-audience.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_groups_hint_from_audience_T = {
  k1: 10,
  k2: 12,
};
const groupsHintFromAudience = (...a) => __pure_groupsHintFromAudience(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_groups_hint_from_audience_T);
const C = [
  ['3 קבוצות', 3],
  ['נפגשים 5 פעמים בשבוע', 5],
  ['4  קבוצות', 4],
  ['1 קבוצות', null],
  ['13 קבוצות', null],
  ['בנות בית ספר', null],
  [undefined, null],
];
let f = 0;
for (const [a, w] of C) {
  const g = groupsHintFromAudience(a);
  if (g !== w) {
    console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`);
    f = 1;
  }
}
if (f) process.exit(1);
console.log('✓ groups-hint-from-audience: 7 דוגמאות-חוזה — ירוק');
