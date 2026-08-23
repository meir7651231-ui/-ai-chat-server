import { safeHttpsUrl } from './safe-https-url.mjs';
const C=[['https://example.com','https://example.com/'],['  https://a.b/c?x=1  ','https://a.b/c?x=1'],['http://example.com',null],['javascript:alert(1)',null],['not a url',null],['',null]];
let f=0; for(const [a,w] of C){const g=safeHttpsUrl(a); if(g!==w){console.error(`✗ ${JSON.stringify(a)} ⇒ ${JSON.stringify(g)} ≠ ${JSON.stringify(w)}`);f=1;}}
if(f)process.exit(1); console.log('✓ safe-https-url: 6 דוגמאות-חוזה — ירוק');
