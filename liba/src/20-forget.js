// @anchor: forget
// forget: expiry, sensitivity, undo - forgetting as an operation across the memory, not a string match
/* Step forget. A fact's life: live -> archive (it expired, or it went unused for half a year at low confidence) or
   live -> tomb (Meir said to forget it). A fact with a date in it ("אני בחו"ל עד ה-12") expires the day after that
   date: it stays in the store but is never said as true again. "תשכח הכול על X" forgets across the memory - facts,
   people, candidates, the conversation log and the decisions, live rows and the janitor's folds - as one batch that
   "תחזיר את מה ששכחת" restores within 24 hours. The batch (memory/forgets/items/<id>) is the only copy of what was
   removed from the log, and the sweep deletes it after a day: after that it is really gone. More than five items are
   counted aloud first, and wait for a yes. */
const FORGET_UNDO=864e5,FORGET_ASK=5,DECAY_DAYS=180,DECAY_CONF=0.5;
const HE_MONTH={'ינואר':0,'פברואר':1,'מרץ':2,'מרס':2,'אפריל':3,'מאי':4,'יוני':5,'יולי':6,'אוגוסט':7,'ספטמבר':8,'אוקטובר':9,'נובמבר':10,'דצמבר':11};
/* the date a fact stops being true, if it says one: "עד ה-12", "עד ה-12 באוקטובר", "ב-3 בנובמבר", "מחר", "היום" */
function memExpiry(raw,now){const t=inorm(raw);now=now||Date.now();const dayEnd=ts=>{const d=new Date(ts);d.setHours(23,59,59,0);return d.getTime();};
  let m=t.match(/(?:עד|ב)\s?ה?-?(\d{1,2})(?:\s(?:ב|ל)?(ינואר|פברואר|מרץ|מרס|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר))?(?:\s|$)/);
  if(m&&/עד|ב/.test(m[0])&&(m[2]||/עד/.test(m[0]))){const n=new Date(now),day=+m[1];if(day<1||day>31)return 0;let mon=m[2]!=null?HE_MONTH[m[2]]:n.getMonth(),y=n.getFullYear();
    let d=new Date(y,mon,day);if(d.getTime()<now-864e5&&m[2]==null)d=new Date(y,mon+1,day);else if(d.getTime()<now-864e5)d=new Date(y+1,mon,day);return dayEnd(d.getTime())+864e5;}
  if(/(^|\s)מחר(\s|$)/.test(t))return dayEnd(now+864e5)+864e5;
  if(/(^|\s)היום(\s|$)/.test(t)&&!/כל יום/.test(t))return dayEnd(now)+864e5;
  return 0;}
/* true only for what may be said as true now */
function memLive(f,now){return f.state!=='tomb'&&f.state!=='archive'&&!(+f.expiresAt>0&&+f.expiresAt<(now||Date.now()));}
/* what mentions X, everywhere it can be; each hit is {where, id, ...} */
async function forgetScan(q){const w=memWords(q);if(!w.length)return [];const has=t=>{const h=' '+memWords(t).join(' ')+' ';return w.every(x=>h.indexOf(' '+x+' ')>=0||h.indexOf(x)>=0);};const hits=[];
  (await MEM.all()).filter(f=>f.state!=='tomb'&&has([f.subject,f.predicate,f.value,f.raw].join(' '))).forEach(f=>hits.push({where:'fact',id:f.key,label:f.raw||f.value}));
  (await PEOPLE.all()).filter(p=>has([p.name].concat(p.aliases||[]).join(' '))).forEach(p=>hits.push({where:'person',id:p.key,label:p.name}));
  try{(await coldGet(P.cands(),null,500)).docs.forEach(d=>{const c=d.data()||{};if(c.state!=='tomb'&&has(c.claim+' '+JSON.stringify(c.proposedFact||{})))hits.push({where:'cand',id:d.id,label:c.claim});});}catch(e){}
  for(const [kind,col,field] of [['turns',P.turns(),'text'],['decisions',P.decisions(),'answer']]){
    try{(await coldGet(col,null,2000)).docs.forEach(d=>{const x=d.data()||{};if(has([x.text,x.question,x.answer,x.topic].join(' ')))hits.push({where:kind,id:d.id,data:x});});}catch(e){}
    try{(await coldGet(P.folds(),[['kind','==',kind]],200)).docs.forEach(d=>{const it=(d.data()||{}).items||{};Object.entries(it).forEach(([k,x])=>{if(has([x.text,x.question,x.answer,x.topic].join(' ')))hits.push({where:'fold',id:d.id,item:k,data:x});});});}catch(e){}}
  return hits;}
/* one batch: tombs for the stores with a state, real removal (kept in the batch for a day) for the log and its folds */
async function forgetApply(q,hits){const now=Date.now(),id='f-'+mintId();const keep={q:q,at:now,items:hits.map(h=>({where:h.where,id:h.id,item:h.item||'',data:h.data||null}))};
  await P.forget(id).set(keep);
  for(const h of hits){try{
    if(h.where==='fact')await P.fact(h.id).update({state:'tomb',tombAt:now,forgetBatch:id});
    else if(h.where==='person')await P.person(h.id).update({state:'tomb',tombAt:now,forgetBatch:id});
    else if(h.where==='cand')await P.cand(h.id).update({state:'tomb',tombAt:now,forgetBatch:id});
    else if(h.where==='turns')await P.turns().doc(h.id).delete();
    else if(h.where==='decisions')await P.decisions().doc(h.id).delete();}catch(e){fail('P_DB_WRITE',e,'forget '+h.where);}}
  const folds={};hits.filter(h=>h.where==='fold').forEach(h=>{(folds[h.id]=folds[h.id]||[]).push(h.item);});
  for(const [fid,items] of Object.entries(folds)){try{const g=await P.fold(fid).get();const x=g.exists?(g.data()||{}):null;if(!x)continue;const it=Object.assign({},x.items||{});items.forEach(k=>delete it[k]);
    await P.fold(fid).set(Object.assign({},x,{items:it}));}catch(e){fail('P_DB_WRITE',e,'forget fold');}}
  PEOPLE.cache=null;lastForget=id;return id;}
let lastForget='';
async function forgetUndo(now){now=now||Date.now();let id=lastForget,b=null;
  try{const r=await coldGet(P.forgets(),[['at','>',now-FORGET_UNDO]],50);const all=r.docs.map(d=>Object.assign({id:d.id},d.data()||{})).filter(x=>!x.undone).sort((a,c)=>c.at-a.at);b=all.find(x=>x.id===id)||all[0]||null;}catch(e){fail('P_DB_READ',e,'forgets');}
  if(!b)return null;let n=0;const folds={};
  for(const h of b.items||[]){try{
    if(h.where==='fact'){await P.fact(h.id).update({state:'live',tombAt:0,forgetBatch:''});n++;}
    else if(h.where==='person'){await P.person(h.id).update({state:'live',tombAt:0,forgetBatch:''});n++;}
    else if(h.where==='cand'){await P.cand(h.id).update({state:'open',tombAt:0,forgetBatch:''});n++;}
    else if(h.where==='turns'&&h.data){await P.turns().doc(h.id).set(h.data);n++;}
    else if(h.where==='decisions'&&h.data){await P.decisions().doc(h.id).set(h.data);n++;}
    else if(h.where==='fold'&&h.data){(folds[h.id]=folds[h.id]||{})[h.item]=h.data;n++;}}catch(e){fail('P_DB_WRITE',e,'undo '+h.where);}}
  for(const [fid,items] of Object.entries(folds)){try{await P.fold(fid).update({items:items});}catch(e){fail('P_DB_WRITE',e,'undo fold');}}
  await P.forget(b.id).update({undone:now}).catch(()=>{});PEOPLE.cache=null;return {q:b.q,n:n};}
/* the sweep: expired and long-unused facts to the archive; forget batches older than a day deleted for good */
async function memSweep(now){now=now||Date.now();const t0=Date.now();let expired=0,decayed=0,purged=0;
  let all=[];try{all=(await coldGet(P.facts(),null,6000)).docs.map(d=>Object.assign({key:d.id},d.data()||{}));}catch(e){fail('P_DB_READ',e,'sweep');return null;}
  for(const f of all){if(f.state==='tomb'||f.state==='archive')continue;let why='';
    if(+f.expiresAt>0&&+f.expiresAt<now)why='expired';
    else if(now-(+f.lastUsed||+f.updatedAt||+f.ts||now)>DECAY_DAYS*864e5&&(+f.conf||0)<DECAY_CONF)why='decay';
    if(!why)continue;try{await P.fact(f.key).update({state:'archive',archivedAt:now,archiveWhy:why});why==='expired'?expired++:decayed++;}catch(e){fail('P_DB_WRITE',e,'archive');}}
  try{const r=await coldGet(P.forgets(),[['at','<',now-FORGET_UNDO]],100);for(const d of r.docs){await P.forget(d.id).delete();purged++;}}catch(e){fail('P_DB_WRITE',e,'forgets purge');}
  return {expired,decayed,purged,seen:all.length,ms:Date.now()-t0};}
function sweepSay(r){if(!r||!(r.expired+r.decayed))return;sayLocal('סידרתי את הזיכרון: '+[r.expired?(r.expired===1?'עובדה אחת שפג תוקפה':r.expired+' עובדות שפג תוקפן'):'',r.decayed?(r.decayed===1?'אחת שלא השתמשתי בה חצי שנה':r.decayed+' שלא השתמשתי בהן חצי שנה'):''].filter(Boolean).join(' ו')+' עברו לארכיון. הן לא נמחקו.');}
/* the commands */
function forgetSay(q,hits){const by={};hits.forEach(h=>{by[h.where==='fold'?'turns':h.where]=(by[h.where==='fold'?'turns':h.where]||0)+1;});
  const he={fact:['עובדה אחת','עובדות'],person:['כרטיס אדם אחד','כרטיסי אדם'],cand:['דבר אחד שלמדתי','דברים שלמדתי'],turns:['משפט אחד ביומן','משפטים ביומן'],decisions:['החלטה אחת','החלטות']};
  return Object.entries(by).map(([k,n])=>n===1?he[k][0]:n+' '+he[k][1]).join(', ');}
function memForgetAll(rest){const q=rest.trim();if(!q)return false;(async()=>{const hits=await forgetScan(q);
  if(!hits.length){sayLocal('לא מצאתי כלום על '+q+'.');return;}
  if(hits.length>FORGET_ASK){pendingIntent={m:{it:{id:'memory.forgetAll.do',handler:'memForgetDo',requires:['db']},rest:q,t:q,how:'prefix'},at:Date.now(),text:'תשכח הכול על '+q};
    sayLocal('על '+q+' יש '+hits.length+' פריטים: '+forgetSay(q,hits)+'. למחוק את כולם? תגיד כן או לא.');return;}
  await memForgetDoA(q,hits);})().catch(e=>{fail('P_DB_WRITE',e,'forget');sayLocal('לא הצלחתי לשכוח.');});return true;}
function memForgetDo(rest){memForgetDoA(rest.trim()).catch(e=>{fail('P_DB_WRITE',e,'forget');sayLocal('לא הצלחתי לשכוח.');});return true;}
async function memForgetDoA(q,hits){hits=hits||await forgetScan(q);if(!hits.length){sayLocal('לא מצאתי כלום על '+q+'.');return;}await forgetApply(q,hits);
  sayLocal('שכחתי הכול על '+q+': '+forgetSay(q,hits)+'. עד מחר אפשר להגיד תחזיר את מה ששכחת.');}
function memUndo(){forgetUndo().then(r=>sayLocal(r?'החזרתי '+r.n+(r.n===1?' פריט':' פריטים')+' על '+r.q+'.':'אין מה להחזיר. שכחה נשמרת להחזרה רק יממה.')).catch(e=>{fail('P_DB_WRITE',e,'undo');sayLocal('לא הצלחתי להחזיר.');});return true;}
window.__forget={scan:forgetScan,apply:forgetApply,undo:forgetUndo,sweep:memSweep,expiry:memExpiry,live:memLive};
