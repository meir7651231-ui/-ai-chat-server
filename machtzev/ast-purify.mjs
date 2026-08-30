#!/usr/bin/env node
// 🎯 מנהל מכונת-ה-AST · דה-הרדקוד מדויק לכל צורות-הקוד.
// קורא ל-ast_dehardcode.dart (analyzer) → מקבל מקור-משוכתב + terms, כותב קובץ-שמות,
// מחווט בדיקה+צרכנים, מאמת (analyze+test+proofs), מחזיר-הכל-אם-נכשל.
// שימוש: node machtzev/ast-purify.mjs <file>   |   --all
import fs from 'node:fs';
import path from 'node:path';
import { execSync, execFileSync } from 'node:child_process';

const ROOT = new URL('../new/', import.meta.url).pathname;
const AST = '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/asttest';
const DART = '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/dart-sdk/bin';
const env = { ...process.env, PATH: `${DART}:${process.env.PATH}` };
const DATADIR = { 'dart': 'dart-data', 'dart-maor': 'dart-data-maor', 'atoms': 'atoms-data' };

function injectNamedArg(src, fn, val, dotted) {
  const re = new RegExp((dotted ? '\\.\\s*' : '\\b') + fn + '\\s*(?:<[^>]*>)?\\s*\\(', 'g');
  let out = '', i = 0, m;
  while ((m = re.exec(src)) !== null) {
    let d = 1, j = m.index + m[0].length, inStr = false, q = '';
    for (; j < src.length; j++) { const c = src[j]; if (inStr) { if (c === q && src[j-1] !== '\\') inStr = false; continue; } if (c === '"' || c === "'") { inStr = true; q = c; continue; } if (c === '(') d++; else if (c === ')') { d--; if (d === 0) break; } }
    const after = src.slice(j+1).replace(/^\s*/, ''); if (!dotted && (after.startsWith('{') || after.startsWith('=>'))) continue;
    // זהירות מפסיק-נגרר קיים לפני ה-) ⇒ פסיק-כפול
    let b = j-1; while (b > m.index && /\s/.test(src[b])) b--;
    // אפס-ארגומנטים קיימים: `foo()` ⇒ `foo(term: …)` בלי פסיק-מוביל (תיקון-מנוע 28.8).
    const sep = src[b] === '(' ? `term: ${val}` : src[b] === ',' ? ` term: ${val}` : `, term: ${val}`;
    out += src.slice(i, j) + sep + src[j]; i = j+1; re.lastIndex = i;
  }
  return out + src.slice(i);
}

function runAst(absFile) {
  const raw = execFileSync(`${DART}/dart`, ['run', `${AST}/ast_dehardcode.dart`, absFile], { cwd: AST, env, stdio: ['ignore','pipe','pipe'] }).toString();
  return JSON.parse(raw);
}

function purify(rel) {
  const [dir] = rel.split('/');
  if (!DATADIR[dir]) { console.log(`↷ ${rel}: תיקייה לא-נתמכת`); return false; }
  const abs = path.join(ROOT, rel);
  const src0 = fs.readFileSync(abs, 'utf8');
  const base = path.basename(rel).replace(/\.dart$/, '');
  let res;
  try { res = runAst(abs); } catch (e) { console.log(`↩ ${rel}: AST נכשל — ${String(e.stderr||e).slice(0,120)}`); return false; }
  if (!res.ok) { console.log(`↷ ${rel}: ${res.reason}`); return false; }

  const dataRel = `${DATADIR[dir]}/${base}-terms.dart`;
  const dataAbs = path.join(ROOT, dataRel);
  // ליטרל-Dart בטוח (מחרוזת חד-גרשית): מברִיח \, ', $, ומעבר-שורה — גרש-פנימי שבר קבצים (תיקון 30.8)
  const dartStr = (v) => "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/\n/g, '\\n').replace(/\r/g, '') + "'";
  const entries = Object.entries(res.terms).map(([k, v]) => `  '${k}': ${dartStr(v)},`).join('\n');
  const dataBody = `// 🗄️ שמות · חולצו מ-${rel} (מכונת-AST). מטרה→שם; מתחלף פר-וורטיקל.\nconst Map<String, String> kTerms = {\n${entries}\n};\n`;

  // בדיקה + צרכנים
  const testAbs = path.join(ROOT, rel.replace(/\.dart$/, '_test.dart'));
  const hasTest = fs.existsSync(testAbs);
  const testSrc0 = hasTest ? fs.readFileSync(testAbs, 'utf8') : '';
  const consumers = [];
  for (const cdir of ['dart-boxes', '.']) {
    const cabs = path.join(ROOT, cdir); if (!fs.existsSync(cabs)) continue;
    for (const cf of fs.readdirSync(cabs)) {
      if (!/\.dart$/.test(cf) || /_test|proof/.test(cf)) continue;
      const csrc = fs.readFileSync(path.join(cabs, cf), 'utf8');
      if (new RegExp(`/${base}\\.dart['"]`).test(csrc)) {
        const proofs = [cf.replace(/\.dart$/, '-proof.dart'), 'board-proof.dart'].map(p => path.join(cabs, p)).filter(fs.existsSync);
        consumers.push({ abs: path.join(cabs, cf), src0: csrc, proofs });
      }
    }
  }

  // ייבוא-terms ממופה-בכינוי ייחודי פר-אטום ⇒ אפס התנגשות-kTerms כשקופסה צורכת כמה מטוהרים (תיקון-מנוע 28.8).
  const alias = 'td_' + base.replace(/[^a-z0-9]/gi, '_');
  const imp = `import '../${DATADIR[dir]}/${base}-terms.dart' as ${alias};\n`;
  const val = `(k)=>${alias}.kTerms[k]!`;
  fs.mkdirSync(path.dirname(dataAbs), { recursive: true });
  fs.writeFileSync(dataAbs, dataBody);
  // הצהרת-const מקומית שערכה קיבל term() ⇒ final (תיקון 30.8)
  {
    let s3 = res.source;
    const reD = /const(\s+\w+\s*=\s*(?:<[^>{]+>)?\s*)([\[{])/g;
    let out3 = '', i3 = 0, mD;
    while ((mD = reD.exec(s3))) {
      const openCh = mD[2], closeCh = openCh === '[' ? ']' : '}';
      let d3 = 1, j3 = mD.index + mD[0].length, q3 = null;
      for (; j3 < s3.length && d3; j3++) {
        const c3 = s3[j3];
        if (q3) { if (c3 === '\\') j3++; else if (c3 === q3) q3 = null; continue; }
        if (c3 === "'" || c3 === '"') { q3 = c3; continue; }
        if (c3 === openCh) d3++;
        else if (c3 === closeCh) d3--;
      }
      if (/\bterm\(/.test(s3.slice(mD.index, j3))) {
        out3 += s3.slice(i3, mD.index) + 'final' + mD[1] + openCh;
        i3 = mD.index + mD[0].length;
      }
    }
    res.source = out3 + s3.slice(i3);
  }
  // const-בנאי (const ClassName(...)) שקיבל term() ⇒ מפילים את מילת-const (תיקון 30.8)
  {
    let s4 = res.source;
    const reK = /const\s+(?=[A-Z]\w*\s*\()/g;
    let out4 = '', i4 = 0, mK;
    while ((mK = reK.exec(s4))) {
      const po = s4.indexOf('(', mK.index);
      let d4 = 1, j4 = po + 1, q4 = null;
      for (; j4 < s4.length && d4; j4++) {
        const c4 = s4[j4];
        if (q4) { if (c4 === '\\') j4++; else if (c4 === q4) q4 = null; continue; }
        if (c4 === "'" || c4 === '"') { q4 = c4; continue; }
        if (c4 === '(') d4++;
        else if (c4 === ')') d4--;
      }
      if (/\bterm\(/.test(s4.slice(mK.index, j4))) {
        out4 += s4.slice(i4, mK.index);
        i4 = mK.index + mK[0].length;
      }
    }
    res.source = out4 + s4.slice(i4);
  }
  // const-ליטרל שקיבל term() איננו קבוע עוד — מפילים את מילת-const (תיקון 30.8)
  {
    let s2 = res.source, out = '', i2 = 0;
    const reC = /const\s*(?:<[^>{]+>)?\s*([\[{])/g;
    let mC;
    while ((mC = reC.exec(s2))) {
      const openCh = mC[1], closeCh = openCh === '[' ? ']' : '}';
      let d2 = 1, j2 = mC.index + mC[0].length, q2 = null;
      for (; j2 < s2.length && d2; j2++) {
        const c2 = s2[j2];
        if (q2) { if (c2 === '\\') j2++; else if (c2 === q2) q2 = null; continue; }
        if (c2 === "'" || c2 === '"') { q2 = c2; continue; }
        if (c2 === openCh) d2++;
        else if (c2 === closeCh) d2--;
      }
      if (/\bterm\(/.test(s2.slice(mC.index, j2))) {
        out += s2.slice(i2, mC.index) + openCh;
        i2 = mC.index + mC[0].length;
      }
    }
    res.source = out + s2.slice(i2);
  }
  fs.writeFileSync(abs, res.source);
  if (hasTest) fs.writeFileSync(testAbs, injectNamedArg(imp + testSrc0, res.fn, val, false));
  for (const c of consumers) fs.writeFileSync(c.abs, injectNamedArg(imp + c.src0, res.fn, val, true));

  const cwd = path.join(ROOT, '..');
  const dataPrev = fs.existsSync(dataAbs) ? fs.readFileSync(dataAbs, 'utf8') : null;
  const restore = () => { fs.writeFileSync(abs, src0); if (dataPrev === null) fs.rmSync(dataAbs, { force: true }); else fs.writeFileSync(dataAbs, dataPrev); if (hasTest) fs.writeFileSync(testAbs, testSrc0); for (const c of consumers) fs.writeFileSync(c.abs, c.src0); };
  try {
    execFileSync(`${DART}/dart`, ['analyze', abs, dataAbs], { cwd, env, stdio: 'pipe' });
    if (hasTest) execFileSync(`${DART}/dart`, ['run', '--enable-asserts', testAbs], { cwd, env, stdio: 'pipe' });
    for (const p of [...new Set(consumers.flatMap(c => c.proofs))]) execFileSync(`${DART}/dart`, ['run', '--enable-asserts', p], { cwd, env, stdio: 'pipe' });
    console.log(`✅ ${rel} — מנוע-מטרות · ${res.count} שמות ל-${dataRel}${hasTest ? ' · בדיקה ✓' : ''}${consumers.length ? ` · ${consumers.length} צרכנים ✓` : ''}`);
    return true;
  } catch (e) { const err = ((e.stdout?.toString() || '') + (e.stderr?.toString() || '') || String(e)).slice(0, 400); restore(); console.log(`↩ ${rel}: אימות נכשל.\n   ${err.replace(/\n/g, '\n   ')}`); return false; }
}

const a = process.argv[2];
if (a === '--all') {
  const files = [];
  for (const dir of ['dart-maor', 'dart']) {
    const abs = path.join(ROOT, dir); if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) if (/\.dart$/.test(f) && !/_test/.test(f)) files.push(`${dir}/${f}`);
  }
  let ok = 0; for (const f of files) { if (purify(f)) ok++; }
  console.log(`\n═══ מכונת-AST · אצווה: ✅ ${ok} מנועי-מטרות ═══`);
} else if (a) purify(a);
else console.log('שימוש: node machtzev/ast-purify.mjs <file> | --all');
