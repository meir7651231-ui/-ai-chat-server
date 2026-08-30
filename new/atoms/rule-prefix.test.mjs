import { rulePrefix as __pure_rulePrefix } from './rule-prefix.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_rule_prefix_T = {
  k1: 80,
};
const rulePrefix = (...a) => __pure_rulePrefix(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rule_prefix_T);
if (rulePrefix('כה','כהנ')!==80 || rulePrefix('הנ','כהנ')!==null) { console.error('✗'); process.exit(1); }
console.log('✓ rule-prefix — ירוק');
