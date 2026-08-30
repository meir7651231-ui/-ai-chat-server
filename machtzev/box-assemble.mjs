#!/usr/bin/env node
/** 📦 מחצב · מנוע-הרכבת-קופסאות (הכרעה 19 — מנוע, לא נחיל).
 *  קובץ-מקור עם ≥1 יצוא ⇒ קופסה: TS→JS (מסיר טיפוסים+import-type), החוטים-הפנימיים
 *  מחווטים כמו-שהם, יבוא-ערך-חיצוני נפתר לאטום-מדף (שקע). ה**קופסה מריצה** ⇒ golden
 *  אוטומטי לכל יצוא (מה ש-promote-auto לא יכול לבד). חוזה+בדיקת-קצה+טוהר — רק ירוק ננחת.
 *  שימוש: node box-assemble.mjs <src-rel> [boxName] [--write] */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const ts = createRequire('/home/user/maor-system/')('typescript');
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
const js = ts.transpileModule(raw, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, isolatedModules: false } }).outputText;
const valueImports = [...js.matchAll(/^import\s+.*?from\s+['"]([^'"]+)['"]/gm)].map(m => m[1]);
if (valueImports.length) {
  console.error(`⚠ ${boxName}: ${valueImports.length} יבוא-ערך חיצוני (שקעים לא-פתורים): ${valueImports.join(', ')}`);
  console.error('   v1 מטפל בקבצים עצמאיים (type-imports בלבד). נדרש פתרון-שקע-למדף — שלב-ב׳.');
  process.exit(1);
}
const exports = [...js.matchAll(/export\s+(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)/g)].map(m => m[1])
  .concat([...js.matchAll(/export\s+const\s+([a-zA-Z_$][\w$]*)/g)].map(m => m[1]));
if (!exports.length) { console.error(`✗ ${boxName}: אין יצואים`); process.exit(1); }

// כתיבת-הקופסה זמנית לצורך הרצה+golden
const tmp = path.join(BOXES, boxName + '.mjs');
const header = `/** קופסת-חיבורים · ${boxName} — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).\n *  מוצא: ${SRCREL} · קובץ-עצמאי (type-imports בלבד) ⇒ TS→JS ביט-התנהגותי. */\n`;
fs.writeFileSync(tmp, header + js.replace(/^\/\*[\s\S]*?\*\/\n/, ''));

const POOL = ['123456782', {amount: 100}, {payments: [{amount: 100}]}, {name: 'כהן', phone: '0501234567'}, ['2026-08-24'], 3.14, 1000, 2026, '', 'אבג', 'כהן לוי', 'abc', 'a@b.com', '2026-08-24', '0501234567', 'https://x.co', '12', 0, 1, 2, 5, 15, 100, -3, null, undefined, true, false, [], {}];
const ser = (v) => { try { const s = JSON.stringify(v); return (s && s.length <= 400) ? s : null; } catch { return null; } };
let mod;
try { mod = await import(pathToFileURL(tmp).href + '?t=' + Date.now()); }
catch (e) { fs.unlinkSync(tmp); console.error(`✗ ${boxName}: יבוא-נכשל — ${String(e.message).slice(0, 80)}`); process.exit(1); }

const fnCases = {};
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
const golden = Object.keys(fnCases);
if (!golden.length) { fs.unlinkSync(tmp); console.error(`✗ ${boxName}: אף יצוא לא בר-golden (קלט-מורכב/לא-דטרמיניסטי)`); process.exit(1); }

if (!WRITE) { fs.unlinkSync(tmp); console.log(`~ ${boxName}: יבש — ${golden.length}/${exports.length} יצואים ברי-golden: ${golden.join(', ')}`); process.exit(0); }
// חוזה + בדיקת-קצה
fs.writeFileSync(path.join(BOXES, boxName + '.contract.md'),
  `# חוזה-אפיון · קופסה ${boxName}\n**שיטה:** הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19) מ-${SRCREL}. golden מהרצת הקופסה עצמה.\n**יצואים ברי-golden:** ${golden.join(', ')} (${golden.length}/${exports.length}).\n`);
fs.writeFileSync(path.join(BOXES, boxName + '.test.mjs'),
  `import * as m from './${boxName}.mjs';\nconst de = (s) => s === '"__undef__"' ? undefined : JSON.parse(s);\nconst FN = ${JSON.stringify(fnCases)};\nlet f = 0;\nfor (const [n, cs] of Object.entries(FN)) for (const [args, want] of cs) { const got = JSON.stringify(m[n](...args.map(de))); if (got !== want) { console.error('✗ ' + n + '(' + args + ') ⇒ ' + got + ' ≠ ' + want); f = 1; } }\nif (f) process.exit(1); console.log('✓ ${boxName}: ' + Object.values(FN).flat().length + ' golden — ירוק');\n`);
console.log(`✅ ${boxName}: קופסה הורכבה · ${golden.length}/${exports.length} יצואים · golden נכתב`);
