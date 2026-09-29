#!/usr/bin/env node
/**
 * step req-spine: how many of Meir's sentences became requests, and how many replies found their request.
 *
 *   node tools/req-report.mjs <export.json> [--days 7]
 *
 * export.json: {"req":[...], "inbox":[...], "turns":[...]} as read from the channel database.
 * Replies whose re matches no request are counted as UNBOUND and shown - never dropped from the
 * denominator, because a day-one number that hides them would look better than the truth.
 */
import { readFileSync } from 'node:fs'
const [file] = process.argv.slice(2).filter(a => !a.startsWith('--'))
const days = +(process.argv.find(a => a.startsWith('--days=')) || '--days=7').split('=')[1]
if (!file) { console.error('usage: node tools/req-report.mjs <export.json> [--days=7]'); process.exit(2) }
const X = JSON.parse(readFileSync(file, 'utf8'))
const since = Date.now() - days * 864e5
const reqs = (X.req || []).filter(r => (r.askedAt || 0) >= since)
const byId = new Set(reqs.map(r => r.id))
const turns = (X.turns || []).filter(t => t.from === 'user' && (t.ts || 0) >= since)
const inbox = (X.inbox || []).filter(d => (d.ts || 0) >= since && d.from !== 'liba' && d.kind !== 'cmd')
const withReq = turns.filter(t => t.req && byId.has(t.req))
const bound = inbox.filter(d => d.re && byId.has(d.re)), unbound = inbox.filter(d => d.re && !byId.has(d.re)), bare = inbox.filter(d => !d.re)
const pct = (a, b) => b ? Math.round(1000 * a / b) / 10 + '%' : '—'
const r = {
  days,
  sentences: turns.length, sentencesWithReq: withReq.length, sentencesWithReqPct: pct(withReq.length, turns.length),
  replies: inbox.length, repliesBound: bound.length, repliesBoundPct: pct(bound.length, inbox.length),
  repliesUnbound: unbound.length, repliesWithoutRe: bare.length,
  requestsAnswered: reqs.filter(q => q.firstReplyAt).length, requests: reqs.length,
}
console.log(JSON.stringify(r, null, 1))
