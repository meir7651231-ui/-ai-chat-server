import { dayDiff as f } from './intel-day-diff.mjs';
// עצמאי (חוק-1: אפס import-אח; שקעים inline). Golden נלכד מהרצה.
const T='2026-08-26';

const WANT="[16,null,null,381]";
const got=JSON.stringify([f('2026-08-10',T),f('',T),f('bad',T),f('2025-08-10',T)]);
if(got!==WANT){console.error('✗ intel-day-diff\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ intel-day-diff: Golden — ירוק');
