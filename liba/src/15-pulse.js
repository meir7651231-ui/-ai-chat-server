// @anchor: pulse
// fixed-cardinality telemetry: one pulse document per device, one ledger document per day, and "why were you silent"
/* Step fixed-cardinality-telemetry. Everything here rewrites a document that already exists instead of adding one:
   a full database refuses new documents but keeps taking writes to existing ones, so these survive exactly when the
   rest of the telemetry dies. pulse/<dev> is written on a change or once in five minutes (the bubble is edge-
   triggered too, this is the page's own guard); ledger/<day> holds this page's counters under its own key, so two
   tabs merge instead of overwriting each other. */
const PULSE_EVERY=5*60*1000,PULSE_STALE=15*60*1000,LEDGER_EVERY=5*60*1000;
const PULSE_KEYS=['mic','overlay','battery','charging','net','vad','ttsOk','pageReady','ver','lastHeard','lastSpoke','since','why','battOpt','uptime','doze','login','life','gasp'];
const pulseLast={};
/* the body comes from the bubble; only known keys, only plain values, bounded */
function pulseClean(raw){let b={};try{b=JSON.parse(String(raw||'{}').slice(0,2000))||{};}catch(e){fail('P_MSG_BAD',e,'pulse');}
  const o={};PULSE_KEYS.forEach(k=>{const v=b[k];if(typeof v==='boolean'||typeof v==='number')o[k]=v;else if(typeof v==='string')o[k]=v.slice(0,40);});return o;}
function pulseIn(d,now){now=now||Date.now();const dev=String(d.dev).replace(/[^A-Za-z0-9_-]/g,'').slice(0,40);if(!dev)return false;
  const body=pulseClean(d.body);const sig=JSON.stringify(Object.assign({},body,{lastHeard:0,lastSpoke:0,since:0,why:''}));const last=pulseLast[dev];
  if(last&&last.sig===sig&&now-last.at<PULSE_EVERY)return false;
  if(last&&now-last.at>PULSE_STALE)healthGap(dev,last.body,body,last.at,now);
  else if(!last)P.pulse(dev).get().then(g=>{const prev=g.exists?(g.data()||{}):null;if(prev&&now-(+prev.at||0)>PULSE_STALE)healthGap(dev,prev,body,+prev.at,now);}).catch(e=>fail('P_DB_READ',e,'pulse prev'));
  pulseLast[dev]={sig:sig,at:now,body:body};
  P.pulse(dev).set(Object.assign(body,{dev:dev,name:String(d.name||'').slice(0,40),at:now,pageHash:__PAGE_HASH__})).catch(e=>fail('P_DB_WRITE',e,'pulse'));
  return true;}
/* the ledger: this page's counts for the day, under its own holder key */
const ledger={req:0,said:0,heard:0};let ledgerDay='',ledgerAt=0;
function ledgerBump(k){ledger[k]=(ledger[k]||0)+1;}
async function ledgerFlush(now){now=now||Date.now();const day=trDay(now);
  if(ledgerDay&&day!==ledgerDay){ledger.req=0;ledger.said=0;ledger.heard=0;for(const k in silenceDay)delete silenceDay[k];}ledgerDay=day;ledgerAt=now;
  const denied=Object.values(chDenied).reduce((a,b)=>a+b,0);const mine={at:now,[janHolder]:{req:ledger.req,said:ledger.said,heard:ledger.heard,denied:denied,silence:Object.assign({},silenceDay),at:now}};
  try{await P.ledger(day).update(mine);}catch(e){if(e&&e.code==='not_found'){try{await P.ledger(day).set(Object.assign({day:day},mine));}catch(x){fail('P_DB_WRITE',x,'ledger');}}else fail('P_DB_WRITE',e,'ledger');}}
every('ledger',LEDGER_EVERY,()=>{if(db)ledgerFlush();});
/* "why were you silent" / "how are you": from the pulse documents, one sentence per device */
const ago=ms=>{const w=heAgo(ms);return w.indexOf('מלפני')===0?w.slice(1):w;};
function pulseSay(p,now,many){const who=many?(p.name||'מכשיר')+': ':'';const age=now-(+p.at||0);
  if(age>PULSE_STALE)return who+'הטלפון לא דיבר איתי מאז '+heAt(+p.at)+'.';
  const since=+p.since>0?' '+ago(now-(+p.since)):'';
  if(p.overlay===false)return who+'הבועה סגורה - אין הרשאה להציג אותה מעל אפליקציות'+(since?', כבר'+since:'')+'.';
  if(p.mic===false)return who+'הטלפון חי, אבל ההרשאה למיקרופון נשללה'+(since?''+since:'')+'.';
  if(p.ttsOk===false)return who+'הטלפון חי, אבל הקול לא עלה.';
  if(p.net===false)return who+'הטלפון חי, אבל אין לו אינטרנט.';
  if(p.login===true)return who+'הבועה פתוחה, אבל הדף התנתק מהחשבון. צריך להתחבר מחדש ל-claude.ai בטלפון.';
  if(p.pageReady===false)return who+'הבועה פתוחה, אבל הדף בתוכה עוד לא התחבר.';
  const heard=+p.lastHeard>0?' שמעתי אותך לאחרונה '+ago(now-(+p.lastHeard))+'.':'';
  const risk=p.battOpt===false?' רק דבר אחד: אין לי פטור מחיסכון בסוללה, אז הטלפון עלול לכבות אותי. תפתח את ליבה ותאשר.':'';
  return who+'הכול תקין: הבועה פתוחה והמיקרופון עובד'+(+p.battery>=0?', סוללה '+p.battery+' אחוז'+(p.charging?' בטעינה':''):'')+'.'+heard+risk;}
function heAt(t){if(!t)return 'אף פעם';const d=new Date(t),n=new Date();const hm=d.toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'});
  if(d.toDateString()===n.toDateString())return 'היום ב-'+hm;const y=new Date(n.getTime()-864e5);if(d.toDateString()===y.toDateString())return 'אתמול ב-'+hm;return ago(Date.now()-t);}
async function whyCmd(){const now=Date.now();let r;try{r=await coldGet(P.pulses(),null,10);}catch(e){fail('P_DB_READ',e,'pulse');sayLocal('לא הצלחתי לקרוא את מצב הטלפון.');return;}
  const ps=r.docs.map(d=>d.data()||{}).sort((a,b)=>(b.at||0)-(a.at||0));
  if(!ps.length){sayLocal('עוד לא קיבלתי דופק מהטלפון. זה יתחיל אחרי שהגרסה החדשה של האפליקציה תותקן.');return;}
  let past='';try{const h=await P.health().get();const x=h.exists?(h.data()||{}):null;if(x&&now-(+x.at||0)<864e5&&x.reason)past=' השתיקה האחרונה, '+ago(now-(+x.from||now))+', הייתה כי '+(HEALTH_HE[x.reason]||HEALTH_HE.unknown)+'.';}catch(e){fail('P_DB_READ',e,'channel/health');}
  sayLocal(ps.map(p=>pulseSay(p,now,ps.length>1)).join(' ')+past);}
/* heartbeat-diag: a closed vocabulary for why ליבה was silent. When a pulse comes back after a gap, the gap gets a
   reason from what the phone knew: why this life began (boot/revive), the last gasp of the previous one (the app saw
   its own end coming, or Meir turned it off), and the last pulse before the gap (no network, deep sleep, logged out).
   Written to channel/health - one document, rewritten. */
const HEALTH_HE={'phone-off':'הטלפון כבה או הופעל מחדש','app-killed':'המערכת סגרה אותי','mic-revoked':'ההרשאה למיקרופון נשללה','overlay-revoked':'ההרשאה לבועה נשללה',
  'page-logged-out':'הדף התנתק מהחשבון','network-down':'לא הייתה רשת','doze':'הטלפון נכנס לשינה עמוקה','turned-off':'כיבית אותי','unknown':'אני לא יודעת למה'};
function gapReason(prev,cur){const g=String(cur.gasp||'');
  if(/^turned-off/.test(g))return 'turned-off';if(cur.life==='boot')return 'phone-off';if(/^app-killed/.test(g)||cur.life==='revive')return 'app-killed';
  if(prev&&prev.net===false)return 'network-down';if(prev&&prev.doze===true)return 'doze';if(prev&&prev.login===true)return 'page-logged-out';
  if(prev&&prev.mic===false)return 'mic-revoked';if(prev&&prev.overlay===false)return 'overlay-revoked';return 'unknown';}
function liveReason(p,now){if(now-(+p.at||0)>PULSE_STALE)return p.net===false?'network-down':p.doze?'doze':'unknown';
  if(p.overlay===false)return 'overlay-revoked';if(p.mic===false)return 'mic-revoked';if(p.login===true)return 'page-logged-out';return 'ok';}
function healthGap(dev,prev,cur,from,to){const reason=gapReason(prev,cur);
  P.health().set({reason:reason,dev:dev,from:from,to:to,at:to}).catch(e=>fail('P_DB_WRITE',e,'channel/health'));return reason;}
/* health-console: "מה מצב הקו" - three sentences, never a report: the line now, today in numbers, the last silence */
async function lineCmd(){const now=Date.now();let p=null,h=null;
  try{const r=await coldGet(P.pulses(),null,10);p=r.docs.map(d=>d.data()||{}).sort((a,b)=>(b.at||0)-(a.at||0))[0]||null;}catch(e){fail('P_DB_READ',e,'pulse');}
  try{const g=await P.health().get();h=g.exists?(g.data()||{}):null;}catch(e){fail('P_DB_READ',e,'channel/health');}
  const live=p?liveReason(p,now):'';
  const a=!p?'הקו: עוד אין דופק מהטלפון.':live==='ok'?'הקו חי'+(+p.battery>=0?', סוללה '+p.battery+' אחוז':'')+'.':'הקו לא תקין: '+(HEALTH_HE[live]||HEALTH_HE.unknown)+'.';
  const held=Object.values(silenceDay).reduce((x,y)=>x+y,0);
  const b='היום: '+ledger.req+' בקשות, אמרתי '+ledger.said+(held?', ו-'+held+' עיכובים':'')+'.';
  const c=h&&now-(+h.at||0)<7*864e5?'השתיקה האחרונה '+ago(now-(+h.from||now))+': '+(HEALTH_HE[h.reason]||HEALTH_HE.unknown)+'.':'אין שתיקה בשבוע האחרון.';
  sayLocal(a+' '+b+' '+c);}
window.__pulse={in:pulseIn,line:lineCmd,reason:gapReason,live:liveReason,say:pulseSay,why:whyCmd,ledgerFlush:ledgerFlush,ledger:()=>Object.assign({},ledger)};
