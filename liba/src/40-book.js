// @anchor: book
// work-book + week-ledger: Meir's real week - what recurs, who feeds it, what came due, what was closed, and on Friday
// one honest account
/* Step work-book. book/cycle holds the obligations {id, title, dow (0-6) or dom (1-31), dueHour, graceHours, kind:
   form|report|shift|decision|payment|visit, who, feeds[], lastDoneAt, streak}; book/roles/items the people. (The plan
   put this under work/ - that name is the roster's work/<wakeId>, so it lives under book/.) They are filled by voice:
   "תוסיף חובה: דוח נוכחות, כל חמישי בעשר" at once, or by the intake - one question a day at most, only when nothing
   waits, not in quiet, until fourteen are answered or Meir says "זהו" (book/intake). "מה יש לי השבוע" / "מה יש לי היום"
   read the cycle. The due loop (on the outbox tick, every five minutes, and on load) asks once when something comes
   due - "הגיע הזמן: X. נסגר?" - and what came due while the page was closed is said as missed, not as now.
   Step week-ledger. presence: book/presence/items/<day> {minutesOpen, firstAt, lastAt}; closes: "נסגר" / "עשיתי את
   זה" / "לא רלוונטי" (or "סגרתי את X") -> book/closes/items/<id> {obligationId, weekId, verdict, by, ts}. After Friday
   16:00, once a week (the lock book/close/<weekId>), every obligation due that week gets a verdict with the document
   that decided it (src): a close, a voice-form run that covers its required fields, a decision whose topic it feeds, a
   form-emit task that is done, or lastDoneAt - done, late (after dueHour+grace), missed, or unknown (ליבה was not open
   that day). book/ledger/items/<weekId> keeps it; Meir hears one summary (under the mandate); every missed one opens a
   task. */
const DOW_HE=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'],BOOK_KIND=[['form',/טופס|טפסים/],['report',/דוח|דו"ח|דו״ח|דיווח/],['payment',/תשלום|משכורת|משכורות|לשלם|העברה/],['shift',/תורנות|משמרת|תורן/],['visit',/ביקור|לבקר|סיור/],['decision',/החלטה|לאשר|אישור|להחליט/]];
const BOOK_Q=['תגיד לי חובה קבועה אחת: מה, באיזה יום, ובאיזו שעה. למשל: דוח נוכחות, כל חמישי בעשר.','עוד חובה קבועה? מה, איזה יום, איזו שעה.','יש משהו שחוזר פעם בחודש? למשל: משכורות, בעשירי לחודש בתשע.',
  'מי אחראי אצלך על משהו קבוע? שם, תפקיד, ועל מה. למשל: שולמית, מזכירה, דוח נוכחות.','עוד אדם שמזין משהו קבוע?','איזו החלטה אתה צריך לקבל כל שבוע, ומתי?','יש תורנות או משמרת שחוזרת? מי ומתי.',
  'עוד חובה קבועה?','עוד אדם?','יש ביקור או סיור קבוע?','עוד חובה?','מה עוד חוזר כל שבוע ולא אמרת?','עוד אדם שכדאי שאכיר?','אחרונה: משהו שאסור שיתפספס, גם אם אין לו מועד קבוע?'];
let bookCycle={obligations:[]},bookRoles=new Map(),bookAsks=new Map(),bookTickAt=0,bookPresAt=0,bookDueSaid={};
try{bookDueSaid=JSON.parse(localStorage.getItem(LSK('bookDue'))||'{}');}catch(e){bookDueSaid={};}
function jNow(t){const d=new Date(t||Date.now());const s=d.toLocaleString('en-US',{timeZone:'Asia/Jerusalem',hour12:false,weekday:'short',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit'});
  const dow=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(s.slice(0,3));const m=/(\d\d)\/(\d\d)\/(\d{4}),\s*(\d\d)/.exec(s);return {dow,dom:+m[2],month:+m[1],year:+m[3],hour:+m[4]%24};}
function weekId(t){const j=jNow(t);const d=new Date(Date.UTC(j.year,j.month-1,j.dom));d.setUTCDate(d.getUTCDate()-j.dow);return d.toISOString().slice(0,10);} /* the Sunday that starts it */
function hebHour(t){const m=/(?:ב|בשעה\s*)(\d{1,2})(?::(\d\d))?/.exec(t);if(m)return +m[1];const w=['אחת','שתיים','שלוש','ארבע','חמש','שש','שבע','שמונה','תשע','עשר','אחת עשרה','שתים עשרה'];
  for(let i=w.length-1;i>=0;i--)if(t.indexOf('ב'+w[i])>=0||t.indexOf('בשעה '+w[i])>=0){let h=i+1;if(/אחרי הצהריים|בערב|אחה"צ/.test(t)&&h<12)h+=12;return h;}return null;}
/* "דוח נוכחות, כל חמישי בעשר" -> {title, dow, dueHour, kind} */
function bookParse(text){const t=' '+inorm(text)+' ';const title=inorm(String(text||'').split(/[,،:]/).filter(x=>x.trim())[0]||'').split(/ כל | ביום | בכל | ב-?\d| בעשירי| בראשון לחודש| בשעה /)[0].trim();if(!title||title.length<2)return null;
  let dow=null,dom=null;DOW_HE.forEach((d,i)=>{if(t.indexOf(' '+d+' ')>=0||t.indexOf(' ב'+d+' ')>=0||t.indexOf(' ביום '+d+' ')>=0||t.indexOf(' כל '+d+' ')>=0)dow=i;});
  const md=/(?:ב-?|בכל\s)(\d{1,2})\s*(?:לחודש|בחודש)/.exec(t)||(/בעשירי לחודש/.test(t)?[0,10]:/בראשון לחודש|בתחילת החודש/.test(t)?[0,1]:null);if(md)dom=+md[1];
  if(dow==null&&dom==null&&/כל יום|בכל יום|יומי/.test(t))dow=-1;
  const hour=hebHour(t);const kind=(BOOK_KIND.find(k=>k[1].test(t))||['report'])[0];
  return {id:'o-'+fleetHash(title),title,dow,dom,dueHour:hour==null?9:hour,graceHours:kind==='payment'?24:4,kind,who:'',feeds:[title],lastDoneAt:0,streak:0};}
let bookLocalAt=0;
async function bookSave(){bookLocalAt=Date.now();bookCycle.at=bookLocalAt;if(db)await P.cycle().set({obligations:bookCycle.obligations,at:bookLocalAt}).catch(e=>fail('P_DB_WRITE',e,'book/cycle'));}
function bookAddObligation(o){if(!o)return false;const i=bookCycle.obligations.findIndex(x=>x.id===o.id);if(i>=0)bookCycle.obligations[i]=Object.assign({},bookCycle.obligations[i],o,{lastDoneAt:bookCycle.obligations[i].lastDoneAt,streak:bookCycle.obligations[i].streak});else bookCycle.obligations.push(o);bookSave();return true;}
function bookWhen(o){return (o.dow===-1?'כל יום':o.dow!=null?'כל '+DOW_HE[o.dow]:o.dom?'ב-'+o.dom+' לחודש':'בלי מועד')+' ב-'+o.dueHour;}
function bookAdd(rest){const o=bookParse(rest);if(!o||(o.dow==null&&o.dom==null)){sayLocal('לא הבנתי מתי. תגיד: מה, איזה יום, איזו שעה - למשל "דוח נוכחות, כל חמישי בעשר".');return true;}
  bookAddObligation(o);sayLocal('רשמתי: '+o.title+', '+bookWhen(o)+'.');return true;}
function bookPerson(text){const parts=inorm(text).split(/[,،]/).map(x=>x.trim()).filter(Boolean);if(parts.length<2)return null;const slug='r-'+fleetHash(parts[0]);
  const r={name:parts[0],role:parts[1]||'',feeds:parts.slice(2),at:Date.now()};bookRoles.set(slug,r);if(db)P.role(slug).set(r).catch(e=>fail('P_DB_WRITE',e,'book/roles'));return r;}
/* the intake: one question a day, only into silence */
const BOOK_BOOT=Date.now();
/* never the first thing after the page comes up, never on top of a conversation: ten quiet minutes first */
async function bookIntake(now,force){if(!db)return;if(!force&&now-Math.max(BOOK_BOOT,lastIncomingAt||0,lastReqAt||0)<10*60000)return;let st={};try{const g=await P.intake().get();st=g.exists?(g.data()||{}):{};}catch(e){return;}
  if(st.done||(+st.step||0)>=BOOK_Q.length||st.lastAskDay===trDay(now))return;if(inboxQ.length||quietUntil>now||state!=='IDLE')return;
  const q=BOOK_Q[+st.step||0],id='book-q-'+(+st.step||0)+'-'+trDay(now);bookAsks.set(id,{id,kind:'intake',step:+st.step||0,at:now});
  await P.intake().set(Object.assign({},st,{lastAskDay:trDay(now)})).catch(()=>{});queueLocal({id,kind:'ask',priority:'morning',speaker:'ליבה',topic:'ספר העבודה',text:q});}
async function bookIntakeAnswer(a,text){const t=inorm(text);let st={};try{const g=await P.intake().get();st=g.exists?(g.data()||{}):{};}catch(e){}
  if(['זהו','זה הכל','זה הכול','אין עוד','לא זהו'].indexOf(t.replace(/[,،]/g,''))>=0){await P.intake().set(Object.assign({},st,{done:true,doneAt:Date.now()})).catch(()=>{});sayLocal('בסדר. ספר העבודה סגור לשאלות - אפשר תמיד להוסיף: "תוסיף חובה ...".');return;}
  const isPerson=/אדם|אחראי|מזין/.test(BOOK_Q[a.step]||'');let said;
  if(isPerson){const r=bookPerson(text);said=r?'רשמתי: '+r.name+(r.role?', '+r.role:'')+'.':'לא הבנתי. שם, תפקיד, ועל מה.';}
  else{const o=bookParse(text);if(o&&(o.dow!=null||o.dom!=null)){bookAddObligation(o);said='רשמתי: '+o.title+', '+bookWhen(o)+'.';}else said='רשמתי את זה כהערה; בלי יום ושעה לא אזכיר.';}
  await P.intake().set(Object.assign({},st,{step:(+st.step||0)+1,answers:(st.answers||[]).concat([{q:a.step,text:String(text).slice(0,200),at:Date.now()}]).slice(-20)})).catch(()=>{});sayLocal(said);}
/* what is due */
function bookDueToday(t){const j=jNow(t);return bookCycle.obligations.filter(o=>o.dow===-1||o.dow===j.dow||(o.dom&&o.dom===j.dom));}
function bookDayLine(offset){const l=bookDueToday(Date.now()+(offset||0)*864e5).sort((a,b)=>a.dueHour-b.dueHour);return l.length?' בספר העבודה: '+l.map(o=>o.title+' ב-'+o.dueHour).join(', ')+'.':'';}
function bookToday(){const j=jNow();const l=bookDueToday().sort((a,b)=>a.dueHour-b.dueHour);sayLocal(l.length?'היום: '+l.map(o=>o.title+' ב-'+o.dueHour+(o.lastDoneAt&&jNow(o.lastDoneAt).dom===j.dom?' (נסגר)':'')).join('; ')+'.':'היום אין שום חובה קבועה.');return true;}
function bookWeek(){const j=jNow(),out=[];for(let k=0;k<7;k++){const d=(j.dow+k)%7;const l=bookCycle.obligations.filter(o=>o.dow===d||o.dow===-1).sort((a,b)=>a.dueHour-b.dueHour);if(l.length)out.push((k===0?'היום':k===1?'מחר':DOW_HE[d])+': '+l.map(o=>o.title+' ב-'+o.dueHour).join(', '));}
  const monthly=bookCycle.obligations.filter(o=>o.dom&&o.dom>=j.dom&&o.dom<j.dom+7);if(monthly.length)out.push('החודשיות: '+monthly.map(o=>o.title+' ב-'+o.dom).join(', '));
  sayLocal(out.length?out.join('. ')+'.':'ספר העבודה ריק. תגיד "תוסיף חובה" ומה, איזה יום ובאיזו שעה.');return true;}
function bookDueLoop(now){now=now||Date.now();const j=jNow(now),day=trDay(now);
  for(const o of bookDueToday(now)){const k=o.id+'|'+day;if(bookDueSaid[k]||j.hour<o.dueHour)continue;if(o.lastDoneAt&&trDay(o.lastDoneAt)===day)continue;
    bookDueSaid[k]=1;const late=j.hour>=o.dueHour+o.graceHours,id='book-due-'+k;bookAsks.set(id,{id,kind:'close',obligationId:o.id,at:now});
    queueLocal({id,kind:'ask',priority:late?'normal':'morning',speaker:'ליבה',topic:'ספר העבודה',text:(late?'פספסת: '+o.title+' היה צריך היום ב-'+o.dueHour+'. נסגר בכל זאת?':'הגיע הזמן: '+o.title+'. נסגר?'),options:['נסגר','עוד לא','לא רלוונטי']});}
  try{localStorage.setItem(LSK('bookDue'),JSON.stringify(Object.fromEntries(Object.entries(bookDueSaid).slice(-200))));}catch(e){}}
/* presence and closes */
async function bookPresence(now){now=now||Date.now();if(!db)return;const day=trDay(now);let x={};try{const g=await P.presence(day).get();x=g.exists?(g.data()||{}):{};}catch(e){}
  await P.presence(day).set({minutesOpen:(+x.minutesOpen||0)+5,firstAt:x.firstAt||now,lastAt:now,day}).catch(e=>fail('P_DB_WRITE',e,'book/presence'));}
async function bookClose(obligationId,verdict,now){now=now||Date.now();const o=bookCycle.obligations.find(x=>x.id===obligationId);if(!o)return null;
  await P.close(mintId()).set({obligationId,weekId:weekId(now),verdict,by:'מאיר',ts:now}).catch(e=>fail('P_DB_WRITE',e,'book/closes'));
  if(verdict==='done'){o.lastDoneAt=now;o.streak=(+o.streak||0)+1;bookSave();}return o;}
function bookCloseCmd(rest){const w=memWords(rest);const o=bookCycle.obligations.map(x=>({x,n:w.filter(a=>memWords(x.title).some(b=>b.indexOf(a)===0||a.indexOf(b)===0)).length})).filter(s=>s.n>0).sort((a,b)=>b.n-a.n)[0];
  if(!o){sayLocal('לא מצאתי חובה בשם '+rest+'.');return true;}bookClose(o.x.id,'done').then(()=>sayLocal('סגרתי: '+o.x.title+'.'));return true;}
/* the answers to ליבה's own questions stay here: intake, close, and the form (41-form) */
function bookAnswer(text){if(!lastAsk||Date.now()-lastAsk.at>REPLY_WINDOW)return false;const a=bookAsks.get(lastAsk.id);if(!a)return false;const t=inorm(text);
  /* the intake takes only what reads as an answer - an obligation with a day, a person with a role, or "זהו"; any other
     sentence is Meir talking about something else and goes on as usual (the question comes again another day) */
  if(a.kind==='intake'){const person=/אדם|אחראי|מזין/.test(BOOK_Q[a.step]||''),o=!person&&bookParse(text);
    const fits=['זהו','זה הכל','זה הכול','אין עוד','לא זהו'].indexOf(t.replace(/[,،]/g,''))>=0||(person?String(text).split(/[,،]/).filter(x=>x.trim()).length>=2:!!(o&&(o.dow!=null||o.dom!=null)));
    if(!fits)return false;lastAsk=null;bookAsks.delete(a.id);bookIntakeAnswer(a,text);return true;}
  if(a.kind==='close'){const v=/נסגר|עשיתי|סגרתי|בוצע|כן/.test(t)?'done':/לא רלוונטי|לא צריך|בוטל/.test(t)?'na':/עוד לא|לא עדיין|אחר כך/.test(t)?'later':null;if(!v)return false;
    lastAsk=null;if(v==='later'){sayLocal('בסדר, אשאל שוב מחר אם זה עדיין פתוח.');return true;}bookClose(a.obligationId,v).then(o=>sayLocal(o?(v==='done'?'סגרתי: ':'סימנתי כלא רלוונטי: ')+o.title+'.':'לא מצאתי את החובה.'));return true;}
  if(a.kind.indexOf('form')===0)return formAnswer(a,text);return false;}
/* the week */
async function bookDocs(col,filters,n){try{return (await coldGet(col,filters,n||300)).docs.map(d=>Object.assign({id:d.id},d.data()||{}));}catch(e){fail('P_DB_READ',e,'book ledger');return [];}}
async function weekClose(now,force){now=now||Date.now();if(!db)return null;const j=jNow(now);if(!force&&!(j.dow===5&&j.hour>=16)&&j.dow!==6)return null;const wk=weekId(now);
  let l;try{l=await P.weekLock(wk).acquire({holder:PAGE_ID,ttlMs:10*60000});}catch(e){return null;}if(!l||l.acquired===false)return null;
  try{const g=await P.ledgerWeek(wk).get();if(g.exists)return null;}catch(e){}
  const start=Date.parse(wk+'T00:00:00+03:00'),end=start+7*864e5;
  const [closes,runs,decs,tasks,pres]=await Promise.all([bookDocs(P.closes(),[['weekId','==',wk]]),bookDocs(P.runs(),[['startedAt','>=',start]]),bookDocs(P.decisions(),[['ts','>=',start]]),bookDocs(P.tasks(),[['updatedAt','>=',start]]),bookDocs(P.presences(),[['firstAt','>=',start]])]);
  const presDays=new Set(pres.map(p=>p.day)),rows=[];const forms=await bookDocs(P.forms(),null,100);
  for(const o of bookCycle.obligations){const days=[];for(let k=0;k<7;k++){const t=start+k*864e5+12*3600e3;const jj=jNow(t);if(o.dow===-1||o.dow===jj.dow||(o.dom&&o.dom===jj.dom))days.push(t);}if(!days.length)continue;
    for(const t of days){const day=trDay(t),due=Date.parse(day+'T'+String(o.dueHour).padStart(2,'0')+':00:00+03:00'),grace=due+o.graceHours*3600e3;let v=null,src='',at=0;
      const c=closes.find(x=>x.obligationId===o.id);if(c){v=c.verdict==='na'?'na':c.ts>grace?'late':'done';src='book/closes/items/'+c.id;at=c.ts;}
      if(!v&&(o.kind==='form'||o.kind==='report')){const f=forms.find(x=>(x.feeds||[x.title]).some(z=>(o.feeds||[]).indexOf(z)>=0||z===o.title));const r=f&&runs.find(x=>x.formId===f.id&&x.state==='done');if(r){v=(r.doneAt||0)>grace?'late':'done';src='book/runs/items/'+r.id;at=r.doneAt||0;}}
      if(!v&&o.kind==='decision'){const d=decs.find(x=>(o.feeds||[]).indexOf(x.topic)>=0);if(d){v=d.ts>grace?'late':'done';src='decisions/log/items/'+d.id;at=d.ts;}}
      if(!v){const tk=tasks.find(x=>x.kind==='form-emit'&&x.status==='done'&&(x.obligationId===o.id||(o.feeds||[]).indexOf(x.title)>=0));if(tk){v='done';src='tasks/'+tk.id;at=tk.updatedAt||0;}}
      if(!v&&(o.kind==='shift'||o.kind==='payment'||o.kind==='visit')&&o.lastDoneAt>=start&&o.lastDoneAt<end){v=o.lastDoneAt>grace?'late':'done';src='book/cycle';at=o.lastDoneAt;}
      if(!v)v=presDays.has(day)?'missed':'unknown';rows.push({obligationId:o.id,title:o.title,day,verdict:v,src,at});}}
  const cnt=k=>rows.filter(r=>r.verdict===k).length,sum={weekId:wk,rows,onTime:cnt('done'),late:cnt('late'),missed:cnt('missed'),unknown:cnt('unknown'),na:cnt('na'),n:rows.length,at:now};
  await P.ledgerWeek(wk).set(sum).catch(e=>fail('P_DB_WRITE',e,'book/ledger'));
  for(const r of rows.filter(r=>r.verdict==='missed')){const id='missed-'+fleetHash(r.obligationId+r.day);await P.task(id).set({title:'פוספס: '+r.title,status:'queued',priority:2,kind:'missed',obligationId:r.obligationId,day:r.day,updatedAt:now}).catch(()=>{});}
  const off=[...new Set(rows.filter(r=>r.verdict==='unknown').map(r=>DOW_HE[jNow(Date.parse(r.day+'T12:00:00+03:00')).dow]))];
  if(Mandate.allow('speak_unprompted').verdict!=='deny')queueLocal({id:'week-'+wk,kind:'ask',speaker:'ליבה',topic:'סגירת שבוע',options:['תודה'],text:'סגירת שבוע: '+sum.onTime+' בזמן, '+sum.late+' באיחור, '+sum.missed+' פוספסו'+(sum.missed?' - פתחתי להן משימות':'')+(sum.unknown?', ו-'+sum.unknown+' לא ידוע, כי לא הייתי פתוחה ב'+off.join(' ו'):'')+'.'});
  Ledger.record({action:'week.close',cause:wk,result:JSON.stringify({o:sum.onTime,l:sum.late,m:sum.missed,u:sum.unknown})});return sum;}
async function bookTick(){const now=Date.now();if(!db||now-bookTickAt<5*60000)return;bookTickAt=now;try{await bookPresence(now);bookDueLoop(now);await bookIntake(now);await weekClose(now);}catch(e){fail('P_DB_WRITE',e,'book tick');}}
/* a snapshot older than this page's own last write is the echo of an earlier write - taking it would drop what was just
   added, and the next add would save the shorter list */
function bookIn(kind,v){if(kind==='cycle'){if(v&&v.at&&+v.at<bookLocalAt)return; /* a write from outside without at is taken as it is */bookCycle=Object.assign({obligations:[]},v||{});}else if(kind==='roles')bookRoles=v;}
window.__book={parse:bookParse,add:bookAddObligation,due:bookDueLoop,close:bookClose,weekClose,presence:bookPresence,intake:n=>bookIntake(n,true),weekId,jNow,state:()=>({cycle:bookCycle,roles:[...bookRoles.values()]}),asks:bookAsks,tick:()=>{bookTickAt=0;return bookTick();}};
