import * as m from './status-label.mjs';
const SNAP = {"STATUS_LABEL":"{\"active\":\"פעילה\",\"pending\":\"ממתינה\",\"inactive\":\"לא פעילה\"}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ status-label: צילום-ערך תואם — ירוק');
