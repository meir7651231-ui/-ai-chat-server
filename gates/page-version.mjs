#!/usr/bin/env node
// The page announces its own contract version to the bubble (channel/device.page). If the number
// baked into liba-call.html and the number the repo believes was published ever disagree, the app
// negotiates against a contract that is not live. PAGE is bumped by whoever publishes the page.
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
const repo = execFileSync('bash', ['-lc', 'git rev-parse --show-toplevel'], { encoding: 'utf8' }).trim()
const want = Number(readFileSync(`${repo}/PAGE`, 'utf8').trim())
const html = readFileSync(`${repo}/liba-call.html`, 'utf8')
const found = [...html.matchAll(/\bpage\s*:\s*(\d+)/g)].map(m => Number(m[1]))
if (!found.length) { console.error('page-version: אין page:<מספר> ב-liba-call.html'); process.exit(1) }
const bad = found.filter(n => n !== want)
if (bad.length) { console.error(`page-version: PAGE=${want} אבל בדף מופיע ${[...new Set(bad)].join(', ')}`); process.exit(1) }
console.log(`page-version: ${want} — הדף והריפו מסכימים`)
