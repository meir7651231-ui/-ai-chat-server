#!/usr/bin/env node
// The plan is a graph. A plan nobody can run a check on is a story.
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
try {
  const out = execFileSync('node', [join(root, 'plan/plan.mjs'), '--check'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  console.log(out.trim().split('\n').filter(l => l.startsWith('plan:'))[0] || out.trim())
} catch (e) {
  console.error(String(e.stderr || e.stdout || e).trim()); process.exit(1)
}
