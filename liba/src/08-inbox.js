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
function expired(d){const lim=EXPIRE[d.kind||'say'];return !!lim&&!d.priority&&ageOf(d)>lim;}
window.__kernel={state:()=>state,illegal:()=>illegalMoves,log:stateLog,forgetLoad:()=>spokenLocal.clear(),spoken:()=>Object.assign({},spokenStore)};
function queueLocal(d){d.local=true;d.from='liba';d.ts=Date.now();if(!inboxQ.some(x=>x.id===d.id)&&!spokenLocal.has(d.id))inboxQ.push(d);pump();}
/* step 19: priority – urgent bypasses quiet; morning waits for 08:00 */
function ready(d){if(d.retryAt>Date.now())return false;if(d.kind==='cmd')return appMode;const p=d.priority||'normal';if(p==='urgent')return true;if(p==='morning'){const h=new Date().getHours();if(h<8||h>=22)return false;}if(quietUntil>Date.now())return false;return true;}
const NAMES={liba:'ליבה',manager:'המנהל',architect:'האדריכל',builder:'סוכן הבנייה'};
const KINDW={ask:'שאלה',stuck:'נתקע',done:'סיים'};
function speakerOf(d){if(d.speaker)return d.speaker;if(/^arch/i.test(d.id||''))return 'האדריכל';return NAMES[d.from||'liba']||d.from||'ליבה';}
function prefixOf(d,who){const t=(d.text||'').trim();if(t.startsWith(who)||t.startsWith('כאן '+who))return '';let p=who;if(d.topic)p+=', בנוגע ל'+d.topic;if(KINDW[d.kind])p+=', '+KINDW[d.kind];return p+': ';}
async function pump(){if(pumping||!isArmed())return;pumping=true;try{mergeTasks();const rd=inboxQ.filter(d=>ready(d)&&d.kind!=='cmd'&&!spokenLocal.has(d.id)),n=rd.length;
  if(n>=2){const asks=rd.filter(d=>d.kind==='ask'||d.kind==='stuck').length;await incoming({id:'batch-'+Date.now(),local:true,from:'liba',speaker:'ליבה',kind:asks?'stuck':'say',noListen:true,text:'הצטברו '+n+' הודעות'+byTopic(rd)+(asks?', '+asks+' מהן שאלות. אקרא אותן ברצף, צלצול אחד.':'. אקרא אותן ברצף.')});}
  for(;;){let i=inboxQ.findIndex(d=>ready(d)&&d.kind==='cmd');if(i<0)i=inboxQ.findIndex(ready);
    if(i<0){if(staleDropped){const k=staleDropped;staleDropped=0;inboxQ.push({id:'stale-'+Date.now(),local:true,from:'liba',speaker:'ליבה',kind:'say',text:k===1?'הודעה אחת כבר לא הייתה רלוונטית, ולא הקראתי אותה.':k+' הודעות כבר לא היו רלוונטיות, ולא הקראתי אותן.',ts:Date.now()});continue;}break;}const d=inboxQ.splice(i,1)[0];if(spokenLocal.has(d.id))continue;if(d.kind==='cmd'){if(!appMode){spokenLocal.add(d.id);continue;}spokenLocal.add(d.id);await incoming(d);spokenMark(d.id);continue;}spokenLocal.add(d.id);
    if(!d.local&&expired(d)){spokenMark(d.id);try{await P.inboxDoc(d.id).update({expired:true,expiredAt:Date.now()});}catch(e){fail('P_ACK',e,'expire');}continue;}
    /* inbox-lease: claim before speaking. Another instance holding the claim is speaking it - try again after the claim
       would have lapsed; a claim left by a page that died lapses by itself, so nothing is lost and nothing is said twice */
    if(!d.local){const c=await inboxClaim(d);if(c==='busy'){spokenLocal.delete(d.id);d.retryAt=Date.now()+INBOX_RETRY;inboxQ.push(d);continue;}
      if(await fresh(d)==='drop'){spokenMark(d.id);staleDropped++;try{await P.inboxDoc(d.id).update({expired:true,expiredAt:Date.now(),stale:true,delivery:{state:'dropped',by:PAGE_ID,at:Date.now()}});}catch(e){fail('P_ACK',e,'stale');}continue;}
      d.again=!!d.speakingAt&&!d.spoken;d.attempts=+(d.delivery&&d.delivery.attempts)||0;
      P.inboxDoc(d.id).update({speakingAt:Date.now(),delivery:{state:'speaking',by:PAGE_ID,at:Date.now(),attempts:d.attempts}}).catch(e=>fail('P_ACK',e,'speakingAt'));}
    sayOutcome='done';try{await incoming(d);}catch(e){fail('P_MSG_BAD',e,'inbox');log('הודעה פגומה: '+(e&&e.message||e));}if(d.local)continue;
    /* the voice went silent without finishing (no beat, or the ceiling): not delivered - back to pending, three tries */
    if(sayOutcome==='lost'||sayOutcome==='ceiling'){spokenLocal.delete(d.id);await inboxRetry(d,sayOutcome);continue;}
    spokenMark(d.id);try{await P.inboxDoc(d.id).update({spoken:true,spokenAt:Date.now(),delivery:{state:'spoken',by:PAGE_ID,at:Date.now()}});}catch(e){fail('P_ACK',e,'inbox');log('ack: '+(e.code||e));}}}
  finally{pumping=false;if(inboxQ.length){clearTimeout(pumpTimer);const now=Date.now(),soon=inboxQ.filter(x=>x.retryAt>now).map(x=>x.retryAt).sort((a,b)=>a-b)[0];
    pumpTimer=setTimeout(pump,soon?Math.max(500,soon-now+50):60000);if(!soon)log(inboxQ.length+' הודעות מחכות (שקט/בוקר)');}}}
const INBOX_CLAIM=90000,INBOX_RETRY=15000,INBOX_TRIES=3;
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
async function inboxClaim(d){try{const r=await P.inboxDoc(d.id).acquire({holder:PAGE_ID,ttlMs:INBOX_CLAIM});return r&&r.acquired===false?'busy':'ok';}
  catch(e){fail('P_ACK',e,'claim');return 'ok';} /* a store without leases: speak anyway - silence is worse than a rare repeat */}
async function inboxRetry(d,why){const attempts=(d.attempts||0)+1;
  if(attempts>=INBOX_TRIES){spokenMark(d.id);try{await P.inboxDoc(d.id).update({failed:true,failedAt:Date.now(),delivery:{state:'failed',by:PAGE_ID,at:Date.now(),attempts:attempts,lastError:why}});}catch(e){fail('P_ACK',e,'failed');}
    queueLocal({id:'failed-'+d.id,kind:'say',speaker:'ליבה',topic:'הודעה',text:'יש הודעה שלא הצלחתי להקריא שלוש פעמים'+(d.topic?', בנוגע ל'+d.topic:'')+'. היא נשארת בערוץ.'});return;}
  try{await P.inboxDoc(d.id).update({delivery:{state:'pending',by:PAGE_ID,at:Date.now(),attempts:attempts,lastError:why}});}catch(e){fail('P_ACK',e,'retry');}
  d.attempts=attempts;d.delivery={attempts:attempts};d.retryAt=Date.now()+2000;inboxQ.push(d);}
