import * as m from './tints.mjs';
const SNAP = {"TINTS":"[\"#f6ead1\",\"#e3eddc\",\"#dfe8f2\",\"#f2e0e4\",\"#e9dff0\",\"#ece8d9\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ tints: צילום-ערך תואם — ירוק');
