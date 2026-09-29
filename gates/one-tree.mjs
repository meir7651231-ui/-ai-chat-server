#!/usr/bin/env node
// Fails if a second source tree exists. Two trees drift; the phone then runs code nobody read.
// Linked git worktrees of this same repository are not a second tree - they are the same history.
import { execFileSync } from 'node:child_process'
const sh = c => { try { return execFileSync('bash', ['-lc', c], { encoding: 'utf8' }).trim() } catch { return '' } }
const repo = sh('git rev-parse --show-toplevel')
const worktrees = sh('git worktree list --porcelain')
  .split('\n').filter(l => l.startsWith('worktree ')).map(l => l.slice(9).trim()).filter(Boolean)
const known = [...new Set([repo, ...worktrees])]
const roots = [...new Set(['/home/user', process.env.HOME || '/root'])].map(d => `'${d}'`).join(' ')
const prune = known.map(w => `-not -path '${w}/*'`).join(' ')
const stray = sh(`find ${roots} -path '*il/liba/app*' -name '*.kt' ${prune} 2>/dev/null || true`)
  .split('\n').filter(Boolean)
const inside = sh(`find '${repo}/android' -path '*il/liba/app*' -name '*.kt' | wc -l`)
if (stray.length) {
  console.error(`one-tree: ${stray.length} קבצי קוטלין מחוץ לעץ:\n  ` + stray.join('\n  '))
  process.exit(1)
}
console.log(`one-tree: ${inside} קבצי קוטלין, כולם ב-android/app/src`)
