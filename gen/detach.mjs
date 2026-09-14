// gen/detach.mjs --check — הוכחת-ניתוק: אף קובץ מחוץ ל-gen/ לא מזכיר אותה, gen/ לא מייבאת מהמחצב (רק קוראת קבצי-אטומים), ואינה רשומה בשום צנרת/שער/pin.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sh = (c) => { try { return execSync(c, { cwd: ROOT, encoding: 'utf8' }); } catch (e) { return e.stdout || ''; } };
const bad = [];
const outside = sh(`git grep -n -E "gen/(build|shelf|prove|render|live|spec|detach)\\.mjs|gen/needs\\.data|gen/specs|gen/out" -- . ':!gen'`).trim();
if (outside) bad.push('אזכור מחוץ לתיקייה:\n' + outside);
for (const f of fs.readdirSync(path.join(ROOT, 'gen')).filter((f) => f.endsWith('.mjs'))) {
  const src = fs.readFileSync(path.join(ROOT, 'gen', f), 'utf8');
  for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) if (!m[1].startsWith('node:') && !m[1].startsWith('./')) bad.push(`${f} מייבא החוצה: ${m[1]}`);
}
for (const f of ['machtzev/generator/regen.mjs', 'machtzev/gates.tsv', 'machtzev/pins.sha256', 'machtzev/one.mjs', 'machtzev/police.mjs', 'machtzev/INDEX.md'])
  if (fs.existsSync(path.join(ROOT, f)) && /gen\/(build|shelf|prove|render|live|spec|detach)\.mjs|gen\/needs\.data|gen\/specs|gen\/out/.test(fs.readFileSync(path.join(ROOT, f), 'utf8'))) bad.push(`רשום ב-${f}`);
if (bad.length) { console.error('✗ gen אינה נתיקה:\n' + bad.join('\n')); process.exit(1); }
console.log('✓ gen נתיקה: אפס אזכור מבחוץ · אפס ייבוא החוצה · לא בצנרת, לא בשער, לא ב-pin. ניתוק = git rm -r gen');
