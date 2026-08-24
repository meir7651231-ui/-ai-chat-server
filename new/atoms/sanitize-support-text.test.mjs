import { sanitizeSupportText } from './sanitize-support-text.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) קיצוץ שני הקצוות
ok(sanitizeSupportText('  שלום  ') === 'שלום', 'קיצוץ-קצוות');
// 2) חסר ⇒ ''
ok(sanitizeSupportText(null) === '', 'null ≠ ""');
ok(sanitizeSupportText(undefined) === '', 'undefined ≠ ""');
// 3) רווחים-בלבד ⇒ ''
ok(sanitizeSupportText('   ') === '', 'רווחים-בלבד ≠ ""');
// 4) פנימי נשמר, סופי מקוצץ (כולל \n)
ok(sanitizeSupportText('א \n ב') === 'א \n ב', 'רווח/שורה פנימיים לא נשמרו');
ok(sanitizeSupportText('אב\n\n') === 'אב', '\\n סופי לא קוצץ');
// 5) חיתוך לברירת-המחדל 2000
ok(sanitizeSupportText('x'.repeat(2500)).length === 2000, '2500 ⇒ 2000');
ok(sanitizeSupportText('x'.repeat(2000)).length === 2000, '2000 בדיוק נשמר');
// 6) קיצוץ לפני חיתוך + שקע מוזרק
ok(sanitizeSupportText(' אבגד', 3) === 'אבג', 'סדר קיצוץ→חיתוך (max=3)');

if (f) process.exit(1);
console.log('✓ sanitize-support-text: 6 דוגמאות-חוזה (שקע-תקרה) — ירוק');
