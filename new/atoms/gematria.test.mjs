import { gem } from './gematria.mjs';
const C=[[15,'ט״ו'],[16,'ט״ז'],[5,'ה׳'],[786,'תשפ״ו'],[30,'ל׳'],[21,'כ״א'],[0,''],[-3,''],[NaN,'']];
let f=0; for(const [a,w] of C){const g=gem(a); if(g!==w){console.error(`✗ gem(${a}) = "${g}" ≠ "${w}"`);f=1;}}
if(f)process.exit(1); console.log('✓ gematria: 9 דוגמאות-חוזה — ירוק');
