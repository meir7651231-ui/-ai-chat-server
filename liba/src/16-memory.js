// @anchor: memory
// mem-core: a store of facts instead of a list of notes - deterministic keys, a small Hebrew parser, forget as a tomb
/* Step mem-core. memory/facts/items/<key>, key = slug(subject)+'.'+slug(predicate): the same fact said twice is one
   document (its uses go up), and two writes in one millisecond can no longer overwrite each other. The raw sentence is
   always kept; a sentence the parser does not understand is still stored - as kind 'note' with confidence 0.3, never
   as a wrong triple. Forget is a tomb for 30 days (the janitor clears it after), so a mistaken "תשכח" can be undone.
   memory/notes and memory/prefs move over once (MEM.migrate, under a lease), and stay behind as tombs for 30 days. */
const MEM_TOMB_DAYS=30;
const slug=t=>inorm(t).replace(/[^0-9a-zא-ת ]/gi,'').trim().replace(/ /g,'_').slice(0,60)||'x';
function hash36(s){let h=5381;for(let i=0;i<s.length;i++)h=((h<<5)+h+s.charCodeAt(i))>>>0;return h.toString(36);}
/* the parser: the few shapes Meir actually uses. Anything else is a note - raw kept, low confidence */
const MEM_SHAPES=[
  [/^(.+?) (הוא|היא|הם|הן) (.+)$/,m=>({subject:m[1],predicate:'הוא',value:m[3],kind:/^(ה?בן|ה?בת|ה?אח|ה?אחות|ה?אבא|ה?אמא|ה?אשתי|ה?רואה חשבון|ה?עורך דין)/.test(m[1])||/^[א-ת]+ (הוא|היא) ה?(בן|בת|אח|אחות|אבא|אמא|אשתי|רואה|עורך|לקוח|שכן|מנהל)/.test(m[0])?'person':'fact',conf:0.8})],
  [/^יש לי (.+)$/,m=>({subject:'אני',predicate:'יש לי',value:m[1],kind:'fact',conf:0.8})],
  [/^אני (גר|גרה|עובד|עובדת|לומד|לומדת) (ב.+)$/,m=>({subject:'אני',predicate:m[1],value:m[2],kind:'fact',conf:0.8})],
  [/^(.+?) (מתגייס|מתחתן|נולד|נולדה|מגיע|מגיעה|נוסע|נוסעת|חוזר|חוזרת) (.+)$/,m=>({subject:m[1],predicate:m[2],value:m[3],kind:'event',conf:0.7})],
];
const MEM_PREF=[/^(אל תשאל|אל תשאלי) אותי (על|לגבי) (.+)$/,/^(תמיד|אף פעם) (.+)$/];
const MEM={
  parse(raw){const t=inorm(raw).replace(/^ש/,'');for(const [re,f] of MEM_SHAPES){const m=t.match(re);if(m){const x=f(m);return Object.assign(x,{raw:raw});}}
    for(const re of MEM_PREF){const m=t.match(re);if(m)return {subject:'מאיר',predicate:'העדפה',value:t,kind:'pref',conf:0.9,raw:raw};}
    return {subject:'הערה',predicate:hash36(t),value:t,kind:'note',conf:0.3,raw:raw};},
  key(f){return slug(f.subject)+'.'+slug(f.predicate);},
  sens(f){return f.kind==='person'||/(בן|בת|אשתי|בריאות|רופא|כסף|חוב|משכורת|סיסמה)/.test(f.raw||'')?1:0;},
  /* put: one document per key; the same fact again only counts a use; a new value for the key replaces it, and the
     old value is kept in prev so a correction is visible */
  async put(f,source){const k=MEM.key(f),ref=P.fact(k),now=Date.now();let cur=null;try{const g=await ref.get();cur=g.exists?(g.data()||{}):null;}catch(e){fail('P_DB_READ',e,'fact');}
    if(cur&&cur.state!=='tomb'&&cur.value===f.value){await ref.update({uses:(+cur.uses||0)+1,lastUsed:now,updatedAt:now});return {key:k,same:true};}
    const doc={subject:f.subject,predicate:f.predicate,value:f.value,raw:f.raw||f.value,kind:f.kind,conf:f.conf,sens:f.sens!=null?f.sens:MEM.sens(f),
      source:Object.assign({type:'said',at:now},source||{}),ts:cur&&cur.ts||now,updatedAt:now,uses:1,lastUsed:now,state:'live'};
    if(cur&&cur.state!=='tomb'&&cur.value!==f.value)doc.prev={value:cur.value,at:cur.updatedAt||cur.ts};
    await ref.set(doc);return {key:k,same:false,replaced:!!doc.prev};},
  async all(){const r=await coldGet(P.facts(),null,1000);return r.docs.map(d=>Object.assign({key:d.id},d.data()||{}));},
  /* query: every word of q (without the Hebrew prefixes ב/ל/כ/ו/ש/ה/מ) found in the fact - live ones only */
  async query(q){const w=memWords(q);const all=(await MEM.all()).filter(f=>f.state!=='tomb');if(!w.length)return all;
    return all.filter(f=>{const hay=memWords([f.subject,f.predicate,f.value,f.raw].join(' ')).join(' ');return w.every(x=>hay.indexOf(x)>=0);});},
  async recent(n){return (await MEM.all()).filter(f=>f.state!=='tomb').sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).slice(0,n||8);},
  async forget(q){const hits=await MEM.query(q);for(const f of hits){try{await P.fact(f.key).update({state:'tomb',tombAt:Date.now()});}catch(e){fail('P_DB_WRITE',e,'fact tomb');}}return hits;},
  /* one time: notes and prefs into facts. Under a lease on memory/meta, so two devices do not both move them */
  async migrate(){if(!db)return null;let meta={};try{const g=await P.memMeta().get();meta=(g.exists&&g.data())||{};}catch(e){return null;}
    if(+meta.schema>=2)return {skipped:true};
    try{const l=await P.memMeta().acquire({holder:PAGE_ID,ttlMs:60000});if(l&&l.acquired===false)return {busy:true};}catch(e){}
    let n=0,moved=0;for(const [col,kind] of [[P.notes(),'note'],[P.prefs(),'pref']]){const r=await coldGet(col,null,1000);
      for(const d of r.docs){const x=d.data()||{};if(x.state==='tomb'||!x.text)continue;n++;const f=kind==='pref'?{subject:'מאיר',predicate:'העדפה.'+d.id,value:x.text,kind:'pref',conf:0.9,raw:x.text}:MEM.parse(x.text);
        try{await MEM.put(f,{type:'migrated',from:col.path+'/'+d.id,at:+x.ts||Date.now()});await col.doc(d.id).update({state:'tomb',tombAt:Date.now(),movedTo:MEM.key(f)});moved++;}catch(e){fail('P_DB_WRITE',e,'migrate');}}}
    await P.memMeta().set({schema:2,migratedAt:Date.now(),found:n,moved:moved}).catch(e=>fail('P_DB_WRITE',e,'memory/meta'));return {found:n,moved:moved};}
};
/* the words of a text without Hebrew one-letter prefixes and final forms, for matching "לדני" with "דני" */
const FINAL={'ך':'כ','ם':'מ','ן':'נ','ף':'פ','ץ':'צ'};
function memWords(t){return inorm(t).split(' ').map(w=>w.replace(/[ךםןףץ]/g,c=>FINAL[c])).map(w=>w.length>3?w.replace(/^[בלכושהמ]{1,2}(?=[א-ת]{3})/,''):w).filter(w=>w.length>=2&&!['של','את','על','עם','זה','מה','הוא','היא'].includes(w));}
/* the commands, on top of MEM */
function memAbout(rest){const q=rest.trim();if(!q)return false;MEM.query(q).then(h=>{sayLocal(h.length?'על '+q+' אני יודעת: '+h.slice(0,5).map(f=>f.raw||f.value).join('; ')+'.':'אני לא יודעת כלום על '+q+'.');}).catch(e=>{fail('P_DB_READ',e,'facts');sayLocal('לא הצלחתי לקרוא את הזיכרון.');});return true;}
setTimeout(()=>{if(db)MEM.migrate().catch(e=>fail('P_DB_WRITE',e,'migrate'));},15000);
window.__mem=MEM;
