// step faults, the page's side: the same phone fault three times in a day opens one repair worker (the code, the
// version, the context in its spec); a batch sent twice counts once; the fourth and fifth open nothing more; refused
// commands never count; when the mandate says ask first, one sentence instead. Run: node tests/faults.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-faults-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__faults && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const take = () => p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
  const hello = caps => p.evaluate(c => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: c, wall: Date.now() }); }, caps);
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.35.0', pv: 1, caps: ['spoke', 'trace'], wall: Date.now() }); }); await p.waitForTimeout(800);
  await f.evaluate(() => { window.__h.set('memory/mandate', { levels: { open_worker: 'act_then_tell' }, budget: { maxWorkersPerDay: 10, maxActionsPerHour: 1000 } }); });
  await f.evaluate(() => window.__agent.load()); await p.waitForTimeout(200);
  const heard = []; const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(40); } };
  const batch = (b, evs) => p.evaluate(([b, e]) => window.app({ liba: 'trace', batch: b, events: JSON.stringify(e) }), [b, evs]);
  const ev = (id, c, ctx) => ({ id, t: Date.now(), c, n: 1, ctx: ctx || 'len:120', v: '3.35.0', s: 'k' });
  await batch('b1', [ev('e1', 'E_TTS_GUARD'), ev('e2', 'E_TTS_GUARD')]); await batch('b1', [ev('e1', 'E_TTS_GUARD'), ev('e2', 'E_TTS_GUARD')]);
  await p.waitForTimeout(500);
  let ws = await f.evaluate(() => window.__h.all('workers'));
  ok(ws.length === 0, 'two faults, the batch sent twice: still two - no worker');
  heard.length = 0; await batch('b2', [ev('e3', 'E_TTS_GUARD', 'len:340')]); await p.waitForTimeout(600); await speak(1500);
  ws = await f.evaluate(() => window.__h.all('workers'));
  ok(ws.length === 1 && ws[0].kind === 'fix' && /E_TTS_GUARD/.test(ws[0].spec) && /3\.35\.0/.test(ws[0].spec) && /len:340/.test(ws[0].spec) && ws[0].title === 'תיקון: הקול נתקע באמצע', 'the third: one repair worker, with the code, the version and the context: ' + (ws[0] && ws[0].title));
  ok(heard.some(h => /תקלה חזרה שלוש פעמים היום: הקול נתקע באמצע\. פתחתי עובד תיקון/.test(h)), 'and Meir hears it once: ' + heard.join(' | ').slice(0, 100));
  await batch('b3', [ev('e4', 'E_TTS_GUARD'), ev('e5', 'E_TTS_GUARD'), ev('e6', 'E_TTS_GUARD')]); await p.waitForTimeout(600);
  ws = await f.evaluate(() => window.__h.all('workers'));
  ok(ws.length === 1, 'more of the same today: no second worker');
  await batch('b4', [1, 2, 3, 4, 5].map(i => ev('r' + i, 'E_CMD_REFUSED', 'held:SPEAKER:2'))); await p.waitForTimeout(500);
  ok((await f.evaluate(() => window.__h.all('workers'))).length === 1, 'refused commands and held messages never count');
  await f.evaluate(() => { window.__h.set('memory/mandate', { levels: { open_worker: 'ask_first' }, budget: { maxWorkersPerDay: 10, maxActionsPerHour: 1000 } }); });
  await f.evaluate(() => window.__agent.load()); heard.length = 0;
  await batch('b5', [ev('m1', 'E_MIC_READ'), ev('m2', 'E_MIC_READ'), ev('m3', 'E_MIC_READ')]); await p.waitForTimeout(600); await speak(1500);
  ok((await f.evaluate(() => window.__h.all('workers'))).length === 1 && heard.some(h => /תקלה חזרה שלוש פעמים היום: המיקרופון\. אם לפתוח עובד תיקון, תגיד "תתקן את התקלה של המיקרופון"/.test(h)), 'ask first: one sentence, no worker: ' + heard.join(' | ').slice(0, 120));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
