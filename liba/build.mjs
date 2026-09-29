#!/usr/bin/env node
/**
 * step page-kernel: the page is built, not edited.
 *
 *   node liba/build.mjs            liba/src/*.js + page.html  ->  dist/liba-call.html, dist/page.map.json
 *   node liba/build.mjs --check    build in memory and fail if liba-call.html is not exactly the build
 *
 * The sources are concatenated in file-name order into ONE script, so they share one scope exactly
 * as the single hand-written file did - moving code into files changes nothing about how it runs.
 * esbuild parses the result before anything is written: a syntax error never reaches the phone.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { transformSync } from 'esbuild'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const SRC = join(HERE, 'src')
const CHECK = process.argv.includes('--check')

const files = readdirSync(SRC).filter(f => /^\d\d-.*\.js$/.test(f)).sort()
const shell = readFileSync(join(SRC, 'page.html'), 'utf8')
const [before, after] = shell.split('/*@@SCRIPT@@*/\n')
if (after === undefined) throw new Error('page.html: אין /*@@SCRIPT@@*/')

// each source starts with "// @anchor: name" and a one-line description; those two lines are
// build metadata and do not enter the bundle, so the output stays the program it always was.
const pieces = files.map(f => {
  const text = readFileSync(join(SRC, f), 'utf8')
  const lines = text.split('\n')
  const anchor = (/^\/\/ @anchor:\s*(\S+)/.exec(lines[0]) || [])[1]
  if (!anchor) throw new Error(`${f}: השורה הראשונה חייבת להיות // @anchor: <name>`)
  const body = lines.slice(2).join('\n').replace(/\n$/, '')
  return { f, anchor, body }
})

let script = pieces.map(p => p.body).join('\n')
const hash = createHash('sha256').update(script.replace(/__PAGE_HASH__/g, '')).digest('hex').slice(0, 12)
script = script.replace(/__PAGE_HASH__/g, JSON.stringify(hash))

try { transformSync(script, { loader: 'js' }) }
catch (e) { console.error('build: הסקריפט לא עובר פרסור\n' + e.message); process.exit(1) }

const html = before + script + '\n' + after

// anchor map: every source file and every top-level function, to a line in the built page
const scriptStart = before.split('\n').length
const map = {}
let line = scriptStart
for (const p of pieces) {
  map[p.anchor] = { src: `liba/src/${p.f}`, line }
  p.body.split('\n').forEach((l, i) => {
    const m = /^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/.exec(l)
    if (m) map[`${p.anchor}.${m[1]}`] = { src: `liba/src/${p.f}:${i + 3}`, line: line + i }
  })
  line += p.body.split('\n').length
}

if (CHECK) {
  const live = readFileSync(join(ROOT, 'liba-call.html'), 'utf8')
  if (live !== html) { console.error('build --check: liba-call.html אינו הבנייה של liba/src — מישהו ערך את התוצר ביד, או ששכחו לבנות'); process.exit(1) }
  console.log(`build --check: liba-call.html זהה לבנייה · ${pieces.length} קבצים · pageHash ${hash}`)
  process.exit(0)
}

mkdirSync(join(ROOT, 'dist'), { recursive: true })
writeFileSync(join(ROOT, 'dist/liba-call.html'), html)
writeFileSync(join(ROOT, 'dist/page.map.json'), JSON.stringify({ pageHash: hash, anchors: map }, null, 1) + '\n')
writeFileSync(join(ROOT, 'liba-call.html'), html)
console.log(`build: ${pieces.length} קבצים · ${Object.keys(map).length} עוגנים · pageHash ${hash} · ${html.length} בתים`)
