// @anchor: paths
// every database path the page touches, in one place (step page-kernel). No other file names a path.
const P_RAW={
  inbox:()=>db.collection('inbox'),inboxDoc:id=>db.doc('inbox/'+id),
  tasks:()=>db.collection('tasks'),task:id=>db.doc('tasks/'+id),
  sessions:()=>db.collection('sessions'),gallery:()=>db.collection('gallery'),
  owner:()=>db.doc('channel/owner'),ownerLog:()=>db.doc('channel/owner').collection('log'),quiet:()=>db.doc('channel/quiet'),device:()=>db.doc('channel/device'),
  current:()=>db.doc('chat/current'),settings:()=>db.doc('memory/settings'),digest:day=>db.doc('memory/digest').collection('items').doc(day),identity:()=>db.doc('memory/identity'),caps:()=>db.doc('memory/caps'),memMeta:()=>db.doc('memory/meta'),
  forget:id=>db.doc('memory/forgets').collection('items').doc(id),forgets:()=>db.doc('memory/forgets').collection('items'),
  proactive:()=>db.doc('memory/proactive'),agendaItem:id=>db.doc('agenda/'+id),power:()=>db.doc('channel/power'),powerDay:d=>db.doc('memory/power').collection('days').doc(d),work:id=>db.doc('work/'+id),works:()=>db.collection('work'),rosterItems:()=>db.doc('brain/roster').collection('items'),agenda:()=>db.collection('agenda'),brief:()=>db.doc('channel/brief'),briefLog:()=>db.doc('brief/log').collection('items'),wake:id=>db.doc('brain/wakes').collection('items').doc(id),protocol:()=>db.doc('channel/protocol'),action:id=>db.doc('actions/log').collection('items').doc(id),actions:()=>db.doc('actions/log').collection('items'),mandate:()=>db.doc('memory/mandate'),approval:id=>db.doc('approvals/'+id),approvals:()=>db.collection('approvals'),shabbat:()=>db.doc('channel/shabbat'),calItem:id=>db.doc('sense/cal').collection('items').doc(id),calItems:()=>db.doc('sense/cal').collection('items'),calState:()=>db.doc('sense/cal'),context:()=>db.doc('sense/context'),body:()=>db.doc('sense/body'),senseItem:id=>db.doc('sense/notif').collection('items').doc(id),senseItems:()=>db.doc('sense/notif').collection('items'),conflict:id=>db.doc('memory/conflicts').collection('items').doc(id),conflicts:()=>db.doc('memory/conflicts').collection('items'),
  cand:k=>db.doc('memory/candidates').collection('items').doc(k),cands:()=>db.doc('memory/candidates').collection('items'),
  person:k=>db.doc('memory/people').collection('items').doc(k),people:()=>db.doc('memory/people').collection('items'),
  fact:k=>db.doc('memory/facts').collection('items').doc(k),facts:()=>db.doc('memory/facts').collection('items'),
  crash:id=>db.doc('crashes/'+id),
  notes:()=>db.doc('memory/notes').collection('items'),prefs:()=>db.doc('memory/prefs').collection('items'),
  turns:()=>db.doc('chat/log').collection('turns'),decisions:()=>db.doc('decisions/log').collection('items'),
  telemetry:()=>db.doc('telemetry/events').collection('items'),
  req:id=>db.doc('req/'+id),reqs:()=>db.collection('req'),
  metricsDay:day=>db.doc('metrics/daily').collection('days').doc(day),metricsDays:()=>db.doc('metrics/daily').collection('days'),
  budget:()=>db.doc('channel/budget'),
  crashes:()=>db.collection('crashes'),
  fold:id=>db.doc('fold/'+id),folds:()=>db.collection('fold'),janitor:()=>db.doc('channel/janitor'),
  parts:id=>db.doc('inbox/'+id).collection('parts'),
  pulse:dev=>db.doc('pulse/'+dev),health:()=>db.doc('channel/health'),pulses:()=>db.collection('pulse'),ledger:day=>db.doc('ledger/'+day),ledgers:()=>db.collection('ledger'),
};
/* req-spine: the only id minter. String(Date.now()) collided whenever two writes shared a millisecond and
   silently overwrote each other; this is 48 bits of time + a per-millisecond counter + 32 random bits, so ids
   from one page never collide and still sort by time. */
let mintLast=0,mintSeq=0;
function mintId(){const t=Date.now();if(t===mintLast)mintSeq++;else{mintLast=t;mintSeq=0;}
  let r=0;try{const a=new Uint32Array(1);crypto.getRandomValues(a);r=a[0];}catch(e){r=Math.floor(Math.random()*4294967296);}
  return t.toString(36).padStart(9,'0')+mintSeq.toString(36).padStart(4,'0')+r.toString(36).padStart(7,'0');}
/* budget-contract-gate: the collection contract (channel-budget.json), baked in at build time */
const BUDGET=__BUDGET__;
/* test hook: tests/inbox.chaos.js runs two instances in one browser and names them, so each keeps its own local
   stores like two devices would. A real page is never named, and its keys stay liba.<name>. */
const LS_SUFFIX=(()=>{try{return window.__LIBA_INSTANCE?'.'+String(window.__LIBA_INSTANCE).replace(/[^a-z0-9]/gi,''):'';}catch(e){return '';}})();
const LSK=k=>'liba.'+k+LS_SUFFIX;
/* one stable id per browser profile: the janitor's lease holder, and the by on every document this page creates */
let PAGE_ID='';try{PAGE_ID=localStorage.getItem(LSK('jid'))||'';if(!PAGE_ID){PAGE_ID='p-'+mintId();localStorage.setItem(LSK('jid'),PAGE_ID);}}catch(e){PAGE_ID='p-'+mintId();}
/* write-clearinghouse: every path above has a class, and every write through P goes through ch(), which knows
   the budget. When the database fills, telemetry is refused first, then records, then state - speech (voice) is
   never refused. A quota error is caught by name, said aloud once, and the page degrades at once. Nothing at the
   call sites changed: P hands out guarded references, and db-paths already forbids any path outside this table. */
const CLS_OF={inbox:'voice',inboxDoc:'voice',parts:'voice',current:'voice',owner:'state',quiet:'state',settings:'state',task:'state',tasks:'state',
  sessions:'state',budget:'state',ownerLog:'state',gallery:'record',digest:'record',identity:'record',caps:'record',memMeta:'record',person:'record',people:'record',cand:'record',cands:'record',forget:'record',forgets:'record',conflict:'record',conflicts:'record',proactive:'record',agendaItem:'telemetry',power:'state',powerDay:'record',work:'record',works:'record',rosterItems:'state',agenda:'telemetry',brief:'state',briefLog:'record',wake:'telemetry',protocol:'state',action:'telemetry',actions:'telemetry',mandate:'state',approval:'record',approvals:'record',shabbat:'state',senseItem:'record',senseItems:'record',calItem:'record',calItems:'record',calState:'state',context:'fixed',body:'fixed',fact:'record',facts:'record',notes:'record',prefs:'record',turns:'record',decisions:'record',req:'record',reqs:'record',
  device:'telemetry',crash:'telemetry',telemetry:'telemetry',metricsDay:'telemetry',metricsDays:'telemetry',
  /* the janitor frees space, so its folds and lease are never refused - refusing the cure would keep the db full */
  fold:'janitor',folds:'janitor',janitor:'janitor',crashes:'record',
  /* fixed cardinality: one document per device, one per day - rewriting an existing document still works on a full db */
  pulse:'fixed',health:'fixed',pulses:'fixed',ledger:'fixed',ledgers:'fixed'};
/* the fraction of the quota at which each class stops being written; voice has no line */
const CH_TIER={telemetry:0.72,record:0.84,state:0.92};
let chBudget={docs:0,limit:25000,bypass:false},chAlarmedAt=0;const chDenied={};
function chAllowed(cls){if(cls==='voice'||chBudget.bypass)return true;const lim=CH_TIER[cls];return !lim||chBudget.docs<lim*chBudget.limit;}
function chAlarm(code){chBudget.docs=chBudget.limit;if(Date.now()-chAlarmedAt<3600000)return;chAlarmedAt=Date.now();fail('P_DB_FULL',null,code);
  /* said from the page's own queue, not written to the inbox - the inbox is exactly what might be full */
  queueLocal({id:'ch-full-'+Date.now(),kind:'say',priority:'urgent',speaker:'ליבה',topic:'המסד',text:'המסד מלא. הפסקתי לרשום טלמטריה ויומנים כדי שהדיבור ימשיך.'});}
function ch(ref,op,body,cls,what){
  if(op!=='delete'&&!chAllowed(cls)){chDenied[cls]=(chDenied[cls]||0)+1;return Promise.reject({code:'budget',cls:cls,what:what});}
  /* attribution: every document this page creates says who wrote it, so a flood can be named */
  if(op==='set'&&body&&typeof body==='object'&&!body.by)body=Object.assign({by:PAGE_ID},body);
  let pr;try{pr=op==='set'?ref.set(body):op==='update'?ref.update(body):ref.delete();}catch(e){pr=Promise.reject(e);}
  return Promise.resolve(pr).catch(e=>{const c=String(e&&(e.code||e.name)||e);if(/quota|resource.?exhausted/i.test(c))chAlarm(c);throw e;});}
function guardDoc(ref,cls,what){return {ref:ref,path:ref.path,get:()=>ref.get(),onSnapshot:(a,b)=>ref.onSnapshot(a,b),collection:n=>guardCol(ref.collection(n),cls,what),
  set:d=>ch(ref,'set',d,cls,what),update:d=>ch(ref,'update',d,cls,what),delete:()=>ch(ref,'delete',null,cls,what),
  acquire:o=>ref.acquire(o)};}
function guardCol(ref,cls,what){return {ref:ref,path:ref.path,get:()=>ref.get(),onSnapshot:(a,b)=>ref.onSnapshot(a,b),
  where:(f,o,v)=>ref.where(f,o,v),orderBy:(f,d)=>ref.orderBy(f,d),limit:n=>ref.limit(n),doc:id=>guardDoc(ref.doc(id),cls,what)};}
const P=Object.fromEntries(Object.entries(P_RAW).map(([k,f])=>[k,(...a)=>{const r=f(...a);const cls=CLS_OF[k]||'record';return typeof r.set==='function'?guardDoc(r,cls,k):guardCol(r,cls,k);}]));
window.__ch={budget:()=>Object.assign({},chBudget),denied:()=>Object.assign({},chDenied)};
/* text from the database goes into the DOM through this, never raw: a task title is written by other
   sessions, and "<img onerror=…>" in one would otherwise run inside the page that holds the channel */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
