import { enrollmentPaidStatus } from './enrollment-paid-status.mjs';
// שקעים אמיתיים כסמנטיקת-maor (מקומיים לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const paidOf = (e) => (e.payments || []).reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount : 0), 0);
const payBal = (e) => Math.max(0, (e.totalDue || 0) - paidOf(e));
const C = [
  [{ paidFull: true }, 'paid'],
  [{ totalDue: 500, payments: [{ amount: 300 }, { amount: 200 }] }, 'paid'],
  [{ totalDue: 500, payments: [{ amount: 200 }] }, 'partial'],
  [{ totalDue: 500, payments: [] }, 'unpaid'],
  [{ payments: [{ amount: 100 }] }, 'unpaid'],
  [{ totalDue: 0, paidFull: false }, 'unpaid'],
];
let f = 0;
for (const [e, w] of C) {
  const g = enrollmentPaidStatus(e, payBal, paidOf);
  if (g !== w) { console.error(`✗ ${JSON.stringify(e)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ enrollment-paid-status: 6 דוגמאות-חוזה — ירוק');
