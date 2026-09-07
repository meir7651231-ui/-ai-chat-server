#!/usr/bin/env node
// 🔩 tighten-types — הידוק-טיפוסים במנועי-maor שהומרו מ-JS עם `dynamic` (GENMAX·G20 · הכרעה-25: החוזה של צעד-3 חייב להיות חד).
//   ראיה = צורת-הדאטה שזרם בבדיקות-החוזה של ה-JS (new/atoms/<k>.test.mjs, אורקל-האמת): כל בדיקה רצה עם מקליט (tighten-hook) שרושם
//   צורת כל ארגומנט/החזרה; איחוד עקבי ⇒ טיפוס-Dart (String · int/double⇒num · bool · List<T> · Map<String,T> · T? כשנראה null);
//   סתירה ⇒ נשאר dynamic. פונקציות נשארות dynamic (קונטרה-וריאנטיות של סגירות מוקלדות אצל הקוראים). §20-ד: מהדאטה, לא ממילון.
//   --record ⇒ type-evidence.json · --apply ⇒ שכתוב חתימות ב-new/dart-maor + אימות (dart analyze בטהור + flutter analyze במראה; קובץ-אדום ⇒ שחזור) ·
//   --gate ⇒ הראיה ≡ טרייה + אין חתימה שאפשר להדק (לפי הראיה) ועדיין dynamic.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { unify } from './tighten-hook.mjs';
const GEN = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(GEN, '../..');
const NEW = path.join(ROOT, 'new'), ATOMS = path.join(NEW, 'atoms'), DM = path.join(NEW, 'dart-maor');
const OUT = path.join(GEN, 'type-evidence.json');
const REJ = path.join(GEN, 'tighten-rejected.json');   // G20 · זיכרון-דחיות: אטום שהאנלייזר דחה (לפי חתימת-הראיה) לא מנוסה שוב עד שהראיה משתנה
const rejected = () => (fs.existsSync(REJ) ? JSON.parse(fs.readFileSync(REJ, 'utf8')) : {});
const LED = path.join(GEN, 'tighten-applied.json');   // G20 · פנקס-הידוקים: אטום ⇒ {fn, before:{ret,raw}, after} — מאפשר ייחוס-שגיאה ושחזור גם בריצות מאוחרות
const ledger = () => (fs.existsSync(LED) ? JSON.parse(fs.readFileSync(LED, 'utf8')) : {});
const saveLedger = (l) => fs.writeFileSync(LED, JSON.stringify(l, null, 1) + '\n');
const evKey = (e) => JSON.stringify([e.params, e.ret]);
const BS = process.env.BUILDSMART || path.resolve(ROOT, '../buildsmart/app_flutter');
const DART = process.env.DART || '/home/user/flutter/bin/dart', FLUTTER = process.env.FLUTTER || '/home/user/flutter/bin/flutter';

const sigRe = (name) => new RegExp(`^([A-Za-z_][\\w<>?,. ]*?)\\s+${name}\\(`, 'm');
export function dartSig(file) {
  const src = fs.readFileSync(file, 'utf8');
  const m = src.match(/^([A-Za-z_][\w<>?,. ]*?)\s+([a-z]\w*)\((?![^)]*\)\s*=>\s*throw)/m);   // הפונקציה-העליונה הראשונה שאינה פרטית
  const cands = [...src.matchAll(/^([A-Za-z_][\w<>?,. ]*?)\s+([a-z]\w*)\(/gm)].filter((x) => !/^(if|for|while|switch|return|else|final|const|var)$/.test(x[1].trim()) && !x[2].startsWith('_'));
  if (!cands.length) return null;
  const c = cands[0]; let i = c.index + c[0].length, depth = 1, raw = '';
  for (; i < src.length && depth > 0; i++) { const ch = src[i]; if (ch === '(') depth++; else if (ch === ')') { depth--; if (!depth) break; } raw += ch; }
  return { src, ret: c[1].trim(), name: c[2], raw, start: c.index, rawStart: c.index + c[0].length, rawEnd: i };
}
const dynAtoms = () => fs.readdirSync(DM).filter((f) => f.endsWith('.dart')).map((f) => ({ k: f.replace(/\.dart$/, ''), file: path.join(DM, f) }))
  .filter((a) => fs.existsSync(path.join(ATOMS, a.k + '.mjs')) && fs.existsSync(path.join(ATOMS, a.k + '.test.mjs')))
  .filter((a) => { const s = dartSig(a.file); return s && (s.ret === 'dynamic' || /(^|[\s,\[{])dynamic\s+\w+/.test(s.raw)); });

const recordSet = () => { const keys = new Set([...dynAtoms().map((a) => a.k), ...Object.keys(ledger()), ...Object.keys(rejected())]); return [...keys].filter((k) => fs.existsSync(path.join(ATOMS, k + '.test.mjs'))).sort().map((k) => ({ k, file: path.join(DM, k + '.dart') })); };
export function record() {
  const ev = {};
  for (const a of recordSet()) {
    const tmp = path.join(GEN, `.tt-${a.k}.json`); try { fs.unlinkSync(tmp); } catch {}
    const r = spawnSync(process.execPath, ['--import', pathToFileURL(path.join(GEN, 'tighten-hook.mjs')).href, path.join(ATOMS, a.k + '.test.mjs')], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, TT_ATOM: pathToFileURL(path.join(ATOMS, a.k + '.mjs')).href, TT_OUT: tmp } });
    let calls = []; try { calls = JSON.parse(fs.readFileSync(tmp, 'utf8')); fs.unlinkSync(tmp); } catch {}
    const s = dartSig(a.file); const fname = s ? s.name : null;
    const mine = calls.filter((c) => c.name === fname);
    if (!mine.length) { ev[a.k] = { fn: fname, calls: 0, testOk: r.status === 0 }; continue; }
    const argc = Math.max(...mine.map((c) => c.args.length));
    const params = Array.from({ length: argc }, (_, i) => unify(mine.map((c) => (i < c.args.length ? c.args[i] : 'null'))));
    const ret = unify(mine.filter((c) => c.ret !== '__THROW__').map((c) => c.ret));
    ev[a.k] = { fn: fname, calls: mine.length, testOk: r.status === 0, params, ret };
  }
  return ev;
}
// צורה ⇒ טיפוס-Dart להידוק; null ⇒ אין הידוק (dynamic נשאר)
// הכללה (בדיקות = דגימה קטנה; לא מתאימים-יתר): int⇒num · ערכי-Map⇒dynamic · List של מפות⇒List<Map<String, dynamic>> · עומק>1 ⇒ dynamic
const generalize = (sh) => {
  const nul = sh.endsWith('?'); const core = nul ? sh.slice(0, -1) : sh; let g;
  if (core === 'int' || core === 'double') g = 'num';
  else if (core === 'String' || core === 'bool' || core === 'num' || core === 'DateTime') g = core;
  else if (core.startsWith('Map<String, ')) g = 'Map<String, dynamic>';
  else if (core.startsWith('List<')) { const inner = core.slice(5, -1).replace(/\?$/, ''); g = /^(String|bool)$/.test(inner) ? `List<${inner}>` : /^(int|double|num)$/.test(inner) ? 'List<num>' : inner.startsWith('Map<String') ? 'List<Map<String, dynamic>>' : inner.startsWith('List<') ? 'List<List<dynamic>>' : 'List<dynamic>'; }
  else if (core.startsWith('Set<')) g = 'Set<dynamic>';
  else return null;
  return nul ? g + '?' : g;
};
const dartType = (sh) => { if (!sh || sh === '?' || sh === 'null' || sh === 'dynamic' || /Function/.test(sh) || /<\?>|<\?\?>/.test(sh)) return null; if (sh === 'Map<dynamic, dynamic>') return null; return generalize(sh.replace(/Map<String, null>/g, 'Map<String, dynamic>')); };
export function plan(ev) {
  const out = [];
  for (const a of dynAtoms()) {
    const e = ev[a.k]; if (!e || !e.calls) continue;
    const rj = rejected()[a.k]; if (rj && rj.key === evKey(e)) continue;   // נדחה על אותה ראיה ⇒ מדלגים
    const s = dartSig(a.file); if (!s || s.name !== e.fn) continue;
    // פרמטרים לפי סדר-המקור (חובה · [אופציונלי] · {named} — named לא מודקים: אין מיפוי-שם מה-JS)
    const parts = []; let cur = '', d = 0, mode = 'pos';
    for (const ch of s.raw) { if (ch === '[' && d === 0) { parts.push({ t: cur, mode }); cur = ''; mode = 'opt'; continue; } if (ch === '{' && d === 0) { parts.push({ t: cur, mode }); cur = ''; mode = 'named'; continue; } if ((ch === ']' || ch === '}') && d === 0) { parts.push({ t: cur, mode }); cur = ''; continue; } if ('(<'.includes(ch)) d++; else if (')>'.includes(ch)) d--; if (ch === ',' && d === 0) { parts.push({ t: cur, mode }); cur = ''; continue; } cur += ch; }
    parts.push({ t: cur, mode });
    const ps = parts.filter((p) => p.t.trim()); let pi = 0; const changes = [];
    let newRaw = s.raw;
    for (const p of ps) {
      if (p.mode === 'named') continue;
      const idx = pi++; const m = p.t.match(/^(\s*)dynamic\s+(\w+)(\s*=.*)?$/);
      if (!m) continue;
      let ty = dartType(e.params[idx]); if (!ty) continue;
      if (p.mode === 'opt' && !ty.endsWith('?') && !m[3]) ty += '?';   // אופציונלי-פוזיציונלי בלי ברירת-מחדל = nullable
      newRaw = newRaw.replace(p.t, `${m[1]}${ty} ${m[2]}${m[3] || ''}`); changes.push(`${m[2]}: dynamic ⇒ ${ty}`);
    }
    let newRet = s.ret; if (s.ret === 'dynamic') { const ty = dartType(e.ret); if (ty && !/Function/.test(ty)) { newRet = ty; changes.push(`ret: dynamic ⇒ ${ty}`); } }
    if (changes.length) out.push({ k: a.k, file: a.file, fn: s.name, changes, ret0: s.ret, raw0: s.raw, apply: (src) => src.slice(0, s.start) + newRet + src.slice(s.start + s.ret.length, s.rawStart) + newRaw + src.slice(s.rawEnd) });
  }
  return out;
}
function analyzeErrors(cwd, args) {
  const r = spawnSync(args[0], args.slice(1), { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const out = (r.stdout || '') + (r.stderr || '');
  return [...out.matchAll(/error • (.*?) • ([^\s:]+\.dart):(\d+):\d+/g)].map((m) => ({ msg: m[1], file: m[2], line: +m[3] }));
}
export function apply(ev) {
  const P = plan(ev); const applied = new Map(); const led = ledger();
  for (const p of P) { const src = fs.readFileSync(p.file, 'utf8'); applied.set(p.k, src); fs.writeFileSync(p.file, p.apply(src)); }
  const reverted = [];
  const rejMap = rejected();
  const restoreFromLedger = (k) => { const l = led[k]; if (!l) return false; const f = path.join(DM, k + '.dart'); const sg = dartSig(f); if (!sg || sg.name !== l.fn) return false; fs.writeFileSync(f, sg.src.slice(0, sg.start) + l.before.ret + sg.src.slice(sg.start + sg.ret.length, sg.rawStart) + l.before.raw + sg.src.slice(sg.rawEnd)); delete led[k]; return true; };
  const revert = (k, why) => {
    if (applied.has(k)) { fs.writeFileSync(path.join(DM, k + '.dart'), applied.get(k)); applied.delete(k); }
    else if (!restoreFromLedger(k)) return;
    reverted.push({ k, why }); if (ev[k]) rejMap[k] = { key: evKey(ev[k]), why }; fs.writeFileSync(REJ, JSON.stringify(rejMap, null, 1) + '\n'); saveLedger(led);
  };
  const known = () => new Set([...applied.keys(), ...Object.keys(led)]);
  // (א) טהור: dart analyze על האטומים שהשתנו
  for (let round = 0; round < 3 && applied.size; round++) {
    const errs = analyzeErrors(ROOT, [DART, 'analyze', ...[...applied.keys()].map((k) => `new/dart-maor/${k}.dart`)]);
    if (!errs.length) break;
    const bad = new Set(errs.map((e) => path.basename(e.file, '.dart')).filter((k) => applied.has(k)));
    if (!bad.size) break;
    for (const k of bad) revert(k, 'dart-analyze: ' + errs.find((e) => path.basename(e.file, '.dart') === k).msg.slice(0, 80));
  }
  // (ב) הקוראים: המראה ב-buildsmart (הקבצים שקיימים שם) ⇒ flutter analyze lib/genesis; שגיאה בקורא ⇒ האטום שמוזכר בשורה משוחזר
  const fnOf = new Map([...Object.entries(led).map(([k, l]) => [k, l.fn]), ...P.map((p) => [p.k, p.fn])]);
  const mirror = path.join(BS, 'lib/genesis/dart-maor');
  if (fs.existsSync(mirror)) {
    // המראה ≡ גנסיס לכל מנועי-maor הקיימים בה (לא רק המהודקים-עכשיו) — אחרת עותק ישן במראה מסתיר/ממציא שגיאות
    const inMirror = fs.readdirSync(mirror).filter((f) => f.endsWith('.dart') && fs.existsSync(path.join(DM, f))).map((f) => f.replace(/\.dart$/, ''));
    const sync = () => { for (const k of inMirror) { const a = fs.readFileSync(path.join(DM, k + '.dart'), 'utf8'); const mf = path.join(mirror, k + '.dart'); if (fs.readFileSync(mf, 'utf8') !== a) fs.writeFileSync(mf, a); } };
    for (let round = 0; round < 3; round++) {
      sync();
      const errs = analyzeErrors(BS, [FLUTTER, 'analyze', '--no-fatal-infos', '--no-fatal-warnings', 'lib/genesis']);
      if (!errs.length) break;
      let hit = false;
      for (const e of errs) {
        const k = path.basename(e.file, '.dart');
        if (applied.has(k)) { revert(k, 'mirror-analyze: ' + e.msg.slice(0, 80)); hit = true; continue; }
        const abs = path.isAbsolute(e.file) ? e.file : path.join(BS, e.file);
        const line = (fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8').split('\n')[e.line - 1] : '') || '';
        for (const k of [...known()]) { const fn = fnOf.get(k); if (fn && new RegExp(`\\b${fn}\\b`).test(line)) { revert(k, `caller ${path.basename(e.file)}:${e.line} — ${e.msg.slice(0, 80)}`); hit = true; } }   // מזהה (גם כערך-פונקציה: קונטרה-וריאנטיות), לא רק קריאה; גם הידוקים מריצות קודמות (פנקס)
      }
      if (!hit) {   // שגיאה בלי ייחוס-שורה ⇒ כל אטום-מהודק שמוזכר בקובץ-האדום משוחזר; עדיין אדום ⇒ כישלון קולני (לא משאירים מראה אדומה)
        for (const e of errs) { const abs = path.isAbsolute(e.file) ? e.file : path.join(BS, e.file); const txt = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : ''; for (const k of [...known()]) { const fn = fnOf.get(k); if (fn && new RegExp(`\\b${fn}\\b`).test(txt)) { revert(k, `file ${path.basename(e.file)} — ${e.msg.slice(0, 80)}`); hit = true; } } }
        if (!hit) { sync(); throw new Error(`tighten: ${errs.length} שגיאות-אנלייזר ללא ייחוס לאטום מהודק — ${errs.slice(0, 3).map((e) => `${e.file}:${e.line} ${e.msg.slice(0, 60)}`).join(' · ')}`); }
      }
    }
    sync();
    const fin = analyzeErrors(BS, [FLUTTER, 'analyze', '--no-fatal-infos', '--no-fatal-warnings', 'lib/genesis']);
    if (fin.length) { for (const k of [...applied.keys()]) revert(k, 'final-analyze-red'); sync(); throw new Error(`tighten: המראה אדומה אחרי ההידוק (${fin.length}) — הכל שוחזר`); }
  }
  for (const k of applied.keys()) { const p = P.find((x) => x.k === k); const sg = dartSig(path.join(DM, k + '.dart')); const s0 = applied.get(k); const before = (() => { const t = dartSig.__from ? null : null; return t; })(); led[k] = { fn: p.fn, before: { ret: p.ret0, raw: p.raw0 }, after: { ret: sg.ret, raw: sg.raw } }; }
  saveLedger(led);
  return { applied: [...applied.keys()], reverted, plan: P };
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const has = (f) => process.argv.includes(f);
  if (has('--record') || !fs.existsSync(OUT)) { const ev = record(); fs.writeFileSync(OUT, JSON.stringify(ev, null, 1) + '\n'); const n = Object.keys(ev).length, c = Object.values(ev).filter((e) => e.calls).length; console.log(`🎙️ type-evidence.json · ${n} אטומי-dynamic · ${c} עם ראיה-מבדיקות`); }
  const ev = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  if (has('--seed-ledger')) {   // חד-פעמי: הידוקים שנעשו לפני הפנקס ⇒ before מ-git HEAD
    const led = ledger(); const { execFileSync } = await import('node:child_process');
    const mod = execFileSync('git', ['status', '--short', 'new/dart-maor'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter((l) => /^ M /.test(l)).map((l) => path.basename(l.slice(3).trim(), '.dart'));
    for (const k of mod) { const cur = dartSig(path.join(DM, k + '.dart')); if (!cur) continue; const head = execFileSync('git', ['show', `HEAD:new/dart-maor/${k}.dart`], { cwd: ROOT, encoding: 'utf8' }); const tmp = path.join(GEN, '.tt-head.dart'); fs.writeFileSync(tmp, head); const bs = dartSig(tmp); fs.unlinkSync(tmp); if (!bs || bs.name !== cur.name) continue; if (bs.ret === cur.ret && bs.raw === cur.raw) continue; led[k] = { fn: cur.name, before: { ret: bs.ret, raw: bs.raw }, after: { ret: cur.ret, raw: cur.raw } }; }
    saveLedger(led); console.log(`📒 tighten-applied.json · ${Object.keys(led).length} הידוקים`);
  }
  if (has('--apply')) {
    const r = apply(ev);
    for (const p of r.plan) console.log(`${r.applied.includes(p.k) ? '✓' : '↩'} ${p.k}: ${p.changes.join(' · ')}${r.reverted.find((x) => x.k === p.k) ? ' — ' + r.reverted.find((x) => x.k === p.k).why : ''}`);
    console.log(`🔩 הודקו ${r.applied.length}/${r.plan.length} · שוחזרו ${r.reverted.length}`);
  }
  if (has('--gate')) {
    const fresh = record(); const cur = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    const diff = Object.keys({ ...fresh, ...cur }).filter((k) => JSON.stringify(fresh[k]) !== JSON.stringify(cur[k]));
    if (diff.length) { console.log(`🔴 tighten: type-evidence.json ≠ טרי (${diff.slice(0, 5).join(', ')}) — הרץ node machtzev/generator/tighten-types.mjs --record`); process.exit(1); }
    const P = plan(cur); const left = P.filter((p) => !p.changes.some((c) => /skip/.test(c)));
    const tightenable = left.length;
    if (tightenable) { console.log(`🔴 tighten: ${tightenable} חתימות ניתנות-להידוק לפי הראיה ועדיין dynamic (${left.slice(0, 5).map((p) => p.k).join(', ')}) — הרץ --apply`); process.exit(1); }
    console.log(`✓ tighten: ${Object.keys(cur).length} אטומי-dynamic · ראיה ≡ טרייה · 0 חתימות שניתן להדק ונותרו dynamic`); process.exit(0);
  }
  if (!has('--apply') && !has('--gate')) { const P = plan(ev); for (const p of P) console.log(`· ${p.k}: ${p.changes.join(' · ')}`); console.log(`📐 ${P.length} חתימות ניתנות-להידוק`); }
}
