import * as m from './grantable-staff-features.mjs';
const SNAP = {"GRANTABLE_STAFF_FEATURES":"{}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ grantable-staff-features: צילום-ערך תואם — ירוק');
