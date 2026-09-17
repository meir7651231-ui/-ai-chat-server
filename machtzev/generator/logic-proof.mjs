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
const HERE = path.dirname(fileURLToPath(import.meta.url));
// c2 · פותר-Dart אחד לכל הכלים (dart-bin.resolveDart): DART_BIN ⇒ $HOME/dart-sdk ⇒ /home/user/flutter ⇒ PATH.
//   עדיפות ל-$DART אם הוגדר במפורש (מחרוזת לא-ריקה); אין בינארי ⇒ null ⇒ proveFile מחזיר {error:'tool=dart'} (L34: אין-כלי ≠ כשל, לא בליעה שקטה).
const DART = process.env.DART || resolveDart();
/** מועמד טהור = אטום בלי import (חוק-1) — ניתן להרצה בבידוד */
export const isPure = (file) => { try { const src = fs.readFileSync(path.join(R.NEW, file), 'utf8'); return [...src.matchAll(/^import\s+'([^']+)'/gm)].every((m) => /^(\.\.?\/)/.test(m[1]) || /^dart:(convert|math|core|collection|typed_data)$/.test(m[1])); } catch { return false; } };   // G48 · טהור = אפס-import, או ייבוא-יחסי מהמדף / ספריית-dart טהורה (קופסאות); package:/dart:io/ui/html ⇒ לא
// up-chain3 · קבצי-כל-הצמתים של מועמד: יחיד · שרשרת {chain} · עץ-הרכבה {tree} (הכללת §20-ב)
const treeAtoms = (v) => v.k === 'p' ? [] : [v, ...v.args.flatMap(treeAtoms)];   // צומת-אטום = {k:'a',id,file,args}; עלה-פרמטר = {k:'p',i}
const filesOf = (c) => c.chain ? c.chain.map((q) => q.file) : c.tree ? treeAtoms(c.tree).map((n) => n.file) : [c.file];
/** @param id מזהה-הצורך · cands [{id,file}] | {chain:[{id,file},{id,file}]} | {tree:root,argc} · examples [[argsDart, checkDart]] ⇒ {candId: {ok,total}} | {error} */
export function proveCandidates(id, cands, examples, extraImports = []) {   // extraImports: שקעים מהקטלוג (אטומי-דאטה/מנועים) שהדוגמאות קוראות להם בלי קידומת
  // הכרעה-20ב · «אין-יחיד ⇒ שלב כמה»: מועמד = יחיד · שרשרת B(A(args)) · **עץ-הרכבה** של עד 3 צמתים (up-chain3); כל צמתיו חייבים להיות טהורים
  const pure = cands.filter((c) => filesOf(c).every(isPure)); if (!pure.length || !examples || !examples.length) return {};
  const all = proveFile(id, pure, examples, extraImports);
  if (!all.error) return all;
  // G36 · מועמד אחד שאינו מתקמפל מול הדוגמאות (חתימה-בקטלוג ≠ גוף) לא מפיל את כולם: מוכיחים כל מועמד בקובץ-משלו; הנכשל-בקומפילציה = 0/total עם השגיאה
  const out = {}; for (const c of pure) { const r = proveFile(id + '__' + c.id, [c], examples, extraImports); out[c.id] = r.error ? { ok: 0, total: examples.length, error: r.error } : (r[c.id] || { ok: 0, total: examples.length }); }
  return out;
}
function proveFile(id, pure, examples, extraImports) {
  if (!DART) return { error: 'tool=dart' };   // אין בינארי Dart ⇒ סמן במפורש (לא מחרוזת ריקה) — הבורר יידע שלא הוכח, לא ש"נכשל"
  const dir = path.join(HERE, '.prove'); fs.mkdirSync(dir, { recursive: true });
  const rel = (f) => path.relative(dir, path.join(R.NEW, f)).split(path.sep).join('/');
  // up-chain3 · עץ-הרכבה: לכל מועמד-עץ, לכל צומת-אטום קידומת ייחודית c{i}_{k}; הביטוי משתמש בפרמטרי-הצורך p0..pn (למבדה) ובקריאות-הצמתים
  const treeParts = (root, i) => { const imports = []; let k = 0; const walk = (v) => { if (v.k === 'p') return `p${v.i}`; const idx = k++; imports.push(`import '${rel(v.file)}' as c${i}_${idx};`); const inner = v.args.map(walk).join(', '); return `c${i}_${idx}.${v.id}(${inner})`; }; return { imports, expr: walk(root) }; };
  const meta = pure.map((c, i) => c.tree ? treeParts(c.tree, i) : null);
  const imps = [...extraImports.map((f) => `import '${rel(f)}';`), ...pure.flatMap((c, i) => c.chain ? c.chain.map((q, k) => `import '${rel(q.file)}' as c${i}_${k};`) : c.tree ? meta[i].imports : [`import '${rel(c.file)}' as c${i};`])].join('\n');
  const call = (c, i, args) => c.chain ? `c${i}_1.${c.chain[1].id}(c${i}_0.${c.chain[0].id}(${args}))`   // שרשרת = B(A(args))
    : c.tree ? `((${Array.from({ length: c.argc }, (_, j) => 'dynamic p' + j).join(', ')}) { return ${meta[i].expr}; })(${args})`   // עץ = למבדה(pN) שמריצה את ביטוי-ההרכבה על ארגומנטי-הדוגמה
    : `c${i}.${c.id}(${args})`;
  // G62 · דוגמה שאינה מתקמפלת מול מועמד = **כישלון של אותה (מועמד,דוגמה)**, לא כשל-קובץ. שורת-גוף = תא (i,j).
  // up-chain3 · **תוצאה-נכתבת-בזרימה עם flush לכל תא** (קובץ .res): timeout על תא-תקוע (לולאה-אינסופית בהרכבת-אטומים
  //   אקראית — שכיח בעץ טהור-טיפוסים) שומר את ההתקדמות ⇒ התא-התקוע = הראשון-החסר ⇒ מסומן dead וממשיכים, בלי פיצוץ פר-מועמד.
  const file = path.join(dir, id.replace(/\W/g, '_') + '.dart');
  const resFile = file + '.res';
  const nEx = examples.length, nCells = pure.length * nEx;
  const known = new Map();   // "i:j" ⇒ '0'/'1' (מחושב · מת-בקומפילציה · תקוע)
  const cell = (k) => Math.floor(k / nEx) + ':' + (k % nEx);
  const header = [`// מוכיח: ${id} — ${pure.length}×${nEx}`, `import 'dart:io';`, ...(imps ? imps.split('\n') : []), `final _raf = File(r'${resFile}').openSync(mode: FileMode.write);`, `void emit(String s){ _raf.writeStringSync(s + '\\n'); _raf.flushSync(); }`, `void main() {`];
  const first = header.length + 1;   // שורת-הגוף הראשונה (1-based)
  const t0 = Date.now(); const ATTEMPT = 25000, WALL = 300000; let r = null, lastErr = '';
  for (let round = 0; known.size < nCells && round < nCells + 4 && Date.now() - t0 < WALL; round++) {
    const body = pure.map((c, i) => examples.map((ex, j) => { const cid = i + ':' + j; return known.has(cid) ? `  emit('${cid}:${known.get(cid)}');` : `  try { final dynamic r = ${call(c, i, ex[0])}; emit('${cid}:' + ((${ex[1]}) ? '1' : '0')); } catch (_) { emit('${cid}:0'); }`; }).join('\n')).join('\n');
    try { fs.unlinkSync(resFile); } catch {}
    fs.writeFileSync(file, header.join('\n') + '\n' + body + '\n  _raf.closeSync();\n}\n');
    r = spawnSync(DART, ['run', file], { cwd: dir, encoding: 'utf8', timeout: ATTEMPT });
    const res = fs.existsSync(resFile) ? fs.readFileSync(resFile, 'utf8') : '';
    const before = known.size;
    for (const l of res.split('\n')) { const m = l.match(/^(\d+:\d+):([01])$/); if (m) known.set(m[1], m[2]); }
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
  const pass = {}; for (const [cid, v] of known) { const i = +cid.split(':')[0]; (pass[pure[i].id] ||= { ok: 0, total: nEx }).ok += v === '1' ? 1 : 0; }
  return pass;
}
