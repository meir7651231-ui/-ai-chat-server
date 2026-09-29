// @anchor: paths
// every database path the page touches, in one place (step page-kernel). No other file names a path.
const P_RAW={
  inbox:()=>db.collection('inbox'),inboxDoc:id=>db.doc('inbox/'+id),
  tasks:()=>db.collection('tasks'),task:id=>db.doc('tasks/'+id),
  sessions:()=>db.collection('sessions'),gallery:()=>db.collection('gallery'),
  owner:()=>db.doc('channel/owner'),quiet:()=>db.doc('channel/quiet'),device:()=>db.doc('channel/device'),
  current:()=>db.doc('chat/current'),settings:()=>db.doc('memory/settings'),
  crash:id=>db.doc('crashes/'+id),
  notes:()=>db.doc('memory/notes').collection('items'),prefs:()=>db.doc('memory/prefs').collection('items'),
  turns:()=>db.doc('chat/log').collection('turns'),decisions:()=>db.doc('decisions/log').collection('items'),
  telemetry:()=>db.doc('telemetry/events').collection('items'),
  req:id=>db.doc('req/'+id),reqs:()=>db.collection('req'),
  metricsDay:day=>db.doc('metrics/daily').collection('days').doc(day),
  budget:()=>db.doc('channel/budget'),
};
/* req-spine: the only id minter. String(Date.now()) collided whenever two writes shared a millisecond and
   silently overwrote each other; this is 48 bits of time + a per-millisecond counter + 32 random bits, so ids
   from one page never collide and still sort by time. */
let mintLast=0,mintSeq=0;
function mintId(){const t=Date.now();if(t===mintLast)mintSeq++;else{mintLast=t;mintSeq=0;}
  let r=0;try{const a=new Uint32Array(1);crypto.getRandomValues(a);r=a[0];}catch(e){r=Math.floor(Math.random()*4294967296);}
  return t.toString(36).padStart(9,'0')+mintSeq.toString(36).padStart(4,'0')+r.toString(36).padStart(7,'0');}
/* write-clearinghouse: every path above has a class, and every write through P goes through ch(), which knows
   the budget. When the database fills, telemetry is refused first, then records, then state - speech (voice) is
   never refused. A quota error is caught by name, said aloud once, and the page degrades at once. Nothing at the
   call sites changed: P hands out guarded references, and db-paths already forbids any path outside this table. */
const CLS_OF={inbox:'voice',inboxDoc:'voice',current:'voice',owner:'state',quiet:'state',settings:'state',task:'state',tasks:'state',
  sessions:'state',budget:'state',gallery:'record',notes:'record',prefs:'record',turns:'record',decisions:'record',req:'record',reqs:'record',
  device:'telemetry',crash:'telemetry',telemetry:'telemetry',metricsDay:'telemetry'};
/* the fraction of the quota at which each class stops being written; voice has no line */
const CH_TIER={telemetry:0.72,record:0.84,state:0.92};
let chBudget={docs:0,limit:25000,bypass:false},chAlarmedAt=0;const chDenied={};
function chAllowed(cls){if(cls==='voice'||chBudget.bypass)return true;const lim=CH_TIER[cls];return !lim||chBudget.docs<lim*chBudget.limit;}
function chAlarm(code){chBudget.docs=chBudget.limit;if(Date.now()-chAlarmedAt<3600000)return;chAlarmedAt=Date.now();fail('P_DB_FULL',null,code);
  /* said from the page's own queue, not written to the inbox - the inbox is exactly what might be full */
  queueLocal({id:'ch-full-'+Date.now(),kind:'say',priority:'urgent',speaker:'ליבה',topic:'המסד',text:'המסד מלא. הפסקתי לרשום טלמטריה ויומנים כדי שהדיבור ימשיך.'});}
function ch(ref,op,body,cls,what){
  if(!chAllowed(cls)){chDenied[cls]=(chDenied[cls]||0)+1;return Promise.reject({code:'budget',cls:cls,what:what});}
  let pr;try{pr=op==='set'?ref.set(body):op==='update'?ref.update(body):ref.delete();}catch(e){pr=Promise.reject(e);}
  return Promise.resolve(pr).catch(e=>{const c=String(e&&(e.code||e.name)||e);if(/quota|resource.?exhausted/i.test(c))chAlarm(c);throw e;});}
function guardDoc(ref,cls,what){return {ref:ref,path:ref.path,get:()=>ref.get(),onSnapshot:(a,b)=>ref.onSnapshot(a,b),collection:n=>guardCol(ref.collection(n),cls,what),
  set:d=>ch(ref,'set',d,cls,what),update:d=>ch(ref,'update',d,cls,what),delete:()=>ch(ref,'delete',null,cls,what)};}
function guardCol(ref,cls,what){return {ref:ref,path:ref.path,get:()=>ref.get(),onSnapshot:(a,b)=>ref.onSnapshot(a,b),doc:id=>guardDoc(ref.doc(id),cls,what)};}
const P=Object.fromEntries(Object.entries(P_RAW).map(([k,f])=>[k,(...a)=>{const r=f(...a);const cls=CLS_OF[k]||'record';return typeof r.set==='function'?guardDoc(r,cls,k):guardCol(r,cls,k);}]));
window.__ch={budget:()=>Object.assign({},chBudget),denied:()=>Object.assign({},chDenied)};
/* text from the database goes into the DOM through this, never raw: a task title is written by other
   sessions, and "<img onerror=…>" in one would otherwise run inside the page that holds the channel */
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
