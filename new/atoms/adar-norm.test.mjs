import { adarNorm as __pure_adarNorm } from './adar-norm.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_adarNorm_ADAR_NORM_T = {
  k1: "Adar II",
  k2: "Adar",
};
const adarNorm = (...a) => __pure_adarNorm(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_adarNorm_ADAR_NORM_T);
const C=[['Adar II','Adar'],['Adar I','Adar I'],['Adar','Adar'],['Nisan','Nisan']];
let f=0; for(const [a,w] of C){if(adarNorm(a)!==w){console.error('✗ '+a);f=1;}}
if(f)process.exit(1); console.log('✓ adar-norm: 4 דוגמאות-חוזה — ירוק');
