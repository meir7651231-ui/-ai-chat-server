// step calendar-sense, the page's side: a snapshot from the phone becomes sense/cal/items (moved and deleted meetings
// follow); "מה יש לי היום/מחר" in order with all-day and declined ones; "מתי אני פנוי" skips meetings; the briefing ten
// minutes before, with what is known about the person; nothing is written to the real calendar; "תפסיקי לקרוא" erases.
// Run: node tests/cal.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-cal-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__cal && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; });
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.30.0', pv: 1, caps: ['spoke', 'cal', 'remind'], wall: Date.now() }); }); await p.waitForTimeout(800);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const heard = [], others = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) { if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } else others.push(x); } await p.waitForTimeout(50); } };
  const say = async t => { heard.length = 0; others.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(2600); return heard.join(' | '); };
  let s = await say('מה יש לי היום');
  ok(/אני עוד לא קוראת את היומן/.test(s), 'before it is allowed: says so, reads nothing: ' + s.slice(0, 80));
  s = await say('תקראי את היומן שלי');
  ok(/הטלפון ישאל אותך/.test(s) && /רק קוראת/.test(s) && others.some(x => x.liba === 'cmd' && x.cmd === 'cal_on'), '"תקראי את היומן שלי": the phone asks, read only');
  // today at 10:00 and 14:00 Jerusalem, an all-day one, a declined one; tomorrow one
  const snap = await f.evaluate(() => { const at = (dayOff, h) => { const t = Math.floor((Date.now() + dayOff * 864e5) / 60000) * 60000; const base = t - ((jHour(t) * 60 + new Date(t).getMinutes()) * 60000); return base + h * 3600e3; };
    const d0 = new Date(); const ymd = trDay(Date.now()); const allDay = Date.UTC(+ymd.slice(0, 4), +ymd.slice(5, 7) - 1, +ymd.slice(8, 10));
    const items = [{ id: '11-' + at(0, 10), title: 'פגישה עם דני', begin: at(0, 10), end: at(0, 11), allDay: false, where: 'משרד', attendees: 3, self: 1 },
      { id: '12-' + at(0, 14), title: 'רואה חשבון', begin: at(0, 14), end: at(0, 15), allDay: false, where: '', attendees: 2, self: 1 },
      { id: '13-' + allDay, title: 'יום הולדת לשרה', begin: allDay, end: allDay + 864e5, allDay: true, where: '', attendees: 0, self: 0 },
      { id: '14-' + at(0, 16), title: 'ישיבת צוות', begin: at(0, 16), end: at(0, 17), allDay: false, where: '', attendees: 6, self: 2 },
      { id: '15-' + at(1, 9), title: 'ביקור אצל אמא', begin: at(1, 9), end: at(1, 12), allDay: false, where: 'חיפה', attendees: 0, self: 0 }];
    return { from: Date.now() - 864e5, to: Date.now() + 8 * 864e5, items }; });
  await f.evaluate(async () => { await window.__people.upsert('דני', { relation: 'הבן שלי' }); await window.__mem.put(window.__mem.parse('דני מתגייס באוגוסט'), { type: 'said' }); });
  const r1 = await f.evaluate(async s => { await calIn(JSON.stringify(s)); return window.__h.all('sense/cal/items').length; }, snap);
  ok(r1 === 5, 'the snapshot becomes sense/cal/items: ' + r1);
  const st = await f.evaluate(() => window.__h.get('sense/cal'));
  ok(st && st.now && typeof st.now.meeting === 'boolean', 'sense/cal says whether a meeting is on now');
  s = await say('מה יש לי היום');
  ok(/היום יש לך 4 דברים: כל היום: יום הולדת לשרה; 10:00 פגישה עם דני במשרד; 14:00 רואה חשבון; 16:00 ישיבת צוות \(דחית\)/.test(s), '"מה יש לי היום": all-day first, in order, declined said: ' + s.slice(0, 180));
  s = await say('מה יש לי מחר');
  ok(/מחר יש לך דבר אחד: 09:00 ביקור אצל אמא בחיפה/.test(s), '"מה יש לי מחר": ' + s.slice(0, 100));
  const free = await f.evaluate(s => { const now = s.items[0].begin - 3600e3; return window.__cal.free(now, s.items, 2).map(r => [jHour(r.from), jHour(r.to)]); }, snap);
  ok(free.length >= 2 && free[0][0] === 9 && free[0][1] === 10 && free[1][0] === 11 && free[1][1] === 14 && !free.some(r => r[0] <= 10 && r[1] > 10), 'free time skips the meetings, keeps the declined one free: ' + JSON.stringify(free.slice(0, 4)));
  s = await say('מתי אני פנוי');
  ok(/אתה פנוי/.test(s), '"מתי אני פנוי": ' + s.slice(0, 120));
  // the briefing, ten minutes before - to the phone's alarm, with what is known about דני
  const br = await f.evaluate(async s => (await window.__cal.briefings(s.items[0].begin - 3600e3)), snap);
  const b0 = br.find(x => /פגישה עם דני/.test(x.text));
  ok(!!b0 && b0.at === snap.items[0].begin - 600000 && b0.cap === false && /דני הוא הבן שלי; דני מתגייס באוגוסט/.test(b0.text), 'the briefing: ten minutes before, outside the three, with what is known: ' + (b0 && b0.text));
  ok(!br.some(x => /ישיבת צוות|יום הולדת/.test(x.text)), 'no briefing for a declined or an all-day one');
  await f.evaluate(() => proSchedule()); await p.waitForTimeout(1200);
  const rem = await p.evaluate(() => window.msgs.filter(x => x.liba === 'remind').map(x => JSON.parse(x.items)));
  ok(rem.length && rem[rem.length - 1].some(x => /^pro-cal\./.test(x.id) && x.cap === false), 'the briefings go to the phone\'s alarm');
  // a moved and a deleted meeting follow
  const moved = JSON.parse(JSON.stringify(snap)); moved.items = moved.items.filter(x => !/רואה חשבון/.test(x.title)); moved.items[0].where = 'בבית';
  const r2 = await f.evaluate(async s => { const r = await calIn(JSON.stringify(s)); return { r, n: window.__h.all('sense/cal/items').length, where: window.__h.all('sense/cal/items').find(x => /דני/.test(x.title)).where }; }, moved);
  ok(r2.n === 4 && r2.where === 'בבית' && r2.r.gone === 1, 'a deleted meeting is deleted, a moved one follows: ' + JSON.stringify(r2));
  const bad = await f.evaluate(async () => await calIn('{broken'));
  ok(bad === null, 'a broken snapshot is refused');
  // writing waits for Meir
  s = await say('תקבע פגישה עם דני ביום שלישי בעשר');
  ok(/עוד לא אישרת לי/.test(s) && !others.some(x => x.liba === 'cmd' && /cal_write|insert/.test(x.cmd || '')), 'writing to the calendar: says it waits for his decision, writes nothing: ' + s.slice(0, 90));
  const sent = await f.evaluate(() => window.__h.sentRaw.join('\n'));
  ok(!/ביקור אצל אמא|רואה חשבון/.test(sent), 'the calendar never goes into a sentence to Claude');
  s = await say('תפסיקי לקרוא את היומן');
  await p.waitForTimeout(500);
  ok(/מחקתי/.test(s) && (await f.evaluate(() => window.__h.all('sense/cal/items').length)) === 0 && others.some(x => x.cmd === 'cal_off'), '"תפסיקי לקרוא את היומן": stops, and erases the copy');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
