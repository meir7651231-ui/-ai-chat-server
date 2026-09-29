// @anchor: pulse
// fixed-cardinality telemetry: one pulse document per device, one ledger document per day, and "why were you silent"
/* Step fixed-cardinality-telemetry. Everything here rewrites a document that already exists instead of adding one:
   a full database refuses new documents but keeps taking writes to existing ones, so these survive exactly when the
   rest of the telemetry dies. pulse/<dev> is written on a change or once in five minutes (the bubble is edge-
   triggered too, this is the page's own guard); ledger/<day> holds this page's counters under its own key, so two
   tabs merge instead of overwriting each other. */
const PULSE_EVERY=5*60*1000,PULSE_STALE=15*60*1000,LEDGER_EVERY=5*60*1000;
const PULSE_KEYS=['mic','overlay','battery','charging','net','vad','ttsOk','pageReady','ver','lastHeard','lastSpoke','since','why'];
const pulseLast={};
/* the body comes from the bubble; only known keys, only plain values, bounded */
function pulseClean(raw){let b={};try{b=JSON.parse(String(raw||'{}').slice(0,2000))||{};}catch(e){fail('P_MSG_BAD',e,'pulse');}
  const o={};PULSE_KEYS.forEach(k=>{const v=b[k];if(typeof v==='boolean'||typeof v==='number')o[k]=v;else if(typeof v==='string')o[k]=v.slice(0,40);});return o;}
function pulseIn(d,now){now=now||Date.now();const dev=String(d.dev).replace(/[^A-Za-z0-9_-]/g,'').slice(0,40);if(!dev)return false;
  const body=pulseClean(d.body);const sig=JSON.stringify(Object.assign({},body,{lastHeard:0,lastSpoke:0,since:0,why:''}));const last=pulseLast[dev];
  if(last&&last.sig===sig&&now-last.at<PULSE_EVERY)return false;
  pulseLast[dev]={sig:sig,at:now};
  P.pulse(dev).set(Object.assign(body,{dev:dev,name:String(d.name||'').slice(0,40),at:now,pageHash:__PAGE_HASH__})).catch(e=>fail('P_DB_WRITE',e,'pulse'));
  return true;}
/* the ledger: this page's counts for the day, under its own holder key */
const ledger={req:0,said:0,heard:0};let ledgerDay='',ledgerAt=0;
function ledgerBump(k){ledger[k]=(ledger[k]||0)+1;}
async function ledgerFlush(now){now=now||Date.now();const day=trDay(now);
  if(ledgerDay&&day!==ledgerDay){ledger.req=0;ledger.said=0;ledger.heard=0;}ledgerDay=day;ledgerAt=now;
  const denied=Object.values(chDenied).reduce((a,b)=>a+b,0);const mine={at:now,[janHolder]:{req:ledger.req,said:ledger.said,heard:ledger.heard,denied:denied,at:now}};
  try{await P.ledger(day).update(mine);}catch(e){if(e&&e.code==='not_found'){try{await P.ledger(day).set(Object.assign({day:day},mine));}catch(x){fail('P_DB_WRITE',x,'ledger');}}else fail('P_DB_WRITE',e,'ledger');}}
setInterval(()=>{if(db)ledgerFlush();},LEDGER_EVERY);
/* "why were you silent" / "how are you": from the pulse documents, one sentence per device */
const ago=ms=>heAgo(ms).replace(/^מלפני/,'לפני');
function pulseSay(p,now,many){const who=many?(p.name||'מכשיר')+': ':'';const age=now-(+p.at||0);
  if(age>PULSE_STALE)return who+'הטלפון לא דיבר איתי מאז '+heAt(+p.at)+'.';
  const since=+p.since>0?' '+ago(now-(+p.since)):'';
  if(p.overlay===false)return who+'הבועה סגורה - אין הרשאה להציג אותה מעל אפליקציות'+(since?', כבר'+since:'')+'.';
  if(p.mic===false)return who+'הטלפון חי, אבל ההרשאה למיקרופון נשללה'+(since?''+since:'')+'.';
  if(p.ttsOk===false)return who+'הטלפון חי, אבל הקול לא עלה.';
  if(p.net===false)return who+'הטלפון חי, אבל אין לו אינטרנט.';
  if(p.pageReady===false)return who+'הבועה פתוחה, אבל הדף בתוכה עוד לא התחבר.';
  const heard=+p.lastHeard>0?' שמעתי אותך לאחרונה '+ago(now-(+p.lastHeard))+'.':'';
  return who+'הכול תקין: הבועה פתוחה והמיקרופון עובד'+(+p.battery>=0?', סוללה '+p.battery+' אחוז'+(p.charging?' בטעינה':''):'')+'.'+heard;}
function heAt(t){if(!t)return 'אף פעם';const d=new Date(t),n=new Date();const hm=d.toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'});
  if(d.toDateString()===n.toDateString())return 'היום ב-'+hm;const y=new Date(n.getTime()-864e5);if(d.toDateString()===y.toDateString())return 'אתמול ב-'+hm;return ago(Date.now()-t);}
async function whyCmd(){const now=Date.now();let r;try{r=await coldGet(P.pulses(),null,10);}catch(e){fail('P_DB_READ',e,'pulse');sayLocal('לא הצלחתי לקרוא את מצב הטלפון.');return;}
  const ps=r.docs.map(d=>d.data()||{}).sort((a,b)=>(b.at||0)-(a.at||0));
  if(!ps.length){sayLocal('עוד לא קיבלתי דופק מהטלפון. זה יתחיל אחרי שהגרסה החדשה של האפליקציה תותקן.');return;}
  sayLocal(ps.map(p=>pulseSay(p,now,ps.length>1)).join(' '));}
window.__pulse={in:pulseIn,say:pulseSay,why:whyCmd,ledgerFlush:ledgerFlush,ledger:()=>Object.assign({},ledger)};
