// step sense-bus-ears, the page's side: nothing is heard before Meir names an app; what the phone hears is written once
// (sense/notif/items), acked, sensitivity 2, and never reaches Claude; urgent is said through quiet and policy; "מה הגיע
// בהתראות" sums up; two days later it is gone and never in a fold. Run: node tests/sense.e2e.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-sense-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__sense && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; });
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.29.0', pv: 1, caps: ['spoke', 'sense'], wall: Date.now() }); }); await p.waitForTimeout(2500);
  let fails = 0, n = 0; const ok = (c, m) => { n++; console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const take = () => p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
  const heard = [];
  const speak = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await take();
      for (const x of m) { if (x.liba === 'say') { heard.push(x.text); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } else others.push(x); } await p.waitForTimeout(50); } };
  const others = [];
  const say = async t => { heard.length = 0; others.length = 0; await p.evaluate(t => window.app({ liba: 'input', text: t }), t); await speak(2600); return heard.join(' | '); };
  let m = await take(); let cfg = m.filter(x => x.liba === 'senseCfg');
  ok(cfg.length === 1 && cfg[0].apps.length === 0, 'after hello the phone is told the list - empty: nothing is heard before Meir names an app');
  let s = await say('תקשיבי להתראות של וואטסאפ');
  cfg = others.filter(x => x.liba === 'senseCfg');
  ok(/אקשיב להתראות של וואטסאפ/.test(s) && /לא נשלחות לקלוד/.test(s), '"תקשיבי להתראות של וואטסאפ": said, with what happens to them: ' + s.slice(0, 120));
  ok(cfg.length && cfg[cfg.length - 1].apps.join() === 'com.whatsapp', 'the phone gets the list: ' + JSON.stringify(cfg.map(x => x.apps)));
  ok(others.some(x => x.liba === 'cmd' && x.cmd === 'sense_open'), 'and is asked to open Android\'s own permission screen');
  ok((await f.evaluate(() => window.__h.all('memory').concat([]).length >= 0 && (window.__h.get('memory/settings') || {}).senses.apps.join())) === 'com.whatsapp', 'kept in memory/settings.senses.apps');
  s = await say('תקשיבי להתראות של פייסבוק');
  ok(/אני לא מכירה את פייסבוק/.test(s), 'an app it does not know is said so: ' + s.slice(0, 80));
  s = await say('מאיזה אפליקציות את מקשיבה');
  ok(/אני מקשיבה להתראות של וואטסאפ/.test(s), 'the list, said: ' + s.slice(0, 80));
  // twenty items from the phone
  const now = Date.now();
  const items = Array.from({ length: 20 }, (_, i) => ({ id: 's-' + i, kind: 'notif', key: 'k' + i, app: 'com.whatsapp', title: 'דני', text: 'הודעה סודית מספר ' + i, at: now + i, importance: 2, ttl: 2 * 864e5 }));
  const t0 = Date.now(); await p.evaluate(items => window.app({ liba: 'sense', items: JSON.stringify(items) }), items);
  await f.waitForFunction(() => window.__h.all('sense/notif/items').length === 20, null, { timeout: 5000 }).catch(() => {});
  const lat = Date.now() - t0; m = await take(); const ack = m.find(x => x.liba === 'senseAck');
  const docs = await f.evaluate(() => window.__h.all('sense/notif/items'));
  ok(docs.length === 20 && lat < 3000, `20 notifications written in ${lat} ms (under three seconds)`);
  ok(!!ack && ack.ids.length === 20, 'and acked, every id: ' + (ack && ack.ids.length));
  ok(docs.every(d => d.cls && d.cls.sens === 2 && d.cls.subject === 'third-party' && d.by), 'every one is personal, about a third party, sensitivity 2, with who wrote it');
  await p.evaluate(items => window.app({ liba: 'sense', items: JSON.stringify(items) }), items.slice(0, 5)); await p.waitForTimeout(800);
  m = await take();
  ok((await f.evaluate(() => window.__h.all('sense/notif/items').length)) === 20 && m.some(x => x.liba === 'senseAck' && x.ids.length === 5), 'sent again after a lost ack: acked, not written twice');
  const long = await f.evaluate(async () => { await window.__sense.in(JSON.stringify([{ id: 's-long', app: 'com.whatsapp', title: 'x', text: 'א'.repeat(3000), at: Date.now(), importance: 1 }])); return window.__h.get('sense/notif/items/s-long').text.length; });
  ok(long === 500, 'a long text is cut to 500: ' + long);
  const bad = await f.evaluate(async () => (await window.__sense.in('{not json')).ids);
  ok(bad === 0, 'a broken payload is refused, not a crash');
  // urgent: said; not during quiet; policy holds it too
  heard.length = 0; await p.evaluate(now => window.app({ liba: 'sense', items: JSON.stringify([{ id: 's-urg', app: 'com.whatsapp', title: 'אבא', text: 'תתקשר דחוף', at: now, importance: 3 }]) }), now);
  await speak(2500);
  ok(heard.some(t => /התראות, בנוגע לוואטסאפ: אבא: תתקשר דחוף/.test(t)), 'urgent is said: ' + heard.join(' | ').slice(0, 100));
  ok(!heard.some(t => /הודעה סודית/.test(t)), 'importance 2 is not said aloud');
  await say('אל תפריע שעה');
  heard.length = 0; await p.evaluate(now => window.app({ liba: 'sense', items: JSON.stringify([{ id: 's-urg2', app: 'com.whatsapp', title: 'אמא', text: 'חירום', at: now, importance: 3 }]) }), now);
  await speak(2000);
  ok(!heard.some(t => /חירום/.test(t)), 'during quiet it waits like every other line');
  await say('תפריע');
  // never to Claude
  const before = await f.evaluate(() => window.__h.sentRaw.length);
  await say('מה דני כתב לי היום');
  const sent = await f.evaluate(b => window.__h.sentRaw.slice(b).join('\n'), before);
  ok(sent.length > 0 && !/הודעה סודית|תתקשר דחוף/.test(sent), 'a sentence to Claude carries none of it');
  ok(!(await f.evaluate(async () => (await brief('מה דני כתב הודעה')).indexOf('סודית') >= 0)), 'and brief() never reads it');
  s = await say('מה הגיע בהתראות');
  ok(/היום הגיעו 2[23] התראות: 2[23] מוואטסאפ/.test(s) && /החשובות: אבא: תתקשר דחוף/.test(s), '"מה הגיע בהתראות": ' + s.slice(0, 140));
  // two days later: gone, and never folded
  const sw = await f.evaluate(async () => { const r = await window.__sense.sweep(Date.now() + 3 * 864e5); return { r, left: window.__h.all('sense/notif/items').length, folds: JSON.stringify(window.__h.all('fold')).indexOf('סודית') }; });
  ok(sw.left === 0 && sw.folds < 0, 'two days later they are deleted, and no fold holds them: ' + JSON.stringify(sw.r));
  s = await say('תפסיקי להקשיב להתראות של וואטסאפ');
  cfg = others.filter(x => x.liba === 'senseCfg');
  ok(/הפסקתי להקשיב להתראות של וואטסאפ/.test(s) && cfg.length && cfg[cfg.length - 1].apps.length === 0, '"תפסיקי להקשיב…": the list is empty again, and the phone knows');
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(`\n${n} טענות` + (fails ? ` · ${fails} נכשלו` : ' · כל הבדיקות עברו')); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
