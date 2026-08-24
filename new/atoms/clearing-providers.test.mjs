import * as m from './clearing-providers.mjs';
const SNAP = {"CLEARING_PROVIDERS":"[\"נדרים\",\"סולה\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ clearing-providers: צילום-ערך תואם — ירוק');
