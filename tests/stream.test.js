// step stream-answer: a six-sentence answer is heard while it is still being written, in order, from the first part
// within 700 ms; the reply to what Meir just asked jumps five waiting messages. Run: node tests/stream.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-stream-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(Object.assign({at:Date.now()},e.data));});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.26.0', pv: 1, caps: ['spoke', 'beat'], wall: Date.now() })); await p.waitForTimeout(500);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const set = (k, v) => f.evaluate(([k, v]) => window.__h.set(k, v), [k, v]);
  const said = []; let pumpOn = true;
  const phone = (async () => { while (pumpOn) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { said.push({ t: x.text, at: x.at }); if (x.id) setTimeout(() => p.evaluate(id => window.app({ liba: 'spoke', id }), x.id).catch(() => {}), 150); } await p.waitForTimeout(40); } })();
  // (a) six sentences written two seconds apart
  await set('inbox/s1', { from: 'manager', kind: 'say', topic: 'הדוח', stream: true, text: '', spoken: false, ts: Date.now() });
  const w = [];
  for (let i = 1; i <= 6; i++) { w[i] = Date.now(); await set('inbox/s1/parts/x' + i, { seq: i, text: 'חלק-' + i + '.', final: i === 6 }); if (i < 6) await p.waitForTimeout(2000); }
  await p.waitForTimeout(2500);
  const heard = said.filter(x => /חלק-\d/.test(x.t)), order = heard.map(x => +/חלק-(\d)/.exec(x.t)[1]);
  const firstMs = heard.length ? heard[0].at - w[1] : null, lead = heard.length ? w[6] - heard[0].at : null;
  ok(firstMs !== null && firstMs <= 700, 'stream: the first sentence is heard within 700 ms of being written: ' + firstMs + 'ms');
  ok(lead !== null && lead >= 8000, 'stream: it starts at least 8 s before the last sentence is written: ' + lead + 'ms');
  ok(order.join() === '1,2,3,4,5,6', 'stream: six parts, in order: ' + order.join());
  ok(/המנהל, בנוגע להדוח/.test(heard[0] && heard[0].t) && !/בנוגע/.test(heard[1] && heard[1].t), 'stream: the speaker and topic open the first part only');
  const s1 = await f.evaluate(() => window.__h.get('inbox/s1')), left = await f.evaluate(() => window.__h.all('inbox/s1/parts').length);
  ok(s1 && s1.spoken === true && /חלק-1\. חלק-2\..*חלק-6/.test(s1.text) && left === 0, 'stream: the message ends acked with its whole text, and the parts are gone: ' + JSON.stringify({ text: s1 && s1.text.slice(0, 40), left }));
  // (b) the fast lane: five waiting messages, then the reply to what Meir just asked - it is heard first
  await set('channel/quiet', { until: Date.now() + 3600e3 }); await p.waitForTimeout(400);
  for (let i = 1; i <= 5; i++) await set('inbox/bulk' + i, { from: 'manager', kind: 'say', text: 'רגיל-' + i, spoken: false, ts: Date.now() + i });
  await p.evaluate(() => window.app({ liba: 'input', text: 'שאלה-שממתינה-לתשובה' })); await p.waitForTimeout(2600);
  const req = (await f.evaluate(() => window.__h.all('req'))).find(r => r.text === 'שאלה-שממתינה-לתשובה');
  await set('inbox/reply1', { from: 'manager', kind: 'say', text: 'תשובה-מהירה', re: req && req.id, spoken: false, ts: Date.now() + 99 });
  said.length = 0; await set('channel/quiet', { until: 0 }); await p.waitForTimeout(6000);
  const seq = said.map(x => x.t).filter(t => /רגיל-\d|תשובה-מהירה/.test(t));
  ok(seq.length >= 2 && /תשובה-מהירה/.test(seq[0]), 'fast lane: the reply to what Meir just asked jumps five waiting messages: ' + seq.map(t => t.replace(/.*: /, '')).join(', '));
  pumpOn = false; await phone;
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
