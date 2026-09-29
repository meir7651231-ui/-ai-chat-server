// @anchor: bridge
// page <-> bubble messages, typed input, the transcript bubbles

/* ---- capabilities ---- */
let handsFree=true,busy=false,seen=null,appMode=false,lastAsk=null;
/* fail() never posts – P_BRIDGE would otherwise call the thing that just broke */
function post(kind,extra){try{window.parent.postMessage(Object.assign({liba:kind},extra||{}),'*');}catch(e){fail('P_BRIDGE',e,kind);}}
window.addEventListener('message',e=>{if(e.source!==window.parent)return;const d=e.data;if(!d||!d.liba)return;
  if(d.liba==='hello'){appMode=true;armed=true;appVer=String(d.ver||'');trVer=appVer;try{if(!window.__devSent){window.__devSent=true;P.device().set({app:d.ver||'',page:39,pageHash:__PAGE_HASH__,at:Date.now(),ua:navigator.userAgent.slice(0,120)}).catch(e=>fail('P_DB_WRITE',e,'channel/device'));}}catch(e){fail('P_DB_WRITE',e,'channel/device');}handsFree=false;$('start').hidden=true;$('hf').hidden=true;$('talk').hidden=true;SUB.textContent='מחובר לבועה של אנדרואיד';setSt('בועה','on');post('ready',{});if(cur&&cur.id!==seen){const c=cur;cur=null;incoming(c);}pump();}
  else if(d.liba==='spoke'){const f=sayWait.get(String(d.id||''));if(f)f();}
  else if(d.liba==='crash'&&d.text&&db){P.crash((d.id||Date.now())).set({text:String(d.text).slice(0,4000),version:String(d.version||''),ts:Date.now()}).then(()=>post('crashSaved',{id:d.id})).catch(e=>{fail('P_DB_WRITE',e,'crashes');log('crash: '+(e.code||e));});}
  else if(d.liba==='trace'&&d.events&&db){trBridge(String(d.batch||''),String(d.events));}
  else if(d.liba==='input'&&d.text){if(pendingInput){const prev=pendingInput;pendingInput=null;clearTimeout(pendingT);send(prev);}pendingInput=String(d.text);post('tap',{});clearTimeout(pendingT);pendingT=setTimeout(()=>{if(pendingInput){const t=pendingInput;pendingInput=null;send(t);}},1500);}
});
let pendingInput=null,pendingT=null;
['pointerdown','click','touchstart'].forEach(ev=>document.addEventListener(ev,()=>{if(pendingInput){const t=pendingInput;pendingInput=null;clearTimeout(pendingT);send(t);}},true));
try{seen=localStorage.getItem('liba.seen');}catch(e){fail('P_STORE',e,'get seen');}
const TR=$('tr');
function bubble(cls,text){const d=document.createElement('div');d.className=cls;d.textContent=text;TR.appendChild(d);while(TR.children.length>8)TR.firstChild.remove();TR.scrollTop=TR.scrollHeight;TR.hidden=false;return d;}
