// step second-channel: what the tool signs, the phone accepts - and nothing else. The public key is taken from
// UrgentPoller.kt itself, so a key that drifted between the tool and the app fails here, not on Meir's phone.
// And the page: ids the bubble already spoke natively come in hello and are never said again.
// Run: node tests/urgent.test.mjs
import { execFileSync } from 'node:child_process'
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs'
import { createPublicKey, verify, generateKeyPairSync, sign } from 'node:crypto'
import { join, dirname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
const root = join(dirname(fileURLToPath(import.meta.url)), '..'), require = createRequire(import.meta.url)
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ }
const kt = readFileSync(join(root, 'android/app/src/main/java/il/liba/app/UrgentPoller.kt'), 'utf8')
const pub = createPublicKey({ key: Buffer.from(/const val PUB = "([^"]+)"/.exec(kt)[1], 'base64'), format: 'der', type: 'spki' })
const check = f => { const o = JSON.parse(readFileSync(f, 'utf8')); return verify(null, Buffer.from(o.payload, 'utf8'), pub, Buffer.from(o.sig, 'base64')) }
const tmp = mkdtempSync(join(tmpdir(), 'liba-urgent-')), out = join(tmp, 'urgent.json')
const run = (...a) => execFileSync('node', [join(root, 'tools/urgent.mjs'), ...a], { env: { ...process.env, LIBA_URGENT_OUT: out }, encoding: 'utf8' })
const haveKey = (() => { try { readFileSync(process.env.LIBA_URGENT_KEY || '/home/user/keys/urgent-ed25519.pem'); return true } catch { return false } })()
if (haveKey) {
  run('בדיקה-דחופה', '--id', 'm-test-1')
  ok(check(out), 'sign: what tools/urgent.mjs signs verifies with the key embedded in the app')
  const o = JSON.parse(readFileSync(out, 'utf8'))
  writeFileSync(out, JSON.stringify({ payload: o.payload.replace('בדיקה-דחופה', 'פקודה-מזויפת'), sig: o.sig })); ok(!check(out), 'tamper: a changed text fails the signature')
  const other = generateKeyPairSync('ed25519').privateKey
  writeFileSync(out, JSON.stringify({ payload: o.payload, sig: sign(null, Buffer.from(o.payload), other).toString('base64') })); ok(!check(out), 'tamper: a signature by any other key fails')
  writeFileSync(out, JSON.stringify(o)); run('שנייה'); const items = JSON.parse(JSON.parse(readFileSync(out, 'utf8')).payload).items
  ok(items.length === 2 && items[0].id === 'm-test-1' && check(out), 'keeps earlier items and re-signs the whole file')
  run('--init'); ok(JSON.parse(JSON.parse(readFileSync(out, 'utf8')).payload).items.length === 0 && check(out), '--init writes an empty, signed file')
} else console.log('SKIP sign: no signing key in this environment (CI) - the repo file is still checked below')
// the file in the repo is always one the app accepts
ok(check(join(root, 'urgent.json')), 'the committed urgent.json verifies with the app\'s key')
// the page: hello carries what the bubble spoke natively; the page marks it and never reads it
const { chromium } = require('playwright')
const e2e = readFileSync(join(root, 'tests/page.e2e.js'), 'utf8')
const STUB = eval(e2e.slice(e2e.indexOf('const STUB = ') + 13, e2e.indexOf('`;', e2e.indexOf('const STUB = ')) + 1))
const html = readFileSync(join(root, 'liba-call.html'), 'utf8')
writeFileSync(tmp + '/inner.html', '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>')
writeFileSync(tmp + '/host.html', `<!doctype html><html><body><iframe id=f src="inner.html"></iframe><script>window.msgs=[];window.addEventListener('message',e=>{window.msgs.push(e.data);});window.app=d=>document.getElementById('f').contentWindow.postMessage(d,'*');</script></body></html>`)
const b = await chromium.launch(), p = await b.newPage(); await p.addInitScript(STUB); await p.goto('file://' + tmp + '/host.html')
const f = p.frames()[1]; await f.waitForFunction(() => window.__h && window.claude, null, { timeout: 8000 }); await p.waitForTimeout(700)
await f.evaluate(() => window.__h.set('inbox/m-native-1', { from: 'liba', kind: 'say', text: 'נאמר-כבר-בטלפון', spoken: false, ts: Date.now() }))
await f.evaluate(() => window.__h.set('inbox/m-other', { from: 'liba', kind: 'say', text: 'הודעה-רגילה', spoken: false, ts: Date.now() + 1 }))
await p.evaluate(() => window.app({ liba: 'hello', ver: '3.24.0', pv: 1, caps: ['spoke'], urgent: 'm-native-1,bad id!', wall: Date.now() })); await p.waitForTimeout(2500)
const said = await p.evaluate(() => window.msgs.filter(x => x.liba === 'say').map(x => x.text))
const d1 = await f.evaluate(() => window.__h.get('inbox/m-native-1'))
ok(!said.some(t => /נאמר-כבר-בטלפון/.test(t)) && said.some(t => /הודעה-רגילה/.test(t)), 'page: what the bubble spoke natively is not said again; the rest is: ' + said.join(' | '))
ok(d1 && d1.spoken === true && d1.delivery && d1.delivery.by === 'native', 'page: it is marked spoken, by native')
await b.close(); console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0)
