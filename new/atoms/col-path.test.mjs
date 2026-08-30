import { colPath as __pure_colPath } from './col-path.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_colPath_COL_PATH_T = {
  k1: "orgs/",
};
const colPath = (...a) => __pure_colPath(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_colPath_COL_PATH_T);
const C = [
  [['demo', true, 'families'], 'families'],
  [['demo', false, 'families'], 'orgs/demo/families'],
  [['kehila', false, 'supporters'], 'orgs/kehila/supporters'],
  [['x', true, 'donations'], 'donations'],
  [['', false, 'meta'], 'orgs//meta'],
];
let f = 0;
for (const [args, want] of C) {
  const got = colPath(...args);
  if (got !== want) { console.error(`✗ ${JSON.stringify(args)} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ col-path: 5 דוגמאות-חוזה — ירוק');
