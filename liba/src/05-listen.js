// @anchor: listen
// hearing: SpeechRecognition, and the screen wake lock

/* ---- speech in ---- */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
let listening=false,micErr='',micBlocked=false;
const ERR={'not-allowed':'המיקרופון חסום בדף הזה. בטלפון: הגדרות ← Safari/Chrome ← מיקרופון ← אפשר.','service-not-allowed':'זיהוי דיבור לא זמין בדפדפן הזה.','audio-capture':'לא נמצא מיקרופון.','network':'זיהוי דיבור צריך אינטרנט.','no-speech':'לא שמעתי כלום.','aborted':''};
function listen(){return new Promise(res=>{if(!SR){res(null);return;}if(listening){try{rec.stop();}catch(e){fail('P_SR',e,'stop');}res(null);return;}try{rec=new SR();}catch(e){fail('P_SR',e,'new');res(null);return;}rec.lang='he-IL';rec.interimResults=true;rec.continuous=false;let fin='',err='';listening=true;app.classList.add('listen');HEARD.hidden=false;HEARD.textContent='מקשיב…';$('talk').textContent='■ סיימתי לדבר';
  rec.onresult=e=>{let it='';for(let i=e.resultIndex;i<e.results.length;i++){const r=e.results[i];if(r.isFinal)fin+=r[0].transcript;else it+=r[0].transcript;}HEARD.textContent=fin+it;};
  rec.onerror=e=>{err=e.error;fail('P_SR',e,e.error);micErr=ERR[err]??('מיקרופון: '+err);if(micErr){log(micErr);if(err==='not-allowed'||err==='service-not-allowed'||err==='audio-capture'){micBlocked=true;dictationMode();}}};
  rec.onend=()=>{listening=false;app.classList.remove('listen');$('talk').textContent='🎙 דבר';const t=(fin||HEARD.textContent||'').trim();res(err&&err!=='no-speech'?null:(t==='מקשיב…'?'':t));};
  try{rec.start();}catch(e){fail('P_SR',e,'start');listening=false;res(null);}setTimeout(()=>{try{rec.stop();}catch(e){fail('P_SR',e,'stop cap');}},12000);});}
/* ---- wake lock ---- */
async function keepAwake(){try{if('wakeLock' in navigator){wakeLock=await navigator.wakeLock.request('screen');wakeLock.addEventListener('release',()=>{wakeLock=null;});}}catch(e){fail('P_WAKELOCK',e);}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&armed&&!wakeLock)keepAwake();});
