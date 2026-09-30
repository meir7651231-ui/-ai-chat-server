// step context-fusion (and the body part of place-sense), the page's side: sense/context follows the phone and the
// calendar; a call or a meeting holds all but urgent and releases the moment it ends; a declined meeting holds nothing;
// every spoken message carries its decision and context; a morning message goes early only when Meir is up.
// Run: node tests/context.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-ctx-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__ctx && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; });
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.30.0', pv: 1, caps: ['spoke', 'ctx', 'cal'], wall: Date.now() }); }); await p.waitForTimeout(800);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(50); } };
  const say = async t => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(2400); return heard.join(' | '); };
  const ctx = c => p.evaluate(c => window.app({ liba: 'ctx', body: JSON.stringify(Object.assign({ screen: true, locked: false, headset: false, call: false, lastWake: 0, wakeSource: '', at: Date.now() }, c)) }), c);
  const msg = (id, extra) => f.evaluate(([id, extra]) => window.__h.set('inbox/' + id, Object.assign({ from: 'manager', kind: 'say', topic: 'בדיקה', text: 'הודעה ' + id, spoken: false, ts: Date.now() }, extra || {})), [id, extra]);
  await ctx({}); await p.waitForTimeout(300);
  const c0 = await f.evaluate(() => window.__h.get('sense/context'));
  ok(c0 && c0.screen === true && c0.call === false && c0.meeting === false, 'sense/context follows the phone: ' + JSON.stringify(c0 && { screen: c0.screen, call: c0.call }));
  // a call
  const t0 = Date.now(); await ctx({ call: true }); await f.waitForFunction(() => (window.__h.get('sense/context') || {}).call === true, null, { timeout: 3000 }).catch(() => {});
  ok(Date.now() - t0 < 2000, 'a call is in the picture within two seconds: ' + (Date.now() - t0) + ' ms');
  await msg('c1'); await msg('c2', { priority: 'urgent', text: 'דחוף בשיחה' });
  heard.length = 0; await speak(2500);
  ok(!heard.some(t => /הודעה c1/.test(t)) && heard.some(t => /דחוף בשיחה/.test(t)), 'during a call: urgent is said, the rest waits');
  let s = await say('מה פספסתי');
  ok(/כי אתה בשיחה/.test(s), '"מה פספסתי" says why: ' + s.slice(0, 100));
  heard.length = 0; await ctx({ call: false }); await speak(2500);
  ok(heard.some(t => /הודעה c1/.test(t)), 'the call ended: what waited is said at once');
  // a meeting from the calendar
  const now = Date.now();
  const mk = (self, att) => ({ from: now - 864e5, to: now + 8 * 864e5, items: [{ id: '91-' + (now - 600000), title: 'ישיבה', begin: now - 600000, end: now + 3000e3, allDay: false, where: '', attendees: att, self }] });
  await f.evaluate(s => calIn(JSON.stringify(s)), mk(1, 3)); await p.waitForTimeout(300);
  ok((await f.evaluate(() => window.__h.get('sense/context').meeting)) === true, 'a meeting now (two or more, accepted) is in the picture');
  await msg('m1'); await msg('m2', { kind: 'ask', text: 'שאלה בפגישה', options: ['כן', 'לא'] }); await msg('m3', { priority: 'urgent', text: 'דחוף בפגישה' });
  heard.length = 0; await speak(2500);
  ok(!heard.some(t => /הודעה m1|שאלה בפגישה/.test(t)) && heard.some(t => /דחוף בפגישה/.test(t)), 'during a meeting: no ring, no question - only urgent');
  s = await say('מה פספסתי');
  ok(/כי אתה בפגישה/.test(s), '"מה פספסתי": ' + s.slice(0, 100));
  heard.length = 0; await f.evaluate(s => calIn(JSON.stringify(s)), { from: now - 864e5, to: now + 8 * 864e5, items: [] }); await speak(3000);
  ok(heard.some(t => /הודעה m1/.test(t)) && heard.some(t => /שאלה בפגישה/.test(t)), 'the meeting was removed: both are said');
  heard.length = 0; await f.evaluate(s => calIn(JSON.stringify(s)), mk(2, 5)); await msg('m4'); await speak(2500);
  ok(heard.some(t => /הודעה m4/.test(t)), 'a declined meeting holds nothing');
  await f.evaluate(s => calIn(JSON.stringify(s)), { from: now - 864e5, to: now + 8 * 864e5, items: [] });
  // every spoken message carries its decision
  const docs = await f.evaluate(() => window.__h.all('inbox').filter(d => d.spoken && /^[cm]\d$/.test(d.id)));
  ok(docs.length >= 6 && docs.every(d => d.admit && d.admit.rule && d.admit.ctx && typeof d.admit.ctx.meeting === 'boolean'), `every spoken message carries its decision and context: ${docs.filter(d => d.admit).length}/${docs.length}`);
  ok(docs.find(d => d.id === 'c2').admit.rule === 'urgent' && docs.find(d => d.id === 'c2').admit.ctx.call === true, 'the urgent one in the call: rule urgent, call in its context');
  // the body: a morning message at seven, before and after Meir is up
  await f.evaluate(() => { window.__testHour = 7; });
  await msg('w1', { priority: 'morning', text: 'בוקר טוב מוקדם' });
  heard.length = 0; await speak(2000);
  ok(!heard.some(t => /בוקר טוב מוקדם/.test(t)), 'at seven, before he woke: the morning message waits');
  heard.length = 0; await ctx({ lastWake: Date.now() - 20 * 60000, wakeSource: 'unlock' }); await p.waitForTimeout(300);
  await f.evaluate(() => pump()); await speak(2500);
  const body = await f.evaluate(() => window.__h.get('sense/body'));
  ok(body && body.lastWake > 0 && body.wakeSource === 'unlock', 'sense/body keeps when he woke');
  ok(heard.some(t => /בוקר טוב מוקדם/.test(t)), 'he is up at seven: the morning message goes');
  await f.evaluate(() => { window.__testHour = 5; });
  const up5 = await f.evaluate(() => window.__ctx.up());
  ok(up5 === false, 'but never before six');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
