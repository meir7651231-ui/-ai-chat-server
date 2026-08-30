import { fmtDate as __pure_fmtDate } from './fmt-date.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_fmt_date_T = {
  k1: 10,
};
const fmtDate = (...a) => __pure_fmtDate(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_fmt_date_T);
const C=[['2026-08-24','24/08/2026'],['2026-08-24T12:00:00','24/08/2026'],['','—'],[null,'—'],['שטויות','—']];
let f=0; for(const [a,w] of C){const g=fmtDate(a); if(g!==w){console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`);f=1;}}
if(f)process.exit(1); console.log('✓ fmt-date: 5 דוגמאות-חוזה — ירוק (כפילות-4-המודולים סגורה)');
