// @anchor: ship
// say-ship + measure: "תעלי גרסה" by voice, every stage said once; a task that should be measured is not "done"
// until its gates are green
/* Step say-ship. "תעלי גרסה" / "תשלחי לטלפון" / "תעלי את התיקון הזה" asks first - always, a voice yes (a sentence said
   by accident ships nothing) - then opens tasks/<id> {type:'ship', stage:'queued'} and hands it to the brain: the
   session runs the pipeline (VERSION, ship/release.mjs, the page to the pinned artifact, page-receipt) and writes
   stage: building, testing, signed, publishing-page, ready, installed - or page-failed. Each stage is said once; at
   ready the phone is told to check for the update now (a local command, it only reads the signed manifest); at
   page-failed ליבה says once that the page did not go out and she stays on the previous one. "מה מצב הגרסה" compares
   what the phone reported (channel/device) with the last ship; "מה השתנה בגרסה" says its notes.
   Step measure (the page's side). A task that carries metricsRun is announced done only when metrics/items/<run>
   says every gate is green - otherwise "סומנה גמורה, אבל ..." with the numbers. "השערים", "מה נמדד" read the last run.
   The generator's own metrics are written by its workers on their branch; ליבה only reads them. */
const SHIP_HE={queued:'בתור',building:'בונה את הגרסה',testing:'בודקת את הגרסה',signed:'הגרסה חתומה',
  'publishing-page':'מפרסמת את הדף','ready':'הגרסה מוכנה - מבקשת מהטלפון לבדוק עדכון','installed':'הגרסה מותקנת בטלפון','page-failed':'הדף לא התפרסם - נשארתי על הגרסה הקודמת, ולא מתקינה אפליקציה חדשה מול דף ישן','failed':'השילוח נכשל'};
let shipStageSeen={},metricsMap=new Map(),shipDevice=null;
function shipCmd(){(async()=>{const v=Mandate.allow('ship');if(v.verdict==='deny'){sayLocal('לא עכשיו - '+v.why+'.');return;}
  const yes=await Consent.request({action:'ship',effect:'להעלות גרסה חדשה לטלפון',reversible:false,say:'להעלות גרסה חדשה לטלפון, עם כל מה שנכנס מאז הקודמת? תגיד כן כדי לשלוח.'});
  if(!yes){sayLocal('לא שלחתי.');return;}const id='ship-'+mintId(),now=Date.now();
  await P.task(id).set({type:'ship',title:'שילוח גרסה',status:'queued',stage:'queued',from:'meir',at:now,updatedAt:now}).catch(e=>fail('P_DB_WRITE',e,'tasks ship'));
  Ledger.record({action:'ship',cause:'voice',result:id});
  deliver('שלח גרסה לטלפון: tasks/'+id+'. ההליך ב-ship/publish-page.md ו-channel/protocol.ship; כתוב stage בכל שלב.',tagOf('manager')).catch(()=>{});
  sayLocal('שולחת. אגיד לך כל שלב.');})();return true;}
function shipStages(list){for(const t of list){if(t.type!=='ship'||!t.stage)continue;const k=t.id+'|'+t.stage;if(shipStageSeen[k])continue;shipStageSeen[k]=true;
  if(t.stage==='queued')continue;queueLocal({id:'ship-'+k,kind:'say',speaker:'ליבה',topic:'גרסה',text:(SHIP_HE[t.stage]||t.stage)+(t.stage==='ready'&&t.versionName?': '+t.versionName:'')+'.'});
  if(t.stage==='ready'&&appMode)post(PROTO.toApp.cmd,{cmd:'update_check'});}}
function shipStatus(){const s=[...(lastTasks||[])].filter(t=>t.type==='ship').sort((a,b)=>(b.at||0)-(a.at||0))[0];
  const dev=appVer?'בטלפון רצה אפליקציה '+appVer+', והדף '+PAGE_NUM+'.':'הדף כאן הוא '+PAGE_NUM+' - אין דיווח מהבועה.';
  sayLocal(dev+(s?' השילוח האחרון: '+(SHIP_HE[s.stage]||s.stage)+(s.versionName?', גרסה '+s.versionName:'')+'.':' לא שלחתי גרסה בקול עדיין.'));return true;}
function shipNotes(){const s=[...(lastTasks||[])].filter(t=>t.type==='ship'&&t.notes).sort((a,b)=>(b.at||0)-(a.at||0))[0];sayLocal(s?'בגרסה '+(s.versionName||'האחרונה')+': '+s.notes:'אין לי הערות לגרסה האחרונה.');return true;}
/* measure: a done that has not been measured is not announced as done */
function measureDone(t){if(!t.metricsRun)return null;const m=metricsMap.get(String(t.metricsRun));
  if(!m)return 'המשימה '+t.title+' סומנה גמורה, אבל אין לה מדידה - לא מכריזה עליה כגמורה עד שתהיה.';
  const g=+m.gatesGreen||0,n=+m.gatesTotal||13;if(g<n)return 'המשימה '+t.title+' סומנה גמורה, אבל רק '+g+' מתוך '+n+' שערים ירוקים. היא לא גמורה.';return null;}
function metricsIn(m){metricsMap=m;}
function metricsSay(){const all=[...metricsMap.values()].sort((a,b)=>(b.at||0)-(a.at||0));const m=all[0];
  if(!m){sayLocal('אין מדידות. העובדים של המחולל עוד לא כתבו metrics.');return true;}
  sayLocal('המדידה האחרונה'+(m.project?' של '+m.project:'')+', '+agoWords(Date.now(),+m.at||Date.now())+': '+(+m.gatesGreen||0)+' מתוך '+(+m.gatesTotal||13)+' שערים ירוקים'+(m.wired!=null?', '+m.wired+' מחווט':'')+'.');return true;}
async function shipContract(){if(!db)return;try{const g=await P.protocol().get();const x=(g.exists&&g.data())||{};if(x.ship)return;
  await P.protocol().set(Object.assign({},x,{ship:{task:'tasks/<id> type:ship',stages:'building, testing, signed, publishing-page, ready, installed | page-failed | failed',how:'ship/publish-page.md',rule:'מקבלים "שלח גרסה: tasks/<id>" - כותבים stage בכל שלב; ready רק אחרי שהדף התפרסם לארטיפקט ב-ship/artifact.json וקבלה נכתבה; אם הדף לא התפרסם - page-failed ולא מפרסמים APK. versionName ו-notes על המשימה. משימה שדורשת מדידה נושאת metricsRun, והמדידה ב-metrics/runs/items/<run> {gatesGreen, gatesTotal, wired, at}.',at:Date.now()}}));}catch(e){fail('P_DB_WRITE',e,'channel/protocol');}}
setTimeout(shipContract,9000);
window.__ship={stages:shipStages,measureDone,metricsIn};
