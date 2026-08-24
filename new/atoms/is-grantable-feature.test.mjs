import { isGrantableFeature } from './is-grantable-feature.mjs';
const S = new Set(['supporters.delete', 'families.delete', 'courses.bulkadmin']);
const C = [
  ['supporters.delete', true],
  ['families.delete', true],
  ['supporters.export', false],
  ['', false],
  ['Supporters.Delete', false],
];
let f = 0;
for (const [a, w] of C) {
  const g = isGrantableFeature(a, S);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (f) process.exit(1);
console.log('✓ is-grantable-feature: 5 דוגמאות-חוזה — ירוק');
