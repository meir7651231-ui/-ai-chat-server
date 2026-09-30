// steps say-ship + measure (the page's side): "תעלי גרסה" ships nothing without a voice yes; with it a ship task goes
// to the brain; each stage is said once, ready asks the phone to check for the update, page-failed is said once; "מה
// מצב הגרסה" names the page and the last ship; a task that carries metricsRun is announced done only with every gate
// green. Run: node tests/ship.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-ship-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__ship && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const take = () => p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
  const hello = caps => p.evaluate(c => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: c, wall: Date.now() }); }, caps);
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.36.0', pv: 1, caps: ['spoke'], wall: Date.now() }); }); await p.waitForTimeout(800);
  const heard = [], cmds = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) { if (x.liba === 'cmd') cmds.push(x.cmd); if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } } await p.waitForTimeout(40); } };
  const say = async (t, n) => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); for (let i = 0; i < 25 && heard.length < (n || 1); i++) await speak(200); await speak(400); return heard.join(' | '); };
  const ships = () => f.evaluate(() => window.__h.all('tasks').filter(t => t.type === 'ship'));
  let s = await say('תעלי גרסה');
  ok(/להעלות גרסה חדשה לטלפון.*תגיד כן כדי לשלוח/.test(s), 'asks first: ' + s.slice(-70));
  s = await say('לא', 2);
  ok((await ships()).length === 0 && /לא שלחתי/.test(s), 'no - nothing shipped');
  await say('תעלי גרסה'); const before = await f.evaluate(() => window.__h.sentRaw.length);
  s = await say('כן', 2);
  const sh = await ships(), sent = await f.evaluate(n => window.__h.sentRaw.slice(n), before);
  ok(sh.length === 1 && sh[0].stage === 'queued' && sent.some(x => /^\[ליבה→מנהל\] שלח גרסה לטלפון: tasks\/ship-/.test(x)) && /שולחת/.test(s), 'a yes: one ship task, handed to the brain');
  const id = sh[0].id; heard.length = 0; cmds.length = 0;
  for (const st of ['building', 'testing', 'signed', 'publishing-page']) { await f.evaluate(([id, st]) => window.__h.set('tasks/' + id, Object.assign({}, window.__h.get('tasks/' + id), { stage: st, updatedAt: Date.now() })), [id, st]); await speak(900); }
  await f.evaluate(id => window.__h.set('tasks/' + id, Object.assign({}, window.__h.get('tasks/' + id), { stage: 'ready', versionName: '3.36.0', notes: 'חותם מקור ובודק', updatedAt: Date.now() })), id); await speak(1500);
  await f.evaluate(id => window.__h.set('tasks/' + id, Object.assign({}, window.__h.get('tasks/' + id), { title: 'שילוח גרסה', updatedAt: Date.now() + 1 })), id); await speak(800);
  const order = ['בונה את הגרסה', 'בודקת את הגרסה', 'הגרסה חתומה', 'מפרסמת את הדף', 'הגרסה מוכנה'];
  ok(order.every(w => heard.filter(h => h.indexOf(w) >= 0).length === 1), 'each stage said once: ' + heard.map(h => h.slice(-30)).join(' / '));
  ok(cmds.filter(c => c === 'update_check').length === 1, 'ready: the phone is asked to check for the update, once');
  s = await say('מה מצב הגרסה');
  ok(/בטלפון רצה אפליקציה 3\.36\.0, והדף \d+\. השילוח האחרון: הגרסה מוכנה.*גרסה 3\.36\.0/.test(s), '"מה מצב הגרסה": ' + s.slice(0, 120));
  s = await say('מה השתנה בגרסה');
  ok(/בגרסה 3\.36\.0: חותם מקור ובודק/.test(s), '"מה השתנה בגרסה"');
  // page-failed
  await f.evaluate(() => window.__h.set('tasks/ship-x', { type: 'ship', title: 'שילוח גרסה', status: 'running', stage: 'building', at: Date.now(), updatedAt: Date.now() })); await speak(800);
  heard.length = 0; await f.evaluate(() => window.__h.set('tasks/ship-x', Object.assign({}, window.__h.get('tasks/ship-x'), { stage: 'page-failed', updatedAt: Date.now() }))); await speak(1200);
  await f.evaluate(() => window.__h.set('tasks/ship-x', Object.assign({}, window.__h.get('tasks/ship-x'), { note: 'x', updatedAt: Date.now() + 5 }))); await speak(800);
  ok(heard.filter(h => /הדף לא התפרסם - נשארתי על הגרסה הקודמת/.test(h)).length === 1, 'page-failed: said once');
  // measure
  await f.evaluate(() => { window.__h.set('metrics/runs/items/r1', { project: 'המחולל', gatesGreen: 11, gatesTotal: 13, wired: 40, at: Date.now() }); window.__h.set('tasks/m1', { title: 'חיווט המחולל', status: 'running', metricsRun: 'r1', updatedAt: Date.now() }); window.__h.set('tasks/m2', { title: 'שער אחרון', status: 'running', metricsRun: 'r2', updatedAt: Date.now() }); });
  await speak(800); heard.length = 0;
  await f.evaluate(() => { window.__h.set('tasks/m1', Object.assign({}, window.__h.get('tasks/m1'), { status: 'done', updatedAt: Date.now() })); }); await speak(1500);
  ok(heard.some(h => /המשימה חיווט המחולל סומנה גמורה, אבל רק 11 מתוך 13 שערים ירוקים\. היא לא גמורה/.test(h)) && !heard.some(h => /חיווט המחולל נגמרה/.test(h)), 'marked done with 11 of 13 green: not announced as done');
  heard.length = 0; await f.evaluate(() => { window.__h.set('metrics/runs/items/r2', { project: 'המחולל', gatesGreen: 13, gatesTotal: 13, at: Date.now() }); window.__h.set('tasks/m2', Object.assign({}, window.__h.get('tasks/m2'), { status: 'done', updatedAt: Date.now() })); }); await speak(1500);
  ok(heard.some(h => /המשימה שער אחרון נגמרה/.test(h)), 'all 13 green: done');
  s = await say('השערים');
  ok(/המדידה האחרונה של המחולל, .*: 13 מתוך 13 שערים ירוקים/.test(s), '"השערים": ' + s.slice(0, 90));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
