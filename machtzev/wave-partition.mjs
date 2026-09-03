#!/usr/bin/env node
/** מחצב · wave-partition — חלוקת-עבודה לנחיל (PROTOCOL v4 §12 שלב 7 · L20 גלים-של-10 · L22 נחילים-קטנים-מקבילים · R2-5.12/5.15).
 *  קלט: קבצי-יעד (args) או --staged. רדיוס-הפגיעה של כל קובץ = הוא + צרכניו הטרנזיטיביים (census/import-graph).
 *  קבצים שרדיוסיהם נחתכים ⇒ אותו **תא** (builder אחד, קבצים דיסיונקטיים בין תאים — אין שני בונים על אותו קובץ).
 *  תאים נארזים לגלים של ≤10 קבצים (L20). תא גדול מ-10 = "גל-יחיד-חורג" ומסומן — לא נחתך (חיתוך = קונפליקט).
 *  פלט: טבלה / --json {waves:[{n, cells:[{files, radius}]}], overflow:[…]}. שדה-הכרטיס: `Wave: k/N · m קבצים`.
 *  אפס-LLM, אפס-כתיבה. commit-msg מאמת `Wave:` (פורמט + ≤10). */
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import * as R from './root.mjs';
import { buildGraph, consumersOf } from './census/import-graph.mjs';
const argv = process.argv.slice(2);
let targets = argv.filter((a) => !a.startsWith('--')).map((f) => path.resolve(R.ROOT, f));
if (argv.includes('--staged')) targets = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], { cwd: R.ROOT, encoding: 'utf8' }).split('\n').filter((f) => f.startsWith('new/') && /\.(mjs|js|dart)$/.test(f) && !/\.test\.mjs$|_test\.dart$/.test(f)).map((f) => path.join(R.ROOT, f));
if (!targets.length) { console.log('usage: wave-partition <file…> | --staged [--json] [--max 10]'); process.exit(0); }
const MAX = Number((argv[argv.indexOf('--max') + 1] || 10)) || 10;
const graph = buildGraph();
const cons = new Map(targets.map((t) => [t, consumersOf([t], graph)]));
const radius = new Map(targets.map((t) => [t, new Set(cons.get(t).files)]));
const UNKNOWN = new Set(targets.filter((t) => cons.get(t).unknown.length));   // R3-5.12: רדיוס לא-ידוע ⇒ כל אלה בתא אחד (fail-closed)
for (const u of UNKNOWN) for (const v of UNKNOWN) radius.get(u).add(v);
// תאים = רכיבי-קשירות של יחס "רדיוסים נחתכים"
const cells = []; const seen = new Set();
for (const t of targets) {
  if (seen.has(t)) continue;
  const cell = [t]; seen.add(t); const union = new Set(radius.get(t));
  let grew = true;
  while (grew) { grew = false; for (const u of targets) { if (seen.has(u)) continue; if ([...radius.get(u)].some((f) => union.has(f))) { cell.push(u); seen.add(u); radius.get(u).forEach((f) => union.add(f)); grew = true; } } }
  cells.push({ files: cell, radius: union.size });
}
cells.sort((a, b) => b.files.length - a.files.length);
// אריזה לגלים ≤MAX (first-fit decreasing); תא > MAX ⇒ overflow (מוצהר)
const waves = [], overflow = [];
for (const c of cells) {
  if (c.files.length > MAX) { overflow.push(c); continue; }
  const w = waves.find((x) => x.files + c.files.length <= MAX);
  if (w) { w.cells.push(c); w.files += c.files.length; } else waves.push({ n: waves.length + 1, cells: [c], files: c.files.length });
}
const rel = (f) => path.relative(R.ROOT, f);
const out = { max: MAX, targets: targets.length, cells: cells.length, waves: waves.map((w) => ({ n: w.n, files: w.files, cells: w.cells.map((c) => ({ files: c.files.map(rel), radius: c.radius })) })), overflow: overflow.map((c) => ({ files: c.files.map(rel), radius: c.radius })) };
if (argv.includes('--json')) { console.log(JSON.stringify(out, null, 1)); process.exit(0); }
console.log(`🌊 wave-partition: ${targets.length} קבצים ⇒ ${cells.length} תאים דיסיונקטיים ⇒ ${waves.length} גלים (≤${MAX})${overflow.length ? ` · ${overflow.length} תאים-חורגים` : ''}`);
for (const w of out.waves) { console.log(`  Wave: ${w.n}/${out.waves.length} · ${w.files} קבצים`); w.cells.forEach((c, i) => console.log(`    תא ${i + 1} (רדיוס ${c.radius}): ${c.files.join(' · ')}`)); }
for (const c of out.overflow) console.log(`  ⚠️ תא-חורג (${c.files.length} > ${MAX}, לא נחתך — חיתוך = קונפליקט): ${c.files.slice(0, 5).join(' · ')}…`);
