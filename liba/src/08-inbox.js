// @anchor: inbox
// the inbox queue, readiness, who is speaking, and the pump

const inboxQ=[],spokenLocal=new Set(),sendQ=[];let pumping=false,owner='liba',ownerSince=0,quietUntil=0,pumpTimer=null,taskPrev={},taskSeen=false,lastTasks=[],lastRingAt=0;
function queueLocal(d){d.local=true;d.from='liba';d.ts=Date.now();if(!inboxQ.some(x=>x.id===d.id)&&!spokenLocal.has(d.id))inboxQ.push(d);pump();}
/* step 19: priority – urgent bypasses quiet; morning waits for 08:00 */
function ready(d){if(d.kind==='cmd')return appMode;const p=d.priority||'normal';if(p==='urgent')return true;if(p==='morning'){const h=new Date().getHours();if(h<8||h>=22)return false;}if(quietUntil>Date.now())return false;return true;}
const NAMES={liba:'ליבה',manager:'המנהל',architect:'האדריכל',builder:'סוכן הבנייה'};
const KINDW={ask:'שאלה',stuck:'נתקע',done:'סיים'};
function speakerOf(d){if(d.speaker)return d.speaker;if(/^arch/i.test(d.id||''))return 'האדריכל';return NAMES[d.from||'liba']||d.from||'ליבה';}
function prefixOf(d,who){const t=(d.text||'').trim();if(t.startsWith(who)||t.startsWith('כאן '+who))return '';let p=who;if(d.topic)p+=', בנוגע ל'+d.topic;if(KINDW[d.kind])p+=', '+KINDW[d.kind];return p+': ';}
async function pump(){if(pumping||!armed)return;pumping=true;try{const n=inboxQ.filter(d=>ready(d)&&d.kind!=='cmd'&&!spokenLocal.has(d.id)).length;
  if(n>=2){const asks=inboxQ.filter(d=>ready(d)&&(d.kind==='ask'||d.kind==='stuck')).length;await incoming({id:'batch-'+Date.now(),local:true,from:'liba',speaker:'ליבה',kind:asks?'stuck':'say',noListen:true,text:'הצטברו '+n+' הודעות'+(asks?', '+asks+' מהן שאלות. אקרא אותן ברצף, צלצול אחד.':'. אקרא אותן ברצף.')});}
  for(;;){let i=inboxQ.findIndex(d=>ready(d)&&d.kind==='cmd');if(i<0)i=inboxQ.findIndex(ready);if(i<0)break;const d=inboxQ.splice(i,1)[0];if(spokenLocal.has(d.id))continue;if(d.kind==='cmd'){if(!appMode){spokenLocal.add(d.id);continue;}spokenLocal.add(d.id);await incoming(d);continue;}spokenLocal.add(d.id);try{await incoming(d);}catch(e){fail('P_MSG_BAD',e,'inbox');log('הודעה פגומה: '+(e&&e.message||e));}if(d.local)continue;try{await P.inboxDoc(d.id).update({spoken:true,spokenAt:Date.now()});}catch(e){fail('P_ACK',e,'inbox');log('ack: '+(e.code||e));}}}finally{pumping=false;if(inboxQ.length){clearTimeout(pumpTimer);pumpTimer=setTimeout(pump,60000);log(inboxQ.length+' הודעות מחכות (שקט/בוקר)');}}}
