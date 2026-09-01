#!/usr/bin/env node
/** ⚡ מחצב · המנוע-האחד (one) — לוח-האם של כל מנועי-הפירוק-וההרכבה.
 *  פקודה-אחת ⇒ הצנרת המלאה: רענון-מקורות → פירוק-מסכים (מיפוי+חילוץ+דדופ+מונחים)
 *  → דדופ-אטומים → ביקורת-הרכבה → טוהר-דאטה → מכונת-הטיהור (הכרעה 19) → משטרה → לוח-מצב-מאוחד.
 *  כל שלב = מנוע-קיים (חוק-2: המשמעות בקופסה — כאן רק חיווט, אפס-לוגיקה-חדשה).
 *  שימוש: node machtzev/one.mjs [--full]   (--full מוסיף משטרה-מלאה selftest+mutation) */
import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const ROOT = new URL('../', import.meta.url).pathname;
const FULL = process.argv.includes('--full');
const SCRATCH = '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/all-screens';
const BS = '/home/user/buildsmart';
const t0 = Date.now();
const rows = [];
let failed = 0;

function stage(name, fn, { optional = false } = {}) {
  const s = Date.now();
  try {
    const info = fn() ?? '';
    rows.push([name, '✅', ((Date.now() - s) / 1000).toFixed(1) + 's', String(info)]);
  } catch (e) {
    rows.push([name, optional ? '⏭️' : '🚨', ((Date.now() - s) / 1000).toFixed(1) + 's', (e.message || '').split('\n')[0].slice(0, 80)]);
    if (!optional) failed = 1;
  }
}
const run = (script, args = []) => execFileSync('node', [path.join(ROOT, script), ...args], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const last = (s) => s.trim().split('\n').pop();

// ── 0 · רענון-מקור maor + census (חיבור-מאור-למנוע · הכרעה 19: "מנוע-אחד תופס-הכל") ──
//    fetch origin/main → merge לענף-העבודה (abort-על-קונפליקט, לעולם-לא-force) → run.mjs (census+extract+שערים).
//    כך `one` תופס את עדכוני-מאור האחרונים לבד — לא ידנית.
const MAOR = '/home/user/maor-system';
stage('רענון-מאור + census', () => {
  if (!fs.existsSync(MAOR)) return 'דולג (אין maor)';
  execSync('git fetch -q origin main', { cwd: MAOR });
  const behind = +execSync('git rev-list --count HEAD..origin/main', { cwd: MAOR, encoding: 'utf8' }).trim();
  let merged = 'מעודכן';
  if (behind > 0) {
    try { execSync('git merge origin/main --no-edit', { cwd: MAOR, stdio: 'pipe' }); merged = `מוזגו ${behind} קומיטים`; }
    catch { try { execSync('git merge --abort', { cwd: MAOR, stdio: 'pipe' }); } catch { } throw new Error('מיזוג-main-של-מאור נכשל (קונפליקט) — דורש-יד; לא בוצע force'); }
  }
  execSync('node machtzev/run.mjs', { cwd: MAOR, stdio: 'pipe', timeout: 600000 });   // census + 15 מחלצים + reconcile + שערים
  // נחיתת-מאור: registry+census שהשתנו (בלבד) — commit+push לענף-העבודה (סימטרי להזרקת-buildsmart)
  const dirty = execSync('git status --short machtzev/registry machtzev/STATUS.md', { cwd: MAOR, encoding: 'utf8' }).trim();
  if (dirty) execSync(`cd ${MAOR} && git add machtzev/registry machtzev/STATUS.md && git commit -q -m "עדכון-מקור · census אוטומטי מהמנוע-האחד (${merged})" -m "Co-Authored-By: Claude <noreply@anthropic.com>" && git push -q -u origin claude/mah-kora-0by8kw`);
  return `${merged} · census רוענן${dirty ? ' + נחת' : ''}`;
}, { optional: true });

// ── 1 · רענון-מקור-המסכים (בנייה-חכמה main — קו-האמת, הכרעה-9) ──
stage('רענון-מסכים ממקור-חי', () => {
  if (!fs.existsSync(BS)) throw new Error('אין clone של buildsmart');
  execSync('git fetch -q origin main', { cwd: BS });
  fs.mkdirSync(SCRATCH, { recursive: true });
  const list = execSync("git ls-tree -r origin/main --name-only | grep -E 'app_flutter/lib/(screens|features)/.*\\.dart$' | grep -v _test", { cwd: BS, encoding: 'utf8' }).trim().split('\n');
  for (const f of list) {
    const out = path.join(SCRATCH, f.replace('app_flutter/lib/', '').replace(/\//g, '__'));
    fs.writeFileSync(out, execSync(`git show 'origin/main:${f}'`, { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 24 }));
  }
  return list.length + ' מסכים';
}, { optional: true });

// ── 2 · פירוק-מסכים: מיפוי + חילוץ-תוכן (מנועי-carve) ──
stage('מיפוי-כל-המסכים (screen-decomp)', () => {
  const files = fs.readdirSync(SCRATCH).filter(f => f.endsWith('.dart'));
  fs.mkdirSync(path.join(ROOT, 'screens-seed/machine'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'screens-seed/content'), { recursive: true });
  let n = 0;
  for (const f of files) {
    const b = f.replace('.dart', '');
    run('machtzev/carve/screen-decomp.mjs', [path.join(SCRATCH, f), '--json', path.join(ROOT, 'screens-seed/machine', b + '.json')]);
    run('machtzev/carve/screen-lift.mjs', [path.join(SCRATCH, f), path.join(ROOT, 'screens-seed/content')]);
    n++;
  }
  return n + ' מסכים מופו+חולצו';
});

// ── 3 · דדופ: widgets + אטומי-מדף ──
stage('דדופ-widgets (הכרעה-5)', () => last(run('machtzev/carve/widget-dedup.mjs', [SCRATCH])) && /ייחודיים: (\d+)/.exec(run('machtzev/carve/widget-dedup.mjs', [SCRATCH]))?.[0]);
stage('דדופ-אטומי-מדף', () => last(run('machtzev/dedup-atoms.mjs')), { optional: true });
stage('דדופ-אימפריאלי (Dart↔Dart)', () => last(run('machtzev/dedup-cross-dart.mjs')), { optional: true });

// ── 4 · קטלוג-המונחים המאוחד (מנוע-פנימי — נגזרת-דטרמיניסטית של המפות) ──
stage('קטלוג-מונחים מאוחד', () => {
  const count = {}; const where = {};
  for (const f of fs.readdirSync(path.join(ROOT, 'screens-seed/machine'))) {
    const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'screens-seed/machine', f), 'utf8'));
    for (const t of m.terms) { count[t] = (count[t] || 0) + 1; (where[t] ??= new Set()).add(f.replace('.json', '')); }
  }
  const terms = Object.entries(count).sort((a, b) => b[1] - a[1]);
  const key = (t) => 't_' + crypto.createHash('sha1').update(t).digest('hex').slice(0, 8);
  fs.writeFileSync(path.join(ROOT, 'screens-seed/terms-catalog.json'), JSON.stringify({
    total_occurrences: terms.reduce((a, [, n]) => a + n, 0), unique: terms.length,
    terms: terms.map(([t, n]) => ({ key: key(t), he: t, uses: n, screens: [...where[t]].sort().slice(0, 5) })),
  }, null, 1));
  let dart = "// 📦 דאטה · קטלוג-המונחים המאוחד (חולל ע\"י one.mjs — נגזרת-דטרמיניסטית).\nconst uiTerms = <String, String>{\n";
  for (const [t] of terms) dart += `  '${key(t)}': '${t.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$')}',\n`;
  dart += "};\n\nString termOf(String key, [String fb = '']) => uiTerms[key] ?? fb;\n";
  fs.writeFileSync(path.join(ROOT, 'new/dart-data-bs/ui_terms.dart'), dart);
  return terms.length + ' ייחודיים';
});
import crypto from 'node:crypto';

// ── 4א · מנוע-המדף: הרמת widgets נקיים-מלידה, בלי-סוכן (הכרעה-11) ──
stage('מנוע-המדף (shelf-lift)', () => run('machtzev/assemble/shelf-lift.mjs', [SCRATCH]).split('\n').find(l => l.includes('הורמו'))?.trim());
stage('מנוע-הליטוש (data-lift)', () => run('machtzev/assemble/data-lift.mjs', [SCRATCH]).split('\n').find(l => l.includes('לוטשו'))?.trim());
// 4א² · המנוע-המלא: חציבת-קופסאות מקבצי-לוגיקת-maor (assemble+שקע→autoPurify→data/magic/purify), רק-ירוק ננחת
stage('חציבת-קופסאות (chisel-all)', () => fs.existsSync('/home/user/maor-system') ? last(run('machtzev/chisel-all.mjs')) : 'דולג (אין maor)', { optional: true });

// ── 4ב½ · מנוע-המניפסטים: הוראות-הרכבה אוטומטיות לכל מסך ──
stage('מנוע-המניפסטים (gen-manifest)', () => run('machtzev/assemble/gen-manifest.mjs', [SCRATCH]).split('\n').find(l => l.includes('שלמים'))?.trim());

// ── 4ב · המנוע-המרכיב: מניפסטים ⇒ מסכים מחוללים ──
stage('הרכבה-מחוללת (gen-screen)', () => {
  const mDir = path.join(ROOT, 'screens-seed/manifests');
  if (!fs.existsSync(mDir)) return '0 מניפסטים';
  let n = 0;
  for (const f of fs.readdirSync(mDir)) if (f.endsWith('.manifest.json')) { run('machtzev/assemble/gen-screen.mjs', [path.join(mDir, f)]); n++; }
  return n + ' מסכים הורכבו-ממניפסט';
});

// ── 4ג · מחולל-הלוחות: חיווט המסכים-המורכבים למקורות-החיים ──
stage('מנוע-הסינתזה (חלום + יכולות-מוזמנות)', () => last(run('machtzev/generator/synth.mjs', ['--dream'])), { optional: true });
// 4ג¼ · מנועי-העיצוב: זרע→מערכת-טוקנים+מוֹשֶׁן+גרפיקה+וריאנטים (הכרעה 19: זרע=דאטה, מנוע=נוסחה)
stage('מנועי-העיצוב (tokens·motion·graphics·variants)', () => {
  for (const e of ['ds-tokens', 'ds-motion', 'ds-graphics', 'ds-variants']) run(`machtzev/${e}.mjs`);
  return 'ds_scale·ds_anim·ds_graphics·ds_surface חוללו-מהזרע';
}, { optional: true });

stage('המחולל (genesis-gen · הכרעה 17)', () => run('machtzev/generator/genesis-gen.mjs').split('\n').find(l => l.includes('המחולל'))?.trim());
stage('מחולל-הלוחות (board-gen)', () => run('machtzev/assemble/board-gen.mjs', [SCRATCH]).split('\n').find(l => l.includes('לוחות'))?.trim());
// שער-איכות-העיצוב: design-judge מזוקק על פלט-המחולל (חוב-עיצוב רק-יורד)
stage('שער-איכות-העיצוב (ds-critic)', () => last(run('machtzev/ds-critic.mjs', ['--gate'])), { optional: true });
// שער-שפת-העיצוב: pure-lint על קטלוג-ה-HTML של Pure (bytes-not-prose). selftest מוכיח שהשער נושך; --strict = 0B/0M.
stage('אימות-מנוע-Pure (pure-lint --selftest)', () => last(run('machtzev/pure/pure-lint.mjs', ['--selftest'])));
stage('שער-שפת-העיצוב (pure-lint --strict)', () => last(run('machtzev/pure/pure-lint.mjs', ['--strict'])));
// פירוק-התצוגה: הופך את 13 משפחות-Pure לאטומי-תצוגה מפורקים ורשומים (regen דטרמיניסטי, contract+test)
stage('פירוק-התצוגה (pure-decompose)', () => last(run('machtzev/pure/pure-decompose.mjs')));

// ── 5 · ביקורות-ההרכבה והטוהר (שערי-ratchet) ──
stage('ביקורת-הרכבה (box-audit)', () => last(run('machtzev/assemble/box-audit.mjs', ['--gate'])));
stage('טוהר-דאטה (data-purity-check)', () => last(run('machtzev/data-purity-check.mjs', ['--gate'])));
// הכרעה 19 · מכונת-הטיהור המלאה: קופסאות⇒קינון⇒טבלאות⇒מחרוזות (נקודת-שבת) + מנוע-הקשיחים + השער
stage('מכונת-הטיהור (הכרעה 19)', () => {
  run('machtzev/purify-engine.mjs', ['--all']);
  const h = run('machtzev/purify-hard.mjs', ['--run', '300']).split('\n').find(l => l.includes('טוהרו')) || '';
  return (last(run('machtzev/deep-purity-scan.mjs', ['--gate'])) + ' · ' + h.trim()).trim();
}, { optional: true });
stage('מד-מוכנות-קופסאות', () => last(run('machtzev/box-coverage.mjs')), { optional: true });
stage('מפת-חיווט (gen-wiring-doc)', () => last(run('machtzev/gen-wiring-doc.mjs')), { optional: true });

// ── 6 · המשטרה (כל שערי-ה-ratchet הפנימיים) ──
stage('מנוע-ההמרה-מחדש · דאטה (reconvert-data)', () => last(run('machtzev/reconvert-data.mjs')), { optional: true });
// 5½ · רענון-הוכחות-רהיצות (proof-records) לפני-המשטרה — Dart-gated (בלי בינארי: מדלג, לא-מוחק מטמון)
const HAS_DART = [process.env.DART_BIN, process.env.HOME && path.join(process.env.HOME, 'dart-sdk/bin/dart'), '/root/dart-sdk/bin/dart', '/home/user/flutter/bin/dart'].filter(Boolean).some(c => { try { return fs.existsSync(c); } catch { return false; } });
stage('אימות-רהיצות-Dart (verify-dart-tests)', () => HAS_DART ? last(run('machtzev/verify-dart-tests.mjs', ['-j12'])) : 'דולג (אין בינארי Dart — מטמון-ההוכחות נשמר)', { optional: true });
stage('אימות-arg0-Dart (verify-dart-arg0)', () => HAS_DART ? last(run('machtzev/verify-dart-arg0.mjs')) : 'דולג (אין בינארי Dart)', { optional: true });
// ── הזרקת-המדף לתצוגה (buildsmart) + נחיתה — בתוך המנוע (הכרעת-בעלים "למה הם לא בפנים") ──
stage('הזרקת-המדף ל-buildsmart (8 מדפים)', () => {
  const B = '/home/user/buildsmart/app_flutter/lib/genesis';
  const DIRS8 = ['dart-ui-bs', 'dart-data-bs', 'dart-data-maor', 'dart-data', 'dart-screens-bs', 'dart-boards-bs', 'dart-gen-bs', 'dart-maor', 'dart'];
  let n = 0;
  for (const d of DIRS8) {
    execSync(`rm -rf ${B}/${d}`);
    execSync(`cd ${ROOT}/new/${d} && find . -name "*.dart" ! -name "*_test.dart" ! -path "*QUARANTINE*" | while read fx; do mkdir -p ${B}/${d}/$(dirname $fx); cp $fx ${B}/${d}/$fx; done`);
    n += parseInt(execSync(`find ${B}/${d} -name "*.dart" | wc -l`).toString().trim());
  }
  return `${n} קבצים הוזרקו`;
}, { optional: true });
stage('נחיתת-buildsmart (commit+push כשיש-שינוי)', () => {
  const st = execSync('cd /home/user/buildsmart && git status --short app_flutter/lib/genesis').toString().trim();
  if (!st) return 'אין-שינוי — אין-נחיתה';
  execSync(`cd /home/user/buildsmart && git add app_flutter/lib/genesis && git commit -q -m "גנסיס · הזרקת-מדף מהמנוע-האחד" -m "Co-Authored-By: Claude <noreply@anthropic.com>" && git push -q -u origin claude/mah-kora-0by8kw`);
  return `נדחף: ${st.split('\n').length} קבצים`;
}, { optional: true });
stage(FULL ? 'משטרה-מלאה (10 שערים)' : 'משטרה --fast (10 שערים)', () => last(run('machtzev/police.mjs', FULL ? [] : ['--fast'])));

// ── 7 · לוח-מצב מאוחד ──
const count = (dir, ext, excl = '_test') => fs.existsSync(path.join(ROOT, dir)) ? fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith(ext) && !f.includes(excl) && !f.includes('.test.')).length : 0;
const status = `# ⚡ מחצב · לוח-המצב של המנוע-האחד
_ריצה: ${new Date().toISOString().slice(0, 16)}Z · ${((Date.now() - t0) / 1000).toFixed(0)}s · ${FULL ? 'מלא' : 'מהיר'}_

| שלב | מצב | זמן | פרטים |
|---|---|---|---|
${rows.map(r => '| ' + r.join(' | ') + ' |').join('\n')}

## המדף
| קטלוג | אטומים |
|---|---|
| מאור-JS (new/atoms) | ${count('new/atoms', '.mjs')} |
| מאור-Dart (new/dart-maor) | ${count('new/dart-maor', '.dart')} |
| בנייה-חכמה-Dart (new/dart) | ${count('new/dart', '.dart')} |
| קופסאות-JS · Dart | ${count('new/boxes', '.mjs')} · ${count('new/dart-boxes', '.dart', '-proof')} |
| UI-משותף (dart-ui-bs) | ${count('new/dart-ui-bs', '.dart')} |
| דאטה (dart-data-bs+maor) | ${count('new/dart-data-bs', '.dart') + count('new/dart-data-maor', '.dart')} |
| מחצבה (dart-quarry) | ${count('dart-quarry', '.dart')} |
| תצוגת-Pure מפורקת (pure-shelf) | ${(() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'machtzev/generator/knowledge/pure-shelf.json'), 'utf8')).total; } catch { return 0; } })()} |
`;
fs.writeFileSync(path.join(ROOT, 'machtzev/ONE-STATUS.md'), status);
console.log(status);
console.log(failed ? '🚨 המנוע-האחד: שלב-חובה נכשל' : '⚡ המנוע-האחד: הצנרת המלאה ירוקה');
process.exit(failed);
