import { groupLabelOf as __pure_groupLabelOf } from './group-label-of.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_groupLabelOf_GROUP_LABEL_OF_T = {
  k1: "קבוצה ",
};
const groupLabelOf = (...a) => __pure_groupLabelOf(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_groupLabelOf_GROUP_LABEL_OF_T);
const C=[[{label:'בוגרים'},0,'בוגרים'],[{label:''},0,'קבוצה 1'],[{},2,'קבוצה 3'],[{label:null},4,'קבוצה 5']];
let f=0; for(const [ss,i,w] of C){const g=groupLabelOf(ss,i); if(g!==w){console.error(`✗ (${JSON.stringify(ss)},${i}) ⇒ "${g}" ≠ "${w}"`);f=1;}}
if(f)process.exit(1); console.log(`✓ group-label-of: ${C.length} דוגמאות-חוזה — ירוק`);
