// step wal-queue: kill the page at random moments inside pump / deliver, again and again, with a database that
// survives the reload (as the real one does) and a Claude connection that fails a third of the time.
// Counted at the end:  double readings (a message spoken to the end twice), lost messages (never acked),
// and duplicate sends to Claude (one sentence delivered twice).   CHAOS=300 node tests/wal.chaos.js
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), os = require('os');
const ROUNDS = +process.env.CHAOS || 60;
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  let STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  // the database and the Claude inbox survive the reload; delivery fails on purpose while __flaky is on
  STUB = STUB.replace('const docs=new Map()', "const docs=new Map(JSON.parse(localStorage.getItem('__db')||'[]'))")
    .replace('function notify(path){', "function notify(path){localStorage.setItem('__db',JSON.stringify([...docs]));")
    .replace("return 'available';}", "return (localStorage.getItem('__flaky')==='all'||(localStorage.getItem('__flaky')==='1'&&Math.random()<0.33))?'unavailable':'available';}")
    .replace('sendToClaude:async o=>{sentRaw.push(o.text);', "sendToClaude:async o=>{sentRaw.push(o.text);const q=JSON.parse(localStorage.getItem('__claude')||'[]');q.push(o.text);localStorage.setItem('__claude',JSON.stringify(q));");
  // every injection must land: a replace that stops matching silently turns the chaos off (it did once - the flaky network)
  if (!/__claude/.test(STUB) || !/__db/.test(STUB) || !/__flaky/.test(STUB)) throw new Error('chaos: the stub could not be made persistent/flaky - the harness is out of date');
  const page = fs.readFileSync(process.env.PAGE_FILE || path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-chaos-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + page + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});
    window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');
    window.kill=()=>{const f=document.getElementById('f');f.src='inner.html?'+Math.random();};</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage();
  await p.addInitScript(STUB);
  await p.goto('file://' + tmp + '/host.html');
  const frame = () => p.frames().find(f => f.url().includes('inner.html'));
  const ready = async () => { for (let i = 0; i < 50; i++) { const f = frame(); try { if (f && await f.evaluate(() => !!(window.__h && window.claude))) return f } catch {} await p.waitForTimeout(100) } throw new Error('frame did not boot') };
  // the bubble says hello when the page has loaded; a fixed 250 ms guess lost it under load (the page ended OFFLINE with
  // an empty transition log, and its queue never drained). Say it until the page is really armed, like a real handshake.
  const hello = async () => { for (let i = 0; i < 40; i++) { const f = await ready(); await p.waitForTimeout(250);
    await p.evaluate(() => window.app({ liba: 'hello', ver: '3.20.0', pv: 1, caps: ['spoke', 'beat', 'trace', 'proto', 'clock', 'state'], wall: Date.now() }));
    await p.waitForTimeout(150); try { if (await f.evaluate(() => window.__kernel && window.__kernel.state() !== 'OFFLINE')) return } catch {} } throw new Error('the page never took hello') };
  await hello(); await (await ready()).evaluate(() => localStorage.setItem('__flaky', '1'));
  const WIPE = process.env.WIPE === '1'; let wiped = 0;
  let load = 0, n = 0; const completed = {}, sentInputs = [];
  const pump = async (ms) => { // answer every say with spoke after a random speaking time - unless the page dies first
    const end = Date.now() + ms;
    while (Date.now() < end) {
      const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say' && x.id) { const my = load, id = x.id, text = x.text || '';
        setTimeout(async () => { if (my !== load) return; try { await p.evaluate(id => window.app({ liba: 'spoke', id }), id); completed[text] = (completed[text] || 0) + 1 } catch {} }, 200 + Math.random() * 1200) }
      await p.waitForTimeout(100);
    }
  };
  for (let r = 0; r < ROUNDS; r++) {
    const f = await ready();
    const k = r % 3;
    if (k === 0) { n++; await f.evaluate(([i]) => window.__h.set('inbox/c' + i, { text: 'הודעת-כאוס-' + i, kind: 'say', from: 'manager', ts: Date.now() }), [n]) }
    if (k === 1) { n++; const t = 'משפט-כאוס-' + n; sentInputs.push(t); await p.evaluate(t => window.app({ liba: 'input', text: t, source: 'voice' }), t) }
    // a sentence waits 1.5 s for a tap before it is sent; kill it while it is inside send and its retries
    // the window that loses a sentence: the first attempt failed and the page dies during the retry wait.
    // A sentence round always kills 1.7-4.2 s in - inside send() and its retries; other rounds die half the time.
    await pump(k === 1 ? 1700 + Math.random() * 2500 : 300 + Math.random() * 2500);
    if (k === 1 || Math.random() < 0.5) { load++; await p.evaluate(() => window.kill()); await hello() }
    // outbox-keys: WIPE=1 - halfway through, the page's local outbox is erased while sentences are still waiting,
    // then the page dies. Only the request documents in the database can bring those sentences back.
    if (WIPE && r === Math.floor(ROUNDS / 2)) { let f2 = await ready(); await f2.evaluate(() => localStorage.setItem('__flaky', 'all'));
      for (let j = 0; j < 3; j++) { n++; const t = 'משפט-מחוק-' + n; sentInputs.push(t); await p.evaluate(t => window.app({ liba: 'input', text: t, source: 'voice' }), t); await pump(3500); }
      f2 = await ready(); wiped = await f2.evaluate(() => { const k = Object.keys(localStorage).filter(x => /^liba\.outbox/.test(x)); const n = k.reduce((a, x) => a + JSON.parse(localStorage.getItem(x) || '[]').length, 0); k.forEach(x => localStorage.removeItem(x)); return n; });
      load++; await p.evaluate(() => window.kill()); await hello(); await (await ready()).evaluate(() => localStorage.setItem('__flaky', '1')) }
  }
  // settle: no more deaths, no more failures - whatever is pending must now drain exactly once
  await (await ready()).evaluate(() => localStorage.setItem('__flaky', '0'));
  load++; await p.evaluate(() => window.kill()); await hello();
  // drain: wait until nothing is pending (or 90 s) - a backlog of N messages legitimately takes a while
  const t0 = Date.now(); for (let i = 0; i < 45; i++) { await pump(2000); const left = await (await ready()).evaluate(ins => { const d = [...window.__h.docs.entries()]; const cl = JSON.parse(localStorage.getItem('__claude') || '[]');
    const inb = d.filter(([k, v]) => /^inbox\/c\d+$/.test(k) && !v.spoken && !v.expired).length;
    const acc = ins.filter(t => d.some(([k, v]) => /^req\//.test(k) && v.text === t)); const out = acc.filter(t => !cl.some(c => c.includes(t + ' ⟦'))).length;
    return inb + out }, sentInputs); if (!left) break }
  console.log('drained in ' + Math.round((Date.now() - t0) / 1000) + ' s');
  const f = await ready();
  const docs = await f.evaluate(() => [...window.__h.docs.entries()]);
  const inbox = docs.filter(([k]) => /^inbox\/c\d+$/.test(k)).map(([k, v]) => ({ k, v }));
  const reqs = docs.filter(([k]) => /^req\//.test(k)).map(([, v]) => v);
  const claude = await f.evaluate(() => JSON.parse(localStorage.getItem('__claude') || '[]'));
  const lost = inbox.filter(x => !x.v.spoken && !x.v.expired).map(x => x.k);
  const doubles = Object.entries(completed).filter(([t, c]) => /הודעת-כאוס/.test(t) && c > 1).map(([t, c]) => t.slice(-20) + '×' + c);
  const accepted = sentInputs.filter(t => reqs.some(r => r.text === t));
  const count = t => claude.filter(c => c.includes(t + ' ⟦')).length;
  const dupSends = accepted.filter(t => count(t) > 1).map(t => t + '×' + count(t));
  const undelivered = accepted.filter(t => count(t) === 0);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  console.log(`chaos: ${ROUNDS} rounds, ${load} page deaths, ${inbox.length} inbox messages, ${accepted.length}/${sentInputs.length} sentences accepted by the page`);
  ok(lost.length === 0, 'no inbox message is lost: ' + lost.join(','));
  if (WIPE) ok(wiped > 0, 'wipe: the local outbox was erased with ' + wiped + ' sentences still in it - and the checks below say none was lost');
  ok(doubles.length === 0, 'no message is spoken to the end twice: ' + doubles.join(','));
  ok(dupSends.length === 0, 'no sentence reaches Claude twice: ' + dupSends.join(','));
  ok(undelivered.length === 0, 'every sentence the page accepted reached Claude: ' + undelivered.join(','));
  await b.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
