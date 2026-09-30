#!/usr/bin/env node
// step 1 (one-tree-one-version): version.json is GENERATED from VERSION. Never edited by hand.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createPrivateKey, sign as edSign } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

export function version() {
  const raw = readFileSync(join(ROOT, 'VERSION'), 'utf8')
  const map = Object.fromEntries(
    raw.split('\n').filter(Boolean).map(l => l.split('=').map(s => s.trim())),
  )
  const code = Number(map.versionCode)
  if (!Number.isInteger(code) || code <= 0) throw new Error(`VERSION: versionCode לא תקין: ${map.versionCode}`)
  if (!/^\d+\.\d+\.\d+$/.test(map.versionName || '')) throw new Error(`VERSION: versionName לא תקין: ${map.versionName}`)
  return { versionCode: code, versionName: map.versionName }
}

/* step update-trust: the manifest is signed (Ed25519, the command key, over "v1|versionCode|sha256|url"); the phone believes
   nothing unsigned. The key lives outside the repo; without it nothing ships. */
function signManifest(code, sha256, url) {
  const keyPath = process.env.LIBA_CMD_KEY || '/home/user/keys/cmd-ed25519.pem'
  if (!existsSync(keyPath)) throw new Error('אין מפתח לחתימת הגרסה ב-' + keyPath + ' (הגיבוי: secrets/cmd-signing)')
  return edSign(null, Buffer.from('v1|' + code + '|' + sha256 + '|' + url, 'utf8'), createPrivateKey(readFileSync(keyPath, 'utf8'))).toString('base64')
}
export function writeVersionJson({ sha256, commit, notes }) {
  const v = version()
  const url = `https://raw.githubusercontent.com/meir7651231-ui/-ai-chat-server/${commit}/dist/liba.apk`
  const json = { ...v, url, sha256, sig: signManifest(v.versionCode, sha256, url), commit, notes, shippedAt: new Date().toISOString() }
  // stays at the repo root on purpose: every installed copy already reads
  // raw.githubusercontent.com/.../liba-android/version.json. Moving it would cut them off.
  writeFileSync(join(ROOT, 'version.json'), JSON.stringify(json) + '\n')
  return json
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(version()))
