#!/usr/bin/env node
/** 📦 מחצב · מנוע-הרכבת-קופסאות (הכרעה 19 — מנוע, לא נחיל).
 *  קובץ-מקור עם ≥1 יצוא ⇒ קופסה: TS→JS (מסיר טיפוסים+import-type), החוטים-הפנימיים
 *  מחווטים כמו-שהם, יבוא-ערך-חיצוני נפתר לאטום-מדף (שקע). ה**קופסה מריצה** ⇒ golden
 *  אוטומטי לכל יצוא (מה ש-promote-auto לא יכול לבד). חוזה+בדיקת-קצה+טוהר — רק ירוק ננחת.
 *  שימוש: node box-assemble.mjs <src-rel> [boxName] [--write] */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { requireTs } from './lib-ts.mjs';
import { pathToFileURL } from 'node:url';
const ts = requireTs();
const ROOT = new URL('../', import.meta.url).pathname;
const BOXES = path.join(ROOT, 'new/boxes');
const SRCREL = process.argv[2];
const WRITE = process.argv.includes('--write');
if (!SRCREL) { console.error('usage: box-assemble.mjs <src-rel> [boxName] [--write]'); process.exit(2); }
const SRC = path.join('/home/user/maor-system', SRCREL);
const boxName = (process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3]
  : path.basename(SRCREL).replace(/\.(ts|tsx)$/, '')).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const raw = fs.readFileSync(SRC, 'utf8');
// TS→JS: מסיר import-type ואנוטציות; משאיר import-ערך (שקעים-חיצוניים)
let js = ts.transpileModule(raw, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, isolatedModules: false } }).outputText;

// ── שלב-ב׳: פתרון-שקע-למדף — כל יבוא-ערך חיצוני נפתר לאטום-מדף (קופסה→אטום=חוקי;
//    קופסה→קופסה=אסור ⇒ אטומים בלבד). סמל שאינו-על-מדף-האטומים ⇒ אי-אפשר ⇒ נדחית. ──
const walkFs = (d, o = []) => { if (!fs.existsSync(d)) return o; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walkFs(p, o) : o.push(p); } return o; };
const atomOf = new Map();  // שם-יצוא → basename-של-אטום (מדף-האטומים בלבד)
for (const f of walkFs(path.join(ROOT, 'new/atoms'))) {
  if (!/\.mjs$/.test(f) || /\.test\./.test(f)) continue; const t = fs.readFileSync(f, 'utf8'); let m; const b = path.basename(f, '.mjs');
  for (const re of [/export\s+(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)/g, /export\s+const\s+([a-zA-Z_$][\w$]*)/g]) while ((m = re.exec(t))) if (!atomOf.has(m[1])) atomOf.set(m[1], b);
}
const impLines = [...js.matchAll(/^import\s+(?!type\b)(.+?)\s+from\s+['"]([^'"]+)['"];?\s*$/gm)];
const unresolved = [];
for (const [full, clause, spec] of impLines) {
  const named = clause.match(/^\{([^}]*)\}$/);
  if (!named) { unresolved.push(spec + ' (יבוא-לא-מפורש: default/namespace)'); continue; }
  const syms = named[1].split(',').map(x => x.trim()).filter(Boolean).map(x => { const [orig, alias] = x.split(/\s+as\s+/).map(s => s.trim()); return { orig, alias: alias || orig }; });
  const miss = syms.filter(s => !atomOf.has(s.orig));
  if (miss.length) { unresolved.push(spec + ' → ' + miss.map(s => s.orig).join(',')); continue; }
  // חיווט-מחדש: כל סמל ← אטום-המדף שלו (יבוא נפרד פר-אטום, נתיב יחסי מ-new/boxes)
  const rewired = syms.map(s => `import { ${s.orig}${s.alias !== s.orig ? ' as ' + s.alias : ''} } from '../atoms/${atomOf.get(s.orig)}.mjs';`).join('\n');
  js = js.replace(full, rewired);
}
if (unresolved.length) {
  console.error(`⚠ ${boxName}: ${unresolved.length} שקע לא-פתיר (סמל חסר-במדף-האטומים): ${unresolved.join(' · ')}`);
  process.exit(1);
}
const exports = [...js.matchAll(/export\s+(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)/g)].map(m => m[1])
  .concat([...js.matchAll(/export\s+const\s+([a-zA-Z_$][\w$]*)/g)].map(m => m[1]));
if (!exports.length) { console.error(`✗ ${boxName}: אין יצואים`); process.exit(1); }

// כתיבת-הקופסה זמנית לצורך הרצה+golden
const tmp = path.join(BOXES, boxName + '.mjs');
const header = `/** קופסת-חיבורים · ${boxName} — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).\n *  מוצא: ${SRCREL} · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */\n`;
fs.writeFileSync(tmp, header + js.replace(/^\/\*[\s\S]*?\*\/\n/, ''));

const POOL = ['123456782', {amount: 100}, {payments: [{amount: 100}]}, {name: 'כהן', phone: '0501234567'}, ['2026-08-24'], 3.14, 1000, 2026, '', 'אבג', 'כהן לוי', 'abc', 'a@b.com', '2026-08-24', '0501234567', 'https://x.co', '12', 0, 1, 2, 5, 15, 100, -3, null, undefined, true, false, [], {}];
const ser = (v) => { try { const s = JSON.stringify(v); return (s && s.length <= 400) ? s : null; } catch { return null; } };
let mod;
try { mod = await import(pathToFileURL(tmp).href + '?t=' + Date.now()); }
catch (e) { fs.unlinkSync(tmp); console.error(`✗ ${boxName}: יבוא-נכשל — ${String(e.message).slice(0, 80)}`); process.exit(1); }

const fnCases = {};
// ── שלב-א׳: golden מ-POOL (קלט פשוט) ──
for (const n of exports) {
  const fn = mod[n];
  if (typeof fn !== 'function' || fn.constructor.name === 'AsyncFunction' || fn.length > 3) continue;
  const P = POOL.slice(0, 10);
  const sets = fn.length === 0 ? [[]] : fn.length === 1 ? POOL.map(a => [a])
    : fn.length === 2 ? P.flatMap(a => P.map(b => [a, b])) : P.flatMap(a => P.flatMap(b => P.map(c => [a, b, c])));
  const cs = [];
  for (const args of sets) {
    let r1, r2; try { r1 = fn(...args); r2 = fn(...args); } catch { continue; }
    if (r1 && typeof r1.then === 'function') { r1.catch(() => {}); cs.length = 0; break; }
    const s1 = ser(r1); if (s1 == null || s1 !== ser(r2)) continue;
    cs.push([args.map(a => a === undefined ? '"__undef__"' : ser(a) ?? '"__skip__"'), s1]);
    if (cs.length >= 10) break;
  }
  if (cs.length >= 3 && new Set(cs.map(c => c[1])).size >= 2) fnCases[n] = cs;
}

// ── שלב-ב׳: קציר-פיקסצ'רים — replay מכשור של קובץ-הבדיקה של maor (קלט-מורכב) ──
const testPath = path.join('/home/user/maor-system', path.dirname(SRCREL), '__tests__', path.basename(SRCREL).replace(/\.(ts|tsx)$/, '.test.$1'));
if (fs.existsSync(testPath)) {
  try {
    const tjs = ts.transpileModule(fs.readFileSync(testPath, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
    const otherVal = [...tjs.matchAll(/^import\s+.*?from\s+['"]([^'"]+)['"]/gm)].map(m => m[1]).filter(p => !/vitest|jest|\/plannedMatch|['"]\.\.?\//.test(p) === false && !new RegExp(path.basename(SRCREL, path.extname(SRCREL))).test(p) && !/vitest|jest/.test(p));
    // גוף-הבדיקה בלי שורות-import (טיפוסים נמחקו; vitest+הקופסה מוזרקים); דילוג אם יש יבוא-ערך-זר
    const body = tjs.replace(/^import\s+.*$/gm, '').trim();
    const stray = [...tjs.matchAll(/^import\s+(?!type)([^;]*?)from\s+['"]([^'"]+)['"]/gm)]
      .filter(m => !/vitest|jest/.test(m[2]) && !new RegExp(path.basename(SRCREL, path.extname(SRCREL)) + "['\"]?$").test(m[2]));
    if (!stray.length) {
      const runner = path.join(BOXES, '__replay_' + boxName + '.mjs');
      fs.writeFileSync(runner, `
import * as __box from './${boxName}.mjs';
const __REC = {};
const __w = {};
for (const k of Object.keys(__box)) __w[k] = typeof __box[k] === 'function'
  ? (...a) => { let r; try { r = __box[k](...a); } catch { return undefined; }
      try { const A = a.map(x => x === undefined ? '"__undef__"' : JSON.stringify(x)); const R = JSON.stringify(r);
        if (A.every(x => x != null) && R != null && R.length < 600) (__REC[k] = __REC[k] || []).push([A, R]); } catch {} return r; }
  : __box[k];
const { ${exports.join(', ')} } = __w;
const describe = (n, f) => { try { f(); } catch {} };
const it = (n, f) => { try { f(); } catch {} };
const test = it, beforeEach = () => {}, afterEach = () => {}, beforeAll = () => {}, afterAll = () => {};
const __c = new Proxy(function () { return __c; }, { get() { return function () { return __c; }; } });
const expect = () => __c;
${body}
export const CASES = __REC;
`);
      try {
        const rm = await import(pathToFileURL(runner).href + '?t=' + Date.now());
        for (const [n, cs] of Object.entries(rm.CASES || {})) {
          const uniq = [...new Map(cs.map(c => [c[0].join('|') + '=>' + c[1], c])).values()];
          if (uniq.length && (!fnCases[n] || fnCases[n].length < uniq.length)) fnCases[n] = uniq.slice(0, 12);
        }
      } catch (e) { console.error(`  ~ replay ${boxName}: ${String(e.message).slice(0, 60)}`); }
      fs.unlinkSync(runner);
    }
  } catch {}
}
const golden = Object.keys(fnCases);
if (!golden.length) { fs.unlinkSync(tmp); console.error(`✗ ${boxName}: אף יצוא לא בר-golden (קלט-מורכב/לא-דטרמיניסטי)`); process.exit(1); }

if (!WRITE) { fs.unlinkSync(tmp); console.log(`~ ${boxName}: יבש — ${golden.length}/${exports.length} יצואים ברי-golden: ${golden.join(', ')}`); process.exit(0); }
// חוזה + בדיקת-קצה
fs.writeFileSync(path.join(BOXES, boxName + '.contract.md'),
  `# חוזה-אפיון · קופסה ${boxName}\n**שיטה:** הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19) מ-${SRCREL}. golden מהרצת הקופסה עצמה.\n**יצואים ברי-golden:** ${golden.join(', ')} (${golden.length}/${exports.length}).\n`);
fs.writeFileSync(path.join(BOXES, boxName + '.test.mjs'),
  `import * as m from './${boxName}.mjs';\nconst de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);\nconst FN = ${JSON.stringify(fnCases)};\nlet f = 0;\nfor (const [n, cs] of Object.entries(FN)) for (const [args, want] of cs) { const got = JSON.stringify(m[n](...args.map(de))); if (got !== want) { console.error('✗ ' + n + '(' + args + ') ⇒ ' + got + ' ≠ ' + want); f = 1; } }\nif (f) process.exit(1); console.log('✓ ${boxName}: ' + Object.values(FN).flat().length + ' golden — ירוק');\n`);
console.log(`✅ ${boxName}: קופסה הורכבה · ${golden.length}/${exports.length} יצואים · golden נכתב`);
