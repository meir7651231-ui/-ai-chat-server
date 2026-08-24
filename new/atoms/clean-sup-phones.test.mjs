import { cleanSupPhones } from './clean-sup-phones.mjs';
const id = (s) => s;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const C = [
  [undefined, id, []],
  [[], id, []],
  [[{ num: '  0501234567  ', label: 'בית' }], id, [{ num: '0501234567', label: 'בית' }]],
  [[{ num: '' }, { num: '0522222222' }], id, [{ num: '0522222222' }]],
  [[{ num: '   ' }], id, []],
  [[{ num: '050-123', label: 'x' }], (s) => s.replace(/-/g, ''), [{ num: '050123', label: 'x' }]],
];
let f = 0;
for (const [a, fx, w] of C) { const g = cleanSupPhones(a, fx); if (!eq(g, w)) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${JSON.stringify(g)}`); f = 1; } }
if (f) process.exit(1);
console.log('✓ clean-sup-phones: 6 דוגמאות-חוזה — ירוק');
