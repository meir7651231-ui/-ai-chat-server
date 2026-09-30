// step proactive: "אני נזכרת:" - a date the morning before, a person when he is mentioned, "נחזור לזה אחרי X" when X
// comes up; three a day, never at night; the first week only to the evening digest; "לא עכשיו" three times rests a
// kind; "תפסיק להזכיר" is a rule at once; with a phone that has 'remind' the dates go to its alarm and are not fired here,
// and what the phone said counts in the same budget. Run: node tests/proactive.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-pro-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const open = async (caps, extra) => { const p = await b.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
    const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__pro && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
    await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__h.set('memory/proactive', { startedAt: Date.now() - 8 * 864e5 }); });
    await p.evaluate(([caps, extra]) => window.app(Object.assign({ liba: 'hello', ver: '3.28.0', pv: 1, caps, wall: Date.now() }, extra || {})), [caps, extra]); await p.waitForTimeout(500);
    return { p, f, errs }; };
  const { p, f, errs } = await open(['spoke', 'mem']);
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(50); } };
  const say = async t => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(2800); return heard.join(' | '); };
  // person: a recent event about דני, said back when he is mentioned
  await f.evaluate(async () => { await window.__people.upsert('דני', { relation: 'הבן' }); await window.__mem.put(window.__mem.parse('דני מתגייס באוגוסט'), { type: 'said' }); });
  let s = await say('דיברתי היום עם דני');
  ok(/אני נזכרת: דני מתגייס באוגוסט/.test(s), 'person: mentioning דני brings back what is coming for him: ' + s.slice(0, 100));
  s = await say('דיברתי שוב עם דני');
  ok(!/אני נזכרת/.test(s), 'and only once');
  // return: "נחזור לזה אחרי הפגישה", then the meeting comes up
  await f.evaluate(() => window.__h.set('inbox/bank1', { from: 'manager', kind: 'say', topic: 'בנק', text: 'הבנק שלח הצעה חדשה למשכנתא', spoken: false, ts: Date.now() }));
  heard.length = 0; await speak(2500);
  s = await say('נחזור לזה אחרי הפגישה');
  ok(/כשתזכיר את הפגישה, אזכיר לך/.test(s), 'return: noted: ' + s.slice(0, 80));
  s = await say('הפגישה נגמרה עכשיו');
  ok(/אני נזכרת: אמרת שנחזור אחרי הפגישה לזה: .*משכנתא/.test(s), 'return: when the meeting comes up, what "זה" was: ' + s.slice(0, 140));
  // dates: five due today, three said, then the budget; nothing at night
  const r = await f.evaluate(async () => { const d10 = new Date(); d10.setHours(10, 0, 0, 0); const now = d10.getTime();
    window.__pro.reset(); window.__h.set('memory/proactive', { startedAt: now - 8 * 864e5 });
    for (let i = 0; i < 5; i++) await window.__mem.put(window.__mem.parse('הפגישה מספר ' + i + ' עם הבנק מחר'), { type: 'said' });
    window.__testHour = 3; const night = await window.__pro.tick(now); window.__testHour = 11;
    const day = await window.__pro.tick(now); const again = await window.__pro.tick(now + 60000); return { night, day, again, count: window.__pro.state().count }; });
  ok(r.night.length === 5 && r.night.every(x => x[1] === 'night'), 'dates: at three at night nothing is said: ' + r.night.map(x => x[1]).join(','));
  ok(r.day.filter(x => x[1] === 'said').length === 3 - 0 && r.day.filter(x => x[1] === 'budget').length === 2 && r.count === 3, 'dates: by day three are said and two wait - three a day: ' + r.day.map(x => x[1]).join(','));
  ok(r.again.every(x => x[1] === 'done' || x[1] === 'budget'), 'and none twice');
  heard.length = 0; await speak(3000);
  ok(heard.filter(t => /אני נזכרת: הפגישה מספר \d עם הבנק מחר/.test(t)).length >= 1, 'said as "אני נזכרת:": ' + heard.join(' | ').slice(0, 120));
  // "לא עכשיו" three times rests the kind
  const rest = await f.evaluate(async () => { window.__pro.reset(); window.__h.set('memory/proactive', { startedAt: Date.now() - 8 * 864e5 }); const out = [];
    for (let i = 0; i < 3; i++) { await window.__pro.fire({ id: 'person.t' + i, kind: 'person', text: 'בדיקה ' + i }); out.push(proNot()); await new Promise(r => setTimeout(r, 300)); }
    window.__pro.state().count = 0; const next = await window.__pro.fire({ id: 'person.t9', kind: 'person', text: 'עוד אחת' }); const other = await window.__pro.fire({ id: 'date.x', kind: 'date', text: 'תאריך' });
    return { out, next, other, neg: window.__pro.state().neg.person }; });
  ok(rest.out.every(Boolean) && rest.neg === 3 && rest.next === 'resting' && rest.other === 'said', '"לא עכשיו" three times: that kind rests, others do not: ' + JSON.stringify(rest));
  // "תפסיק להזכיר": a rule at once
  s = await say('תפסיק להזכיר');
  const stop = await f.evaluate(async () => { await window.__policy.load(); window.__pro.reset(); window.__h.set('memory/proactive', { startedAt: Date.now() - 8 * 864e5 });
    return await window.__pro.fire({ id: 'date.y', kind: 'date', text: 'משהו חשוב' }); });
  heard.length = 0; await speak(2500);
  const dg = await f.evaluate(() => window.__h.all('memory/digest/items').flatMap(d => Object.keys(d.items || {})));
  ok(/מעכשיו זה כלל/.test(s) && stop === 'said' && !heard.some(t => /משהו חשוב/.test(t)) && dg.includes('pro-date.y'), '"תפסיק להזכיר": a rule at once - held to the digest, not said: ' + s.slice(0, 60));
  // the first week: only the digest
  const fw = await f.evaluate(async () => { await window.__mem.forget('להזכיר'); await window.__policy.load(); window.__pro.reset(); window.__h.set('memory/proactive', { startedAt: Date.now() - 2 * 864e5 });
    return await window.__pro.fire({ id: 'date.z', kind: 'date', text: 'שבוע ראשון' }); });
  const dg2 = await f.evaluate(() => window.__h.all('memory/digest/items').flatMap(d => Object.keys(d.items || {})));
  ok(fw === 'digest' && dg2.includes('pro-date.z'), 'the first week: to the evening digest only: ' + fw);
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  // a phone with 'remind': the dates go to its alarm, and what it said counts
  const o = await open(['spoke', 'mem', 'remind'], { spoken: '' });
  await o.f.evaluate(async () => { await window.__mem.put(window.__mem.parse('התור לרופא שיניים מחר'), { type: 'said' }); });
  await o.p.waitForTimeout(3000);
  const m = await o.p.evaluate(() => window.msgs.filter(x => x.liba === 'remind'));
  const items = m.length ? JSON.parse(m[m.length - 1].items) : [];
  ok(items.length >= 1 && items.every(x => /^pro-date\.[0-9a-z]+$/.test(x.id) && /^אני נזכרת:/.test(x.text) && x.at < x.until), 'the phone gets the date reminders, ids its alarm can report: ' + JSON.stringify(items[0] || {}).slice(0, 120));
  const t2 = await o.f.evaluate(async () => { const d10 = new Date(); d10.setHours(10, 0, 0, 0); return await window.__pro.tick(d10.getTime()); });
  ok(t2.length === 0, 'and this page does not fire them itself');
  await o.p.evaluate(id => window.app({ liba: 'hello', ver: '3.28.0', pv: 1, caps: ['spoke', 'mem', 'remind'], wall: Date.now(), spoken: id }), items[0] && items[0].id);
  await o.p.waitForTimeout(800);
  const cnt = await o.f.evaluate(() => window.__pro.state() && window.__pro.state().count);
  ok(cnt === 1, 'what the phone said counts in the one budget: ' + cnt);
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
