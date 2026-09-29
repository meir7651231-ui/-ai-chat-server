#!/usr/bin/env node
// The repo is public. A keystore or its password in a commit is not recoverable by deleting it later.
import { execFileSync } from 'node:child_process'
const sh = c => { try { return execFileSync('bash', ['-lc', c], { encoding: 'utf8' }).trim() } catch { return '' } }
const tracked = sh("git ls-files | grep -E '\\.jks$|\\.keystore$|keystore\\.properties$|\\.p12$|\\.pem$' || true")
if (tracked) { console.error('no-secret: חומר חתימה במעקב git:\n  ' + tracked.split('\n').join('\n  ')); process.exit(1) }
// a literal password only: %s (printf format), ${...} (shell/secrets) and an empty value are fine
const inFiles = sh("git ls-files -z | xargs -0 grep -lE '(store|key)Password=[^$%\\n\\\"'\\''[:space:]]' 2>/dev/null || true")
if (inFiles) { console.error('no-secret: סיסמת חתימה בקובץ במעקב:\n  ' + inFiles.split('\n').join('\n  ')); process.exit(1) }
// second-channel: a private key pasted into any tracked file (the urgent.json signing key lives in /home/user/keys only)
const pk = sh("git ls-files -z | xargs -0 grep -lE 'BEGIN (EC |OPENSSH |RSA )?PRIVATE KEY' 2>/dev/null || true")
if (pk) { console.error('no-secret: מפתח פרטי בקובץ במעקב:\n  ' + pk.split('\n').join('\n  ')); process.exit(1) }
console.log('no-secret: אין חומר חתימה בריפו')
