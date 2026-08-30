import { tierTrendCounts as __pure_tierTrendCounts } from './portfolio-tier-trend-counts.mjs';
// צילום-מקומי מ-portfolio-tier-trend-counts-data + עטיפת-כריכה (מנוע-הטיהור v2; בדיקה לא מייבאת אטום-שכן)
const order = ['זהב', 'כסף', 'ארד', 'רדומה'];
const f = (...a) => __pure_tierTrendCounts(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), order);
// עצמאי (חוק-1: אפס import-אח; שקעים inline מבונים). Golden נלכד מהרצה.
const MS_DAY=86400000;
const dayDiff=(iso,today)=>{if(!iso)return Infinity;const a=Date.parse(iso.slice(0,10)+'T12:00:00'),b=Date.parse(today.slice(0,10)+'T12:00:00');if(Number.isNaN(a)||Number.isNaN(b))return Infinity;return Math.floor((b-a)/MS_DAY);};
const monthsBefore=(iso,today)=>{const y=+iso.slice(0,4),m=+iso.slice(5,7),ty=+today.slice(0,4),tm=+today.slice(5,7);if(!y||!m||!ty||!tm)return -1;return ty*12+tm-(y*12+m);};
const donorScan=(sp,today,rate=3.7,months=12)=>{const monthly=new Array(months).fill(0);let count=0,ils=0,first='',last='';const take=(date,amount,cur)=>{if(!date)return;count++;const v=(cur||'₪')==='$'?amount*rate:amount;ils+=v;if(!first||date<first)first=date;if(!last||date>last)last=date;const mb=monthsBefore(date,today);if(mb>=0&&mb<months)monthly[months-1-mb]+=v;};for(const d of sp.donations)take(d.date,d.amount,d.cur);if(sp.hist)for(const h of sp.hist)take(h.d,h.a,h.c);return {count,ils,first,last,monthly};};
const rfmFromScan=(scan,today)=>{const rS=(d)=>d<=30?350:d<=90?280:d<=180?200:d<=365?120:40,fS=(c)=>c>=10?300:c>=5?230:c>=3?160:c>=2?100:50,mS=(t)=>t>=5000?350:t>=2000?280:t>=1000?210:t>=500?140:t>=100?80:40;const days=scan.last?dayDiff(scan.last,today):99999;const r=rS(days),f=fS(scan.count),m=mS(scan.ils);return {r,f,m,score:r+f+m,rPct:Math.round(r/350*100),fPct:Math.round(f/300*100),mPct:Math.round(m/350*100)};};
const churnFromScan=(scan,today)=>{if(scan.count===0||!scan.last)return 0;const ds=dayDiff(scan.last,today);const span=scan.first&&scan.first!==scan.last?dayDiff(scan.first,scan.last):0;const cad=scan.count>=2&&span>0?span/(scan.count-1):365;const exp=Math.max(30,cad*1.5);return Math.max(0,Math.min(100,Math.round(ds/exp*50)));};
const forecastFromScan=(scan,today)=>{if(scan.count===0||!scan.last)return null;const avg=Math.round(scan.ils/scan.count);const span=scan.first&&scan.first!==scan.last?dayDiff(scan.first,scan.last):0;const cad=scan.count>=2&&span>0?span/(scan.count-1):365;const lastMs=Date.parse(scan.last.slice(0,10)+'T12:00:00');const dueIso=new Date(lastMs+cad*MS_DAY).toISOString().slice(0,10);const ds=dayDiff(scan.last,today);const over=cad>0?Math.max(0,ds/cad-1):0;const conf=Math.max(15,Math.min(92,Math.round(30+scan.count*7-over*25)));return {amount:avg,dueIso,confidence:conf};};
const trendFromScan=(scan)=>{const mo=scan.monthly,n=mo.length,h=Math.floor(n/2);let o=0,w=0;for(let i=0;i<h;i++)o+=mo[i];for(let i=n-h;i<n;i++)w+=mo[i];if(o===0&&w===0)return {dir:'flat',pct:0};const pct=o===0?100:Math.round((w-o)/o*100);return {dir:pct>8?'up':pct<-8?'down':'flat',pct};};
const supTier=(sc)=>sc>=800?{label:'זהב'}:sc>=600?{label:'כסף'}:sc>=400?{label:'ארד'}:{label:'רדומה'};
const Dp={donorScan,dayDiff,rfmFromScan,churnFromScan,forecastFromScan,supTier};
const Dt={donorScan,rfmFromScan,trendFromScan,supTier};
const Dc={donorScan,dayDiff,rfmFromScan,churnFromScan,supTier};
const T='2026-08-26';
const S=[
 {id:'a',name:'A',donations:[{date:'2026-08-10',amount:3000,cur:'₪'},{date:'2026-02-10',amount:2500,cur:'₪'},{date:'2025-08-10',amount:2000,cur:'₪'}],hist:[]},
 {id:'b',name:'B',donations:[{date:'2026-07-01',amount:150,cur:'₪'}],hist:[]},
 {id:'c',name:'C',donations:[],hist:[]},
];
const WANT="[{\"tier\":\"זהב\",\"total\":1,\"rising\":1,\"falling\":0,\"stable\":0},{\"tier\":\"כסף\",\"total\":0,\"rising\":0,\"falling\":0,\"stable\":0},{\"tier\":\"ארד\",\"total\":1,\"rising\":1,\"falling\":0,\"stable\":0},{\"tier\":\"רדומה\",\"total\":0,\"rising\":0,\"falling\":0,\"stable\":0}]";
const got=JSON.stringify(f(S,T,3.7,Dt));
if(got!==WANT){console.error('✗ portfolio-tier-trend-counts\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ portfolio-tier-trend-counts: Golden — ירוק');
