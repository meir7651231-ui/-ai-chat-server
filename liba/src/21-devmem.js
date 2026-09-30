// @anchor: devmem
// device-mem: the page's memory, mirrored on the phone; what the phone kept while the page was down, taken back
/* Step device-mem. The page is the source of truth; the bubble keeps a copy (MemoryStore.kt) so "מי זה דני" and "מה אתה
   זוכר על X" are answered when the page is dead, and "תזכור ש…" is kept on the phone until the page is back.
     memSync (page -> app): the 500 live facts used most (never sensitivity 3), the person cards, the policy rules -
       after hello and two seconds after any change, only to a bubble that says it has 'mem'.
     memAsk (app -> page): the pending remembers, each {id, text, at}. Each is stored like "תזכור" said here, with
       source device. When the page holds a different value for the same key and its value is newer than the phone's
       sentence, the page keeps its own - last writer wins - and the loser is kept in memory/conflicts, read aloud once a
       week. Then memAck with every id, including the ones that lost: nothing is asked twice. */
const DEVMEM_FACTS=500,DEVMEM_DEBOUNCE=2000,CONFLICT_SAY=7*864e5;let devMemT=null;
function devMemDirty(){if(!appMode||!hasCap('mem'))return;clearTimeout(devMemT);devMemT=setTimeout(devMemSend,DEVMEM_DEBOUNCE);}
async function devMemSnapshot(now){now=now||Date.now();const all=(await MEM.all()).filter(f=>memLive(f,now)&&(+f.sens||0)<3)
    .sort((a,b)=>(+b.uses||0)-(+a.uses||0)||(+b.updatedAt||0)-(+a.updatedAt||0)).slice(0,DEVMEM_FACTS);
  let ps=[];try{ps=await PEOPLE.all();}catch(e){}
  return {at:now,facts:all.map(f=>({key:f.key,raw:(r=>r.charAt(0)==='ש'&&r.length>3?r.slice(1):r)(String(f.raw||f.value||'')).slice(0,300),kind:f.kind||'fact',uses:+f.uses||1,updatedAt:+f.updatedAt||0,expiresAt:+f.expiresAt||0})),
    people:ps.map(p=>({key:p.key,name:p.name,aliases:p.aliases||[],relation:p.relation||'',updatedAt:+p.updatedAt||0})),rules:(POLICY.rules||[]).map(r=>r.text)};}
async function devMemSend(){proSchedule();if(!db||!appMode||!hasCap('mem'))return;try{post(PROTO.toApp.memSync,{body:JSON.stringify(await devMemSnapshot())});}catch(e){fail('P_DB_READ',e,'memSync');}}
async function devMemIn(raw){let items=[];try{items=JSON.parse(String(raw||'[]'));}catch(e){fail('P_MSG_BAD',e,'memAsk');return;}if(!Array.isArray(items)||!db)return;const ids=[];let lost=0;
  for(const it of items.slice(0,200)){const id=String(it.id||''),text=String(it.text||'').slice(0,600),at=+it.at||Date.now();if(!id||!text)continue;
    try{const f=MEM.parse(text),k=MEM.key(f);const g=await P.fact(k).get();const cur=g.exists?(g.data()||{}):null;
      if(cur&&cur.state==='live'&&cur.value!==f.value&&(+cur.updatedAt||0)>at){lost++;
        await P.conflict(id).set({key:k,kept:cur.value,lost:f.value,lostText:text,keptAt:+cur.updatedAt||0,lostAt:at,at:Date.now(),from:'device'});}
      else{const r=await MEM.put(f,{type:'device',at:at,id:id});
        if(r.replaced)await P.conflict(id).set({key:k,kept:f.value,lost:cur.value,lostText:'',keptAt:at,lostAt:+cur.updatedAt||0,at:Date.now(),from:'page'});}
      ids.push(id);}catch(e){fail('P_DB_WRITE',e,'memAsk');}}
  post(PROTO.toApp.memAck,{ids:ids});if(ids.length){sayLocal('קיבלתי מהטלפון '+(ids.length===1?'דבר אחד':ids.length+' דברים')+' שביקשת לזכור כשהייתי מנותקת'+(lost?(lost===1?', ואחד מהם סתר משהו חדש יותר, אז שמרתי את החדש.':', ו-'+lost+' מהם סתרו משהו חדש יותר, אז שמרתי את החדש.'):'.'));devMemDirty();}
  return {ids:ids.length,lost:lost};}
/* once a week: the conflicts, in one sentence */
async function conflictsWeekly(now){now=now||Date.now();if(!db)return false;let last=0;try{last=+localStorage.getItem(LSK('conflictsSaid'))||0;}catch(e){}if(now-last<CONFLICT_SAY)return false;
  let rs=[];try{rs=(await coldGet(P.conflicts(),[['at','>',last]],50)).docs.map(d=>d.data()||{});}catch(e){return false;}
  try{localStorage.setItem(LSK('conflictsSaid'),String(now));}catch(e){}if(!rs.length)return false;
  sayLocal('השבוע '+(rs.length===1?'הייתה סתירה אחת':'היו '+rs.length+' סתירות')+' בין הטלפון לדף: '+rs.slice(0,3).map(r=>'שמרתי "'+String(r.kept).slice(0,30)+'" ולא "'+String(r.lost).slice(0,30)+'"').join('; ')+'.');return true;}
window.__devmem={snapshot:devMemSnapshot,in:devMemIn,send:devMemSend,weekly:conflictsWeekly};

/* reflex-core: the bubble answered a question itself (time, date, battery, network). Both sides go to the turn log with
   by:'reflex', so "על מה דיברנו" and the weekly count see them - the words through the same door as every other turn */
function reflexIn(d){if(!db||!memSettings.logTurns)return;const q=String(d.q||'').slice(0,200),a=String(d.a||'').slice(0,300),k=String(d.kind||'');if(!q||!a)return;const t=Date.now();
  try{P.turns().doc(mintId()).set({from:'user',speaker:'מאיר',text:dbText(q),cls:classify(q),by:'reflex',kind:k,ts:t}).catch(e=>fail('P_DB_WRITE',e,'reflex'));
    P.turns().doc(mintId()).set({from:'liba',speaker:'ליבה',kind:'say',text:dbText(a),cls:classify(a),by:'reflex',ts:t+1}).catch(e=>fail('P_DB_WRITE',e,'reflex'));}catch(e){fail('P_DB_WRITE',e,'reflex');}}
