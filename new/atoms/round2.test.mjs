import { round2 } from './round2.mjs';
const C=[[0.1+0.2,0.3],[3.14159,3.14],[5,5],[2.675,2.68],[-2.345,-2.35]];
let f=0; for(const [a,w] of C){const g=round2(a); if(g!==w){console.error(`✗ ${a} ⇒ ${g} ≠ ${w}`);f=1;}}
if(f)process.exit(1); console.log('✓ round2: 5 דוגמאות-חוזה — ירוק');
