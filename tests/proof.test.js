// steps proof-seal + auditor-hold + ask-the-source: 50 reports - 30 with a claim are said with their grade in the
// opening, 20 without are not said as facts (20 evidence/missing, 20 requests tagged [ליבה?מקור]); 20 claims that ask
// to be checked - 18 checked by the test's auditor are said as measured with the evidence's age, 2 unchecked go out as
// quoted at the deadline, none as measured without evidence; then "מאיפה את יודעת" and "ומה לפני זה" walk back through
// what was said, each with its own source. Run: node tests/proof.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-proof-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__proof && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const take = () => p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
  const hello = caps => p.evaluate(c => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: c, wall: Date.now() }); }, caps);
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.36.0', pv: 1, caps: ['spoke'], wall: Date.now() }); }); await p.waitForTimeout(800);
  const heard = []; const saidAt = {};
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); const k = (/#(\w+)#/.exec(x.text) || [])[1]; if (k && !saidAt[k]) saidAt[k] = Date.now(); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(40); } };
  const say = async t => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); for (let i = 0; i < 25 && !heard.length; i++) await speak(200); await speak(250); return heard.join(' | '); };
  const now = Date.now(), G = ['measured', 'quoted', 'inferred'], W = { measured: 'נמדד', quoted: 'צוטט', inferred: 'הוסק' };
  await f.evaluate(([now, G]) => { for (let i = 0; i < 50; i++) { const d = { from: 'manager', kind: 'say', speaker: 'המנהל', topic: 'גרסה', text: 'הבדיקות עברו בשלב #c' + i + '#', spoken: false, ts: now + i };
      if (i < 30) d.claim = { grade: G[i % 3], source: { kind: 'cmd', ref: 'node tests/s' + i + '.js', at: now - 60000, by: 'session_x' }, raw: 'כל הבדיקות עברו' };
      window.__h.set('inbox/c' + i, d); } }, [now, G]);
  await speak(15000);
  const byId = i => heard.find(h => h.indexOf('#c' + i + '#') >= 0) || '';
  const graded = [...Array(30).keys()].filter(i => byId(i).indexOf('המנהל, בנוגע לגרסה, ' + W[G[i % 3]] + ': ') >= 0).length;
  ok(graded === 30, `30 reports with a claim: ${graded} said with their grade in the opening`);
  const bare = [...Array(20).keys()].map(i => byId(30 + i));
  ok(bare.every(h => /המנהל אומר שהבדיקות עברו בשלב #c\d+# - בלי מקור\. ביקשתי ממנו מקור/.test(h)), `20 without: none said as a fact - ${bare.filter(h => /בלי מקור/.test(h)).length} said as "without a source"`);
  const miss = await f.evaluate(() => window.__h.all('evidence/missing/items').length), asks = await f.evaluate(() => window.__h.sentRaw.filter(x => x.indexOf('[ליבה?מקור] ') === 0).length);
  ok(miss === 20 && asks === 20, `20 evidence/missing, 20 requests for a source: ${miss}, ${asks}`);
  // auditor-hold
  heard.length = 0; const t0 = Date.now(), put = {};
  await f.evaluate(now => { for (let i = 0; i < 20; i++) window.__h.set('inbox/h' + i, { from: 'manager', kind: 'say', speaker: 'המנהל', topic: 'בדיקה', text: 'הבדיקות עברו #h' + i + '#', spoken: false, ts: now + i,
      claim: { grade: 'measured', source: { kind: 'cmd', ref: 'node tests/h' + i + '.js', at: now }, verify: { type: i % 2 ? 'apk' : 'tests', args: { file: 'tests/zman.test.js' } } } }); }, Date.now());
  for (let i = 0; i < 20; i++) put['h' + i] = Date.now();
  const answered = new Set();
  for (let r = 0; r < 12; r++) { const q = await f.evaluate(() => window.__h.all('verify/queue/items').map(x => x.id));
    for (const id of q) if (!answered.has(id) && id !== 'h18' && id !== 'h19') { answered.add(id); await f.evaluate(id => window.__h.set('evidence/log/items/' + id, { type: 'tests', exitCode: 0, stdout: 'כל הבדיקות עברו', at: Date.now() }), id); }
    await speak(500); }
  const early = heard.filter(h => /#h1[89]#/.test(h)).length;
  await speak(62000 - (Date.now() - t0) > 0 ? 62000 - (Date.now() - t0) : 1000); await speak(4000);
  const hb = i => heard.find(h => h.indexOf('#h' + i + '#') >= 0) || '';
  const measured = [...Array(18).keys()].filter(i => /, נמדד: הבדיקות עברו #h\d+# - בדקתי לפני (רגע|דקה|\d+ דקות)\./.test(hb(i))).length;
  ok(measured >= 17, `18 checked: ${measured} said as measured, with the evidence's age: ${hb(0).slice(0, 90)}`);
  ok(early === 0 && [18, 19].every(i => /, צוטט: .*המנהל אמר, לא בדקתי/.test(hb(i))), 'the two nobody checked: nothing before the deadline, then said as quoted - "לא בדקתי": ' + hb(18).slice(0, 90));
  const holds = [...Array(18).keys()].map(i => (saidAt['h' + i] || 0) - put['h' + i]).filter(x => x > 0).sort((a, b) => a - b);
  ok(holds.length >= 17 && holds[Math.floor(holds.length / 2)] <= 15000, 'median hold ' + holds[Math.floor(holds.length / 2)] + ' ms (at most 15 s)');
  // ask-the-source, backwards through the last twenty
  const seen = []; let s = await say('מאיפה את יודעת'); seen.push(s);
  for (let i = 0; i < 19; i++) seen.push(await say('ומה לפני זה'));
  const refs = seen.map(x => (/#(h\d+)#/.exec(x) || [])[1]);
  ok(refs.filter(Boolean).length === 20 && new Set(refs).size === 20 && seen.every(x => /נמדד|צוטט/.test(x)), 'twenty back: twenty different, each with its grade: ' + seen[0].slice(0, 100));
  ok(/אמר המנהל\. מפקודה node tests\/h\d+\.js/.test(seen[0]) && /בדקתי בעצמי|נמדד|צוטט/.test(seen[0]), 'the source said in words');
  const w = await say('מי אמר את זה'), g = await say('זה נמדד או צוטט');
  ok(/את זה אמר המנהל/.test(w) && /זה (נמדד|צוטט)/.test(g), '"מי אמר את זה", "זה נמדד או צוטט": ' + g.slice(0, 40));
  const mir = await f.evaluate(() => window.__mirror.build());
  ok(mir.proofs && mir.proofs.length === 5 && mir.proofs.every(x => x.grade && x.speaker), 'the phone gets the last five in the mirror');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
