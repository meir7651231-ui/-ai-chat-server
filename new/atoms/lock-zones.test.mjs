import * as m from './lock-zones.mjs';
const SNAP = {"LOCK_ZONES":"[{\"key\":\"wizard\",\"label\":\"אשף ההרכבה\"},{\"key\":\"settings\",\"label\":\"הגדרות\"},{\"key\":\"supporters\",\"label\":\"תורמים\"},{\"key\":\"reports\",\"label\":\"דוחות\"}]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ lock-zones: צילום-ערך תואם — ירוק');
