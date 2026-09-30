// step shabbat-engine / pikuach-gate, the page's side: inside a window nothing passes - not urgent, not a command, not a
// question, not the board, not a reminder - and "מה פספסתי" is not said either; Meir's own emergency opens it; after it,
// "שבוע טוב" and one ordered reading: questions first, the rest on "הכול", the very old marked stale.
// Run: node tests/shabbat.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-shabbat-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__shabbat && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; });
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.31.0', pv: 1, caps: ['spoke', 'holy', 'ctx'], wall: Date.now() }); }); await p.waitForTimeout(1800);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const heard = [], others = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) { if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } else others.push(x); } await p.waitForTimeout(50); } };
  const say = async t => { heard.length = 0; others.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(2400); return heard.join(' | '); };
  const hello = others; await speak(300);
  ok(others.some(x => x.liba === 'place') || (await f.evaluate(() => hasCap('holy'))), 'the phone gets the place the windows are computed for');
  let s = await say('זמני שבת לפי בני ברק');
  ok(/זמני השבת לפי בני ברק: כניסה 20 דקות לפני השקיעה/.test(s) && others.some(x => x.liba === 'place' && JSON.parse(x.body).lat > 32), '"זמני שבת לפי בני ברק": kept and sent to the phone');
  s = await say('מתי נכנסת שבת');
  ok(/(השבת הבאה נכנסת ביום \S+ ב-\d\d:\d\d ויוצאת ביום|החג הבא, .*, נכנס ביום \S+ ב-\d\d:\d\d ויוצא ביום|עכשיו).* ב-\d\d:\d\d, לפי בני ברק/.test(s), '"מתי נכנסת שבת": ' + s.slice(0, 120));
  // inside a window
  const st = await f.evaluate(async () => { window.__testShabbat = true; return await window.__shabbat.tick(); });
  ok(st === 'in' && (await f.evaluate(() => window.__h.get('channel/shabbat').mode)) === 'on', 'channel/shabbat says it is on');
  const old = Date.now() - 20 * 3600e3;
  await f.evaluate(old => { const H = window.__h; const now = Date.now();
    H.set('inbox/s1', { from: 'manager', kind: 'say', topic: 'בדיקה', text: 'עדכון רגיל', spoken: false, ts: now });
    H.set('inbox/s2', { from: 'manager', kind: 'say', priority: 'urgent', topic: 'בדיקה', text: 'דחוף בשבת', spoken: false, ts: now });
    H.set('inbox/s3', { from: 'manager', kind: 'ask', topic: 'בדיקה', text: 'שאלה בשבת', options: ['כן', 'לא'], spoken: false, ts: now });
    H.set('inbox/s4', { from: 'manager', kind: 'cmd', cmd: 'open https://example.com', spoken: false, ts: now });
    H.set('inbox/s5', { from: 'manager', kind: 'say', topic: 'בדיקה', text: 'הודעה ישנה', spoken: false, ts: old });
    queueLocal({ id: 'pro-x', kind: 'say', proactive: true, speaker: 'ליבה', text: 'אני נזכרת: משהו' });
    queueLocal({ id: 'task-x', kind: 'done', speaker: 'הלוח', text: 'המשימה נגמרה' }); }, old);
  heard.length = 0; others.length = 0; await speak(3000);
  ok(heard.length === 0, 'inside a window: nothing is said - not urgent, not a question, not the board, not a reminder: ' + heard.join(' | ').slice(0, 80));
  ok(!others.some(x => x.liba === 'cmd'), 'and no command runs');
  const holds = await f.evaluate(() => window.__silence.held().map(x => x.reason));
  ok(holds.length >= 6 && holds.every(r => r === 'shabbat'), 'every one of them is held for shabbat: ' + holds.join(','));
  // Meir's own hand: the emergency opens it
  heard.length = 0; await p.evaluate(() => window.app({ liba: 'ctx', body: JSON.stringify({ screen: true, emergencyUntil: Date.now() + 1800e3, at: Date.now() }) }));
  await speak(3500);
  ok(heard.some(t => /דחוף בשבת/.test(t)), 'the emergency (three seconds on the bubble) opens it: ' + heard.join(' | ').slice(0, 100));
  await f.evaluate(() => { shabbatEmergencyUntil = 0; });
  // a second window: new messages wait again, one of them very old
  await f.evaluate(old => { const H = window.__h; const now = Date.now();
    H.set('inbox/t1', { from: 'manager', kind: 'say', topic: 'בדיקה', text: 'עדכון רגיל', spoken: false, ts: now });
    H.set('inbox/t3', { from: 'manager', kind: 'ask', topic: 'בדיקה', text: 'שאלה בשבת', options: ['כן', 'לא'], spoken: false, ts: now });
    H.set('inbox/t5', { from: 'manager', kind: 'say', topic: 'בדיקה', text: 'הודעה ישנה', spoken: false, ts: old }); }, old);
  heard.length = 0; await speak(2000);
  ok(heard.length === 0, 'after the emergency ends, it is Shabbat again: nothing is said');
  // after it: one ordered reading
  heard.length = 0;
  const out = await f.evaluate(async () => { window.__testShabbat = false; return await window.__shabbat.tick(); });
  await speak(4000);
  const intro = heard.find(t => /שבוע טוב/.test(t)) || '';
  ok(out === 'out' && /שבוע טוב\. בזמן השבת חיכו 3 הודעות, 1 מהן שאלות, ו-1 ישנות מאוד\. אקריא קודם את השאלות/.test(intro), 'after it: "שבוע טוב", how many, how many questions, how many very old: ' + intro.slice(0, 150));
  ok(heard.some(t => /שאלה בשבת/.test(t)) && !heard.some(t => /עדכון רגיל/.test(t)), 'the question first; the rest waits for "הכול"');
  ok((await f.evaluate(() => window.__h.get('inbox/t5').stale)) === true, 'the very old one is marked stale');
  s = await say('הכול'); await speak(3000);
  ok(heard.some(t => /עדכון רגיל/.test(t)) || /עדכון רגיל/.test(s), '"הכול": the rest');
  ok((await f.evaluate(() => window.__h.get('channel/shabbat').mode)) === 'off', 'channel/shabbat says it is over');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
