#!/usr/bin/env node
// Every database path the page touches lives in liba/src/00-paths.js. A path typed anywhere else is
// how two pieces of code end up writing "memory/notes" and "memory/note" and nobody notices.
import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const src = join(dirname(fileURLToPath(import.meta.url)), '..', 'liba', 'src')
const bad = []
for (const f of readdirSync(src).filter(f => f.endsWith('.js') && f !== '00-paths.js')) {
  readFileSync(join(src, f), 'utf8').split('\n').forEach((l, i) => { if (/\bdb\.(doc|collection)\(/.test(l)) bad.push(`${f}:${i + 1}`) })
}
if (bad.length) { console.error(`db-paths: ${bad.length} נתיבים מחוץ ל-00-paths.js:\n  ` + bad.join('\n  ')); process.exit(1) }
console.log('db-paths: כל נתיבי המסד בקובץ אחד')
