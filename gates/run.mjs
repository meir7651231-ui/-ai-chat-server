#!/usr/bin/env node
// Every gate, one line each, X/N at the end. Exit 1 if any failed — this is what CI runs.
import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const gates = readdirSync(here).filter(f => f.endsWith('.mjs') && f !== 'run.mjs' && f !== 'field.mjs').sort()
const extra = [
  ['page-static', 'node tests/page.test.js'],
  ['page-live', 'node tests/page.e2e.js'],
  ['bridge-live', 'node tests/bridge.e2e.js'],
  ['req-ids', 'node tests/req-spine.test.js'],
  ['key-rotation', 'bash keys/rotation-drill.sh'],
  ['state-table', 'node tests/machine.test.js'],
  ['wal-chaos', 'WIPE=1 CHAOS=45 node tests/wal.chaos.js'],
  ['capacity', 'node tests/capacity.sim.js'],
  ['telemetry', 'node tests/telemetry.test.js'],
  ['budget', 'node tests/budget.gate.js && node tests/budget.gate.js --self-test'],
  ['inbox-chaos', 'node tests/inbox.chaos.js'],
  ['freshness', 'node tests/stale.test.js'],
  ['owner-lease', 'node tests/lease.test.js'],
  ['silence', 'node tests/silence.test.js'],
  ['urgent', 'node tests/urgent.test.mjs'],
  ['intents', 'node tests/intents.test.js'],
  ['stream', 'node tests/stream.test.js'],
  ['days', 'node tests/days.test.js'],
  ['memory', 'node tests/memory.test.js'],
  ['recall7', 'node tests/recall7.js'],
  ['people', 'node tests/people.test.js'],
]

let pass = 0
const lines = []
for (const g of gates) {
  const name = g.replace('.mjs', '')
  try {
    const out = execFileSync('node', [join(here, g)], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    lines.push(`✓ ${name.padEnd(14)} ${out.trim().split('\n')[0]}`); pass++
  } catch (e) {
    lines.push(`✗ ${name.padEnd(14)} ${String(e.stderr || e.stdout || e).trim().split('\n').slice(0, 3).join(' | ')}`)
  }
}
for (const [name, cmd] of extra) {
  try {
    const out = execFileSync('bash', ['-lc', cmd], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    const fails = (out.match(/^FAIL/gm) || []).length
    if (fails) throw new Error(out.split('\n').filter(l => l.startsWith('FAIL')).slice(0, 3).join(' | '))
    const n = (out.match(/^PASS/gm) || []).length
    lines.push(`✓ ${name.padEnd(14)} ${n ? n + ' בדיקות' : out.trim().split('\n').pop()}`); pass++
  } catch (e) {
    // what the check itself said (its FAIL / HARNESS lines), not only that the command failed - CI shows nothing else
    const said = String(e.stdout || '').split('\n').filter(l => /^(FAIL|HARNESS|✗)/.test(l)).slice(0, 4)
    lines.push(`✗ ${name.padEnd(14)} ${(said.length ? said : String(e.message || e).trim().split('\n')).slice(0, 4).join(' | ')}`)
  }
}
const total = gates.length + extra.length
console.log(lines.join('\n'))
console.log(`\n${pass}/${total} שערים עברו`)
// the field is its own category: what the phone reported, not what the repo says. Printed every time,
// never folded into the count - a phone that is offline is neither a pass nor a code failure.
try { const out = execFileSync('node', [join(here, 'field.mjs')], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); console.log('שטח:\n' + out.trim().replace(/^/gm, '  ')) }
catch (e) { console.log('שטח:\n' + String(e.stdout || '').trim().replace(/^/gm, '  ')) }
process.exit(pass === total ? 0 : 1)
