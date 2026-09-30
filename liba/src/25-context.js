// @anchor: context
// context-fusion: what Meir is doing now, from every sense, in one document - and what may interrupt him in it
/* Step context-fusion. sense/context holds one picture: the phone's (screen, lock, headset, a call - sent as ctx when it
   changes) and the calendar's (a meeting now = two people or more, not declined). It is rewritten within seconds of any
   change. The inbox gate reads it: during a call or a meeting everything but urgent waits (reason call / meeting, and
   "מה פספסתי" says so), and the moment it ends the pump runs. Every message that is said carries its decision -
   inbox/<id>.admit {rule, ctx} - so a silence is never a mystery. There is no place and no motion here: location waits
   for Meir's decision. sense/body keeps when he woke up (the first screen-on after four hours dark); a morning message
   waits for eight - or for him to be up, if that is earlier than eight and later than six. */
let ctxPhone={screen:null,locked:null,headset:null,call:false,lastWake:0,wakeSource:'',at:0},ctxNow={meeting:false,call:false,headset:null,screen:null,since:0};
async function ctxIn(raw){let x;try{x=JSON.parse(String(raw||''));}catch(e){fail('P_MSG_BAD',e,'ctx');return null;}if(!x||typeof x!=='object')return null;
  const woke=+x.lastWake||0,wokeBefore=ctxPhone.lastWake;
  if(+x.emergencyUntil>Date.now()&&+x.emergencyUntil!==shabbatEmergencyUntil){shabbatEmergencyUntil=+x.emergencyUntil;setTimeout(pump,200);} /* Meir's own hand on the bubble */
  ctxPhone={screen:!!x.screen,locked:!!x.locked,headset:!!x.headset,call:!!x.call,lastWake:woke,wakeSource:String(x.wakeSource||'').slice(0,20),at:+x.at||Date.now()};
  if(woke&&woke!==wokeBefore&&db)P.body().set({lastWake:woke,wakeSource:ctxPhone.wakeSource,at:Date.now()}).catch(e=>fail('P_DB_WRITE',e,'sense/body'));
  return fuseContext();}
/* one picture; written and acted on only when it changed */
async function fuseContext(now){now=now||Date.now();let meeting=false,title='';
  try{const on=calItems.filter(i=>calMeeting(i)&&i.begin<=now&&now<i.end)[0];if(on){meeting=true;title=on.title;}}catch(e){}
  const next={meeting:meeting,meetingTitle:title,call:!!ctxPhone.call,headset:ctxPhone.headset,screen:ctxPhone.screen,locked:ctxPhone.locked};
  const changed=['meeting','call','headset','screen','locked'].some(k=>next[k]!==ctxNow[k]);
  if(!changed)return ctxNow;const was=ctxNow;ctxNow=Object.assign(next,{since:now});
  if(db)P.context().set(Object.assign({at:now},ctxNow)).catch(e=>fail('P_DB_WRITE',e,'sense/context'));
  if((was.meeting&&!ctxNow.meeting)||(was.call&&!ctxNow.call))setTimeout(pump,300); /* it ended: what waited goes now */
  return ctxNow;}
/* the gate's part: what the context holds back */
function ctxHold(d){if(ctxNow.call)return 'call';if(ctxNow.meeting)return 'meeting';return '';}
/* a morning message may go when Meir is up: after eight, or after he woke if that was after six */
function upNow(now){now=now||Date.now();const h=hourNow();if(h>=8&&h<22)return true;const w=+ctxPhone.lastWake||0;return h>=6&&h<8&&w>0&&trDay(w)===trDay(now);}
/* the decision each spoken message carries */
function admitOf(d){return {rule:d.release?'release':d.priority==='urgent'?'urgent':'ok',ctx:{meeting:!!ctxNow.meeting,call:!!ctxNow.call,headset:ctxNow.headset,screen:ctxNow.screen},at:Date.now()};}
setInterval(()=>{fuseContext().catch(()=>{});},30000);
window.__ctx={in:ctxIn,fuse:fuseContext,now:()=>ctxNow,phone:()=>ctxPhone,up:upNow};
