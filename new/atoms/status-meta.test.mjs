import * as m from './status-meta.mjs';
const SNAP = {"STATUS_META":"{\"active\":{\"label\":\"פעילה\",\"bg\":\"#e4f5ea\",\"c\":\"#12803c\"},\"pending\":{\"label\":\"ממתינה\",\"bg\":\"#fdf1d4\",\"c\":\"#9a6414\"},\"inactive\":{\"label\":\"לא פעילה\",\"bg\":\"#eceae2\",\"c\":\"#8b8474\"}}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ status-meta: צילום-ערך תואם — ירוק');
