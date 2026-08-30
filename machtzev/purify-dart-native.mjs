#!/usr/bin/env node
/** 🧼 מחצב · מנוע-טיהור ילידי-Dart (מבצע-המאה, "עד מאה אחוז") — מילוני-סיווג שהוטבעו
 *  באטומי new/dart (בנייה-חכמה) יוצאים לאטום-דאטה ומוזרקים כשקעים-שמיים (דפוס chip-vocab):
 *   1. כל הצהרת-מודול const/final שהאתחול שלה מכיל עברית-במחרוזת (מחוץ ל-RegExp)
 *      מועתקת verbatim ל-new/dart-data/<base>-data.dart (שם פרטי _x ⇒ ציבורי x).
 *   2. באטום: ההצהרה נמחקת; כל פונקציית-top-level שמשתמשת בשם מקבלת פרמטר-שמי
 *      {required <Type> <שם>}; קריאות-פנימיות מושחלות (גרף-קריאות).
 *   3. הבדיקה מוזנת name: td.<שם> (ייבוא אטום-הדאטה).
 *   4. ולידציה: הבדיקה ירוקה ⇒ נשמר; אחרת ⇒ החזרה מלאה. קבצים בלי-בדיקה מדולגים בכנות.
 *  שימוש: node machtzev/purify-dart-native.mjs [--only <base>] [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('..', import.meta.url).pathname;
const DDIR = path.join(ROOT, 'new/dart');
const DATA = path.join(ROOT, 'new/dart-data');
const DART = process.env.DART_BIN || '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/dart-sdk/bin/dart';
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? process.argv[i + 1] : null; })();
const DRY = process.argv.includes('--dry');
const HEB = /[֐-׿]/;

const balance = (s, i, open, close) => {
  let d = 1, q = null;
  for (let j = i; j < s.length; j++) {
    const ch = s[j];
    if (q) { if (ch === '\n' && q !== '`') q = null; else if (ch === '\\') j++; else if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"') { q = ch; continue; }
    if (ch === open) d++;
    else if (ch === close) { d--; if (!d) return j; }
  }
  return -1;
};

// עברית-במחרוזת מחוץ ל-RegExp (לקסר קל: הערות מנוקות מראש)
function hebOutsideRegexp(code) {
  const c = code.replace(/RegExp\(\s*r?('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, "RegExp('");
  for (const m of c.matchAll(/['"]([^'"\\\n]{0,200})['"]/g)) if (HEB.test(m[1])) return true;
  return false;
}
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/\/?.*$/gm, '').replace(/(^|[^:'"])\/\/[^\n]*/gm, '$1');

function repair(base, report) {
  const fp = path.join(DDIR, base + '.dart');
  const tp = path.join(DDIR, base + '_test.dart');
  const orig = fs.readFileSync(fp, 'utf8');
  if (!fs.existsSync(tp)) return report(base, 'skip', 'אין-בדיקה — לא נוגעים בלי הוכחה');
  const origTest = fs.readFileSync(tp, 'utf8');
  let src = orig;

  // ── 1. איסוף הצהרות-מודול עם עברית ──
  // הצהרה = בתחילת-שורה (לא-מוזחת): const/final [Type] name = ... ;
  const decls = [];
  const re = /(?:^|\n)((?:const|final)\s+(?:[\w<>,()?\[\] ]+?\s+)?([\w$]+)\s*=\s*)/g;
  let m;
  while ((m = re.exec(src))) {
    const head = m[1];
    if (/\n\s/.test('\n' + src.slice(m.index === 0 ? 0 : m.index + 1, m.index + 2))) { /* col-0 check below */ }
    const lineStart = m.index === 0 ? 0 : m.index + 1;
    if (src[lineStart] === ' ' || src[lineStart] === '\t') continue;      // רק רמת-מודול
    const vStart = m.index + m[0].length;
    // אתחול עד ';' ברמה-0
    let j = vStart, d = 0, q = null;
    for (; j < src.length; j++) {
      const ch = src[j];
      if (q) { if (ch === '\n' && q !== "'''") q = null; else if (ch === '\\') j++; else if (ch === q) q = null; continue; }
      if (ch === "'" || ch === '"') { q = ch; continue; }
      if ('([{<'.includes(ch) && ch !== '<') d++;
      if ('([{'.includes(ch)) { } // spacer
      if (ch === '(' || ch === '[' || ch === '{') { } // counted above once
      if (ch === ')' || ch === ']' || ch === '}') d--;
      if (ch === ';' && d <= 0) break;
    }
    if (j >= src.length) continue;
    const init = src.slice(vStart, j);
    const whole = src.slice(lineStart, j + 1);
    if (!hebOutsideRegexp(stripComments(init))) continue;
    // טיפוס מוצהר (בין const/final לשם) — לפרמטר; חסר ⇒ ננסה מהאתחול
    const tm = head.match(/^(?:const|final)\s+([\w<>,()?\[\] ]+?)\s+[\w$]+\s*=\s*$/);
    let type = tm ? tm[1].trim() : null;
    if (!type) {
      const it = init.trim().replace(/^const\s+/, '');
      const gm = it.match(/^<([^>]+)>\s*([\[{])/);
      if (gm) {
        const args = gm[1].split(',').map(x => x.trim());
        type = gm[2] === '[' ? `List<${gm[1]}>` : (args.length === 2 ? `Map<${gm[1]}>` : `Set<${gm[1]}>`);
      } else if (it.startsWith('{')) {
        // Set או Map: ':' ברמת-העומק-העליונה של הליטרל מכריע
        let d3 = 0, q3 = null, isMap = false;
        for (let k3 = 1; k3 < it.length; k3++) {
          const c3 = it[k3];
          if (q3) { if (c3 === '\\') k3++; else if (c3 === q3) q3 = null; continue; }
          if (c3 === "'" || c3 === '"') { q3 = c3; continue; }
          if ('([{'.includes(c3)) d3++;
          if (')]}'.includes(c3)) { if (c3 === '}' && d3 === 0) break; d3--; }
          if (c3 === ':' && d3 === 0) { isMap = true; break; }
        }
        type = isMap ? 'Map' : 'Set';
      }
      else if (it.startsWith('[')) type = 'List';
      else if (/^r?['"]/.test(it)) type = 'String';
      else type = 'dynamic';
    }
    decls.push({ name: m[2], type, init: init.trim(), whole, start: lineStart, end: j + 1 });
  }
  if (!decls.length) return report(base, 'skip', 'אין הצהרות-מודול עבריות (העברית בגוף-פונקציה — יד)');
  // מחלקות מקומיות: טבלה מוקלדת-מחלקה לא זזה בלי המחלקה — דילוג כן (שיפוט-יד)
  const localClasses = [...src.matchAll(/(?:^|\n)(?:abstract\s+)?(?:class|enum)\s+(\w+)/g)].map(x => x[1]);
  const classTyped = decls.filter(d => localClasses.some(c => new RegExp(`(?<![\\w$])${c}(?![\\w$])`).test(d.type + ' ' + d.init)));
  // טבלה מוקלדת-מחלקה: קובץ-הדאטה מייבא את האטום לטיפוס (דאטה⇐אטום, חד-כיווני — האטום
  // עצמו נשאר אפס-import ומקבל את הטבלה בשקע; דוקטרינת "עד מאה אחוז" 30.8)
  const needAtomImport = classTyped.length > 0;
  // סגור-תלות: הצהרת-מודול (גם לא-עברית) שמוזכרת באתחול של הצהרה-זזה — זזה איתה
  {
    let grew = true;
    while (grew) {
      grew = false;
      const moved = new Set(decls.map(d => d.name));
      const re4 = /(?:^|\n)((?:const|final)\s+(?:[\w<>,()?\[\] ]+?\s+)?([\w$]+)\s*=\s*)/g;
      let m4;
      while ((m4 = re4.exec(src))) {
        const nm = m4[2];
        if (moved.has(nm)) continue;
        const lineStart = m4.index === 0 ? 0 : m4.index + 1;
        if (src[lineStart] === ' ' || src[lineStart] === '\t') continue;
        const referencedByMoved = decls.some(d => new RegExp(`(?<![\\w$])${nm}(?![\\w$])`).test(d.init));
        // גם ההפך: הצהרה שנשארת אך מפנה לשם-שזז — חייבת לזוז איתו
        const vProbe = src.slice(m4.index + m4[0].length, m4.index + m4[0].length + 400);
        const referencesMoved = decls.some(d => new RegExp(`(?<![\\w$])${d.name}(?![\\w$])`).test(vProbe));
        if (!referencedByMoved && !referencesMoved) continue;
        const vStart = m4.index + m4[0].length;
        let j2 = vStart, d2 = 0, q2 = null;
        for (; j2 < src.length; j2++) {
          const ch = src[j2];
          if (q2) { if (ch === '\n') q2 = null; else if (ch === '\\') j2++; else if (ch === q2) q2 = null; continue; }
          if (ch === "'" || ch === '"') { q2 = ch; continue; }
          if (ch === '(' || ch === '[' || ch === '{') d2++;
          if (ch === ')' || ch === ']' || ch === '}') d2--;
          if (ch === ';' && d2 <= 0) break;
        }
        if (j2 >= src.length) continue;
        const initX = src.slice(vStart, j2).trim();
        const headX = m4[1];
        const tmX = headX.match(/^(?:const|final)\s+([\w<>,()?\[\] ]+?)\s+[\w$]+\s*=\s*$/);
        decls.push({ name: nm, type: tmX ? tmX[1].trim() : 'dynamic', init: initX, whole: src.slice(lineStart, j2 + 1), start: lineStart, end: j2 + 1 });
        grew = true;
        break;
      }
    }
    decls.sort((a2, b2) => a2.start - b2.start);
  }
  // בדיקת-מחלקה/enum חוזרת אחרי הסגור (הצהרה שהצטרפה עלולה להפנות לטיפוס-מקומי)
  const needAtomImport2 = needAtomImport || decls.some(d => localClasses.some(c => new RegExp(`(?<![\\w$])${c}(?![\\w$])`).test(d.type + ' ' + d.init)));

  // ── 2. מחיקה מהאטום + קובץ-דאטה (שם פרטי ⇒ ציבורי) ──
  const pub = (n) => n.replace(/^_+/, '');
  const nameMap = new Map(decls.map(d => [d.name, pub(d.name)]));
  for (const d of [...decls].sort((a, b) => b.start - a.start))
    src = src.slice(0, d.start) + src.slice(d.end + (src[d.end] === '\n' ? 1 : 0));
  // שמות פרטיים ⇒ ציבוריים בכל הגוף (הפניות)
  for (const [from, to] of nameMap) if (from !== to)
    src = src.replace(new RegExp(`(?<![\\w$])${from}(?![\\w$])`, 'g'), to);

  const dataFile = path.join(DATA, base + '-data.dart');
  const atomImport = (typeof needAtomImport2 !== 'undefined' && needAtomImport2) ? `import '../dart/${base}.dart';\n` : '';
  const dataSrc = atomImport + `// 🗄️ דאטה · מילוני-${base} — הורמו מהאטום ע"י purify-dart-native (הכרעת-בעלים "עד\n// מאה אחוז": אפס-דאטה במנגנון). מוזרקים לאטום כשקעים-שמיים; שינוי-מילון = עריכה כאן.\n// מקור-ערכים: new/dart/${base}.dart (verbatim).\n` +
    decls.map(d => {
      let init = d.init;
      for (const [from, to] of nameMap) if (from !== to)
        init = init.replace(new RegExp(`(?<![\\w$])${from}(?![\\w$])`, 'g'), to);
      const kw = d.whole.trimStart().startsWith('final') ? 'final' : 'const';
      return `${kw} ${d.type === 'dynamic' ? '' : d.type + ' '}${pub(d.name)} = ${init};`;
    }).join('\n') + '\n';

  // ── 3. פונקציות-top-level שמשתמשות בשמות ⇒ פרמטר-שמי-required + השחלה ──
  const names = [...nameMap.values()];
  const fnRe = /(?:^|\n)([\w<>,()?\[\] ]+?)\s([a-zA-Z_$][\w$]*)\s*(<[\w, ]+>)?\s*\(/g;
  const fns = [];
  while ((m = fnRe.exec(src))) {
    const nm = m[2];
    if (['if', 'for', 'while', 'switch', 'return', 'assert', 'catch', 'const', 'final', 'new'].includes(nm)) continue;
    const open = m.index + m[0].length - 1;
    const close = balance(src, open + 1, '(', ')');
    if (close < 0) continue;
    if (!/^\s*(=>|\{|async)/.test(src.slice(close + 1, close + 20))) continue;
    const bm = src.slice(close + 1).match(/\{|=>/);
    if (!bm) continue;
    const bs = close + 1 + bm.index;
    const be = src[bs] === '{' ? balance(src, bs + 1, '{', '}') : src.indexOf(';', bs);
    if (be < 0) continue;
    fns.push({ name: nm, open, close, bs, be });
  }
  const uses = new Map();                                            // fn ⇒ Set<dataName>
  for (const f of fns) {
    const body = src.slice(f.bs, f.be + 1);
    const set = new Set(names.filter(n => new RegExp(`(?<![\\w$])${n}(?![\\w$])`).test(body)));
    uses.set(f.name, set);
  }
  // סגור-מעברי: פונקציה שקוראת לפונקציה-נזקקת — הקריאה תוזן שמית (אין הוספת-פרמטר לקורא;
  // הקורא מזין את השקע מהערך שקיבל בעצמו אם יש לו, אחרת יקבל גם הוא)
  let changed = true;
  while (changed) {
    changed = false;
    for (const f of fns) {
      const body = src.slice(f.bs, f.be + 1);
      for (const g of fns) {
        if (g === f || !uses.get(g.name).size) continue;
        if (new RegExp(`(?<![\\w.$])${g.name}\\(`).test(body))
          for (const n of uses.get(g.name)) if (!uses.get(f.name).has(n)) { uses.get(f.name).add(n); changed = true; }
      }
    }
  }
  if (![...uses.values()].some(s2 => s2.size)) return report(base, 'skip', 'אף פונקציה לא משתמשת (חריג)');

  // הרחבת-חתימות (מהסוף-להתחלה) — שקעים-שמיים required
  const typeOf = new Map(decls.map(d => [pub(d.name), d.type]));
  for (const f of [...fns].sort((a, b) => b.open - a.open)) {
    const need = [...uses.get(f.name)];
    if (!need.length) continue;
    const sigTxt = src.slice(f.open, f.close + 1);
    const ins = need.map(n => `required ${typeOf.get(n) === 'dynamic' ? 'dynamic' : typeOf.get(n)} ${n}`).join(', ');
    if (/\{[^}]*\}\s*\)$/.test(sigTxt) || /\{\s*(required|[A-Z_])/.test(sigTxt)) {
      const braceClose = sigTxt.lastIndexOf('}');
      const abs = f.open + braceClose;
      src = src.slice(0, abs).replace(/[,\s]+$/, '') + ', ' + ins + src.slice(abs);
    } else {
      const innerTrim = sigTxt.slice(1, -1).replace(/[,\s]+$/, '');
      const pre = src.slice(0, f.open + 1) + innerTrim;
      src = pre + (innerTrim ? ', ' : '') + '{' + ins + '}' + src.slice(f.close);
    }
  }
  // השחלת-קריאות-פנימיות: כל קריאה לפונקציה-נזקקת מקבלת name: name (הערך זורם מהחתימה)
  const spliceNamed = (txt, callee, need, skip) => {
    const re2 = new RegExp(`(?<![\\w.$])${callee}\\(`, 'g');
    let out = '', i = 0, mm;
    while ((mm = re2.exec(txt))) {
      const open = mm.index + mm[0].length - 1;
      if (skip && open >= skip[0] && open <= skip[1]) continue;      // לא בתוך הגדרת-עצמה
      const close = balance(txt, open + 1, '(', ')');
      if (close < 0) break;
      const inner = txt.slice(open + 1, close);
      const add = need.map(n => `${n}: ${n}`).join(', ');
      const sep = !inner.trim() ? '' : /,\s*$/.test(inner) ? ' ' : ', ';
      out += txt.slice(i, close) + sep + add;
      i = close;
      re2.lastIndex = close;
    }
    return out + txt.slice(i);
  };
  for (const f of fns) {
    const need = [...uses.get(f.name)];
    if (!need.length) continue;
    // מצא-מחדש את הגדרת-הפונקציה (המיקומים זזו) — דלג עליה בהשחלה
    const dm = src.match(new RegExp(`(?:^|\\n)[\\w<>,()?\\[\\] ]+?\\s${f.name}\\s*(?:<[\\w, ]+>)?\\s*\\(`));
    const defOpen = dm ? dm.index + dm[0].length - 1 : -1;
    const defClose = defOpen >= 0 ? balance(src, defOpen + 1, '(', ')') : -1;
    src = spliceNamed(src, f.name, need, defOpen >= 0 ? [defOpen, defClose] : null);
  }

  // ── 4. הזנת-הבדיקה ──
  const alias = 'td_' + base;
  let test = origTest;
  if (!test.includes(`${base}-data.dart`)) {
    const lines = test.split('\n');
    const ii = lines.findIndex(l => l.startsWith('import '));
    lines.splice(ii < 0 ? 0 : ii, 0, `import '../dart-data/${base}-data.dart' as ${alias};`);
    test = lines.join('\n');
  }
  for (const f of fns) {
    const need = [...uses.get(f.name)];
    if (!need.length) continue;
    const re3 = new RegExp(`(?<![\\w.$])${f.name}\\(`, 'g');
    let out = '', i = 0, mm;
    while ((mm = re3.exec(test))) {
      const open = mm.index + mm[0].length - 1;
      const close = balance(test, open + 1, '(', ')');
      if (close < 0) break;
      const inner = test.slice(open + 1, close);
      const add = need.map(n => `${n}: ${alias}.${n}`).join(', ');
      const sep = !inner.trim() ? '' : /,\s*$/.test(inner) ? ' ' : ', ';
      out += test.slice(i, close) + sep + add;
      i = close;
      re3.lastIndex = close;
    }
    test = out + test.slice(i);
  }

  // הפניות-ישירות בבדיקה לשמות-שזזו ⇒ מוסבות דרך ה-alias
  for (const d of decls) {
    const pn = pub(d.name);
    test = test.replace(new RegExp(`(?<![\\w$.])(?:${d.name}|${pn})(?![\\w$])(?!\\s*:)`, 'g'), `${alias}.${pn}`);
  }
  if (DRY) return report(base, 'ok', `[dry] ${decls.map(d => pub(d.name)).join(',')}`);
  const origData = fs.existsSync(dataFile) ? fs.readFileSync(dataFile, 'utf8') : null;
  fs.writeFileSync(fp, src);
  fs.writeFileSync(dataFile, dataSrc);
  fs.writeFileSync(tp, test);
  try {
    execFileSync(DART, ['run', '--enable-asserts', tp], { cwd: DDIR, stdio: 'pipe', timeout: 120000 });
  } catch (e) {
    fs.writeFileSync(fp, orig);
    fs.writeFileSync(tp, origTest);
    if (origData === null) fs.rmSync(dataFile, { force: true }); else fs.writeFileSync(dataFile, origData);
    return report(base, 'fail', 'ולידציה-נכשלה ⇒ הוחזר: ' + String(e.stderr || e.stdout || '').slice(0, 140).replace(/\n/g, ' '));
  }
  return report(base, 'ok', `${decls.length} מילונים ⇒ דאטה · שקעים: ${[...new Set([...uses.values()].flatMap(s2 => [...s2]))].join(',')}`);
}

const targets = fs.readdirSync(DDIR).filter(f => f.endsWith('.dart') && !f.endsWith('_test.dart'))
  .map(f => f.replace(/\.dart$/, ''))
  .filter(b => !ONLY || b === ONLY)
  .filter(b => hebOutsideRegexp(stripComments(fs.readFileSync(path.join(DDIR, b + '.dart'), 'utf8'))));
let ok = 0, fail = 0, skip = 0;
const report = (b, kind, msg) => {
  if (kind === 'ok') ok++; else if (kind === 'skip') skip++; else fail++;
  console.log(`${kind === 'ok' ? '✅' : kind === 'skip' ? '🫱' : '❌'} ${b} — ${msg}`);
  return null;
};
for (const b of targets) repair(b, report);
console.log(`\n🧼 purify-dart-native: ${ok} טוהרו · ${skip} דולגו · ${fail} נכשלו (מתוך ${targets.length})`);
