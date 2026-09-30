// @anchor: mirror
// local-brain: the state of things, sent to the phone every fifteen seconds when it changed, for when this page is dead
/* Step local-brain. The phone answers "איפה עצרנו", "מה פתוח", "מה תקוע", "מי המוח" by itself when the page is down
   (LocalBrain.kt) - from this mirror: the tasks that matter, the brief, who is awake. Sent only to a bubble that has
   'mirror', only when it changed. "מה תקוע" is also a command here, answered from the live board. */
let mirrorSig='';
async function mirrorBuild(now){now=now||Date.now();const b=await readBrief();const live=[...roster.entries()].filter(([,r])=>brainState(r,now)==='live').length;
  return {at:now,tasks:(lastTasks||[]).filter(t=>t.status==='blocked'||t.status==='running').slice(0,12).map(t=>({title:String(t.title||'').slice(0,80),status:t.status,question:String(t.question||'').slice(0,120)})),
    openLoop:(b.derived&&b.derived.openLoop?[]:(b.openLoop||[])).slice(0,4),waitingOn:b.derived&&b.derived.waitingOn?'':String(b.waitingOn||''),nextAction:String(b.nextAction||''),
    brain:briefNow&&briefNow.sessionId?String(briefNow.sessionId).slice(-8):'',live:live,proofs:proofMirror(),today:bookDueToday(now).filter(o=>!(o.lastDoneAt&&trDay(o.lastDoneAt)===trDay(now))).map(o=>o.title+' ב-'+o.dueHour).slice(0,6)};}
async function mirrorPush(force){if(!appMode||!hasCap('mirror'))return false;const m=await mirrorBuild();const sig=JSON.stringify(Object.assign({},m,{at:0}));
  if(!force&&sig===mirrorSig)return false;mirrorSig=sig;post(PROTO.toApp.mirror,{body:JSON.stringify(m)});return true;}
function tasksStuck(){const b=(lastTasks||[]).filter(t=>t.status==='blocked');
  sayLocal(b.length?(b.length===1?'משימה אחת תקועה: ':b.length+' משימות תקועות: ')+(x=>/[.?!]$/.test(x)?x:x+'.')(b.slice(0,3).map(t=>t.title+(t.question?' - '+t.question:'')).join('; ')):'שום משימה לא תקועה.');return true;}
setInterval(()=>{mirrorPush().catch(()=>{});},15000);
window.__mirror={build:mirrorBuild,push:mirrorPush};
