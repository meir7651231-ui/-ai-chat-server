#!/usr/bin/env node
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { execSync } from 'node:child_process';
import { emit } from './ast-js-to-dart.mjs';
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
    let d = emit(strip(DIR+a+'.mjs'));
    if (/\/\*\?/.test(d)) { fail++; bad.push(`${a}: node לא-מטופל ${d.match(/\/\*\?(\w+)/)?.[1]}`); continue; }
    fs.writeFileSync(path.join(tmp,a+'.dart'), H+'\n'+d+'\nvoid main(){}');
    execSync(`${DART} analyze --no-fatal-warnings ${path.join(tmp,a+'.dart')}`, {stdio:'pipe'});
    ok++;
  } catch(e){ fail++; bad.push(`${a}: ${(String(e.stdout||e.stderr).match(/error[^]*?(?= at |\n)/i)?.[0]||'?').slice(0,70)}`); }
}
fs.rmSync(tmp,{recursive:true,force:true});
console.log(`🌳 AST JS→Dart: ${ok}/${N} אטומי-מאור מתקמפלים נקי (${(ok/N*100).toFixed(0)}%)`);
const cats={}; bad.forEach(b=>{const k=(b.match(/node לא-מטופל \w+|error - [^:]+|Undefined|Expected|isn't defined/)||['אחר'])[0].slice(0,40); cats[k]=(cats[k]||0)+1;});
Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,8).forEach(([k,v])=>console.log(`  🚨 ${v}× ${k}`));
