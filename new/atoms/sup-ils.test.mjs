import { supIls } from './sup-ils.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) המונה השמור בלבד
{
  ok(supIls({ ils: 100 }) === 100, 'ils=100 בלי hist ⇒ 100');
}
// 2) hist נוסף; שורת-$ מוחרגת
{
  ok(supIls({ ils: 100, hist: [{ a: 50, c: '₪' }, { a: 30, c: '$' }] }) === 150,
    '100+50₪ (ה-30$ מוחרג) ⇒ 150');
}
// 3) הכול חסר ⇒ 0
{
  ok(supIls({}) === 0, 'ils חסר + hist חסר ⇒ 0');
}
// 4) שורה בלי c נספרת כשקלית
{
  ok(supIls({ hist: [{ a: 70 }] }) === 70, 'c חסר ⇒ נספר ₪ ⇒ 70');
}
// 5) כולה דולרים ⇒ אפס ₪
{
  ok(supIls({ ils: 0, hist: [{ a: 25, c: '$' }] }) === 0, 'רק $ ⇒ 0');
}
if (f) process.exit(1);
console.log('✓ sup-ils: 5 דוגמאות-חוזה — ירוק (₪ כולל היסטוריה; $ מוחרג)');
