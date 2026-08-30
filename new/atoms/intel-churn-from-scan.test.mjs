import { churnFromScan as __pure_churnFromScan } from './intel-churn-from-scan.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_intel_churn_from_scan_T = {
  k1: 365,
  k2: 30,
  k3: 100,
  k4: 50,
};
const f = (...a) => __pure_churnFromScan(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_intel_churn_from_scan_T);
// עצמאי (חוק-1: אפס import-אח; שקעים inline). Golden נלכד מהרצה.
const T='2026-08-26';
const MS_DAY=86400000;
const dayDiff=(iso,today)=>{if(!iso)return Infinity;const a=Date.parse(iso.slice(0,10)+'T12:00:00'),b=Date.parse(today.slice(0,10)+'T12:00:00');if(Number.isNaN(a)||Number.isNaN(b))return Infinity;return Math.floor((b-a)/MS_DAY);};
const SCAN="{\"count\":4,\"ils\":565,\"first\":\"2025-08-10\",\"last\":\"2026-08-10\",\"monthly\":[0,0,185,0,0,0,0,0,100,0,0,200]}";
const WANT="4";
const got=JSON.stringify(f(JSON.parse(SCAN),T,{dayDiff}));
if(got!==WANT){console.error('✗ intel-churn-from-scan\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ intel-churn-from-scan: Golden — ירוק');
