#!/usr/bin/env node
/**
 * step device-mem: pure-Kotlin parts of the bubble tested on the JVM, without an emulator and without Gradle's test
 * setup (the app has no JUnit): the Kotlin compiler Gradle already downloaded compiles MemCore.kt with
 * tests/kt/MemCoreTest.kt, and java runs it. The page's own memWords makes the word fixtures, so the phone and the page
 * are checked to split a question the same way. No compiler in the cache (a fresh CI job) -> SKIP, said as SKIP.
 *   node tools/kt-test.mjs
 */
import { readFileSync, writeFileSync, mkdtempSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import os from 'node:os'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const C = join(os.homedir(), '.gradle/caches/modules-2/files-2.1')
const jar = (group, name, ver) => { const d = join(C, group, name); if (!existsSync(d)) return null
  const vs = readdirSync(d).filter(v => !ver || v === ver).sort().reverse(); for (const v of vs) for (const h of readdirSync(join(d, v))) for (const f of readdirSync(join(d, v, h))) if (f.endsWith('.jar') && !f.includes('sources')) return join(d, v, h, f); return null }
const K = 'org.jetbrains.kotlin', KV = '1.9.24'
const cp = [jar(K, 'kotlin-compiler-embeddable', KV), jar(K, 'kotlin-stdlib', KV), jar(K, 'kotlin-script-runtime', KV), jar(K, 'kotlin-reflect'), jar(K, 'kotlin-daemon-embeddable', KV),
  jar('org.jetbrains.intellij.deps', 'trove4j'), jar('org.jetbrains.kotlinx', 'kotlinx-coroutines-core-jvm'), jar('org.jetbrains', 'annotations')]
if (cp.some(x => !x)) { console.log('SKIP kt-test: no Kotlin compiler in the Gradle cache (it is compiled with the app in the build job)'); process.exit(0) }
const stdlib = cp[1]

// the fixtures: the page's inorm + memWords, run here in node
const src = f => readFileSync(join(ROOT, 'liba/src', f), 'utf8')
const inormLine = src('10-owner.js').split('\n').find(l => l.startsWith('const inorm='))
const mem = src('16-memory.js'); const fin = mem.split('\n').find(l => l.startsWith('const FINAL=')); const mw = mem.split('\n').find(l => l.startsWith('function memWords('))
const memWords = new Function(inormLine + '\n' + fin + '\n' + mw + '\nreturn memWords;')()
const phrases = ['מה אתה זוכר על דני', 'לדני', 'ודני', 'שדני', 'מהמחסן', 'בבית של אמא', 'המפתח של המחסן אצל השכן', 'אני בחו"ל עד ה-12', 'רואה החשבון הוא משה',
  'מה עם הכסף של הישיבה?', 'ליבא תזכרי', 'השולחן הגדול', 'כשהגענו', 'ומהבית', 'לחם', 'מה', 'דניאל', 'ספר תורה', 'תזכור שיש לי כלב', '  רווחים   כפולים  ', 'שׁ‏לום', 'פגישה ב-3 בנובמבר']
const tmp = mkdtempSync(join(os.tmpdir(), 'kt-'))
// the page's holy windows for 2027, for Holy.kt to match
const sh = src('26-shabbat.js'); const pure = sh.slice(sh.indexOf('/*<pure>*/'), sh.indexOf('/*</pure>*/'))
const { holyWindows } = new Function(pure + '\nreturn {holyWindows};')(); const MOADIM = new Function(src('00-moadim.js') + '\nreturn MOADIM;')()
// signed commands: documents made by tools/cmd.mjs with a key made here (the real key never leaves /home/user/keys)
const { generateKeyPairSync, sign: edSign } = await import('node:crypto')
const tk = generateKeyPairSync('ed25519'), tk2 = generateKeyPairSync('ed25519'); const keyFile = join(tmp, 'k.pem'); writeFileSync(keyFile, tk.privateKey.export({ type: 'pkcs8', format: 'pem' }))
const made = c => JSON.parse(execFileSync('node', [join(ROOT, 'tools/cmd.mjs'), c], { env: Object.assign({}, process.env, { LIBA_CMD_KEY: keyFile }), encoding: 'utf8' })).doc
const row = (d, expect) => [d.cmd, d.nonce || '', d.exp || 0, d.sig || '', expect].join('\t')
const v1 = made('hey_off'), v2 = made('style 2'), v3 = made('open https://evil.example/a')
const other = Object.assign({}, v1, { sig: edSign(null, Buffer.from('cmd|' + v1.nonce + '|' + v1.exp + '|hey_off'), tk2.privateKey).toString('base64'), nonce: v1.nonce + 'x' })
const expired = Object.assign({}, v2, { exp: 1000 })
const signedFx = join(tmp, 'signed.tsv'); writeFileSync(signedFx, [tk.publicKey.export({ type: 'spki', format: 'der' }).toString('base64'),
  row(v1, 'ok'), row(v2, 'ok'), row(v3, 'ok'), row(v1, 'no'), row(Object.assign({}, v2, { cmd: 'style 0', nonce: v2.nonce + 'y' }), 'no'), row(other, 'no'), row(expired, 'no'),
  row({ cmd: 'hey_on' }, 'no'), row({ cmd: 'sense_open' }, 'ok'), row({ cmd: 'cal_on' }, 'ok'), row({ cmd: 'open https://github.com/meir' }, 'ok'), row({ cmd: 'open https://evil.example' }, 'no')].join('\n') + '\n')
// update-trust: a manifest signed the way ship/version.mjs signs it, with the test key
const mSha = 'a'.repeat(64), mUrl = 'https://raw.githubusercontent.com/meir7651231-ui/-ai-chat-server/abc/dist/liba.apk'
const updFx = join(tmp, 'update.tsv'); writeFileSync(updFx, tk.publicKey.export({ type: 'spki', format: 'der' }).toString('base64') + '\n' + [70, mSha, mUrl, edSign(null, Buffer.from('v1|70|' + mSha + '|' + mUrl), tk.privateKey).toString('base64')].join('\t') + '\n')
const holyFx = join(tmp, 'holy.tsv'); writeFileSync(holyFx, [['jerusalem', 31.76904, 35.21633, 40], ['bneibrak', 32.08074, 34.8338, 20]].flatMap(([c, lat, lon, b]) =>
  holyWindows(Date.UTC(2027, 0, 2), Date.UTC(2027, 11, 30), { lat, lon, b }, MOADIM).map(w => [c, lat, lon, b, w.from, w.until, w.what].join('\t'))).join('\n') + '\n')
const fx = join(tmp, 'words.tsv'); writeFileSync(fx, phrases.map(p => p + '\t' + memWords(p).join(' ')).join('\n') + '\n')
const out = join(tmp, 'out')
try {
  execFileSync('java', ['-cp', cp.join(':'), 'org.jetbrains.kotlin.cli.jvm.K2JVMCompiler', '-no-stdlib', '-cp', stdlib, '-nowarn',
    join(ROOT, 'android/app/src/main/java/il/liba/app/MemCore.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/ReminderCore.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/sense/SenseCore.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/sense/CalCore.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/sense/Fusion.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/Holy.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/Signed.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/UpdateTrust.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/LocalBrain.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/power/PowerCore.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/power/GovernorCore.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/VaultCore.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/EgressCore.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/SrOffline.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/NBest.kt'), join(ROOT, 'android/app/src/main/java/il/liba/app/GuardCore.kt'), join(ROOT, 'tests/kt/MemCoreTest.kt'), join(ROOT, 'tests/kt/ReminderCoreTest.kt'), join(ROOT, 'tests/kt/SenseCoreTest.kt'), join(ROOT, 'tests/kt/CalCoreTest.kt'), join(ROOT, 'tests/kt/FusionTest.kt'), join(ROOT, 'tests/kt/HolyTest.kt'), join(ROOT, 'tests/kt/SignedTest.kt'), join(ROOT, 'tests/kt/UpdateTrustTest.kt'), join(ROOT, 'tests/kt/LocalBrainTest.kt'), join(ROOT, 'tests/kt/PowerCoreTest.kt'), join(ROOT, 'tests/kt/GovernorTest.kt'), join(ROOT, 'tests/kt/VaultTest.kt'), join(ROOT, 'tests/kt/EgressTest.kt'), join(ROOT, 'tests/kt/NBestTest.kt'), join(ROOT, 'tests/kt/GuardTest.kt'), join(ROOT, 'tests/kt/InstallTest.kt'), '-d', out], { stdio: ['ignore', 'pipe', 'pipe'] })
} catch (e) { console.log('FAIL kt-test: compile\n' + String(e.stderr || e).split('\n').filter(l => !/JAVA_TOOL_OPTIONS/.test(l)).slice(0, 20).join('\n')); process.exit(1) }
try { process.stdout.write(execFileSync('java', ['-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-cp', out + ':' + stdlib, 'MemCoreTestKt', fx, holyFx, join(ROOT, 'android/app/src/main/res/raw/moadim.json'), signedFx, updFx], { stdio: ['ignore', 'pipe', 'pipe'] }).toString()) }
catch (e) { process.stdout.write(String(e.stdout || '')); console.log(String(e.stderr || '').split('\n').filter(l => !/JAVA_TOOL_OPTIONS/.test(l)).join('\n')); process.exit(1) }
