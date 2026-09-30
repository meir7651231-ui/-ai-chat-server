// steps brief-handoff + wake-envelope: every sentence to Claude carries one packet (<= 1800 characters, a wake id, the
// contract line) kept in brain/wakes, the tag still first and the ⟦#id⟧ mark still last; "איפה עצרנו" names a real task
// - the brain's own words, or derived from the tasks and said so; a new brain is announced once, before its question;
// the contract is in channel/protocol.brief. Run: node tests/brain.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-brain-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__brain && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: ['spoke'], wall: Date.now() }); }); await p.waitForTimeout(800);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(50); } };
  const say = async t => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(2300); return heard.join(' | '); };
  // no brief yet: derived from the tasks
  await f.evaluate(() => { const now = Date.now(); window.__h.set('tasks/t1', { title: 'בניית דוח ההכנסות', status: 'blocked', question: 'לאיזה חודש?', updatedAt: now }); window.__h.set('tasks/t2', { title: 'סידור הגלריה', status: 'running', updatedAt: now - 1000 }); });
  await p.waitForTimeout(500);
  let s = await say('איפה עצרנו');
  ok(/עצרנו בבניית דוח ההכנסות|עצרנו בסידור הגלריה/.test(s) && /הסקתי מהמשימות/.test(s), '"איפה עצרנו" with no brief: a real task, and said to be derived: ' + s.slice(0, 140));
  // a sentence to Claude carries the envelope
  const before = await f.evaluate(() => window.__h.sentRaw.length);
  for (const t of ['מה המצב עם הדוח', 'תבדוק את הגלריה בבקשה', 'כמה עלה החודש']) await say(t);
  const sent = await f.evaluate(b => window.__h.sentRaw.slice(b), before);
  const env = sent.map(x => { const i = x.indexOf('[מעטפה#'); const j = x.lastIndexOf(' ⟦#'); return i < 0 ? null : x.slice(i, j); });
  ok(sent.length === 3 && env.every(e => e && e.length <= 1800) && sent.every(x => /^\[ליבה/.test(x) && / ⟦#[0-9a-z]+⟧$/.test(x)), 'every sentence to Claude: the tag first, one packet of at most 1800 characters, the mark last: ' + env.map(e => e && e.length).join(','));
  ok(env.every(e => /קרא את channel\/brief/.test(e) && /תקוע: בניית דוח ההכנסות \(לאיזה חודש\?\)/.test(e) && /על הקו: ליבה/.test(e)), 'the packet: the contract line, what is stuck, who holds the line');
  const wakes = await f.evaluate(() => window.__h.all('brain/wakes/items'));
  const ids = sent.map(x => (x.match(/⟦#([0-9a-z]+)⟧$/) || [])[1]);
  ok(ids.every(id => wakes.some(w => w.id === id && w.envelope && w.len <= 1800)), 'each packet is kept in brain/wakes under the wake id (the request id): ' + wakes.length);
  ok(env[2] && /לפני כן: .*מאיר: תבדוק את הגלריה/.test(env[2]), 'the last sentences are in it: ' + (env[2] || '').split('\n').find(l => /לפני כן/.test(l)));
  // the brain writes its brief
  await f.evaluate(() => window.__h.set('channel/brief', { ver: 1, at: Date.now(), sessionId: 'session_AAA111', model: 'x', openLoop: ['השוואת הצעות מחיר לגג'], waitingOn: 'מאיר: איזה ספק', nextAction: 'לשלוח לספק השני', doNot: ['לא להזמין לפני אישור'] }));
  await p.waitForTimeout(400);
  s = await say('איפה עצרנו');
  ok(/עצרנו בהשוואת הצעות מחיר לגג\. הצעד הבא: לשלוח לספק השני/.test(s) && !/הסקתי/.test(s), '"איפה עצרנו" from the brain\'s own brief: ' + s.slice(0, 120));
  s = await say('מי המוח');
  ok(/המוח עכשיו: n_AAA111/.test(s), '"מי המוח": ' + s.slice(0, 80));
  const e2 = await f.evaluate(async () => await window.__brain.wake('בדיקה', 'w-test'));
  ok(/פתוח: השוואת הצעות מחיר לגג/.test(e2) && /לא לעשות: לא להזמין לפני אישור/.test(e2) && !/\(נגזר\)/.test(e2.split('\n')[1] || ''), 'the packet carries the brain\'s own open loop and do-not');
  // a question from a new brain is announced once
  await f.evaluate(() => window.__h.set('inbox/q1', { from: 'manager', kind: 'ask', speaker: 'המנהל', topic: 'גג', text: 'איזה ספק?', options: ['הראשון', 'השני'], spoken: false, ts: Date.now() }));
  heard.length = 0; await speak(2500);
  await f.evaluate(() => { window.__h.set('channel/brief', { ver: 2, at: Date.now(), sessionId: 'session_BBB222', openLoop: ['סגירת הזמנת הגג'] }); });
  await p.waitForTimeout(300);
  await f.evaluate(() => window.__h.set('inbox/q2', { from: 'manager', kind: 'ask', speaker: 'המנהל', topic: 'גג', text: 'לסגור?', options: ['כן', 'לא'], spoken: false, ts: Date.now() }));
  await speak(2500);
  const q2 = heard.find(t => /לסגור/.test(t)) || '';
  ok(/מדבר איתך עכשיו מוח אחר, והוא ממשיך מסגירת הזמנת הגג/.test(q2), 'a new brain is said once, before its question: ' + q2.slice(0, 120));
  // the contract, where every session reads
  const pr = await f.evaluate(async () => { await new Promise(r => setTimeout(r, 5500)); return window.__h.get('channel/protocol'); });
  ok(pr && pr.brief && /channel\/brief/.test(pr.brief.doc) && /re=/.test(pr.brief.rule), 'the contract is in channel/protocol.brief');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
