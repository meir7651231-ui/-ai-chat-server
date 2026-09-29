// step mem-brief: does what Meir said once come back a week later, when it matters? Every seed in
// tests/memory-recall.jsonl is said once ("תזכור ש…"), its stamps are moved seven days back, and each of its two probes
// (sharing at most one content word with the seed) is checked in three stages, each with its own line:
//   typed     - the parser understood it (anything but a note; notes are counted, not expected to type)
//   retrieved - the probe's brief contains the fact
//   briefed   - it reached Claude: the sent comment carries it after the sentence, before the ⟦#id⟧ mark
// Thresholds: typed >= 80% of typable seeds, retrieved >= 85% of probes, briefed >= 95% of retrieved.
// Run: node tests/recall7.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const rows = fs.readFileSync(path.join(__dirname, 'memory-recall.jsonl'), 'utf8').trim().split('\n').map(l => JSON.parse(l));
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-recall-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', '<!doctype html><html><body><iframe id=f src="inner.html"></iframe></body></html>');
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__mem && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  const r = await f.evaluate(async rows => {
    const out = { typable: 0, typed: 0, notes: 0, probes: 0, retrieved: 0, briefed: 0, missR: [], missB: [] };
    for (const x of rows) { const pf = window.__mem.parse(x.seed); if (x.kind !== 'note') { out.typable++; if (pf.kind !== 'note') out.typed++; } else out.notes++;
      await window.__mem.put(pf, { type: 'said' }); }
    // a week passes
    for (const [k, v] of window.__h.docs) if (k.startsWith('memory/facts/items/')) { v.updatedAt -= 7 * 864e5; v.ts -= 7 * 864e5; }
    for (const x of rows) for (const q of x.probes) { out.probes++;
      const blk = await brief(q); if (blk.indexOf(x.seed.replace(/^ש/, '')) >= 0 || (blk && blk.indexOf(x.key) >= 0 && blk.indexOf(x.seed.split(' ').slice(-1)[0]) >= 0)) out.retrieved++; else { out.missR.push(q); continue; }
      const before = window.__h.sentRaw.length; await send({ text: q, noIntent: false });
      const sent = window.__h.sentRaw.slice(before).join('\n'); if (sent.indexOf('[הקשר#') > 0 && sent.indexOf(x.seed.replace(/^ש/, '')) > 0 && / ⟦#[0-9a-z]+⟧$/.test(sent) && /^\[ליבה/.test(sent)) out.briefed++; else out.missB.push(q); }
    return out; }, rows);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const pct = (a, b) => Math.round(100 * a / Math.max(1, b));
  ok(pct(r.typed, r.typable) >= 80, `typed: ${r.typed}/${r.typable} typable seeds understood (${pct(r.typed, r.typable)}%) · ${r.notes} kept as notes`);
  ok(pct(r.retrieved, r.probes) >= 85, `retrieved: ${r.retrieved}/${r.probes} probes brought their fact back a week later (${pct(r.retrieved, r.probes)}%)` + (r.missR.length ? ' - missed: ' + r.missR.slice(0, 4).join(' / ') : ''));
  ok(pct(r.briefed, r.retrieved) >= 95, `briefed: ${r.briefed}/${r.retrieved} reached Claude after the sentence, tag first and ⟦#id⟧ last (${pct(r.briefed, r.retrieved)}%)` + (r.missB.length ? ' - missed: ' + r.missB.slice(0, 3).join(' / ') : ''));
  console.log(`  end to end: ${pct(r.briefed, r.probes)}% · corpus: ${rows.length} seeds, ${r.probes} probes (hand-written; the plan's 60 mined from the real log are not in the repo)`);
  ok(!errs.length, 'no page error: ' + errs.slice(0, 2).join(' | '));
  await b.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
