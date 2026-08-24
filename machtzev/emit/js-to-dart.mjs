#!/usr/bin/env node
/** 🔤 מנוע-החלפת-שפה · JS → Dart (ניב-האטומים) — הכיוון הקשה (חסר-טיפוס → מטופס).
 *  פתרון: פולט טיפוס `dynamic` (מקבל-הכל, null-safe מובנה) ⇒ התנהגות נשמרת בדיוק,
 *  הטיפוסים המדויקים מתהדקים אחר-כך פר-אטום. הבטיחות: זהב (JS≡Dart) פר-אטום. */
export function emitToDart(src) {
  const strs = [];
  // הגן על מחרוזות (' " `) — כולל template
  src = src.replace(/`(?:\\.|[^`\\])*`|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"/g, (m) => `__S${strs.push(m) - 1}__`);
  // הגן על regex-literals /.../flags
  const rxs = [];
  src = src.replace(/\/(?:\\.|\[(?:\\.|[^\]])*\]|[^\/\\\n])+\/[gimsuy]*/g, (m) => `__RX${rxs.push(m) - 1}__`);

  // הכרזות-פונקציה
  src = src.replace(/export\s+function\s+(\w+)\s*\(([^)]*)\)/g, (m, n, p) => `dynamic ${n}(${dartParams(p)})`);
  // חץ: export const f = (a) => …  →  dynamic f(a) => …
  src = src.replace(/export\s+const\s+(\w+)\s*=\s*\(([^)]*)\)\s*=>/g, (m, n, p) => `dynamic ${n}(${dartParams(p)}) =>`);
  src = src.replace(/export\s+const\s+(\w+)\s*=\s*([^;=]+);/g, (m, n, v) => `final ${n} = ${v};`); // קבוע-נתונים

  // const/let → final/var ; === → == ; !== → !=
  src = src.replace(/\bconst\b/g, 'final').replace(/\blet\b/g, 'var');
  src = src.replace(/===/g, '==').replace(/!==/g, '!=');
  // Number.isFinite(x) → (x is num && x.isFinite) ; Math.* נשאר (dart:math יחווט בקופסה) — כאן שמור
  src = src.replace(/Number\.isFinite\(/g, '_isFinite(');
  src = src.replace(/\bnew Date\(\)/g, 'DateTime.now()');

  // ── טבלת-מיפוי stdlib JS→Dart (הכיוון הקשה — ספריות שונות) ──
  src = src.replace(/\bMath\.round\(/g, '_round(').replace(/\bMath\.floor\(/g, '_floor(')
           .replace(/\bMath\.abs\(/g, '_abs(').replace(/\bMath\.min\(/g, '_min(').replace(/\bMath\.max\(/g, '_max(')
           .replace(/\bMath\.pow\(/g, '_pow(').replace(/\bMath\.sqrt\(/g, '_sqrt(');
  src = src.replace(/\.includes\(/g, '.contains(').replace(/\.filter\(/g, '._where(')
           .replace(/\.slice\(/g, '._slice(').replace(/\.reduce\(/g, '._reduce(')
           .replace(/\.padStart\(/g, '._padStart(').replace(/\.padEnd\(/g, '._padEnd(');
  src = src.replace(/\.push\(/g, '.add(').replace(/\.unshift\(/g, '.insert(0, ')
           .replace(/\.some\(/g, '.any(').replace(/\.every\(/g, '.every(')
           .replace(/\.findIndex\(/g, '.indexWhere(').replace(/\.find\(/g, '.firstWhere(');
  // לולאת for-of: `for (final x of arr)` → `for (final x in arr)`
  src = src.replace(/for\s*\(\s*(?:final|var)\s+(\w+)\s+of\s+/g, 'for (final $1 in ');
  // `a || b` לברירת-מחדל → `a ?? b` (רק כשלא-בוליאני; היוריסטיקה: אחרי ) ] או מזהה)
  src = src.replace(/\|\|/g, '??JSOR??'); // סמן, יטופל בקופסה/ידנית לפי הקשר
  // שחזור regex: /pat/flags → RegExp(r'pat')
  src = src.replace(/__RX(\d+)__/g, (m, i) => { const r = rxs[+i]; const mm = r.match(/^\/([^]*)\/([gimsuy]*)$/); return `RegExp(r'${mm[1]}')`; });
  // שחזור מחרוזות: template `..${x}..` → '..${x}..' (Dart interpolation זהה!); ' " נשמר
  src = src.replace(/__S(\d+)__/g, (m, i) => { let s = strs[+i]; if (s[0] === '`') s = "'" + s.slice(1, -1).replace(/'/g, "\\'") + "'"; return s; });
  return src;
}
function dartParams(p) {
  if (!p.trim()) return '';
  return p.split(',').map(x => {
    x = x.trim(); const d = x.match(/^(\w+)\s*=\s*(.+)$/);
    return d ? `[dynamic ${d[1]} = ${d[2].replace(/new Date\(\)/, 'null')}]` : `dynamic ${x}`;
  }).join(', ');
}
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const code = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(l => !/^\s*(\/\*|\*|\/\/)/.test(l)).join('\n');
  console.log(emitToDart(code));
}
