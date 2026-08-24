import { isRenewed } from './is-renewed.mjs';
const C = [
  [{ renewedToId: 'enr_2027_15' }, true],
  [{}, false],
  [{ renewedToId: '' }, false],
  [{ renewedToId: undefined }, false],
  [{ renewedToId: 'x', status: 'ended' }, true],
];
let f = 0;
for (const [a, w] of C) {
  const g = isRenewed(a);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ is-renewed: 5 דוגמאות-חוזה — ירוק');
