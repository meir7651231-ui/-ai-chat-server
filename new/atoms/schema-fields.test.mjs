import { FIELDS } from './schema-fields.mjs';
const seen=new Set(); let f=0;
for(const x of FIELDS){const k=x.e+'.'+x.n; if(seen.has(k)){console.error('✗ כפול: '+k);f=1;break;} seen.add(k); if(!x.e||!x.n||!x.t){console.error('✗ חסר: '+k);f=1;break;}}
if(FIELDS.length<300)f=1;
if(f)process.exit(1); console.log('✓ שדות-סכמה: '+FIELDS.length+' — ירוק');
