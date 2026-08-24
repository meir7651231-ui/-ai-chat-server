import { cooldownForFails } from './cooldown-for-fails.mjs';
const C = [[0, 0], [2, 0], [3, 5000], [4, 15000], [5, 30000], [7, 30000]];
let f = 0;
for (const [a, w] of C) { const g = cooldownForFails(a); if (g !== w) { console.error(`✗ ${a} ⇒ ${g} ≠ ${w}`); f = 1; } }
if (f) process.exit(1);
console.log('✓ cooldown-for-fails: 6 דוגמאות-חוזה — ירוק');
