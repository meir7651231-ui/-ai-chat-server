// step forget: "תשכח הכול על X" leaves 0 references in five collections and the folds, counted aloud first when it is more
// than five; "תחזיר את מה ששכחת" restores 100% within a day; of 30 facts ten of which expired, 0 expired reach brief();
// a sensitive fact never reaches it; the sweep archives exactly the stale ones, 5,000 facts under five seconds.
// Run: node tests/forget.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-forget-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__forget && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); });
  await p.evaluate(() => window.app({ liba: 'hello', ver: '3.27.0', pv: 1, caps: ['spoke'], wall: Date.now() })); await p.waitForTimeout(400);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(50); } };
  const say = async t => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(2600); return heard.join(' | '); };
  // everything about דני, in every place it can be - and one thing about יוסי that must survive
  await f.evaluate(async () => {
    for (const t of ['דני הוא הבן שלי', 'דני מתגייס באוגוסט', 'יש לי מתנה לדני', 'יוסי הוא השכן']) await window.__mem.put(window.__mem.parse(t), { type: 'said' });
    await window.__people.upsert('דני', { relation: 'הבן' });
    window.__h.set('memory/candidates/items/person.דני', { kind: 'person', claim: 'אתה מדבר הרבה עם דני', evidence: ['a', 'b', 'c'], n: 3, conf: 0.8, state: 'open', proposedFact: { subject: 'דני', value: 'x' } });
    const now = Date.now();
    ['דיברתי עם דני על הצבא', 'תזכיר לי לקנות לדני נעליים', 'דני מגיע בשבת'].forEach((t, i) => window.__h.set('chat/log/turns/tt' + i, { from: 'user', to: 'liba', text: t, ts: now - i * 3600e3 }));
    window.__h.set('chat/log/turns/tt9', { from: 'user', to: 'liba', text: 'מה המצב עם הבנייה', ts: now });
    window.__h.set('decisions/log/items/dd1', { question: 'מה לקנות', topic: 'מתנה', answer: 'נעליים לדני', ts: now });
    window.__h.set('fold/turns-2026-09-01', { kind: 'turns', day: '2026-09-01', items: { old1: { from: 'user', text: 'דני חזר מהטיול', ts: now - 30 * 864e5 }, old2: { from: 'user', text: 'שלום', ts: now - 30 * 864e5 } } });
  });
  const refs = () => f.evaluate(() => { const has = x => JSON.stringify(x).indexOf('דני') >= 0; const H = window.__h;
    return { facts: H.all('memory/facts/items').filter(x => x.state !== 'tomb' && has(x)).length, people: H.all('memory/people/items').filter(x => x.state !== 'tomb' && has(x)).length,
      cands: H.all('memory/candidates/items').filter(x => x.state !== 'tomb' && has(x)).length, turns: H.all('chat/log/turns').filter(has).length, decisions: H.all('decisions/log/items').filter(has).length,
      folds: H.all('fold').reduce((a, d) => a + Object.values(d.items || {}).filter(has).length, 0), yossi: H.all('memory/facts/items').filter(x => x.state === 'live' && /יוסי/.test(x.raw)).length,
      bench: H.all('chat/log/turns').filter(x => /הבנייה/.test(x.text)).length, fold2: H.all('fold').reduce((a, d) => a + ('old2' in (d.items || {}) ? 1 : 0), 0) }; });
  const before = await refs(); const total = n => n.facts + n.people + n.cands + n.turns + n.decisions + n.folds;
  const ask = await say('תשכח הכול על דני');
  ok(/על דני יש \d+ פריטים/.test(ask) && /כן או לא/.test(ask), 'more than five: counted aloud first, and waits: ' + ask.slice(0, 160));
  const yes = await say('כן');
  const after = await refs();
  ok(/שכחתי הכול על דני/.test(yes), 'then forgets: ' + yes.slice(0, 140));
  ok(total(after) === 0, `0 references left in facts, people, candidates, the log, the decisions and the folds (before ${total(before)}): ` + JSON.stringify(after));
  ok(after.yossi === 1 && after.bench === 1 && after.fold2 === 1, 'nothing else touched: יוסי, the other sentence, the other fold item');
  ok((await f.evaluate(async () => (await brief('מה עם דני והצבא')).indexOf('דני') < 0)), 'and brief() no longer knows it');
  const back = await say('תחזיר את מה ששכחת');
  const restored = await refs();
  ok(/החזרתי/.test(back) && JSON.stringify(restored) === JSON.stringify(before), '"תחזיר את מה ששכחת" restores 100%: ' + JSON.stringify(restored));
  const again = await say('תחזיר את מה ששכחת');
  ok(/אין מה להחזיר/.test(again), 'and only once');
  // a day later the batch is gone for good: undo has nothing, and the batch itself (the only copy) is deleted
  await say('תשכח הכול על דני'); await say('כן');
  const purge = await f.evaluate(async () => { const r = await window.__forget.sweep(Date.now() + 2 * 864e5); return { r, left: window.__h.all('memory/forgets/items').length, undo: await window.__forget.undo(Date.now() + 2 * 864e5) }; });
  ok(purge.left === 0 && purge.undo === null, 'after a day the batch is purged - forgotten for real: ' + JSON.stringify(purge.r));
  // expiry
  const ex = await f.evaluate(() => { const n = new Date(2026, 9, 5, 10).getTime(), X = window.__forget.expiry, D = (y, m, d) => { const t = new Date(y, m, d); t.setHours(23, 59, 59, 0); return t.getTime() + 864e5; };
    return [X('אני בחו"ל עד ה-12', n) === D(2026, 9, 12), X('הפגישה ב-3 בנובמבר', n) === D(2026, 10, 3), X('התור לרופא מחר', n) === D(2026, 9, 6), X('יש לי כלב', n) === 0, X('אני בחו"ל עד ה-2', n) === D(2026, 10, 2)]; });
  ok(ex.every(Boolean), 'a fact with a date expires the day after it: ' + JSON.stringify(ex));
  const brief30 = await f.evaluate(async () => { const M = window.__mem;
    for (let i = 0; i < 20; i++) await M.put(M.parse('יש לי מפתח מספר ' + i + ' לארון'), { type: 'said' });
    for (let i = 0; i < 10; i++) await M.put(M.parse('המפתח לארון אצל השכן עד מחר ' + i), { type: 'said' });
    for (const [k, v] of window.__h.docs) if (k.startsWith('memory/facts/items/') && v.expiresAt) v.expiresAt = Date.now() - 1000;  // two days pass
    const out = await brief('איפה המפתח לארון'); return { stale: (out.match(/עד מחר/g) || []).length, has: out.length > 0 }; });
  ok(brief30.has && brief30.stale === 0, 'of 30 facts, 10 expired: 0 expired in brief(): ' + JSON.stringify(brief30));
  const sens = await f.evaluate(async () => { await window.__mem.put(window.__mem.parse('יש לי סיסמה לוויפי 4455'), { type: 'said' }); const d = window.__h.all('memory/facts/items').find(x => /4455/.test(x.raw)); return { s: d.sens, inBrief: (await brief('מה הסיסמה לוויפי')).indexOf('4455') >= 0 }; });
  ok(sens.s === 3 && !sens.inBrief, 'a password is sensitivity 3 and never reaches a brief: ' + JSON.stringify(sens));
  // the sweep: 5,000 facts
  const sw = await f.evaluate(async () => { const now = Date.now(), old = now - 200 * 864e5; let want = 0;
    for (let i = 0; i < 5000; i++) { const stale = i % 10 === 0, lowOld = i % 10 === 1, oldSure = i % 10 === 2; if (lowOld) want++;
      window.__h.set('memory/facts/items/s' + i, { subject: 'x', predicate: 'y', value: 'v' + i, raw: 'עובדה ' + i, kind: 'fact', state: 'live', conf: lowOld ? 0.3 : 0.8, updatedAt: (lowOld || oldSure) ? old : now, lastUsed: (lowOld || oldSure) ? old : now, expiresAt: stale ? now - 1000 : 0 }); }
    const r = await window.__forget.sweep(now); const H = window.__h.all('memory/facts/items').filter(x => /^s\d/.test(x.id));
    return { r, want, wrong: H.filter(x => x.state === 'archive' && !(+x.id.slice(1) % 10 < 2)).length, live: H.filter(x => x.state === 'live').length }; });
  ok(sw.r.ms < 5000 && sw.r.decayed === sw.want && sw.r.expired >= 500 && sw.wrong === 0, `sweep of ${sw.r.seen} facts in ${sw.r.ms} ms: ${sw.r.expired} expired, ${sw.r.decayed} unused for half a year at low confidence, 0 archived by mistake (${sw.wrong})`);
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
