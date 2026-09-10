#!/usr/bin/env node
// 🧮 formula-fns — שער (L105): פונקציות-נוסחה מהדאטה בלבד · dart:math עליונה, אפס מתודה-שלא-קיימת על num · עוזר-מתודה מוזרק כשבשימוש.
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import * as R from '../root.mjs';
const G = JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8')); const FNS = G.formulaFns || {};
export function checkFormulaFns(genDir = path.join(R.ROOT, 'new/dart-gen-bs')) {
  const bad = [];
  for (const [fn, kind] of Object.entries(FNS)) { if (!/^[a-z]+$/.test(fn) || !['math', 'method'].includes(kind)) bad.push(`spec-lang.data.json: formulaFns.${fn} = ${kind}`); }
  const mathFns = Object.keys(FNS).filter((f) => FNS[f] === 'math'), methodFns = Object.keys(FNS).filter((f) => FNS[f] === 'method');
  for (const f of fs.readdirSync(genDir).filter((f) => f.startsWith('gen_app_') && f.endsWith('.dart'))) {
    const t = fs.readFileSync(path.join(genDir, f), 'utf8'); const lines = t.split('\n');
    lines.forEach((l, i) => {
      if (/^\s*\/\//.test(l)) return;
      if (mathFns.length && new RegExp('(?<!math)\\.(' + mathFns.join('|') + ')\\(').test(l)) bad.push(`${f}:${i + 1} method-call on num (does not exist in Dart)`);
      if (mathFns.length && new RegExp('(^|[^.\\w])(' + mathFns.join('|') + ')\\(').test(l) && !/import 'dart:math'/.test(t)) bad.push(`${f}:${i + 1} uses dart:math function without import`);
      for (const m of methodFns) if (new RegExp('\\b_m_' + m + '\\(').test(l) && !t.includes(`num _m_${m}(num x)`)) bad.push(`${f}:${i + 1} _m_${m}( without helper`);
    });
  }
  return bad;
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) { const bad = checkFormulaFns(); if (bad.length) { console.log('🔴 formula-fns: ' + bad.slice(0, 8).join(' · ')); process.exit(1); } console.log(`✓ formula-fns: ${Object.keys(FNS).length} פונקציות-מהדאטה · פלט נקי (L105)`); }
