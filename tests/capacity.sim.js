// step janitor-rollup: sixty days of channel traffic against the page's own janitor, in about a minute.
// Traffic per day: 40 turns, 60 inbox messages (read), 12 tasks (done a day later), 8 decisions, 40 requests,
// 3 session updates, 4 gallery items, a crash every third day. After each day the janitor sweeps the way the
// scheduler would (every six hours = up to four capped sweeps). The count at every day boundary must stay small
// and flat, and nothing may vanish: every document that left must be inside a fold document.
// Run: node tests/capacity.sim.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-cap-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', '<!doctype html><html><body><iframe id=f src="inner.html"></iframe></body></html>');
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__janitor && window.claude, null, { timeout: 8000 });
  await p.waitForTimeout(800);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };

  const res = await f.evaluate(async () => {
    const D = 864e5, base = Date.UTC(2027, 0, 1, 4), docs = window.__h.docs, born = new Set(); let seq = 0;
    const put = (p, d) => { docs.set(p, d); born.add(p); };
    const count = () => { const per = {}; let all = 0; for (const k of docs.keys()) { const c = k.split('/').slice(0, -1).join('/'); per[c] = (per[c] || 0) + 1; all++; } return { all, per }; };
    const days = [];
    for (let d = 0; d < 60; d++) {
      const t0 = base + d * D;
      for (let i = 0; i < 40; i++) put('chat/log/turns/t' + (++seq), { from: 'user', text: 'תור ' + seq, ts: t0 + i * 6e5 });
      for (let i = 0; i < 60; i++) put('inbox/m' + (++seq), { from: 'liba', kind: 'say', text: 'הודעה ' + seq, spoken: true, spokenAt: t0 + i * 4e5 + 1e4, ts: t0 + i * 4e5 });
      for (let i = 0; i < 12; i++) put('tasks/k' + (++seq), { title: 'משימה ' + seq, status: 'running', updatedAt: t0 + i * 3e6 });
      for (const [k, v] of docs) if (k.startsWith('tasks/') && v.status === 'running' && v.updatedAt < t0 - D / 2) { v.status = 'done'; v.updatedAt = t0; }
      for (let i = 0; i < 8; i++) put('decisions/log/items/x' + (++seq), { question: 'ש' + seq, answer: 'כן', ts: t0 + i * 7e6 });
      for (let i = 0; i < 40; i++) put('req/r' + (++seq), { text: 'בקשה ' + seq, state: 'answered', askedAt: t0 + i * 6e5 });
      for (let i = 0; i < 3; i++) put('sessions/s' + ((d * 3 + i) % 40), { title: 'שיחה', status: 'idle', updatedAt: t0 + i * 1e6 });
      for (let i = 0; i < 4; i++) put('gallery/g' + (++seq), { title: 'דבר ' + seq, ts: t0 + i * 1e7 });
      if (d % 3 === 0) put('crashes/c' + (++seq), { text: 'קריסה', ts: t0 + 5e6 });
      const end = t0 + D - 1; let sweeps = 0, ms = 0, more = true;
      while (more && sweeps < 4) { const r = await window.__janitor.sweep(end); sweeps++; ms = Math.max(ms, r.ms); more = r.more; }
      const c = count(); days.push({ d: d + 1, all: c.all, inbox: c.per['inbox'] || 0, folds: Object.keys(c.per).includes('fold') ? c.per['fold'] : 0, sweeps, ms });
    }
    // nothing vanished: every document ever written is either still live or inside a fold document
    const folded = new Set(); for (const [k, v] of docs) if (k.startsWith('fold/')) for (const id of Object.keys(v.items || {})) folded.add(id);
    const lostIds = [...born].filter(p => !docs.has(p) && !folded.has(p.split('/').pop()));
    const turnFolds = [...docs.keys()].filter(k => /^fold\/turns-/.test(k)).length;
    return { days, lost: lostIds.length, lostSample: lostIds.slice(0, 5), born: born.size, turnFolds };
  });
  res.days.forEach(x => console.log(`  day ${String(x.d).padStart(2)}: ${String(x.all).padStart(5)} docs · inbox ${x.inbox} · folds ${x.folds} · sweeps ${x.sweeps} · slowest ${x.ms}ms`));
  console.log(`  written in 60 days without the janitor would be: ${res.born} documents`);
  const max = Math.max(...res.days.map(x => x.all)), d40 = res.days[39].all, d60 = res.days[59].all;
  ok(max < 1500, 'capacity: the count stays under 1,500 at every day boundary: max ' + max);
  ok(d60 <= d40 * 1.05, 'capacity: flat once the month roll-up starts (day 40 ' + d40 + ', day 60 ' + d60 + ')');
  ok(Math.max(...res.days.map(x => x.inbox)) <= 120, 'capacity: the inbox never holds more than 120');
  ok(res.turnFolds >= 30 && res.turnFolds <= 40, 'capacity: turns keep one fold per recent day plus one per month: ' + res.turnFolds);
  ok(res.lost === 0, 'capacity: nothing vanished - every document that left is inside a fold: ' + res.lost + ' ' + res.lostSample.join(','));

  // a backlog: 4,000 old inbox messages, 90% read. Capped sweeps drain it, each one fast, and no unread one is touched
  const bl = await f.evaluate(async () => {
    const docs = window.__h.docs; for (const k of [...docs.keys()]) docs.delete(k);
    const now = Date.UTC(2027, 3, 1); for (let i = 0; i < 4000; i++) docs.set('inbox/b' + i, { kind: 'say', text: 'ישן ' + i, spoken: i % 10 !== 0, ts: now - 5 * 864e5 + i });
    let sweeps = 0, slowest = 0, r; do { r = await window.__janitor.sweep(now); sweeps++; slowest = Math.max(slowest, r.ms); } while (r.more && sweeps < 20);
    const left = [...docs.keys()].filter(k => k.startsWith('inbox/')); const unread = left.filter(k => docs.get(k).spoken === false).length;
    return { sweeps, slowest, left: left.length, unread };
  });
  ok(bl.left === 400 && bl.unread === 400, 'backlog: 4,000 → 400 left, exactly the unread ones: ' + JSON.stringify(bl));
  ok(bl.slowest < 20000, 'backlog: every capped sweep ends under 20 s: slowest ' + bl.slowest + 'ms over ' + bl.sweeps + ' sweeps');

  // a flood: one writer drops 1,800 telemetry rows in a day. Telemetry over its cap is folded and trimmed (a few capped
  // sweeps), the writer is named in ledger/<day>.offenders and said aloud once; a normal writer is not named.
  const fl = await f.evaluate(async () => {
    const docs = window.__h.docs; for (const k of [...docs.keys()]) docs.delete(k);
    const now = Date.now(); for (let i = 0; i < 1800; i++) docs.set('telemetry/events/items/f' + i, { code: 'X', ts: now - 3600e3 + i, by: 'session_flood' });
    for (let i = 0; i < 50; i++) docs.set('gallery/g' + i, { title: 'x', ts: now - i, by: 'p-normal' });
    let sweeps = 0, r; do { r = await window.__janitor.sweep(now); sweeps++; } while (r.more && sweeps < 10);
    const left = [...docs.keys()].filter(k => k.startsWith('telemetry/')).length;
    const lg = docs.get('ledger/' + new Date(now).toLocaleDateString('sv-SE', { timeZone: 'Asia/Jerusalem' })) || {};
    const folded = [...docs.entries()].filter(([k]) => /^fold\/items-/.test(k)).reduce((a, [, v]) => a + Object.keys(v.items || {}).length, 0);
    return { sweeps, left, folded, off: Object.keys(lg.offenders || {}), said: inboxQ.filter(x => /^flood-/.test(x.id)).map(x => x.text) };
  });
  const TCAP = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'channel-budget.json'), 'utf8')).collections['telemetry/events/items'].cap;
  ok(fl.left <= TCAP && fl.folded === 1800 - fl.left, 'flood: telemetry trimmed back to its cap of ' + TCAP + ', every trimmed row folded: ' + JSON.stringify({ left: fl.left, folded: fl.folded, sweeps: fl.sweeps }));
  ok(fl.off.length === 1 && fl.off[0] === 'session_flood', 'flood: the writer is named in ledger/<day>.offenders, the normal one is not: ' + fl.off.join(','));
  ok(fl.said.length === 1 && /session_flood/.test(fl.said[0]) && /1800|18\d\d|\d{3,4} מסמכים/.test(fl.said[0]), 'flood: said aloud once, with the name: ' + fl.said.join(' | '));
  // one holder at a time: a second tab asking for the lease while it is held gets no
  const lease = await f.evaluate(async () => { const a = await window.claude.use('db'); const r1 = await a.doc('channel/janitor').acquire({ holder: 'tab-1', ttlMs: 60000 }); const r2 = await a.doc('channel/janitor').acquire({ holder: 'tab-2', ttlMs: 60000 }); return [r1.acquired, r2.acquired]; });
  ok(lease[0] === true && lease[1] === false, 'lease: a second tab does not sweep while the first holds the lease: ' + JSON.stringify(lease));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
