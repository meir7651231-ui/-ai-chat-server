#!/usr/bin/env node
// Record what the phone itself reported (channel/device), as read by ליבה from the channel database.
//   node ship/observe.mjs '{"app":"3.15.0","page":40,"pageHash":"…","at":1790695085810}'
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const d = JSON.parse(process.argv[2] || '{}')
if (!d.app || !d.at) { console.error('observe: צריך app ו-at מתוך channel/device'); process.exit(2) }
const live = { app: d.app, page: d.page ?? null, pageHash: d.pageHash ?? null, deviceAt: d.at, observedAt: Date.now(), source: 'channel/device' }
writeFileSync(join(dirname(fileURLToPath(import.meta.url)), 'live.json'), JSON.stringify(live, null, 1) + '\n')
console.log(`observe: המכשיר דיווח ${live.app} · דף ${live.page} · ${new Date(live.deviceAt).toISOString()}`)
