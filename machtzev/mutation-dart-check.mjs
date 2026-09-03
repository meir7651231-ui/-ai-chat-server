#!/usr/bin/env node
/** מחצב · mutation-dart-check — שער `mutation-dart` (PROTOCOL v4 §7.2 · שלב 8 · L11 · סבב-3: R3-3.2 · R3-5.5 · R3-5.6 · R3-5.18 · R3-5.19).
 *  לכל זוג `<x>.dart` + `<x>_test.dart` תחת new/dart* (רקורסיבי): מחליל type-preserving את גוף הפונקציות-העליונות
 *  (int⇒0 · double⇒0.0 · String⇒'' · bool⇒false · List⇒const [] · Map/Set⇒const {} · T?⇒null · void⇒return), כולל `=>`
 *  וארגומנטים עם סוגריים-מקוננים (function-typed params), ומריץ את הבדיקה על העותק-החלול ב-sandbox (20s).
 *  · ירוקה-על-חלול ⇒ 🔴 בדיקה חלולה. · כשל-קומפילציה של החלול ⇒ unparsed (לא "נתפס"! R3-5.5).
 *  · unparsed = חוב מוצהר ורק-יורד (mutation-dart-baseline.json {unparsed} · shrink, נאכף ב---all) — לא ירוק-שקט (R3-3.2/5.6).
 *  · אטומים בלי בדיקה נספרים ומדווחים (untested). · דגימה: seed = HEAD sha (לא תאריך), Fisher–Yates (R3-5.18).
 *  אין Dart ⇒ exit 2 tool=dart ב-stderr (L34). --sample N (12) · --all · --files a,b · --write (baseline). */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { resolveDart } from './dart-bin.mjs';
import * as R from './root.mjs';
const DART = resolveDart();
if (!DART) { console.error('tool=dart'); console.log('🟡 mutation-dart: אין בינארי-Dart — tool=dart'); process.exit(2); }
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const BL = R.MACH + 'mutation-dart-baseline.json';
// ── אינוונטר: כל new/dart* רקורסיבי; זוגות + אטומים-בלי-בדיקה ──
const DIRS = fs.readdirSync(R.NEW, { withFileTypes: true }).filter((e) => e.isDirectory() && /^dart/.test(e.name)).map((e) => path.join(R.NEW, e.name));
const atoms = [];
for (const d of DIRS) (function walk(x) { for (const e of fs.readdirSync(x, { withFileTypes: true })) { const f = path.join(x, e.name); if (e.isDirectory()) { if (!/quarantine|node_modules/i.test(e.name)) walk(f); } else if (e.name.endsWith('.dart') && !/_test\.dart$|-proof\.dart$/.test(e.name)) atoms.push(f); } })(d);
let pairs = atoms.filter((a) => fs.existsSync(a.replace(/\.dart$/, '_test.dart'))).map((a) => ({ atom: a, test: a.replace(/\.dart$/, '_test.dart') })).sort((x, y) => x.atom.localeCompare(y.atom));
const total = pairs.length, untested = atoms.length - total;
if (opt('--files')) { const want = new Set(opt('--files').split(',').map((s) => path.resolve(s))); pairs = pairs.filter((p) => want.has(p.atom) || want.has(p.test)); }
else if (!argv.includes('--all') && !argv.includes('--write')) {
  const n = Number(opt('--sample') || 12);
  let seed = 0; try { seed = parseInt(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: R.ROOT, encoding: 'utf8' }).slice(0, 8), 16) || 1; } catch { seed = Date.now() % 2147483647; }
  const rnd = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  const arr = [...pairs]; for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }   // Fisher–Yates
  pairs = arr.slice(0, n).sort((x, y) => x.atom.localeCompare(y.atom));
}
// ── מחליל ──
const DEF = { int: '0', double: '0.0', num: '0', String: "''", bool: 'false', dynamic: 'null', Object: 'null' };   // dynamic/Object ⇒ null (חוקי-טיפוסית)
const hollowVal = (ret) => { const t = ret.trim(); if (t === 'void') return 'return;'; if (t.endsWith('?')) return 'return null;'; if (DEF[t] !== undefined) return `return ${DEF[t]};`; if (/^(List|Iterable)\b/.test(t)) return 'return const [];'; if (/^(Map|Set)\b/.test(t)) return 'return const {};'; return null; };
/** מדלג על מחרוזות/הערות בעת ספירת-סוגריים (R3-5.5: `'}'` בתוך מחרוזת שבר את המונה) */
const skipLiteral = (src, i) => {
  const c = src[i];
  if (c === '/' && src[i + 1] === '/') { const e = src.indexOf('\n', i); return e < 0 ? src.length : e; }
  if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); return e < 0 ? src.length : e + 2; }
  if (c === "'" || c === '"') { const triple = src.startsWith(c.repeat(3), i); const q = triple ? c.repeat(3) : c; let j = i + q.length; while (j < src.length) { if (src[j] === '\\') { j += 2; continue; } if (src.startsWith(q, j)) return j + q.length; j++; } return src.length; }
  return -1;
};
const matchParen = (src, i) => { let d = 0, j = i; while (j < src.length) { const s = skipLiteral(src, j); if (s >= 0) { j = s; continue; } if (src[j] === '(') d++; else if (src[j] === ')') { d--; if (!d) return j; } j++; } return -1; };
const matchBrace = (src, i) => { let d = 0, j = i; while (j < src.length) { const s = skipLiteral(src, j); if (s >= 0) { j = s; continue; } if (src[j] === '{') d++; else if (src[j] === '}') { d--; if (!d) return j; } j++; } return -1; };
const HEAD_RE = /^([A-Za-z_][\w<>,?\s]*?)\s+([a-z_][\w]*)(<[^>]*>)?\s*\(/gm;   // <ret> <name>[<T>](
export function hollow(src) {
  let out = '', last = 0, n = 0, unparsed = 0, pub = 0;   // pub = פונקציות ציבוריות שהוחללו; רק-פרטיות ⇒ הוכחה חלשה ⇒ unparsed
  for (const m of src.matchAll(HEAD_RE)) {
    if (m.index < last) continue;
    const ret = m[1].trim(); if (/^(return|else|if|for|while|switch|class|enum|new|await|throw|case|typedef|extension|mixin|final|const|var)$/.test(ret) || /\b(class|enum)\b/.test(ret)) continue;
    const close = matchParen(src, m.index + m[0].length - 1); if (close < 0) { unparsed++; continue; }
    const rest = src.slice(close + 1, close + 40); const after = rest.match(/^\s*(async\s*\*?|sync\s*\*?)?\s*(\{|=>)/);
    if (!after) continue;                                           // הצהרה בלבד / חתימה-של-מתודה בתוך מחלקה ⇒ לא פונקציה-עליונה
    const val = hollowVal(ret); if (val === null) { unparsed++; continue; }
    const bodyStart = close + 1 + after[0].length;
    if (after[2] === '{') { const bodyEnd = matchBrace(src, bodyStart - 1); if (bodyEnd < 0) { unparsed++; continue; } out += src.slice(last, bodyStart - 1) + `{ ${val} }`; last = bodyEnd + 1; }
    else {
      let j = bodyStart;
      while (j < src.length) { const s = skipLiteral(src, j); if (s >= 0) { j = s; continue; } if (src[j] === '(' || src[j] === '{' || src[j] === '[') { const e = src[j] === '(' ? matchParen(src, j) : src[j] === '{' ? matchBrace(src, j) : src.indexOf(']', j); if (e < 0) break; j = e + 1; continue; } if (src[j] === ';') break; j++; }
      out += src.slice(last, bodyStart - after[0].length) + ` { ${val} }`; last = j + 1;
    }
    n++; if (!m[2].startsWith('_')) pub++;
  }
  return { src: out + src.slice(last), n, unparsed, pub };
}
// ── הרצה ב-sandbox ──
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mut-dart-'));
process.on('exit', () => fs.rmSync(tmp, { recursive: true, force: true }));
let vacuous = [], real = 0, unparsedFiles = [], compileFail = [], broken = [];
for (const p of pairs) {
  const h = hollow(fs.readFileSync(p.atom, 'utf8'));
  if (!h.n || !h.pub) { unparsedFiles.push(path.relative(R.ROOT, p.atom) + (h.n && !h.pub ? ' (רק-פרטיות)' : '')); continue; }   // בלי פונקציה-ציבורית-מוחללת אין הוכחה על הבדיקה
  const d = fs.mkdtempSync(path.join(tmp, 'p-'));
  fs.writeFileSync(path.join(d, path.basename(p.atom)), h.src);
  fs.writeFileSync(path.join(d, path.basename(p.test)), fs.readFileSync(p.test, 'utf8'));
  const copied = new Set([path.join(d, path.basename(p.atom)), path.join(d, path.basename(p.test))]);
  const copyDeps = (srcFile, dstFile, depth = 0) => {
    if (depth > 6) return;
    for (const im of fs.readFileSync(srcFile, 'utf8').matchAll(/import\s+'([^':]+\.dart)'/g)) {
      const src = path.resolve(path.dirname(srcFile), im[1]), dst = path.resolve(path.dirname(dstFile), im[1]);
      if (copied.has(dst) || !fs.existsSync(src)) continue;
      copied.add(dst); fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); copyDeps(src, dst, depth + 1);
    }
  };
  copyDeps(p.test, path.join(d, path.basename(p.test))); copyDeps(p.atom, path.join(d, path.basename(p.atom)));
  const r = spawnSync(DART, ['run', '--enable-asserts', path.basename(p.test)], { cwd: d, encoding: 'utf8', timeout: 20000, killSignal: 'SIGKILL', env: { PATH: process.env.PATH || '', HOME: process.env.HOME || '' } });
  const rel = path.relative(R.ROOT, p.test);
  if (r.status === 0) vacuous.push(`${rel} (${h.n} פונקציות הוחללו)`);
  else if (r.status === null) broken.push(rel + ' (timeout)');
  else if (/\.dart:\d+:\d+: Error:/.test(r.stderr || '')) compileFail.push(rel);   // R3-5.5: החלול לא קומפל ⇒ לא הוכחה
  else real++;
}
const unparsedN = unparsedFiles.length + compileFail.length;
// חוב-קיים (R3 שדה): בדיקות-חלולות ידועות = רשימה רק-יורדת בבייסליין; דגימה יומית מאדימה רק על חלולה **חדשה** (לא ב-baseline) — כמו כל שער-ראצ׳ט
const vacNames = vacuous.map((v) => v.replace(/ \(.*$/, ''));
if (argv.includes('--write')) { fs.writeFileSync(BL, JSON.stringify({ unparsed: unparsedN, vacuous: vacNames, pairs: total, untested }, null, 1) + '\n'); console.log(`✍️ mutation-dart baseline ⇒ unparsed ${unparsedN} · חלולות-ידועות ${vacNames.length} · זוגות ${total} · בלי-בדיקה ${untested}`); process.exit(0); }
const baseV = new Set(fs.existsSync(BL) ? (JSON.parse(fs.readFileSync(BL, 'utf8')).vacuous || []) : []);
const freshVac = vacuous.filter((v) => !baseV.has(v.replace(/ \(.*$/, '')));
const scope = opt('--files') ? 'files' : argv.includes('--all') ? 'מלא' : `דגימה ${pairs.length}/${total}`;
if (freshVac.length) { console.log(`🔴 mutation-dart: ${freshVac.length} בדיקות ירוקות-על-חלול **חדשות** (${scope}; חוב-ידוע ${baseV.size} רק-יורד):`); freshVac.forEach((v) => console.log('   ✗ ' + v)); process.exit(1); }
if (argv.includes('--all')) {
  if (!fs.existsSync(BL)) { console.log('🔴 mutation-dart: אין mutation-dart-baseline.json — --write (fail-closed)'); process.exit(1); }
  const base = JSON.parse(fs.readFileSync(BL, 'utf8'));
  if (unparsedN > (base.unparsed ?? 0)) { console.log(`🔴 mutation-dart: unparsed עלה ${base.unparsed} → ${unparsedN} (חוב רק-יורד): ${[...unparsedFiles, ...compileFail].slice(0, 5).join(' · ')}`); process.exit(1); }
}
console.log(`✓ מוטציה-Dart: ${real}/${pairs.length} מאדימות-על-חלול (${scope}) · חלולות-ידועות בדגימה ${vacuous.length}/${baseV.size} · unparsed ${unparsedFiles.length} · לא-קומפל ${compileFail.length} · timeout ${broken.length} · זוגות ${total} · בלי-בדיקה ${untested} (מוצהר)`);
