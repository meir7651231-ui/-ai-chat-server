import { groupLabelOf } from './group-label-of.mjs';
const C=[[{label:'בוגרים'},0,'בוגרים'],[{label:''},0,'קבוצה 1'],[{},2,'קבוצה 3'],[{label:null},4,'קבוצה 5']];
let f=0; for(const [ss,i,w] of C){const g=groupLabelOf(ss,i); if(g!==w){console.error(`✗ (${JSON.stringify(ss)},${i}) ⇒ "${g}" ≠ "${w}"`);f=1;}}
if(f)process.exit(1); console.log(`✓ group-label-of: ${C.length} דוגמאות-חוזה — ירוק`);
