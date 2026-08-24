import { payCredit } from './pay-credit.mjs';
// שקע: paidOf אמיתי כמוסכמת-maor (מקומי לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const paidOf = (e) => (e.payments || []).reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount : 0), 0);
const E = (pays, due, carry) => ({ payments: pays.map((a) => ({ amount: a })), totalDue: due, carryBalance: carry });
const C = [
  [E([500], 300, 0), 200],
  [E([300], 300, 0), 0],
  [E([100], 300, 0), 0],
  [E([500], 300, -100), 300],
  [E([500], 300, 100), 100],
  [E([], 0, 0), 0],
  [E([200], 0, 0), 200],
];
let f = 0;
for (const [e, w] of C) {
  const g = payCredit(e, paidOf);
  if (g !== w) { console.error(`✗ ${JSON.stringify(e)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ pay-credit: 7 דוגמאות-חוזה — ירוק');
