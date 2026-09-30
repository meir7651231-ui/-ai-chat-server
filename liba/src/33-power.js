// @anchor: power
// power-ledger: what ליבה cost today, by subsystem, in words - from the phone's own ledger
/* Step power-ledger. The bubble charges each subsystem by how long it ran times its rate (PowerLedger.kt) and sends the
   day every five minutes; the page keeps it in channel/power, closes each day into memory/power/days, and says it:
   "כמה סוללה אכלת היום" ("היום אכלתי אחוז וחצי, רובו על ההאזנה"), "על מה הלכה הסוללה", "תקציב סוללה עשרה אחוז"
   (memory/settings.power.dailyPct - the duty governor will hold to it). The phone's own drain is said beside it, never
   mixed in: the ledger is what ליבה ran, the phone is everything. */
const POWER_HE={'base':'הבסיס','mic.vad':'ההאזנה','asr.cloud':'זיהוי הדיבור','asr.ondevice':'זיהוי הדיבור בטלפון','tts':'הדיבור','ui.shader':'הבועה על המסך','ui.shader.idle':'הבועה במנוחה',
  'web.load':'טעינת הדף','web.idle':'הדף הפתוח','net.update':'העדכונים'};
let powerNow=null,powerWrote=0;
function pctWords(x){x=Math.round((+x||0)*2)/2;const w=Math.floor(x),h=x-w>0;
  if(x<0.5)return 'פחות מחצי אחוז';if(w===0)return 'חצי אחוז';if(w===1)return h?'אחוז וחצי':'אחוז אחד';if(w===2)return h?'שניים וחצי אחוזים':'שני אחוזים';return w+(h?' וחצי':'')+' אחוזים';}
function powerIn(body){let r;try{r=typeof body==='string'?JSON.parse(body):body;}catch(e){fail('P_MSG_BAD',e,'power');return;}if(!r||!r.day)return;
  const prev=powerNow;powerNow=Object.assign({},r,{at:Date.now()});
  /* duty-governor: the gear changed - it is in the day's record, and the phone already said it */
  if(prev&&r.tier&&prev.tier&&prev.tier!==r.tier)Ledger.record({action:'power.tier',cause:prev.tier,result:r.tier});if(!db)return;
  if(prev&&prev.day&&prev.day!==r.day)P.powerDay(prev.day).set(Object.assign({},prev,{closedAt:Date.now()})).catch(e=>fail('P_DB_WRITE',e,'memory/power/days'));
  if(Date.now()-powerWrote>60000||!prev||prev.day!==r.day){powerWrote=Date.now();P.power().set(powerNow).catch(e=>fail('P_DB_WRITE',e,'channel/power'));}}
function powerCfgSend(){if(appMode&&hasCap('power'))post(PROTO.toApp.powerCfg,{body:JSON.stringify({dailyPct:powerBudgetPct()})});}
function powerBudgetPct(){const s=memSettings&&memSettings.power;return s&&+s.dailyPct>0?+s.dailyPct:0;}
function powerToday(){const r=powerNow;if(!r){sayLocal('עוד אין לי מדידה מהטלפון. היא מגיעה כל חמש דקות כשהבועה פתוחה.');return true;}
  const by=Object.entries(r.byTag||{}).sort((a,b)=>b[1]-a[1]),top=by[0],share=top&&r.mah>0?top[1]/r.mah:0;
  let t='היום אכלתי '+pctWords(r.pct)+(top?(share>0.5?', רובו על ':', הכי הרבה על ')+(POWER_HE[top[0]]||top[0]):'')+'.';
  if(r.proj!=null)t+=' בקצב של השעה האחרונה זה '+pctWords(r.proj)+' ליממה'+(powerBudgetPct()&&r.proj>powerBudgetPct()?', מעל התקציב שלך':'')+'.';
  if(r.tier&&r.tier!=='FULL')t+=' אני עכשיו ב'+({ECO:'הילוך חסכוני',SURVIVAL:'הילוך הישרדות',COLD:'הילוך קר'}[r.tier]||r.tier)+'.';
  if(r.phonePct!=null&&r.phonePct>0)t+=' הטלפון כולו ירד היום '+pctWords(r.phonePct)+'.';
  sayLocal(t);return true;}
function powerWhere(){const r=powerNow;if(!r){sayLocal('עוד אין לי מדידה מהטלפון.');return true;}
  const by=Object.entries(r.byTag||{}).sort((a,b)=>b[1]-a[1]).filter(([,v])=>r.mah>0&&v/r.mah>=0.05).slice(0,4);
  sayLocal(by.length?'הסוללה הלכה על '+by.map(([k,v])=>(POWER_HE[k]||k)+' '+Math.round(v/r.mah*100)+' אחוז').join(', ')+'.':'כמעט כלום עוד לא נמדד היום.');return true;}
const POWER_NUM={'אחד':1,'אחת':1,'שניים':2,'שתיים':2,'שני':2,'שלושה':3,'שלוש':3,'ארבעה':4,'ארבע':4,'חמישה':5,'חמש':5,'שישה':6,'שש':6,'שבעה':7,'שבע':7,'שמונה':8,'תשעה':9,'תשע':9,'עשרה':10,'עשר':10,'חמישה עשר':15,'עשרים':20};
function powerBudget(rest){const t=inorm(rest).split('אחוז')[0].trim();const n=/^\d+$/.test(t)?+t:POWER_NUM[t];if(!(n>0&&n<=50))return false;
  memSettings.power=Object.assign({},memSettings.power||{},{dailyPct:n});
  if(db)P.settings().set(memSettings).catch(e=>fail('P_DB_WRITE',e,'memory/settings'));
  powerCfgSend();Ledger.record({action:'power.budget',cause:'voice',result:n});sayLocal('בסדר: תקציב של '+pctWords(n)+' ביממה. כשאעבור אותו אוריד הילוך ואגיד לך.');return true;}
window.__power={in:powerIn,words:pctWords,now:()=>powerNow};
