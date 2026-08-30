import { ageOf as __pure_ageOf } from './age-of.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_age_of_T = {
  k1: 10,
};
const ageOf = (...a) => __pure_ageOf(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_age_of_T);
const NOW = new Date('2026-08-24T12:00:00');
const C=[['2000-08-24',26],['2000-08-25',25],['2000-08-23',26],['',null],['שבור',null]];
let f=0; for(const [b,w] of C){const g=ageOf(b,NOW); if(g!==w){console.error(`✗ ageOf(${b}) = ${g} ≠ ${w}`);f=1;}}
if(f)process.exit(1); console.log('✓ age-of: 5 דוגמאות-חוזה (שעון-מוזרק) — ירוק');
