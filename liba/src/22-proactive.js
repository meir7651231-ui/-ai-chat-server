// @anchor: proactive
// proactive: memory that speaks first - at the right moment, at most three times a day, and never when it should not
/* Step proactive. Until now ליבה spoke only when a document came in; the memory never started anything. A trigger is a
   reason to say a fact now:
     date   - a fact with a date in it ("הפגישה עם הבנק ב-3 בנובמבר"): at nine the morning before
     person - Meir mentions someone, and there is a recent event or note about them he has not heard back
     return - "נחזור לזה אחרי הפגישה": the next time "הפגישה" comes up, what "זה" was
   Every one is said as "אני נזכרת: …". The limits are hard: three a day (the phone's alarms count too), nothing at night
   (before eight, from ten), quiet and the policy rules hold them like any message, and "תפסיק להזכיר" is a rule at once.
   The first week nothing is said: what would have been said goes to the evening digest, so Meir sees what it would be
   like before it interrupts him. "לא עכשיו" / "לא מעניין" right after one counts against that kind of trigger; three
   against and fewer for, and that kind rests for thirty days. Date triggers belong to the phone when it has 'remind' -
   an alarm fires them even when this page is dead or the phone just restarted (Reminders.kt) - so they are sent there
   and not fired here twice. */
const PRO_MAX=3,PRO_FIRST=7*864e5,PRO_NEG=3,PRO_REST=30*864e5,PRO_REPLY=2*60000,PRO_PERSON_DAYS=30,PRO_AHEAD=14*864e5;
let proState=null,lastPro=null,proReturns=[];
async function proLoad(){if(proState)return proState;let x={};try{const g=await P.proactive().get();x=g.exists?(g.data()||{}):{};}catch(e){fail('P_DB_READ',e,'proactive');}
  proState=Object.assign({day:'',count:0,fired:{},neg:{},pos:{},negAt:{},returns:[]},x);if(!proState.startedAt){proState.startedAt=Date.now();proSave();}proReturns=proState.returns||[];return proState;}
function proSave(){if(!proState||!db)return;proState.returns=proReturns.slice(-20);P.proactive().set(proState).catch(e=>fail('P_DB_WRITE',e,'proactive'));}
function proDay(now){const d=trDay(now);if(proState.day!==d){proState.day=d;proState.count=0;}}
/* a kind rests after three "not now"s that outnumber the times it was welcome */
function proResting(kind,now){const n=+proState.neg[kind]||0,p=+proState.pos[kind]||0;return n>=PRO_NEG&&n>p&&now-(+proState.negAt[kind]||0)<PRO_REST;}
/* the date triggers: facts that say a date, due at nine the morning before, until the day itself is over */
function proDates(facts,now){const out=[];for(const f of facts){if(!memLive(f,now)||!(+f.expiresAt>0))continue;const dayEnd=+f.expiresAt-864e5;
    const d=new Date(dayEnd);d.setHours(0,0,0,0);const at=d.getTime()-864e5+9*3600e3;if(dayEnd<now||at>now+PRO_AHEAD)continue;
    const raw=String(f.raw||f.value||'');out.push({id:'date.'+hash36(f.key),kind:'date',at:at,until:dayEnd,text:(raw.charAt(0)==='ש'?raw.slice(1):raw)});}
  return out.sort((a,b)=>a.at-b.at);}
/* say it, or hold it: the budget, the night, the first week, the resting kinds */
async function proFire(t,now){now=now||Date.now();await proLoad();proDay(now);
  if(proState.fired[t.id]||spokenDone('pro-'+t.id))return 'done';
  if(proResting(t.kind,now))return 'resting';
  const h=window.__testHour!=null?window.__testHour:jHour(now);if(h<8||h>=22)return 'night'; /* tests pin the hour */
  if(proState.count>=PRO_MAX)return 'budget';
  proState.fired[t.id]=now;
  if(now-(+proState.startedAt||now)<PRO_FIRST){await digestAdd({id:'pro-'+t.id,text:'אני נזכרת: '+t.text,topic:'תזכורת',speaker:'ליבה'},{id:'proactive-first-week',text:'בשבוע הראשון תזכורות נאספות לערב'});proSave();return 'digest';}
  proState.count++;proSave();lastPro={id:t.id,kind:t.kind,at:now};
  queueLocal({id:'pro-'+t.id,kind:'say',proactive:true,speaker:'ליבה',topic:'תזכורת',text:'אני נזכרת: '+t.text});return 'said';}
/* the phone owns the dates when it can; otherwise this page fires them itself */
async function proTick(now){now=now||Date.now();if(!db)return [];let facts=[];try{facts=await MEM.all();}catch(e){return [];}const out=[];
  if(!(appMode&&hasCap('remind'))){for(const t of proDates(facts,now))if(t.at<=now&&now<=t.until)out.push([t.id,await proFire(t,now)]);
    /* calendar briefings: outside the budget and the night, but held by "תפסיק להזכיר" and by quiet like any line */
    await proLoad();for(const b of await calBriefings(now))if(b.at<=now&&now<=b.until&&!proState.fired[b.id.slice(4)]){proState.fired[b.id.slice(4)]=now;proSave();queueLocal({id:b.id,kind:'say',proactive:true,speaker:'ליבה',topic:'יומן',text:b.text});out.push([b.id,'said']);}}
  return out;}
function proSchedule(){if(!appMode||!hasCap('remind')||!db)return;(async()=>{await proLoad();const now=Date.now();
  const items=proDates(await MEM.all(),now).filter(t=>!proState.fired[t.id]&&!proResting('date',now)).slice(0,20).map(t=>({id:'pro-'+t.id,at:t.at,until:t.until,text:'אני נזכרת: '+t.text}))
    .concat(POLICY.rules.some(r=>r.type==='no_proactive')?[]:(await calBriefings(now)).filter(b=>!proState.fired[b.id.slice(4)]));
  post(PROTO.toApp.remind,{items:JSON.stringify(items)});})().catch(e=>fail('P_DB_READ',e,'remind'));}
/* what the phone said by itself counts: the budget is one budget */
function proFromPhone(id,now){if(!/^pro-/.test(id))return;proLoad().then(()=>{now=now||Date.now();proDay(now);const k=id.slice(4);if(!proState.fired[k]){proState.fired[k]=now;proState.count++;proSave();}}).catch(()=>{});}
/* a sentence of Meir's: a person he mentions, a word he said he would come back after */
async function proHeard(text,now){now=now||Date.now();if(!db)return [];await proLoad();const out=[],t=inorm(text);
  for(const r of proReturns.slice()){if(r.done||now-r.at>7*864e5)continue;if(memWords(t).some(w=>memWords(r.after).indexOf(w)>=0)){r.done=now;
    out.push([r.id,await proFire({id:r.id,kind:'return',text:'אמרת שנחזור אחרי '+r.after+' לזה: '+r.about},now)]);}}
  let ps=[];try{ps=await PEOPLE.resolve(text);}catch(e){}
  for(const p of ps.slice(0,2)){const fs=(await MEM.query(p.name).catch(()=>[])).filter(f=>(f.kind==='event'||f.kind==='note')&&now-(+f.updatedAt||0)<PRO_PERSON_DAYS*864e5&&!(t.indexOf(inorm(f.value||''))>=0))
      .sort((a,b)=>(+b.updatedAt||0)-(+a.updatedAt||0));
    if(fs[0])out.push(['person.'+hash36(fs[0].key),await proFire({id:'person.'+hash36(fs[0].key),kind:'person',text:String(fs[0].raw||fs[0].value)},now)]);}
  return out;}
/* the answers */
function proReturn(rest){const after=rest.trim();if(!after)return false;proLoad().then(()=>{const about=(lastAsk&&lastAsk.text)||(cur&&cur.text)||(lastSent&&lastSent.text)||'מה שדיברנו עליו';
  proReturns.push({id:'return.'+hash36(after+'|'+Date.now()),after:after,about:String(about).slice(0,120),at:Date.now()});proSave();sayLocal('בסדר. כשתזכיר את '+after+', אזכיר לך.');});return true;}
function proNot(){if(!lastPro||Date.now()-lastPro.at>PRO_REPLY)return false;const k=lastPro.kind;lastPro=null;proLoad().then(()=>{proState.neg[k]=(+proState.neg[k]||0)+1;proState.negAt[k]=Date.now();proSave();
  sayLocal(proResting(k,Date.now())?'הבנתי. תזכורות מהסוג הזה נחות חודש.':'בסדר.');});return true;}
function proWelcome(){if(!lastPro||Date.now()-lastPro.at>PRO_REPLY)return;const k=lastPro.kind;lastPro=null;proLoad().then(()=>{proState.pos[k]=(+proState.pos[k]||0)+1;proSave();});}
setInterval(()=>{if(db)proTick().catch(e=>fail('P_DB_READ',e,'proactive'));},60000);
window.__pro={tick:proTick,fire:proFire,heard:proHeard,dates:proDates,schedule:proSchedule,state:()=>proState,reset:()=>{proState=null;lastPro=null;proReturns=[];}};
