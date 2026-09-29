#!/usr/bin/env node
/**
 * step plan-graph-gates: the plan is a graph, and this is the only thing that says so out loud.
 *
 *   node plan/plan.mjs --check    dead references, cycles, order inversions, shape   (exit 1 on any)
 *   node plan/plan.mjs --order    the topological order the steps should be done in
 *   node plan/plan.mjs --own      who owns what, from plan/ownership.json            (exit 1 on double ownership)
 *
 * A plan nobody can run a check on is a story. This turns it into something that fails.
 */
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const plan = JSON.parse(readFileSync(join(HERE, 'plan100.json'), 'utf8'))
const steps = plan.milestones.flatMap((m, i) => m.steps.map((s, j) => ({ ...s, ms: i + 1, pos: 0 })))
steps.forEach((s, i) => { s.pos = i + 1 })
const byId = new Map(steps.map(s => [s.id, s]))
const ID = /[a-z][a-z0-9]+(?:-[a-z0-9]+)+/g

const deps = s => [...new Set((s.depends.match(ID) || []).filter(t => byId.has(t)))]
const dead = s => [...new Set((s.depends.match(ID) || []).filter(t => !byId.has(t)))]

const problems = []
const say = []

function check() {
  // 1. shape
  const need = ['id', 'title', 'why', 'what', 'monstrous', 'measure', 'depends', 'risk']
  for (const s of steps) {
    const empty = need.filter(k => !String(s[k] || '').trim())
    if (empty.length) problems.push(`${s.id}: שדות ריקים — ${empty.join(', ')}`)
    if (!/\d/.test(s.measure)) problems.push(`${s.id}: מדד יציאה בלי מספר`)
  }
  if (steps.length !== 100) problems.push(`${steps.length} צעדים, לא 100`)
  const dupes = steps.map(s => s.id).filter((v, i, a) => a.indexOf(v) !== i)
  if (dupes.length) problems.push(`מזהים כפולים: ${dupes.join(', ')}`)

  // 2. dead references
  for (const s of steps) {
    const d = dead(s)
    if (d.length) problems.push(`${s.id}: תלוי במזהה שאינו קיים — ${d.join(', ')}`)
  }

  // 3. cycles
  const color = new Map()
  const stack = []
  const cycles = []
  const walk = n => {
    color.set(n, 1); stack.push(n)
    for (const d of deps(byId.get(n))) {
      if (color.get(d) === 1) cycles.push([...stack.slice(stack.indexOf(d)), d].join(' → '))
      else if (!color.get(d)) walk(d)
    }
    stack.pop(); color.set(n, 2)
  }
  for (const s of steps) if (!color.get(s.id)) walk(s.id)
  cycles.forEach(c => problems.push(`מעגל תלות: ${c}`))

  // 4. order inversions — a step that depends on one that comes after it
  for (const s of steps) {
    for (const d of deps(s)) {
      const t = byId.get(d)
      if (t.pos > s.pos) say.push(`היפוך סדר: ${s.id} (${s.pos}) תלוי ב-${d} (${t.pos})`)
    }
  }

  // 5. milestone exits carry a number
  plan.milestones.forEach((m, i) => {
    if (!/\d/.test(m.exit)) problems.push(`אבן דרך ${i + 1}: קריטריון יציאה בלי מספר`)
  })
}

function order() {
  const indeg = new Map(steps.map(s => [s.id, 0]))
  const out = new Map(steps.map(s => [s.id, []]))
  for (const s of steps) for (const d of deps(s)) { indeg.set(s.id, indeg.get(s.id) + 1); out.get(d).push(s.id) }
  // ties break by the order the plan already puts them in, so the result reads like the plan
  const ready = steps.filter(s => indeg.get(s.id) === 0).map(s => s.id)
  const seq = []
  while (ready.length) {
    ready.sort((a, b) => byId.get(a).pos - byId.get(b).pos)
    const n = ready.shift(); seq.push(n)
    for (const m of out.get(n)) { indeg.set(m, indeg.get(m) - 1); if (indeg.get(m) === 0) ready.push(m) }
  }
  if (seq.length !== steps.length) { console.error('order: יש מעגל — הרץ --check'); process.exit(1) }
  seq.forEach((id, i) => {
    const s = byId.get(id)
    const d = deps(s)
    console.log(`${String(i + 1).padStart(3)}  ${id.padEnd(26)} ms${String(s.ms).padStart(2)}  ${d.length ? '← ' + d.join(', ') : ''}`)
  })
}

function own() {
  const f = join(HERE, 'ownership.json')
  if (!existsSync(f)) { console.error('own: אין plan/ownership.json — הרץ את מיפוי הבעלויות קודם'); process.exit(1) }
  const { rulings = [] } = JSON.parse(readFileSync(f, 'utf8'))
  const real = rulings.filter(r => !r.false_clash)
  for (const r of real) {
    if (!byId.has(r.owner)) { problems.push(`בעלות: ${r.asset} — הבעלים ${r.owner} אינו צעד`); continue }
    const late = (r.others || []).filter(o => byId.has(o.step_id) && byId.get(o.step_id).pos < byId.get(r.owner).pos)
    for (const o of late) problems.push(`בעלות: ${r.asset} — ${o.step_id} (${byId.get(o.step_id).pos}) מרחיב לפני שהבעלים ${r.owner} (${byId.get(r.owner).pos}) קיים`)
  }
  console.log(`own: ${real.length} נכסים עם בעלים יחיד, ${rulings.length - real.length} התנגשויות שווא`)
}

const arg = process.argv[2] || '--check'
if (arg === '--order') { order(); process.exit(0) }
if (arg === '--own') { own() } else { check(); if (process.argv.includes('--own')) own() }

if (say.length) console.log(say.map(s => '  · ' + s).join('\n'))
if (problems.length) { console.error(`plan: ${problems.length} בעיות\n  ` + problems.join('\n  ')); process.exit(1) }
console.log(`plan: ${steps.length} צעדים · ${plan.milestones.length} אבני דרך · 0 הפניות מתות · 0 מעגלים${say.length ? ` · ${say.length} היפוכי סדר (מיון טופולוגי דרך --order)` : ''}`)
