// step fixed-cardinality-telemetry: a week of pulses is one document, a week of ledgers is seven, a full database
// does not stop either, and "why were you silent" tells three different silences apart. Run: node tests/telemetry.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-tel-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__pulse && window.claude, null, { timeout: 8000 });
  await p.waitForTimeout(700);
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.21.0', pv: 1, caps: ['pulse'], wall: Date.now() })); await p.waitForTimeout(500);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };

  // (a) seven days, a watchdog every 30 s (20,160 ticks), the state changing a few times a day
  const week = await f.evaluate(async () => {
    const docs = window.__h.docs, before = new Set(docs.keys()), base = Date.now() - 7 * 864e5; let writes = 0;
    for (let i = 0; i < 20160; i++) { const now = base + i * 30000; const hour = Math.floor(i / 120) % 24;
      const body = JSON.stringify({ mic: hour !== 3, overlay: true, battery: 90 - (i % 2880) / 40 | 0, charging: hour < 7, net: true, vad: true, ttsOk: true, pageReady: true, ver: '3.21.0', lastHeard: now - 60000 });
      if (window.__pulse.in({ dev: 'd-abc', name: 'Pixel', body }, now)) writes++;
      if (i % 10 === 0) await window.__pulse.ledgerFlush(now); }
    await new Promise(r => setTimeout(r, 300));
    const added = [...docs.keys()].filter(k => !before.has(k));
    return { writes, pulse: added.filter(k => k.startsWith('pulse/')).length, ledger: added.filter(k => k.startsWith('ledger/')).length, other: added.filter(k => !/^(pulse|ledger)\//.test(k)) };
  });
  ok(week.pulse === 1, 'week: 20,160 watchdog ticks → exactly one pulse document: ' + week.pulse);
  ok(week.ledger === 7 || week.ledger === 8, 'week: one ledger document per day: ' + week.ledger);
  ok(week.other.length === 0, 'week: no other new document: ' + week.other.slice(0, 5).join(','));
  ok(week.writes <= 7 * 288 + 7 * 24 * 2, 'week: pulse writes stay under the edge-trigger ceiling (288 a day plus changes): ' + week.writes);

  // (b) a full database: no new document may be created, existing ones still take writes
  const full = await f.evaluate(async () => {
    window.__quotaCreate = true; const n0 = window.__h.get('pulse/d-abc').at; let ok = 0; const now = Date.now();
    for (let i = 0; i < 10; i++) { window.__pulse.in({ dev: 'd-abc', name: 'Pixel', body: JSON.stringify({ mic: i % 2 === 0, overlay: true }) }, now + i * 1000); await new Promise(r => setTimeout(r, 20)); if (window.__h.get('pulse/d-abc').at === now + i * 1000) ok++; }
    await window.__pulse.ledgerFlush(now); const lg = window.__h.get('ledger/' + new Date(now).toLocaleDateString('sv-SE', { timeZone: 'Asia/Jerusalem' }));
    window.__quotaCreate = false; return { ok, n0, ledgerAt: lg && lg.at === now };
  });
  ok(full.ok === 10, 'full db: every pulse still lands (a changing state, 10 of 10): ' + full.ok);
  ok(full.ledgerAt, "full db: today's ledger still takes its update");

  // (c) three silences, three answers
  const said = async (pulse) => { await f.evaluate(d => { for (const k of [...window.__h.docs.keys()]) if (k.startsWith('pulse/')) window.__h.docs.delete(k); window.__h.docs.set('pulse/d-1', d); }, pulse);
    await p.evaluate(() => { window.msgs = []; }); await p.evaluate(() => window.app({ liba: 'input', text: 'למה שתקת' })); await p.waitForTimeout(2500);
    return (await p.evaluate(() => window.msgs.filter(x => x.liba === 'say').map(x => x.text))).join(' | '); };
  const now = Date.now();
  const a = await said({ dev: 'd-1', name: 'Pixel', at: now - 60000, mic: false, overlay: true, since: now - 2 * 3600e3 });
  ok(/למיקרופון נשללה/.test(a) && /לפני שעתיים/.test(a), 'why: a phone alive with the microphone taken away two hours ago: ' + a);
  const c = await said({ dev: 'd-1', name: 'Pixel', at: now - 60000, mic: true, overlay: false });
  ok(/הבועה סגורה/.test(c), 'why: the bubble is closed: ' + c);
  const y = new Date(now - 864e5); y.setHours(21, 0, 0, 0);
  const s = await said({ dev: 'd-1', name: 'Pixel', at: y.getTime(), mic: true, overlay: true });
  ok(/לא דיבר איתי מאז אתמול ב-21:00/.test(s), 'why: the phone has not talked since yesterday at nine: ' + s);
  const bo = await said({ dev: 'd-1', name: 'Pixel', at: Date.now() - 60000, mic: true, overlay: true, battOpt: false, battery: 70 });
  ok(/הכול תקין/.test(bo) && /פטור מחיסכון בסוללה/.test(bo), 'why: all fine but no battery exemption - said as the one risk: ' + bo);
  // (d) heartbeat-diag: every silence gets a reason from the closed list - from the pulses around the gap
  const cases = [
    [{}, { life: 'boot' }, 'phone-off'], [{}, { gasp: 'app-killed|1' }, 'app-killed'], [{}, { life: 'revive' }, 'app-killed'],
    [{}, { gasp: 'turned-off|1', life: 'opened' }, 'turned-off'], [{ net: false }, {}, 'network-down'], [{ doze: true }, {}, 'doze'],
    [{ login: true }, {}, 'page-logged-out'], [{ mic: false }, {}, 'mic-revoked'], [{ overlay: false }, {}, 'overlay-revoked'], [{}, {}, 'unknown']];
  const got = await f.evaluate(cs => cs.map(([a, b]) => window.__pulse.reason(a, b)), cases);
  const miss = cases.filter((c, i) => got[i] !== c[2]).map((c, i) => c[2] + '→' + got[cases.indexOf(c)]);
  ok(miss.length === 0, `diag: ${cases.length - miss.length}/${cases.length} silences get the right reason` + (miss.length ? ': ' + miss.join(', ') : ''));
  const gap = await f.evaluate(async () => { const t = Date.now() - 3 * 3600e3;
    window.__pulse.in({ dev: 'd-gap', name: 'Fold', body: JSON.stringify({ mic: true, overlay: true, net: true }) }, t);
    window.__pulse.in({ dev: 'd-gap', name: 'Fold', body: JSON.stringify({ mic: true, overlay: true, net: true, life: 'boot' }) }, Date.now());
    await new Promise(r => setTimeout(r, 200)); return window.__h.get('channel/health'); });
  ok(gap && gap.reason === 'phone-off' && gap.dev === 'd-gap', 'diag: a pulse after three silent hours, from a fresh boot, writes channel/health = phone-off: ' + JSON.stringify(gap && gap.reason));
  const past = await said({ dev: 'd-gap', name: 'Fold', at: Date.now() - 30000, mic: true, overlay: true });
  ok(/השתיקה האחרונה/.test(past) && /הטלפון כבה/.test(past), '"למה שתקת" also tells the last silence and why: ' + past);
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
