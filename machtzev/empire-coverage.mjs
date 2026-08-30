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
const empireFns = ({ root, kind }) => {
  const map = new Map();
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
      while ((m = reTop.exec(s))) if (!KW.has(m[1]) && !/^_/.test(m[1]) && !map.has(m[1])) map.set(m[1], rel);
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
    }
  }
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
let gTotal = 0, gCovered = 0, gReal = 0, gImpure = 0;
const realGaps = {};
for (const [sys, srcRoot] of Object.entries(SRC)) {
  const emp = empireFns(srcRoot);
  let covered = 0; const gaps = [];
  for (const [n, f] of emp) { if (shelf.has(n)) covered++; else gaps.push([n, f]); }
  const impureN = gaps.filter(([, f]) => impure(f)).length;
  const realN = gaps.length - impureN;
  gTotal += emp.size; gCovered += covered; gReal += realN; gImpure += impureN;
  const realByFile = {};
  for (const [n, f] of gaps) if (!impure(f)) (realByFile[f] = realByFile[f] || []).push(n);
  lines.push(`## ${sys}`, `- פונקציות-מקור: **${emp.size}** · נחצבו: **${covered}** (${Math.round(covered / emp.size * 100)}%)`,
    `- פערים: ${gaps.length} — אימפיורי-מתוכנן ${impureN} · **פער-לוגיקה-אמיתי ${realN}**`,
    `- כיסוי-לוגיקה-טהורה: **${Math.round(covered / (covered + realN) * 100)}%** (${covered}/${covered + realN})`, '',
    '### פערי-לוגיקה אמיתיים (קבצי-lib/pure, ממוין)', '');
  for (const [f, ns] of Object.entries(realByFile).sort((a, b) => b[1].length - a[1].length))
    lines.push(`- \`${f}\` (${ns.length}): ${ns.join(', ')}`);
  lines.push('');
}
fs.mkdirSync(path.join(ROOT, 'machtzev/emit'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'machtzev/emit/EMPIRE-COVERAGE.md'), lines.join('\n') + '\n');
console.log(`🗺️ שלמות-אימפריה: מקור ${gTotal} · נחצבו ${gCovered} (${Math.round(gCovered / gTotal * 100)}%) · אימפיורי-מתוכנן ${gImpure} · פער-לוגיקה-אמיתי ${gReal}`);
console.log(`   כיסוי-לוגיקה-טהורה: ${Math.round(gCovered / (gCovered + gReal) * 100)}% (${gCovered}/${gCovered + gReal}) · הדוח: machtzev/emit/EMPIRE-COVERAGE.md`);
