import { donationYears } from './donation-years.mjs';
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const C = [
  [[{ date: '2026-01-05' }, { date: '2024-03-01' }, { date: '2026-07-07' }], ['2026', '2024']],
  [[], []],
  [[{ date: '' }, {}, { date: 'שבור' }], []],
  [[{ date: '2023-12-31' }, { date: '2025-06-01' }, { date: '2024-01-01' }], ['2025', '2024', '2023']],
  [[{ date: '202X-01-01' }, { date: '2026-05-05' }], ['2026']],
];
let f = 0;
for (const [ds, w] of C) {
  const g = donationYears(ds);
  if (!eq(g, w)) { console.error(`✗ donationYears(${JSON.stringify(ds)}) = ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ donation-years: 5 דוגמאות-חוזה — ירוק');
