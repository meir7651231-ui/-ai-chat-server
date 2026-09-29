// step days: after three days away, the first hello is a short briefing and not a flood; questions still come at once;
// "הכול" releases the rest; a morning message meant for an earlier morning is not read; "על מה דיברנו אתמול" and
// "תחזור לשיחה על X" answer from the log. Run: node tests/days.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-days-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript('if (window !== window.top) { try { localStorage.setItem("liba.lastHello", String(Date.now() - 3 * 864e5 - 3600e3)); } catch (e) {} }');
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(600);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const set = (k, v) => f.evaluate(([k, v]) => window.__h.set(k, v), [k, v]);
  const said = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { said.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(60); } };
  const t0 = Date.now() - 2 * 864e5;
  await set('tasks/tb', { title: 'בניית הטופס', status: 'blocked', updatedAt: t0 });
  for (let i = 1; i <= 5; i++) await set('inbox/old' + i, { from: 'manager', kind: 'say', text: 'ישן-' + i, spoken: false, ts: t0 + i });
  await set('inbox/q1', { from: 'manager', kind: 'ask', text: 'שאלה-שלא-מחכה', options: ['כן', 'לא'], spoken: false, ts: t0 + 9 });
  const m8 = new Date(); m8.setHours(8, 0, 0, 0);
  await set('inbox/mo', { from: 'liba', kind: 'say', priority: 'morning', text: 'סיכום-של-בוקר-ישן', spoken: false, ts: m8.getTime() - 2 * 864e5 });
  await p.waitForTimeout(800);
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.26.0', pv: 1, caps: ['spoke', 'beat'], wall: Date.now() }));
  await speak(6000);
  const brief = said.find(t => /לא דיברנו/.test(t)) || '';
  ok(/לא דיברנו לפני 3 ימים/.test(brief) && /מחכות לך 6 הודעות, 1 מהן שאלות/.test(brief) && /תקוע: בניית הטופס/.test(brief), 'catch-up: a briefing - how long, what waits, what is stuck: ' + brief);
  ok(brief.length < 400, 'catch-up: the briefing is short (' + brief.length + ' characters, well under 45 s of speech)');
  ok(said.some(t => /שאלה-שלא-מחכה/.test(t)) && !said.some(t => /ישן-\d/.test(t)), 'catch-up: the question comes at once, the rest waits: ' + said.map(t => t.slice(0, 30)).join(' | '));
  ok(!said.some(t => /סיכום-של-בוקר-ישן/.test(t)) && ((await f.evaluate(() => window.__h.get('inbox/mo'))) || {}).expired === true, 'days: a morning message meant for an earlier morning is not read - it expires');
  said.length = 0; await p.evaluate(() => window.app({ liba: 'input', text: 'הכול' })); await speak(9000);
  ok([1, 2, 3, 4, 5].every(i => said.some(t => new RegExp('ישן-' + i).test(t))), '"הכול" releases the rest: ' + said.filter(t => /ישן/.test(t)).length + ' of 5');
  // the log: yesterday, and back to a conversation
  const y = new Date(); y.setHours(0, 0, 0, 0); const yd = y.getTime() - 864e5 + 10 * 3600e3;
  await set('chat/log/turns/y1', { from: 'user', text: 'מה עם המייל של הרואה חשבון', ts: yd });
  await set('chat/log/turns/y2', { from: 'manager', topic: 'המייל', text: 'שלחתי לו טיוטה', ts: yd + 60000 });
  await set('chat/log/turns/y3', { from: 'user', text: 'תבנה לי טופס דיווח', ts: yd + 3600e3 });
  await set('chat/log/turns/y4', { from: 'liba', topic: 'הטופס', text: 'פתחתי עובד', ts: yd + 3660e3 });
  said.length = 0; await p.evaluate(() => window.app({ liba: 'input', text: 'על מה דיברנו אתמול' })); await speak(2600);
  const yest = said.find(t => /אתמול אמרת/.test(t)) || '';
  ok(/אמרת 2 משפטים/.test(yest) && /המייל/.test(yest) && /הטופס/.test(yest) && /תבנה לי טופס דיווח/.test(yest), '"על מה דיברנו אתמול": ' + yest);
  said.length = 0; await p.evaluate(() => window.app({ liba: 'input', text: 'תחזור לשיחה על המייל' })); await speak(2600);
  const back = said.find(t => /על המייל/.test(t)) || '';
  ok(/שלחתי לו טיוטה/.test(back) && /אמרת: מה עם המייל/.test(back), '"תחזור לשיחה על המייל": ' + back);
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
