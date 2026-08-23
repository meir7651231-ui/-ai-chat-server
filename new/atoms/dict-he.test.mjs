import { DICT_HE } from './dict-he.mjs';
const ks=Object.keys(DICT_HE); let f=0;
if(ks.length<1000){console.error('✗ מילון קטן מדי: '+ks.length);f=1;}
for(const k of ks){ if(!/[֐-׿]/.test(k)){console.error('✗ בלי עברית: '+k);f=1;break;} if(!(DICT_HE[k]>0)){console.error('✗ מונה-אפס: '+k);f=1;break;} }
if(f)process.exit(1); console.log('✓ מילון-עברית: '+ks.length+' תבניות — ירוק');
