// step signed-commands / pikuach-gate, the page's side, with a key made for the test (the real one never leaves
// /home/user/keys): 18 forged commands - unsigned, another key, expired, replayed, altered - 18 refused with 0 posted to
// the phone; 6 signed ones - 6 posted, with their signature for the phone to check again. On Shabbat 12 urgent messages
// without a signature wait; 6 signed pikuach nefesh messages pass, each within three seconds.
// Run: node tests/signed.test.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
const { generateKeyPairSync, sign, randomBytes } = require('crypto');
(async () => {
  const key = generateKeyPairSync('ed25519'), other = generateKeyPairSync('ed25519');
  const PUB = key.publicKey.export({ type: 'spki', format: 'der' }).toString('base64');
  const mk = (cmd, o) => { o = o || {}; const nonce = o.nonce || randomBytes(9).toString('base64url'), exp = o.exp || Date.now() + 1800e3;
    const sig = sign(null, Buffer.from('cmd|' + nonce + '|' + exp + '|' + cmd), (o.key || key).privateKey).toString('base64');
    return { from: 'manager', kind: 'cmd', cmd: o.alter || cmd, nonce, exp, sig: o.nosig ? undefined : sig, spoken: false, ts: Date.now() }; };
  const pk = (text, o) => { o = o || {}; const nonce = randomBytes(9).toString('base64url'), exp = Date.now() + 1800e3;
    const sig = sign(null, Buffer.from('pikuach|' + nonce + '|' + exp + '|' + text), (o.key || key).privateKey).toString('base64');
    return { from: 'manager', kind: 'say', priority: 'urgent', pikuach: true, speaker: 'המנהל', topic: 'פיקוח נפש', text, nonce, exp, sig, spoken: false, ts: Date.now() }; };
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const html = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-signed-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>
    window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB); await p.addInitScript(`window.__testCmdPub=${JSON.stringify(PUB)};`); await p.goto('file://' + tmp + '/host.html');
  const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.__signed && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700);
  await f.evaluate(() => { localStorage.setItem('liba.distillDay', trDay(Date.now())); window.__testHour = 11; window.__testShabbat = false; });
  await p.evaluate(() => { window.msgs = []; window.app({ liba: 'hello', ver: '3.32.0', pv: 1, caps: ['spoke', 'holy'], wall: Date.now() }); }); await p.waitForTimeout(800);
  let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
  const posted = [], heard = [];
  const pumpMsgs = async ms => { const end = Date.now() + ms; while (Date.now() < end) { const m = await p.evaluate(() => { const x = window.msgs.slice(); window.msgs = []; return x; });
      for (const x of m) { if (x.liba === 'cmd') posted.push(x); if (x.liba === 'say') { heard.push({ t: x.text, at: Date.now() }); if (x.id) await p.evaluate(id => window.app({ liba: 'spoke', id }), x.id); } } await p.waitForTimeout(50); } };
  const put = (id, d) => f.evaluate(([id, d]) => window.__h.set('inbox/' + id, d), [id, d]);
  // 18 forged
  const replayed = mk('hey_off');
  const forged = [];
  for (let i = 0; i < 6; i++) forged.push(mk('style ' + (i % 3), { nosig: true }));
  for (let i = 0; i < 4; i++) forged.push(mk('hey_off', { key: other }));
  for (let i = 0; i < 4; i++) forged.push(mk('open https://evil.example/' + i, { exp: Date.now() - 1000 }));
  for (let i = 0; i < 2; i++) forged.push(mk('open https://github.com/x', { alter: 'open https://evil.example/steal' }));
  await put('r0', replayed); await pumpMsgs(1500); posted.length = 0;          // the first time it is valid
  for (let i = 0; i < 2; i++) forged.push(Object.assign({}, replayed, { ts: Date.now() + i }));
  for (let i = 0; i < forged.length; i++) await put('x' + i, forged[i]);
  await pumpMsgs(4000);
  const refused = await f.evaluate(() => window.__h.all('inbox').filter(d => /^x\d+$/.test(d.id) && d.refused === 'unsigned').length);
  ok(forged.length === 18 && posted.length === 0 && refused === 18, `18 forged commands: ${refused} refused, ${posted.length} posted to the phone`);
  // 6 valid
  const valid = ['hey_on', 'style 1', 'open https://github.com/meir7651231-ui', 'hey_off', 'style 2', 'open https://claude.ai/code'].map(c => mk(c));
  for (let i = 0; i < valid.length; i++) await put('v' + i, valid[i]);
  await pumpMsgs(4000);
  ok(posted.length === 6 && posted.every(x => x.sig && x.nonce && x.exp > Date.now()), '6 signed commands: ' + posted.length + ' posted, each with its signature for the phone to check again');
  // Shabbat: 12 unsigned urgent wait, 6 signed pikuach pass
  await f.evaluate(() => { window.__testShabbat = true; });
  heard.length = 0;
  for (let i = 0; i < 12; i++) await put('u' + i, { from: 'manager', kind: 'say', priority: 'urgent', topic: 'בדיקה', text: 'דחוף בלי חתימה ' + i, spoken: false, ts: Date.now() });
  for (let i = 0; i < 2; i++) await put('uk' + i, pk('פיקוח במפתח אחר ' + i, { key: other }));
  await pumpMsgs(3000);
  ok(!heard.some(h => /דחוף בלי חתימה|פיקוח במפתח אחר/.test(h.t)), 'on Shabbat: 12 urgent without a signature, and 2 pikuach signed with another key - none said');
  const t0 = Date.now(); const lat = [];
  for (let i = 0; i < 6; i++) { const at = Date.now(); await put('pk' + i, pk('פיקוח נפש ' + i)); lat.push(at); }
  await pumpMsgs(6000);
  const got = [0, 1, 2, 3, 4, 5].map(i => { const h = heard.find(x => x.t.indexOf('פיקוח נפש ' + i) >= 0); return h ? h.at - lat[i] : null; });
  ok(got.every(x => x !== null && x < 3000 + 2000), 'on Shabbat: 6 signed pikuach nefesh messages pass: ' + got.map(x => x === null ? 'לא' : x + 'ms').join(', '));
  ok(!errs.length, 'no page error: ' + errs.join(' | '));
  await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
