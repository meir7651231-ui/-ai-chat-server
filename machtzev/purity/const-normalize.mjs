#!/usr/bin/env node
// 🔩 מנרמל-const · ממיר אטום-const-דאטה לפונקציה-אפס-ארג (שומר שם מדויק), כדי ש-ast-purify
//    יחלץ את העברית למטרה. 3 צורות → `Type NAME() => <literal>;` (const מוסר ⇒ עברית 'חופשית').
//    צרכנים: הפניה-חשופה `NAME` (שאינה כבר `NAME(`) ⇒ `NAME()`. דטרמיניסטי · revert-on-fail.
//    שימוש: node machtzev/purity/const-normalize.mjs <dir/base>  |  --list
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
const ROOT = new URL('../../new/', import.meta.url).pathname;
const DART = process.env.DART_SDK_BIN || '/home/user/flutter/bin';
const env = { ...process.env, PATH: `${DART}:${process.env.PATH}` };
const HEB = /[֐-׿]/;

function normalize(rel) {
  const abs = path.join(ROOT, rel + '.dart');
  if (!fs.existsSync(abs)) { console.log(`↷ ${rel}: אין`); return false; }
  const src = fs.readFileSync(abs, 'utf8');
  const codeNoC = src.replace(/^\s*\/\/.*$/gm, '');
  if (!HEB.test(codeNoC)) { console.log(`↷ ${rel}: אין עברית`); return false; }

  let m, name, type, literal;
  if ((m = src.match(/^const\s+([\w<>,\s?]+?)\s+([A-Za-z_]\w*)\s*=\s*(\[[\s\S]*?\]|\{[\s\S]*?\});\s*$/m))) {
    type = m[1].trim(); name = m[2]; literal = m[3].trim();
  } else if ((m = src.match(/^([\w<>,\s?]+?)\s+get\s+([A-Za-z_]\w*)\s*=>\s*(?:const\s+)?(\[[\s\S]*?\]|\{[\s\S]*?\});\s*$/m))) {
    type = m[1].trim(); name = m[2]; literal = m[3].trim();
  } else if ((m = src.match(/^([\w<>,\s?]+?)\s+([A-Za-z_]\w*)\s*\(\s*\)\s*\{\s*return\s+const\s+(\[[\s\S]*?\]|\{[\s\S]*?\});\s*\}\s*$/m))) {
    type = m[1].trim(); name = m[2]; literal = m[3].trim();
  } else { console.log(`↷ ${rel}: לא צורת-const פשוטה`); return false; }

  const ignore = /[A-Z_]/.test(name) ? '// ignore_for_file: non_constant_identifier_names\n' : '';
  const header = `// ⚛️ אטום-Dart · ${name} — נורמל מ-const-דאטה לפונקציה (מנוע-טהור; העברית תחולץ למטרה).\n${ignore}`;
  const newSrc = header + src.replace(m[0], `${type} ${name}() => ${literal};`);

  const consumers = [];
  for (const cdir of ['dart-boxes', '.', 'dart-maor', 'dart']) {
    const cabs = path.join(ROOT, cdir); if (!fs.existsSync(cabs)) continue;
    for (const cf of fs.readdirSync(cabs)) {
      if (!/\.dart$/.test(cf) || /proof/.test(cf)) continue;
      const cp = path.join(cabs, cf); if (cp === abs) continue;
      const csrc = fs.readFileSync(cp, 'utf8');
      if (new RegExp(`\\b${name}\\b`).test(csrc)) consumers.push({ cp, csrc });
    }
  }
  fs.writeFileSync(abs, newSrc);
  for (const c of consumers) {
    const out = c.csrc.replace(new RegExp(`\\b${name}\\b(?!\\s*\\()`, 'g'), `${name}()`);
    if (out !== c.csrc) fs.writeFileSync(c.cp, out);
  }
  const restore = () => { fs.writeFileSync(abs, src); for (const c of consumers) fs.writeFileSync(c.cp, c.csrc); };
  try {
    execSync(`dart analyze ${abs}`, { cwd: path.join(ROOT, '..'), env, stdio: 'pipe' });
    console.log(`✅ ${rel} → פונקציה ${name}() · ${consumers.length} צרכנים`);
    return true;
  } catch (e) {
    restore();
    console.log(`↩ ${rel}: analyze נכשל — הוחזר (אטום+צרכנים).`);
    return false;
  }
}

const a = process.argv[2];
if (a === '--list') {
  for (const dir of ['dart-maor', 'dart']) for (const f of fs.readdirSync(path.join(ROOT, dir))) {
    if (!f.endsWith('.dart') || f.includes('_test')) continue;
    const s = fs.readFileSync(path.join(ROOT, dir, f), 'utf8');
    const base = dir + '/' + f.replace('.dart', '');
    if (fs.existsSync(path.join(ROOT, dir === 'dart-maor' ? 'dart-data-maor' : 'dart-data', f.replace('.dart', '-terms.dart')))) continue;
    const c = s.replace(/^\s*\/\/.*$/gm, '');
    if (HEB.test(c) && /^(const\s+[\w<>,\s?]+\s+[A-Za-z_]\w*\s*=\s*[\[{]|[\w<>,\s?]+\s+get\s)/m.test(c)) console.log(base);
  }
} else if (a) normalize(a);
else console.log('שימוש: node machtzev/purity/const-normalize.mjs <dir/base> | --list');
