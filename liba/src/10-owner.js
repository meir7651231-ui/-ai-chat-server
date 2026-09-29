// @anchor: owner
// who holds the line
function switchOwner(text){const t=text.replace(/[?!.,]/g,'').trim();
  if(owner!=='manager'){if(quietCmd(text))return true;if(taskCmd(text))return true;if(memoryCmd(text))return true;}
  /* simple rule: a sentence that starts with "ליבה" is for ליבה; one that starts with "מנהל" is for the manager */
  if(/^(היי |הי )?ליב[הא],?\s*(תחזור|תחזרי|חזור|חזרי)\s*$/.test(t)){return setOwner('liba');}
  if(owner==='manager'&&/^(תחזור|תחזרי|חזור|חזרי)$/.test(t)){return setOwner('liba');}
  if(owner==='manager'&&/^(היי |הי )?ליב[הא](?=\s|$)/.test(t)){ownerWrite('liba',true);return false;}
  if(/^(תעלה|העלה|תן ל|תעביר ל)\s*(את\s+)?ה?מנהל$/.test(t)||/^מנהל$/.test(t)){return setOwner('manager');}
  if(owner==='liba'&&/^(היי |הי )?מנהל(?=\s|$)/.test(t)){ownerWrite('manager',true);return false;}
  return false;}
async function setOwner(o){await ownerWrite(o,true);
  const msg=o==='liba'?'ליבה על הקו.':'המנהל על הקו. ליבה שותקת עד שתגיד ליבה תחזור.';bubble('li',msg);if(appMode)post(PROTO.toApp.say,{text:msg,kind:'say',options:[],from:'liba',speaker:'ליבה'});else say(msg);return true;}
/* owner-lease: the line is a lease, not a sticky switch. The manager keeps it for OWNER_TTL after the last exchange
   - a sentence to it or a message from it renews - and then the line comes back to ליבה by itself, said once.
   channel/owner is {owner, since, ttl, renewedAt, lastTurnId, byVoice}; every open page arms the same expiry. */
let OWNER_TTL=20*60000,ownerRenewedAt=0,ownerTimer=null;
async function ownerWrite(o,byVoice,turn){const now=Date.now();owner=o;ownerSince=now;ownerRenewedAt=now;ownerArm();
  try{await P.owner().set({owner:o,since:now,ttl:OWNER_TTL,renewedAt:now,lastTurnId:turn||'',byVoice:!!byVoice});}catch(e){fail('P_DB_WRITE',e,'channel/owner');log('owner: '+(e.code||e));}}
function ownerRenew(turn){if(owner!=='manager')return;ownerRenewedAt=Date.now();ownerArm();
  P.owner().update({renewedAt:ownerRenewedAt,lastTurnId:String(turn||'')}).catch(e=>fail('P_DB_WRITE',e,'owner renew'));}
function ownerArm(){clearTimeout(ownerTimer);if(owner!=='manager')return;ownerTimer=setTimeout(ownerExpire,Math.max(500,ownerRenewedAt+OWNER_TTL-Date.now()+200));}
async function ownerExpire(){if(owner!=='manager')return;if(Date.now()-ownerRenewedAt<OWNER_TTL){ownerArm();return;}
  await ownerWrite('liba',false);setSt('על הקו: ליבה','on');
  queueLocal({id:'owner-back-'+Date.now(),kind:'say',speaker:'ליבה',topic:'הקו',text:'עברו '+Math.round(OWNER_TTL/60000)+' דקות בלי שיחה עם המנהל, אז חזרתי לקו.'});}
/* what the database says, from any page: adopt it, and if its lease already ran out, take the line back */
function ownerFromDb(d){if((d.since||0)<ownerSince)return;ownerSince=d.since||ownerSince;owner=d.owner||'liba';
  ownerRenewedAt=+d.renewedAt||+d.since||Date.now();if(+d.ttl>0)OWNER_TTL=+d.ttl;ownerArm();
  if(owner==='manager'&&Date.now()-ownerRenewedAt>=OWNER_TTL)ownerExpire();
  setSt(owner==='manager'?'על הקו: המנהל':'על הקו: ליבה','on');}
/* replyTo: an answer goes to whoever asked. Within three minutes of a question, a plain sentence ("כן", "תעשה את
   השני") goes to the side that asked it - even if the other side holds the line. A sentence that opens with an
   address ("ליבה ...", "מנהל ...") is a new topic and goes where it says. */
const REPLY_WINDOW=3*60000;
function replyTag(text){if(!lastAsk||Date.now()-lastAsk.at>REPLY_WINDOW)return '';
  if(/^(היי |הי )?(ליב[הא]|מנהל)(?=[\s,]|$)/.test(String(text||'').trim()))return '';
  return lastAsk.from==='manager'?'[ליבה→מנהל] ':'[ליבה] ';}
window.__owner={ttl:ms=>{OWNER_TTL=ms;ownerArm();},state:()=>({owner,renewedAt:ownerRenewedAt,ttl:OWNER_TTL})};
