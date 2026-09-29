// @anchor: commands
// voice commands: quiet, memory, gallery, help, tasks
// 12: switch who holds the channel, by voice, without leaving the page
function quietCmd(text){const t=text.replace(/[?!.,]/g,'').trim();
  if(/^(בטל|סיים|תפסיק)( את)? (השקט|שקט)$|^תפריע$|^אפשר להפריע$|^שקט נגמר$/.test(t)){setQuiet(0);return true;}
  if(/^אל תפריע|^שקט(?=\s|$)|^תהיה בשקט|^בלי הפרעות/.test(t)){let m=60;const n=t.match(/(\d+)\s*(דקות|דקה)/);if(n)m=+n[1];else if(/חצי שעה/.test(t))m=30;else if(/שעתיים/.test(t))m=120;else if(/שלוש שעות/.test(t))m=180;else if(/עד הערב/.test(t))m=Math.max(1,Math.round((new Date().setHours(19,0,0,0)-Date.now())/60000));else if(/עד מחר|עד הבוקר/.test(t))m=Math.max(1,Math.round((new Date().setHours(32,0,0,0)-Date.now())/60000));setQuiet(m);return true;}
  return false;}
async function setQuiet(min){const until=min>0?Date.now()+min*60000:0;quietUntil=until;try{await P.quiet().set({until,since:Date.now()});}catch(e){fail('P_DB_WRITE',e,'channel/quiet');}
  const msg=min>0?'ליבה: שקט עד '+new Date(until).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'})+'. רק דחוף יעבור.':'ליבה: השקט בוטל, אני מדברת שוב.';bubble('li',msg);if(appMode)post('say',{text:msg,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(msg);if(!min)pump();}
let memSettings={logTurns:true,decisions:true,notes:true};
function sayLocal(m){bubble('li',m);if(appMode)post('say',{text:'ליבה: '+m,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(m);}
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
  if(/^(המחולל|תפתח את המחולל|פתח את המחולל|מסך המחולל)$/.test(t)){const u='https://claude.ai/artifact/AcTS4zzdMcXFcxFFvr5UVn';sayLocal('פותחת את המחולל.');if(appMode)post('cmd',{cmd:'open '+u});else window.open(u,'_blank');return true;}
  return false;}
function memoryCmd(text){const t=text.replace(/[?!.,]/g,'').trim();if(galleryCmd(text))return true;if(helpCmd(text))return true;if(traceCmd(text))return true;
  let m=t.match(/^(תזכור|תזכרי|זכור|זכרי)\s+(?:(?:כי|את)\s+)?(.+)$/);
  if(m){const note=m[2].trim();if(note.length<2)return false;P.notes().doc(String(Date.now())).set({text:note,ts:Date.now(),by:'מאיר'}).then(()=>sayLocal('זכרתי: '+note)).catch(e=>{fail('P_DB_WRITE',e,'memory/notes/items');sayLocal('לא הצלחתי לשמור');});return true;}
  m=t.match(/^(תשכח|תשכחי|שכח|שכחי)\s+(?:את|ש)\s*(.+)$/);
  if(m){const q=m[2].trim();P.notes().get().then(async r=>{const hits=r.docs.filter(d=>((d.data()||{}).text||'').includes(q));for(const d of hits){try{await d.ref.delete();}catch(e){fail('P_DB_WRITE',e,'memory/notes/items');}}sayLocal(hits.length?'שכחתי '+hits.length+(hits.length===1?' דבר':' דברים')+' על '+q:'לא מצאתי משהו על '+q+' בזיכרון');}).catch(e=>{fail('P_DB_READ',e,'memory/notes/items');sayLocal('לא הצלחתי');});return true;}
  m=t.match(/^(אל תשאל(י)? אותי (על|לגבי)|תמיד תזכור|תמיד אל|אף פעם אל)\s+(.+)$/);
  if(m){P.prefs().doc(String(Date.now())).set({text:t,ts:Date.now()}).then(()=>sayLocal('הבנתי, זו העדפה קבועה: '+t)).catch(e=>fail('P_DB_WRITE',e,'memory/prefs/items'));return true;}
  if(/^(מה אתה זוכר|מה את זוכרת|מה בזיכרון|מה זכרת)$/.test(t)){P.notes().get().then(r=>{const n=r.docs.map(d=>(d.data()||{}).text).filter(Boolean);sayLocal(n.length?'אני זוכרת '+n.length+' דברים: '+n.slice(-8).join('; '):'הזיכרון של הערות עוד ריק.');}).catch(e=>fail('P_DB_READ',e,'memory/notes/items'));return true;}
  if(/^(אל תשמור שיחות|בלי לשמור שיחות|תפסיק לשמור)$/.test(t)){memSettings.logTurns=false;P.settings().set(memSettings).catch(e=>fail('P_DB_WRITE',e,'memory/settings'));sayLocal('בסדר, מעכשיו לא שומרת את השיחות.');return true;}
  if(/^(תשמור שיחות|תחזור לשמור)$/.test(t)){memSettings.logTurns=true;P.settings().set(memSettings).catch(e=>fail('P_DB_WRITE',e,'memory/settings'));sayLocal('שומרת שיחות שוב.');return true;}
  if(/^(מה נשמר|פרטיות|מה אתה שומר|מה את שומרת)$/.test(t)){sayLocal('מה נשמר: שיחות '+(memSettings.logTurns?'כן':'לא')+', החלטות '+(memSettings.decisions?'כן':'לא')+', הערות זיכרון '+(memSettings.notes?'כן':'לא')+'. הכל בענן הפרטי של הארטיפקט, לא ברפו הציבורי. תגיד אל תשמור שיחות כדי לעצור.');return true;}
  return false;}
function taskCmd(text){const t=text.replace(/[?!.,]/g,'').trim();
  if(/^(מפה|מפת המערכת|תראה מפה|מה כל הסשנים עושים|מי תקוע)$/.test(t)){mapOn=true;renderMap();const m=mapSummary();bubble('li',m);if(appMode)post('say',{text:'ליבה, מפת המערכת: '+m,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(m);return true;}
  if(/^(תפתח|פתח|תפתח את התוצאה|תראה לי|תפתח תראה לי|פתח תראה לי|תפתח לי|תפתח אותו|תפתח אותה|תראה)$/.test(t)){const d=lastTasks.find(x=>x.status==='done'&&x.link)||lastTasks.find(x=>x.link);if(!d)return false;const m='פותחת: '+d.title;bubble('li',m);if(appMode){post('cmd',{cmd:'open '+d.link});post('say',{text:m,kind:'say',options:[],from:'liba',speaker:'ליבה'});}else{say(m);window.open(d.link,'_blank');}return true;}
  const pr=t.match(/^(קודם|תעדיף|עדיפות ל|תתחיל עם)\s+(את\s+)?(.+)$/);if(pr){const q=pr[3].trim();const task=lastTasks.find(x=>(x.title||'').includes(q));if(!task)return false;P.task(task.id).update({priority:Date.now(),updatedAt:Date.now()}).catch(e=>fail('P_DB_WRITE',e,'tasks'));const m='בסדר, '+task.title+' קודם.';bubble('li',m);if(appMode)post('say',{text:m,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(m);return true;}
  return false;}
