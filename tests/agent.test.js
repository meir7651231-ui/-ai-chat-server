// steps ledger-fsm, mandate, consent: 1,000,000 ids, no collision; fourteen kinds of action in the ledger, every one with a
// cause; a state stuck over two minutes comes back to IDLE, written; 24 mandate scenarios - the fourth worker of the day
// asks once, not four times; 50 approvals, asked three at a time, each bound to its own answer; silence is no.
// Run: node tests/agent.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
const { generateKeyPairSync, sign, randomBytes } = require('crypto');
(async () => {
  const key = generateKeyPairSync('ed25519'); const PUB = key.publicKey.export({ type: 'spki', format: 'der' }).toString('base64');
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-agent-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.addInitScript(`window.__testCmdPub=${JSON.stringify(PUB)};`); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__agent && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; window.__h.set('memory/proactive', { startedAt: Date.now() - 8 * 864e5 }); });
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: ['spoke'], wall: Date.now() }); }); await p.waitForTimeout(800);
  let fails = 0, n = 0; const ok = (c, m) => { n++; console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(40); } };
  const say = async (t, ms) => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(ms || 2300); return heard.join(' | '); };
  // 1 ids
  const ids = await f.evaluate(() => { const s = new Set(); for (let i = 0; i < 1000000; i++) s.add(mintId()); return s.size; });
  ok(ids === 1000000, '1,000,000 ids in a row: ' + ids + ' distinct - no two writes can overwrite each other');
  // 2 fourteen kinds of action, each with a cause
  const nonce = randomBytes(9).toString('base64url'), exp = Date.now() + 1800e3, sig = sign(null, Buffer.from('cmd|' + nonce + '|' + exp + '|reload'), key.privateKey).toString('base64');
  await f.evaluate(([nonce, exp, sig]) => { const H = window.__h, now = Date.now();
    H.set('inbox/k1', { from: 'manager', kind: 'say', topic: 'בדיקה', text: 'נאמר', spoken: false, ts: now });
    H.set('inbox/k2', { from: 'manager', kind: 'say', topic: 'בדיקה', text: 'פג', spoken: false, ts: now - 80 * 3600e3 });
    H.set('inbox/k3', { from: 'manager', kind: 'say', topic: 'בדיקה', text: 'ישן', spoken: false, ts: now, validUntil: now - 1000, staleMode: 'drop' });
    H.set('inbox/k4', Object.assign({ from: 'manager', kind: 'cmd', cmd: 'reload', spoken: false, ts: now }, { nonce, exp, sig })); }, [nonce, exp, sig]);
  await speak(2500);
  await say('אל תעדכן אותי על מייל'); await f.evaluate(() => window.__policy.load());
  await f.evaluate(() => window.__h.set('inbox/k5', { from: 'manager', kind: 'say', topic: 'מייל', text: 'מייל חדש', spoken: false, ts: Date.now() })); await speak(1500);
  await say('מה פספסתי'); await say('תזכור שיש לי מחסן בגינה'); await say('אל תפריע חצי שעה'); await say('תפריע'); await say('תעלה את המנהל'); await say('ליבה תחזור');
  await say('שלום לקלוד, מה חדש'); await say('תשכח את המחסן'); await say('כן');
  await f.evaluate(async () => { await inboxRetry({ id: 'k9', attempts: 0 }, 'lost'); await inboxRetry({ id: 'k10', attempts: 2 }, 'lost');
    await window.__pro.fire({ id: 'date.t1', kind: 'date', text: 'בדיקה' }); transition('SPEAKING', 'test'); window.__agent.watch(); window.__agent.watch(Date.now() + 130000); });
  await speak(800);
  const led = await f.evaluate(() => window.__agent.ledger.ring());
  const kinds = [...new Set(led.map(x => x.action))];
  const want = ['say', 'expire', 'drop', 'digest', 'cmd', 'intent', 'remember', 'quiet', 'owner', 'send', 'forget', 'retry', 'fail', 'remind', 'unstick', 'mandate'];
  const missing = want.filter(k => kinds.indexOf(k) < 0);
  ok(missing.length === 0 && want.length >= 14, `${want.length} kinds of action in the ledger` + (missing.length ? ' - missing: ' + missing.join(',') : ''));
  ok(led.every(x => x.cause), 'every ledger line has a cause: ' + led.filter(x => !x.cause).map(x => x.action).join(','));
  ok((await f.evaluate(() => state)) === 'IDLE' && led.some(x => x.action === 'unstick' && /SPEAKING/.test(x.cause)), 'a state stuck over two minutes is back to IDLE, and the ledger says which');
  ok(led.filter(x => x.action === 'remind').every(x => x.mandateVerdict), 'speaking unprompted carries the mandate verdict');
  // 3 mandate - 24 scenarios
  const m = await f.evaluate(async () => { const M = window.__agent.mandate, out = []; const t = (name, got, want) => out.push([name, got, want]);
    const now = Date.now(); window.__testHour = 11;
    t('priority alone by default', M.allow('priority', { now }).verdict, 'alone');
    t('open_worker act_then_tell by default', M.allow('open_worker', { now }).verdict, 'act_then_tell');
    for (const a of ['ship', 'send_email', 'spend', 'delete', 'stop_worker']) t(a + ' asks first by default', M.allow(a, { now }).verdict, 'ask_first');
    t('speak_unprompted act_then_tell by day', M.allow('speak_unprompted', { now }).verdict, 'act_then_tell');
    window.__testHour = 23; t('speak_unprompted denied at night', M.allow('speak_unprompted', { now }).verdict, 'deny');
    t('urgent passes the night', M.allow('speak_unprompted', { now, urgent: true }).verdict, 'act_then_tell');
    t('wake_at_night denied', M.allow('wake_at_night', { now }).verdict, 'deny'); window.__testHour = 11;
    let asked = 0; for (let i = 0; i < 4; i++) { const v = M.allow('open_worker', { now }).verdict; if (v === 'ask_first') asked++; else M.spent('open_worker'); }
    t('the fourth worker of the day asks - once', asked, 1);
    t('spend within budget 0 asks', M.allow('spend', { now, cost: 1 }).verdict, 'ask_first');
    t('unknown irreversible-sounding class asks', M.allow('delete', { now }).verdict, 'ask_first');
    t('unknown reversible class acts then tells', M.allow('reload', { now }).verdict, 'act_then_tell');
    t('class of "לשנות עדיפות"', window.__agent.classOf('לשנות עדיפות'), 'priority');
    t('class of "למחוק דברים"', window.__agent.classOf('למחוק דברים'), 'delete');
    t('class of "לפתוח עובד חדש"', window.__agent.classOf('לפתוח עובד חדש'), 'open_worker');
    t('class of nothing', window.__agent.classOf('לרקוד'), null);
    t('class of "לשלוח מייל לרואה החשבון"', window.__agent.classOf('לשלוח מייל לרואה החשבון'), 'send_email');
    return out; });
  await say('את רשאית לפתוח עובד'); const m2 = await f.evaluate(() => window.__agent.mandate.allow('open_worker', { now: Date.now() + 864e5 }).verdict);
  const s1 = await say('את רשאית למחוק'); const m3 = await f.evaluate(() => window.__agent.mandate.allow('delete', { now: Date.now() + 864e5 }).verdict);
  const s2 = await say('אל תעשי לבד שינוי עדיפות'); const m4 = await f.evaluate(() => window.__agent.mandate.allow('priority', { now: Date.now() + 864e5 }).verdict);
  const s3 = await say('מה את רשאית לעשות');
  m.push(['"את רשאית לפתוח עובד" → alone', m2, 'alone'], ['"את רשאית למחוק" stays act_then_tell (irreversible)', m3, 'act_then_tell'], ['"אל תעשי לבד שינוי עדיפות" → ask_first', m4, 'ask_first'],
    ['"מה את רשאית לעשות" lists it', /לבד: לפתוח עובד/.test(s3) && /שואלת קודם: .*לשנות עדיפות/.test(s3), true]);
  const mBad = m.filter(([, g, w]) => g !== w);
  ok(m.length >= 24 && mBad.length === 0, `${m.length} mandate scenarios` + (mBad.length ? ' - wrong: ' + mBad.map(x => x[0] + '=' + x[1]).join('; ') : ''));
  ok((await f.evaluate(() => window.__agent.ledger.ring().filter(x => x.action === 'mandate').every(x => x.mandateVerdict))), 'every mandate decision is in the ledger with its verdict');
  // 4 consent - 50 approvals, three at a time, each bound to its own answer
  const plan = Array.from({ length: 50 }, (_, i) => ({ i, yes: (i * 7) % 3 !== 0 }));
  await f.evaluate(() => { window.__cres = {}; });
  let bound = 0; const wrongC = [];
  for (let g = 0; g < 50; g += 3) {
    const burst = plan.slice(g, g + 3);
    await f.evaluate(burst => { burst.forEach(x => window.__agent.consent.request({ action: 'delete', effect: 'פריט ' + x.i, say: 'למחוק את פריט ' + x.i + '?' }).then(v => { window.__cres[x.i] = v; })); }, burst);
    await speak(900 + 250 * burst.length);
    for (const x of burst.slice().reverse()) {             // the last asked is answered first, then each earlier one is asked again
      heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), x.yes ? 'כן' : 'לא'); await speak(1600);
    }
  }
  await p.waitForTimeout(300);
  const res = await f.evaluate(() => window.__cres);
  plan.forEach(x => { if (res[x.i] === x.yes) bound++; else wrongC.push(x.i + ':' + res[x.i]); });
  ok(bound === 50, `50 approvals, three at a time: ${bound} bound to the right answer` + (wrongC.length ? ' - wrong: ' + wrongC.slice(0, 6).join(',') : ''));
  const exp1 = await f.evaluate(async () => { let ran = 0; const v = await window.__agent.consent.request({ action: 'ship', effect: 'גרסה', ttl: 800 }); if (v) ran++; return { v, ran }; });
  ok(exp1.v === false && exp1.ran === 0, 'no answer before it expires: no - and nothing runs');
  const today = await say('מה אישרתי היום');
  ok(/היום אישרת \d+ מתוך 5[01]/.test(today), '"מה אישרתי היום" from approvals: ' + today.slice(0, 100));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(`\n${n} בדיקות` + (fails ? ` · ${fails} נכשלו` : ' · כל הבדיקות עברו')); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
