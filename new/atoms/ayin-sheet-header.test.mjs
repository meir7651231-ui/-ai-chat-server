import * as m from './ayin-sheet-header.mjs';
const SNAP = {"AYIN_SHEET_HEADER":"[\"תומכת\",\"טלפון\",\"שם למסירה\",\"כמה עיניים\",\"נמסר (כן/לא)\",\"שולם (כן/לא)\",\"תשובה/הערה\",\"עופרת בוצעה (כן/לא)\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ ayin-sheet-header: צילום-ערך תואם — ירוק');
