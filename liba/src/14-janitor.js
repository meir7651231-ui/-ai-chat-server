// @anchor: janitor
// daily janitor (step janitor-rollup): old records fold into one day document each, then are really deleted
/* Without it every sentence, decision and read message stays forever and the channel only grows. A sweep runs at
   most every six hours, under one lease (channel/janitor) so five open tabs do not sweep at once. Each kind folds
   into fold/<kind>-<day> as {items:{<id>:row}}: update merges nested keys, so a fold is an append with no
   read-modify-write race. A source document is deleted only after the fold document was read back and holds it -
   a fold that fails skips that kind's deletes. Each sweep is capped; a backlog drains over the next sweeps. */
const JAN_EVERY=6*3600e3,JAN_CAP=400,JAN_PAGE=100,JAN_FOLD_MAX=200000,JAN_LEASE=60000;
/* how long rows live comes from the contract; the day folds roll up to months after 35 days */
const TTL=k=>((BUDGET.c[k]||{}).ttlDays||0)*864e5,D35=35*864e5;
/* what goes, and when: [kind, collection, filters(now), time field] */
const JAN_KINDS=[
  /* the filters select exactly what goes, so rows that must stay (an old unread question, a running task)
     can never fill a page and hide deletable rows behind them */
  ['inbox',()=>P.inbox(),now=>[['spoken','==',true],['ts','<',now-TTL('inbox')]],'ts'],
  ['inbox',()=>P.inbox(),now=>[['expired','==',true],['ts','<',now-TTL('inbox')]],'ts'],
  ['turns',()=>P.turns(),now=>[['ts','<',now-TTL('chat/log/turns')]],'ts'],
  ['decisions',()=>P.decisions(),now=>[['ts','<',now-TTL('decisions/log/items')]],'ts'],
  ['crashes',()=>P.crashes(),now=>[['ts','<',now-TTL('crashes')]],'ts'],
  ['req',()=>P.reqs(),now=>[['askedAt','<',now-TTL('req')]],'askedAt'],
  /* the board already announced it; a finished task has no reason to sit on the live board for a month */
  ['tasks',()=>P.tasks(),now=>[['status','in',['archived','done']],['updatedAt','<',now-TTL('tasks')]],'updatedAt'],
  ['sessions',()=>P.sessions(),now=>[['updatedAt','<',now-TTL('sessions')]],'updatedAt'],
  ['telemetry',()=>P.telemetry(),now=>[['ts','<',now-TTL('telemetry/events/items')]],'ts'],
  ['ledger',()=>P.ledgers(),now=>[['at','<',now-TTL('ledger')]],'at'],
  /* mem-core: forgotten facts and migrated notes stay as tombs for 30 days, so a mistaken "תשכח" can be undone */
  ['facts',()=>P.facts(),now=>[['state','==','tomb'],['tombAt','<',now-30*864e5]],'tombAt'],
  ['notes',()=>P.notes(),now=>[['state','==','tomb'],['tombAt','<',now-30*864e5]],'tombAt'],
  ['prefs',()=>P.prefs(),now=>[['state','==','tomb'],['tombAt','<',now-30*864e5]],'tombAt'],
];
const JAN_GALLERY_KEEP=120;
const janHolder=PAGE_ID;
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
/* the contract's caps. Over its cap, telemetry is folded and trimmed oldest first; anything else is only counted and
   reported - a writer that made a lot of real work must not lose it to a rule. Either way the writer is named: every
   document the page creates carries by, and a writer past JAN_FLOOD documents in a day goes into ledger/<day>.offenders
   and is said aloud once. */
const JAN_FLOOD=300,janSaid={};
/* said aloud in words, never as a path */
const JAN_HE={'inbox':'ההודעות','tasks':'המשימות','sessions':'מפת הסשנים','gallery':'הגלריה','req':'הבקשות','chat/log/turns':'יומן השיחה','decisions/log/items':'יומן ההחלטות','crashes':'הקריסות','telemetry/events/items':'יומן התקלות','metrics/daily/days':'המדידות','memory/notes/items':'הזיכרון','memory/prefs/items':'ההעדפות','fold':'הארכיון','pulse':'הדופק','ledger':'היומן היומי'};
const janCol=path=>({'inbox':P.inbox,'tasks':P.tasks,'sessions':P.sessions,'gallery':P.gallery,'req':P.reqs,'chat/log/turns':P.turns,
  'decisions/log/items':P.decisions,'crashes':P.crashes,'telemetry/events/items':P.telemetry,'metrics/daily/days':P.metricsDays,
  'memory/notes/items':P.notes,'memory/prefs/items':P.prefs,'fold':P.folds,'pulse':P.pulses,'ledger':P.ledgers}[path]);
async function janCaps(now,budget){const out={trimmed:0,over:{},writers:{},atLeast:false};const since=now-864e5;
  for(const [path,c] of Object.entries(BUDGET.c)){const colF=janCol(path);if(!colF||!c.cap)continue;
    const lim=Math.min(1000,c.cap*2+50);let r;try{r=await coldGet(colF(),null,lim);}catch(e){fail('P_DB_READ',e,'janitor caps '+path);continue;}
    if(r.docs.length>=lim)out.atLeast=true; /* a full page is a lower bound, and is said as one */
    r.docs.forEach(d=>{const x=d.data()||{};if((+x[c.time]||0)>=since){const by=String(x.by||'?').slice(0,40);const w=out.writers[by]=out.writers[by]||{};w[path]=(w[path]||0)+1;}});
    const n=r.docs.length;if(n<=c.cap)continue;out.over[path]=n-c.cap;
    if(c.cls!=='telemetry'||budget<=0)continue;
    const old=r.docs.map(d=>({id:d.id,x:d.data()||{}})).sort((a,b)=>(+a.x[c.time]||0)-(+b.x[c.time]||0)).slice(0,Math.min(n-c.cap,budget));
    const byDay={};old.forEach(o=>{const day=trDay(+o.x[c.time]||0);(byDay[day]=byDay[day]||{})[o.id]=o.x;});
    for(const day of Object.keys(byDay)){const held=await janFold(path.split('/').pop(),day,byDay[day]);
      for(const id of held){try{await colF().doc(id).delete();out.trimmed++;budget--;}catch(e){fail('P_DB_WRITE',e,'janitor trim '+path);}}}}
  const day=trDay(now),offenders={};
  Object.entries(out.writers).forEach(([by,w])=>{const total=Object.values(w).reduce((a,b)=>a+b,0);if(total>=JAN_FLOOD)offenders[by]=Object.assign({total:total},w);});
  if(Object.keys(offenders).length){try{await P.ledger(day).update({offenders:offenders});}catch(e){try{await P.ledger(day).set({day:day,at:now,offenders:offenders});}catch(x){fail('P_DB_WRITE',x,'ledger offenders');}}
    const [top,w]=Object.entries(offenders).sort((a,b)=>b[1].total-a[1].total)[0];
    if(janSaid[day+top]!==true){janSaid[day+top]=true;const where=Object.entries(w).filter(([k])=>k!=='total').sort((a,b)=>b[1]-a[1])[0][0];
      queueLocal({id:'flood-'+day+'-'+top,kind:'say',speaker:'ליבה',topic:'המסד',text:'כותב אחד, '+top+', כתב היום '+(out.atLeast?'לפחות ':'')+w.total+' מסמכים, רובם ל'+(JAN_HE[where]||'אוסף אחר')+'.'+(BUDGET.c[where]&&BUDGET.c[where].cls==='telemetry'?' גזמתי את העודף.':' לא מחקתי כלום, כי זה תוכן אמיתי. אם זה לא צפוי, כדאי לבדוק.')});}}
  out.offenders=offenders;return out;}
/* now is a parameter so the capacity simulation can run sixty days in a minute */
async function janSweep(now){now=now||Date.now();const t0=Date.now();let left=JAN_CAP;const per={};let skipped=[];
  for(const [kind,col,filters,tf] of JAN_KINDS){if(left<=0)break;
    try{let got;do{got=await janKind(kind,col,filters,tf,now,left);left-=got.deleted;
        const p=per[kind]=per[kind]||{folded:0,deleted:0};p.folded+=got.folded;p.deleted+=got.deleted;}
      while(got.deleted>0&&got.seen>=JAN_PAGE&&left>0);}
    catch(e){skipped.push(kind);fail('P_DB_WRITE',e,'janitor '+kind);}}
  if(left>0){try{const g=await janGallery(now,left);per.gallery=g;left-=g.deleted;}catch(e){skipped.push('gallery');fail('P_DB_WRITE',e,'janitor gallery');}}
  if(left>0){try{const c=await janCaps(now,left);per.caps={trimmed:c.trimmed,over:c.over,offenders:Object.keys(c.offenders)};left-=c.trimmed;}catch(e){skipped.push('caps');fail('P_DB_WRITE',e,'janitor caps');}}
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
