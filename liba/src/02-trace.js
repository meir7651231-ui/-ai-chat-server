// @anchor: trace
// black box: one table of codes, one writer (step blackbox)
/* ---- black box (step blackbox): one table of codes, one writer ---- */
const TRACE_HE={E_OVERLAY_DENIED:'אין הרשאה לחלון צף',E_OVERLAY_UPDATE:'החלון הצף לא התעדכן',E_TTS_INIT:'הקול לא עלה',E_TTS_OP:'תקלה בדיבור',E_SR_LIFECYCLE:'סגירת המאזין נכשלה',E_SR_NONE:'אין זיהוי דיבור במכשיר',E_MIC_FGS:'המיקרופון נחסם ברקע',E_FGS_START:'השירות לא הצליח לעלות',E_MIC_INIT:'המיקרופון לא נפתח',E_MIC_READ:'ההקלטה נקטעה',E_HAPTIC:'הרטט נכשל',E_TONE:'הצליל נכשל',E_AUDIO_STREAM:'שינוי עוצמת הקול נכשל',E_MEDIA_SESSION:'כפתור האוזניה לא נרשם',E_NET:'בדיקת עדכון נכשלה ברשת',E_SYS_CB:'חיבור לאירועי המערכת נכשל',E_INSTALL_PERM:'אין הרשאה להתקין עדכון',E_INSTALL_NET:'הורדת העדכון נכשלה',E_INSTALL_SIG:'העדכון לא עבר אימות',E_INTENT_OPEN:'פתיחה של אפליקציה נכשלה',E_PAGE_LOGIN:'הבועה התנתקה מהחשבון',E_PAGE_LOAD:'הדף לא נטען',E_PAGE_TAP:'לחיצה אוטומטית החטיאה',E_CRASH_SAVE:'שמירת קריסה נכשלה',E_PREFS:'קריאת ההגדרות נכשלה',E_SHADER:'האנימציה של הבועה נכשלה',E_TRACE_ROTATE:'יומן תקלות ישן נמחק',P_BRIDGE:'הדף לא הצליח לדבר עם הבועה',P_STORE:'הזיכרון המקומי בדפדפן חסום',P_AUDIO:'הצלילים בדף לא עלו',P_SR:'המיקרופון בדף נתקע',P_MIC_DENIED:'המיקרופון בדף נחסם',P_WAKELOCK:'המסך לא נשאר דלוק',P_DB_WRITE:'כתיבה למסד נכשלה',P_DB_READ:'קריאה מהמסד נכשלה',P_SEND:'ההודעה לא הגיעה לקלוד',P_ACK:'סימון הודעה כנאמרה נכשל',P_MSG_BAD:'הודעה פגומה',P_SPEAK_LOST:'הקול בטלפון השתתק באמצע בלי לדווח',P_PROTO_APP_OLD:'האפליקציה ישנה מהדף',P_PROTO_PAGE_OLD:'הדף ישן מהאפליקציה',P_REQ_UNBOUND:'תשובה שלא מצאה את השאלה שלה',P_CLOCK_SKEW:'השעון של הדף והטלפון לא מסונכרן',P_SPEAK_GUARD:'הקול לא דיווח שסיים ונעצר בכוח',P_STATE_ILLEGAL:'מעבר מצב שלא בטבלה',P_DB_FULL:'המסד מלא',P_INTENT_FUZZY:'פקודה שכמעט הובנה - שאלתי',P_DB_WINDOW:'חלון קריאה צומצם כי המסד עמוס',P_CMD_REFUSED:'פקודה לא חתומה נדחתה',P_SIG:'בדיקת חתימה נכשלה',E_CMD_REFUSED:'הטלפון דחה פקודה לא חתומה',E_STATE_ILLEGAL:'מעבר מצב שלא בטבלה בבועה'};
const TRACE_SR_HE={1:'זיהוי הדיבור נכשל ברשת',2:'זיהוי הדיבור נכשל ברשת',3:'ההקלטה נכשלה',4:'שרת הזיהוי סירב',5:'תקלה פנימית בזיהוי',6:'לא שמעתי כלום',7:'לא זוהו מילים',8:'המאזין היה תפוס',9:'אין הרשאת מיקרופון',11:'חסרה שפה לזיהוי',12:'העברית לא מותקנת במכשיר',13:'הזיהוי במכשיר לא זמין'};
const TRACE_FLUSH=3000,TRACE_RING=200,TRACE_BATCH=200,TRACE_QMAX=1000;
let trVer='',trBuf=new Map(),trWin=0,trCount={},trDrop={},trQ=[],trRing=[],trTimer=null,trWriting=false,trInTrace=false;
const trMin=t=>Math.floor(t/60000);
const trCol=()=>P.telemetry();
/* hot loops (syncWindows per frame, wake-mode onError every 400ms) carry the hardest cap */
const trCap=c=>c==='E_CRASH_SAVE'?1e9:(c==='E_OVERLAY_UPDATE'||/^E_SR_\d+$/.test(c))?2:5;
/* the hour on Meir's clock (Jerusalem), not the browser's - a phone abroad or a UTC test machine must not move the night */
function jHour(ts){try{return +new Date(ts).toLocaleString('en-GB',{timeZone:'Asia/Jerusalem',hour:'2-digit',hour12:false})%24;}catch(e){return new Date(ts).getHours();}}
function trDay(ts){try{return new Date(ts).toLocaleDateString('sv-SE',{timeZone:'Asia/Jerusalem'});}catch(e){return new Date(ts).toISOString().slice(0,10);}}
function trId(t,code,ctx){let h=0;const s=code+'|'+(ctx||'');for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return t.toString(36)+'-'+('00'+(h%46656).toString(36)).slice(-3);}
/* ctx is machine text only – this strip is the privacy boundary: no utterance, no note, no url with a token */
function trCtx(v){return String(v==null?'':(v&&v.code)||(v&&v.name)||v).replace(/[^A-Za-z0-9_\-./:=|,<>()\[\] ]/g,'').replace(/\s+/g,' ').trim().slice(0,120);}
function trHe(c){if(TRACE_HE[c])return TRACE_HE[c];const m=/^E_SR_(\d+)$/.exec(c||'');if(m)return TRACE_SR_HE[m[1]]||'זיהוי הדיבור נכשל';return 'תקלה לא מוכרת';}
function trRingPush(L){trRing.push(L);while(trRing.length>TRACE_RING)trRing.shift();}
function trQueue(L){if(!L.q){L.q=true;trQ.push(L);while(trQ.length>TRACE_QMAX)trQ.shift();}if(!trTimer)trTimer=setTimeout(trFlush,TRACE_FLUSH);}
/* window close: every code that was capped writes its own dropped line, so the box cannot lie by omission */
function trRoll(now){const w=trMin(now);if(w===trWin)return;
  for(const c in trDrop){if(trDrop[c]>0){const t=trWin*60000,L={id:trId(t,c,'dropped'),t:t,c:c,n:0,ctx:'dropped',v:trVer,s:'p',d:trDrop[c]};trRingPush(L);trQueue(L);}}
  trBuf=new Map();trCount={};trDrop={};trWin=w;}
function fail(code,e,ctx){
  try{const t=Date.now();trRoll(t);
    const cx=trCtx(ctx!=null?ctx:e);const k=code+'|'+cx;const L=trBuf.get(k);
    if(L){L.n++;trQueue(L);return;}
    if((trCount[code]||0)>=trCap(code)){trDrop[code]=(trDrop[code]||0)+1;return;}
    trCount[code]=(trCount[code]||0)+1;
    const line={id:trId(t,code,cx),t:t,c:code,n:1,ctx:cx,v:trVer,s:'p'};
    trBuf.set(k,line);trRingPush(line);trQueue(line);
  }catch(_){}} /* fail() itself is the one site with no code: it must never throw into the caller */
function trDoc(L){return {code:L.c,ts:L.t,n:L.n,ctx:L.ctx||'',ver:L.v||'',src:L.s||'p',dropped:L.d||0,day:trDay(L.t),at:Date.now()};}
/* a telemetry write that fails is re-queued in silence – calling fail() here would feed itself */
function trFlush(){trTimer=null;if(!db||trWriting||!trQ.length)return;
  const batch=trQ.splice(0,TRACE_BATCH);batch.forEach(L=>{L.q=false;});trWriting=true;
  Promise.all(batch.map(L=>{try{return Promise.resolve(trCol().doc(L.id).set(trDoc(L))).catch(()=>trQueue(L));}catch(e){trQueue(L);return Promise.resolve();}}))
    .then(()=>{trWriting=false;if(trQ.length&&!trTimer)trTimer=setTimeout(trFlush,TRACE_FLUSH);},()=>{trWriting=false;});}
/* Kotlin -> page: short-key lines in, long-key docs out; the ids that landed are acked back */
function trBridge(batch,json){
  let arr=null;
  if(trInTrace)return;trInTrace=true;
  try{arr=JSON.parse(json);}catch(e){fail('P_DB_WRITE',e,'telemetry/events parse');}
  trInTrace=false;
  if(!Array.isArray(arr)){post(PROTO.toApp.traceAck,{batch:batch,ids:[]});return;}
  const ok=[];
  Promise.all(arr.slice(0,TRACE_BATCH).map(ev=>{
    const t=+ev.t||Date.now(),c=String(ev.c||'E_UNKNOWN'),cx=trCtx(ev.ctx);
    const L={id:String(ev.id||trId(t,c,cx)),t:t,c:c,n:+ev.n||0,ctx:cx,v:String(ev.v||''),s:String(ev.s||'k'),d:+ev.d||0};
    trRingPush(L);if(typeof faultSeen==='function')faultSeen(L); /* faults: three in a day opens a repair worker */
    /* a rejected write is simply left out of ids – unacked, so it comes back in the next batch */
    try{return Promise.resolve(trCol().doc(L.id).set(trDoc(L))).then(()=>{ok.push(L.id);},()=>{});}catch(e){return Promise.resolve();}
  })).then(()=>post(PROTO.toApp.traceAck,{batch:batch,ids:ok}),()=>post(PROTO.toApp.traceAck,{batch:batch,ids:ok}));}
/* ids go as a list: the bridge stringifies it once for Kotlin's JSONArray. A string here was stringified twice, the phone
   parsed nothing, acked nothing, and re-sent every event on every batch (a phone-test day: rows rewritten 150 times) */
/* reading it back: dropped counts inside the total, so the cap changes what is stored, never what is counted */
async function trTop(day){const byId=new Map();
  try{const r=await coldGet(trCol(),[['ts','>=',Date.now()-26*3600e3]],1000);r.docs.forEach(d=>{const x=d.data()||{};const dy=x.day||trDay(x.ts||0);if(dy!==day)return;byId.set(d.id,{code:String(x.code||'?'),total:(+x.n||0)+(+x.dropped||0)});});}
  catch(e){fail('P_DB_READ',e,'telemetry/events');}
  trRing.forEach(L=>{if(trDay(L.t)!==day)return;byId.set(L.id,{code:L.c,total:(L.n||0)+(L.d||0)});});
  const by={};byId.forEach(v=>{by[v.code]=(by[v.code]||0)+v.total;});
  /* the open window's drops are not written yet – count them anyway, or the answer under-reports */
  if(trDay(trWin*60000)===day)for(const c in trDrop)if(trDrop[c]>0)by[c]=(by[c]||0)+trDrop[c];
  return Object.keys(by).map(c=>({code:c,total:by[c]})).sort((a,b)=>b.total-a.total);}
function traceToday(){
  const day=trDay(Date.now());
  trTop(day).then(rows=>{
    if(!rows.length){sayLocal('היום שום דבר לא נשבר. הכל עבד.');return;}
    const top=rows.slice(0,10),tot=rows.reduce((a,r)=>a+r.total,0);
    sayLocal('היום היו '+tot+' תקלות ב'+rows.length+' סוגים. '+top.map(r=>trHe(r.code)+' '+r.total+(r.total===1?' פעם':' פעמים')).join('; ')+'.');
  });
  return true;}
window.__trace={fail:fail,top:trTop,ring:trRing,flush:trFlush};
try{lastRung=localStorage.getItem('liba.lastRung');}catch(e){fail('P_STORE',e,'get lastRung');}
