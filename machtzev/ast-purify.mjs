#!/usr/bin/env node
// 🎯 מנהל מכונת-ה-AST · דה-הרדקוד מדויק לכל צורות-הקוד.
// קורא ל-ast_dehardcode.dart (analyzer) → מקבל מקור-משוכתב + terms, כותב קובץ-שמות,
// מחווט בדיקה+צרכנים, מאמת (analyze+test+proofs), מחזיר-הכל-אם-נכשל.
// שימוש: node machtzev/ast-purify.mjs <file>   |   --all
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = new URL('../new/', import.meta.url).pathname;
const AST = '/tmp/claude-0/-home-user/65886fc0-dc27-5a35-9058-e6a50b9adaff/scratchpad/asttest';
const DART = '/tmp/claude-0/-home-user/65886fc0-dc27-5a35-9058-e6a50b9adaff/scratchpad/dart-sdk-dl/dart-sdk/bin';
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
  const raw = execSync(`dart run ${AST}/ast_dehardcode.dart ${absFile}`, { cwd: AST, env, stdio: ['ignore','pipe','pipe'] }).toString();
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
  const entries = Object.entries(res.terms).map(([k, v]) => `  '${k}': ${JSON.stringify(v).replace(/^"|"$/g, "'")},`).join('\n');
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
  fs.writeFileSync(abs, res.source);
  if (hasTest) fs.writeFileSync(testAbs, injectNamedArg(imp + testSrc0, res.fn, val, false));
  for (const c of consumers) fs.writeFileSync(c.abs, injectNamedArg(imp + c.src0, res.fn, val, true));

  const cwd = path.join(ROOT, '..');
  const restore = () => { fs.writeFileSync(abs, src0); fs.rmSync(dataAbs, { force: true }); if (hasTest) fs.writeFileSync(testAbs, testSrc0); for (const c of consumers) fs.writeFileSync(c.abs, c.src0); };
  try {
    execSync(`dart analyze ${abs} ${dataAbs}`, { cwd, env, stdio: 'pipe' });
    if (hasTest) execSync(`dart run --enable-asserts ${testAbs}`, { cwd, env, stdio: 'pipe' });
    for (const p of [...new Set(consumers.flatMap(c => c.proofs))]) execSync(`dart run --enable-asserts ${p}`, { cwd, env, stdio: 'pipe' });
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
