#!/usr/bin/env node
// step test-gate-real: what is on the phone, compared with what was shipped. Three answers, never two:
//   confirmed  - the phone reported the shipped build after it was shipped
//   pending    - the phone has not reported since the ship (offline, or has not reopened the page)
//   mismatch   - the phone reported AFTER the ship, and runs something else: a stuck page or a failed install
// "pending" is not a pass. It is printed as its own state and exits 2, so nobody reads it as green.
import { readFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const require_git = a => execFileSync('git', ['-C', root, ...a], { encoding: 'utf8' }).trim()
const pub = JSON.parse(readFileSync(join(root, 'ship/published.json'), 'utf8'))
const ver = JSON.parse(readFileSync(join(root, 'version.json'), 'utf8'))
const live = existsSync(join(root, 'ship/live.json')) ? JSON.parse(readFileSync(join(root, 'ship/live.json'), 'utf8')) : null
const pageAt = pub.pageAt ? Date.parse(pub.pageAt) : 0
const rows = []
const judge = (what, shipped, seen, since) => {
  if (!live || live.deviceAt < since) return rows.push(['pending', `${what}: נשלח ${shipped}, המכשיר עוד לא דיווח מאז`])
  rows.push(seen === shipped ? ['confirmed', `${what}: ${seen} רץ על המכשיר`] : ['mismatch', `${what}: נשלח ${shipped} אבל המכשיר דיווח ${seen} אחרי השילוח`])
}
judge('דף', pub.pageHash, live && live.pageHash, pageAt)
// before shippedAt existed: the time of the commit that wrote version.json is when it went out
let shipped = ver.shippedAt ? Date.parse(ver.shippedAt) : 0
if (!shipped) { try { shipped = 1000 * +require_git(['log', '-1', '--format=%ct', '--', 'version.json']) } catch {} }
judge('אפליקציה', ver.versionName, live && live.app, shipped)
rows.forEach(([s, t]) => console.log(`${s === 'confirmed' ? '✓' : s === 'pending' ? '…' : '✗'} ${t}`))
process.exit(rows.some(r => r[0] === 'mismatch') ? 1 : rows.some(r => r[0] === 'pending') ? 2 : 0)
