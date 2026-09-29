#!/usr/bin/env node
// The bridge has one definition: protocol/protocol.json. This fails when either side drifts from it.
import { readFileSync, readdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const P = JSON.parse(readFileSync(join(ROOT, 'protocol/protocol.json'), 'utf8'))
const bad = []
// 1. generated files are exactly what the contract produces
try { execFileSync('node', [join(ROOT, 'tools/gen-protocol.mjs'), '--check'], { stdio: ['ignore', 'pipe', 'pipe'] }) }
catch (e) { bad.push(String(e.stderr || e).trim()) }
// 2. the page: no message name typed by hand; every PROTO reference exists; every app->page message handled
const SRC = join(ROOT, 'liba/src')
const page = readdirSync(SRC).filter(f => f.endsWith('.js') && f !== '00-protocol.js').map(f => [f, readFileSync(join(SRC, f), 'utf8')])
for (const [f, s] of page) {
  for (const m of s.matchAll(/post\('(\w+)'|d\.liba==='(\w+)'/g)) bad.push(`${f}: שם מסר בכתב יד — ${m[0]}`)
  for (const m of s.matchAll(/PROTO\.(toApp|toPage)\.(\w+)/g)) if (!P[m[1]][m[2]]) bad.push(`${f}: ${m[0]} אינו בחוזה`)
}
const all = page.map(x => x[1]).join('\n')
for (const k of Object.keys(P.toPage)) if (!all.includes(`d.liba===PROTO.toPage.${k}`)) bad.push(`הדף לא מטפל ב-${k} — האפליקציה שולחת אותו והוא נבלע`)
for (const k of Object.keys(P.toApp)) if (!all.includes(`PROTO.toApp.${k}`)) bad.push(`הדף אף פעם לא שולח ${k} — חוזה מת`)
// 3. Kotlin: JsBridge is bound to the generated interface; no relay typed by hand; every sender it calls exists
const K = join(ROOT, 'android/app/src/main/java/il/liba/app')
const web = readFileSync(join(K, 'LibaWeb.kt'), 'utf8')
if (!/class JsBridge\(val b: Bridge\) : ProtocolBridge/.test(web)) bad.push('LibaWeb.kt: JsBridge אינו מממש את ProtocolBridge')
if (/d\.liba===?['"]/.test(web)) bad.push('LibaWeb.kt: relay בכתב יד — הוא חייב לבוא מ-Protocol.RELAY')
// window variables the app may set are exactly those the contract's senders read (hello: window.__libaVer, …)
const read = Object.values(P.toPage).flatMap(m => Object.values(m.from || {})).flatMap(v => String(v).match(/__liba\w+/g) || [])
const senders = new Set(Object.keys(P.toPage).map(k => '__liba' + k[0].toUpperCase() + k.slice(1)).concat(['__libaRect', '__libaSend'], read))
for (const f of readdirSync(K).filter(f => f.endsWith('.kt') && f !== 'Protocol.kt'))
  for (const m of readFileSync(join(K, f), 'utf8').matchAll(/window\.(__liba\w+)/g)) if (!senders.has(m[1])) bad.push(`${f}: קורא ל-${m[1]} שאינו בחוזה`)
if (bad.length) { console.error(`protocol: ${bad.length} פערים מול החוזה:\n  ` + bad.join('\n  ')); process.exit(1) }
console.log(`protocol: חוזה ${P.version} · ${Object.keys(P.toApp).length} מסרים לבועה, ${Object.keys(P.toPage).length} לדף · שני הצדדים תואמים`)
