import { monthEnOf } from './month-en-of.mjs';
const C=[['אב','Av'],['תשרי','Tishri'],['אדר','Adar'],['אדר א׳','Adar I'],['אדר ב׳','Adar II'],['חשוון','Heshvan'],['שטויות',null]];
let f=0; for(const [a,w] of C){const g=monthEnOf(a); if(g!==w){console.error(`✗ ${a} ⇒ ${g} ≠ ${w}`);f=1;}}
if(monthEnOf("אדר א'")!==null){console.error('✗ גרש-ASCII היה אמור להיות null');f=1;}
if(f)process.exit(1); console.log('✓ month-en-of: 7 דוגמאות-חוזה + דין-הגרש — ירוק');
