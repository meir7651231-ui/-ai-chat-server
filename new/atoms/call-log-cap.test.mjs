import * as m from './call-log-cap.mjs';
const SNAP = {"CALL_LOG_CAP":"200"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ call-log-cap: צילום-ערך תואם — ירוק');
