// step silence-ledger: every held message records why, "מה פספסתי" counts them by reason exactly, and "תשחרר הכול"
// leaves nothing stuck. 60 messages: 15 while the page is not connected, then 15 in a quiet hour, 15 that wait for the
// morning, 15 that another device holds - the last three all at the same time. Run: node tests/silence.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-silence-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__silence && window.claude, null, { timeout: 8000 });
  await p.waitForTimeout(700);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const set = (k, v) => f.evaluate(([k, v]) => window.__h.set(k, v), [k, v]);
  const said = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { said.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(60); } };
  const msg = (id, extra) => set('inbox/' + id, Object.assign({ from: 'manager', kind: 'say', text: 'נוסח-' + id, spoken: false, ts: Date.now() }, extra || {}));

  // 15 while not connected to the bubble (no hello yet)
  for (let i = 0; i < 15; i++) await msg('off' + i, { topic: 'ניתוק' });
  await p.waitForTimeout(1500);
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.21.0', pv: 1, caps: ['spoke', 'beat'], wall: Date.now() }));
  await speak(9000); said.length = 0;
  // now three holds at once: a quiet hour, morning messages at three at night, and messages another device claimed
  await f.evaluate(() => { window.__testHour = 3; });
  await set('channel/quiet', { until: Date.now() + 3600e3 }); await speak(500);
  await f.evaluate(() => { for (let i = 0; i < 15; i++) window.__h.leases.set('inbox/cl' + i, { holder: 'other-device', until: Date.now() + 4000 }); });
  for (let i = 0; i < 15; i++) await msg('q' + i, { topic: 'שקט' });
  for (let i = 0; i < 15; i++) await msg('m' + i, { topic: 'בוקר', priority: 'morning' });
  for (let i = 0; i < 15; i++) await msg('cl' + i, { topic: 'מכשיר אחר', priority: 'urgent' });
  await speak(2500);
  const docs = await f.evaluate(() => [...window.__h.docs.entries()].filter(([k]) => /^inbox\/(off|q|m|cl)\d+$/.test(k)).map(([k, v]) => ({ k, holds: Object.keys(v.holds || {}) })));
  const want = k => /\/off/.test(k) ? 'offline' : /\/q\d/.test(k) ? 'quiet' : /\/m\d/.test(k) ? 'morning' : 'claim';
  const right = docs.filter(d => d.holds.includes(want(d.k)));
  ok(docs.length === 60 && right.length === 60, `holds: ${right.length}/60 carry a hold with the right reason` + (right.length < 60 ? ': ' + docs.filter(d => !d.holds.includes(want(d.k))).slice(0, 4).map(d => d.k + '=' + d.holds).join(' ') : ''));
  // "מה פספסתי": the exact count by reason, of what is waiting right now
  said.length = 0; await p.evaluate(() => window.app({ liba: 'input', text: 'מה פספסתי' })); await speak(2600);
  const told = said.find(t => /מחכות לך/.test(t)) || '';
  ok(/מחכות לך 45 הודעות/.test(told) && /15 בגלל השקט/.test(told) && /15 מחכות לבוקר/.test(told) && /15 כי מכשיר אחר מקריא אותן/.test(told), '"מה פספסתי" counts by reason exactly: ' + told);
  // "תשחרר הכול": quiet and morning go out (merged/grouped by the pump); the other device's claim lapses on its own
  said.length = 0; await p.evaluate(() => window.app({ liba: 'input', text: 'תשחרר הכול' })); await speak(30000);
  const stuck = await f.evaluate(() => window.__silence.held());
  const unspoken = await f.evaluate(() => [...window.__h.docs.entries()].filter(([k, v]) => /^inbox\/(off|q|m|cl)\d+$/.test(k) && !v.spoken).map(([k]) => k));
  ok(stuck.length === 0 && unspoken.length === 0, 'release: after "תשחרר הכול" nothing is stuck and all 60 were read: ' + JSON.stringify({ stuck: stuck.length, unspoken: unspoken.slice(0, 5) }));
  ok(said.some(t => /בזמן השקט הצטברו/.test(t)), 'release: the pile is introduced with why it piled up: ' + (said.find(t => /הצטברו/.test(t)) || ''));
  const day = await f.evaluate(() => window.__silence.day());
  ok(day.offline >= 15 && day.quiet >= 15 && day.morning >= 15 && day.claim >= 15, 'ledger: the day counts holds by reason: ' + JSON.stringify(day));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
