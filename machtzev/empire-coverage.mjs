#!/usr/bin/env node
/** 🗺️ מחצב · מד-שלמות מול האימפריה — כמה מיכולות-הלוגיקה של המקור כבר נחצבו למדף.
 *  לכל פונקציה-מיוצאת במקור: יש שם-תואם במדף? מסווג פערים ל:
 *    · אימפיורי-מתוכנן — רכיבי-React/‏store/ענן/DOM/hooks/‏.d.ts (הופכים לקופסה/שלד, לא אטום-טהור)
 *    · פער-לוגיקה-אמיתי — קבצי-lib/pure שעדיין לא נחצבו (מה שהמחולל לא יוכל להרכיב)
 *  פלט: machtzev/emit/EMPIRE-COVERAGE.md + סיכום. שקוף, חוזר, בר-מעקב. */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = new URL('../', import.meta.url).pathname;
// שלוש-מערכות-האימפריה: maor (TS) · buildsmart (Dart החי, app_flutter) · yoman (JS)
const SRC = {
  maor: { root: '/home/user/maor-system/src', kind: 'ts' },
  buildsmart: { root: '/home/user/buildsmart/app_flutter/lib', kind: 'dart' },
  yoman: { root: '/home/user/yoman-habina', kind: 'js' },
};

const walk = (d, out = []) => {
  if (!fs.existsSync(d)) return out;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};

// יכולות-לוגיקה של המקור: פונקציות-מיוצאות (TS/JS) או פונקציות-top-level (Dart)
// G62 · משפחת-gen-max #6 «חציבה-רחבה»: המכנה חייב לכלול גם את מה שאינו-מיוצא — עוזר-פרטי (‎_x‎ ב-Dart · function/const בלי export ב-TS)
//   הוא חומר-מדף (החצב חוצב ‎_firstOpen ⇒ firstOpen‎), ומתודות-מחלקה נספרות אך מחוץ-לתחום (מצב/UI). תת-ספירה = אזעקה.
//   (40,854 «חלקיקים» של gen-max נמדדו על 90,234 קבצים = כולל node_modules; כאן המכנה = מקור-האימפריה בלבד, מפורק לדליים.)
const empireFns = ({ root, kind }) => {
  const map = new Map(); const hidden = new Map(); let methods = 0;
  const ext = kind === 'dart' ? /\.dart$/ : /\.(ts|tsx|js|mjs)$/;
  const files = walk(root).filter(f => ext.test(f)
    && !/\.test\.|\.spec\.|_test\.|\.d\.ts$/.test(f)
    && !/\/genesis\/|\.g\.dart$|\.freezed\.dart$|node_modules|\/l10n\//.test(f));   // genesis=מוזרק · generated · i18n
  const base = root.replace(/\/(src|lib)$/, '/');
  if (kind === 'dart') {
    // Dart: פונקציית-top-level = טיפוס-החזרה + שם + ( ... ) בעמודה-0 (לא class/enum/if/for/return/קריאה)
    const reTop = /^(?!\s)(?:[A-Za-z_][\w<>,.\s?]*?\s+)([a-zA-Z_$][\w$]*)\s*(?:<[^(<>]*(?:<[^(<>]*>[^(<>]*)*>)?\s*\([^;{]*\)\s*(?:async\s*)?(?:\{|=>)/gm;
    const KW = new Set(['if', 'for', 'while', 'switch', 'return', 'class', 'enum', 'void', 'catch', 'assert']);
    for (const f of files) {
      const s = fs.readFileSync(f, 'utf8'); let m;
      const rel = f.replace(base, '');
      // מדלגים על פונקציות-פרטיות (‏_x = library-private ב-Dart) — עוזר-פנימי, לא יכולת-ציבורית
      while ((m = reTop.exec(s))) if (!KW.has(m[1]) && !map.has(m[1])) { if (/^_/.test(m[1])) { if (!hidden.has(m[1])) hidden.set(m[1], rel); } else map.set(m[1], rel); }
      methods += (s.match(/^  [A-Za-z_][\w<>,.? ]*\s+[a-z_]\w*\s*(?:<[^>]*>)?\([^;{]*\)\s*(?:async\s*)?(?:\{|=>)/gm) || []).length;
    }
  } else {
    const reFn = /export\s+(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)/g;
    const reConst = /export\s+const\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z_$][\w$]*)\s*(?::[^=]*)?=>/g;
    const reJsFn = /(?:^|\n)\s*(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)/g;   // yoman: JS לא-מודולרי (function גלובלי)
    for (const f of files) {
      const s = fs.readFileSync(f, 'utf8'); let m;
      const rel = f.replace(base, '');
      while ((m = reFn.exec(s))) if (!map.has(m[1])) map.set(m[1], rel);
      while ((m = reConst.exec(s))) if (!map.has(m[1])) map.set(m[1], rel);
      if (kind === 'js') while ((m = reJsFn.exec(s))) if (!map.has(m[1])) map.set(m[1], rel);
      if (kind === 'ts') {   // עוזרים-נסתרים: פונקציה/חץ בעמודה-0 בלי export
        for (const re of [/^(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)/gm, /^const\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*(?::[^=]*)?=>/gm]) while ((m = re.exec(s))) if (!map.has(m[1]) && !hidden.has(m[1])) hidden.set(m[1], rel);
        methods += (s.match(/^  (?:async |static |private |public )*[a-z]\w*\([^)]*\)\s*(?::\s*[^{]+)?\{/gm) || []).length;
      }
    }
  }
  map.hidden = hidden; map.methods = methods;
  return map;
};

// שמות-המדף: אטומי/קופסות-JS + ילידי-Dart
const shelfNames = () => {
  const s = new Set();
  for (const dir of ['new/atoms', 'new/boxes']) for (const f of walk(path.join(ROOT, dir))) {
    if (!/\.mjs$/.test(f) || /\.test\./.test(f)) continue;
    const t = fs.readFileSync(f, 'utf8'); let m;
    for (const re of [/export\s+(?:async\s+)?function\s+([a-zA-Z_$][\w$]*)/g, /export\s+const\s+([a-zA-Z_$][\w$]*)/g]) while ((m = re.exec(t))) s.add(m[1]);
    const c = /export\s*\{([^}]*)\}/g; while ((m = c.exec(t))) for (const n of m[1].split(',')) { const nm = n.trim().split(/\s+as\s+/)[0].trim(); if (nm) s.add(nm); }
  }
  // כל מדפי-ה-Dart (maor + כל ה-bs: dart-boxes/dart-*-bs/dart-screens/boards/gen/ui)
  for (const dir of fs.readdirSync(path.join(ROOT, 'new')).filter(d => /^dart/.test(d))) {
    const abs = path.join(ROOT, 'new', dir);
    if (!fs.statSync(abs).isDirectory()) continue;
    for (const f of walk(abs)) {
      if (!/\.dart$/.test(f) || /_test\./.test(f)) continue;
      const t = fs.readFileSync(f, 'utf8'); let m; const a = /^[A-Za-z_<>,\s?]+\s+([a-zA-Z_$][\w$]*)\s*(?:<[^(<>]*(?:<[^(<>]*>[^(<>]*)*>)?\s*\(/gm;
      while ((m = a.exec(t))) s.add(m[1]);
    }
  }
  return s;
};

// אימפיורי-מתוכנן: UI (רכיבים/מסכים/ווידג'טים) · glue של store/ענן/DOM/providers — קופסה/שלד, לא אטום
const impure = (f) => /\.tsx$/.test(f)
  || /\/store\/|\/state\/|\/screens\/|\/widgets\/|\/services\/|\/features\//.test(f)
  || /persist|cloudSync|cloud\.ts|firebase|pwa\.ts|a11yApply|\/hooks\/|main\.(tsx|dart)|App\.(tsx|dart)|_screen\.dart|_page\.dart|_widget\.dart|provider|notifier|controller/.test(f);

const shelf = shelfNames();
const lines = ['# 🗺️ מד-שלמות מול האימפריה — יכולות-לוגיקה שנחצבו למדף', ''];
let gTotal = 0, gCovered = 0, gReal = 0, gImpure = 0, gHidden = 0, gHiddenCovered = 0, gMethods = 0;
const realGaps = {};
for (const [sys, srcRoot] of Object.entries(SRC)) {
  const emp = empireFns(srcRoot);
  let covered = 0; const gaps = [];
  for (const [n, f] of emp) { if (shelf.has(n)) covered++; else gaps.push([n, f]); }
  const impureN = gaps.filter(([, f]) => impure(f)).length;
  const realN = gaps.length - impureN;
  gTotal += emp.size; gCovered += covered; gReal += realN; gImpure += impureN;
  const hid = emp.hidden, hidCov = [...hid.keys()].filter((n) => shelf.has(n) || shelf.has(n.replace(/^_/, ''))).length;   // ‎_x‎ שנחצב כ-x
  gHidden += hid.size; gHiddenCovered += hidCov; gMethods += emp.methods;
  const realByFile = {};
  for (const [n, f] of gaps) if (!impure(f)) (realByFile[f] = realByFile[f] || []).push(n);
  lines.push(`## ${sys}`, `- פונקציות-מקור: **${emp.size}** · נחצבו: **${covered}** (${Math.round(covered / emp.size * 100)}%)`,
    `- פערים: ${gaps.length} — אימפיורי-מתוכנן ${impureN} · **פער-לוגיקה-אמיתי ${realN}**`,
    `- כיסוי-לוגיקה-טהורה: **${Math.round(covered / (covered + realN) * 100)}%** (${covered}/${covered + realN})`,
    `- רוחב (G62): עוזרים-נסתרים (לא-מיוצאים/פרטיים) **${hid.size}** · מהם נחצבו ${hidCov} · מתודות-מחלקה (מחוץ-לתחום: מצב/UI) ${emp.methods}`, '',
    '### פערי-לוגיקה אמיתיים (קבצי-lib/pure, ממוין)', '');
  for (const [f, ns] of Object.entries(realByFile).sort((a, b) => b[1].length - a[1].length))
    lines.push(`- \`${f}\` (${ns.length}): ${ns.join(', ')}`);
  lines.push('');
}
// ── G62 · משפחת-gen-max #7 «מפקד-מקסימליות + פסק-כנות»: מה מהמדף **מחווט-בפועל** (נבחר ע"י בורר / נקרא מקופסה / הורכב-להתנהגות)
//   מול «נמשך-אך-לא-חוּוט» (pulled-not-wired) — פר-מנוע ופר-op. הרצפה-המצרפית כבר קיימת (truth.mjs · wiring-floor, רק-עולה);
//   כאן הפירוט. **נדחה אחרי מדידה:** «פער-מאמת» לפי מילות-שם (‎--maxall‎ של gen-max: שדה בגוף ⇔ מאמת בקטלוג שלא נקרא) —
//   נמדד על המדף: 342/957 מסומנים, דגימה = שווא (year⇒isHebLeapYear · photo⇒canAddPhoto); ובעיקר: שינוי-גוף-אטום סותר חוק-4
//   (verbatim). שדרוג = הרכבה בקופסה, לא נגיעה באטום. (יומן-gen-max עצמו: 16/17 «upgradeable» היו pulled-not-wired.)
const wiredSection = () => {
  const rj = (f) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'machtzev/generator', f), 'utf8')); } catch { return null; } };
  const lc = rj('logic-census.json') || [], ops = (rj('ops-map.json') || []).filter((a) => a.layer === 'logic');
  const opOf = new Map(ops.map((a) => [a.id, a.op]));
  const al = rj('auto-logic.json') || {}, bp = rj('behavior-plan.json') || {};
  const wired = new Map();   // name ⇒ מקור-החיווט
  for (const r of Object.values(al.ops || {})) if (r && r.pick) wired.set(r.pick, 'auto-logic');
  for (const r of Object.values(bp)) { if (!r) continue; if (r.pick) wired.set(r.pick, 'behavior'); for (const q of r.chain || []) if (q && q.id) wired.set(q.id, 'behavior'); }
  const boxDir = path.join(ROOT, 'new/dart-boxes');
  const boxFiles = new Set(fs.existsSync(boxDir) ? fs.readdirSync(boxDir).filter((f) => f.endsWith('.dart') && !f.endsWith('_test.dart')).flatMap((f) => [...fs.readFileSync(path.join(boxDir, f), 'utf8').matchAll(/\.\.\/(dart-maor|dart)\/([\w-]+)\.dart/g)].map((m) => m[1] + '/' + m[2] + '.dart')) : []);
  for (const e of lc) if (boxFiles.has(e.file) && !wired.has(e.name)) wired.set(e.name, 'box');
  const byOp = {};
  for (const e of lc) { const op = opOf.get(e.name) || '?'; const b = (byOp[op] ||= { n: 0, w: 0 }); b.n++; if (wired.has(e.name)) b.w++; }
  const W = [...lc].filter((e) => wired.has(e.name)).length;
  const src = {}; for (const v of wired.values()) src[v] = (src[v] || 0) + 1;
  const out = ['## מקסימליות · חיווט-בפועל (G62 · #7)', '',
    `- מנועים במדף (logic-census): **${lc.length}** · מחווטים-בפועל **${W}** (${Math.round(W / (lc.length || 1) * 100)}%) · **נמשכו-אך-לא-חוּוטו ${lc.length - W}** (pulled-not-wired)`,
    `- מקורות-החיווט: ${Object.entries(src).map(([k, v]) => k + ' ' + v).join(' · ')} · הרצפה-המצרפית: truth.mjs wiring-floor (רק-עולה)`,
    `- פסק-כנות: «מחווט» = נבחר-בפועל/נקרא-בפועל, לא «נגיש-לבורר». «פער-מאמת» לפי מילות-שם נדחה (342/957 שווא; חוק-4).`, '',
    '| op | מנועים | מחווטים | לא-מחווטים |', '|---|---|---|---|',
    ...Object.entries(byOp).sort((a, b) => b[1].n - a[1].n).map(([op, b]) => `| ${op} | ${b.n} | ${b.w} | ${b.n - b.w} |`), ''];
  return { lines: out, W, N: lc.length };
};
const ws = wiredSection(); lines.push(...ws.lines);
fs.mkdirSync(path.join(ROOT, 'machtzev/emit'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'machtzev/emit/EMPIRE-COVERAGE.md'), lines.join('\n') + '\n');
console.log(`🗺️ שלמות-אימפריה: מקור ${gTotal} · נחצבו ${gCovered} (${Math.round(gCovered / gTotal * 100)}%) · אימפיורי-מתוכנן ${gImpure} · פער-לוגיקה-אמיתי ${gReal}`);
console.log(`   רוחב (G62): עוזרים-נסתרים ${gHidden} (נחצבו ${gHiddenCovered}) · מתודות-מחלקה ${gMethods} (נספרות, מחוץ-לתחום) ⇒ מכנה-מלא ${gTotal + gHidden} + ${gMethods}`);
console.log(`   מקסימליות (G62): מנועים ${ws.N} · מחווטים-בפועל ${ws.W} · pulled-not-wired ${ws.N - ws.W}`);
console.log(`   כיסוי-לוגיקה-טהורה: ${Math.round(gCovered / (gCovered + gReal) * 100)}% (${gCovered}/${gCovered + gReal}) · הדוח: machtzev/emit/EMPIRE-COVERAGE.md`);
