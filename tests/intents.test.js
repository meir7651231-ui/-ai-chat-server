// step intent-kernel: the one router, by table. Each sentence -> the command it is (or none: it goes to Claude).
// The dangerous neighbours from the plan ("תעצור"/"תעזור", "תמחק"/"תמשיך") must never cross, a near miss is asked and
// never run, "לא" sends the sentence on as it was, and "תשכח" asks before it deletes. Run: node tests/intents.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
const TABLE = [
  ['אל תפריע שעה', 'quiet.on', 'שעה'], ['שקט עד הערב', 'quiet.on', 'עד הערב'], ['תפריע', 'quiet.off'], ['בטל את השקט', 'quiet.off'], ['שקט נגמר', 'quiet.off'],
  ['מה את יודעת?', 'help'], ['פקודות משימות', 'help.family', 'משימות'], ['מה בניתי השבוע', 'gallery.week'], ['המחולל', 'generator.open'],
  ['מה נשבר היום', 'trace.today'], ['תזכור שהרואה חשבון הוא דני', 'memory.remember', 'שהרואה חשבון הוא דני'], ['תזכור כי מחר יש ישיבה', 'memory.remember', 'מחר יש ישיבה'],
  ['תשכח את הרואה חשבון', 'memory.forget', 'הרואה חשבון'], ['תשכח שהרואה חשבון הוא דני', 'memory.forget', 'הרואה חשבון הוא דני'], ['תשכח', null],
  ['אל תשאל אותי על ארוחת ערב', 'memory.pref', 'ארוחת ערב'], ['מה אתה זוכר', 'memory.list'], ['כמה בקשות היום', 'req.today'], ['כמה זמן לוקח לך לענות', 'latency.today'],
  ['מה מצב הקו', 'line.status'], ['למה שתקת', 'phone.why'], ['מה לא נשלח', 'outbox.list'], ['תשלח שוב', 'outbox.resend'], ['מה פספסתי', 'missed.list'],
  ['תשחרר הכל', 'missed.all'], ['מפה', 'map'], ['קודם את הבנייה', 'task.priority', 'הבנייה'], ['ליבה, תחזור', 'owner.liba'], ['ליבא תחזור', 'owner.liba'],
  ['תעלה את המנהל', 'owner.manager'], ['מנהל', 'owner.manager'], ['מנהל מה המצב', 'address.manager', 'מה המצב'],
  // these go to Claude, as sentences
  ['תעביר למנהל את הקובץ', null], ['תעצור את הבנייה', null], ['תבנה לי אתר', 'fleet.build'], ['העיצוב טוב אבל יותר מפלצתי', null], ['מה נשאר לעשות היום', null],
  // the dangerous neighbours never become each other
  ['תעזור לי עם המייל', null], ['תמשיך', null], ['תמחק', null],
  // punctuation, niqqud and spacing do not matter
  ['  מַה  פִּסְפַסְתִּי ?! ', 'missed.list'], ['תשלח   שוב.', 'outbox.resend'],
];
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-intents-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__intent && window.claude, null, { timeout: 8000 });
  await p.waitForTimeout(700);
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.25.0', pv: 1, caps: ['spoke'], wall: Date.now() })); await p.waitForTimeout(500);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const got = await f.evaluate(rows => rows.map(([t]) => window.__intent.match(t)), TABLE);
  const wrong = TABLE.map((r, i) => ({ r, g: got[i] })).filter(({ r, g }) => (g ? g.id : null) !== r[1] || (r[2] !== undefined && g && g.rest !== r[2]));
  ok(wrong.length === 0, `router: ${TABLE.length - wrong.length}/${TABLE.length} sentences go where they belong` + (wrong.length ? ': ' + wrong.slice(0, 5).map(x => `"${x.r[0]}"→${x.g ? x.g.id + '/' + x.g.rest : 'Claude'}`).join(' ; ') : ''));
  const said = async (t, ms = 2200) => { await p.evaluate(() => { window.msgs = []; }); await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await p.waitForTimeout(ms);
    const m = await p.evaluate(() => window.msgs.slice()); for (const x of m) if (x.liba === 'say' && x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); return m.filter(x => x.liba === 'say').map(x => x.text); };
  const sentNow = () => f.evaluate(() => window.__h.sent.slice());
  // a near miss: asked, not run; "לא" sends the sentence as it was said
  const near = await said('מה פספסתיי');
  ok(near.some(t => /התכוונת ל"מה פספסתי"/.test(t)), 'fuzzy: one letter off a command is asked, not run: ' + near.join(' | '));
  const before = (await sentNow()).length; await said('לא', 3000);
  const s1 = (await sentNow()).slice(before);
  ok(s1.some(t => /מה פספסתיי$/.test(t)), '"לא" sends the sentence on to Claude, as it was: ' + JSON.stringify(s1));
  // confirm: "תשכח" asks; "כן" runs it
  await f.evaluate(() => window.__mem.put(window.__mem.parse('הרואה חשבון הוא דני')));
  const live = () => f.evaluate(() => window.__h.all('memory/facts/items').some(x => x.subject === 'הרואה חשבון' && x.state !== 'tomb'));
  const ask = await said('תשכח את הרואה חשבון');
  ok(ask.some(t => /כן או לא/.test(t)) && await live(), 'confirm: "תשכח" asks first and forgets nothing yet: ' + ask.join(' | '));
  const yes = await said('כן', 2500);
  ok(!(await live()) && yes.some(t => /שכחתי/.test(t)), '"כן" runs it: ' + yes.join(' | '));
  // with nothing pending, "כן" is just an answer - it goes to Claude
  const b2 = (await sentNow()).length; await said('כן', 2600);
  ok((await sentNow()).slice(b2).some(t => /כן$/.test(t)), 'with nothing pending, "כן" is an answer and goes on to Claude');
  // capability-registry: a never-used command heard inside a sentence to Claude earns one hint - and only one in four hours
  const h1 = await said('תגידי לי בבקשה מה פספסתי אתמול', 3000);
  ok(h1.some(t => /אגב, "מה פספסתי" לבד עושה את זה מיד/.test(t)), 'hint: a command inside a longer sentence gets one line: ' + h1.join(' | '));
  const h2 = await said('ומה לא נשלח מאתמול בערב', 3000);
  ok(!h2.some(t => /אגב/.test(t)), 'hint: a second one within four hours is not said: ' + h2.join(' | '));
  await f.evaluate(() => { const c = window.__caps.state(); }); await said('מה פספסתי', 2000);
  const st = await f.evaluate(() => window.__caps.state());
  ok(st['missed.list'] && st['missed.list'].seen >= 1 && st['missed.list'].hints === 1, 'hint: using the command counts it as seen, and the hint count is kept: ' + JSON.stringify(st['missed.list']));
  // nbest, page side: a sentence that was not a command, then "התכוונתי ל…" - it runs, and next time those words are the command
  await said('מה פספסטי היום בבוקר', 2600);
  const fx = await said('התכוונתי למה פספסתי', 2600);
  ok(fx.some(t => /אזכור: כשאני שומעת "מה פספסטי היום בבוקר"/.test(t)), 'fix: the correction is learned and said: ' + fx.join(' | '));
  const again = await f.evaluate(() => window.__intent.match('מה פספסטי היום בבוקר'));
  ok(again && again.id === 'missed.list' && again.how === 'fixed', 'fix: next time the same words are the command: ' + JSON.stringify(again));
  const nf = await f.evaluate(() => window.__intent.match('התכוונתי לבנות אתר גדול'));
  const b3 = (await sentNow()).length; await said('התכוונתי לבנות אתר גדול', 2600);
  ok((await sentNow()).slice(b3).some(t => /התכוונתי לבנות אתר גדול$/.test(t)), '"התכוונתי" + something that is not a command goes on to Claude as said');
  const cl = await said('תשכחי את התיקונים', 2000);
  ok(cl.some(t => /שכחתי תיקון אחד/.test(t)) && JSON.stringify(await f.evaluate(() => window.__fixes())) === '{}', 'fix: "תשכחי את התיקונים" clears them: ' + cl.join(' | '));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
