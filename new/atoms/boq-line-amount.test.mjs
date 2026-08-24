import { boqLineAmount } from './boq-line-amount.mjs';
const C = [
  [{ eyes: 3, rate: 250 }, 750],
  [{ eyes: '4', rate: 2.5 }, 10],
  [{ eyes: '', rate: 100 }, 0],
  [{ eyes: 5 }, 0],
  [{ eyes: 0, rate: 80 }, 0],
  [{ eyes: 'אבג', rate: 10 }, 0],
];
let f = 0;
for (const [n, w] of C) { const g = boqLineAmount(n); if (g !== w) { console.error(`✗ ${JSON.stringify(n)} ⇒ ${g} ≠ ${w}`); f = 1; } }
if (f) process.exit(1); console.log('✓ boq-line-amount: 6 דוגמאות-חוזה — ירוק');
