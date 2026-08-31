#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  logic-census.mjs — מפקד אטומי-הלוגיקה (הכרעה 21: המחולל מחובר גם ללוגיקה).
//  סורק את מנועי-maor הטהורים (new/dart-maor) + הלוגיקה של buildsmart (new/dart)
//  ומחלץ לכל פונקציה עליונה את התפר שלה: טיפוסי-קלט → טיפוס-פלט. פונקציה עם קלט
//  פרימיטיבי-בלבד ופלט-פרימיטיבי = **wireable** (המחולל יכול לחווט אותה כשדה-מחושב).
//  דטרמיניסטי · אפס-רשת · קורא רק חתימות (חוק-4). פלט: generator/logic-census.json.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs'; import path from 'node:path';
const ROOT = new URL('../new/', import.meta.url).pathname;
const OUT = new URL('./generator/logic-census.json', import.meta.url).pathname;
const SCAN = ['dart-maor', 'dart'];
const PRIM = new Set(['String', 'int', 'double', 'num', 'bool']);

// פיצול רשימת-פרמטרים ברמה-העליונה בלבד (מכבד <> ו-() של טיפוסי-פונקציה/גנריות).
function splitParams(s) {
  const out = []; let depth = 0, cur = '';
  for (const ch of s) {
    if (ch === '<' || ch === '(' || ch === '[' || ch === '{') depth++;
    else if (ch === '>' || ch === ')' || ch === ']' || ch === '}') depth--;
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
// טיפוס-הפרמטר = הטוקן-הראשון (מתעלם משם-הפרמטר, ברירות-מחדל, required/named).
const paramType = (p) => {
  const c = p.replace(/^\{|\}$/g, '').replace(/\brequired\b/g, '').trim();
  const m = c.match(/^([A-Za-z_][A-Za-z0-9_<>?,. ]*?)\s+[a-z_][A-Za-z0-9_]*(\s*=.*)?$/);
  return (m ? m[1] : c).trim();
};
const isPrim = (t) => PRIM.has(t.replace(/\?$/, ''));
const isDisplayable = (t) => { const x = t.replace(/\?$/, ''); return isPrim(x) || /^List<(String|int|double|num)>$/.test(x); };

export function logicCensus() {
  const atoms = []; const seen = new Set();
  for (const dir of SCAN) {
    let files; try { files = fs.readdirSync(path.join(ROOT, dir)).filter((f) => f.endsWith('.dart') && !f.endsWith('_test.dart')); } catch { continue; }
    for (const f of files.sort()) {
      const src = fs.readFileSync(path.join(ROOT, dir, f), 'utf8');
      // פונקציה-עליונה חד-שורתית: <ret> <name>(<params>) { | => | async
      for (const m of src.matchAll(/^([A-Za-z_][A-Za-z0-9_<>?,. ]*?)\s+([a-z][A-Za-z0-9_]*)\(([^;{]*?)\)\s*(?:\{|=>|async)/gm)) {
        const [, ret0, name, paramStr] = m;
        const ret = ret0.trim();
        if (['if', 'for', 'while', 'switch', 'return', 'else', 'final', 'const', 'var'].includes(ret) || seen.has(name)) continue;
        if (!/^[A-Za-z_][A-Za-z0-9_<>?,. ]*$/.test(ret)) continue;
        seen.add(name);
        const params = paramStr.trim() ? splitParams(paramStr).map(paramType) : [];
        const allPrim = params.length > 0 && params.every(isPrim);
        atoms.push({ file: dir + '/' + f, name, ret, params, argc: params.length,
          wireable: allPrim && isDisplayable(ret) });   // קלט-פרימיטיבי + פלט-מוצג ⇒ ניתן-לחיווט כשדה-מחושב
      }
    }
  }
  atoms.sort((a, b) => a.name.localeCompare(b.name));
  return atoms;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const atoms = logicCensus();
  fs.writeFileSync(OUT, JSON.stringify(atoms, null, 1) + '\n');
  const wire = atoms.filter((a) => a.wireable);
  console.log(`מפקד-הלוגיקה · ${atoms.length} פונקציות · ${wire.length} ניתנות-לחיווט (קלט-פרימיטיבי⇒פלט-מוצג) · → generator/logic-census.json`);
  const byRet = {}; for (const a of wire) byRet[a.ret] = (byRet[a.ret] || 0) + 1;
  console.log('== פלט (wireable) =='); for (const [k, v] of Object.entries(byRet).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
  console.log('== דוגמאות =='); for (const a of wire.slice(0, 12)) console.log(`  ${a.ret} ${a.name}(${a.params.join(', ')})`);
}
