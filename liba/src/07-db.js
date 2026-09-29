// @anchor: db
// boot: every live subscription to the channel database
(async()=>{
  const c=window.claude;
  if(!c||!c.use){setSt('אין חיבור','warn');log('הדף צריך להיפתח מ‑claude.ai');return;}
  db=await c.use('db');comments=await c.use('comments');
  if(!db){setSt('אין מסד','warn');log('db לא זמין בתצוגה הזו');return;}
  setSt('מחובר','on');
  P.gallery().onSnapshot(q=>{galleryList=q.docs.map(d=>Object.assign({id:d.id},d.data())).sort((a,b)=>(b.ts||0)-(a.ts||0));},e=>fail('P_DB_READ',e,'gallery'));
  P.settings().onSnapshot(s=>{if(s.exists&&s.data())memSettings=Object.assign(memSettings,s.data());},e=>fail('P_DB_READ',e,'memory/settings'));
  P.sessions().onSnapshot(q=>{sessionsList=q.docs.map(d=>Object.assign({id:d.id},d.data())).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));renderMap();},e=>fail('P_DB_READ',e,'sessions'));
  P.tasks().onSnapshot(q=>{const list=q.docs.map(d=>Object.assign({id:d.id},d.data())).filter(t=>t.status!=='archived').sort((a,b)=>((b.priority||0)-(a.priority||0))||((b.updatedAt||0)-(a.updatedAt||0)));
    /* step 42: lifecycle in voice – the board itself announces blocked/done, once */
    if(taskSeen){list.forEach(t=>{const prev=taskPrev[t.id];if(prev&&prev!==t.status){if(t.status==='blocked')queueLocal({id:'task-'+t.id+'-blocked-'+(t.updatedAt||0),kind:'stuck',speaker:'הלוח',topic:t.title,text:'המשימה '+t.title+' תקועה ומחכה לך'+(t.question?': '+t.question:'.'),options:t.options||[]});
      else if(t.status==='done')queueLocal({id:'task-'+t.id+'-done-'+(t.updatedAt||0),kind:'done',speaker:'הלוח',topic:t.title,text:'המשימה '+t.title+' נגמרה.'+(t.link?' יש תוצאה – תגיד תפתח.':'')});
      else if(t.status==='running'&&prev==='queued')queueLocal({id:'task-'+t.id+'-run-'+(t.updatedAt||0),kind:'say',speaker:'הלוח',topic:t.title,text:'המשימה '+t.title+' התחילה לרוץ.'});}});}
    taskPrev={};list.forEach(t=>taskPrev[t.id]=t.status);taskSeen=true;lastTasks=list;renderTasks(list);},e=>{fail('P_DB_READ',e,'tasks');log('tasks: '+e.code);});
  P.quiet().onSnapshot(s=>{quietUntil=(s.exists&&s.data()&&s.data().until)||0;if(quietUntil>Date.now())log('שקט עד '+new Date(quietUntil).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}));pump();},e=>fail('P_DB_READ',e,'channel/quiet'));
  P.owner().onSnapshot(s=>{const d=(s.exists&&s.data())||{};if((d.since||0)<ownerSince)return;ownerSince=d.since||ownerSince;owner=d.owner||'liba';setSt(owner==='manager'?'על הקו: המנהל':'על הקו: ליבה','on');},e=>fail('P_DB_READ',e,'channel/owner'));
  P.inbox().onSnapshot(q=>{const items=q.docs.map(d=>Object.assign({id:d.id},d.data())).filter(d=>{if(d.spoken||d.expired||!(d.text||d.kind==='cmd'))return false;if(spokenDone(d.id)){P.inboxDoc(d.id).update({spoken:true,spokenAt:Date.now(),repaired:true}).catch(e=>fail('P_ACK',e,'repair'));return false;}return !spokenLocal.has(d.id);}).sort((a,b)=>(a.ts||0)-(b.ts||0));const live=new Set(items.map(d=>d.id));for(let i=inboxQ.length-1;i>=0;i--){if(!inboxQ[i].local&&!live.has(inboxQ[i].id))inboxQ.splice(i,1);}items.forEach(d=>{if(!inboxQ.some(x=>x.id===d.id))inboxQ.push(d);});pump();},e=>{fail('P_DB_READ',e,'inbox');log('inbox: '+e.code);});
  P.current().onSnapshot(s=>{if(!s.exists)return;let d=s.data();if(!d||!d.id||d.id===seen||d.spoken)return;d=Object.assign({from:'manager',legacy:true},d);if(!isArmed()){cur=d;H.textContent='יש הודעה';SUB.textContent='לחץ "התחל" כדי לשמוע';return;}incoming(d);},e=>{fail('P_DB_READ',e,'chat/current');setSt('שגיאה','warn');log('db: '+e.code);});
})();
