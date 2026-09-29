// @anchor: bridge
// page <-> bubble messages, typed input, the transcript bubbles

/* ---- capabilities ---- */
/* protocol-contract: an app older than the page does not know some of its messages - Meir hears it once,
   because only he can install. A page older than the app is ליבה's job to publish: logged, not spoken. */
let protoSaid=false;
function protoCheck(){if(!appPv)return;
  if(appPv<PROTO.v){fail('P_PROTO_APP_OLD',null,'app '+appPv+' page '+PROTO.v);if(!protoSaid){protoSaid=true;setTimeout(()=>sayLocal('האפליקציה בטלפון ישנה מהדף, ויש הודעות שהיא לא מכירה. תגיד תתקין ואעדכן אותה.'),1500);}}
  else if(appPv>PROTO.v)fail('P_PROTO_PAGE_OLD',null,'app '+appPv+' page '+PROTO.v);}
let handsFree=true,seen=null,appMode=false,lastAsk=null;
/* fail() never posts – P_BRIDGE would otherwise call the thing that just broke */
function post(kind,extra){try{window.parent.postMessage(Object.assign({liba:kind},extra||{}),'*');}catch(e){fail('P_BRIDGE',e,kind);}}
window.addEventListener('message',e=>{if(e.source!==window.parent)return;const d=e.data;if(!d||!d.liba)return;
  if(d.liba===PROTO.toPage.hello){appMode=true;arm('hello');appVer=String(d.ver||'');appCaps=Array.isArray(d.caps)?d.caps.map(String):null;appPv=+d.pv||0;protoCheck();trVer=appVer;try{if(!window.__devSent){window.__devSent=true;P.device().set({app:d.ver||'',page:43,pageHash:__PAGE_HASH__,at:Date.now(),ua:navigator.userAgent.slice(0,120)}).catch(e=>fail('P_DB_WRITE',e,'channel/device'));}}catch(e){fail('P_DB_WRITE',e,'channel/device');}handsFree=false;$('start').hidden=true;$('hf').hidden=true;$('talk').hidden=true;SUB.textContent='מחובר לבועה של אנדרואיד';setSt('בועה','on');post(PROTO.toApp.ready,{});if(cur&&cur.id!==seen){const c=cur;cur=null;incoming(c);}pump();}
  else if(d.liba===PROTO.toPage.spoke){const f=sayWait.get(String(d.id||''));if(f)f();}
  else if(d.liba===PROTO.toPage.speaking){const b=beatWait.get(String(d.id||''));if(b)b();}
  else if(d.liba===PROTO.toPage.crash&&d.text&&db){P.crash((d.id||mintId())).set({text:String(d.text).slice(0,4000),version:String(d.version||''),ts:Date.now()}).then(()=>post(PROTO.toApp.crashSaved,{id:d.id})).catch(e=>{fail('P_DB_WRITE',e,'crashes');log('crash: '+(e.code||e));});}
  else if(d.liba===PROTO.toPage.trace&&d.events&&db){trBridge(String(d.batch||''),String(d.events));}
  else if(d.liba===PROTO.toPage.input&&d.text){if(pendingInput){const prev=pendingInput;pendingInput=null;clearTimeout(pendingT);send(prev);}pendingInput={text:String(d.text),source:String(d.source||'voice')};post(PROTO.toApp.tap,{});clearTimeout(pendingT);pendingT=setTimeout(()=>{if(pendingInput){const t=pendingInput;pendingInput=null;send(t);}},1500);}
});
let pendingInput=null,pendingT=null;
['pointerdown','click','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{if(pendingInput){const t=pendingInput;pendingInput=null;clearTimeout(pendingT);send(t);}},true));
try{seen=localStorage.getItem('liba.seen');}catch(e){fail('P_STORE',e,'get seen');}
const TR=$('tr');
function bubble(cls,text){const d=document.createElement('div');d.className=cls;d.textContent=text;TR.appendChild(d);while(TR.children.length>8)TR.firstChild.remove();TR.scrollTop=TR.scrollHeight;TR.hidden=false;return d;}
