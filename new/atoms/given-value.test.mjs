import { givenValue } from './given-value.mjs';
const live = (a) => a.redemptions.filter((r) => !r.voidedAt);
const C = [
  [[{ redemptions: [{ value: 100 }, { value: 40 }] }, { redemptions: [{ value: 60 }] }], 200, 'שני שיוכים חיים'],
  [[{ redemptions: [{ value: 80 }, { value: 500, voidedAt: '2026-08-01' }] }], 80, 'מבוטל מוחרג'],
  [[{ redemptions: [{ value: undefined }, { value: NaN }, { value: 25 }] }], 25, 'לא-מספרי נספר 0'],
  [[], 0, 'אין שיוכים'],
  [[{ redemptions: [{ value: 70, voidedAt: 'x' }] }], 0, 'הכול מבוטל'],
  [[{ redemptions: [{ value: 0 }, { value: 15 }] }], 15, 'value=0 חוקי'],
];
let f = 0;
for (const [assignments, want, msg] of C) {
  const got = givenValue(assignments, live);
  if (got !== want) { console.error(`✗ ${msg} ⇒ ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ given-value: 6 דוגמאות-חוזה — ירוק');
