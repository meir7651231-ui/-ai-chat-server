// @anchor: commands
// voice commands: quiet, memory, gallery, help, tasks
// 12: switch who holds the channel, by voice, without leaving the page
function quietCmd(text){const t=text.replace(/[?!.,]/g,'').trim();
  if(/^(בטל|סיים|תפסיק)( את)? (השקט|שקט)$|^תפריע$|^אפשר להפריע$|^שקט נגמר$/.test(t)){setQuiet(0);return true;}
  if(/^אל תפריע|^שקט(?=\s|$)|^תהיה בשקט|^בלי הפרעות/.test(t)){let m=60;const n=t.match(/(\d+)\s*(דקות|דקה)/);if(n)m=+n[1];else if(/חצי שעה/.test(t))m=30;else if(/שעתיים/.test(t))m=120;else if(/שלוש שעות/.test(t))m=180;else if(/עד הערב/.test(t))m=Math.max(1,Math.round((new Date().setHours(19,0,0,0)-Date.now())/60000));else if(/עד מחר|עד הבוקר/.test(t))m=Math.max(1,Math.round((new Date().setHours(32,0,0,0)-Date.now())/60000));setQuiet(m);return true;}
  return false;}
async function setQuiet(min){const until=min>0?Date.now()+min*60000:0;quietUntil=until;try{await P.quiet().set({until,since:Date.now()});}catch(e){fail('P_DB_WRITE',e,'channel/quiet');}
  const msg=min>0?'ליבה: שקט עד '+new Date(until).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'})+'. רק דחוף יעבור.':'ליבה: השקט בוטל, אני מדברת שוב.';bubble('li',msg);if(appMode)post(PROTO.toApp.say,{text:msg,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(msg);if(!min)pump();}
let memSettings={logTurns:true,decisions:true,notes:true};
function sayLocal(m){bubble('li',m);if(appMode)post(PROTO.toApp.say,{text:'ליבה: '+m,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(m);}
/* steps 88, 90: gallery of built things + the generator screen */
let galleryList=[];
/* step 98: what ליבה knows – one list, by voice or by reading */
const HELP=[['דיבור','לחיצה על הבועה, "ליבה" (מילת הפעלה), כפתור אוזניה במצב רכב, אריח "ליבה – דבר" במסך הנעילה'],['משימות','"מה הסטטוס", "קודם את X", "תעצור את X", "תמשיך את X", "תפתח" (תוצאה אחרונה), "מפה" (כל הסשנים), "מה בניתי השבוע"'],['בנייה','"תבנה לי X", "תבדוק X", "תתקן X" – נפתח עובד; "תעלה לאוויר"; "תחזור לגרסה של הבוקר"; "המחולל"'],['אנשים','"תעלה את המנהל", "ליבה תחזור", "מה המנהל עושה עכשיו"'],['שקט','"אל תפריע שעה / עד הערב", "תפריע", "מצב לילה", "בטל מצב לילה", "שקט" (כיבוי מילת הפעלה)'],['קול','"לאט יותר", "מהר יותר", "חזור", "דלג", "רגע", "תמשיך", "בלי צלילים", "תני להפריע"'],['זיכרון','"תזכור ש…", "תשכח את…", "מה אתה זוכר", "אל תשאל אותי על…", "מה נשמר", "אל תשמור שיחות", "תייצא את הזיכרון"'],['חושים','"מה חשוב במייל", "תענה ש…", "תזכיר לי מחר בתשע…", "תחפש…", שיתוף מכל אפליקציה → ליבה'],['בקרה','"מה למדנו היום", "כמה עלה היום", "מה אישרתי היום", סיכום בוקר ב-08:00, סיכום ערב ב-19:00, "מה נשבר היום"']];
function helpCmd(text){const t=text.replace(/[?!.,]/g,'').trim();
  if(/^(מה את יודעת|מה אתה יודע|מה ליבה יודעת|עזרה|מה אפשר להגיד|פקודות)$/.test(t)){const el=$('help');el.hidden=false;el.innerHTML='<div class="t"><b>מה ליבה יודעת</b></div>'+HELP.map(h=>`<div class="t"><i></i><b>${esc(h[0])}</b><small style="white-space:normal;text-align:right">${esc(h[1])}</small></div>`).join('');sayLocal('אני יודעת תשע משפחות של פקודות: '+HELP.map(h=>h[0]).join(', ')+'. תגיד למשל "פקודות משימות" ואקריא אותן. הרשימה גם על המסך.');return true;}
  const m=t.match(/^פקודות\s+(.+)$/);if(m){const h=HELP.find(x=>m[1].includes(x[0]));if(h){sayLocal(h[0]+': '+h[1].replace(/"/g,''));return true;}}
  return false;}
function galleryCmd(text){const t=text.replace(/[?!.,]/g,'').trim();
  if(/^(מה בניתי השבוע|מה בנינו השבוע|גלריה|מה בניתי)$/.test(t)){const wk=Date.now()-7*24*3600*1000;const g=galleryList.filter(x=>(x.ts||0)>wk);if(!g.length){sayLocal('השבוע עוד לא נבנה משהו שנרשם בגלריה.');return true;}lastTasks=g.map(x=>({id:x.id,title:x.title,link:x.link,status:'done'})).concat(lastTasks);sayLocal('השבוע נבנו '+g.length+': '+g.map(x=>x.title).join(', ')+'. תגיד תפתח ואפתח את האחרון.');return true;}
  if(/^(המחולל|תפתח את המחולל|פתח את המחולל|מסך המחולל)$/.test(t)){const u='https://claude.ai/artifact/AcTS4zzdMcXFcxFFvr5UVn';sayLocal('פותחת את המחולל.');if(appMode)post(PROTO.toApp.cmd,{cmd:'open '+u});else window.open(u,'_blank');return true;}
  return false;}
function memoryCmd(text){const t=text.replace(/[?!.,]/g,'').trim();if(galleryCmd(text))return true;if(helpCmd(text))return true;if(traceCmd(text))return true;
  let m=t.match(/^(תזכור|תזכרי|זכור|זכרי)\s+(?:(?:כי|את)\s+)?(.+)$/);
  if(m){const note=m[2].trim();if(note.length<2)return false;P.notes().doc(mintId()).set({text:note,ts:Date.now(),by:'מאיר'}).then(()=>sayLocal('זכרתי: '+note)).catch(e=>{fail('P_DB_WRITE',e,'memory/notes/items');sayLocal('לא הצלחתי לשמור');});return true;}
  m=t.match(/^(תשכח|תשכחי|שכח|שכחי)\s+(?:את|ש)\s*(.+)$/);
  if(m){const q=m[2].trim();coldGet(P.notes(),null,500).then(async r=>{const hits=r.docs.filter(d=>((d.data()||{}).text||'').includes(q));for(const d of hits){try{await d.ref.delete();}catch(e){fail('P_DB_WRITE',e,'memory/notes/items');}}sayLocal(hits.length?'שכחתי '+hits.length+(hits.length===1?' דבר':' דברים')+' על '+q:'לא מצאתי משהו על '+q+' בזיכרון');}).catch(e=>{fail('P_DB_READ',e,'memory/notes/items');sayLocal('לא הצלחתי');});return true;}
  m=t.match(/^(אל תשאל(י)? אותי (על|לגבי)|תמיד תזכור|תמיד אל|אף פעם אל)\s+(.+)$/);
  if(m){P.prefs().doc(mintId()).set({text:t,ts:Date.now()}).then(()=>sayLocal('הבנתי, זו העדפה קבועה: '+t)).catch(e=>fail('P_DB_WRITE',e,'memory/prefs/items'));return true;}
  if(/^(מה אתה זוכר|מה את זוכרת|מה בזיכרון|מה זכרת)$/.test(t)){coldGet(P.notes(),null,500).then(r=>{const n=r.docs.map(d=>(d.data()||{}).text).filter(Boolean);sayLocal(n.length?'אני זוכרת '+n.length+' דברים: '+n.slice(-8).join('; '):'הזיכרון של הערות עוד ריק.');}).catch(e=>fail('P_DB_READ',e,'memory/notes/items'));return true;}
  if(/^(אל תשמור שיחות|בלי לשמור שיחות|תפסיק לשמור)$/.test(t)){memSettings.logTurns=false;P.settings().set(memSettings).catch(e=>fail('P_DB_WRITE',e,'memory/settings'));sayLocal('בסדר, מעכשיו לא שומרת את השיחות.');return true;}
  if(/^(תשמור שיחות|תחזור לשמור)$/.test(t)){memSettings.logTurns=true;P.settings().set(memSettings).catch(e=>fail('P_DB_WRITE',e,'memory/settings'));sayLocal('שומרת שיחות שוב.');return true;}
  if(/^(מה נשמר|פרטיות|מה אתה שומר|מה את שומרת)$/.test(t)){sayLocal('מה נשמר: שיחות '+(memSettings.logTurns?'כן':'לא')+', החלטות '+(memSettings.decisions?'כן':'לא')+', הערות זיכרון '+(memSettings.notes?'כן':'לא')+'. הכל בענן הפרטי של הארטיפקט, לא ברפו הציבורי. תגיד אל תשמור שיחות כדי לעצור.');return true;}
  return false;}
/* req-spine: the question this step exists for. Unbound replies are named, not hidden in the denominator. */
function reqCmd(text){const t=text.replace(/[?!.,]/g,'').trim();
  if(!/^(כמה בקשות( היום)?|כמה בקשות סגרת|כמה שאלתי היום|מה סגרת היום)$/.test(t))return false;
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
function latencyCmd(text){const t=text.replace(/[?!.,]/g,'').trim();
  if(!/^(כמה זמן לוקח לך לענות|כמה זמן לוקחות תשובות|כמה מהר את עונה|מה זמן התגובה)$/.test(t))return false;
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
function pulseCmd(text){const t=text.replace(/[?!.,]/g,'').trim();if(!/^(למה שתקת|למה לא ענית|למה לא דיברת|מה שלומך|מה שלום הטלפון|מה מצב הטלפון)$/.test(t))return false;whyCmd();return true;}
/* outbox-keys: what did not go out, and send it again now */
function outboxCmd(text){const t=text.replace(/[?!.,]/g,'').trim();
  if(/^(מה לא נשלח|מה נתקע|מה מחכה לשליחה)$/.test(t)){const w=outbox.map(x=>String(x.text).replace(/ ⟦#[0-9a-z]+⟧$/,''));
    sayLocal(w.length?(w.length===1?'משפט אחד לא נשלח: ':'יש '+w.length+' משפטים שלא נשלחו: ')+w.slice(0,3).join('; ')+(w.length>3?' ועוד':'')+'.':'הכול נשלח, אין משפט שמחכה.');return true;}
  if(/^(תשלח שוב|תנסי שוב לשלוח|תשלחי שוב)$/.test(t)){const n=outbox.length;outbox.forEach(x=>{x.phase='queued';x.leaseUntil=0;});saveOutbox();
    sayLocal(n?'שולחת שוב '+(n===1?'משפט אחד':n+' משפטים')+'.':'אין מה לשלוח שוב.');if(n)setTimeout(flushOutbox,300);return true;}
  return false;}
function taskCmd(text){if(reqCmd(text)||latencyCmd(text)||pulseCmd(text)||outboxCmd(text)||missedCmd(text))return true;const t=text.replace(/[?!.,]/g,'').trim();
  if(/^(מפה|מפת המערכת|תראה מפה|מה כל הסשנים עושים|מי תקוע)$/.test(t)){mapOn=true;renderMap();const m=mapSummary();bubble('li',m);if(appMode)post(PROTO.toApp.say,{text:'ליבה, מפת המערכת: '+m,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(m);return true;}
  if(/^(תפתח|פתח|תפתח את התוצאה|תראה לי|תפתח תראה לי|פתח תראה לי|תפתח לי|תפתח אותו|תפתח אותה|תראה)$/.test(t)){const d=lastTasks.find(x=>x.status==='done'&&x.link)||lastTasks.find(x=>x.link);if(!d)return false;const m='פותחת: '+d.title;bubble('li',m);if(appMode){post(PROTO.toApp.cmd,{cmd:'open '+d.link});post(PROTO.toApp.say,{text:m,kind:'say',options:[],from:'liba',speaker:'ליבה'});}else{say(m);window.open(d.link,'_blank');}return true;}
  const pr=t.match(/^(קודם|תעדיף|עדיפות ל|תתחיל עם)\s+(את\s+)?(.+)$/);if(pr){const q=pr[3].trim();const task=lastTasks.find(x=>(x.title||'').includes(q));if(!task)return false;P.task(task.id).update({priority:Date.now(),updatedAt:Date.now()}).catch(e=>fail('P_DB_WRITE',e,'tasks'));const m='בסדר, '+task.title+' קודם.';bubble('li',m);if(appMode)post(PROTO.toApp.say,{text:m,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(m);return true;}
  return false;}
