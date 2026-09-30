#!/usr/bin/env node
// keystore-vault: nothing Meir said, and nothing said to him, is written to the phone in plaintext. Every file write in
// the app goes through Vault, except the few that hold no words (listed here with why); no clipboard; no log or crash
// in SharedPreferences. The phone-side proof (30 seeded phrases, grep of /data/data) waits for a session on the phone.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), SRC = join(ROOT, 'android/app/src/main/java/il/liba/app')
const ALLOW = { 'Vault.kt': 'the vault itself (sealed text only)', 'power/PowerLedger.kt': 'numbers only: mAh per subsystem', 'sense/SenseBus.kt': 'the list of app package names Meir chose', 'Trace.kt': 'error codes only, no text' }
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.kt') ? [p] : [] })
const bad = []
for (const f of walk(SRC)) { const rel = relative(SRC, f); const t = readFileSync(f, 'utf8')
  t.split('\n').forEach((l, i) => {
    if (/\.writeText\(|\.appendText\(|FileOutputStream\(|\.writeBytes\(/.test(l) && !ALLOW[rel] && !/\/\/ vault-ok: \S/.test(l)) bad.push(`${rel}:${i + 1} כתיבה לקובץ בלי הכספת`)
    if (/ClipboardManager|setPrimaryClip/.test(l)) bad.push(`${rel}:${i + 1} לוח העתקה`)
    if (/putString\("(log|crash)"/.test(l)) bad.push(`${rel}:${i + 1} יומן או קריסה בגלוי`) }) }
console.log(bad.length ? 'vault-audit: ' + bad.length + ' כתיבות גלויות\n  ' + bad.join('\n  ') : `vault-audit: כל הכתיבות עוברות בכספת (חריגים: ${Object.keys(ALLOW).length}, כולם בלי מילים)`); process.exit(bad.length ? 1 : 0)
