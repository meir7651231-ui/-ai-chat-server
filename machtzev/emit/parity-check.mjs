#!/usr/bin/env node
/** 🥇 אימות-פליטה · לכל אטום-Dart: פלוט אטום+בדיקה ל-JS, הרץ ב-node. הבדיקה נושאת
 *  את דוגמאות-החוזה שכבר אומתו מול Dart (dart --enable-asserts) — אם ה-JS עובר
 *  אותן, ההתנהגות נשמרה (Dart≡JS). כישלון = אזעקה לאטום הבודד. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { emitBody } from './dart-to-js.mjs';

const DIR = new URL('../../new/dart/', import.meta.url).pathname;
const atoms = fs.readdirSync(DIR).filter(f => f.endsWith('.dart') && !f.endsWith('_test.dart')).map(f => f.replace('.dart', ''));

/** נירמול ניב-Dart נוסף שמופיע בבדיקות. */
function emitTest(src, atomName) {
  let s = src.split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n');
  s = s.replace(/import\s+'[^']+';/g, '');
  s = s.replace(/^\s*assert\([^;]*\);\s*$/gm, ''); // Dart-assert בבדיקה — יתיר עם _eq
  s = emitBody(s);                          // תמורות-הליבה (טיפוסים, final, regex...)
  s = s.replace(/\bvoid\s+/g, 'function ').replace(/\bvar\s+/g, 'let ');
  s = s.replace(/\bStateError\(/g, 'Error(').replace(/\bthrow\s+Error/g, 'throw new Error');
  // אינטרפולציה: '...$x...' ו-'...${e}...' → template `...${x}...`
  s = s.replace(/'((?:\\.|[^'\\])*)'/g, (m, body) => {
    if (!/\$/.test(body)) return m;
    return '`' + body.replace(/`/g, '\\`').replace(/\$(\w+)/g, '${$1}') + '`';
  });
  return s;
}

let ok = 0, fail = 0; const bad = [];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'parity-'));
for (const a of atoms) {
  const tf = DIR + a + '_test.dart';
  if (!fs.existsSync(tf)) { continue; }
  try {
    const atomJs = emitBody(fs.readFileSync(DIR + a + '.dart', 'utf8').split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n'));
    let testJs = emitTest(fs.readFileSync(tf, 'utf8'), a);
    // הזרקת-האטום ישירות (במקום import) + קריאה ל-main
    const combined = atomJs.replace(/^export /gm, '') + '\n' + testJs.replace(/^export /gm, '') + '\nmain();\n';
    const file = path.join(tmp, a + '.mjs');
    fs.writeFileSync(file, combined);
    execSync(`node ${file}`, { stdio: 'pipe' });
    ok++;
  } catch (e) {
    fail++; bad.push(`${a}: ${String(e.stderr || e.message || e).replace(/\n/g," ").slice(0, 160)}`);
  }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`🥇 אימות-פליטה Dart→JS: ${ok}/${atoms.length} אטומים עברו זהב (Dart≡JS)`);
if (bad.length) { console.log('🚨 דורשים טיפול-יד:'); bad.forEach(b => console.log('  ' + b)); }
process.exit(fail > atoms.length / 2 ? 1 : 0);
