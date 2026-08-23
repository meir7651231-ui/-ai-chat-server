import { monthHeOf } from './month-he-of.mjs';
const C=[['Av','אב'],['Tishri','תשרי'],['Adar','אדר'],['Adar I','אדר א׳'],['Adar II','אדר ב׳'],['Heshvan','חשוון'],['Nope','']];
let f=0; for(const [a,w] of C){const g=monthHeOf(a); if(g!==w){console.error(`✗ ${a} ⇒ ${g} ≠ ${w}`);f=1;}}
if(monthHeOf('av')!==''){console.error('✗ רישיות: "av" היה אמור להיות \'\'');f=1;}
if(f)process.exit(1); console.log('✓ month-he-of: 7 דוגמאות-חוזה + דין-הרישיות — ירוק');
