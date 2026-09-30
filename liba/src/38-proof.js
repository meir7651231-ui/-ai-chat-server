// @anchor: proof
// proof-seal + auditor-hold + ask-the-source: a fact is said with where it came from, or it is not said as a fact
/* Step proof-seal. A message that reports a fact (done, passed, failed, merged, ready, sent, installed ...) carries a
   claim: {grade: measured|quoted|inferred, source: {kind: cmd|file|url|api|human, ref, at, by}, raw, ttlSec, verify?}
   (docs/CLAIM-SCHEMA.md). With it, the grade is in the opening: "המנהל, בנוגע לגרסה, נמדד: ...". Without it ליבה does
   not say it as a fact: she says who claims it and that there is no source, writes evidence/missing/items/<id>, and asks
   the session for one, once ([ליבה?מקור]).
   Step auditor-hold. A claim with verify {type: tests|pr|build|apk|file|url, args} is held (reason 'proof') while
   verify/queue/items/<id> waits for a checker (tools/liba-auditor.mjs, run by a session) to write
   evidence/log/items/<id>; then it is said as measured with the evidence's age ("בדקתי לפני 2 דקות"), or as found
   untrue; at the deadline (60 s) it goes out as quoted - "הסשן אמר, לא בדקתי".
   Step ask-the-source. The last twenty things said with their grade and source are kept (liba.ev): "מאיפה את יודעת",
   "ומה לפני זה", "מי אמר את זה", "מתי זה נבדק", "זה נמדד או צוטט", "תראה לי את ההוכחה" - and the phone knows the last
   few from the mirror, for when the page is down. */
const GRADE={measured:'נמדד',quoted:'צוטט',inferred:'הוסק'},PROOF_WAIT=60000,PROOF_TYPES=['tests','pr','build','apk','file','url'];
const FACTUAL=/(^|\s)(עבר|עברו|נכשל|נכשלו|נכשלה|מוזג|מוזגה|מוזגו|מוכן|מוכנה|מוכנים|הושלם|הושלמה|הושלמו|עלה|עלתה|עלו|נשלח|נשלחה|נשלחו|הותקן|הותקנה|פורסם|פורסמה|תוקן|תוקנה|תוקנו|גמרתי|סיימתי|סיים|סיימה|ירוק|ירוקים|אדום|נבנה|נבנתה|רץ בהצלחה)(\s|$|[,.!])/;
/* "בדקתי לפני דקה", "אתמול" - the ago words without their leading מ */
const agoAt=(now,t)=>{const w=agoWords(now,t);return w==='מאתמול'?'אתמול':w==='משלשום'?'שלשום':w.replace(/^מ/,'');};
let evRing=[],evCursor=-1,evLog=new Map();try{evRing=JSON.parse(localStorage.getItem(LSK('ev'))||'[]');}catch(e){evRing=[];}
function claimOf(d){const c=d&&d.claim;return c&&GRADE[c.grade]?c:null;}
function factual(d){if(!d||d.local||d.from==='liba'||d.kind==='ask'||d.kind==='cmd')return false;return d.kind==='done'||FACTUAL.test(' '+String(d.text||'')+' ');}
function needsProof(d){const c=claimOf(d);return !!(c&&c.verify&&PROOF_TYPES.indexOf(c.verify.type)>=0&&!d.local);}
/* the gate: a claim that asked to be checked waits for its evidence, up to the deadline */
function proofGate(d){if(!needsProof(d)||d.proofDone)return null;const now=Date.now();
  if(!d.proofAsked){d.proofAsked=now;if(db)P.verifyItem(d.id).set({type:d.claim.verify.type,args:d.claim.verify.args||{},text:String(d.text||'').slice(0,200),askedAt:now,deadline:now+PROOF_WAIT}).catch(e=>fail('P_DB_WRITE',e,'verify/queue'));}
  const ev=evLog.get(d.id);if(ev){d.evidence=ev;d.proofDone=true;return null;}
  if(now-d.proofAsked>=PROOF_WAIT){d.proofDone=true;d.proofLate=true;return null;}
  d.retryAt=d.proofAsked+PROOF_WAIT;d.retryWhy='proof';return 'proof';}
function evidenceIn(m){evLog=m;let any=false;inboxQ.forEach(d=>{if(d.proofAsked&&!d.proofDone&&m.has(d.id)){d.evidence=m.get(d.id);d.proofDone=true;d.retryAt=0;any=true;}});if(any)pump();}
/* the seal, inside incoming(): the grade into the opening, or the fact turned into "X says ..., no source" */
function sealCheck(d,who){const c=claimOf(d),now=Date.now();
  if(needsProof(d)&&d.proofDone){const ev=d.evidence;
    if(ev&&+ev.exitCode===0){d.gradeWord=GRADE.measured;d.text=d.text+' - בדקתי '+agoAt(now,+ev.at||now)+'.';}
    else if(ev){d.gradeWord='נבדק';d.text=who+' אמר ש'+d.text.replace(/[.!]+$/,'')+', אבל בדקתי והבדיקה לא עברה'+(ev.stdout?': '+String(ev.stdout).slice(0,80):'')+'.';}
    else{d.gradeWord=GRADE.quoted;d.text=d.text.replace(/[.!]+$/,'')+' - '+who+' אמר, לא בדקתי.';}
    evPush(d,who,d.gradeWord,c&&c.source,ev);return;}
  if(c){d.gradeWord=GRADE[c.grade];evPush(d,who,d.gradeWord,c.source,null);return;}
  if(!factual(d))return;
  const orig=d.text;d.text=who+' אומר ש'+orig.replace(/[.!]+$/,'')+' - בלי מקור. ביקשתי ממנו מקור.';d.unsourced=true;evPush(d,who,'בלי מקור',null,null,orig);
  if(db&&!d.sourceAsked){d.sourceAsked=true;P.missing(d.id).set({text:String(orig).slice(0,300),from:d.from||'',speaker:who,at:now}).catch(e=>fail('P_DB_WRITE',e,'evidence/missing'));
    deliver('ביקשתי מקור: "'+String(orig).slice(0,160)+'" (inbox/'+d.id+'). ענה עם claim לפי docs/CLAIM-SCHEMA.md - מה מדדת, איך, ומתי.'+reqMark(d.id),'[ליבה?מקור] ').catch(()=>{});}}
function evPush(d,who,grade,source,ev,orig){const e={id:d.id,text:String(orig||d.text||'').slice(0,200),speaker:who,grade,source:source||null,evAt:ev?+ev.at||0:0,at:Date.now()};
  evRing.push(e);while(evRing.length>20)evRing.shift();evCursor=-1;try{localStorage.setItem(LSK('ev'),JSON.stringify(evRing));}catch(x){}}
function proofSay(e){if(!e)return 'עוד לא אמרתי שום דבר שיש לו מקור.';const src=e.source;
  const s=src?({cmd:'מפקודה',file:'מקובץ',url:'מקישור',api:'משירות',human:'מאדם'}[src.kind]||'ממקור')+(src.ref?' '+String(src.ref).slice(0,60):'')+(src.at?', '+agoAt(Date.now(),+src.at):''):'';
  return e.grade==='בלי מקור'?'את "'+e.text.slice(0,60)+'" אמר '+e.speaker+' בלי מקור, וביקשתי ממנו.':'"'+e.text.slice(0,60)+'" - '+e.grade+', אמר '+e.speaker+(s?'. '+s:'')+(e.evAt?'. בדקתי בעצמי '+agoAt(Date.now(),e.evAt):'')+'.';}
function proofWhere(){evCursor=evRing.length-1;sayLocal(proofSay(evRing[evCursor]));return true;}
function proofBefore(){if(evCursor<0)evCursor=evRing.length-1;evCursor=Math.max(0,evCursor-1);sayLocal(evRing.length?proofSay(evRing[evCursor]):proofSay(null));return true;}
function proofWho(){const e=evRing[evCursor<0?evRing.length-1:evCursor];sayLocal(e?'את זה אמר '+e.speaker+'.':'עוד לא אמרתי כלום.');return true;}
function proofGrade(){const e=evRing[evCursor<0?evRing.length-1:evCursor];sayLocal(e?(e.grade==='בלי מקור'?'לא נמדד ולא צוטט ממקור - בלי מקור.':'זה '+e.grade+'.'):'עוד לא אמרתי כלום.');return true;}
function proofWhen(){const e=evRing[evCursor<0?evRing.length-1:evCursor];if(!e){sayLocal('עוד לא אמרתי כלום.');return true;}
  sayLocal(e.evAt?'בדקתי '+agoAt(Date.now(),e.evAt)+'.':e.source&&e.source.at?'לפי המקור, '+agoAt(Date.now(),+e.source.at)+'.':'אין לזה זמן מדידה.');return true;}
function proofShow(){const e=evRing[evCursor<0?evRing.length-1:evCursor];const ref=e&&e.source&&String(e.source.ref||'');
  if(!ref||!/^https:\/\//.test(ref)){sayLocal('אין לזה קישור להראות.');return true;}if(appMode)post(PROTO.toApp.cmd,{cmd:'open '+ref});else openSafe(ref);sayLocal('פותחת את המקור.');return true;}
function proofMirror(){return evRing.slice(-5).map(e=>({text:e.text.slice(0,80),speaker:e.speaker,grade:e.grade,src:e.source?String(e.source.kind||'')+' '+String(e.source.ref||'').slice(0,40):'',at:e.at}));}
window.__proof={factual,claimOf,needsProof,gate:proofGate,seal:sealCheck,ring:()=>evRing,say:proofSay};
