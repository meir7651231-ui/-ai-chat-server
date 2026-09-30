// step initiative: from the world the page already knows, rules propose; the mandate decides; everything - done or not -
// is in agenda/ with its reason; a rule never fires twice for the same thing; at night it proposes but does not speak.
// Run: node tests/initiative.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-init-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__init && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: ['spoke'], wall: Date.now() }); }); await p.waitForTimeout(800);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(50); } };
  const say = async t => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(2300); return heard.join(' | '); };
  // the world: a task blocked an hour, a session silent five hours, a message waiting seven hours, an outbox line stuck twenty minutes
  await f.evaluate(() => { const now = Date.now();
    lastTasks = [{ id: 't1', title: 'בניית הלוח', status: 'blocked', updatedAt: now - 3600e3, question: 'איזה צבע?', options: ['כחול', 'ירוק'] }, { id: 't2', title: 'אחרת', status: 'running', updatedAt: now }];
    sessionsList = [{ id: 's1', title: 'סשן הדוחות', status: 'running', updatedAt: now - 5 * 3600e3 }, { id: 's2', title: 'חי', status: 'running', updatedAt: now }];
    inboxQ.push({ id: 'old1', from: 'manager', kind: 'say', topic: 'חשבונית', text: 'חשבונית', ts: now - 7 * 3600e3, spoken: false });
    outbox.push({ req: 'r-stuck', text: 'משפט תקוע', tag: '[ליבה] ', ts: now - 20 * 60000, phase: 'sending', leaseUntil: now + 60000, attempts: 1 }); });
  const r1 = await f.evaluate(() => window.__init.tick());
  const rules = r1.map(x => x.rule).sort();
  ok(['inbox.waiting', 'outbox.stuck', 'session.stale', 'task.blocked.silent'].every(r => rules.indexOf(r) >= 0), 'four rules propose from the world: ' + rules.join(','));
  ok(r1.every(x => x.verdict && x.cause && x.consequence), 'every proposal carries its verdict, cause and consequence');
  heard.length = 0; await speak(4000);
  ok(heard.some(t => /המשימה בניית הלוח תקועה כבר שעה ומחכה לך: איזה צבע\?$/.test(t)), 'the stuck task: its question, asked: ' + (heard.find(t => /בניית הלוח/.test(t)) || '').slice(0, 120));
  ok(heard.some(t => /הסשן סשן הדוחות רשום כרץ, אבל לא זז 5 שעות/.test(t)), 'the silent session, said');
  ok((await f.evaluate(() => { const x = outbox.find(x => x.req === 'r-stuck'); return !x || x.phase !== 'sending'; })), 'the stuck outbox line is sent again');
  const agenda = await f.evaluate(() => window.__h.all('agenda'));
  ok(agenda.length >= 4 && agenda.every(a => a.rule && a.verdict && a.result), 'agenda/ has every proposal with its reason: ' + agenda.length);
  const r2 = await f.evaluate(() => window.__init.tick());
  ok(r2.length === 0, 'the next tick proposes nothing new - never twice for the same thing');
  // at night: proposed, refused by the mandate, not said, still in the agenda
  const r3 = await f.evaluate(() => { window.__testHour = 23; const now = Date.now(); lastTasks.push({ id: 't3', title: 'לילה', status: 'blocked', updatedAt: now - 3600e3 }); return window.__init.tick(); });
  heard.length = 0; await speak(1500);
  ok(r3.length === 1 && r3[0].verdict === 'deny' && r3[0].result === 'refused' && !heard.some(t => /לילה/.test(t)), 'at night: proposed, refused, not said - and kept with its reason');
  await f.evaluate(() => { window.__testHour = 11; });
  const s = await say('מה עשית לבד היום');
  ok(/היום שמתי לב ל-\d+ דברים, ועשיתי לבד \d+/.test(s), '"מה עשית לבד היום": ' + s.slice(0, 120));
  ok((await f.evaluate(() => window.__agent.ledger.ring().filter(x => x.action === 'initiative').every(x => x.mandateVerdict))), 'every initiative is in the ledger with its verdict');
  // a question of her own waits while Meir is answering another (the phone test: an old-task question took his answer)
  heard.length = 0;
  await f.evaluate(() => window.__h.set('inbox/qa1', { from: 'manager', kind: 'ask', speaker: 'המנהל', topic: 'בדיקה', text: 'ביקש טביעת אצבע?', options: ['ביקש', 'לא ביקש'], spoken: false, ts: Date.now() }));
  await speak(1500);
  await f.evaluate(() => queueLocal({ id: 'init-probe', kind: 'ask', proactive: true, speaker: 'ליבה', text: 'שמתי לב: משימה ישנה מחכה לך?', options: ['כן', 'לא'] }));
  await speak(1500);
  const early = heard.some(h => /משימה ישנה מחכה לך/.test(h)), la = await f.evaluate(() => lastAsk && lastAsk.id);
  ok(!early && la === 'qa1', 'her own question waits while Meir is answering the other - the answer stays bound to it');
  await say('לא ביקש');
  const dec = await f.evaluate(() => window.__h.all('decisions/log/items').filter(d => /טביעת אצבע/.test(d.question || '')).length);
  await speak(1500);
  ok(heard.some(h => /משימה ישנה מחכה לך/.test(h)), 'after the answer, her question is asked at once');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
