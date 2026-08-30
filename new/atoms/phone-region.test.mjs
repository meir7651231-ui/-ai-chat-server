import { phoneRegion as __pure_phoneRegion } from './phone-region.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_phoneRegion_PHONE_REGION_T = {
  k1: "intl",
};
const phoneRegion = (...a) => __pure_phoneRegion(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_phoneRegion_PHONE_REGION_T);
const C = [
  ['', 'il'],
  ['0521234567', 'il'],
  ['050-123-4567', 'il'],
  ['+972521234567', 'il'],
  ['00972521234567', 'il'],
  ['521234567', 'il'],
  ['+15551234567', 'intl'],
  ['0015551234567', 'intl'],
  ['1234567', 'intl'],
];
let f = 0;
for (const [a, w] of C) {
  const g = phoneRegion(a);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (phoneRegion(null) !== 'il') { console.error('✗ null היה אמור לתת "il"'); f = 1; }
if (f) process.exit(1);
console.log('✓ phone-region: 9 דוגמאות-חוזה + null — ירוק');
