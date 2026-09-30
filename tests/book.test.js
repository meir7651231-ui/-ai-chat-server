// steps work-book + week-ledger: obligations added by voice land in book/cycle with a day, an hour and a kind; "מה יש
// לי השבוע" reads them; the due loop asks once, "נסגר" closes it with a record; what came due long ago is said as
// missed; the intake asks one question a day into silence and stops at "זהו"; the Friday close gives every due
// occurrence a verdict and a src that exists, the counts add up, every missed one becomes a task, it runs once a week,
// and Meir hears one summary. Run: node tests/book.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-book-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__book && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const take = () => p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
  const hello = caps => p.evaluate(c => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: c, wall: Date.now() }); }, caps);
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.36.0', pv: 1, caps: ['spoke'], wall: Date.now() }); }); await p.waitForTimeout(800);
  await f.evaluate(() => { bookTickAt = Date.now() + 1e12; }); /* the test drives the book by hand */
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(40); } };
  const say = async (t, n) => { await speak(500); heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); for (let i = 0; i < 25 && heard.length < (n || 1); i++) await speak(200); await speak(300); return heard.join(' | '); };
  const cyc = () => f.evaluate(() => window.__book.state().cycle.obligations);
  let s = await say('תוסיף חובה: דוח נוכחות, כל חמישי בעשר');
  let o = (await cyc()).find(x => x.title === 'דוח נוכחות');
  ok(o && o.dow === 4 && o.dueHour === 10 && o.kind === 'report' && /רשמתי: דוח נוכחות, כל חמישי ב-10/.test(s), 'by voice: a day, an hour, a kind: ' + s.slice(0, 60));
  await say('תוסיף חובה: משכורות, בעשירי לחודש בתשע'); await say('תוסיף חובה: ישיבת צוות, כל ראשון ב-9'); await say('תוסיף חובה: תורנות מטבח, כל יום בשבע');
  const all = await cyc();
  ok(all.length === 4 && all.find(x => x.title === 'משכורות').dom === 10 && all.find(x => x.title === 'משכורות').kind === 'payment' && all.find(x => x.title === 'ישיבת צוות').dow === 0 && all.find(x => x.title === 'תורנות מטבח').dow === -1 && all.find(x => x.title === 'תורנות מטבח').kind === 'shift', 'monthly, weekly, daily - and their kinds');
  s = await say('תוסיף חובה: משהו בלי זמן');
  ok(/לא הבנתי מתי/.test(s) && (await cyc()).length === 4, 'no day, no hour: asks, adds nothing');
  s = await say('מה יש לי השבוע');
  ok(/חמישי: .*דוח נוכחות ב-10/.test(s) || /(היום|מחר): .*דוח נוכחות ב-10/.test(s), '"מה יש לי השבוע": ' + s.slice(0, 120));
  // due loop: the daily kitchen duty at 7, asked at 8
  const day = await f.evaluate(() => trDay(Date.now())); const at8 = Date.parse(day + 'T08:00:00+03:00'), at13 = Date.parse(day + 'T13:00:00+03:00');
  heard.length = 0; await f.evaluate(t => window.__book.due(t), at8); await speak(1500);
  ok(heard.some(h => /הגיע הזמן: תורנות מטבח\. נסגר\?/.test(h)), 'due: asked once: ' + heard.join(' | ').slice(0, 80));
  s = await say('נסגר');
  const closes = await f.evaluate(() => window.__h.all('book/closes/items'));
  ok(/סגרתי: תורנות מטבח/.test(s) && closes.length === 1 && closes[0].verdict === 'done' && (await cyc()).find(x => x.title === 'תורנות מטבח').lastDoneAt > 0, '"נסגר": a close record, lastDoneAt');
  heard.length = 0; await f.evaluate(t => window.__book.due(t), at8 + 3600e3); await speak(800);
  ok(!heard.some(h => /תורנות מטבח/.test(h)), 'not asked again the same day');
  // missed: add one due at 8, first seen at 13
  await say('תוסיף חובה: בדיקת מקלט, כל יום בשמונה'); heard.length = 0; await f.evaluate(t => window.__book.due(t), at13); await speak(1500);
  ok(heard.some(h => /פספסת: בדיקת מקלט היה צריך היום ב-8\. נסגר בכל זאת\?/.test(h)), 'came due while closed: said as missed, not as now');
  s = await say('לא רלוונטי');
  ok(/סימנתי כלא רלוונטי: בדיקת מקלט/.test(s), '"לא רלוונטי": recorded as na');
  // intake
  await speak(1500); await f.evaluate(() => { inboxQ.length = 0; }); heard.length = 0; const now = await f.evaluate(() => Date.now());
  await f.evaluate(n => window.__book.intake(n), now); await speak(1500);
  ok(heard.some(h => /תגיד לי חובה קבועה אחת/.test(h)), 'intake: one question, into silence');
  s = await say('דוח תקציב, כל שלישי באחת עשרה');
  ok(/רשמתי: דוח תקציב, כל שלישי ב-11/.test(s), 'intake answer: structured: ' + s.slice(0, 60));
  heard.length = 0; await f.evaluate(n => window.__book.intake(n), now + 60000); await speak(800);
  ok(!heard.length, 'one question a day at most');
  await speak(1000); heard.length = 0; await f.evaluate(n => window.__book.intake(n), now + 864e5); await speak(1500);
  ok(heard.some(h => /עוד חובה קבועה\?/.test(h)), 'the next day: the next question');
  s = await say('זהו');
  heard.length = 0; await f.evaluate(n => window.__book.intake(n), now + 2 * 864e5); await speak(800);
  ok(/ספר העבודה סגור לשאלות/.test(s) && !heard.length, '"זהו": the intake stops');
  // week close
  const W = await f.evaluate(n => { const wk = window.__book.weekId(n - 7 * 864e5); /* last week - this week has today's real presence */ return { wk, start: Date.parse(wk + 'T00:00:00+03:00') }; }, now);
  const d = k => W.start + k * 864e5;
  await f.evaluate(([W, D]) => { const d = k => W.start + k * 864e5;
    window.__h.set('book/cycle', { obligations: [
      { id: 'o-a', title: 'דוח נוכחות', dow: 4, dueHour: 10, graceHours: 4, kind: 'report', feeds: ['דוח נוכחות'] },
      { id: 'o-b', title: 'ישיבת צוות', dow: 0, dueHour: 9, graceHours: 4, kind: 'decision', feeds: ['ישיבת צוות'] },
      { id: 'o-c', title: 'משכורות', dom: +new Date(d(2)).toLocaleDateString('en-GB', { timeZone: 'Asia/Jerusalem', day: 'numeric' }), dueHour: 9, graceHours: 24, kind: 'payment', feeds: ['משכורות'] },
      { id: 'o-d', title: 'סיור', dow: 3, dueHour: 10, graceHours: 4, kind: 'visit', feeds: ['סיור'] },
      { id: 'o-e', title: 'דוח תקציב', dow: 1, dueHour: 11, graceHours: 4, kind: 'form', feeds: ['דוח תקציב'] }] });
    window.__h.set('book/closes/items/c1', { obligationId: 'o-a', weekId: W.wk, verdict: 'done', by: 'מאיר', ts: d(4) + 9 * 3600e3 });
    window.__h.set('decisions/log/items/dz', { question: 'לדחות?', answer: 'כן', topic: 'ישיבת צוות', ts: d(0) + 15 * 3600e3 });
    window.__h.set('book/forms/items/f1', { title: 'דוח תקציב', feeds: ['דוח תקציב'], fields: [] });
    window.__h.set('book/runs/items/r1', { formId: 'f1', state: 'done', startedAt: d(1) + 9 * 3600e3, doneAt: d(1) + 10 * 3600e3 });
    for (const k of [0, 1, 2, 4]) window.__h.set('book/presence/items/' + trDay(d(k) + 12 * 3600e3), { day: trDay(d(k) + 12 * 3600e3), minutesOpen: 60, firstAt: d(k) + 8 * 3600e3, lastAt: d(k) + 18 * 3600e3 }); }, [W, 0]);
  await p.waitForTimeout(400); heard.length = 0;
  const fri = d(5) + 17 * 3600e3;
  const sum = await f.evaluate(t => window.__book.weekClose(t), fri); await speak(2000);
  const v = Object.fromEntries((sum && sum.rows || []).map(r => [r.obligationId, r]));
  ok(sum && v['o-a'].verdict === 'done' && v['o-b'].verdict === 'late' && v['o-c'].verdict === 'missed' && v['o-d'].verdict === 'unknown' && v['o-e'].verdict === 'done', 'verdicts: a close, a late decision, a missed payment, a day ליבה was not open, a form run: ' + JSON.stringify(Object.fromEntries(Object.entries(v).map(([k, r]) => [k, r.verdict]))));
  ok(sum.onTime + sum.late + sum.missed + sum.unknown + sum.na === sum.rows.length && sum.rows.length === 5, 'the counts add up: ' + [sum.onTime, sum.late, sum.missed, sum.unknown].join('+') + ' = ' + sum.rows.length);
  const srcOk = await f.evaluate(rows => rows.filter(r => r.verdict === 'done' || r.verdict === 'late').every(r => { const p = r.src.replace('book/closes/items/', 'book/closes/items/'); return !!window.__h.get(p); }), sum.rows);
  ok(srcOk, 'every done or late row points at a document that exists');
  const mt = await f.evaluate(() => window.__h.all('tasks').filter(t => t.kind === 'missed'));
  ok(mt.length === 1 && /פוספס: משכורות/.test(mt[0].title), 'the missed one is a task');
  ok(heard.some(h => /סגירת שבוע: 2 בזמן, 1 באיחור, 1 פוספסו - פתחתי להן משימות, ו-1 לא ידוע, כי לא הייתי פתוחה ברביעי/.test(h)), 'one summary: ' + (heard.find(h => /סגירת שבוע/.test(h)) || '').slice(0, 140));
  const again = await f.evaluate(t => window.__book.weekClose(t + 3600e3), fri);
  ok(again === null && (await f.evaluate(() => window.__h.all('book/ledger/items').length)) === 1, 'once a week');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
