#!/usr/bin/env node
// step 1 (one-tree-one-version): version.json is GENERATED from VERSION. Never edited by hand.
import { readFileSync, writeFileSync } from 'node:fs'
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

export function writeVersionJson({ sha256, commit, notes }) {
  const v = version()
  const url = `https://raw.githubusercontent.com/meir7651231-ui/-ai-chat-server/${commit}/dist/liba.apk`
  const json = { ...v, url, sha256, commit, notes }
  // stays at the repo root on purpose: every installed copy already reads
  // raw.githubusercontent.com/.../liba-android/version.json. Moving it would cut them off.
  writeFileSync(join(ROOT, 'version.json'), JSON.stringify(json) + '\n')
  return json
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(version()))
