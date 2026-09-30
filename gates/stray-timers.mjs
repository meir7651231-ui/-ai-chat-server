#!/usr/bin/env node
// duty-governor: a periodic timer longer than five seconds belongs on the governor's one pulse, not on a chain of its own.
// The goal is zero; today's count is the ceiling (gates/stray-timers.json), and it may only go down - a new long timer
// fails the build, a removed one lowers the ceiling with --lower.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const num = s => { s = s.replace(/_/g, '').replace(/L$/, ''); try { return Function('"use strict";return (' + s + ')')() } catch { return NaN } }
const found = []
const kt = readFileSync(join(ROOT, 'android/app/src/main/java/il/liba/app/BubbleService.kt'), 'utf8').split('\n')
kt.forEach((l, i) => { for (const m of l.matchAll(/postDelayed\([^,()]+(?:\([^()]*\))?,\s*([0-9_*L. ]+)\)/g)) { const v = num(m[1]); if (v > 5000) found.push(`BubbleService.kt:${i + 1} ${v}ms`) } })
for (const f of readdirSync(join(ROOT, 'liba/src')).filter(f => f.endsWith('.js')).sort()) readFileSync(join(ROOT, 'liba/src', f), 'utf8').split('\n').forEach((l, i) => {
  for (const m of l.matchAll(/setInterval\([^;]*?,\s*([0-9_*e. ]+)\)/g)) { const v = num(m[1]); if (v > 5000) found.push(`${f}:${i + 1} ${v}ms`) } })
const bf = join(ROOT, 'gates/stray-timers.json'); const base = JSON.parse(readFileSync(bf, 'utf8'))
if (process.argv.includes('--lower') && found.length < base.max) { base.max = found.length; writeFileSync(bf, JSON.stringify(base, null, 2) + '\n') }
const ok = found.length <= base.max
console.log(`stray-timers: ${found.length} טיימרים מחזוריים ארוכים מחוץ לדופק (תקרה ${base.max}, היעד אפס)` + (ok ? '' : '\n  ' + found.join('\n  '))); process.exit(ok ? 0 : 1)
