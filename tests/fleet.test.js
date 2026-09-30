// steps worker-open .. fleet-router: ten sentences open ten workers, the same one twice opens one; the dispatcher never
// passes maxRunning, stops dead at halt, and two tabs never take one order; requeue keeps one order per idem; the
// sweep finds the stalled (said once), the abandoned (back to the queue), the deaf (applied by the sweep); thirty
// low-stakes worker questions interrupt at most three times, the one that blocks many is said, "מה השתקת מהעובדים"
// lists them; a question already answered is answered by ליבה twice, the third time Meir hears it; an answer right
// after a worker's question goes to that worker; control by voice. Run: node tests/fleet.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-fleet-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__fleet && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const take = () => p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
  const hello = caps => p.evaluate(c => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: c, wall: Date.now() }); }, caps);
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.35.0', pv: 1, caps: ['spoke'], wall: Date.now() }); }); await p.waitForTimeout(800);
  await f.evaluate(() => { window.__h.set('memory/mandate', { levels: { open_worker: 'alone', stop_worker: 'ask_first' }, budget: { maxWorkersPerDay: 50, maxActionsPerHour: 1000 } }); window.__h.set('memory/settings', { decisions: true, logTurns: true }); });
  await f.evaluate(() => window.__agent.load()); await p.waitForTimeout(300);
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(40); } };
  const say = async (t, n) => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); for (let i = 0; i < 30 && heard.length < (n || 1); i++) await speak(200); await speak(300); return heard.join(' | '); };
  const st = () => f.evaluate(() => window.__fleet.state());
  // worker-open
  const T = ['תבנה לי דף הרשמה לשבת', 'תתקן את הבאג בטבלת השכר', 'תבדוק את הגיבוי של השרת', 'תבנה לי מחשבון מלגות', 'תתקן את הקישור בדף הבית',
    'תבדוק למה ההתראות לא מגיעות', 'תבנה לי טופס בקשת חופשה', 'תתקן את הסדר בלוח המשימות', 'תבדוק את הסוללה בבועה', 'תבנה לי רשימת ספקים'];
  const t0 = Date.now(); for (const t of T) await say(t);
  let s0 = await st();
  ok(s0.workers.length === 10 && Date.now() - t0 < 10 * 20000 && s0.workers.every(w => w.status === 'queued' || w.status === 'running'), `ten sentences, ten workers: ${s0.workers.length}`);
  ok(s0.orders.length === 10 && new Set(s0.orders.map(o => o.idem)).size === 10, 'ten orders, ten idems');
  await say('תבנה לי רשימת ספקים'); s0 = await st();
  ok(s0.workers.length === 10 && heard.some(h => /כבר פתחתי את זה לפני רגע/.test(h)), 'the same sentence again: one worker');
  const mp = await say('מפה');
  ok(/עובדים: רשימת ספקים/.test(mp), '"מפה" names the newest worker: ' + mp.slice(-90));
  // dispatch
  for (let i = 0; i < 10; i++) await f.evaluate(() => window.__fleet.dispatch());
  await p.waitForTimeout(400); s0 = await st();
  const running = s0.workers.filter(w => w.status === 'running');
  ok(running.length === 3 && (await f.evaluate(() => window.__fleet.dispatch())) === 0, `dispatch (by hand and by the outbox tick): ${running.length} running - never past maxRunning 3`);
  const firstTs = s0.orders.slice().sort((a, b) => a.ts - b.ts).slice(0, 3).map(o => o.wid).sort().join();
  ok(running.map(w => w.id).sort().join() === firstTs, 'the oldest orders first');
  const sent = await f.evaluate(() => window.__h.sentRaw.filter(x => /פתח עובד w-/.test(x)).length);
  ok(sent === 3, 'each dispatched worker handed to the brain in one sentence: ' + sent);
  // two tabs
  const q1 = s0.workers.find(w => w.status === 'queued');
  await f.evaluate(id => window.__h.acquire ? null : null, q1.id);
  const other = await f.evaluate(async id => { const r = await P.order(id).acquire({ holder: 'other-tab', ttlMs: 60000 }); return r && r.acquired; }, q1.id);
  await f.evaluate(async () => { await window.__h.set('fleet/policy', { halt: false, maxRunning: 10 }); }); await p.waitForTimeout(300);
  let n2 = 0; for (let i = 0; i < 12; i++) n2 += await f.evaluate(() => window.__fleet.dispatch());
  await p.waitForTimeout(300); s0 = await st();
  const rn = s0.workers.filter(w => w.status === 'running').length;
  ok(other && s0.workers.find(w => w.id === q1.id).status === 'queued' && rn === 9, `an order claimed by another tab is not taken: ${rn} running, that one ${s0.workers.find(w => w.id === q1.id).status} (other=${other}, maxRunning=${s0.policy.maxRunning})`);
  // halt
  const h = await say('תעצור הכול');
  s0 = await st();
  ok(/עצרתי את הצי: 9 רצים הושהו/.test(h) && s0.policy.halt && s0.workers.filter(w => w.status === 'running').length === 0 && s0.workers.filter(w => w.status === 'paused').every(w => w.controlAppliedAt > 0), '"תעצור הכול": ' + h.slice(0, 80));
  const n3 = await f.evaluate(() => window.__fleet.dispatch());
  ok(n3 === 0, 'halted: nothing new leaves the queue');
  await say('תמשיך את הצי'); s0 = await st();
  ok(!s0.policy.halt && s0.workers.filter(w => w.status === 'paused').length === 0, '"תמשיך את הצי": the paused are back in the queue');
  // requeue keeps one order
  const rq = s0.workers[0].id; for (let i = 0; i < 20; i++) await f.evaluate(id => window.__fleet.requeue(id, 'test'), rq);
  const ords = await f.evaluate(id => window.__h.all('fleet/orders/items').filter(o => o.wid === id).length, rq);
  ok(ords === 1, 'requeue twenty times: one order for that idem');
  // sweep
  for (let i = 0; i < 4; i++) await f.evaluate(() => window.__fleet.dispatch());
  await p.waitForTimeout(300); s0 = await st();
  const [wa, wb, wc] = s0.workers.filter(w => w.status === 'running');
  const now = await f.evaluate(() => Date.now());
  await f.evaluate(([a, b, now]) => { window.__h.set('workers/' + a, Object.assign({}, window.__h.get('workers/' + a), { beat: now - 3 * 60000 })); window.__h.set('workers/' + b, Object.assign({}, window.__h.get('workers/' + b), { beat: 0, dispatchedAt: now - 11 * 60000 })); }, [wa.id, wb.id, now]);
  await f.evaluate(([c, now]) => window.__h.set('workers/' + c, Object.assign({}, window.__h.get('workers/' + c), { control: { op: 'pause', by: 'meir', at: now - 20000 }, controlAppliedAt: 0 })), [wc.id, now]);
  await p.waitForTimeout(100);
  heard.length = 0; const sw = await f.evaluate(n => window.__fleet.sweep(n), now); await speak(1500);
  const sw2 = await f.evaluate(n => window.__fleet.sweep(n + 1000), now); await speak(800);
  s0 = await st();
  ok(s0.workers.find(w => w.id === wa.id).status === 'stalled' && heard.filter(x => /מת בשקט/.test(x)).length === 1, 'no beat for two leases: stalled, said once: ' + JSON.stringify(sw));
  ok(s0.workers.find(w => w.id === wb.id).status === 'queued' && (s0.workers.find(w => w.id === wb.id).transitions || []).some(t => t.why === 'abandoned'), 'dispatched, never beat in ten minutes: back to the queue');
  ok(['paused'].indexOf(s0.workers.find(w => w.id === wc.id).status) >= 0, 'a control nobody applied: the page applies it (deaf or not)');
  // triage
  const lowIds = []; for (let i = 0; i < 30; i++) { lowIds.push('a' + i); }
  heard.length = 0;
  await f.evaluate(([ids, w]) => { ids.forEach((id, i) => window.__h.set('inbox/' + id, { from: 'worker', workerId: w, kind: 'ask', topic: 'שאלה', text: 'איזה צבע לכפתור מספר ' + i + '?', options: ['כחול', 'ירוק'], spoken: false, ts: Date.now() })); }, [lowIds, wa.id]);
  await speak(4000);
  const asked = heard.filter(x => /איזה צבע לכפתור/.test(x)).length;
  const held = await f.evaluate(() => window.__h.all('fleet/asks/items').filter(a => a.state === 'held').length);
  ok(asked <= 3 && held >= 27, `thirty low-stakes questions: ${asked} said, ${held} held for the summary`);
  await f.evaluate(([w, deps]) => { deps.forEach(d => window.__h.set('workers/' + d, Object.assign({}, window.__h.get('workers/' + d), { needs: [w] }))); window.__h.set('inbox/big1', { from: 'worker', workerId: w, kind: 'ask', text: 'לאיזה שרת להעלות?', options: ['ראשי', 'גיבוי'], spoken: false, ts: Date.now() }); }, [wb.id, s0.workers.slice(3, 6).map(w => w.id)]);
  heard.length = 0; await speak(3000);
  ok(heard.some(x => /לאיזה שרת להעלות/.test(x)), 'a question that three workers wait on is said at once');
  await f.evaluate(() => window.__h.set('inbox/old1', { from: 'worker', workerId: 'w-x', kind: 'ask', text: 'שאלה ישנה על הצבעים', spoken: false, ts: Date.now() - 3 * 3600e3 }));
  heard.length = 0; await speak(2500);
  ok(heard.some(x => /שאלה ישנה על הצבעים/.test(x)), 'unanswered for two hours: to the top whatever its score');
  const mu = await say('מה השתקת מהעובדים');
  ok(/השתקתי \d+ שאלות/.test(mu), '"מה השתקת מהעובדים": ' + mu.slice(0, 90));
  // failure memory
  await f.evaluate(() => { window.__h.set('decisions/log/items/d1', { question: 'הבדיקה נכשלה בקובץ /src/a/b.js:12 עם 3 שגיאות, לדלג?', answer: 'לא, תתקן', fp: window.__fleet.fingerprint('הבדיקה נכשלה בקובץ /src/a/b.js:12 עם 3 שגיאות, לדלג?'), ts: Date.now() - 3600e3 }); });
  await f.evaluate(() => window.__fleet.decLoad(Date.now()));
  const autoSent0 = await f.evaluate(() => window.__h.sentRaw.filter(x => /ענית על זה כבר: לא, תתקן/.test(x)).length);
  heard.length = 0;
  for (let i = 0; i < 3; i++) { await f.evaluate(([i, w]) => window.__h.set('inbox/rep' + i, { from: 'worker', workerId: w, kind: 'ask', text: 'הבדיקה נכשלה בקובץ /lib/x' + i + '/y.js:' + (40 + i) + ' עם ' + (5 + i) + ' שגיאות, לדלג?', priority: 'urgent', spoken: false, ts: Date.now() }), [i, wc.id]); await speak(2500); }
  const autos = (await f.evaluate(() => window.__h.sentRaw.filter(x => /ענית על זה כבר: לא, תתקן/.test(x)))).length - autoSent0;
  const tagged = await f.evaluate(w => window.__h.sentRaw.filter(x => /ענית על זה כבר/.test(x)).every(x => x.indexOf('[ליבה→עובד:' + w + ']') === 0), wc.id);
  ok(autos === 2 && tagged && heard.filter(x => /הבדיקה נכשלה/.test(x)).length === 1, `a question already decided: answered by ליבה twice (to the worker), the third time Meir hears it: ${autos} auto, ${heard.filter(x => /הבדיקה נכשלה/.test(x)).length} said`);
  const rp = await say('מה חוזר על עצמו');
  ok(/חוזר על עצמו: הבדיקה נכשלה.* - 3 פעמים/.test(rp), '"מה חוזר על עצמו": ' + rp.slice(0, 100));
  // routing
  heard.length = 0; await f.evaluate(w => window.__h.set('inbox/r1', { from: 'worker', workerId: w, kind: 'ask', priority: 'urgent', text: 'למזג את הענף?', options: ['כן', 'לא'], spoken: false, ts: Date.now() }), wa.id); await speak(2500);
  ok(heard.some(x => /עובד /.test(x.slice(0, 20))), 'the question opens with the worker\'s name: ' + (heard.find(x => /למזג/.test(x)) || '').slice(0, 40));
  const before = await f.evaluate(() => window.__h.sentRaw.length);
  await say('תמזג אחרי הבדיקות');
  const toW = await f.evaluate(n => window.__h.sentRaw.slice(n), before);
  ok(toW.some(x => x.indexOf('[ליבה→עובד:' + wa.id + '] ') === 0), 'an answer right after a worker\'s question goes to that worker');
  const rt = await f.evaluate(() => { window.__fleet.routeSet({ workerId: 'w-old' }); const a = window.__fleet.tag(); window.__fleet.route().until = Date.now() - 1; const b = window.__fleet.tag(); return [a, b, window.__h.get('channel/route')]; });
  ok(rt[0] === '[ליבה→עובד:w-old] ' && rt[1] === '' && rt[2] && !rt[2].workerId, 'the route expires by itself after three minutes, and channel/route says so');
  // control by voice
  s0 = await st(); const tgt = s0.workers.find(w => w.status === 'queued' && /מחשבון מלגות/.test(w.title));
  const pz = await say('תשהה את העובד מחשבון מלגות');
  s0 = await st();
  ok(tgt && s0.workers.find(w => w.id === tgt.id).status === 'paused' && /השהיתי את "מחשבון מלגות"/.test(pz), 'pause by voice: ' + pz.slice(0, 60));
  const two = await say('תשהה את העובד תתקן');
  const kl = await say('תהרוג את העובד רשימת ספקים');
  ok(/להרוג את העובד "רשימת ספקים"\?/.test(kl), 'kill asks first: ' + kl.slice(-60));
  await say('כן', 2); s0 = await st();
  ok(s0.workers.find(w => /רשימת ספקים/.test(w.title)).status === 'killed', 'after a yes: killed');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
