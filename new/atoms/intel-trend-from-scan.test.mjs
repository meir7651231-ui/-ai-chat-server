import { trendFromScan as __pure_trendFromScan } from './intel-trend-from-scan.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_trendFromScan_INTEL_TREND_FROM_SCAN_T = {
  k1: "flat",
  k2: "down",
  k3: 100,
};
const f = (...a) => __pure_trendFromScan(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_trendFromScan_INTEL_TREND_FROM_SCAN_T);
// עצמאי (חוק-1: אפס import-אח; שקעים inline). Golden נלכד מהרצה.
const T='2026-08-26';
const SCAN="{\"count\":4,\"ils\":565,\"first\":\"2025-08-10\",\"last\":\"2026-08-10\",\"monthly\":[0,0,185,0,0,0,0,0,100,0,0,200]}";
const WANT="{\"dir\":\"up\",\"pct\":62}";
const got=JSON.stringify(f(JSON.parse(SCAN)));
if(got!==WANT){console.error('✗ intel-trend-from-scan\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ intel-trend-from-scan: Golden — ירוק');
