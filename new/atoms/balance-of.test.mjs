import { balanceOf } from './balance-of.mjs';
// שקע paidOf — סוכם-payments אמיתי (כמו במקור)
const paidOf = (e) => (e.payments || []).reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount : 0), 0);
const pay = (...xs) => xs.map((amount) => ({ amount }));
const C = [
  [{ totalDue: 1000, payments: pay(300) }, 700],
  [{ totalDue: 200, payments: pay(150, 200) }, 0],
  [{ payments: pay(50) }, 0],
  [{ totalDue: 99.5, payments: [] }, 99.5],
  [{ totalDue: 500, payments: [] }, 500],
];
let f = 0;
for (const [e, w] of C) { const g = balanceOf(e, paidOf); if (g !== w) { console.error(`✗ ${JSON.stringify(e)} ⇒ ${g} ≠ ${w}`); f = 1; } }
if (f) process.exit(1); console.log('✓ balance-of: 5 דוגמאות-חוזה — ירוק');
