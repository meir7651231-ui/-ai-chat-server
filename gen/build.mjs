#!/usr/bin/env node
// gen/build.mjs — המחולל מהמסוף. ספק ⇒ צרכים (מצורת-השדות) ⇒ הוכחה-בריצה מול כל המדף ⇒ הרכבה ⇒ אפליקציה רצה.
// אפס מודל, אפס רשת, אפס קוד-ידני-לאפליקציה: כל חישוב באפליקציה הוא אטום מהמדף שעבר את הדוגמאות בריצה.
//   node gen/build.mjs gen/specs/gemach.txt      ⇒ gen/out/gemach/{app.html,live.html,report.json,log.md}
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readShelf } from './shelf.mjs';
import { renderLive } from './live.mjs';
import { runGenerator } from './engine.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const NEEDS = JSON.parse(fs.readFileSync(path.join(HERE, 'needs.data.json'), 'utf8')).needs;

export async function build(specPath) {
  const specText = fs.readFileSync(specPath, 'utf8');
  const slug = path.basename(specPath).replace(/\.txt$/, '');
  const shelf = readShelf();
  const { report, app } = await runGenerator({ specText, slug, shelf, NEEDS });
  const outDir = path.join(HERE, 'out', slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'app.html'), app);
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify({ ...report, atoms: report.atoms.map(({ src, ...a }) => a) }, null, 1));
  fs.writeFileSync(path.join(outDir, 'live.html'), renderLive(report, app));
  fs.writeFileSync(path.join(outDir, 'log.md'), logMd(report));
  return report;
}

function logMd(r) {
  const L = [`# ${r.app} — יומן-בנייה`, '', `מדף: ${r.meta.shelf} אטומים (${r.meta.fns} פונקציות) · זמן: ${r.meta.ms}ms · נבנה: ${r.meta.built}`, '', '## ספק', '```', r.spec.trim(), '```', '', '## הוכחות'];
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
