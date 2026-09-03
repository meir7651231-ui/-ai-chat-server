#!/usr/bin/env node
/** מחצב · selftest-המשטרה — מוכיח שכל חוק יורה (נלמד מ-catalog_qa של buildsmart) — c4א של PROTOCOL v4 §12.
 *  c4א: (א) fixtures בקבצים **לא-נעולים** ב-selftest-fixtures/*.mjs — לקח חדש = fixture חדש בלי pins-write (R2-3.2)
 *  (ב) run() מחזיר קוד-יציאה **גולמי** — 2/קריסה/timeout ≠ "יורה"; הציפייה היא שוויון מדויק (R2-2.7)
 *  (ג) שני מצבי-הרצה: positional dir (הישן) או root:true ⇒ MACHTZEV_ROOT=<fixture> — כך גם שערי --gate שקוראים את
 *      העץ דרך root.mjs ניתנים-לבדיקה (R2-4.8) · (ד) סיכום זוגות: שער "מוכח" רק עם מורעל⇒1 **וגם** נקי⇒0.
 *  fixture = { gate, name, files:{rel:content}, want:0|1, root?:true, sub?:'dir', args?:[...] } */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as R from './root.mjs';
const TOOLS = path.dirname(fileURLToPath(import.meta.url)) + '/';
const TMP = fs.mkdtempSync('/tmp/machtzev-selftest-');
const gates = fs.readFileSync(R.MACH + 'gates.tsv', 'utf8').split('\n').filter((l) => l && !l.startsWith('#')).map((l) => l.split('\t')[0]);
const scriptOf = Object.fromEntries([...fs.readFileSync(TOOLS + 'police.mjs', 'utf8').matchAll(/^\s*gate(?:Dirty)?\(\s*'([^']+)'\s*,\s*'([^']+)'/gm)].map((m) => [m[1], m[2]]));
const mk = (files) => {
  fs.rmSync(TMP, { recursive: true, force: true }); fs.mkdirSync(TMP, { recursive: true });
  for (const [p, c] of Object.entries(files)) { fs.mkdirSync(path.join(TMP, path.dirname(p)), { recursive: true }); fs.writeFileSync(path.join(TMP, p), c); }
  return TMP;
};
const run = (script, { dir, root, args = [] }) => {
  const env = { ...process.env };
  if (root) env.MACHTZEV_ROOT = root; else delete env.MACHTZEV_ROOT;
  const r = spawnSync('node', [TOOLS + script, ...(dir ? [dir] : []), ...args], { stdio: 'pipe', env, timeout: 120000, killSignal: 'SIGKILL' });
  return r.error ? -1 : r.status ?? -1;
};
let fail = 0; const seen = {};
const fixturesDir = (process.env.SELFTEST_FIXTURES ? process.env.SELFTEST_FIXTURES.replace(/\/?$/, '/') : TOOLS + 'selftest-fixtures/');   // c5 · המאמת-העצמאי מזריק fixtures של T
const files = fs.existsSync(fixturesDir) ? fs.readdirSync(fixturesDir).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).sort() : [];
for (const f of files) {
  const cases = (await import(pathToFileURL(fixturesDir + f).href)).default;
  for (const c of cases) {
    const script = scriptOf[c.gate]; if (!script) { console.log(`  ❓ ${c.gate} — אין שער כזה ב-police.mjs`); fail = 1; continue; }
    const base = mk(c.files);
    const got = run(script, c.root ? { root: base, args: c.args || [] } : { dir: c.sub ? path.join(base, c.sub) : base, args: c.args || [] });
    const hit = got === c.want;
    console.log(`  ${hit ? '✅' : '❌'} [${c.gate}] ${c.name.padEnd(36)} ${hit ? 'יורה כמצופה' : `לא יורה! (got ${got}, want ${c.want})`}`);
    if (!hit) fail = 1;
    (seen[c.gate] ||= new Set()).add(c.want);
  }
}
fs.rmSync(TMP, { recursive: true, force: true });
const paired = gates.filter((g) => seen[g]?.has(1) && seen[g]?.has(0));
const unpaired = gates.filter((g) => !paired.includes(g));
console.log(`\nזוגות-הוכחה (מורעל⇒1 ∧ נקי⇒0): ${paired.length}/${gates.length} · לא-מוכחים: ${unpaired.join(', ') || '—'}`);
console.log(fail ? '\n❌ חוק לא יורה — המשטרה שבורה!' : '\n✅ כל ה-fixtures יורים כמצופה + ביקורת-שלילית עוברת');
process.exit(fail);
