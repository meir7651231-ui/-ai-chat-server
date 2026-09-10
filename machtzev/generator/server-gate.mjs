#!/usr/bin/env node
// ☁️ server-gate — «יש שרת» נבדק, לא מוצהר (G57 · הכרעה-31).
//   שלוש שאלות: (1) מה שהוכרז נפלט ומכסה את כל הישויות; (2) מה שלא הוכרז לא נפלט (ביט-זהות);
//   (3) אף סוד לא דלף לפלט, ו-`settings` (צרור-המפתחות של הלקוח) אינו במפתחות-המותרים.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serverOf } from './server.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const SPECS = path.join(HERE, 'specs-ds');
const OUT = path.join(ROOT, 'server-gen');
const rd = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
const gate = process.argv.includes('--gate');
const fails = [];

const declared = fs.readdirSync(SPECS).filter((f) => f.endsWith('.txt')).map((f) => f.replace(/\.txt$/, '')).filter((ns) => serverOf(ns));
const dirs = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter((d) => fs.statSync(path.join(OUT, d)).isDirectory()) : [];

if (!declared.length && dirs.length) fails.push(`אין הצהרת-שרת אך נפלטו ${dirs.length} חבילות`);
if (declared.length && !dirs.length) fails.push('הוכרז שרת ולא נפלטה חבילה');

for (const d of dirs) {
  const rules = rd(path.join(OUT, d, 'firestore.rules'));
  if (!rules) { fails.push(`${d}: אין firestore.rules`); continue; }
  // (1) הישויות בכללים ≡ הישויות של האפליקציות
  const idx = JSON.parse(rd(path.join(HERE, 'balagan-index.json')) || '{}');
  const ns = (idx.modules || []).map((m) => m.ns);
  const want = new Set();
  for (const n of ns) { const f = path.join(HERE, 'apps', n + '.json'); if (!fs.existsSync(f)) continue; for (const e of JSON.parse(rd(f)).entities || []) want.add(e.slug); }
  const miss = [...want].filter((e) => !rules.includes(`'${e}'`));
  if (miss.length) fails.push(`${d}: ${miss.length} ישויות חסרות בכללים (${miss.slice(0, 3).join(', ')})`);
  // (2) מפתחות-המסמך ≡ cloudJson של החנות
  const m = rd(path.join(ROOT, 'new/dart-ui-bs/ds/ds_store.dart')).match(/String cloudJson\(\) => jsonEncode\(\{([^}]*)\}\)/);
  if (!m) fails.push('אין cloudJson בחנות');
  else {
    const keys = [...m[1].matchAll(/'([^']+)':/g)].map((x) => x[1]);
    for (const k of keys) if (!new RegExp(`hasOnly\\(\\[[^\\]]*'${k}'`).test(rules)) fails.push(`${d}: מפתח '${k}' של cloudJson אינו מותר בכללים`);
    if (/hasOnly\(\[[^\]]*'settings'/.test(rules)) fails.push(`${d}: 'settings' מותר בכללים — צרור-המפתחות יכול לעלות לענן`);
  }
  // (3) אפס סודות בפלט
  for (const f of fs.readdirSync(path.join(OUT, d))) {
    if (!/\.(mjs|js|json|rules|md)$/.test(f)) continue;
    const src = rd(path.join(OUT, d, f));
    if (/\b(sk-ant-[A-Za-z0-9]{8,}|AIza[0-9A-Za-z_-]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY)/.test(src)) fails.push(`${d}/${f}: ליטרל-סוד בפלט`);
  }
  // (4) המצבות נוסעות — בלי זה סנכרון מחייה מחוקים
  if (!/'dead'/.test(rules)) fails.push(`${d}: מצבות-המחיקה אינן חלק מהמסמך`);
}

// (5) יציבות-מזהים: `<ns>_ent<N>` נגזר ממספר-השורה בספק — שורה חדשה מעל הישות מזיזה אותו
//     ומיתמת את הנתונים של המשתמש (נתפס ב-G57: `שרת:` הפך את app_tasks_ent1 ל-ent2).
//     המפה ננעלת: מזהה קיים לא משנה שם ולא נעלם; חדש מותר להיכנס.
{
  const BASE = path.join(HERE, 'entity-slugs.json');
  const now = {};
  for (const f of fs.readdirSync(path.join(HERE, 'apps')).filter((x) => x.endsWith('.json'))) {
    const ns = f.replace(/\.json$/, '');
    now[ns] = ((JSON.parse(rd(path.join(HERE, 'apps', f))).entities) || []).map((e) => `${e.name}=${e.slug}`).sort();
  }
  const base = fs.existsSync(BASE) ? JSON.parse(rd(BASE)) : null;
  if (base) {
    for (const ns of Object.keys(base)) {
      const gone = (base[ns] || []).filter((x) => !(now[ns] || []).includes(x));
      if (gone.length) fails.push(`מזהי-ישות השתנו ב-${ns}: ${gone.slice(0, 2).join(', ')} — נתוני-משתמש יתייתמו`);
    }
  }
  if (!base || process.argv.includes('--write')) fs.writeFileSync(BASE, JSON.stringify(now, null, 1) + '\n');
}

if (gate && fails.length) { console.error(`🚨 server: ${fails.join(' · ')}`); process.exit(1); }
console.log(`${fails.length ? '🔴' : '✓'} server: ${declared.length} הצהרות · ${dirs.length} חבילות · ישויות+מפתחות ≡ הקוד · אפס סודות${fails.length ? ' · ' + fails.join(' · ') : ''}`);
