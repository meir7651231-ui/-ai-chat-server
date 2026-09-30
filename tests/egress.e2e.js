// step outbound-redactor + egress-gate, end to end: a seeded session of 40 sentences, 16 of them with identifiers.
// What went to Claude has no identity, card or account number (a phone may go - the brain may need to call); what
// was written to chat/log/turns, req and work has no identifier at all; each turn carries its classification; "תשלח
// כמו שאמרתי" sends the last one as said after a yes, and the ledger keeps it. Run: node tests/egress.e2e.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-egress-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__cls && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const take = () => p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
  const hello = caps => p.evaluate(c => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: c, wall: Date.now() }); }, caps);
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.35.0', pv: 1, caps: ['spoke'], wall: Date.now() }); }); await p.waitForTimeout(800);
  await f.evaluate(() => { window.__h.set('memory/settings', { logTurns: true, decisions: true }); }); await p.waitForTimeout(300);
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(40); } };
  const say = async (t, w) => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); if (w > 1000) for (let i = 0; i < 24 && !heard.length; i++) await speak(250); await speak(w > 1000 ? 600 : (w || 900)); return heard.join(' | '); };
  const IDS = ['123456782', '000000018', '12-345-678901', '4580 1234 5678 9014', 'IL62 0108 0000 0009 9999 999'], PH = ['052-1234567', '03-5551234'];
  const seeded = [];
  for (let i = 0; i < 40; i++) { const k = i % 5; seeded.push(i < 10 ? 'תעדכן את הספק, מספר הזהות של הבחור ' + IDS[0] + ' שורה ' + i : i < 14 ? 'תעביר לחשבון ' + IDS[2] + ' סכום ' + i : i < 16 ? 'תשלם בכרטיס ' + IDS[3] + ' הזמנה ' + i : i < 20 ? 'תתקשר ל ' + PH[i % 2] + ' לגבי ' + i : 'משפט רגיל על הדוח מספר ' + i); }
  for (const t of seeded) await say(t, 500);
  await speak(1500);
  const sent = await f.evaluate(() => window.__h.sentRaw.slice());
  const raw = s => IDS.some(x => s.indexOf(x) >= 0) || /\b123456782\b|678901|9014|IL62/.test(s);
  ok(sent.length >= 40 && !sent.some(raw), `to Claude: ${sent.length} sentences, ${sent.filter(raw).length} with an identity, card or account number`);
  ok(sent.some(s => s.indexOf('052-1234567') >= 0), 'to Claude: a phone number still goes (the brain may need to call)');
  const turns = await f.evaluate(() => window.__h.all('chat/log/turns').concat(window.__h.all('req'), window.__h.all('work')));
  const rawAny = s => raw(s) || PH.some(x => s.indexOf(x) >= 0);
  ok(turns.length >= 80 && !turns.some(d => rawAny(String(d.text || ''))), `in the db: ${turns.length} turns/requests/work, ${turns.filter(d => rawAny(String(d.text || ''))).length} with an identifier`);
  const tu = await f.evaluate(() => window.__h.all('chat/log/turns').filter(d => d.from === 'user'));
  ok(tu.length >= 40 && tu.every(d => d.cls && typeof d.cls.sens === 'number') && tu.filter(d => d.cls.sens === 3).length >= 16, 'every turn is born with its classification: ' + tu.filter(d => d.cls && d.cls.sens === 3).length + ' at 3');
  const ws = await f.evaluate(() => window.__h.all('brain/wakes/items'));
  ok(!ws.some(w => raw(String(w.envelope || ''))), 'the wake packets hold no identifier either');
  let s = await say('תעביר לחשבון 12-345-678901 את התשלום לקבלן', 1500);
  ok(/הורדתי מהמשפט את מספר החשבון לפני ששלחתי/.test(s), 'what was cut is said once: ' + s.slice(0, 120));
  const n0 = await f.evaluate(() => window.__h.sentRaw.length);
  s = await say('תשלח כמו שאמרתי', 1500);
  ok(/לשלוח אותו כמו שאמרת\?/.test(s), 'as said: asks first: ' + s.slice(-80));
  s = await say('כן', 2500);
  const after = await f.evaluate(n => window.__h.sentRaw.slice(n), n0);
  ok(after.some(x => x.indexOf('12-345-678901') >= 0) && /נשלח כמו שאמרת/.test(s), 'after a yes: sent as said, once: ' + after.length);
  const led = await f.evaluate(() => window.__agent.ledger.ring().filter(x => x.action === 'egress.bypass').length);
  ok(led === 1, 'the bypass is in the ledger');
  // kotlin-egress, the page's side: every say carries its sensitivity; a message the phone held stays pending, is not
  // retried, and a late 'spoke' (after "תקריאי" on the phone) closes it
  const says = [];
  const grab = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; }); for (const x of m) if (x.liba === 'say') says.push(x); await p.waitForTimeout(40); } };
  await f.evaluate(() => window.__h.set('inbox/pv1', { from: 'manager', kind: 'say', speaker: 'המנהל', topic: 'בחור', text: 'הבחור מהמחזור השני מאושפז בבית חולים', spoken: false, ts: Date.now() }));
  await grab(1500);
  const pv = says.find(x => /מאושפז/.test(x.text || ''));
  ok(pv && pv.sens === 2 && pv.force === 0, 'the say carries its sensitivity: ' + (pv && pv.sens));
  if (pv) await p.evaluate(id => window.app({ liba: 'spoke', id, cause: 'held' }), pv.id);
  await grab(2500);
  let d = await f.evaluate(() => window.__h.get('inbox/pv1'));
  ok(d && !d.spoken && d.delivery && d.delivery.state === 'held' && !says.slice(1).some(x => /מאושפז/.test(x.text || '')), 'held by the phone: pending, delivery=held, not said again');
  if (pv) await p.evaluate(id => window.app({ liba: 'spoke', id, cause: 'done' }), pv.id);
  await p.waitForTimeout(800); d = await f.evaluate(() => window.__h.get('inbox/pv1'));
  ok(d && d.spoken && d.delivery && d.delivery.late, 'said on the phone later ("תקריאי"): closed by the late spoke');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
