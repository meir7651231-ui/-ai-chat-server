import { familiesImportFormatRows } from './families-import-format-rows.mjs';
let f = 0;
const eq = (a, b, msg) => { if (JSON.stringify(a) !== JSON.stringify(b)) { console.error(`✗ ${msg} ⇒ ${JSON.stringify(a)}`); f = 1; } };
const HDR = ['שם', 'ת"ז אב', 'טלפון', 'שם האם', 'ת"ז אם', 'טלפון 2', 'עיר', 'כתובת', '', 'אלמן', 'קהילה', '', 'הערות'];

// 1) ריק ⇒ כותרת בלבד, 13 תאים
const r1 = familiesImportFormatRows({ families: [] });
eq(r1, [HDR], 'כותרת שגויה');
if (r1[0].length !== 13) { console.error('✗ הכותרת אינה בת 13 תאים'); f = 1; }

// 2) משפחה מלאה, 'נשוי' ⇒ עמודת-אלמן ריקה
const fam2 = { name: 'כהן', fatherId: '123', phone: '050', mother: 'רחל', motherId: '456', phone2: '052', city: 'צפת', address: 'הר', maritalStatus: 'נשוי', community: 'חסידי', notes: 'הערה' };
eq(familiesImportFormatRows({ families: [fam2] })[1],
  ['כהן', '123', '050', 'רחל', '456', '052', 'צפת', 'הר', '', '', 'חסידי', '', 'הערה'], 'שורת-משפחה שגויה');

// 3) 'אלמנה' ⇒ 'אלמן' (הכלה)
eq(familiesImportFormatRows({ families: [{ maritalStatus: 'אלמנה' }] })[1][9], 'אלמן', 'אלמנה לא זוהתה');

// 4) maritalStatus חסר ⇒ '' בלי קריסה
eq(familiesImportFormatRows({ families: [{}] })[1][9], '', 'חסר-סטטוס קרס/שגוי');

// 5) שתי משפחות ⇒ 3 שורות, סדר-המקור
const r5 = familiesImportFormatRows({ families: [{ name: 'א' }, { name: 'ב' }] });
if (r5.length !== 3 || r5[1][0] !== 'א' || r5[2][0] !== 'ב') { console.error('✗ סדר/מספר שורות שגוי'); f = 1; }

if (f) process.exit(1);
console.log('✓ families-import-format-rows: 5 דוגמאות-חוזה — ירוק');
