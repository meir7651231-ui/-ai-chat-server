import { warehouseValue } from './warehouse-value.mjs';
const C = [
  [[{ qty: 10, cost: 50 }], 500],
  [[{ qty: 10, cost: 50 }, { qty: 3, cost: 19.9 }], 560], // עיגול-בסוף: 559.7 ⇒ 560
  [[{ qty: 3 }], 0], // בלי cost
  [[{ qty: '2', cost: '7' }], 14], // קידום-מספרי של מחרוזות
  [[{ qty: 'x', cost: 50 }], 0], // לא-מספרי ⇒ 0
  [[], 0],
];
let f = 0;
for (const [wh, w] of C) {
  const g = warehouseValue(wh);
  if (g !== w) { console.error(`✗ ${JSON.stringify(wh)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ warehouse-value: 6 דוגמאות-חוזה — ירוק');
