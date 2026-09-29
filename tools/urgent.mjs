#!/usr/bin/env node
/**
 * step second-channel: the path to Meir's ear that does not need the page. Writes urgent.json - signed with Ed25519 -
 * which the bubble polls straight from GitHub when the page has been dead for 20 minutes, and speaks natively.
 *   node tools/urgent.mjs "טקסט דחוף" [--id <inbox id>] [--ttl-hours 6]
 * The item carries the same id as the inbox document it mirrors, so a message the phone already spoke natively is
 * marked spoken in the inbox when the page comes back, and is never said twice. Keeps the newest 10 items.
 * The private key is read from $LIBA_URGENT_KEY or /home/user/keys/urgent-ed25519.pem - never from the repo.
 * Then commit and push urgent.json (the bubble reads the liba-android branch).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createPrivateKey, sign } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..'), out = process.env.LIBA_URGENT_OUT || join(root, 'urgent.json')
const a = process.argv.slice(2), opt = k => { const i = a.indexOf(k); return i >= 0 ? a.splice(i, 2)[1] : null }
const init = a[0] === '--init'; if (init) a.shift()
const id = opt('--id'), ttlH = +(opt('--ttl-hours') || 6), text = a.join(' ').trim()
if (!text && !init) { console.error('urgent: צריך טקסט (או --init לקובץ ריק וחתום)'); process.exit(1) }
const keyPath = process.env.LIBA_URGENT_KEY || '/home/user/keys/urgent-ed25519.pem'
if (!existsSync(keyPath)) { console.error('urgent: אין מפתח חתימה ב-' + keyPath + ' (הגיבוי: secrets/urgent-signing במסד הערוץ)'); process.exit(1) }
const key = createPrivateKey(readFileSync(keyPath, 'utf8'))
let items = []
try { items = JSON.parse(JSON.parse(readFileSync(out, 'utf8')).payload).items || [] } catch {}
const now = Date.now()
items = init ? [] : items.filter(x => x.ts + x.ttl > now)
if (!init) items.push({ id: id || 'u-' + now.toString(36), ts: now, ttl: ttlH * 3600e3, text: text.slice(0, 600) })
items = items.slice(-10)
// the signature is over these exact bytes; the phone verifies them before it parses anything
const payload = JSON.stringify({ v: 1, at: now, items })
const sig = sign(null, Buffer.from(payload, 'utf8'), key).toString('base64')
writeFileSync(out, JSON.stringify({ payload, sig }, null, 1) + '\n')
console.log(`urgent: ${items.length} פריטים חתומים ב-urgent.json${items.length ? ' (האחרון: ' + items[items.length - 1].id + ')' : ''}. עכשיו commit ו-push.`)
