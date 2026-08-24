import { timeHoursTotal } from './time-hours-total.mjs';
const C = [
  [{ time: [{ hours: 2 }, { hours: 3.5 }] }, 5.5],
  [{ time: [] }, 0],
  [{}, 0],
  [{ time: [{ hours: '4' }] }, 4],
  [{ time: [{ hours: 'שבור' }, { hours: 1 }] }, 1],
  [{ time: [{}] }, 0],
];
let f = 0;
for (const [a, w] of C) { const g = timeHoursTotal(a); if (g !== w) { console.error(`✗ timeHoursTotal(${JSON.stringify(a)}) = ${g} ≠ ${w}`); f = 1; } }
if (f) process.exit(1); console.log('✓ time-hours-total: 6 דוגמאות-חוזה — ירוק');
