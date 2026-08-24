import { dateInRange } from './date-in-range.mjs';
const C = [
  [['2026-08-24', '2026-08-01', '2026-08-31'], true],
  [['2026-08-01', '2026-08-01', '2026-08-31'], true],
  [['2026-08-31', '2026-08-01', '2026-08-31'], true],
  [['2026-07-31', '2026-08-01', '2026-08-31'], false],
  [['2026-09-01', '2026-08-01', '2026-08-31'], false],
  [['1999-01-01', '', '2026-08-31'], true],
  [['2999-01-01', '2026-08-01', ''], true],
  [['2026-08-24', '', ''], true],
];
let f = 0;
for (const [args, want] of C) {
  const got = dateInRange(...args);
  if (got !== want) { console.error(`✗ dateInRange(${args.join(',')}) = ${got} ≠ ${want}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ date-in-range: 8 בדיקות מ-7 דוגמאות-חוזה — ירוק');
