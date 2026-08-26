import { trendFromScan as f } from './intel-trend-from-scan.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים inline). Golden נלכד מהרצה.
const T='2026-08-26';
const SCAN="{\"count\":4,\"ils\":565,\"first\":\"2025-08-10\",\"last\":\"2026-08-10\",\"monthly\":[0,0,185,0,0,0,0,0,100,0,0,200]}";
const WANT="{\"dir\":\"up\",\"pct\":62}";
const got=JSON.stringify(f(JSON.parse(SCAN)));
if(got!==WANT){console.error('✗ intel-trend-from-scan\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ intel-trend-from-scan: Golden — ירוק');
