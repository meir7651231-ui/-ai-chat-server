// @anchor: inbox
// the inbox queue, readiness, who is speaking, and the pump

const inboxQ=[],spokenLocal=new Set(),sendQ=[];let pumping=false,owner='liba',ownerSince=0,quietUntil=0,pumpTimer=null,taskPrev={},taskSeen=false,lastTasks=[],lastRingAt=0;
/* what was already said survives a reload (page-kernel). spokenLocal is this page load's memory and is set
   before speaking, so nothing is read twice in one load; spokenStore is written only AFTER the speech ends,
   so a reload in the middle of a sentence still reads it again, while one after the sentence does not. */
const SPOKEN_TTL=72*3600*1000;let spokenStore={};
try{spokenStore=JSON.parse(localStorage.getItem(LSK('spoken'))||'{}')||{};}catch(e){fail('P_STORE',e,'get spoken');}
function spokenDone(id){const t=spokenStore[id];return !!t&&Date.now()-t<SPOKEN_TTL;}
function spokenMark(id){const now=Date.now();spokenStore[id]=now;for(const k in spokenStore)if(now-spokenStore[k]>SPOKEN_TTL)delete spokenStore[k];
  try{localStorage.setItem(LSK('spoken'),JSON.stringify(spokenStore));}catch(e){fail('P_STORE',e,'set spoken');}}
/* a message's age is part of its meaning (page-kernel). Past AGE_SAY it is read with its age; a plain
   announcement past EXPIRE is not read at all but marked expired. Questions never expire - they still
   need an answer - and commands never expire, they still need to run. */
const AGE_SAY=10*60*1000,EXPIRE={say:72*3600*1000,done:72*3600*1000};
/* some writers number their messages (ts:1,2,3) instead of stamping them: such a ts orders, it does not age */
const CLOCK_MIN=1577836800000; // 2020-01-01
function ageOf(d){return d&&!d.local&&d.ts>=CLOCK_MIN?Math.max(0,Date.now()-d.ts):0;}
/* freshness-ttl: how old, in words that are never wrong. Minutes and hours are floored (a message is never said to
   be older than it is); from a day on it counts calendar days in Israel, so a message from 30 hours ago read at six
   in the morning is "משלשום" and not "מאתמול". Pure: now and ts are both given, so tests/stale.cases.json pins it. */
const ilDay=t=>{try{const [y,m,d]=new Date(t).toLocaleDateString('en-CA',{timeZone:'Asia/Jerusalem'}).split('-').map(Number);return Math.round(Date.UTC(y,m-1,d)/864e5);}catch(e){return Math.floor(t/864e5);}};
function agoWords(now,ts){const ms=Math.max(0,now-ts),m=Math.floor(ms/60000);
  if(m<1)return 'מלפני רגע';if(m===1)return 'מלפני דקה';if(m<60)return 'מלפני '+m+' דקות';
  const h=Math.floor(m/60);if(h<24){if(h===1)return m>=90?'מלפני שעה וחצי':'מלפני שעה';if(h===2)return 'מלפני שעתיים';return 'מלפני '+h+' שעות';}
  const n=ilDay(now)-ilDay(ts);if(n<=1)return 'מאתמול';if(n===2)return 'משלשום';if(n<7)return 'מלפני '+n+' ימים';if(n<14)return 'מלפני שבוע';return 'מלפני '+Math.floor(n/7)+' שבועות';}
function heAgo(ms,ts){const now=Date.now();return agoWords(now,ts!=null?ts:now-ms);}
function expired(d){if(d.priority==='morning'&&d.ts>=CLOCK_MIN){const m8=new Date();m8.setHours(8,0,0,0);if(d.ts<m8.getTime()-864e5)return true;} /* days: meant for an earlier morning */
  const lim=EXPIRE[d.kind||'say'];return !!lim&&!d.priority&&ageOf(d)>lim;}
window.__kernel={state:()=>state,illegal:()=>illegalMoves,log:stateLog,forgetLoad:()=>spokenLocal.clear(),spoken:()=>Object.assign({},spokenStore)};
function queueLocal(d){d.local=true;d.from='liba';d.ts=Date.now();if(!inboxQ.some(x=>x.id===d.id)&&!spokenLocal.has(d.id))inboxQ.push(d);pump();}
/* step 19: priority – urgent bypasses quiet; morning waits for 08:00 */
/* silence-ledger: ready() used to answer a dry yes/no, and every held message vanished without a trace. gate() says
   why: claim (another device is reading it), retry (the voice went silent, trying again), noapp (a command with no
   bubble), morning (waits for 08:00), quiet (אל תפריע), offline (the page is not connected to the bubble). Each hold
   is written once per message and reason (inbox/<id>.holds.<reason>) and counted in ledger/<day>.silence. */
const hourNow=()=>window.__testHour!=null?window.__testHour:new Date().getHours(); /* tests pin the hour */
const G_OK={ok:true};
function gate(d){const now=Date.now();if(shabbatOn(now)&&!d.pikuachOk)return {ok:false,reason:'shabbat'}; /* shabbat-engine: before everything, urgent and commands too */
  if(d.retryAt>now)return {ok:false,reason:d.retryWhy||'claim'};if(d.kind==='cmd')return appMode?G_OK:{ok:false,reason:'noapp'};
  if(d.release)return G_OK;if(!d.local&&expired(d))return G_OK; /* an expired one passes, to be marked expired and never said */
  const p=d.priority||'normal';if(p==='urgent')return G_OK;
  if(catchupUntil>now&&!d.local&&d.kind!=='ask'&&d.kind!=='stuck'&&(d.ts||0)<catchupAt)return {ok:false,reason:'catchup'};
  const hold=ctxHold(d);if(hold)return {ok:false,reason:hold}; /* context-fusion: a call or a meeting holds all but urgent */
  if(p==='morning'&&!upNow(now))return {ok:false,reason:'morning'};if(quietUntil>now)return {ok:false,reason:'quiet'};return G_OK;}
const heldSeen=new Set(),silenceDay={};
function holdNote(d,reason){const k=d.id+'|'+reason;if(heldSeen.has(k))return;heldSeen.add(k);d.heldFor=reason;silenceDay[reason]=(silenceDay[reason]||0)+1;
  if(!d.local&&db)P.inboxDoc(d.id).update({holds:{[reason]:{at:Date.now(),by:PAGE_ID}}}).catch(e=>fail('P_ACK',e,'hold'));}
function ready(d){const g=gate(d);if(!g.ok)holdNote(d,g.reason);return g.ok;}
const NAMES={liba:'ליבה',manager:'המנהל',architect:'האדריכל',builder:'סוכן הבנייה'};
const KINDW={ask:'שאלה',stuck:'נתקע',done:'סיים'};
function speakerOf(d){if(d.speaker)return d.speaker;if(/^arch/i.test(d.id||''))return 'האדריכל';return NAMES[d.from||'liba']||d.from||'ליבה';}
function prefixOf(d,who){const t=(d.text||'').trim();if(t.startsWith(who)||t.startsWith('כאן '+who))return '';let p=who;if(d.topic)p+=', בנוגע ל'+d.topic;if(KINDW[d.kind])p+=', '+KINDW[d.kind];return p+': ';}
async function pump(){if(!isArmed()){inboxQ.forEach(d=>{if(!d.local)holdNote(d,'offline');});return;}if(pumping)return;pumping=true;try{mergeTasks();const rd=inboxQ.filter(d=>ready(d)&&d.kind!=='cmd'&&!spokenLocal.has(d.id)),n=rd.length;
  if(n>=2&&!(catchupUntil>Date.now())){const asks=rd.filter(d=>d.kind==='ask'||d.kind==='stuck').length;await incoming({id:'batch-'+Date.now(),local:true,from:'liba',speaker:'ליבה',kind:asks?'stuck':'say',noListen:true,text:(rd.some(d=>d.heldFor==='quiet')?'בזמן השקט הצטברו ':rd.some(d=>d.heldFor==='offline')?'כשהייתי מנותקת הצטברו ':'הצטברו ')+n+' הודעות'+byTopic(rd)+(asks?', '+asks+' מהן שאלות. אקרא אותן ברצף, צלצול אחד.':'. אקרא אותן ברצף.')});}
  for(;;){let i=inboxQ.findIndex(d=>ready(d)&&d.kind==='cmd');if(i<0)i=inboxQ.findIndex(d=>fastLane(d)&&ready(d));if(i<0)i=inboxQ.findIndex(ready);
    if(i<0){if(staleDropped){const k=staleDropped;staleDropped=0;inboxQ.push({id:'stale-'+Date.now(),local:true,from:'liba',speaker:'ליבה',kind:'say',text:k===1?'הודעה אחת כבר לא הייתה רלוונטית, ולא הקראתי אותה.':k+' הודעות כבר לא היו רלוונטיות, ולא הקראתי אותן.',ts:Date.now()});continue;}break;}const d=inboxQ.splice(i,1)[0];if(spokenLocal.has(d.id))continue;if(d.kind==='cmd'){if(!appMode){spokenLocal.add(d.id);continue;}spokenLocal.add(d.id);await incoming(d);spokenMark(d.id);continue;}spokenLocal.add(d.id);
    if(!d.local&&expired(d)){spokenMark(d.id);Ledger.record({action:'expire',cause:'inbox:'+d.id,result:'expired'});try{await P.inboxDoc(d.id).update({expired:true,expiredAt:Date.now()});}catch(e){fail('P_ACK',e,'expire');}continue;}
    /* inbox-lease: claim before speaking. Another instance holding the claim is speaking it - try again after the claim
       would have lapsed; a claim left by a page that died lapses by itself, so nothing is lost and nothing is said twice */
    if(d.local&&(d.speaker==='הלוח'||d.proactive||d.sense)){const rule=POLICY.check(d);if(rule){spokenMark(d.id);await digestAdd(d,rule);continue;}}
    if(!d.local){const c=await inboxClaim(d);if(c==='done'){spokenMark(d.id);continue;}if(c==='busy'){spokenLocal.delete(d.id);d.retryAt=Date.now()+INBOX_RETRY;d.retryWhy='claim';inboxQ.push(d);continue;}
      if(await fresh(d)==='drop'){spokenMark(d.id);staleDropped++;Ledger.record({action:'drop',cause:'inbox:'+d.id,result:'stale'});try{await P.inboxDoc(d.id).update({expired:true,expiredAt:Date.now(),stale:true,delivery:{state:'dropped',by:PAGE_ID,at:Date.now()}});}catch(e){fail('P_ACK',e,'stale');}continue;}
      const rule=POLICY.check(d);if(rule){spokenMark(d.id);Ledger.record({action:'digest',cause:'inbox:'+d.id,decision:{rule:rule.id}});await digestAdd(d,rule);try{await P.inboxDoc(d.id).update({spoken:true,spokenAt:Date.now(),digested:rule.id,delivery:{state:'digest',by:PAGE_ID,at:Date.now(),rule:rule.id}});}catch(e){fail('P_ACK',e,'digest');}continue;}
      const sh=POLICY.shorten(d);if(sh){lastShort=sh.full;d.shortText=sh.text;}
      d.again=!!d.speakingAt&&!d.spoken;d.attempts=+(d.delivery&&d.delivery.attempts)||0;
      P.inboxDoc(d.id).update({speakingAt:Date.now(),admit:admitOf(d),delivery:{state:'speaking',by:PAGE_ID,at:Date.now(),attempts:d.attempts}}).catch(e=>fail('P_ACK',e,'speakingAt'));}
    sayOutcome='done';if(d.stream&&!d.local){await streamPlay(d);continue;}try{await incoming(d);}catch(e){fail('P_MSG_BAD',e,'inbox');log('הודעה פגומה: '+(e&&e.message||e));}/* kotlin-egress: the phone held it - a personal message and the sound would go somewhere open. Not delivered, not
       retried: it stays pending in the channel, the phone keeps it, and "תקריאי" says it and closes it (lateSpoke) */
    if(sayOutcome==='held'){Ledger.record({action:'hold',cause:'inbox:'+d.id,result:'private'});if(!d.local)P.inboxDoc(d.id).update({delivery:{state:'held',why:'private',by:PAGE_ID,at:Date.now()}}).catch(e=>fail('P_ACK',e,'held'));continue;}
    if(d.local)continue;
    /* the voice went silent without finishing (no beat, or the ceiling): not delivered - back to pending, three tries */
    if(sayOutcome==='lost'||sayOutcome==='ceiling'){spokenLocal.delete(d.id);await inboxRetry(d,sayOutcome);continue;}
    spokenMark(d.id);Ledger.record({action:'say',cause:'inbox:'+d.id,inputs:{from:d.from||'',kind:d.kind||'say'},decision:d.admit||null,result:sayOutcome});try{await P.inboxDoc(d.id).update({spoken:true,spokenAt:Date.now(),delivery:{state:'spoken',by:PAGE_ID,at:Date.now()}});}catch(e){fail('P_ACK',e,'inbox');log('ack: '+(e.code||e));}}}
  finally{pumping=false;if(inboxQ.length){clearTimeout(pumpTimer);const now=Date.now(),soon=inboxQ.filter(x=>x.retryAt>now).map(x=>x.retryAt).sort((a,b)=>a-b)[0];
    pumpTimer=setTimeout(pump,soon?Math.max(500,soon-now+50):60000);if(!soon)log(inboxQ.length+' הודעות מחכות (שקט/בוקר)');}}}
const INBOX_CLAIM=90000,INBOX_RETRY=15000,INBOX_TRIES=3,INBOX_RETRY_LOST=8000;
/* the phone said "spoke" after the page had already given up on it (no beat for six seconds on a loaded phone): the
   message was delivered after all - close it and cancel the retry, instead of saying it a second time (found by the
   chaos test under load: 1 in 200) */
function lateSpoke(mid){if(!mid||spokenDone(mid))return;spokenMark(mid);spokenLocal.add(mid);for(let i=inboxQ.length-1;i>=0;i--)if(inboxQ[i].id===mid)inboxQ.splice(i,1);
  Ledger.record({action:'say',cause:'inbox:'+mid,result:'late'});if(db)P.inboxDoc(mid).update({spoken:true,spokenAt:Date.now(),delivery:{state:'spoken',by:PAGE_ID,at:Date.now(),late:true}}).catch(e=>fail('P_ACK',e,'late'));}
/* freshness-ttl: a message may say how long it means anything (validUntil) and what happens after: drop it, say it
   with its age (the default), or restate - read its source again (restate:'tasks/<id>') and say what is true now.
   restate has a hard 1.5 s ceiling and falls back to age, so a slow read never holds a message back. */
const RESTATE_MAX=1500;let staleDropped=0;
const TASK_HE={queued:'ממתינה',running:'רצה',blocked:'תקועה ומחכה לך',done:'גמורה',archived:'בארכיון'};
async function fresh(d){if(d.local||!(+d.validUntil>0)||Date.now()<=+d.validUntil)return 'speak';const mode=d.staleMode||'age';
  if(mode==='drop'&&d.kind!=='ask'&&d.kind!=='stuck')return 'drop'; /* a question is never dropped - it still needs an answer */
  if(mode==='restate'&&/^tasks\/[A-Za-z0-9_\-.~:@+]{1,200}$/.test(String(d.restate||''))){
    try{const g=await Promise.race([P.task(String(d.restate).slice(6)).get(),new Promise((_,no)=>setTimeout(()=>no(new Error('restate slow')),RESTATE_MAX))]);
      const t=g.exists?(g.data()||{}):null;if(t){d.text='עכשיו '+(t.title||'המשימה')+' '+(TASK_HE[t.status]||t.status||'')+(t.question&&t.status==='blocked'?': '+t.question:'')+'.';d.restated=true;}}
    catch(e){fail('P_DB_READ',e,'restate');}}
  return 'speak';}
/* five updates on one task are one sentence: the newest, saying how many came before it. Questions are never merged. */
function mergeTasks(){const by={};inboxQ.forEach(d=>{const k=d.task||d.taskId;if(!k||d.kind==='ask'||d.kind==='stuck'||!ready(d)||spokenLocal.has(d.id))return;(by[k]=by[k]||[]).push(d);});
  for(const k of Object.keys(by)){const g=by[k];if(g.length<2)continue;g.sort((a,b)=>(a.ts||0)-(b.ts||0));const keep=g[g.length-1];keep.merged=(keep.merged||1)+g.length-1;
    g.slice(0,-1).forEach(d=>{inboxQ.splice(inboxQ.indexOf(d),1);spokenLocal.add(d.id);if(!d.local){spokenMark(d.id);P.inboxDoc(d.id).update({spoken:true,spokenAt:Date.now(),merged:keep.id}).catch(e=>fail('P_ACK',e,'merge'));}});}}
/* the batch intro says what the pile is about: "5 על הבנייה, 3 על המייל" */
function byTopic(list){const c={};list.forEach(d=>{const t=d.topic||'';if(t)c[t]=(c[t]||0)+1;});const e=Object.entries(c).sort((a,b)=>b[1]-a[1]);if(e.length<2)return '';
  return ': '+e.slice(0,3).map(([t,k])=>(k===1?'אחת':k)+' על '+t).join(', ')+(e.length>3?' ועוד':'');}
window.__fresh={ago:agoWords,fresh:fresh,merge:mergeTasks};
async function inboxClaim(d){let r;try{r=await P.inboxDoc(d.id).acquire({holder:PAGE_ID,ttlMs:INBOX_CLAIM});}
  catch(e){fail('P_ACK',e,'claim');return 'ok';} /* a store without leases: speak anyway - silence is worse than a rare repeat */
  if(r&&r.acquired===false)return 'busy';
  /* the claim is ours - but the queue it came from may be old: the other device may have said it to the end and acked it
     while this one waited for its claim to lapse (found by the chaos test, 1-3 in 200). Read it once more, now. */
  try{const g=await P.inboxDoc(d.id).get();const x=g.exists?(g.data()||{}):null;if(!x||x.spoken||x.expired||x.failed)return 'done';}catch(e){fail('P_DB_READ',e,'claim recheck');}
  return 'ok';}
async function inboxRetry(d,why){const attempts=(d.attempts||0)+1;Ledger.record({action:attempts>=INBOX_TRIES?'fail':'retry',cause:'inbox:'+d.id,inputs:{why},result:attempts});
  if(attempts>=INBOX_TRIES){spokenMark(d.id);try{await P.inboxDoc(d.id).update({failed:true,failedAt:Date.now(),delivery:{state:'failed',by:PAGE_ID,at:Date.now(),attempts:attempts,lastError:why}});}catch(e){fail('P_ACK',e,'failed');}
    queueLocal({id:'failed-'+d.id,kind:'say',speaker:'ליבה',topic:'הודעה',text:'יש הודעה שלא הצלחתי להקריא שלוש פעמים'+(d.topic?', בנוגע ל'+d.topic:'')+'. היא נשארת בערוץ.'});return;}
  try{await P.inboxDoc(d.id).update({delivery:{state:'pending',by:PAGE_ID,at:Date.now(),attempts:attempts,lastError:why}});}catch(e){fail('P_ACK',e,'retry');}
  d.attempts=attempts;d.delivery={attempts:attempts};d.retryAt=Date.now()+INBOX_RETRY_LOST;d.retryWhy='retry';inboxQ.push(d);}
/* "מה פספסתי" / "מה חיכה לי": what is waiting right now and why; "תשחרר הכול" / "תשחרר רק שאלות" lets it through. A
   release goes through the same pump - merged, grouped, one intro - never an avalanche. Another device's claim and a
   command with no bubble are never released: that would mean saying it twice, or running it nowhere. */
const HOLD_HE={shabbat:'כי שבת',call:'כי אתה בשיחה',meeting:'כי אתה בפגישה',catchup:'מחכות שתגיד הכול',quiet:'בגלל השקט',morning:'מחכות לבוקר',offline:'כי הייתי מנותקת',claim:'כי מכשיר אחר מקריא אותן',retry:'כי הקול נפל ואני מנסה שוב',noapp:'פקודות שמחכות לבועה'};
const heldNow=()=>inboxQ.filter(d=>!spokenLocal.has(d.id)).map(d=>({d,g:gate(d)})).filter(x=>!x.g.ok);
function missedList(){{const h=heldNow();const by={};h.forEach(x=>{by[x.g.reason]=(by[x.g.reason]||0)+1;});
    const parts=Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([r,n])=>(n===1?'אחת':n)+' '+(HOLD_HE[r]||r));
    const today=Object.values(silenceDay).reduce((a,b)=>a+b,0);
    sayLocal(h.length?(h.length===1?'מחכה לך הודעה אחת: ':'מחכות לך '+h.length+' הודעות: ')+parts.join(', ')+'. תגיד תשחרר הכול, או תשחרר רק שאלות.':'לא פספסת כלום'+(today?', הכול כבר הוקרא.':'.'));return true;}}
function missedAll(){return missedRelease(false);}
function missedAsks(){return missedRelease(true);}
function missedRelease(asks){{let n=0;heldNow().forEach(({d,g})=>{if(g.reason==='claim'||g.reason==='noapp')return;if(asks&&d.kind!=='ask'&&d.kind!=='stuck')return;d.release=true;if(d.retryWhy==='retry')d.retryAt=0;n++;});
    sayLocal(n?'משחררת '+(n===1?'הודעה אחת':n+' הודעות')+'.':'אין מה לשחרר.');setTimeout(pump,400);return true;}}
window.__silence={gate:gate,held:()=>heldNow().map(x=>({id:x.d.id,reason:x.g.reason})),day:()=>Object.assign({},silenceDay)};
/* stream-answer: a long answer is heard while it is still being written. The session writes inbox/<id> with stream:true
   and then inbox/<id>/parts/<seq> one sentence at a time, the last with final:true. The page speaks each part the
   moment it lands, in order; a part that does not come for a minute is said once ("ההמשך מתעכב") and the wait goes on
   to five minutes. When it ends, the whole text goes back on the message and the parts are deleted - nothing orphaned. */
const STREAM_STALL=60000,STREAM_GIVEUP=5*60000;
function fastLane(d){return d.priority==='urgent'||(!!d.re&&d.re===lastReqId&&Date.now()-lastReqAt<5*60000);}
async function streamPlay(d){const parts=new Map();let next=1,done=false,wake=null,stalled=false,first=true;const all=[];
  const unsub=P.parts(d.id).orderBy('seq','asc').limit(200).onSnapshot(q=>{q.docChanges().forEach(c=>{if(c.type!=='removed'){const x=c.doc.data()||{};x._id=c.doc.id;parts.set(+x.seq||0,x);}});if(wake)wake();},e=>fail('P_DB_READ',e,'parts'));
  let lastAt=Date.now();
  try{while(!done){const x=parts.get(next);
      if(!x){if(Date.now()-lastAt>STREAM_GIVEUP){fail('P_MSG_BAD',null,'stream gave up '+d.id);break;}
        if(!stalled&&Date.now()-lastAt>STREAM_STALL){stalled=true;await incoming({id:'stall-'+d.id,local:true,from:'liba',speaker:'ליבה',kind:'say',text:'ההמשך מתעכב. אמשיך כשיגיע.'});}
        await new Promise(r=>{wake=r;setTimeout(r,1000);});wake=null;continue;}
      lastAt=Date.now();all.push(String(x.text||''));
      if(first){first=false;await incoming(Object.assign({},d,{text:String(x.text||''),options:x.final?d.options:[],kind:x.final?d.kind:'say'}));}
      else if(appMode)await sayApp(String(x.text||''),{kind:x.final?(d.kind||'say'):'say',options:x.final?(d.options||[]):[],from:d.from||'liba',speaker:'',mid:''});else await say(String(x.text||''));
      if(x.final)done=true;next++;}}
  finally{try{unsub&&unsub();}catch(e){}}
  spokenMark(d.id);try{await P.inboxDoc(d.id).update({spoken:true,spokenAt:Date.now(),text:all.join(' '),streamDone:done,delivery:{state:'spoken',by:PAGE_ID,at:Date.now()}});}catch(e){fail('P_ACK',e,'stream');}
  for(const x of parts.values()){P.parts(d.id).doc(x._id).delete().catch(()=>{});}}
/* days: after a gap of more than six hours, the first hello does not pour the pile - it says a three-sentence briefing
   (how long, what is stuck, what finished) and offers "הכול". Ordinary messages from before wait for that, or fifteen
   minutes; questions and urgent ones never wait. */
const CATCHUP_GAP=6*3600e3,CATCHUP_HOLD=15*60000;let catchupUntil=0,catchupAt=0;
function catchupCheck(){let last=0;try{last=+localStorage.getItem(LSK('lastHello'))||0;localStorage.setItem(LSK('lastHello'),String(Date.now()));}catch(e){}
  const now=Date.now();if(!last||now-last<CATCHUP_GAP)return;
  const waiting=inboxQ.filter(d=>!d.local&&!spokenLocal.has(d.id)&&d.kind!=='cmd'&&!expired(d));if(waiting.length<3)return;
  catchupAt=now;catchupUntil=now+CATCHUP_HOLD;setTimeout(()=>{catchupUntil=0;pump();},CATCHUP_HOLD+500);
  const stuck=lastTasks.filter(t=>t.status==='blocked').map(t=>t.title).slice(0,3),done=lastTasks.filter(t=>t.status==='done'&&(+t.updatedAt||0)>last).length;
  const asks=waiting.filter(d=>d.kind==='ask'||d.kind==='stuck').length;
  const ag=agoWords(now,last),a='לא דיברנו '+(ag.charAt(0)==='מ'?ag.slice(1):ag)+'. מחכות לך '+waiting.length+' הודעות'+(asks?', '+asks+' מהן שאלות שאקרא מיד':'')+'.';
  const b=stuck.length?'תקוע: '+stuck.join(', ')+'.':'אין משימה תקועה.';const c=done?'בינתיים נגמרו '+done+' משימות.':'';
  queueLocal({id:'catchup-'+now,kind:'say',release:true,speaker:'ליבה',topic:'תדרוך',text:[a,b,c,'תגיד "הכול" ואקריא את השאר.'].filter(Boolean).join(' ')});}
function catchupAll(){if(!catchupUntil)return false;catchupUntil=0;sayLocal('מקריאה את כולן.');setTimeout(pump,300);return true;}
/* "על מה דיברנו אתמול" / "תחזור לשיחה על X": from the conversation log and its folds */
/* a log between two times, live rows and the janitor's folds together, each row with its id */
async function logBetween(kind,col,from,to,n){const r=await coldGet(col,[['ts','>=',from],['ts','<',to]],n||300);const rows=r.docs.map(x=>Object.assign({id:x.id},x.data()||{}));const have=new Set(rows.map(x=>x.id));
  try{const f=await coldGet(P.folds(),[['kind','==',kind]],60);f.docs.forEach(x=>{const it=(x.data()||{}).items||{};Object.entries(it).forEach(([k,v])=>{if(!have.has(k)&&(+v.ts||0)>=from&&(+v.ts||0)<to){have.add(k);rows.push(Object.assign({id:k},v));}});});}catch(e){}
  return rows.sort((a,b)=>(a.ts||0)-(b.ts||0));}
const turnsBetween=(from,to,n)=>logBetween('turns',P.turns(),from,to,n);
async function daysYesterday(){const d0=new Date();d0.setHours(0,0,0,0);const to=d0.getTime(),from=to-864e5;let rows;
  try{rows=await turnsBetween(from,to);}catch(e){fail('P_DB_READ',e,'turns');sayLocal('לא הצלחתי לקרוא את השיחה של אתמול.');return true;}
  if(!rows.length){sayLocal('אתמול לא דיברנו.');return true;}
  const mine=rows.filter(x=>x.from==='user'),topics={};rows.forEach(x=>{if(x.topic)topics[x.topic]=(topics[x.topic]||0)+1;});
  const top=Object.entries(topics).sort((a,b)=>b[1]-a[1]).slice(0,4).map(x=>x[0]);
  sayLocal('אתמול אמרת '+mine.length+' משפטים וקיבלת '+(rows.length-mine.length)+' הודעות.'+(top.length?' הנושאים: '+top.join(', ')+'.':'')+(mine.length?' המשפט האחרון שלך: '+String(mine[mine.length-1].text||'').slice(0,80)+'.':''));return true;}
async function daysBack(rest){const q=rest.trim();if(!q)return false;let rows;
  try{rows=await turnsBetween(Date.now()-7*864e5,Date.now()+1);}catch(e){fail('P_DB_READ',e,'turns');sayLocal('לא הצלחתי לקרוא את השיחות.');return true;}
  const hits=rows.filter(x=>String(x.text||'').includes(q)||String(x.topic||'').includes(q)).slice(-3);
  if(!hits.length){sayLocal('לא מצאתי שיחה על '+q+' בשבוע האחרון.');return true;}
  sayLocal('על '+q+', '+agoWords(Date.now(),+hits[0].ts||Date.now())+': '+hits.map(x=>(x.from==='user'?'אמרת: ':'')+String(x.text||'').slice(0,90)).join('. ')+'.');return true;}
