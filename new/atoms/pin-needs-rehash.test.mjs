import { pinNeedsRehash } from './pin-needs-rehash.mjs';
const C=[['abc123',true],['v2:salt:digest',false],['',false],[undefined,false],['v2',true]];
let f=0; for(const [a,w] of C){const g=pinNeedsRehash(a); if(g!==w){console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`);f=1;}}
if(f)process.exit(1); console.log('✓ pin-needs-rehash: 5 דוגמאות-חוזה — ירוק');
