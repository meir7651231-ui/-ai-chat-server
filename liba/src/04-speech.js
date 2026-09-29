// @anchor: speech
// speaking: browser voice, and the app voice with the spoke callback

/* ---- speech out ---- */
let voice=null;
function pickVoice(){const vs=speechSynthesis.getVoices();voice=vs.find(v=>/^he/i.test(v.lang))||null;}
if('speechSynthesis' in window){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}
let sayTok=0,appVer='';const sayWait=new Map();
function appSpeaksBack(){const m=/(\d+)\.(\d+)/.exec(appVer||'');return !!m&&(+m[1]>3||(+m[1]===3&&+m[2]>=14));}
/* v36: in the app, wait until the phone finished speaking before acking the next message */
function sayApp(text,extra){return new Promise(res=>{const id='s'+(++sayTok);const p=Object.assign({},extra||{},{text:text,id:id});if(!appSpeaksBack()){post('say',p);res();return;}let done=false;const fin=()=>{if(done)return;done=true;sayWait.delete(id);res();};sayWait.set(id,fin);post('say',p);setTimeout(fin,Math.min(120000,6000+text.length*160));});}
function say(text){return new Promise(res=>{if(appMode){res();return;}if(!('speechSynthesis' in window)){res();return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='he-IL';if(voice)u.voice=voice;u.rate=1.3;u.onend=res;u.onerror=res;speechSynthesis.speak(u);setTimeout(res,Math.min(20000,1500+text.length*90));});}
