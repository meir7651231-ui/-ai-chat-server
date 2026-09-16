#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  engine-index.mjs — אינדקס-האמת האחד **לכל מנוע** (מקביל ל-atom-index לאטומים).
//  ────────────────────────────────────────────────────────────────────────
//  🔴 למה הוא קיים: לאטומים יש `atom-index` («מונע פספוס-חוצה-סוכנים») וחיפוש-
//  לפי-מטרה (`search-score`). **למנועים לא היה כלום** — רק `INDEX.md` שהוא טקסט,
//  ו-103 מתוך 213 רשומים בו. לכן השאלה «איזה מנוע פותר לי את X» נענתה ב-grep,
//  ו-grep מוצא רק מה שהשואל כבר ידע לשאול. זה המנגנון שסוגר את זה.
//
//  לכל מנוע חמש עובדות — כולן **נמדדות**, אף אחת לא מנוחשת:
//    איפה יושב   · נתיב · שורות
//    מה המטרה    · מכותרת-הקובץ ⇒ INDEX.md ⇒ ∅ (‏purposeFrom מדווח מאיפה)
//    מה עושה     · ייצואים · דגלי-CLI · מה כותב · אילו אטומי-דאטה קורא
//    מה הוא לא   · עובדות-שלילה מפורשות (אין CLI · אין ייצוא · לא כותב · לא שער
//                  · אין מייבא) — כדי שלא **אניח** יכולת שאינה שם
//    למה מחובר   · מייבא · מיובא-ע"י · רשום בשער · נקרא-בשם (משטרה/one/regen)
//
//  ⚙️ מרכיב משלושה מנועים קיימים, לא בונה מאפס (§21): `census/import-graph.mjs`
//  (מי-מייבא-את-מי) · `search-score.mjs` (‏tok — אותו ניקוד של חיפוש-האטומים)
//  · `INDEX.md` (מרשם-המטרות הקיים).
//
//  🔒 fail-closed (L27): 0 מנועים / 0 מטרות ⇒ exit 2 «הכלי שבור, לא הנתונים».
//
//  שימוש:
//    node engine-index.mjs --write            # כותב generator/engine-index.json
//    node engine-index.mjs --find "<מטרה>"    # חיפוש-לפי-מטרה (לא לפי שם!)
//    node engine-index.mjs <path|שם>          # כרטיס-מנוע מלא
//    node engine-index.mjs --orphans          # בלי-מטרה · בלי-קורא
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { tok, near } from '../search-score.mjs';   // אותו ניקוד-חיפוש של האטומים — עותק אחד, לא שניים
import * as R from '../root.mjs';

const MACH = R.MACH;                       // machtzev/
const ROOT = path.resolve(MACH, '..') + '/';
const OUT = MACH + 'generator/engine-index.json';
// 🌍 **כל** המנועים, לא רק .mjs — נמדד: הריפו מריץ גם shell (‏hooks), גם Dart
// (‏carve/ast_carve.dart, 719 שורות), וגם .js (פונקציית-הענן). סריקת-.mjs-בלבד
// הייתה מחמיצה 15 מנועים, ביניהם **שכבת-האכיפה כולה**.
// 🔁 גם כאן **סורק-הכל-מחריג-בהצהרה**. הפכתי את המדיניות לריפואים-האחים
// והשארתי את הריפו-הראשי על רשימת-תיקיות-שבחרתי — וזה החמיץ 85 קבצי-מנוע
// **בריפו שעבדתי בו כל היום**, ובהם תיקייה ששמה `engine/` (אטלס · מחולל · lib).
const ROOTS = ['.'];
const SELF_SKIP = /\/(node_modules|\.git|new|gen\/out|\.prove|selftest-fixtures)\/|\/(dist|build|coverage)\//;
const EXTRA = [   // נתיב · שפה · למה הוא מנוע
  { dir: '.githooks', re: /^[a-z-]+$/, lang: 'sh', note: 'שכבת-האכיפה של git' },
  { dir: '.claude/hooks', re: /\.sh$/, lang: 'sh', note: 'tripwire של הסוכן' },
  { dir: 'machtzev/carve', re: /\.dart$/, lang: 'dart', note: 'חצב-AST' },
  { dir: 'machtzev/behavioral', re: /\.dart$/, lang: 'dart', note: 'רתמת-התנהגות' },
  { dir: 'server-gen/balagan/functions', re: /^index\.js$/, lang: 'js', note: 'פונקציית-ענן מחוללת' },
  { dir: '.github/workflows', re: /\.ya?ml$/, lang: 'yml', note: 'מנועי-CI — מריצים את המשטרה' },
];
// 🌐 **ריפואים-אחים** — נמדד: «תמונה מלאה» של ריפו אחד הייתה חלקית. ליד יושבים
// `yeshiva-engine-repo` (המנוע הישיבתי **המלא**: 17 מודולים · 6,572 שורות · 5 שכבות
// — דיווחתי «3,034 שורות» כי ראיתי העתק-ישן של 11 קבצים) ו-`buildsmart`
// (‏6,752 dart; 3 שערים מדלגים «בלי buildsmart» בזמן שהוא כאן, בנתיב אחר).
const SIB = [
  // 🔁 **מדיניות הפוכה: סורקים הכל, מחריגים בהצהרה.** רשימת-תיקיות-שבחרתי
  // החמיצה 9 מנועים ב-buildsmart, ביניהם שלושה ששמם literally «engine»
  // (‏polyroll_dim_engine · pure_engine) ועוד שכבת-tripwire שלמה. היקף שנבחר
  // ביד = פספוס מובנה; היקף שנשלל בהצהרה = פספוס **גלוי**.
  { root: '/home/user/yeshiva-engine-repo/', label: 'yeshiva-engine', re: /\.(py|mjs|sh)$/,
    skip: /\/(__pycache__|\.harness-runs|\.git|node_modules)\/|egg-info/ },
  { root: '/home/user/meir7651231-ui/buildsmart/', label: 'buildsmart', re: /\.(mjs|js|ts|sh|py)$/,
    // מוחרג: ספריות-צד-שלישי · תוצרי-בנייה · פיגומי-פלטפורמה של Flutter · קוד-אפליקציה
    skip: /\/(node_modules|dist|build|out|coverage|\.dart_tool|\.git|ephemeral|Pods)\/|\/(ios|android|macos|windows|linux|web)\/|\.d\.ts$|\/app\/src\// },
];
// העתקים-ישנים של המנוע הישיבתי — **לא** מנועים נפרדים, מדווחים כדי שלא ייחשבו:
export const STALE_COPIES = ['engine-A', 'engine-B', 'yeshiva-engine'].map((d) => `/home/user/${d} — 11 קבצים, 5 בלבד זהים למקור (גרסה ישנה)`);
// ❌ מוחרגים **בהצהרה** (לא בשתיקה) — כל אחד עם הסיבה, כדי שאיש לא יניח שנסרקו:
export const EXCLUDED = [
  ['new/**/*.mjs (2,478)', 'מדף-אטומים + קופסאות — יש להם atom-index משלהם'],
  ['selftest-fixtures/*', 'פיקסצ׳רים מורעלים — מוחרגים בכוונה גם ע"י index-check'],
  ['new/**/*.dart (~6,700)', 'אטומי-Dart; ה-main() שבהם = _test.dart, לא מנוע'],
  ['machtzev/generator/.prove/*.dart (86)', 'הוכחות מחוללות (logic-proof), נוצרות בריצה'],
  ['gen/out/**/site/*.js', 'תוצרי-בנייה של Flutter web'],
  ['runtime/engine_api.js', 'באנדל-Dart מהודר (dartProgram), לא מקור'],
  ['gen/looks/app/src/*.js (7)', 'מקור של אפליקציית-דמו, לא מנוע'],
  ['buildsmart/app_flutter/lib · app/src', 'קוד-אפליקציה (6,752 dart), לא מנועים'],
  ['/home/user/maor-system', '**באמת חסר** — חיפוש בכל /home/user לא מצא; 2 שערים מדלגים'],
  ['engine-A · engine-B · yeshiva-engine', 'העתקים-ישנים של המנוע הישיבתי (ראה STALE_COPIES)'],
];

const rel = (p) => {
  for (const sb of (typeof SIB !== 'undefined' ? SIB : [])) if (p.startsWith(sb.root)) return sb.label + '/' + path.relative(sb.root, p).replace(/\\/g, '/');
  return path.relative(ROOT, p).replace(/\\/g, '/');
};
const readIf = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } };

const LANG_OF = (p) => (/\.ya?ml$/.test(p) ? 'yml' : /\.py$/.test(p) ? 'py' : /\.ts$/.test(p) ? 'ts' : /\.mjs$/.test(p) ? 'mjs' : /\.dart$/.test(p) ? 'dart' : /\.js$/.test(p) ? 'js' : 'sh');
function walk(dir, out = []) {
  let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of ents) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(mjs|py|sh)$/.test(e.name)) out.push(p);
  }
  return out;
}

// ── מטרה: כותרת-הקובץ (בלוק-הערה עליון) ⇒ INDEX.md ⇒ ∅. אפס ניחוש ──────────
const BOILER = /^(#!|(?:\/\/|#)\s*[═─=-]{3,}|\/\*|\*\/|\*\s*$|set -[a-z]+)/;
function purposeFromHeader(src) {
  // Python: ‏docstring-המודול הוא **המטרה המוצהרת** (כמו כותרת-הבלוק ב-mjs)
  const ds = src.match(/^\s*(?:"""|''')([\s\S]{2,600}?)(?:"""|''')/);
  if (ds && /[א-ת]/.test(ds[1])) return ds[1].replace(/\s+/g, ' ').trim().slice(0, 420);
  const lines = src.split('\n');
  const buf = [];
  for (const raw of lines.slice(0, 40)) {
    const l = raw.trim();
    if (!l) { if (buf.length) break; continue; }
    if (/^(import|export|const|let|function|class)\b/.test(l)) break;
    if (BOILER.test(l)) continue;
    const t = l.replace(/^\/\/\s?/, '').replace(/^#\s?/, '').replace(/^\*\s?/, '').replace(/^\/\*\*?\s?/, '').trim();
    if (t) buf.push(t);
    if (buf.join(' ').length > 400) break;
  }
  const text = buf.join(' ').replace(/\s+/g, ' ').trim();
  if (!text || !/[א-ת]/.test(text)) return null;
  return text.slice(0, 420);
}

function indexRows() {
  const md = readIf(MACH + 'INDEX.md') || '';
  const rows = [];
  for (const l of md.split('\n')) {
    if (!/^\|\s*`/.test(l)) continue;
    const c = l.split('|');
    const files = [...String(c[1] || '').matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    rows.push({ files, purpose: String(c[2] || '').trim() });
  }
  return rows;
}

// ── מה עושה: ייצואים · דגלי-CLI · כתיבות · אטומי-דאטה נקראים ───────────────
const uniq = (a) => [...new Set(a)].filter(Boolean);
const exportsOf = (s) => uniq([
  ...[...s.matchAll(/^export\s+(?:async\s+)?(?:function|const|class|let)\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]),
  ...[...s.matchAll(/^(?:def|class)\s+([A-Za-z_][\w]*)/gm)].map((m) => m[1]).filter((n) => !n.startsWith('_')),   // Python: ציבורי = בלי קו-תחתי
]);
const flagsOf = (s) => uniq([...s.matchAll(/'(--[a-z][a-z0-9-]*)'/g)].map((m) => m[1]));
// ריצה-מהשורה: דגלים **או** ארגומנט-פוזיציוני (`process.argv[2]`). בלי זה
// `carve/carve-land.mjs` (312 שורות, רץ ביד) נספר כמת — נמדד.
// ריצה-מהשורה = shebang **או** קריאת-argv. בלי ה-shebang נספרו כמתים סקריפטים
// שרצים בלי ארגומנטים בכלל (dedup · empire-coverage · studio-full) — נמדד.
const runnable = (s) => /^#!/.test(s) || /process\.argv/.test(s) || /^void main\(|^Future<void> main\(/m.test(s)
  || /^def main\(|__name__ == ['"]__main__['"]/m.test(s) || /^python3 -m /m.test(s);
const writesOf = (s) => uniq([...s.matchAll(/writeFileSync\(\s*([^,]{1,90}?)\s*,/g)].map((m) => m[1].replace(/\s+/g, ' ').slice(0, 60)));
const dataOf = (s) => uniq([...s.matchAll(/([A-Za-z0-9._-]+\.(?:data\.json|json))['"`]/g)].map((m) => m[1])).slice(0, 12);
const importsOf = (s) => uniq([
  ...[...s.matchAll(/from\s+'(\.[^']+\.mjs)'/g)].map((m) => m[1]),
  // Python: `from .daf import X` · `from . import y` — ייבוא-יחסי בתוך החבילה.
  // בלי זה 90 מודולי המנוע-הישיבתי נראים 90 קבצים מנותקים (נמדד).
  ...[...s.matchAll(/^from\s+\.([A-Za-z_][\w]*)\s+import/gm)].map((m) => `./${m[1]}.py`),
  ...[...s.matchAll(/^import\s+([A-Za-z_][\w]*)$/gm)].map((m) => `./${m[1]}.py`),
  // TS/JS יחסי בלי סיומת
  ...[...s.matchAll(/from\s+['"](\.[^'"]+?)['"]/g)].map((m) => (/\.(mjs|js|ts)$/.test(m[1]) ? m[1] : m[1] + '.ts')),
]);

export function build() {
  const files = ROOTS.flatMap((r) => walk(path.join(ROOT, r))).filter((f) => !SELF_SKIP.test(f + (fs.existsSync(f) && fs.statSync(f).isDirectory() ? '/' : '')));
  for (const sb of SIB) {
    (function w(q) { let e = []; try { e = fs.readdirSync(q, { withFileTypes: true }); } catch { return; }
      for (const x of e) { const f = path.join(q, x.name) + (x.isDirectory() ? '/' : ''); if (sb.skip.test(f)) continue;
        if (x.isDirectory()) w(path.join(q, x.name)); else if (sb.re.test(x.name)) files.push(path.join(q, x.name)); } })(sb.root);
  }
  for (const x of EXTRA) {
    let ents = []; try { ents = fs.readdirSync(path.join(ROOT, x.dir)); } catch { ents = []; }
    for (const n of ents) if (x.re.test(n)) files.push(path.join(ROOT, x.dir, n));
  }
  const IDX = indexRows();
  const police = readIf(MACH + 'police.mjs') || '';
  const one = readIf(MACH + 'one.mjs') || '';
  const regen = readIf(MACH + 'generator/regen.mjs') || '';
  const gates = readIf(MACH + 'gates.tsv') || '';
  // 📞 כל צורות-הקריאה, לא רק ייבוא-סטטי. שלוש מהן נמדדו כמפספסות:
  //   (1) נתיב-תבנית  `./extract/${x}.mjs`  ⇒ כל הקבצים בתיקייה נקראים
  //   (2) סריקת-תיקייה readdirSync(dir) + import  ⇒ אותו דבר
  //   (3) פיקסצ'רים מורעלים — selftest-fixtures **מוחרגת בכוונה** ע"י index-check
  const srcAll = files.map((f) => ({ p: rel(f), s: readIf(f) || '' }));
  // 📄 תיעוד-הרצה: `dart run ast_carve.dart` ב-README של התיקייה הוא **קריאה**
  // — הדרך היחידה שבה כלי-יד מתועד. בלי זה `ast_carve.dart` (720 שורות, מנוע-
  // החציבה המרכזי) נספר כחסר-קורא. נמדד.
  const docs = [];
  (function walkMd(d) { let e = []; try { e = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const x of e) { if (x.name === 'node_modules' || x.name.startsWith('.git')) continue;
      const q = path.join(d, x.name);
      if (x.isDirectory()) walkMd(q); else if (/\.md$/i.test(x.name)) docs.push({ p: rel(q), s: readIf(q) || '' }); } })(path.join(ROOT, 'machtzev'));
  for (const r of ['knowledge', 'yeshiva']) { try { for (const n of fs.readdirSync(path.join(ROOT, r))) if (/\.md$/i.test(n)) docs.push({ p: `${r}/${n}`, s: readIf(path.join(ROOT, r, n)) || '' }); } catch {} }
  try { docs.push({ p: 'CLAUDE.md', s: readIf(ROOT + 'CLAUDE.md') || '' }); } catch {}
  const dirCalls = new Map();   // תיקייה ⇒ מי קורא לה
  const SELF = /census\/engine-index\.mjs$/;   // האינדקס אינו עד לעצמו: ההערות שבו מזכירות מנועים
  for (const { p: cp, s: cs } of srcAll) {
    if (SELF.test(cp)) continue;
    for (const m of cs.matchAll(/['"`]\.{0,2}\/?([A-Za-z0-9_./-]*?)\/\$\{[^}]+\}\.mjs['"`]/g)) {
      const d = m[1].replace(/^\.\//, ''); if (!d) continue;
      (dirCalls.get(d) || dirCalls.set(d, []).get(d)).push(cp);
    }
    for (const m of cs.matchAll(/readdirSync\(([^)]{2,60}?)\)/g)) {
      if (!/import\(/.test(cs)) continue;
      const lit = m[1].match(/['"`]([A-Za-z0-9_./-]+)['"`]/); if (!lit) continue;
      const d = lit[1].replace(/^\.\//, '').replace(/\/$/, '');
      (dirCalls.get(d) || dirCalls.set(d, []).get(d)).push(cp);
    }
  }
  const FIXTURES = 'machtzev/selftest-fixtures';
  // «קריאה» = הרצה או נתיב, לא אזכור-בפרוזה
  const EXEC_RE = (b) => new RegExp(`(?:node|dart|bash|sh|spawnSync|execFileSync|execSync|run)\\s*\\(?\\s*['"\`][^'"\`]*${b.replace(/[.]/g, '\\.')}|[\\w./-]+/${b.replace(/[.]/g, '\\.')}`);

  const engines = [];
  for (const abs of files) {
    const p = rel(abs); const src = readIf(abs) || '';
    const base = path.basename(p);
    const fromMach = p.replace(/^machtzev\//, '');
    const row = IDX.find((r) => r.files.some((f) => f === fromMach || f === base || f.endsWith('/' + base)));
    const head = purposeFromHeader(src);
    const purpose = head || (row ? row.purpose : null);
    const purposeFrom = head ? 'כותרת-הקובץ' : row ? 'INDEX.md' : null;

    // שער: שורה ב-police.mjs ⇒ המזהה ⇒ שורה ב-gates.tsv
    // 🔒 גבול-נתיב חובה: בלי `(?:[^']*\/)?` המילה `gate.mjs` תאמה ל-`coverage-gate.mjs`
    // ו-`run.mjs` ל-`balagan-run.mjs` ⇒ 16 מנועים תבעו שער שאינו שלהם (נמדד:
    // 72 קבצים אבל 56 מזהים ייחודיים). שם-בסיס = מקטע שלם, לא סיומת-מחרוזת.
    // 🎯 התאמה לפי **הנתיב שהמשטרה כותבת**, לא שם-בסיס: שני קבצים בשם
    // `sentence.mjs` (‏gen/ ו-generator/) תבעו את אותו שער. המשטרה כותבת נתיב
    // יחסי ל-machtzev/ (או `../yeshiva/…`), ולכן זו ההשוואה הנכונה והיחידה.
    const asPolice = p.startsWith('machtzev/') ? fromMach : p.startsWith('yeshiva/') ? '../' + p : null;
    const g = asPolice ? police.match(new RegExp(`gate(?:Dirty)?\\('([a-z-]+)',\\s*'${asPolice.replace(/[.\/]/g, (c) => '\\' + c)}'`)) : null;
    const gate = g ? g[1] : null;
    const gateRow = gate && new RegExp(`^${gate}\\t`, 'm').test(gates);

    engines.push({
      file: p, lang: LANG_OF(p), lines: src.split('\n').length,
      purpose, purposeFrom,
      exports: exportsOf(src), cli: flagsOf(src), writes: writesOf(src), reads: dataOf(src),
      imports: importsOf(src), importedBy: [],
      gate, gateRegistered: !!gateRow,
      calledByName: uniq([
        police.includes(fromMach) && 'police', one.includes(fromMach) && 'one', regen.includes(fromMach) && 'regen',
        // נתיב-תבנית / סריקת-תיקייה: מי שקורא לתיקייה קורא לכל .mjs שבה
        ...[...dirCalls.entries()].filter(([d]) => p.includes('/' + d + '/') || fromMach.startsWith(d + '/')).flatMap(([, who]) => who.map((w) => path.basename(w, '.mjs'))),
        p.startsWith(FIXTURES) && 'selftest-fixtures (מוחרג-בכוונה)',
        // הזכרה **בהקשר-הרצה** במנוע אחר (`node X` · `spawnSync('X')` · נתיב-עם-לוכסן).
        // הזכרה-בפרוזה אינה קריאה: בלי ההידוק, כל הערה שמכילה «pre-commit» הפכה
        // שלושה מנועים ל"קוראים" שלו, והאינדקס הזה ספר את עצמו כקורא (נמדד).
        ...srcAll.filter((x) => x.p !== p && !/census\/engine-index\.mjs$/.test(x.p) && EXEC_RE(base).test(x.s))
          .map((x) => path.basename(x.p).replace(/\.(mjs|dart|js|sh)$/, '')).slice(0, 3),
        // hooks: git מריץ אותם דרך core.hooksPath — קריאה מבנית, לא הזכרה
        ...docs.filter((d) => !SELF.test(d.p) && d.s.includes(base) && EXEC_RE(base).test(d.s)).map((d) => `📄 ${path.basename(d.p)}`).slice(0, 2),
        /^\.githooks\//.test(p) && 'git (hooksPath)',
        /^\.claude\/hooks\//.test(p) && 'claude (settings.json)',
      ]),
      runnable: runnable(src),
      inIndexMd: !!row,
    });
  }

  // מי-מייבא-את-מי (רזולוציית-נתיב אמיתית, לא לפי שם)
  const byPath = new Map(engines.map((e) => [e.file, e]));
  for (const e of engines) {
    for (const im of e.imports) {
      const tgt = rel(path.resolve(ROOT, path.dirname(e.file), im));
      const t = byPath.get(tgt); if (t) t.importedBy.push(e.file);
    }
  }
  for (const e of engines) {
    e.importedBy = uniq(e.importedBy);
    // «מה הוא לא» — עובדות-שלילה מפורשות, כדי שאיש לא יניח יכולת שאינה שם
    e.isNot = uniq([
      !e.purpose && 'אין-מטרה-מתועדת',
      !e.exports.length && 'אין-ייצוא (לא ספרייה)',
      !e.cli.length && !e.runnable && 'לא-רץ-מהשורה',
      !e.writes.length && 'לא-כותב-פלט',
      !e.gate && 'לא-שער-משטרה',
      !e.importedBy.length && !e.calledByName.length && 'אין-קורא-ידוע',
      !e.inIndexMd && 'לא-ב-INDEX.md',
    ]);
  }
  engines.sort((a, b) => a.file.localeCompare(b.file));
  return { engines, roots: ROOTS, at: new Date().toISOString().slice(0, 10) };
}

// ── חיפוש-לפי-מטרה (לא לפי שם) — אותו IDF של חיפוש-האטומים ────────────────
export function find(q, engines, k = 5) {
  const docs = engines.filter((e) => e.purpose);
  const df = {}; for (const e of docs) for (const t of new Set(tok(e.purpose))) df[t] = (df[t] || 0) + 1;
  const idf = (t) => Math.log(docs.length / (1 + (df[t] || 0)));
  const qs = [...new Set(tok(q))];
  return docs.map((e) => {
    // התאמה דרך `near` (‏search-score): זהות או קידומת ≥4 — «המציא» ≡ «המצאה».
    // שוויון-מחרוזות בלבד היה מחמיץ את גלאי-ההמצאה על השאלה «המציא שדה» (נמדד).
    const ts = tok(e.purpose + ' ' + e.exports.join(' '));
    let sc = 0; for (const t of qs) if (ts.some((x) => near(x, t))) sc += idf(t);
    return { ...e, score: +sc.toFixed(2) };
  }).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).slice(0, k);
}

const card = (e) => {
  const L = [];
  L.push(`📍 ${e.file}  (${e.lines} שורות)`);
  L.push(`🎯 מטרה: ${e.purpose ? e.purpose.slice(0, 260) : '∅ — לא מתועדת'}${e.purposeFrom ? `   [${e.purposeFrom}]` : ''}`);
  L.push(`🔧 עושה: ${e.exports.length} ייצואים${e.exports.length ? ' (' + e.exports.slice(0, 6).join(', ') + ')' : ''}` +
    `${e.cli.length ? ` · CLI ${e.cli.slice(0, 6).join(' ')}` : ''}${e.writes.length ? ` · כותב ${e.writes.length}` : ''}${e.reads.length ? ` · קורא ${e.reads.slice(0, 3).join(', ')}` : ''}`);
  L.push(`🚫 לא: ${e.isNot.join(' · ') || '—'}`);
  L.push(`🔌 מחובר: ${e.importedBy.length} מייבאים${e.importedBy.length ? ' (' + e.importedBy.slice(0, 3).map((x) => path.basename(x)).join(', ') + ')' : ''}` +
    `${e.gate ? ` · שער «${e.gate}»${e.gateRegistered ? '' : ' (לא במרשם!)'}` : ''}${e.calledByName.length ? ` · נקרא-בשם: ${e.calledByName.join(',')}` : ''}`);
  return L.join('\n');
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const A = process.argv.slice(2);
  const { engines, at } = build();
  if (!engines.length || !engines.filter((e) => e.purpose).length) {
    console.error(`🛠️ engine-index: ${engines.length} מנועים · ${engines.filter((e) => e.purpose).length} מטרות — הכלי שבור, לא הנתונים (fail-closed)`);
    process.exit(2);
  }
  const withP = engines.filter((e) => e.purpose).length;
  const orphan = engines.filter((e) => e.isNot.includes('אין-קורא-ידוע'));

  if (A.includes('--write')) {
    fs.writeFileSync(OUT, JSON.stringify({ at, count: engines.length, withPurpose: withP, engines }, null, 1) + '\n');
    console.log(`📐 engine-index נכתב: ${engines.length} מנועים · ${withP} עם מטרה · ${orphan.length} בלי קורא ⇒ ${rel(OUT)}`);
  } else if (A.includes('--find')) {
    const q = A.slice(A.indexOf('--find') + 1).join(' ');
    if (!q) { console.log('usage: --find "<מטרה בעברית>"'); process.exit(0); }
    console.log(`❓ ${q}\n`);
    for (const r of find(q, engines)) console.log(`${String(r.score).padStart(6)}  ${r.file}\n        ${(r.purpose || '').slice(0, 150)}\n`);
  } else if (A.includes('--orphans')) {
    console.log(`בלי-מטרה: ${engines.length - withP} · בלי-קורא: ${orphan.length}\n`);
    for (const e of engines.filter((x) => !x.purpose)) console.log(`  ∅ מטרה   ${e.file}`);
    for (const e of orphan) console.log(`  ∅ קורא   ${e.file}`);
  } else if (A.length && !A[0].startsWith('--')) {
    const hits = engines.filter((e) => e.file.includes(A[0]) || path.basename(e.file) === A[0]);
    if (!hits.length) { console.log(`אין מנוע שנתיבו מכיל «${A[0]}» — נסה --find "<מטרה>"`); process.exit(0); }
    for (const e of hits.slice(0, 5)) { console.log(card(e)); console.log(); }
  } else {
    console.log(`מנועים: ${engines.length} · עם מטרה: ${withP} (${(withP / engines.length * 100).toFixed(0)}%) · בלי קורא ידוע: ${orphan.length}`);
    const byRoot = {}; for (const e of engines) { const r = e.file.split('/')[0]; byRoot[r] = (byRoot[r] || 0) + 1; }
    console.log('לפי שורש: ' + Object.entries(byRoot).map(([k, v]) => `${k} ${v}`).join(' · '));
    console.log(`מקור-המטרה: כותרת ${engines.filter((e) => e.purposeFrom === 'כותרת-הקובץ').length} · INDEX.md ${engines.filter((e) => e.purposeFrom === 'INDEX.md').length} · ∅ ${engines.length - withP}`);
    console.log(`שערים: ${engines.filter((e) => e.gate).length} · מהם לא-במרשם: ${engines.filter((e) => e.gate && !e.gateRegistered).length}`);
    console.log('\nusage: --write | --find "<מטרה>" | <שם-קובץ> | --orphans');
  }
}
