// step retention-erasure: 300 records in three collections, of four classes and many ages - one sweep removes exactly
// the ones that outlived their class, each first into the trash, with a receipt per collection; "תחזיר מה שמחקת
// אתמול" brings them all back; an export on a subject opens only with its password (node crypto, as the tool does).
// Run: node tests/retain.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-retain-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__retain && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const take = () => p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
  const hello = caps => p.evaluate(c => { window.msgs = []; window.app({ liba: 'hello', ver: '3.33.0', pv: 1, caps: c, wall: Date.now() }); }, caps);
  const { openExport, html: exportHtml } = await import('../tools/export-open.mjs');
  const now = await f.evaluate(() => Date.now()), D = 864e5;
  const TEXT = { ops: 'הבועה נתקעה אחרי העדכון', personal: 'אני רוצה לנוח מחר', mosad: 'תכין את הדוח של המוסד', health: 'אבא שלי צריך ניתוח בבית חולים' }, DAYS = { ops: 30, personal: 180, mosad: 90, health: 14 };
  const ages = [1, 10, 15, 20, 31, 45, 60, 91, 120, 181]; let expect = { decisions: 0, req: 0, work: 0 };
  await f.evaluate(([T, ages, now, D]) => { let i = 0; for (const col of ['decisions', 'req', 'work']) for (const k of Object.keys(T)) for (const a of ages) for (let r = 0; r < 2 + (i % 2); r++) { i++;
      const ts = now - a * D - 1000, id = col[0] + i;
      if (col === 'decisions') window.__h.set('decisions/log/items/' + id, { question: T[k], answer: 'כן', ts });
      else if (col === 'req') window.__h.set('req/' + id, { text: T[k], askedAt: ts });
      else window.__h.set('work/' + id, { text: T[k], at: ts, state: 'answered' }); } }, [TEXT, ages, now, D]);
  let i = 0; for (const col of ['decisions', 'req', 'work']) for (const k of Object.keys(TEXT)) for (const a of ages) for (let r = 0; r < 2 + (i % 2); r++) { i++; if (a > DAYS[k]) expect[col]++; }
  const total = i, exp = expect.decisions + expect.req + expect.work;
  const cls = await f.evaluate(T => Object.fromEntries(Object.entries(T).map(([k, t]) => [k, window.__retain.classOf({}, t)])), TEXT);
  ok(Object.entries(cls).every(([k, v]) => k === v), 'each text in its class: ' + JSON.stringify(cls));
  const r = await f.evaluate(n => window.__retain.sweep(n), now);
  const left = await f.evaluate(() => window.__h.all('decisions/log/items').length + window.__h.all('req').length + window.__h.all('work').length);
  ok(r && r.n === exp && left === total - exp, `one sweep over ${total}: ${r && r.n} removed (expected ${exp}), ${left} left`);
  ok(r && r.counts.decisions === expect.decisions && r.counts.req === expect.req && r.counts.work === expect.work, 'the count per collection: ' + JSON.stringify(r && r.counts));
  const trash = await f.evaluate(() => window.__h.all('memory/trash/items'));
  ok(trash.length === exp && trash.every(t => t.data && t.klass && t.col), 'each removed record is in the trash first, with its class: ' + trash.length);
  const rec = await f.evaluate(() => window.__agent.ledger.ring().filter(x => x.action === 'erase').slice(-1)[0]);
  ok(rec && rec.inputs && rec.inputs.req === expect.req && rec.result === String(exp), 'the receipt in the ledger');
  const again = await f.evaluate(n => window.__retain.sweep(n), now);
  ok(again && again.n === 0, 'a second sweep removes nothing');
  const back = await f.evaluate(n => window.__retain.restore(n - 864e5), now);
  const left2 = await f.evaluate(() => window.__h.all('decisions/log/items').length + window.__h.all('req').length + window.__h.all('work').length);
  ok(back === exp && left2 === total && (await f.evaluate(() => window.__h.all('memory/trash/items').length)) === 0, 'restore since yesterday: ' + back + ' back, the trash empty');
  // export
  await f.evaluate(() => { window.__h.set('decisions/log/items/gag1', { question: 'איזה ספק לגג', answer: 'השני', ts: Date.now() }); window.__h.set('chat/log/turns/gag2', { from: 'user', speaker: 'מאיר', text: 'מה עם הגג', ts: Date.now() }); });
  const obj = await f.evaluate(() => window.__retain.gather('הגג'));
  ok(obj.decisions.length === 1 && obj.turns.length === 1 && obj.decisions[0].a === 'השני', 'the export gathers what is held on the subject: ' + obj.decisions.length + '+' + obj.turns.length);
  const sealed = await f.evaluate(o => window.__retain.seal(o, 'תפוח ירוק'), obj);
  const opened = openExport(sealed, 'תפוח ירוק');
  let wrong = null; try { openExport(sealed, 'תפוח אדום'); wrong = 'opened'; } catch { wrong = 'refused'; }
  ok(opened.decisions[0].q === 'איזה ספק לגג' && wrong === 'refused' && !JSON.stringify(sealed).includes('ספק'), 'sealed with the password: opens with it, not with another, and holds no plain word');
  ok(/<h1>מה ליבה יודעת על הגג<\/h1>/.test(exportHtml(opened)) && /איזה ספק לגג ← <b>השני<\/b>/.test(exportHtml(opened)), 'the readable page');
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.35.0', pv: 1, caps: ['spoke'], wall: Date.now() }); }); await p.waitForTimeout(800);
  const heard = []; const voice = async t => { heard.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t);
    for (let k = 0; k < 40 && !heard.some(h => /ייצאתי|סיסמה/.test(h)); k++) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } await p.waitForTimeout(150); } return heard.join(' | '); };
  let v = await voice('תייצא את הזיכרון על הגג');
  ok(/צריך סיסמה/.test(v), 'no password: asks for one, exports nothing: ' + v.slice(0, 80));
  v = await voice('תייצא את הזיכרון על הגג בסיסמה תפוח ירוק');
  const xs = await f.evaluate(() => window.__h.all('memory/exports/items'));
  ok(/ייצאתי 2 פריטים על הגג/.test(v) && xs.length === 1 && openExport(xs[0], 'תפוח ירוק').subject === 'הגג', 'by voice: ' + v.slice(0, 90));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
