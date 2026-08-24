import { reenrollCsvRows } from './reenroll-csv-rows.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const r1 = { memberName: 'דוד', familyName: 'כהן', courseName: 'ציור', summary: { presents: 12, absences: 2, balance: 150, statusLabel: 'פעיל' }, decision: 'yes', renewed: true, e: { renewNote: 'ממשיך בשמחה' } };
const r2 = { memberName: 'רות', familyName: 'לוי', courseName: 'מוזיקה', summary: { presents: 0, absences: 5, balance: -80, statusLabel: 'בסיכון' }, decision: 'hold', renewed: false, e: {} };

const R = reenrollCsvRows([r1, r2]);
ok(eq(R[0], ['תלמיד/ה', 'משפחה', 'חוג', 'נוכחות', 'חיסורים', 'יתרה ₪', 'סטטוס', 'החלטה', 'נרשם לשנה הבאה', 'הערה']), 'כותרת: ' + JSON.stringify(R[0]));
ok(eq(R[1], ['דוד', 'כהן', 'ציור', '12', '2', '150', 'פעיל', 'ממשיך', 'כן', 'ממשיך בשמחה']), 'שורה 1: ' + JSON.stringify(R[1]));
ok(eq(R[2], ['רות', 'לוי', 'מוזיקה', '0', '5', '-80', 'בסיכון', 'בהמתנה', '', '']), 'שורה 2: ' + JSON.stringify(R[2]));
// 'no' ⇒ 'לא ממשיך'; חסר ⇒ '':
ok(reenrollCsvRows([{ ...r2, decision: 'no' }])[1][7] === 'לא ממשיך', "decision 'no'");
ok(reenrollCsvRows([{ ...r2, decision: undefined }])[1][7] === '', 'decision חסר ⇒ ריק (לא "טרם הוחלט")');
// ריק ⇒ כותרת בלבד:
ok(reenrollCsvRows([]).length === 1, 'rows=[] ⇒ אורך 1');

if (f) process.exit(1);
console.log('✓ reenroll-csv-rows: 6 דוגמאות-חוזה — ירוק');
