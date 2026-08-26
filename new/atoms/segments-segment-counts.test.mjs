import { segmentCounts as f } from './segments-segment-counts.mjs';
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
const WANT="[{\"key\":\"atrisk\",\"label\":\"בסיכון נטישה\",\"dot\":\"#b45309\",\"count\":2},{\"key\":\"goldsilent\",\"label\":\"זהב · שקטים 60+ יום\",\"dot\":\"#a05008\",\"count\":1},{\"key\":\"hok\",\"label\":\"הו״ק פעילות\",\"dot\":\"#2e7d32\",\"count\":1},{\"key\":\"gave12m\",\"label\":\"תרמו ב-12 החודשים\",\"dot\":\"#1d4ed8\",\"count\":1},{\"key\":\"noemail\",\"label\":\"ללא אימייל\",\"dot\":\"#8a8172\",\"count\":1}]";
const got=JSON.stringify(f(S,T,3.7,D));
if(got!==WANT){console.error('✗ segments-segment-counts\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ segments-segment-counts: Golden — ירוק');
