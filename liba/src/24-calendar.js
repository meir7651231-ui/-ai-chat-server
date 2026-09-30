// @anchor: calendar
// calendar-sense: what is waiting for Meir, from his own calendar - read only, and only after he allowed it
/* Step calendar-sense. The phone reads the calendar (CalSense.kt) only after "תקראי את היומן שלי" and Android's own
   dialog; it sends the whole window (yesterday to a week ahead) as one snapshot - calSync - and this page makes
   sense/cal/items match it: new and moved meetings written, deleted ones deleted. sense/cal holds what is happening now
   (a meeting = two people or more, not declined), which context-fusion reads. "מה יש לי היום/מחר" and "מתי אני פנוי"
   answer from it; ten minutes before a meeting a briefing is said ("אני נזכרת: בעוד עשר דקות …" with what is known about
   the people in it) - it does not count in the three a day, it is what the calendar is for. Writing to the calendar
   (a meeting with a real person) waits for Meir's decision: until then ליבה says so and writes nothing. */
const CAL_BRIEF=10*60000,CAL_DAY_FROM=9,CAL_DAY_TO=18;let calItems=[];
const calTime=t=>new Date(t).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit',timeZone:'Asia/Jerusalem'});
const calDayOf=i=>i.allDay?new Date(+i.begin).toISOString().slice(0,10):trDay(+i.begin);
const calMeeting=i=>!i.allDay&&(+i.attendees||0)>=2&&+i.self!==2;
async function calIn(raw){let s;try{s=JSON.parse(String(raw||''));}catch(e){fail('P_MSG_BAD',e,'calSync');return null;}if(!s||!Array.isArray(s.items)||!db)return null;
  const items=s.items.filter(i=>i&&/^[0-9]+-[0-9]+$/.test(String(i.id))).slice(0,400).map(i=>({id:String(i.id),title:String(i.title||'').slice(0,200),begin:+i.begin,end:+i.end,allDay:!!i.allDay,
    where:String(i.where||'').slice(0,200),attendees:+i.attendees||0,self:+i.self||0}));
  const keep=new Set(items.map(i=>i.id));let wrote=0,gone=0;
  try{const cur=(await coldGet(P.calItems(),null,600)).docs;
    for(const d of cur){const x=d.data()||{};if(!keep.has(d.id)&&+x.begin>=+s.from&&+x.begin<+s.to){await P.calItem(d.id).delete();gone++;}}
    const have=new Map(cur.map(d=>[d.id,d.data()||{}]));
    for(const i of items){const h=have.get(i.id);if(h&&h.title===i.title&&+h.end===i.end&&h.where===i.where&&+h.self===i.self&&+h.attendees===i.attendees)continue;
      await P.calItem(i.id).set(Object.assign({meeting:calMeeting(i),at:Date.now()},i));wrote++;}}catch(e){fail('P_DB_WRITE',e,'calendar');}
  calItems=items;await calNow();proSchedule();return {wrote,gone};}
/* what is happening now - one document, rewritten */
async function calNow(now){now=now||Date.now();const on=calItems.filter(i=>calMeeting(i)&&i.begin<=now&&now<i.end)[0]||null;
  try{await P.calState().set({now:{meeting:!!on,title:on?on.title:'',until:on?on.end:0},at:now,n:calItems.length});}catch(e){fail('P_DB_WRITE',e,'sense/cal');}fuseContext(now).catch(()=>{});return on;}
async function calLoad(){if(calItems.length||!db)return calItems;try{calItems=(await coldGet(P.calItems(),null,600)).docs.map(d=>Object.assign({id:d.id},d.data()||{})).sort((a,b)=>a.begin-b.begin);}catch(e){}return calItems;}
function calLine(i){return (i.allDay?'כל היום: ':calTime(i.begin)+' ')+i.title+(i.where?' ב'+i.where:'')+(+i.self===2?' (דחית)':'');}
function calDay(offset){(async()=>{await calLoad();const day=trDay(Date.now()+offset*864e5);const list=calItems.filter(i=>calDayOf(i)===day).sort((a,b)=>(b.allDay-a.allDay)||(a.begin-b.begin));
  const bk=bookDayLine(offset); /* work-book: the day's obligations with the calendar */
  if(!calItems.length&&!(await calAllowed())){sayLocal('אני עוד לא קוראת את היומן. תגיד תקראי את היומן שלי.'+bk);return;}
  sayLocal((list.length?(offset?'מחר':'היום')+' יש לך '+(list.length===1?'דבר אחד':list.length+' דברים')+': '+list.map(calLine).join('; ')+'.':(offset?'מחר':'היום')+' היומן ריק.')+bk);})()
  .catch(e=>{fail('P_DB_READ',e,'calendar');sayLocal('לא הצלחתי לקרוא את היומן.');});return true;}
function calToday(){return calDay(0);}
function calTomorrow(){return calDay(1);}
async function calAllowed(){try{const g=await P.calState().get();return g.exists;}catch(e){return false;}}
/* free time: whole hours between nine and six, Meir's clock, the next five days */
function calFreeSlots(now,items,days){const busy=items.filter(i=>!i.allDay&&+i.self!==2);const out=[];let run=null;const start=Math.ceil(now/3600e3)*3600e3;
  for(let t=start;t<start+(days||5)*864e5;t+=3600e3){const h=jHour(t),ok=h>=CAL_DAY_FROM&&h<CAL_DAY_TO&&!busy.some(i=>i.begin<t+3600e3&&i.end>t);
    if(ok&&run&&run.to===t&&trDay(run.from)===trDay(t))run.to=t+3600e3;else if(ok){if(run)out.push(run);run={from:t,to:t+3600e3};}else if(run){out.push(run);run=null;}}
  if(run)out.push(run);return out;}
function calDayName(t){const d=trDay(t);if(d===trDay(Date.now()))return 'היום';if(d===trDay(Date.now()+864e5))return 'מחר';return 'ב'+new Date(t).toLocaleDateString('he-IL',{weekday:'long',timeZone:'Asia/Jerusalem'});}
function calFree(){(async()=>{await calLoad();if(!calItems.length&&!(await calAllowed())){sayLocal('אני עוד לא קוראת את היומן. תגיד תקראי את היומן שלי.');return;}
  const s=calFreeSlots(Date.now(),calItems,5).slice(0,3);sayLocal(s.length?'אתה פנוי '+s.map(r=>calDayName(r.from)+' מ-'+calTime(r.from)+' עד '+calTime(r.to)).join(', ')+'.':'בחמשת הימים הקרובים אין שעה פנויה שלמה בין תשע לשש.');})()
  .catch(e=>{fail('P_DB_READ',e,'calendar');sayLocal('לא הצלחתי לקרוא את היומן.');});return true;}
function calOn(){if(appMode)post(PROTO.toApp.cmd,{cmd:'cal_on'});sayLocal('בסדר. הטלפון ישאל אותך אם לאפשר לי לקרוא את היומן. אני רק קוראת, לא כותבת ולא מזיזה כלום.');return true;}
function calOff(){if(appMode)post(PROTO.toApp.cmd,{cmd:'cal_off'});(async()=>{for(const d of (await coldGet(P.calItems(),null,600)).docs)await P.calItem(d.id).delete();await P.calState().delete();calItems=[];})().catch(e=>fail('P_DB_WRITE',e,'cal off'));
  sayLocal('הפסקתי לקרוא את היומן, ומחקתי את מה שהעתקתי ממנו.');return true;}
function calWrite(){sayLocal('לקבוע או להזיז פגישות ביומן עוד לא אישרת לי - זו החלטה שלך, כי זה נוגע באנשים אחרים. בינתיים אני רק קוראת.');return true;}
/* the briefings: ten minutes before each meeting, with what is known about the people in it */
async function calBriefings(now){now=now||Date.now();await calLoad();const out=[];
  for(const i of calItems.filter(x=>!x.allDay&&+x.self!==2&&x.begin>now&&x.begin<now+8*864e5).slice(0,20)){let more='';
    try{const ps=await PEOPLE.resolve(i.title);if(ps[0]){const f=(await MEM.query(ps[0].name)).filter(x=>x.subject!==ps[0].name||x.predicate!=='הוא').slice(0,1);
      more=' '+ps[0].name+(ps[0].relation?' הוא '+ps[0].relation:'')+(f[0]?'; '+String(f[0].raw||f[0].value):'')+'.';}}catch(e){}
    out.push({id:'pro-cal.'+hash36(i.id),at:i.begin-CAL_BRIEF,until:i.begin,cap:false,text:'אני נזכרת: בעוד עשר דקות '+i.title+(i.where?' ב'+i.where:'')+'.'+more});}
  return out;}
every('calendar',60000,()=>{if(db&&calItems.length)calNow().catch(()=>{});});
window.__cal={in:calIn,free:calFreeSlots,briefings:calBriefings,now:calNow,items:()=>calItems};
