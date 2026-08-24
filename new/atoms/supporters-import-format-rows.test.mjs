import { supportersImportFormatRows } from './supporters-import-format-rows.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const HEADER = ['שם', 'טלפון', 'אימייל', 'ת"ז', 'כתובת', 'קטגוריה', 'עבור'];
// 1) ריק ⇒ כותרת בלבד
{
  const r = supportersImportFormatRows({ supporters: [] });
  ok(r.length === 1 && eq(r[0], HEADER), 'דוגמה 1');
}
// 2) תורם מלא — 7 תאים בסדר
{
  const r = supportersImportFormatRows({ supporters: [{ name: 'לוי', phone: '050-1234567', email: 'a@b.c', idNum: '123456789', address: 'ירושלים', cat: 'VIP', forWho: 'ישיבה' }] });
  ok(r.length === 2 && eq(r[1], ['לוי', '050-1234567', 'a@b.c', '123456789', 'ירושלים', 'VIP', 'ישיבה']), 'דוגמה 2');
}
// 3) שדה חסר עובר כ-undefined, אורך 7 נשמר
{
  const r = supportersImportFormatRows({ supporters: [{ name: 'כהן' }] });
  ok(r[1].length === 7 && r[1][0] === 'כהן' && r[1][1] === undefined && r[1][6] === undefined, 'דוגמה 3');
}
// 4) סדר-המערך נשמר
{
  const r = supportersImportFormatRows({ supporters: [{ name: 'א' }, { name: 'ב' }] });
  ok(r.length === 3 && r[1][0] === 'א' && r[2][0] === 'ב', 'דוגמה 4');
}
if (f) process.exit(1);
console.log('✓ supporters-import-format-rows: 4 דוגמאות-חוזה — ירוק');
