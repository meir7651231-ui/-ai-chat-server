// @anchor: send
// sending: outbox, retry, duplicate guard
/* wal-queue: Meir's sentence is written down BEFORE it is sent, not after it failed. Before, a page that closed
   mid-send lost the sentence; and the outbox removed items by object identity, so nothing stopped a resend
   after a reload. Now every item is keyed by its request id, carries a phase and a lease:
     queued  - waiting for the next flush
     sending - someone is delivering it right now, until leaseUntil (a dead page's lease simply expires)
   and before any resend the request is checked in the database - if it already went out, it is dropped.
   localStorage and not IndexedDB: it already works inside this iframe, and each write is atomic. */
const LEASE=60000;
let outbox=[];try{outbox=JSON.parse(localStorage.getItem('liba.outbox')||'[]');}catch(e){fail('P_STORE',e,'get outbox');}
outbox=outbox.map(it=>Object.assign({phase:'queued',leaseUntil:0,attempts:0},it,{req:it.req||('legacy-'+mintId())}));
function saveOutbox(){try{localStorage.setItem('liba.outbox',JSON.stringify(outbox));}catch(e){fail('P_STORE',e,'set outbox');}}
const walFind=req=>outbox.find(x=>x.req===req);
function walPut(it){outbox=outbox.filter(x=>x.req!==it.req);outbox.push(it);saveOutbox();}
function walLease(req){const it=walFind(req);if(!it)return null;it.phase='sending';it.leaseUntil=Date.now()+LEASE;it.attempts=(it.attempts||0)+1;saveOutbox();return it;}
function walRelease(req){const it=walFind(req);if(!it)return;it.phase='queued';it.leaseUntil=0;saveOutbox();}
function walDone(req){outbox=outbox.filter(x=>x.req!==req);saveOutbox();}
const walPending=()=>outbox.filter(x=>x.phase==='queued'||(x.phase==='sending'&&x.leaseUntil<Date.now()));
let lastSent={text:'',id:'',ts:0},lastIncomingAt=0;
function drainQ(){if(sendQ.length){const nx=sendQ.shift();setTimeout(()=>send({text:nx.text,tag:nx.tag,source:nx.source,stamps:nx.stamps}),300);return true;}return false;}
const RETRYABLE=r=>/network|fetch|timeout|unavailable|rate|503|502|429|offline|aborted|internal/i.test(r);
function tagOf(o){return (o||owner)==='manager'?'[ליבה→מנהל] ':'[ליבה] ';}
async function deliver(text,tag){
  let reason='no_comments';
  if(!comments){fail('P_SEND',null,reason);return {sent:false,reason};}
  try{const can=await comments.canSendToClaude();if(can!=='available'){fail('P_SEND',null,can);return {sent:false,reason:String(can)};}
    const anchor=await comments.anchorFor(H);await comments.sendToClaude({anchor,text:(tag||tagOf())+text});return {sent:true,reason:''};}
  catch(e){fail('P_SEND',e,(e&&(e.code||e.name))||'throw');return {sent:false,reason:String(e&&e.code||e)};}
}
async function deliverWithRetry(text,tag){
  const waits=[0,2000,5000,10000];let r={sent:false,reason:'offline'};
  for(let i=0;i<waits.length;i++){
    if(waits[i])await new Promise(res=>setTimeout(res,waits[i]));
    if(!navigator.onLine){r={sent:false,reason:'offline'};continue;}
    r=await deliver(text,tag);if(r.sent)return r;
    log('שליחה נכשלה ('+r.reason+') ניסיון '+(i+1));
    if(!RETRYABLE(r.reason))return r;
  }
  return r;
}
let flushing=false;
async function flushOutbox(){
  if(flushing||!walPending().length||!navigator.onLine||!comments)return;
  flushing=true;let items=[];
  let delivered=0;
  try{items=walPending();for(const it of items){
    // a sentence whose request is already sent went out before a reload: drop it, never send it twice
    if(!/^legacy-/.test(it.req)){try{const g=await P.req(it.req).get();const st=g.exists&&(g.data()||{}).state;if(st==='sent'||st==='answered'){walDone(it.req);continue;}}catch(e){fail('P_DB_READ',e,'req before resend');}}
    if(!walLease(it.req))continue;
    const r=await deliver(it.text,it.tag);if(!r.sent){walRelease(it.req);break;}
    walDone(it.req);delivered++;
    try{P.req(it.req).update({state:'sent',sentAt:Date.now(),late:true}).catch(e=>fail('P_DB_WRITE',e,'req late'));}catch(e){}
    post(PROTO.toApp.sent,{text:it.text,late:true});bubble('li','נשלח באיחור: '+it.text);}}
  finally{flushing=false;}
  if(delivered&&!walPending().length){const m='ליבה, בנוגע לשליחה: מה שאמרת נשלח עכשיו.';if(appMode)post(PROTO.toApp.say,{text:m,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(m);}
}
window.addEventListener('online',()=>setTimeout(flushOutbox,1500));setInterval(flushOutbox,8000);
/* req-spine: the id a session puts in inbox.re to say which sentence it answers. It goes at the END of the
   text so the tag at the start stays exactly '[ליבה] ' / '[ליבה→מנהל] ' - other sessions route on it. */
const reqMark=id=>' ⟦#'+id+'⟧';
const SOURCES=['voice','typed','share','option'];
async function send(text,forcedTag,source){
  let stamps=null;if(text&&typeof text==='object'){forcedTag=text.tag;source=text.source;stamps=text.stamps||null;text=text.text;}
  source=SOURCES.indexOf(source)>=0?source:'voice';
  text=String(text||'').replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\ufeff\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7]/g,'').replace(/\s+/g,' ').trim();if(!text)return;
  if(!forcedTag&&switchOwner(text)){post(PROTO.toApp.sent,{text,local:true});if(!isBusy())drainQ();return;}
  const tag=forcedTag||tagOf();
  if(isBusy()){sendQ.push({text,tag,source,stamps});post(PROTO.toApp.queued,{text});return;}transition('SENDING','send');const id=cur?cur.id:'free';cur=null;
  $('typed').value='';OPTS.innerHTML='';$('ack').hidden=true;HEARD.hidden=true;
  if(text===lastSent.text&&(id==='free'||id===lastSent.id)&&Date.now()-lastSent.ts<5000){log('כפילות – לא נשלח שוב');post(PROTO.toApp.sent,{text,dup:true});transition('IDLE','duplicate');drainQ();return;}
  bubble('me',text);const th=bubble('li think','ליבה חושבת…');
  /* one request per sentence: what was said, how, to whom, and what it answered - so "how many did ליבה
     close" is a query and not a feeling */
  const reqId=mintId();
  ledgerBump('req');
  try{P.req(reqId).set({text,askedAt:Date.now(),owner,tag:tag.trim(),source,reBubble:id,device:appMode?'app':'browser',state:'sending',
    t:{voice:(stamps&&+stamps.voice)||0,heard:(stamps&&+stamps.heard)||0,asked:Date.now(),skew:clockSkew,skewBad:clockSkew!=null&&Math.abs(clockSkew)>SKEW_MAX}}).catch(e=>fail('P_DB_WRITE',e,'req'));}catch(e){fail('P_DB_WRITE',e,'req');}
  try{if(memSettings.decisions&&lastAsk&&(Date.now()-lastAsk.at<3*60*1000)){P.decisions().doc(mintId()).set({question:lastAsk.text,to:lastAsk.speaker,topic:lastAsk.topic||'',answer:text,msg:lastAsk.id,ts:Date.now()}).catch(e=>fail('P_DB_WRITE',e,'decisions/log/items'));lastAsk=null;}}catch(e){fail('P_DB_WRITE',e,'decisions/log/items');}
  try{if(memSettings.logTurns)P.turns().doc(mintId()).set({from:'user',speaker:'מאיר',to:owner,text,re:id,req:reqId,ts:Date.now()}).catch(e=>fail('P_DB_WRITE',e,'chat/log/turns'));}catch(e){fail('P_DB_WRITE',e,'chat/log/turns');}
  walPut({req:reqId,text:text+reqMark(reqId),tag,ts:Date.now(),phase:'sending',leaseUntil:Date.now()+LEASE,attempts:1});
  const r=await deliverWithRetry(text+reqMark(reqId),tag);const sent=r.sent,reason=r.reason;
  const reqState=st=>{try{P.req(reqId).update(Object.assign({state:st,at:Date.now()},st==='sent'?{sentAt:Date.now()}:{reason:String(reason||'')})).catch(e=>fail('P_DB_WRITE',e,'req state'));}catch(e){}};
  if(sent){walDone(reqId);lastSent={text,id,ts:Date.now()};reqState('sent');}
  else if(RETRYABLE(reason)||reason==='offline'){reqState('queued');walRelease(reqId);const off=!navigator.onLine||reason==='offline';th.textContent=off?'אין רשת – שמרתי, אשלח כשתחזור':'השליחה נכשלה ('+reason+') – שמרתי, אנסה שוב';post(PROTO.toApp.outbox,{text,n:outbox.length,reason});const msg=off?'ליבה, בנוגע לרשת: אין רשת. שמרתי את מה שאמרת, ואשלח כשהרשת תחזור.':'ליבה, בנוגע לשליחה: השרת לא קיבל את זה כרגע. שמרתי, ואשלח שוב בעוד רגע.';if(appMode)post(PROTO.toApp.say,{text:msg,kind:'say',options:[],from:'liba',speaker:'ליבה'});else await say(msg);}
  else{walDone(reqId);reqState('failed');th.textContent='לא הצלחתי לשלוח ('+reason+') – נסה שוב';await say('לא הצלחתי לשלוח');}
  post(sent?PROTO.toApp.sent:(outbox.length&&(RETRYABLE(reason)||reason==='offline')?PROTO.toApp.queued:PROTO.toApp.error),{text,reason});
  transition('IDLE','sent');
  if(drainQ())return;
  if(!sent&&handsFree&&!outbox.length)idleListen();
}
