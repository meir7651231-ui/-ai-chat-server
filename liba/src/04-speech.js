// @anchor: speech
// speaking: browser voice, and the app voice with the spoke callback

/* ---- speech out ---- */
let voice=null;
function pickVoice(){const vs=speechSynthesis.getVoices();voice=vs.find(v=>/^he/i.test(v.lang))||null;}
if('speechSynthesis' in window){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}
let sayTok=0,appVer='';const sayWait=new Map(),beatWait=new Map();
const verAtLeast=(a,b)=>{const m=/(\d+)\.(\d+)/.exec(appVer||'');return !!m&&(+m[1]>a||(+m[1]===a&&+m[2]>=b));};
/* 3.16+: the phone says "still speaking" every 2 s (page-kernel). Six seconds of silence means the voice
   stopped without reporting - release the queue now instead of waiting up to two minutes. */
const appBeats=()=>{const h=hasCap('beat');return h!==null?h:verAtLeast(3,16);},BEAT_LOST=6000;
/* protocol-contract: the app says what it can do in hello. Apps from before the contract (no caps) fall back
   to the version number - the only thing they tell us. */
let appCaps=null,appPv=0;
const hasCap=c=>appCaps?appCaps.indexOf(c)>=0:null;
function appSpeaksBack(){const h=hasCap('spoke');return h!==null?h:verAtLeast(3,14);}
/* v36: in the app, wait until the phone finished speaking before acking the next message */
function sayApp(text,extra,re){return new Promise(res=>{const id='s'+(++sayTok);if(re)sayReq.set(id,String(re));const p=Object.assign({},extra||{},{text:text,id:id});if(!appSpeaksBack()){post(PROTO.toApp.say,p);res();return;}let done=false;const fin=()=>{if(done)return;done=true;sayWait.delete(id);beatWait.delete(id);res();};sayWait.set(id,fin);post(PROTO.toApp.say,p);
  /* with beats the length guess is gone - the beat IS the measurement; 120 s stays only as a ceiling */
  setTimeout(fin,appBeats()?120000:Math.min(120000,6000+text.length*160));
  if(appBeats()){let w=setTimeout(lost,BEAT_LOST);function lost(){if(done)return;fail('P_SPEAK_LOST',null,'no beat '+BEAT_LOST);fin();}
    beatWait.set(id,()=>{clearTimeout(w);if(!done)w=setTimeout(lost,BEAT_LOST);});}});}
function say(text){return new Promise(res=>{if(appMode){res();return;}if(!('speechSynthesis' in window)){res();return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='he-IL';if(voice)u.voice=voice;u.rate=1.3;u.onend=res;u.onerror=res;speechSynthesis.speak(u);setTimeout(res,Math.min(20000,1500+text.length*90));});}
