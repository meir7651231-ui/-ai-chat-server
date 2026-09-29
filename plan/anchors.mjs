#!/usr/bin/env node
/**
 * step page-kernel: line numbers in the plan rot the moment the code moves. This turns them into names.
 *
 *   node plan/anchors.mjs --report     what would change, and what cannot be resolved
 *   node plan/anchors.mjs --migrate    rewrite plan100.json
 *
 * The plan was written against the code at BASE. For every reference it finds the enclosing top-level
 * function in THAT version of the file, and writes its name instead of the number. A reference that
 * cannot be pinned to one function is reported, never guessed.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url)), ROOT = join(HERE, '..')
const BASE = '3e9bb6c'
const MODE = process.argv[2] || '--report'
const git = (...a) => execFileSync('git', ['-C', ROOT, ...a], { encoding: 'utf8', maxBuffer: 64 << 20 })
const KT = n => `android/app/src/main/java/il/liba/app/${n}`
const FILES = ['liba-call.html', 'BubbleService.kt', 'LibaWeb.kt', 'MainActivity.kt', 'OrbView.kt', 'Prefs.kt', 'VadGate.kt', 'TalkTile.kt', 'App.kt']

const cache = {}
function linesOf(file) {
  if (!cache[file]) { try { cache[file] = git('show', `${BASE}:${file}`).split('\n') } catch { cache[file] = null } }
  return cache[file]
}
// the enclosing top-level construct of line n (1-based) in the base version of a file
function encl(file, n) {
  const L = linesOf(file); if (!L || n < 1 || n > L.length) return null
  const isKt = file.endsWith('.kt')
  for (let i = n - 1; i >= 0; i--) {
    const l = L[i]
    if (isKt) {
      const m = /^\s*(?:@\w+\s+)*(?:(?:private|override|internal|public|inline|suspend)\s+)*fun\s+(?:[\w.]+\.)?(\w+)\s*\(/.exec(l)
      if (m) return m[1]
      // a line that is itself a nested type (enum State, class JsBridge) is named by that type
      const c = /^\s*(?:(?:private|inner|enum|data|sealed)\s+)*(?:class|object|interface)\s+(\w+)/.exec(l)
      if (c) return i === n - 1 || /^\s+/.test(l) ? c[1] : null
      continue
    }
    let m
    if ((m = /^(?:async\s+)?function\s+(\w+)/.exec(l))) return m[1]
    if (/^\(async\s*\(\)\s*=>\s*\{/.test(l)) return 'boot'
    if (/^window\.addEventListener\('message'/.test(l)) return 'onMessage'
    if ((m = /^\$\('(\w+)'\)\.addEventListener/.exec(l))) return `on_${m[1]}`
    if ((m = /^(?:const|let)\s+(\w+)/.exec(l)) && i === n - 1) return m[1]
    if (/^\S/.test(l) && i < n - 1) return null   // a new top-level statement before we found an opener
  }
  return null
}
// name in the old file -> anchor in today's build
const map = JSON.parse(readFileSync(join(ROOT, 'dist/page.map.json'), 'utf8')).anchors
const SPECIAL = { boot: 'db', onMessage: 'bridge', on_start: 'flow', on_talk: 'flow', on_hf: 'flow', on_sendTyped: 'flow', on_typed: 'flow', on_ack: 'flow' }
function pageAnchor(name) {
  if (!name) return null
  if (SPECIAL[name]) return SPECIAL[name]
  const k = Object.keys(map).find(k => k.endsWith('.' + name))
  if (k) return k
  if (map[name]) return name
  return null
}
const nearestFile = (text, at) => {
  const before = text.slice(Math.max(0, at - 260), at)
  const files = [...before.matchAll(/([A-Za-z][\w-]*\.(?:kt|html))/g)]
  const fns = [...before.matchAll(/\b(deliver|send|memoryCmd|taskCmd|pump|incoming|sayApp|ready|tagOf|switchOwner|setOwner|renderTasks|renderMap|onSnapshot|taskPrev|queueLocal|chat\/log|channel\/owner|String\(Date\.now\(\)\)|הדיספאץ)/g)]
  const lf = files.length ? files[files.length - 1] : null, lfn = fns.length ? fns[fns.length - 1] : null
  if (lf && (!lfn || lf.index > lfn.index)) return lf[1]
  if (lfn) return 'liba-call.html'
  return null
}
const resolve = (file, n) => {
  if (file === 'liba-call.html') return pageAnchor(encl('liba-call.html', n))
  if (/\.kt$/.test(file)) { const f = encl(KT(file), n); return f ? `${file.replace(/\.kt$/, '')}.${f}` : null }
  return null
}

const plan = JSON.parse(readFileSync(join(HERE, 'plan100.json'), 'utf8'))
let done = 0; const open = [], fixed = []
const RE = /`?(liba-call\.html|[A-Z]\w+\.kt):(\d+)(?:[-–](\d+))?`?|(ב?שורות?)\s+((?:\d+(?:[-–‑]\d+)?)(?:\s*(?:,|\/|ו-?)\s*\d+(?:[-–‑]\d+)?)*)/g
for (const m of plan.milestones) for (const s of m.steps) for (const k of ['why', 'what', 'monstrous', 'measure', 'depends', 'risk']) {
  s[k] = s[k].replace(RE, (all, f1, n1, n2, word, list, at, text) => {
    if (f1) {
      // "enum `State` at File.kt:37": the name is the claim, the number is a pointer that may be wrong.
      // If the named type exists in that file, anchor to it and say the number was off.
      const named = (/(?:enum|class|object)\s+`?(\w+)`?[^`]{0,30}$/.exec(text.slice(Math.max(0, at - 60), at)) || [])[1]
      if (named && /\.kt$/.test(f1)) {
        const L = linesOf(KT(f1)) || []
        const line = L.findIndex(l => new RegExp(`\\b(?:class|object|interface)\\s+${named}\\b`).test(l))
        if (line >= 0) { done++; if (line + 1 !== +n1) fixed.push(`${s.id}: ${f1}:${n1} → ${named} (שורה ${line + 1} בפועל)`); return '`' + f1 + '@' + named + '`' }
      }
      const a = resolve(f1, +n1), b = n2 ? resolve(f1, +n2) : a
      if (a && a === b) { done++; return '`' + f1 + '@' + a.replace(/^[A-Z]\w+\./, '') + '`' }
      open.push(`${s.id}: ${all}`); return all
    }
    const nums = list.split(/\s*(?:,|\/|ו-?)\s*/).flatMap(x => { const r = x.split(/[-–‑]/).map(Number); return r.length === 2 ? [r[0], r[1]] : r })
    // a function named right before the number is the strongest evidence: find the ONE file where
    // that line really sits inside that function. No such file, or two of them: leave it for a human.
    const hint = (/`?(\w+)\(\)`?[^()]{0,40}$/.exec(text.slice(Math.max(0, at - 60), at)) || [])[1]
    let file = null
    if (hint) {
      const hits = FILES.filter(f => nums.every(n => { const e = encl(f === 'liba-call.html' ? f : KT(f), n); return e === hint || (f === 'liba-call.html' && e === hint) }))
      if (hits.length === 1) file = hits[0]
      else { open.push(`${s.id}: ${all} (${hint}() — ${hits.length ? 'יותר מקובץ אחד' : 'אף קובץ'})`); return all }
    } else file = nearestFile(text, at)
    if (!file) { open.push(`${s.id}: ${all} (לא ברור איזה קובץ)`); return all }
    const names = [...new Set(nums.map(n => resolve(file, n)))]
    if (names.every(Boolean)) { done++; const pre = word.startsWith('ב') ? 'ב' : ''; return pre + (names.length > 1 ? 'עוגנים ' : 'עוגן ') + names.map(x => '`' + x + '`').join(', ') }
    open.push(`${s.id}: ${all} ב-${file}`); return all
  })
}
if (MODE === '--migrate') writeFileSync(join(HERE, 'plan100.json'), JSON.stringify(plan))
console.log(`anchors: ${done} הפניות הומרו לשמות${open.length ? `, ${open.length} לא ניתנו להכרעה:` : ''}`)
open.forEach(o => console.log('  · ' + o))
if (fixed.length) { console.log('הפניות שהמספר בהן היה שגוי ותוקנו לפי השם:'); fixed.forEach(o => console.log('  · ' + o)) }
if (MODE === '--migrate' && open.length) process.exitCode = 1
