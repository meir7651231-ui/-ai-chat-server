#!/usr/bin/env node
// update-trust: the manifest every installed copy reads must be signed with the command key, over exactly
// "v1|versionCode|sha256|url" - the phone (3.32 on) believes nothing else
import { readFileSync } from 'node:fs'
import { createPublicKey, verify } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUB = (readFileSync(join(ROOT, 'android/app/src/main/java/il/liba/app/Signed.kt'), 'utf8').match(/PUB = "([^"]+)"/) || [])[1]
const v = JSON.parse(readFileSync(join(ROOT, 'version.json'), 'utf8'))
const ok = !!PUB && !!v.sig && /^[0-9a-f]{64}$/.test(v.sha256 || '') && verify(null, Buffer.from('v1|' + v.versionCode + '|' + v.sha256 + '|' + v.url), createPublicKey({ key: Buffer.from(PUB, 'base64'), format: 'der', type: 'spki' }), Buffer.from(v.sig, 'base64'))
console.log(ok ? `version-sig: ${v.versionName} (${v.versionCode}) חתומה` : `version-sig: version.json של ${v.versionName} לא חתום או שהחתימה לא נכונה`); process.exit(ok ? 0 : 1)
