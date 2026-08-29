#!/usr/bin/env node
/** 🧽 מחצב · מנוע-המטרות v3 (data-lift) — חוזה: DATA-LIFT-CONTRACT.md.
 *  הכרעות-הבעלים 29.8: (א) לא שם — *מטרה*: כל מחרוזת-עברית מוחלפת ב-prop על-שם
 *  הפרמטר שאליו היא זורמת (אינדקס-בנאים אמיתי). (ב) *מטרת-הנתון*: widget תלוי-מודל
 *  מפורק-הפוך — המנוע קורא אילו שדות נצרכים ומחליף את המודל ב-props על-שם השדות.
 *  (ג) *תבנית*: 'סה"כ $x' מפורקת-הפוך — קטעי-העברית ⇒ props, החורים = מנגנון.
 *  כל ספק ⇒ דחייה-מנומקת. דטרמיניסטי. רץ אחרי shelf-lift (אותו מדף).
 *  שימוש: node data-lift.mjs [screens-dir] */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, execSync } from 'node:child_process';
import { inferImports, classBody, stripComments, maskComments, HEB_STR, IO_PAT, RIVERPOD, blind, snake, screenPascal, okType, FOUNDATION, FOUNDATION_FN, maskLitsKeepInterp } from './lift-lib.mjs';
const ROOT = new URL('../../', import.meta.url).pathname;
const SCRATCH = process.argv[2] || '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/all-screens';
const SHELF = path.join(ROOT, 'new/dart-ui-bs');
const OUT = path.join(SHELF, 'auto');
const CONTENT_OUT = path.join(ROOT, 'new/dart-data-bs/auto');
const MACHINE = path.join(ROOT, 'screens-seed/machine');
const BS = '/home/user/buildsmart';

// ── אינדקס-מחלקות-הפרויקט ──
let projectClasses = new Set();
try {
  projectClasses = new Set([...execSync("git grep -h -E 'class [A-Za-z0-9_]+' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 24 })
    .matchAll(/class\s+([A-Za-z0-9_]+)/g)].map(x => x[1]));
  projectClasses.delete('BsTokens');
} catch { }
// אינדקס-פונקציות-הפרויקט (עליונות, lowercase) — קריאה לפונקציה-חיצונית-לא-יסוד ⇒ דחייה
let projectFns = new Set();
try {
  projectFns = new Set([...execSync("git grep -hE '^[A-Za-z][A-Za-z_<>,? ]+ [a-z][a-zA-Z0-9]+\\(' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 24 })
    .matchAll(/ ([a-z]\w+)\(/g)].map(x => x[1]));
} catch { }
// אינדקס-טיפוסי-providers: fooProvider ⇒ הטיפוס-הנצפה (Provider<T>/StateProvider<T>/StateNotifierProvider<N,T>)
const providerType = new Map();
try {
  const defs = execSync("git grep -hE 'final [a-z][a-zA-Z0-9]*Provider = ' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 24 });
  for (const m of defs.matchAll(/final ([_a-z]\w*Provider) = (Provider|StateProvider|StateNotifierProvider|FutureProvider|StreamProvider)(?:\.autoDispose)?(?:\.family)?(?:<([^>]+)>)?/g)) {
    if (m[2] === 'FutureProvider' || m[2] === 'StreamProvider') { providerType.set(m[1], null); continue; } // אסינכרוני ⇒ דחייה
    let t = (m[3] || '').trim();
    if (m[2] === 'StateNotifierProvider') t = t.split(',').slice(-1)[0].trim();
    providerType.set(m[1], t || null);
  }
} catch { }

// פונקציה-פרויקטלית טהורה ⇒ import-יעד אוטומטי (מטרת-הפונקציה = היכן-שהוגדרה)
const fnImportCache = new Map();
function resolveFnImport(name) {
  if (fnImportCache.has(name)) return fnImportCache.get(name);
  let res = null;
  try {
    const hits = execSync(`git grep -lE '^[A-Za-z][A-Za-z_<>,? ]+ ${name}\\(' origin/main -- app_flutter/lib`, { cwd: BS, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    if (hits.length === 1) {
      const src = execSync(`git show '${hits[0].replace(/'/g, '')}'`, { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 24 });
      const dm = src.match(new RegExp('(^|\\n)[A-Za-z][A-Za-z_<>,? ]+ ' + name + '\\('));
      if (dm) {
        const b = classBody(src, dm.index) || src.slice(dm.index, src.indexOf(';', dm.index) + 1);
        const codeB = stripComments(b || '');
        if (codeB && !HEB_STR.test(codeB) && !IO_PAT.test(codeB) && !RIVERPOD.test(codeB) && b.split('\n').length <= 60)
          res = "import 'package:buildsmart/" + hits[0].replace(/^origin\/main:app_flutter\/lib\//, '') + "';";
      }
    }
  } catch { }
  fnImportCache.set(name, res);
  return res;
}
const usedFnImports = new Set();

// ── אינדקס-קבועים-ציבוריים + auto-import (קבוע עם עברית ⇒ דחייה — מועמד-תוכן) ──
let projectConsts = new Map(); // name ⇒ 'origin/main:path'
try {
  const dump = execSync("git grep -nHE '^((const |final )?[A-Za-z_][A-Za-z0-9_<>, ?]* [a-z][a-zA-Z0-9]* ?=|[A-Za-z_][A-Za-z0-9_<>, ?]* get [a-z][a-zA-Z0-9]*)' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 25 });
  for (const line of dump.split('\n')) {
    const m = line.match(/^([^:]+:[^:]+):\d+:(?:const\s+|final\s+)?[A-Za-z_][\w<>,? ]*?\s([a-z]\w*)\s*=/) || line.match(/^([^:]+:[^:]+):\d+:(?:const|final)\s+([a-z]\w*)\s*=/) || line.match(/^([^:]+:[^:]+):\d+:[A-Za-z_][\w<>,? ]*?\sget\s+([a-z]\w*)/);
    if (m && !projectConsts.has(m[2])) projectConsts.set(m[2], m[1]);
  }
} catch { }
const constImportCache = new Map();
function resolveConstImport(name) {
  if (constImportCache.has(name)) return constImportCache.get(name);
  let res = null;
  const f = projectConsts.get(name);
  if (f) {
    try {
      const src2 = execSync(`git show '${f.replace(/'/g, '')}'`, { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 24 });
      if (f.endsWith('.g.dart')) { constImportCache.set(name, null); return null; }
      const dm = src2.match(new RegExp('(^|\\n)(?:const\\s+|final\\s+)?(?:[A-Za-z_][\\w<>,? ]*?\\s+)?(?:get\\s+)?' + name + '\\s*[={]'));
      if (dm) {
        const end = src2.indexOf(';', dm.index);
        if (end > 0 && !/[֐-׿]/.test(src2.slice(dm.index, end)))
          res = "import 'package:buildsmart/" + f.replace(/^origin\/main:app_flutter\/lib\//, '') + "';";
      }
    } catch { }
  }
  constImportCache.set(name, res);
  return res;
}
/** מזהי-קבועים-פרויקטליים בגוף: null=הכול-פתיר · שם ⇒ לא-פתיר (עברית/לא-נמצא). */
function unresolvedConst(code, declaredIn) {
  for (const m of new Set([...code.matchAll(/(?<![.\w'])([a-z]\w{2,})\b/g)].map(x => x[1]))) {
    if (!projectConsts.has(m)) continue;
    if (new RegExp('(^|\\n)\\s*(static\\s+)?(const\\s+|final\\s+|late\\s+|var\\s+)?[A-Za-z_][\\w<>,?\\[\\] ]*\\s+' + m + '\\s*[=;,)({]').test(declaredIn)) continue;
    if (!resolveConstImport(m)) return m;
  }
  return null;
}

const externalFn = (code) => {
  for (const m of new Set([...code.matchAll(/\b([a-z]\w+)\s*\(/g)].map(x => x[1]))) {
    if (!projectFns.has(m) || FOUNDATION_FN.has(m)) continue;
    if (new RegExp('(\\n|^)\\s*[A-Za-z_][\\w<>,? ]* ' + m + '\\(').test(code)) continue; // מוגדרת-בצרור
    if (resolveFnImport(m)) continue;                       // טהורה ⇒ import אוטומטי בפליטה
    return m;
  }
  return null;
};

// ── אינדקס-שדות-מודל (עצלן+ממוזכר): מודל ⇒ Map(שדה/גטר ⇒ טיפוס) ──
const PRIM = new Set(['String', 'int', 'double', 'bool', 'num']);
const isPrim = (t) => PRIM.has((t || '').replace(/\?$/, '').trim());
const modelFieldsCache = new Map();
function modelFields(name) {
  if (modelFieldsCache.has(name)) return modelFieldsCache.get(name);
  let res = null;
  try {
    const hits = execSync(`git grep -lE 'class ${name}\\b' origin/main -- app_flutter/lib`, { cwd: BS, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
    for (const h of hits) {
      const src = execSync(`git show '${h.replace(/'/g, '')}'`, { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 24 });
      const m = src.match(new RegExp('class\\s+' + name + '\\b[^{]*\\{'));
      if (!m) continue;
      const body = stripComments(classBody(src, m.index) || '');
      if (!body) continue;
      const f = new Map();
      for (const fm of body.matchAll(/final\s+([A-Za-z_][\w<>,? ]*?)\s+([a-zA-Z_]\w*)\s*[;=]/g)) f.set(fm[2], fm[1].trim());
      for (const gm of body.matchAll(/(?:^|\n)\s*([A-Za-z_][\w<>,? ]*?)\s+get\s+([a-zA-Z_]\w*)\s*(?:=>|\{)/g)) f.set(gm[2], gm[1].trim());
      res = f; break;
    }
  } catch { }
  modelFieldsCache.set(name, res);
  return res;
}

// ── אידמפוטנטיות: פלטי-הריצה-הקודמת של המנוע-הזה נמחקים (לא-דדופ-עצמי) ──
if (fs.existsSync(OUT)) for (const f of fs.readdirSync(OUT)) {
  const p = path.join(OUT, f);
  if (f.endsWith('.dart') && fs.readFileSync(p, 'utf8').includes('מנוע-המטרות')) fs.unlinkSync(p);
}

// ── מלאי-המדף (כולל auto/ של shelf-lift) ──
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

const FLUTTER_RESERVED = new Set(['Divider','Card','Chip','Banner','Hero','TableRow','ColorSwatch','Switch','Radio','Checkbox','Slider','Stepper','Badge','Tab','Drawer','AppBar','Scaffold','ListTile','Row','Column','Stack','Text','Icon','Form','Table','Step','Material','Padding','Center','Align','Title','Actions','Element','State','Navigator','Route','Page','View','Ink','Tooltip','Dialog','SnackBar','Spacer','Placeholder','ListView','GridView','Container','SizedBox','Expanded','Flexible','Wrap','Positioned','Opacity','Transform','ClipRRect','InkWell','GestureDetector','SafeArea','Builder','Key','Size','Offset','Rect','Colors','Icons','Theme','MediaQuery','Border','BorderSide','Radius','Duration','Curve','Curves','Alignment','EdgeInsets','TextStyle','TextSpan','BoxDecoration','BoxShadow','Gradient','Image','ImageProvider','Feedback','Focus','FocusNode','Overlay','Notification']);
const ANY_LIT = /'(?:[^'\\\n]|\\.)*'/g;
const maskLits = (s) => s.replace(ANY_LIT, (m) => "'" + 'x'.repeat(m.length - 2) + "'");
const FLUTTER_POS = { Text: ['label'], SelectableText: ['label'], CfgText: ['id', 'fallback'] };

// ── אינדקס-בנאים של קובץ: מחלקה ⇒ שמות-הפרמטרים-המיקומיים (המטרות) ──
function ctorPositionals(name, body) {
  const m = body.match(new RegExp('(?:const\\s+)?' + name + '\\s*\\('));
  if (!m) return null;
  let d = 0, j = body.indexOf('(', m.index), open = j;
  for (; j < body.length; j++) { const c = body[j]; if (c === '(') d++; else if (c === ')') { d--; if (!d) break; } }
  const plist = body.slice(open + 1, j);
  const positional = [];
  let depth = 0, cur = '';
  for (const c of plist) {
    if (c === '{' || c === '[') { if (!depth) break; depth++; }
    else if (c === '(' || c === '<') depth++;
    else if (c === ')' || c === '>' || c === ']' || c === '}') depth--;
    else if (c === ',' && !depth) { positional.push(cur); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim()) positional.push(cur);
  return positional.map(p => (p.match(/this\.(\w+)/) || p.match(/(\w+)\s*$/) || [])[1]).filter(Boolean);
}

/** המטרה של ליטרל-מיקומי: הבנאי-העוטף + האינדקס ⇒ שם-הפרמטר במקור. */
function purposeOf(scan, litStart, ctorIndex) {
  let d = 0, commas = 0, named = 0, k = litStart - 1;
  for (; k >= 0; k--) {
    const c = scan[k];
    if (c === ')' || c === ']' || c === '}') d++;
    else if (c === '[' || c === '{') { if (!d) return null; d--; }
    else if (c === '(') { if (!d) break; d--; }
    else if (c === ',' && !d) commas++;
  }
  if (k < 0) return null;
  const inv = scan.slice(0, k).match(/([A-Za-z_][\w.]*)\s*$/);
  if (!inv) return null;
  const invName = inv[1].split('.')[0];
  for (const nm of scan.slice(k + 1, litStart).matchAll(/[({,]\s*[a-zA-Z_]\w*\s*:/g)) named++;
  const idx = Math.max(0, commas - named);
  const params = ctorIndex.get(invName) || FLUTTER_POS[invName];
  return params?.[idx] || null;
}

/** פירוק-תבנית: value ⇒ [{t:'txt',s}|{t:'hole',s}] · null=עמוק-מדי. */
function splitTemplate(v) {
  const parts = []; let txt = '';
  for (let i = 0; i < v.length; i++) {
    const c = v[i];
    if (c === '\\') { txt += c + (v[i + 1] || ''); i++; continue; }
    if (c !== '$') { txt += c; continue; }
    if (v[i + 1] === '{') {
      let d = 0, j = i + 1;
      for (; j < v.length; j++) { if (v[j] === "'") return null; if (v[j] === '{') d++; else if (v[j] === '}') { d--; if (!d) break; } }
      if (d) return null;
      const hole = v.slice(i, j + 1);
      if (/[֐-׿]/.test(hole)) return null;
      if (txt) parts.push({ t: 'txt', s: txt }); txt = '';
      parts.push({ t: 'hole', s: hole }); i = j;
    } else {
      const im = v.slice(i + 1).match(/^[a-zA-Z_]\w*/);
      if (!im) { txt += c; continue; }
      if (txt) parts.push({ t: 'txt', s: txt }); txt = '';
      parts.push({ t: 'hole', s: '$' + im[0] }); i += im[0].length;
    }
  }
  if (txt) parts.push({ t: 'txt', s: txt });
  return parts;
}

/** 🪢 התרת-סבך: on*-closures-עם-IO ⇒ callbacks · ref.watch ⇒ props · Consumer ⇒ Stateless.
 *  מחזיר {out, callbacks:[{prop}], watchProps:[{prop,type}], modelWatch:[{v,R}]} או {fail}. */
function untangle(body, seen, refPrefix = '') {
  let out = body;
  const callbacks = []; const watchProps = []; const modelWatch = [];
  // א. הרמת-handlers: הארגומנט on* = המטרה; הסוגר כולו ⇒ callback
  const IOISH = /Navigator\.|\bref\.|show[A-Z]\w*\(|open[A-Z]\w*\(|\bcontext\.(push|go|pop)\b|Provider\b/;
  let edits = [];
  {
    const scan = maskLits(maskComments(out));
    for (const m of [...scan.matchAll(/\b(on[A-Z]\w*)\s*:\s*/g)]) {
      const vs = m.index + m[0].length;
      const head = scan.slice(vs, vs + 24);
      const oneArg = /^\(\s*\w+\s*\)\s*(=>|\{|async)/.test(head);
      const methRef = /^_[a-z]\w*\s*[,)\]]/.test(scan.slice(vs));
      if (!/^\(\)\s*(=>|\{|async)/.test(head) && !oneArg && !methRef) continue;
      // סוף-הערך: פסיק/סוגר בעומק-0
      let d = 0, j = vs, inDone = false;
      for (; j < scan.length; j++) {
        const c = scan[j];
        if (c === '(' || c === '[' || c === '{') d++;
        else if (c === ')' || c === ']' || c === '}') { if (!d) break; d--; }
        else if (c === ',' && !d) break;
      }
      let val = scan.slice(vs, j), vlen = j - vs;
      if (methRef) { const mr = scan.slice(vs).match(/^_[a-z]\w*/); val = out.slice(vs, vs + mr[0].length); vlen = mr[0].length;
        // הפניית-מתודה: המתודה עצמה נבחנת — IO ⇒ callback; טהורה ⇒ תישאר (תיבחן כעוזר)
        const md = maskLits(maskComments(out)).match(new RegExp('[A-Za-z>\\]]\\s+' + val + '\\s*\\(')); 
        if (!md) continue; const mb = classBody(out, md.index) || '';
        if (!IOISH.test(mb)) continue;
      } else if (!IOISH.test(val)) continue;              // סוגר-טהור נשאר במקומו
      const base = m[1];
      let n = (seen.get(base) || 0) + 1; seen.set(base, n);
      const prop = n === 1 ? base : base + n;
      callbacks.push({ prop, type: oneArg ? 'ValueChanged<dynamic>' : 'VoidCallback' });
      edits.push({ start: vs, len: vlen, text: refPrefix + prop });
    }
    for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.start + e.len);
  }
  // ב. ref.watch(fooProvider) ⇒ foo (הטיפוס מהגדרת-ה-provider = המטרה)
  let fail = null;
  out = out.replace(/ref\.watch\(\s*([a-zA-Z0-9_]+Provider)\s*(?:\([^()]*\))?\s*\)/g, (mm, pv) => {
    if (fail) return mm;
    if (!providerType.has(pv)) { fail = 'provider-unknown'; return mm; }
    const t = providerType.get(pv);
    if (!t) { fail = 'provider-async'; return mm; }
    const v = pv.replace(/Provider$/, '').replace(/^_/, '');
    if (isPrim(t)) { if (!watchProps.some(x => x.prop === v)) watchProps.push({ prop: v, type: t }); }
    else if (projectClasses.has(t.replace(/\?$/, ''))) { if (!modelWatch.some(x => x.v === v)) modelWatch.push({ v, R: t.replace(/\?$/, '') }); }
    else { fail = 'provider-type'; return mm; }
    return refPrefix + v;
  });
  if (fail) return { fail };
  // ג2. מתודה-פרטית-עם-IO שאין-לה עוד קורא ⇒ נמחקת (הוחלפה ב-callback)
  let pruned = true;
  while (pruned) {
    pruned = false;
    const sc = maskLits(maskComments(out));
    for (const dm of [...sc.matchAll(/[A-Za-z>\]]\s+(_[a-z]\w*)\s*\(/g)]) {
      const nm2 = dm[1];
      const uses = [...sc.matchAll(new RegExp('\\b' + nm2 + '\\b', 'g'))].length;
      if (uses > 1) continue;                              // יש-קוראים
      const db = classBody(out, dm.index + dm[0].length - nm2.length - dm[0].match(/\s+/)[0].length - 1);
      const start = dm.index + 1;
      const b2 = classBody(out, start);
      if (!b2) continue;
      const mb = out.slice(start, start + out.slice(start).indexOf(b2) + b2.length);
      if (!/Navigator\.|\bref\.|show[A-Z]\w*\(|\bcontext\.(push|go|pop)\b/.test(mb)) continue;
      out = out.slice(0, start) + out.slice(start + mb.length);
      pruned = true; break;
    }
  }
  // ג. שאריות-חיווט ⇒ עדיין-סבוך
  const left = stripComments(out);
  if (/\bref\.|\bWidgetRef\b|Navigator\.|\bcontext\.(push|go|pop)\b/.test(left)) return { fail: 'io-left' };
  // ד. Consumer ⇒ Stateless
  out = out.replace(/extends\s+ConsumerWidget/, 'extends StatelessWidget')
           .replace(/Widget\s+build\(\s*BuildContext\s+(\w+)\s*,\s*WidgetRef\s+\w+\s*\)/, 'Widget build(BuildContext $1)');
  return { out, callbacks, watchProps, modelWatch };
}

// ── ליבת-ההרמה (per-body): עברית ⇒ props לפי מטרה · תבניות מפורקות-הפוך ──
function hoistStrings(body, ctorIndex, propBase, fb, refPrefix = '') {
  const masked = maskComments(body);
  const scan = maskLits(masked);
  const runs = [];
  let cur = null;
  for (const m of [...masked.matchAll(ANY_LIT)]) {
    if (cur && /^\s*$/.test(masked.slice(cur.end, m.index))) { cur.end = m.index + m[0].length; cur.parts.push(m[0]); }
    else { cur = { start: m.index, end: m.index + m[0].length, parts: [m[0]] }; runs.push(cur); }
  }
  const lits = runs.map(r => ({ ...r, value: r.parts.map(p => p.slice(1, -1)).join('') })).filter(r => /[֐-׿]/.test(r.value));
  if (!lits.length) return { out: body, props: [] };

  const props = []; const edits = []; const seen = new Map(propBase);
  const takeName = (name, isDefault) => {
    let n = (seen.get(name) || 0) + 1;
    const fieldRe = (p) => new RegExp('final\\s+[A-Za-z_][\\w<>?]*\\s+' + p + '\\s*;');
    while (!isDefault && fieldRe(n === 1 ? name : name + n).test(body)) n++;
    seen.set(name, n);
    return n === 1 ? name : name + n;
  };
  for (const m of lits) {
    if (/[=!]=\s*$/.test(scan.slice(0, m.start))) {
      if (fb) { edits.push({ start: m.start, len: m.end - m.start, text: fb.take(m.value) }); continue; }
      return { fail: 'logic-token' };
    }
    // מטרת-המחרוזת (זהה לרגיל ולתבנית)
    let d = 0, k = m.start - 1;
    for (; k >= 0; k--) {
      const c = scan[k];
      if (c === ')' || c === ']' || c === '}') d++;
      else if (c === '(' || c === '[' || c === '{') { if (!d) break; d--; }
      else if (c === ',' && !d) break;
    }
    const argPrefix = scan.slice(k + 1, m.start);
    let name = null, isDefault = false;
    const nm = argPrefix.match(/^\s*([a-zA-Z_]\w*)\s*:/);
    const dp = argPrefix.match(/this\.([a-zA-Z_]\w*)\s*=\s*$/);
    if (dp) { name = dp[1]; isDefault = true; }
    else if (nm && !['children', 'style', 'key'].includes(nm[1])) name = nm[1];
    else if (/(\breturn|=>)\s*$/.test(scan.slice(0, m.start).replace(/\s+$/, ' '))) name = 'text';
    else name = purposeOf(scan, m.start, ctorIndex);          // 🎯 מנוע-המטרות
    const wantsConst = fb && (!name || (/=\s*$/.test(scan.slice(0, m.start)) && !isDefault));
    if (wantsConst) {
      // 📦 קבוע-תוכן: העברית עוברת לקובץ-הדאטה, המנגנון מפנה בשם
      const cn = fb.take(m.value);
      edits.push({ start: m.start, len: m.end - m.start, text: cn });
      continue;
    }
    if (!name) return { fail: 'unnamed-string' };
    if (/=\s*$/.test(scan.slice(0, m.start)) && !isDefault) return { fail: 'default-param' };

    if (m.value.includes('$')) {
      // 🧩 תבנית: קטעי-עברית ⇒ props (או קבועי-תוכן ב-fallback), החורים נשארים מנגנון
      if (isDefault && !fb) return { fail: 'template-default' };
      const parts = splitTemplate(m.value);
      if (!parts) { if (fb) continue; return { fail: 'template-deep' }; }
      const rebuilt = parts.map(p => {
        if (p.t === 'hole' || !/[֐-׿]/.test(p.s)) return p.s;
        if (fb) return '${' + fb.take(p.s) + '}';
        const prop = takeName(name, false);
        props.push({ prop, value: p.s, isDefault: false });
        return '${' + (refPrefix ? refPrefix + prop : prop) + '}';
      }).join('');
      edits.push({ start: m.start, len: m.end - m.start, text: "'" + rebuilt + "'" });
    } else {
      const prop = takeName(name, isDefault);
      props.push({ prop, value: m.value, isDefault, start: m.start, len: m.end - m.start });
      edits.push({ start: m.start, len: m.end - m.start, text: refPrefix + prop, isDefault });
    }
  }
  // עריכות מהסוף-להתחלה
  let out = body;
  for (const e of [...edits].sort((a, b) => b.start - a.start)) {
    if (e.isDefault) {
      const eq = out.lastIndexOf('=', e.start);
      out = out.slice(0, eq).replace(/\s+$/, '') + out.slice(e.start + e.len);
    } else out = out.slice(0, e.start) + e.text + out.slice(e.start + e.len);
  }
  for (const p of props.filter(x => x.isDefault))
    out = out.replace(new RegExp('([{,(]\\s*)this\\.' + p.prop + '\\b'), '$1required this.' + p.prop);
  out = stripConstOn(out, props.map(p => p.prop));
  return { out, props };
}

// הפשטת-const מביטויים שמכילים props (לא-קבועים) — איטרטיבי
function stripConstOn(out, propNames) {
  if (!propNames.length) return out;
  const propWord = new RegExp('\\b(' + propNames.join('|') + ')\\b');
  // הצהרה (static-)const/final שהאתחול שלה נוגע-ב-prop ⇒ late final (מותר-להפנות-לשדות)
  for (const dm of [...out.matchAll(/(?<!late )(static\s+)?(const|final)(\s+[A-Za-z_][\w<>,? ]*)?\s+\w+\s*=/g)].reverse()) {
    const end = out.indexOf(';', dm.index);
    if (end < 0) continue;
    if (propWord.test(out.slice(dm.index, end)))
      out = out.slice(0, dm.index) + dm[0].replace(/^(static\s+)?(const|final)/, 'late final') + out.slice(dm.index + dm[0].length);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const cm of [...out.matchAll(/\bconst\s+(?=_?[A-Z]\w*\s*\(|\[)/g)]) {
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
  return out;
}

/** 🧬 שיטוח-מודל לפי-מטרה: `final R x;` + `x.field` ⇒ props על-שם-השדות. */
function flattenModels(body, modelCand, existingProps) {
  const dataProps = []; // {prop, type}
  let out = body;
  for (const R of modelCand) {
    const code = stripComments(out);
    if (!new RegExp('\\b' + R + '\\b').test(code)) continue;
    const fdecl = code.match(new RegExp('final\\s+' + R + '\\??\\s+([a-zA-Z_]\\w*)\\s*;'));
    if (!fdecl) return { fail: 'model-deep' };
    const v = fdecl[1];
    // ‏R מותר רק בהצהרה-הזו
    if ((code.match(new RegExp('\\b' + R + '\\b', 'g')) || []).length > 1) return { fail: 'model-deep' };
    const mf = modelFields(R);
    if (!mf) return { fail: 'model-unknown' };
    // כל שימושי v: this.v (בנאי) · v.member בלבד; member = שדה/גטר פרימיטיבי
    const usedMembers = new Set();
    const scan = maskLitsKeepInterp(out);
    for (const um of [...scan.matchAll(new RegExp('\\b' + v + '\\b', 'g'))]) {
      const before = scan.slice(Math.max(0, um.index - 8), um.index);
      const after = scan.slice(um.index + v.length);
      if (/this\.$/.test(before)) continue;                      // בנאי
      if (new RegExp('final\\s+' + R + '\\??\\s+$').test(scan.slice(0, um.index))) continue; // הצהרה
      const mm = after.match(/^\.([a-zA-Z_]\w*)/);
      if (!mm) return { fail: 'model-deep' };                    // המודל עובר-הלאה גולמי
      const t = mf.get(mm[1]);
      if (!isPrim(t)) return { fail: 'model-deep' };             // שדה-לא-פרימיטיבי/מתודה
      usedMembers.add(mm[1]);
    }
    if (!usedMembers.size) return { fail: 'model-deep' };
    for (const mem of usedMembers) {
      if (existingProps.has(mem)) return { fail: 'model-clash' };
      dataProps.push({ prop: mem, type: mf.get(mem).trim() });
      existingProps.add(mem);
    }
    // טרנספורמציה: v.member ⇒ member · הסרת-ההצהרה · הסרת this.v מהבנאי
    out = out.replace(new RegExp('\\b' + v + '\\.([a-zA-Z_]\\w*)', 'g'), '$1');
    out = out.replace(/\b(late\s+final|final|var)\s+(\w+)\s*=\s*\2\s*;/g, '$1 $2 = this.$2;');
    out = out.replace(new RegExp('\\s*final\\s+' + R + '\\??\\s+' + v + '\\s*;'), '');
    out = out.replace(new RegExp('(required\\s+)?this\\.' + v + '\\b\\s*,?'), '');
    out = out.replace(/\(\s*,/, '(').replace(/,\s*([})])/g, (s, g) => g === '}' ? ',}' : s).replace(/,\s*\)/, ')').replace(/\{\s*,/, '{');
  }
  return { out, dataProps };
}

// ── הזרקת בנאי+שדות (טיפוסיים) ──
function injectProps(body, cls, allProps) {
  const props = allProps.filter(p => !p.isDefault);
  if (!props.length) return body;
  const decls = props.map(p => `  final ${p.type || 'String'} ${p.prop};`).join('\n');
  const params = props.map(p => 'required this.' + p.prop).join(', ');
  const ctorRe = new RegExp('(const\\s+)?' + cls + '\\s*\\(');
  const cm = body.match(ctorRe);
  if (cm && !/=>/.test(body.slice(cm.index, cm.index + 20))) {
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
    let end = body.indexOf(';', j); const brace = body.indexOf('{', j);
    if (brace > 0 && (end < 0 || brace < end)) { const b2 = classBody(body, j); end = j + (b2 ? body.slice(j).indexOf(b2) + b2.length : 0); }
    if (end < 0) return null;
    return body.slice(0, open + 1) + np + body.slice(j, end + 1) + '\n' + decls + body.slice(end + 1);
  }
  const openBrace = body.indexOf('{');
  return body.slice(0, openBrace + 1) + `\n  const ${cls}({${params}});\n` + decls + body.slice(openBrace + 1);
}

// ── השחלת-props במעלה-השרשרת ──
const propType = new Map(); // שם ⇒ טיפוס (ברירת-מחדל String)
function threadProps(bundle) {
  let changed = true, guard = 0;
  while (changed && guard++ < 500) {
    changed = false;
    for (const holder of bundle) {
      for (const target of bundle) {
        if (target === holder || !target.allProps.length || target.helper) continue;
        const invRe = new RegExp('\\b' + target.name + '\\s*\\(', 'g');
        const scan = maskLits(maskComments(holder.out));
        for (const m of [...scan.matchAll(invRe)]) {
          if (/class\s+$/.test(scan.slice(Math.max(0, m.index - 8), m.index))) continue;
          let d = 0, j = scan.indexOf('(', m.index), open = j;
          for (; j < scan.length; j++) { const c = scan[j]; if (c === '(') d++; else if (c === ')') { d--; if (!d) break; } }
          const argText = scan.slice(open + 1, j);
          if (argText.includes('this.')) continue;              // הצהרת-בנאי — לא אתר-קריאה!
          // תוויות בעומק-0 בלבד (ארגומנט-מקונן אינו מספק את הקריאה-החיצונית!)
          const given = new Set();
          { let dep = 0, s0 = 0;
            const seg = (a, b) => { const mm = argText.slice(a, b).match(/^\s*([a-zA-Z_]\w*)\s*:/); if (mm) given.add(mm[1]); };
            for (let k2 = 0; k2 <= argText.length; k2++) {
              const c2 = argText[k2];
              if (c2 === '(' || c2 === '[' || c2 === '{') dep++;
              else if (c2 === ')' || c2 === ']' || c2 === '}') dep--;
              else if ((c2 === ',' && !dep) || k2 === argText.length) { seg(s0, k2); s0 = k2 + 1; }
            }
          }
          const missing = target.allProps.filter(p => !given.has(p));
          if (!missing.length) continue;
          const tt = argText.replace(/\s+$/, '');
          const insert = (!tt ? '' : tt.endsWith(',') ? ' ' : ', ') + missing.map(p => `${p}: ${p}`).join(', ');
          holder.out = holder.out.slice(0, j) + insert + holder.out.slice(j);
          for (const p of missing) if (!holder.allProps.includes(p)) { holder.allProps.push(p); holder.threaded.push(p); }
          changed = true; break;
        }
        if (changed) break;
      }
      if (changed) break;
    }
  }
  return guard < 500;
}

// ── המעבר ──
const report = { lifted: [], skipped: {}, fileLifted: [], fileSkipped: {} };
const screensWithSkips = new Set();
const skip = (why, id) => { (report.skipped[why] ??= []).push(id); screensWithSkips.add(id.split(':')[0]); };
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
  const widgetKind = new Map((map.widgets || []).map(w => [w.name, w]));
  const classes = new Map();
  for (const m of src.matchAll(/class\s+([A-Za-z0-9_]+)(?:<[^{]*>)?(?:\s+extends\s+([A-Za-z0-9_<>, ]+?))?\s*\{/g)) {
    const b = classBody(src, m.index);
    if (b) classes.set(m[1], { body: b, ext: (m[2] || '').trim() });
  }
  const ctorIndex = new Map();
  for (const [n, c] of classes) { const ps = ctorPositionals(n, c.body); if (ps) ctorIndex.set(n, ps); }
  const helpers = new Map(); // _name ⇒ source (עוזרים-פרטיים עליונים)
  for (const m of src.matchAll(/(?:^|\n)(?:const|final)\s+(?:[A-Za-z_<>\[\], ]+\s+)?(_[a-z]\w*)\s*=/g)) {
    const line = src.indexOf(';', m.index);
    if (line > 0 && line - m.index < 2000) helpers.set(m[1], src.slice(m.index, line + 1).trim());
  }
  for (const m of src.matchAll(/(?:^|\n)[A-Za-z_][\w<>\[\], ?]*\s+(_[a-z]\w*)\s*\(/g)) {
    // סריקה-מאוזנת: פרמטרים (גם-מקוננים) ⇒ גוף ({...} או =>...;)
    let j = src.indexOf('(', m.index + m[0].length - 1), d = 0;
    for (; j < src.length; j++) { const c = src[j]; if (c === '(') d++; else if (c === ')') { d--; if (!d) break; } }
    const after = src.slice(j + 1).match(/^\s*(=>|\{|async)/);
    if (!after) continue;
    let end;
    if (after[1] === '{') { const b = classBody(src, j); end = b ? j + src.slice(j).indexOf('{') + b.length : -1; }
    else { end = src.indexOf(';', j); }
    if (end < 0) continue;
    const full = src.slice(m.index, end + 1).trim();
    if (full.split('\n').length <= 80) helpers.set(m[1], full);
  }

  for (const w of map.widgets || []) {
    const id = screen + ':' + w.name;
    if (!['StatelessWidget', 'ConsumerWidget'].includes(w.kind)) continue;
    if (w.dataClean && w.pure && w.kind === 'StatelessWidget') continue;  // אלה של shelf-lift
    const main = classes.get(w.name);
    if (!main) { skip('no-decl', id); continue; }

    // ── בניית-הצרור + איסוף מועמדי-מודל ──
    const bundle = [{ name: w.name, body: main.body }];
    const modelCand = new Set();
    let ok = true, guard = 0;
    while (ok && guard++ < 6) {
      const inB = new Set(bundle.map(b => b.name));
      const code = stripComments(bundle.map(b => b.body).join('\n'));
      const refs = new Set([...code.matchAll(/\b(_?[A-Z]\w+|_[a-z]\w*)\b/g)].map(x => x[1]));
      for (const b of bundle) refs.delete(b.name);
      let grew = false;
      for (const r of refs) {
        if (inB.has(r) || modelCand.has(r)) continue;
        if (classes.has(r)) {
          const wk = widgetKind.get(r);
          if (bundle.length >= 10 || (wk && !['StatelessWidget', 'ConsumerWidget'].includes(wk.kind))) { skip('sibling-class', id); ok = false; break; }
          bundle.push({ name: r, body: classes.get(r).body, privatize: !r.startsWith('_') }); grew = true;
        } else if (/^_[a-z]/.test(r)) {
          const declared = new RegExp('(^|\\n)\\s*(static\\s+)?(const\\s+|final\\s+|late\\s+|var\\s+)?[A-Za-z_][\\w<>,?\\[\\] ]*\\s+' + r + '\\s*[=;({]|[A-Za-z>\\]]\\s+' + r + '\\s*\\(').test(code);
          if (declared) continue;
          if (!helpers.has(r) || bundle.length + 1 >= 12) { skip('private-dep', id); ok = false; break; }
          const hsrc = helpers.get(r);
          if (HEB_STR.test(stripComments(hsrc)) || IO_PAT.test(stripComments(hsrc))) { skip('dirty-helper', id); ok = false; break; }
          bundle.push({ name: r, body: hsrc, helper: true }); grew = true;
        } else if (/^_[A-Z]/.test(r)) { skip('private-dep', id); ok = false; break; }
        else if (!FOUNDATION.has(r) && projectClasses.has(r)) modelCand.add(r);  // 🧬 מועמד-שיטוח
      }
      if (!grew) break;
    }
    if (!ok) continue;

    // ── 🪢 התרת-סבך פר-גוף (לא-עוזרים) ──
    const cbSeen = new Map();
    let unFail = null; const extraModels = [];
    for (const b of bundle) {
      if (b.helper) { b.untangled = []; continue; }
      const u = untangle(b.body, cbSeen);
      if (u.fail) { unFail = u.fail; break; }
      b.body = u.out;
      b.untangled = [...u.callbacks, ...u.watchProps];
      for (const mw of u.modelWatch) {
        if (b !== bundle[0]) { unFail = 'model-deep'; break; }
        // הצהרה-סינתטית ⇒ שיטוח-המודלים הקיים יפרק לשדות
        b.body = b.body.replace('{', '{\n  final ' + mw.R + ' ' + mw.v + ';', );
        extraModels.push(mw.R);
      }
      if (unFail) break;
    }
    if (unFail) { skip(unFail, id); continue; }
    const allRaw = stripComments(bundle.map(b => b.body).join('\n'));
    if (IO_PAT.test(allRaw) || RIVERPOD.test(allRaw)) { skip('io', id); continue; }
    for (const r of extraModels) modelCand.add(r);
    const exFn = externalFn(allRaw);
    if (exFn) { skip('project-fn', id + '⇒' + exFn); continue; }
    const uc = unresolvedConst(allRaw, allRaw);
    if (uc) { skip('project-const', id + '⇒' + uc); continue; }

    // ── שיטוח-מודלים (שורש-בלבד; מודל באח ⇒ עמוק) ──
    let dataProps = [];
    if (modelCand.size) {
      const nonRoot = stripComments(bundle.slice(1).map(b => b.body).join('\n'));
      if ([...modelCand].some(r => new RegExp('\\b' + r + '\\b').test(nonRoot))) { skip('model-deep', id); continue; }
      const fl = flattenModels(bundle[0].body, modelCand, new Set());
      if (fl.fail) { skip(fl.fail, id); continue; }
      bundle[0].body = fl.out;
      dataProps = fl.dataProps;
    }
    const fields = [...stripComments(bundle[0].body).matchAll(/final\s+([A-Za-z_][\w<>,\s]*\??)\s+[a-zA-Z_]\w*\s*;/g)].map(x => x[1].trim());
    if (fields.some(t => !okType(t))) { skip('model-prop', id); continue; }

    // ── ליטוש כל גופי-הצרור (namespace משותף; שמות-המודל שמורים) ──
    const propBase = new Map(dataProps.map(p => [p.prop, 1]));
    let fail = null;
    for (const b of bundle) {
      const h = hoistStrings(b.body, ctorIndex, propBase);
      if (h.fail) { fail = h.fail; break; }
      b.out = h.out; b.props = h.props;
      b.allProps = [...h.props.filter(p => !p.isDefault).map(p => p.prop), ...(b.untangled || []).map(p => p.prop)]; b.threaded = [];
      if (b === bundle[0]) b.allProps.push(...dataProps.map(p => p.prop));
      for (const p of b.untangled || []) propType.set(p.prop, p.type);
      for (const p of h.props) { propBase.set(p.prop.replace(/\d+$/, ''), Math.max(propBase.get(p.prop.replace(/\d+$/, '')) || 0, +(p.prop.match(/(\d+)$/)?.[1] || 1))); propType.set(p.prop, 'String'); }
    }
    if (fail) { skip(fail, id); continue; }
    for (const p of dataProps) propType.set(p.prop, p.type);
    if (HEB_STR.test(stripComments(bundle.map(b => b.out).join('\n')))) { skip('hebrew-left', id); continue; }

    // props-חופשיים: prop-של-הצרור שמופיע בגוף-אחר בלי-הצהרה ⇒ נרשם-אצלו (ההשחלה תשלים)
    {
      const allP = new Set(bundle.flatMap(b => b.allProps));
      for (const b of bundle) {
        if (b.helper) continue;
        const sc = maskLitsKeepInterp(b.out);
        for (const pn of allP) {
          if (b.allProps.includes(pn)) continue;
          if (!new RegExp('\\b' + pn + '\\b(?!\\s*:)').test(sc)) continue;   // תווית-ארגומנט אינה-שימוש
          if (new RegExp('(final|var|const)\\s+[\\w<>,? ]*\\b' + pn + '\\s*[=;]|this\\.' + pn + '\\b|\\(\\s*' + pn + '\\s*\\)|[({,]\\s*' + pn + '\\s*=>').test(sc)) continue; // מקומי/פרמטר
          b.allProps.push(pn); b.threaded.push(pn);
        }
      }
    }
    // ── השחלה + הזרקה ──
    if (!threadProps(bundle)) { skip('thread-cycle', id); continue; }
    let bad = false;
    for (const b of bundle) {
      if (b.helper) { b.final = b.out; continue; }
      const inj = injectProps(b.out, b.name, [
        ...b.props, ...(b === bundle[0] ? dataProps : []), ...(b.untangled || []),
        ...b.threaded.map(p => ({ prop: p, type: propType.get(p) || 'String' })),
      ]);
      if (!inj) { bad = true; break; }
      b.final = stripConstOn(inj, b.allProps);
    }
    if (bad) { skip('ctor-shape', id); continue; }
    const rootProps = bundle[0].allProps;
    if (!rootProps.length) { skip('no-props', id); continue; }

    // ── דדופ + שם ──
    const joinedAll = bundle.map(b => b.final).join('\n\n');
    const hash = blind(joinedAll, w.name);
    if (shelfHashes.has(hash)) { skip('already-on-shelf', id); continue; }
    if (liftedHashes.has(hash)) { liftedHashes.get(hash).also.push(id); continue; }
    let pub = w.name.replace(/^_/, '');
    if (usedNames.has(pub) || FLUTTER_RESERVED.has(pub)) pub = screenPascal(screen) + pub;
    if (usedNames.has(pub)) { skip('name-collision', id); continue; }
    usedNames.add(pub);
    const allContent = bundle.flatMap(b => b.props.map(p => ({ prop: p.prop, value: p.value })));
    liftedHashes.set(hash, { id, pub, screen, name: w.name, joined: joinedAll, content: allContent, nBundle: bundle.length, nData: dataProps.length, rootProps, privatized: bundle.filter(b => b.privatize).map(b => b.name), also: [] });
  }
}


// ── 🗂️ מעבר-הקובץ (file-lift) — "פירוק מלא": מסך שנכשל ברמת-widget מורם כקובץ-שלם-נקי.
//    הכול-בצרור מעצם-ההגדרה (אפס תלות-פרטית/אחים) · עברית-בלתי-prop-בילית ⇒ קבוע-תוכן מיובא ──
const FOUT = path.join(SHELF, 'screens_clean');
fs.rmSync(FOUT, { recursive: true, force: true });
fs.mkdirSync(FOUT, { recursive: true });
const hoistAllConst = (text, fb) => text.replace(/'((?:[^'\\\n]|\\.)*[֐-׿](?:[^'\\\n]|\\.)*)'/g, (mm, v) => {
  if (v.includes('$')) { const parts = splitTemplate(v); if (!parts) return mm;
    return "'" + parts.map(pp => pp.t === 'hole' || !/[֐-׿]/.test(pp.s) ? pp.s : '${' + fb.take(pp.s) + '}').join('') + "'"; }
  return fb.take(v);
});
for (const screen of [...screensWithSkips].sort()) {
  const srcPath = path.join(SCRATCH, screen + '.dart');
  if (!fs.existsSync(srcPath)) continue;
  const src = fs.readFileSync(srcPath, 'utf8');
  const fskip = (why) => (report.fileSkipped[why] ??= []).push(screen);
  const decls = [...src.matchAll(/class\s+([A-Za-z0-9_]+)(?:<[^{]*>)?(?:\s+extends\s+([A-Za-z0-9_<>, ]+?))?\s*\{/g)]
    .map(m => ({ name: m[1], ext: (m[2] || '').trim(), idx: m.index, body: classBody(src, m.index) })).filter(c => c.body);
  for (const c of decls) {
    c.ext = c.ext.replace(/^ConsumerStatefulWidget$/, 'StatefulWidget').replace(/^ConsumerState</, 'State<');
    c.body = c.body.replace(/extends\s+ConsumerStatefulWidget/, 'extends StatefulWidget')
                   .replace(/extends\s+ConsumerState<([^>]+)>/, 'extends State<$1>')
                   .replace(/ConsumerState<([^>]+)>\s+createState\(\)/, 'State<$1> createState()');
  }
  // rest = הקובץ בלי imports/exports ובלי גופי-המחלקות (עוזרים-עליונים verbatim)
  let rest = src;
  for (const c of [...decls].sort((a, b) => b.idx - a.idx)) rest = rest.slice(0, c.idx) + rest.slice(c.idx + rest.slice(c.idx).indexOf(c.body) + c.body.length);
  rest = rest.replace(/(^|\n)(import|export|part)[^\n]*/g, '');
  rest = rest.replace(/(^|\n)final\s+[_a-z]\w*Provider\s*=[^;]*;/g, '').trim();
  const ctorIndex = new Map();
  for (const c of decls) { const ps = ctorPositionals(c.name, c.body); if (ps) ctorIndex.set(c.name, ps); }
  // קבועי-תוכן: ערך-זהה ⇒ קבוע-אחד
  const constByVal = new Map(); let cn = 0; const constLines = [];
  const base = snake(screenPascal(screen));
  const fb = { take: (v) => { if (constByVal.has(v)) return constByVal.get(v);
    const name = base + '_t' + (++cn); constByVal.set(v, name);
    constLines.push("const String " + name + " = '" + v + "';"); return name; } };

  // ── התרה + שיטוח + הרמה פר-מחלקה ──
  const bundle = decls.map(c => ({ name: c.name, body: c.body, ext: c.ext }));
  for (const b of bundle) {
    const sm = b.ext.match(/^State<\s*(\w+)\s*>/);
    if (sm) { b.holder = bundle.find(x => x.name === sm[1]); if (!b.holder) { b.holder = null; } }
  }
  if (bundle.some(b => /^State</.test(b.ext) && !b.holder)) { fskip('orphan-state'); continue; }
  const cbSeen = new Map(); const propBase = new Map();
  let fail = null; const flatProps = new Set();
  for (const b of bundle) {
    const pref = b.holder ? 'widget.' : '';
    const u = untangle(b.body, cbSeen, pref);
    if (u.fail) { fail = u.fail; break; }
    b.body = u.out; b.untangled = [...u.callbacks, ...u.watchProps];
    for (const mw of u.modelWatch) { b.body = b.body.replace('{', '{\n  final ' + mw.R + ' ' + mw.v + ';'); }
    // שיטוח כל המודלים המופיעים במחלקה-זו
    const mc = new Set([...stripComments(b.body).matchAll(/\b([A-Z]\w+)\b/g)].map(x => x[1])
      .filter(r => !FOUNDATION.has(r) && projectClasses.has(r) && !decls.some(d => d.name === r)));
    if (mc.size) {
      if (b.holder) { fail = 'model-in-state'; break; }
      const fl = flattenModels(b.body, mc, flatProps);
      if (fl.fail) { fail = fl.fail; break; }
      b.body = fl.out; b.untangled.push(...fl.dataProps);
    }
    const h = hoistStrings(b.body, ctorIndex, propBase, fb, pref);
    if (h.fail) { fail = h.fail; break; }
    b.out = h.out; b.props = h.props;
    // props-של-State שייכים למחזיק (widget.p) — ההזרקה והרישום אצלו
    if (b.holder) {
      (b.holder.extraProps ??= []).push(...h.props.filter(pp => !pp.isDefault), ...b.untangled);
      b.props = []; b.untangled = []; b.allProps = [];
    } else {
      b.allProps = [...h.props.filter(pp => !pp.isDefault).map(pp => pp.prop), ...b.untangled.map(pp => pp.prop)];
    }
    b.threaded = [];
    for (const pp of [...h.props, ...(b.untangled || [])]) propType.set(pp.prop, pp.type || 'String');
  }
  if (fail) { fskip(fail); continue; }
  for (const b of bundle) if (b.extraProps) {
    b.props = [...(b.props || []), ...b.extraProps.filter(pp => pp.value !== undefined)];
    b.untangled = [...(b.untangled || []), ...b.extraProps.filter(pp => pp.value === undefined)];
    b.allProps.push(...b.extraProps.map(pp => pp.prop));
    for (const pp of b.extraProps) propType.set(pp.prop, pp.type || 'String');
  }
  const restClean = hoistAllConst(rest, fb);
  const joinedRaw = restClean + '\n' + bundle.map(b => b.out).join('\n');
  if (HEB_STR.test(stripComments(joinedRaw))) { fskip('hebrew-left'); continue; }
  if (RIVERPOD.test(stripComments(joinedRaw)) || IO_PAT.test(stripComments(joinedRaw))) { fskip('io-left'); continue; }
  const exFn = externalFn(stripComments(joinedRaw));
  if (exFn) { fskip('project-fn⇒' + exFn); continue; }
  if (!threadProps(bundle)) { fskip('thread-cycle'); continue; }
  let bad = false;
  for (const b of bundle) {
    const inj = injectProps(b.out, b.name, [...b.props, ...b.untangled, ...b.threaded.map(pp => ({ prop: pp, type: propType.get(pp) || 'String' }))]);
    if (!inj) { bad = true; break; }
    b.final = stripConstOn(inj, b.allProps);
  }
  if (bad) { fskip('ctor-shape'); continue; }

  // ── פליטה + שער-עצמי ──
  const joined = restClean + '\n\n' + bundle.map(b => b.final).join('\n\n');
  const extras = inferImports(stripComments(joined));
  for (const [cls2, imp] of FOUNDATION) if (new RegExp('\\b' + cls2 + '\\b').test(stripComments(joined))) extras.unshift(imp);
  for (const [fn2, imp] of fnImportCache) if (imp && new RegExp('\\b' + fn2 + '\\s*\\(').test(stripComments(joined)) && !extras.includes(imp)) extras.push(imp);
  if (constLines.length) extras.push("import '../../dart-data-bs/auto/" + screen + "_content.dart';");
  const outFile = path.join(FOUT, screen + '.dart');
  const code = `// 🗂️ הורם ע"י מעבר-הקובץ (data-lift file) — הקובץ-כולו נקי: מנגנון-בלבד, אל תערוך ידנית.
// מוצא: ${screen}.dart (בנייה-חכמה main) · ${bundle.length} מחלקות · ${constLines.length} קבועי-תוכן
import 'package:flutter/material.dart';
${extras.join('\n')}${extras.length ? '\n' : ''}
${joined}
`;
  fs.writeFileSync(outFile, code);
  try {
    const chk = execFileSync('node', [path.join(ROOT, 'machtzev/carve/screen-decomp.mjs'), outFile], { encoding: 'utf8' });
    if (/⚠️ טהורי-IO אך עם דאטה-צרובה/.test(chk) || !/ש5 סקציות\/מחוברים: 0/.test(chk)) throw new Error('gate');
    (contentByScreen.get(screen) ?? contentByScreen.set(screen, []).get(screen)).push(...constLines);
    report.fileLifted.push({ screen, classes: bundle.length, consts: constLines.length });
  } catch { fs.unlinkSync(outFile); fskip('failed-self-gate'); }
}

// ── פליטה + שער-עצמי + שימור ──
for (const L of [...liftedHashes.values()].sort((a, b) => a.pub.localeCompare(b.pub))) {
  const file = path.join(OUT, snake(L.pub) + '.dart');
  if (fs.existsSync(file)) { skip('file-collision', L.id); continue; }
  let joined = L.joined.replaceAll(L.name, L.pub);
  joined = joined.replace(/(\n)[ \t]*\/[ \t]*(?=\n|$)/g, '$1');
  for (const pn of L.privatized || []) if (!joined.includes('_' + pn)) joined = joined.replaceAll(pn, '_' + pn);
  // מחלקה עם חבר-מופשט (getter/מתודה בלי-גוף) חייבת abstract
  joined = joined.replace(/(^|\n)(class\s+\w+\s*\{[^}]*?\b\w[\w<>,? ]*\s+get\s+\w+\s*;)/g, (mm, a, b2) => a + 'abstract ' + b2);
  const extras = inferImports(stripComments(joined));
  for (const [cn2, imp] of constImportCache) if (imp && new RegExp("(?<![.\\w'])" + cn2 + '\\b').test(stripComments(joined)) && !extras.includes(imp)) extras.push(imp);
  for (const [cls, imp] of FOUNDATION) if (new RegExp('\\b' + cls + '\\b').test(stripComments(joined))) extras.unshift(imp);
  for (const [fn, imp] of FOUNDATION_FN) if (new RegExp('\\b' + fn + '\\s*\\(').test(stripComments(joined)) && !extras.includes(imp)) extras.push(imp);
  for (const [fn, imp] of fnImportCache) if (imp && new RegExp('\\b' + fn + '\\s*\\(').test(stripComments(joined)) && !extras.includes(imp)) extras.push(imp);
  const also = L.also.length ? `\n// משרת-גם (זהה-מבנית): ${L.also.join(' · ')}` : '';
  const code = `// 🧽 לוטש ע"י מנוע-המטרות (data-lift v3) — דאטה/מודל/תבנית הורמו ל-props לפי מטרתם, אל תערוך ידנית.
// מוצא: ${L.id} (בנייה-חכמה main) · צרור-${L.nBundle}${L.nData ? ` · מודל-שוטח: ${L.nData} שדות` : ''} · props-שורש: ${L.rootProps.join(', ')}
// התוכן: new/dart-data-bs/auto/${L.screen}_content.dart${also}
import 'package:flutter/material.dart';
${extras.join('\n')}${extras.length ? '\n' : ''}
${joined}
`;
  fs.writeFileSync(file, code);
  try {
    const chk = execFileSync('node', [path.join(ROOT, 'machtzev/carve/screen-decomp.mjs'), file], { encoding: 'utf8' });
    if (/⚠️ טהורי-IO אך עם דאטה-צרובה/.test(chk)) throw new Error('לא-dataClean');
    (contentByScreen.get(L.screen) ?? contentByScreen.set(L.screen, []).get(L.screen))
      .push(...L.content.map(p => `const String ${snake(L.pub)}_${snake(p.prop)} = '${p.value}';`));
    report.lifted.push({ atom: L.pub, from: L.id, bundle: L.nBundle, props: L.content.length, model: L.nData, serves: 1 + L.also.length });
  } catch { fs.unlinkSync(file); skip('failed-self-gate', L.id); }
}
for (const [screen, lines] of [...contentByScreen.entries()].sort()) {
  fs.writeFileSync(path.join(CONTENT_OUT, screen + '_content.dart'),
    `// 📦 דאטה · תוכן-שהורם ע"י data-lift מ-${screen} — verbatim מהמקור, אל תערוך ידנית.\n${lines.join('\n')}\n`);
}

const fSkipN = Object.values(report.fileSkipped).reduce((a, v) => a + v.length, 0);
console.log(`🗂️ מעבר-הקובץ · הורמו-שלמים: ${report.fileLifted.length} מסכים · נדחו: ${fSkipN}`);
for (const [why, ids] of Object.entries(report.fileSkipped).sort((a, b) => b[1].length - a[1].length)) console.log(`   ⏭️ ${why}: ${ids.length}`);
const skippedN = Object.values(report.skipped).reduce((a, v) => a + v.length, 0);
const strings = report.lifted.reduce((a, x) => a + x.props, 0);
const modeled = report.lifted.filter(x => x.model).length;
fs.writeFileSync(path.join(ROOT, 'screens-seed/data-lift-report.json'), JSON.stringify(report, null, 1));
console.log(`🧽 מנוע-המטרות v3 · לוטשו: ${report.lifted.length} widgets (${strings} מחרוזות⇒props · ${modeled} משוטחי-מודל · משרתים ${report.lifted.reduce((a, x) => a + x.serves, 0)}) · נדחו: ${skippedN}`);
for (const [why, ids] of Object.entries(report.skipped).sort((a, b) => b[1].length - a[1].length)) console.log(`   ⏭️ ${why}: ${ids.length}`);
console.log('⇒ new/dart-ui-bs/auto/ + new/dart-data-bs/auto/ + screens-seed/data-lift-report.json');
