// @anchor: policy
// policy: a preference becomes behaviour - compiled from pref facts into rules the pump obeys
/* Step policy. Every live pref fact (memory/facts, kind pref) is compiled into a typed rule. A message a rule holds
   back is never lost: it is acked into memory/digest/items/<day> and read once in the evening, and "למה לא סיפרת לי"
   answers with the rule, its words and its date. Urgent is never muted, commands never, and Liba's own lines never (the board's lines can be).
   Rule types: never_ask, mute_topic, mute_person, mute_kind, urgent_only (hours), short, digest_topic, address, short_all, no_proactive. */
const HOUR_HE={'אחת':1,'שתיים':2,'שלוש':3,'ארבע':4,'חמש':5,'שש':6,'שבע':7,'שמונה':8,'תשע':9,'עשר':10,'אחת עשרה':11,'שתים עשרה':12};
const hourOf=w=>{w=String(w||'').trim();return /^\d+$/.test(w)?+w:(HOUR_HE[w]!=null?HOUR_HE[w]:null);};
const POLICY_SHAPES=[
  [/^(אל תשאל|אל תשאלי) אותי (על|לגבי) (.+)$/,m=>({type:'never_ask',topic:m[3]})],
  [/^(אל תספר|אל תספרי|אל תעדכן|אל תעדכני|בלי עדכונים) (לי |אותי )?(על|לגבי) (.+)$/,m=>({type:'mute_topic',topic:m[4]})],
  [/^(תשתיק|תשתיקי|השתק) (את )?(.+)$/,m=>({type:'mute_topic',topic:m[3]})],
  [/^(אל תעביר|אל תעבירי|בלי) (לי )?הודעות (מ|של )(.+)$/,m=>({type:'mute_person',person:m[4]})],
  [/^בלי הודעות על משימות שנגמרו$/,m=>({type:'mute_kind',kind:'done'})],
  [/^(אף פעם )?(אל תעיר|אל תעירי) אותי לפני (.+)$/,m=>({type:'urgent_only',from:0,to:hourOf(m[3])})],
  [/^(אף פעם )?(אל תעיר|אל תעירי) אותי אחרי (.+)$/,m=>({type:'urgent_only',from:hourOf(m[3])+12>23?hourOf(m[3]):hourOf(m[3])+(hourOf(m[3])<12?12:0),to:24})],
  [/^רק דחוף (בין|מ)(.+?) (ל|עד )(.+)$/,m=>({type:'urgent_only',from:hourOf(m[2]),to:hourOf(m[4])})],
  [/^(תאסוף|תאספי) (לי )?(את )?(.+) לערב$/,m=>({type:'digest_topic',topic:m[4]})],
  [/^(תקצר|תקצרי|בקצרה) (על|לגבי) (.+)$/,m=>({type:'short',topic:m[3]})],
  [/^(תמיד )?(תקצר|תקצרי|בקצרה)$/,m=>({type:'short_all'})],
  [/^(תקרא|תקראי) לי (.+)$/,m=>({type:'address',name:m[2]})],
  [/^(תפסיק|תפסיקי) להזכיר( לי)?( דברים)?$/,m=>({type:'no_proactive'})],
];
const POLICY={rules:[],at:0,
  compileOne(f){const t=inorm(f.value||f.raw||'');for(const [re,mk] of POLICY_SHAPES){const m=t.match(re);if(m){const r=mk(m);if(r.type==='urgent_only'&&(r.from==null||r.to==null))return null;return Object.assign(r,{id:'r-'+hash36(t),text:t,at:+f.updatedAt||+f.ts||Date.now(),key:f.key});}}return null;},
  async load(){try{const all=await MEM.all();this.rules=all.filter(f=>f.kind==='pref'&&f.state!=='tomb').map(f=>this.compileOne(f)).filter(Boolean);this.at=Date.now();}catch(e){fail('P_DB_READ',e,'policy');}return this.rules;},
  about(d,topic){const w=memWords(topic);if(!w.length)return false;const hay=memWords([d.topic,d.text].join(' ')).join(' ');return w.every(x=>hay.indexOf(x)>=0);},
  /* which rule holds this message back, if any - urgent, local and commands never */
  check(d,now){if((d.local&&d.speaker!=='הלוח'&&!d.proactive&&!d.sense)||d.kind==='cmd'||d.priority==='urgent')return null;const h=jHour(now||Date.now());
    for(const r of this.rules){
      if(r.type==='never_ask'&&(d.kind==='ask'||d.kind==='stuck')&&this.about(d,r.topic))return r;
      if((r.type==='mute_topic'||r.type==='digest_topic')&&this.about(d,r.topic))return r;
      if(r.type==='mute_person'){const who=memWords(r.person).join(' ');if(who&&(memWords(speakerOf(d)).join(' ').indexOf(who)>=0||memWords(d.from==='manager'?'המנהל':'').join(' ').indexOf(who)>=0))return r;}
      if(r.type==='mute_kind'&&d.kind===r.kind)return r;
      if(r.type==='no_proactive'&&d.proactive)return r;
      if(r.type==='urgent_only'&&(r.from<=r.to?(h>=r.from&&h<r.to):(h>=r.from||h<r.to)))return r;}
    return null;},
  shorten(d){const r=this.rules.find(x=>(x.type==='short'&&this.about(d,x.topic))||x.type==='short_all');if(!r||d.local)return null;const t=String(d.text||'');const cut=t.search(/[.!?](\s|$)/);
    if(cut<0||cut>t.length-20)return null;return {text:t.slice(0,cut+1)+' יש עוד - תגיד "תקריא את כל ההודעה".',full:t,rule:r};}
};
let lastShort=null;
async function digestAdd(d,r){const day=trDay(Date.now());try{await P.digest(day).update({items:{[d.id]:{text:String(d.text||'').slice(0,300),topic:d.topic||'',speaker:speakerOf(d),rule:r.id,ruleText:r.text,at:Date.now()}}});}
  catch(e){try{await P.digest(day).set({day:day,items:{[d.id]:{text:String(d.text||'').slice(0,300),topic:d.topic||'',speaker:speakerOf(d),rule:r.id,ruleText:r.text,at:Date.now()}}});}catch(x){fail('P_DB_WRITE',x,'digest');}}}
/* the evening: what was held back today, once, in two sentences */
let digestSaidDay='';
async function digestEvening(now){now=now||Date.now();const h=jHour(now),day=trDay(now);if(h<19||digestSaidDay===day||!db)return false;
  let g;try{g=await P.digest(day).get();}catch(e){return false;}const x=g.exists?(g.data()||{}):null;if(!x||x.readAt)return false;const items=Object.values(x.items||{});digestSaidDay=day;if(!items.length)return false;
  const by={};items.forEach(i=>{const k=i.topic||i.speaker||'אחר';by[k]=(by[k]||0)+1;});
  queueLocal({id:'digest-'+day,kind:'say',release:true,speaker:'ליבה',topic:'סיכום השתקות',text:'בזמן שהשתקת היום חיכו '+items.length+' הודעות: '+Object.entries(by).slice(0,4).map(([k,n])=>n+' על '+k).join(', ')+'. תגיד "למה לא סיפרת לי" כדי לשמוע למה.'});
  P.digest(day).update({readAt:now}).catch(()=>{});return true;}
function policyWhy(){(async()=>{const day=trDay(Date.now());const g=await P.digest(day).get();const x=g.exists?(g.data()||{}):null;const items=Object.values((x&&x.items)||{}).sort((a,b)=>b.at-a.at);
  if(!items.length){sayLocal('היום לא השתקתי כלום.');return;}const i=items[0];const r=POLICY.rules.find(z=>z.id===i.rule);
  sayLocal('לא סיפרתי על '+(i.topic||i.speaker||'זה')+' כי ביקשת "'+i.ruleText+'"'+(r?', '+agoWords(Date.now(),r.at).replace(/^מלפני/,'לפני'):'')+'. זה הכלל '+i.rule+'. ההודעה: '+i.text.slice(0,120)+(items.length>1?'. ועוד '+(items.length-1)+' היום.':'.'));})().catch(e=>{fail('P_DB_READ',e,'digest');sayLocal('לא הצלחתי לקרוא.');});return true;}
function policyList(){POLICY.load().then(rs=>sayLocal(rs.length?'יש '+rs.length+' כללים: '+rs.map(r=>r.text).join('; ')+'.':'אין כללים. תגיד למשל "אל תעדכן אותי על מייל".'));return true;}
function policyDrop(rest){const q=rest.trim();if(!q)return false;POLICY.load().then(async rs=>{const hit=rs.filter(r=>r.text.indexOf(inorm(q))>=0);for(const r of hit)if(r.key)await P.fact(r.key).update({state:'tomb',tombAt:Date.now()});await POLICY.load();
  sayLocal(hit.length?'ביטלתי '+hit.length+(hit.length===1?' כלל':' כללים')+' על '+q+'.':'לא מצאתי כלל על '+q+'.');});return true;}
function policyFull(){if(!lastShort)return false;sayLocal(lastShort);lastShort=null;return true;}
setTimeout(()=>{if(db)POLICY.load();},3000);setInterval(()=>{if(db){POLICY.load();digestEvening();}},10*60000);
window.__policy=POLICY;
