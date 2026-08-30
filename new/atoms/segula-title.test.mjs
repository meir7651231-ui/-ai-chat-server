import { segulaTitle as __pure_segulaTitle } from './segula-title.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_segulaTitle_SEGULA_TITLE_T = {
  k1: "🎯 סיום סגולה",
  k2: "🕯 סגולה",
  k3: " · יום ",
};
const segulaTitle = (...a) => __pure_segulaTitle(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_segulaTitle_SEGULA_TITLE_T);
const C=[
  [['משה',{day:1,final:false},40],'🕯 סגולה — משה · יום 1/40'],
  [['משה',{day:40,final:true},40],'🎯 סיום סגולה — משה · יום 40/40'],
  [['',{day:7,final:false},40],'🕯 סגולה —  · יום 7/40'],
  [[undefined,{day:21,final:false},40],'🕯 סגולה —  · יום 21/40'],
  [['רבקה',{day:35,final:false},40],'🕯 סגולה — רבקה · יום 35/40'],
];
let f=0; for(const [a,w] of C){const g=segulaTitle(...a); if(g!==w){console.error(`✗ ${JSON.stringify(a)} ⇒ ${g} ≠ ${w}`);f=1;}}
if(f)process.exit(1); console.log('✓ segula-title: 5 דוגמאות-חוזה — ירוק');
