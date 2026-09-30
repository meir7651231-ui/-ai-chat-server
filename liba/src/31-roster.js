// @anchor: roster
// brain-roster-lease: every sentence to Claude is a piece of work with a lease; a brain that died silently is noticed
/* Step brain-roster-lease. Each sentence Meir sends is work/<wakeId> (the request id) {text, tag, state, attempts} -
   new, claimed by a brain (claimedBy + its heartbeat in brain/roster/items/<brainId>.lastBeat), answered (a reply with
   re=<wakeId>). Every twenty seconds reclaim() looks at what is open: a claimer whose heartbeat is older than ninety
   seconds is stale; work with no answer and no live claimer after three minutes is sent once more, the same sentence
   under the same id (so an answer to either binds); still nothing three minutes later - it is dead, and Meir hears one
   sentence, never a loop. Answered work is never sent again. brain/roster says who is live (a beat within ninety
   seconds), stale, or dead (thirty minutes); "מי ער" says it. The rule is in channel/protocol.brain. */
const WORK_RESEND=3*60000,WORK_DEAD=6*60000,BEAT_STALE=90000,BEAT_DEAD=30*60000;let roster=new Map();const workSaid=new Set();
function rosterIn(m){roster=m;}
function brainState(r,now){const b=+r.lastBeat||0;return !b?'dead':now-b<BEAT_STALE?'live':now-b<BEAT_DEAD?'stale':'dead';}
function workOpen(reqId,text,tag){if(!db)return;P.work(reqId).set({text:String(text).slice(0,600),tag:String(tag||''),state:'new',attempts:1,at:Date.now(),envelopeRef:'brain/wakes/items/'+reqId}).catch(e=>fail('P_DB_WRITE',e,'work'));}
function workAnswered(re,d){if(!db||!re)return;P.work(String(re)).update({state:'answered',answeredAt:Date.now(),answeredBy:String(d.brainId||speakerOf(d))}).catch(()=>{});}
async function reclaim(now){now=now||Date.now();if(!db)return [];const out=[];let rows=[];
  try{rows=(await coldGet(P.works(),[['at','>',now-30*60000]],100)).docs.map(d=>Object.assign({id:d.id},d.data()||{}));}catch(e){fail('P_DB_READ',e,'work');return [];}
  for(const w of rows){if(w.state==='answered'||w.state==='dead')continue;const age=now-(+w.lastSentAt||+w.at||now);
    const claimer=w.claimedBy&&roster.get(String(w.claimedBy));const alive=claimer&&brainState(claimer,now)==='live';
    if(alive)continue;
    /* no brain ever registered: nobody died mid-work, so a second copy helps no one (and an old brain that never
       beats would get every sentence twice) - it waits, and is said to be dead once, never resent */
    if(!roster.size){if(now-(+w.at||now)>WORK_DEAD){await P.work(w.id).update({state:'dead',deadAt:now}).catch(()=>{});out.push([w.id,'dead']);Ledger.record({action:'reclaim',cause:'work:'+w.id,result:'dead, no brain'});
      if(!workSaid.has(w.id)){workSaid.add(w.id);queueLocal({id:'dead-'+w.id,kind:'say',speaker:'ליבה',topic:'מוח',text:'"'+String(w.text).slice(0,50)+'" עוד מחכה לתשובה, ואף מוח לא נרשם. כנראה שאף סשן לא ער עכשיו.'});}}continue;}
    if(age>WORK_RESEND&&(+w.attempts||1)<2){const r=await deliver(String(w.text)+reqMark(w.id),w.tag||tagOf());
      await P.work(w.id).update({attempts:2,lastSentAt:now,state:'new',claimedBy:'',resent:r.sent}).catch(()=>{});
      Ledger.record({action:'reclaim',cause:'work:'+w.id,inputs:{claimedBy:w.claimedBy||'',age:Math.round(age/1000)},result:r.sent?'resent':'failed'});out.push([w.id,'resent']);continue;}
    if((+w.attempts||1)>=2&&now-(+w.lastSentAt||+w.at)>WORK_RESEND){await P.work(w.id).update({state:'dead',deadAt:now}).catch(()=>{});
      Ledger.record({action:'reclaim',cause:'work:'+w.id,result:'dead'});out.push([w.id,'dead']);
      if(!workSaid.has(w.id)){workSaid.add(w.id);queueLocal({id:'dead-'+w.id,kind:'say',speaker:'ליבה',topic:'מוח',text:'שלחתי פעמיים את "'+String(w.text).slice(0,50)+'" ואף מוח לא ענה. כנראה שאף סשן לא ער עכשיו.'});}}}
  return out;}
function rosterSay(){const now=Date.now(),all=[...roster.entries()].map(([id,r])=>({id,r,s:brainState(r,now)}));const live=all.filter(x=>x.s==='live');
  sayLocal(all.length?(live.length?'ער עכשיו: '+live.map(x=>(x.r.role||'מוח')+' '+String(x.id).slice(-6)).join(', ')+'.':'אף מוח לא ער עכשיו.')+(all.length>live.length?' ועוד '+(all.length-live.length)+' שנרדמו.':''):'עוד אף מוח לא נרשם.');return true;}
async function rosterContract(){if(!db)return;try{const g=await P.protocol().get();const x=(g.exists&&g.data())||{};if(x.brain)return;
  await P.protocol().set(Object.assign({},x,{brain:{roster:'brain/roster/items/<brainId>',work:'work/<wakeId>',rule:'צור brainId אחד (ULID) בהתעוררות הראשונה ושא אותו בכל כתיבה. לפני שאתה עובד על משפט: work/<wakeId>.claimedBy=<brainId>, state=claimed. בכל כתיבה: brain/roster/items/<brainId>.lastBeat=עכשיו. ענה עם re=<wakeId>. משפט בלי מענה ובלי מוח חי נשלח שוב אחרי שלוש דקות, פעם אחת.',at:Date.now()}}));}catch(e){fail('P_DB_WRITE',e,'channel/protocol');}}
setInterval(()=>{if(db)reclaim().catch(e=>fail('P_DB_READ',e,'reclaim'));},20000);setTimeout(rosterContract,6000);
window.__roster={reclaim,state:brainState,roster:()=>roster};
