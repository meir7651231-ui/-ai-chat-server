import { planWord as __pure_planWord } from './plan-word.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_planWord_PLAN_WORD_T = {
  k1: "punch",
  k2: "כרטיסייה",
  k3: "half_year",
  k4: "מנוי חצי-שנתי",
  k5: "year",
  k6: "מנוי שנתי",
  k7: "מנוי חודשי",
};
const planWord = (...a) => __pure_planWord(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_planWord_PLAN_WORD_T);
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
