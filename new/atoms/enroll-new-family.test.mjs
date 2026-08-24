import * as m from './enroll-new-family.mjs';
const SNAP = {"ENROLL_NEW_FAMILY":"\"__new\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ enroll-new-family: צילום-ערך תואם — ירוק');
