import { cooldownForFails as __pure_cooldownForFails } from './cooldown-for-fails.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_cooldown_for_fails_T = {
  k1: 30000,
  k2: 15000,
  k3: 5000,
};
const cooldownForFails = (...a) => __pure_cooldownForFails(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_cooldown_for_fails_T);
const C = [[0, 0], [2, 0], [3, 5000], [4, 15000], [5, 30000], [7, 30000]];
let f = 0;
for (const [a, w] of C) { const g = cooldownForFails(a); if (g !== w) { console.error(`✗ ${a} ⇒ ${g} ≠ ${w}`); f = 1; } }
if (f) process.exit(1);
console.log('✓ cooldown-for-fails: 6 דוגמאות-חוזה — ירוק');
