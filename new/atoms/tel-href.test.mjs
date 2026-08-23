import { telHref } from './tel-href.mjs';
const C=[['050-1234567','tel:0501234567'],['+972-50-123-4567','tel:+972501234567'],['05 0 1234567','tel:0501234567'],['123',null],['',null],[null,null]];
let f=0; for(const [a,w] of C){const g=telHref(a); if(g!==w){console.error(`✗ ${JSON.stringify(a)} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);f=1;}}
if(f)process.exit(1); console.log('✓ tel-href: 6 דוגמאות-חוזה — ירוק');
