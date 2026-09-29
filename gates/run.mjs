#!/usr/bin/env node
// Every gate, one line each, X/N at the end. Exit 1 if any failed — this is what CI runs.
import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const gates = readdirSync(here).filter(f => f.endsWith('.mjs') && f !== 'run.mjs').sort()
const extra = [
  ['page-static', 'node tests/page.test.js'],
  ['page-live', 'NODE_PATH=$(npm root -g) node tests/page.e2e.js'],
  ['bridge-live', 'NODE_PATH=$(npm root -g) node tests/bridge.e2e.js'],
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
    lines.push(`✓ ${name.padEnd(14)} ${(out.match(/^PASS/gm) || []).length} בדיקות`); pass++
  } catch (e) {
    lines.push(`✗ ${name.padEnd(14)} ${String(e.message || e).trim().split('\n').slice(0, 3).join(' | ')}`)
  }
}
const total = gates.length + extra.length
console.log(lines.join('\n'))
console.log(`\n${pass}/${total} שערים עברו`)
process.exit(pass === total ? 0 : 1)
