import { ayinSheetRows as __pure_ayinSheetRows, makeAYIN_SHEET_HEADER as __pure_makeAYIN_SHEET_HEADER } from './ayin-sheet-rows.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_ayin_sheet_rows_T = {
  k1: "תומכת",
  k2: "טלפון",
  k3: "שם למסירה",
  k4: "כמה עיניים",
  k5: "נמסר (כן/לא)",
  k6: "שולם (כן/לא)",
  k7: "תשובה/הערה",
  k8: "עופרת בוצעה (כן/לא)",
  k9: "eyes",
  k10: "answer",
  k11: "done",
  k12: "כן",
  k13: "לא",
};
const AYIN_SHEET_HEADER = __pure_makeAYIN_SHEET_HEADER(__d_ayin_sheet_rows_T);
const ayinSheetRows = (...a) => __pure_ayinSheetRows(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_ayin_sheet_rows_T);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
let f = 0;
const bad = (m) => { console.error('✗ ' + m); f = 1; };

// דוגמה 1 — ריק ⇒ כותרת בלבד, 8 עמודות
const r1 = ayinSheetRows([]);
if (!(r1.length === 1 && r1[0].length === 8 && eq(r1[0], AYIN_SHEET_HEADER))) bad('דוגמה 1: ריק ⇒ כותרת בלבד');

// דוגמה 2 — תומכת בלי ayin מדולגת
if (ayinSheetRows([{ name: 'בלי-תיק' }]).length !== 1) bad('דוגמה 2: בלי ayin ⇒ מדולגת');

// דוגמה 3 — שורה מלאה: פסיק→רווח, stage eyes ⇒ עופרת כן
const r3 = ayinSheetRows([{ name: 'רות', phone: '050-1', ayin: { stage: 'eyes', paid: true, answers: [{ note: 'שולם,מזומן' }], names: [{ name: 'דוד', eyes: 3, done: true }] } }]);
if (!eq(r3[1], ['רות', '050-1', 'דוד', '3', 'כן', 'כן', 'שולם מזומן', 'כן'])) bad('דוגמה 3: ' + JSON.stringify(r3[1]));

// דוגמה 4 — eyes=0⇒"0", eyes=''⇒'', אין answers ⇒ answeredNote, טלפון חסר ⇒ ''
const r4 = ayinSheetRows([{ name: 'לאה', ayin: { stage: 'new', paid: false, answers: [], answeredNote: 'אין מענה', names: [{ name: 'יוסי', eyes: 0, done: false }, { name: 'מרים', eyes: '', done: false }] } }]);
if (!eq(r4[1], ['לאה', '', 'יוסי', '0', 'לא', 'לא', 'אין מענה', 'לא'])) bad('דוגמה 4א: ' + JSON.stringify(r4[1]));
if (!eq(r4[2], ['לאה', '', 'מרים', '', 'לא', 'לא', 'אין מענה', 'לא'])) bad('דוגמה 4ב: ' + JSON.stringify(r4[2]));

// דוגמה 5 — answers[0] גוברת על answeredNote
const r5 = ayinSheetRows([{ name: 'א', ayin: { stage: 'done', paid: false, answers: [{ note: 'כן' }], answeredNote: 'ישן', names: [{ name: 'ב', eyes: 1, done: false }] } }]);
if (r5[1][6] !== 'כן') bad('דוגמה 5: answers[0] גוברת — ' + r5[1][6]);

if (f) process.exit(1);
console.log('✓ ayin-sheet-rows: 5 דוגמאות-חוזה — ירוק');
