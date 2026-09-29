#!/usr/bin/env node
// A line number in the plan is a pointer that goes stale the first time the file moves. Names only:
// liba-call.html@send.deliver, BubbleService.kt@installUpdate. plan/anchors.mjs converts old ones.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const plan = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'plan', 'plan100.json'), 'utf8'))
const RE = /[\w-]+\.(?:kt|html|js|mjs|ts):\d+|ב?שורות?\s+\d+/g
const bad = []
for (const m of plan.milestones) for (const s of m.steps) for (const k of ['why', 'what', 'monstrous', 'measure', 'depends', 'risk'])
  for (const x of s[k].matchAll(RE)) bad.push(`${s.id}.${k}: ${x[0]}`)
if (bad.length) { console.error(`no-line-anchors: ${bad.length} הפניות למספר שורה:\n  ` + bad.join('\n  ') + '\n  הרץ node plan/anchors.mjs --migrate'); process.exit(1) }
console.log('no-line-anchors: 0 הפניות למספר שורה בתוכנית')
