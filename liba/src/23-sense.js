// @anchor: sense
// sense-bus-ears: what the phone hears - notifications from the apps Meir named - kept here, never sent to Claude
/* Step sense-bus-ears. The bubble's NotifEars hears a notification, SenseBus keeps it on the phone and hands it over
   (sense) when this page is up; it is written to sense/notif/items/<id> and acked (senseAck) - nothing is lost when the
   page is down, nothing is written twice. Only the apps Meir named are heard: "תקשיבי להתראות של וואטסאפ" adds one
   (memory/settings.senses.apps, told to the phone as senseCfg; Android then asks him itself to allow the access),
   "תפסיקי להקשיב להתראות של …" removes it. The list starts empty. Every item is personal and about a third party
   (sensitivity 2): it lives two days, is never folded into the archive, and never goes into a sentence to Claude. An
   urgent one (a missed call, "דחוף") is said - through the same quiet and policy as everything else. */
const SENSE_APPS=[['וואטסאפ','com.whatsapp'],['ווטסאפ','com.whatsapp'],['וואטסאפ עסקי','com.whatsapp.w4b'],['המייל','com.google.android.gm'],['מייל','com.google.android.gm'],['גימייל','com.google.android.gm'],
  ['ההודעות','com.google.android.apps.messaging'],['הודעות','com.google.android.apps.messaging'],['סמס','com.google.android.apps.messaging'],['טלגרם','org.telegram.messenger'],['השיחות','com.google.android.dialer'],['שיחות','com.google.android.dialer'],['אאוטלוק','com.microsoft.office.outlook']];
const senseName=pkg=>{const n=(SENSE_APPS.find(x=>x[1]===pkg&&x[0].charAt(0)!=='ה')||SENSE_APPS.find(x=>x[1]===pkg)||[pkg])[0];return n;};
const sensePkg=name=>{let n=inorm(name);for(const w of ['של ','של']){if(n.indexOf(w)===0){n=n.slice(w.length).trim();break;}}const hit=SENSE_APPS.find(x=>x[0]===n||x[0]==='ה'+n||'ה'+x[0]===n);return hit?hit[1]:null;};
const SENSE_MAX_TEXT=500;
function senseApps(){return ((memSettings.senses&&memSettings.senses.apps)||[]).slice();}
function senseCfgSend(){if(appMode&&hasCap('sense'))post(PROTO.toApp.senseCfg,{apps:senseApps()});}
async function senseSetApps(apps){memSettings.senses=Object.assign({},memSettings.senses||{},{apps:[...new Set(apps)]});
  try{await P.settings().set(memSettings);}catch(e){fail('P_DB_WRITE',e,'memory/settings');}senseCfgSend();}
async function senseIn(raw){let items=[];try{items=JSON.parse(String(raw||'[]'));}catch(e){fail('P_MSG_BAD',e,'sense');return {ids:0};}
  if(!Array.isArray(items)||!db)return {ids:0};const ids=[];
  for(const it of items.slice(0,100)){const id=String(it.id||'');if(!/^[A-Za-z0-9_\-.]{1,80}$/.test(id))continue;
    const d={kind:String(it.kind||'notif').slice(0,20),app:String(it.app||'').slice(0,80),title:String(it.title||'').slice(0,120),text:String(it.text||'').slice(0,SENSE_MAX_TEXT),
      at:+it.at||Date.now(),importance:Math.max(0,Math.min(3,+it.importance||0)),cls:{scope:'personal',subject:'third-party',sens:2}};
    try{const g=await P.senseItem(id).get();if(!g.exists){await P.senseItem(id).set(d);
        if(d.importance>=3)queueLocal({id:'sense-'+id,kind:'say',sense:true,speaker:'התראות',topic:senseName(d.app),text:(d.title?d.title+': ':'')+d.text.slice(0,140)});}
      ids.push(id);}catch(e){fail('P_DB_WRITE',e,'sense');}}
  post(PROTO.toApp.senseAck,{ids:ids});return {ids:ids.length};}
/* the commands */
function senseAdd(rest){const pkg=sensePkg(rest);if(!rest.trim())return false;
  if(!pkg){sayLocal('אני לא מכירה את '+rest.trim()+'. אפשר: וואטסאפ, מייל, הודעות, טלגרם, שיחות.');return true;}
  senseSetApps(senseApps().concat([pkg])).then(()=>{if(appMode)post(PROTO.toApp.cmd,{cmd:'sense_open'});
    sayLocal('בסדר, אקשיב להתראות של '+senseName(pkg)+'. אם הטלפון שואל, תאשר לליבה גישה להתראות. הן נשמרות יומיים, ולא נשלחות לקלוד.');});return true;}
function senseRemove(rest){const pkg=sensePkg(rest);if(!pkg)return false;senseSetApps(senseApps().filter(x=>x!==pkg)).then(()=>sayLocal('הפסקתי להקשיב להתראות של '+senseName(pkg)+'.'));return true;}
function senseList(){const a=senseApps();sayLocal(a.length?'אני מקשיבה להתראות של '+a.map(senseName).join(', ')+'.':'אני לא מקשיבה לאף התראה. תגיד למשל תקשיבי להתראות של וואטסאפ.');return true;}
function senseToday(){(async()=>{const since=Date.now()-864e5;const rs=(await coldGet(P.senseItems(),[['at','>',since]],500)).docs.map(d=>d.data()||{});
  if(!rs.length){sayLocal(senseApps().length?'היום לא הגיעו התראות מהאפליקציות שאני מקשיבה להן.':'אני לא מקשיבה להתראות. תגיד תקשיבי להתראות של וואטסאפ.');return;}
  const by={};rs.forEach(r=>{const k=senseName(r.app);by[k]=(by[k]||0)+1;});const imp=rs.filter(r=>r.importance>=2).sort((a,b)=>b.importance-a.importance||b.at-a.at).slice(0,3);
  sayLocal('היום הגיעו '+rs.length+' התראות: '+Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([k,n])=>n+' מ'+k).join(', ')+'.'+(imp.length?' החשובות: '+imp.map(r=>(r.title?r.title+': ':'')+String(r.text).slice(0,60)).join('; ')+'.':''));})()
  .catch(e=>{fail('P_DB_READ',e,'sense');sayLocal('לא הצלחתי לקרוא את ההתראות.');});return true;}
/* the janitor's part: two days, then gone - never folded */
async function senseSweep(now,budget){now=now||Date.now();let n=0;try{const r=await coldGet(P.senseItems(),[['at','<',now-2*864e5]],Math.min(200,budget||200));
  for(const d of r.docs){await P.senseItem(d.id).delete();n++;}}catch(e){fail('P_DB_WRITE',e,'sense sweep');}return {deleted:n};}
window.__sense={in:senseIn,sweep:senseSweep,apps:senseApps,pkg:sensePkg};
