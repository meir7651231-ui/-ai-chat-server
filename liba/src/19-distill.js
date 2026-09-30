// @anchor: distill
// distill: memory that learns without being told - the conversation log read once a night, one question a day
/* Step distill. The turns and decisions the page has written all along (chat/log/turns, decisions/log/items) are read
   back: fourteen days of them, live rows and the janitor's folds. A table of extractors turns repetition into a
   candidate - memory/candidates/items/<key> {kind, claim, evidence:[ids], n, conf, proposedFact, state}:
     habit  - the same sentence said to ליבה three times or more
     rule   - the same answer to the same question three times or more
     hours  - the hours Meir talks, across five days or more: when he is not there
     person - a name that comes back after "דיברתי עם / תתקשר ל…" three times, with no card yet
   Only Meir's own sentences to ליבה count (from:'user', to:'liba') - a sentence meant for the manager, or heard from
   someone in the room, is never evidence. At most one question a day (inbox/distill-<day>, priority morning, so it
   waits for the morning like any other); "כן" within three minutes keeps it as a fact with source inferred, "לא" puts
   it away for sixty days. A kept fact is forgotten like any other ("תשכח את…"). */
const DISTILL_DAYS=14,DISTILL_MIN=3,DISTILL_CONF=0.7,DISTILL_COOL=60*864e5,DISTILL_TURNS=3000;
const DISTILL_VERBS=new Set(['דיברתי','פגשתי','תתקשר','תתקשרי','תגיד','תגידי','תשלח','תשלחי','נפגשתי','שלחתי','התקשרתי','להתקשר','לדבר','תזכיר']);
const DISTILL_LINK=new Set(['עם','את','אצל','ל']);
function distillHabits(turns){const by={};for(const t of turns){const k=inorm(t.text);if(k.length<4||matchIntent(k))continue;(by[k]=by[k]||[]).push(t);}
  return Object.entries(by).filter(([,v])=>v.length>=DISTILL_MIN).map(([k,v])=>({kind:'habit',id:'habit.'+hash36(k),n:v.length,evidence:v.map(x=>x.id),
    claim:'אתה אומר לי הרבה "'+k.slice(0,60)+'"',forget:'אומר הרבה',proposedFact:{subject:'מאיר',predicate:'אומר הרבה',value:k.slice(0,120),kind:'fact',raw:'מאיר אומר הרבה: '+k.slice(0,120)}}));}
function distillRules(decs){const by={};for(const d of decs){const q=inorm(d.topic||d.question||''),a=inorm(d.answer||'');if(!q||!a)continue;const k=q+'|'+a;(by[k]=by[k]||{q,a,v:[]}).v.push(d);}
  return Object.values(by).filter(x=>x.v.length>=DISTILL_MIN).map(x=>({kind:'rule',id:'rule.'+hash36(x.q+'|'+x.a),n:x.v.length,evidence:x.v.map(d=>d.id),
    forget:x.q.slice(0,30),claim:'כשאני שואלת על '+x.q.slice(0,40)+' אתה תמיד עונה "'+x.a.slice(0,40)+'"',proposedFact:{subject:'מאיר',predicate:'העדפה',value:'על '+x.q.slice(0,60)+' התשובה היא '+x.a.slice(0,60),kind:'pref',raw:'על '+x.q.slice(0,60)+' התשובה היא '+x.a.slice(0,60)}}));}
function distillHours(turns){const days=new Set(turns.map(t=>trDay(+t.ts)));if(days.size<5||turns.length<10)return [];
  const hs=turns.map(t=>jHour(+t.ts)),last=Math.max(...hs),first=Math.min(...hs),out=[];
  if(last<22)out.push({kind:'hours',id:'hours.until',n:turns.length,evidence:turns.slice(-20).map(t=>t.id),forget:'זמין',claim:'אתה אף פעם לא מדבר איתי אחרי '+(last+1)+' בערב',
    proposedFact:{subject:'מאיר',predicate:'זמין עד',value:String(last+1),kind:'fact',raw:'מאיר בדרך כלל לא זמין אחרי '+(last+1)}});
  if(first>=7)out.push({kind:'hours',id:'hours.from',n:turns.length,evidence:turns.slice(0,20).map(t=>t.id),forget:'זמין',claim:'אתה אף פעם לא מדבר איתי לפני '+first+' בבוקר',
    proposedFact:{subject:'מאיר',predicate:'זמין מ',value:String(first),kind:'fact',raw:'מאיר בדרך כלל לא זמין לפני '+first}});
  return out;}
function distillNames(turns,known){const by={};
  for(const t of turns){const w=inorm(t.text).split(' ');for(let i=0;i<w.length-1;i++){if(!DISTILL_VERBS.has(w[i]))continue;let n=w[i+1];
      if(DISTILL_LINK.has(n))n=w[i+2]||'';else if(n.charAt(0)==='ל'&&n.length>3)n=n.slice(1);
      if(n.length<2||STOP.has(n)||known.has(memWords(n).join(' ')))continue;(by[n]=by[n]||new Set()).add(t.id);}}
  return Object.entries(by).filter(([,s])=>s.size>=DISTILL_MIN).map(([n,s])=>({kind:'person',id:'person.'+slug(n),n:s.size,evidence:[...s],
    forget:n,claim:'אתה מדבר הרבה עם '+n+', ואני עוד לא יודעת מי זה',proposedFact:{subject:n,predicate:'מוזכר',value:'מדבר איתו הרבה',kind:'fact',raw:n+' - מאיר מדבר איתו הרבה'},person:n}));}
/* the run: read, extract, write candidates (a decided one keeps its decision), then ask - once a day */
async function distill(now){now=now||Date.now();if(!db)return null;const t0=Date.now(),from=now-DISTILL_DAYS*864e5;
  let turns=[],decs=[];try{turns=(await turnsBetween(from,now+1,DISTILL_TURNS)).filter(t=>t.from==='user'&&t.to==='liba'&&t.text);}catch(e){fail('P_DB_READ',e,'distill turns');}
  try{decs=await logBetween('decisions',P.decisions(),from,now+1,1000);}catch(e){fail('P_DB_READ',e,'distill decisions');}
  let known=new Set();try{known=new Set((await PEOPLE.all()).flatMap(p=>PEOPLE.names(p)));}catch(e){}
  const found=[].concat(distillHabits(turns),distillRules(decs),distillHours(turns),distillNames(turns,known));
  let cur={};try{const r=await coldGet(P.cands(),null,500);r.docs.forEach(d=>{cur[d.id]=d.data()||{};});}catch(e){fail('P_DB_READ',e,'candidates');}
  for(const c of found){const ex=cur[c.id]||{};const conf=Math.min(0.95,0.5+0.1*c.n);
    const doc={kind:c.kind,claim:c.claim,forget:c.forget||'',evidence:c.evidence.slice(-20),n:c.n,conf:conf,proposedFact:c.proposedFact,state:ex.state||'open',updatedAt:now,firstAt:ex.firstAt||now};
    ['askedAt','askedDay','rejectedAt','acceptedAt','factKey'].forEach(k=>{if(ex[k]!=null)doc[k]=ex[k];});
    cur[c.id]=doc;try{await P.cand(c.id).set(doc);}catch(e){fail('P_DB_WRITE',e,'candidate');}}
  const asked=await distillAsk(now,cur);
  return {turns:turns.length,decisions:decs.length,found:found.length,asked:asked,ms:Date.now()-t0};}
/* a question still unanswered from the last three days means no new one - they never pile up */
async function distillAsk(now,cur){const day=trDay(now);if(Object.values(cur).some(c=>c.askedDay===day||(c.state==='open'&&c.askedAt&&now-c.askedAt<3*864e5)))return null;
  const id='distill-'+day;try{const g=await P.inboxDoc(id).get();if(g.exists)return null;}catch(e){return null;}
  const pick=Object.entries(cur).filter(([,c])=>c.n>=DISTILL_MIN&&c.conf>=DISTILL_CONF&&(c.state==='open'&&!c.askedAt||c.state==='rejected'&&now-(+c.rejectedAt||0)>DISTILL_COOL))
    .sort((a,b)=>b[1].conf-a[1].conf||b[1].n-a[1].n)[0];if(!pick)return null;
  const [k,c]=pick;try{await P.inboxDoc(id).set({from:'liba',speaker:'ליבה',kind:'ask',priority:'morning',topic:'משהו שלמדתי',text:'שמתי לב ש'+c.claim+'. לזכור את זה?',options:['כן','לא'],spoken:false,ts:now,candidate:k});
    await P.cand(k).update({askedAt:now,askedDay:day,state:'open'});}catch(e){fail('P_DB_WRITE',e,'distill ask');return null;}return k;}
/* the answer: a plain "כן"/"לא" within three minutes of the question, and nothing else, is taken here */
const DISTILL_YES=INTENTS.filter(i=>i.id==='confirm.yes').flatMap(i=>i.exact),DISTILL_NO=INTENTS.filter(i=>i.id==='confirm.no').flatMap(i=>i.exact);
function distillAnswer(text){if(!lastAsk||!/^distill-/.test(String(lastAsk.id))||Date.now()-lastAsk.at>3*60000)return false;const t=inorm(text);
  const yes=DISTILL_YES.indexOf(t)>=0,no=DISTILL_NO.indexOf(t)>=0;if(!yes&&!no)return false;const q=lastAsk;lastAsk=null;
  (async()=>{const g=await P.inboxDoc(q.id).get();const k=g.exists&&(g.data()||{}).candidate;if(!k)return;const c=(await P.cand(k).get()).data()||{};
    if(yes){const r=await MEM.put(Object.assign({conf:c.conf||DISTILL_CONF},c.proposedFact),{type:'inferred',candidate:k,evidence:(c.evidence||[]).length});
      await P.cand(k).update({state:'accepted',acceptedAt:Date.now(),factKey:r.key});if(c.kind==='person'&&c.person)PEOPLE.upsert(c.person,{}).catch(()=>{});
      sayLocal('זכרתי. אם זה לא נכון, תגיד תשכח את '+(c.forget||c.person||c.proposedFact.value).slice(0,30)+'.');}
    else{await P.cand(k).update({state:'rejected',rejectedAt:Date.now()});sayLocal('בסדר, לא אזכור את זה, ולא אשאל שוב חודשיים.');}})().catch(e=>{fail('P_DB_WRITE',e,'distill answer');sayLocal('לא הצלחתי לשמור.');});
  return true;}
/* "מה למדנו היום": run it now, and say what is open */
function distillToday(){(async()=>{const r=await distill();const all=(await coldGet(P.cands(),null,500)).docs.map(d=>d.data()||{});
  const open=all.filter(c=>c.state==='open').sort((a,b)=>b.conf-a.conf),acc=all.filter(c=>c.state==='accepted').length;
  sayLocal(open.length?'מצאתי '+open.length+(open.length===1?' דבר':' דברים')+' שחוזרים אצלך: '+open.slice(0,3).map(c=>c.claim).join('; ')+'.'+(acc?' '+acc+' כבר שמרתי.':'')+(r&&r.asked?' שאלה אחת תחכה לך בבוקר.':''):
    'עוד לא מצאתי משהו שחוזר מספיק פעמים כדי ללמוד ממנו.'+(acc?' '+acc+' דברים כבר שמרתי.':''));})().catch(e=>{fail('P_DB_READ',e,'distill');sayLocal('לא הצלחתי לעבור על היומן.');});return true;}
/* the nightly run: the first time the page is open after three in the morning, once a day */
function distillMaybe(){if(!db)return;const day=trDay(Date.now());let last='';try{last=localStorage.getItem(LSK('distillDay'))||'';}catch(e){}
  if(last===day||jHour(Date.now())<3)return;try{localStorage.setItem(LSK('distillDay'),day);}catch(e){}distill().catch(e=>fail('P_DB_WRITE',e,'distill'));memSweep().then(sweepSay).catch(e=>fail('P_DB_WRITE',e,'sweep'));conflictsWeekly().catch(()=>{});}
setTimeout(distillMaybe,25000);every('distill',3600e3,distillMaybe);
window.__distill={run:distill,answer:distillAnswer,habits:distillHabits,names:distillNames};
