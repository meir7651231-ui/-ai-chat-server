#!/usr/bin/env node
// egress-gate: nothing leaves the page except through the gate (liba/src/34-class.js). Counted outside it: a raw
// window.open; a sendToClaude that is not the one in deliver() right after the gate; a write of words to
// chat/log/turns, decisions, req or work that does not pass dbText(); a crash write that does not pass egress().
import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'liba/src')
const raw = []
for (const f of readdirSync(SRC).filter(f => f.endsWith('.js') && f !== '34-class.js').sort()) {
  const t = readFileSync(join(SRC, f), 'utf8')
  t.split('\n').forEach((l, i) => {
    const at = `${f}:${i + 1}`
    if (/window\.open\(/.test(l)) raw.push(at + ' window.open')
    if (/sendToClaude\(/.test(l) && !(f === '13-send.js' && /comments\.sendToClaude\(\{anchor,text:\(tag\|\|tagOf\(\)\)\+text\}\)/.test(l))) raw.push(at + ' sendToClaude')
    for (const m of l.matchAll(/P\.(turns\(\)\.doc|decisions\(\)\.doc|req)\([^)]*\)\)?\.set\(\{([^}]*)\}/g)) if (/\btext\b|question|answer/.test(m[2]) && !/dbText\(/.test(m[2])) raw.push(at + ' ' + m[1] + ' בלי dbText')
    if (/workOpen\(/.test(l) && !/function workOpen/.test(l) && !/dbText\(/.test(l)) raw.push(at + ' workOpen בלי dbText')
    if (/P\.crash\(/.test(l) && /\.set\(/.test(l) && !/egress\('db:crashes'/.test(l)) raw.push(at + ' crash בלי השער')
  })
}
const deliver = readFileSync(join(SRC, '13-send.js'), 'utf8'); const di = deliver.indexOf('async function deliver(')
const gated = di >= 0 && /if\(!asSaid\)text=egress\('relay'/.test(deliver.slice(di, di + 200))
console.log(`egress-static: raw_egress_outside_gate=${raw.length}` + (gated ? '' : ' · deliver() לא עובר בשער') + (raw.length ? '\n  ' + raw.join('\n  ') : '')); process.exit(raw.length || !gated ? 1 : 0)
