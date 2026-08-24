import { SEGULA_OFFSETS } from './segula-offsets.mjs';
let f=0;
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
if(!eq(SEGULA_OFFSETS,[1,7,21,35,40])){console.error('✗ ערך',SEGULA_OFFSETS);f=1;}
if(SEGULA_OFFSETS.length!==5){console.error('✗ length',SEGULA_OFFSETS.length);f=1;}
if(Math.max(...SEGULA_OFFSETS)!==40){console.error('✗ max');f=1;}
if(SEGULA_OFFSETS[0]!==1){console.error('✗ [0]');f=1;}
if(f)process.exit(1); console.log('✓ segula-offsets: 4 דוגמאות-חוזה — ירוק');
