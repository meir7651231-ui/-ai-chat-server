// @anchor: flow
// start, listen loop, and speaking an incoming message
/* ---- flow ---- */
$('start').addEventListener('click',async()=>{audioInit();if(AC&&AC.state==='suspended')AC.resume();arm('start');$('start').hidden=true;$('hf').hidden=false;keepAwake();
  if(!SR){SUB.textContent='אין זיהוי דיבור בדפדפן הזה – אני אדבר, אתה תכתוב.';setSt('בלי מיקרופון','warn');}else{try{const s=await navigator.mediaDevices.getUserMedia({audio:true});s.getTracks().forEach(t=>t.stop());setSt('מיקרופון פועל','on');}catch(e){fail('P_MIC_DENIED',e);micBlocked=true;dictationMode();}}
  H.textContent='';
  if(cur){const d=cur;cur=null;incoming(d);}else{await say('אני כאן. דבר.');idleListen();}
  pump();});
$('hf').addEventListener('click',()=>{handsFree=!handsFree;$('hf').textContent='ידיים חופשיות: '+(handsFree?'פועל':'כבוי');$('hf').className='tog '+(handsFree?'on':'');if(handsFree&&!isBusy())idleListen();});

function dictationMode(){handsFree=false;$('hf').hidden=true;$('talk').hidden=true;setSt('מצב הכתבה','warn');SUB.textContent='הדף הזה לא מקבל מיקרופון. במקום: לחץ על השורה למטה, ואז על 🎤 במקלדת של הטלפון – זה אותו דבר.';$('typed').placeholder='לחץ כאן → 🎤 במקלדת → דבר';$('typeRow').hidden=false;$('typed').focus();}
function showTalk(){$('typeRow').hidden=false;$('talk').hidden=!SR||micBlocked;if(micBlocked)setTimeout(()=>$('typed').focus(),300);}
async function idleListen(){app.className='';KIND.textContent='';H.className='';showTalk();$('ack').hidden=true;OPTS.innerHTML='';HEARD.hidden=true;
  if(handsFree&&SR&&!isBusy()){const t=await listen();if(t&&!isBusy())return send(t,null,'voice');if(handsFree&&!isBusy()&&!listening)setTimeout(idleListen,800);}}

/* req-spine: a reply names the sentence it answers (inbox.re). The request learns when it was first answered
   and by what. A reply whose re matches no request is counted as unbound, never dropped from the count. */
async function bindReply(d){try{const r=await P.req(String(d.re)).get();const now=Date.now();
  if(!r.exists){fail('P_REQ_UNBOUND',null,'re');return;}
  const x=r.data()||{};const reps=(Array.isArray(x.replies)?x.replies:[]).concat(String(d.id)).slice(-20);
  await P.req(String(d.re)).update({firstReplyAt:x.firstReplyAt||now,lastReplyAt:now,replies:reps,answeredBy:speakerOf(d),state:'answered'});}
  catch(e){fail('P_DB_WRITE',e,'req reply');}}
async function incoming(d){
  if(d.kind!=='cmd')ledgerBump('said');
  if(d.kind==='cmd'){if(!appMode){log('cmd (לא באפליקציה): '+(d.cmd||''));return false;}try{await P.inboxDoc(d.id).update({spoken:true,spokenAt:Date.now()});}catch(e){fail('P_ACK',e,'cmd');log('cmd ack: '+(e.code||e));}post(PROTO.toApp.cmd,{cmd:d.cmd||''});log('cmd: '+(d.cmd||''));return true;}
  d.text=typeof d.text==='string'?d.text:String(d.text==null?'':d.text);
  /* outbox-keys: a reply that quotes the sentence it answers carries its ⟦#id⟧ - never read it aloud */
  d.text=d.text.replace(/\s*⟦#[0-9a-z]+⟧/g,'');
  d.options=Array.isArray(d.options)?d.options.map(o=>String(o)).filter(o=>o.length):[];
  if(d.re&&!d.local)bindReply(d);
  if(d.from==='manager'&&!d.local)ownerRenew(d.id); /* owner-lease: the manager talking keeps its line */
  cur=d;seen=d.id;lastIncomingAt=Date.now();try{localStorage.setItem(LSK('seen'),d.id);}catch(e){fail('P_STORE',e,'set seen');}
  if(rec){try{rec.abort();}catch(e){fail('P_SR',e,'abort');}}
  transition('SPEAKING','incoming '+(d.kind||'say'));try{
  TR.querySelectorAll('.think').forEach(x=>x.remove());
  const k=d.kind||'say';const age=ageOf(d),old=age>AGE_SAY;
  /* urgency does not survive an hour in the queue: an old 'urgent' is read, not rung */
  let ak=(d.priority==='urgent'&&age<3600000&&(k==='say'||k==='ask'))?'call':k;
  if((ak==='call'||ak==='stuck')){if(Date.now()-lastRingAt<60000)ak='ask';else lastRingAt=Date.now();} /* step 47: one ring per batch */
  const who=speakerOf(d);const lead=(d.again?'שוב, כי זה נקטע באמצע. ':'')+(d.merged>1?'העדכון האחרון מתוך '+d.merged+' על '+(d.topic||'אותה משימה')+'. ':'')+(d.restated?'':old?heAgo(age,d.ts)+': ':'');
  const spokenText=(d.priority==='urgent'&&!old?'דחוף. ':'')+prefixOf(d,who)+lead+(d.shortText||d.text); /* policy: a rule may shorten it */
  if(!appMode&&(ak==='call'||ak==='stuck')){app.className='ring';KIND.textContent='ליבה מצלצלת';KIND.className='kind stuck';ringStart();await new Promise(r=>setTimeout(r,2400));ringStop();app.className='';}
  KIND.textContent=k==='done'?'סיימתי':k==='stuck'?'נתקעתי':'';KIND.className='kind '+k;
  bubble('li',prefixOf(d,who)+lead+d.text);HEARD.hidden=true;OPTS.innerHTML='';
  if(k==='ask'||k==='stuck'||(d.options&&d.options.length))lastAsk={id:d.id,text:d.text,speaker:who,topic:d.topic||'',from:d.from||'liba',at:Date.now()};else if(!d.local)lastAsk=null;
  try{if(memSettings.logTurns)P.turns().doc(mintId()).set({from:d.from||'liba',speaker:who,topic:d.topic||'',kind:k,text:d.text,msg:d.id,ts:Date.now()}).catch(e=>fail('P_DB_WRITE',e,'chat/log/turns'));}catch(e){fail('P_DB_WRITE',e,'chat/log/turns');}
  if(appMode)await sayApp(spokenText,{kind:ak,options:d.options||[],from:d.from||'liba',speaker:who,mid:d.local?'':String(d.id||'')},d.local?null:d.re);else await say(spokenText+(d.options&&d.options.length?'. '+d.options.join(', או ')+'?':''));
  if(d.legacy){try{await P.current().update({spoken:true,spokenAt:Date.now()});}catch(e){fail('P_ACK',e,'chat/current');log('legacy ack: '+(e.code||e));}}
  if(d.options&&d.options.length){OPTS.innerHTML=d.options.map(o=>`<button>${esc(o)}</button>`).join('');OPTS.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>send(b.textContent,null,'option')));}
  showTalk();$('ack').hidden=k!=='done';
  }finally{transition('IDLE','spoke');drainQ();} /* v36: a sentence said while ליבה was speaking waits in the queue – release it here */
  if(micBlocked)return;
  if(appMode)return;
  if(SR&&!d.noListen&&(handsFree||(d.options&&d.options.length)||k==='stuck')){const t=await listen();if(t&&!isBusy())return send(t,null,'voice');if(handsFree&&!isBusy())idleListen();}
}
$('talk').addEventListener('click',async()=>{if(isBusy())return;if(listening){try{rec.stop();}catch(e){fail('P_SR',e,'stop');}return;}const t=await listen();if(t)send(t,null,'voice');});
$('sendTyped').addEventListener('click',()=>{const v=$('typed').value.trim();if(v)send(v,null,'typed');});
$('typed').addEventListener('keydown',e=>{if(e.key==='Enter'){const v=$('typed').value.trim();if(v)send(v,null,'typed');}});
let autoT=null;$('typed').addEventListener('input',()=>{if(!micBlocked)return;clearTimeout(autoT);const v=$('typed').value.trim();if(v.length<3){log('');return;}log('שולח אוטומטית בעוד 3 שניות… (הקלדה מבטלת)');autoT=setTimeout(()=>{const v2=$('typed').value.trim();if(v2&&v2===v)send(v2,null,'typed');},3000);});
$('ack').addEventListener('click',()=>send('הבנתי, תמשיך',null,'option'));
