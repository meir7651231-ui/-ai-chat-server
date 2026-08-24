import { tourAdvance } from './tour-advance.mjs';
const C = [
  [0, 1, 15, 1], [5, -1, 15, 4], [0, -1, 15, 0],
  [14, 1, 15, null], [13, 1, 15, 14], [20, 1, 15, null],
];
let f = 0;
for (const [i, d, l, w] of C) { const g = tourAdvance(i, d, l); if (g !== w) { console.error(`✗ tourAdvance(${i},${d},${l}) = ${g} ≠ ${w}`); f = 1; } }
if (f) process.exit(1); console.log('✓ tour-advance: 6 דוגמאות-חוזה — ירוק');
