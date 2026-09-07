#!/usr/bin/env node
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { execSync } from 'node:child_process';
import { emit, typesFromEvidence, emitVerified } from './ast-js-to-dart.mjs';
const MODE = process.argv.includes('--dynamic') ? 'dynamic' : process.argv.includes('--evidence') ? 'evidence' : process.argv.includes('--verified') ? 'verified' : 'static';
const DIAG = process.argv.includes('--diag'); let droppedN = 0;   // G20 · לפני/אחרי
const EV = new URL('../generator/type-evidence.json', import.meta.url).pathname;
let typedParams = 0, totalParams = 0, typedRet = 0;
const DART = process.env.DART || '/home/user/flutter/bin/dart';
const DIR = new URL('../../new/atoms/', import.meta.url).pathname;
const strip = (f) => fs.readFileSync(f, 'utf8').split('\n').filter(l => !/^\s*(\/\*|\*|\/\/)/.test(l)).join('\n');
// שקעי-שפה (helpers) — מוזרקים לניתוח; בקופסה יהיו מימוש-אמיתי
const H = `import 'dart:math';
num _round(num x)=>x.round(); num _floor(num x)=>x.floor(); num _ceil(num x)=>x.ceil();
num _abs(num x)=>x.abs(); num _trunc(num x)=>x.truncate(); bool _isFinite(x)=>x is num && x.isFinite;
String _toLocaleString(x,[l])=>x.toString(); String _padStart(String s,int n,[String c=' '])=>s.padLeft(n,c);
String _repeat(String s,int n)=>s*n; dynamic _concat(a,b)=>[...a,...b];
bool _falsy(x)=>x==null||x==false||x==0||x==""; bool _truthy(x)=>!_falsy(x); num _toNum(x)=>x is num?x:num.tryParse(x.toString())??0; String _typeof(x)=>x is String?"string":x is num?"number":x is bool?"boolean":x==null?"undefined":x is Function?"function":"object";`;
const atoms = fs.readdirSync(DIR).filter(f => f.endsWith('.mjs') && !f.endsWith('.test.mjs')).map(f => f.replace('.mjs','')).filter(a => !/async |await /.test(strip(DIR+a+'.mjs')));
let ok=0, fail=0; const bad=[]; const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'ast-'));
const N = +process.argv[2] || atoms.length;
for (const a of atoms.slice(0,N)) {
  try {
    const js = strip(DIR+a+'.mjs');
    let d;
    if (MODE === 'verified') { const an = (code) => { const f = path.join(tmp, a + '_v.dart'); fs.writeFileSync(f, code); try { execSync(`${DART} analyze --no-fatal-warnings ${f}`, { stdio: 'pipe' }); return null; } catch (e) { return String(e.stdout || e.stderr); } }; const r = emitVerified(js, { types: typesFromEvidence(EV, js), analyze: an, helpers: H }); d = r.code; if (r.dropped.length) droppedN++; }
    else d = emit(js, MODE === 'dynamic' ? { infer: false } : MODE === 'evidence' ? { types: typesFromEvidence(EV, js) } : {});
    if (DIAG) { const base = emit(js, { infer: false }); const f0 = path.join(tmp, a + '_d.dart'); fs.writeFileSync(f0, H + '\n' + base + '\nvoid main(){}'); let baseOk = true; try { execSync(`${DART} analyze --no-fatal-warnings ${f0}`, { stdio: 'pipe' }); } catch { baseOk = false; } if (baseOk) { const f1 = path.join(tmp, a + '_t.dart'); fs.writeFileSync(f1, H + '\n' + d + '\nvoid main(){}'); try { execSync(`${DART} analyze --no-fatal-warnings ${f1}`, { stdio: 'pipe' }); } catch (e) { console.log(`REG ${a}: ${(String(e.stdout || e.stderr).match(/error - ([^\n]*)/) || ['', '?'])[1].slice(0, 140)}`); } } }
    for (const m of d.matchAll(/^([\w<>?, ]+?)\s+[a-z]\w*\(([^)]*)\)\s*(?:\{|=>)/gm)) { if (m[1].trim() !== 'dynamic') typedRet++; for (const p of m[2].split(',').map((x) => x.trim()).filter(Boolean)) { totalParams++; if (!/^\[?dynamic\b/.test(p)) typedParams++; } }
    if (/\/\*\?/.test(d)) { fail++; bad.push(`${a}: node לא-מטופל ${d.match(/\/\*\?(\w+)/)?.[1]}`); continue; }
    fs.writeFileSync(path.join(tmp,a+'.dart'), H+'\n'+d+'\nvoid main(){}');
    execSync(`${DART} analyze --no-fatal-warnings ${path.join(tmp,a+'.dart')}`, {stdio:'pipe'});
    ok++;
  } catch(e){ fail++; bad.push(`${a}: ${(String(e.stdout||e.stderr).match(/error[^]*?(?= at |\n)/i)?.[0]||'?').slice(0,70)}`); }
}
fs.rmSync(tmp,{recursive:true,force:true});
console.log(`🌳 AST JS→Dart [${MODE}${MODE === 'verified' ? ' · הורדות ' + droppedN : ''}]: ${ok}/${N} אטומי-מאור מתקמפלים נקי (${(ok/N*100).toFixed(0)}%) · פרמטרים מוקלדים ${typedParams}/${totalParams} (${totalParams ? (typedParams/totalParams*100).toFixed(0) : 0}%) · החזרה מוקלדת ${typedRet}`);
const cats={}; bad.forEach(b=>{const k=(b.match(/node לא-מטופל \w+|error - [^:]+|Undefined|Expected|isn't defined/)||['אחר'])[0].slice(0,40); cats[k]=(cats[k]||0)+1;});
Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,8).forEach(([k,v])=>console.log(`  🚨 ${v}× ${k}`));
