// @anchor: bridge
// page <-> bubble messages, typed input, the transcript bubbles

/* ---- capabilities ---- */
/* protocol-contract: an app older than the page does not know some of its messages - Meir hears it once,
   because only he can install. A page older than the app is ליבה's job to publish: logged, not spoken. */
let protoSaid=false,clockSkew=null;const SKEW_MAX=1500;
/* step clock: the phone says when it really started and stopped saying an utterance, and why it stopped.
   If that utterance was a reply to a request, the request keeps both times. */
const sayReq=new Map();
function spokeTimed(d){const id=String(d.id||''),re=sayReq.get(id);sayReq.delete(id);
  if(d.cause==='guard')fail('P_SPEAK_GUARD',null,'guard');
  if(!re||!(+d.endAt>0))return;
  try{P.req(re).update({spokeStartAt:+d.startAt||0,spokeEndAt:+d.endAt,spokeCause:String(d.cause||'done')}).catch(e=>fail('P_DB_WRITE',e,'req spoke'));}catch(e){}}
/* second-channel: ids the bubble already spoke by itself while the page was dead - marked before the queue runs */
function urgentSeen(csv,by){String(csv||'').split(',').map(x=>x.trim()).filter(x=>/^[A-Za-z0-9_\-.~:@+]{1,200}$/.test(x)).forEach(id=>{if(spokenLocal.has(id)&&spokenDone(id))return;spokenMark(id);spokenLocal.add(id);
  for(let i=inboxQ.length-1;i>=0;i--)if(inboxQ[i].id===id)inboxQ.splice(i,1);
  if(/^pro-/.test(id)){proFromPhone(id);return;} /* proactive: a reminder the phone's alarm said counts in the one budget */
  if(db)P.inboxDoc(id).update({spoken:true,spokenAt:Date.now(),delivery:{state:'spoken',by:by||'native',at:Date.now()}}).catch(()=>{});});}
function protoCheck(){if(!appPv)return;
  if(appPv<PROTO.v){fail('P_PROTO_APP_OLD',null,'app '+appPv+' page '+PROTO.v);if(!protoSaid){protoSaid=true;setTimeout(()=>sayLocal('האפליקציה בטלפון ישנה מהדף, ויש הודעות שהיא לא מכירה. תגיד תתקין ואעדכן אותה.'),1500);}}
  else if(appPv>PROTO.v)fail('P_PROTO_PAGE_OLD',null,'app '+appPv+' page '+PROTO.v);}
let handsFree=true,seen=null,appMode=false,lastAsk=null;
/* fail() never posts – P_BRIDGE would otherwise call the thing that just broke */
function post(kind,extra){try{window.parent.postMessage(Object.assign({liba:kind},extra||{}),'*');}catch(e){fail('P_BRIDGE',e,kind);}}
window.addEventListener('message',e=>{if(e.source!==window.parent)return;const d=e.data;if(!d||!d.liba)return;
  /* what the phone already said (natively, or to the end before this page died) is marked before anything can pump */
  if(d.liba===PROTO.toPage.hello){urgentSeen(d.urgent,'native');urgentSeen(d.spoken,'phone');if(!appMode)catchupCheck();appMode=true;arm('hello');appVer=String(d.ver||'');appCaps=Array.isArray(d.caps)?d.caps.map(String):null;appPv=+d.pv||0;protoCheck();
    /* step clock: the page and the phone read the same wall clock, so this is transit plus drift. Over the limit,
       timings from this load are marked and left out of every statistic - never quietly corrected. */
    if(+d.wall>0){clockSkew=Date.now()-(+d.wall);if(Math.abs(clockSkew)>SKEW_MAX)fail('P_CLOCK_SKEW',null,'skew '+clockSkew);}trVer=appVer;try{if(!window.__devSent){window.__devSent=true;P.device().set({skew:(+d.wall>0?Date.now()-(+d.wall):null),app:d.ver||'',page:71,pageHash:__PAGE_HASH__,at:Date.now(),ua:navigator.userAgent.slice(0,120)}).catch(e=>fail('P_DB_WRITE',e,'channel/device'));}}catch(e){fail('P_DB_WRITE',e,'channel/device');}handsFree=false;$('start').hidden=true;$('hf').hidden=true;$('talk').hidden=true;SUB.textContent='מחובר לבועה של אנדרואיד';setSt('בועה','on');post(PROTO.toApp.ready,{});setTimeout(devMemSend,1500);setTimeout(proSchedule,2500);setTimeout(senseCfgSend,1200);setTimeout(shabbatPlaceSend,1300);if(cur&&cur.id!==seen){const c=cur;cur=null;incoming(c);}pump();}
  else if(d.liba===PROTO.toPage.spoke){spokeTimed(d);const f=sayWait.get(String(d.id||''));if(f)f(String(d.cause||'done'));}
  else if(d.liba===PROTO.toPage.speaking){const b=beatWait.get(String(d.id||''));if(b)b();}
  else if(d.liba===PROTO.toPage.crash&&d.text&&db){P.crash((d.id||mintId())).set({text:String(d.text).slice(0,4000),version:String(d.version||''),ts:Date.now()}).then(()=>post(PROTO.toApp.crashSaved,{id:d.id})).catch(e=>{fail('P_DB_WRITE',e,'crashes');log('crash: '+(e.code||e));});}
  else if(d.liba===PROTO.toPage.trace&&d.events&&db){trBridge(String(d.batch||''),String(d.events));}
  else if(d.liba===PROTO.toPage.pulse&&d.dev&&db){pulseIn(d);}
  else if(d.liba===PROTO.toPage.memAsk&&db){devMemIn(d.items);}
  else if(d.liba===PROTO.toPage.sense&&db){senseIn(d.items);}
  else if(d.liba===PROTO.toPage.calSync&&db){calIn(d.snapshot);}
  else if(d.liba===PROTO.toPage.ctx){ctxIn(d.body);}
  else if(d.liba===PROTO.toPage.input&&d.text){ledgerBump('heard');if(pendingInput){const prev=pendingInput;pendingInput=null;clearTimeout(pendingT);send(prev);}let st=null;try{st=d.stamps?JSON.parse(String(d.stamps)):null;}catch(e){fail('P_MSG_BAD',e,'stamps');}
    pendingInput={text:String(d.text),source:String(d.source||'voice'),stamps:st};post(PROTO.toApp.tap,{});clearTimeout(pendingT);pendingT=setTimeout(()=>{if(pendingInput){const t=pendingInput;pendingInput=null;send(t);}},1500);}
});
let pendingInput=null,pendingT=null;
['pointerdown','click','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{if(pendingInput){const t=pendingInput;pendingInput=null;clearTimeout(pendingT);send(t);}},true));
try{seen=localStorage.getItem(LSK('seen'));}catch(e){fail('P_STORE',e,'get seen');}
const TR=$('tr');
function bubble(cls,text){const d=document.createElement('div');d.className=cls;d.textContent=text;TR.appendChild(d);while(TR.children.length>8)TR.firstChild.remove();TR.scrollTop=TR.scrollHeight;TR.hidden=false;return d;}
