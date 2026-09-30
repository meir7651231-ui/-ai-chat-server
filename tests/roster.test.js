// step brain-roster-lease: each sentence to Claude is work with a lease. A live claimer is left alone; silence for three
// minutes (no answer, no live brain) sends it once more under the same id; silence again - dead, one sentence to Meir,
// never a loop; an answer closes it for good. Thirty "killed brains" in a row: every sentence answered after one resend,
// none stuck, none sent a third time. Run: node tests/roster.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-roster-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__roster && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: ['spoke'], wall: Date.now() }); }); await p.waitForTimeout(800);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(40); } };
  const say = async t => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(1800); return heard.join(' | '); };
  const sentOf = id => f.evaluate(id => window.__h.sentRaw.filter(x => x.endsWith('⟦#' + id + '⟧')).length, id);
  // no brain ever registered: never resent, said once to be waiting
  await say('מה עם הביטוח של הרכב');
  const w0 = await f.evaluate(() => window.__h.all('work').slice(-1)[0]);
  const n0 = await f.evaluate(() => Date.now());
  let r0 = await f.evaluate(n => window.__roster.reclaim(n + 200000), n0);
  ok(r0.length === 0 && (await sentOf(w0.id)) === 1, 'no brain ever registered: three minutes of silence - not sent again');
  heard.length = 0; r0 = await f.evaluate(n => window.__roster.reclaim(n + 420000), n0); await speak(2000);
  ok(r0[0] && r0[0][1] === 'dead' && (await sentOf(w0.id)) === 1 && heard.some(t => /עוד מחכה לתשובה, ואף מוח לא נרשם/.test(t)), 'and after six minutes: said once, still sent only once');
  // one sentence; the only brain known went quiet twenty minutes ago
  await f.evaluate(() => window.__h.set('brain/roster/items/b-000', { role: 'מנהל', lastBeat: Date.now() - 20 * 60000 }));
  await say('מה עם החשבונית של החשמל');
  const w1 = await f.evaluate(() => window.__h.all('work').slice(-1)[0]);
  ok(w1 && w1.state === 'new' && w1.tag && w1.attempts === 1, 'a sentence to Claude opens work/<wakeId>: ' + JSON.stringify(w1 && { state: w1.state, attempts: w1.attempts }));
  const now = await f.evaluate(() => Date.now());
  let r = await f.evaluate(n => window.__roster.reclaim(n + 60000), now);
  ok(r.length === 0, 'one minute of silence: nothing yet');
  r = await f.evaluate(n => window.__roster.reclaim(n + 200000), now);
  ok(r.length === 1 && r[0][1] === 'resent' && (await sentOf(w1.id)) === 2, 'three minutes, no answer, no live brain: sent once more, the same id');
  heard.length = 0; r = await f.evaluate(n => window.__roster.reclaim(n + 420000), now); await speak(2000);
  ok(r[0] && r[0][1] === 'dead' && heard.some(t => /שלחתי פעמיים את "מה עם החשבונית של החשמל" ואף מוח לא ענה/.test(t)), 'still nothing: dead, and Meir hears it once: ' + heard.join(' | ').slice(0, 120));
  r = await f.evaluate(n => window.__roster.reclaim(n + 900000), now); heard.length = 0; await speak(800);
  ok(r.length === 0 && (await sentOf(w1.id)) === 2 && !heard.length, 'and never again - no third send, no second sentence');
  // a live claimer is left alone
  await say('מה עם הדוח השבועי');
  const w2 = await f.evaluate(() => window.__h.all('work').slice(-1)[0]);
  await f.evaluate(([id]) => { window.__h.set('brain/roster/items/b-111', { role: 'מנהל', lastBeat: Date.now(), since: Date.now() }); window.__h.set('work/' + id, Object.assign({}, window.__h.get('work/' + id), { claimedBy: 'b-111', state: 'claimed' })); }, [w2.id]);
  await p.waitForTimeout(300);
  r = await f.evaluate(() => window.__roster.reclaim(Date.now() + 60000));
  ok(r.length === 0 && (await sentOf(w2.id)) === 1, 'a claimer with a fresh heartbeat is left alone');
  // an answer closes it
  await f.evaluate(id => window.__h.set('req/' + id, window.__h.get('req/' + id) || { text: 'x' }), w2.id);
  await f.evaluate(id => window.__h.set('inbox/ans1', { from: 'manager', kind: 'say', topic: 'דוח', text: 'הדוח מוכן', re: id, spoken: false, ts: Date.now() }), w2.id);
  await speak(2000);
  ok((await f.evaluate(id => window.__h.get('work/' + id).state, w2.id)) === 'answered', 'an answer with re=<wakeId> closes the work');
  r = await f.evaluate(() => window.__roster.reclaim(Date.now() + 3600e3 * 0.2));
  ok(!r.some(x => x[0] === w2.id), 'answered work is never sent again');
  // thirty killed brains
  const ids = [];
  for (let i = 0; i < 30; i++) { await say('משפט מספר ' + i + ' למוח'); ids.push(await f.evaluate(() => window.__h.all('work').slice(-1)[0].id)); }
  const t0 = await f.evaluate(() => Date.now());
  await f.evaluate(n => window.__roster.reclaim(n + 200000), t0);
  for (const id of ids) await f.evaluate(id => { window.__h.set('req/' + id, window.__h.get('req/' + id) || { text: 'x' }); window.__h.set('inbox/a-' + id, { from: 'manager', kind: 'say', text: 'עניתי', re: id, spoken: false, ts: Date.now() }); }, id);
  await speak(6000);
  const st = await f.evaluate(ids => ids.map(id => [window.__h.get('work/' + id).state, window.__h.sentRaw.filter(x => x.endsWith('⟦#' + id + '⟧')).length]), ids);
  ok(st.every(([s, n]) => s === 'answered' && n === 2), `30 sentences whose brain died: ${st.filter(x => x[0] === 'answered').length} answered after one resend, none sent a third time`);
  await f.evaluate(() => window.__h.set('brain/roster/items/b-222', { role: 'בונה', lastBeat: Date.now() - 20 * 60000 }));
  await p.waitForTimeout(300);
  const s = await say('מי ער');
  ok(/ער עכשיו: מנהל .*111/.test(s) && /ועוד 2 שנרדמו/.test(s), '"מי ער": ' + s.slice(0, 120));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
