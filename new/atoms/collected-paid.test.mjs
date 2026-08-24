import { collectedPaid } from './collected-paid.mjs';
const live = (a) => a.redemptions.filter((r) => !r.voidedAt);
const C = [
  [[{ redemptions: [{ paid: 10 }, { paid: 20 }] }, { redemptions: [{ paid: 5 }] }], 35, 'שני שיוכים חיים'],
  [[{ redemptions: [{ paid: 10 }, { paid: 50, voidedAt: '2026-08-01' }] }], 10, 'מבוטל מוחרג'],
  [[{ redemptions: [{ paid: undefined }, { paid: NaN }, { paid: 7 }] }], 7, 'לא-מספרי נספר 0'],
  [[], 0, 'אין שיוכים'],
  [[{ redemptions: [{ paid: 9, voidedAt: 'x' }] }], 0, 'הכול מבוטל'],
  [[{ redemptions: [{ paid: 0 }, { paid: 12 }] }], 12, 'paid=0 חוקי'],
];
let f = 0;
for (const [assignments, want, msg] of C) {
  const got = collectedPaid(assignments, live);
  if (got !== want) { console.error(`✗ ${msg} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ collected-paid: 6 דוגמאות-חוזה — ירוק');
