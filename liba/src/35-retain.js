// @anchor: retain
// retention-erasure: every record lives as long as its class, deletion is provable and undoable for a week, and the
// memory can be taken out whole - encrypted with a password Meir says
/* Step retention-erasure. Every collection already has a ceiling on age (channel-budget.json, the janitor); on top of
   it each record has a class, from the classification it was born with: ops (the system talking about itself) 30 days,
   personal 180, mosad (the institution) 90, health 14 - memory/retention may change them. retainSweep() runs after the
   janitor: what outlived its class goes to memory/trash/items first (seven days), and the ledger gets a receipt with a
   count per collection. "תחזיר מה שמחקת אתמול" puts back what the sweep removed since yesterday morning. "תשכח הכול על
   X" (20-forget) remains the targeted erase. "תייצא את הזיכרון [על X] בסיסמה Y" builds one JSON of everything held
   (on X), encrypts it with the password (PBKDF2, 200 000 rounds, AES-256-GCM) and keeps only the ciphertext in
   memory/exports/items - node tools/export-open.mjs opens it into JSON and a readable Hebrew page. */
const RETAIN_DEF={ops:30,personal:180,mosad:90,health:14};
const RETAIN_COLS=[['decisions',()=>P.decisions(),'ts',d=>[d.question,d.answer].join(' ')],['req',()=>P.reqs(),'askedAt',d=>d.text],['work',()=>P.works(),'at',d=>d.text]];
function retainClass(d,text){const c=d.cls||classify(text||'');if(c.scope==='system')return 'ops';if(c.sens>=2&&CLS_HEALTH.test(text||''))return 'health';return c.scope==='institution'?'mosad':'personal';}
async function retainDays(){let x={};try{const g=await P.retention().get();x=g.exists?(g.data()||{}):{};}catch(e){fail('P_DB_READ',e,'memory/retention');}return Object.assign({},RETAIN_DEF,x.days||{});}
async function retainSweep(now){now=now||Date.now();if(!db)return null;const days=await retainDays(),min=Math.min(...Object.values(days)),counts={};let n=0;
  for(const [name,col,tf,textOf] of RETAIN_COLS){let rows=[];try{rows=(await coldGet(col(),[[tf,'<',now-min*864e5]],200)).docs.map(d=>({id:d.id,data:d.data()||{}}));}catch(e){fail('P_DB_READ',e,'retain '+name);continue;}
    for(const r of rows){const k=retainClass(r.data,textOf(r.data)),age=now-(+r.data[tf]||now);if(age<days[k]*864e5)continue;
      try{await P.trashItem(name+'-'+r.id).set({col:name,docId:r.id,data:r.data,klass:k,at:now});await col().doc(r.id).delete();counts[name]=(counts[name]||0)+1;n++;}catch(e){fail('P_DB_WRITE',e,'retain '+name);}}}
  if(n)Ledger.record({action:'erase',cause:'retention',inputs:counts,result:n});return {n,counts};}
async function retainRestore(since){let rows=[];try{rows=(await coldGet(P.trash(),[['at','>=',since]],300)).docs.map(d=>Object.assign({tid:d.id},d.data()||{}));}catch(e){fail('P_DB_READ',e,'trash');return null;}
  const cols=Object.fromEntries(RETAIN_COLS.map(c=>[c[0],c[1]]));let n=0;
  for(const t of rows){const col=cols[t.col];if(!col)continue;try{await col().doc(t.docId).set(t.data);await P.trashItem(t.tid).delete();n++;}catch(e){fail('P_DB_WRITE',e,'restore');}}
  Ledger.record({action:'restore',cause:'voice',result:n});return n;}
function retainUndo(){const y=new Date();y.setDate(y.getDate()-1);y.setHours(0,0,0,0);
  retainRestore(y.getTime()).then(n=>sayLocal(n==null?'לא הצלחתי לקרוא את הפח.':n?'החזרתי '+n+(n===1?' רשומה':' רשומות')+' שנמחקו מאז אתמול.':'לא נמחק כלום מאז אתמול.'));return true;}
/* the export: everything held (on a subject), one JSON, encrypted with a spoken password */
async function exportGather(q){const out={subject:q||'',at:Date.now(),facts:[],people:[],decisions:[],turns:[]};const w=q?memWords(q).map(x=>x.length>=3&&x[0]==='ה'?x.slice(1):x):[];
  const has=t=>!w.length||(()=>{const h=' '+memWords(String(t||'')).join(' ')+' '+String(t||'');return w.every(x=>h.indexOf(x)>=0);})();
  (await MEM.all()).filter(f=>f.state!=='tomb'&&has([f.subject,f.predicate,f.value,f.raw].join(' '))).forEach(f=>out.facts.push({text:f.raw||f.value,subject:f.subject||'',at:f.createdAt||f.at||0}));
  (await PEOPLE.all()).filter(p=>has([p.name].concat(p.aliases||[]).join(' '))).forEach(p=>out.people.push({name:p.name,aliases:p.aliases||[],relation:p.relation||''}));
  try{(await coldGet(P.decisions(),null,500)).docs.forEach(d=>{const x=d.data()||{};if(has(x.question+' '+x.answer))out.decisions.push({q:x.question,a:x.answer,at:x.ts});});}catch(e){}
  try{(await coldGet(P.turns(),null,500)).docs.forEach(d=>{const x=d.data()||{};if(has(x.text))out.turns.push({who:x.speaker||x.from,text:x.text,at:x.ts});});}catch(e){}
  return out;}
async function exportSeal(obj,pass){const enc=new TextEncoder(),salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const base=await crypto.subtle.importKey('raw',enc.encode(pass),'PBKDF2',false,['deriveKey']);
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:200000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt']);
  const ct=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(obj))));const b64=u=>btoa(String.fromCharCode(...u));
  return {v:1,kdf:'PBKDF2-SHA256-200000',salt:b64(salt),iv:b64(iv),ct:b64(ct)};}
function exportAll(rest){let t=' '+inorm(rest||'')+' ';const pi=t.indexOf(' בסיסמה ');if(pi<0){sayLocal('בשביל לייצא צריך סיסמה: תגיד "תייצא את הזיכרון בסיסמה" ואז את הסיסמה. בלעדיה הקובץ לא נפתח.');return true;}
  const pass=t.slice(pi+8).trim();t=t.slice(0,pi);const q=(t.trim().indexOf('על ')===0?t.trim().slice(3):t.trim()).trim();
  if(pass.length<4){sayLocal('הסיסמה קצרה מדי. לפחות ארבע אותיות.');return true;}
  (async()=>{const obj=await exportGather(q);const n=obj.facts.length+obj.people.length+obj.decisions.length+obj.turns.length;const id='x-'+mintId();
    await P.exportItem(id).set(Object.assign({at:Date.now(),subject:q,n},await exportSeal(obj,pass)));Ledger.record({action:'export',cause:'voice',inputs:{subject:q,n},result:id});
    sayLocal('ייצאתי '+n+' פריטים'+(q?' על '+q:'')+', מוצפנים בסיסמה שאמרת. הקובץ בערוץ, ב-memory/exports, בשם '+id.slice(-6)+'. בלי הסיסמה אף אחד לא יפתח אותו.');})()
    .catch(e=>{fail('P_DB_WRITE',e,'export');sayLocal('הייצוא נכשל.');});return true;}
window.__retain={sweep:retainSweep,restore:retainRestore,classOf:retainClass,gather:exportGather,seal:exportSeal,defaults:RETAIN_DEF};
