import { matchSegment as __pure_matchSegment } from './segments-match-segment.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_matchSegment_SEGMENTS_MATCH_SEGMENT_T = {
  k1: "atrisk",
  k2: "goldsilent",
  k3: "hok",
  k4: "gave12m",
  k5: "noemail",
};
const f = (...a) => __pure_matchSegment(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_matchSegment_SEGMENTS_MATCH_SEGMENT_T);
// עצמאי (חוק-1: אפס import-אח; שקעים/פיקסטורות inline). Golden נלכד מהרצה.
const daysSince=(iso,today)=>{const M=86400000;if(!iso)return Infinity;const t=new Date(iso+'T12:00:00').getTime(),n=new Date(today+'T12:00:00').getTime();if(Number.isNaN(t)||Number.isNaN(n))return Infinity;return Math.floor((n-t)/M);};
const supCount=(sp)=>sp.donations.length, supLast=(sp)=>sp._last, supIls=(sp)=>sp._ils||0, supUsd=(sp)=>sp._usd||0;
const atRisk=(sups,today,silent=60)=>sups.filter(sp=>{const hg=supCount(sp)>0&&!!supLast(sp);if(!hg)return false;if(sp.nextDate)return false;return daysSince(supLast(sp),today)>=silent;}).sort((a,b)=>daysSince(supLast(b),today)-daysSince(supLast(a),today));
const D={cockpitAtRisk:atRisk,supIls,supUsd,supLast,daysSince};
const T='2026-08-26';
const S=[
 {id:'1',name:'א',email:'a@x',hok:{active:true},_ils:6000,_usd:0,_last:'2026-06-01',donations:[{date:'2026-06-01'}]},
 {id:'2',name:'ב',email:'',_ils:100,_usd:0,_last:'2025-01-01',donations:[{date:'2025-01-01'}]},
 {id:'3',name:'ג',email:'c@x',_ils:0,_usd:0,_last:'',donations:[]},
];
const WANT="[true,true,false]";
const got=JSON.stringify([f(S[0],'goldsilent',S,T,3.7,D),f(S[1],'atrisk',S,T,3.7,D),f(S[0],'noemail',S,T,3.7,D)]);
if(got!==WANT){console.error('✗ segments-match-segment\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ segments-match-segment: Golden — ירוק');
