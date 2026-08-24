import { phoneRegion } from './phone-region.mjs';
const C = [
  ['', 'il'],
  ['0521234567', 'il'],
  ['050-123-4567', 'il'],
  ['+972521234567', 'il'],
  ['00972521234567', 'il'],
  ['521234567', 'il'],
  ['+15551234567', 'intl'],
  ['0015551234567', 'intl'],
  ['1234567', 'intl'],
];
let f = 0;
for (const [a, w] of C) {
  const g = phoneRegion(a);
  if (g !== w) { console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`); f = 1; }
}
if (phoneRegion(null) !== 'il') { console.error('✗ null היה אמור לתת "il"'); f = 1; }
if (f) process.exit(1);
console.log('✓ phone-region: 9 דוגמאות-חוזה + null — ירוק');
