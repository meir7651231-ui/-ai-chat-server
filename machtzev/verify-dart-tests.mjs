#!/usr/bin/env node
/** ✅ מחצב · אימות-חוזה-חי של מנועי-Dart (מבצע-המאה) — מריץ כל בדיקת-חוזה golden
 *  (`new/dart{,-maor}/<base>_test.dart`) עם `dart run --enable-asserts`. בדיקה שעוברת
 *  (exit 0) = **הוכחה חזקה** שכל פונקציות-האטום שלה רהיצות (הן רצו + עברו assert).
 *  כותב את שמות-הפונקציות-המוכחות ⇒ knowledge/dart-tests-passing.json (proof-record).
 *  שער-הכיסוי מאחד את הקבוצה הזו ל"מנועים ברי-הרצה". מקבילי. L27 — הרצה-אמיתית, לא-סטטי.
 *  שימוש: DART_BIN=/path/to/dart node machtzev/verify-dart-tests.mjs [-jN] */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildAtlas } from './generator/atlas.mjs';
const ROOT = new URL('../', import.meta.url).pathname;
const OUT = path.join(ROOT, 'machtzev/generator/knowledge/dart-tests-passing.json');
const DART = (() => {
  for (const c of [process.env.DART_BIN, process.env.HOME && path.join(process.env.HOME, 'dart-sdk/bin/dart'), '/root/dart-sdk/bin/dart', '/home/user/flutter/bin/dart'].filter(Boolean))
    { try { if (fs.existsSync(c)) return c; } catch { } }
  return 'dart';
})();
const JOBS = (() => { const i = process.argv.findIndex(a => /^-j/.test(a)); return i >= 0 ? +(process.argv[i].slice(2) || process.argv[i + 1]) : 8; })();

// מיפוי base ⇒ שמות-פונקציות (מהאטלס)
const atlas = buildAtlas();
const byBase = new Map();
for (const f of atlas.functions) {
  if (!/^new\/dart(-maor)?$/.test(f.shelf)) continue;
  const base = path.basename(f.file).replace(/\.dart$/, '');
  (byBase.get(base) || byBase.set(base, { shelf: f.shelf, names: new Set() }).get(base)).names.add(f.name);
}
const bases = [...byBase.keys()].filter(b => fs.existsSync(path.join(ROOT, byBase.get(b).shelf, b + '_test.dart')));
console.log(`בדיקות-חוזה Dart: ${bases.length} · ריצה מקבילית -j${JOBS} · dart=${DART}`);

const runOne = (base) => new Promise((res) => {
  const tp = path.join(ROOT, byBase.get(base).shelf, base + '_test.dart');
  try { execFileSync(DART, ['run', '--enable-asserts', tp], { stdio: 'ignore', timeout: 90000 }); res({ base, ok: true }); }
  catch { res({ base, ok: false }); }
});

const proven = new Set(); let done = 0, passed = 0;
const queue = [...bases];
async function worker() { while (queue.length) { const b = queue.shift(); const r = await runOne(b); done++; if (r.ok) { passed++; for (const n of byBase.get(b).names) proven.add(n); } if (done % 40 === 0) console.log(`  … ${done}/${bases.length} (${passed} עברו)`); } }
await Promise.all(Array.from({ length: JOBS }, worker));

const list = [...proven].sort();
fs.writeFileSync(OUT, JSON.stringify(list, null, 0) + '\n');
console.log(`✅ בדיקות-עברו: ${passed}/${bases.length} · פונקציות-מוכחות: ${list.length} ⇒ ${path.relative(ROOT, OUT)}`);
