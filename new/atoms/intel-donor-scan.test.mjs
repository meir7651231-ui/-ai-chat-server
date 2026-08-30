import { donorScan as __pure_donorScan } from './intel-donor-scan.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_intel_donor_scan_T = {
  k1: 12,
};
const f = (...a) => __pure_donorScan(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_intel_donor_scan_T);
// עצמאי (חוק-1: אפס import-אח; שקעים inline). Golden נלכד מהרצה.
const T='2026-08-26';
const SP={donations:[{date:'2026-08-10',amount:200,cur:'₪'},{date:'2026-05-10',amount:100,cur:'₪'},{date:'2025-11-10',amount:50,cur:'$'}],hist:[{d:'2025-08-10',a:80,c:'₪'}]};
const WANT="{\"count\":4,\"ils\":565,\"first\":\"2025-08-10\",\"last\":\"2026-08-10\",\"monthly\":[0,0,185,0,0,0,0,0,100,0,0,200]}";
const got=JSON.stringify(f(SP,T,3.7,12));
if(got!==WANT){console.error('✗ intel-donor-scan\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ intel-donor-scan: Golden — ירוק');
