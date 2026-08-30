import { colRefToIndex as __pure_colRefToIndex } from './col-ref-to-index.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_col_ref_to_index_T = {
  k1: 26,
};
const colRefToIndex = (...a) => __pure_colRefToIndex(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_col_ref_to_index_T);
const C = [
  ['A1', 0], ['Z9', 25], ['AA1', 26], ['AB4', 27], ['BC12', 54],
  ['4', 0], ['', 0], ['a1', 0],
];
let f = 0;
for (const [ref, want] of C) {
  const got = colRefToIndex(ref);
  if (got !== want) { console.error(`✗ ${JSON.stringify(ref)} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ col-ref-to-index: 8 בדיקות מ-7 דוגמאות-חוזה — ירוק');
