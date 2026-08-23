import { adarNorm } from './adar-norm.mjs';
const C=[['Adar II','Adar'],['Adar I','Adar I'],['Adar','Adar'],['Nisan','Nisan']];
let f=0; for(const [a,w] of C){if(adarNorm(a)!==w){console.error('✗ '+a);f=1;}}
if(f)process.exit(1); console.log('✓ adar-norm: 4 דוגמאות-חוזה — ירוק');
