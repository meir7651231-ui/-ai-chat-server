import { ICONS } from './icons.mjs';
const ks=Object.keys(ICONS); let f=0;
if(ks.length<100){console.error('✗ מעט מדי');f=1;}
for(const k of ks) if(!(ICONS[k]>0)){f=1;break;}
if(f)process.exit(1); console.log('✓ אייקונים: '+ks.length+' סמלים — ירוק');
