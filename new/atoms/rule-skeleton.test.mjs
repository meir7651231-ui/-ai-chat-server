import { ruleSkeleton as __pure_ruleSkeleton } from './rule-skeleton.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_rule_skeleton_T = {
  k1: 58,
};
const ruleSkeleton = (...a) => __pure_ruleSkeleton(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_rule_skeleton_T);
if (ruleSkeleton('דויד','דוד')!==58 || ruleSkeleton('דנה','דוד')!==null || ruleSkeleton('123','דוד')!==null) { console.error('✗'); process.exit(1); }
console.log('✓ rule-skeleton — ירוק');
