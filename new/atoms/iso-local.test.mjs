import { isoLocal } from './iso-local.mjs';
const C = [
  [new Date(2026, 7, 24), '2026-08-24'],
  [new Date(2026, 0, 5), '2026-01-05'], // ריפוד חודש+יום
  [new Date(1999, 11, 31), '1999-12-31'],
  [new Date(2026, 2, 1, 23, 59), '2026-03-01'], // השעה נבלעת
  [new Date(2030, 8, 9), '2030-09-09'],
];
let f = 0;
for (const [a, w] of C) {
  const g = isoLocal(a);
  if (g !== w) { console.error(`✗ ${a} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ iso-local: 5 דוגמאות-חוזה — ירוק');
