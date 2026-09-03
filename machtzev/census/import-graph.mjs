#!/usr/bin/env node
/** מחצב · import-graph — גרף-imports סטטי ל-`police --inc` (PROTOCOL v4 §3 · שלב 1 · R2-2.12 · R2-5.4).
 *  קלט: קבצים-שהשתנו. פלט: הם + כל הצרכנים הטרנזיטיביים (מי מייבא אותם) — כדי שטבעת-ה-commit תבדוק רק את רדיוס-הפגיעה.
 *  fail-closed: קובץ עם `import(` דינמי ⇒ "צרכנים לא-ידועים" ⇒ המשטרה מריצה מלא. `package:` ב-Dart = חיצוני (לא צרכן).
 *  JS: `import … from './x.mjs'` · `require('./x')` · Dart: `import '…dart'` · `part '…'` (יחסי בלבד).
 *  שימוש: node machtzev/census/import-graph.mjs <file…> [--json]   |   import { consumersOf } */
import fs from 'node:fs';
import path from 'node:path';
import * as R from '../root.mjs';
const NEW = R.NEW;
const SRC = /\.(mjs|js|dart)$/;
export function buildGraph() {
  const files = [];
  (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) { if (e.name !== 'node_modules') walk(f); } else if (SRC.test(e.name)) files.push(f); } })(NEW);
  const importers = new Map(); // target(abs) → Set(importer abs)
  const dynamic = new Set();
  for (const f of files) {
    const src = fs.readFileSync(f, 'utf8');
    if (/\bimport\s*\(/.test(src.replace(/\/\/.*$/gm, ''))) dynamic.add(f);
    const re = /\b(?:import|export)\s+[^'"]*?from\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]|\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)|\bpart\s+['"]([^'"]+)['"]/g;
    for (const m of src.matchAll(re)) {
      const spec = m[1] || m[2] || m[3] || m[4]; if (!spec || !spec.startsWith('.')) continue;
      const t = path.resolve(path.dirname(f), spec);
      (importers.get(t) || importers.set(t, new Set()).get(t)).add(f);
    }
  }
  return { files, importers, dynamic };
}
/** מרחיב רשימת-קבצים לצרכניה הטרנזיטיביים. מחזיר { files:[abs…], unknown:[abs…] } — unknown ≠ ריק ⇒ הרץ מלא. */
export function consumersOf(changed, graph = buildGraph()) {
  const seen = new Set(), queue = [], unknown = new Set();
  const push = (f) => { const a = path.resolve(f); if (!seen.has(a)) { seen.add(a); queue.push(a); } };
  changed.forEach(push);
  while (queue.length) {
    const f = queue.shift();
    if (graph.dynamic.has(f)) unknown.add(f);
    // בדיקה של אטום ⇒ גם האטום שלו (ולהפך) — זוג-חוזה
    if (/\.test\.mjs$/.test(f)) push(f.replace(/\.test\.mjs$/, '.mjs'));
    else if (/\.mjs$/.test(f) && fs.existsSync(f.replace(/\.mjs$/, '.test.mjs'))) push(f.replace(/\.mjs$/, '.test.mjs'));
    else if (/\.contract\.md$/.test(f)) push(f.replace(/\.contract\.md$/, '.mjs'));
    for (const imp of graph.importers.get(f) || []) push(imp);
  }
  // כל קובץ שמייבא דינמית — צרכניו לא ידועים; וגם קבצים ש-NEW אינו מכיל (דאטה/JSON) ⇒ unknown
  for (const f of seen) if (!f.startsWith(NEW.replace(/\/$/, ''))) unknown.add(f);
  return { files: [...seen].filter((f) => fs.existsSync(f)), unknown: [...unknown] };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const r = consumersOf(args);
  if (process.argv.includes('--json')) console.log(JSON.stringify(r));
  else { console.log(`${args.length} שונו ⇒ ${r.files.length} לבדיקה (כולל צרכנים) · unknown: ${r.unknown.length}`); r.files.slice(0, 20).forEach((f) => console.log('  ' + path.relative(R.ROOT, f))); }
}
