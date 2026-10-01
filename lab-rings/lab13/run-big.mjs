import { work } from './tzoref.mjs'; import { goals } from './tzoref-goals.mjs';
const names=Object.keys(goals()).filter(n=>/^[מר]\d+ /.test(n)); await work({names,baseMs:60000,minutes:2}); process.exit(0);
