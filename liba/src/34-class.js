// @anchor: class
// cls-birth + outbound-redactor + egress-gate: every text is classified where it is born, identifiers leave as
// pseudonyms, and nothing goes out except through one gate that knows each channel
/* Step cls-birth. classify(text, meta) -> {scope: personal|institution|system, subject: self|third-party|none, sens 0..3}:
   3 - an identity number, a bank account, a card, a password; 2 - health, debts and salary, the law, a phone number, a
   birth date, an address; 1 - personal or about someone else; 0 - the rest. Where it is not clear the scope is personal
   (fail-closed): an institution sentence has to say so. The classification is recomputed at the gate for anything
   written by someone else (a session cannot hold the phone's key, so a stored label from outside proves nothing).
   Step outbound-redactor. redact(text) -> {out, hits, map}: an Israeli ID (nine digits with a valid check digit), a card
   (Luhn), an IBAN, an account number after "חשבון", a phone, an e-mail, a birth date, a street address - each replaced by
   a stable pseudonym (טלפון-1 is the same number every time in this session); the map lives only in this page's memory,
   never in the db. "תשלח כמו שאמרתי" sends the last sentence as spoken, after a yes, and the ledger keeps it.
   Step egress-gate. EGRESS names every channel - voice, relay (to Claude), db:turns, db:decisions, db:crashes, bridge,
   open-url, notification, public-beacon, mail - with the most sensitive thing it may carry and what is done to it on
   the way (redact, ids-only, pointer). egress(channel, doc) is the one door, deny by default: a channel not in the table
   is closed. */
/*<pure>*/
const CLS_ID=v=>{const d=v.replace(/\D/g,'');if(d.length!==9)return false;let s=0;for(let i=0;i<9;i++){let x=(+d[i])*((i%2)+1);if(x>9)x-=9;s+=x;}return s%10===0&&!/^(\d)\1+$/.test(d);};
const CLS_LUHN=v=>{const d=v.replace(/\D/g,'');if(d.length<13||d.length>19)return false;let s=0,alt=false;for(let i=d.length-1;i>=0;i--){let x=+d[i];if(alt){x*=2;if(x>9)x-=9;}s+=x;alt=!alt;}return s%10===0;};
const REDACT_KINDS=[
  ['iban',/\bIL\d{2}(?:[ -]?\d{4}){4}[ -]?\d{3}\b/gi,'חשבון',3],
  ['card',/(?<=(?:כרטיס|אשראי|הכרטיס)(?: מספר)?:?\s{1,2})\d(?:[ -]?\d){12,18}(?!\d)/g,'כרטיס',3],
  ['card',/\b\d(?:[ -]?\d){12,18}\b/g,'כרטיס',3,CLS_LUHN],
  ['id',/(?<=(?:ת"ז|ת״ז|תעודת זהות|מספר הזהות|מספר זהות)(?: של[א-ת ]{0,12})?:?\s{1,2})\d{5,9}(?!\d)/g,'מספר-זהות',3],
  ['id',/(?<![\d-])\d{9}(?![\d-])/g,'מספר-זהות',3,CLS_ID],
  ['account',/(?<=(?:חשבון|ח-ן|ח"ן|ח״ן)(?: בנק)?(?: מספר)?:?\s{0,2})\d{2,3}[-/ ]?\d{3}[-/ ]?\d{3,9}|(?<=(?:חשבון|ח-ן|ח"ן|ח״ן)(?: בנק)?(?: מספר)?:?\s{0,2})\d{5,12}/g,'חשבון',3],
  ['phone',/(?:\+972[- ]?|(?<!\d)0)(?:5\d|[2-4]|[89]|7\d)[- ]?\d{3}[- ]?\d{4}(?!\d)/g,'טלפון',2],
  ['email',/[\w.+-]+@[\w-]+\.[\w.]+/g,'מייל',2],
  ['dob',/(?<=(?:נולד|נולדה|נולדתי|תאריך לידה|ת\. לידה|יום הולדת)\s(?:ב\s?|ב-|ביום\s)?)\d{1,2}[./]\d{1,2}[./]\d{2,4}/g,'לידה',2],
  ['address',/(?:רחוב|רח'|רח׳|שדרות|שד')\s+[א-ת"׳']+(?:\s[א-ת"׳']+)?\s+\d+/g,'כתובת',2]];
/* a sensitive word counts only as a whole word (a prefix letter or two is fine): 'חוב' is not inside 'שמחובר' */
const clsWords=w=>new RegExp('(?<![א-ת])[ובלמשהכ]{0,2}(?:'+w+')(?![א-ת])');
const CLS_SECRET=/(סיסמה|סיסמא|קוד ה?סודי|קוד ה?כניסה|קוד האשראי|\bpin\b|תוקף הכרטיס|שלוש הספרות)/i;
const CLS_HEALTH=clsWords('אבחנה|אבחון|מחלה|חולה|תרופה|תרופות|ניתוח|בית חולים|בית החולים|אשפוז|מאושפז|פסיכולוג|פסיכיאטר|דיכאון|חרדה|הריון|הפלה|סרטן|כימותרפיה|בדיקת דם|סכרת|לחץ דם|טיפול רגשי|ריטלין');
const CLS_MONEY=clsWords('חוב|חובות|משכורת|המשכורת|שכר של|הלוואה|משכנתא|עיקול|הוצאה לפועל|ירושה|גירושין|גירושים|גט|פשיטת רגל|מינוס בבנק');
const CLS_LAW=clsWords('תביעה|תובע|עורך דין|עורכת דין|משטרה|חקירה|תלונה במשטרה|בית משפט|כתב אישום|רווחה|עובדת סוציאלית');
const CLS_INST=/(המוסד|מוסד|הישיבה|ישיבה|תלמיד|תלמידים|בחור|בחורים|ר"מ|ר״מ|רמ"ים|רמ״ים|הצוות|צוות|הנהלה|העמותה|עמותה|תקציב|מלגה|מלגות|דו"ח|דוח|דו״ח|מזכירות|כולל|אברכים|רישום|שיעור|שיעורים|מחזור|הורים של|ועד|משרד החינוך|משרד הדתות|פנימייה|חדר אוכל|מטבח|קבלן|ספק)/;
const CLS_PERS=/(אשתי|בעלי|הילדים שלי|הבן שלי|הבת שלי|אמא שלי|אבא שלי|אחי|אחותי|המשפחה|משפחה|בבית שלי|חתונה של|הנכדים|חמי|חמותי|גיסי|גיסתי|אני מרגיש|אני חולה|שלי\b)/;
const CLS_SYS=/(גרסה|באג|שרת|הדף|אפליקציה|האפליקציה|הבועה|בועה|עדכון|קריסה|סשן|קומיט|גיטהאב|שער|בדיקות|סוללה|מיקרופון|טלפון נתקע|הודעת שגיאה)/;
const CLS_SELF=/(^|\s)(אני|לי|שלי|אותי|אצלי|עליי|אליי|בשבילי)(\s|$|[,.?!])/;
const CLS_VERB='אמר|אמרה|ביקש|ביקשה|צריך|צריכה|חולה|התקשר|התקשרה|שילם|שילמה|חייב|חייבת|נפגש|נפגשה|רוצה|יבוא|תבוא|הגיע|הגיעה|לא הגיע|לא הגיעה|עזב|עזבה|סיפר|סיפרה|שאל|שאלה|כתב|כתבה|מאושפז|מאושפזת|בוכה|כועס|כועסת';
const CLS_NOTNAME=new Set(['אני','הוא','היא','אתה','את','אנחנו','הם','הן','מי','מה','זה','זאת','כל','כולם','מישהו','מישהי','אחד','אחת','המנהל','ליבה','קלוד','המוח','הבועה','הדף','השרת','הספק','המוסד','הצוות','ההנהלה','התלמיד','הבחור','ר"מ','מאיר','הייתי','שהייתי','כשהייתי','היה','שהיה','הייתה','שהייתה']);
const CLS_PRON=['הוא','היא','אני','הם','הן','כולם','מישהו'];
function clsThird(t,names){if(names&&names.some(n=>n&&t.indexOf(n)>=0))return true;const re=new RegExp('(^|[\\s,])([א-ת"׳\']{2,12})\\s+(?:'+CLS_VERB+')(?=[\\s,.?!]|$)','g');let m;while((m=re.exec(t))){if(!CLS_NOTNAME.has(m[2])&&!(m[2][0]==='ה'&&!(names&&names.indexOf(m[2])>=0))&&!CLS_PRON.some(x=>['','ה','ו','ש','כש','וה','שה'].some(q=>m[2]===q+x)))return true;}
  return /(הבן של|הבת של|אשתו של|אשת|אבא של|אמא של|ההורים של|המשפחה של)/.test(t);}
function redact(text,map,only){map=map||new Map();const hits=[];let out=String(text||'');const n={};for(const v of map.values())n[v.split('-').slice(0,-1).join('-')]=Math.max(n[v.split('-').slice(0,-1).join('-')]||0,+v.split('-').pop()||0);
  for(const [kind,re,label,,check] of REDACT_KINDS){if(only&&only.indexOf(kind)<0)continue;out=out.replace(re,v=>{if(check&&!check(v))return v;const key=kind+':'+v.replace(/[\s-]/g,'');let p=map.get(key);if(!p){n[label]=(n[label]||0)+1;p=label+'-'+n[label];map.set(key,p);}hits.push(kind);return p;});}
  return {out,hits,map};}
function classify(text,meta){meta=meta||{};const t=String(text||'');const r=redact(t,new Map());const kinds=new Set(r.hits);
  let sens=0;if(kinds.has('id')||kinds.has('card')||kinds.has('iban')||kinds.has('account')||CLS_SECRET.test(t))sens=3;
  else if(CLS_HEALTH.test(t)||CLS_MONEY.test(t)||CLS_LAW.test(t)||kinds.has('phone')||kinds.has('dob')||kinds.has('address')||kinds.has('email'))sens=2;
  const third=clsThird(t,meta.names),self=CLS_SELF.test(' '+t+' ');
  const subject=third?'third-party':self?'self':'none';
  let scope=(meta.kind==='trace'||meta.kind==='pulse'||meta.kind==='system')?'system':CLS_PERS.test(t)?'personal':CLS_INST.test(t)?'institution':CLS_SYS.test(t)?'system':'personal';
  if(sens<1&&(scope==='personal'&&(self||third)||third))sens=1;
  return {scope,subject,sens};}
const EGRESS={voice:{maxSens:3,why:'to Meir himself - the phone decides by where the sound goes'},
  relay:{maxSens:3,transform:'ids',why:'to Claude: the brain needs the words, not the identity numbers'},
  'db:turns':{maxSens:3,transform:'redact',why:'the log keeps what was said, never an identifier'},
  'db:decisions':{maxSens:3,transform:'redact',why:'the same'},
  'db:crashes':{maxSens:1,transform:'redact',why:'a crash report is technical'},
  bridge:{maxSens:3,why:'to the phone in Meir\'s hand'},
  'open-url':{maxSens:0,noQuery:true,why:'a link carries no content in its address'},
  notification:{maxSens:1,transform:'pointer',why:'a lock screen is seen by others'},
  'public-beacon':{maxSens:0,why:'anyone may see it'}};
function egressDecide(ch,doc,map){const c=EGRESS[ch];if(!c)return {allow:false,reason:'closed channel: '+ch};const text=String(doc&&doc.text||'');const cls=(doc&&doc.cls)||classify(text,doc&&doc.meta);
  if(c.noQuery&&/[?#].+/.test(text))return {allow:false,reason:'a link with content',cls};
  if(c.transform==='pointer'&&cls.sens>c.maxSens)return {allow:true,payload:{text:'יש הודעה אישית'},reason:'pointer',cls};
  if(cls.sens>c.maxSens&&c.transform!=='redact')return {allow:false,reason:'sens '+cls.sens+' > '+c.maxSens,cls};
  if(c.transform==='redact'||(c.transform==='redact'&&cls.sens>c.maxSens)){const r=redact(text,map);if(cls.sens>c.maxSens&&classify(r.out).sens>c.maxSens)return {allow:false,reason:'still sensitive after redaction',cls};return {allow:true,payload:Object.assign({},doc,{text:r.out}),hits:r.hits,reason:r.hits.length?'redacted':'ok',cls};}
  if(c.transform==='ids'){const r=redact(text,map,['id','card','iban','account']);return {allow:true,payload:Object.assign({},doc,{text:r.out}),hits:r.hits,reason:r.hits.length?'redacted':'ok',cls};}
  return {allow:true,payload:doc,reason:'ok',cls};}
/*</pure>*/
const REDACT_MAP=new Map();let lastUnredacted=null;
/* the one door: every text that leaves goes through here, and whatever was changed or refused is in the ledger */
function egress(ch,doc){const r=egressDecide(ch,doc,REDACT_MAP);if(!r.allow||r.reason!=='ok')Ledger.record({action:'egress',cause:ch,decision:{reason:r.reason,sens:r.cls&&r.cls.sens},result:r.allow?(r.hits||[]).join(',')||r.reason:'refused'});return r;}
const REDACT_HE={id:'מספר הזהות',card:'מספר הכרטיס',iban:'מספר החשבון',account:'מספר החשבון',phone:'הטלפון',email:'המייל',dob:'תאריך הלידה',address:'הכתובת'};
/* what goes into the db: the words, never an identifier */
function dbText(t){return egress('db:turns',{text:String(t==null?'':t)}).payload.text;}
/* a link leaves only through here: no content in its address */
function openSafe(u){const r=egress('open-url',{text:String(u||'')});if(!r.allow){sayLocal('לא פותחת קישור שנושא תוכן בכתובת שלו.');return false;}window.open(u,'_blank');return true;}
/* before a sentence goes to Claude: what was cut is said once, and can be sent as said */
function relayNote(text,ctx,reqId,tag){const r=redact(text,REDACT_MAP,['id','card','iban','account']);if(!r.hits.length)return;
  const k=[...new Set(r.hits.map(h=>REDACT_HE[h]))];lastUnredacted={text:text+ctx,reqId,tag,hits:k};
  sayLocal('הורדתי מהמשפט את '+k.join(' ואת ')+' לפני ששלחתי. אם הם צריכים ללכת, תגיד "תשלח כמו שאמרתי".');}
function sendAsSaid(){if(!lastUnredacted){sayLocal('לא חתכתי שום דבר מהמשפט האחרון.');return true;}const x=lastUnredacted;
  Consent.request({action:'send_unredacted',effect:'לשלוח לקלוד את המשפט כמו שאמרת, עם המספרים',reversible:false,say:'המשפט האחרון יצא בלי '+x.hits.join(', ')+'. לשלוח אותו כמו שאמרת?'}).then(yes=>{
    if(!yes)return;lastUnredacted=null;Ledger.record({action:'egress.bypass',cause:'voice',result:x.reqId});deliver(x.text+reqMark(x.reqId),x.tag,true).then(r=>sayLocal(r.sent?'נשלח כמו שאמרת.':'לא הצלחתי לשלוח.'));});return true;}
window.__cls={classify,redact,egress:egressDecide,channels:EGRESS};
