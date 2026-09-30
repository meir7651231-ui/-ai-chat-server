// @anchor: initiative
// initiative: ליבה decides by herself - a world model, rules that propose, the mandate that allows, an agenda of it all
/* Step initiative. Once a minute (and on changes) Initiative.tick builds the world from what the page already listens to -
   tasks, sessions, the inbox, the outbox, the owner, quiet, memory - and runs RULES: each {id, when(world), propose(world)}
   gives a Proposal {action, args, confidence, consequence, cause}. Every proposal - done or refused - is kept in
   agenda/<id> with its reason; each goes through Mandate.allow and only then Actions[action]. A rule never fires twice
   for the same thing (the proposal's key). The actions are small and undoable: tell Meir one sentence, ask him the
   question a stuck task is waiting for, resend what waits in the outbox, re-ask a message that waited too long. A time
   below CLOCK_MIN is a writer's counter (ts:1,2,3), not an age - such items never look fifty years old here. */
const INIT_EVERY=60000,initDone=new Map();
/* how long, as a duration ("כבר שעתיים"), not as a point in time */
function agoPlain(now,t){const m=Math.max(0,Math.floor((now-t)/60000));if(m<60)return m<=1?'דקה':m+' דקות';const h=Math.floor(m/60);if(h<24)return h===1?'שעה':h===2?'שעתיים':h+' שעות';const d=Math.floor(h/24);return d===1?'יום':d===2?'יומיים':d+' ימים';}
const noEnd=t=>{t=String(t||'').trim();while(t&&'?.!'.indexOf(t.charAt(t.length-1))>=0)t=t.slice(0,-1);return t;};
function initWorld(now){now=now||Date.now();return {now,tasks:lastTasks||[],sessions:sessionsList||[],inbox:inboxQ.filter(d=>!d.local),outbox:outbox||[],owner,quietUntil,
  facts:[],hour:window.__testHour!=null?window.__testHour:jHour(now)};}
const RULES=[
  {id:'task.blocked.silent',when:w=>w.tasks.filter(t=>t.status==='blocked'&&(+t.updatedAt||0)>=CLOCK_MIN&&w.now-(+t.updatedAt)>30*60000&&!t.askedMeir),
    propose:(w,t)=>({key:'blocked:'+t.id,action:'ask_meir',args:{text:'המשימה '+t.title+' תקועה כבר '+agoPlain(w.now,+t.updatedAt)+(t.question?' ומחכה לך: '+noEnd(t.question)+'?':' ואף אחד לא שאל אותך כלום.'),options:t.options||[]},
      confidence:0.8,consequence:'מאיר שומע שאלה אחת',cause:'tasks/'+t.id})},
  {id:'session.stale',when:w=>w.sessions.filter(s=>s.status==='running'&&(+s.updatedAt||0)>=CLOCK_MIN&&w.now-(+s.updatedAt)>4*3600e3),
    propose:(w,s)=>({key:'stale:'+s.id,action:'tell_meir',args:{text:'הסשן '+(s.title||s.id)+' רשום כרץ, אבל לא זז '+agoPlain(w.now,+s.updatedAt)+'.'},confidence:0.6,consequence:'משפט אחד',cause:'sessions/'+s.id})},
  {id:'inbox.waiting',when:w=>w.inbox.filter(d=>(+d.ts||0)>=CLOCK_MIN&&w.now-(+d.ts)>6*3600e3&&!d.spoken&&!d.heldFor),
    propose:(w,d)=>({key:'waiting:'+d.id,action:'tell_meir',args:{text:'יש הודעה שמחכה כבר '+agoPlain(w.now,+d.ts)+(d.topic?', בנוגע ל'+d.topic:'')+'. תגיד מה פספסתי.'},confidence:0.7,consequence:'משפט אחד',cause:'inbox/'+d.id})},
  {id:'outbox.stuck',when:w=>w.outbox.filter(x=>(+x.ts||0)>=CLOCK_MIN&&w.now-(+x.ts)>15*60000),
    propose:(w,x)=>({key:'outbox:'+x.req,action:'resend',args:{req:x.req},confidence:0.9,consequence:'המשפט נשלח שוב',cause:'outbox/'+x.req})},
  {id:'owner.forgotten',when:w=>w.owner==='manager'&&w.now-(+ownerRenewedAt||w.now)>2*3600e3?[{}]:[],
    propose:w=>({key:'owner:'+Math.floor(w.now/3600e3),action:'tell_meir',args:{text:'המנהל על הקו כבר שעתיים בלי שיחה. תגיד ליבה תחזור אם סיימת.'},confidence:0.5,consequence:'משפט אחד',cause:'channel/owner'})},
];
const Actions={
  tell_meir:a=>{queueLocal({id:'init-'+hash36(a.text),kind:'say',proactive:true,speaker:'ליבה',text:'שמתי לב: '+a.text});return 'said';},
  ask_meir:a=>{queueLocal({id:'init-'+hash36(a.text),kind:'ask',proactive:true,speaker:'ליבה',text:'שמתי לב: '+a.text,options:a.options||[]});return 'asked';},
  resend:a=>{const it=outbox.find(x=>x.req===a.req);if(!it)return 'gone';it.phase='queued';it.leaseUntil=0;saveOutbox();setTimeout(flushOutbox,200);return 'queued';},
};
const INIT_CLASS={tell_meir:'speak_unprompted',ask_meir:'speak_unprompted',resend:'priority'};
async function initiativeTick(now){now=now||Date.now();const w=initWorld(now),out=[];
  for(const r of RULES){let hits=[];try{hits=r.when(w)||[];}catch(e){fail('P_MSG_BAD',e,'rule '+r.id);continue;}
    for(const h of hits.slice(0,3)){const pr=r.propose(w,h);if(!pr||initDone.has(pr.key))continue;initDone.set(pr.key,now);
      const mv=Mandate.allow(INIT_CLASS[pr.action]||pr.action,{now});let result='refused';
      if(mv.verdict==='alone'||mv.verdict==='act_then_tell'){try{result=Actions[pr.action](pr.args);}catch(e){result='error';fail('P_MSG_BAD',e,'action '+pr.action);}}
      const row={rule:r.id,action:pr.action,args:pr.args,confidence:pr.confidence,consequence:pr.consequence,cause:pr.cause,verdict:mv.verdict,why:mv.why,result,at:now};
      Ledger.record({action:'initiative',cause:pr.cause,decision:{rule:r.id,verdict:mv.verdict},mandateVerdict:mv.verdict,result});
      if(db)P.agendaItem(mintId()).set(row).catch(()=>{});out.push(row);}}
  while(initDone.size>500)initDone.delete(initDone.keys().next().value);return out;}
function agendaToday(){(async()=>{const since=new Date();since.setHours(0,0,0,0);const rs=(await coldGet(P.agenda(),[['at','>=',since.getTime()]],300)).docs.map(d=>d.data()||{});
  const did=rs.filter(r=>r.result!=='refused');sayLocal(rs.length?'היום שמתי לב ל-'+rs.length+' דברים, ועשיתי לבד '+did.length+(did.length?': '+did.slice(0,3).map(r=>r.consequence).join('; '):'')+'.':'היום לא הצעתי כלום לבד.');})()
  .catch(e=>{fail('P_DB_READ',e,'agenda');sayLocal('לא הצלחתי לקרוא את היומן שלי.');});return true;}
every('initiative',INIT_EVERY,()=>{if(db&&isArmed())initiativeTick().catch(e=>fail('P_MSG_BAD',e,'initiative'));});
window.__init={tick:initiativeTick,rules:RULES,done:initDone};
