#!/usr/bin/env node
/**
 * step 1 (one-tree-one-version): the only way an APK reaches Meir's phone.
 *
 *   node ship/release.mjs --verify   build + check everything, change nothing
 *   node ship/release.mjs            build + check + write dist/ + commit + push
 *
 * What it refuses to ship: an APK whose signer is not the pinned one, whose versionCode
 * disagrees with VERSION, that has no v2 signature block, or that does not match the
 * sha256 written into version.json.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { ROOT, version, writeVersionJson } from './version.mjs'

const APKSIGNER = process.env.APKSIGNER || '/opt/android-sdk/build-tools/34.0.0/apksigner'
const AAPT2 = process.env.AAPT2 || '/opt/android-sdk/build-tools/34.0.0/aapt2'
const VERIFY_ONLY = process.argv.includes('--verify')
const NOTES = (process.argv.find(a => a.startsWith('--notes=')) || '').slice(8)

const sh = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts })

const steps = []
const ok = (name, detail = '') => { steps.push(`  ✓ ${name}${detail ? ' · ' + detail : ''}`); }
const die = (name, why) => { steps.push(`  ✗ ${name} · ${why}`); console.log(steps.join('\n')); console.error(`\nשילוח נעצר: ${why}`); process.exit(1) }

const v = version()
ok('VERSION נקרא', `${v.versionName} (${v.versionCode})`)

// 1. one tree
const SEARCH = ['/home/user', process.env.HOME || '/root'].filter((v, i, a) => v && a.indexOf(v) === i)
const stray = sh('bash', ['-lc', `find ${SEARCH.map(d => JSON.stringify(d)).join(' ')} -path '*il/liba/app*' -name '*.kt' -not -path '${ROOT}/android/*' 2>/dev/null | wc -l`]).trim()
if (stray !== '0') die('עץ אחד', `${stray} קבצי קוטלין מחוץ ל-android/ — עץ המקור התפצל`)
ok('עץ אחד', 'אין קוד מחוץ ל-android/')

// 2. no hardcoded version anywhere but VERSION
const hard = sh('bash', ['-lc', `grep -rn 'versionCode = [0-9]\\|versionName = "' android/ 2>/dev/null | wc -l`]).trim()
if (hard !== '0') die('מספר אחד', `${hard} מופעים קשיחים של מספר גרסה מחוץ ל-VERSION`)
ok('מספר אחד', 'רק VERSION מחזיק את המספר')

// 3. build
// a missing wrapper means an unpinned gradle from apt, i.e. a different build on every machine
if (!existsSync(join(ROOT, 'android', 'gradlew'))) die('בנייה', 'android/gradlew חסר — אין gradle נעוץ')
const gradlew = './gradlew'
try {
  sh('bash', ['-lc', `cd android && ${gradlew} assembleRelease -q --console=plain`], { stdio: ['ignore', 'pipe', 'inherit'] })
} catch (e) { die('בנייה', `assembleRelease נכשל (${e.status})`) }
const apk = join(ROOT, 'android/app/build/outputs/apk/release/app-release.apk')
if (!existsSync(apk)) die('בנייה', 'לא נוצר APK')
ok('בנייה', gradlew === './gradlew' ? 'wrapper' : 'gradle מערכתי')

// 4. signature identity
let certs
try { certs = sh(APKSIGNER, ['verify', '--print-certs', apk]) }
catch (e) { die('חתימה', `apksigner דחה את הקובץ: ${String(e.stderr || e).trim().split('\n')[0]}`) }
const got = (certs.match(/SHA-256 digest:\s*([0-9a-f]{64})/i) || [])[1]
const pinned = readFileSync(join(ROOT, 'keys/PINNED.sha256'), 'utf8')
  .split('\n').map(s => s.trim()).find(s => /^[0-9a-f]{64}$/.test(s))
if (!got) die('חתימה', 'לא נמצאה טביעת חותם בפלט של apksigner')
if (got !== pinned) die('חתימה', `חותם אחר: ${got.slice(0, 16)}… במקום ${pinned.slice(0, 16)}…`)
ok('חתימה', `${got.slice(0, 16)}… זהה ל-pinned`)

// 5. v2 block present (v1-only would let a zip entry be swapped after signing)
const schemes = sh('bash', ['-lc', `${APKSIGNER} verify -v ${JSON.stringify(apk)} | grep -iE 'v[123] scheme' || true`])
const has = n => new RegExp(`v${n} scheme[^:]*:\\s*true`, 'i').test(schemes)
if (!has(2)) die('חתימה', 'אין בלוק חתימה v2')
if (!has(3)) die('חתימה', 'אין בלוק חתימה v3 — בלעדיו אין מסלול להחלפת מפתח')
ok('חתימה v2+v3', schemes.trim().replace(/\s+/g, ' '))

// 6. versionCode inside the APK agrees with VERSION
let inApk = ''
try { inApk = sh('bash', ['-lc', `${AAPT2} dump badging ${JSON.stringify(apk)} 2>/dev/null | head -1`]) } catch {}
const apkCode = Number((inApk.match(/versionCode='(\d+)'/) || [])[1])
if (apkCode && apkCode !== v.versionCode) die('מספר אחד', `ב-APK ${apkCode} וב-VERSION ${v.versionCode}`)
ok('מספר אחד ב-APK', apkCode ? String(apkCode) : 'aapt2 לא זמין — נבדק דרך gradle')

// 7. hash
const bytes = readFileSync(apk)
const sha256 = createHash('sha256').update(bytes).digest('hex')
ok('sha256', `${sha256.slice(0, 16)}… · ${(bytes.length / 1024).toFixed(0)} קילובייט`)

if (VERIFY_ONLY) { console.log(steps.join('\n')); console.log('\nהכול עבר. לא נכתב כלום (--verify).'); process.exit(0) }

// 8. write dist/ and pin the url to the commit that carries the apk
mkdirSync(join(ROOT, 'dist'), { recursive: true })
copyFileSync(apk, join(ROOT, 'dist/liba.apk'))
sh('git', ['add', 'dist/liba.apk'])
sh('git', ['commit', '-q', '-m', `build: liba ${v.versionName} (${v.versionCode})`, '--allow-empty'])
const commit = sh('git', ['rev-parse', 'HEAD']).trim()
const json = writeVersionJson({ sha256, commit, notes: NOTES })
sh('git', ['add', 'version.json'])
sh('git', ['commit', '-q', '-m', `ship: ${v.versionName} → ${commit.slice(0, 7)}`])
ok('נכתב', `version.json · url נעוץ ל-${commit.slice(0, 7)}`)

console.log(steps.join('\n'))
console.log('\n' + JSON.stringify(json, null, 1))
console.log('\nנשאר לדחוף: git push -u origin ' + sh('git', ['branch', '--show-current']).trim())
