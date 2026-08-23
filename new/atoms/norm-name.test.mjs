import { normName } from './norm-name.mjs';
// שקע: התנהגות חוט norm-search (מוגדר מקומית בבדיקה — הבדיקה מייבאת רק את האטום-שלה)
const ns=(t)=>String(t||'').toLowerCase()
  .replace(/[֑-ׇ]/g,'')
  .replace(/[ךםןףץ]/g,(ch)=>({ך:'כ',ם:'מ',ן:'נ',ף:'פ',ץ:'צ'})[ch])
  .replace(/['"׳״\-–._]/g,'').trim();
const C=[['בן דוד','בנדוד'],['בֵּן דָּוִד','בנדוד'],['כהן','כהנ'],["ד'ר כהן",'דרכהנ'],['','']];
let f=0; for(const [a,w] of C){const g=normName(a,ns); if(g!==w){console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`);f=1;}}
if(normName(' א ב ',(t)=>t)!=='אב'){console.error('✗ טוהר-השקע: שקע-זהות היה אמור לתת "אב"');f=1;}
if(f)process.exit(1); console.log('✓ norm-name: 5 דוגמאות-חוזה + דוגמת-טוהר-השקע — ירוק');
