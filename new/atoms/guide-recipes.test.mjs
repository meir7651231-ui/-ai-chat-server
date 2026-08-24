import * as m from './guide-recipes.mjs';
const SNAP = {"GUIDE_RECIPES":"\"תשלום + קבלה ← ⚙ ליד השיבוץ ← 💳 ← ＋ קבלת תשלום · ניקוב ← כפתור \\\"ניקוב\\\" בכרטיס · משפחה חדשה תוך כדי שיבוץ ← \\\"לא נמצא/ה במערכת?\\\" · חוג מתאים לילד ← ✦ מצא חוג · תרומה ← תומכות ← לחיצה על השם ← ＋ תרומה · רשימה למורה ← החוג ← ⬇ תדפיס למורה · גיבוי ← הגדרות ← גיבוי מלא.\""};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ guide-recipes: צילום-ערך תואם — ירוק');
