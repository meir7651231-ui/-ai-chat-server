import * as m from './guide-intro.mjs';
const SNAP = {"GUIDE_INTRO":"\"אי אפשר לקלקל — הכל נשמר לבד · ↩ חזרה מחזיר אחורה · Esc סוגר כל חלון · אבודים? ⌕ חיפוש מוצא הכל (גם עם שגיאות כתיב) · ▶ הדמיה מראה את המערכת לבד.\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ guide-intro: צילום-ערך תואם — ירוק');
