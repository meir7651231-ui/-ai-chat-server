// @anchor: form
// voice-form: a recurring report filled entirely by voice - one field at a time, numbers in words, back and resume,
// every number and name read back before it closes
/* Step voice-form. book/forms/items/<formId> {title, feeds[], fields: [{key, label, type: number|text|choice|date|
   person, required, unit, options, lastValue, readback}]}. "תמלאי את <form>" opens book/runs/items/<runId> {formId,
   values, doneFields, startedAt, state} and asks one field at a time (queueLocal ask); the answer is caught before it
   could go to Claude (bookAnswer). Numbers are said in words - hebNum("שלוש מאות ארבעים ושתיים") = 342. Every answer
   is written at once, so "תמשיך את הדוח" picks the run up after the app was closed with nothing lost; "תחזור שאלה
   אחורה" goes back one field. At the end every number and every name is read back; "נכון" closes the run and opens
   tasks/<id> {kind: form-emit, values} for the session that renders the real document; "לא" asks which field. */
const HN_UNIT={'אפס':0,'אחד':1,'אחת':1,'שניים':2,'שתיים':2,'שני':2,'שתי':2,'שנים':2,'שתים':2,'שלוש':3,'שלושה':3,'שלושת':3,'ארבע':4,'ארבעה':4,'ארבעת':4,'חמש':5,'חמישה':5,'חמשת':5,
  'שש':6,'שישה':6,'ששת':6,'שבע':7,'שבעה':7,'שבעת':7,'שמונה':8,'שמונת':8,'תשע':9,'תשעה':9,'תשעת':9,'עשר':10,'עשרה':10,'עשרת':10,'עשרים':20,'שלושים':30,'ארבעים':40,'חמישים':50,'שישים':60,'שבעים':70,'שמונים':80,'תשעים':90,'מאה':100,'מאתיים':200,'אלפיים':2000};
/* Hebrew number words (or digits) -> a number; null when it is not a number */
function hebNum(text){const raw=String(text||'').trim();const dg=/-?\d+(?:[.,]\d+)?/.exec(raw.replace(/(\d),(\d{3})/g,'$1$2'));if(dg&&!/[א-ת]/.test(raw.split(/\d/)[0]))return +dg[0].replace(',','.');
  const toks=inorm(raw).split(' ').filter(Boolean);let total=0,cur=0,seen=false,half=false;
  for(let w of toks){if(w==='וחצי'||w==='חצי'){half=true;seen=true;continue;}if(HN_UNIT[w]==null&&w[0]==='ו'&&HN_UNIT[w.slice(1)]!=null)w=w.slice(1);
    if(w==='מאות'){cur=(cur||1)*100;seen=true;continue;}if(w==='אלף'||w==='אלפים'){total+=(cur||1)*1000;cur=0;seen=true;continue;}if(w==='מיליון'||w==='מיליונים'){total+=(cur||1)*1e6;cur=0;seen=true;continue;}
    if(HN_UNIT[w]!=null){const v=HN_UNIT[w];if(v===2000){total+=2000;}else cur+=v;seen=true;continue;}
    if(seen)break;return null;}
  return seen?total+cur+(half?0.5:0):null;}
function formDate(t){t=inorm(t);const now=new Date();if(t.indexOf('היום')>=0)return trDay(now);if(t.indexOf('מחר')>=0)return trDay(Date.now()+864e5);if(t.indexOf('אתמול')>=0)return trDay(Date.now()-864e5);
  const m=/(\d{1,2})[./](\d{1,2})(?:[./](\d{2,4}))?/.exec(t);if(!m)return null;const y=m[3]?(m[3].length===2?2000+ +m[3]:+m[3]):now.getFullYear();return y+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[1]).padStart(2,'0');}
let formCur=null;
async function formLoad(q){const all=(await coldGet(P.forms(),null,100)).docs.map(d=>Object.assign({id:d.id},d.data()||{}));const w=memWords(q||'');
  return all.map(f=>({f,n:w.filter(a=>memWords(f.title).some(b=>b.indexOf(a)===0||a.indexOf(b)===0)).length})).filter(x=>x.n>0).sort((a,b)=>b.n-a.n).map(x=>x.f)[0]||null;}
async function formSaveRun(){const r=formCur;if(!r||!db)return;await P.run(r.runId).set({formId:r.form.id,title:r.form.title,values:r.values,doneFields:r.doneFields,startedAt:r.startedAt,state:r.state,i:r.i,doneAt:r.doneAt||0}).catch(e=>fail('P_DB_WRITE',e,'book/runs'));}
function formAskField(pre){const r=formCur,f=r.form.fields[r.i],id='form-'+r.runId+'-'+r.i+'-'+mintId();bookAsks.set(id,{id,kind:'form',runId:r.runId,i:r.i});
  queueLocal({id,kind:'ask',release:true,speaker:'ליבה',topic:r.form.title,options:f.type==='choice'?(f.options||[]):[],text:(pre||'')+f.label+(f.unit?' ('+f.unit+')':'')+'?'+(f.lastValue!=null&&f.lastValue!==''?' בפעם הקודמת: '+f.lastValue+'.':'')});}
function formReadback(){const r=formCur,parts=r.form.fields.filter(f=>r.values[f.key]!=null&&(f.type==='number'||f.type==='person'||f.readback)).map(f=>f.label+' '+r.values[f.key]+(f.unit?' '+f.unit:''));
  const id='form-ok-'+r.runId+'-'+mintId();bookAsks.set(id,{id,kind:'formConfirm',runId:r.runId});queueLocal({id,kind:'ask',release:true,speaker:'ליבה',topic:r.form.title,options:['נכון','לא'],text:'קראתי: '+(parts.join(', ')||'הכול')+'. נכון?'});}
function formNext(){const r=formCur;while(r.i<r.form.fields.length&&r.doneFields.indexOf(r.form.fields[r.i].key)>=0&&!r.redo)r.i++;r.redo=false;formSaveRun();if(r.i>=r.form.fields.length)formReadback();else formAskField();}
function formStart(rest){(async()=>{const f=await formLoad(rest);if(!f||!Array.isArray(f.fields)||!f.fields.length){sayLocal('לא מצאתי טופס בשם '+rest+'.');return;}
  formCur={runId:'run-'+mintId(),form:f,i:0,values:{},doneFields:[],startedAt:Date.now(),state:'open'};await formSaveRun();Ledger.record({action:'form.start',cause:'voice',result:formCur.runId});
  sayLocal(f.title+': '+f.fields.length+' שאלות. אפשר תמיד להגיד "תחזור שאלה אחורה".');formAskField();})().catch(e=>{fail('P_DB_READ',e,'forms');sayLocal('לא הצלחתי לפתוח את הטופס.');});return true;}
function formResume(){(async()=>{const runs=(await coldGet(P.runs(),[['state','==','open']],50)).docs.map(d=>Object.assign({id:d.id},d.data()||{})).sort((a,b)=>b.startedAt-a.startedAt);
  const r=runs[0];if(!r){sayLocal('אין דוח פתוח.');return;}const g=await P.form(r.formId).get();const f=g.exists?Object.assign({id:r.formId},g.data()):null;if(!f){sayLocal('הטופס של הדוח הפתוח נמחק.');return;}
  formCur={runId:r.id,form:f,i:0,values:r.values||{},doneFields:r.doneFields||[],startedAt:r.startedAt,state:'open'};sayLocal('ממשיכה את '+f.title+' - '+formCur.doneFields.length+' מתוך '+f.fields.length+' כבר נענו.');formNext();})()
  .catch(e=>{fail('P_DB_READ',e,'runs');sayLocal('לא הצלחתי לקרוא את הדוח.');});return true;}
function formBack(){if(!formCur){sayLocal('אין דוח פתוח.');return true;}const r=formCur;r.i=Math.max(0,r.i-1);const k=r.form.fields[r.i].key;r.doneFields=r.doneFields.filter(x=>x!==k);r.redo=true;formNext();return true;}
function formAnswer(a,text){const r=formCur;if(!r||r.runId!==a.runId)return false;const t=inorm(text);lastAsk=null;bookAsks.delete(a.id);
  if(t.indexOf('אחורה')>=0){formBack();return true;}
  if(a.kind==='formConfirm'){if(['נכון','כן','בסדר','מאשר'].some(x=>t===x||t.indexOf(x+' ')===0)){r.state='done';r.doneAt=Date.now();formSaveRun().then(async()=>{const tid='emit-'+mintId();
      await P.task(tid).set({kind:'form-emit',formId:r.form.id,title:r.form.title,values:r.values,runId:r.runId,status:'queued',updatedAt:Date.now()}).catch(()=>{});
      const fields=r.form.fields.map(f=>Object.assign({},f,r.values[f.key]!=null?{lastValue:r.values[f.key]}:{}));await P.form(r.form.id).update({fields}).catch(()=>{});
      Ledger.record({action:'form.done',cause:r.runId,result:tid});sayLocal(r.form.title+' נסגר. שלחתי לעיבוד - אגיד כשהמסמך מוכן.');formCur=null;});return true;}
    const id='form-fix-'+r.runId+'-'+mintId();bookAsks.set(id,{id,kind:'formFix',runId:r.runId});queueLocal({id,kind:'ask',release:true,speaker:'ליבה',topic:r.form.title,text:'איזה שדה לתקן?'});return true;}
  if(a.kind==='formFix'){const w=memWords(text);const i=r.form.fields.findIndex(f=>memWords(f.label).some(b=>w.some(x=>b.indexOf(x)===0||x.indexOf(b)===0)));
    if(i<0){const id='form-fix-'+r.runId+'-'+mintId();bookAsks.set(id,{id,kind:'formFix',runId:r.runId});queueLocal({id,kind:'ask',release:true,speaker:'ליבה',topic:r.form.title,text:'לא מצאתי שדה כזה. איזה? '+r.form.fields.map(f=>f.label).join(', ')+'.'});return true;}
    r.i=i;r.doneFields=r.doneFields.filter(x=>x!==r.form.fields[i].key);r.redo=true;formNext();return true;}
  const f=r.form.fields[a.i];let v=null,why='';
  if(!f.required&&/דלג|אין|לא רלוונטי|תדלגי|תדלג/.test(t))v='';
  else if(f.type==='number'){v=hebNum(text);if(v==null)why='לא שמעתי מספר. ';}
  else if(f.type==='choice'){const o=(f.options||[]).find(o=>t.indexOf(inorm(o))>=0);v=o||null;if(v==null)why='אחת מ: '+(f.options||[]).join(', ')+'. ';}
  else if(f.type==='date'){v=formDate(text);if(v==null)why='לא שמעתי תאריך. ';}
  else v=String(text).trim()||null;
  if(v==null){formAskField(why);return true;}
  r.values[f.key]=v;if(r.doneFields.indexOf(f.key)<0)r.doneFields.push(f.key);r.i=a.i+1;formNext();return true;}
window.__form={hebNum,start:formStart,resume:formResume,cur:()=>formCur,date:formDate};
