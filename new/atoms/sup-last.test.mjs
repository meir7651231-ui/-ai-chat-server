import { supLast } from './sup-last.mjs';
const C = [
  [{ last: '2026-03-01' }, '2026-03-01'],
  [{ last: '2026-03-01', hist: [{ d: '2026-05-10' }, { d: '2025-01-01' }] }, '2026-05-10'],
  [{ last: '2026-06-01', hist: [{ d: '2026-05-10' }] }, '2026-06-01'],
  [{}, ''],
  [{ hist: [{ d: '2024-12-31' }] }, '2024-12-31'],
];
let f = 0;
for (const [sp, w] of C) {
  const g = supLast(sp);
  if (g !== w) { console.error(`✗ ${JSON.stringify(sp)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ sup-last: 5 דוגמאות-חוזה — ירוק');
