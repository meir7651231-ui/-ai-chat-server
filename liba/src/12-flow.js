// @anchor: flow
// start, listen loop, and speaking an incoming message
/* ---- flow ---- */
$('start').addEventListener('click',async()=>{audioInit();if(AC&&AC.state==='suspended')AC.resume();armed=true;$('start').hidden=true;$('hf').hidden=false;keepAwake();
  if(!SR){SUB.textContent='אין זיהוי דיבור בדפדפן הזה – אני אדבר, אתה תכתוב.';setSt('בלי מיקרופון','warn');}else{try{const s=await navigator.mediaDevices.getUserMedia({audio:true});s.getTracks().forEach(t=>t.stop());setSt('מיקרופון פועל','on');}catch(e){fail('P_MIC_DENIED',e);micBlocked=true;dictationMode();}}
  H.textContent='';
  if(cur){const d=cur;cur=null;incoming(d);}else{await say('אני כאן. דבר.');idleListen();}
  pump();});
$('hf').addEventListener('click',()=>{handsFree=!handsFree;$('hf').textContent='ידיים חופשיות: '+(handsFree?'פועל':'כבוי');$('hf').className='tog '+(handsFree?'on':'');if(handsFree&&!busy)idleListen();});

function dictationMode(){handsFree=false;$('hf').hidden=true;$('talk').hidden=true;setSt('מצב הכתבה','warn');SUB.textContent='הדף הזה לא מקבל מיקרופון. במקום: לחץ על השורה למטה, ואז על 🎤 במקלדת של הטלפון – זה אותו דבר.';$('typed').placeholder='לחץ כאן → 🎤 במקלדת → דבר';$('typeRow').hidden=false;$('typed').focus();}
function showTalk(){$('typeRow').hidden=false;$('talk').hidden=!SR||micBlocked;if(micBlocked)setTimeout(()=>$('typed').focus(),300);}
async function idleListen(){app.className='';KIND.textContent='';H.className='';showTalk();$('ack').hidden=true;OPTS.innerHTML='';HEARD.hidden=true;
  if(handsFree&&SR&&!busy){const t=await listen();if(t&&!busy)return send(t);if(handsFree&&!busy&&!listening)setTimeout(idleListen,800);}}

async function incoming(d){
  if(d.kind==='cmd'){if(!appMode){log('cmd (לא באפליקציה): '+(d.cmd||''));return false;}try{await P.inboxDoc(d.id).update({spoken:true,spokenAt:Date.now()});}catch(e){fail('P_ACK',e,'cmd');log('cmd ack: '+(e.code||e));}post('cmd',{cmd:d.cmd||''});log('cmd: '+(d.cmd||''));return true;}
  d.text=typeof d.text==='string'?d.text:String(d.text==null?'':d.text);
  d.options=Array.isArray(d.options)?d.options.map(o=>String(o)).filter(o=>o.length):[];
  cur=d;seen=d.id;lastIncomingAt=Date.now();try{localStorage.setItem('liba.seen',d.id);}catch(e){fail('P_STORE',e,'set seen');}
  if(rec){try{rec.abort();}catch(e){fail('P_SR',e,'abort');}}
  busy=true;try{
  TR.querySelectorAll('.think').forEach(x=>x.remove());
  const k=d.kind||'say';let ak=(d.priority==='urgent'&&(k==='say'||k==='ask'))?'call':k;
  if((ak==='call'||ak==='stuck')){if(Date.now()-lastRingAt<60000)ak='ask';else lastRingAt=Date.now();} /* step 47: one ring per batch */
  const who=speakerOf(d);const spokenText=(d.priority==='urgent'?'דחוף. ':'')+prefixOf(d,who)+d.text;
  if(!appMode&&(ak==='call'||ak==='stuck')){app.className='ring';KIND.textContent='ליבה מצלצלת';KIND.className='kind stuck';ringStart();await new Promise(r=>setTimeout(r,2400));ringStop();app.className='';}
  KIND.textContent=k==='done'?'סיימתי':k==='stuck'?'נתקעתי':'';KIND.className='kind '+k;
  bubble('li',prefixOf(d,who)+d.text);HEARD.hidden=true;OPTS.innerHTML='';
  if(k==='ask'||k==='stuck'||(d.options&&d.options.length))lastAsk={id:d.id,text:d.text,speaker:who,topic:d.topic||'',at:Date.now()};else if(!d.local)lastAsk=null;
  try{if(memSettings.logTurns)P.turns().doc(String(Date.now())).set({from:d.from||'liba',speaker:who,topic:d.topic||'',kind:k,text:d.text,msg:d.id,ts:Date.now()}).catch(e=>fail('P_DB_WRITE',e,'chat/log/turns'));}catch(e){fail('P_DB_WRITE',e,'chat/log/turns');}
  if(appMode)await sayApp(spokenText,{kind:ak,options:d.options||[],from:d.from||'liba',speaker:who});else await say(spokenText+(d.options&&d.options.length?'. '+d.options.join(', או ')+'?':''));
  if(d.legacy){try{await P.current().update({spoken:true,spokenAt:Date.now()});}catch(e){fail('P_ACK',e,'chat/current');log('legacy ack: '+(e.code||e));}}
  if(d.options&&d.options.length){OPTS.innerHTML=d.options.map(o=>`<button>${esc(o)}</button>`).join('');OPTS.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>send(b.textContent)));}
  showTalk();$('ack').hidden=k!=='done';
  }finally{busy=false;drainQ();} /* v36: a sentence said while ליבה was speaking waits in the queue – release it here */
  if(micBlocked)return;
  if(appMode)return;
  if(SR&&!d.noListen&&(handsFree||(d.options&&d.options.length)||k==='stuck')){const t=await listen();if(t&&!busy)return send(t);if(handsFree&&!busy)idleListen();}
}
$('talk').addEventListener('click',async()=>{if(busy)return;if(listening){try{rec.stop();}catch(e){fail('P_SR',e,'stop');}return;}const t=await listen();if(t)send(t);});
$('sendTyped').addEventListener('click',()=>{const v=$('typed').value.trim();if(v)send(v);});
$('typed').addEventListener('keydown',e=>{if(e.key==='Enter'){const v=$('typed').value.trim();if(v)send(v);}});
let autoT=null;$('typed').addEventListener('input',()=>{if(!micBlocked)return;clearTimeout(autoT);const v=$('typed').value.trim();if(v.length<3){log('');return;}log('שולח אוטומטית בעוד 3 שניות… (הקלדה מבטלת)');autoT=setTimeout(()=>{const v2=$('typed').value.trim();if(v2&&v2===v)send(v2);},3000);});
$('ack').addEventListener('click',()=>send('הבנתי, תמשיך'));
