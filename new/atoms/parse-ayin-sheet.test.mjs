import { deepStrictEqual } from 'node:assert';
import { parseAyinSheet as __pure_parseAyinSheet } from './parse-ayin-sheet.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_parseAyinSheet_PARSE_AYIN_SHEET_T = {
  k1: "הקובץ ריק או לא בפורמט CSV",
  k2: "תומכת",
  k3: "תומך",
  k4: "שם למסירה",
  k5: "שם לעופרת",
  k6: "שם",
  k7: "עיניים",
  k8: "נמסר",
  k9: "שולם",
  k10: "תשלום",
  k11: "תשובה",
  k12: "הערה",
  k13: "עופרת",
  k14: "חסרות עמודות \"שם למסירה\" ו/או \"כמה עיניים\"",
};
const parseAyinSheet = (...a) => __pure_parseAyinSheet(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_parseAyinSheet_PARSE_AYIN_SHEET_T);

// מימוש-שקע לבדיקה: lowercase + הסרת כל הרווחים (רוח normName במקור).
const normName = (s) => String(s).toLowerCase().replace(/\s/g, '');

const sups = [
  { id: 's1', name: 'רחל כהן', ayin: { names: [{ id: 'n1', name: 'משה בן שרה' }, { id: 'n2', name: 'דוד' }] } },
];
const header = ['תומכת', 'שם למסירה', 'כמה עיניים', 'נמסר', 'שולם', 'תשובה', 'עופרת'];

// 1. פחות מ-2 שורות ⇒ שגיאת קובץ-ריק
deepStrictEqual(parseAyinSheet([header], sups, normName), {
  upds: [], miss: 0, error: 'הקובץ ריק או לא בפורמט CSV',
});

// 2. חסרה עמודת עיניים ⇒ שגיאת עמודות-חובה
deepStrictEqual(parseAyinSheet([['תומכת', 'שם למסירה'], ['רחל כהן', 'דוד']], sups, normName), {
  upds: [], miss: 0, error: 'חסרות עמודות "שם למסירה" ו/או "כמה עיניים"',
});

// 3. שורה מלאה — התאמת תומכת+שם, clean בולע רווח-כפול
deepStrictEqual(parseAyinSheet([header, ['רחל כהן', 'משה  בן שרה', '5', 'כן', '', '', '']], sups, normName), {
  upds: [{ supporterId: 's1', nameId: 'n1', eyes: 5, done: true, paid: null, answer: null, lead: null }],
  miss: 0,
});

// 4. תומכת ריקה ⇒ התאמת-שם בלבד · eyes=0 תקין · 'שולם' עובר yes · lead 'כן'
deepStrictEqual(parseAyinSheet([header, ['', 'דוד', '0', '', 'שולם', 'יש תשובה', 'כן']], sups, normName), {
  upds: [{ supporterId: 's1', nameId: 'n2', eyes: 0, done: null, paid: true, answer: 'יש תשובה', lead: true }],
  miss: 0,
});

// 5. שם לא-קיים ⇒ miss
deepStrictEqual(parseAyinSheet([header, ['רחל כהן', 'לא קיים', '3', '', '', '', '']], sups, normName), {
  upds: [], miss: 1,
});

// 6. שורה בלי שום ערך ⇒ מדולגת בשקט
deepStrictEqual(parseAyinSheet([header, ['רחל כהן', 'דוד', '', '', '', '', '']], sups, normName), {
  upds: [], miss: 0,
});

// 7. עיניים לא-ספרתיות ובלי ערך אחר ⇒ מדולגת
deepStrictEqual(parseAyinSheet([header, ['רחל כהן', 'דוד', 'אבג', '', '', '', '']], sups, normName), {
  upds: [], miss: 0,
});

console.log('✓ parse-ayin-sheet: 7 דוגמאות-חוזה (שקע normName) — ירוק');
