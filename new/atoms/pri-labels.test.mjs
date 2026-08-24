import * as m from './pri-labels.mjs';
const SNAP = {"PRI_LABELS":"{\"1\":\"🔴 דחוף\",\"2\":\"🟡 רגיל\",\"3\":\"⚪ בהמשך\"}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ pri-labels: צילום-ערך תואם — ירוק');
