#!/usr/bin/env node
// 🔬 logic-proof — המוכיח-האחד (G34ב · הכרעה-30 «הכי-טוב-לייעוד = מה שהמנוע עושה»): דוגמאות (קלט ⇒ בדיקה על r) רצות ב-Dart
//   על כל המועמדים תואמי-החתימה (קובץ-מוכיח אחד לצורך, ייבוא-בקידומת, try/catch לכל דוגמה) ⇒ מפה {מועמד: {ok, total}}.
//   משמש את behavior-plan (צרכי-בלגן) ואת auto-logic (פעולות-הזהב, כשיש gold-examples) — בורר אחד, כלל אחד: הוכחה קודמת לתיאור.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as R from '../root.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const DART = process.env.DART || (fs.existsSync('/home/user/flutter/bin/cache/dart-sdk/bin/dart') ? '/home/user/flutter/bin/cache/dart-sdk/bin/dart' : 'dart');
/** מועמד טהור = אטום בלי import (חוק-1) — ניתן להרצה בבידוד */
export const isPure = (file) => { try { const src = fs.readFileSync(path.join(R.NEW, file), 'utf8'); return [...src.matchAll(/^import\s+'([^']+)'/gm)].every((m) => /^(\.\.?\/)/.test(m[1]) || /^dart:(convert|math|core|collection|typed_data)$/.test(m[1])); } catch { return false; } };   // G48 · טהור = אפס-import, או ייבוא-יחסי מהמדף / ספריית-dart טהורה (קופסאות); package:/dart:io/ui/html ⇒ לא
/** @param id מזהה-הצורך · cands [{id,file}] · examples [[argsDart, checkDart]] ⇒ {candId: {ok,total}} | {error} */
export function proveCandidates(id, cands, examples, extraImports = []) {   // extraImports: שקעים מהקטלוג (אטומי-דאטה/מנועים) שהדוגמאות קוראות להם בלי קידומת
  const pure = cands.filter((c) => isPure(c.file)); if (!pure.length || !examples || !examples.length) return {};
  const all = proveFile(id, pure, examples, extraImports);
  if (!all.error) return all;
  // G36 · מועמד אחד שאינו מתקמפל מול הדוגמאות (חתימה-בקטלוג ≠ גוף) לא מפיל את כולם: מוכיחים כל מועמד בקובץ-משלו; הנכשל-בקומפילציה = 0/total עם השגיאה
  const out = {}; for (const c of pure) { const r = proveFile(id + '__' + c.id, [c], examples, extraImports); out[c.id] = r.error ? { ok: 0, total: examples.length, error: r.error } : (r[c.id] || { ok: 0, total: examples.length }); }
  return out;
}
function proveFile(id, pure, examples, extraImports) {
  const dir = path.join(HERE, '.prove'); fs.mkdirSync(dir, { recursive: true });
  const imps = [...extraImports.map((f) => `import '${path.relative(dir, path.join(R.NEW, f)).split(path.sep).join('/')}';`), ...pure.map((c, i) => `import '${path.relative(dir, path.join(R.NEW, c.file)).split(path.sep).join('/')}' as c${i};`)].join('\n');
  const body = pure.map((c, i) => examples.map((ex, j) => `  try { final dynamic r = c${i}.${c.id}(${ex[0]}); out.add('${i}:${j}:' + ((${ex[1]}) ? '1' : '0')); } catch (_) { out.add('${i}:${j}:0'); }`).join('\n')).join('\n');
  const file = path.join(dir, id.replace(/\W/g, '_') + '.dart');
  fs.writeFileSync(file, `// מוכיח-בחירה: ${id} — ${pure.length} מועמדים × ${examples.length} דוגמאות\n${imps}\nvoid main() {\n  final out = <String>[];\n${body}\n  print(out.join(','));\n}\n`);
  const r = spawnSync(DART, ['run', file], { cwd: dir, encoding: 'utf8', timeout: 120000 });
  const line = (r.stdout || '').trim().split('\n').pop() || '';
  if (!line.includes(':')) return { error: (r.stderr || r.stdout || '').split('\n').filter((l) => /rror/.test(l)).slice(0, 2).join(' | ') };
  const pass = {}; for (const tok of line.split(',')) { const [i, j, ok] = tok.split(':'); if (i === undefined || ok === undefined) continue; (pass[pure[+i].id] ||= { ok: 0, total: examples.length }).ok += ok === '1' ? 1 : 0; }
  return pass;
}
