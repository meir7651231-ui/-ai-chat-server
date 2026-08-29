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
import { inferImports, classBody, stripComments, maskComments, HEB_STR, IO_PAT, RIVERPOD, blind, snake, screenPascal, okType, FOUNDATION, FOUNDATION_FN } from './lift-lib.mjs';
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
  for (const m of defs.matchAll(/final ([a-z]\w*Provider) = (Provider|StateProvider|StateNotifierProvider|FutureProvider|StreamProvider)(?:<([^>]+)>)?/g)) {
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
function untangle(body, seen) {
  let out = body;
  const callbacks = []; const watchProps = []; const modelWatch = [];
  // א. הרמת-handlers: הארגומנט on* = המטרה; הסוגר כולו ⇒ callback
  const IOISH = /Navigator\.|\bref\.|show[A-Z]\w*\(|open[A-Z]\w*\(|\bcontext\.(push|go|pop)\b|Provider\b/;
  let edits = [];
  {
    const scan = maskLits(maskComments(out));
    for (const m of [...scan.matchAll(/\b(on[A-Z]\w*)\s*:\s*/g)]) {
      const vs = m.index + m[0].length;
      const head = scan.slice(vs, vs + 12);
      if (!/^\(\)\s*(=>|\{|async)/.test(head)) continue;
      // סוף-הערך: פסיק/סוגר בעומק-0
      let d = 0, j = vs, inDone = false;
      for (; j < scan.length; j++) {
        const c = scan[j];
        if (c === '(' || c === '[' || c === '{') d++;
        else if (c === ')' || c === ']' || c === '}') { if (!d) break; d--; }
        else if (c === ',' && !d) break;
      }
      const val = scan.slice(vs, j);
      if (!IOISH.test(val)) continue;                     // סוגר-טהור נשאר במקומו
      const base = m[1];
      let n = (seen.get(base) || 0) + 1; seen.set(base, n);
      const prop = n === 1 ? base : base + n;
      callbacks.push({ prop, type: 'VoidCallback' });
      edits.push({ start: vs, len: j - vs, text: prop });
    }
    for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.text + out.slice(e.start + e.len);
  }
  // ב. ref.watch(fooProvider) ⇒ foo (הטיפוס מהגדרת-ה-provider = המטרה)
  let fail = null;
  out = out.replace(/ref\.watch\(\s*([a-zA-Z0-9_]+Provider)\s*\)/g, (mm, pv) => {
    if (fail) return mm;
    if (!providerType.has(pv)) { fail = 'provider-unknown'; return mm; }
    const t = providerType.get(pv);
    if (!t) { fail = 'provider-async'; return mm; }
    const v = pv.replace(/Provider$/, '');
    if (isPrim(t)) { if (!watchProps.some(x => x.prop === v)) watchProps.push({ prop: v, type: t }); }
    else if (projectClasses.has(t.replace(/\?$/, ''))) { if (!modelWatch.some(x => x.v === v)) modelWatch.push({ v, R: t.replace(/\?$/, '') }); }
    else { fail = 'provider-type'; return mm; }
    return v;
  });
  if (fail) return { fail };
  // ג. שאריות-חיווט ⇒ עדיין-סבוך
  const left = stripComments(out);
  if (/\bref\.|\bWidgetRef\b|Navigator\.|\bcontext\.(push|go|pop)\b/.test(left)) return { fail: 'io-left' };
  // ד. Consumer ⇒ Stateless
  out = out.replace(/extends\s+ConsumerWidget/, 'extends StatelessWidget')
           .replace(/Widget\s+build\(\s*BuildContext\s+(\w+)\s*,\s*WidgetRef\s+\w+\s*\)/, 'Widget build(BuildContext $1)');
  return { out, callbacks, watchProps, modelWatch };
}

// ── ליבת-ההרמה (per-body): עברית ⇒ props לפי מטרה · תבניות מפורקות-הפוך ──
function hoistStrings(body, ctorIndex, propBase) {
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
    if (/[=!]=\s*$/.test(scan.slice(0, m.start))) return { fail: 'logic-token' };
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
    if (!name) return { fail: 'unnamed-string' };
    if (/=\s*$/.test(scan.slice(0, m.start)) && !isDefault) return { fail: 'default-param' };

    if (m.value.includes('$')) {
      // 🧩 תבנית: קטעי-עברית ⇒ props, החורים נשארים מנגנון
      if (isDefault) return { fail: 'template-default' };
      const parts = splitTemplate(m.value);
      if (!parts) return { fail: 'template-deep' };
      const rebuilt = parts.map(p => {
        if (p.t === 'hole' || !/[֐-׿]/.test(p.s)) return p.s;
        const prop = takeName(name, false);
        props.push({ prop, value: p.s, isDefault: false });
        return '${' + prop + '}';
      }).join('');
      edits.push({ start: m.start, len: m.end - m.start, text: "'" + rebuilt + "'" });
    } else {
      const prop = takeName(name, isDefault);
      props.push({ prop, value: m.value, isDefault, start: m.start, len: m.end - m.start });
      edits.push({ start: m.start, len: m.end - m.start, text: prop, isDefault });
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
    const scan = maskLits(maskComments(out));
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
  while (changed && guard++ < 12) {
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
          const missing = target.allProps.filter(p => !new RegExp('\\b' + p + '\\s*:').test(argText));
          if (!missing.length) continue;
          const insert = (argText.trim() ? ', ' : '') + missing.map(p => `${p}: ${p}`).join(', ');
          holder.out = holder.out.slice(0, j) + insert + holder.out.slice(j);
          for (const p of missing) if (!holder.allProps.includes(p)) { holder.allProps.push(p); holder.threaded.push(p); }
          changed = true; break;
        }
        if (changed) break;
      }
      if (changed) break;
    }
  }
  return guard < 12;
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
          if (!r.startsWith('_') || bundle.length >= 10 || (wk && !['StatelessWidget', 'ConsumerWidget'].includes(wk.kind))) { skip('sibling-class', id); ok = false; break; }
          bundle.push({ name: r, body: classes.get(r).body }); grew = true;
        } else if (/^_[a-z]/.test(r)) {
          const declared = new RegExp('(final|var|const|void|double|int|String|bool|Widget|Color|late)\\s+' + r + '\\b|[A-Za-z>]\\s+' + r + '\\s*\\(').test(code);
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
    if (usedNames.has(pub)) pub = screenPascal(screen) + pub;
    if (usedNames.has(pub)) { skip('name-collision', id); continue; }
    usedNames.add(pub);
    const allContent = bundle.flatMap(b => b.props.map(p => ({ prop: p.prop, value: p.value })));
    liftedHashes.set(hash, { id, pub, screen, name: w.name, joined: joinedAll, content: allContent, nBundle: bundle.length, nData: dataProps.length, rootProps, also: [] });
  }
}

// ── פליטה + שער-עצמי + שימור ──
for (const L of [...liftedHashes.values()].sort((a, b) => a.pub.localeCompare(b.pub))) {
  const file = path.join(OUT, snake(L.pub) + '.dart');
  if (fs.existsSync(file)) { skip('file-collision', L.id); continue; }
  let joined = L.joined.replaceAll(L.name, L.pub);
  const extras = inferImports(stripComments(joined));
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

const skippedN = Object.values(report.skipped).reduce((a, v) => a + v.length, 0);
const strings = report.lifted.reduce((a, x) => a + x.props, 0);
const modeled = report.lifted.filter(x => x.model).length;
fs.writeFileSync(path.join(ROOT, 'screens-seed/data-lift-report.json'), JSON.stringify(report, null, 1));
console.log(`🧽 מנוע-המטרות v3 · לוטשו: ${report.lifted.length} widgets (${strings} מחרוזות⇒props · ${modeled} משוטחי-מודל · משרתים ${report.lifted.reduce((a, x) => a + x.serves, 0)}) · נדחו: ${skippedN}`);
for (const [why, ids] of Object.entries(report.skipped).sort((a, b) => b[1].length - a[1].length)) console.log(`   ⏭️ ${why}: ${ids.length}`);
console.log('⇒ new/dart-ui-bs/auto/ + new/dart-data-bs/auto/ + screens-seed/data-lift-report.json');
