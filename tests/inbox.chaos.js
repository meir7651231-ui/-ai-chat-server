// step inbox-lease: two instances of the page (the phone and a desktop tab) on one shared database, 200 messages,
// 40 page deaths at random moments. Every message must be spoken to the end exactly once - 0 lost, 0 twice.
// The two frames are two devices: each is named (window.__LIBA_INSTANCE), so each keeps its own id and local stores.
// Run: node tests/inbox.chaos.js      (N=200 KILLS=40 by default)
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const N = +(process.env.N || 200), KILLS = +(process.env.KILLS || 40);
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  let STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  // one database for both frames: the maps live on the host page (same origin, so the frames can reach it)
  const shared = STUB.replace('const docs=new Map(), colSubs=new Map(), docSubs=new Map();', 'const SH=window.top.__dbShared;const docs=SH.docs, colSubs=SH.colSubs, docSubs=SH.docSubs;')
    .replace('const leases=new Map();', 'const leases=window.top.__dbShared.leases;');
  if (shared === STUB || !/SH\.leases|__dbShared\.leases/.test(shared)) throw new Error('inbox chaos: the stub could not be shared - the harness is out of date');
  const page = fs.readFileSync(process.env.PAGE_FILE || path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const host = `<!doctype html><html><body><script>window.__dbShared={docs:new Map(),colSubs:new Map(),docSubs:new Map(),leases:new Map()};
    window.msgs=[];window.addEventListener('message',e=>{const fa=document.getElementById('a'),fb=document.getElementById('b');
      const from=fa&&e.source===fa.contentWindow?'a':fb&&e.source===fb.contentWindow?'b':'?';window.msgs.push(Object.assign({},e.data,{src:from}));});
    window.app=(who,d)=>document.getElementById(who).contentWindow.postMessage(d,'*');
    window.kill=who=>{const f=document.getElementById(who);f.src='inner.html?'+Date.now();};</script>
    <iframe id=a name=a src="inner.html"></iframe><iframe id=b name=b src="inner.html"></iframe></body></html>`;
  const inner = '<!doctype html><html><head><meta charset="utf-8"></head><body>' + page + '</body></html>';
  const b = await chromium.launch(); const ctx = await b.newContext(); const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await ctx.route('http://liba.test/**', r => { const u = new URL(r.request().url()); r.fulfill({ contentType: 'text/html; charset=utf-8', body: u.pathname.startsWith('/inner') ? inner : host }); });
  await ctx.addInitScript('if (window !== window.top) window.__LIBA_INSTANCE = window.name;');
  await ctx.addInitScript(shared);
  await p.goto('http://liba.test/host.html');
  const frame = who => p.frames().find(f => f.name() === who);
  // the phone of each instance remembers what it finished speaking (by message id) and says so in hello - like the bubble
  let phoneReady = false; const spokeBy = {};
  const load = { a: 0, b: 0 }, completed = {}, phoneDone = { a: [], b: [] }, inflight = { a: 0, b: 0 };
  /* the phone keeps answering while a dead instance comes back - a real bubble never stops beating because the other
     device reloaded; before, a slow reload starved the live instance of 'spoke' past its six-second beat limit, it
     retried as it should, and the late answer counted the message twice */
  const hello = async who => { for (let i = 0; i < 60; i++) { if (phoneReady) await answer(150); else await p.waitForTimeout(150); const f = frame(who);
      try { if (f && await f.evaluate(() => !!(window.__h && window.__kernel))) { await p.evaluate(w => window.app(w[0], { liba: 'hello', ver: '3.26.0', pv: 1, caps: ['spoke', 'beat', 'trace', 'proto', 'clock', 'state'], wall: Date.now(), spoken: w[1] }), [who, phoneDone[who].slice(-40).join(',')]);
        await p.waitForTimeout(120); if (await f.evaluate(() => window.__kernel.state() !== 'OFFLINE')) return; } } catch {} } throw new Error('instance ' + who + ' never took hello'); };
  await hello('a'); await hello('b');
  // the phone: every say is spoken for 100-600 ms and reported, unless that instance died first
  const answer = async ms => { const end = Date.now() + ms;
    while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say' && x.id && (x.src === 'a' || x.src === 'b')) { const who = x.src, my = load[who], id = x.id, t = x.text || '', mid = x.mid || '';
        /* the real bubble says "still speaking" every two seconds; without it a slow CI runner hit the page's six-second
           limit, the page retried (correctly) and the late answer counted the message twice */
        const beat = setInterval(() => { if (my !== load[who]) { clearInterval(beat); return; } p.evaluate(([w, id]) => window.app(w, { liba: 'speaking', id }), [who, id]).catch(() => {}); }, 1000);
        setTimeout(async () => { clearInterval(beat); if (my !== load[who]) return; inflight[who]++; if (mid) phoneDone[who].push(mid); try { await p.evaluate(([w, id]) => window.app(w, { liba: 'spoke', id }), [who, id]); const k = (/חדש-(\d+)/.exec(t) || [])[1]; if (k) { completed[k] = (completed[k] || 0) + 1; spokeBy[who] = (spokeBy[who] || 0) + 1; } } catch {} finally { inflight[who]-- } }, 100 + Math.random() * 500); }
      await p.waitForTimeout(80); } };
  // writes go through a live frame's stub so subscriptions fire
  const write = async i => { for (const who of ['a', 'b']) { try { await frame(who).evaluate(i => window.__h.set('inbox/n' + i, { from: 'liba', kind: 'say', speaker: 'ליבה', text: 'חדש-' + i, spoken: false, ts: Date.now() }), i); return; } catch {} } };
  phoneReady = true;
  const killAt = new Set(); while (killAt.size < KILLS) killAt.add(Math.floor(Math.random() * N));
  const t0 = Date.now(); let kills = 0;
  for (let i = 0; i < N; i++) {
    await write(i);
    await answer(120 + Math.random() * 300);
    if (killAt.has(i)) { const who = Math.random() < 0.5 ? 'a' : 'b'; while (inflight[who] > 0) await p.waitForTimeout(20); load[who]++; kills++; await p.evaluate(w => window.kill(w), who); await hello(who); }
  }
  // drain: no more deaths - wait until every message is acked (or 5 minutes)
  for (let i = 0; i < 150; i++) { await answer(2000); const left = await frame('a').evaluate(() => [...window.__h.docs.entries()].filter(([k, v]) => /^inbox\/n\d+$/.test(k) && !v.spoken && !v.failed).length); if (!left) break; }
  const docs = await frame('a').evaluate(() => [...window.__h.docs.entries()].filter(([k]) => /^inbox\/n\d+$/.test(k)).map(([k, v]) => ({ k, spoken: !!v.spoken, failed: !!v.failed, by: v.delivery && v.delivery.by })));
  await answer(1500);
  const lost = docs.filter(d => !d.spoken).map(d => d.k), twice = Object.entries(completed).filter(([, c]) => c > 1).map(([k, c]) => k + '×' + c);
  const never = [...Array(N).keys()].filter(i => !completed[i]);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  console.log(`inbox chaos: ${N} messages, ${kills} page deaths across two instances, ${Math.round((Date.now() - t0) / 1000)} s`);
  ok(lost.length === 0, 'no message lost - every one acked spoken: ' + lost.slice(0, 8).join(','));
  ok(never.length === 0, 'every message was spoken to the end at least once: ' + never.slice(0, 8).join(','));
  ok(twice.length === 0, 'no message spoken to the end twice: ' + twice.slice(0, 8).join(','));
  /* who really spoke them, counted at the phone - the final delivery.by is only the last writer, and a hello from the other
     device can overwrite it, so it said 1 when both had worked */
  ok(spokeBy.a > 0 && spokeBy.b > 0, 'both instances spoke messages (the work was really shared): a ' + (spokeBy.a || 0) + ', b ' + (spokeBy.b || 0));
  ok(Date.now() - t0 < 10 * 60 * 1000, 'finished within ten minutes');
  ok(!errs.length, 'no page error: ' + errs.slice(0, 3).join(' | '));
  await b.close(); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
