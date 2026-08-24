import * as m from './ayin-stages.mjs';
const SNAP = {"AYIN_STAGES":"[\"new\",\"lead\",\"eyes\",\"answer\",\"done\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ ayin-stages: צילום-ערך תואם — ירוק');
