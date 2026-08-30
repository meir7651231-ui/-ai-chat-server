import { dayDiff as __pure_dayDiff } from './intel-day-diff.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_intel_day_diff_T = {
  k1: 86400000,
  k2: 10,
};
const f = (...a) => __pure_dayDiff(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_intel_day_diff_T);
// עצמאי (חוק-1: אפס import-אח; שקעים inline). Golden נלכד מהרצה.
const T='2026-08-26';

const WANT="[16,null,null,381]";
const got=JSON.stringify([f('2026-08-10',T),f('',T),f('bad',T),f('2025-08-10',T)]);
if(got!==WANT){console.error('✗ intel-day-diff\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ intel-day-diff: Golden — ירוק');
