import { fmtDate } from './fmt-date.mjs';
const C=[['2026-08-24','24/08/2026'],['2026-08-24T12:00:00','24/08/2026'],['','—'],[null,'—'],['שטויות','—']];
let f=0; for(const [a,w] of C){const g=fmtDate(a); if(g!==w){console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`);f=1;}}
if(f)process.exit(1); console.log('✓ fmt-date: 5 דוגמאות-חוזה — ירוק (כפילות-4-המודולים סגורה)');
