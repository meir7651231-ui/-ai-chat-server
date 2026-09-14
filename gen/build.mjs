#!/usr/bin/env node
// gen/build.mjs — המחולל מהמסוף. ספק ⇒ צרכים (מצורת-השדות) ⇒ הוכחה-בריצה מול כל המדף ⇒ הרכבה ⇒ אפליקציה רצה.
// אפס מודל, אפס רשת, אפס קוד-ידני-לאפליקציה: כל חישוב באפליקציה הוא אטום מהמדף שעבר את הדוגמאות בריצה.
//   node gen/build.mjs gen/specs/gemach.txt      ⇒ gen/out/gemach/{app.html,live.html,report.json,log.md}
//   הקובץ יכול להיות ספק מדויק (מתחיל ב«אפליקציה:») או משפט רגיל בעברית. --flutter ⇒ גם מסלול-התצוגה (מודולי-Dart מהמחצב). --site ⇒ גם flutter build web ⇒ out/<slug>/site (דורש FLUTTER + BUILDSMART).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readShelf } from './shelf.mjs';
import { renderLive } from './live.mjs';
import { runGenerator } from './engine.mjs';
import { loadLang } from './lang.mjs';
import { readDartShelf, proveDart, hasDart } from './prove-dart.mjs';
import { inventory } from './inventory.mjs';
import { buildFlutter } from './flutter.mjs';
import { buildSite } from './site.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const NEEDS = JSON.parse(fs.readFileSync(path.join(HERE, 'needs.data.json'), 'utf8')).needs;

export async function build(specPath, { flutter = false, site = false } = {}) {
  const text = fs.readFileSync(specPath, 'utf8');
  const slug = path.basename(specPath).replace(/\.txt$/, '');
  const shelf = readShelf();
  const dartShelf = hasDart() ? readDartShelf() : [];
  const dartProver = dartShelf.length ? (need) => proveDart(need, dartShelf) : null;
  const { report, app } = await runGenerator({ text, slug, shelf, NEEDS, LANG: loadLang(), dartProver, dartCount: dartShelf.length, inventory: inventory() });
  if (flutter || site) report.flutter = buildFlutter(report.spec, slug);
  if (site && report.flutter?.ok) report.site = buildSite(slug, report.flutter.ns, { log: (m) => console.log('  🌐 ' + m) });
  const outDir = path.join(HERE, 'out', slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'app.html'), app);
  fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify({ ...report, atoms: report.atoms.map(({ src, ...a }) => a) }, null, 1));
  fs.writeFileSync(path.join(outDir, 'live.html'), renderLive(report, app));
  fs.writeFileSync(path.join(outDir, 'log.md'), logMd(report));
  return report;
}

function logMd(r) {
  const L = [`# ${r.app} — יומן-בנייה`, '', `מדף: ${r.meta.shelf} אטומים (${r.meta.fns} פונקציות) · זמן: ${r.meta.ms}ms · נבנה: ${r.meta.built}`, ''];
  if (r.sentence) L.push('## המשפט', '```', r.sentence.text.trim(), '```', ...r.sentence.notes.map((n) => `- ⚠ ${n}`), '');
  L.push('## ספק' + (r.sentence ? ' (נגזר מהמשפט)' : ''), '```', r.spec.trim(), '```', '', '## הוכחות');
  for (const p of r.proofs) {
    L.push(`- **${p.need}** (${p.label}) ⇐ ${p.usedBy.join(', ')}: נוסו ${p.tried} · הוכחו ${p.proven.length}${p.chosen ? ` · נבחר **${p.chosen}**` : ' · **אין אטום מוכח**'}` +
      (p.proven.length > 1 ? ` · גם עברו: ${p.proven.slice(1).map((a) => a.name).join(', ')}` : '') +
      ` · נפלו: ${Object.entries(p.failedBy).map(([k, v]) => `${k} ${v}`).join(', ')}` + (p.dart ? ` · Dart-בלבד: נוסו ${p.dart.tried}, עברו ${p.dart.proven.length}${p.dart.proven.length ? ' (' + p.dart.proven.map((a) => a.name).join(', ') + ')' : ''}` : ''));
  }
  L.push('', '## אטומים שהוטבעו', ...r.atoms.map((a) => `- ${a.name} — ${a.role || '(ללא תפקיד בחוזה)'} · ${a.file}`));
  if (r.flutter) L.push('', '## מסלול-Flutter (אטומי-תצוגה)', r.flutter.ok ? `- ${r.flutter.files.length} קבצי-Dart ב-flutter/ · ${r.flutter.displayAtoms.length} אטומי-תצוגה: ${r.flutter.displayAtoms.join(', ')}` : `- נכשל: ${r.flutter.why || r.flutter.err}`, `- ${r.flutter.compileNote}`);
  if (r.unproven.length) L.push('', '## חסר במדף', ...r.unproven.map((n) => `- ${n}: אף אטום לא עבר את הדוגמאות — באפליקציה מוצג «אין אטום מוכח», לא קוד-ידני`));
  return L.join('\n') + '\n';
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const specPath = process.argv[2];
  if (!specPath) { console.error('שימוש: node gen/build.mjs gen/specs/<שם>.txt'); process.exit(2); }
  const r = await build(path.resolve(specPath), { flutter: process.argv.includes('--flutter'), site: process.argv.includes('--site') });
  console.log(`✓ ${r.app}: ${r.atoms.length} אטומים מוכחים · ${r.unproven.length} צרכים ללא הוכחה · ${r.meta.ms}ms ⇒ gen/out/${r.meta.slug}/`);
  for (const p of r.proofs) console.log(`  ${p.chosen ? '●' : '○'} ${p.need.padEnd(13)} JS: נוסו ${String(p.tried).padStart(4)} · הוכחו ${p.proven.length} ${p.chosen ? '⇒ ' + p.chosen : '⇒ אין'}${p.dart ? ` · Dart: נוסו ${p.dart.tried} · הוכחו ${p.dart.proven.length}${p.dart.proven.length ? ' ⇒ ' + p.dart.proven.map((a) => a.name).join(' ') : ''}` : ''}`);
  if (r.flutter) console.log(r.flutter.ok ? `  🎨 מסלול-Flutter: ${r.flutter.files.length} קבצי-Dart · ${r.flutter.displayAtoms.length} אטומי-תצוגה מחווטים · עץ-המחצב ${r.flutter.treeClean ? 'נקי' : 'לא נקי: ' + r.flutter.leftover.join(' ')} · ${r.flutter.compileNote}` : `  🎨 מסלול-Flutter נכשל: ${r.flutter.why || r.flutter.err}`);
  if (r.site) console.log(r.site.ok ? `  🌐 אתר: ${r.site.site} · ${r.site.files} קבצים · ${(r.site.bytes / 1024 / 1024).toFixed(1)}MB · ${(r.site.ms / 1000).toFixed(0)}s` : `  🌐 אתר לא נבנה: ${r.site.why}\n${r.site.err || ''}`);
  if (r.site && !r.site.ok) process.exitCode = 1;   // --site שנכשל = כישלון גלוי, לא שקט
  if (r.inventory) for (const row of r.inventory.rows) console.log(`  ${row.state === 'on' ? '✓' : '✗'} ${String(row.count).padStart(5)} ${row.layer} — ${row.connected}`);
}
