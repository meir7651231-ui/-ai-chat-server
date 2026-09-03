#!/usr/bin/env node
/** מחצב · המשטרה-המאוחדת עם ran-ledger (K3 מ-protocol-v10) — c2 של PROTOCOL v4 §12:
 *  מריץ את כל השערים, פולט שורת-ledger לכל אחד, ומשווה 1:1 מול gates.tsv.
 *  ledger ב-4 מצבים (L13 · L34): ran · skipped · yellow · failed.
 *   • skipped (--fast) **אינו** ran — פסק-הדין מדפיס "N ran · S skipped" (היה: נספר-כנרשם ⇒ "21/21" כוזב).
 *   • yellow = exit 2 + `tool=<name>` ב-stderr, **ורק אם הכלי באמת חסר** — צהוב עם כלי-קיים = failed.
 *   • timeout = yellow:timeout (הרג SIGKILL לקבוצת-התהליכים דרך coreutils `timeout`, לא רק לילד).
 *   • סיווג לפי error.code/signal לפני status (ENOENT/ETIMEDOUT/SIGKILL ≠ "אדום").
 *  exit: 0 = ירוק · 2 = צהוב-בלבד (טבעת-commit מקבלת, push/CI לא) · 1 = אדום.
 *  --fast מדלג על היקרים (skipped) · --inc: טרם קיים גרף-צרכנים (c3) ⇒ מודיע ומריץ מלא (fail-closed).
 *  נעילה: pid-lock ב-git-dir (ריצה אחת; lock של תהליך מת = מתעלמים). */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { resolveDart } from './dart-bin.mjs';
import * as R from './root.mjs';
import { fileURLToPath } from 'node:url';
// c3 · הפרדה קריטית (RED-TEAM R2-1.1): TOOLS = הסקריפטים של המשטרה הזו-עצמה (הקוד הרץ, למשל מ-tag ידוע-טוב);
// HERE = machtzev/ של העץ **הנמדד** (gates.tsv · node_modules · baselines) — שונה רק כש-MACHTZEV_ROOT מוגדר.
const TOOLS = path.dirname(fileURLToPath(import.meta.url)) + '/';
const HERE = R.MACH;
const INC = process.argv.includes('--inc');
const FAST = process.argv.includes('--fast') || INC;
const FAST_ARGV = FAST;   // R3-4.3: skipped מותר רק כש-argv ביקש; במצב מלא כל skipped = אדום   // --inc = טבעת-commit: היקרים מדולגים כמו --fast
const GATE_TIMEOUT_S = Number(process.env.POLICE_GATE_TIMEOUT || 600);

// ── --inc (שלב 1 · R2-5.3): רק דיף+צרכנים ל-contract/wiring/mutation. fail-closed ⇒ מלא (R2-1.10 · R2-2.12) ──
// מקור-השינויים: --files a,b,c או git diff --cached. הרחבה: census/import-graph.mjs (סטטי; import() דינמי ⇒ unknown ⇒ מלא).
let INC_FILES = null;   // null = מלא; אחרת רשימת-נתיבים מוחלטים
if (INC) {
  const fi = process.argv.indexOf('--files');
  let changed = fi >= 0 ? process.argv[fi + 1].split(',') : [];
  if (!changed.length) { try { changed = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMRD'], { cwd: R.ROOT, encoding: 'utf8' }).split('\n').filter(Boolean).map((f) => path.join(R.ROOT, f)); } catch {} }
  const inNew = changed.filter((f) => f.startsWith(R.NEW.replace(/\/$/, '')));
  const outside = changed.filter((f) => !f.startsWith(R.NEW.replace(/\/$/, '')) && !/\.md$/.test(f));   // R3-3.9: כל קובץ מחוץ ל-new/ שאינו תיעוד ⇒ מלא
  let why = '';
  if (!changed.length) why = 'אין דיף';
  else if (outside.length) why = `שינוי מחוץ ל-new/ (${path.relative(R.ROOT, outside[0])}${outside.length > 1 ? ' +' + (outside.length - 1) : ''}) — כלים/מנוע ⇒ מלא`;
  else {
    const { consumersOf } = await import('./census/import-graph.mjs');
    const r = consumersOf(inNew);
    if (r.unknown.length) why = `import() דינמי / קובץ בלי-בעלים (${r.unknown.length}) — צרכנים לא-ידועים`;
    else if (r.files.length > 50) why = `${r.files.length} קבצים > 50`;
    else if (!r.files.length) why = 'סט-אינקרמנטלי ריק';   // R3-3.9: [] הוא truthy — לא מסננים לכלום
    else INC_FILES = r.files;
  }
  if (INC_FILES) console.log(`ℹ️ inc: ${inNew.length} שונו ⇒ ${INC_FILES.length} לבדיקה (דיף+צרכנים, import-graph)`);
  else console.log(`ℹ️ inc → full (fail-closed): ${why}`);
}
const filesArg = () => (INC_FILES ? ['--files', INC_FILES.join(',')] : []);

// ── מרשם (עמודה 0; עמודות נוספות — layer/baseline — נקראות ע"י ה-hooks, לא כאן) ──
const registry = new Set(fs.readFileSync(HERE + 'gates.tsv', 'utf8').split('\n')
  .filter(l => l && !l.startsWith('#')).map(l => l.split('\t')[0]));

// ── נעילה: ריצה אחת בו-זמנית (L14: פסק-דין על עץ-נח) ──
const gitDir = (() => { try { return execFileSync('git', ['rev-parse', '--absolute-git-dir'], { cwd: HERE, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; } })();
const LOCK = gitDir ? path.join(gitDir, 'police.lock') : null;
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
if (LOCK) {
  try {
    const old = fs.existsSync(LOCK) ? Number(fs.readFileSync(LOCK, 'utf8')) : 0;
    if (old && old !== process.pid && alive(old)) { console.error(`🚨 המשטרה כבר רצה (pid ${old}) — ריצה אחת בלבד`); process.exit(1); }
    fs.writeFileSync(LOCK, String(process.pid));
    process.on('exit', () => { try { if (Number(fs.readFileSync(LOCK, 'utf8')) === process.pid) fs.unlinkSync(LOCK); } catch {} });
  } catch {}
}

// ── ledger ──
const ran = new Set(), skipped = new Set(), yellow = new Map(), failed = new Set();
const hasTimeout = (() => { try { execFileSync('timeout', ['--version'], { stdio: 'ignore' }); return true; } catch { return false; } })();

// אימות "הכלי באמת חסר" — צהוב-כוזב (exit 2 עם כלי קיים) = אדום.
const KNOWN_TOOLS = new Set(['dart', 'typescript', 'node', 'git', 'jq', 'timeout']);   // R3-3.1: צהוב רק לכלי-חיצוני מוצהר, לא לכל מחרוזת
const toolMissing = (tool) => {
  if (tool === 'dart') return !resolveDart();
  if (tool === 'typescript') return !fs.existsSync(HERE + 'node_modules/typescript/package.json') && !fs.existsSync('/home/user/maor-system/node_modules/typescript/package.json');
  try { execFileSync('bash', ['-lc', `command -v ${tool}`], { stdio: 'ignore' }); return false; } catch { return true; }
};

const runGate = (id, script, args) => {
  const t0 = Date.now();
  const argv = hasTimeout ? ['-s', 'KILL', `${GATE_TIMEOUT_S}s`, 'node', TOOLS + script, ...args] : [TOOLS + script, ...args];
  const r = spawnSync(hasTimeout ? 'timeout' : 'node', argv, { stdio: ['ignore', 'inherit', 'pipe'], timeout: hasTimeout ? undefined : GATE_TIMEOUT_S * 1000, killSignal: 'SIGKILL', encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const ms = Date.now() - t0;
  if (r.stderr) process.stderr.write(r.stderr);
  const timedOut = r.error?.code === 'ETIMEDOUT' || (hasTimeout && (r.status === 124 || r.status === 137) && ms >= GATE_TIMEOUT_S * 950);   // R3-3.8: קוד-124 של השער עצמו ≠ timeout
  if (r.error?.code === 'ENOENT') { yellow.set(id, 'tool=node'); console.log(`yellow ${id} ${ms}ms tool=node`); return; }
  if (timedOut) { yellow.set(id, 'timeout'); console.log(`yellow ${id} ${ms}ms timeout=${GATE_TIMEOUT_S}s`); return; }
  if (r.signal) { failed.add(id); console.log(`failed ${id} ${ms}ms signal=${r.signal}`); return; }
  if (r.status === 0) { ran.add(id); console.log(`ran ${id} ${ms}ms`); return; }
  if (r.status === 2) {
    const tool = (String(r.stderr || '').match(/tool=([A-Za-z0-9_.-]+)/) || [])[1];
    if (tool && KNOWN_TOOLS.has(tool) && toolMissing(tool)) { yellow.set(id, 'tool=' + tool); console.log(`yellow ${id} ${ms}ms tool=${tool}`); return; }
    failed.add(id); console.log(`failed ${id} ${ms}ms exit=2 ${tool ? (KNOWN_TOOLS.has(tool) ? 'צהוב-כוזב: הכלי ' + tool + ' קיים' : 'כלי לא-מוכר ' + tool + ' (R3-3.1: רק ' + [...KNOWN_TOOLS].join('/') + ')') : 'exit 2 בלי tool='}`); return;
  }
  failed.add(id); console.log(`failed ${id} ${ms}ms exit=${r.status}`);
};

const gate = (id, script, args = [], skip = false) => {
  if (skip) { skipped.add(id); console.log(`skipped ${id} (--fast)`); return; }
  runGate(id, script, args);
};
// שער-"מלכלך": מצלם dart-gen-bs לפני, מריץ, ומשחזר-מדויק אחרי (המחולל כותב פלט; המשטרה חייבת עץ-נח · L14).
// (c3 מחליף ב-outDir()/GEN_OUT; עד אז — snapshot/restore תחת ה-lock, ב-finally.)
const snapD = (d, re) => { try { return Object.fromEntries(fs.readdirSync(d).filter(f => re.test(f)).map(f => [f, fs.readFileSync(d + '/' + f, 'utf8')])); } catch { return {}; } };
const restoreD = (d, re, s) => { try { for (const f of fs.readdirSync(d)) if (re.test(f)) fs.unlinkSync(d + '/' + f); } catch {} for (const [f, c] of Object.entries(s)) { try { fs.writeFileSync(d + '/' + f, c); } catch {} } };
const GENd = R.outDir(), DATAd = R.dataOutDir(), GAP = /^gen_app_.*\.dart$/;
const gateDirty = (id, script, args = [], skip = false) => {
  if (skip) { skipped.add(id); console.log(`skipped ${id} (--fast)`); return; }
  const s1 = snapD(GENd, GAP), s2 = snapD(DATAd, GAP);
  try { runGate(id, script, args); } finally { restoreD(GENd, GAP, s1); restoreD(DATAd, GAP, s2); }
};

gate('wiring', 'wiring-check.mjs', [R.NEW, ...filesArg()]);
gate('contract', 'contract-check.mjs', [R.NEW, ...filesArg()]);
gate('quarry', 'quarry-check.mjs', [R.p('quarry')]);
gate('freeref', 'emit/free-ref-scan.mjs', ['--gate']);
gate('datapurity', 'data-purity-check.mjs', ['--gate']);
gate('deeppurity', 'deep-purity-scan.mjs', ['--gate']);
gate('assembly', 'assemble/box-audit.mjs', ['--gate']);
gate('synth', 'generator/synth.mjs', ['--gate']);
gate('genratchet', 'mahulal/generator-ratchet.mjs');
gate('independence', 'purity/independence-check.mjs');
gate('puredata', 'purity/purity-data.mjs', ['--gate']);
gateDirty('acceptance', 'mahulal/spec-acceptance.mjs');
gateDirty('nlsmoke', 'mahulal/nl-smoke.mjs', [], FAST);
gateDirty('nlquality', 'mahulal/nl-quality.mjs', [], FAST);
gate('oracle', 'census/oracle.mjs', ['--gate']);
gate('truth', 'truth.mjs', ['--gate']);
gate('coverage', 'coverage-gate.mjs');
gate('pins', 'pins-check.mjs');
gate('boxes', 'box-proofs-check.mjs', ['--gate'], FAST);
gate('no-fakers', 'no-fakers-check.mjs');
gate('compose-determinism', 'compose-engine.mjs', ['--gate']);
gate('index-complete', 'index-check.mjs');
gate('atom-count', 'atom-count-check.mjs');
gate('learn', 'learn-check.mjs');
gate('pretool', 'pretool-selftest.mjs');
gate('selftest', 'police-selftest.mjs', [], FAST);
gate('audit-gates', 'audit-gates.mjs', process.env.CI ? ['--full'] : [], FAST);
gate('mutation-dart', 'mutation-dart-check.mjs', process.env.CI ? ['--sample', '100'] : [], FAST);   // CI: 100/יום · push: 12/יום · --all ידני
gate('mutation', 'mutation-check.mjs', [...filesArg()], FAST && !INC_FILES);   // תחת --inc: מוטציה על הדיף בלבד (לא מדולג)

// ── פריטי מרשם⇄ריצה — דו-כיווני; skipped/yellow/failed "נראו", לא "רצו" ──
let fail = failed.size > 0;
if (!FAST_ARGV && skipped.size) { console.error(`🚨 שערים דולגו במצב מלא (R3-4.3): ${[...skipped].join(', ')}`); fail = true; }
const all = new Set([...ran, ...skipped, ...yellow.keys(), ...failed]);
for (const id of registry) if (!all.has(id)) { console.error(`🚨 שער רשום שלא רץ ולא דווח: ${id}`); fail = true; }
for (const id of all) if (!registry.has(id)) { console.error(`🚨 שער רץ שאינו במרשם: ${id}`); fail = true; }

const summary = `${ran.size} ran · ${skipped.size} skipped · ${yellow.size} yellow · ${failed.size} failed · מרשם ${registry.size}` + (resolveDart() ? '' : ' · אין Dart');
if (fail) { console.log(`🚨 המשטרה אדומה — ${summary}${failed.size ? ' [' + [...failed].join(',') + ']' : ''}`); process.exit(1); }
if (yellow.size) { console.log(`🟡 המשטרה צהובה — ${summary} [${[...yellow].map(([k, v]) => k + ':' + v).join(' ')}]`); process.exit(2); }
console.log(`✅ המשטרה ירוקה — ${summary}`);
process.exit(0);
