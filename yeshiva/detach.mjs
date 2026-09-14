#!/usr/bin/env node
// 🔌 detach --check — מוכיח שהקורא הישיבתי נתיק: אף קובץ מחוץ ל-yeshiva/ לא מזכיר אותו, ואף קובץ בתוכו לא מייבא מהמחצב.
//   exit 0 = אפשר למחוק את התיקייה ולא יישאר זכר. exit 1 = יש חיבור, ושמו מודפס.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const REL = 'yeshiva';
let bad = 0;

// 1 · מבחוץ פנימה: git grep על כל הריפו, למעט התיקייה עצמה
const g = spawnSync('git', ['grep', '-l', '-e', 'yeshiva/read', '-e', 'yeshiva/detach', '-e', 'yeshiva/out', '-e', 'yeshiva/DETACH', '--', '.', `:!${REL}`], { cwd: ROOT, encoding: 'utf8' });   // הנתיב, לא המילה: יש בריפו אפליקציית 'yeshiva' שאינה קשורה
const refs = (g.stdout || '').split('\n').filter(Boolean);
for (const f of refs) { bad++; console.log(`✗ מחוץ לתיקייה מזכיר yeshiva: ${f}`); }

// 2 · מבפנים החוצה: אף import מקומי אל מחוץ לתיקייה
for (const f of fs.readdirSync(HERE).filter((x) => x.endsWith('.mjs'))) {
  const src = fs.readFileSync(path.join(HERE, f), 'utf8');
  for (const m of src.matchAll(/^\s*import\s[^'"\n]*['"]([^'"]+)['"]/gm)) {
    const spec = m[1];
    if (spec.startsWith('node:')) continue;
    if (spec.startsWith('.') && !path.resolve(HERE, spec).startsWith(HERE)) { bad++; console.log(`✗ ${f} מייבא מחוץ לתיקייה: ${spec}`); }
    if (!spec.startsWith('.') && !spec.startsWith('node:')) { bad++; console.log(`✗ ${f} מייבא חבילה: ${spec}`); }
  }
}

// 3 · לא רשום בשום מקום: regen · gates · pins · one
for (const f of ['machtzev/generator/regen.mjs', 'machtzev/gates.tsv', 'machtzev/pins.sha256', 'machtzev/one.mjs']) {
  const p = path.join(ROOT, f);
  if (fs.existsSync(p) && /yeshiva/.test(fs.readFileSync(p, 'utf8'))) { bad++; console.log(`✗ רשום ב-${f}`); }
}

console.log(bad ? `✗ detach: ${bad} חיבורים — לא נתיק` : `✓ detach: אפס חיבורים — git rm -r ${REL} מחזיר את המצב לקדמותו`);
process.exit(bad ? 1 : 0);
