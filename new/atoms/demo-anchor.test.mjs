import * as m from './demo-anchor.mjs';
const SNAP = {"DEMO_ANCHOR":"\"2026-08-02\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ demo-anchor: צילום-ערך תואם — ירוק');
