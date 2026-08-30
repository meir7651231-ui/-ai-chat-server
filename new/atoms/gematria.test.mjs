import { gem as __pure_gem } from './gematria.mjs';
// צילום-מקומי מ-gematria-data + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const U = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
const T = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
const H = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
const gem = (...a) => __pure_gem(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), U, T, H);
const C=[[15,'ט״ו'],[16,'ט״ז'],[5,'ה׳'],[786,'תשפ״ו'],[30,'ל׳'],[21,'כ״א'],[0,''],[-3,''],[NaN,'']];
let f=0; for(const [a,w] of C){const g=gem(a); if(g!==w){console.error(`✗ gem(${a}) = "${g}" ≠ "${w}"`);f=1;}}
if(f)process.exit(1); console.log('✓ gematria: 9 דוגמאות-חוזה — ירוק');
