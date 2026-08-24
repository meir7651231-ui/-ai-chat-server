import { deepStrictEqual, strictEqual } from 'node:assert';
import { parseSupporterGrid } from './parse-supporter-grid.mjs';

// מימושי-שקע לבדיקה — התנהגות מוצהרת-בחוזה (החוטים האמיתיים: sup-name-keys,
// parse-any-date, excel-serial-to-iso — מחווטים בקופסה).
const supNameKeys = ['שם', 'תורם'];
const parseAnyDate = (s) => (s === '09/08/26' ? '2026-08-09' : '');
const excelSerialToIso = (n) => (n === 45878 ? '2025-08-09' : '');
const run = (rows) => parseSupporterGrid(rows, supNameKeys, parseAnyDate, excelSerialToIso);

// 1. ריק ⇒ ריק
deepStrictEqual(run([]), []);

// 2. כותרות מלאות בשורה-1 — מיפוי לפי הכלה, אין hist
deepStrictEqual(run([
  ['שם', 'טלפון', 'אימייל', 'ת"ז', 'כתובת', 'קטגוריה', 'עבור'],
  ['דוד', '050', 'a@b', '123', 'רח 1', 'כללי', 'משה'],
]), [{ name: 'דוד', phone: '050', email: 'a@b', idNum: '123', address: 'רח 1', cat: 'כללי', forWho: 'משה' }]);

// 3. בלי כותרות — סדר-עמודות קבוע והשורה הראשונה נקלטת
deepStrictEqual(run([['דוד', '050', 'a@b', '1', 'כ', 'ק', 'ע']]),
  [{ name: 'דוד', phone: '050', email: 'a@b', idNum: '1', address: 'כ', cat: 'ק', forWho: 'ע' }]);

// 4. יצוא-סליקה עם שורות-פתיח — כותרת בשורה-3, hist מלא
const g4 = run([
  ['יצוא'],
  ['טווח'],
  ['שם', 'סכום', 'תאריך', 'מטבע', 'תשלומים', 'סטטוס', 'אסמכתא'],
  ['דוד', '1,234.567', '09/08/26 00:36', 'דולר', '3', 'שולם', 'REF1'],
]);
strictEqual(g4.length, 1);
deepStrictEqual(g4[0].hist, [{ d: '2026-08-09', a: 1234.57, c: '$', ref: 'REF1', pays: 3, status: 'שולם' }]);
strictEqual('brand' in g4[0].hist[0], false); // מטא שלא קיים — המפתח נעדר

// 5. תאריך כמספר-סריאל של Excel ⇒ המרה מסריאל
const g5 = run([
  ['שם', 'סכום', 'תאריך'],
  ['שרה', '100', '45878'],
]);
deepStrictEqual(g5[0].hist, [{ d: '2025-08-09', a: 100 }]);

// 6. עסקה פסולה (סכום 0 / תאריך שבור) ⇒ שורה בלי hist
const g6 = run([
  ['שם', 'סכום', 'תאריך'],
  ['דוד', '0', '09/08/26'],
  ['לוי', '50', 'אבג'],
]);
strictEqual(g6.length, 2);
strictEqual('hist' in g6[0], false);
strictEqual('hist' in g6[1], false);

// 7. סולק 'נדרים פלוס' ⇒ 'נדרים' · שורה עם שם ריק מדולגת
const g7 = run([
  ['שם', 'סכום', 'תאריך', 'סולק'],
  ['דוד', '50', '09/08/26', 'נדרים פלוס'],
  ['', '10', '09/08/26', ''],
]);
strictEqual(g7.length, 1);
deepStrictEqual(g7[0].hist, [{ d: '2026-08-09', a: 50, clearer: 'נדרים' }]);

console.log('✓ parse-supporter-grid: 7 דוגמאות-חוזה (שקעים supNameKeys/parseAnyDate/excelSerialToIso) — ירוק');
