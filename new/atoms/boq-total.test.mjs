import { boqTotal } from './boq-total.mjs';
// שקע boqLineAmount — סוכם-השורה האמיתי (העתק-חוזה של האטום-האחות)
const boqLineAmount = (n) => (+n.eyes || 0) * (n.rate || 0);
const C = [
  [{ names: [{ eyes: 2, rate: 100 }, { eyes: 3, rate: 50 }] }, 350],
  [{ names: [] }, 0],
  [{ names: [{ eyes: '4', rate: 2.5 }] }, 10],
  [{ names: [{ eyes: 5 }, { eyes: 1, rate: 99 }] }, 99],
  [{ names: [{ eyes: '', rate: 1000 }, { eyes: 0, rate: 7 }] }, 0],
];
let f = 0;
for (const [a, w] of C) { const g = boqTotal(a, boqLineAmount); if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; } }
if (f) process.exit(1); console.log('✓ boq-total: 5 דוגמאות-חוזה — ירוק');
