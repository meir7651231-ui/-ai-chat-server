import { enrollSummary } from './enroll-summary.mjs';
// שקעים אמיתיים כסמנטיקת-maor (מקומיים לבדיקה — הבדיקה מייבאת רק את האטום שלה)
const paidOf = (e) => (e.payments || []).reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount : 0), 0);
const payBal = (e) => Math.max(0, (e.totalDue || 0) - paidOf(e));
const C = [
  [{ presents: ['2026-01-05', '2026-03-02', '2026-02-10'], absences: [{ date: '2026-01-12', noshow: true }, { date: '2026-02-03' }], payments: [{ amount: 200 }, { amount: 150 }], totalDue: 500, status: 'active' },
   { presents: 3, absences: 2, noshow: 1, balance: 150, paid: 350, statusLabel: 'פעיל', lastPresent: '2026-03-02' }],
  [{ status: 'wait' },
   { presents: 0, absences: 0, noshow: 0, balance: 0, paid: 0, statusLabel: 'רשימת-המתנה', lastPresent: '' }],
  [{ presents: [], absences: [], payments: [{ amount: 100 }], totalDue: 600, status: 'paused' },
   { presents: 0, absences: 0, noshow: 0, balance: 500, paid: 100, statusLabel: 'מושהה', lastPresent: '' }],
  [{ presents: ['2025-09-01'], payments: [{ amount: 400 }], totalDue: 400, status: 'ended' },
   { presents: 1, absences: 0, noshow: 0, balance: 0, paid: 400, statusLabel: 'הסתיים', lastPresent: '2025-09-01' }],
  [{ status: 'weird' },
   { presents: 0, absences: 0, noshow: 0, balance: 0, paid: 0, statusLabel: '', lastPresent: '' }],
];
let f = 0;
for (const [e, w] of C) {
  const g = enrollSummary(e, payBal, paidOf);
  if (JSON.stringify(g) !== JSON.stringify(w)) { console.error(`✗ ${JSON.stringify(e)} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ enroll-summary: 5 דוגמאות-חוזה — ירוק');
