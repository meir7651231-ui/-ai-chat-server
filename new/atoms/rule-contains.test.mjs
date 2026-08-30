import { ruleContains as __pure_ruleContains } from './rule-contains.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_rule_contains_T = {
  k1: 62,
};
const ruleContains = (...a) => __pure_ruleContains(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rule_contains_T);
if (ruleContains('הנ','כהנ')!==62 || ruleContains('ה','כהנ')!==null) { console.error('✗'); process.exit(1); }
console.log('✓ rule-contains — ירוק');
