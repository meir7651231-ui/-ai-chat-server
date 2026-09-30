// step power-ledger, the page's side: the phone's day arrives, is kept in channel/power and closed into
// memory/power/days when the day turns; "כמה סוללה אכלת היום" says it in words, the biggest subsystem named, the
// projection against the budget, the phone's own drain beside it. Run: node tests/power.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-power-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__power && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const take = () => p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
  const hello = caps => p.evaluate(c => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: c, wall: Date.now() }); }, caps);
  const heard = [];
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.34.0', pv: 1, caps: ['spoke', 'power'], wall: Date.now() }); }); await p.waitForTimeout(800);
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(40); } };
  const say = async t => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); for (let i = 0; i < 20 && !heard.length; i++) await speak(250); await speak(300); return heard.join(' | '); };
  let s = await say('כמה סוללה אכלת היום');
  ok(/עוד אין לי מדידה מהטלפון/.test(s), 'no report yet: says so: ' + s.slice(0, 80));
  const day1 = { day: '2026-09-29', mah: 70, pct: 1.6, byTag: { 'mic.vad': 50, tts: 12, base: 8 }, proj: 3.4, phonePct: 21 };
  await p.evaluate(b => window.app({ liba: 'power', body: b }), JSON.stringify(day1)); await p.waitForTimeout(300);
  const cp = await f.evaluate(() => window.__h.get('channel/power'));
  ok(cp && cp.day === '2026-09-29' && cp.byTag['mic.vad'] === 50, 'the day is kept in channel/power');
  s = await say('כמה סוללה אכלת היום');
  ok(/היום אכלתי אחוז וחצי, רובו על ההאזנה\./.test(s) && /3 וחצי אחוזים ליממה/.test(s) && /הטלפון כולו ירד היום 21 אחוזים/.test(s), '"כמה סוללה אכלת היום": ' + s.slice(0, 200));
  s = await say('על מה הלכה הסוללה');
  ok(/ההאזנה 71 אחוז, הדיבור 17 אחוז, הבסיס 11 אחוז/.test(s), '"על מה הלכה הסוללה": ' + s.slice(0, 160));
  s = await say('תקציב סוללה שלושה אחוז');
  ok(/תקציב של 3 אחוזים ביממה/.test(s) && (await f.evaluate(() => window.__h.get('memory/settings').power.dailyPct)) === 3, 'a budget by voice, kept in memory/settings.power: ' + s.slice(0, 80));
  s = await say('כמה סוללה אכלת היום');
  ok(/ליממה, מעל התקציב שלך/.test(s), 'over the budget: said');
  await p.evaluate(b => window.app({ liba: 'power', body: b }), JSON.stringify({ day: '2026-09-30', mah: 2, pct: 0.05, byTag: { base: 2 }, proj: null, phonePct: null })); await p.waitForTimeout(300);
  const closed = await f.evaluate(() => window.__h.get('memory/power/days/2026-09-29'));
  ok(closed && closed.mah === 70 && closed.closedAt > 0, 'the day turned: yesterday closed into memory/power/days');
  ok(await f.evaluate(() => window.__power.words(0.2) === 'פחות מחצי אחוז' && window.__power.words(1) === 'אחוז אחד' && window.__power.words(2.5) === 'שניים וחצי אחוזים'), 'percent in words');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
