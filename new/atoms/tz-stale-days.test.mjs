import * as m from './tz-stale-days.mjs';
const SNAP = {"TZ_STALE_DAYS":"90"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ tz-stale-days: צילום-ערך תואם — ירוק');
