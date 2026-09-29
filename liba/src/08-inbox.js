// @anchor: inbox
// the inbox queue, readiness, who is speaking, and the pump

const inboxQ=[],spokenLocal=new Set(),sendQ=[];let pumping=false,owner='liba',ownerSince=0,quietUntil=0,pumpTimer=null,taskPrev={},taskSeen=false,lastTasks=[],lastRingAt=0;
/* what was already said survives a reload (page-kernel). spokenLocal is this page load's memory and is set
   before speaking, so nothing is read twice in one load; spokenStore is written only AFTER the speech ends,
   so a reload in the middle of a sentence still reads it again, while one after the sentence does not. */
const SPOKEN_TTL=72*3600*1000;let spokenStore={};
try{spokenStore=JSON.parse(localStorage.getItem('liba.spoken')||'{}')||{};}catch(e){fail('P_STORE',e,'get spoken');}
function spokenDone(id){const t=spokenStore[id];return !!t&&Date.now()-t<SPOKEN_TTL;}
function spokenMark(id){const now=Date.now();spokenStore[id]=now;for(const k in spokenStore)if(now-spokenStore[k]>SPOKEN_TTL)delete spokenStore[k];
  try{localStorage.setItem('liba.spoken',JSON.stringify(spokenStore));}catch(e){fail('P_STORE',e,'set spoken');}}
/* a message's age is part of its meaning (page-kernel). Past AGE_SAY it is read with its age; a plain
   announcement past EXPIRE is not read at all but marked expired. Questions never expire - they still
   need an answer - and commands never expire, they still need to run. */
const AGE_SAY=10*60*1000,EXPIRE={say:72*3600*1000,done:72*3600*1000};
/* some writers number their messages (ts:1,2,3) instead of stamping them: such a ts orders, it does not age */
const CLOCK_MIN=1577836800000; // 2020-01-01
function ageOf(d){return d&&!d.local&&d.ts>=CLOCK_MIN?Math.max(0,Date.now()-d.ts):0;}
function heAgo(ms){const m=Math.round(ms/60000);if(m<60)return 'מלפני '+m+' דקות';const h=Math.round(m/60);if(h===1)return 'מלפני שעה';if(h===2)return 'מלפני שעתיים';if(h<24)return 'מלפני '+h+' שעות';const n=Math.round(h/24);return n===1?'מאתמול':n===2?'משלשום':'מלפני '+n+' ימים';}
function expired(d){const lim=EXPIRE[d.kind||'say'];return !!lim&&!d.priority&&ageOf(d)>lim;}
window.__kernel={state:()=>state,illegal:()=>illegalMoves,log:stateLog,forgetLoad:()=>spokenLocal.clear(),spoken:()=>Object.assign({},spokenStore)};
function queueLocal(d){d.local=true;d.from='liba';d.ts=Date.now();if(!inboxQ.some(x=>x.id===d.id)&&!spokenLocal.has(d.id))inboxQ.push(d);pump();}
/* step 19: priority – urgent bypasses quiet; morning waits for 08:00 */
function ready(d){if(d.kind==='cmd')return appMode;const p=d.priority||'normal';if(p==='urgent')return true;if(p==='morning'){const h=new Date().getHours();if(h<8||h>=22)return false;}if(quietUntil>Date.now())return false;return true;}
const NAMES={liba:'ליבה',manager:'המנהל',architect:'האדריכל',builder:'סוכן הבנייה'};
const KINDW={ask:'שאלה',stuck:'נתקע',done:'סיים'};
function speakerOf(d){if(d.speaker)return d.speaker;if(/^arch/i.test(d.id||''))return 'האדריכל';return NAMES[d.from||'liba']||d.from||'ליבה';}
function prefixOf(d,who){const t=(d.text||'').trim();if(t.startsWith(who)||t.startsWith('כאן '+who))return '';let p=who;if(d.topic)p+=', בנוגע ל'+d.topic;if(KINDW[d.kind])p+=', '+KINDW[d.kind];return p+': ';}
async function pump(){if(pumping||!isArmed())return;pumping=true;try{const n=inboxQ.filter(d=>ready(d)&&d.kind!=='cmd'&&!spokenLocal.has(d.id)).length;
  if(n>=2){const asks=inboxQ.filter(d=>ready(d)&&(d.kind==='ask'||d.kind==='stuck')).length;await incoming({id:'batch-'+Date.now(),local:true,from:'liba',speaker:'ליבה',kind:asks?'stuck':'say',noListen:true,text:'הצטברו '+n+' הודעות'+(asks?', '+asks+' מהן שאלות. אקרא אותן ברצף, צלצול אחד.':'. אקרא אותן ברצף.')});}
  for(;;){let i=inboxQ.findIndex(d=>ready(d)&&d.kind==='cmd');if(i<0)i=inboxQ.findIndex(ready);if(i<0)break;const d=inboxQ.splice(i,1)[0];if(spokenLocal.has(d.id))continue;if(d.kind==='cmd'){if(!appMode){spokenLocal.add(d.id);continue;}spokenLocal.add(d.id);await incoming(d);spokenMark(d.id);continue;}spokenLocal.add(d.id);
    if(!d.local&&expired(d)){spokenMark(d.id);try{await P.inboxDoc(d.id).update({expired:true,expiredAt:Date.now()});}catch(e){fail('P_ACK',e,'expire');}continue;}
    if(!d.local){d.again=!!d.speakingAt&&!d.spoken;P.inboxDoc(d.id).update({speakingAt:Date.now()}).catch(e=>fail('P_ACK',e,'speakingAt'));}
    try{await incoming(d);}catch(e){fail('P_MSG_BAD',e,'inbox');log('הודעה פגומה: '+(e&&e.message||e));}if(d.local)continue;spokenMark(d.id);try{await P.inboxDoc(d.id).update({spoken:true,spokenAt:Date.now()});}catch(e){fail('P_ACK',e,'inbox');log('ack: '+(e.code||e));}}}finally{pumping=false;if(inboxQ.length){clearTimeout(pumpTimer);pumpTimer=setTimeout(pump,60000);log(inboxQ.length+' הודעות מחכות (שקט/בוקר)');}}}
