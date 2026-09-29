#!/usr/bin/env node
// Fails if a second source tree exists. Two trees drift; the phone then runs code nobody read.
import { execFileSync } from 'node:child_process'
const sh = c => execFileSync('bash', ['-lc', c], { encoding: 'utf8' }).trim()
const repo = sh('git rev-parse --show-toplevel')
// look where the trees actually live, not only in $HOME (which is /root in this container)
const roots = [...new Set(['/home/user', process.env.HOME || '/root'])].map(d => `'${d}'`).join(' ')
const stray = sh(`find ${roots} -path '*il/liba/app*' -name '*.kt' -not -path '${repo}/android/*' 2>/dev/null || true`)
  .split('\n').filter(Boolean)
const inside = sh(`find '${repo}/android' -path '*il/liba/app*' -name '*.kt' | wc -l`)
if (stray.length) {
  console.error(`one-tree: ${stray.length} קבצי קוטלין מחוץ לעץ:\n  ` + stray.join('\n  '))
  process.exit(1)
}
console.log(`one-tree: ${inside} קבצי קוטלין, כולם ב-android/app/src`)
