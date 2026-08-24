import { inRange } from './in-range.mjs';
const C = [
  ['2026-08-24', { from: '2026-08-01', to: '2026-08-31' }, true],
  ['2026-07-31', { from: '2026-08-01', to: '' }, false],
  ['2026-09-01', { from: '', to: '2026-08-31' }, false],
  ['2026-08-01', { from: '2026-08-01', to: '2026-08-01' }, true],
  ['2026-01-01', { from: '', to: '' }, true],
  ['', { from: '', to: '' }, false],
];
let f = 0;
for (const [iso, r, w] of C) {
  const g = inRange(iso, r);
  if (g !== w) { console.error(`✗ (${JSON.stringify(iso)}, ${JSON.stringify(r)}) ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ in-range: 6 דוגמאות-חוזה — ירוק');
