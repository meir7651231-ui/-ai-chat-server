import { advanceStatus } from './advance-status.mjs';
const C = [
  ['pickup', 'enroute'],
  ['enroute', 'delivered'],
  ['delivered', 'delivered'],
  ['שטויות', 'delivered'],
  ['', 'delivered'],
];
let f = 0;
for (const [a, w] of C) {
  const g = advanceStatus(a);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ advance-status: 5 דוגמאות-חוזה — ירוק');
