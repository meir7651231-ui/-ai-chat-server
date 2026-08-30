import { monthHeOf as __pure_monthHeOf } from './month-he-of.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const __d_monthHeOf_MONTHS = [
  ['Tishri', 'תשרי'],
  ['Heshvan', 'חשוון'],
  ['Kislev', 'כסלו'],
  ['Tevet', 'טבת'],
  ['Shevat', 'שבט'],
  ['Adar', 'אדר'],
  ['Adar I', 'אדר א׳'],
  ['Adar II', 'אדר ב׳'],
  ['Nisan', 'ניסן'],
  ['Iyar', 'אייר'],
  ['Sivan', 'סיוון'],
  ['Tamuz', 'תמוז'],
  ['Av', 'אב'],
  ['Elul', 'אלול'],
];
const monthHeOf = (...a) => __pure_monthHeOf(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_monthHeOf_MONTHS);
const C=[['Av','אב'],['Tishri','תשרי'],['Adar','אדר'],['Adar I','אדר א׳'],['Adar II','אדר ב׳'],['Heshvan','חשוון'],['Nope','']];
let f=0; for(const [a,w] of C){const g=monthHeOf(a); if(g!==w){console.error(`✗ ${a} ⇒ ${g} ≠ ${w}`);f=1;}}
if(monthHeOf('av')!==''){console.error('✗ רישיות: "av" היה אמור להיות \'\'');f=1;}
if(f)process.exit(1); console.log('✓ month-he-of: 7 דוגמאות-חוזה + דין-הרישיות — ירוק');
