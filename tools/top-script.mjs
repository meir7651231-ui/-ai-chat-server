#!/usr/bin/env node
// Assemble LibaWeb.TOP_SCRIPT exactly as Kotlin does (raw string + ${Protocol.RELAY} + ${Protocol.SENDERS})
// so it can be parsed and run in a browser without an Android device. Prints the script.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const K = join(dirname(fileURLToPath(import.meta.url)), '..', 'android/app/src/main/java/il/liba/app')
const raw = (src, name) => { const i = src.indexOf(`${name} = """`); if (i < 0) throw new Error('no ' + name); const a = src.indexOf('"""', i) + 3; return src.slice(a, src.indexOf('"""', a)) }
const proto = readFileSync(join(K, 'Protocol.kt'), 'utf8'), web = readFileSync(join(K, 'LibaWeb.kt'), 'utf8')
export const topScript = () => raw(web, 'TOP_SCRIPT').replace('${Protocol.RELAY}', raw(proto, 'RELAY')).replace('${Protocol.SENDERS}', raw(proto, 'SENDERS'))
if (process.argv[1] === fileURLToPath(import.meta.url)) process.stdout.write(topScript())
