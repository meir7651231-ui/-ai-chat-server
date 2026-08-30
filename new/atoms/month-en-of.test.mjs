import { monthEnOf as __pure_monthEnOf } from './month-en-of.mjs';
// צילום-מקומי מ-month-en-of-data + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const MONTHS = [
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
const monthEnOf = (...a) => __pure_monthEnOf(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), MONTHS);
const C=[['אב','Av'],['תשרי','Tishri'],['אדר','Adar'],['אדר א׳','Adar I'],['אדר ב׳','Adar II'],['חשוון','Heshvan'],['שטויות',null]];
let f=0; for(const [a,w] of C){const g=monthEnOf(a); if(g!==w){console.error(`✗ ${a} ⇒ ${g} ≠ ${w}`);f=1;}}
if(monthEnOf("אדר א'")!==null){console.error('✗ גרש-ASCII היה אמור להיות null');f=1;}
if(f)process.exit(1); console.log('✓ month-en-of: 7 דוגמאות-חוזה + דין-הגרש — ירוק');
