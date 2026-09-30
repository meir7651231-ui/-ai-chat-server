// step device-mem, the page's side: a bubble that says 'mem' gets the memory (never sensitivity 3) after hello and after a
// change; fifty "תזכור" kept on the phone come back, are stored and acked - 100%; a conflict keeps the newer value, the
// loser goes to memory/conflicts and is said once a week; a bubble without 'mem' gets nothing.
// Run: node tests/devmem.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-devmem-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const open = async caps => { const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
    const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__devmem && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
    await f.evaluate(async () => { localStorage.setItem('liba.distillDay', trDay(Date.now()));
      for (const t of ['דני הוא הבן שלי', 'יש לי סיסמה לבנק 9911', 'רואה החשבון הוא משה', 'השכן הוא יוסי']) await window.__mem.put(window.__mem.parse(t), { type: 'said' });
      await window.__people.upsert('דני', { relation: 'הבן שלי' }); });
    await p.evaluate(() => { window.msgs = []; });
    await p.evaluate(caps => window.app({ liba: 'hello', ver: '3.28.0', pv: 1, caps, wall: Date.now() }), caps);
    return { p, f, errs }; };
  const take = async (p, ms) => { await p.waitForTimeout(ms); return p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; }); };
  // a bubble with 'mem'
  const { p, f, errs } = await open(['spoke', 'mem', 'pulse']);
  let m = await take(p, 2500); let syncs = m.filter(x => x.liba === 'memSync');
  const body = syncs.length ? JSON.parse(syncs[syncs.length - 1].body) : null;
  ok(!!body && body.facts.some(x => /דני הוא הבן/.test(x.raw)) && body.people.some(x => x.name === 'דני'), 'after hello the phone gets the memory: ' + (body && body.facts.length) + ' facts, ' + (body && body.people.length) + ' people');
  ok(!!body && !body.facts.some(x => /9911/.test(x.raw)), 'a password (sensitivity 3) never leaves for the phone');
  await f.evaluate(() => window.__mem.put(window.__mem.parse('יש לי מחסן ברחוב הרצל'), { type: 'said' }));
  m = await take(p, 2800); syncs = m.filter(x => x.liba === 'memSync');
  ok(syncs.length === 1 && /הרצל/.test(syncs[0].body), 'a change goes out once, two seconds later: ' + syncs.length);
  // fifty remembered offline, with two conflicts among them
  const now = await f.evaluate(() => Date.now());
  await f.evaluate(now => { for (const [k, v] of window.__h.docs) if (k.startsWith('memory/facts/items/') && /השכן/.test(v.raw)) v.updatedAt = now - 5 * 864e5; }, now);
  const items = Array.from({ length: 48 }, (_, i) => ({ id: 'm-' + i, text: 'שהמפתח של המחסן ' + i + ' אצל השכן', at: now - 3600e3 + i }))
    .concat([{ id: 'm-acct', text: 'רואה החשבון הוא דוד', at: now - 3600e3 }, { id: 'm-shachen', text: 'השכן הוא אבי', at: now - 3600e3 }]);
  await p.evaluate(items => window.app({ liba: 'memAsk', items: JSON.stringify(items) }), items);
  m = await take(p, 5000);
  const ack = m.find(x => x.liba === 'memAck');
  ok(!!ack && ack.ids.length === 50, 'memAck carries every one of the 50 ids - nothing is asked twice: ' + (ack && ack.ids.length));
  const st = await f.evaluate(() => { const F = window.__h.all('memory/facts/items'); return { dev: F.filter(x => x.source && x.source.type === 'device').length,
    acct: (F.find(x => x.subject === 'רואה החשבון' && x.state === 'live') || {}).value, shachen: (F.find(x => x.subject === 'השכן' && x.state === 'live') || {}).value, conflicts: window.__h.all('memory/conflicts/items') }; });
  ok(st.dev === 49, `49 stored with source device (48 new + the newer neighbour); the older accountant lost: ${st.dev}`);
  ok(st.acct === 'משה' && st.shachen === 'אבי', `last writer wins: the page's newer "משה" stays, the phone's newer "אבי" replaces "יוסי": ${st.acct} / ${st.shachen}`);
  ok(st.conflicts.length === 2 && st.conflicts.some(c => c.kept === 'משה' && c.lost === 'דוד') && st.conflicts.some(c => c.kept === 'אבי' && c.lost === 'יוסי'), 'both conflicts kept in memory/conflicts');
  ok(m.some(x => x.liba === 'say' && /קיבלתי מהטלפון 50 דברים/.test(x.text) && /סתר משהו חדש יותר/.test(x.text)), 'and said: ' + ((m.find(x => x.liba === 'say' && /קיבלתי/.test(x.text)) || {}).text || '').slice(0, 120));
  const wk = await f.evaluate(async () => { localStorage.removeItem('liba.conflictsSaid'); const a = await window.__devmem.weekly(); const b = await window.__devmem.weekly(); return [a, b]; });
  m = await take(p, 800);
  ok(wk[0] === true && wk[1] === false && m.some(x => x.liba === 'say' && /סתירות בין הטלפון לדף/.test(x.text)), 'the conflicts are said once a week: ' + ((m.find(x => x.liba === 'say' && /סתירות/.test(x.text)) || {}).text || '').slice(0, 120));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  // a bubble without 'mem'
  const o = await open(['spoke', 'pulse']);
  const m2 = await take(o.p, 2500);
  ok(!m2.some(x => x.liba === 'memSync'), 'a bubble that does not say mem gets nothing');
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
