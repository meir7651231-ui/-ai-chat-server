#!/usr/bin/env node
// version.json is a promise about a specific file. This gate checks the promise is true:
// the APK in the tree hashes to what version.json claims, carries the pinned signer,
// and its versionCode is the one in VERSION.
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
const sh = c => { try { return execFileSync('bash', ['-lc', c], { encoding: 'utf8' }).trim() } catch (e) { return `__ERR__${e.stderr || e.stdout || e}` } }
const repo = sh('git rev-parse --show-toplevel')
const ver = Object.fromEntries(readFileSync(`${repo}/VERSION`, 'utf8').split('\n').filter(Boolean).map(l => l.split('=').map(s => s.trim())))
const j = JSON.parse(readFileSync(`${repo}/version.json`, 'utf8'))
const apk = `${repo}/dist/liba.apk`

if (!j.sha256) {
  console.error(`apk-hash: version.json (${j.versionName}) עדיין בלי sha256 — נכתב לפני שער השילוח. ירוק רק אחרי שילוח אחד דרך ship/release.mjs`)
  process.exit(1)
}
if (!existsSync(apk)) { console.error('apk-hash: version.json מבטיח sha256 אבל dist/liba.apk לא קיים'); process.exit(1) }
const got = createHash('sha256').update(readFileSync(apk)).digest('hex')
if (got !== j.sha256) { console.error(`apk-hash: הקובץ ${got.slice(0, 16)}… ו-version.json מבטיח ${String(j.sha256).slice(0, 16)}…`); process.exit(1) }
const APKSIGNER = process.env.APKSIGNER || '/opt/android-sdk/build-tools/34.0.0/apksigner'
const certs = sh(`${APKSIGNER} verify --print-certs ${JSON.stringify(apk)}`)
if (certs.startsWith('__ERR__')) { console.error(`apk-hash: apksigner נכשל או חסר (${APKSIGNER}) — ${certs.slice(7, 160).trim()}`); process.exit(1) }
const pinned = readFileSync(`${repo}/keys/PINNED.sha256`, 'utf8').split('\n').map(s => s.trim()).find(s => /^[0-9a-f]{64}$/.test(s))
const signer = (certs.match(/SHA-256 digest:\s*([0-9a-f]{64})/i) || [])[1]
if (signer !== pinned) { console.error(`apk-hash: חותם ${String(signer).slice(0, 16)}… במקום ${pinned.slice(0, 16)}…`); process.exit(1) }
if (String(j.versionCode) !== ver.versionCode) { console.error(`apk-hash: version.json ${j.versionCode} מול VERSION ${ver.versionCode}`); process.exit(1) }
console.log(`apk-hash: ${j.versionName} · ${got.slice(0, 16)}… · חותם נעוץ`)
