#!/usr/bin/env node
/** 🧼 מחצב · מנוע-טיהור-Dart (מבצע-המאה, פאזות 2-3) — תאום-Dart מלוכלך מיושר לחתימת
 *  ה-JS-המטוהר: שקעי-ה-JS (שנקצרו מבדיקת-האטום — אמת-קרקע) מוצמדים לתאום-ה-Dart,
 *  הליטרלים-העבריים בגוף מוחלפים בהפניות-שקע לפי שוויון-ערכים, וקבוע-מודול-מראָה
 *  (const מקומי ששווה כולו לערך-שקע) נמחק ושמו מוסב לשם-השקע. הדאטה יורדת לאטום-דאטה
 *  ‏Dart (dart-data-maor/<base>-sockets.dart) והבדיקה מוזנת ממנו. ולידציה: הרצת הבדיקה
 *  החיה (dart run --enable-asserts); כשל ⇒ החזרה מלאה. דיווח-כן על כל דילוג.
 *
 *  שימוש: node machtzev/purify-dart.mjs [--dry] [--limit N] [--only <base>]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('..', import.meta.url).pathname;
const DM = path.join(ROOT, 'new/dart-maor');
const DD = path.join(ROOT, 'new/dart-data-maor');
const ATOMS = path.join(ROOT, 'new/atoms');
const DART = process.env.DART_BIN || '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/dart-sdk/bin/dart';
const DRY = process.argv.includes('--dry');
const LIMIT = (() => { const i = process.argv.indexOf('--limit'); return i > 0 ? parseInt(process.argv[i + 1]) : Infinity; })();
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? process.argv[i + 1] : null; })();
const HEB = /[֐-׿]/;
const ID = /^[A-Za-z_$][\w$]*$/;

// ── קריאת שקעי-ה-JS: שמות מהחתימה + ערכים מעטיפת-הבדיקה (אמת-קרקע) ──
function jsSockets(base) {
  const jp = path.join(ATOMS, base + '.mjs');
  const tp = path.join(ATOMS, base + '.test.mjs');
  if (!fs.existsSync(jp) || !fs.existsSync(tp)) return null;
  // הפשטת-הערות לפני ניתוח-חתימות: ')' בתוך הערת-פרמטר קוטעת את לכידת-הסוגריים
  const js = fs.readFileSync(jp, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"])\/\/[^\n]*/gm, '$1');
  const tt = fs.readFileSync(tp, 'utf8');
  const out = {};                                                   // fnName ⇒ [{name, value}]
  const decls = [
    ...js.matchAll(/export (?:async )?function (\w+)\s*\(([^)]*)\)/g),
    ...js.matchAll(/export const (\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/g),
  ];
  for (const m of decls) {
    const fn = m[1];
    // פיצול-פרמטרים מודע-עומק: {sockets מפורקים} / ברירות-מחדל אינם נשברים בפסיק פנימי
    const sig = (() => {
      const out = [];
      let d = 0, cur = '';
      for (const ch of m[2]) {
        if ('{[('.includes(ch)) d++;
        if ('}])'.includes(ch)) d--;
        if (ch === ',' && !d) { out.push(cur); cur = ''; continue; }
        cur += ch;
      }
      if (cur.trim()) out.push(cur);
      return out.map(x => x.trim().split('=')[0].trim()).filter(Boolean);
    })();
    // עטיפת-כריכה סטנדרטית, או קריאת-מפעל ישירה: __pure_fn(__d_a, __d_b)
    const wm = tt.match(new RegExp(`__pure_${fn}\\(\\.\\.\\.a,\\s*\\.\\.\\.Array\\(Math\\.max\\([^)]*\\)\\)\\.fill\\(undefined\\),\\s*([^)]+)\\)`))
      || tt.match(new RegExp(`__pure_${fn}\\(\\s*(__d_[\\w$]+(?:\\s*,\\s*__d_[\\w$]+)*)\\s*\\)`));
    if (!wm) continue;
    const socketNames = wm[1].split(',').map(x => x.trim());
    const vals = [];
    let ok = true;
    for (const nm of socketNames) {
      if (!ID.test(nm)) { ok = false; break; }
      const cm = tt.match(new RegExp(`const ${nm} = `));
      if (!cm) { ok = false; break; }
      let d = 0, j = cm.index + cm[0].length, q = null;
      const st = j;
      for (; j < tt.length; j++) {
        const ch = tt[j];
        if (q) { if (ch === '\\') j++; else if (ch === q) q = null; continue; }
        if (ch === "'" || ch === '"' || ch === '`') { q = ch; continue; }
        if ('([{'.includes(ch)) d++;
        else if (')]}'.includes(ch)) d--;
        else if (ch === ';' && d === 0) break;
      }
      try { vals.push(eval('(' + tt.slice(st, j) + ')')); } catch { ok = false; break; }
    }
    if (!ok || !vals.length) continue;
    const names = sig.slice(sig.length - vals.length);
    if (names.length !== vals.length || names.some(n => !ID.test(n))) continue;
    out[fn] = names.map((n, i) => ({ name: n, value: vals[i] }));
  }
  return Object.keys(out).length ? out : null;
}

// ── לקסר-מחרוזות-Dart: מיקומים + פירוק לסגמנטים (סטטי/אינטרפולציה) ──
function dartStrings(src) {
  const out = [];
  let i = 0, inLine = false, inBlock = false;
  while (i < src.length) {
    const ch = src[i];
    if (inLine) { if (ch === '\n') inLine = false; i++; continue; }
    if (inBlock) { if (ch === '*' && src[i + 1] === '/') { inBlock = false; i += 2; continue; } i++; continue; }
    if (ch === '/' && src[i + 1] === '/') { inLine = true; i += 2; continue; }
    if (ch === '/' && src[i + 1] === '*') { inBlock = true; i += 2; continue; }
    if (ch === "'" || ch === '"') {
      const raw = src[i - 1] === 'r';
      const q = ch;
      const start = raw ? i - 1 : i;
      let j = i + 1;
      const segs = [];
      let cur = '';
      for (; j < src.length; j++) {
        const c = src[j];
        if (c === '\n') break;                                      // מחרוזת-Dart חד-שורתית
        if (!raw && c === '\\') { cur += c + (src[j + 1] ?? ''); j++; continue; }
        if (c === q) break;
        if (!raw && c === '$') {
          if (src[j + 1] === '{') {
            let d = 1, k = j + 2;
            for (; k < src.length && d; k++) { if (src[k] === '{') d++; else if (src[k] === '}') d--; }
            if (cur) { segs.push({ type: 'txt', s: cur }); cur = ''; }
            segs.push({ type: 'interp', s: src.slice(j, k) });
            j = k - 1; continue;
          }
          const idm = src.slice(j + 1).match(/^[A-Za-z_]\w*/);
          if (idm) {
            if (cur) { segs.push({ type: 'txt', s: cur }); cur = ''; }
            segs.push({ type: 'interp', s: '$' + idm[0] });
            j += idm[0].length; continue;
          }
        }
        cur += c;
      }
      if (cur) segs.push({ type: 'txt', s: cur });
      out.push({ start, end: j + 1, quote: q, raw, segs, full: src.slice(start, j + 1) });
      i = j + 1; continue;
    }
    i++;
  }
  return out;
}
const unesc = (s) => s.replace(/\\(.)/g, (_, c) => c === 'n' ? '\n' : c === 't' ? '\t' : c === 'r' ? '\r' : c);
const dEsc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/\n/g, '\\n');

// ליטרל-Dart (רשימה/מפה/מחרוזת של פרימיטיבים) ⇒ ערך-JS; כשל ⇒ null
function parseDartLit(txt) {
  let t = txt.trim().replace(/^const\s+/, '').replace(/^<[^>]*>\s*/, '');
  t = t.replace(/,\s*([\]}])/g, '$1');                              // פסיק-זנב
  // המרת-גרשיים: '...' ⇒ "..." עם טיפול-בריחות
  let out = '', q = null;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q === "'") {
      if (c === '\\') { const n = t[i + 1]; out += n === "'" ? "'" : '\\' + n; i++; continue; }
      if (c === '"') { out += '\\"'; continue; }
      if (c === "'") { q = null; out += '"'; continue; }
      out += c; continue;
    }
    if (c === "'") { q = "'"; out += '"'; continue; }
    out += c;
  }
  try { return JSON.parse(out); } catch { return null; }
}
const deepEq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function valueIndex(sockets) {
  const idx = new Map();
  for (const { name, value } of sockets) {
    if (typeof value === 'string') idx.set(value, name);
    else if (Array.isArray(value)) {
      // רשימה מעורבת ⇒ List<dynamic> ⇒ cast-מפורש (strict-casts ב-CI אוסר dynamic⇒String שקט)
      const allStr = value.every(x => typeof x === 'string');
      value.forEach((v, i) => { if (typeof v === 'string' && !idx.has(v)) idx.set(v, allStr ? `${name}[${i}]` : `(${name}[${i}] as String)`); });
    } else if (value && typeof value === 'object') {
      const allStr = Object.values(value).every(x => typeof x === 'string');
      for (const [k, v] of Object.entries(value)) if (typeof v === 'string' && !idx.has(v)) idx.set(v, allStr ? `${name}['${k}']!` : `(${name}['${k}'] as String)`);
    }
  }
  return idx;
}
const dartType = (v) => {
  if (typeof v === 'string') return 'String';
  if (typeof v === 'number') return 'num';
  if (typeof v === 'boolean') return 'bool';
  if (Array.isArray(v)) {
    if (!v.length) return 'List<dynamic>';
    const ts = new Set(v.map(dartType));                            // רקורסיבי: רשימת-זוגות ⇒ List<List<String>>
    return ts.size === 1 ? `List<${[...ts][0]}>` : 'List<dynamic>';
  }
  const vs = Object.values(v || {});
  if (!vs.length) return 'Map<String, dynamic>';
  const ts = new Set(vs.map(dartType));
  return ts.size === 1 ? `Map<String, ${[...ts][0]}>` : 'Map<String, dynamic>';
};
const dartVal = (v) => v === null ? 'null'
  : typeof v === 'string' ? "'" + dEsc(v) + "'"
    : typeof v === 'number' || typeof v === 'boolean' ? String(v)
      : Array.isArray(v) ? '[' + v.map(dartVal).join(', ') + ']'
        : '{' + Object.entries(v).map(([k, x]) => "'" + dEsc(k) + "': " + dartVal(x)).join(', ') + '}';

function balance(s, start, open, close) {
  let d = 1, q = null;
  for (let j = start; j < s.length; j++) {
    const ch = s[j];
    if (q) { if (ch === '\n') { q = null; } else if (ch === '\\') j++; else if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"') { q = ch; continue; }
    if (ch === open) d++;
    else if (ch === close) { d--; if (!d) return j; }
  }
  return -1;
}

function splitTopArgs(s) {
  const out = []; let d = 0, q = null, cur = '';
  for (let j = 0; j < s.length; j++) {
    const ch = s[j];
    if (q) { cur += ch; if (ch === '\\') { cur += s[j + 1] ?? ''; j++; } else if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"') { q = ch; cur += ch; continue; }
    // '=>' איננו סוגר-גנרי: '>' נספר רק כשאינו חלק מחץ-למבדה (התו-הקודם '=')
    if ('([{'.includes(ch) || (ch === '<' && /[\w>]/.test(s[j - 1] ?? ''))) d++;
    if (')]}'.includes(ch) || (ch === '>' && s[j - 1] !== '=' && d > 0 && /[\w>?]/.test(s[j - 1] ?? ''))) d--;
    if (ch === ',' && d === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// שתילת-ארגומנטים בקריאות של callee בתוך txt: לפי insertPos (null=סוף)
function spliceCalls(txt, callee, args, insertPos) {
  let out = '', i = 0;
  const re = new RegExp(`(?<![\\w.])${callee}(?:<[\\w, ]+>)?\\(`, 'g');
  let m;
  while ((m = re.exec(txt))) {
    const open = m.index + m[0].length - 1;
    const close = balance(txt, open + 1, '(', ')');
    if (close < 0) break;
    const parts = splitTopArgs(txt.slice(open + 1, close));
    const pos = insertPos === null || insertPos > parts.length ? parts.length : insertPos;
    parts.splice(pos, 0, ...args);
    out += txt.slice(i, open + 1) + parts.join(', ');
    i = close;
    re.lastIndex = close;
  }
  return out + txt.slice(i);
}

// ── טיהור קובץ אחד ──
function purifyFile(base, report) {
  const dp = path.join(DM, base + '.dart');
  const tp = path.join(DM, base + '_test.dart');
  if (!fs.existsSync(dp)) return report.skip(base, 'אין-קובץ');
  const sockets = jsSockets(base);
  if (!sockets) return report.skip(base, 'אין-שקעי-JS (המקור לא-מטוהר/לא-נקצר)');
  let src = fs.readFileSync(dp, 'utf8');
  if (src.includes(String.fromCharCode(39,39,39)) || src.includes(String.fromCharCode(34,34,34))) return report.skip(base, 'triple-quote — מחוץ-ליכולת-הפרשן (v1)');
  const orig = src;
  const merged = [];
  { const seen = new Set(); for (const list of Object.values(sockets)) for (const s of list) if (!seen.has(s.name)) { seen.add(s.name); merged.push(s); } }

  // ── שלב א: קבועי-מודול-מראָה — const מקומי ששווה כולו לערך-שקע ⇒ נמחק ושמו מוסב ──
  for (const cm of [...src.matchAll(/(?:^|\n)const\s+(?:[\w<>, ?]+\s+)?(_?\w+)\s*=\s*/g)].reverse()) {
    const local = cm[1];
    const st = cm.index + cm[0].length;
    let d = 0, j = st, q = null;
    for (; j < src.length; j++) {
      const ch = src[j];
      if (q) { if (ch === '\\') j++; else if (ch === q) q = null; continue; }
      if (ch === "'" || ch === '"') { q = ch; continue; }
      if ('([{'.includes(ch)) d++;
      else if (')]}'.includes(ch)) d--;
      else if (ch === ';' && d === 0) break;
    }
    const litTxt = src.slice(st, j);
    if (!HEB.test(litTxt)) continue;
    const val = parseDartLit(litTxt);
    if (val === null) continue;
    const hit = merged.find(s => deepEq(s.value, val));
    if (!hit) continue;
    src = src.slice(0, cm.index) + src.slice(j + 1);                // מחיקת-ההצהרה
    src = src.replace(new RegExp(`(?<![\\w$])${local.replace(/\$/g, '\\$')}(?![\\w$])`, 'g'), hit.name);
  }

  // ── שלב ב: החלפת ליטרלים-עבריים בגוף ⇒ הפניות-שקע ──
  const idx = valueIndex(merged);
  const strs = dartStrings(src).filter(s => HEB.test(s.full));
  const leftovers = [];
  const edits = [];
  for (const st of strs) {
    // תבנית-RegExp = לוגיקת-ההתאמה עצמה (ב-JS ליטרל-regex פטור מטבעו) — לא מטרת-החלפה
    if (/RegExp\(\s*r?$/.test(src.slice(Math.max(0, st.start - 12), st.start))) continue;
    if (st.raw) {
      const whole = st.segs.map(x => x.s).join('');
      if (idx.has(whole)) edits.push({ start: st.start, end: st.end, txt: idx.get(whole) });
      else leftovers.push(whole);
      continue;
    }
    const plain = st.segs.every(x => x.type === 'txt');
    if (plain) {
      const whole = unesc(st.segs.map(x => x.s).join(''));
      if (idx.has(whole)) { edits.push({ start: st.start, end: st.end, txt: idx.get(whole) }); continue; }
      leftovers.push(whole);
      continue;
    }
    let ok = true;
    const parts = st.segs.map(x => {
      if (x.type === 'interp') return x.s;
      const val = unesc(x.s);
      if (!HEB.test(val)) return x.s;
      if (idx.has(val)) return '${' + idx.get(val) + '}';
      ok = false; return x.s;
    });
    if (ok) edits.push({ start: st.start, end: st.end, txt: st.quote + parts.join('') + st.quote });
    else leftovers.push(st.segs.filter(x => x.type === 'txt' && HEB.test(unesc(x.s)) && !idx.has(unesc(x.s))).map(x => x.s).join('·'));
  }
  if (leftovers.length) return report.skip(base, 'ליטרלים ללא-שקע: ' + [...new Set(leftovers)].slice(0, 3).map(s => JSON.stringify(s.slice(0, 25))).join(' '));
  edits.sort((a, b) => b.start - a.start);
  for (const e of edits) src = src.slice(0, e.start) + e.txt + src.slice(e.end);

  // ── שלב ב½: הצהרת-const שקיבלה הפניית-שקע איננה קבועת-קומפילציה עוד ──
  //   מקומית ⇒ final; מודולית ⇒ מהגרת לראש-גוף כל פונקציה-צורכת כ-final (נגזרת-שקעים דטרמיניסטית).
  {
    const sockRe = new RegExp(`(?<![\\w'$])(${merged.map(s => s.name).join('|')})(?![\\w'$])`);
    const isInsideFn = (pos) => {
      for (const m of src.matchAll(/(?:^|\n)(?:[A-Za-z_][\w<>,?\[\] ]*\s+)?[a-z_]\w*\s*\(/g)) {
        const open = m.index + m[0].length - 1;
        const close = balance(src, open + 1, '(', ')');
        if (close < 0) continue;
        const bm = src.slice(close + 1, close + 30).match(/\{/);
        if (!bm) continue;
        const bs = close + 1 + src.slice(close + 1).indexOf('{');
        const be = balance(src, bs + 1, '{', '}');
        if (be > 0 && pos > bs && pos < be) return true;
      }
      return false;
    };
    for (const cm of [...src.matchAll(/(?:^|\n)(\s*)const\s+(?:[\w<>, ?]+\s+)?(_?\w+)\s*=\s*/g)].reverse()) {
      const declStart = cm.index + (cm[0].startsWith('\n') ? 1 : 0);
      const local = cm[2];
      let d = 0, j = cm.index + cm[0].length, q = null;
      for (; j < src.length; j++) {
        const ch = src[j];
        if (q) { if (ch === '\\') j++; else if (ch === q) q = null; continue; }
        if (ch === "'" || ch === '"') { q = ch; continue; }
        if ('([{'.includes(ch)) d++;
        else if (')]}'.includes(ch)) d--;
        else if (ch === ';' && d === 0) break;
      }
      const declTxt = src.slice(declStart, j + 1);
      if (!sockRe.test(declTxt)) continue;
      if (isInsideFn(declStart)) {
        src = src.slice(0, declStart) + declTxt.replace(/\bconst\b/, 'final') + src.slice(j + 1);
      } else {
        // מודולית: מחיקה + הזרעה כ-final בראש-גוף כל פונקציה שמשתמשת בשם
        src = src.slice(0, declStart) + src.slice(j + 1);
        const finalDecl = declTxt.trim().replace(/\bconst\b/, 'final');
        const users = [];
        for (const fm of src.matchAll(/(?:^|\n)(?:[A-Za-z_][\w<>,?\[\] ]*\s+)?([a-z_]\w*)\s*\(/g)) {
          const open = fm.index + fm[0].length - 1;
          const close = balance(src, open + 1, '(', ')');
          if (close < 0 || !/^\s*\{/.test(src.slice(close + 1, close + 20))) continue;
          const bs = close + 1 + src.slice(close + 1).indexOf('{');
          const be = balance(src, bs + 1, '{', '}');
          if (be < 0) continue;
          if (new RegExp(`(?<![\\w$])${local.replace(/\$/g, '\\$')}(?![\\w$])`).test(src.slice(bs, be + 1))) users.push(bs);
        }
        for (const bs of users.sort((a, b) => b - a))
          src = src.slice(0, bs + 1) + '\n  ' + finalDecl + src.slice(bs + 1);
      }
    }
  }
  const needed = merged.filter(s => new RegExp(`(?<![\\w'$])${s.name}(?![\\w'$])`).test(src));
  if (!needed.length) return report.skip(base, 'אחרי-החלפה אף שקע לא בשימוש (חריג)');

  // ── שלב ג: השחלת-פרמטרים בגרף-הקריאות ──
  const fnSigs = [...src.matchAll(/(?:^|\n)(?:[A-Za-z_][\w<>,?\[\] ]*\s+)?([a-z_]\w*)\s*(?:<[\w, ]+>)?\s*\(/g)]
    .map(m => ({ name: m[1], open: m.index + m[0].length - 1 }))
    .filter(f => !['if', 'for', 'while', 'switch', 'return', 'assert', 'catch'].includes(f.name));
  const fnInfo = new Map();
  for (const f of fnSigs) {
    const close = balance(src, f.open + 1, '(', ')');
    if (close < 0) continue;
    const after = src.slice(close + 1, close + 30);
    if (!/^\s*(=>|\{|async)/.test(after)) continue;                 // רק הגדרות (לא קריאות)
    let be;
    const bm = src.slice(close + 1).match(/[{]|=>/);
    if (!bm) continue;
    const bs = close + 1 + bm.index;
    if (src[bs] === '{') be = balance(src, bs + 1, '{', '}');
    else be = src.indexOf(';', bs);
    if (be < 0) continue;
    const sigTxt = src.slice(f.open, close + 1);
    fnInfo.set(f.name, { open: f.open, close, bs, be, named: /\{[^}]*$/.test(sigTxt.slice(0, -1)) || /\{\s*(required|[A-Z])/.test(sigTxt) });
  }
  const usesSock = (fn) => {
    const r = fnInfo.get(fn);
    if (!r) return [];
    const body = src.slice(r.bs, r.be + 1);
    return needed.filter(s => new RegExp(`(?<![\\w'$])${s.name}(?![\\w'$])`).test(body)).map(s => s.name);
  };
  const needMap = new Map([...fnInfo.keys()].map(fn => [fn, new Set(usesSock(fn))]));
  let changed = true;
  while (changed) {
    changed = false;
    for (const [fn, r] of fnInfo) {
      const body = src.slice(r.bs, r.be + 1);
      for (const [callee, cset] of needMap) {
        if (callee === fn || !cset.size) continue;
        if (new RegExp(`(?<![\\w.])${callee}\\(`).test(body))
          for (const s of cset) if (!needMap.get(fn).has(s)) { needMap.get(fn).add(s); changed = true; }
      }
    }
  }
  const feedStyle = new Map();                                      // fn ⇒ 'named'|'pos'
  const insertAt = new Map();                                       // fn ⇒ אינדקס-שתילה בקריאות (לפני האופציונליים) או null=סוף
  for (const [fn, r] of fnInfo) {
    feedStyle.set(fn, r.named ? 'named' : 'pos');
    const sigInner = src.slice(r.open + 1, r.close);
    let depth = 0, brk = -1;
    for (let k = 0; k < sigInner.length; k++) {
      const c = sigInner[k];
      if ('({<'.includes(c)) depth++;
      else if (')}>'.includes(c)) depth--;
      else if ((c === '[' || c === '{') && depth === 0) { brk = k; break; }
    }
    if (!r.named && brk >= 0) {
      const head = sigInner.slice(0, brk).replace(/[,\s]+$/, '');
      insertAt.set(fn, head ? splitTopArgs(head).length : 0);
    } else insertAt.set(fn, null);
  }
  const socksOf = (fn) => merged.filter(s => needMap.get(fn)?.has(s.name));
  // מצב-השלמה: שקע שכבר בחתימה איננו נוסף/מוזן שוב — מחושב פעם-אחת לפני ההזנות
  const addedPerFn = new Map();
  for (const [fn, r] of fnInfo) {
    const sigTxt = src.slice(r.open, r.close + 1);
    addedPerFn.set(fn, new Set(socksOf(fn).filter(s2 => !new RegExp('[\\s(,]' + s2.name + '\\s*[,)\\]}]').test(sigTxt)).map(s2 => s2.name)));
  }
  // הזנת קריאות-פנימיות (מהסוף להתחלה כדי לא להזיז מיקומים מוקדמים)
  if (process.env.PDBG) { console.log('PDBG needMap:', JSON.stringify([...needMap].map(([k,v])=>[k,[...v]]))); console.log('PDBG added:', JSON.stringify([...addedPerFn].map(([k,v])=>[k,[...v]]))); }
  const feedCall = (txt, callee) => {
    const socks = socksOf(callee).filter(s2 => addedPerFn.get(callee)?.has(s2.name) ?? true);
    if (!socks.length) return txt;
    const args = socks.map(s => feedStyle.get(callee) === 'named' ? `${s.name}: ${s.name}` : s.name);
    return spliceCalls(txt, callee, args, insertAt.get(callee) ?? null);
  };
  // סדר: קודם עריכת-גופים (הזנות), אחר-כך חתימות — עובדים על עותק מחדש עם ריצוד-מיקומים? פשוט: טקסטואלית גלובלית
  for (const [callee] of [...needMap].filter(([, s]) => s.size)) {
    // הזנה בכל הקובץ מלבד שורת-ההגדרה של callee עצמו: מפצלים לפי ההגדרה
    const r = fnInfo.get(callee);
    const defStart = r.open - (callee.length);
    const before = src.slice(0, defStart);
    const defAndAfter = src.slice(defStart);
    const defLine = defAndAfter.slice(0, callee.length + 1);        // 'name('
    const rest = defAndAfter.slice(callee.length + 1);
    src = feedCall(before, callee) + defLine + feedCall(rest, callee);
    // מיקומים השתנו ⇒ ריענון fnInfo
    refreshFns();
  }
  function refreshFns() {
    fnInfo.clear();
    for (const m of src.matchAll(/(?:^|\n)(?:[A-Za-z_][\w<>,?\[\] ]*\s+)?([a-z_]\w*)\s*(?:<[\w, ]+>)?\s*\(/g)) {
      const name = m[1];
      if (['if', 'for', 'while', 'switch', 'return', 'assert', 'catch'].includes(name)) continue;
      const open = m.index + m[0].length - 1;
      const close = balance(src, open + 1, '(', ')');
      if (close < 0) continue;
      if (!/^\s*(=>|\{|async)/.test(src.slice(close + 1, close + 30))) continue;
      const sigTxt = src.slice(open, close + 1);
      if (!fnInfo.has(name)) fnInfo.set(name, { open, close, named: /\{\s*(required|[A-Z_])/.test(sigTxt) });
    }
  }
  refreshFns();
  // הרחבת-חתימות (מהסוף להתחלה)
  for (const [fn, r] of [...fnInfo.entries()].sort((a, b) => b[1].open - a[1].open)) {
    const socks = socksOf(fn).filter(s2 => addedPerFn.get(fn)?.has(s2.name));
    if (!socks.length) continue;
    const sigTxt = src.slice(r.open, r.close + 1);
    if (r.named) {
      const braceClose = sigTxt.lastIndexOf('}');
      if (braceClose < 0) return report.skip(base, `חתימת-${fn}: named בלי '}'`);
      const abs = r.open + braceClose;
      const beforeBrace = src.slice(0, abs).replace(/[,\s]+$/, '');
      const ins = socks.map(s => `required ${dartType(s.value)} ${s.name}`).join(', ');
      src = beforeBrace + ', ' + ins + src.slice(abs);
    } else {
      const inner = sigTxt.slice(1, -1);
      const ins = socks.map(s => `${dartType(s.value)} ${s.name}`).join(', ');
      // בלוק אופציונלי-פוזיציונלי '[...]' ברמת-החתימה ⇒ הנדרשים נכנסים לפניו
      let depth = 0, brk = -1;
      for (let k = 0; k < inner.length; k++) {
        const c = inner[k];
        if ('({<'.includes(c)) depth++;
        else if (')}>'.includes(c)) depth--;
        else if (c === '[' && depth === 0) { brk = k; break; }
        else if (c === ']' && depth === 0) break;
      }
      let body;
      if (brk >= 0) {
        const head = inner.slice(0, brk).replace(/[,\s]+$/, '');
        body = (head ? head + ', ' : '') + ins + ', ' + inner.slice(brk);
      } else {
        const t2 = inner.trim();
        body = t2 ? t2.replace(/,\s*$/, '') + ', ' + ins : ins;
      }
      src = src.slice(0, r.open) + '(' + body + ')' + src.slice(r.close + 1);
    }
    refreshFns();
  }

  // ── שלב ד: אטום-דאטה + עדכון-בדיקה ──
  const alias = 'sk_' + base.replace(/-/g, '_');
  const camel = base.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  const dataFile = path.join(DD, base + '-sockets.dart');
  const dataSrc = `// 📚 אטום-דאטה · שקעי-${base} — חולץ ע"י purify-dart (מבצע-המאה) מאמת-הקרקע של בדיקת-ה-JS.\n// מהות-המוצא: ערכי-השקעים של ${camel} — זהים ביט-לביט לצד-ה-JS (new/atoms/${base}.test.mjs).\nconst _x = 0; // עוגן-קובץ\n${merged.map(s => `const ${dartType(s.value)} ${camel}_${s.name} = ${dartVal(s.value)};`).join('\n')}\n`.replace('const _x = 0; // עוגן-קובץ\n', '');

  let test = fs.existsSync(tp) ? fs.readFileSync(tp, 'utf8') : null;
  const origTest = test;
  if (test) {
    if (!test.includes(`${base}-sockets.dart`))
      test = `import '../dart-data-maor/${base}-sockets.dart' as ${alias};\n` + test;
    for (const [fn, nset] of needMap) {
      if (!nset.size) continue;
      const socks = merged.filter(s => nset.has(s.name) && (addedPerFn.get(fn)?.has(s.name) ?? true));
      if (!socks.length) continue;
      const args = socks.map(s => feedStyle.get(fn) === 'named' ? `${s.name}: ${alias}.${camel}_${s.name}` : `${alias}.${camel}_${s.name}`);
      test = spliceCalls(test, fn, args, insertAt.get(fn) ?? null);
    }
  }

  if (DRY) return report.ok(base, `[dry] שקעים: ${needed.map(s => s.name).join(',')} · החלפות: ${edits.length}`);

  const origData = fs.existsSync(dataFile) ? fs.readFileSync(dataFile, 'utf8') : null;
  fs.writeFileSync(dp, src);
  fs.writeFileSync(dataFile, dataSrc);
  if (test) fs.writeFileSync(tp, test);
  try {
    if (fs.existsSync(tp)) execFileSync(DART, ['run', '--enable-asserts', tp], { cwd: DM, stdio: 'pipe', timeout: 60000 });
    else execFileSync(DART, ['format', '-o', 'none', dp], { stdio: 'pipe', timeout: 30000 });
    return report.ok(base, `שקעים: ${needed.map(s => s.name).join(',')} · החלפות: ${edits.length}` + (fs.existsSync(tp) ? ' · בדיקה-ירוקה' : ' · אין-בדיקה (parse בלבד)'));
  } catch (e) {
    fs.writeFileSync(dp, orig);
    if (origTest !== null) fs.writeFileSync(tp, origTest);
    if (origData !== null) fs.writeFileSync(dataFile, origData);
    else if (fs.existsSync(dataFile)) fs.rmSync(dataFile);
    return report.skip(base, 'ולידציה-נכשלה ⇒ הוחזר: ' + String(e.stderr || e.message).slice(0, 140).replace(/\n/g, ' '));
  }
}

// ── ריצה ──
const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, 'machtzev/data-purity-baseline.json'), 'utf8'));
const targets = baseline.filter(e => e.startsWith('dart-maor/')).map(e => e.slice('dart-maor/'.length))
  .filter(b => {
    const fp = path.join(DM, b + '.dart');
    if (!fs.existsSync(fp)) return false;
    // עברית-במחרוזות בלבד (הלקסר) — קובץ שעברי רק בהערותיו איננו מטרה
    return dartStrings(fs.readFileSync(fp, 'utf8')).some(st => HEB.test(st.full));
  })
  .filter(b => !ONLY || b === ONLY);
let ok = 0, skip = 0;
const report = {
  ok: (b, msg) => { ok++; console.log(`✅ ${b} — ${msg}`); },
  skip: (b, msg) => { skip++; console.log(`🫱 ${b} — ${msg}`); },
};
for (const b of targets.slice(0, LIMIT)) purifyFile(b, report);
console.log(`\n🧼 purify-dart: ${ok} טוהרו · ${skip} דולגו (מתוך ${Math.min(targets.length, LIMIT)})`);
