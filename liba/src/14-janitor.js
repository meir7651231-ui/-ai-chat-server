// @anchor: janitor
// daily janitor (step janitor-rollup): old records fold into one day document each, then are really deleted
/* Without it every sentence, decision and read message stays forever and the channel only grows. A sweep runs at
   most every six hours, under one lease (channel/janitor) so five open tabs do not sweep at once. Each kind folds
   into fold/<kind>-<day> as {items:{<id>:row}}: update merges nested keys, so a fold is an append with no
   read-modify-write race. A source document is deleted only after the fold document was read back and holds it -
   a fold that fails skips that kind's deletes. Each sweep is capped; a backlog drains over the next sweeps. */
const JAN_EVERY=6*3600e3,JAN_CAP=400,JAN_PAGE=100,JAN_FOLD_MAX=200000,JAN_LEASE=60000;
const H48=48*3600e3,D3=3*864e5,D7=7*864e5,D14=14*864e5,D30=30*864e5,D35=35*864e5;
/* what goes, and when: [kind, collection, filters(now), time field] */
const JAN_KINDS=[
  /* the filters select exactly what goes, so rows that must stay (an old unread question, a running task)
     can never fill a page and hide deletable rows behind them */
  ['inbox',()=>P.inbox(),now=>[['spoken','==',true],['ts','<',now-H48]],'ts'],
  ['inbox',()=>P.inbox(),now=>[['expired','==',true],['ts','<',now-H48]],'ts'],
  ['turns',()=>P.turns(),now=>[['ts','<',now-H48]],'ts'],
  ['decisions',()=>P.decisions(),now=>[['ts','<',now-D7]],'ts'],
  ['crashes',()=>P.crashes(),now=>[['ts','<',now-D7]],'ts'],
  ['req',()=>P.reqs(),now=>[['askedAt','<',now-D14]],'askedAt'],
  /* the board already announced it; a finished task has no reason to sit on the live board for a month */
  ['tasks',()=>P.tasks(),now=>[['status','in',['archived','done']],['updatedAt','<',now-D3]],'updatedAt'],
  ['sessions',()=>P.sessions(),now=>[['updatedAt','<',now-D30]],'updatedAt'],
];
const JAN_GALLERY_KEEP=120;
let janHolder='';try{janHolder=localStorage.getItem('liba.jid')||'';if(!janHolder){janHolder='p-'+mintId();localStorage.setItem('liba.jid',janHolder);}}catch(e){janHolder='p-'+mintId();}
const janSize=o=>{try{return JSON.stringify(o).length;}catch(e){return JAN_FOLD_MAX;}};
/* one fold document per kind and day; past JAN_FOLD_MAX bytes it rolls to <day>-2, -3 (a document caps at 256 KiB) */
/* key is a day (YYYY-MM-DD) or, for the monthly roll-up, a month (YYYY-MM); only day documents carry a day field */
async function janFold(kind,key,rows){let part=1;const head=key.length>7?{kind:kind,day:key}:{kind:kind,month:key};
  for(;;){const id=kind+'-'+key+(part>1?'-'+part:'');const ref=P.fold(id);const g=await ref.get();const cur=g.exists?(g.data()||{}):null;
    const size=cur?janSize(cur):0,add=janSize(rows);
    if(cur&&size+add>JAN_FOLD_MAX){part++;if(part>50)throw new Error('fold overflow '+kind);continue;}
    if(cur)await ref.update({items:rows,at:Date.now()});else await ref.set(Object.assign({},head,{items:rows,at:Date.now()}));
    const back=await ref.get();const items=(back.exists&&(back.data()||{}).items)||{};
    return Object.keys(rows).filter(k=>items[k]);}}
/* one kind, one bounded page: read, keep what must stay, fold by day, delete only what the fold holds */
async function janKind(kind,col,filters,tf,now,budget){
  const r=await coldGet(col(),filters(now),Math.min(JAN_PAGE,budget));const byDay={};
  r.docs.forEach(d=>{const x=d.data()||{};const day=trDay(+x[tf]||0);(byDay[day]=byDay[day]||{})[d.id]=x;});
  let folded=0,deleted=0;
  for(const day of Object.keys(byDay)){const held=await janFold(kind,day,byDay[day]);folded+=held.length;
    for(const id of held){try{await col().doc(id).delete();deleted++;}catch(e){fail('P_DB_WRITE',e,'janitor delete '+kind);}}}
  return {seen:r.docs.length,folded,deleted};}
async function janGallery(now,budget){
  const r=await coldGet(P.gallery(),null,1000);if(r.docs.length<=JAN_GALLERY_KEEP)return {seen:r.docs.length,folded:0,deleted:0};
  const old=r.docs.map(d=>({id:d.id,x:d.data()||{}})).sort((a,b)=>(b.x.ts||0)-(a.x.ts||0)).slice(JAN_GALLERY_KEEP).slice(0,budget);
  const byDay={};old.forEach(o=>{const day=trDay(+o.x.ts||0);(byDay[day]=byDay[day]||{})[o.id]=o.x;});let folded=0,deleted=0;
  for(const day of Object.keys(byDay)){const held=await janFold('gallery',day,byDay[day]);folded+=held.length;
    for(const id of held){try{await P.gallery().doc(id).delete();deleted++;}catch(e){fail('P_DB_WRITE',e,'janitor delete gallery');}}}
  return {seen:r.docs.length,folded,deleted};}
/* day folds older than 35 days roll into one document per kind and month, so the archive itself stays bounded:
   about 7 kinds x 35 days of day documents, plus a few per month - not one more document every day forever */
async function janMonths(now,budget){const cut=trDay(now-D35);const r=await coldGet(P.folds(),[['day','<',cut]],Math.min(20,budget));let rolled=0;
  for(const d of r.docs){const x=d.data()||{};if(!x.day||!x.kind)continue;const held=await janFold(x.kind,x.day.slice(0,7),x.items||{});
    if(held.length===Object.keys(x.items||{}).length){try{await P.fold(d.id).delete();rolled++;}catch(e){fail('P_DB_WRITE',e,'janitor month');}}}
  return {seen:r.docs.length,deleted:rolled};}
/* now is a parameter so the capacity simulation can run sixty days in a minute */
async function janSweep(now){now=now||Date.now();const t0=Date.now();let left=JAN_CAP;const per={};let skipped=[];
  for(const [kind,col,filters,tf] of JAN_KINDS){if(left<=0)break;
    try{let got;do{got=await janKind(kind,col,filters,tf,now,left);left-=got.deleted;
        const p=per[kind]=per[kind]||{folded:0,deleted:0};p.folded+=got.folded;p.deleted+=got.deleted;}
      while(got.deleted>0&&got.seen>=JAN_PAGE&&left>0);}
    catch(e){skipped.push(kind);fail('P_DB_WRITE',e,'janitor '+kind);}}
  if(left>0){try{const g=await janGallery(now,left);per.gallery=g;left-=g.deleted;}catch(e){skipped.push('gallery');fail('P_DB_WRITE',e,'janitor gallery');}}
  if(left>0){try{const m=await janMonths(now,left);per.months=m;left-=m.deleted;}catch(e){skipped.push('months');fail('P_DB_WRITE',e,'janitor months');}}
  const deleted=JAN_CAP-left;
  const report={at:now,ms:Date.now()-t0,deleted:deleted,per:per,skipped:skipped,holder:janHolder,more:left<=0};
  try{await P.janitor().update(report);}catch(e){try{await P.janitor().set(report);}catch(x){fail('P_DB_WRITE',x,'channel/janitor');}}
  /* the budget knows what the janitor freed right away, without waiting for the next count */
  if(deleted>0&&chBudget.docs>0){try{await P.budget().update({docs:Math.max(0,chBudget.docs-deleted),janitorAt:now});}catch(e){fail('P_DB_WRITE',e,'budget after janitor');}}
  return report;}
/* the scheduler: at most every six hours per channel, one holder at a time; a capped sweep comes back within the hour */
let janTimer=null;
async function janMaybe(){clearTimeout(janTimer);janTimer=setTimeout(janMaybe,JAN_EVERY/6);if(!db)return null;
  let last=null;try{const g=await P.janitor().get();last=g.exists?(g.data()||{}):null;}catch(e){fail('P_DB_READ',e,'channel/janitor');return null;}
  if(last&&!last.more&&Date.now()-(+last.at||0)<JAN_EVERY)return null;
  let lease;try{lease=await P.janitor().acquire({holder:janHolder,ttlMs:JAN_LEASE});}catch(e){fail('P_DB_WRITE',e,'janitor lease');return null;}
  if(!lease||!lease.acquired)return null;
  return janSweep(Date.now());}
window.__janitor={sweep:janSweep,maybe:janMaybe,holder:()=>janHolder};
setTimeout(janMaybe,20000);
