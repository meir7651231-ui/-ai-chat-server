import { gemValue as __pure_gemValue } from './gematria-value.mjs';
const __d_gemValue_GEMATRIA_T = {
  k1: "טו",
  k2: "טז",
  k3: "׳",
  k4: "״",
  k5: 100,
  k6: 15,
  k7: 10,
};
// צילום-מקומי מ-gematria-data + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const U = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
const T = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
const H = ['', 'ק', 'ר', 'ש', 'ת', 'תק', 'תר', 'תש', 'תת', 'תתק'];
const gemValue = (...a) => __pure_gemValue(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), U, T, H, __d_gemValue_GEMATRIA_T);
const C=[['אבג',6],['דוד',14],['שלום',376],['תשפ״ו',786],['ט״ו',15],['אמן',91],['ץ',90],['',null],['abc',null]];
let f=0; for(const [a,w] of C){const g=gemValue(a); if(g!==w){console.error(`✗ gemValue(${JSON.stringify(a)}) = ${g} ≠ ${w}`);f=1;}}
if(f)process.exit(1); console.log('✓ gematria-value: 9 דוגמאות-חוזה — ירוק');
