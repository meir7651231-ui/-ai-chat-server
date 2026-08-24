import { priceSuffix } from './price-suffix.mjs';
const C = [
  ['half_year', 'לחצי שנה'],
  ['year', 'לשנה'],
  ['punch', ''],
  ['month', 'לחודש'],
  ['אחר', 'לחודש'],
];
let f = 0;
for (const [a, w] of C) { const g = priceSuffix(a); if (g !== w) { console.error(`✗ ${a} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`); f = 1; } }
if (f) process.exit(1);
console.log('✓ price-suffix: 5 דוגמאות-חוזה — ירוק');
