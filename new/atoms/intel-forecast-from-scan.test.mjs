import { forecastFromScan as f } from './intel-forecast-from-scan.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים inline). Golden נלכד מהרצה.
const T='2026-08-26';
const MS_DAY=86400000;
const dayDiff=(iso,today)=>{if(!iso)return Infinity;const a=Date.parse(iso.slice(0,10)+'T12:00:00'),b=Date.parse(today.slice(0,10)+'T12:00:00');if(Number.isNaN(a)||Number.isNaN(b))return Infinity;return Math.floor((b-a)/MS_DAY);};
const SCAN="{\"count\":4,\"ils\":565,\"first\":\"2025-08-10\",\"last\":\"2026-08-10\",\"monthly\":[0,0,185,0,0,0,0,0,100,0,0,200]}";
const WANT="{\"amount\":141,\"dueIso\":\"2026-12-10\",\"confidence\":58}";
const got=JSON.stringify(f(JSON.parse(SCAN),T,{dayDiff}));
if(got!==WANT){console.error('✗ intel-forecast-from-scan\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ intel-forecast-from-scan: Golden — ירוק');
