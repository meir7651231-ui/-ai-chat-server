#!/usr/bin/env node
/**
 * step protocol-contract: protocol/protocol.json -> both sides of the bridge.
 *
 *   node tools/gen-protocol.mjs          write android/.../Protocol.kt and liba/src/00-protocol.js
 *   node tools/gen-protocol.mjs --check  fail if either generated file differs from what it would write
 *
 * Kotlin gets constants, the relay JS for the top frame, the senders, and an interface that JsBridge
 * must implement - a message in the contract with no Kotlin method does not compile. The page gets a
 * frozen table; gates/protocol.mjs fails on any message name typed by hand.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const P = JSON.parse(readFileSync(join(ROOT, 'protocol/protocol.json'), 'utf8'))
const CHECK = process.argv.includes('--check')
const canon = JSON.stringify({ version: P.version, caps: P.caps, toApp: P.toApp, toPage: P.toPage })
const HASH = createHash('sha256').update(canon).digest('hex').slice(0, 12)
const HEAD = 'GENERATED from protocol/protocol.json by tools/gen-protocol.mjs - do not edit; edit the contract and regenerate'

const type = t => t.split('=')[0]
const dflt = t => t.split('=')[1]
const cap = s => s[0].toUpperCase() + s.slice(1)
const js = x => JSON.stringify(x)

// page -> app: one relay line per message, each field coerced to its declared type
const relay = Object.entries(P.toApp).map(([name, m]) => {
  const args = Object.entries(m.fields).map(([f, t]) =>
    type(t) === 'int' ? `Number(d.${f}||0)` : type(t) === 'list' ? `JSON.stringify(d.${f}||[])` : `String(d.${f}||${js(dflt(t) || '')})`)
  return `if(d.liba===${js(name)}){${m.relay || ''}LibaBridge.${name}(${args.join(',')});}`
}).join('\n    else ')

// app -> page: window.__libaX(args...) posts {liba:'x', ...} to every frame
const senders = Object.entries(P.toPage).map(([name, m]) => {
  const fields = Object.keys(m.fields)
  if (m.from) {
    const body = fields.map(f => `${f}:${m.from[f] === 'HASH' ? js(HASH) : m.from[f] === 'VERSION' ? P.version : m.from[f] === 'CAPS' ? js(P.caps) : m.from[f]}`).join(',')
    return `window.__liba${cap(name)}=function(){window.__libaSend(${js(name)},{${body}});};`
  }
  return `window.__liba${cap(name)}=function(${fields.join(',')}){window.__libaSend(${js(name)},{${fields.map(f => `${f}:${f}`).join(',')}});};`
}).join('\n  ')

const ktType = t => type(t) === 'int' ? 'Int' : 'String'
const iface = Object.entries(P.toApp).map(([name, m]) =>
  `    fun ${name}(${Object.entries(m.fields).map(([f, t]) => `${f}: ${ktType(t)}`).join(', ')})`).join('\n')
const consts = (side, o) => Object.keys(o).map(n => `        const val ${n.replace(/([A-Z])/g, '_$1').toUpperCase()} = ${js(n)}`).join('\n')

const kt = `// ${HEAD}
package il.liba.app

object Protocol {
    const val VERSION = ${P.version}
    const val HASH = ${js(HASH)}
    val CAPS = listOf(${P.caps.map(js).join(', ')})

    /** page -> app */
    object ToApp {
${consts('toApp', P.toApp)}
    }
    /** app -> page */
    object ToPage {
${consts('toPage', P.toPage)}
    }

    /** Relay for the top frame's message listener: page -> LibaBridge. */
    const val RELAY = """
    ${relay}
"""
    /** Senders the app calls through evaluateJavascript: app -> page. */
    const val SENDERS = """
  window.__libaSend=function(k,o){Array.prototype.slice.call(document.querySelectorAll('iframe')).forEach(function(f){try{f.contentWindow.postMessage(Object.assign({liba:k},o),'*');}catch(e){}});};
  ${senders}
"""
}

/** Every page -> app message in the contract. JsBridge implements this, so a message with no Kotlin side does not compile. */
interface ProtocolBridge {
${iface}
}
`
const page = `// @anchor: protocol
// ${HEAD}
const PROTO=Object.freeze({v:${P.version},hash:${js(HASH)},caps:Object.freeze(${js(P.caps)}),
  toApp:Object.freeze(${js(Object.fromEntries(Object.keys(P.toApp).map(k => [k, k])))}),
  toPage:Object.freeze(${js(Object.fromEntries(Object.keys(P.toPage).map(k => [k, k])))})});
`
const out = [
  [join(ROOT, 'android/app/src/main/java/il/liba/app/Protocol.kt'), kt],
  [join(ROOT, 'liba/src/00-protocol.js'), page],
]
let stale = []
for (const [f, text] of out) {
  if (CHECK) { let cur = ''; try { cur = readFileSync(f, 'utf8') } catch {} if (cur !== text) stale.push(f.replace(ROOT + '/', '')) }
  else writeFileSync(f, text)
}
if (CHECK && stale.length) { console.error(`gen-protocol: לא מעודכן מול החוזה — ${stale.join(', ')}. הרץ node tools/gen-protocol.mjs`); process.exit(1) }
console.log(`gen-protocol: חוזה ${P.version} · ${HASH} · ${Object.keys(P.toApp).length} מסרים לבועה, ${Object.keys(P.toPage).length} לדף${CHECK ? ' · נקי' : ''}`)
