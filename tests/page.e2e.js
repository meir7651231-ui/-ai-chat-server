// צעד 99: בדיקת קצה-לקצה של הדף עם אפליקציה ומסד מדומים. הרצה: NODE_PATH=$(npm root -g) node tests/page.e2e.js
const { chromium } = require('playwright'); const fs = require('fs');
const STUB = `(()=>{ if (window.top === window) return; // only inside the iframe
const docs=new Map(), colSubs=new Map(), docSubs=new Map();
const parts=p=>p.split('/').filter(Boolean);
const colOf=p=>{const a=parts(p);return a.slice(0,-1).join('/');};
function snapDoc(path){const d=docs.get(path);return {exists:!!d,data:()=>d?JSON.parse(JSON.stringify(d)):undefined,id:parts(path).pop()};}
function notify(path){const c=colOf(path);(colSubs.get(c)||[]).forEach(cb=>cb(colSnap(c)));(docSubs.get(path)||[]).forEach(cb=>cb(snapDoc(path)));}
function colSnap(c){const n=parts(c).length;const out=[];for(const [p,d] of docs){const a=parts(p);if(a.length===n+1&&a.slice(0,n).join('/')===c)out.push({id:a[n],data:()=>JSON.parse(JSON.stringify(d)),ref:docRef(p)});}return {docs:out};}
function docRef(path){return {path,collection:n=>colRef(path+'/'+n),
 set:async d=>{if(parts(path).length%2)throw Object.assign(new Error('bad doc path '+path),{code:'bad_path'});docs.set(path,JSON.parse(JSON.stringify(d)));notify(path);},
 update:async d=>{if(!docs.has(path))throw Object.assign(new Error('missing '+path),{code:'not_found'});docs.set(path,Object.assign(docs.get(path),JSON.parse(JSON.stringify(d))));notify(path);},
 delete:async()=>{docs.delete(path);notify(path);},
 get:async()=>snapDoc(path),
 onSnapshot:(cb,err)=>{if(!docSubs.has(path))docSubs.set(path,[]);docSubs.get(path).push(cb);setTimeout(()=>cb(snapDoc(path)),0);return()=>{};}};}
function colRef(c){return {path:c,doc:id=>docRef(c+'/'+id),get:async()=>colSnap(c),
 onSnapshot:(cb,err)=>{if(parts(c).length%2===0){if(err)err({code:'bad_collection_path'});throw new Error('bad collection path '+c);}if(!colSubs.has(c))colSubs.set(c,[]);colSubs.get(c).push(cb);setTimeout(()=>cb(colSnap(c)),0);return()=>{};}};}
const db={doc:p=>{if(parts(p).length%2)throw new Error('bad doc path '+p);return docRef(p);},collection:c=>colRef(c)};
const sent=[];const comments={canSendToClaude:async()=>'available',anchorFor:async()=>({}),sendToClaude:async o=>{sent.push(o.text);window.parent.postMessage({harness:'sent',text:o.text},'*');}};
window.claude={use:async n=>n==='db'?db:n==='comments'?comments:null};
window.__h={db,docs,set:(p,d)=>docRef(p).set(d),get:p=>docs.get(p),all:c=>colSnap(c).docs.map(x=>({id:x.id,...x.data()})),sent};
})();`;
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
  const check = (c, m) => console.log((c ? 'PASS ' : 'FAIL ') + m);
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
  const notes = await H(() => window.__h.all('memory/notes/items')); check(notes.length === 1 && /דני/.test(notes[0].text), 'memory note stored: ' + JSON.stringify(notes.map(n => n.text)));
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
  check(m.some(x => x.liba === 'say' && /תשע משפחות/.test(x.text)), 'help spoken locally');
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
  console.log('\nERRORS:\n' + (errs.join('\n') || 'none'));
  console.log('\nALL SAY TEXTS:\n' + msgs.filter(x => x.liba === 'say').map(x => ' - ' + x.text.slice(0, 90)).join('\n'));
  await b.close();
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
