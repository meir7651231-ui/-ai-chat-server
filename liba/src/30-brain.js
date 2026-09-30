// @anchor: brain
// brief-handoff + wake-envelope: where things stopped, for any session that wakes up - and every sentence carries it
/* Step brief-handoff. channel/brief {ver, at, sessionId, model, openLoop[], waitingOn, lastAsk, nextAction, doNot[],
   artifacts[]} is written by whichever session is the brain, before it finishes; every version is kept in
   brief/log/items/<id>. The contract itself is in channel/protocol.brief, so a session reads it from the database and
   not from this page. What a brain did not write is derived here - from the stuck tasks, the last decision, the last
   sentences - and marked derived. "איפה עצרנו", "מי המוח", "מה פתוח עכשיו" are answered from it; when the brain changed
   since the last question, the next question opens with one sentence saying so.
   Step wake-envelope. Every sentence to Claude carries, after itself and before its ⟦#id⟧ mark, one compact packet of at
   most 1800 characters: the contract line, the brief, what is stuck, the last decision, the last three sentences, who
   holds the line, the versions - trimmed in that order of importance. The packet is kept in brain/wakes/<id> (the
   request id is the wake id), and the answer binds to it by re, never by a clock. The tag at the start is untouched. */
const WAKE_MAX=1800,BRIEF_CONTRACT='קרא את channel/brief לפני שאתה עונה; כתוב אותו לפני שאתה מסיים; ענה עם re=<wakeId>.';
let briefNow=null,brainSpoken='';
function briefIn(s){briefNow=(s&&s.exists&&s.data())||null;}
function briefAge(now){return briefNow&&+briefNow.at?(now||Date.now())-(+briefNow.at):Infinity;}
/* the brief as the page can see it: the brain's own fields, and what it did not write derived and marked */
async function readBrief(){const b=Object.assign({},briefNow||{});const d={};
  if(!Array.isArray(b.openLoop)||!b.openLoop.length){const stuck=(lastTasks||[]).filter(t=>t.status==='blocked'||t.status==='running').slice(0,3).map(t=>t.title);if(stuck.length){b.openLoop=stuck;d.openLoop=true;}}
  if(!b.waitingOn){const w=(lastTasks||[]).find(t=>t.status==='blocked'&&t.question);if(w){b.waitingOn='תשובה שלך על '+w.title+' ('+w.question+')';d.waitingOn=true;}}
  if(!b.lastDecision){try{const r=(await coldGet(P.decisions(),null,50)).docs.map(x=>x.data()||{}).sort((a,c)=>(c.ts||0)-(a.ts||0))[0];if(r){b.lastDecision=r.question+' → '+r.answer;d.lastDecision=true;}}catch(e){}}
  b.derived=d;return b;}
/* the packet: in order of importance, trimmed as a whole */
async function buildWake(text,wakeId){const b=await readBrief();const parts=[];
  parts.push('[מעטפה#'+wakeId+'] '+BRIEF_CONTRACT);
  if(b.openLoop&&b.openLoop.length)parts.push('פתוח: '+b.openLoop.slice(0,4).join('; ')+(b.derived.openLoop?' (נגזר)':''));
  if(b.waitingOn)parts.push('מחכה ל: '+b.waitingOn+(b.derived.waitingOn?' (נגזר)':''));
  if(b.nextAction)parts.push('הצעד הבא: '+b.nextAction);
  if(Array.isArray(b.doNot)&&b.doNot.length)parts.push('לא לעשות: '+b.doNot.slice(0,3).join('; '));
  const blocked=(lastTasks||[]).filter(t=>t.status==='blocked').slice(0,3).map(t=>t.title+(t.question?' ('+t.question+')':''));if(blocked.length)parts.push('תקוע: '+blocked.join('; '));
  if(b.lastDecision)parts.push('החלטה אחרונה: '+b.lastDecision);
  try{const since=Date.now()-6*3600e3;const t=(await turnsBetween(since,Date.now()+1,60)).filter(x=>x.from==='user'||x.from==='manager').slice(-4,-1);if(t.length)parts.push('לפני כן: '+t.map(x=>(x.from==='user'?'מאיר: ':'')+String(x.text||'').slice(0,90)).join(' / '));}catch(e){}
  parts.push('על הקו: '+(owner==='manager'?'המנהל':'ליבה')+(briefNow&&briefNow.sessionId?' · מוח '+String(briefNow.sessionId).slice(-8):'')+' · גרסה '+(appVer||'דפדפן')+' · דף '+__PAGE_HASH__);
  let out='';for(const p of parts){if(out.length+p.length+3>WAKE_MAX)break;out+=(out?'\n':'')+p;}
  if(db)P.wake(wakeId).set({envelope:out,len:out.length,at:Date.now(),brainAt:briefNow&&+briefNow.at||0}).catch(()=>{});
  return out;}
/* the voice */
function brainWhere(){readBrief().then(b=>{const loop=(b.openLoop||[])[0];
  sayLocal(loop?'עצרנו ב'+loop+(b.nextAction?'. הצעד הבא: '+b.nextAction:'')+(b.waitingOn?'. מחכה ל'+b.waitingOn:'')+(b.derived.openLoop?' - את זה הסקתי מהמשימות, המוח לא כתב.':'.'):'אין לי שום דבר פתוח לדווח עליו. המוח עוד לא כתב איפה עצר.');}).catch(e=>{fail('P_DB_READ',e,'brief');sayLocal('לא הצלחתי לקרוא איפה עצרנו.');});return true;}
function brainWho(){const b=briefNow;sayLocal(b&&b.sessionId?'המוח עכשיו: '+String(b.sessionId).slice(-8)+(b.model?', '+b.model:'')+'. הוא כתב לאחרונה '+(w=>w.charAt(0)==='מ'?w.slice(1):w)(agoWords(Date.now(),+b.at||Date.now()))+'.':'אף מוח עוד לא נרשם.');return true;}
function brainOpen(){readBrief().then(b=>{const l=b.openLoop||[];sayLocal(l.length?'פתוח עכשיו: '+l.slice(0,4).join('; ')+'.':'אין שום דבר פתוח.');});return true;}
/* one sentence before a question, when the brain changed since the last one */
function brainLead(d){if(!briefNow||!briefNow.sessionId||d.local)return '';const k=d.kind||'say';if(k!=='ask'&&k!=='stuck')return '';
  const id=String(briefNow.sessionId);if(!brainSpoken){brainSpoken=id;return '';}if(id===brainSpoken)return '';brainSpoken=id;
  const loop=(briefNow.openLoop||[])[0];return 'מדבר איתך עכשיו מוח אחר'+(loop?', והוא ממשיך מ'+loop:'')+'. ';}
/* the contract, written once where every session reads */
async function briefContract(){if(!db)return;try{const g=await P.protocol().get();if(g.exists&&(g.data()||{}).brief)return;
  await P.protocol().set(Object.assign({},(g.exists&&g.data())||{},{brief:{doc:'channel/brief',fields:'ver, at, sessionId, model, openLoop[], waitingOn, lastAsk, nextAction, doNot[], artifacts[]',
    rule:'כתוב את channel/brief לפני שאתה מסיים כל תור, ושמור עותק ב-brief/log/items/<id>. קרא אותו לפני שאתה עונה. כל משפט של מאיר מגיע עם מעטפה [מעטפה#<wakeId>]; ענה עם re=<wakeId>.',at:Date.now()}}));}catch(e){fail('P_DB_WRITE',e,'channel/protocol');}}
setTimeout(briefContract,5000);
window.__brain={wake:buildWake,read:readBrief,lead:brainLead,in:briefIn};
