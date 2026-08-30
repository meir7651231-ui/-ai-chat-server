#!/usr/bin/env node
/** 🏗️ מחצב · מחלץ-הפערים — מזין את המנוע: פונקציות-לוגיקה שבמקור ואינן במדף ⇒ טיוטות ל-quarry/.
 *  TS→JS (transpileModule), טיוטה עצמאית (בלי import — הפונקציה לבדה); מה שטהור-ועצמאי
 *  ‏promote-auto יאפיין אוטומטית (Golden), מה שצריך-שכן ייפול לשארית. חילוץ בלבד — אפס-שיפוט. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const _ts = createRequire('/home/user/maor-system/')('typescript');
const ROOT = new URL('../', import.meta.url).pathname;
const Q = path.join(ROOT, 'quarry');
const SRC = '/home/user/maor-system/src';
const SYS = 'maor';
const LIMIT = +(process.argv[2] || 0) || Infinity;

const walk = (d, o = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p, o) : o.push(p); } return o; };
const camelToKebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();

// מדף קיים (שמות) — לא לחלץ מה שכבר נחצב
const shelf = new Set();
for (const dir of ['new/atoms', 'new/boxes']) for (const f of walk(path.join(ROOT, dir))) {
  if (!/\.mjs$/.test(f) || /\.test\./.test(f)) continue; const t = fs.readFileSync(f, 'utf8'); let m;
  for (const re of [/export\s+(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)/g, /export\s+const\s+([a-zA-Z_$][\w$]*)/g]) while ((m = re.exec(t))) shelf.add(m[1]);
  const c = /export\s*\{([^}]*)\}/g; while ((m = c.exec(t))) for (const n of m[1].split(',')) { const nm = n.trim().split(/\s+as\s+/)[0].trim(); if (nm) shelf.add(nm); }
}
for (const dir of fs.readdirSync(path.join(ROOT, 'new')).filter(d => /^dart/.test(d))) {
  const abs = path.join(ROOT, 'new', dir); if (!fs.statSync(abs).isDirectory()) continue;
  for (const f of walk(abs)) { if (!/\.dart$/.test(f) || /_test\./.test(f)) continue; const t = fs.readFileSync(f, 'utf8'); let m; const a = /^[A-Za-z_<>,\s?]+\s+([a-zA-Z_$][\w$]*)\s*\(/gm; while ((m = a.exec(t))) shelf.add(m[1]); }
}

const impure = (f) => /\.tsx$/.test(f) || /\/store\/|\/state\/|\/screens\/|\/widgets\/|\/services\/|\/features\//.test(f) || /persist|cloudSync|cloud\.ts|firebase|pwa\.ts|a11yApply|\/hooks\/|main\.|App\.|provider|notifier|controller/.test(f);

// חילוץ טקסט-פונקציה מאוזן מנקודת-ההכרזה
const extractDecl = (s, idx) => {
  // מ-idx (תחילת export) עד סוף הבלוק/הביטוי
  let i = s.indexOf('=>', idx), brace = s.indexOf('{', idx);
  const isArrow = i > -1 && (brace === -1 || i < brace);
  let j, d = 0, q = null, started = false;
  const start = idx;
  for (j = idx; j < s.length; j++) {
    const ch = s[j];
    if (q) { if (ch === '\\') j++; else if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { q = ch; continue; }
    if (ch === '{') { d++; started = true; }
    else if (ch === '}') { d--; if (started && d === 0) return s.slice(start, j + 1); }
  }
  return null;
};

fs.mkdirSync(Q, { recursive: true });
const files = walk(SRC).filter(f => /\.(ts|tsx)$/.test(f) && !/\.test\.|\.d\.ts$/.test(f) && !impure(f));
let written = 0, skipTaken = 0, skipShape = 0;
const reDecl = /export\s+(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)|export\s+const\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z_$][\w$]*)\s*(?::[^=]*)?=>/g;
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8'); let m;
  const rel = f.replace('/home/user/maor-system/', '');
  while ((m = reDecl.exec(s))) {
    const name = m[1] || m[2];
    if (shelf.has(name)) { skipTaken++; continue; }
    const decl = extractDecl(s, m.index);
    if (!decl) { skipShape++; continue; }
    const kebab = camelToKebab(name);
    if (fs.existsSync(path.join(ROOT, 'new/atoms', kebab + '.mjs'))) { skipTaken++; continue; }
    // TS→JS: עוטפים כמודול, מסירים טיפוסים
    let js;
    try { js = _ts.transpileModule(decl, { compilerOptions: { target: _ts.ScriptTarget.ES2022, module: _ts.ModuleKind.ESNext } }).outputText; }
    catch { skipShape++; continue; }
    if (/^\s*import /m.test(js)) { skipShape++; continue; }
    const draft = `/** טיוטת-חילוץ · ${name} · מוצא: ${SYS}/${rel} (מחלץ-הפערים) */\n${js}`;
    fs.writeFileSync(path.join(Q, kebab + '@gap.mjs'), draft);
    written++;
    if (written >= LIMIT) break;
  }
  if (written >= LIMIT) break;
}
console.log(`🏗️ מחלץ-הפערים (${SYS}): נכתבו ${written} טיוטות ל-quarry/ · דילוג-קיים ${skipTaken} · דילוג-צורה ${skipShape}`);
