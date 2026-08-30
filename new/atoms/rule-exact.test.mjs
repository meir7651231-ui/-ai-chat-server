import { ruleExact as __pure_ruleExact } from './rule-exact.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_rule_exact_T = {
  k1: 100,
};
const ruleExact = (...a) => __pure_ruleExact(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rule_exact_T);
if (ruleExact('כהנ','כהנ')!==100 || ruleExact('כה','כהנ')!==null) { console.error('✗'); process.exit(1); }
console.log('✓ rule-exact — ירוק');
