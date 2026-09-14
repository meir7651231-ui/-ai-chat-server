// gen/shelf.mjs — אינדוקס המדף. קורא כל אטום-JS ב-new/atoms: שם הפונקציה, פרמטרים,
// אורך-הקריאה (N) והקבועים (T) מקובץ-הבדיקה שלו, ותפקיד מהחוזה. אפס מילון, אפס מודל.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ATOMS = path.join(ROOT, 'new', 'atoms');

const SIG_RE = /export\s+function\s+(\w+)\s*\(([^)]*)\)/;
const ARROW_RE = /export\s+const\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/;
const ARROW1_RE = /export\s+const\s+(\w+)\s*=\s*(\w+)\s*=>/;
const CONST_RE = /export\s+const\s+([A-Z][A-Z0-9_]*)\s*=/;
const N_RE = /Math\.max\(0,\s*(\d+)\s*-\s*a\.length\)/;
const T_RE = /const\s+__d_\w+_T\s*=\s*(\{[\s\S]*?\n\});/;

export function readShelf() {
  const names = fs.readdirSync(ATOMS)
    .filter((f) => f.endsWith('.mjs') && !f.endsWith('.test.mjs'))
    .map((f) => f.slice(0, -4))
    .sort();
  const shelf = [];
  for (const name of names) {
    const src = fs.readFileSync(path.join(ATOMS, name + '.mjs'), 'utf8');
    let m = SIG_RE.exec(src) || ARROW_RE.exec(src) || ARROW1_RE.exec(src);
    let kind = 'fn';
    if (!m) { m = CONST_RE.exec(src); if (!m) continue; kind = 'const'; }
    const params = kind === 'fn' ? m[2].split(',').map((s) => s.trim()).filter(Boolean) : [];
    const hasT = params[params.length - 1] === 'T';
    let n = hasT ? params.length - 1 : params.length;
    let T = null;
    const tp = path.join(ATOMS, name + '.test.mjs');
    let test = '';
    if (fs.existsSync(tp)) {
      test = fs.readFileSync(tp, 'utf8');
      const nm = N_RE.exec(test);
      if (nm) n = Number(nm[1]);
      const tm = T_RE.exec(test);
      if (tm) { try { T = new Function('return (' + tm[1] + ');')(); } catch { T = null; } }
    }
    // הקבועים (T) מגיעים מאטום-הדאטה התאום (<name>-strings / <name>-data) — האטום האמיתי; קובץ-הבדיקה רק מעתיק אותו
    let tSource = T ? 'test' : null;
    for (const twin of [name + '-strings', name + '-data']) {
      const tp2 = path.join(ATOMS, twin + '.mjs');
      if (!fs.existsSync(tp2)) continue;
      const tm2 = /export\s+const\s+\w+_T\s*=\s*(\{[\s\S]*?\n\});/.exec(fs.readFileSync(tp2, 'utf8'));
      if (!tm2) continue;
      try { const T2 = new Function('return (' + tm2[1] + ');')(); if (!T || JSON.stringify(T2) === JSON.stringify(T)) { T = T2; tSource = twin; } else tSource = twin + '≠test'; } catch {}
      break;
    }
    let role = '';
    const cp = path.join(ATOMS, name + '.contract.md');
    if (fs.existsSync(cp)) {
      const c = fs.readFileSync(cp, 'utf8');
      const r = /\*\*תפקיד:\*\*\s*([^\n]*)/.exec(c);
      role = r ? r[1].trim() : '';
    }
    shelf.push({ name, kind, fn: m[1], params, n, hasT, T, tSource, role, file: path.relative(ROOT, path.join(ATOMS, name + '.mjs')), test: fs.existsSync(tp), src: src.replace(/^export\s+/gm, '') });
  }
  return shelf;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const s = readShelf();
  const byN = {};
  for (const a of s) byN[a.n] = (byN[a.n] ?? 0) + 1;
  const ts = {}; for (const a of s) if (a.hasT) ts[(a.tSource || 'none').replace(/^.*-(strings|data)(≠test)?$/, '$1$2')] = (ts[(a.tSource || 'none').replace(/^.*-(strings|data)(≠test)?$/, '$1$2')] ?? 0) + 1;
  console.log(`מדף: ${s.length} אטומים · עם T: ${s.filter((a) => a.hasT).length} · מקור-T:`, ts, '· לפי אורך-קריאה:', byN);
}
