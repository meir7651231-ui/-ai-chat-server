// step policy: a preference becomes behaviour. Rules said by voice, 50 synthetic messages: exactly the expected
// subset is spoken, every muted one is in the digest (0 lost), urgent is never muted, "למה לא סיפרת לי" names the
// rule, an hours rule holds at night and not by day, a short rule shortens and "תקריא את כל ההודעה" gives it all,
// and the evening reads the digest once. Run: node tests/policy.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-policy-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__policy && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.27.0', pv: 1, caps: ['spoke'], wall: Date.now() })); await p.waitForTimeout(400);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(50); } };
  const say = async t => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(2400); return heard.join(' | '); };
  // the rules, by voice
  const r1 = await say('אל תעדכן אותי על מייל');
  ok(/זו העדפה קבועה/.test(r1) && /מעכשיו זה כלל/.test(r1), 'a preference said by voice becomes a rule: ' + r1);
  for (const t of ['אל תשאל אותי על ארוחת ערב', 'בלי הודעות על משימות שנגמרו', 'אל תעביר לי הודעות מהלוח', 'תקצר על דוחות', 'אל תעיר אותי לפני שש']) await say(t);
  await f.evaluate(() => window.__policy.load()); await p.waitForTimeout(300);
  const types = await f.evaluate(() => [...new Set(window.__policy.rules.map(r => r.type))]);
  ok(types.length === 6, 'six rules of six types compiled: ' + types.join(','));
  // the hours rule, checked at 3 at night and at 10 in the morning (it would hold everything in this test otherwise)
  const at = h => f.evaluate(h => Date.now() + (h - jHour(Date.now())) * 3600e3, h); const night = { getTime: () => nightT }, day = { getTime: () => dayT }; const nightT = await at(3), dayT = await at(10);
  const hr = await f.evaluate(([n, d]) => ({ n: (window.__policy.check({ id: 'x', topic: 'כלום', text: 'שלום', from: 'manager' }, n) || {}).type, d: (window.__policy.check({ id: 'x', topic: 'כלום', text: 'שלום', from: 'manager' }, d) || {}).type, u: window.__policy.check({ id: 'x', text: 'דחוף', priority: 'urgent' }, n) }), [night.getTime(), day.getTime()]);
  ok(hr.n === 'urgent_only' && !hr.d && hr.u === null, 'hours: held at 3 at night, not at 10, and urgent never: ' + JSON.stringify(hr));
  await f.evaluate(() => { window.__policy.rules = window.__policy.rules.filter(r => r.type !== 'urgent_only'); });
  // 50 messages
  const plan = [];
  for (let i = 0; i < 10; i++) plan.push({ id: 'mail' + i, topic: 'מייל', text: 'הגיע מייל ' + i, want: false });
  for (let i = 0; i < 5; i++) plan.push({ id: 'food' + i, kind: 'ask', topic: 'ארוחת ערב', text: 'מה לארוחת ערב ' + i, options: ['כן', 'לא'], want: false });
  for (let i = 0; i < 5; i++) plan.push({ id: 'done' + i, kind: 'done', topic: 'משימה', text: 'משימה נגמרה ' + i, want: false });
  for (let i = 0; i < 5; i++) plan.push({ id: 'board' + i, speaker: 'הלוח', topic: 'לוח', text: 'עדכון לוח ' + i, want: false });
  for (let i = 0; i < 5; i++) plan.push({ id: 'urg' + i, priority: 'urgent', topic: 'מייל', text: 'מייל דחוף ' + i, want: true });
  for (let i = 0; i < 20; i++) plan.push({ id: 'ok' + i, topic: 'בנייה', text: 'עדכון רגיל ' + i, want: true });

  await f.evaluate(ps => { let t = Date.now(); for (const x of ps) { const d = Object.assign({ from: 'manager', kind: 'say', spoken: false, ts: t++ }, x); delete d.want; window.__h.set('inbox/' + x.id, d); } }, plan);
  heard.length = 0; await speak(26000);
  const spoken = plan.filter(x => heard.some(t => t.indexOf(x.text) >= 0)).map(x => x.id);
  const wrong = plan.filter(x => x.want !== spoken.includes(x.id)).map(x => x.id);
  ok(wrong.length === 0, `exactly the expected ${plan.filter(x => x.want).length} of 50 were spoken` + (wrong.length ? ': wrong ' + wrong.slice(0, 6).join(',') : ''));
  const dg = await f.evaluate(() => { const d = window.__h.all('memory/digest/items')[0]; return d ? Object.keys(d.items || {}) : []; });
  const muted = plan.filter(x => !x.want).map(x => x.id);
  ok(muted.every(id => dg.includes(id)), `every muted message is in today's digest - 0 lost: ${muted.filter(id => dg.includes(id)).length}/${muted.length}`);
  ok(plan.filter(x => x.priority === 'urgent').every(x => spoken.includes(x.id)), 'urgent about a muted topic is still spoken');
  const why = await say('למה לא סיפרת לי');
  ok(/כי ביקשת "/.test(why) && /הכלל r-[0-9a-z]+/.test(why), '"למה לא סיפרת לי" names the rule, its words, its id: ' + why.slice(0, 160));
  // short
  await f.evaluate(() => window.__h.set('inbox/rep1', { from: 'manager', kind: 'say', topic: 'דוחות', text: 'הדוח החודשי מוכן. יש בו שלושה סעיפים חדשים שצריך לעבור עליהם. הסכום הכולל עלה בעשרה אחוז.', spoken: false, ts: Date.now() }));
  heard.length = 0; await speak(3000);
  const short = heard.find(t => /הדוח החודשי/.test(t)) || '';
  ok(/הדוח החודשי מוכן\. יש עוד/.test(short) && !/עשרה אחוז/.test(short), 'short: the first sentence and "יש עוד": ' + short);
  const full = await say('תקריא את כל ההודעה');
  ok(/עשרה אחוז/.test(full), '"תקריא את כל ההודעה" gives all of it');
  // the evening
  const eveT = await at(20), eve = { getTime: () => eveT };
  heard.length = 0; const did = await f.evaluate(t => digestEvening(t), eve.getTime()); await speak(2500);
  ok(did && heard.some(t => /בזמן שהשתקת היום חיכו 25 הודעות/.test(t)), 'evening: the digest is read once (' + did + '): ' + heard.join(' | ').slice(0, 140));
  ok(!(await f.evaluate(t => digestEvening(t), eve.getTime())), 'evening: and only once');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
