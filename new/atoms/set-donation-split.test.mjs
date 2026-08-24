import { setDonationSplit } from './set-donation-split.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) הדלקה ⇒ true
{
  ok(setDonationSplit(true) === true, 'הדלקת-פיצול חייבת להחזיר true');
}
// 2) כיבוי מפורש ⇒ false
{
  ok(setDonationSplit(false) === false, 'כיבוי-פיצול חייב להחזיר false');
}
// 3) עובר כמות-שהוא, בלי כפייה — typeof boolean כששולחים boolean
{
  const out = setDonationSplit(true);
  ok(typeof out === 'boolean', 'הפלט חייב להישאר boolean כששולחים boolean');
}
// 4) דטרמיניסטי וחסר-מצב — שתי קריאות זהות, אותו ערך
{
  ok(setDonationSplit(true) === setDonationSplit(true), 'שתי קריאות זהות חייבות להחזיר אותו ערך');
  ok(setDonationSplit(false) === setDonationSplit(false), 'אין מצב שדולף בין קריאות');
}
if (f) process.exit(1);
console.log('✓ set-donation-split: 4 דוגמאות-חוזה — ירוק (טהור; ההשמה = חיווט-קופסה)');
