import * as m from './sup-keyed-cols.mjs';
const SNAP = {"SUP_KEYED_COLS":"[\"supporters\",\"events\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ sup-keyed-cols: צילום-ערך תואם — ירוק');
