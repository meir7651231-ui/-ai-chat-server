// צעד 99: בדיקת קצה-לקצה של הדף עם אפליקציה ומסד מדומים. הרצה: NODE_PATH=$(npm root -g) node tests/page.e2e.js
const { chromium } = require('playwright'); const fs = require('fs');
const STUB = `(()=>{ if (window.top === window) return; // only inside the iframe
const docs=new Map(), colSubs=new Map(), docSubs=new Map();
/* windowed-reads: a channel with a long past. __seedN documents across inbox/tasks/sessions/gallery before boot */
if(window.__seedN){const N=window.__seedN,now=Date.now(),q=Math.floor(N/4);for(let i=0;i<q;i++){docs.set('inbox/old-'+i,{from:'liba',kind:'say',text:'ישן '+i,spoken:true,ts:now-864e5*30+i});docs.set('tasks/t-'+i,{title:'משימה '+i,status:'done',updatedAt:now-864e5*30+i});docs.set('sessions/s-'+i,{title:'שיחה '+i,status:'idle',updatedAt:now-864e5*30+i});docs.set('gallery/g-'+i,{title:'תמונה '+i,ts:now-864e5*30+i});}
 for(let i=0;i<5;i++)docs.set('inbox/fresh-'+i,{from:'liba',kind:'say',speaker:'ליבה',text:'חלון-'+i,spoken:false,ts:now+i});}
const parts=p=>p.split('/').filter(Boolean);
/* the real store: update merges nested objects recursively (arrays and scalars replace); leases are set-if-not-busy */
const leases=new Map();
/* a frame that was reloaded is dead: its callbacks and writes must not act on a shared db (tests/inbox.chaos.js) */
const alive=()=>{try{return window.top===window||!window.frameElement||window.frameElement.contentWindow===window;}catch(e){return true;}};
const dead=()=>Object.assign(new Error('page is gone'),{code:'dead'});
function deepMerge(a,b){for(const k of Object.keys(b)){const v=b[k];if(v&&typeof v==='object'&&!Array.isArray(v)&&a[k]&&typeof a[k]==='object'&&!Array.isArray(a[k]))a[k]=deepMerge(a[k],v);else a[k]=v;}return a;}
const colOf=p=>{const a=parts(p);return a.slice(0,-1).join('/');};
function snapDoc(path){const d=docs.get(path);return {exists:!!d,data:()=>d?JSON.parse(JSON.stringify(d)):undefined,id:parts(path).pop()};}
function notify(path){const c=colOf(path);(colSubs.get(c)||[]).slice().forEach(fire);(docSubs.get(path)||[]).slice().forEach(cb=>{if(cb.alive&&!cb.alive()){const a=docSubs.get(path);a.splice(a.indexOf(cb),1);return;}try{cb(snapDoc(path));}catch(e){setTimeout(()=>{throw e;},0);}});}
function colSnap(c){const n=parts(c).length;const out=[];for(const [p,d] of docs){const a=parts(p);if(a.length===n+1&&a.slice(0,n).join('/')===c)out.push({id:a[n],data:()=>JSON.parse(JSON.stringify(d)),ref:docRef(p)});}return {docs:out};}
function docRef(path){return {path,collection:n=>colRef(path+'/'+n),
 set:async d=>{if(!alive())throw dead();if(window.__quotaPath&&path.indexOf(window.__quotaPath)===0)throw Object.assign(new Error('quota'),{code:'resource_exhausted'});if(window.__quotaCreate&&!docs.has(path))throw Object.assign(new Error('quota: no new documents'),{code:'resource_exhausted'});if(parts(path).length%2)throw Object.assign(new Error('bad doc path '+path),{code:'bad_path'});docs.set(path,JSON.parse(JSON.stringify(d)));notify(path);},
 update:async d=>{if(!alive())throw dead();if(!docs.has(path))throw Object.assign(new Error('missing '+path),{code:'not_found'});docs.set(path,deepMerge(docs.get(path),JSON.parse(JSON.stringify(d))));notify(path);},
 acquire:async o=>{if(!alive())throw dead();const now=Date.now(),l=leases.get(path);if(l&&l.until>now&&l.holder!==o.holder)return {acquired:false,expiresAt:new Date(l.until).toISOString()};const until=now+((o&&o.ttlMs)||30000);leases.set(path,{holder:o.holder,until});if(o&&o.data){docs.set(path,deepMerge(docs.get(path)||{},JSON.parse(JSON.stringify(o.data))));notify(path);}return {acquired:true,holder:o.holder,expiresAt:new Date(until).toISOString()};},
 delete:async()=>{if(!alive())throw dead();docs.delete(path);notify(path);},
 get:async()=>snapDoc(path),
 onSnapshot:(cb,err)=>{if(!docSubs.has(path))docSubs.set(path,[]);cb.alive=alive;docSubs.get(path).push(cb);setTimeout(()=>cb(snapDoc(path)),0);return()=>{};}};}
/* the real store's query rules (db.d.ts): a where on a field the document lacks never matches it, orderBy puts
   missing fields last, no orderBy means id order, limit is a window. Every delivery is counted in __reads so a test
   can prove how many document bodies a page open costs, and docChanges() is computed against the last delivery. */
const reads={docs:0,deltas:0,subs:0};
const OPS={'==':(a,b)=>a===b,'!=':(a,b)=>a!==b,'<':(a,b)=>a<b,'<=':(a,b)=>a<=b,'>':(a,b)=>a>b,'>=':(a,b)=>a>=b,'in':(a,b)=>b.includes(a),'not-in':(a,b)=>!b.includes(a)};
function runQ(c,q){let out=colSnap(c).docs;for(const [f,op,v] of q.w){out=out.filter(d=>{const x=d.data();return x&&(f in x)&&OPS[op](x[f],v);});}
 if(q.o){const [f,dir]=q.o;const k=d=>{const x=d.data();return x&&(f in x)?x[f]:undefined;};out.sort((a,b)=>{const x=k(a),y=k(b);if(x===undefined&&y===undefined)return a.id<b.id?-1:1;if(x===undefined)return 1;if(y===undefined)return -1;if(x===y)return a.id<b.id?-1:1;return (x<y?-1:1)*(dir==='desc'?-1:1);});}
 else out.sort((a,b)=>a.id<b.id?-1:1);
 if(q.l)out=out.slice(0,q.l);return out;}
function fire(sub){if(sub.alive&&!sub.alive()){const a=colSubs.get(sub.c);if(a&&a.indexOf(sub)>=0)a.splice(a.indexOf(sub),1);return;}if(window.__exhaust&&sub.q.l>window.__exhaust){sub.err&&sub.err({code:'resource_exhausted',message:'scan too large'});return;}
 const docsNow=runQ(sub.c,sub.q);const now=new Map(docsNow.map(d=>[d.id,JSON.stringify(d.data())]));const ch=[];
 docsNow.forEach((d,i)=>{if(!sub.last.has(d.id))ch.push({type:'added',doc:d,oldIndex:-1,newIndex:i});else if(sub.last.get(d.id)!==now.get(d.id))ch.push({type:'modified',doc:d,oldIndex:i,newIndex:i});});
 for(const [id] of sub.last)if(!now.has(id))ch.push({type:'removed',doc:{id,data:()=>undefined},oldIndex:0,newIndex:-1});
 if(sub.fired&&!ch.length)return;sub.fired=true;sub.last=now;reads.docs+=docsNow.length;reads.deltas+=ch.length;
 try{sub.cb({docs:docsNow,size:docsNow.length,empty:!docsNow.length,docChanges:()=>ch});}catch(e){setTimeout(()=>{throw e;},0);}}
function query(c,q){return {path:c,
 where:(f,op,v)=>query(c,{...q,w:q.w.concat([[f,op,v]])}),orderBy:(f,dir)=>query(c,{...q,o:[f,dir||'asc']}),limit:n=>query(c,{...q,l:n}),
 get:async()=>{const d=runQ(c,q);reads.docs+=d.length;return {docs:d,size:d.length,empty:!d.length,docChanges:()=>[]};},
 onSnapshot:(cb,err)=>{if(parts(c).length%2===0){if(err)err({code:'bad_collection_path'});throw new Error('bad collection path '+c);}if(!colSubs.has(c))colSubs.set(c,[]);const sub={c,q,cb,err,last:new Map(),fired:false,alive};colSubs.get(c).push(sub);reads.subs++;setTimeout(()=>fire(sub),0);return()=>{const a=colSubs.get(c);a.splice(a.indexOf(sub),1);};}};}
function colRef(c){return Object.assign(query(c,{w:[],o:null,l:0}),{doc:id=>docRef(c+'/'+id)});}
const db={doc:p=>{if(parts(p).length%2)throw new Error('bad doc path '+p);return docRef(p);},collection:c=>colRef(c)};
const sent=[],sentRaw=[];const comments={canSendToClaude:async()=>{if(window.__slowSend)await new Promise(r=>setTimeout(r,window.__slowSend));if(window.__noSend)return 'unavailable';return 'available';},anchorFor:async()=>({}),sendToClaude:async o=>{sentRaw.push(o.text);sent.push(String(o.text).replace(/ ⟦#[0-9a-z]+⟧$/,''));window.parent.postMessage({harness:'sent',text:o.text},'*');}};
window.claude={use:async n=>n==='db'?db:n==='comments'?comments:null};
window.__h={db,docs,reads,leases,set:(p,d)=>docRef(p).set(d),get:p=>docs.get(p),all:c=>colSnap(c).docs.map(x=>({id:x.id,...x.data()})),sent,sentRaw};
})();`;
const failed = [];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 420, height: 860 } });
  const errs = [], msgs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  await p.addInitScript(STUB);
  const html = fs.readFileSync(require('path').join(__dirname, '..', 'liba-call.html'), 'utf8');
  const os=require('os');const tmp=fs.mkdtempSync(require('path').join(os.tmpdir(),'liba-e2e-'));fs.writeFileSync(tmp+'/h_inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp+'/h_host.html', `<!doctype html><html><body><iframe id=f src="h_inner.html" style="width:400px;height:800px"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});
    window.app=(d)=>document.getElementById('f').contentWindow.postMessage(d,'*');
  </script></body></html>`);
  await p.goto('file://' + tmp + '/h_host.html', { waitUntil: 'load' });
  const f = () => p.frames()[1];
  const fr = f(); await fr.waitForFunction(() => window.__h && window.claude, null, { timeout: 5000 });
  await p.waitForTimeout(600);
  const H = async (fn, ...a) => fr.evaluate(fn, ...a);
  const set = (path, d) => H(([path, d]) => window.__h.set(path, d), [path, d]);
  const get = path => H(p => window.__h.get(p), path);
  const flush = async (ms = 900) => { await p.waitForTimeout(ms); const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; }); msgs.push(...m); return m; };
  // step 1 (release-gate): this harness used to print FAIL and exit 0, so every scenario could
  // fail and the ship would continue. Failures are counted now and the process exits 1.
  const check = (c, m) => { if (!c) failed.push(m); console.log((c ? 'PASS ' : 'FAIL ') + m); };
  // 1. app hello
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.1.0' }));
  let m = await flush();
  check(m.some(x => x.liba === 'ready'), 'hello → ready');
  check((await get('channel/device') || {}).app === '3.1.0', 'device doc written with app version');
  // 2. inbox: say + ask + cmd ordering, acks
  await set('inbox/m-1', { from: 'liba', kind: 'say', speaker: 'ליבה', topic: 'בדיקה', text: 'שלום ראשון', spoken: false, ts: 1 });
  await set('inbox/m-2', { from: 'liba', kind: 'ask', speaker: 'ליבה', topic: 'שאלה', text: 'כן או לא', options: ['כן', 'לא'], spoken: false, ts: 2 });
  await set('inbox/c-3', { from: 'liba', kind: 'cmd', cmd: 'reload', spoken: false, ts: 3 });
  m = await flush(1500);
  const says = m.filter(x => x.liba === 'say').map(x => x.text);
  check(says.length >= 2 && /ליבה, בנוגע לבדיקה: שלום ראשון/.test(says.find(t => /ראשון/.test(t)) || ''), 'say #1 with speaker+topic prefix: ' + JSON.stringify(says[0]));
  check(says.some(t => /שאלה/.test(t) && /כן או לא/.test(t)), 'ask #2 spoken with kind word');
  check(m.some(x => x.liba === 'cmd' && x.cmd === 'reload'), 'cmd relayed');
  check((await get('inbox/m-1') || {}).spoken === true && (await get('inbox/m-2') || {}).spoken === true && (await get('inbox/c-3') || {}).spoken === true, 'all three acked spoken:true');
  const batchIntro = says.some(t => /הצטברו/.test(t)); console.log('  (batch intro spoken: ' + batchIntro + ')');
  // 3. answer the ask → decisions log + sent with tag
  await p.evaluate(() => window.app({ liba: 'input', text: 'כן' })); await flush(2000);
  const dec = await H(() => window.__h.all('decisions/log/items')); check(dec.length === 1 && dec[0].answer === 'כן', 'decision logged: ' + JSON.stringify(dec.map(d => d.answer)));
  let sentAll = await H(() => window.__h.sent.slice()); check(sentAll.some(t => t === '[ליבה] כן'), 'answer sent to Claude with [ליבה] tag: ' + JSON.stringify(sentAll));
  // 4. duplicate guard: "כן" again within 20s
  await set('inbox/m-2b', { from: 'liba', kind: 'ask', speaker: 'ליבה', topic: 'שאלה שנייה', text: 'עוד שאלה', options: ['כן', 'לא'], spoken: false, ts: 3.5 }); await flush(1500);
  await p.evaluate(() => window.app({ liba: 'input', text: 'כן' })); await flush(2600);
  sentAll = await H(() => window.__h.sent.slice()); console.log('  second "כן" sent? ' + (sentAll.filter(t => t === '[ליבה] כן').length === 2));
  // 5. memory note, local
  await p.evaluate(() => window.app({ liba: 'input', text: 'תזכור שהרואה חשבון הוא דני' })); m = await flush(2600);
  const notes = await H(() => window.__h.all('memory/facts/items').filter(x => x.state !== 'tomb')); check(notes.length === 1 && /דני/.test(notes[0].raw), 'memory fact stored (mem-core): ' + JSON.stringify(notes.map(n => n.raw)));
  check(m.some(x => x.liba === 'say' && /זכרתי/.test(x.text)), 'memory confirmation spoken');
  // 6. owner switching by name
  await p.evaluate(() => window.app({ liba: 'input', text: 'מנהל מה המצב' })); m = await flush(2000);
  check((await get('channel/owner') || {}).owner === 'manager', 'sentence starting with מנהל → owner manager');
  sentAll = await H(() => window.__h.sent.slice()); check(sentAll.some(t => t === '[ליבה→מנהל] מנהל מה המצב'), 'sent with manager tag: ' + JSON.stringify(sentAll.slice(-1)));
  await p.evaluate(() => window.app({ liba: 'input', text: 'ליבה שומע' })); m = await flush(2000);
  check((await get('channel/owner') || {}).owner === 'liba', 'sentence starting with ליבה → owner liba');
  sentAll = await H(() => window.__h.sent.slice()); check(sentAll[sentAll.length - 1] === '[ליבה] ליבה שומע', 'sent with liba tag: ' + JSON.stringify(sentAll.slice(-1)));
  // 7. quiet: defer normal, pass urgent, release on תפריע
  // 6b. anchored switches (v31): "תעביר למנהל את הקובץ" is a normal sentence, "ליבה, תחזור" only switches
  await p.evaluate(() => window.app({ liba: 'input', text: 'תעביר למנהל את הקובץ' })); await flush(2000);
  sentAll = await H(() => window.__h.sent.slice()); check(sentAll[sentAll.length - 1] === '[ליבה] תעביר למנהל את הקובץ', 'sentence mentioning manager is sent, not a switch: ' + JSON.stringify(sentAll.slice(-1)));
  await p.evaluate(() => window.app({ liba: 'input', text: 'מנהל' })); await flush(1800);
  check((await get('channel/owner') || {}).owner === 'manager', 'bare מנהל switches to manager');
  const nBefore = (await H(() => window.__h.sent.slice())).length;
  await p.evaluate(() => window.app({ liba: 'input', text: 'ליבה, תחזור' })); await flush(2200);
  check((await get('channel/owner') || {}).owner === 'liba', 'ליבה, תחזור → owner liba');
  check((await H(() => window.__h.sent.slice())).length === nBefore, 'ליבה תחזור sends nothing to Claude');
  // 6d. a manager sentence right after a liba sentence still routes to the manager
  await p.evaluate(() => window.app({ liba: 'input', text: 'ליבה תחזור' })); await flush(2000);
  await p.evaluate(() => { window.app({ liba: 'input', text: 'העיצוב טוב אבל יותר מפלצתי' }); setTimeout(() => window.app({ liba: 'input', text: 'מנהל שומע אם כן עבור' }), 2500); }); await flush(6500);
  sentAll = await H(() => window.__h.sent.slice()); check(sentAll.includes('[ליבה→מנהל] מנהל שומע אם כן עבור'), 'manager sentence after a liba sentence is tagged for the manager: ' + JSON.stringify(sentAll.slice(-2)));
  check((await get('channel/owner') || {}).owner === 'manager', 'owner is manager after it');
  await p.evaluate(() => window.app({ liba: 'input', text: 'ליבה תחזור' })); await flush(2000);
  // 6c. two inputs within 1.5 s are both sent
  await p.evaluate(() => { window.app({ liba: 'input', text: 'ראשון' }); setTimeout(() => window.app({ liba: 'input', text: 'שני' }), 300); }); await flush(3500);
  sentAll = await H(() => window.__h.sent.slice()); check(sentAll.includes('[ליבה] ראשון') && sentAll.includes('[ליבה] שני'), 'two quick inputs both sent: ' + JSON.stringify(sentAll.slice(-2)));
  await p.evaluate(() => window.app({ liba: 'input', text: 'אל תפריע שעה' })); m = await flush(2600);
  check(((await get('channel/quiet') || {}).until || 0) > Date.now(), 'quiet set for an hour');
  await set('inbox/m-4', { from: 'liba', kind: 'say', speaker: 'ליבה', topic: 'רגיל', text: 'הודעה רגילה', spoken: false, ts: 4 });
  await set('inbox/m-5', { from: 'liba', kind: 'say', speaker: 'ליבה', topic: 'דחוף', priority: 'urgent', text: 'הודעה דחופה', spoken: false, ts: 5 });
  m = await flush(1500); const q1 = m.filter(x => x.liba === 'say').map(x => x.text);
  check(q1.some(t => /דחופה/.test(t)) && !q1.some(t => /רגילה/.test(t)), 'urgent passes, normal deferred: ' + JSON.stringify(q1));
  check(m.find(x => x.liba === 'say' && /דחופה/.test(x.text)).kind === 'call', 'urgent rings (kind call)');
  await p.evaluate(() => window.app({ liba: 'input', text: 'תפריע' })); m = await flush(2600);
  check(m.some(x => x.liba === 'say' && /רגילה/.test(x.text)), 'deferred message released after תפריע');
  // 8. tasks lifecycle announcements
  await set('tasks/t1', { title: 'משימת בדיקה', status: 'running', owner: 'עובד', updatedAt: 10 }); await flush(600);
  await set('tasks/t1', { title: 'משימת בדיקה', status: 'blocked', owner: 'עובד', question: 'לאשר?', updatedAt: 11 }); m = await flush(1500);
  check(m.some(x => x.liba === 'say' && /תקועה/.test(x.text) && /לאשר/.test(x.text)), 'board announces blocked task: ' + JSON.stringify(m.filter(x => x.liba === 'say').map(x => x.text)));
  check(m.some(x => x.liba === 'tasks' && /תקוע/.test(x.summary)), 'tasks summary posted to app');
  // 9. help + map + status commands local
  await p.evaluate(() => window.app({ liba: 'input', text: 'מה את יודעת' })); m = await flush(2600);
  const famN = await H(() => INTENT_HELP.length);
  check(m.some(x => x.liba === 'say' && /משפחות של פקודות/.test(x.text) && x.text.split(':')[2].split(',').length === famN), 'help spoken locally, as many families as the registry has: ' + famN);
  // 10. plain message goes to Claude untouched
  await p.evaluate(() => window.app({ liba: 'input', text: 'תזכיר לי מחר בתשע לקנות חלב' })); await flush(2000);
  sentAll = await H(() => window.__h.sent.slice()); check(sentAll[sentAll.length - 1] === '[ליבה] תזכיר לי מחר בתשע לקנות חלב', 'reminder request sent to Claude (not swallowed): ' + JSON.stringify(sentAll.slice(-1)));
  // 11. legacy chat/current: spoken once, acked, not replayed
  await set('chat/current', { id: 'r-1', kind: 'say', text: 'הודעה ישנה מהמנהל', ts: 6 }); m = await flush(1500);
  check(m.filter(x => x.liba === 'say' && /ישנה/.test(x.text)).length === 1, 'legacy message spoken once');
  check((await get('chat/current') || {}).spoken === true, 'legacy message acked');
  await set('chat/current', { id: 'r-1', kind: 'say', text: 'הודעה ישנה מהמנהל', ts: 6, spoken: true }); m = await flush(1000);
  check(!m.some(x => x.liba === 'say' && /ישנה/.test(x.text)), 'legacy rewrite not replayed');
  // 12. v36: with a 3.14 app the ack waits until the phone finished speaking
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.14.0' })); await flush(500);
  await set('inbox/m-spoke', { from: 'liba', kind: 'say', speaker: 'ליבה', topic: 'קול', text: 'משפט שממתין לסיום הדיבור', spoken: false, ts: 99 });
  m = await flush(1500);
  const sayMsg = m.find(x => x.liba === 'say' && /שממתין/.test(x.text));
  check(!!(sayMsg && sayMsg.id), 'say carries an utterance id');
  check((await get('inbox/m-spoke') || {}).spoken !== true, 'ack held while the phone is still speaking');
  await p.evaluate(id => window.app({ liba: 'spoke', id }), sayMsg && sayMsg.id); await flush(900);
  check((await get('inbox/m-spoke') || {}).spoken === true, 'ack written once the phone reported it finished');
  // 13. a sentence said while ליבה is still speaking is sent once she finishes, not lost
  await set('inbox/m-spoke2', { from: 'liba', kind: 'ask', speaker: 'ליבה', topic: 'קול', text: 'שאלה שנאמרת לאט', options: ['כן', 'לא'], spoken: false, ts: 100 });
  m = await flush(1200);
  const say2 = m.find(x => x.liba === 'say' && /לאט/.test(x.text));
  // wait PAST the 1.5 s tap window, so send() is really called while she speaks and the sentence really
  // enters the queue - before, the spoke came at 1.2 s, the sentence never queued, and the test proved nothing
  await p.evaluate(() => window.app({ liba: 'input', text: 'תשובה תוך כדי דיבור' })); const qm = await flush(2400);
  check(qm.some(x => x.liba === 'queued' && /תוך כדי/.test(x.text || '')), 'the sentence really entered the queue (the page told the bubble it waits)');
  let sentMid = await H(() => window.__h.sent.slice());
  check(!sentMid.some(t => /תוך כדי/.test(t)), 'answer given mid-sentence waits in the queue');
  await p.evaluate(id => window.app({ liba: 'spoke', id }), say2 && say2.id); await flush(2000);
  sentMid = await H(() => window.__h.sent.slice());
  check(sentMid.some(t => /תוך כדי/.test(t)), 'queued answer is sent once she finished speaking: ' + JSON.stringify(sentMid.slice(-1)));
  // 14. blackbox: a page failure is an event with a code, and the same code twice in one minute is one row
  await H(() => { window.__trace.fail('P_WAKELOCK', new Error('boom'), 'e2e'); window.__trace.fail('P_WAKELOCK', new Error('boom'), 'e2e'); });
  await p.waitForTimeout(4200);
  const ev = await H(() => window.__h.all('telemetry/events/items').filter(x => x.code === 'P_WAKELOCK' && x.ctx === 'e2e'));
  check(ev.length === 1, 'same code twice in one minute \u2192 one telemetry row: ' + JSON.stringify(ev.map(e => e.code + ':n' + e.n)));
  check(ev.length === 1 && ev[0].n === 2 && ev[0].src === 'p' && /^\d{4}-\d{2}-\d{2}$/.test(ev[0].day || ''), 'the row carries the code, the count and the day: ' + JSON.stringify(ev[0]));
  // 14b. the per-code cap drops, and the drop is itself written
  await H(() => { for (let i = 0; i < 40; i++) window.__trace.fail('E_SR_7', null, 'burst' + i); });
  await p.waitForTimeout(3600);
  const sr = await H(() => window.__h.all('telemetry/events/items').filter(x => x.code === 'E_SR_7' && x.src === 'p'));
  check(sr.length === 2, 'hot-loop code is capped at 2 rows per minute: ' + sr.length);
  const kept = await H(() => window.__h.all('telemetry/events/items').filter(x => x.code === 'E_SR_7' && x.src === 'p').reduce((a, x) => a + x.n, 0));
  check(kept === 2, 'only the capped rows are stored: ' + kept);
  // 15. a kotlin batch over the bridge lands in the same collection and is acked by id
  await p.evaluate(() => window.app({ liba: 'trace', batch: 'b17', events: JSON.stringify([
    { id: 'k1s7f3x-a91', t: Date.now(), c: 'E_SR_7', n: 41, ctx: 'wake|onDevice=true', v: '3.14.2', s: 'k' },
    { id: 'k1s7f3x-b02', t: Date.now(), c: 'E_TTS_INIT', n: 1, ctx: 'status=-1', v: '3.14.2', s: 'k' }]) }));
  m = await flush(1200);
  const kev = await H(() => window.__h.all('telemetry/events/items').filter(x => x.src === 'k'));
  check(kev.length === 2 && kev.some(x => x.code === 'E_SR_7' && x.n === 41 && x.ctx === 'wake|onDevice=true'), 'kotlin batch expanded into telemetry/events: ' + JSON.stringify(kev.map(x => x.code)));
  const ack = m.find(x => x.liba === 'traceAck');
  check(!!ack && ack.batch === 'b17' && JSON.parse(ack.ids).length === 2, 'batch acked back to the bubble with the written ids: ' + JSON.stringify(ack));
  // 15b. the same event id arriving twice overwrites its row instead of creating a second one
  await p.evaluate(() => window.app({ liba: 'trace', batch: 'b18', events: JSON.stringify([
    { id: 'k1s7f3x-a91', t: Date.now(), c: 'E_SR_7', n: 41, ctx: 'wake|onDevice=true', v: '3.14.2', s: 'k' }]) }));
  await flush(1000);
  const kev2 = await H(() => window.__h.all('telemetry/events/items').filter(x => x.src === 'k'));
  check(kev2.length === 2, 'a re-sent event overwrites its row, never duplicates it: ' + kev2.length);
  // 16. "\u05de\u05d4 \u05e0\u05e9\u05d1\u05e8 \u05d4\u05d9\u05d5\u05dd" answers in Hebrew, with no raw codes in the ear
  await p.evaluate(() => window.app({ liba: 'input', text: '\u05de\u05d4 \u05e0\u05e9\u05d1\u05e8 \u05d4\u05d9\u05d5\u05dd' })); m = await flush(3200);
  const brk = m.find(x => x.liba === 'say' && /\u05ea\u05e7\u05dc\u05d5\u05ea/.test(x.text));
  check(!!brk, 'what broke today is spoken');
  check(!!brk && !/E_[A-Z]|P_[A-Z]/.test(brk.text), 'spoken in Hebrew, no raw error codes: ' + JSON.stringify(brk && brk.text.slice(0, 160)));
  // page-kernel: text written by other sessions must stay text in the DOM
  await set('tasks/evil', { title: '<img src=x onerror="window.__pwned=1">רע', status: 'running', updatedAt: Date.now() });
  await flush(1200);
  const inj = await H(() => ({ imgs: document.querySelectorAll('#tasks img').length, pwned: !!window.__pwned, text: (document.getElementById('tasks') || {}).textContent || '' }));
  check(inj.imgs === 0 && !inj.pwned, 'task title with HTML does not become an element: ' + JSON.stringify({ imgs: inj.imgs, pwned: inj.pwned }));
  check(/<img src=x/.test(inj.text), 'task title with HTML is shown as text');
  const dev = await get('channel/device');
  check(dev && /^[0-9a-f]{12}$/.test(String(dev.pageHash || '')), 'channel/device carries the build hash: ' + JSON.stringify(dev && dev.pageHash));
  // page-kernel: said once survives a lost ack + reload; age is spoken; expired is not; interrupted says so
  const said = t => msgs.filter(x => x.liba === 'say' && String(x.text || '').includes(t));
  const speakOut = async (ms = 1400) => { const m = await flush(ms); for (const x of m) if (x.liba === 'say' && x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); await flush(700); };
  await set('inbox/k1', { text: 'בדיקת-קרנל-אחת', kind: 'say', from: 'liba', ts: Date.now() }); await speakOut();
  check(said('בדיקת-קרנל-אחת').length === 1 && (await get('inbox/k1') || {}).spoken === true, 'kernel: message read and acked');
  // the ack never landed, the page reloaded (this load's memory is gone), and the message comes back
  await H(() => window.__kernel.forgetLoad());
  await set('inbox/k1', { text: 'בדיקת-קרנל-אחת', kind: 'say', from: 'liba', ts: Date.now() }); await speakOut();
  check(said('בדיקת-קרנל-אחת').length === 1, 'kernel: after a lost ack and a reload it is NOT read again: ' + said('בדיקת-קרנל-אחת').length);
  check((await get('inbox/k1') || {}).repaired === true, 'kernel: the missing ack is repaired in the database');
  await set('inbox/k2', { text: 'הודעה-ישנה', kind: 'say', from: 'liba', ts: Date.now() - 3 * 3600 * 1000 }); await speakOut();
  check(said('הודעה-ישנה').some(x => /מלפני 3 שעות/.test(x.text)), 'kernel: a three-hour-old message is read with its age: ' + JSON.stringify(said('הודעה-ישנה').map(x => x.text.slice(0, 70))));
  await set('inbox/k3', { text: 'הודעה-שפגה', kind: 'say', from: 'liba', ts: Date.now() - 4 * 24 * 3600 * 1000 }); await speakOut();
  check(said('הודעה-שפגה').length === 0 && (await get('inbox/k3') || {}).expired === true, 'kernel: a four-day-old announcement is not read, it is marked expired');
  await set('inbox/k4', { text: 'שאלה-ישנה', kind: 'ask', from: 'liba', ts: Date.now() - 4 * 24 * 3600 * 1000 }); await speakOut();
  check(said('שאלה-ישנה').length === 1, 'kernel: an old question is still asked - questions never expire');
  await set('inbox/k5', { text: 'הודעה-שנקטעה', kind: 'say', from: 'liba', ts: Date.now(), speakingAt: Date.now() - 5000 }); await speakOut();
  check(said('הודעה-שנקטעה').some(x => /נקטע באמצע/.test(x.text)), 'kernel: a message cut off mid-sentence says so when it is read again');
  check((await get('inbox/k2') || {}).speakingAt > 0, 'kernel: phase one of the ack (speakingAt) is written before speaking');
  const st = await H(() => ({ s: window.__kernel.state(), n: window.__kernel.log.length, has: window.__kernel.log.some(x => x.to === 'SPEAKING') }));
  check(st.s === 'IDLE' && st.n > 0 && st.has, 'kernel: one state machine, back to IDLE, transitions logged: ' + JSON.stringify(st));
  // page-kernel: 3.16 speaks a heartbeat; silence for 6 s releases the queue, beats keep it held
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.16.0' })); await flush(600);
  await set('inbox/hb1', { text: 'דופק-נשמע', kind: 'say', from: 'liba', ts: Date.now() });
  let m1 = await flush(1200); const s1 = m1.find(x => x.liba === 'say' && /דופק-נשמע/.test(x.text || ''));
  for (let i = 0; i < 5; i++) { await p.evaluate(id => window.app({ liba: 'speaking', id }), s1 && s1.id); await flush(2000); }
  check(!(await get('inbox/hb1') || {}).spoken, 'heartbeat: while beats keep coming (10 s), the message is still held');
  await p.evaluate(id => window.app({ liba: 'spoke', id }), s1 && s1.id); await flush(1200);
  check((await get('inbox/hb1') || {}).spoken === true, 'heartbeat: acked once the phone reports it finished');
  const t0 = Date.now();
  await set('inbox/hb2', { text: 'דופק-אבד', kind: 'say', from: 'liba', ts: Date.now() });
  let dv = null; for (let i = 0; i < 20; i++) { await flush(500); dv = (await get('inbox/hb2') || {}).delivery; if (dv && dv.attempts >= 1) break; }
  const waited = Date.now() - t0;
  check(dv && dv.attempts === 1 && dv.lastError === 'lost' && waited < 9500, 'heartbeat: no beat and no spoke - released after ~6 s, not 120, and put back as not delivered: ' + waited + 'ms ' + JSON.stringify(dv));
  // inbox-lease: the retry that the phone does finish is the one that is acked
  let retry = null; for (let i = 0; i < 12 && !retry; i++) retry = (await flush(500)).find(x => x.liba === 'say' && /דופק-אבד/.test(x.text || ''));
  if (retry) await p.evaluate(id => window.app({ liba: 'spoke', id }), retry.id); await flush(900);
  const hb2 = await get('inbox/hb2') || {};
  check(retry && hb2.spoken === true && hb2.delivery && hb2.delivery.state === 'spoken', 'inbox-lease: the retry the phone finished is acked spoken');
  // three silent tries: the message is marked failed, and that is said once - it never loops forever
  await set('inbox/hb3', { text: 'דופק-אבד-תמיד', kind: 'say', from: 'liba', topic: 'בדיקה', ts: Date.now() });
  for (let i = 0; i < 34 && !(await get('inbox/hb3') || {}).failed; i++) await flush(1000);
  const hb3 = await get('inbox/hb3') || {};
  let failTold = said('לא הצלחתי להקריא שלוש פעמים'); for (let i = 0; i < 12 && !failTold.length; i++) { await speakOut(500); failTold = said('לא הצלחתי להקריא שלוש פעמים'); }
  check(hb3.failed === true && hb3.delivery && hb3.delivery.attempts === 3 && !hb3.spoken, 'inbox-lease: three silent tries → failed, attempts 3, never marked spoken: ' + JSON.stringify(hb3.delivery));
  check(failTold.length === 1, 'inbox-lease: the failure is said once: ' + failTold.map(x => x.text).join(' | '));
  // protocol-contract: hello carries the contract version; the page tells an older app apart from an older page
  const oldSaid = () => msgs.filter(x => x.liba === 'say' && /ישנה מהדף/.test(x.text || '')).length;
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.17.0', pv: 2, caps: ['spoke', 'beat', 'trace', 'proto'] })); await flush(2200);
  const ring = await H(() => window.__trace.ring.map(x => x.c));
  check(oldSaid() === 0 && ring.includes('P_PROTO_PAGE_OLD'), 'contract: app newer than the page - logged for ליבה, not spoken to Meir');
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.17.0', pv: 0.5, caps: ['spoke'] })); await flush(2200);
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.17.0', pv: 0.5, caps: ['spoke'] })); await flush(2200);
  check(oldSaid() === 1, 'contract: app older than the page - Meir hears it once, not on every hello: ' + oldSaid());
  const beats = await H(() => ({ beat: hasCap('beat'), spoke: hasCap('spoke') }));
  check(beats.beat === false && beats.spoke === true, 'contract: capabilities come from hello, not from the version number: ' + JSON.stringify(beats));
  // req-spine: every sentence is a request with an id that travels to Claude and comes back on the reply
  await p.evaluate(() => window.app({ liba: 'input', text: 'בקשה-עם-מספר', source: 'voice' })); await flush(2600);
  const raw = await H(() => window.__h.sentRaw.filter(t => /בקשה-עם-מספר/.test(t)));
  const rid = ((raw[0] || '').match(/⟦#([0-9a-z]+)⟧$/) || [])[1];
  check(!!rid && /^\[ליבה/.test(raw[0]), 'req: the sentence reaches Claude with its tag intact at the start and its id at the end: ' + JSON.stringify(raw[0]));
  const rq = rid && await get('req/' + rid);
  check(rq && rq.text === 'בקשה-עם-מספר' && rq.source === 'voice' && rq.state === 'sent' && rq.askedAt > 0 && rq.sentAt >= rq.askedAt, 'req: the request document knows what, how, when asked and when sent: ' + JSON.stringify(rq && { s: rq.source, st: rq.state }));
  const turn = (await H(() => window.__h.all('chat/log/turns'))).find(x => x.text === 'בקשה-עם-מספר');
  check(turn && turn.req === rid, 'req: the conversation log points at the request');
  await set('inbox/rep1', { text: 'תשובה-לבקשה', kind: 'say', from: 'manager', re: rid, ts: Date.now() }); await speakOut();
  const rq2 = await get('req/' + rid);
  check(rq2 && rq2.state === 'answered' && rq2.firstReplyAt > 0 && (rq2.replies || []).includes('rep1'), 'req: a reply with re closes the loop - first reply time and the reply id: ' + JSON.stringify(rq2 && { st: rq2.state, r: rq2.replies }));
  await set('inbox/rep2', { text: 'תשובה-יתומה', kind: 'say', from: 'manager', re: 'nosuchreq', ts: Date.now() }); await speakOut();
  const orphan = await H(() => window.__trace.ring.filter(x => x.c === 'P_REQ_UNBOUND').length);
  check(orphan >= 1, 'req: a reply whose re matches nothing is counted as unbound, not dropped');
  const ids = await H(() => { const a = []; for (let i = 0; i < 20000; i++) a.push(mintId()); return { n: a.length, u: new Set(a).size, sorted: a.every((x, i) => i === 0 || a[i - 1] < x) }; });
  check(ids.u === ids.n && ids.sorted, 'req: 20,000 ids in a tight loop - 0 collisions and strictly ordered: ' + JSON.stringify(ids));
  await p.evaluate(() => window.app({ liba: 'input', text: 'כמה בקשות היום' })); await flush(2600);
  check(said('היום ביקשת').length >= 1, 'req: "כמה בקשות היום" answers from the requests: ' + JSON.stringify(said('היום ביקשת').map(x => x.text.slice(0, 80))));
  // clock: four measured segments, skew from the handshake, real speech start/end with a cause
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.19.0', pv: 1, caps: ['spoke', 'beat', 'trace', 'proto', 'clock'], wall: Date.now() - 40 })); await flush(800);
  const dev2 = await get('channel/device');
  const T0 = Date.now();
  await p.evaluate(t0 => window.app({ liba: 'input', text: 'מדידה-אחת', source: 'voice', stamps: JSON.stringify({ voice: t0 - 3000, heard: t0 - 1200, wall: t0 }) }), T0); await flush(2600);
  const mr = (await H(() => window.__h.sentRaw.filter(t => /מדידה-אחת/.test(t))))[0] || '';
  const mid = (mr.match(/⟦#([0-9a-z]+)⟧$/) || [])[1];
  let mq = await get('req/' + mid);
  check(mq && mq.t && mq.t.voice === T0 - 3000 && mq.t.heard === T0 - 1200 && mq.sentAt >= T0 && typeof mq.t.skew === 'number' && !mq.t.skewBad,
    'clock: the request keeps the phone\'s voice/heard stamps, when it was sent, and the measured skew: ' + JSON.stringify(mq && { t: mq.t, sent: mq.sentAt - T0 }));
  await set('inbox/clk1', { text: 'תשובה-מדודה', kind: 'say', from: 'manager', re: mid, ts: Date.now() });
  const mm = await flush(1400); const ms = mm.find(x => x.liba === 'say' && /תשובה-מדודה/.test(x.text || ''));
  const S0 = Date.now();
  await p.evaluate(([id, a, b]) => window.app({ liba: 'spoke', id, startAt: a, endAt: b, cause: 'done' }), [ms && ms.id, S0 + 100, S0 + 2100]); await flush(1200);
  mq = await get('req/' + mid);
  check(mq && mq.firstReplyAt > 0 && mq.spokeStartAt === S0 + 100 && mq.spokeEndAt === S0 + 2100 && mq.spokeCause === 'done',
    'clock: the reply\'s real speech start and end (from the phone) land on the request it answered');
  await p.evaluate(() => window.app({ liba: 'input', text: 'כמה זמן לוקח לך לענות' })); await flush(2600);
  const lat = said('בחציון');
  check(lat.length >= 1 && /עד שסיימתי לשמוע 2 שניות/.test(lat[0].text), 'clock: "כמה זמן לוקח לך לענות" answers from the measurements: ' + JSON.stringify(lat.map(x => x.text.slice(0, 120))));
  const day = await H(() => trDay(Date.now()));
  const md = await get('metrics/daily/days/' + day);
  check(md && md.latency && md.latency.asr && md.latency.asr.p50 === 1800 && md.latency.guard, 'clock: metrics/daily keeps p50/p90 per segment and the guard rate: ' + JSON.stringify(md && md.latency && md.latency.asr));
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.19.0', pv: 1, caps: ['clock'], wall: Date.now() - 5000 })); await flush(800);
  await p.evaluate(() => window.app({ liba: 'input', text: 'מדידה-עם-שעון-רע', source: 'voice', stamps: '{}' })); await flush(2600);
  const br = (await H(() => window.__h.sentRaw.filter(t => /שעון-רע/.test(t))))[0] || '';
  const bq = await get('req/' + ((br.match(/⟦#([0-9a-z]+)⟧$/) || [])[1]));
  check(bq && bq.t && bq.t.skewBad === true && (await H(() => window.__trace.ring.some(x => x.c === 'P_CLOCK_SKEW'))), 'clock: a 5-second skew marks the request as not measurable - it is left out, not corrected');
  await p.evaluate(() => window.app({ liba: 'spoke', id: 'nope', startAt: 1, endAt: 2, cause: 'guard' })); await flush(400);
  check(await H(() => window.__trace.ring.some(x => x.c === 'P_SPEAK_GUARD')), 'clock: a guard release (TTS never reported) is recorded as a fault');
  // core-machine: across EVERY scenario above, not one move outside the shared table
  const mv = await H(() => ({ illegal: window.__kernel.illegal(), state: window.__kernel.state(), bad: window.__kernel.log.filter(x => !x.ok).map(x => x.from + '>' + x.to) }));
  check(mv.illegal === 0, 'core-machine: the whole suite ran with 0 moves outside the state table: ' + JSON.stringify(mv));
  const told = msgs.filter(x => x.liba === 'state').map(x => x.state);
  check(told.includes('SPEAKING') && told.includes('IDLE'), 'core-machine: the bubble is told every move of the page: ' + told.length + ' moves');
  // mutation holes: a normal ack is written by the ack itself, not rescued later by the repair path
  await set('inbox/ackdirect', { text: 'אישור-ישיר', kind: 'say', from: 'liba', ts: Date.now() }); await speakOut();
  const ad = await get('inbox/ackdirect');
  check(ad && ad.spoken === true && !ad.repaired, 'a normal message is acked spoken:true directly, not by the repair path: ' + JSON.stringify(ad && { s: ad.spoken, r: ad.repaired }));
  // the same sentence twice within five seconds goes out once
  const before = (await H(() => window.__h.sent.slice())).filter(t => /משפט-כפול/.test(t)).length;
  await p.evaluate(() => window.app({ liba: 'input', text: 'משפט-כפול' })); await flush(2600);
  await p.evaluate(() => window.app({ liba: 'input', text: 'משפט-כפול' })); await flush(2600);
  const after = (await H(() => window.__h.sent.slice())).filter(t => /משפט-כפול/.test(t)).length;
  check(after - before === 1, 'the same sentence said twice within five seconds is sent once: ' + (after - before));
  // write-clearinghouse: near the quota telemetry is refused first; speech is never refused
  await set('channel/budget', { docs: 20000, limit: 25000 }); await flush(600);
  const telBefore = (await H(() => window.__h.all('telemetry/events/items'))).length;
  await H(() => { window.__trace.fail('P_AUDIO', new Error('x'), 'budget-test'); window.__trace.flush(); }); await flush(3800);
  const telAfter = (await H(() => window.__h.all('telemetry/events/items'))).length;
  const denied = await H(() => window.__ch.denied());
  check(telAfter === telBefore && denied.telemetry > 0, 'budget: at 80% of the quota telemetry is refused: ' + JSON.stringify(denied));
  await set('inbox/bud1', { text: 'דיבור-בזמן-תקציב', kind: 'say', from: 'liba', ts: Date.now() }); await speakOut();
  check((await get('inbox/bud1') || {}).spoken === true, 'budget: speech still goes through - its ack is written');
  await set('channel/budget', { docs: 900, limit: 25000 }); await flush(400);
  // a real quota error, caught by name: said aloud within two seconds, and the page degrades at once
  await H(() => { window.__quotaPath = 'chat/log'; });
  const q0 = Date.now();
  await set('inbox/bud2', { text: 'גורם-לכתיבת-יומן', kind: 'say', from: 'liba', ts: Date.now() });
  let full = []; for (let i = 0; i < 8 && !full.length; i++) { await speakOut(300); full = said('המסד מלא') }
  check(full.length >= 1 && Date.now() - q0 < 4000, 'budget: a quota error is said aloud within seconds: ' + (Date.now() - q0) + 'ms');
  check((await H(() => window.__ch.budget())).docs >= 25000, 'budget: after a quota error the page stops non-speech writes at once');
  await H(() => { window.__quotaPath = null; }); await set('channel/budget', { docs: 900, limit: 25000 }); await flush(400);
  // wal-queue: WHILE a sentence is on its way it is already written down, leased - a page that dies now keeps it
  await H(() => { window.__slowSend = 3000; });
  await p.evaluate(() => window.app({ liba: 'input', text: 'נכתב-לפני-שנשלח' })); await flush(2600);
  const inFlight = await H(() => JSON.parse(localStorage.getItem('liba.outbox') || '[]').filter(x => /נכתב-לפני-שנשלח/.test(x.text)));
  check(inFlight.length === 1 && inFlight[0].phase === 'sending' && inFlight[0].leaseUntil > Date.now(), 'wal: during the send the sentence is already in the outbox, leased: ' + JSON.stringify(inFlight.map(x => x.phase)));
  await flush(3000); await H(() => { window.__slowSend = 0; });
  const gone = await H(() => JSON.parse(localStorage.getItem('liba.outbox') || '[]').filter(x => /נכתב-לפני-שנשלח/.test(x.text)).length);
  check(gone === 0, 'wal: once delivered it is removed - by its request id');
  // windowed-reads: open the page over a channel with 3,000 documents. The open reads a bounded number of bodies,
  // the first sentence is heard fast, and reading five messages moves a few deltas each - not five times the channel.
  {
    const p2 = await b.newPage(); const e2 = [];
    p2.on('pageerror', e => e2.push(e.message));
    await p2.addInitScript('if (window.top !== window) window.__seedN = 3000;'); await p2.addInitScript(STUB);
    await p2.goto('file://' + tmp + '/h_host.html', { waitUntil: 'load' });
    const g = p2.frames()[1]; await g.waitForFunction(() => window.__h, null, { timeout: 5000 });
    await p2.waitForTimeout(700); const open = await g.evaluate(() => Object.assign({}, window.__h.reads));
    const t0 = Date.now(); await p2.evaluate(() => window.app({ liba: 'hello', ver: '3.20.0', caps: ['spoke', 'beat'] }));
    let heard = 0, first = 0, seen = [];
    for (let i = 0; i < 80 && heard < 5; i++) {
      await p2.waitForTimeout(100);
      const ms = await p2.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of ms) if (x.liba === 'say') { if (/חלון-\d/.test(x.text)) { if (!first) first = Date.now() - t0; heard++; seen.push(x.text); } await p2.evaluate(id => window.app({ liba: 'spoke', id }), x.id); }
    }
    await p2.waitForTimeout(800);
    const r = await g.evaluate(() => window.__h.reads);
    check(first > 0 && first < 2500, 'windows: with 3,000 documents the first sentence is heard in under 2.5 s: ' + first + 'ms');
    check(heard === 5, 'windows: all five fresh messages are read, in order: ' + seen.map(t => t.replace(/.*חלון-/, '')).join(','));
    check(open && open.docs <= 160, 'windows: opening the page reads at most 160 document bodies, not 3,000: ' + JSON.stringify(open));
    check(r.docs - open.docs <= 600, 'windows: reading five messages moves at most 600 document bodies (the old page moved each ack times the whole inbox): ' + JSON.stringify({ bodies: r.docs - open.docs, deltas: r.deltas - open.deltas }));
    const hear = async (re, n = 40) => { for (let i = 0; i < n; i++) { await p2.waitForTimeout(100); const ms = await p2.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; }); let hit = false; for (const x of ms) if (x.liba === 'say') { if (re.test(x.text)) hit = true; await p2.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } if (hit) return true; } return false; };
    // the real channel had it: a writer that never wrote spoken:false. The newest-window still hears it.
    await g.evaluate(() => window.__h.set('inbox/nofield', { from: 'liba', kind: 'say', text: 'בלי-שדה-נאמר', ts: Date.now() }));
    check(await hear(/בלי-שדה-נאמר/), 'windows: a message without the spoken field is still heard');
    // the store refuses a big scan: every window narrows once, says so in the black box, and speech goes on
    await g.evaluate(() => { window.__exhaust = 15; window.__h.set('inbox/x1', { from: 'liba', kind: 'say', text: 'אחרי-צמצום', spoken: false, ts: Date.now() }); });
    check(await hear(/אחרי-צמצום/), 'windows: after resource_exhausted the narrowed window still hears new messages');
    const codes = await g.evaluate(() => window.__trace.ring.map(l => l.c + ':' + l.ctx));
    check(codes.some(c => /^P_DB_WINDOW:inbox/.test(c)), 'windows: the narrowing is written to the black box as P_DB_WINDOW: ' + codes.filter(c => /WINDOW/.test(c)).join(','));
    check(!e2.length, 'windows: no page error on the big channel: ' + e2.join(' | '));
    await p2.close();
  }
  // outbox-keys: a sentence that could not go out says so on its own bubble, "מה לא נשלח" lists it, "תשלח שוב" sends it
  await H(() => { window.__noSend = true; });
  await p.evaluate(() => window.app({ liba: 'input', text: 'משפט-בלי-רשת' })); await flush(2600); await flush(16000);
  const st1 = await H(() => [...document.querySelectorAll('.tr .me')].filter(b => /משפט-בלי-רשת/.test(b.textContent)).map(b => b.dataset.st || '').pop());
  check(st1 === 'ממתין לרשת', 'outbox: the sentence that did not go out shows it on its bubble: ' + st1);
  await p.evaluate(() => window.app({ liba: 'input', text: 'מה לא נשלח' })); await speakOut(2600);
  check(said('משפט-בלי-רשת').some(x => /לא נשלח/.test(x.text)), '"מה לא נשלח" names the waiting sentence: ' + said('לא נשלח').map(x => x.text).pop());
  await H(() => { window.__noSend = false; });
  await p.evaluate(() => window.app({ liba: 'input', text: 'תשלח שוב' })); await speakOut(2600); await flush(3000);
  const sentNow = (await H(() => window.__h.sent.slice())).filter(t => /משפט-בלי-רשת/.test(t)).length;
  const st2 = await H(() => [...document.querySelectorAll('.tr .me')].filter(b => /משפט-בלי-רשת/.test(b.textContent)).map(b => b.dataset.st || '').pop());
  check(sentNow === 1 && st2 === 'נשלח באיחור', '"תשלח שוב" sends it once, and its bubble says it went out late: ' + JSON.stringify({ sentNow, st2 }));
  // the id mark is for sessions, never for Meir's ears
  await set('inbox/mark1', { text: 'תשובה עם סימן ⟦#0abc123def⟧ בסוף', kind: 'say', from: 'manager', spoken: false, ts: Date.now() }); await speakOut(2000);
  check(said('תשובה עם סימן').length && !said('⟦').length, 'the ⟦#id⟧ mark is never read aloud: ' + said('תשובה עם סימן').map(x => x.text).pop());
  // words-offline: a sentence kept on the phone while the page was down arrives with its time, and is filed as offline
  await p.evaluate(() => window.app({ liba: 'input', text: '(נאמר ב-14:32 כשהערוץ היה סגור) משפט-מהתור', source: 'offline' })); await flush(2600);
  const offReq = (await H(() => window.__h.all('req'))).find(r => /משפט-מהתור/.test(r.text || ''));
  check(offReq && offReq.source === 'offline' && /נאמר ב-14:32/.test(offReq.text), 'words-offline: the kept sentence is sent with its time, filed as offline: ' + JSON.stringify(offReq && offReq.source));
  console.log('\nERRORS:\n' + (errs.join('\n') || 'none'));
  console.log('\nALL SAY TEXTS:\n' + msgs.filter(x => x.liba === 'say').map(x => ' - ' + x.text.slice(0, 90)).join('\n'));
  await b.close();
  console.log(failed.length ? `\n${failed.length} נכשלו:\n  ` + failed.join('\n  ') : '\nכל הבדיקות עברו');
  if (failed.length) process.exit(1);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
