import { cockpitFeed } from './cockpit-feed.mjs';
// עצמאי: כל השקעים מוטבעים inline (test-doubles, בלי import-אח — חוק-1). Golden נלכד מהרצה.
const M=86400000;
const daysSince=(iso,today)=>{if(!iso)return Infinity;const t=new Date(iso+'T12:00:00').getTime(),n=new Date(today+'T12:00:00').getTime();if(Number.isNaN(t)||Number.isNaN(n))return Infinity;return Math.floor((n-t)/M);};
const supCount=(sp)=>sp.donations.length, supLast=(sp)=>sp._last, supIls=(sp)=>sp._ils||0, supUsd=(sp)=>sp._usd||0;
const hokDue=(sups)=>sups.filter(s=>s.hok);
const hokMonthlyTotal=(sups,rate)=>sups.reduce((n,s)=>n+(s.hok?(s.hok.cur==='$'?s.hok.amount*rate:s.hok.amount):0),0);
const orgCalEntries=(sups)=>sups.flatMap(s=>s.donations.map(d=>({date:d.date,name:s.name,amount:d.amount,cur:d.cur,spId:s.id,src:'תרומה'})));
const atRisk=(sups,today,silent=60)=>sups.filter(sp=>{const hg=supCount(sp)>0&&!!supLast(sp);if(!hg)return false;if(sp.nextDate)return false;return daysSince(supLast(sp),today)>=silent;}).sort((a,b)=>daysSince(supLast(b),today)-daysSince(supLast(a),today));
const collected=(sups,today,rate=3.7)=>{const m=today.slice(0,7);let s=0;for(const sp of sups){for(const d of sp.donations){if(!d.date.startsWith(m))continue;s+=(d.cur||'₪')==='$'?d.amount*rate:d.amount;}for(const h of sp.hist??[]){if(!(h.d||'').startsWith(m))continue;s+=(h.c||'₪')==='$'?h.a*rate:h.a;}}return Math.round(s);};
const valueTag=(sp,rate)=>{const ils=supIls(sp)+supUsd(sp)*rate;if(ils>=5000)return 'תורם/ת מרכזי/ת';if(ils>=1000)return 'תורם/ת מהותי/ת';return 'תורם/ת';};
const calls=(sups,today,rate=3.7,silent=60)=>{const tasks=[],seen=new Set();for(const sp of sups){if(!sp.nextDate||sp.nextDate>today)continue;const late=daysSince(sp.nextDate,today);tasks.push({id:'call:'+sp.id,kind:'call',supId:sp.id,name:sp.name,phone:sp.phone||'',email:sp.email||'',reason:late<=0?'יעד-קשר להיום':'יעד-קשר עבר לפני '+late+' יום',severity:'due',sort:1000000+late});seen.add(sp.id);}for(const sp of atRisk(sups,today,silent)){if(seen.has(sp.id))continue;const sil=daysSince(supLast(sp),today);tasks.push({id:'call:'+sp.id,kind:'call',supId:sp.id,name:sp.name,phone:sp.phone||'',email:sp.email||'',reason:valueTag(sp,rate)+' · שקט/ה '+sil+' יום',severity:'risk',sort:sil});seen.add(sp.id);}return tasks.sort((a,b)=>b.sort-a.sort);};
const thanks=(sups,today,win=3)=>{const ld=(sp)=>{let b=null;for(const d of sp.donations){if(!d.date)continue;if(!b||d.date>b.date)b={date:d.date,amount:d.amount,cur:d.cur||'₪'};}for(const h of sp.hist??[]){if(!h.d)continue;if(!b||h.d>b.date)b={date:h.d,amount:h.a,cur:h.c||'₪'};}return b;};const tasks=[];for(const sp of sups){const last=ld(sp);if(!last)continue;const ago=daysSince(last.date,today);if(ago<0||ago>win)continue;const money=last.cur==='$'?'$'+last.amount.toLocaleString('en-US'):'₪'+last.amount.toLocaleString('he-IL');tasks.push({id:'thanks:'+sp.id,kind:'thanks',supId:sp.id,name:sp.name,phone:sp.phone||'',email:sp.email||'',reason:'תרם/ה '+money+' · '+(ago<=0?'היום':'לפני '+ago+' יום'),severity:'warm',sort:win-ago});}return tasks.sort((a,b)=>b.sort-a.sort);};
const hokTasks=(sups,today)=>hokDue(sups,today).map(sp=>{const hok=sp.hok;const money=hok.cur==='$'?'$'+hok.amount.toLocaleString('en-US'):'₪'+hok.amount.toLocaleString('he-IL');return {id:'hok:'+sp.id,kind:'hok',supId:sp.id,name:sp.name,phone:sp.phone||'',email:sp.email||'',reason:'הו״ק '+money+' · יום '+hok.day+' — טרם נרשם החודש',severity:'due',sort:100-(hok.day||0)};});
const TODAY='2026-08-26';
const S=[
 {id:'1',name:'אבי כהן',phone:'050',email:'a@x.com',nextDate:'2026-08-20',donations:[{date:'2026-08-24',amount:100,cur:'₪'}],hist:[],_ils:100,_usd:0,_last:'2026-08-24'},
 {id:'2',name:'דנה לוי',phone:'052',email:'',nextDate:'',donations:[{date:'2026-01-10',amount:50,cur:'₪'}],hist:[],_ils:50,_usd:0,_last:'2026-01-10'},
 {id:'3',name:'משה',phone:'',email:'',nextDate:'',donations:[{date:'2026-08-25',amount:300,cur:'$'}],hist:[],_ils:0,_usd:300,_last:'2026-08-25',hok:{amount:200,cur:'₪',day:5}},
 {id:'4',name:'רות',phone:'054',email:'',nextDate:'',donations:[],hist:[],_ils:0,_usd:0,_last:''},
];
const WANT = "[{\"id\":\"3:2026-08-25:0\",\"date\":\"2026-08-25\",\"who\":\"משה\",\"what\":\"תרם/ה $300\",\"spId\":\"3\"},{\"id\":\"1:2026-08-24:1\",\"date\":\"2026-08-24\",\"who\":\"אבי כהן\",\"what\":\"תרם/ה ₪100\",\"spId\":\"1\"},{\"id\":\"2:2026-01-10:2\",\"date\":\"2026-01-10\",\"who\":\"דנה לוי\",\"what\":\"תרם/ה ₪50\",\"spId\":\"2\"}]";
const got = JSON.stringify(cockpitFeed(S,8,{orgCalEntries}));
if (got !== WANT) { console.error('✗ cockpit-feed\n' + got + '\n≠\n' + WANT); process.exit(1); }
console.log('✓ cockpit-feed: Golden — ירוק');
