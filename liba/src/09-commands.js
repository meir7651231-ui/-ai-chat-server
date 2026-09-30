// @anchor: commands
// voice commands: quiet, memory, gallery, help, tasks
// 12: switch who holds the channel, by voice, without leaving the page
/* intent-kernel: every handler below is reached through the registry (liba/intents/registry.json). It gets the rest of
   the sentence after the command's prefix (a slot), and returns false only to let the sentence go on to Claude. */
function quietOff(){setQuiet(0);return true;}
/* the duration slot: "שעה" by default */
function slotMinutes(t){const n=t.match(/(\d+)\s*(דקות|דקה)/);if(n)return +n[1];if(/חצי שעה/.test(t))return 30;if(/שעתיים/.test(t))return 120;if(/שלוש שעות/.test(t))return 180;
  if(/עד הערב/.test(t))return Math.max(1,Math.round((new Date().setHours(19,0,0,0)-Date.now())/60000));if(/עד מחר|עד הבוקר/.test(t))return Math.max(1,Math.round((new Date().setHours(32,0,0,0)-Date.now())/60000));return 60;}
function quietOn(rest){setQuiet(slotMinutes(rest));return true;}
async function setQuiet(min){Ledger.record({action:'quiet',cause:'voice',inputs:{min}});const until=min>0?Date.now()+min*60000:0;quietUntil=until;try{await P.quiet().set({until,since:Date.now()});}catch(e){fail('P_DB_WRITE',e,'channel/quiet');}
  const msg=min>0?'ליבה: שקט עד '+new Date(until).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'})+'. רק דחוף יעבור.':'ליבה: השקט בוטל, אני מדברת שוב.';bubble('li',msg);if(appMode)post(PROTO.toApp.say,{text:msg,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(msg);if(!min)pump();}
let memSettings={logTurns:true,decisions:true,notes:true};
function sayLocal(m){bubble('li',m);if(appMode)post(PROTO.toApp.say,{text:'ליבה: '+m,kind:'say',options:[],from:'liba',speaker:'ליבה',sens:classify(m).sens});else say(m);}
/* steps 88, 90: gallery of built things + the generator screen */
let galleryList=[];
/* step 98: what ליבה knows – one list, by voice or by reading. intent-kernel: generated from the registry (INTENT_HELP);
   the literal list below is gone, so the help can only name commands that have a handler. */
const HELP=INTENT_HELP;
const HE_NUM=['אפס','אחת','שתיים','שלוש','ארבע','חמש','שש','שבע','שמונה','תשע','עשר','אחת עשרה','שתים עשרה','שלוש עשרה'];
function helpAll(){const el=$('help');el.hidden=false;el.innerHTML='<div class="t"><b>מה ליבה יודעת</b></div>'+HELP.map(h=>`<div class="t"><i></i><b>${esc(h[0])}</b><small style="white-space:normal;text-align:right">${esc(h[1])}</small></div>`).join('');
  sayLocal('אני יודעת '+(HE_NUM[HELP.length]||HELP.length)+' משפחות של פקודות: '+HELP.map(h=>h[0]).join(', ')+'. תגיד למשל "פקודות משימות" ואקריא אותן. הרשימה גם על המסך.');return true;}
function helpFamily(rest){const h=HELP.find(x=>rest.includes(x[0]));if(!h)return false;sayLocal(h[0]+': '+h[1].replace(/"/g,''));return true;}
function galleryWeek(){{const wk=Date.now()-7*24*3600*1000;const g=galleryList.filter(x=>(x.ts||0)>wk);if(!g.length){sayLocal('השבוע עוד לא נבנה משהו שנרשם בגלריה.');return true;}lastTasks=g.map(x=>({id:x.id,title:x.title,link:x.link,status:'done'})).concat(lastTasks);sayLocal('השבוע נבנו '+g.length+': '+g.map(x=>x.title).join(', ')+'. תגיד תפתח ואפתח את האחרון.');return true;}}
function generatorOpen(){{const u='https://claude.ai/artifact/AcTS4zzdMcXFcxFFvr5UVn';sayLocal('פותחת את המחולל.');if(appMode)post(PROTO.toApp.cmd,{cmd:'open '+u});else openSafe(u);return true;}}
/* mem-core: the memory commands, on the fact store (16-memory.js) */
function memRemember(rest){const note=rest.trim();if(note.length<2)return false;
  const pf=MEM.parse(note);peopleFromFact(pf);
  MEM.put(pf,{type:'said'}).then(r=>sayLocal(r.same?'כבר זכרתי: '+note:r.replaced?'עדכנתי: '+note:'זכרתי: '+note)).catch(e=>{fail('P_DB_WRITE',e,'memory/facts');sayLocal('לא הצלחתי לשמור');});return true;}
function memForget(rest){const q=rest.trim();if(!q)return false;
  MEM.forget(q).then(h=>sayLocal(h.length?'שכחתי '+h.length+(h.length===1?' דבר':' דברים')+' על '+q+'. אם טעיתי, תגיד תחזיר את מה ששכחת - עד מחר.':'לא מצאתי משהו על '+q+' בזיכרון')).catch(e=>{fail('P_DB_WRITE',e,'memory/facts');sayLocal('לא הצלחתי');});return true;}
function memPref(rest,m){if(!rest&&!POLICY.compileOne({value:m.t}))return false;const f=MEM.parse(m.t);if(f.kind!=='pref')Object.assign(f,{subject:'מאיר',predicate:'העדפה',kind:'pref',conf:0.9});
  MEM.put(f,{type:'said'}).then(()=>POLICY.load()).then(()=>{const r=POLICY.compileOne({value:m.t});sayLocal('הבנתי, זו העדפה קבועה: '+m.t+(r?'. מעכשיו זה כלל, ומה שאשתיק יחכה לסיכום הערב.':''));}).catch(e=>fail('P_DB_WRITE',e,'memory/facts'));return true;}
function memList(){MEM.recent(8).then(n=>sayLocal(n.length?'אני זוכרת '+n.length+(n.length>=8?' דברים אחרונים':' דברים')+': '+n.map(f=>f.raw||f.value).join('; '):'הזיכרון עוד ריק.')).catch(e=>fail('P_DB_READ',e,'memory/facts'));return true;}
function memNoLog(){{memSettings.logTurns=false;P.settings().set(memSettings).catch(e=>fail('P_DB_WRITE',e,'memory/settings'));sayLocal('בסדר, מעכשיו לא שומרת את השיחות.');return true;}}
function memLog(){{memSettings.logTurns=true;P.settings().set(memSettings).catch(e=>fail('P_DB_WRITE',e,'memory/settings'));sayLocal('שומרת שיחות שוב.');return true;}}
function memPrivacy(){{sayLocal('מה נשמר: שיחות '+(memSettings.logTurns?'כן':'לא')+', החלטות '+(memSettings.decisions?'כן':'לא')+', הערות זיכרון '+(memSettings.notes?'כן':'לא')+'. הכל בענן הפרטי של הארטיפקט, לא ברפו הציבורי. תגיד אל תשמור שיחות כדי לעצור.');return true;}}
/* req-spine: the question this step exists for. Unbound replies are named, not hidden in the denominator. */
function reqToday(){
  const from=new Date();from.setHours(0,0,0,0);
  coldGet(P.reqs(),[['askedAt','>=',from.getTime()]],1000).then(r=>{const today=r.docs.map(d=>d.data()||{}).filter(x=>(x.askedAt||0)>=from.getTime());
    if(!today.length){sayLocal('היום עוד לא ביקשת כלום.');return;}
    const ans=today.filter(x=>x.firstReplyAt),waits=ans.map(x=>x.firstReplyAt-x.askedAt).sort((a,b)=>a-b);
    const med=waits.length?Math.round(waits[Math.floor(waits.length/2)]/60000):0;
    sayLocal('היום ביקשת '+today.length+'. '+(ans.length?ans.length+' קיבלו תשובה'+(med?', בחציון אחרי '+med+' דקות':', תוך פחות מדקה')+'. ':'')+(today.length-ans.length?(today.length-ans.length)+' עוד בלי תשובה שמחוברת אליהן.':'כולן נענו.'));
  }).catch(e=>{fail('P_DB_READ',e,'req');sayLocal('לא הצלחתי לקרוא את הבקשות.');});
  return true;}
/* step clock: four measured segments, median and 90th percentile. Requests whose clock was off are left out. */
/* creation-time stamps live in t; the later moments are top-level fields so plain merges never lose them */
const SEGS=[['asr','עד שסיימתי לשמוע','voice','heard'],['send','עד שזה הגיע לקלוד','heard','sentAt'],['think','עד התשובה','sentAt','firstReplyAt'],['speak','עד שסיימתי להגיד','firstReplyAt','spokeEndAt']];
const tv=(x,k)=>(x.t&&x.t[k])||x[k]||0;
function pct(a,q){if(!a.length)return null;const s=a.slice().sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.floor(q*s.length))];}
function heDur(ms){if(ms==null)return 'אין עדיין';const s=Math.round(ms/1000);if(s<60)return s+' שניות';const m=Math.round(s/60);return m===1?'דקה':m+' דקות';}
function latencyToday(){
  const day=trDay(Date.now());const from=new Date();from.setHours(0,0,0,0);
  coldGet(P.reqs(),[['askedAt','>=',from.getTime()]],1000).then(r=>{const all=r.docs.map(d=>d.data()||{}).filter(x=>(x.askedAt||0)>=from.getTime()&&x.t);const ok=all.filter(x=>!x.t.skewBad);
    const out={day:day,n:ok.length,dropped:all.length-ok.length,at:Date.now()};
    SEGS.forEach(([k,,a,b])=>{const v=ok.map(x=>(tv(x,b)&&tv(x,a))?tv(x,b)-tv(x,a):null).filter(v=>v!=null&&v>=0);out[k]={n:v.length,p50:pct(v,.5),p90:pct(v,.9)};});
    const sp=ok.filter(x=>x.spokeCause);out.guard={n:sp.filter(x=>x.spokeCause==='guard').length,of:sp.length};
    P.metricsDay(day).set({latency:out}).catch(e=>fail('P_DB_WRITE',e,'metrics'));
    if(!ok.length){sayLocal('היום עוד אין בקשות שמדדתי.');return;}
    const parts=SEGS.filter(([k])=>out[k].n).map(([k,he])=>he+' '+heDur(out[k].p50));
    const slow=SEGS.filter(([k])=>out[k].n).sort((x,y)=>out[y[0]].p50-out[x[0]].p50)[0];
    sayLocal('בחציון, על '+ok.length+' בקשות היום: '+parts.join(', ')+'.'+(slow?' הכי איטי: '+slow[1]+'.':'')+(out.dropped?' '+out.dropped+' לא נספרו כי השעון לא היה מדויק.':''));
  }).catch(e=>{fail('P_DB_READ',e,'req');sayLocal('לא הצלחתי לקרוא את המדידות.');});
  return true;}
/* step fixed-cardinality-telemetry: the phone's own state, from pulse/<dev> */
function lineStatus(){lineCmd();return true;}
function phoneWhy(){whyCmd();return true;}
/* outbox-keys: what did not go out, and send it again now */
function outboxList(){{const w=outbox.map(x=>String(x.text).replace(/ ⟦#[0-9a-z]+⟧$/,''));
    sayLocal(w.length?(w.length===1?'משפט אחד לא נשלח: ':'יש '+w.length+' משפטים שלא נשלחו: ')+w.slice(0,3).join('; ')+(w.length>3?' ועוד':'')+'.':'הכול נשלח, אין משפט שמחכה.');return true;}}
function outboxResend(){{const n=outbox.length;outbox.forEach(x=>{x.phase='queued';x.leaseUntil=0;});saveOutbox();
    sayLocal(n?'שולחת שוב '+(n===1?'משפט אחד':n+' משפטים')+'.':'אין מה לשלוח שוב.');if(n)setTimeout(flushOutbox,300);return true;}}
function mapShow(){{mapOn=true;renderMap();const m=mapSummary()+fleetLine();bubble('li',m);if(appMode)post(PROTO.toApp.say,{text:'ליבה, מפת המערכת: '+m,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(m);return true;}}
function openLast(){{const d=lastTasks.find(x=>x.status==='done'&&x.link)||lastTasks.find(x=>x.link);if(!d)return false;const m='פותחת: '+d.title;bubble('li',m);if(appMode){post(PROTO.toApp.cmd,{cmd:'open '+d.link});post(PROTO.toApp.say,{text:m,kind:'say',options:[],from:'liba',speaker:'ליבה'});}else{say(m);openSafe(d.link);}return true;}}
function taskPriority(rest){{const q=rest.trim();if(!q)return false;const task=lastTasks.find(x=>(x.title||'').includes(q));if(!task)return false;P.task(task.id).update({priority:Date.now(),updatedAt:Date.now()}).catch(e=>fail('P_DB_WRITE',e,'tasks'));const m='בסדר, '+task.title+' קודם.';bubble('li',m);if(appMode)post(PROTO.toApp.say,{text:m,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(m);return true;}}
