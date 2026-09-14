#!/usr/bin/env node
// gen/build.mjs — המחולל. ספק ⇒ צרכים (מצורת-השדות) ⇒ הוכחה-בריצה מול כל המדף ⇒ הרכבה ⇒ אפליקציה רצה.
// אפס מודל, אפס רשת, אפס קוד-ידני-לאפליקציה: כל חישוב באפליקציה הוא אטום מהמדף שעבר את הדוגמאות בריצה.
//   node gen/build.mjs gen/specs/gemach.txt      ⇒ gen/out/gemach/{app.html,live.html,report.json,log.md}
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSpec } from './spec.mjs';
import { readShelf, ROOT } from './shelf.mjs';
import { prove } from './prove.mjs';
import { renderApp } from './render.mjs';
import { renderLive } from './live.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const NEEDS = JSON.parse(fs.readFileSync(path.join(HERE, 'needs.data.json'), 'utf8')).needs;
const needById = Object.fromEntries(NEEDS.map((n) => [n.id, n]));

/** גזירת-תכנית: מאיזו צורה נולד כל צורך ואיפה הוא משמש. דטרמיניסטי, מצורה בלבד. */
export function derivePlan(spec) {
  const plan = [];
  const byShape = (shape) => NEEDS.filter((n) => n.from.shape === shape && !n.from.dashboard);
  for (const e of spec.entities) for (const f of e.fields) {
    for (const n of byShape(f.shape)) {
      if (n.id === 'phone-norm') continue; // נגזר-אפשרי אך האפליקציה הזו לא צורכת אותו (אין צורך-כפילויות בספק)
      plan.push({ needId: n.id, entity: e.name, field: f.name, kind: n.id === 'norm-search' ? 'search' : 'column', label: `${e.name}.${f.name}` });
    }
  }
  for (const d of spec.dashboard) {
    const n = NEEDS.find((x) => x.from.dashboard === d.op);
    if (!n) throw new Error(`פעולת לוח-בקרה ללא צורך מוגדר: «${d.op}»`);
    plan.push({ needId: n.id, op: d.op, entity: d.entity, field: d.field, kind: 'kpi', label: `${d.op} ${d.entity}.${d.field}` });
  }
  return plan;
}

export async function build(specPath) {
  const t0 = Date.now();
  const specText = fs.readFileSync(specPath, 'utf8');
  const slug = path.basename(specPath).replace(/\.txt$/, '');
  const spec = parseSpec(specText);
  const shelf = readShelf();
  const plan = derivePlan(spec);
  const needIds = [...new Set(plan.map((p) => p.needId))];
  const chosen = new Map();
  const proofs = [];
  for (const id of needIds) {
    const need = needById[id];
    const t = Date.now();
    const r = await prove(need, shelf);
    const why = {};
    for (const f of r.failed) why[f.why] = (why[f.why] ?? 0) + 1;
    if (r.proven[0]) chosen.set(id, r.proven[0]);
    proofs.push({ need: id, label: need.label, from: need.from, examples: need.examples, tried: r.tried, failedBy: why, ms: Date.now() - t,
      proven: r.proven.map((a) => ({ name: a.name, fn: a.fn, n: a.n, role: a.role })), chosen: r.proven[0]?.name ?? null,
      usedBy: plan.filter((p) => p.needId === id).map((p) => p.label) });
  }
  const outDir = path.join(HERE, 'out', slug);
  fs.mkdirSync(outDir, { recursive: true });
  const meta = { slug, built: new Date().toISOString(), ms: Date.now() - t0, shelf: shelf.length, fns: shelf.filter((a) => a.kind === 'fn').length };
  const app = renderApp(spec, chosen, plan, meta);
  const report = { app: spec.app, spec: specText, entities: spec.entities, dashboard: spec.dashboard, plan, proofs,
    atoms: [...new Set([...chosen.values()])].map((a) => ({ name: a.name, fn: a.fn, n: a.n, hasT: a.hasT, role: a.role, file: path.relative(ROOT, a.file) })),
    unproven: proofs.filter((p) => !p.chosen).map((p) => p.need), meta };
  fs.writeFileSync(path.join(outDir, 'app.html'), app);
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 1));
  fs.writeFileSync(path.join(outDir, 'live.html'), renderLive(report, app));
  fs.writeFileSync(path.join(outDir, 'log.md'), logMd(report));
  return report;
}

function logMd(r) {
  const L = [`# ${r.app} — יומן-בנייה`, '', `מדף: ${r.meta.shelf} אטומים · זמן: ${r.meta.ms}ms · נבנה: ${r.meta.built}`, '', '## ספק', '```', r.spec.trim(), '```', '', '## הוכחות'];
  for (const p of r.proofs) {
    L.push(`- **${p.need}** (${p.label}) ⇐ ${p.usedBy.join(', ')}: נוסו ${p.tried} · הוכחו ${p.proven.length}${p.chosen ? ` · נבחר **${p.chosen}**` : ' · **אין אטום מוכח**'}` +
      (p.proven.length > 1 ? ` · גם עברו: ${p.proven.slice(1).map((a) => a.name).join(', ')}` : '') +
      ` · נפלו: ${Object.entries(p.failedBy).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  }
  L.push('', '## אטומים שהוטבעו', ...r.atoms.map((a) => `- ${a.name} — ${a.role || '(ללא תפקיד בחוזה)'} · ${a.file}`));
  if (r.unproven.length) L.push('', '## חסר במדף', ...r.unproven.map((n) => `- ${n}: אף אטום לא עבר את הדוגמאות — באפליקציה מוצג «אין אטום מוכח», לא קוד-ידני`));
  return L.join('\n') + '\n';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const specPath = process.argv[2];
  if (!specPath) { console.error('שימוש: node gen/build.mjs gen/specs/<שם>.txt'); process.exit(2); }
  const r = await build(path.resolve(specPath));
  console.log(`✓ ${r.app}: ${r.atoms.length} אטומים מוכחים · ${r.unproven.length} צרכים ללא הוכחה · ${r.meta.ms}ms ⇒ gen/out/${r.meta.slug}/`);
  for (const p of r.proofs) console.log(`  ${p.chosen ? '●' : '○'} ${p.need.padEnd(13)} נוסו ${String(p.tried).padStart(4)} · הוכחו ${p.proven.length} ${p.chosen ? '⇒ ' + p.chosen : '⇒ אין'}`);
}
