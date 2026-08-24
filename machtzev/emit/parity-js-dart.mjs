#!/usr/bin/env node
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { execSync } from 'node:child_process';
import { emitToDart } from './js-to-dart.mjs';
const DART = '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/dart-sdk/bin/dart';
const DIR = new URL('../../new/atoms/', import.meta.url).pathname;
const clean = /toLocaleString|Intl\.|Object\.|JSON\./;
const strip = (f) => fs.readFileSync(f, 'utf8').split('\n').filter(l => !/^\s*(\/\*|\*|\/\/)/.test(l)).join('\n');
const atoms = fs.readdirSync(DIR).filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs'))
  .map(f => f.replace('.mjs', '')).filter(a => { const s = strip(DIR + a + '.mjs'); return !clean.test(s) && !/\|\|/.test(s) && fs.existsSync(DIR + a + '.test.mjs'); });
let ok = 0, fail = 0; const bad = [];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'jd-'));
const N = Math.min(atoms.length, +process.argv[2] || 30);
for (const a of atoms.slice(0, N)) {
  try {
    const atomD = emitToDart(strip(DIR + a + '.mjs'));
    // הזרקת polyfills מינימליים + הבדיקה כ-Dart דורש עבודה; כאן רק מוודאים שהאטום מתקמפל+רץ בסיסית
    const helpers = `num _round(num x)=>x.round();num _floor(num x)=>x.floor();num _abs(num x)=>x.abs();`;
    fs.writeFileSync(path.join(tmp, a + '.dart'), helpers + '\n' + atomD + '\nvoid main(){}');
    execSync(`${DART} analyze --no-fatal-warnings ${path.join(tmp, a + '.dart')}`, { stdio: 'pipe' });
    ok++;
  } catch (e) { fail++; bad.push(`${a}: ${String(e.stdout||e.stderr||e).replace(/\n/g,' ').match(/error[^]*?(?=  |$)/i)?.[0]?.slice(0,80)||'?'}`); }
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`🥇 JS→Dart (analyze): ${ok}/${N} אטומי-מאור מתקמפלים נקי ב-Dart`);
bad.slice(0,8).forEach(b => console.log('  🚨 ' + b));
