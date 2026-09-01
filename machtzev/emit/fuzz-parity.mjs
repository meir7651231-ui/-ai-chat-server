#!/usr/bin/env node
/** 🎯 פאזר-דיפרנציאלי JS↔Dart — מריץ את שני האטומים על קורפוס-קצה עשיר ומשווה כל
 *  פלט. ה-JS = אורקל. אי-התאמה = באג (בדיוק מה שתפס את age-of/gematria). מכני, לא-סוכן. */
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
const DART = process.env.DART || '/home/user/flutter/bin/dart';
const A = new URL('../../new/atoms/', import.meta.url).pathname;
const D = new URL('../../new/dart-maor/', import.meta.url).pathname;

// קורפוסי-קצה
const NUMS = [0, 1, -1, 2, -2, 5, 10, 99, 100, 101, 999, 1000, 1001, 1100, 2000, 12, 13, 31, 32,
  0.5, -0.5, 1.5, 99.99, 100.5, 1e6, -1e6, 0.8, 1.6, 0.7, 1.7, 786, 5786, NaN, Infinity, -Infinity];
const STRS = ['', ' ', '  ', 'a', 'ab', '₪', '12', '007', '+972', '0501234567', '972501234567',
  '\t', '\n', ' x ', 'שלום', 'a@b.c', 'A@B.CO', '=SUM(1)', 'עם,פסיק', 'עם"גרש', '2000-13-01',
  '2000-00-10', '20000824', '2024-10-02', 'שבור', 'x'.repeat(50), '-5', '3.14'];

async function fuzz(atom, kind) {
  const mod = await import(pathToFileURL(A + atom + '.mjs').href);
  const fn = mod[Object.keys(mod).find(k => typeof mod[k] === 'function')];
  if (!fn) return { skip: 'אין-פונקציה' };
  const corpus = kind === 'num' ? NUMS : STRS;
  const rows = [];
  for (const inp of corpus) {
    let out; try { out = fn(inp); } catch { out = '__THROW__'; }
    rows.push({ inp, out });
  }
  // בנה בדיקת-Dart: לכל שורה, אטום-Dart(inp) חייב == out
  const dartAtom = fs.readFileSync(D + atom + '.dart', 'utf8');
  const codeLines = dartAtom.split('\n').filter(l => !/^\s*\/\//.test(l) && !/^\s*import /.test(l)).join('\n');
  const fname = (codeLines.match(/(?:dynamic|String|int|double|num|bool|List|Map|Object\??)\s+(\w+)\s*(?:<[^>]*>)?\s*\(/) || [])[1];
  const lit = (v) => v === null ? 'null' : typeof v === 'string' ? `'${v.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\t/g,'\\t')}'`
    : Number.isNaN(v) ? 'double.nan' : v === Infinity ? 'double.infinity' : v === -Infinity ? 'double.negativeInfinity' : String(v);
  const checks = rows.map((r, i) => {
    const exp = r.out === '__THROW__' ? null : r.out;
    return `  { dynamic got; try { got = ${fname}(${lit(r.inp)}); } catch(e){ got='__THROW__'; }
    final want = ${r.out === '__THROW__' ? "'__THROW__'" : lit(exp)};
    if (got?.toString() != want?.toString()) { print('MISMATCH[${i}] in=${lit(r.inp).replace(/'/g,'')} got=\$got want=\$want'); bad++; } }`;
  }).join('\n');
  const helpers = fs.readFileSync(new URL('./parity-ast.mjs', import.meta.url).pathname, 'utf8').match(/const H = `([^]*?)`;/)[1];
  const imps = [...new Set((dartAtom.match(/^\s*import [^\n]+/gm) || []).map(x => x.trim()))];
  const hasMath = imps.some(i => /dart:math/.test(i));
  const src = imps.join('\n') + '\n' + helpers.replace(/\\n/g, '\n').replace(hasMath ? /import 'dart:math';\n?/ : /$^/, '')+ codeLines +`\nvoid main(){ int bad=0;\n${checks}\n if(bad>0){ throw 'FUZZ FAIL: \$bad'; } print('fuzz ok ${rows.length}'); }`;
  const tmp = path.join(os.tmpdir(), atom + '_fuzz.dart');
  fs.writeFileSync(tmp, src);
  try { execSync(`${DART} run ${tmp}`, { stdio: 'pipe' }); return { ok: rows.length }; }
  catch (e) { return { fail: String(e.stdout || e.stderr).split('\n').filter(l => /MISMATCH|FAIL/.test(l)).slice(0, 3) }; }
}

const jobs = JSON.parse(process.argv[2]); // [[atom, 'num'|'str'], ...]
for (const [atom, kind] of jobs) {
  try { const r = await fuzz(atom, kind);
    console.log(r.ok ? `✅ ${atom}: ${r.ok} קלטי-קצה — Dart≡JS` : r.skip ? `⋯ ${atom}: ${r.skip}` : `🚨 ${atom}: אי-התאמה!\n   ${r.fail.join('\n   ')}`);
  } catch (e) { console.log(`⋯ ${atom}: ${String(e.message).slice(0,60)}`); }
}
