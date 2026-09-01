#!/usr/bin/env node
/** 🔌 מחצב · מחולל-הלוחות (board-gen) — חוזה: BOARD-GEN-CONTRACT.md.
 *  לכל מסך-מורכב: לוח-ConsumerWidget שמחווט אותו למקורות-החיים — הכול נגזר מהמקור.
 *  שימוש: node board-gen.mjs [screens-dir] */
import fs from 'node:fs';
import path from 'node:path';
import { classBody, stripComments, maskComments, snake, loopContext, parseCallArgs, maskLitsKeepInterp } from './lift-lib.mjs';
const ROOT = new URL('../../', import.meta.url).pathname;
const SCRATCH = process.argv[2] || '/tmp/genesis-all-screens';
const SHELF = path.join(ROOT, 'new/dart-ui-bs');
const MANIFESTS = path.join(ROOT, 'screens-seed/manifests');
const OUT = path.join(ROOT, 'new/dart-boards-bs');
const ANY_LIT = /'(?:[^'\\\n]|\\.)*'/g;
const maskLits = (s) => s.replace(ANY_LIT, (m) => "'" + 'x'.repeat(m.length - 2) + "'");

// ── אינדקס-מוצא: אטום ⇒ מסך-מקור:widget (שני הפורמטים) ──
const atomOrigin = new Map();
for (const f of fs.readdirSync(SHELF, { recursive: true }).map(String)) {
  const p = path.join(SHELF, f);
  if (!f.endsWith('.dart') || !fs.statSync(p).isFile()) continue;
  const src = fs.readFileSync(p, 'utf8');
  const cm = src.match(/class\s+([A-Za-z0-9]+)\s+extends\s+(?:StatelessWidget|StatefulWidget)/);
  if (!cm) continue;
  const om = src.match(/\/\/ מוצא: ([\w:]+) /);
  const om2 = src.match(/\/\/ מוצא: (\w+)\.dart[^\n]*?·\s*(_?[A-Za-z0-9]+)/);
  if (om && om[1].includes(':')) atomOrigin.set(cm[1], om[1]);
  else if (om2) atomOrigin.set(cm[1], om2[1] + ':' + om2[2]);
}

// ── אינדקס מזהים-ציבוריים-פרויקטליים (פונקציות/קבועים עליונים) — פתירים-בלוח דרך imports ──
import { execSync } from 'node:child_process';
const BS = '/home/user/buildsmart';
let projectPub = new Set();
try {
  const dump = execSync("git grep -hE '^(const|final|[A-Za-z][A-Za-z_<>,? ]+) k?[a-zA-Z][a-zA-Z0-9]*( =|\\()' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 25 });
  for (const m of dump.matchAll(/(?:^|\n)(?:const |final )?[A-Za-z_][\w<>,? ]*?\b([a-zA-Z]\w*)\s*(?:=|\()/g)) projectPub.add(m[1]);
} catch { }
let projectConsts = new Set();
try {
  const dump2 = execSync("git grep -hE '^(const|final) ' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 25 });
  for (const m of dump2.matchAll(/(?:^|\n)(?:const|final)\s+(?:[A-Za-z_][\w<>,? ]*?\s+)?([a-zA-Z]\w*)\s*=/g)) projectConsts.add(m[1]);
} catch { }
let projectClassFiles = new Map();
try {
  const dumpC = execSync("git grep -nHE 'class [A-Z][A-Za-z0-9_]*' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 25 });
  for (const line of dumpC.split('\n')) {
    const m = line.match(/^([^:]+:[^:]+):\d+:.*class\s+([A-Z]\w*)/);
    if (m && !projectClassFiles.has(m[2]) && !m[1].endsWith('.g.dart')) projectClassFiles.set(m[2], m[1].replace(/^origin\/main:app_flutter\/lib\//, ''));
  }
} catch { }
// v2.1 · קובץ-הבית של כל קבוע-פרויקט — המאמת מקבל קבועים, אז הלוח חייב לייבא אותם (ניסיון-7: kDemoContractorId/providers בלי-import)
let projectConstFiles = new Map();
let projectConstFilesAll = new Map(); // name ⇒ [כל הקבצים] — לזיהוי סמל-דו-משמעי (ניסיון-9: requestsForEmployer בשניים)
try {
  const dumpK = execSync("git grep -nHE '^(const|final) ' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 25 });
  for (const line of dumpK.split('\n')) {
    const m = line.match(/^([^:]+:[^:]+):\d+:(?:const|final)\s+(?:[A-Za-z_][\w<>,? ]*?\s+)?([a-zA-Z]\w*)\s*=/);
    if (m && !m[1].endsWith('.g.dart')) {
      const f = m[1].replace(/^origin\/main:app_flutter\/lib\//, '');
      if (!projectConstFiles.has(m[2])) projectConstFiles.set(m[2], f);
      if (!projectConstFilesAll.has(m[2])) projectConstFilesAll.set(m[2], []);
      if (!projectConstFilesAll.get(m[2]).includes(f)) projectConstFilesAll.get(m[2]).push(f);
    }
  }
} catch { }
let projectFnFiles = new Map();
try {
  const dumpF = execSync("git grep -nHE '^[A-Za-z][A-Za-z_<>,? ]+ [a-z][a-zA-Z0-9]*\\(' origin/main -- app_flutter/lib", { cwd: BS, encoding: 'utf8', maxBuffer: 1 << 25 });
  for (const line of dumpF.split('\n')) {
    const m = line.match(/^([^:]+:[^:]+):\d+:[A-Za-z][\w<>,? ]+ ([a-z]\w*)\(/);
    if (m && !projectFnFiles.has(m[2]) && !m[1].endsWith('.g.dart')) projectFnFiles.set(m[2], m[1].replace(/^origin\/main:app_flutter\/lib\//, ''));
  }
} catch { }
const existsCache = new Map();
const existsInMain = (libPath) => {
  if (existsCache.has(libPath)) return existsCache.get(libPath);
  let ok = false;
  try { execSync(`git cat-file -e 'origin/main:app_flutter/lib/${libPath.replace(/'/g, '')}'`, { cwd: BS }); ok = true; } catch { }
  existsCache.set(libPath, ok);
  return ok;
};
const GENERIC_IDS = new Set(['label', 'value', 'text', 'children', 'child', 'title', 'item', 'items', 'name', 'data']);
const DART_OK = new Set(['context', 'ref', 'true', 'false', 'null', 'const', 'final', 'new', 'if', 'else', 'for', 'in', 'is', 'as', 'return', 'switch', 'case', 'await', 'async', 'toList', 'map', 'where', 'length', 'toString', 'print', 'var', 'this',
  // v2 · מילות-מפתח + Flutter-בקטנות שנפלו לשווא במאמת
  'try', 'catch', 'finally', 'throw', 'rethrow', 'do', 'while', 'break', 'continue', 'late', 'void', 'dynamic', 'num', 'int', 'double', 'bool', 'mounted',
  'showDialog', 'showModalBottomSheet', 'showDatePicker', 'showTimePicker', 'showSearch', 'showAboutDialog', 'debugPrint', 'identical', 'isEmpty', 'isNotEmpty', 'first', 'last', 'entries', 'keys', 'values']);

/** v2 · ביטוי פתיר-בלוח? כל מזהה חייב להיות: מוצהר-בביטוי · watch-var · הרמת-מצב/מקומי (extras) ·
 *  ציבורי-פרויקטלי · Flutter (רישית) · ליבת-Dart. ‏stateful ⇒ ‏setState מותר (לוח-Stateful).
 *  ‏collect ⇒ במקום להיכשל, אוסף את המזהים-הנופלים (מועמדי-הרמה). */
let srcPublicsRef = new Set();
function exprScanIds(expr, watchVars, extras, stateful, collect) {
  const scan = maskLitsKeepInterp(expr);                    // עדשה-סמנטית: קוד-בתוך-\${} נסרק
  if (/\bwidget\.|\bthis\./.test(scan)) return false;
  if (!stateful && /\bsetState\b/.test(scan)) return false;
  const declared = new Set();
  for (const m of scan.matchAll(/\(\s*([\w ,]+)\)\s*=>|\bfor\s*\(\s*(?:final|var)\s+(\w+)|\b(?:final|var)\s+(\w+)\s*=/g))
    for (const v of (m[1] || m[2] || m[3] || '').split(',')) declared.add(v.trim());
  let ok = true;
  // הלוקהביהיינד בלי-$ — ‏$label חייב-להיבדק (דליפת-'label' בניסיון-7); ‏\$ אמיתי ממוסך ממילא
  for (const m of scan.matchAll(/(?<![.\w'])([a-zA-Z_]\w*)\b(?!\s*:)/g)) {
    const id = m[1];
    if (declared.has(id) || watchVars.has(id) || extras.has(id)) continue;
    if (stateful && id === 'setState') continue;
    if (/^[A-Z]/.test(id)) continue;
    if (DART_OK.has(id)) continue;
    if (id.startsWith('_') || id.length <= 2 || GENERIC_IDS.has(id)) {  // פרטי/גנרי ⇒ רק הרמה (extras) מצילה
      ok = false; if (collect) { collect.add(id); continue; } return false;
    }
    const isCall = scan.slice(m.index + id.length).match(/^\s*\(/);
    if (isCall && projectPub.has(id)) continue;
    if (projectConsts.has(id)) continue;
    if (srcPublicsRef.has(id)) continue;
    ok = false; if (collect) { collect.add(id); continue; } return false;
  }
  return ok;
}
const exprResolvable = (expr, watchVars, extras = new Set(), stateful = false) => exprScanIds(expr, watchVars, extras, stateful, null);
/** המזהים-הנופלים של ביטוי — מועמדים להרמה. null ⇒ פסול-מהותית (widget./this.). */
function failingIds(expr, watchVars, extras, stateful) {
  const bad = new Set();
  const r = exprScanIds(expr, watchVars, extras, stateful, bad);
  return (r === false && bad.size === 0) ? null : bad;
}

// ── טוקני-BsTokens: שם ⇒ קבוע ──
const bsTokens = new Set();
try {
  const tk = fs.readFileSync(path.join(SHELF, 'auto/bs_tokens.dart'), 'utf8');
  for (const m of tk.matchAll(/static const \w+ (\w+) =/g)) bsTokens.add(m[1]);
} catch { }
const TOKEN_ALIAS = { ink: 'inkLight', muted: 'mutedLight', border: 'line', card: 'surface' };
const tokenExpr = (n, t) => {
  if (bsTokens.has(n)) return 'BsTokens.' + n;
  if (TOKEN_ALIAS[n] && bsTokens.has(TOKEN_ALIAS[n])) return 'BsTokens.' + TOKEN_ALIAS[n];
  return t === 'double' ? (bsTokens.has('radiusCard') && /radius/i.test(n) ? 'BsTokens.radiusCard' : '12 /* TODO-לוח: טוקן */')
    : 'const Color(0xFF223047) /* TODO-לוח: טוקן */';
};

// ── חילוץ ארגומנטים-של-אתר-קריאה: Widget(...) ⇒ {named:{k:expr}, positional:[expr]} ──
function callSiteArgs(src, widget) {
  const scan = maskLits(maskComments(src));
  const m = scan.match(new RegExp('(?<!class )\\b' + widget + '\\s*\\('));
  if (!m) return null;
  let d = 0, j = scan.indexOf('(', m.index), open = j;
  for (; j < scan.length; j++) { const c = scan[j]; if (c === '(' || c === '[' || c === '{') d++; else if (c === ')' || c === ']' || c === '}') { d--; if (!d) break; } }
  // פיצול-ארגומנטים בעומק-0 — על ה-scan; הביטויים נלקחים מהמקור-הגולמי באותם-אינדקסים
  const named = {}; const positional = [];
  let s0 = open + 1, dep = 0;
  const pushArg = (a, b) => {
    const raw = src.slice(a, b).trim();
    if (!raw) return;
    const nm = raw.match(/^([a-zA-Z_]\w*)\s*:\s*([\s\S]+)$/);
    // v2 · ‏( הוסר מרשימת-הפסילה: ‏onX: () => handler(...) הוא ארגומנט-בשם לגיטימי —
    // הפסילה הישנה זרקה את כל משפחת-ה-closures לפני-המאמת (ואף זיהמה את המיקומיים)
    if (nm && !/^['"]/.test(nm[2].trimStart()[0] === ':' ? 'x' : nm[2]) && !raw.startsWith("'")) named[nm[1]] = nm[2].trim();
    else positional.push(raw);
  };
  for (let k = open + 1; k <= j; k++) {
    const c = scan[k];
    if (c === '(' || c === '[' || c === '{') dep++;
    else if (c === ']' || c === '}') dep--;
    else if (c === ')' && k < j) dep--;
    else if ((c === ',' && !dep) || k === j) { pushArg(s0, k); s0 = k + 1; }
  }
  return { named, positional };
}

// ── שם-פרמטרי-הבנאי-המקוריים + טיפוסיהם (למיפוי-מודלים) ──
function origCtorInfo(src, widget) {
  const d = src.match(new RegExp('class\\s+' + widget + '\\b'));
  if (!d) return { pos: [], types: new Map() };
  const body = classBody(src, d.index) || '';
  const types = new Map();
  for (const fm of stripComments(body).matchAll(/final\s+([A-Za-z_][\w<>,? ]*?)\s+([a-zA-Z_]\w*)\s*;/g)) types.set(fm[2], fm[1].trim());
  const cm = body.match(new RegExp('(?:const\\s+)?' + widget + '\\s*\\(([^)]*)\\)'));
  const pos = [];
  if (cm) for (const pp of cm[1].split(',')) { const t = pp.trim(); if (t.startsWith('{')) break; const mm = t.match(/this\.(\w+)/); if (mm) pos.push(mm[1]); }
  return { pos, types };
}

// ── סוגרים-פנימיים + watches מהגוף-המקורי (אותם-כללים כמנוע-ההתרה) ──
function innerWiring(src, widget) {
  const d = src.match(new RegExp('class\\s+' + widget + '\\b'));
  if (!d) return { handlers: new Map(), watches: new Map() };
  const body = classBody(src, d.index) || '';
  const scan = maskLits(maskComments(body));
  const handlers = new Map(); const seen = new Map();
  const IOISH = /Navigator\.|\bref\.|show[A-Z]\w*\(|open[A-Z]\w*\(|\bcontext\.(push|go|pop)\b/;
  for (const m of [...scan.matchAll(/\b(on[A-Z]\w*)\s*:\s*/g)]) {
    const vs = m.index + m[0].length;
    if (!/^\(\)?\s*\w*\)?\s*(=>|\{|async)|^\(\s*\w+\s*\)\s*(=>|\{|async)/.test(scan.slice(vs, vs + 24)) && !/^\(\)/.test(scan.slice(vs, vs + 4))) continue;
    let dd = 0, j = vs;
    for (; j < scan.length; j++) {
      const c = scan[j];
      if (c === '(' || c === '[' || c === '{') dd++;
      else if (c === ')' || c === ']' || c === '}') { if (!dd) break; dd--; }
      else if (c === ',' && !dd) break;
    }
    if (!IOISH.test(scan.slice(vs, j))) continue;
    const base = m[1];
    const n = (seen.get(base) || 0) + 1; seen.set(base, n);
    handlers.set(n === 1 ? base : base + n, src.slice(0, 0) + body.slice(vs, j).trim());
  }
  const watches = new Map();
  for (const m of body.matchAll(/ref\.watch\(\s*([a-zA-Z0-9_]+Provider)\s*(?:\([^()]*\))?\s*\)/g))
    watches.set(m[1].replace(/Provider$/, '').replace(/^_/, ''), m[1]);
  return { handlers, watches };
}

// ── המעבר על המניפסטים ──
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const report = { boards: [], totals: { wired: 0, todo: 0, hebInExpr: 0 } };
for (const mf of fs.readdirSync(MANIFESTS).filter(f => f.endsWith('.manifest.json')).sort()) {
  const M = JSON.parse(fs.readFileSync(path.join(MANIFESTS, mf), 'utf8'));
  const srcScreen = M.src || mf.replace('.manifest.json', '');
  const srcPath = path.join(SCRATCH, srcScreen + '.dart');
  if (!fs.existsSync(srcPath)) continue;
  const src = fs.readFileSync(srcPath, 'utf8');
  const cls = M.screen.replace(/(^|[_-])([a-z])/g, (_, __, c) => c.toUpperCase());
  // פומביי-המקור: פונקציות/קבועים עליוניים של קובץ-המסך — זמינים ללוח דרך import-עצמי
  srcPublicsRef = new Set([...stripComments(src).matchAll(/(?:^|\n)(?:const |final )?[A-Za-z_][\w<>,? ]*?\b([a-z]\w*)\s*[=(]/g)].map(x => x[1]));
  const selfImport = "import 'package:buildsmart/" + srcScreen.replace(/__/g, '/') + ".dart';";
  const codeSrc = stripComments(src);

  // ── v2 · הרמת-מצב: שדות + מתודות פרטיות מכל מחלקות-ה-State של קובץ-המקור ──
  // מסך-Stateful מקורי ⇒ הלוח יכול להיות Stateful ולארח את המצב verbatim (setState חוקי).
  // רק חברי-מחלקה בהזחת-2 (הקוד מפורמט-dart) — לא מקומיים-בתוך-מתודות.
  const stateFields = new Map();   // name ⇒ {decl, init}
  const stateMethods = new Map();  // name ⇒ {text, params}
  for (const sm of codeSrc.matchAll(/class\s+_\w+State\s+extends\s+(?:ConsumerState|State)<\w+>/g)) {
    const sb = classBody(codeSrc, sm.index) || '';
    const inner = sb.slice(sb.indexOf('{') + 1);
    const innerScan = maskLits(inner);
    for (const fm of inner.matchAll(/\n {2}((?:late\s+)?final|(?:late\s+)?(?:final\s+)?[A-Za-z_][\w<>,?. ]*?\??)\s+(_\w+)\s*(=[^;\n]*)?;/g)) {
      const [, type, name, init] = fm;
      if (stateFields.has(name)) continue;
      if (/\bwidget\.|\bthis\./.test(init || '')) continue;
      if (!init && !type.includes('?')) continue;                       // בלי-init ולא-nullable ⇒ תלוי-בנאי, לא מרימים
      if (/^(late\s+)?final$/.test(type.trim()) && !init) continue;
      stateFields.set(name, { decl: `${type} ${name}${init ? ' ' + init.trim() : ''};`, init: init ? init.replace(/^=\s*/, '') : 'null' });
    }
    for (const mm of inner.matchAll(/\n {2}((?:Future<[^>{}]+>|void|bool|int|double|String|Widget)\s+(_\w+)\s*\(([^)]*)\)\s*(?:async\s*)?\{)/g)) {
      if (stateMethods.has(mm[2])) continue;
      let d = 0, j = mm.index + mm[1].length - 1;                       // פותח על ה-{ של הגוף
      for (let k = j; k < innerScan.length; k++) {
        const c = innerScan[k];
        if (c === '{') d++;
        else if (c === '}') { d--; if (!d) { j = k; break; } }
      }
      const params = mm[3].split(',').map(p => p.trim().split(/\s+/).pop()?.replace(/[^\w]/g, '')).filter(Boolean);
      stateMethods.set(mm[2], { text: inner.slice(mm.index + 1, j + 1), params });
    }
  }

  // איסוף החיבורים הנדרשים מהמניפסט (אותם-כללים כמו המרכיב)
  const needP = new Map(); const needCb = new Map(); const needTok = new Map(); const needGates = new Set();
  for (const sec of M.sections || []) {
    for (const [k, v] of Object.entries(sec.props || {})) {
      if (typeof v !== 'string') continue;
      if (v.startsWith('?:')) { let n = k; const t = v.slice(2).trim() || 'String'; while (needP.has(n) && needP.get(n).t !== t) n += '2'; needP.set(n, { t, sec }); }
      else if (v === '~:') { /* פר-פריט — מחווט דרך פרמטר-הרשימה */ }
      else if (v.startsWith('@:')) { const [cn, ct] = v.slice(2).trim().split('|'); needCb.set(cn, ct || 'VoidCallback'); }
      else if (v.startsWith('#:')) needTok.set(v.slice(2).trim(), /radius|size|width|height|space|pill/i.test(v.slice(2)) ? 'double' : 'Color');
    }
    if (sec.repeat?.item) {
      const ln = sec.repeat.item.charAt(0).toLowerCase() + sec.repeat.item.slice(1) + 's';
      needP.set(ln, { t: 'List<' + sec.repeat.item + '>', sec, isList: true });
    }
    if (sec.gate) needGates.add(sec.gate);
    if (sec.title && String(sec.title).startsWith('#:')) needTok.set('ink', 'Color');
  }
  if (M.sections?.some(s => s.title)) needTok.set('ink', 'Color');

  // חיווט פר-סקציה מהמקור — נאסף כמועמדים (cand); הקבלה בשלב-v2 עם ההרמות
  const wires = new Map(); const cand = new Map(); let todo = 0, heb = 0;
  const watchLines = new Map();
  for (const sec of M.sections || []) {
    const org = atomOrigin.get(sec.atom);
    const origWidget = org?.split(':')[1];
    const origSrc = org && org.split(':')[0] !== srcScreen && fs.existsSync(path.join(SCRATCH, org.split(':')[0] + '.dart'))
      ? fs.readFileSync(path.join(SCRATCH, org.split(':')[0] + '.dart'), 'utf8') : src;
    const args = origWidget ? callSiteArgs(src, origWidget) || callSiteArgs(origSrc, origWidget) : null;
    const info = origWidget ? origCtorInfo(origSrc, origWidget) : { pos: [], types: new Map() };
    const inner = origWidget ? innerWiring(origSrc, origWidget) : { handlers: new Map(), watches: new Map() };
    const resolve = (propName) => {
      if (args?.named[propName]) return args.named[propName];
      const pi = info.pos.indexOf(propName);
      if (pi >= 0 && args?.positional[pi]) return args.positional[pi];
      if (inner.handlers.has(propName)) return inner.handlers.get(propName);
      if (inner.watches.has(propName)) { const pv = inner.watches.get(propName); if (!pv.startsWith('_')) { watchLines.set(propName, pv); return propName; } }
      // שדה-מודל-שוטח: פרמטר-מקורי מודלי שהועבר באתר-הקריאה.
      // v2 · בלי-ניחושים: רק כשמחלקת-המודל בקובץ-המקור ומכריזה על השדה בפועל
      // (הבאג שנתפס: ‏_itemsCtrl.onSend על TextEditingController).
      if (/^on[A-Z]/.test(propName)) return null;
      for (const [pn, pt] of info.types) {
        const bare = pt.replace(/\?$/, '');
        if (!/^[A-Z]/.test(bare)) continue;
        if (/^(String|Color|Widget|Key|IconData|Duration|List|Map|Set|Iterable|Future|FocusNode|GlobalKey)\b/.test(bare) || /Controller$/.test(bare)) continue;
        const mi = origCtorInfo(origSrc, bare);
        if (!mi.types.has(propName)) continue;
        const e = args?.named[pn] ?? (info.pos.indexOf(pn) >= 0 ? args?.positional[info.pos.indexOf(pn)] : null);
        if (e) return e + '.' + propName;
      }
      return null;
    };
    if (sec.repeat?.item && origWidget) {
      const lc = loopContext(src, origWidget) || loopContext(origSrc, origWidget);
      const lcSrc = loopContext(src, origWidget) ? src : origSrc;
      if (lc) {
        const la = parseCallArgs(lcSrc, origWidget, Math.max(0, lc.callIndex - 2));
        const fields = Object.entries(sec.props || {}).filter(([, v]) => v === '~:').map(([k]) => k);
        const fArgs = fields.map(k => `${k}: ${(la?.named[k] ?? 'null /* TODO-לוח */').trim()}`);
        const ln = sec.repeat.item.charAt(0).toLowerCase() + sec.repeat.item.slice(1) + 's';
        const le = lc.list.trim();
        const full = `${le}.map((${lc.as}) => ${sec.repeat.item}(${fArgs.join(', ')})).toList()`;
        cand.set(ln, full);
      }
    }
    for (const [k, v] of Object.entries(sec.props || {})) {
      if (typeof v !== 'string' || (!v.startsWith('?:') && !v.startsWith('@:'))) continue;
      // ‏@:name|Type — המפתח הוא השם בלבד (ה-|Type השאיר wires יתומים שנפלו ל-TODO)
      const pname = v.startsWith('@:') ? v.slice(2).trim().split('|')[0] : [...needP.keys()].find(n => n === k || n.startsWith(k)) || k;
      if (cand.has(pname)) continue;
      const e = resolve(k);
      if (!e) continue;
      if (e.trim() === pname || e.trim() === k) continue;                  // הפניה-עצמית חסרת-פשר
      cand.set(pname, e);                                                  // הקבלה — בשלב-v2 (עם הרמות)
    }
  }

  // ── v2 · אימות-מצב-מורם (פיקספוינט): שדה/מתודה שגופם לא-פתיר נופלים, והשאר מאומתים-שוב ──
  const wv0 = new Set([...watchLines.keys()]);
  let vFields = new Map(stateFields); let vMethods = new Map(stateMethods);
  for (let r = 0; r < 4; r++) {
    const names = new Set([...vFields.keys(), ...vMethods.keys()]);
    const f2 = new Map([...vFields].filter(([, d]) => exprResolvable(d.init, wv0, names, true)));
    const m2 = new Map([...vMethods].filter(([, d]) => exprResolvable(d.text, wv0, new Set([...names, ...d.params]), true)));
    const same = f2.size === vFields.size && m2.size === vMethods.size;
    vFields = f2; vMethods = m2;
    if (same) break;
  }

  // ── v2 · קבלת-חיבורים עם הרמות: extras = מצב-מורם + מקומיים-מורמים; גדל עד-פיקספוינט ──
  const stateful = vFields.size > 0 || vMethods.size > 0;
  const extras = new Set([...vFields.keys(), ...vMethods.keys()]);
  const hoistLocals = new Map();   // name ⇒ הצהרה מורמת לגוף-הלוח
  let grew = true;
  while (grew) {
    grew = false;
    const wv = new Set([...watchLines.keys()]);
    for (const [k, e] of cand) {
      if (wires.has(k)) continue;
      if (exprResolvable(e, wv, extras, stateful)) { wires.set(k, e); if (/[֐-׿]/.test(e)) heb++; grew = true; continue; }
      const bad = failingIds(e, wv, extras, stateful);
      if (!bad) continue;                                          // widget./this. ⇒ באמת תלוי-הקשר
      for (const id of bad) {
        if (extras.has(id) || hoistLocals.has(id)) continue;
        // הצהרה-מקומית חד-שורתית במקור שפתרונה פתיר ⇒ מרימים לגוף-הלוח
        const dm = codeSrc.match(new RegExp('(?:^|\\n)[ \\t]*(?:final|var)\\s+(?:[A-Za-z_$][\\w<>,?. ]*\\s+)?' + id + '\\s*=\\s*([^;\\n]+);'));
        if (dm && exprResolvable(dm[1], wv, extras, stateful)) {
          hoistLocals.set(id, `final ${id} = ${dm[1].trim()};`);
          extras.add(id); grew = true;
        }
      }
    }
  }

  // v2.1 · מקומי-מורם שהמקור מסמן-כ-nullable (x?. / x == null / x!) ⇒ גישת-נקודה ישירה עליו
  // נפסלת (הלוח איבד את שומר-ה-null של המקור — ניסיון-7: session.employerId על BoardSession?)
  const nullableLocals = [...hoistLocals.keys()].filter(ln => new RegExp('\\b' + ln + '\\?\\.|\\b' + ln + '\\s*==\\s*null|\\b' + ln + '!').test(codeSrc));
  const nullDot = (txt) => nullableLocals.some(ln => new RegExp('\\b' + ln + '\\.(?!\\.)').test(txt));
  for (const [k2, e2] of [...wires]) if (nullDot(e2)) wires.delete(k2);
  for (const [ln2, decl] of [...hoistLocals]) if (nullableLocals.includes(ln2) ? false : nullDot(decl)) { hoistLocals.delete(ln2); extras.delete(ln2); }

  // ולידציה-סופית (פיקספוינט): כל ביטוי חייב-להיפתר מול קבוצת-ה-watch הסופית — כולל מקומיים-מורמים שנשמטו
  let shrunk = true;
  while (shrunk) {
    shrunk = false;
    const wv = new Set([...watchLines.keys()]);
    for (const [ln2, decl] of [...hoistLocals]) {
      if (!exprResolvable(decl, wv, new Set([...extras].filter(x => x !== ln2)), stateful)) { hoistLocals.delete(ln2); extras.delete(ln2); shrunk = true; }
    }
    for (const [k2, e2] of [...wires]) {
      if (!exprResolvable(e2, wv, extras, stateful)) { wires.delete(k2); shrunk = true; }
    }
    const usedIn = [...wires.values(), ...hoistLocals.values()].join('\n');
    for (const [v2] of [...watchLines]) {
      if (!new RegExp('\\b' + v2 + '\\b').test(usedIn)) { watchLines.delete(v2); shrunk = true; }
    }
  }

  // ── v2 · המצב-בשימוש בפועל (worklist): רק שדות/מתודות שהחיווט-החי נוגע-בהם נפלטים ──
  const emittedRef = [...wires.values(), ...hoistLocals.values()].join('\n');
  const usedState = new Set();
  {
    const q = [];
    for (const n of [...vFields.keys(), ...vMethods.keys()]) if (new RegExp('\\b' + n + '\\b').test(emittedRef)) { usedState.add(n); q.push(n); }
    while (q.length) {
      const n = q.pop();
      const t = vMethods.get(n)?.text || vFields.get(n)?.init || '';
      for (const n2 of [...vFields.keys(), ...vMethods.keys()]) if (!usedState.has(n2) && new RegExp('\\b' + n2 + '\\b').test(t)) { usedState.add(n2); q.push(n2); }
    }
  }
  const needState = usedState.size > 0 || /\bsetState\b/.test(emittedRef);
  // הרכבת-הלוח
  const srcLibPath = srcScreen.replace(/__/g, '/') + '.dart';
  const srcDir = srcLibPath.split('/').slice(0, -1).join('/');
  const relImports = [...src.matchAll(/import '([^:'][^']*)';/g)].map(x => {
    const parts = (srcDir ? srcDir + '/' : '') + x[1];
    const seg = [];
    for (const p of parts.split('/')) { if (p === '..') seg.pop(); else if (p !== '.') seg.push(p); }
    return seg.join('/');
  }).filter(p => existsInMain(p)).map(p => `import 'package:buildsmart/${p}';`);
  const pkgImports = [...new Set([selfImport, ...relImports, ...[...src.matchAll(/import 'package:[^']+';/g)].map(x => x[0])])]
    .filter(im => { const mm = im.match(/package:buildsmart\/([^']+)'/); return !mm || existsInMain(mm[1]); });
  // auto-import: מחלקות/פונקציות-פרויקט שהחיווט צורך
  const stateDecls = [...usedState].filter(n => vFields.has(n)).map(n => '  ' + vFields.get(n).decl);
  const stateMethodTexts = [...usedState].filter(n => vMethods.has(n)).map(n => '  ' + vMethods.get(n).text);
  const wireText = [...wires.values(), ...hoistLocals.values(), ...stateDecls, ...stateMethodTexts].join('\n');
  for (const m of new Set([...wireText.matchAll(/\b([A-Z]\w{2,})\b/g)].map(x => x[1]))) {
    const f2 = projectClassFiles.get(m);
    if (f2 && existsInMain(f2)) pkgImports.push(`import 'package:buildsmart/${f2}';`);
  }
  for (const m of new Set([...wireText.matchAll(/\b([a-z]\w{2,})\s*\(/g)].map(x => x[1]))) {
    const f2 = projectFnFiles.get(m);
    if (f2 && existsInMain(f2)) pkgImports.push(`import 'package:buildsmart/${f2}';`);
  }
  // v2.1 · imports לקבועי-פרויקט (כולל providers) שהחיווט/המצב-המורם צורכים.
  // סמל שכבר מסופק ע"י import קיים ⇒ לא מוסיפים שני (התנגשות-דו-משמעות, ניסיון-9)
  for (const m of new Set([...wireText.matchAll(/\b([a-z]\w{2,})\b/g)].map(x => x[1]))) {
    const all = projectConstFilesAll.get(m);
    if (!all) continue;
    if (all.some(f3 => pkgImports.some(im => im.includes(`/${f3}'`)))) continue;
    const f2 = projectConstFiles.get(m);
    if (f2 && existsInMain(f2)) pkgImports.push(`import 'package:buildsmart/${f2}';`);
  }
  const lines = [];
  for (const [v, pv] of watchLines) lines.push(`    final ${v} = ref.watch(${pv});`);
  const argLines = [];
  const defFor = (t) => t.endsWith('?') ? 'null'
    // טיפוס-record: בונים ליטרל עם ברירת-מחדל פר-שדה (dynamic נפסל תחת strict-casts)
    : /^\(\{.*\}\)$/.test(t) ? '(' + [...t.matchAll(/(String|int|double|num|bool)\??\s+(\w+)/g)].map(([, ft, fn]) => `${fn}: ${ft === 'String' ? "''" : ft === 'bool' ? 'false' : '0'}`).join(', ') + ')'
    : t.startsWith('String') ? "''" : t.startsWith('int') ? '0' : t.startsWith('double') ? '0.0' : t.startsWith('bool') ? 'false'
    : t.includes('List') ? 'const []' : t.includes('IconData') ? 'Icons.circle'
    : t === 'Widget' ? 'const SizedBox.shrink()' : t.includes('Controller') ? t.replace(/\?$/, '') + '()'
    : t === 'Color' ? 'const Color(0xFF223047)' : '(null as dynamic)';
  for (const g of [...needGates].sort()) { argLines.push(`      ${g}: true /* TODO-לוח: שער */,`); todo++; }
  for (const [c, ct] of [...needCb.entries()].sort()) {
    const e = wires.get(c);
    const dflt = /Future/.test(ct) ? '() async {}' : /ValueChanged|Function\(/.test(ct) ? '(_) {}' : '() {}';
    if (e) argLines.push(`      ${c}: ${e},`); else { argLines.push(`      ${c}: ${dflt} /* TODO-לוח */,`); todo++; }
  }
  for (const [n, { t }] of [...needP].sort()) {
    const e = wires.get(n);
    if (e) argLines.push(`      ${n}: ${e},`); else { argLines.push(`      ${n}: ${defFor(t)} /* TODO-לוח: ${t} */,`); todo++; }
  }
  const tokArgs = [...needTok].sort().map(([n, t]) => `${n}: ${tokenExpr(n, t)}`).join(', ');
  const wired = wires.size;
  const header = `// 🔌 חולל ע"י מחולל-הלוחות (board-gen) — הלוח = המקום-היחיד שנוגע-בחיווט (חוק-3).
// מקור-החיווט: ${srcScreen}.dart (בנייה-חכמה main) · מחווט: ${wired} · TODO: ${todo}.
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
${pkgImports.filter(i => !i.includes('flutter/material') && !i.includes('flutter_riverpod')).join('\n')}
import '../dart-screens-bs/${M.screen}.g.dart';
`;
  const buildBody = `${lines.join('\n')}${lines.length ? '\n' : ''}${[...hoistLocals.values()].map(l => '    ' + l).join('\n')}${hoistLocals.size ? '\n' : ''}    return ${cls}Composed(
${argLines.join('\n')}
      t: ${cls}Tokens(${tokArgs}),
    );`;
  // v2 · לוח-Stateful רק כשהחיווט-החי נוגע במצב-מורם — אחרת ConsumerWidget רזה כמקודם
  const code = needState ? `${header}
class ${cls}Board extends ConsumerStatefulWidget {
  const ${cls}Board({super.key});

  @override
  ConsumerState<${cls}Board> createState() => _${cls}BoardState();
}

class _${cls}BoardState extends ConsumerState<${cls}Board> {
${stateDecls.join('\n')}${stateDecls.length ? '\n' : ''}${stateMethodTexts.join('\n\n')}${stateMethodTexts.length ? '\n' : ''}
  @override
  Widget build(BuildContext context) {
${buildBody}
  }
}
` : `${header}
class ${cls}Board extends ConsumerWidget {
  const ${cls}Board({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
${buildBody}
  }
}
`;
  fs.writeFileSync(path.join(OUT, srcScreen + '_board.dart'), code);
  report.boards.push({ screen: srcScreen, wired, todo });
  report.totals.wired += wired; report.totals.todo += todo; report.totals.hebInExpr += heb;
}

// ── 🧪 שער-ההצצה (חוק-7): גלריה + כפתור-כניסה מאחורי דגל-הפיך; כבוי ⇒ זהות-ביט ──
const entries = report.boards.map(b => {
  const cls = (JSON.parse(fs.readFileSync(path.join(MANIFESTS, b.screen + '.manifest.json'), 'utf8')).screen)
    .replace(/(^|[_-])([a-z])/g, (_, __, c) => c.toUpperCase()) + 'Board';
  return { name: b.screen.replace(/^(screens|features)__/, '').replace(/__/g, ' · ').replace(/_/g, ' '), file: b.screen + '_board.dart', cls, wired: b.wired, todo: b.todo };
}).sort((a, b) => a.name.localeCompare(b.name));
// 🧬 מסכי-המחולל (genesis-gen, הכרעה 17) — בראש-הגלריה: בקשה ⇒ אטומים ⇒ מסך עובד
const GEN = path.join(ROOT, 'new/dart-gen-bs');
const genEntries = fs.existsSync(GEN) ? fs.readdirSync(GEN).filter(f => /^gen_.*\.dart$/.test(f)).sort().map(f => {
  const s = fs.readFileSync(path.join(GEN, f), 'utf8');
  return { file: f, name: s.match(/\/\/ 🧬 שם: (.+)/)?.[1]?.trim(), cls: s.match(/class (Gen\w+) extends/)?.[1] };
}).filter(e => e.cls && e.name) : [];
// 🧬 מסך-הכניסה (הכרעה 18): gen_entry קיים ⇒ הוא הבית; הכניסה לגלריה בכפתור-צף (שכבת-החיווט, חוק-3)
const entryE = genEntries.find(e => e.file === 'gen_entry.dart');
const gallery = `// 🧪 חולל ע"י מחולל-הלוחות (board-gen) — שער-ההצצה למסכי-הגנסיס. אל תערוך ידנית.
// חוק-7 (החלפה-הפיכה): הדגל כבוי כברירת-מחדל ⇒ collection-if מעלים הכול — זהות-ביט.
// הדלקה: flutter run --dart-define=GENESIS_SCREENS=true
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:buildsmart/widgets/toast.dart' show bsNavigatorKey;
${genEntries.map(e => `import '../dart-gen-bs/${e.file}';`).join('\n')}
${entries.map(e => `import '${e.file}';`).join('\n')}

const bool kGenesisScreens = bool.fromEnvironment('GENESIS_SCREENS');

/// מצב מחצב-בלבד (GENESIS_ONLY): האפליקציה כולה = הגלריה — רק מה שהמנועים בנו,
/// בלי האפליקציה-המקורית בכלל. הכרעת-בעלים 29.8 "אני רוצה לראות רק מה שהוא בנה".
const bool kGenesisOnly = bool.fromEnvironment('GENESIS_ONLY');

/// שורש עצמאי לגלריה — ProviderScope משלו (הלוחות הם ConsumerWidgets) + RTL.
class GenesisApp extends StatelessWidget {
  const GenesisApp({super.key});

  @override
  Widget build(BuildContext context) => ProviderScope(
        child: MaterialApp(
          title: 'המחצב — מסכי-הגנסיס',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF223047)),
          builder: (context, child) => Directionality(
            textDirection: TextDirection.rtl,
            child: child ?? const SizedBox.shrink(),
          ),
          home: const ${entryE ? '_GenEntryHost' : 'GenesisGallery'}(),
        ),
      );
}
${entryE ? `
/// 🧬 מארח-הכניסה (הכרעה 18): מסך-הכניסה שהמחולל יצר לעצמו + כפתור-צף אל הגלריה.
class _GenEntryHost extends StatelessWidget {
  const _GenEntryHost();

  @override
  Widget build(BuildContext context) => Stack(children: [
        const ${entryE.cls}(),
        SafeArea(
          child: Align(
            alignment: Alignment.bottomLeft,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: FloatingActionButton.small(
                heroTag: 'genesis-enter',
                tooltip: 'כל המסכים',
                onPressed: () => Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const GenesisGallery()),
                ),
                child: const Text('🧪', style: TextStyle(fontSize: 18)),
              ),
            ),
          ),
        ),
      ]);
}
` : ''}

/// כפתור-כניסה צף (🧪) — נטען-לצד מעל-הניווט; קיים רק כשהדגל דלוק.
class GenesisEntryButton extends StatelessWidget {
  const GenesisEntryButton({super.key});

  @override
  Widget build(BuildContext context) => SafeArea(
        child: Align(
          alignment: Alignment.bottomLeft,
          child: Padding(
            padding: const EdgeInsets.only(left: 12, bottom: 96),
            child: FloatingActionButton.small(
              heroTag: 'genesis-gallery',
              tooltip: 'מסכי-הגנסיס (תצוגה-לצד)',
              onPressed: () => bsNavigatorKey.currentState?.push(
                MaterialPageRoute(builder: (_) => const GenesisGallery()),
              ),
              child: const Text('🧪', style: TextStyle(fontSize: 18)),
            ),
          ),
        ),
      );
}

class _GEntry {
  const _GEntry(this.name, this.subtitle, this.build);
  final String name;
  final String subtitle;
  final Widget Function() build;
}

/// הגלריה: 🧬 מסכי-המחולל (בקשה⇒מסך) בראש, ואחריהם המסכים-המורכבים-מהמקור.
class GenesisGallery extends StatelessWidget {
  const GenesisGallery({super.key});

  static final List<_GEntry> _screens = [
${genEntries.map(e => `    _GEntry('🧬 ${e.name}', 'נוצר מהמחולל — חיווט-מלא', () => const ${e.cls}()),`).join('\n')}
${entries.map(e => `    _GEntry('${e.name}', 'מחווט: ${e.wired} · ממתין-לחיווט: ${e.todo}', () => const ${e.cls}()),`).join('\n')}
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(title: const Text('🧪 מסכי-הגנסיס — תצוגה-לצד')),
        body: ListView.separated(
          itemCount: _screens.length,
          separatorBuilder: (_, __) => const Divider(height: 1),
          itemBuilder: (context, i) {
            final e = _screens[i];
            return ListTile(
              title: Text(e.name),
              subtitle: Text(e.subtitle),
              trailing: const Icon(Icons.chevron_left),
              onTap: () => Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => e.build()),
              ),
            );
          },
        ),
      );
}
`;
fs.writeFileSync(path.join(OUT, 'genesis_gallery.dart'), gallery);

fs.writeFileSync(path.join(ROOT, 'screens-seed/board-gen-report.json'), JSON.stringify(report, null, 1));
console.log(`🔌 מחולל-הלוחות · ${report.boards.length} לוחות · חיבורים-מהמקור: ${report.totals.wired} · TODO-לוח: ${report.totals.todo} · עברית-בביטוי (מועמדת-תוכן): ${report.totals.hebInExpr}`);
