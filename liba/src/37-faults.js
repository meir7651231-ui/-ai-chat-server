// @anchor: faults
// faults: the same failure three times in a day opens a repair worker - with the code, the version, the context
/* Step faults. Every phone fault reaches the page (Trace.e -> the black box -> trBridge). faultSeen() counts each code
   over a sliding day (by event id, so a batch sent twice is counted once); on the third, one fix worker opens - through
   the mandate (open_worker), under an idem of code+day so a fault that keeps firing opens one worker a day, not one a
   minute. Refused commands and held private messages are the system working, not failing - they never count. If the
   mandate says ask first, Meir hears one sentence and can say "תתקן את התקלה של ...". The Kotlin side: no silent failure
   (gates/silent-faults.mjs, zero), and the speech guard is measured on this phone (GuardCore). */
const FAULT_REPEAT=3,FAULT_WIN=864e5,FAULT_SKIP=['E_CMD_REFUSED','E_UNKNOWN'];let faultIds=new Set(),faultAt={};
try{faultAt=JSON.parse(localStorage.getItem(LSK('faultAt'))||'{}');}catch(e){faultAt={};}
const FAULT_HE={E_TTS_GUARD:'הקול נתקע באמצע',E_SR_LIFECYCLE:'זיהוי הדיבור',E_MIC_READ:'המיקרופון',E_MIC_INIT:'פתיחת המיקרופון',E_PAGE_LOAD:'טעינת הדף',E_PREFS:'שמירה בטלפון',E_TTS_INIT:'מנוע הקול',E_TTS_OP:'הקול',E_INSTALL_SIG:'חתימת עדכון'};
function faultSeen(L){if(!L||!/^E_/.test(L.c)||FAULT_SKIP.indexOf(L.c)>=0||faultIds.has(L.id))return false;faultIds.add(L.id);if(faultIds.size>2000)faultIds=new Set([...faultIds].slice(-1000));
  const now=+L.t||Date.now(),list=(faultAt[L.c]||[]).filter(t=>now-t<FAULT_WIN);list.push(now);faultAt[L.c]=list.slice(-10);
  try{localStorage.setItem(LSK('faultAt'),JSON.stringify(faultAt));}catch(e){}
  if(list.length===FAULT_REPEAT){faultWorker(L);return true;}return false;}
function faultWorker(L){const he=FAULT_HE[L.c]||L.c,spec='תקלה שחזרה שלוש פעמים ביממה: '+L.c+' ('+he+')'+(L.ctx?', הקשר: '+String(L.ctx).slice(0,80):'')+', גרסה '+(L.v||appVer||'?')+'. לשחזר מהקופסה השחורה (telemetry/events), לתקן, להוסיף בדיקה.';
  const v=Mandate.allow('open_worker');
  if(v.verdict==='deny'||v.verdict==='ask_first'){queueLocal({id:'fault-'+L.c+'-'+trDay(L.t),kind:'say',speaker:'ליבה',topic:'תקלה',text:'תקלה חזרה שלוש פעמים היום: '+he+'. אם לפתוח עובד תיקון, תגיד "תתקן את התקלה של '+he+'".'});return;}
  openWorker({kind:'fix',spec,title:'תיקון: '+he,idem:fleetHash('fault|'+L.c+'|'+trDay(L.t))}).then(r=>{if(!r.dup)queueLocal({id:'fault-w-'+r.wid,kind:'say',speaker:'ליבה',topic:'תקלה',text:'תקלה חזרה שלוש פעמים היום: '+he+'. פתחתי עובד תיקון.'});}).catch(e=>fail('P_DB_WRITE',e,'fault worker'));}
window.__faults={seen:faultSeen,state:()=>faultAt};
