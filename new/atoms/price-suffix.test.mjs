import { priceSuffix as __pure_priceSuffix } from './price-suffix.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_priceSuffix_PRICE_SUFFIX_T = {
  k1: "half_year",
  k2: "לחצי שנה",
  k3: "year",
  k4: "לשנה",
  k5: "punch",
  k6: "לחודש",
};
const priceSuffix = (...a) => __pure_priceSuffix(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_priceSuffix_PRICE_SUFFIX_T);
const C = [
  ['half_year', 'לחצי שנה'],
  ['year', 'לשנה'],
  ['punch', ''],
  ['month', 'לחודש'],
  ['אחר', 'לחודש'],
];
let f = 0;
for (const [a, w] of C) { const g = priceSuffix(a); if (g !== w) { console.error(`✗ ${a} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; } }
if (f) process.exit(1);
console.log('✓ price-suffix: 5 דוגמאות-חוזה — ירוק');
