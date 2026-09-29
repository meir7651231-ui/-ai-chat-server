// @anchor: memory
// mem-core: a store of facts instead of a list of notes - deterministic keys, a small Hebrew parser, forget as a tomb
/* Step mem-core. memory/facts/items/<key>, key = slug(subject)+'.'+slug(predicate): the same fact said twice is one
   document (its uses go up), and two writes in one millisecond can no longer overwrite each other. The raw sentence is
   always kept; a sentence the parser does not understand is still stored - as kind 'note' with confidence 0.3, never
   as a wrong triple. Forget is a tomb for 30 days (the janitor clears it after), so a mistaken "תשכח" can be undone.
   memory/notes and memory/prefs move over once (MEM.migrate, under a lease), and stay behind as tombs for 30 days. */
const MEM_TOMB_DAYS=30,MEM_ONE=['הוא','זהות','גר','גרה','עובד','עובדת','לומד','לומדת'];
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
  /* single-valued predicates ("X הוא Y": one answer, a new one corrects the old) key on subject.predicate; the rest
     ("יש לי X", preferences, notes) can hold many values, so the value is part of the key - found by recall7, where
     every "יש לי" overwrote the one before */
  key(f){const one=MEM_ONE.indexOf(f.predicate)>=0||f.kind==='event';return slug(f.subject)+'.'+slug(f.predicate)+(one?'':'.'+hash36(inorm(f.value)));},
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
/* mem-brief: every sentence that goes out carries Meir with it - but only what is relevant, and never first.
   After the sentence (the [ליבה] tag at the start is what other sessions route on) and before the ⟦#id⟧ mark:
   "[הקשר#<hash>]" and up to six facts ranked by shared words x confidence x freshness, the identity card's line when
   it is relevant, preferences that bound the answer. Nothing sensitive (sens>=2), a hard cap of 700 characters,
   nothing at all when nothing matches, and "בלי הקשר" skips it for the next sentence. */
const BRIEF_MAX=700,BRIEF_FACTS=6;let briefSkip=false,identityCard=null;
/* a rare word (a name) weighs more than a common one ("לי" is in every "יש לי" fact): inverse document frequency */
function memIdf(all){const df={},N=all.length||1;for(const f of all)for(const x of new Set(memWords([f.subject,f.predicate,f.value,f.raw].join(' '))))df[x]=(df[x]||0)+1;
  return x=>Math.log(1+N/(df[x]||N));}
function memScore(f,w,now,idf){const hay=memWords([f.subject,f.predicate,f.value,f.raw].join(' '));let hit=0;for(const x of w)if(hay.indexOf(x)>=0)hit+=idf?idf(x):1;
  if(!hit)return 0;const age=(now-(+f.updatedAt||+f.ts||now))/864e5;return hit*(+f.conf||0.5)*Math.pow(0.5,age/30)*(f.kind==='pref'?1.2:1);}
async function brief(text){if(briefSkip){briefSkip=false;return '';}if(!db)return '';const w=memWords(text);if(!w.length)return '';
  let all=[];try{all=(await MEM.all()).filter(f=>f.state!=='tomb'&&(+f.sens||0)<2);}catch(e){return '';}
  let who=[];try{who=(await PEOPLE.resolve(text)).map(p=>p.name);}catch(e){}
  const now=Date.now(),idf=memIdf(all);const top=all.map(f=>({f,s:memScore(f,w,now,idf)*(who.some(n=>(f.raw||'').indexOf(n)>=0)?1.5:1)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,BRIEF_FACTS).map(x=>x.f);
  if(!top.length)return '';
  const lines=top.map(f=>'- '+(f.raw||f.subject+' '+f.predicate+' '+f.value).replace(/^ש/,''));
  let out='[הקשר#'+hash36(lines.join('|'))+'] '+lines.join(' ');if(out.length>BRIEF_MAX)out=out.slice(0,BRIEF_MAX-1)+'…';
  for(const f of top){P.fact(f.key).update({uses:(+f.uses||0)+1,lastUsed:now}).catch(()=>{});}
  return '\n\n'+out;}
function memNoBrief(){briefSkip=true;sayLocal('בסדר, המשפט הבא ילך בלי הקשר.');return true;}
function memIdentity(rest,m){const card=m.t.slice(0,400);P.identity().set({card:card,updatedAt:Date.now()}).then(()=>sayLocal('שמרתי את כרטיס הזהות.')).catch(e=>fail('P_DB_WRITE',e,'memory/identity'));
  MEM.put({subject:'מאיר',predicate:'זהות',value:card,kind:'fact',conf:1,raw:card},{type:'said'}).catch(()=>{});return true;}
setTimeout(()=>{if(db)MEM.migrate().catch(e=>fail('P_DB_WRITE',e,'migrate'));},15000);
window.__mem=MEM;
