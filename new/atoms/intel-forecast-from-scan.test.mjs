import { forecastFromScan as __pure_forecastFromScan } from './intel-forecast-from-scan.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_intel_forecast_from_scan_T = {
  k1: 86400000,
  k2: 365,
  k3: 10,
  k4: 15,
  k5: 92,
  k6: 30,
  k7: 25,
};
const f = (...a) => __pure_forecastFromScan(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_intel_forecast_from_scan_T);
// עצמאי (חוק-1: אפס import-אח; שקעים inline). Golden נלכד מהרצה.
const T='2026-08-26';
const MS_DAY=86400000;
const dayDiff=(iso,today)=>{if(!iso)return Infinity;const a=Date.parse(iso.slice(0,10)+'T12:00:00'),b=Date.parse(today.slice(0,10)+'T12:00:00');if(Number.isNaN(a)||Number.isNaN(b))return Infinity;return Math.floor((b-a)/MS_DAY);};
const SCAN="{\"count\":4,\"ils\":565,\"first\":\"2025-08-10\",\"last\":\"2026-08-10\",\"monthly\":[0,0,185,0,0,0,0,0,100,0,0,200]}";
const WANT="{\"amount\":141,\"dueIso\":\"2026-12-10\",\"confidence\":58}";
const got=JSON.stringify(f(JSON.parse(SCAN),T,{dayDiff}));
if(got!==WANT){console.error('✗ intel-forecast-from-scan\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ intel-forecast-from-scan: Golden — ירוק');
