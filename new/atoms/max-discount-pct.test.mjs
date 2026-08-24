import { maxDiscountPct } from './max-discount-pct.mjs';
let f = 0;
const eq = (a, w, msg) => { if (a !== w) { console.error(`✗ ${msg} ⇒ ${a} ≠ ${w}`); f = 1; } };

const criteria = [
  { id: 'c1', discountPct: 10 },
  { id: 'c2', discountPct: 25 },
  { id: 'c3', discountPct: 150 },
  { id: 'c4', discountPct: NaN },
];

eq(maxDiscountPct(['c1', 'c2'], criteria), 25, 'הגבוה מנצח (לא מצטבר)');
eq(maxDiscountPct(['c1'], criteria), 10, 'קריטריון יחיד');
eq(maxDiscountPct(['zzz'], criteria), 0, 'מזהה לא-קיים');
eq(maxDiscountPct(['c3'], criteria), 100, 'חיתוך-תקרה 150⇒100');
eq(maxDiscountPct(['c4', 'c1'], criteria), 10, 'NaN מדולג');
eq(maxDiscountPct([], criteria), 0, 'רשימה ריקה');
eq(maxDiscountPct(['c1'], [{ id: 'c1', discountPct: -30 }]), 0, 'שלילי ⇒ רצפת-0');

if (f) process.exit(1);
console.log('✓ max-discount-pct: 7 דוגמאות-חוזה — ירוק');
