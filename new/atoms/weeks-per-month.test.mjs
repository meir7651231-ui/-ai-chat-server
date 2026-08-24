import * as m from './weeks-per-month.mjs';
const SNAP = {"WEEKS_PER_MONTH":"4.333333333333333"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ weeks-per-month: צילום-ערך תואם — ירוק');
