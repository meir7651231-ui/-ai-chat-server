import { planWord } from './plan-word.mjs';
const C = [
  ['punch', 'כרטיסייה'],
  ['half_year', 'מנוי חצי-שנתי'],
  ['year', 'מנוי שנתי'],
  ['month', 'מנוי חודשי'],
  ['לא-קיים', 'מנוי חודשי'],
];
let f = 0;
for (const [a, w] of C) { const g = planWord(a); if (g !== w) { console.error(`✗ ${a} ⇒ ${g} ≠ ${w}`); f = 1; } }
if (f) process.exit(1);
console.log('✓ plan-word: 5 דוגמאות-חוזה — ירוק');
