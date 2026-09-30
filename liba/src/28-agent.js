// @anchor: agent
// ledger-fsm + mandate + consent: every action with its cause, what ליבה may do alone, and an approval that cannot be confused
/* Step ledger-fsm. Ledger.record({actor, action, cause, inputs, decision, result, ms}) writes actions/log/items/<id>
   (the one minter, mintId): what was done, by whom, because of what - a message said because inbox/<id> arrived, a
   sentence sent because Meir spoke, a rule that held something back. No state of the machine may last more than two
   minutes: the watchdog brings a stuck one back to IDLE and writes why (the old sayWait froze the pump for 120 s).
   Step mandate. memory/mandate says, per class of action, whether ליבה does it alone, does it and then tells, or asks
   first - and four budgets: actions an hour, workers a day, spending a day, the night. Mandate.allow(action) is the one
   decision; every call is in the ledger with its verdict. The default for what can be undone is act_then_tell, never
   ask_first - a ליבה that asks about everything gets turned off. "אתה רשאי ל…", "אל תעשה לבד…", "מה אתה רשאי לעשות".
   Step consent. Consent.request({action, args, effect, reversible, cost}) writes approvals/<id> with expiresAt, says
   one sentence, and waits; silence is no. The answer is bound to the approval it answers (the question carries its
   id), so three questions in a row are never mixed up. "מה אישרתי היום" is read from approvals. */
const LEDGER_RING=[],STATE_MAX=120000;let ledgerHour={at:0,n:0};
const Ledger={
  record(e){const x={actor:String(e.actor||'liba'),action:String(e.action||'?'),cause:String(e.cause||'').slice(0,160),inputs:e.inputs||null,decision:e.decision||null,
      result:e.result==null?'':String(e.result).slice(0,200),ms:+e.ms||0,mandateVerdict:e.mandateVerdict||null,approvalId:e.approvalId||null,at:Date.now()};
    LEDGER_RING.push(x);while(LEDGER_RING.length>300)LEDGER_RING.shift();
    const h=Math.floor(x.at/3600e3);if(ledgerHour.at!==h)ledgerHour={at:h,n:0};ledgerHour.n++;
    if(db)P.action(mintId()).set(x).catch(()=>{});return x;},
  ring:()=>LEDGER_RING.slice()};
/* no state lasts more than two minutes */
let stateSince=Date.now(),stateSeen=null;
function stateWatch(now){now=now||Date.now();if(state!==stateSeen){stateSeen=state;stateSince=now;return false;}
  if(state!=='IDLE'&&state!=='OFFLINE'&&state!=='QUIET'&&now-stateSince>STATE_MAX){const was=state;transition('IDLE','stuck '+was);stateSeen='IDLE';stateSince=now;
    Ledger.record({action:'unstick',cause:'state '+was+' for '+Math.round((now-stateSince+STATE_MAX)/1000)+'s',result:'IDLE'});if(typeof pump==='function')setTimeout(pump,100);return true;}
  return false;}
every('agent',10000,()=>stateWatch());
/* the mandate */
const MANDATE_CLASSES={open_worker:'לפתוח עובד',stop_worker:'לעצור עובד',priority:'לשנות עדיפות',ship:'להעלות גרסה',send_email:'לשלוח מייל',spend:'להוציא כסף',
  delete:'למחוק',speak_unprompted:'לדבר ביוזמתה',wake_at_night:'להעיר בלילה'};
const MANDATE_IRREVERSIBLE=['ship','send_email','spend','delete','stop_worker'];
const MANDATE_DEFAULT={levels:{open_worker:'act_then_tell',stop_worker:'ask_first',priority:'alone',ship:'ask_first',send_email:'ask_first',spend:'ask_first',
  delete:'ask_first',speak_unprompted:'act_then_tell',wake_at_night:'ask_first'},budget:{maxActionsPerHour:60,maxWorkersPerDay:3,maxSpendPerDay:0,nightFrom:22,nightTo:7}};
let mandate=JSON.parse(JSON.stringify(MANDATE_DEFAULT)),mandateDay={day:'',workers:0,spend:0};
async function mandateLoad(){if(!db)return mandate;try{const g=await P.mandate().get();const x=g.exists?(g.data()||{}):{};
  mandate={levels:Object.assign({},MANDATE_DEFAULT.levels,x.levels||{}),budget:Object.assign({},MANDATE_DEFAULT.budget,x.budget||{})};}catch(e){fail('P_DB_READ',e,'memory/mandate');}return mandate;}
const Mandate={
  /* {verdict: alone | act_then_tell | ask_first | deny, why} - and the ledger has it */
  allow(action,ctx){ctx=ctx||{};const now=ctx.now||Date.now(),day=trDay(now);if(mandateDay.day!==day)mandateDay={day,workers:0,spend:0};
    const lvl=mandate.levels[action]||(MANDATE_IRREVERSIBLE.indexOf(action)>=0?'ask_first':'act_then_tell');const b=mandate.budget;let v=lvl,why='level';
    if(ledgerHour.n>=b.maxActionsPerHour&&lvl!=='ask_first'){v='ask_first';why='hour budget';}
    if(action==='open_worker'&&mandateDay.workers>=b.maxWorkersPerDay){v='ask_first';why='workers budget';}
    if(action==='spend'&&(mandateDay.spend+(+ctx.cost||0))>b.maxSpendPerDay){v='ask_first';why='spend budget';}
    const h=window.__testHour!=null?window.__testHour:jHour(now),night=b.nightFrom>b.nightTo?(h>=b.nightFrom||h<b.nightTo):(h>=b.nightFrom&&h<b.nightTo);
    if(night&&(action==='speak_unprompted'||action==='wake_at_night')&&!ctx.urgent){v=mandate.levels.wake_at_night==='alone'?v:'deny';why='night';}
    Ledger.record({action:'mandate',cause:action,decision:{verdict:v,why},mandateVerdict:v});return {verdict:v,why};},
  spent(action,cost){if(action==='open_worker')mandateDay.workers++;if(action==='spend')mandateDay.spend+=(+cost||0);}};
/* the voice: "אתה רשאי ל…", "אל תעשה לבד…", "מה אתה רשאי לעשות" */
function mandateClassOf(rest){const t=inorm(rest);let best=null;for(const [k,he] of Object.entries(MANDATE_CLASSES)){const w=memWords(he).filter(x=>x.length>2);if(w.some(x=>memWords(t).indexOf(x)>=0)&&(!best||w.length>best.n))best={k,n:w.length};}return best&&best.k;}
async function mandateSet(k,lvl){mandate.levels[k]=lvl;try{await P.mandate().set({levels:mandate.levels,budget:mandate.budget,at:Date.now()});}catch(e){fail('P_DB_WRITE',e,'memory/mandate');}
  Ledger.record({action:'mandate.set',cause:'voice',inputs:{k,lvl},result:lvl});}
function mandateAllowCmd(rest){const k=mandateClassOf(rest);if(!k)return false;if(MANDATE_IRREVERSIBLE.indexOf(k)>=0){mandateSet(k,'act_then_tell');sayLocal('בסדר: '+MANDATE_CLASSES[k]+' - אעשה ואספר לך. זה לא הפיך, אז לא בלי לספר.');return true;}
  mandateSet(k,'alone');sayLocal('בסדר: '+MANDATE_CLASSES[k]+' - לבד, בלי לשאול.');return true;}
function mandateDenyCmd(rest){const k=mandateClassOf(rest);if(!k)return false;mandateSet(k,'ask_first');sayLocal('בסדר: '+MANDATE_CLASSES[k]+' - רק אחרי שתאשר.');return true;}
function mandateListCmd(){const by={alone:[],act_then_tell:[],ask_first:[]};Object.entries(mandate.levels).forEach(([k,l])=>{(by[l]||(by[l]=[])).push(MANDATE_CLASSES[k]);});
  sayLocal('לבד: '+(by.alone.join(', ')||'כלום')+'. עושה ומספרת: '+(by.act_then_tell.join(', ')||'כלום')+'. שואלת קודם: '+(by.ask_first.join(', ')||'כלום')+'. בלילה אני לא מעירה אותך.');return true;}
/* consent */
const CONSENT_TTL=10*60000,consentWait=new Map();
const Consent={
  /* resolves true only on a yes for this very approval; false on no, on silence, on anything else */
  request(o){const id='ap-'+mintId(),now=Date.now(),exp=now+(+o.ttl||CONSENT_TTL);
    const doc={action:String(o.action),args:o.args||null,effect:String(o.effect||'').slice(0,200),reversible:!!o.reversible,cost:+o.cost||0,state:'asked',askedAt:now,expiresAt:exp};
    if(db)P.approval(id).set(doc).catch(e=>fail('P_DB_WRITE',e,'approvals'));
    const say=String(o.say||('לבצע: '+doc.effect+'?')).slice(0,300);consentText.set(id,say);
    queueLocal({id:id,kind:'ask',release:true,speaker:'ליבה',topic:'אישור',approvalId:id,options:['כן','לא'],text:say});
    return new Promise(res=>{const t=setTimeout(()=>consentEnd(id,'expired',false),exp-now);consentWait.set(id,{res,t});});},
  pending:()=>[...consentWait.keys()]};
function consentEnd(id,st,yes){const w=consentWait.get(id);if(!w)return false;consentWait.delete(id);consentText.delete(id);clearTimeout(w.t);
  if(db)P.approval(id).update({state:st,answeredAt:Date.now()}).catch(()=>{});Ledger.record({action:'consent',cause:id,result:st,approvalId:id});w.res(!!yes);return true;}
/* a plain "כן"/"לא" answers the approval that was asked last and is still open - by its id, never by a clock */
function consentAnswer(text){const id=lastAsk&&lastAsk.approvalId;if(!id||!consentWait.has(id))return false;const t=inorm(text);
  const yes=DISTILL_YES.indexOf(t)>=0,no=DISTILL_NO.indexOf(t)>=0;if(!yes&&!no)return false;lastAsk=null;consentEnd(id,yes?'approved':'denied',yes);
  /* the ones asked before it and still open are asked again, each under its own id - never answered by this one */
  const open=[...consentWait.keys()];const next=open[open.length-1];
  sayLocal(yes?'אושר.':'בסדר, לא.');if(next)consentReask(next);return true;}
const consentText=new Map();let consentRe=0;
function consentReask(id){const t=consentText.get(id);if(!t)return;queueLocal({id:id+'-r'+(++consentRe),kind:'ask',release:true,speaker:'ליבה',topic:'אישור',approvalId:id,options:['כן','לא'],text:'ועוד שאלה שחיכתה: '+t});}
function approvalsToday(){(async()=>{const since=new Date();since.setHours(0,0,0,0);const rs=(await coldGet(P.approvals(),[['askedAt','>=',since.getTime()]],200)).docs.map(d=>d.data()||{});
  const ok=rs.filter(r=>r.state==='approved');sayLocal(rs.length?'היום אישרת '+ok.length+' מתוך '+rs.length+(ok.length?': '+ok.slice(0,4).map(r=>r.effect).join('; '):'')+'.':'היום לא ביקשתי ממך אישור על כלום.');})()
  .catch(e=>{fail('P_DB_READ',e,'approvals');sayLocal('לא הצלחתי לקרוא את האישורים.');});return true;}
setTimeout(()=>{if(db)mandateLoad();},3500);
window.__agent={ledger:Ledger,mandate:Mandate,consent:Consent,watch:stateWatch,load:mandateLoad,classOf:mandateClassOf,state:()=>({mandate,mandateDay,ledgerHour})};
