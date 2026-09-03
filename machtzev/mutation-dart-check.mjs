#!/usr/bin/env node
/** מחצב · mutation-dart-check — שער `mutation-dart` (PROTOCOL v4 §7.2 · שלב 8 · L11 בדוק-את-הבדיקה ל-Dart).
 *  לכל זוג `<x>.dart` + `<x>_test.dart` (new/dart · new/dart-maor · new/dart-data*): מחליל type-preserving את גוף
 *  הפונקציות-העליונות (int⇒0 · double⇒0.0 · String⇒'' · bool⇒false · List⇒[] · Map⇒{} · Set⇒{} · T?⇒null · void⇒{}),
 *  מריץ את הבדיקה על העותק-החלול (sandbox: dir זמני, timeout 20s) — ירוקה-על-חלול ⇒ 🔴 בדיקה חלולה.
 *  לא-ניתן-להחליל (אין חתימה מפורסרת) ⇒ נספר "unparsed" (מוצהר, לא ירוק). אין Dart ⇒ exit 2 tool=dart (L34).
 *  דגימה דטרמיניסטית: --sample N (ברירת-מחדל 12, seed = יום) · --all (CI) · --files a,b. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { resolveDart } from './dart-bin.mjs';
import * as R from './root.mjs';
const DART = resolveDart();
if (!DART) { console.log('🟡 mutation-dart: אין בינארי-Dart — tool=dart'); process.exit(2); }
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const DIRS = ['dart', 'dart-maor', 'dart-data', 'dart-data-bs', 'dart-data-maor'].map((d) => path.join(R.NEW, d)).filter((d) => fs.existsSync(d));
let pairs = [];
for (const d of DIRS) for (const f of fs.readdirSync(d)) if (f.endsWith('_test.dart')) { const atom = path.join(d, f.replace(/_test\.dart$/, '.dart')); if (fs.existsSync(atom)) pairs.push({ atom, test: path.join(d, f) }); }
pairs.sort((a, b) => a.atom.localeCompare(b.atom));
const total = pairs.length;
if (opt('--files')) { const want = new Set(opt('--files').split(',').map((s) => path.resolve(s))); pairs = pairs.filter((p) => want.has(p.atom) || want.has(p.test)); }
else if (!argv.includes('--all')) {
  const n = Number(opt('--sample') || 12);
  let seed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, '')) % 2147483647;
  const rnd = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
  pairs = [...pairs].sort(() => rnd() - 0.5).slice(0, n).sort((a, b) => a.atom.localeCompare(b.atom));
}
const DEF = { int: '0', double: '0.0', num: '0', String: "''", bool: 'false', void: '{}' };
const hollowBody = (ret) => {
  const t = ret.trim();
  if (t.endsWith('?')) return 'null';
  if (DEF[t] !== undefined) return DEF[t];
  if (/^(List|Iterable)\b/.test(t)) return 'const []';
  if (/^Map\b/.test(t)) return 'const {}';
  if (/^Set\b/.test(t)) return 'const {}';
  return null;
};
// חתימת פונקציה עליונה: <ret> <name>(<args>) {  — גוף בסוגריים מאוזנים
const SIG = /^([A-Za-z_][\w<>,?\s]*?)\s+([a-z_][\w]*)\s*\(([^)]*)\)\s*\{/gm;
const hollow = (src) => {
  let out = '', last = 0, n = 0, unparsed = 0;
  for (const m of src.matchAll(SIG)) {
    const ret = m[1].trim(); if (ret === 'return' || ret === 'else' || /^(if|for|while|switch|class|enum)$/.test(ret)) continue;
    if (m.index < last) continue;
    const bodyStart = m.index + m[0].length; let depth = 1, i = bodyStart;
    while (i < src.length && depth) { if (src[i] === '{') depth++; else if (src[i] === '}') depth--; i++; }
    const val = hollowBody(ret);
    if (val === null) { unparsed++; continue; }
    out += src.slice(last, bodyStart) + (ret === 'void' ? ' return; }' : ` return ${val}; }`);
    last = i; n++;
  }
  return { src: out + src.slice(last), n, unparsed };
};
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mut-dart-'));
process.on('exit', () => fs.rmSync(tmp, { recursive: true, force: true }));
let vacuous = [], real = 0, unparsed = [], broken = [];
for (const p of pairs) {
  const h = hollow(fs.readFileSync(p.atom, 'utf8'));
  if (!h.n) { unparsed.push(path.relative(R.ROOT, p.atom)); continue; }
  const d = fs.mkdtempSync(path.join(tmp, 'p-'));
  fs.writeFileSync(path.join(d, path.basename(p.atom)), h.src);
  fs.writeFileSync(path.join(d, path.basename(p.test)), fs.readFileSync(p.test, 'utf8'));
  // תלויות יחסיות (import '../x/y.dart') — מועתקות טרנזיטיבית לאותו מבנה-יחסי בתוך ה-sandbox (mkdir -p; לעולם לא מחוץ ל-tmp)
  const copied = new Set([path.join(d, path.basename(p.atom)), path.join(d, path.basename(p.test))]);   // נתיבים מוחלטים — האטום-החלול לעולם לא נדרס ע"י העותק-המקורי
  const copyDeps = (srcFile, dstFile, depth = 0) => {
    if (depth > 6) return;
    for (const im of fs.readFileSync(srcFile, 'utf8').matchAll(/import\s+'([^':]+\.dart)'/g)) {
      const src = path.resolve(path.dirname(srcFile), im[1]), dst = path.resolve(path.dirname(dstFile), im[1]);
      if (!fs.existsSync(src) || copied.has(dst) || !dst.startsWith(d)) { if (!dst.startsWith(d) && !copied.has(dst)) { copied.add(dst); fs.mkdirSync(path.dirname(dst), { recursive: true }); if (fs.existsSync(src)) { fs.copyFileSync(src, dst); copyDeps(src, dst, depth + 1); } } continue; }
      copied.add(dst); fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); copyDeps(src, dst, depth + 1);
    }
  };
  copyDeps(p.test, path.join(d, path.basename(p.test))); copyDeps(p.atom, path.join(d, path.basename(p.atom)));
  const r = spawnSync(DART, ['run', '--enable-asserts', path.basename(p.test)], { cwd: d, encoding: 'utf8', timeout: 20000, killSignal: 'SIGKILL', env: { PATH: process.env.PATH || '', HOME: process.env.HOME || '' } });
  if (r.status === 0) vacuous.push(path.relative(R.ROOT, p.test) + ` (${h.n} פונקציות הוחללו)`);
  else if (r.status === null) broken.push(path.relative(R.ROOT, p.test) + ' (timeout)');
  else real++;
}
const scope = opt('--files') ? 'files' : argv.includes('--all') ? 'מלא' : `דגימה ${pairs.length}/${total}`;
if (vacuous.length) { console.log(`🔴 mutation-dart: ${vacuous.length} בדיקות ירוקות-על-חלול (${scope}):`); vacuous.forEach((v) => console.log('   ✗ ' + v)); process.exit(1); }
console.log(`✓ מוטציה-Dart: ${real}/${pairs.length - unparsed.length} מאדימות-על-חלול (${scope}) · unparsed ${unparsed.length} · timeout ${broken.length} · זוגות ${total}`);
