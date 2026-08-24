import { boxTotal } from './box-total.mjs';
const C = [
  [{ collections: [{ amount: 100 }, { amount: 50 }] }, 150],
  [{ collections: [] }, 0],
  [{ collections: [{ amount: 100 }, { amount: NaN }, { amount: '50' }, { amount: Infinity }] }, 100],
  [{ collections: [{ amount: -30 }, { amount: 100 }] }, 70],
  [{ collections: [{ amount: 0.5 }, { amount: 0.25 }] }, 0.75],
];
let f = 0;
for (const [box, w] of C) {
  const g = boxTotal(box);
  if (g !== w) { console.error(`✗ ${JSON.stringify(box)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ box-total: 5 דוגמאות-חוזה — ירוק');
