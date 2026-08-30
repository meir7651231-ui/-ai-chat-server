import { rulePlural as __pure_rulePlural } from './rule-plural.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_rulePlural_RULE_PLURAL_T = {
  k1: "ימ",
  k2: "ות",
  k3: 70,
};
const rulePlural = (...a) => __pure_rulePlural(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rulePlural_RULE_PLURAL_T);
if (rulePlural('חוגימ','חוג')!==70 || rulePlural('חוג','חוגימ')!==null) { console.error('✗'); process.exit(1); }
console.log('✓ rule-plural — ירוק');
