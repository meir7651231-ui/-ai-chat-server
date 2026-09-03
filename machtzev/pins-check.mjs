#!/usr/bin/env node
/** מחצב · נעילת-השוטרים (נלמד מ-protocol/pins.sha256 של buildsmart) — c4א של PROTOCOL v4 §12:
 *  החוקה, המשטרה, המחוללים וה-baselines חתומים; שינוי בלי עדכון-חתימה-באותו-commit ⇒ אדום.
 *  c4א: (א) sha256 מלא (היה 16-hex = שורש 64-bit · R2-3.12) · (ב) הרשימה **נגזרת**: כל סקריפט ש-police.mjs
 *  מפעיל (regex על gate(...)) + STATIC (חוקה · מחוללים · baselines · root/dart-bin/lib-ts) + OPTIONAL (hooks/workflow
 *  אם קיימים) — הרשימה לא יכולה לסחוף (R2-2.1, R2-1.5) · (ג) בדיקה דו-כיוונית: pins.sha256 ≡ הרשימה (שני ה-diffs מודפסים).
 *  עדכון: node machtzev/pins-check.mjs --write   (בעתיד: רק עם trailer Allow: pins-write) */
import fs from 'node:fs';
import crypto from 'node:crypto';
import * as R from './root.mjs';
const ROOT = R.ROOT;
const STATIC = [
  'LAW.md', 'CLAUDE.md', 'PURPOSE.md',
  'machtzev/VERIFY-LAWS.md', 'machtzev/THE-WAY.md', 'machtzev/AGENT-CODE.md', 'machtzev/DECISIONS.md', 'machtzev/LEARNINGS.md',
  'machtzev/gates.tsv', 'machtzev/police.mjs', 'machtzev/pins-check.mjs', 'machtzev/police-selftest.mjs',
  'machtzev/root.mjs', 'machtzev/dart-bin.mjs', 'machtzev/lib-ts.mjs',
  'machtzev/truth.mjs', 'machtzev/generator/render-ds.mjs', 'machtzev/generator/acceptance-space.txt',
  'machtzev/census/atom-index.mjs', 'machtzev/census/atom-census.mjs', 'machtzev/census/logic-census.mjs',
  'machtzev/tools/gen-wiring-doc.mjs', 'machtzev/one.mjs',
  'machtzev/wired-floor.json', 'machtzev/coverage-baseline.json', 'machtzev/data-purity-baseline.json',
  'machtzev/deep-purity-baseline.json', 'machtzev/box-proofs-baseline.json', 'machtzev/purity-baseline.json',
  'machtzev/ds-critic-baseline.json', 'machtzev/contract-quality-baseline.json',
];
const OPTIONAL = ['.githooks/pre-commit', '.githooks/commit-msg', '.githooks/pre-push', '.claude/settings.json',
  '.claude/hooks/pre-tool.sh', '.claude/hooks/session-start.sh', '.github/workflows/police.yml', '.gitattributes'];
const police = fs.readFileSync(ROOT + 'machtzev/police.mjs', 'utf8');
const DERIVED = [...police.matchAll(/^\s*gate(?:Dirty)?\(\s*'([^']+)'\s*,\s*'([^']+)'/gm)].map((m) => 'machtzev/' + m[2]);
const PINNED = [...new Set([...STATIC, ...DERIVED, ...OPTIONAL.filter((f) => fs.existsSync(ROOT + f))])].sort();
const PIN_FILE = ROOT + 'machtzev/pins.sha256';
const hash = (f) => crypto.createHash('sha256').update(fs.readFileSync(ROOT + f)).digest('hex');
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
