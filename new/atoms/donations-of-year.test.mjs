import { donationsOfYear } from './donations-of-year.mjs';
const dates = (arr) => arr.map((d) => d.date);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const BASE = [{ date: '2026-07-07', amount: 100 }, { date: '2024-03-01' }, { date: '2026-01-05' }];
const C = [
  [BASE, '2026', ['2026-01-05', '2026-07-07']],
  [BASE, '2024', ['2024-03-01']],
  [BASE, '2025', []],
  [[{ date: '' }, {}, { date: '2026' }], '2026', []],
  [[{ date: '2026-12-31' }, { date: '2026-12-01' }], '2026', ['2026-12-01', '2026-12-31']],
];
let f = 0;
for (const [ds, y, w] of C) {
  const g = dates(donationsOfYear(ds, y));
  if (!eq(g, w)) { console.error(`✗ donationsOfYear(…, '${y}') = ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; }
}
// השדות עוברים כמו-שהם (amount נשמר)
if (donationsOfYear(BASE, '2026')[1].amount !== 100) { console.error('✗ שדות-התרומה לא נשמרו'); f = 1; }
if (f) process.exit(1);
console.log('✓ donations-of-year: 5 דוגמאות-חוזה + שימור-שדות — ירוק');
