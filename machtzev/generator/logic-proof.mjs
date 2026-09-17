#!/usr/bin/env node
// 🔬 logic-proof — המוכיח-האחד (G34ב · הכרעה-30 «הכי-טוב-לייעוד = מה שהמנוע עושה»): דוגמאות (קלט ⇒ בדיקה על r) רצות ב-Dart
//   על כל המועמדים תואמי-החתימה (קובץ-מוכיח אחד לצורך, ייבוא-בקידומת, try/catch לכל דוגמה) ⇒ מפה {מועמד: {ok, total}}.
//   משמש את behavior-plan (צרכי-בלגן) ואת auto-logic (פעולות-הזהב, כשיש gold-examples) — בורר אחד, כלל אחד: הוכחה קודמת לתיאור.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as R from '../root.mjs';
import { resolveDart } from '../dart-bin.mjs';
import { emit as jsToDart } from '../emit/ast-js-to-dart.mjs';   // up-crosslang · הממיר JS⇒Dart (מנוע קיים)
const HERE = path.dirname(fileURLToPath(import.meta.url));
// c2 · פותר-Dart אחד לכל הכלים (dart-bin.resolveDart): DART_BIN ⇒ $HOME/dart-sdk ⇒ /home/user/flutter ⇒ PATH.
//   עדיפות ל-$DART אם הוגדר במפורש (מחרוזת לא-ריקה); אין בינארי ⇒ null ⇒ proveFile מחזיר {error:'tool=dart'} (L34: אין-כלי ≠ כשל, לא בליעה שקטה).
const DART = process.env.DART || resolveDart();
/** מועמד טהור = אטום בלי import (חוק-1) — ניתן להרצה בבידוד */
export const isPure = (file) => { try { const src = fs.readFileSync(path.join(R.NEW, file), 'utf8'); return [...src.matchAll(/^import\s+'([^']+)'/gm)].every((m) => /^(\.\.?\/)/.test(m[1]) || /^dart:(convert|math|core|collection|typed_data)$/.test(m[1])); } catch { return false; } };   // G48 · טהור = אפס-import, או ייבוא-יחסי מהמדף / ספריית-dart טהורה (קופסאות); package:/dart:io/ui/html ⇒ לא
// up-chain3 · קבצי-כל-הצמתים של מועמד: יחיד · שרשרת {chain} · עץ-הרכבה {tree} (הכללת §20-ב)
const treeAtoms = (v) => (v.k === 'p' || v.k === 'c' || v.k === 't' || v.k === 'h' || v.k === 'w') ? [] : v.k === 'g' ? [...treeAtoms(v.pred), ...treeAtoms(v.body)] : [v, ...v.args.flatMap(treeAtoms)];   // up-sockets · עלים t/h/w · שומר-סף g   // צומת-אטום = {k:'a',id,file,args}; עלה-פרמטר = {k:'p',i}
const filesOf = (c) => c.chain ? c.chain.map((q) => q.file) : c.tree ? treeAtoms(c.tree).map((n) => n.file) : [c.file];
/** @param id מזהה-הצורך · cands [{id,file}] | {chain:[{id,file},{id,file}]} | {tree:root,argc} · examples [[argsDart, checkDart]] ⇒ {candId: {ok,total}} | {error} */
export function proveCandidates(id, cands, examples, extraImports = [], env = {}) {   // env: {clock,human,world} — שקעי-סביבה (up-sockets); examples[j][2] = {now, human:{…}} לכל דוגמה   // extraImports: שקעים מהקטלוג (אטומי-דאטה/מנועים) שהדוגמאות קוראות להם בלי קידומת
  // הכרעה-20ב · «אין-יחיד ⇒ שלב כמה»: מועמד = יחיד · שרשרת B(A(args)) · **עץ-הרכבה** של עד 3 צמתים (up-chain3); כל צמתיו חייבים להיות טהורים
  const pure = cands.filter((c) => filesOf(c).every(isPure)); if (!pure.length || !examples || !examples.length) return {};
  const all = proveFile(id, pure, examples, extraImports, env);
  if (!all.error) return all;
  // G36 · מועמד אחד שאינו מתקמפל מול הדוגמאות (חתימה-בקטלוג ≠ גוף) לא מפיל את כולם: מוכיחים כל מועמד בקובץ-משלו; הנכשל-בקומפילציה = 0/total עם השגיאה
  const out = {}; for (const c of pure) { const r = proveFile(id + '__' + c.id, [c], examples, extraImports, env); out[c.id] = r.error ? { ok: 0, total: examples.length, error: r.error } : (r[c.id] || { ok: 0, total: examples.length }); }
  return out;
}
/** up-compose · עץ-חיווט ⇒ ביטוי-Dart + ייבואים (up-sockets: p=פרמטר · c=ליטרל · t=שעון(now) · h=אדם · w=עולם · g=שומר-סף · f=תקע-למבדה · a=אטום).
 *  אותו מיפוי משמש את רתמת-ההוכחה ואת שכבת-ההרכבה — עותק אחד. `rel(file)` = נתיב-ייבוא יחסי מהקובץ הפולט. */
export function treeDart(root, i, rel) { const imports = []; let k = 0; const walk = (v) => { if (v.k === 'p') return `p${v.i}`; if (v.k === 'c') return v.dart; if (v.k === 't') return 'now'; if (v.k === 'h') return v.name; if (v.k === 'w') return 'w'; if (v.k === 'g') return `if (${walk(v.pred)}) { ${walk(v.body)}; }`; const idx = k++; imports.push(`import '${rel(v.file)}' as c${i}_${idx};`); if (v.k === 'f') { const xs = Array.from({ length: v.m }, (_, j) => `x${idx}_${j}`); return `(${xs.join(', ')}) => c${i}_${idx}.${v.id}(${xs.concat(v.args.map(walk)).join(', ')})`; } const inner = v.args.map(walk).join(', '); return `c${i}_${idx}.${v.id}(${inner})`; }; return { imports, expr: walk(root) }; }
function proveFile(id, pure, examples, extraImports, env = {}) {
  if (!DART) return { error: 'tool=dart' };   // אין בינארי Dart ⇒ סמן במפורש (לא מחרוזת ריקה) — הבורר יידע שלא הוכח, לא ש"נכשל"
  const dir = path.join(HERE, '.prove'); fs.mkdirSync(dir, { recursive: true });
  const rel = (f) => path.relative(dir, path.join(R.NEW, f)).split(path.sep).join('/');
  // up-chain3 · עץ-הרכבה: לכל מועמד-עץ, לכל צומת-אטום קידומת ייחודית c{i}_{k}; הביטוי משתמש בפרמטרי-הצורך p0..pn (למבדה) ובקריאות-הצמתים
  const treeParts = (root, i) => treeDart(root, i, rel);
  const meta = pure.map((c, i) => c.tree ? treeParts(c.tree, i) : null);
  const imps = [...extraImports.map((f) => `import '${rel(f)}';`), ...pure.flatMap((c, i) => c.chain ? c.chain.map((q, k) => `import '${rel(q.file)}' as c${i}_${k};`) : c.tree ? meta[i].imports : [`import '${rel(c.file)}' as c${i};`])].join('\n');
  // up-sockets · הצהרות-סביבה לכל דוגמה: now (שקע-זמן) · <אדם> (שקע-אדם) · w (שקע-עולם). הדוגמה נושאת אותן ב-ex[2].
  const envOf = (ex) => (ex && ex[2] && typeof ex[2] === 'object') ? ex[2] : {};
  const decl = (args) => { const e = envOf(examples[+args.split('\u0000')[1]]); let d = ''; if (env.clock) d += `final dynamic now = ${e.now ?? 'null'}; `; for (const h of env.human || []) d += `final dynamic ${h.name} = ${(e.human || {})[h.name] ?? 'null'}; `; if (env.world) d += `final ${env.world.type} w = ${env.world.init}; `; return d; };
  const humansOf = new Map(pure.map((c) => [c, c.tree ? (env.human || []).filter((h) => JSON.stringify(c.tree).includes(`"name":"${h.name}"`)).map((h) => h.name) : []]));   // פעם אחת למועמד
  const humanMissing = (c, ex) => humansOf.get(c).some((n) => (envOf(ex).human || {})[n] === undefined);   // שקע-אדם בלי ערך ⇒ ∅ (לא מריצים)
  const call = (c, i, argsJ) => { const args = argsJ.split('\u0000')[0]; return c.chain ? `c${i}_1.${c.chain[1].id}(c${i}_0.${c.chain[0].id}(${args}))`   // שרשרת = B(A(args))
    : c.tree ? `((${Array.from({ length: c.argc }, (_, j) => 'dynamic p' + j).join(', ')}) { ${decl(argsJ)} ${c.isVoid ? `${meta[i].expr}; return w;` : `return ${meta[i].expr};`} })(${args})`   // עץ = למבדה(pN); צורך-void ⇒ מריץ את האפקט ומחזיר את העולם w (ההוכחה בודקת מה נכתב בו)
    : `c${i}.${c.id}(${args})`; };
  // G62 · דוגמה שאינה מתקמפלת מול מועמד = **כישלון של אותה (מועמד,דוגמה)**, לא כשל-קובץ. שורת-גוף = תא (i,j).
  // up-chain3 · **תוצאה-נכתבת-בזרימה עם flush לכל תא** (קובץ .res): timeout על תא-תקוע (לולאה-אינסופית בהרכבת-אטומים
  //   אקראית — שכיח בעץ טהור-טיפוסים) שומר את ההתקדמות ⇒ התא-התקוע = הראשון-החסר ⇒ מסומן dead וממשיכים, בלי פיצוץ פר-מועמד.
  const file = path.join(dir, id.replace(/\W/g, '_') + '.dart');
  const resFile = file + '.res';
  const nEx = examples.length, nCells = pure.length * nEx;
  const known = new Map();   // "i:j" ⇒ '0'/'1'/'2' (מחושב · מת-בקומפילציה · תקוע · ∅)
  const vals = new Map();    // up-values · "i:j" ⇒ ערך-הביניים (toString, מקודד JSON) — חיפוש-מונחה-ערכים
  const cell = (k) => Math.floor(k / nEx) + ':' + (k % nEx);
  const header = [`// מוכיח: ${id} — ${pure.length}×${nEx}`, `import 'dart:io';`, `import 'dart:convert';`, ...(imps ? imps.split('\n') : []), `final _raf = File(r'${resFile}').openSync(mode: FileMode.write);`, `void emit(String s){ _raf.writeStringSync(s + '\\n'); _raf.flushSync(); }`, `void main() {`];
  const first = header.length + 1;   // שורת-הגוף הראשונה (1-based)
  const t0 = Date.now(); const ATTEMPT = 25000, WALL = 300000; let r = null, lastErr = '';
  for (let round = 0; known.size < nCells && round < nCells + 4 && Date.now() - t0 < WALL; round++) {
    const body = pure.map((c, i) => examples.map((ex, j) => { const cid = i + ':' + j; return known.has(cid) ? `  emit('${cid}:${known.get(cid)}');` : humanMissing(c, ex) ? `  emit('${cid}:2');` : `  try { final dynamic r = ${call(c, i, ex[0] + '\u0000' + j)}; emit('${cid}:' + ((${ex[1]}) ? '1' : '0')${env.values ? " + ':' + jsonEncode(r.toString())" : ''}); } catch (_) { emit('${cid}:2'); }`; }).join('\n')).join('\n');   // חריגה = ∅ (ספק), לא כישלון
    try { fs.unlinkSync(resFile); } catch {}
    fs.writeFileSync(file, header.join('\n') + '\n' + body + '\n  _raf.closeSync();\n}\n');
    r = spawnSync(DART, ['run', file], { cwd: dir, encoding: 'utf8', timeout: ATTEMPT });
    const res = fs.existsSync(resFile) ? fs.readFileSync(resFile, 'utf8') : '';
    const before = known.size;
    for (const l of res.split('\n')) { const m = l.match(/^(\d+:\d+):([012])(?::(.*))?$/); if (m) { known.set(m[1], m[2]); if (m[3] !== undefined) vals.set(m[1], m[3]); } }
    if (known.size >= nCells) break;
    const timedOut = !!(r.error || r.signal) || r.status === null;
    let progressed = known.size > before;
    if (timedOut) {   // התא-התקוע = הראשון-החסר (כל שהושלם כבר נבנק ב-.res) ⇒ **תמיד** הורגים אותו כדי לעבור הלאה (אחרת אותו hang כל סבב)
      let hung = null; for (let k = 0; k < nCells && !hung; k++) if (!known.has(cell(k))) hung = cell(k);
      if (hung) { known.set(hung, '0'); progressed = true; lastErr = 'timeout@' + hung; }
    } else { const bad = [...String(r.stderr || r.stdout || '').matchAll(new RegExp(path.basename(file).replace(/\./g, '\\.') + ':(\\d+):\\d+: Error', 'g'))].map((m) => +m[1] - first).filter((k) => k >= 0 && k < nCells); for (const k of bad) { const cid = cell(k); if (!known.has(cid)) { known.set(cid, '0'); progressed = true; } } }
    if (!progressed) return { error: (r.stderr || r.stdout || '').split('\n').filter((l) => /rror/.test(l)).slice(0, 2).join(' | ') || lastErr || 'no-progress' };   // לא-timeout · לא-קומפילציה · אפס-התקדמות ⇒ כשל-כלל-קובץ ⇒ הקורא ייפול לפר-מועמד (G36)
  }
  if (!known.size) return { error: lastErr || 'empty' };
  const pass = {}; for (const [cid, v] of known) { const i = +cid.split(':')[0]; const e = (pass[pure[i].id] ||= { ok: 0, total: nEx, unknown: 0, ...(env.values ? { vals: Array(nEx).fill(null) } : {}) }); e.ok += v === '1' ? 1 : 0; e.unknown += v === '2' ? 1 : 0; if (env.values && vals.has(cid)) { try { e.vals[+cid.split(':')[1]] = JSON.parse(vals.get(cid)); } catch { e.vals[+cid.split(':')[1]] = vals.get(cid); } } }
  return pass;
}

// ══════════════════════════════════════════════════════════════════════════════
// up-interp · «לקמפל פעם אחת»: רתמה-מפורשת לצורך — מייבאת את **כל** אטומי-המדף פעם אחת (dart compile kernel ⇒ .dill),
//   מחזיקה טבלת שם⇒פונקציה, והעץ (JSON) מפורש בזמן-ריצה (Function.apply). אלפי עצים = תהליך אחד, לא אלפי קומפילציות.
//   העץ הוא דאטה (חיווט), לא קוד מחולל — בדיוק "לא קוד!". תקע-למבדה = סגור-מוקלד לפי טיפוס-ההחזרה של החלקיק.
// ══════════════════════════════════════════════════════════════════════════════
const dartLambdaType = (ret) => { const t = String(ret || 'dynamic').replace(/\?$/, ''); return /^(bool|String|int|double|num)$/.test(t) ? t : /^List/.test(t) ? 'List<dynamic>' : /^Map/.test(t) ? 'Map<dynamic, dynamic>' : 'dynamic'; };
/** מקמפל פעם אחת רתמה לצורך: rows = כל אטומי-המדף הטהורים [{id,file,ret}] · examples [[argsDart, checkDart, env?]] · env {clock,human,world,imports}
 *  ⇒ {dill} או {error}. */
export function buildInterp(needId, rows0, examples, env = {}, extraImports = [], jsRows = []) {
  if (!DART) return { error: 'tool=dart' };
  let rows = [...rows0, ...jsRows]; let dropped = [];
  for (let round = 0; round < 12; round++) { const r = buildInterpOnce(needId, rows, examples, env, extraImports); if (!r.error || !jsRows.length) return { ...r, rows, dropped };
    const bad = jsRows.filter((j) => r.error.includes(path.basename(j.file))); if (!bad.length) { const keep = rows.filter((x) => !x.x); return { ...buildInterpOnce(needId, keep, examples, env, extraImports), rows: keep, dropped: jsRows.map((j) => j.id) }; }
    dropped = [...dropped, ...bad.map((j) => j.id)]; rows = rows.filter((x) => !bad.includes(x)); jsRows = jsRows.filter((x) => !bad.includes(x)); }
  return { error: 'interp: too many rounds', rows, dropped };
}
function buildInterpOnce(needId, rows, examples, env = {}, extraImports = []) {
  const dir = path.join(HERE, '.prove', 'interp'); fs.mkdirSync(dir, { recursive: true });
  const rel = (f) => path.relative(dir, path.join(R.NEW, f)).split(path.sep).join('/');
  const files = [...new Set(rows.map((r) => r.file))]; const pre = new Map(files.map((f, i) => [f, `a${i}`]));
  const imps = [...extraImports.map((f) => `import '${rel(f)}';`), ...files.map((f) => `import '${rel(f)}' as ${pre.get(f)};`)];
  const table = rows.map((r) => `  '${r.id}': ${pre.get(r.file)}.${r.id},`);
  const rets = rows.map((r) => `  '${r.id}': '${dartLambdaType(r.ret)}',`);
  const envOf = (ex) => (ex && ex[2] && typeof ex[2] === 'object') ? ex[2] : {};
  const EX = examples.map((ex) => `  <dynamic>[${ex[0]}],`).join('\n');
  const CK = examples.map((ex) => `  (dynamic r) => (${ex[1]}),`).join('\n');
  const NOW = examples.map((ex) => `  ${envOf(ex).now ?? 'null'},`).join('\n');
  const HUM = examples.map((ex) => `  <String, dynamic>{${Object.entries(envOf(ex).human || {}).map(([k, v]) => `'${k}': ${v}`).join(', ')}},`).join('\n');
  const WORLD = env.world ? `${env.world.type} newWorld() => ${env.world.init};` : `dynamic newWorld() => null;`;
  const src = `// רתמה-מפורשת: ${needId} — ${rows.length} אטומים · ${examples.length} דוגמאות (up-interp · לקמפל פעם אחת)
import 'dart:io';
import 'dart:convert';
${imps.join('\n')}

final Map<String, Function> T = <String, Function>{
${table.join('\n')}
};
final Map<String, String> RET = <String, String>{
${rets.join('\n')}
};
final List<List<dynamic>> EX = <List<dynamic>>[
${EX}
];
final List<bool Function(dynamic)> CK = <bool Function(dynamic)>[
${CK}
];
final List<dynamic> NOW = <dynamic>[
${NOW}
];
final List<Map<String, dynamic>> HUM = <Map<String, dynamic>>[
${HUM}
];
${WORLD}
class Missing implements Exception {}
String _v(dynamic r) { try { return jsonEncode(jsonEncode(r)); } catch (_) { return jsonEncode(r.toString()); } }   // ערך כ-JSON כשאפשר (שקילות חוצה-שפה), אחרת toString

Function lam(Function g, int m, List<dynamic> rest, String ret) {
  // תקע-למבדה מוקלד לפי טיפוס-ההחזרה של החלקיק (Dart בודק טיפוסי-פונקציה בזמן-ריצה)
  switch (ret) {
    case 'bool': return m == 1 ? (dynamic x) => Function.apply(g, [x, ...rest]) as bool : m == 2 ? (dynamic x, dynamic y) => Function.apply(g, [x, y, ...rest]) as bool : (dynamic x, dynamic y, dynamic z) => Function.apply(g, [x, y, z, ...rest]) as bool;
    case 'String': return m == 1 ? (dynamic x) => Function.apply(g, [x, ...rest]) as String : m == 2 ? (dynamic x, dynamic y) => Function.apply(g, [x, y, ...rest]) as String : (dynamic x, dynamic y, dynamic z) => Function.apply(g, [x, y, z, ...rest]) as String;
    case 'int': return m == 1 ? (dynamic x) => Function.apply(g, [x, ...rest]) as int : m == 2 ? (dynamic x, dynamic y) => Function.apply(g, [x, y, ...rest]) as int : (dynamic x, dynamic y, dynamic z) => Function.apply(g, [x, y, z, ...rest]) as int;
    case 'double': return m == 1 ? (dynamic x) => Function.apply(g, [x, ...rest]) as double : m == 2 ? (dynamic x, dynamic y) => Function.apply(g, [x, y, ...rest]) as double : (dynamic x, dynamic y, dynamic z) => Function.apply(g, [x, y, z, ...rest]) as double;
    case 'num': return m == 1 ? (dynamic x) => Function.apply(g, [x, ...rest]) as num : m == 2 ? (dynamic x, dynamic y) => Function.apply(g, [x, y, ...rest]) as num : (dynamic x, dynamic y, dynamic z) => Function.apply(g, [x, y, z, ...rest]) as num;
    case 'List<dynamic>': return m == 1 ? (dynamic x) => Function.apply(g, [x, ...rest]) as List<dynamic> : m == 2 ? (dynamic x, dynamic y) => Function.apply(g, [x, y, ...rest]) as List<dynamic> : (dynamic x, dynamic y, dynamic z) => Function.apply(g, [x, y, z, ...rest]) as List<dynamic>;
    default: return m == 1 ? (dynamic x) => Function.apply(g, [x, ...rest]) : m == 2 ? (dynamic x, dynamic y) => Function.apply(g, [x, y, ...rest]) : (dynamic x, dynamic y, dynamic z) => Function.apply(g, [x, y, z, ...rest]);
  }
}

dynamic ev(Map<String, dynamic> n, List<dynamic> p, int j, dynamic w) {
  switch (n['k']) {
    case 'p': return p[n['i'] as int];
    case 'c': return n['cv'];
    case 't': return NOW[j];
    case 'h': { final h = HUM[j]; if (!h.containsKey(n['name'])) throw Missing(); return h[n['name']]; }
    case 'w': return w;
    case 'g': { final ok = ev(n['pred'] as Map<String, dynamic>, p, j, w); if (ok == true) ev(n['body'] as Map<String, dynamic>, p, j, w); return w; }
    case 'f': { final g = T[n['id']]!; final rest = [for (final a in (n['args'] as List)) ev(a as Map<String, dynamic>, p, j, w)]; return lam(g, n['m'] as int, rest, RET[n['id']] ?? 'dynamic'); }
    default: { final g = T[n['id']]!; final args = [for (final a in (n['args'] as List)) ev(a as Map<String, dynamic>, p, j, w)]; return Function.apply(g, args); }
  }
}

// up-examples · חיישן-דוגמאות-חלשות: מוטציות של הדוגמה הראשונה (null/''/0/false/'x' · מחרוזת+x · רשימה בלי ראשון · מפה בלי מפתח) ⇒ קלטים-מבחינים בין עצים שעברו את כל הדוגמאות
List<dynamic> _mut(dynamic v) {
  if (v == null) return <dynamic>['', 0, false, 'x'];
  if (v is bool) return <dynamic>[!v, null];
  if (v is num) return <dynamic>[0, 1, -1, v + 1, v * 2, null];
  if (v is String) return <dynamic>['', 'a', v + 'x', ' ' + v, null];
  if (v is List) { final out = <dynamic>[<dynamic>[]]; if (v.isNotEmpty) { out.add(v.sublist(1)); for (final m in _mut(v[0])) out.add(<dynamic>[m, ...v.sublist(1)]); } return out; }
  if (v is Map) { final out = <dynamic>[]; try { out.add(<String, dynamic>{}); for (final k in v.keys) { for (final m in <dynamic>[null, '', 0, false, 'x']) { final c = Map<String, dynamic>.from(v); c[k] = m; out.add(c); } final d = Map<String, dynamic>.from(v); d.remove(k); out.add(d); } } catch (_) {} return out; }
  return <dynamic>[];
}
List<List<dynamic>> _probes() {
  final out = <List<dynamic>>[]; if (EX.isEmpty) return out; final base = EX[0];
  for (var i = 0; i < base.length; i++) for (final m in _mut(base[i])) { final c = List<dynamic>.from(base); c[i] = m; out.add(c); if (out.length >= 80) return out; }
  return out;
}
void main(List<String> argv) {
  final trees = (jsonDecode(File(argv[0]).readAsStringSync()) as List);
  final out = StringBuffer();
  if (argv.length > 1 && argv[1] == '--probe') {
    final ps = _probes();
    for (var p = 0; p < ps.length; p++) out.write('P:\$p:\${_v(ps[p])}\\n');
    for (var i = 0; i < trees.length; i++) {
      final t = trees[i] as Map<String, dynamic>; final isVoid = t['void'] == true; final root = t['tree'] as Map<String, dynamic>;
      for (var p = 0; p < ps.length; p++) {
        try { final w = newWorld(); dynamic r = ev(root, ps[p], 0, w); if (isVoid) r = w; out.write('\$i:\$p:1:\${_v(r)}\\n'); }
        catch (_) { out.write('\$i:\$p:2:\\n'); }
      }
    }
    stdout.write(out.toString()); return;
  }
  for (var i = 0; i < trees.length; i++) {
    final t = trees[i] as Map<String, dynamic>; final isVoid = t['void'] == true; final root = t['tree'] as Map<String, dynamic>;
    for (var j = 0; j < EX.length; j++) {
      try {
        final w = newWorld();
        dynamic r = ev(root, EX[j], j, w); if (isVoid) r = w;
        final ok = CK[j](r);
        out.write('\$i:\$j:\${ok ? 1 : 0}:\${_v(r)}\\n');
      } on Missing catch (_) { out.write('\$i:\$j:2:\\n'); }
      catch (_) { out.write('\$i:\$j:2:\\n'); }
    }
  }
  stdout.write(out.toString());
}
`;
  const file = path.join(dir, needId.replace(/\W/g, '_') + '.dart'); const dill = file.replace(/\.dart$/, '.dill');
  fs.writeFileSync(file, src);
  const t0 = Date.now();
  const c = spawnSync(DART, ['compile', 'kernel', file, '-o', dill], { cwd: dir, encoding: 'utf8', timeout: 600000 });
  if (c.status !== 0 || !fs.existsSync(dill)) return { error: 'compile: ' + (c.stderr || c.stdout || '').split('\n').filter((l) => /rror/.test(l)).slice(0, 80).join(' | '), file };
  return { dill, file, compileMs: Date.now() - t0 };
}
/** מעריך עצים ברתמה מקומפלת: trees [{id, tree, void}] ⇒ {id: {ok,total,unknown,vals}} */
export function evalInterp(interp, trees, nEx, opts = {}) {
  const treesFile = interp.dill.replace(/\.dill$/, (opts.probe ? '.probe' : '') + '.trees.json');
  fs.writeFileSync(treesFile, JSON.stringify(trees.map((t) => ({ tree: t.tree, void: !!t.void }))));
  const r = spawnSync(DART, [interp.dill, treesFile, ...(opts.probe ? ['--probe'] : [])], { encoding: 'utf8', timeout: 600000, maxBuffer: 1 << 28 });
  if (opts.probe) {   // up-examples · {__probes: [argsJson…], [id]: {vals: [...]}}
    const lines = (r.stdout || '').split('\n'); const probes = []; for (const l of lines) { const m = l.match(/^P:(\d+):(.*)$/); if (m) { try { probes[+m[1]] = JSON.parse(m[2]); } catch { probes[+m[1]] = m[2]; } } }
    const out = { __probes: probes }; for (const t of trees) out[t.id] = { vals: Array(probes.length).fill(undefined) };
    for (const l of lines) { const m = l.match(/^(\d+):(\d+):([012]):(.*)$/); if (!m) continue; const e = out[trees[+m[1]].id]; if (!e) continue; e.vals[+m[2]] = m[3] === '2' ? '∅' : (() => { try { return JSON.parse(m[4]); } catch { return m[4]; } })(); }
    return out; }
  if (r.status !== 0 && !(r.stdout || '').trim()) return { error: (r.stderr || '').split('\n').filter((l) => l.trim()).slice(0, 2).join(' | ') || 'run failed' };
  const out = {}; for (const t of trees) out[t.id] = { ok: 0, total: nEx, unknown: 0, vals: Array(nEx).fill(null) };
  for (const l of (r.stdout || '').split('\n')) { const m = l.match(/^(\d+):(\d+):([012]):(.*)$/); if (!m) continue; const e = out[trees[+m[1]].id]; if (!e) continue; if (m[3] === '1') e.ok++; if (m[3] === '2') e.unknown++; if (m[4]) { try { e.vals[+m[2]] = JSON.parse(m[4]); } catch { e.vals[+m[2]] = m[4]; } } }
  return out;
}


// ══════════════════════════════════════════════════════════════════════════════
// up-crosslang · שקע חוצה-שפה: אטום-JS טהור בלי תאום-Dart ⇒ ast-js-to-dart ממיר ⇒ נכנס לרתמה-המקומפלת כמועמד ⇒ אם ניצח,
//   שקילות-על-הדוגמאות מול ה-JS המקורי (ה-JS = אמת, כעיקרון fuzz-parity). לא מתקמפל ⇒ נזרק בשקט (לא ∅ של הצורך).
// ══════════════════════════════════════════════════════════════════════════════
const SIG_RE = /^([A-Za-z_][A-Za-z0-9_<>?,. ]*?)\s+([a-z][A-Za-z0-9_]*)\(([\s\S]*?)\)\s*(?:\{|=>|async)/m;
let JS_ROWS_CACHE = null;
const JS_HELPERS = (() => { try { const m = fs.readFileSync(path.join(HERE, '..', 'emit', 'parity-ast.mjs'), 'utf8').match(/const H = `([^]*?)`;/); return m ? m[1].replace(/\\n/g, '\n') : ''; } catch { return ''; } })();   // עוזרי-הממיר (_falsy, _round…) מ-parity-ast
export function jsTwinRows(hideDart = [], sig = null) {   // hideDart: מצב-בדיקה ("אילו לא היה תאום") · sig {params,ret}: טיפוסי-השקעים של הצורך מכוונים את הממיר (slice⇒substring/sublist)
  const cacheKey = hideDart.join(',') + '|' + (sig ? JSON.stringify(sig) : ''); if (JS_ROWS_CACHE && JS_ROWS_CACHE.key === cacheKey) return JS_ROWS_CACHE.rows;
  const EV = (() => { try { return JSON.parse(fs.readFileSync(path.join(HERE, 'type-evidence.json'), 'utf8')); } catch { return {}; } })();   // ראיות-טיפוס מוקלטות (tighten) לפי שם-קובץ
  const dir = path.join(HERE, '.prove', 'interp', 'js'); fs.mkdirSync(dir, { recursive: true });
  const census = new Set((() => { try { return JSON.parse(fs.readFileSync(path.join(HERE, 'logic-census.json'), 'utf8')).map((r) => r.name); } catch { return []; } })()); for (const h of hideDart) census.delete(h);
  const atoms = path.join(R.NEW, 'atoms'); const rows = [];
  if (!fs.existsSync(atoms)) { JS_ROWS_CACHE = { key: cacheKey, rows }; return rows; }
  for (const f of fs.readdirSync(atoms).filter((x) => x.endsWith('.mjs') && !x.endsWith('.test.mjs'))) {
    const src = fs.readFileSync(path.join(atoms, f), 'utf8'); if (/^import\s/m.test(src)) continue;   // טהור בלבד (חוק-1)
    const m = src.match(/export\s+function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/); if (!m || !m[2].trim() || census.has(m[1])) continue;
    const pnames = m[2].split(',').map((x) => x.trim().split('=')[0].trim()).filter(Boolean);
    let types = {}; const ev = EV[f.replace(/\.mjs$/, '')]; if (ev && Array.isArray(ev.params)) types[m[1]] = { params: Object.fromEntries(pnames.map((n, i) => [n, ev.params[i] && ev.params[i] !== 'null' ? ev.params[i] : 'dynamic'])), ret: ev.ret };
    if (sig && sig.params && sig.params.length === pnames.length) types[m[1]] = { params: Object.fromEntries(pnames.map((n, i) => [n, String(sig.params[i]).replace(/\?$/, '')])), ret: sig.ret };   // טיפוסי-הצורך גוברים כשהאריות שווה
    let dart; try { dart = jsToDart(src, { types, force: true }); } catch { continue; }
    const dsig = dart.match(SIG_RE); if (!dsig || dsig[2] !== m[1]) continue;
    const params = dsig[3].trim() ? dsig[3].split(',').map((p) => p.trim().replace(/\s+[A-Za-z_]\w*$/, '').replace(/\?$/, '')) : [];
    const body = dart + '\n' + JS_HELPERS.split('\n').filter((l) => !/^import /.test(l) && !new RegExp('\\b' + (l.match(/^\w+\s+(_\w+)\(/) || [])[1] + '\\(').test(dart)).join('\n');   // עוזרים רק כשהאטום לא מגדיר אותם בעצמו
    const out = path.join(dir, m[1] + '.dart'); fs.writeFileSync(out, `// 🌉 תאום-Dart שהומר אוטומטית מ-new/atoms/${f} (ast-js-to-dart) · שקע חוצה-שפה · ה-JS = אמת\nimport 'dart:math';\n` + body + '\n');
    rows.push({ id: m[1], file: path.relative(R.NEW, out).split(path.sep).join('/'), params, ret: dsig[1].trim(), argc: params.length, x: 'js', jsFile: path.join(atoms, f) });
  }
  JS_ROWS_CACHE = { key: cacheKey, rows }; return rows;
}
/** שקילות-על-הדוגמאות (סינכרוני, בתהליך-node נפרד): אטום-ה-JS על ארגומנטי-הדוגמאות (ליטרלי-Dart ⇒ JS) מול ערכי-Dart ⇒ {ok, checked, mismatches} */
export function jsParity(row, examplesArgs, dartVals) {
  const script = `
    const toJs = (a) => a.replace(/<[^<>]*(?:<[^<>]*>)?[^<>]*>\\s*(?=[\\[{])/g, '');
    const norm = (v) => JSON.stringify(v === undefined ? null : v);
    const [jsFile, id, argsJson, valsJson] = process.argv.slice(1);
    const args = JSON.parse(argsJson), vals = JSON.parse(valsJson);
    import('file://' + jsFile).then((mod) => { const fn = mod[id]; const mm = []; let checked = 0;
      for (let j = 0; j < args.length; j++) { let a; try { a = new Function('return [' + toJs(args[j]) + '];')(); } catch (e) { mm.push('ex' + j + ': args ' + e.message.slice(0, 40)); continue; }
        let v; try { v = fn(...a); } catch { v = '__THROW__'; } checked++;
        let d = vals[j]; try { d = JSON.parse(d); } catch {}
        if (norm(v) !== norm(d)) mm.push('ex' + j + ': js=' + norm(v).slice(0, 40) + ' dart=' + norm(d).slice(0, 40)); }
      console.log(JSON.stringify({ ok: checked > 0 && !mm.length, checked, mismatches: mm })); }).catch((e) => console.log(JSON.stringify({ ok: false, checked: 0, mismatches: ['import: ' + e.message] })));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', script, row.jsFile, row.id, JSON.stringify(examplesArgs), JSON.stringify(dartVals)], { encoding: 'utf8', timeout: 60000 });
  try { return JSON.parse((r.stdout || '').trim().split('\n').pop()); } catch { return { ok: false, checked: 0, mismatches: ['parity: ' + (r.stderr || '').slice(0, 80)] }; }
}
