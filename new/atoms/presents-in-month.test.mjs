import { presentsInMonth } from './presents-in-month.mjs';
const C = [
  [[['2026-08-01', '2026-08-24', '2026-07-31'], '2026-08-24'], 2],
  [[undefined, '2026-08-24'], 0],
  [[[], '2026-08-24'], 0],
  [[['2026-08-05', null, 7], '2026-08-24'], 1],
  [[['2025-08-10'], '2026-08-24'], 0],
];
let f = 0;
for (const [[p, t], w] of C) { const g = presentsInMonth(p, t); if (g !== w) { console.error(`✗ ${JSON.stringify(p)},${t} ⇒ ${g} ≠ ${w}`); f = 1; } }
if (f) process.exit(1);
console.log('✓ presents-in-month: 5 דוגמאות-חוזה — ירוק');
