#!/usr/bin/env node
/**
 * step signed-commands: the only way to make a command (or a pikuach nefesh message) the phone will obey. Prints the inbox
 * document, signed with Ed25519; write it to inbox/<id> in the channel. Nothing unsigned makes the phone act.
 *   node tools/cmd.mjs "open https://github.com/..."        a command, valid 30 minutes
 *   node tools/cmd.mjs "hey_off" --ttl-min 10
 *   node tools/cmd.mjs --pikuach "טקסט"                      passes Shabbat on a page that is open (not the phone's)
 * The private key is read from $LIBA_CMD_KEY or /home/user/keys/cmd-ed25519.pem - never from the repo.
 * Signed bytes: "cmd|<nonce>|<exp>|<cmd>" or "pikuach|<nonce>|<exp>|<text>" - the phone and the page verify exactly these.
 */
import { readFileSync, existsSync } from 'node:fs'
import { createPrivateKey, sign, randomBytes } from 'node:crypto'
const a = process.argv.slice(2), opt = k => { const i = a.indexOf(k); return i >= 0 ? a.splice(i, 2)[1] : null }
const pikuach = a.includes('--pikuach'); if (pikuach) a.splice(a.indexOf('--pikuach'), 1)
const ttl = +(opt('--ttl-min') || 30), body = a.join(' ').trim()
if (!body) { console.error('cmd: צריך פקודה או טקסט'); process.exit(1) }
const keyPath = process.env.LIBA_CMD_KEY || '/home/user/keys/cmd-ed25519.pem'
if (!existsSync(keyPath)) { console.error('cmd: אין מפתח ב-' + keyPath + ' (הגיבוי: secrets/cmd-signing במסד הערוץ)'); process.exit(1) }
const key = createPrivateKey(readFileSync(keyPath, 'utf8'))
const now = Date.now(), nonce = randomBytes(9).toString('base64url'), exp = now + ttl * 60000
const msg = (pikuach ? 'pikuach|' : 'cmd|') + nonce + '|' + exp + '|' + body
const sig = sign(null, Buffer.from(msg, 'utf8'), key).toString('base64')
const id = (pikuach ? 'pk-' : 'cmd-') + now.toString(36)
const doc = pikuach ? { from: 'manager', kind: 'say', priority: 'urgent', pikuach: true, speaker: 'המנהל', topic: 'פיקוח נפש', text: body, nonce, exp, sig, spoken: false, ts: now }
  : { from: 'manager', kind: 'cmd', cmd: body, nonce, exp, sig, spoken: false, ts: now }
console.log(JSON.stringify({ id, doc }, null, 1))
