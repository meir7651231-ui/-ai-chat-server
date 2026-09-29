#!/usr/bin/env node
// step intent-kernel: what ליבה says she can do is exactly what she can do. The generated tables match the registry;
// every live page command has a handler in the page's HANDLERS, every live app command a branch in the bubble,
// every command left to Claude names its protocol rule; and no command regex lives outside the registry.
import { readFileSync, readdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..'), bad = []
try { execFileSync('node', [join(root, 'liba/intents/build.mjs'), '--check'], { stdio: 'pipe' }) } catch (e) { bad.push(String(e.stderr || e).trim()) }
const reg = JSON.parse(readFileSync(join(root, 'liba/intents/registry.json'), 'utf8'))
const page = readdirSync(join(root, 'liba/src')).filter(f => /^\d\d-.*\.js$/.test(f)).map(f => readFileSync(join(root, 'liba/src', f), 'utf8')).join('\n')
const handlers = new Set(([...(/const HANDLERS=\{([\s\S]*?)\};/.exec(page) || [, ''])[1].matchAll(/([A-Za-z]+)(?=[,:}]|\s*$)/g)]).map(m => m[1]))
const kt = readFileSync(join(root, 'android/app/src/main/java/il/liba/app/BubbleService.kt'), 'utf8')
const RULES = ['tasks_rules', 'generator_rules', 'manager_rules', 'memory_rules', 'senses_rules', 'req_rules', 'owner_lease_rules', 'urgent_rules', 'rules']
let live = 0
for (const i of reg.intents) {
  if ((i.status || 'live') !== 'live') continue; live++
  if (i.where === 'page' && !handlers.has(i.handler)) bad.push(`${i.id}: handler ${i.handler} לא ב-HANDLERS של הדף`)
  if (i.where === 'app' && !kt.includes(`id == "${i.id}"`)) bad.push(`${i.id}: אין ענף בבועה`)
  if (i.where === 'claude' && !RULES.includes(i.rule)) bad.push(`${i.id}: כלל ${i.rule} לא קיים בפרוטוקול`)
}
// no command regex outside the registry: a start-anchored regex with Hebrew in it is a command, wherever it hides
const cmdRx = readdirSync(join(root, 'liba/src')).filter(f => /^\d\d-.*\.js$/.test(f) && f !== '00-intents.js')
  .flatMap(f => [...readFileSync(join(root, 'liba/src', f), 'utf8').matchAll(/\/\^[^\/\n]*[֐-׿][^\/\n]*\//g)].map(m => f + ' ' + m[0].slice(0, 40)))
if (cmdRx.length) bad.push('ביטויי פקודה מחוץ לרישום: ' + cmdRx.join(' ; '))
if (kt.match(/n in listOf\(/g)) bad.push('בבועה נשארו רשימות ביטויים בקוד - הן שייכות לרישום')
if (live < 45) bad.push(`רק ${live} כוונות חיות (צריך לפחות 45)`)
if (bad.length) { console.error('help-parity: ' + bad.join(' · ')); process.exit(1) }
console.log(`help-parity: ${live} כוונות חיות, לכל אחת מטפל; העזרה נבנית רק מהן; 0 ביטויי פקודה מחוץ לרישום`)
