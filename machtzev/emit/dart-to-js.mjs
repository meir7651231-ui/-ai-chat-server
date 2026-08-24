#!/usr/bin/env node
/** 🔤 מנוע-פליטה · Dart → JS (prototype, ניב-האטומים) — לא מהדר-כללי, אלא תמורות
 *  לניב הצר שאטומים טהורים משתמשים בו. הבטיחות: רתמת-הזהב (הרצה-כפולה) מאמתת כל
 *  פליטה; מה שלא עובר — אזעקה לטיפול-יד. */

/** תמורת גוף-קוד Dart→JS. שומר מחרוזות (' " r'') מנזק. */
/** מסיר טיפוסים מרשימת-פרמטרים פוזיציוניים; שומר {בעלי-שם} להרס בשלב 3. */
function stripParams(params) {
  // פצל על פסיקים ברמה-העליונה (מחוץ ל-{} ו-<>)
  let depth = 0, cur = '', parts = [];
  for (const ch of params) {
    if (ch === '{' || ch === '<' || ch === '(') depth++;
    if (ch === '}' || ch === '>' || ch === ')') depth--;
    if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
  }
  if (cur.trim()) parts.push(cur);
  return parts.map(p => {
    p = p.trim();
    if (p.startsWith('{')) return p; // בעלי-שם — שלב 3 יהרוס
    // פוזיציוני: "double? x" → "x" · "P p" → "p"
    const m = p.match(/([a-z_]\w*)\s*$/);
    return m ? m[1] : p;
  }).join(', ');
}

export function emitBody(src) {
  // 0) RegExp(r'PATTERN')  → /PATTERN/  (regex-literal — raw-string ממופה מדויק)
  src = src.replace(/RegExp\(\s*r(['"])((?:\\.|(?!\1).)*)\1\s*\)/g, (m, q, pat) => `/${pat}/`);
  // 1) הגן על מחרוזות רגילות (אחרי שה-regex כבר literal)
  const strs = [];
  src = src.replace(/(['"])(?:\\.|(?!\1).)*\1/g, (m) => `__STR${strs.push(m) - 1}__`);

  // 2) הסר טיפוסי-החזרה + גנריקה על הכרזת-פונקציה: `double? minBoreOf<P,E>(` → `function minBoreOf(`
  //    (top-level: <type>? <name><generics>( … )  או  <type> <name>( … ) )
  // כל פונקציה top-level/עוזרת: `Type[?] name<G>(params) {`  או  `... => expr;`
  src = src.replace(/^(\s*)[A-Za-z_][\w<>?,\s]*?\b(_?[a-z]\w*)\s*(?:<[^>(]*>)?\s*\(([^]*?)\)\s*=>\s*([^]*?);/gm,
    (m, ind, name, params, expr) => `${ind}function ${name}(${stripParams(params)}) { return ${expr}; }`);
  src = src.replace(/^(\s*)[A-Za-z_][\w<>?,\s]*?\b(_?[a-z]\w*)\s*(?:<[^>(]*>)?\s*\(([^]*?)\)\s*\{/gm,
    (m, ind, name, params) => `${ind}function ${name}(${stripParams(params)}) {`);

  // 3) פרמטרים בעלי-שם {required T f(P) x, ...} → אובייקט-הרס { x, ... }
  src = src.replace(/\{\s*((?:required[^}]*?))\}(\s*\)?\s*(?:=>|\{))/s, (m, inner, tail) => {
    const names = [...inner.matchAll(/(\w+)\s*(?:,|$)/g)].map(x => x[1]).filter(n => n !== 'required' && n !== 'Function');
    // חלץ שמות-פרמטר: המילה שלפני פסיק/סוף, שאינה טיפוס
    const nm = [...inner.split(',')].map(x => (x.trim().match(/([a-z_]\w*)\s*$/)||[])[1]).filter(Boolean);
    return `{ ${[...new Set(nm)].join(', ')} }${tail}`;
  });

  // 4) טיפוסים בהכרזות-משתנה מקומיות: `final ends = …` → `const ends = …`; `double? min;` → `let min;`
  src = src.replace(/\bfinal\s+/g, 'const ');
  // הכרזה בלי-אתחול: `double? min;` → `let min;`. לא-לגעת ב-return/break/continue/throw ואטומי-מילה-יחידה.
  src = src.replace(/^(\s*)(?!return|break|continue|throw|yield)[A-Za-z_][\w<>?,]*\??\s+([a-z_]\w*)\s*;/gm, '$1let $2;');

  // 5) טיפוס לפני משתנה-לולאה: `for (const e in ends)` תקין; `for (final e in …)` כבר הומר
  src = src.replace(/\bfor\s*\(\s*const\s+(\w+)\s+in\s+/g, 'for (const $1 of ');

  // 6) מתודות-סטנדרט: hasMatch→test
  src = src.replace(/\.hasMatch\(/g, '.test(');

  // 7) שחזר מחרוזות; raw-string r'...' → '...' (JS regex-literal מקבל אותו תוכן)
  src = src.replace(/__STR(\d+)__/g, (m, i) => {
    let s = strs[+i];
    if (s[0] === 'r') s = s.slice(1); // הסר קידומת-raw
    return s;
  });

  // מתודות-num: x.abs() → Math.abs(x) · x.toDouble()/toInt() → x/Math.trunc
  src = src.replace(/([a-zA-Z_]\w*(?:\([^()]*\))?)\.abs\(\)/g, 'Math.abs($1)');
  src = src.replace(/\.toDouble\(\)/g, '').replace(/\.toInt\(\)/g, '|0');
  // אופרטור-טיפוס `x is T` → בדיקה גסה (String/num/List/Map/bool); שאר → true (זהב יתפוס)
  src = src.replace(/(\w+)\s+is\s+String\b/g, "typeof $1 === 'string'");
  src = src.replace(/(\w+)\s+is\s+(num|int|double)\b/g, "typeof $1 === 'number'");
  src = src.replace(/(\w+)\s+is\s+bool\b/g, "typeof $1 === 'boolean'");
  src = src.replace(/(\w+)\s+is\s+List\b/g, 'Array.isArray($1)');
  // תכונות-Dart → JS
  src = src.replace(/\.isEmpty\b/g, '.length === 0').replace(/\.isNotEmpty\b/g, '.length > 0');
  src = src.replace(/([a-zA-Z_]\w*)\.isFinite\b/g, 'Number.isFinite($1)');
  src = src.replace(/\bprint\(/g, 'console.log(');
  // ארגומנטים-בעלי-שם בקריאה: foo(pos, name: v, ...) → foo(pos, { name: v, ... })
  src = src.replace(/([a-z_]\w*)\(([^()]*\b[a-z_]\w*\s*:[^()]*)\)/g, (m, fn, args) => {
    if (!/\b[a-z_]\w*\s*:/.test(args)) return m;
    const parts = []; let d = 0, cur = '';
    for (const ch of args) { if ('([{'.includes(ch)) d++; if (')]}'.includes(ch)) d--; if (ch === ',' && d === 0) { parts.push(cur); cur = ''; } else cur += ch; }
    if (cur.trim()) parts.push(cur);
    const pos = [], named = [];
    for (const pt of parts) { const mm = pt.match(/^\s*([a-z_]\w*)\s*:\s*([^]*)$/); if (mm) named.push(`${mm[1]}: ${mm[2].trim()}`); else pos.push(pt.trim()); }
    return `${fn}(${[...pos, named.length ? `{ ${named.join(', ')} }` : ''].filter(Boolean).join(', ')})`;
  });
  // replaceAll עם regex-literal → replace עם דגל-g (JS: replaceAll דורש דגל-g או מחרוזת)
  src = src.replace(/\.replaceAll\(\s*(\/(?:\\.|[^\/])+\/)([gimsuy]*)/g,
    (m, re, fl) => `.replace(${re}${fl.includes('g') ? fl : fl + 'g'}`);
  return src;
}

// CLI: node dart-to-js.mjs <file.dart>  ⇒ מדפיס JS
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const f = process.argv[2];
  const raw = fs.readFileSync(f, 'utf8');
  // הסר הערות-כותרת (//), השאר קוד
  const code = raw.split('\n').filter(l => !/^\s*\/\/\/?/.test(l)).join('\n');
  console.log(emitBody(code));
}
