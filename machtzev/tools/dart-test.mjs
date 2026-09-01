#!/usr/bin/env node
/** מריץ כל בדיקות-ה-Dart בדרגת-חוזה (new/dart/*_test.dart) דרך dart --enable-asserts. */
import fs from 'node:fs';
import { execSync } from 'node:child_process';
const DART = '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/dart-sdk/bin/dart';
const dir = new URL('../../new/dart/', import.meta.url).pathname;
const tests = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('_test.dart')) : [];
let ok = 0, fail = 0;
for (const t of tests) {
  try { execSync(`${DART} run --enable-asserts ${dir}${t}`, { stdio: 'pipe' }); ok++; }
  catch (e) { console.log('✗ ' + t + ' — ' + String(e.stderr || e).slice(0, 200)); fail++; }
}
console.log(`Dart: ${ok}/${tests.length} בדיקות-חוזה ירוקות` + (fail ? ` · ${fail} נכשלו` : ''));
process.exit(fail ? 1 : 0);
