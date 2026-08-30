#!/usr/bin/env node
/** 🏭 מחצב · המנוע-המלא (הכרעה 19 — מנוע-אחד, לא נחיל) — מהתחלה עד הסוף, מדלג-עשוי.
 *  לכל קובץ-מקור-לוגיקה של maor שאינו-חצוב:
 *    box-assemble (TS→JS + wire + golden מ-POOL + קציר-פיקסצ'רים מקובץ-הבדיקה)
 *    → טיהור-אוטומטי-חד-משמעי (קבועי-זמן/radix ⇒ אנוטציית קבוע-מתמטי)
 *    → מסנן-שערים (טוהר-דאטה/עומק/חיווט/חוזה) — כל קופסה-מפרה מוסרת ונרשמת ל"דורש-הכרעה"
 *  אידמפוטנטי: קובץ שכבר יש לו קופסה — מדולג. רק ירוק ננחת (L33). משטרה בסוף.
 *  שימוש: node chisel-all.mjs [--limit N] */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('../', import.meta.url).pathname;
const BOXES = path.join(ROOT, 'new/boxes');
const MAOR = '/home/user/maor-system';
const LIMIT = (() => { const i = process.argv.indexOf('--limit'); return i > 0 ? +process.argv[i + 1] : Infinity; })();
const run = (c, a) => { try { return execFileSync(c, a, { encoding: 'utf8', timeout: 120000 }); } catch (e) { return (e.stdout || '') + (e.stderr || ''); } };

const walk = (d, o = []) => { if (!fs.existsSync(d)) return o; for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p, o) : o.push(p); } return o; };
const kebabOf = (b) => b.replace(/([a-z0-9])([A-Z])/g, (m, a, x) => /[0-9]/.test(a) ? a + x : a + '-' + x).toLowerCase();

// מדף קיים (שמות-יצוא) + קופסאות קיימות (אידמפוטנטי)
const shelf = new Set();
for (const dir of ['new/atoms', 'new/boxes']) for (const f of walk(path.join(ROOT, dir))) {
  if (!/\.mjs$/.test(f) || /\.test\./.test(f)) continue; const t = fs.readFileSync(f, 'utf8'); let m;
  for (const re of [/export\s+(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)/g, /export\s+const\s+([a-zA-Z_$][\w$]*)/g]) while ((m = re.exec(t))) shelf.add(m[1]);
}
const boxExists = (name) => fs.existsSync(path.join(BOXES, name + '.mjs'));
const impure = (f) => /\.tsx$/.test(f) || /\/(store|state|screens|widgets|services|features|hooks)\//.test(f) || /persist|cloudSync|firebase|pwa\.ts|a11yApply|main\.|App\./.test(f);

// מועמדים: קבצי-לוגיקה עם ≥1 יצוא-פונקציה שאינו-במדף
const candidates = [];
for (const f of walk(path.join(MAOR, 'src'))) {
  if (!/\.ts$/.test(f) || /\.test\.|\.spec\.|\.d\.ts$/.test(f) || impure(f)) continue;
  const s = fs.readFileSync(f, 'utf8');
  const exps = [...s.matchAll(/export\s+(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)/g)].map(m => m[1]);
  if (!exps.length || exps.every(n => shelf.has(n))) continue;
  const rel = f.replace(MAOR + '/', '');
  const boxName = kebabOf(path.basename(f, '.ts'));
  if (boxExists(boxName)) continue;                                  // אידמפוטנטי
  candidates.push({ rel, boxName });
}

// טיהור-אוטומטי-חד-משמעי: אנוטציית קבוע-מתמטי לקבועי-זמן/radix (מנגנון ודאי בלבד)
const TIME = /(?<![\w.])(86_?400_?000|3_?600_?000|604_?800_?000|60_?000|1000)(?![\w.])/;
const autoPurify = (boxFile) => {
  const lines = fs.readFileSync(boxFile, 'utf8').split('\n'); const out = [];
  for (const ln of lines) {
    if ((TIME.test(ln) || /parseInt\([^,]+,\s*\d+\s*\)/.test(ln)) && !/קבוע-מתמטי/.test(out[out.length - 1] || '')) {
      const indent = (ln.match(/^\s*/) || [''])[0];
      out.push(indent + '// קבוע-מתמטי: יחידת-זמן/בסיס-מספר (מנגנון)');
    }
    out.push(ln);
  }
  fs.writeFileSync(boxFile, out.join('\n'));
};

const rmBox = (n) => { for (const e of ['.mjs', '.contract.md', '.test.mjs']) { const fp = path.join(BOXES, n + e); if (fs.existsSync(fp)) fs.unlinkSync(fp); } };
const freshViolators = (names) => {
  const bad = new Set();
  for (const [s, arg] of [['data-purity-check.mjs', '--gate'], ['deep-purity-scan.mjs', '--gate'], ['wiring-check.mjs', ''], ['contract-check.mjs', '']]) {
    const o = run('node', [path.join(ROOT, 'machtzev', s), ...(arg ? [arg] : [])]);
    // חילוץ שם-קופסה מדויק: נתיב-מדף (new/boxes/NAME) או "+ NAME" — כל אחד בנפרד (תיקון-באג: '+ ' בלע 'new')
    for (const m of o.matchAll(/new\/(?:atoms|boxes)\/([a-z0-9][a-z0-9-]*)/g)) if (names.includes(m[1])) bad.add(m[1]);
    for (const m of o.matchAll(/^\s*\+\s+([a-z0-9][a-z0-9-]*)\b/gm)) if (names.includes(m[1])) bad.add(m[1]);
  }
  return bad;
};

let landed = 0, judged = 0, skipped = 0; const green = [], needsJudgment = [];
let processed = 0;
for (const { rel, boxName } of candidates) {
  if (processed >= LIMIT) break;
  processed++;
  const r = run('node', [path.join(ROOT, 'machtzev/box-assemble.mjs'), rel, boxName, '--write']);
  if (!/קופסה הורכבה/.test(r)) { skipped++; continue; }              // יבוא-ערך-זר / אין-golden
  autoPurify(path.join(BOXES, boxName + '.mjs'));
}
// מסנן-שערים על כל הקופסאות-החדשות ביחד
const fresh = fs.readdirSync(BOXES).filter(f => /\.mjs$/.test(f) && !/\.test\./.test(f)).map(f => f.replace(/\.mjs$/, ''))
  .filter(n => candidates.some(c => c.boxName === n));
for (let round = 0; round < 8; round++) {
  const bad = [...freshViolators(fresh)].filter(n => fs.existsSync(path.join(BOXES, n + '.mjs')));
  if (!bad.length) break;
  for (const n of bad) { rmBox(n); needsJudgment.push(n); judged++; }
}
for (const n of fresh) if (fs.existsSync(path.join(BOXES, n + '.mjs'))) { green.push(n); landed++; }

console.log(`\n🏭 המנוע-המלא: ${processed} מועמדים · ${skipped} דולגו (זר/ללא-golden) · ✅ ${landed} קופסאות ירוקות נחתו · 🔍 ${judged} דורשות-הכרעה`);
if (green.length) console.log('  ✅ ירוקות: ' + green.join(', '));
if (needsJudgment.length) console.log('  🔍 דורשות-הכרעה (טוהר): ' + needsJudgment.slice(0, 30).join(', '));
