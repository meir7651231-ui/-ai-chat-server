// @anchor: db
// boot: every live subscription to the channel database
/* windowed-reads: no live read of a whole collection. Each is a bounded window (at most 160 documents in all,
   whatever the age of the channel), fed by docChanges() so one ack is one delta, not a re-read of everything.
   The store scans without indexes, so a big collection can answer resource_exhausted: the window then narrows
   to WIN_NARROW once and says so in the black box, instead of going dark. */
const WIN={inboxOpen:50,inboxNew:20,tasks:40,sessions:20,gallery:30},WIN_NARROW=12;
function watch(name,build,n,onDocs,onErr){const map=new Map();let unsub=null,narrowed=false;
  const go=k=>{map.clear();unsub=build(k).onSnapshot(q=>{q.docChanges().forEach(c=>{if(c.type==='removed')map.delete(c.doc.id);else map.set(c.doc.id,Object.assign({id:c.doc.id},c.doc.data()));});onDocs(map);},
    e=>{if(e&&e.code==='resource_exhausted'&&!narrowed&&k>WIN_NARROW){narrowed=true;fail('P_DB_WINDOW',e,name+' '+k+'>'+WIN_NARROW);try{unsub&&unsub();}catch(x){}go(WIN_NARROW);return;}onErr(e);});};
  go(n);}
/* cold path: a one-shot bounded read for anything outside a window (what was asked today, what is remembered) */
function coldGet(ref,where,n){let q=ref;(where||[]).forEach(w=>{q=q.where(w[0],w[1],w[2]);});return q.limit(n||500).get();}
/* the inbox is two windows, because a where never matches a document that lacks the field: every unspoken
   message that says spoken:false, plus the newest few whatever they say - so a writer that forgot the field
   (the real channel had one: an update command) is still heard. */
let inboxOpen=new Map(),inboxNew=new Map();
function inboxMerged(){const m=new Map(inboxNew);inboxOpen.forEach((v,k)=>m.set(k,v));return [...m.values()];}
function onInbox(){pikuachCheck(inboxMerged());const items=inboxMerged().filter(d=>{if(d.spoken||d.expired||d.failed||!(d.text||d.kind==='cmd'||d.stream))return false;if(spokenDone(d.id)){P.inboxDoc(d.id).update({spoken:true,spokenAt:Date.now(),repaired:true}).catch(e=>fail('P_ACK',e,'repair'));return false;}return !spokenLocal.has(d.id);}).sort((a,b)=>(a.ts||0)-(b.ts||0));const live=new Set(items.map(d=>d.id));for(let i=inboxQ.length-1;i>=0;i--){if(!inboxQ[i].local&&!live.has(inboxQ[i].id))inboxQ.splice(i,1);}items.forEach(d=>{if(!inboxQ.some(x=>x.id===d.id))inboxQ.push(d);});pump();}
(async()=>{
  const c=window.claude;
  if(!c||!c.use){setSt('אין חיבור','warn');log('הדף צריך להיפתח מ‑claude.ai');return;}
  db=await c.use('db');comments=await c.use('comments');
  if(!db){setSt('אין מסד','warn');log('db לא זמין בתצוגה הזו');return;}
  setSt('מחובר','on');
  watch('gallery',k=>P.gallery().orderBy('ts','desc').limit(k),WIN.gallery,m=>{galleryList=[...m.values()].sort((a,b)=>(b.ts||0)-(a.ts||0));},e=>fail('P_DB_READ',e,'gallery'));
  P.budget().onSnapshot(s=>{const d=(s.exists&&s.data())||{};chBudget={docs:+d.docs||0,limit:+d.limit||25000,bypass:!!d.bypass};},e=>fail('P_DB_READ',e,'channel/budget'));
  P.settings().onSnapshot(s=>{if(s.exists&&s.data())memSettings=Object.assign(memSettings,s.data());},e=>fail('P_DB_READ',e,'memory/settings'));
  watch('sessions',k=>P.sessions().orderBy('updatedAt','desc').limit(k),WIN.sessions,m=>{sessionsList=[...m.values()].sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));renderMap();},e=>fail('P_DB_READ',e,'sessions'));
  /* newest-updated first: a task that changes becomes the newest, so no transition can fall outside the window */
  watch('tasks',k=>P.tasks().orderBy('updatedAt','desc').limit(k),WIN.tasks,m=>{const list=[...m.values()].filter(t=>t.status!=='archived').sort((a,b)=>((b.priority||0)-(a.priority||0))||((b.updatedAt||0)-(a.updatedAt||0)));
    /* step 42: lifecycle in voice – the board itself announces blocked/done, once */
    if(taskSeen){list.forEach(t=>{const prev=taskPrev[t.id];if(prev&&prev!==t.status){if(t.status==='blocked')queueLocal({taskId:t.id,id:'task-'+t.id+'-blocked-'+(t.updatedAt||0),kind:'stuck',speaker:'הלוח',topic:t.title,text:'המשימה '+t.title+' תקועה ומחכה לך'+(t.question?': '+t.question:'.'),options:t.options||[]});
      else if(t.status==='done')queueLocal({taskId:t.id,id:'task-'+t.id+'-done-'+(t.updatedAt||0),kind:'done',speaker:'הלוח',topic:t.title,text:'המשימה '+t.title+' נגמרה.'+(t.link?' יש תוצאה – תגיד תפתח.':'')});
      else if(t.status==='running'&&prev==='queued')queueLocal({taskId:t.id,id:'task-'+t.id+'-run-'+(t.updatedAt||0),kind:'say',speaker:'הלוח',topic:t.title,text:'המשימה '+t.title+' התחילה לרוץ.'});}});}
    taskPrev={};list.forEach(t=>taskPrev[t.id]=t.status);taskSeen=true;lastTasks=list;renderTasks(list);},e=>{fail('P_DB_READ',e,'tasks');log('tasks: '+e.code);});
  P.quiet().onSnapshot(s=>{quietUntil=(s.exists&&s.data()&&s.data().until)||0;if(quietUntil>Date.now())log('שקט עד '+new Date(quietUntil).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}));pump();},e=>fail('P_DB_READ',e,'channel/quiet'));
  P.brief().onSnapshot(briefIn,e=>fail('P_DB_READ',e,'channel/brief'));
  P.rosterItems().onSnapshot(q=>{const m=new Map();q.docs.forEach(d=>m.set(d.id,d.data()||{}));rosterIn(m);},e=>fail('P_DB_READ',e,'brain/roster'));
  P.owner().onSnapshot(s=>{ownerFromDb((s.exists&&s.data())||{});},e=>fail('P_DB_READ',e,'channel/owner'));
  watch('inbox-open',k=>P.inbox().where('spoken','==',false).orderBy('ts','asc').limit(k),WIN.inboxOpen,m=>{inboxOpen=m;onInbox();},e=>{fail('P_DB_READ',e,'inbox');log('inbox: '+e.code);});
  watch('inbox-new',k=>P.inbox().orderBy('ts','desc').limit(k),WIN.inboxNew,m=>{inboxNew=m;onInbox();},e=>{fail('P_DB_READ',e,'inbox');log('inbox: '+e.code);});
  P.current().onSnapshot(s=>{if(!s.exists)return;let d=s.data();if(!d||!d.id||d.id===seen||d.spoken)return;d=Object.assign({from:'manager',legacy:true},d);if(!isArmed()){cur=d;H.textContent='יש הודעה';SUB.textContent='לחץ "התחל" כדי לשמוע';return;}incoming(d);},e=>{fail('P_DB_READ',e,'chat/current');setSt('שגיאה','warn');log('db: '+e.code);});
})();
