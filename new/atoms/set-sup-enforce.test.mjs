import { setSupEnforce } from './set-sup-enforce.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) הדלקת-אכיפה ⇒ true
{
  ok(setSupEnforce(true) === true, 'הדלקת-אכיפה חייבת להחזיר true');
}
// 2) כיבוי מפורש ⇒ false (ברירת-המחדל הדורמנטית)
{
  ok(setSupEnforce(false) === false, 'כיבוי-אכיפה חייב להחזיר false');
}
// 3) עובר כמות-שהוא — typeof boolean כששולחים boolean
{
  ok(typeof setSupEnforce(true) === 'boolean', 'הפלט חייב להישאר boolean כששולחים boolean');
}
// 4) דטרמיניסטי וחסר-מצב
{
  ok(setSupEnforce(true) === setSupEnforce(true), 'קריאות חוזרות חייבות להחזיר אותו ערך');
  ok(setSupEnforce(false) === setSupEnforce(false), 'אין מצב שדולף בין קריאות');
}
if (f) process.exit(1);
console.log('✓ set-sup-enforce: 4 דוגמאות-חוזה — ירוק (טהור; ההשמה = חיווט-קופסה)');
