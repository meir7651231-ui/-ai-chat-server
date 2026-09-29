#!/usr/bin/env node
// Fails if the version number appears anywhere but VERSION. Three numbers that can disagree
// is how "תתקין" ends with the old app and nobody knows.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
const sh = c => { try { return execFileSync('bash', ['-lc', c], { encoding: 'utf8' }).trim() } catch { return '' } }
const repo = sh('git rev-parse --show-toplevel')
const ver = Object.fromEntries(readFileSync(`${repo}/VERSION`, 'utf8').split('\n').filter(Boolean).map(l => l.split('=').map(s => s.trim())))
const bad = sh(`grep -rn 'versionCode = [0-9]\\|versionName = "' '${repo}/android' || true`).split('\n').filter(Boolean)
if (bad.length) { console.error('one-version: מספר גרסה קשיח:\n  ' + bad.join('\n  ')); process.exit(1) }
const dist = sh(`cat '${repo}/version.json' 2>/dev/null || echo '{}'`)
const j = JSON.parse(dist || '{}')
if (j.versionCode && String(j.versionCode) !== ver.versionCode) {
  console.error(`one-version: version.json אומר ${j.versionCode} ו-VERSION אומר ${ver.versionCode}`); process.exit(1)
}
console.log(`one-version: ${ver.versionName} (${ver.versionCode}) — מקור יחיד`)
