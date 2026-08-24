// בדיקת-חוזה · hok-monthly-total — מוכיחה את 5 דוגמאות-החוזה. מייבאת רק את האטום-שלה.
import { hokMonthlyTotal } from './hok-monthly-total.mjs';

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// 1) בלי todayIso — לפי הדגל; דולר בשער 3.7
const list1 = [
  { hok: { active: true, amount: 100, cur: '₪' } },
  { hok: { active: true, amount: 10, cur: '$' } },
  { hok: { active: false, amount: 500, cur: '₪' } },
];
ok(hokMonthlyTotal(list1, 3.7) === 137, 'דוגמה 1 ≠ 137');
// 2) עיגול הסכום הכולל
ok(hokMonthlyTotal([{ hok: { active: true, amount: 10, cur: '$' } }], 3.685) === 37, '36.85 לא עוגל ל-37');
// 3) cur חסר ⇒ ש"ח
ok(hokMonthlyTotal([{ hok: { active: true, amount: 80 } }], 3.7) === 80, 'cur חסר ≠ 80');
// 4) ריק / כולם-כבויים
ok(hokMonthlyTotal([], 3.7) === 0, '[] ≠ 0');
ok(hokMonthlyTotal([{ hok: { active: false, amount: 90, cur: '₪' } }], 3.7) === 0, 'כולם-כבויים ≠ 0');
// 5) עם todayIso — השקע מנכה הו"ק שפגה; בלעדיו — לא נקרא
const sock = (sp) => sp.hok?.kevaId !== 'פג';
const list5 = [
  { hok: { active: true, amount: 200, cur: '₪', kevaId: 'פג' } },
  { hok: { active: true, amount: 50, cur: '₪' } },
];
ok(hokMonthlyTotal(list5, 3.7, '2026-08-24', sock) === 50, 'עם todayIso ≠ 50 (הפגה לא נוכתה)');
ok(hokMonthlyTotal(list5, 3.7) === 250, 'בלי todayIso ≠ 250');
// והוכחה שהשקע לא נקרא בלי todayIso:
let called = 0;
hokMonthlyTotal(list5, 3.7, undefined, () => { called++; return true; });
ok(called === 0, 'השקע נקרא למרות שאין todayIso');

if (f) process.exit(1);
console.log('✓ hok-monthly-total: 5 דוגמאות-חוזה — ירוק');
