import * as m from './punch-confirm-ms.mjs';
const SNAP = {"PUNCH_CONFIRM_MS":"3000"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ punch-confirm-ms: צילום-ערך תואם — ירוק');
