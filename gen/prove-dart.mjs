// gen/prove-dart.mjs — הוכחה-בריצה ב-Dart לאטומים שקיימים רק ב-Dart (new/dart · new/dart-boxes; dart-maor הם תאומי ה-JS).
// אותן דוגמאות של הצורך, מתורגמות לליטרלים של Dart; קובץ-מוכיח אחד לצורך, כל מועמד×דוגמה ב-try/catch;
// שורה שאינה מתקמפלת (טיפוס לא-תואם) נפסלת כמועמד-שנכשל, לא מפילה את הקובץ (עד 4 סבבים). Node בלבד (spawn dart).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { same } from './prove.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
export const DART = process.env.DART || ['/home/user/dart/dart-sdk/bin/dart', '/home/user/flutter/bin/cache/dart-sdk/bin/dart', '/home/user/flutter/bin/dart'].find((p) => fs.existsSync(p)) || 'dart';
export const hasDart = () => { try { return spawnSync(DART, ['--version'], { encoding: 'utf8' }).status === 0; } catch { return false; } };

/** אטומי-הלוגיקה שרק ב-Dart, מהאינדקס המאוחד (קריאת-דאטה) */
export function readDartShelf() {
  const idx = path.join(ROOT, 'machtzev/generator/atom-index-full.json');
  if (!fs.existsSync(idx)) return [];
  const all = JSON.parse(fs.readFileSync(idx, 'utf8'));
  return all.filter((x) => x.layer === 'logic' && !x.file.startsWith('dart-maor/') && fs.existsSync(path.join(ROOT, 'new', x.file)))
    .map((x) => ({ name: path.basename(x.file, '.dart'), fn: x.id, file: 'new/' + x.file, n: x.argc, params: x.params, ret: x.ret, kind: 'dart' }));
}

const dstr = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$').replace(/\n/g, '\\n') + "'";
export function toDart(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'string') return dstr(v);
  if (typeof v === 'number') return Number.isInteger(v) ? String(v) : String(v);
  if (typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return '[' + v.map(toDart).join(', ') + ']';
  if (v.$fn) { const m = /^\s*(\w+)\s*=>\s*\1\.(\w+)\s*$/.exec(v.$fn); if (m) return `(dynamic ${m[1]}) => ${m[1]}[${dstr(m[2])}]`; throw new Error('שקע-פונקציה לא ניתן לתרגום ל-Dart: ' + v.$fn); }
  return '{' + Object.entries(v).map(([k, x]) => dstr(k) + ': ' + toDart(x)).join(', ') + '}';
}

/** need ⇒ { proven: [atoms], tried, failed: [{name, why}] } */
export function proveDart(need, shelf) {
  const argc = need.examples[0].args.length;
  const cands = shelf.filter((a) => a.n === argc);
  const failed = shelf.filter((a) => a.n !== argc).map((a) => ({ name: a.name, why: 'אורך-קריאה' }));
  if (!cands.length) return { proven: [], tried: shelf.length, failed };
  let exArgs;
  try { exArgs = need.examples.map((ex) => ex.args.map(toDart).join(', ')); } catch (e) { return { proven: [], tried: shelf.length, failed: [...failed, ...cands.map((a) => ({ name: a.name, why: 'דוגמה לא ניתנת לתרגום' }))], note: e.message }; }
  const dir = path.join(HERE, 'out', '.prove-dart'); fs.mkdirSync(dir, { recursive: true });
  const rel = (f) => path.relative(dir, path.join(ROOT, f)).split(path.sep).join('/');
  // מועמד שקובצו אינו מתקמפל בבידוד (part/תלות-חסרה) נפסל לבדו ומוצא מהקובץ; השאר ממשיכים
  const broken = new Set();
  let cands0 = cands;
  let imps;
  const dead = new Set();
  const body = () => cands.map((c, i) => need.examples.map((ex, j) => (broken.has(c.name) || dead.has(i + ':' + j)) ? `  out.add('${i}:${j}:x');` :
    `  try { final dynamic r = c${i}.${c.fn}(${exArgs[j]}); out.add('${i}:${j}:' + base64Encode(utf8.encode(jsonEncode(r)))); } catch (_) { out.add('${i}:${j}:x'); }`).join('\n')).join('\n');
  const file = path.join(dir, need.id.replace(/\W/g, '_') + '.dart');
  let line = '', r, note = '';
  for (let round = 0; round < 12; round++) {
    imps = ['import \'dart:convert\';', ...cands.map((c, i) => broken.has(c.name) ? '' : `import '${rel(c.file)}' as c${i};`).filter(Boolean)].join('\n');
    const HEAD = 1 + imps.split('\n').length + 2; // הערה · imports · main · out
    fs.writeFileSync(file, `// מוכיח-Dart: ${need.id} — ${cands.length} מועמדים × ${need.examples.length} דוגמאות\n${imps}\nvoid main() {\n  final out = <String>[];\n${body()}\n  print(out.join(','));\n}\n`);
    r = spawnSync(DART, ['run', file], { cwd: dir, encoding: 'utf8', timeout: 180000, maxBuffer: 64 * 1024 * 1024 });
    line = (r.stdout || '').trim().split('\n').pop() || '';
    if (/^\d+:\d+:/.test(line)) break;
    const err = String(r.stderr || r.stdout || '');
    const bad = [...err.matchAll(new RegExp(path.basename(file).replace(/\./g, '\\.') + ':(\\d+):\\d+: Error', 'g'))].map((m) => +m[1] - HEAD - 1).filter((k) => k >= 0);
    // שגיאה בתוך קובץ-אטום (לא בגוף-המוכיח) ⇒ אותו אטום מוצא
    const inAtom = [...err.matchAll(/new\/([\w\-\/]+\.dart):\d+:\d+: Error/g)].map((m) => path.basename(m[1], '.dart'));
    let changed = false;
    for (const nme of inAtom) if (cands.some((c) => c.name === nme) && !broken.has(nme)) { broken.add(nme); changed = true; }
    for (const k of bad) { const key = Math.floor(k / need.examples.length) + ':' + (k % need.examples.length); if (!dead.has(key)) { dead.add(key); changed = true; } }
    if (!changed) { note = err.split('\n').filter((l) => /rror/.test(l)).slice(0, 2).join(' | '); break; }
  }
  if (!/^\d+:\d+:/.test(line)) return { proven: [], tried: shelf.length, failed: [...failed, ...cands.map((a) => ({ name: a.name, why: 'קומפילציה' }))], note };
  for (const c of cands) if (broken.has(c.name)) failed.push({ name: c.name, why: 'לא מתקמפל בבידוד' });
  const got = {};
  for (const tok of line.split(',')) { const [i, j, b] = tok.split(':'); (got[i] ||= {})[j] = b === 'x' ? undefined : JSON.parse(Buffer.from(b, 'base64').toString('utf8')); }
  const proven = [];
  cands.forEach((c, i) => {
    if (broken.has(c.name)) return;
    const ok = need.examples.every((ex, j) => got[i] && j in got[i] && got[i][j] !== undefined && same(got[i][j], ex.want));
    if (ok) proven.push(c); else failed.push({ name: c.name, why: need.examples.some((_, j) => got[i] && got[i][j] !== undefined) ? 'פלט שונה' : 'זריקה/טיפוס' });
  });
  proven.sort((x, y) => x.name.localeCompare(y.name));
  return { proven, tried: shelf.length, failed };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const NEEDS = JSON.parse(fs.readFileSync(path.join(HERE, 'needs.data.json'), 'utf8')).needs;
  const shelf = readDartShelf();
  console.log(`Dart: ${DART} · ${hasDart() ? 'זמין' : 'לא זמין'} · ${shelf.length} אטומים רק-ב-Dart`);
  for (const need of NEEDS) {
    const t = Date.now(); const r = proveDart(need, shelf);
    const why = {}; for (const f of r.failed) why[f.why] = (why[f.why] ?? 0) + 1;
    console.log(`  ${r.proven.length ? '●' : '○'} ${need.id.padEnd(13)} נוסו ${r.tried} · הוכחו ${r.proven.length} ${r.proven.map((a) => a.name).join(' ') || '⇒ אין'} · ${Date.now() - t}ms · נפלו ${JSON.stringify(why)}${r.note ? ' · ' + r.note : ''}`);
  }
}
