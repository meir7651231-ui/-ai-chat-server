import * as m from './sup-name-keys.mjs';
const SNAP = {"SUP_NAME_KEYS":"[\"שם\",\"תורם\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ sup-name-keys: צילום-ערך תואם — ירוק');
