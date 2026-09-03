#!/usr/bin/env node
/** מחצב · נעילת-השוטרים (נלמד מ-protocol/pins.sha256 של buildsmart) — c4א של PROTOCOL v4 §12:
 *  החוקה, המשטרה, המחוללים וה-baselines חתומים; שינוי בלי עדכון-חתימה-באותו-commit ⇒ אדום.
 *  c4א: (א) sha256 מלא (היה 16-hex = שורש 64-bit · R2-3.12) · (ב) הרשימה **נגזרת**: כל סקריפט ש-police.mjs
 *  מפעיל (regex על gate(...)) + STATIC (חוקה · מחוללים · baselines · root/dart-bin/lib-ts) + OPTIONAL (hooks/workflow
 *  אם קיימים) — הרשימה לא יכולה לסחוף (R2-2.1, R2-1.5) · (ג) בדיקה דו-כיוונית: pins.sha256 ≡ הרשימה (שני ה-diffs מודפסים).
 *  עדכון: node machtzev/pins-check.mjs --write   (בעתיד: רק עם trailer Allow: pins-write) */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import * as R from './root.mjs';
const ROOT = R.ROOT;
const STATIC = [
  'LAW.md', 'CLAUDE.md', 'PURPOSE.md',
  'machtzev/VERIFY-LAWS.md', 'machtzev/THE-WAY.md', 'machtzev/AGENT-CODE.md', 'machtzev/DECISIONS.md', 'machtzev/LEARNINGS.md',
  'machtzev/gates.tsv', 'machtzev/police.mjs', 'machtzev/pins-check.mjs', 'machtzev/police-selftest.mjs',
  'machtzev/root.mjs', 'machtzev/dart-bin.mjs', 'machtzev/lib-ts.mjs', 'machtzev/verify-independent.mjs',
  'machtzev/truth.mjs', 'machtzev/generator/render-ds.mjs', 'machtzev/generator/acceptance-space.txt',
  'machtzev/census/atom-index.mjs', 'machtzev/census/atom-census.mjs', 'machtzev/census/logic-census.mjs',
  'machtzev/tools/gen-wiring-doc.mjs', 'machtzev/one.mjs',
  'machtzev/ratchet-direction.mjs', 'machtzev/allow-check.mjs', 'machtzev/learn-draft.mjs', 'machtzev/cross-source-check.mjs',
  'machtzev/merge-regen.mjs', 'machtzev/wave-partition.mjs', 'machtzev/census/import-graph.mjs', 'machtzev/compose-engine-report.md',
  'machtzev/wired-floor.json', 'machtzev/coverage-baseline.json', 'machtzev/data-purity-baseline.json',
  'machtzev/deep-purity-baseline.json', 'machtzev/box-proofs-baseline.json', 'machtzev/purity-baseline.json',
  'machtzev/ds-critic-baseline.json', 'machtzev/contract-quality-baseline.json', 'machtzev/dup-class-baseline.json',
  'machtzev/assemble/box-coverage-baseline.json', 'machtzev/generator/atom-index.json', 'machtzev/generator/logic-census.json', 'machtzev/generator/atom-index-full.json',
];
const OPTIONAL = ['.githooks/pre-commit', '.githooks/commit-msg', '.githooks/pre-push', '.claude/settings.json',
  '.claude/hooks/pre-tool.sh', '.claude/hooks/session-start.sh', '.github/workflows/police.yml', '.gitattributes'];
const police = fs.readFileSync(ROOT + 'machtzev/police.mjs', 'utf8');
const DERIVED = [...police.matchAll(/^\s*gate(?:Dirty)?\(\s*'([^']+)'\s*,\s*'([^']+)'/gm)].map((m) => 'machtzev/' + m[2]);
// baselines מוצהרים ב-gates.tsv (עמודה 4) + כל selftest-fixtures/** (fixtures = הראיה; שינוי = pins-write מוצהר — R3-3.6)
const MANIFEST = [...fs.readFileSync(ROOT + 'machtzev/gates.tsv', 'utf8').matchAll(/\t(?:baseline=)?([^\t;]+\.json);(?:dir=)?(?:shrink|grow)\s*$/gm)].map((m) => 'machtzev/' + m[1]);
const FIXTURES = []; (function walk(d) { if (!fs.existsSync(d)) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else FIXTURES.push(path.relative(ROOT, f)); } })(ROOT + 'machtzev/selftest-fixtures');
const PINNED = [...new Set([...STATIC, ...DERIVED, ...MANIFEST, ...FIXTURES, ...OPTIONAL.filter((f) => fs.existsSync(ROOT + f))])].filter((f) => fs.existsSync(ROOT + f)).sort();
const PIN_FILE = ROOT + 'machtzev/pins.sha256';
// בלוק-האמת ב-CLAUDE.md (<!-- truth:begin --> … <!-- truth:end -->) מחולל ע"י truth.mjs בתוך pre-commit (M1) ⇒ פטור מהחתימה
// (PROTOCOL §4 M1): חותמים את הקובץ עם הבלוק מנוטרל. שאר הקובץ נעול כרגיל.
const canon = (f, buf) => f === 'CLAUDE.md' ? Buffer.from(buf.toString('utf8').replace(/<!-- truth:begin[^]*?<!-- truth:end -->/, '<!-- truth-block:pinned-out -->')) : buf;
const hash = (f) => crypto.createHash('sha256').update(canon(f, fs.readFileSync(ROOT + f))).digest('hex');
if (process.argv.includes('--write')) {
  fs.writeFileSync(PIN_FILE, PINNED.map((f) => hash(f) + '  ' + f).join('\n') + '\n');
  console.log(`✍️ חתימות עודכנו (${PINNED.length} קבצים מקובעים: ${STATIC.length} static · ${DERIVED.length} נגזרים מ-police · ${PINNED.length - new Set([...STATIC, ...DERIVED]).size} hooks/workflow)`); process.exit(0);
}
if (process.argv.includes('--list')) { PINNED.forEach((f) => console.log(f)); process.exit(0); }
let pins = {};
try { pins = Object.fromEntries(fs.readFileSync(PIN_FILE, 'utf8').trim().split('\n').filter(Boolean).map((l) => l.split(/\s+/).reverse())); } catch { console.error('🚨 אין pins.sha256 — הרץ --write'); process.exit(1); }
let fail = 0;
const missing = PINNED.filter((f) => !pins[f]), extra = Object.keys(pins).filter((f) => !PINNED.includes(f));
if (missing.length) { console.error('🚨 קבצים ברשימה-הנגזרת בלי חתימה: ' + missing.join(', ')); fail = 1; }
if (extra.length) { console.error('🚨 חתימות לקבצים שאינם ברשימה-הנגזרת (נמחקו/הוסרו מ-police?): ' + extra.join(', ')); fail = 1; }
for (const f of PINNED) {
  if (!pins[f]) continue;
  if (!fs.existsSync(ROOT + f)) { console.error('🚨 קובץ-מקובע נמחק: ' + f); fail = 1; continue; }
  if (hash(f) !== pins[f]) { console.error('🚨 קובץ-מקובע שונה בלי עדכון-חתימה: ' + f); fail = 1; }
}
fail ? process.exit(1) : console.log(`✓ נעילת-השוטרים: ${PINNED.length} קבצים חתומים ותואמים (sha256 מלא · רשימה נגזרת ≡ כתובה)`);
