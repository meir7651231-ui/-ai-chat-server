// step distill: fourteen days of log -> candidates with evidence >= 3; only Meir's own sentences to ליבה count; one
// question a day; "כן" keeps an inferred fact, "לא" puts it away for sixty days; 2,000 turns under three seconds.
// Run: node tests/distill.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-distill-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__distill && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 10; });
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.27.0', pv: 1, caps: ['spoke'], wall: Date.now() })); await p.waitForTimeout(400);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(50); } };
  const say = async t => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(2400); return heard.join(' | '); };
  // fourteen days of log, all between nine and seven on Meir's clock
  const now = await f.evaluate(() => Date.now());
  await f.evaluate(now => {
    const at = (daysBack, h) => { const t = now - daysBack * 864e5; return t + (h - jHour(t)) * 3600e3; };
    let n = 0; const turn = (d, h, text, extra) => window.__h.set('chat/log/turns/t' + (++n), Object.assign({ from: 'user', speaker: 'מאיר', to: 'liba', text, ts: at(d, h) }, extra || {}));
    [1, 3, 5, 8].forEach(d => turn(d, 9, 'מה המצב עם הבנייה'));
    turn(2, 11, 'דיברתי עם יוסי על הגג'); turn(4, 12, 'תתקשר ליוסי מחר'); turn(6, 13, 'פגשתי את יוסי בבוקר');
    [1, 2, 3, 4, 5].forEach(d => turn(d, 14, 'דיברתי עם אבי על החשבון', { to: 'manager' }));   // meant for the manager: never evidence
    [1, 2, 3, 4, 5].forEach(d => turn(d, 15, 'מה המצב עם הגינה', { from: 'liba', speaker: 'ליבה' }));  // ליבה's own line: never evidence
    [1, 2, 3, 4, 5].forEach(d => turn(d, 16, 'מה פספסתי'));                                          // a command: not a habit
    [1, 2, 3, 4, 5, 6, 7].forEach(d => turn(d, 18, 'עדכון קצר ' + d));
    // one habit turn only in a janitor fold, as after two days it would be
    window.__h.set('fold/turns-old', { kind: 'turns', day: 'x', items: { tf1: { from: 'user', to: 'liba', text: 'מה המצב עם הבנייה', ts: at(10, 10) } } });
    [2, 4, 6].forEach((d, i) => window.__h.set('decisions/log/items/d' + i, { question: 'מה לארוחת ערב', to: 'ליבה', topic: 'ארוחת ערב', answer: 'לא', ts: at(d, 17) }));
  }, now);
  const r1 = await f.evaluate(now => window.__distill.run(now), now);
  const cands = await f.evaluate(() => window.__h.all('memory/candidates/items'));
  const byId = Object.fromEntries(cands.map(c => [c.id, c]));
  const habit = cands.find(c => c.kind === 'habit' && /הבנייה/.test(c.claim));
  ok(habit && habit.n === 5 && habit.evidence.includes('tf1'), 'habit: said five times, one of them read from a fold: ' + (habit && habit.n));
  ok(!!byId['person.יוסי'] && byId['person.יוסי'].n === 3, 'person: יוסי three times after "דיברתי עם / תתקשר ל / פגשתי את"');
  ok(cands.some(c => c.kind === 'rule' && /ארוחת ערב/.test(c.claim)), 'rule: the same answer to the same question three times');
  ok(!!byId['hours.until'] && /אחרי 19/.test(byId['hours.until'].claim), 'hours: never after seven in the evening: ' + (byId['hours.until'] || {}).claim);
  ok(!cands.some(c => /אבי|הגינה|פספסתי/.test(c.claim)), 'nothing from a sentence to the manager, from ליבה herself, or from a command');
  ok(cands.every(c => c.evidence.length >= 3), 'every candidate has three pieces of evidence or more: ' + cands.map(c => c.id + ':' + c.evidence.length).join(' '));
  await f.evaluate(now => window.__distill.run(now + 60000), now);
  const asks1 = await f.evaluate(() => window.__h.all('inbox').filter(d => /^distill-/.test(d.id)));
  ok(asks1.length === 1 && asks1[0].priority === 'morning' && asks1[0].kind === 'ask', 'one question a day, even after a second run: ' + asks1.length);
  heard.length = 0; await speak(3000);
  ok(heard.some(t => /שמתי לב ש/.test(t)), 'the question is heard: ' + heard.join(' | ').slice(0, 120));
  const yes = await say('כן');
  const k1 = asks1[0].candidate;
  const c1 = await f.evaluate(k => window.__h.all('memory/candidates/items').find(c => c.id === k), k1);
  const fact = await f.evaluate(k => window.__h.all('memory/facts/items').find(x => x.id === k), c1 && c1.factKey);
  ok(/זכרתי/.test(yes) && c1.state === 'accepted' && fact && fact.source.type === 'inferred', '"כן" keeps it as a fact, source inferred: ' + yes.slice(0, 80));
  ok(!(await f.evaluate(() => window.__h.sent.some(s => /^\[ליבה\] כן/.test(s.text || s)))), 'the "כן" stayed here - it was not sent to Claude');
  // the next day: another question, "לא", and it is not asked again inside sixty days
  await f.evaluate(now => window.__distill.run(now + 864e5), now);
  const asks2 = await f.evaluate(() => window.__h.all('inbox').filter(d => /^distill-/.test(d.id)));
  ok(asks2.length === 2 && asks2[1].candidate !== k1, 'the next day, one more question, about something else');
  heard.length = 0; await speak(3000); const no = await say('לא');
  const k2 = asks2[1].candidate;
  const c2 = await f.evaluate(k => window.__h.all('memory/candidates/items').find(c => c.id === k), k2);
  ok(/לא אזכור/.test(no) && c2.state === 'rejected', '"לא" puts it away: ' + no.slice(0, 60));
  for (let d = 2; d < 9; d++) await f.evaluate(([now, d]) => window.__distill.run(now + d * 864e5), [now, d]);
  const asks3 = await f.evaluate(() => window.__h.all('inbox').filter(d => /^distill-/.test(d.id)));
  ok(asks3.length <= asks2.length + 3 && !asks3.some(a => a.candidate === k2 && a.id !== asks2[1].id) && !asks3.some(a => a.candidate === k1 && a.id !== asks1[0].id), 'unanswered questions do not pile up, and neither the kept nor the rejected one is asked again: ' + asks3.map(a => a.candidate).join(','));
  // "מה למדנו היום"
  const said = await say('מה למדנו היום');
  ok(/מצאתי|כבר שמרתי/.test(said), '"מה למדנו היום" answers: ' + said.slice(0, 120));
  // performance: two thousand turns
  await f.evaluate(now => { for (let i = 0; i < 2000; i++) window.__h.set('chat/log/turns/p' + i, { from: 'user', to: 'liba', text: 'משפט מספר ' + (i % 300) + ' על ' + (i % 7), ts: now + 7 * 864e5 - (i % 6) * 864e5 - 3600e3 }); }, now);
  const r2 = await f.evaluate(now => window.__distill.run(now + 7 * 864e5), now);
  ok(r2 && r2.ms < 3000 && r2.turns >= 2000, 'distilling ' + (r2 && r2.turns) + ' turns took ' + (r2 && r2.ms) + ' ms (under 3,000)');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
