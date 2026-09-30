// step local-brain, the page's side: to a bubble with 'mirror' the page sends its picture of the state - the tasks that
// matter, the brief, who is awake - only when it changed; never to a bubble without it. "מה תקוע" answers from the board.
// Run: node tests/mirror.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-mirror-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__mirror && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const take = () => p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
  const hello = caps => p.evaluate(c => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: c, wall: Date.now() }); }, caps);
  await f.evaluate(() => { const now = Date.now(); window.__h.set('tasks/t1', { title: 'בניית דוח ההכנסות', status: 'blocked', question: 'לאיזה חודש?', updatedAt: now }); window.__h.set('tasks/t2', { title: 'סידור הגלריה', status: 'running', updatedAt: now - 1000 }); window.__h.set('tasks/t3', { title: 'ישנה', status: 'done', updatedAt: now - 5000 }); });
  await hello(['spoke']); await p.waitForTimeout(800); await take();
  ok((await f.evaluate(() => window.__mirror.push(true))) === false && !(await take()).some(x => x.liba === 'mirror'), 'a bubble without mirror gets nothing');
  await hello(['spoke', 'mirror']); await p.waitForTimeout(800); await take();
  ok(await f.evaluate(() => window.__mirror.push()), 'a bubble with mirror: sent');
  const m = (await take()).find(x => x.liba === 'mirror'); const body = m && JSON.parse(m.body);
  ok(body && body.tasks.length === 2 && body.tasks[0].question === 'לאיזה חודש?' && !body.tasks.some(t => t.status === 'done'), 'the picture: blocked and running tasks, with the question, no done ones');
  ok((await f.evaluate(() => window.__mirror.push())) === false, 'nothing changed: not sent again');
  await f.evaluate(() => window.__h.set('channel/brief', { ver: 1, at: Date.now(), sessionId: 'session_AAA111', openLoop: ['השוואת הצעות לגג'], nextAction: 'לשלוח לספק השני' }));
  await p.waitForTimeout(400);
  ok(await f.evaluate(() => window.__mirror.push()), 'the brief changed: sent');
  const m2 = (await take()).find(x => x.liba === 'mirror'); const b2 = m2 && JSON.parse(m2.body);
  ok(b2 && b2.openLoop[0] === 'השוואת הצעות לגג' && b2.nextAction === 'לשלוח לספק השני' && b2.brain === 'n_AAA111', 'the brief is in it: ' + JSON.stringify(b2 && { openLoop: b2.openLoop, brain: b2.brain }));
  const heard = [];
  await p.evaluate(() => window.app({ liba: 'input', text: 'מה תקוע' }));
  const end = Date.now() + 2000; while (Date.now() < end) { for (const x of await take()) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(50); }
  ok(heard.some(t => /משימה אחת תקועה: בניית דוח ההכנסות - לאיזה חודש\?/.test(t)), '"מה תקוע": ' + heard.join(' | ').slice(0, 120));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
