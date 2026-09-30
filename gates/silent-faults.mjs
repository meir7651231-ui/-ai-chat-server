#!/usr/bin/env node
// faults: a failure in the app is reported (Trace.e -> the black box -> the page), never swallowed. Counted in the
// Kotlin: an empty catch block, and a runCatching { ... } whose failure nobody looks at - nothing after its closing
// brace (onFailure, getOrNull, getOrDefault, getOrElse, isSuccess, isFailure, exceptionOrNull, fold). A line may say why
// silence is right with "fault-ok: <why>". The goal is zero; today's count is the ceiling in gates/silent-faults.json
// and only goes down (--lower).
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'), SRC = join(ROOT, 'android/app/src/main/java/il/liba/app')
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.kt') ? [p] : [] })
/* the index just past the brace that closes the one at `open`, skipping strings (with ${...} inside) and comments */
function close(t, open) { let d = 0, i = open
  while (i < t.length) { const c = t[i]
    if (c === '/' && t[i + 1] === '/') { i = t.indexOf('\n', i); if (i < 0) return t.length; continue }
    if (c === '/' && t[i + 1] === '*') { i = t.indexOf('*/', i) + 2; continue }
    if (c === '"') { const triple = t.startsWith('"""', i); i += triple ? 3 : 1; let sd = 0
      while (i < t.length) { if (!triple && t[i] === '\\') { i += 2; continue } if (t[i] === '$' && t[i + 1] === '{') { sd++; i += 2; continue } if (sd && t[i] === '}') { sd--; i++; continue }
        if (!sd && (triple ? t.startsWith('"""', i) : t[i] === '"')) { i += triple ? 3 : 1; break } i++ } continue }
    if (c === "'") { i = t[i + 1] === '\\' ? i + 4 : i + 3; continue }
    if (c === '{') d++; else if (c === '}') { d--; if (d === 0) return i + 1 }
    i++ }
  return t.length }
const found = []
for (const f of walk(SRC)) { const t = readFileSync(f, 'utf8'), lines = t.split('\n'), lineOf = k => t.slice(0, k).split('\n').length
  lines.forEach((l, i) => { if (/catch \(\w+: [\w.]+\) \{\s*\}/.test(l) && !/fault-ok: \S/.test(l)) found.push(`${relative(SRC, f)}:${i + 1} catch ריק`) })
  for (const m of t.matchAll(/runCatching \{/g)) { const end = close(t, m.index + m[0].length - 1), after = t.slice(end, end + 80).replace(/^\s+/, '')
    const ln = lineOf(m.index); if (/fault-ok: \S/.test(lines[ln - 1]) || /fault-ok: \S/.test(lines[lineOf(end) - 1])) continue
    if (!/^\.(onFailure|getOrNull|getOrDefault|getOrElse|isSuccess|isFailure|exceptionOrNull|fold)\b/.test(after)) found.push(`${relative(SRC, f)}:${ln} runCatching בלי טיפול`) } }
const bf = join(ROOT, 'gates/silent-faults.json'); const base = JSON.parse(readFileSync(bf, 'utf8'))
if (process.argv.includes('--lower') && found.length < base.max) { base.max = found.length; writeFileSync(bf, JSON.stringify(base, null, 2) + '\n') }
const ok = found.length <= base.max
console.log(`silent-faults: ${found.length} כשלים שקטים בקוטלין (תקרה ${base.max}, היעד אפס)` + (ok ? '' : '\n  ' + found.join('\n  '))); process.exit(ok ? 0 : 1)
