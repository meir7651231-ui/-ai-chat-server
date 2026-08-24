import { supDupFieldValue } from './sup-dup-field-value.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

const def = { key: 'phone', get: (s) => s.phone || '' };
const AB = [{ phone: 'A' }, { phone: 'B' }];

// 1) עריכה גוברת על הכול — גם כש-pick קיים
{
  ok(supDupFieldValue(AB, def, { phone: 1 }, { phone: '050-1111111' }) === '050-1111111',
    'edit גובר גם על pick');
}
// 2) עריכה ריקה = מחיקה מפורשת (!= null)
{
  ok(supDupFieldValue(AB, def, { phone: 1 }, { phone: '' }) === '',
    'מחרוזת ריקה ב-edit גוברת (מחיקה מכוונת)');
}
// 3) בחירה מצביעה על רשומה 1
{
  ok(supDupFieldValue(AB, def, { phone: 1 }, {}) === 'B', 'pick=1 ⇒ B');
}
// 4) אינדקס 0 הוא בחירה תקפה (?? ולא ||)
{
  ok(supDupFieldValue(AB, def, { phone: 0 }, {}) === 'A', 'pick=0 ⇒ A');
}
// 5) בלי pick ⇒ הראשונה עם ערך
{
  ok(supDupFieldValue([{ phone: '' }, { phone: 'C' }], def, {}, {}) === 'C',
    'בלי pick ⇒ הרשומה הראשונה שיש לה ערך');
}
// 6) אף אחת בלי ערך ⇒ נופל ל-sups[0] (findIndex=-1 ⇒ 0)
{
  ok(supDupFieldValue([{}, {}], def, {}, {}) === '', 'אף ערך ⇒ sups[0] ⇒ ריק');
}
if (f) process.exit(1);
console.log('✓ sup-dup-field-value: 6 דוגמאות-חוזה — ירוק (edit → pick → ראשונה-עם-ערך → sups[0])');
