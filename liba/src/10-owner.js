// @anchor: owner
// who holds the line
/* intent-kernel: one router. The registry (liba/intents/registry.json -> INTENTS) says what a sentence is; this decides
   whether it is a command here and runs it: exact phrase, then the longest prefix (the rest is the slot), then - only
   for a short sentence one letter off a long command - a guess that is asked, never run: "לא" or silence sends the
   sentence on as it was said. A command marked confirm (it deletes) asks first. Nothing here is a command regex. */
const inorm=t=>String(t||'').replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\ufeff\u0591-\u05c7]/g,'').replace(/[?!.,:;"'׳״]/g,'').replace(/\s+/g,' ').trim().replace(/(^|\s)ליבא(?=\s|$)/g,'$1ליבה');
const HANDLERS={quietOff,quietOn,helpAll,helpFamily,galleryWeek,generatorOpen,traceToday,memRemember,memForget,memPref,memList,memNoLog,memLog,memPrivacy,
  reqToday,latencyToday,lineStatus,phoneWhy,outboxList,outboxResend,missedList,missedAll,missedAsks,mapShow,openLast,taskPriority,confirmYes,confirmNo,
  policyWhy,distillToday,memForgetAll,memForgetDo,memUndo,proReturn,proNot,senseAdd,senseRemove,senseList,senseToday,calToday,calTomorrow,calFree,calOn,calOff,calWrite,policyList,policyDrop,policyFull,memAbout,memNoBrief,memIdentity,peopleAdd,peopleWho,peopleAlias,peopleMerge,routeWhere,routeOther,ownerPin,catchupAll,daysYesterday,daysBack,ownerLiba:()=>setOwner('liba'),ownerManager:()=>setOwner('manager'),addressLiba:()=>{ownerWrite('liba',true);return false;},addressManager:()=>{ownerWrite('manager',true);return false;}};
const intentHere=it=>it.where==='page'&&!(it.when==='liba'&&owner==='manager')&&!(it.when==='manager'&&owner!=='manager');
function lev(a,b){if(a===b)return 0;const m=a.length,n=b.length;let p=Array.from({length:n+1},(_,j)=>j);
  for(let i=1;i<=m;i++){const c=[i];for(let j=1;j<=n;j++)c[j]=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));p=c;}return p[n];}
function matchIntent(text){const t=inorm(text);if(!t)return null;
  for(const it of INTENTS)if(intentHere(it)&&it.exact.indexOf(t)>=0)return {it:it,rest:'',t:t,how:'exact'};
  let best=null;for(const it of INTENTS){if(!intentHere(it))continue;for(const p of it.prefix)if((t===p||t.startsWith(p+' '))&&(!best||p.length>best.p.length))best={it:it,rest:t.slice(p.length).trim(),t:t,how:'prefix',p:p};}
  if(best){/* the slot's lead words ("תזכור כי…", "תשכח שהרואה…", "קודם את…") are the registry's, not a regex here */
    const L=best.it.lead||[];let r=best.rest,cut=false;for(const w of L){if(r===w||r.startsWith(w+' ')){r=r.slice(w.length).trim();cut=true;break;}if(w==='ש'&&r.startsWith('ש')&&r.length>1){r=r.slice(1);cut=true;break;}}
    if(best.it.leadRequired&&!cut)return null;best.rest=r;return best;}
  /* suffix: "<one to three words> <phrase>" - the words before are the slot ("דני" in "דני הוא הבן שלי") */
  for(const it of INTENTS){if(!intentHere(it))continue;for(const s of it.suffix||[]){if(t.endsWith(' '+s)){const r=t.slice(0,t.length-s.length).trim();const n=r.split(' ').length;if(r&&n<=3)return {it:it,rest:r,t:t,how:'suffix',rel:s};}}}
  if(t.length<8||t.split(' ').length>4)return null;
  const near=[];for(const it of INTENTS){if(!intentHere(it)||it.pass)continue;for(const ph of it.exact)if(ph.length>=8&&Math.abs(ph.length-t.length)<=1&&lev(ph,t)===1){near.push({it:it,ph:ph});break;}}
  return near.length===1?{it:near[0].it,rest:'',t:t,how:'fuzzy',ph:near[0].ph}:null;}
let pendingIntent=null;const PENDING_MS=60000;
function runIntent(m){const it=m.it;
  if((it.requires||[]).indexOf('db')>=0&&!db){sayLocal('אין לי חיבור למסד כרגע, אז את זה אני לא יכולה לעשות.');return true;}
  const h=HANDLERS[it.handler];if(!h){fail('P_MSG_BAD',null,'intent without handler '+it.id);return false;}
  const r=h(m.rest,m)!==false;if(r)capSeen(it.id);return r;}
function confirmYes(){const p=pendingIntent;if(!p||Date.now()-p.at>PENDING_MS)return false;pendingIntent=null;if(!runIntent(p.m))send({text:p.text,noIntent:true});return true;}
function confirmNo(){const p=pendingIntent;if(!p||Date.now()-p.at>PENDING_MS)return false;pendingIntent=null;
  if(p.m.how==='fuzzy')send({text:p.text,noIntent:true});else sayLocal('בסדר, לא עשיתי.');return true;}
function switchOwner(text){const m=matchIntent(text);if(!m)return false;
  if(m.how==='fuzzy'){fail('P_INTENT_FUZZY',null,m.it.id);const p={m:m,at:Date.now(),text:text};pendingIntent=p;
    sayLocal('התכוונת ל"'+m.ph+'"? תגיד כן, או לא ואשלח את מה שאמרת כמו שהוא.');
    setTimeout(()=>{if(pendingIntent===p){pendingIntent=null;send({text:text,noIntent:true});}},PENDING_MS);return true;}
  if(m.it.confirm&&m.it.handler!=='confirmYes'){pendingIntent={m:m,at:Date.now(),text:text};sayLocal('לבצע את "'+m.t+'"? תגיד כן או לא.');return true;}
  return runIntent(m);}
window.__intent={match:t=>{const m=matchIntent(t);return m?{id:m.it.id,rest:m.rest,how:m.how}:null;}};
async function setOwner(o){await ownerWrite(o,true);
  const msg=o==='liba'?'ליבה על הקו.':'המנהל על הקו. ליבה שותקת עד שתגיד ליבה תחזור.';bubble('li',msg);if(appMode)post(PROTO.toApp.say,{text:msg,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(msg);return true;}
/* owner-lease: the line is a lease, not a sticky switch. The manager keeps it for OWNER_TTL after the last exchange
   - a sentence to it or a message from it renews - and then the line comes back to ליבה by itself, said once.
   channel/owner is {owner, since, ttl, renewedAt, lastTurnId, byVoice}; every open page arms the same expiry. */
let OWNER_TTL=15*60000,ownerRenewedAt=0,ownerTimer=null;
/* addressing: every change of hands is a line in channel/owner/log - who, since when, why, and the sentence that did it -
   so a line that stayed with the manager is visible and explained, never a mystery flag */
function ownerLog(o,why,by){if(!db)return;P.ownerLog().doc(mintId()).set({owner:o,at:Date.now(),why:String(why||''),byUtterance:String(by||'').slice(0,120)}).catch(e=>fail('P_DB_WRITE',e,'owner log'));}
async function ownerWrite(o,byVoice,turn,why){const now=Date.now();if(o!==owner)ownerLog(o,why||(byVoice?'voice':'auto'),turn);owner=o;ownerSince=now;ownerRenewedAt=now;if(o!=='manager')ownerPinnedUntil=0;ownerArm();
  try{await P.owner().set({owner:o,since:now,ttl:OWNER_TTL,renewedAt:now,lastTurnId:turn||'',byVoice:!!byVoice,pinnedUntil:o==='manager'?ownerPinnedUntil:0});}catch(e){fail('P_DB_WRITE',e,'channel/owner');log('owner: '+(e.code||e));}}
function ownerRenew(turn){if(owner!=='manager')return;ownerRenewedAt=Date.now();ownerArm();
  P.owner().update({renewedAt:ownerRenewedAt,lastTurnId:String(turn||'')}).catch(e=>fail('P_DB_WRITE',e,'owner renew'));}
let ownerPinnedUntil=0;
function ownerArm(){clearTimeout(ownerTimer);if(owner!=='manager')return;const until=Math.max(ownerRenewedAt+OWNER_TTL,ownerPinnedUntil);ownerTimer=setTimeout(ownerExpire,Math.max(500,until-Date.now()+200));}
async function ownerExpire(){if(owner!=='manager')return;if(Date.now()-ownerRenewedAt<OWNER_TTL||Date.now()<ownerPinnedUntil){ownerArm();return;}
  await ownerWrite('liba',false,'','expired');setSt('על הקו: ליבה','on');
  queueLocal({id:'owner-back-'+Date.now(),kind:'say',speaker:'ליבה',topic:'הקו',text:'עברו '+Math.round(OWNER_TTL/60000)+' דקות בלי שיחה עם המנהל, אז חזרתי לקו.'});}
/* what the database says, from any page: adopt it, and if its lease already ran out, take the line back */
function ownerFromDb(d){if((d.since||0)<ownerSince)return;ownerSince=d.since||ownerSince;owner=d.owner||'liba';
  ownerRenewedAt=+d.renewedAt||+d.since||Date.now();if(+d.ttl>0)OWNER_TTL=+d.ttl;ownerPinnedUntil=owner==='manager'?(+d.pinnedUntil||0):0;ownerArm();
  if(owner==='manager'&&Date.now()-ownerRenewedAt>=OWNER_TTL&&Date.now()>=ownerPinnedUntil)ownerExpire();
  setSt(owner==='manager'?'על הקו: המנהל':'על הקו: ליבה','on');}
/* replyTo: an answer goes to whoever asked. Within three minutes of a question, a plain sentence ("כן", "תעשה את
   השני") goes to the side that asked it - even if the other side holds the line. A sentence that opens with an
   address ("ליבה ...", "מנהל ...") is a new topic and goes where it says. */
const REPLY_WINDOW=3*60000;
const ADDRESS=INTENTS.filter(i=>/^address\./.test(i.id)).flatMap(i=>i.prefix);
function replyTag(text){if(!lastAsk||Date.now()-lastAsk.at>REPLY_WINDOW)return '';
  const t=inorm(text);if(ADDRESS.some(p=>t===p||t.startsWith(p+' ')))return '';
  return lastAsk.from==='manager'?'[ליבה→מנהל] ':'[ליבה] ';}
window.__owner={ttl:ms=>{OWNER_TTL=ms;ownerArm();},state:()=>({owner,renewedAt:ownerRenewedAt,ttl:OWNER_TTL})};
/* addressing: "למי זה הלך" - where the last sentence went and why; "תחזיר לי את זה" - send it again to the other side;
   "תשאיר את זה אצל המנהל" - a pin that also ends, at the end of the day, so the stuck flag cannot come back by another name.
   The target is said only when it changes. */
let lastRoute=null;
function routeNote(text,tag,why){const to=tag.indexOf('מנהל')>=0?'manager':'liba';const changed=!lastRoute||lastRoute.to!==to;lastRoute={text:text,to:to,why:why,at:Date.now()};return changed;}
const WHY_HE={reply:'כי זו תשובה לשאלה שלו',address:'כי פתחת בשם שלו',owner:'כי הוא מחזיק בקו'};
function routeWhere(){if(!lastRoute)return sayLocal('עוד לא שלחתי כלום היום.'),true;
  sayLocal('"'+lastRoute.text.slice(0,60)+'" הלך '+(lastRoute.to==='manager'?'למנהל':'לליבה')+', '+(WHY_HE[lastRoute.why]||'')+'.');return true;}
function routeOther(){if(!lastRoute||Date.now()-lastRoute.at>30*60000)return sayLocal('אין משפט אחרון להחזיר.'),true;
  const to=lastRoute.to==='manager'?'liba':'manager';send({text:lastRoute.text,tag:to==='manager'?'[ליבה→מנהל] ':'[ליבה] ',noIntent:true,resend:true});return true;}
function ownerPin(){const end=new Date();end.setHours(23,59,0,0);ownerPinnedUntil=end.getTime();if(owner==='manager')ownerLog('manager','pinned','');ownerWrite('manager',true,'','pinned');sayLocal('המנהל על הקו עד סוף היום. תגיד ליבה תחזור כדי לחזור קודם.');return true;}
/* capability-registry: a command Meir has never used, heard inside a sentence that went to Claude, earns one line -
   "אגב, 'מה פספסתי' לבד עושה את זה מיד". A whole command phrase inside a longer sentence, or two of its words. Capped hard:
   one hint in four hours, three per command, none after the command is used once, none while quiet. memory/caps counts. */
const HINT_GAP=4*3600e3,HINT_MAX=3,STOP=new Set(['מה','את','אתה','לי','של','זה','עם','על','לא','כן','או','גם','אני','הוא','היא','כל','רק','עוד','יש']);
let caps={},capsLoaded=false;
async function capsLoad(){if(capsLoaded||!db)return;capsLoaded=true;try{const g=await P.caps().get();caps=(g.exists&&g.data())||{};}catch(e){fail('P_DB_READ',e,'memory/caps');}}
function capsSave(patch){if(!db)return;P.caps().update(patch).catch(()=>P.caps().set(Object.assign({},caps,patch)).catch(e=>fail('P_DB_WRITE',e,'memory/caps')));}
function capSeen(id){const c=caps[id]=caps[id]||{};c.seen=(c.seen||0)+1;c.lastUsed=Date.now();capsSave({[id]:c});}
const words=t=>inorm(t).split(' ').filter(w=>w.length>=3&&!STOP.has(w));
function capNear(text){const t=inorm(text),tw=new Set(words(text));let best=null;
  for(const it of INTENTS){if(!intentHere(it)||it.pass||!it.handler||it.confirm)continue;
    for(const ph of it.exact.concat(it.prefix)){if(ph.length>=6&&t!==ph&&(' '+t+' ').indexOf(' '+ph+' ')>=0){best={it:it,ph:ph,score:3};break;}
      const pw=words(ph);const hit=pw.filter(w=>tw.has(w)).length;if(pw.length>=2&&hit>=2&&(!best||best.score<2))best={it:it,ph:ph,score:2};}
    if(best&&best.score===3)break;}
  return best;}
async function capHint(text){await capsLoad();if(quietUntil>Date.now())return;const n=capNear(text);if(!n)return;const c=caps[n.it.id]||{};
  if((c.seen||0)>0||(c.hints||0)>=HINT_MAX||Date.now()-(+caps.lastAnyHint||0)<HINT_GAP)return;
  c.hints=(c.hints||0)+1;c.lastHint=Date.now();caps[n.it.id]=c;caps.lastAnyHint=Date.now();capsSave({[n.it.id]:c,lastAnyHint:caps.lastAnyHint});
  sayLocal('אגב, "'+n.ph+'" לבד עושה את זה מיד.');}
window.__caps={near:t=>{const n=capNear(t);return n?{id:n.it.id,ph:n.ph}:null;},state:()=>JSON.parse(JSON.stringify(caps))};
