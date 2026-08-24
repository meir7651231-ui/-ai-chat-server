import * as m from './audit-categories.mjs';
const SNAP = {"AUDIT_CATEGORIES":"[\"כפילות\",\"ת\\\"ז\",\"טלפון\",\"אימייל\",\"כתובת\",\"לוגיקה\",\"ילדים\",\"קשר\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ audit-categories: צילום-ערך תואם — ירוק');
