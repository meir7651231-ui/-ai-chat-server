import * as m from './sup-dup-fields.mjs';
const SNAP = {"SUP_DUP_FIELDS":"[{\"key\":\"name\",\"label\":\"שם\"},{\"key\":\"phone\",\"label\":\"טלפון\"},{\"key\":\"email\",\"label\":\"אימייל\"},{\"key\":\"idNum\",\"label\":\"ת\\\"ז\"},{\"key\":\"city\",\"label\":\"עיר\"},{\"key\":\"address\",\"label\":\"כתובת\"},{\"key\":\"cat\",\"label\":\"קטגוריה\"},{\"key\":\"forWho\",\"label\":\"ייעוד\"},{\"key\":\"notes\",\"label\":\"הערות\"}]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ sup-dup-fields: צילום-ערך תואם — ירוק');
