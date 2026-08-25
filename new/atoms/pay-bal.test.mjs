import { payBal } from './pay-bal.mjs';
// שקע paidOf כחוזה paid-of: סכימת payments, לא-סופי נספר 0.
const paidOf = (e) => (e.payments || []).reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount : 0), 0);
let f = 0;
if (payBal({ totalDue: 500, payments: [{ amount: 100 }, { amount: 50 }] }, paidOf) !== 350) { console.error('✗ 1 יתרה בסיסית'); f = 1; }
if (payBal({ totalDue: 200, payments: [{ amount: 200 }] }, paidOf) !== 0) { console.error('✗ 2 שולם-במלואו'); f = 1; }
if (payBal({ totalDue: 100, payments: [{ amount: 150 }] }, paidOf) !== 0) { console.error('✗ 3 שולם-יתר לא שלילי'); f = 1; }
if (payBal({ payments: [{ amount: 50 }] }, paidOf) !== 0) { console.error('✗ 4 בלי totalDue'); f = 1; }
if (payBal({ totalDue: 300, payments: [] }, paidOf) !== 300) { console.error('✗ 5 אפס תשלומים'); f = 1; }
// carryBalance (25.8) — יתרת-אשתקד נישאת קדימה:
if (payBal({ totalDue: 500, carryBalance: 100, payments: [{ amount: 150 }] }, paidOf) !== 450) { console.error('✗ 6 חוב-מועבר חיובי (500+100-150)'); f = 1; }
if (payBal({ totalDue: 300, carryBalance: -100, payments: [] }, paidOf) !== 200) { console.error('✗ 7 זכות-מועברת שלילית (300-100)'); f = 1; }
if (payBal({ totalDue: 100, carryBalance: -300, payments: [] }, paidOf) !== 0) { console.error('✗ 8 זכות מעל החוב ⇒ 0'); f = 1; }
if (f) process.exit(1);
console.log('✓ pay-bal: 8 דוגמאות-חוזה — ירוק');
