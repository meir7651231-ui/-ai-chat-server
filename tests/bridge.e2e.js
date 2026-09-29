// step protocol-contract: the two halves of the bridge, together, in a real browser - no Android needed.
// The top frame runs the TOP_SCRIPT that Kotlin would inject (assembled from LibaWeb.kt + Protocol.kt);
// a fake LibaBridge records every call; the built page runs in the iframe. Run:
//   NODE_PATH=$(npm root -g) node tests/bridge.e2e.js
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path'); const os = require('os');
(async () => {
  const { topScript } = await import('../tools/top-script.mjs');
  const P = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'protocol/protocol.json'), 'utf8'));
  const failed = [];
  const check = (c, m) => { if (!c) failed.push(m); console.log((c ? 'PASS ' : 'FAIL ') + m); };
  // the page's own db stub from the page e2e harness, so the page boots exactly as it does there
  const e2e = fs.readFileSync(path.join(__dirname, 'page.e2e.js'), 'utf8');
  const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1));
  const page = fs.readFileSync(path.join(__dirname, '..', 'liba-call.html'), 'utf8');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'liba-bridge-'));
  fs.writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + page + '</body></html>');
  // the fake LibaBridge: every method in the contract, recording its arguments exactly as Kotlin receives them
  const fake = 'window.calls=[];window.LibaBridge={' + Object.keys(P.toApp).map(k => `${k}:function(){window.calls.push({m:${JSON.stringify(k)},a:[].slice.call(arguments)});}`).join(',') + '};';
  fs.writeFileSync(tmp + '/host.html', `<!doctype html><html><body><script>${fake}</script><script>${topScript()}</script><iframe id=f src="inner.html" style="width:400px;height:800px"></iframe></body></html>`);
  const b = await chromium.launch(); const p = await b.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.addInitScript(STUB);
  await p.goto('file://' + tmp + '/host.html', { waitUntil: 'load' });
  const fr = p.frames()[1]; await fr.waitForFunction(() => window.__h && window.claude, null, { timeout: 5000 });
  const calls = () => p.evaluate(() => window.calls.slice());
  // 1. the top script's own re-hello loop reaches the page, and the page answers 'ready' through the relay
  await p.evaluate(() => { window.__libaVer = '9.9.9'; });
  await p.waitForTimeout(3600);
  let c = await calls();
  check(c.some(x => x.m === 'ready'), 'hello from the top frame → page answers ready → LibaBridge.ready()');
  const dev = await fr.evaluate(() => window.__h.get('channel/device'));
  check(dev && dev.app === '9.9.9', 'the page received hello with the version the app set: ' + JSON.stringify(dev && dev.app));
  // 2. a message in the inbox travels page → relay → LibaBridge.say with every field typed as Kotlin expects
  await fr.evaluate(() => window.__h.set('inbox/b1', { text: 'גשר-בדיקה', kind: 'ask', options: ['כן', 'לא'], from: 'liba', speaker: 'ליבה', ts: Date.now() }));
  await p.waitForTimeout(1500); c = await calls();
  const say = c.find(x => x.m === 'say' && /גשר-בדיקה/.test(x.a[0]));
  check(!!say, 'inbox message → LibaBridge.say()');
  check(say && say.a.length === 5 && typeof say.a[2] === 'string' && JSON.parse(say.a[2]).join() === 'כן,לא' && say.a[1] === 'ask' && say.a[4].length > 0,
    'say arrives with 5 args, options as a JSON string, kind and id intact: ' + JSON.stringify(say && say.a.slice(1)));
  // 3. app → page: the generated sender for 'spoke' releases the page, which then acks the message
  await p.evaluate(id => window.__libaSpoke(id), say && say.a[4]); await p.waitForTimeout(1200);
  check((await fr.evaluate(() => window.__h.get('inbox/b1')) || {}).spoken === true, 'window.__libaSpoke (generated) → page acks the message');
  // 4. typed input from the app reaches the page and comes back as a sent message
  await p.evaluate(() => window.__libaInput('בדיקת-קלט')); await p.waitForTimeout(2600); c = await calls();
  check(c.some(x => x.m === 'tap'), 'window.__libaInput → the page asks the app for a tap (user activation)');
  // 4b. a share from the app arrives as a request whose source is 'share'
  await p.evaluate(() => window.__libaInput('שיתוף-בדיקה', 'share')); await p.waitForTimeout(2600);
  const reqs = await fr.evaluate(() => window.__h.all('req'));
  check(reqs.some(r => r.text === 'שיתוף-בדיקה' && r.source === 'share'), 'window.__libaInput(text, "share") → a request with source share');
  // 5. every page -> app message in the contract has a relay line, and nothing outside the contract is relayed
  const relayed = [...topScript().matchAll(/d\.liba==="(\w+)"/g)].map(m => m[1]).sort().join();
  check(relayed === Object.keys(P.toApp).sort().join(), 'the relay covers exactly the contract: ' + relayed);
  check(!errs.length, 'no page errors: ' + errs.slice(0, 3).join(' | '));
  await b.close();
  console.log(failed.length ? `\n${failed.length} נכשלו:\n  ` + failed.join('\n  ') : '\nכל בדיקות הגשר עברו');
  if (failed.length) process.exit(1);
})().catch(e => { console.log('HARNESS ERROR', e); process.exit(1); });
