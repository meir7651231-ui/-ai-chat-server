// @anchor: send
// sending: outbox, retry, duplicate guard
/* steps 16-18: outbox (offline), auto-retry, duplicate guard */
let outbox=[];try{outbox=JSON.parse(localStorage.getItem('liba.outbox')||'[]');}catch(e){fail('P_STORE',e,'get outbox');}
function saveOutbox(){try{localStorage.setItem('liba.outbox',JSON.stringify(outbox));}catch(e){fail('P_STORE',e,'set outbox');}}
let lastSent={text:'',id:'',ts:0},lastIncomingAt=0;
function drainQ(){if(sendQ.length){const nx=sendQ.shift();setTimeout(()=>send(nx.text,nx.tag),300);return true;}return false;}
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
  if(flushing||!outbox.length||!navigator.onLine||!comments)return;
  flushing=true;let items=[];
  try{items=outbox.slice();for(const it of items){const r=await deliver(it.text,it.tag);if(!r.sent)break;outbox=outbox.filter(x=>x!==it);saveOutbox();post('sent',{text:it.text,late:true});bubble('li','נשלח באיחור: '+it.text);}}
  finally{flushing=false;}
  if(!outbox.length&&items.length){const m='ליבה, בנוגע לשליחה: מה שאמרת נשלח עכשיו.';if(appMode)post('say',{text:m,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(m);}
}
window.addEventListener('online',()=>setTimeout(flushOutbox,1500));setInterval(flushOutbox,8000);
async function send(text,forcedTag){
  if(text&&typeof text==='object'){forcedTag=text.tag;text=text.text;}
  text=String(text||'').replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\ufeff\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7]/g,'').replace(/\s+/g,' ').trim();if(!text)return;
  if(!forcedTag&&switchOwner(text)){post('sent',{text,local:true});if(!isBusy())drainQ();return;}
  const tag=forcedTag||tagOf();
  if(isBusy()){sendQ.push({text,tag});post('queued',{text});return;}transition('SENDING','send');const id=cur?cur.id:'free';cur=null;
  $('typed').value='';OPTS.innerHTML='';$('ack').hidden=true;HEARD.hidden=true;
  if(text===lastSent.text&&(id==='free'||id===lastSent.id)&&Date.now()-lastSent.ts<5000){log('כפילות – לא נשלח שוב');post('sent',{text,dup:true});transition('IDLE','duplicate');drainQ();return;}
  bubble('me',text);const th=bubble('li think','ליבה חושבת…');
  try{if(memSettings.decisions&&lastAsk&&(Date.now()-lastAsk.at<3*60*1000)){P.decisions().doc(String(Date.now())).set({question:lastAsk.text,to:lastAsk.speaker,topic:lastAsk.topic||'',answer:text,msg:lastAsk.id,ts:Date.now()}).catch(e=>fail('P_DB_WRITE',e,'decisions/log/items'));lastAsk=null;}}catch(e){fail('P_DB_WRITE',e,'decisions/log/items');}
  try{if(memSettings.logTurns)P.turns().doc(String(Date.now())).set({from:'user',speaker:'מאיר',to:owner,text,re:id,ts:Date.now()}).catch(e=>fail('P_DB_WRITE',e,'chat/log/turns'));}catch(e){fail('P_DB_WRITE',e,'chat/log/turns');}
  const r=await deliverWithRetry(text,tag);const sent=r.sent,reason=r.reason;
  if(sent){lastSent={text,id,ts:Date.now()};}
  else if(RETRYABLE(reason)||reason==='offline'){outbox.push({text,tag,ts:Date.now()});saveOutbox();const off=!navigator.onLine||reason==='offline';th.textContent=off?'אין רשת – שמרתי, אשלח כשתחזור':'השליחה נכשלה ('+reason+') – שמרתי, אנסה שוב';post('outbox',{text,n:outbox.length,reason});const msg=off?'ליבה, בנוגע לרשת: אין רשת. שמרתי את מה שאמרת, ואשלח כשהרשת תחזור.':'ליבה, בנוגע לשליחה: השרת לא קיבל את זה כרגע. שמרתי, ואשלח שוב בעוד רגע.';if(appMode)post('say',{text:msg,kind:'say',options:[],from:'liba',speaker:'ליבה'});else await say(msg);}
  else{th.textContent='לא הצלחתי לשלוח ('+reason+') – נסה שוב';await say('לא הצלחתי לשלוח');}
  post(sent?'sent':(outbox.length&&(RETRYABLE(reason)||reason==='offline')?'queued':'error'),{text,reason});
  transition('IDLE','sent');
  if(drainQ())return;
  if(!sent&&handsFree&&!outbox.length)idleListen();
}
