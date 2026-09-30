// @anchor: fleet
// the fleet: workers opened by voice, a queue with one stop switch, heartbeats, triage, failure memory, routing, control
/* Steps worker-open .. fleet-router. The page is the fleet's queue, dispatcher and enforcer; the brain session is the
   launcher. "תבנה לי X" / "תתקן X" / "תבדוק X" writes workers/<wid> and fleet/orders/items/<wid> with an idem (the same
   sentence twice within two minutes opens one worker). dispatch() runs on the outbox tick (no timer of its own): it
   stops at fleet/policy.halt or maxRunning, claims the oldest order with a lease (two tabs never take the same one),
   moves the worker to running and hands it to the brain in one sentence; the worker beats workers/<wid>.beat. The
   control field (pause, resume, kill, retry, drain) is applied by one writer, applyControl, which stamps
   controlAppliedAt. sweep() (every 45 s, on the same tick) finds the stalled (no beat for two leases), the zombie (running
   20 minutes with no beat), the abandoned (dispatched, never beat in 10 minutes - back to the queue under the same
   idem), and the deaf (a control not applied in 10 s - applied by the sweep). A worker's question is triaged: how many
   wait on it, what it burns, its age, urgent - above the line it is said, below it waits in fleet/asks for the summary,
   and after two hours it goes to the top whatever its score; "מה השתקת" says them all. A question whose fingerprint
   already has Meir's answer (decisions, 14 days) is answered by ליבה, at most twice per fingerprint before asking again;
   "מה חוזר על עצמו" says the five most common. An answer within three minutes of a worker's question goes to that worker
   ([ליבה→עובד:<id>]), and the route expires by itself. */
const FLEET_LEASE=60000,FLEET_ABANDON=10*60000,FLEET_ZOMBIE=20*60000,FLEET_DEAF=10000,FLEET_SWEEP=45000,FLEET_IDEM=120000,TRIAGE_LINE=4,TRIAGE_ESC=2*3600e3,ROUTE_TTL=3*60000;
let fleetPolicy={halt:false,maxRunning:3,drainAll:false},fleetWorkers=new Map(),fleetOrders=new Map(),fleetSweptAt=0,fleetDecAt=0,fleetDec=new Map(),fleetRoute=null,fleetSumAt=0;
const FLEET_KINDS={build:'בנייה',fix:'תיקון',check:'בדיקה',merge:'מיזוג'},FLEET_ST={queued:'בתור',running:'רץ',paused:'מושהה',killed:'נהרג',stalled:'מת בשקט',done:'גמור',blocked:'מחכה לך'};
function wid(){return 'w-'+mintId();}
function fleetHash(s){let h=2166136261;for(const c of String(s)){h^=c.codePointAt(0);h=Math.imul(h,16777619)>>>0;}return h.toString(36);}
/* failure-memory: what a failure is, without the parts that change every time */
function fingerprint(t){return fleetHash(inorm(String(t||'')).replace(/[a-z]:?[\\/][^\s]*|\/[^\s]*\/[^\s]*/gi,'<path>').replace(/:\d+(:\d+)?/g,'').replace(/\b[0-9a-f]{7,40}\b/gi,'<id>').replace(/\d+/g,'<n>').replace(/["'`״׳]/g,'').replace(/\s+/g,' ').trim());}
function fleetTrans(w,to,by,why){const t=(w.transitions||[]).concat([{to,at:Date.now(),by:by||'liba',why:why||''}]);return t.slice(-30);}
async function openWorker(s){const now=Date.now(),kind=s.kind||'build',idem=s.idem||fleetHash(kind+'|'+inorm(s.spec||''));
  const dup=[...fleetOrders.values()].find(o=>o.idem===idem&&now-(+o.at||0)<FLEET_IDEM);if(dup)return {wid:dup.wid,dup:true};
  const w=wid(),title=String(s.title||s.spec||'').slice(0,60);
  await P.worker(w).set({title,kind,repo:s.repo||'',branch:s.branch||'',spec:String(s.spec||'').slice(0,600),status:'queued',lease:0,beat:0,spend:{usd:0,tokens:0},gates:{},parent:s.parent||'',needs:s.needs||[],control:null,transitions:[{to:'queued',at:now,by:'liba'}],createdAt:now,idem});
  const o={ts:s.ts||now,at:now,idem,wid:w,kind,title,claimBy:'',claimAt:0};await P.order(w).set(o);fleetOrders.set(w,Object.assign({id:w},o));
  fleetWorkers.set(w,{id:w,title,kind,status:'queued',transitions:[],createdAt:now,idem,spec:s.spec});
  Mandate.spent('open_worker');Ledger.record({action:'open_worker',cause:'voice',inputs:{kind,title},result:w});return {wid:w};}
/* "תבנה לי" is always work; "תתקן" / "תבדוק" only when it is about something that is built - "תבדוק אם אבי שלח" is a
   question for the brain, and goes to it as before */
const FLEET_OBJ=/(באג|דף|הדף|אפליקציה|האפליקציה|קוד|הקוד|שער|בדיקה|בדיקות|גרסה|הגרסה|ענף|שרת|השרת|גיבוי|הגיבוי|טבלה|טבלת|אתר|האתר|טופס|הטופס|בועה|הבועה|מחשבון|קישור|הקישור|התראות|לוח|כפתור|תקלה|קריסה|המחולל|סקריפט|כלי|הכלי|מסך|עמוד)/;
function workerCmd(rest,kind){const spec=String(rest||'').trim();if(kind!=='build'&&!FLEET_OBJ.test(spec))return false;if(memWords(spec).length<2){sayLocal('מה בדיוק '+(kind==='fix'?'לתקן':kind==='check'?'לבדוק':'לבנות')+'? תגיד את זה במשפט אחד.');return true;}
  const go=()=>openWorker({kind,spec,title:spec}).then(r=>sayLocal(r.dup?'כבר פתחתי את זה לפני רגע - עובד אחד.':'פתחתי עובד '+FLEET_KINDS[kind]+': '+spec.slice(0,50)+(fleetPolicy.halt?'. הצי עצור - הוא יחכה בתור עד שתגיד להמשיך.':'. הוא בתור.'))).catch(e=>{fail('P_DB_WRITE',e,'workers');sayLocal('לא הצלחתי לפתוח עובד.');});
  const v=Mandate.allow('open_worker');if(v.verdict==='deny'){sayLocal('לא עכשיו - '+v.why+'.');return true;}
  if(v.verdict==='ask_first'){Consent.request({action:'open_worker',effect:'לפתוח עובד: '+spec.slice(0,60),reversible:true,say:'לפתוח עובד '+FLEET_KINDS[kind]+': '+spec.slice(0,60)+'?'}).then(y=>{if(y)go();});return true;}
  go();return true;}
function fleetBuild(r){return workerCmd(r,'build');}function fleetFix(r){return workerCmd(r,'fix');}function fleetCheck(r){return workerCmd(r,'check');}
/* the dispatcher: one order at a time, oldest first, never past the policy */
async function dispatch(now){now=now||Date.now();if(!db||fleetPolicy.halt)return 0;
  const running=[...fleetWorkers.values()].filter(w=>w.status==='running').length;if(running>=(+fleetPolicy.maxRunning||3))return 0;
  const q=[...fleetOrders.values()].filter(o=>!o.claimBy&&(fleetWorkers.get(o.wid)||{}).status==='queued').sort((a,b)=>a.ts-b.ts);if(!q.length)return 0;
  /* the oldest this tab can claim - one another tab holds does not block the queue behind it */
  let o=null;for(const c of q.slice(0,5)){let l;try{l=await P.order(c.wid).acquire({holder:PAGE_ID,ttlMs:FLEET_LEASE});}catch(e){fail('P_DB_WRITE',e,'order lease');return 0;}if(l&&l.acquired!==false){o=c;break;}}
  if(!o)return 0;const w=fleetWorkers.get(o.wid);if(!w||w.status!=='queued')return 0;
  o.claimBy=PAGE_ID;o.claimAt=now;await P.order(o.wid).update({claimBy:PAGE_ID,claimAt:now}).catch(()=>{});
  w.status='running';w.dispatchedAt=now;w.transitions=fleetTrans(w,'running','dispatch');
  await P.worker(o.wid).update({status:'running',dispatchedAt:now,lease:now+FLEET_ABANDON,transitions:w.transitions}).catch(e=>fail('P_DB_WRITE',e,'worker'));
  deliver('פתח עובד '+o.wid+' ('+(FLEET_KINDS[o.kind]||o.kind)+'): '+String(w.spec||o.title).slice(0,400)+'. החוזה ב-channel/protocol.fleet: פעימה ל-workers/'+o.wid+'.beat כל דקה, שאלות עם workerId.',tagOf('manager')).catch(()=>{});
  Ledger.record({action:'dispatch',cause:'order:'+o.wid,result:'running'});return 1;}
/* the one writer of control -> status */
async function applyControl(w,by){const c=w.control;if(!c||w.controlAppliedAt>=(+c.at||0))return false;const now=Date.now();let st=w.status,extra={};
  if(c.op==='pause')st='paused';else if(c.op==='kill'){st='killed';extra.claimReleased=true;}else if(c.op==='drain'){extra.drainAfterStep=true;}
  else if(c.op==='resume'){st='queued';await P.order(w.id).update({claimBy:'',claimAt:0}).catch(()=>{});const o=fleetOrders.get(w.id);if(o){o.claimBy='';}}
  else if(c.op==='retry'){await openWorker({kind:w.kind,spec:w.spec,title:w.title,parent:w.id,idem:fleetHash(w.idem+'|r'+now)});st=w.status==='running'?'killed':w.status;}
  if(c.op==='kill'){await P.order(w.id).update({claimBy:'',claimAt:0,dead:true}).catch(()=>{});}
  w.transitions=st!==w.status?fleetTrans(w,st,by||'liba',c.op):w.transitions;w.status=st;w.controlAppliedAt=now;
  await P.worker(w.id).update(Object.assign({status:st,control:null,controlAppliedAt:now,transitions:w.transitions||[]},extra)).catch(e=>fail('P_DB_WRITE',e,'control'));
  Ledger.record({action:'control',cause:'worker:'+w.id,inputs:{op:c.op,by:by||'liba'},result:st});return true;}
async function requeue(id,why){const w=fleetWorkers.get(id);if(!w)return;w.transitions=fleetTrans(w,'queued','sweep',why);w.status='queued';
  await P.worker(id).update({status:'queued',transitions:w.transitions,requeuedFor:why}).catch(()=>{});await P.order(id).update({claimBy:'',claimAt:0}).catch(()=>{});
  const o=fleetOrders.get(id);if(o){o.claimBy='';o.claimAt=0;}}
function fleetSaid(k){try{const s=JSON.parse(localStorage.getItem(LSK('fleetSaid'))||'{}');if(s[k])return true;s[k]=Date.now();const ks=Object.keys(s);if(ks.length>200)delete s[ks[0]];localStorage.setItem(LSK('fleetSaid'),JSON.stringify(s));}catch(e){}return false;}
async function sweep(now){now=now||Date.now();const out=[];
  for(const w of fleetWorkers.values()){
    if(w.control&&!(w.controlAppliedAt>=(+w.control.at||0))&&now-(+w.control.at||now)>FLEET_DEAF){await applyControl(w,'sweep');out.push([w.id,'deaf']);continue;}
    if(w.status!=='running')continue;const beat=+w.beat||0;
    if(!beat&&now-(+w.dispatchedAt||now)>FLEET_ABANDON){await requeue(w.id,'abandoned');out.push([w.id,'abandoned']);continue;}
    if(beat&&now-beat>FLEET_ZOMBIE){await requeue(w.id,'zombie');out.push([w.id,'zombie']);continue;}
    if(beat&&now-beat>2*FLEET_LEASE){w.transitions=fleetTrans(w,'stalled','sweep');w.status='stalled';await P.worker(w.id).update({status:'stalled',transitions:w.transitions}).catch(()=>{});out.push([w.id,'stalled']);
      const k='w-'+w.id+'-stalled-'+Math.floor(beat/FLEET_LEASE);if(!fleetSaid(k))queueLocal({id:k,kind:'say',speaker:'ליבה',topic:'עובד',text:'העובד "'+w.title+'" מת בשקט - אין ממנו סימן חיים '+Math.round((now-beat)/60000)+' דקות.'});}}
  const held=await fleetAsksOpen();if(held.length&&now-fleetSumAt>30*60000){fleetSumAt=now;const top=held.sort((a,b)=>b.score-a.score)[0];
    queueLocal({id:'fleet-sum-'+Math.floor(now/60000),kind:'say',speaker:'ליבה',topic:'עובדים',text:(held.length===1?'שאלה אחת של עובד מחכה':held.length+' שאלות של עובדים מחכות')+'. החשובה: '+String(top.text).slice(0,80)+''+'. תגיד "מה השתקת מהעובדים" לכולן.'});}
  return out;}
async function fleetTick(){if(!db)return;const now=Date.now();try{await dispatch(now);if(now-fleetSweptAt>FLEET_SWEEP){fleetSweptAt=now;await sweep(now);}if(now-fleetDecAt>5*60000){fleetDecAt=now;await fleetDecLoad(now);}}catch(e){fail('P_DB_WRITE',e,'fleet tick');}}
function fleetIn(kind,map){if(kind==='w'){fleetWorkers=map;for(const w of map.values())if(w.control&&!(w.controlAppliedAt>=(+w.control.at||0)))applyControl(w);}else if(kind==='o')fleetOrders=map;else if(kind==='p')fleetPolicy=Object.assign({halt:false,maxRunning:3},map);}
/* triage */
function triageScore(d,now){const id=d.workerId,deps=[...fleetWorkers.values()].filter(w=>(w.needs||[]).indexOf(id)>=0).length,w=fleetWorkers.get(id)||{};
  return deps*3+Math.min(3,(+(w.spend&&w.spend.usd)||0)/2)+Math.min(3,(now-(+d.ts||now))/3600e3)+(d.priority==='urgent'?5:0)+(d.kind==='stuck'?1:0);}
/* failure-memory first - an urgent question that was already decided is answered all the same */
function fleetAutoGate(d){if(!d.workerId||d.release||d.local||(d.kind!=='ask'&&d.kind!=='stuck'))return null;if(d.autoDone||d.autoBusy)return 'auto';
  const fp=fingerprint(d.text),dec=fleetDec.get(fp);if(dec&&!d.autoTried){d.autoTried=true;d.autoBusy=true;fleetAuto(d,fp,dec).finally(()=>{d.autoBusy=false;});return 'auto';}return null;}
function fleetGate(d){if(!d.workerId||d.release||d.local||(d.kind!=='ask'&&d.kind!=='stuck'))return null;const now=Date.now();const fp=fingerprint(d.text);
  const sc=triageScore(d,now);if(sc>=TRIAGE_LINE||now-(+d.ts||now)>TRIAGE_ESC)return null;
  if(!d.triaged){d.triaged=true;if(db)P.ask(d.id).set({workerId:d.workerId,text:String(d.text||'').slice(0,300),score:sc,at:now,ts:+d.ts||now,state:'held',fp}).catch(()=>{});}return 'triage';}
async function fleetAsksOpen(){if(!db)return [];try{return (await coldGet(P.asks(),[['state','==','held']],100)).docs.map(x=>Object.assign({id:x.id},x.data()||{}));}catch(e){return [];}}
function fleetMuted(){(async()=>{const a=await fleetAsksOpen();if(!a.length){sayLocal('לא השתקתי כלום.');return;}
  sayLocal('השתקתי '+(a.length===1?'שאלה אחת':a.length+' שאלות')+': '+a.sort((x,y)=>y.score-x.score).map(x=>((fleetWorkers.get(x.workerId)||{}).title||x.workerId)+' - '+String(x.text).slice(0,60)).join('; ')+'. תגיד "תשחרר רק שאלות" כדי לשמוע אותן.');})();return true;}
/* failure memory */
async function fleetDecLoad(now){if(!db)return;try{const r=await coldGet(P.decisions(),[['ts','>',now-14*864e5]],300);const m=new Map();
  r.docs.map(x=>Object.assign({id:x.id},x.data()||{})).filter(x=>x.fp&&x.answer).sort((a,b)=>a.ts-b.ts).forEach(x=>m.set(x.fp,{answer:x.answer,id:x.id,at:x.ts}));fleetDec=m;}catch(e){fail('P_DB_READ',e,'fleet decisions');}}
async function fleetAuto(d,fp,dec){let f={};try{const g=await P.failure(fp).get();f=g.exists?(g.data()||{}):{};}catch(e){}
  const now=Date.now(),auto=+f.autoCount||0;
  await P.failure(fp).set({count:(+f.count||0)+1,firstAt:f.firstAt||now,lastAt:now,workers:[...new Set((f.workers||[]).concat([d.workerId]))].slice(-20),decisionRef:dec.id,autoCount:auto<2?auto+1:0,text:String(d.text||'').slice(0,160)}).catch(()=>{});
  if(auto>=2){d.release=true;pump();return;} /* twice on its own - the third time Meir hears it again */
  const r=await deliver('ענית על זה כבר: '+dec.answer+reqMark(d.id),'[ליבה→עובד:'+d.workerId+'] ');
  if(r.sent){d.autoDone=true;spokenMark(d.id);await P.inboxDoc(d.id).update({spoken:true,spokenAt:now,auto:true,delivery:{state:'auto',by:PAGE_ID,at:now,decision:dec.id}}).catch(()=>{});Ledger.record({action:'auto_answer',cause:'inbox:'+d.id,inputs:{fp},result:dec.id});}
  else{d.release=true;pump();}}
function fleetRepeats(){(async()=>{let rows=[];try{rows=(await coldGet(P.failures(),null,200)).docs.map(x=>x.data()||{});}catch(e){}
  rows.sort((a,b)=>(b.count||0)-(a.count||0));sayLocal(rows.length?'חוזר על עצמו: '+rows.slice(0,5).map(x=>String(x.text||'').slice(0,50)+' - '+x.count+' פעמים').join('; ')+'.':'עוד שום כשל לא חזר על עצמו.');})();return true;}
/* routing */
function fleetRouteSet(d){if(!d.workerId)return;fleetRoute={to:'worker',workerId:d.workerId,since:Date.now(),until:Date.now()+ROUTE_TTL};if(db)P.route().set(fleetRoute).catch(()=>{});}
function fleetTag(){if(fleetRoute&&fleetRoute.until>Date.now())return '[ליבה→עובד:'+fleetRoute.workerId+'] ';if(fleetRoute){fleetRoute=null;if(db)P.route().set({to:'',workerId:'',until:0,since:Date.now()}).catch(()=>{});}return '';}
function fleetSpeaker(d){const w=d.workerId&&fleetWorkers.get(d.workerId);return w?'עובד '+String(w.title||'').split(' ').slice(0,3).join(' '):'';}
/* control by voice */
function matchWorker(q){const w=memWords(q);const live=[...fleetWorkers.values()].filter(x=>['killed','done'].indexOf(x.status)<0).slice(-40);
  const sc=live.map(x=>{const t=memWords(x.title);const n=w.filter(a=>t.some(b=>b.indexOf(a)===0||a.indexOf(b)===0)).length;return {x,n};}).filter(s=>s.n>0).sort((a,b)=>b.n-a.n);
  if(!sc.length)return {none:true};if(sc[1]&&sc[1].n===sc[0].n)return {two:[sc[0].x,sc[1].x]};return {w:sc[0].x};}
async function workerCtl(op,q){const m=matchWorker(q);if(m.none){sayLocal('לא מצאתי עובד בשם '+q+'.');return;}
  if(m.two){sayLocal('יש שניים: '+m.two[0].title+', או '+m.two[1].title+'. תגיד את השם המלא.');return;}
  const w=m.w;if(op==='kill'&&!(await Consent.request({action:'stop_worker',effect:'להרוג את העובד '+w.title,reversible:false,say:'להרוג את העובד "'+w.title+'"? העבודה שלו תיעצר באמצע.'})))return;
  w.control={op,by:'meir',at:Date.now()};await P.worker(w.id).update({control:w.control}).catch(()=>{});await applyControl(w,'meir');
  sayLocal({pause:'השהיתי את',resume:'החזרתי לתור את',kill:'הרגתי את',retry:'הרצתי מחדש את',drain:'ביקשתי לסיים את הצעד הנוכחי ואז לעצור את'}[op]+' "'+w.title+'".');}
function fleetPause(r){workerCtl('pause',r);return true;}function fleetResume(r){workerCtl('resume',r);return true;}function fleetKill(r){workerCtl('kill',r);return true;}function fleetRetry(r){workerCtl('retry',r);return true;}function fleetDrain(r){workerCtl('drain',r);return true;}
function fleetHalt(){(async()=>{const now=Date.now();fleetPolicy.halt=true;await P.policy().set(Object.assign({},fleetPolicy,{halt:true,haltAt:now,haltBy:'meir'})).catch(()=>{});let n=0;
  for(const w of fleetWorkers.values())if(w.status==='running'){w.control={op:'pause',by:'meir',at:now};await P.worker(w.id).update({control:w.control}).catch(()=>{});await applyControl(w,'meir');n++;}
  Ledger.record({action:'fleet.halt',cause:'voice',result:n});sayLocal('עצרתי את הצי: '+(n?n+' רצים הושהו':'אף אחד לא רץ')+', ושום עבודה חדשה לא תצא עד שתגיד "תמשיך את הצי".');})();return true;}
function fleetGo(){(async()=>{fleetPolicy.halt=false;await P.policy().set(Object.assign({},fleetPolicy,{halt:false,haltAt:0})).catch(()=>{});let n=0;
  for(const w of fleetWorkers.values())if(w.status==='paused'){w.control={op:'resume',by:'meir',at:Date.now()};await P.worker(w.id).update({control:w.control}).catch(()=>{});await applyControl(w,'meir');n++;}
  sayLocal('הצי ממשיך'+(n?': '+n+' חזרו לתור':'')+'.');})();return true;}
/* worker-open: "מפה" names the workers too - the newest first */
function fleetLine(){const all=[...fleetWorkers.values()].filter(w=>['killed','done'].indexOf(w.status)<0).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  return all.length?' עובדים'+(fleetPolicy.halt?' (הצי עצור)':'')+': '+all.slice(0,4).map(w=>w.title+' - '+(FLEET_ST[w.status]||w.status)).join('; ')+'.':'';}
function fleetMap(){const all=[...fleetWorkers.values()].filter(w=>['killed','done'].indexOf(w.status)<0);if(!all.length){sayLocal('אין עובדים פתוחים.');return true;}
  sayLocal((fleetPolicy.halt?'הצי עצור. ':'')+all.slice(-6).map(w=>w.title+': '+(FLEET_ST[w.status]||w.status)).join('; ')+'.');return true;}
async function fleetContract(){if(!db)return;try{const g=await P.protocol().get();const x=(g.exists&&g.data())||{};if(x.fleet)return;
  await P.protocol().set(Object.assign({},x,{fleet:{workers:'workers/<wid>',orders:'fleet/orders/items/<wid>',policy:'fleet/policy',rule:'המנהל מקבל "פתח עובד <wid>" ופותח סשן. העובד כותב workers/<wid>.beat כל דקה, קורא את status (paused/killed = לעצור) ואת drainAfterStep, ושואל שאלות ב-inbox עם workerId. בלי פעימה עשר דקות - העבודה חוזרת לתור.',at:Date.now()}}));}catch(e){fail('P_DB_WRITE',e,'channel/protocol');}}
setTimeout(fleetContract,7000);
window.__fleet={open:openWorker,dispatch,sweep,applyControl,requeue,gate:fleetGate,fingerprint,match:matchWorker,tag:fleetTag,routeSet:fleetRouteSet,route:()=>fleetRoute,dec:()=>fleetDec,decLoad:fleetDecLoad,state:()=>({policy:fleetPolicy,workers:[...fleetWorkers.values()],orders:[...fleetOrders.values()]}),tick:fleetTick};
