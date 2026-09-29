// step freshness-ttl: a message's age is never said wrong (tests/stale.cases.json, 50 fixed moments), twelve updates on
// one task are at most three utterances, a message past its validUntil is dropped or restated from its source.
// Run: node tests/stale.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const corpus = JSON.parse(fs.readFileSync(path.join(__dirname, 'stale.cases.json'), 'utf8')).cases;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-stale-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__fresh && window.claude, null, { timeout: 8000 });
  await p.waitForTimeout(700);
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.21.0', pv: 1, caps: ['spoke', 'beat'], wall: Date.now() })); await p.waitForTimeout(500);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const set = (k, v) => f.evaluate(([k, v]) => window.__h.set(k, v), [k, v]);
  const get = k => f.evaluate(k => window.__h.get(k), k);
  const said = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { said.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(100); } };

  // (a) the corpus
  const got = await f.evaluate(cs => cs.map(c => window.__fresh.ago(c.now, c.ts)), corpus);
  const wrong = corpus.map((c, i) => ({ c, g: got[i] })).filter(x => x.g !== x.c.want);
  ok(wrong.length === 0, `age words: ${corpus.length - wrong.length}/${corpus.length} exactly right` + (wrong.length ? ' - ' + wrong.slice(0, 4).map(x => `${x.c.nowIL}←${x.c.tsIL}: "${x.g}" ≠ "${x.c.want}"`).join('; ') : ''));

  // (b) twelve updates on one task, piled up during a quiet hour: at most three utterances when the quiet ends
  await set('channel/quiet', { until: Date.now() + 3600e3 }); await speak(600);
  const t0 = Date.now();
  for (let i = 1; i <= 12; i++) await set('inbox/u' + i, { from: 'manager', kind: 'say', topic: 'הבנייה', task: 'build-1', text: 'עדכון-' + i, spoken: false, ts: t0 + i });
  await speak(800); said.length = 0;
  await set('channel/quiet', { until: 0 }); await speak(6000);
  const about = said.filter(t => /עדכון-\d+|הצטברו/.test(t));
  const acked = await f.evaluate(() => [...window.__h.docs.entries()].filter(([k, v]) => /^inbox\/u\d+$/.test(k) && v.spoken).length);
  ok(about.length <= 3 && about.some(t => /עדכון-12/.test(t)) && about.some(t => /מתוך 12/.test(t)), 'merge: 12 updates on one task → ' + about.length + ' utterances, the newest, saying "מתוך 12": ' + about.join(' | '));
  ok(acked === 12, 'merge: all twelve are acked (the merged ones never come back): ' + acked);

  // (c) past validUntil: drop is not read and counted once; restate reads the task again and says what is true now
  said.length = 0;
  await set('tasks/tx', { title: 'הבנייה', status: 'done', updatedAt: Date.now() });
  await set('inbox/old-drop', { from: 'manager', kind: 'say', text: 'המשימה עדיין רצה', validUntil: Date.now() - 1000, staleMode: 'drop', spoken: false, ts: Date.now() - 60000 });
  await set('inbox/old-restate', { from: 'manager', kind: 'say', text: 'המשימה עדיין רצה', validUntil: Date.now() - 1000, staleMode: 'restate', restate: 'tasks/tx', spoken: false, ts: Date.now() - 50000 });
  await set('inbox/old-ask', { from: 'manager', kind: 'ask', text: 'שאלה-שפגה', validUntil: Date.now() - 1000, staleMode: 'drop', options: ['כן', 'לא'], spoken: false, ts: Date.now() - 40000 });
  await speak(7000);
  const dropDoc = await get('inbox/old-drop') || {};
  ok(!said.some(t => /עדיין רצה/.test(t)), 'stale: nothing stale is said as if it were true: ' + said.join(' | '));
  ok(dropDoc.stale === true && dropDoc.expired === true, 'stale: the dropped one is marked stale, not spoken');
  ok(said.some(t => /עכשיו הבנייה גמורה/.test(t)), 'stale: restate read the task again - "עכשיו הבנייה גמורה"');
  ok(said.some(t => /שאלה-שפגה/.test(t)), 'stale: a question is never dropped - it still needs an answer');
  ok(said.filter(t => /רלוונטי/.test(t)).length === 1, 'stale: one line says how many were dropped: ' + said.filter(t => /רלוונטי/.test(t)).join(' | '));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
