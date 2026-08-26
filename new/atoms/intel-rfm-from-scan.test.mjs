import { rfmFromScan as f } from './intel-rfm-from-scan.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים inline). Golden נלכד מהרצה.
const T='2026-08-26';
const MS_DAY=86400000;
const dayDiff=(iso,today)=>{if(!iso)return Infinity;const a=Date.parse(iso.slice(0,10)+'T12:00:00'),b=Date.parse(today.slice(0,10)+'T12:00:00');if(Number.isNaN(a)||Number.isNaN(b))return Infinity;return Math.floor((b-a)/MS_DAY);};
const SCAN="{\"count\":4,\"ils\":565,\"first\":\"2025-08-10\",\"last\":\"2026-08-10\",\"monthly\":[0,0,185,0,0,0,0,0,100,0,0,200]}";
const WANT="{\"r\":350,\"f\":160,\"m\":140,\"score\":650,\"rPct\":100,\"fPct\":53,\"mPct\":40}";
const got=JSON.stringify(f(JSON.parse(SCAN),T,{dayDiff}));
if(got!==WANT){console.error('✗ intel-rfm-from-scan\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ intel-rfm-from-scan: Golden — ירוק');
