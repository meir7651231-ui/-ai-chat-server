#!/usr/bin/env node
/** 🔁 מחצב · מנוע-ההמרה-מחדש — שלב-הדאטה (reconvert-data).
 *  כל אטום-דאטה JS (‏*-strings/*-data/*-terms שנולדו בטיהור, הכרעה 19) נפלט כתאום-Dart
 *  מוקלד ב-new/dart-data-maor — כך שהמדף, האטלס והמחולל מקבלים את הדאטה גם בצד-Dart.
 *  מכני ובטוח: ערכי-JSON בלבד ⇒ ליטרלי-Dart; שמות-הייצוא נשמרים. תאום קיים משוכתב.
 *  שימוש: node machtzev/reconvert-data.mjs [--dry] */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = new URL('../', import.meta.url).pathname;
const SRC = path.join(ROOT, 'new/atoms');
const OUT = path.join(ROOT, 'new/dart-data-maor');
const dry = process.argv.includes('--dry');

const dartLit = (v, ind = '') => {
  if (v === null) return 'null';
  if (typeof v === 'string') return "'" + v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/\n/g, '\\n') + "'";
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return '[\n' + v.map(x => ind + '  ' + dartLit(x, ind + '  ') + ',').join('\n') + '\n' + ind + ']';
  return '{\n' + Object.entries(v).map(([k, x]) => ind + '  ' + dartLit(k) + ': ' + dartLit(x, ind + '  ') + ',').join('\n') + '\n' + ind + '}';
};
const dartType = (v) => {
  if (typeof v === 'string') return 'String';
  if (typeof v === 'number') return Number.isInteger(v) ? 'int' : 'double';
  if (typeof v === 'boolean') return 'bool';
  if (Array.isArray(v)) { const ts = new Set(v.map(dartType)); return `List<${ts.size === 1 ? [...ts][0] : 'Object'}>`; }
  if (v && typeof v === 'object') { const ts = new Set(Object.values(v).map(dartType)); return `Map<String, ${ts.size === 1 ? [...ts][0] : 'Object'}>`; }
  return 'Object';
};

let made = 0;
for (const f of fs.readdirSync(SRC)) {
  if (!/-(strings|data|terms)\.mjs$/.test(f) || f.endsWith('.test.mjs')) continue;
  const mod = await import('file://' + path.join(SRC, f));
  const outName = f.replace(/\.mjs$/, '.dart');
  const lines = [
    `// אטום-דאטה · ${f.replace('.mjs', '')} — תאום-Dart שנפלט אוטומטית מהמקור-הקדוש (מנוע-ההמרה-מחדש · הכרעה 19).`,
    `// המקור: new/atoms/${f} — אל תערוך ידנית; שינוי = במקור + פליטה-מחדש.`,
  ];
  let ok = false;
  for (const [name, v] of Object.entries(mod)) {
    if (typeof v === 'function') continue;
    try { JSON.stringify(v); } catch { continue; }
    lines.push(`const ${dartType(v)} ${name} = ${dartLit(v)};`);
    ok = true;
  }
  if (!ok) continue;
  if (!dry) fs.writeFileSync(path.join(OUT, outName), lines.join('\n') + '\n');
  made++;
}
console.log(`🔁 המרת-דאטה: ${made} תאומי-Dart ${dry ? '(dry)' : 'נפלטו'} ⇒ new/dart-data-maor`);
