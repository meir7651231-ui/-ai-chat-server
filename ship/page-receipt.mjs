#!/usr/bin/env node
// Run right after publishing dist/liba-call.html to the channel artifact. It records WHICH build went
// out and from WHICH commit, so "what is on Meir's phone" is a fact in the repo, not a memory.
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const map = JSON.parse(readFileSync(join(root, 'dist/page.map.json'), 'utf8'))
const page = Number(readFileSync(join(root, 'PAGE'), 'utf8').trim())
const commit = execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const dirty = execFileSync('git', ['-C', root, 'status', '--porcelain', 'liba/src', 'liba-call.html'], { encoding: 'utf8' }).trim()
if (dirty) { console.error('page-receipt: יש שינויים לא מחויבים בדף — קבלה חייבת להצביע על קומיט שבאמת מכיל את מה שפורסם'); process.exit(1) }
const f = join(root, 'ship/published.json')
const pub = JSON.parse(readFileSync(f, 'utf8'))
Object.assign(pub, { page, pageHash: map.pageHash, pageCommit: commit, pageAt: new Date().toISOString(), pageBy: process.argv[2] || 'ליבה' })
writeFileSync(f, JSON.stringify(pub, null, 1) + '\n')
console.log(`page-receipt: דף ${page} · ${map.pageHash} · ${commit.slice(0, 7)}`)
