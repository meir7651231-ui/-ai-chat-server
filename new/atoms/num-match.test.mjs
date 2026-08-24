import { numMatch } from './num-match.mjs';
const C = [
  ['3', 3, true], ['3', 4, false],
  ['3+', 5, true], ['3 +', 3, true], ['3+', 2, false],
  ['2-4', 3, true], ['2 - 4', 2, true], ['2-4', 5, false],
  ['', 7, true], [null, 7, true],
  ['אבג', 0, true],
];
let f = 0;
for (const [q, n, w] of C) {
  const g = numMatch(q, n);
  if (g !== w) { console.error(`✗ numMatch(${JSON.stringify(q)}, ${n}) = ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ num-match: 11 דוגמאות-חוזה — ירוק');
