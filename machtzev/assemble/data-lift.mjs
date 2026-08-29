#!/usr/bin/env node
/** 🧽 מחצב · מנוע-הליטוש-האוטומטי (data-lift) — חוזה: DATA-LIFT-CONTRACT.md.
 *  widget מלוכלך (עברית-בגוף) ⇒ אטום-נקי + קובץ-תוכן, בלי-סוכן: כל מחרוזת-עברית
 *  מורמת ל-prop ששמו נלקח מהארגומנט-הממוען של Dart עצמו (title:/label:/hint:).
 *  כל ספק ⇒ דחייה-מנומקת (הנחיל/החלטה). דטרמיניסטי. רץ אחרי shelf-lift (אותו מדף).
 *  שימוש: node data-lift.mjs [screens-dir] */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, execSync } from 'node:child_process';
import { inferImports, classBody, stripComments, maskComments, HEB_STR, IO_PAT, RIVERPOD, blind, snake, screenPascal, okType } from './lift-lib.mjs';
const ROOT = new URL('../../', import.meta.url).pathname;
const SCRATCH = process.argv[2] || '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/all-screens';
const SHELF = path.join(ROOT, 'new/dart-ui-bs');
const OUT = path.join(SHELF, 'auto');
const CONTENT_OUT = path.join(ROOT, 'new/dart-data-bs/auto');
const MACHINE = path.join(ROOT, 'screens-seed/machine');
const BS = '/home/user/buildsmart';

// ── אינדקס-מחלקות-הפרויקט (כמו shelf-lift) ──
let projectClasses = new Set();
try {
  projectClasses = new Set([...execSync("git grep -h -E 'class [A-Za-z0-9_]+' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 24 })
    .matchAll(/class\s+([A-Za-z0-9_]+)/g)].map(x => x[1]));
  projectClasses.delete('BsTokens');
} catch { }

// ── מלאי-המדף (כולל auto/ של shelf-lift — data-lift רץ אחריו) ──
const usedNames = new Set(); const shelfHashes = new Map();
for (const f of fs.readdirSync(SHELF, { recursive: true }).map(String)) {
  const p = path.join(SHELF, f);
  if (!f.endsWith('.dart') || !fs.statSync(p).isFile()) continue;
  const src = fs.readFileSync(p, 'utf8');
  for (const m of src.matchAll(/class\s+([A-Za-z0-9_]+)\s+extends\s+\w+/g)) {
    usedNames.add(m[1]);
    const b = classBody(src, m.index); if (b) shelfHashes.set(blind(b, m[1]), m[1]);
  }
}

// ── ליבת-ההרמה: מחרוזות-עברית ⇒ props (שם מהארגומנט-העוטף — argument-scoped) ──
const HEB_LIT = /'((?:[^'\\\n]|\\.)*[֐-׿](?:[^'\\\n]|\\.)*)'/g;
const ANY_LIT = /'(?:[^'\\\n]|\\.)*'/g;
function hoistStrings(body) {
  const masked = maskComments(body);
  // עותק-סריקה: גם המחרוזות ממוסכות (שימור-אורך) — ספירת-סוגריים אמינה
  const scan = masked.replace(ANY_LIT, (m) => "'" + 'x'.repeat(m.length - 2) + "'");

  // איחוד-ליטרלים-צמודים (שרשור-Dart רב-שורתי) לפריט-אחד
  const runs = [];
  let cur = null;
  for (const m of [...masked.matchAll(ANY_LIT)]) {
    if (cur && /^\s*$/.test(masked.slice(cur.end, m.index))) { cur.end = m.index + m[0].length; cur.parts.push(m[0]); }
    else { cur = { start: m.index, end: m.index + m[0].length, parts: [m[0]] }; runs.push(cur); }
  }
  const lits = runs
    .map(r => ({ ...r, value: r.parts.map(p => p.slice(1, -1)).join('') }))
    .filter(r => /[֐-׿]/.test(r.value));
  if (!lits.length) return { fail: 'no-hebrew' };

  const props = []; const seen = new Map();
  for (const m of lits) {
    if (m.value.includes('$')) return { fail: 'interpolation' };
    // הליכה-לאחור בעותק-הסרוק אל תחילת-הארגומנט העוטף (פסיק/סוגר בעומק-0)
    let d = 0, k = m.start - 1;
    for (; k >= 0; k--) {
      const c = scan[k];
      if (c === ')' || c === ']' || c === '}') d++;
      else if (c === '(' || c === '[' || c === '{') { if (!d) break; d--; }
      else if (c === ',' && !d) break;
    }
    const argPrefix = scan.slice(k + 1, m.start);
    const beforeArg = scan.slice(0, k + 1).replace(/\s+$/, '');
    let name = null, isDefault = false;
    const nm = argPrefix.match(/^\s*([a-zA-Z_]\w*)\s*:/);
    const dp = argPrefix.match(/this\.([a-zA-Z_]\w*)\s*=\s*$/);
    if (dp) { name = dp[1]; isDefault = true; }
    else if (nm && !['children', 'style', 'key'].includes(nm[1])) name = nm[1];
    else if (/\b(Text|CfgText|SelectableText)\s*\($/.test(beforeArg) || /\b(Text|CfgText|SelectableText)\s*\($/.test((beforeArg + argPrefix).replace(/\s+$/, ''))) name = 'label';
    else if (/(\breturn|=>)\s*$/.test(scan.slice(0, m.start))) name = 'text';
    if (!name) return { fail: 'unnamed-string' };
    if (/=\s*$/.test(scan.slice(0, m.start)) && !isDefault) return { fail: 'default-param' };
    let n = (seen.get(name) || 0) + 1;
    // התנגשות עם שדה-קיים (שאינו זה-עצמו בפרמטר-default) ⇒ סיומת מספרית
    const fieldRe = (p) => new RegExp('final\\s+[A-Za-z_][\\w<>?]*\\s+' + p + '\\s*;');
    while (!isDefault && fieldRe(n === 1 ? name : name + n).test(body)) n++;
    seen.set(name, n);
    props.push({ prop: n === 1 ? name : name + n, value: m.value, start: m.start, len: m.end - m.start, isDefault });
  }
  // החלפה מהסוף-להתחלה (שימור-אינדקסים); default-param ⇒ נמחק גם ה-'=' (יהפוך required)
  let out = body;
  for (const p of [...props].sort((a, b) => b.start - a.start)) {
    if (p.isDefault) {
      const eq = out.lastIndexOf('=', p.start);
      out = out.slice(0, eq).replace(/\s+$/, '') + out.slice(p.start + p.len);
    } else out = out.slice(0, p.start) + p.prop + out.slice(p.start + p.len);
  }
  // required-ization לפרמטרי-default שהופשטו
  for (const p of props.filter(x => x.isDefault))
    out = out.replace(new RegExp('([{,(]\\s*)this\\.' + p.prop + '\\b'), '$1required this.' + p.prop);
  // הפשטת-const מכל ביטוי שמכיל עכשיו prop (לא-קבוע) — איטרטיבי עד-יציבות
  const propWord = new RegExp('\\b(' + props.map(p => p.prop).join('|') + ')\\b');
  let changed = true;
  while (changed) {
    changed = false;
    for (const cm of [...out.matchAll(/\bconst\s+(?=[A-Z]\w*\s*\(|\[)/g)]) {
      const rel = out.slice(cm.index).search(/[([]/);
      const open = cm.index + rel;
      const openCh = out[open], closeCh = openCh === '(' ? ')' : ']';
      let d = 0, j = open, inS = 0;
      for (; j < out.length; j++) {
        const c = out[j];
        if (inS) { if (c === '\\') j++; else if (c === "'") inS = 0; continue; }
        if (c === "'") inS = 1;
        else if (c === openCh) d++; else if (c === closeCh) { d--; if (!d) break; }
      }
      if (propWord.test(out.slice(open, j + 1))) {
        out = out.slice(0, cm.index) + out.slice(cm.index + cm[0].length);
        changed = true; break;
      }
    }
  }
  return { out, props };
}

// ── הזרקת בנאי+שדות ──
function injectProps(body, cls, allProps) {
  const props = allProps.filter(p => !p.isDefault); // default-param: השדה כבר קיים
  if (!props.length) return body;
  const decls = props.map(p => `  final String ${p.prop};`).join('\n');
  const params = props.map(p => 'required this.' + p.prop).join(', ');
  const ctorRe = new RegExp('(const\\s+)?' + cls + '\\s*\\(');
  const cm = body.match(ctorRe);
  if (cm && !/=>/.test(body.slice(cm.index, cm.index + 20))) {
    // מציאת סוגר-הפרמטרים
    let d = 0, j = body.indexOf('(', cm.index), open = j, inS = 0;
    for (; j < body.length; j++) {
      const c = body[j];
      if (inS) { if (c === '\\') j++; else if (c === "'") inS = 0; continue; }
      if (c === "'") inS = 1; else if (c === '(') d++; else if (c === ')') { d--; if (!d) break; }
    }
    const plist = body.slice(open + 1, j);
    let np;
    if (plist.includes('{')) np = plist.replace('{', '{' + params + ', ');
    else if (plist.trim() === '') np = '{' + params + '}';
    else np = plist.replace(/,?\s*$/, '') + ', {' + params + '}';
    // הזרקת-השדות אחרי סוף-הבנאי (; או גוף)
    let end = body.indexOf(';', j); const brace = body.indexOf('{', j);
    if (brace > 0 && (end < 0 || brace < end)) { const b2 = classBody(body, j); end = j + (b2 ? body.slice(j).indexOf(b2) + b2.length : 0); }
    if (end < 0) return null;
    return body.slice(0, open + 1) + np + body.slice(j, end + 1) + '\n' + decls + body.slice(end + 1);
  }
  // אין בנאי מפורש ⇒ מוסיפים אחרי פתיחת-המחלקה
  const openBrace = body.indexOf('{');
  return body.slice(0, openBrace + 1) + `\n  const ${cls}({${params}});\n` + decls + body.slice(openBrace + 1);
}

// ── המעבר ──
const report = { lifted: [], skipped: {} };
const skip = (why, id) => (report.skipped[why] ??= []).push(id);
fs.rmSync(CONTENT_OUT, { recursive: true, force: true });
fs.mkdirSync(CONTENT_OUT, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const liftedHashes = new Map();
const contentByScreen = new Map();
for (const mf of fs.readdirSync(MACHINE).filter(f => f.endsWith('.json')).sort()) {
  const map = JSON.parse(fs.readFileSync(path.join(MACHINE, mf), 'utf8'));
  const screen = mf.replace('.json', '');
  const srcPath = path.join(SCRATCH, screen + '.dart');
  if (!fs.existsSync(srcPath)) continue;
  const src = fs.readFileSync(srcPath, 'utf8');
  const fileClasses = new Set([...src.matchAll(/class\s+([A-Za-z0-9_]+)[\s<]/g)].map(x => x[1]));

  for (const w of map.widgets || []) {
    const id = screen + ':' + w.name;
    if (w.dataClean || !w.pure || w.kind !== 'StatelessWidget') continue;  // פידסטוק: מלוכלך+טהור+Stateless
    const decl = src.match(new RegExp('class\\s+' + w.name + '\\s+extends\\s+StatelessWidget'));
    if (!decl) { skip('no-decl', id); continue; }
    const body = classBody(src, decl.index);
    if (!body) { skip('no-body', id); continue; }

    // הרמת-המחרוזות
    const h1 = hoistStrings(body);
    if (h1.fail) { skip(h1.fail, id); continue; }
    if (HEB_STR.test(stripComments(h1.out))) { skip('hebrew-left', id); continue; }

    // עצמאות (כמו shelf-lift, בלי-צרירה — v1 שמרני)
    const code = stripComments(h1.out);
    if (IO_PAT.test(code) || RIVERPOD.test(code)) { skip('io', id); continue; }
    const refs = new Set([...code.matchAll(/\b(_?[A-Z]\w+|_[a-z]\w*)\b/g)].map(x => x[1]));
    refs.delete(w.name);
    if ([...refs].some(r => fileClasses.has(r))) { skip('sibling-class', id); continue; }
    if ([...refs].some(r => /^_/.test(r) && !new RegExp('(final|var|const|void|double|int|String|bool|Widget|Color|late)\\s+' + r.replace(/[$]/g, '') + '\\b|[A-Za-z>]\\s+' + r.replace(/[$]/g, '') + '\\s*\\(').test(code))) { skip('private-dep', id); continue; }
    if ([...refs].some(r => r !== 'BsTokens' && projectClasses.has(r))) { skip('project-dep', id); continue; }
    const fields = [...code.matchAll(/final\s+([A-Za-z_][\w<>,\s]*\??)\s+[a-zA-Z_]\w*\s*;/g)].map(x => x[1].trim());
    if (fields.some(t => !okType(t))) { skip('model-prop', id); continue; }

    // דדופ (הכרעה-5) על המנגנון-המלוטש
    const hash = blind(h1.out, w.name);
    if (shelfHashes.has(hash)) { skip('already-on-shelf', id + '⇒' + shelfHashes.get(hash)); continue; }
    if (liftedHashes.has(hash)) { liftedHashes.get(hash).also.push(id); continue; }

    // שם-ציבורי
    let pub = w.name.replace(/^_/, '');
    if (usedNames.has(pub)) pub = screenPascal(screen) + pub;
    if (usedNames.has(pub)) { skip('name-collision', id); continue; }

    // הזרקת props
    const injected = injectProps(h1.out, w.name, h1.props);
    if (!injected) { skip('ctor-shape', id); continue; }
    usedNames.add(pub);
    liftedHashes.set(hash, { id, pub, screen, name: w.name, body: injected, props: h1.props, also: [] });
  }
}

// ── פליטה + שער-עצמי + שימור ──
for (const L of [...liftedHashes.values()].sort((a, b) => a.pub.localeCompare(b.pub))) {
  const file = path.join(OUT, snake(L.pub) + '.dart');
  if (fs.existsSync(file)) { skip('file-collision', L.id); continue; }
  let joined = L.body.replaceAll(L.name, L.pub);
  const extras = inferImports(stripComments(joined));
  if (/\bBsTokens\./.test(joined)) extras.unshift("import 'bs_tokens.dart';");
  const also = L.also.length ? `\n// משרת-גם (זהה-מבנית): ${L.also.join(' · ')}` : '';
  const code = `// 🧽 לוטש ע"י מנוע-הליטוש (data-lift) — הדאטה הורמה ל-props, אל תערוך ידנית.
// מוצא: ${L.id} (בנייה-חכמה main) · ${L.props.length} props: ${L.props.map(p => p.prop).join(', ')}
// התוכן: new/dart-data-bs/auto/${L.screen}_content.dart${also}
import 'package:flutter/material.dart';
${extras.join('\n')}${extras.length ? '\n' : ''}
${joined}
`;
  fs.writeFileSync(file, code);
  try {
    const chk = execFileSync('node', [path.join(ROOT, 'machtzev/carve/screen-decomp.mjs'), file], { encoding: 'utf8' });
    if (!/מהם 🧼 נקיים-מדאטה: 1/.test(chk)) throw new Error('לא-dataClean');
    // שימור: כל מחרוזת שהורמה ⇒ שורת-תוכן
    (contentByScreen.get(L.screen) ?? contentByScreen.set(L.screen, []).get(L.screen))
      .push(...L.props.map(p => `const String ${snake(L.pub)}_${snake(p.prop)} = '${p.value}';`));
    report.lifted.push({ atom: L.pub, from: L.id, props: L.props.length, serves: 1 + L.also.length });
  } catch { fs.unlinkSync(file); skip('failed-self-gate', L.id); }
}
for (const [screen, lines] of [...contentByScreen.entries()].sort()) {
  fs.writeFileSync(path.join(CONTENT_OUT, screen + '_content.dart'),
    `// 📦 דאטה · תוכן-שהורם ע"י data-lift מ-${screen} — verbatim מהמקור, אל תערוך ידנית.\n${lines.join('\n')}\n`);
}

const skippedN = Object.values(report.skipped).reduce((a, v) => a + v.length, 0);
const strings = report.lifted.reduce((a, x) => a + x.props, 0);
fs.writeFileSync(path.join(ROOT, 'screens-seed/data-lift-report.json'), JSON.stringify(report, null, 1));
console.log(`🧽 מנוע-הליטוש · לוטשו: ${report.lifted.length} widgets (${strings} מחרוזות⇒props · משרתים ${report.lifted.reduce((a, x) => a + x.serves, 0)}) · נדחו: ${skippedN}`);
for (const [why, ids] of Object.entries(report.skipped).sort((a, b) => b[1].length - a[1].length)) console.log(`   ⏭️ ${why}: ${ids.length}`);
console.log('⇒ new/dart-ui-bs/auto/ + new/dart-data-bs/auto/ + screens-seed/data-lift-report.json');
