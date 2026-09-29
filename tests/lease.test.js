// step owner-lease: the manager never holds the line past its lease without a renewal, and every answer goes to
// whoever asked. The lease is shortened to 1.5 s here (window.__owner.ttl) so 200 events run in minutes.
// Run: node tests/lease.test.js          (EVENTS=200 QA=50)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
const EVENTS = +(process.env.EVENTS || 200), QA = +(process.env.QA || 50), TTL = 1500;
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-lease-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__owner && window.claude, null, { timeout: 8000 });
  await p.waitForTimeout(700);
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.21.0', pv: 1, caps: ['spoke', 'beat'], wall: Date.now() })); await p.waitForTimeout(500);
  await f.evaluate(t => window.__owner.ttl(t), TTL);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const said = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { said.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(60); } };
  const input = async t => { await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(1900); };
  const lease = () => f.evaluate(() => Object.assign({ at: Date.now() }, window.__owner.state(), { doc: window.__h.get('channel/owner') || {} }));

  // (a) 200 events: address the manager, address ליבה, a message from the manager, short and long silences.
  // After every event: if the line is the manager's, it was renewed less than one lease ago - never longer.
  let over = 0, maxHeld = 0, expiries = 0, n = 0; const seq = [];
  for (let i = 0; i < EVENTS; i++) {
    const r = Math.random(); let ev;
    if (r < 0.2) { ev = 'addr-manager'; await input('מנהל שאלה-' + i); }
    else if (r < 0.3) { ev = 'addr-liba'; await input('ליבה שאלה-' + i); }
    else if (r < 0.5) { ev = 'mgr-msg'; await f.evaluate(i => window.__h.set('inbox/lm' + i, { from: 'manager', kind: 'say', text: 'מהמנהל-' + i, spoken: false, ts: Date.now() }), i); await speak(900); }
    else if (r < 0.8) { ev = 'short'; await speak(TTL * 0.3); }
    else { ev = 'long'; await speak(TTL * 1.6); }
    seq.push(ev);
    const s = await lease();
    if (s.owner === 'manager') { const held = s.at - s.renewedAt; maxHeld = Math.max(maxHeld, held); if (held > TTL + 700) over++; }
    if ((s.doc.owner || 'liba') !== s.owner) over++; n++; // no document yet means ליבה
  }
  expiries = said.filter(t => /חזרתי לקו/.test(t)).length;
  ok(over === 0, `lease: ${n} events, the manager never held the line past its lease without a renewal (longest ${maxHeld} ms of ${TTL})`);
  ok(expiries > 0, 'lease: the line came back to ליבה by itself, and said so: ' + expiries + ' times');

  // (b) 50 interleaved questions, asked at random by ליבה or the manager, while either one holds the line:
  // a plain answer goes to whoever asked. Every tenth answer opens with an address - a new topic - and goes there.
  await f.evaluate(() => { window.__owner.ttl(20 * 60000); }); await speak(500);
  let right = 0, total = 0; const bad = [];
  for (let i = 0; i < QA; i++) {
    if (Math.random() < 0.5) await input(Math.random() < 0.5 ? 'מנהל תחזיק את הקו' : 'ליבה תחזור');
    const asker = Math.random() < 0.5 ? 'manager' : 'liba';
    await f.evaluate(([i, a]) => window.__h.set('inbox/q' + i, { from: a, kind: 'ask', text: 'שאלה-' + i, options: ['כן', 'לא'], spoken: false, ts: Date.now() }), [i, asker]);
    await speak(1400);
    const addr = i % 10 === 9 ? (asker === 'manager' ? 'ליבה ' : 'מנהל ') : '';
    const ans = addr + 'תשובה-' + i; await input(ans);
    const sent = (await f.evaluate(() => window.__h.sent.slice())).filter(t => t.endsWith('תשובה-' + i)).pop() || '';
    const to = addr ? (addr === 'מנהל ' ? 'manager' : 'liba') : asker;
    const good = to === 'manager' ? sent.startsWith('[ליבה→מנהל] ') : sent.startsWith('[ליבה] ');
    total++; if (good) right++; else bad.push(`${asker}/${addr || '-'}→${sent || '(לא נשלח)'}`);
  }
  ok(right === total, `replyTo: ${right}/${total} answers went to whoever asked (or where a new topic said)` + (bad.length ? ': ' + bad.slice(0, 4).join(' ; ') : ''));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
