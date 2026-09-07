#!/usr/bin/env node
// 🧠 auto-logic — בורר-מנוע-לוגיקה-לפי-ייעוד מכל הקטלוג (GENMAX·G18 · הכרעה-25: צעד-3 כמנוע מלא — גם הלוגיקה).
//   לכל פעולת-לוגיקה של מנוע-ההרכבה (טבלת-ATOM: match⇒smartFilter · serialize⇒toCsv …) המנוע מדרג את **כל** 848 מנועי-הלוגיקה
//   באינדקס-האמת לפי: (א) התאמת-חתימה (argc · טיפוסי-פרמטרים · החזרה — dynamic תואם הכל, טיפוס-מפורש חייב שוויון) ·
//   (ב) הסכמת-טיפוסים (פרמטר מפורש-ושווה = +1) · (ג) חפיפת-ייעוד: הביקוש (הערות-ה-import של הזהב + שמות-החלקיקים) מול
//   כותרת-ה-doc של המנוע (מהמקור, לא מילון) — משוקלל idf (טוקן נדיר שווה יותר) עם נרמול-מורפולוגי קל (ה/ו/ב/ל/מ/ש בראש) ·
//   (ד) מוצא משותף (`מוצא: <קובץ-JS>`) = אחים מאותו מודול-מקור. שוויון ⇒ המנוע-של-הזהב (חוק-4: הקוד-החלוץ קדוש).
//   החלפה מוצעת רק כשהמועמד ≡ בחתימה ומנצח בניקוד; היא **מיושמת** (logicPass) רק אחרי הוכחה: מודול-הזהב עם ההחלפה עובר את
//   בדיקות-הזהב שלו (--prove). G19: מועמד לא-זהה-בחתימה מקבל **עטיפת-חתימה** (adapter בשם-הזהב, cast פוזיציוני, עודף נשמט), ולפני ההוכחה
//   **מוטציית-רגישות** (stub שזורק) — אם הבדיקות לא נופלות, הן לא מפעילות את המנוע ⇒ אין הוכחה. פלט: auto-logic.json · --gate: מחויב ≡ טרי.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const GEN = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(GEN, '../..');
const NEW = path.join(ROOT, 'new');
const OUT = path.join(GEN, 'auto-logic.json');
const BS = process.env.BUILDSMART || path.resolve(ROOT, '../buildsmart/app_flutter');
const FLUTTER = process.env.FLUTTER || (fs.existsSync('/home/user/flutter/bin/flutter') ? '/home/user/flutter/bin/flutter' : 'flutter');

const heTok = (s) => [...String(s).matchAll(/[֐-׿][֐-׿"'\-״]{1,}/g)].map((m) => m[0].replace(/^["'\-]+|["'\-]+$/g, '')).filter((t) => t.length >= 2);
// נרמול קל: פיצול מורכבים ב-'-' + הסרת אות-שימוש בראש (ה/ו/ב/ל/מ/ש/כ) כשהשארית ≥3 — סטטיסטי, לא מילון
const parts = (t) => t.split(/[-\/·]/).filter((x) => x.length >= 2).map((x) => (x.length > 3 && /^[הובלמשכ]/.test(x) ? x.slice(1) : x));
const bag = (tokens) => new Set(tokens.flatMap((t) => [t, ...parts(t)]));

export function catalog() {
  const IDX = JSON.parse(fs.readFileSync(path.join(GEN, 'atom-index-full.json'), 'utf8')).filter((a) => a.layer === 'logic');
  const rows = IDX.map((a) => {
    let src = ''; try { src = fs.readFileSync(path.join(NEW, a.file), 'utf8'); } catch {}
    const lines = src.split('\n').filter((l) => /^\s*\/\//.test(l)).slice(0, 8);
    const first = lines[0] || ''; const m = first.match(/—\s*(.+)$/);
    const origin = ((lines.join(' ').match(/מוצא:\s*([\w./-]+)/) || [])[1] || '').replace(/:\d.*$/, '') || null;
    return { ...a, title: m ? m[1] : first, titleTok: bag(heTok(m ? m[1] : first)), bodyTok: bag(lines.slice(1, 4).flatMap(heTok)), origin };
  });
  // idf: טוקן שמופיע בהרבה מנועים = boilerplate (אטום/חוזה/מוצא/טוהר…) ⇒ משקל אפסי
  const df = {}; for (const r of rows) for (const t of new Set([...r.titleTok, ...r.bodyTok])) df[t] = (df[t] || 0) + 1;
  const N = rows.length; const idf = (t) => Math.log(N / ((df[t] || 0) + 1));
  return { rows, idf, N };
}
export function composeOps() {
  const CE = fs.readFileSync(path.join(ROOT, 'machtzev/compose-engine.mjs'), 'utf8');
  const ATOM = Object.fromEntries([...CE.matchAll(/^\s*(\w+):\s*\{\s*atom:\s*'([^']+)'/gm)].map((m) => [m[1], m[2]]));
  const NAMES = Object.fromEntries([...CE.matchAll(/\{ id: '([^']+)',\s*name: '((?:[^'\\]|\\.)*)',\s*f: \{ kind: '([^']+)'/g)].map((m) => [m[1], { name: m[2], kind: m[3] }]));
  const KIND_OPS = Object.fromEntries([...CE.matchAll(/if \(f\.kind === '([^']+)'\)[^\n]*?\n?[^\n]*?return \[([\s\S]*?)\];/g)].map((m) => [m[1], [...m[2].matchAll(/op:\s*'(\w+)'/g)].map((x) => x[1])]));
  const particlesOf = (op) => Object.values(NAMES).filter((x) => (KIND_OPS[x.kind] || []).includes(op)).map((x) => x.name);
  return { ATOM, particlesOf };
}
// G19 · חתימה-אמיתית מהמקור (האינדקס משטח [אופציונלי]/{named}): ret · רשימת-הפרמטרים המילולית · פוזיציונליים (חובה/אופציונלי) · named — לעטיפה שמתקמפלת
const SIG_CACHE = new Map();
export function sigOf(file, name) {
  const key = file + '#' + name; if (SIG_CACHE.has(key)) return SIG_CACHE.get(key);
  let sig = null;
  try {
    const src = fs.readFileSync(path.join(NEW, file), 'utf8');
    const m = src.match(new RegExp(`^([A-Za-z_][\\w<>?,. ]*?)\\s+${name}\\(`, 'm'));
    if (m) {
      let i = m.index + m[0].length, depth = 1, raw = '';
      for (; i < src.length && depth > 0; i++) { const ch = src[i]; if (ch === '(') depth++; else if (ch === ')') { depth--; if (!depth) break; } raw += ch; }
      const groups = { pos: [], opt: [], named: [] }; let cur = '', d = 0, mode = 'pos';
      const push = () => { const t = cur.trim(); cur = ''; if (!t) return; const noDef = t.replace(/\s*=.*$/, ''); const nm = (noDef.match(/([A-Za-z_]\w*)\s*$/) || [])[1] || ''; const ty = noDef.slice(0, noDef.length - nm.length).replace(/\b(required|final|covariant)\b/g, '').trim() || 'dynamic'; groups[mode].push({ type: ty, name: nm, required: /\brequired\b/.test(t) || mode === 'pos' }); };
      for (const ch of raw) { if (ch === '[' && d === 0) { push(); mode = 'opt'; continue; } if (ch === '{' && d === 0) { push(); mode = 'named'; continue; } if ((ch === ']' || ch === '}') && d === 0) { push(); continue; } if ('(<'.includes(ch)) d++; else if (')>'.includes(ch)) d--; if (ch === ',' && d === 0) { push(); continue; } cur += ch; }
      push();
      sig = { ret: m[1].trim(), raw: raw.replace(/\s+/g, ' ').trim(), ...groups };
    }
  } catch {}
  SIG_CACHE.set(key, sig); return sig;
}
// G19 · פרמטר באינדקס = "טיפוס" או "טיפוס-פונקציה שם"; ל-adapter צריך את הטיפוס-המלא (כולל Function(...)) ושם פוזיציוני
const typeOf = (p) => { const m = String(p || 'dynamic').match(/^(.+Function\([^)]*\)\??)\s+\w+$/); return (m ? m[1] : String(p || 'dynamic')).trim(); };
const norm = (t) => String(t || 'dynamic').replace(/\s+/g, '').replace(/\?$/, '').replace(/^(\w+(?:<[^>]*>)?)Function.*$/, '$1Function');
// עטיפת-חתימה (G19): המנוע-הנבחר מקבל פרמטרים בחתימת-הזהב ומעביר למועמד עם cast; פרמטרי-יתר של הזהב נשמטים (קידומת-פוזיציונית); לא ממציאים ארגומנטים (§20-ג)
export function adapterCode(from, to, d, c) {
  const sd = sigOf(d.file, from), sc = sigOf(c.file, to); if (!sd || !sc) return null;
  const dPos = [...sd.pos, ...sd.opt], cPos = [...sc.pos, ...sc.opt];
  if (sc.named.some((p) => p.required && !sd.named.find((q) => q.name === p.name))) return null;   // named-חובה בלי מקור ⇒ אין המצאה (§20-ג)
  if (sc.pos.length > dPos.length) return null;
  const args = cPos.slice(0, Math.min(cPos.length, dPos.length)).map((p, i) => { const a = norm(p.type), b = norm(dPos[i].type); return a === 'dynamic' || a === b ? dPos[i].name : `${dPos[i].name} as ${p.type}`; });
  for (const p of sc.named) { const q = sd.named.find((x) => x.name === p.name); if (q) args.push(`${p.name}: ${q.name}`); }
  const call = `${to}(${args.join(', ')})`;
  const body = norm(sd.ret) === 'dynamic' || norm(sd.ret) === norm(sc.ret) ? call : `${call} as ${sd.ret}`;
  return `// G19 · עטיפת-חתימה (מנוע-לפי-ייעוד): ${from}(${sd.raw}) ⇒ ${to}(${sc.raw})\n${sd.ret} ${from}(${sd.raw}) => ${body};`;
}
export const ident = (c, d) => c.argc === d.argc && c.params.every((p, i) => norm(p) === norm(d.params[i])) && norm(c.ret) === norm(d.ret);
const compat = (c, d) => { if (c.argc > d.argc || c.argc === 0) return false; for (let i = 0; i < c.argc; i++) { const a = norm(c.params[i]), b = norm(d.params[i]); if (a !== 'dynamic' && b !== 'dynamic' && a !== b) return false; } const ra = norm(c.ret), rb = norm(d.ret); return ra === 'dynamic' || rb === 'dynamic' || ra === rb; };   // G19 · קידומת-פוזיציונית: מועמד עם פחות פרמטרים כשיר (העודף נשמט ב-adapter)
const agree = (c, d) => { let n = 0; for (let i = 0; i < c.argc; i++) { const a = norm(c.params[i]); if (a !== 'dynamic' && a === norm(d.params[i])) n++; } if (norm(c.ret) !== 'dynamic' && norm(c.ret) === norm(d.ret)) n++; return n; };

export function rankAll() {
  const { rows, idf } = catalog(); const { ATOM, particlesOf } = composeOps();
  const byId = new Map(rows.map((r) => [r.id, r]));
  const gold = fs.readdirSync(path.join(NEW, 'dart-gen-bs')).filter((f) => /^schoolos.*\.dart$/.test(f)).map((f) => fs.readFileSync(path.join(NEW, 'dart-gen-bs', f), 'utf8')).join('\n');
  const impCom = {}; for (const m of gold.matchAll(/^import '\.\.\/(dart-maor|dart)\/([^']+)';\s*\/\/\s*(.+)$/gm)) { const k = m[1] + '/' + m[2]; (impCom[k] ||= []).push(...heTok(m[3])); }
  const out = {}; const reach = new Set();   // L91 · reach = כל מנוע שכשיר-בחתימה לפעולה כלשהי — מה שהבורר באמת שוקל
  for (const [op, atom] of Object.entries(ATOM)) {
    const d = byId.get(atom); if (!d) continue;   // אטום-תצוגה — לא כאן (auto-skin)
    const demand = bag([...(impCom[d.file] || []), ...particlesOf(op).flatMap(heTok)]);
    const score = (c) => { let s = 0; for (const t of c.titleTok) if (demand.has(t)) s += 2 * idf(t); for (const t of c.bodyTok) if (demand.has(t) && !c.titleTok.has(t)) s += idf(t); return s + agree(c, d) + (d.origin && c.origin === d.origin ? 1.5 : 0); };
    const cands = rows.filter((c) => compat(c, d)).map((c) => ({ id: c.id, file: c.file, score: +(score(c) - (d.argc - c.argc) * 2).toFixed(2), ident: ident(c, d), argc: c.argc, params: c.params, ret: c.ret }))   // פרמטר שנשמט = ייעוד חלקי (-2 לכל אחד)
      .sort((x, y) => y.score - x.score || (x.id === atom ? -1 : y.id === atom ? 1 : 0) || (x.id < y.id ? -1 : 1));
    for (const c of cands) reach.add(c.id);
    const top = cands[0]; const declaredRank = cands.findIndex((c) => c.id === atom);
    let swap = null;
    if (top && top.id !== atom && top.score > (cands[declaredRank] ? cands[declaredRank].score : 0)) {
      const ad = top.ident ? null : adapterCode(atom, top.id, d, top);
      swap = top.ident || ad ? { to: top.id, file: top.file, mode: top.ident ? 'ident' : 'adapter', adapter: ad } : { to: top.id, file: top.file, mode: 'unadaptable', adapter: null };   // G19 · לא-≡ ⇒ עטיפת-חתימה; אין עטיפה כשרה (named-חובה/עודף-פרמטרים) ⇒ לא מיושם
    }
    out[op] = { declared: atom, declaredFile: d.file, pick: swap ? top.id : atom, candidates: cands.length, declaredRank, top3: cands.slice(0, 3).map((c) => `${c.id}:${c.score}${c.ident ? '≡' : ''}`), swap };
  }
  Object.defineProperty(out, 'reach', { value: [...reach].sort(), enumerable: false });   // לא נכנס ל-ops ב-JSON; נכתב בנפרד
  return out;
}
// הוכחה: מודול-זהב שמשתמש במנוע המוחלף ⇒ העתק עם ההחלפה למראה ⇒ בדיקות-הזהב ⇒ שחזור. ירוק = ההחלפה מוכחת-לייעוד.
const TESTS = { 'schoolos.dart': ['genesis_inventory_states_test.dart', 'genesis_schoolos_nav_test.dart'] };
const testsOf = (m) => TESTS[m] || [`genesis_${m.replace(/^schoolos_/, '').replace(/\.dart$/, '')}_test.dart`];
export function applySwap(code, from, to, toFile, adapter = null) {
  const rel = '../' + toFile;
  const impRe = new RegExp(`^import '\\.\\./(?:dart-maor|dart)/[^']*';(\\s*//[^\\n]*)?$`, 'gm');
  const kebab = from.replace(/([A-Z])/g, '-$1').toLowerCase();
  let replaced = false;
  const repl = adapter ? `import '${rel}'; // G19 · מנוע-לפי-ייעוד: ${from} ⇒ ${to} (עטיפת-חתימה למטה)` : `import '${rel}'; // G18 · מנוע-לפי-ייעוד: ${from} ⇒ ${to}`;
  let out = code.replace(impRe, (line) => { if (!replaced && (line.includes(`/${kebab}.dart`) || new RegExp(`\\b${from}\\b`).test(line))) { replaced = true; return repl; } return line; });
  if (!replaced) out = out.replace(/\n(import ')/, `\n${repl}\n$1`);
  if (adapter) { const lastImp = out.split('\n').reduce((a, l, i) => (/^import '/.test(l) ? i : a), -1); const L = out.split('\n'); L.splice(lastImp + 1, 0, '', adapter); out = L.join('\n'); }
  else out = out.replace(new RegExp(`\\b${from}\\(`, 'g'), `${to}(`);
  return out;
}
// G19 · רגישות: stub שזורק במקום המנוע — אם בדיקות-הזהב עדיין ירוקות, הן לא מפעילות את המנוע ⇒ הוכחה בלתי-אפשרית (לא "מוכח")
export function mutationStub(from, d) { const sd = sigOf(d.file, from); if (!sd) return null; return `// G19 · מוטציית-רגישות\n${sd.ret} ${from}(${sd.raw}) => throw StateError('G19-mutation: ${from}');`; }
const runTests = (m) => { let ok = 0, n = 0, compileError = false; for (const t of testsOf(m)) { const x = spawnSync(FLUTTER, ['test', 'test/' + t, '--reporter', 'compact'], { cwd: BS, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); const out = (x.stdout || '') + (x.stderr || ''); if (/Compilation failed|Error: /.test(out)) compileError = true; const last = [...out.matchAll(/\+(\d+)(?:\s+-(\d+))?:/g)].pop(); const p = last ? +last[1] : 0, f = last && last[2] ? +last[2] : 0; ok += p; n += p + f; if (x.status !== 0) n = Math.max(n, ok + 1); } return { ok, n, compileError }; };
export function prove(res) {
  if (!fs.existsSync(path.join(BS, 'pubspec.yaml'))) return res;
  const { rows } = catalog(); const byId = new Map(rows.map((r) => [r.id, r]));
  for (const [op, r] of Object.entries(res)) {
    if (!r.swap || r.swap.mode === 'unadaptable') continue;
    const d = byId.get(r.declared);
    const users = fs.readdirSync(path.join(NEW, 'dart-gen-bs')).filter((f) => /^schoolos.*\.dart$/.test(f) && new RegExp(`\\b${r.declared}\\(`).test(fs.readFileSync(path.join(NEW, 'dart-gen-bs', f), 'utf8')));
    let sens = { ok: 0, n: 0, ce: false }, pr = { ok: 0, n: 0, ce: false };
    for (const m of users) {
      const mirror = path.join(BS, 'lib/genesis/dart-gen-bs', m);
      const src = fs.readFileSync(path.join(NEW, 'dart-gen-bs', m), 'utf8');
      try {
        fs.writeFileSync(mirror, applySwap(src, r.declared, r.declared + 'Stub', r.declaredFile, mutationStub(r.declared, d)).replace(new RegExp(`import '\\.\\./${r.declaredFile.replace(/\./g, '\\.')}';[^\\n]*\\n`), ''));   // stub במקום המנוע (בלי ה-import המקורי)
        const t1 = runTests(m); sens.ok += t1.ok; sens.n += t1.n; sens.ce = sens.ce || t1.compileError;
        fs.writeFileSync(mirror, applySwap(src, r.declared, r.swap.to, r.swap.file, r.swap.adapter));
        const t2 = runTests(m); pr.ok += t2.ok; pr.n += t2.n; pr.ce = pr.ce || t2.compileError;
      } finally { fs.writeFileSync(mirror, src); }
    }
    const sensitive = !sens.ce && sens.n > 0 && sens.ok < sens.n;   // ה-stub (שמתקמפל) הפיל בדיקה ⇒ הבדיקות מפעילות את המנוע; שגיאת-קומפילציה = לא-מסקנה
    const proven = sensitive && !pr.ce && pr.n > 0 && pr.ok === pr.n;
    r.swap.proof = { modules: users, sensitivity: `${sens.ok}/${sens.n}${sens.ce ? ' (compile-error)' : ''}`, sensitive, tests: `${pr.ok}/${pr.n}${pr.ce ? ' (compile-error)' : ''}`, proven, verdict: sens.ce ? 'stub-לא-מתקמפל' : !sensitive ? 'הבדיקות-לא-מפעילות-את-המנוע' : pr.ce ? 'העטיפה-לא-מתקמפלת' : proven ? 'מוכח' : 'נכשל-בבדיקות-הזהב' };
    if (!proven) r.pick = r.declared;   // לא-רגיש או נכשל ⇒ המנוע-של-הזהב נשאר (§20-ג · חוק-4)
  }
  return res;
}
export function provenSwaps() { if (!fs.existsSync(OUT)) return []; const j = JSON.parse(fs.readFileSync(OUT, 'utf8')); return Object.values(j.ops || {}).filter((r) => r.swap && r.swap.proof && r.swap.proof.proven).map((r) => ({ from: r.declared, to: r.swap.to, file: r.swap.file, adapter: r.swap.adapter || null })); }
// logicPass — מיישם החלפות-מוכחות בקוד-מודול מחולל (retarget/skin-golden)
export function logicPass(code) { let n = 0; for (const s of provenSwaps()) if (new RegExp(`\\b${s.from}\\(`).test(code)) { code = applySwap(code, s.from, s.to, s.file, s.adapter); n++; } return { code, swaps: n }; }

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { ops: {} };
  let ops = rankAll();
  // הוכחות נשמרות (יקרות): הוכחה קודמת תקפה כל עוד אותה החלפה מוצעת; --prove מריץ מחדש
  for (const [op, r] of Object.entries(ops)) { const p = prev.ops && prev.ops[op]; if (r.swap && p && p.swap && p.swap.to === r.swap.to && p.swap.proof && !process.argv.includes('--prove')) { r.swap.proof = p.swap.proof; if (!p.swap.proof.proven) r.pick = r.declared; } }
  if (process.argv.includes('--prove')) ops = prove(ops);
  for (const r of Object.values(ops)) if (r.swap && !r.swap.proof) r.pick = r.declared;   // החלפה שטרם הוכחה אינה מיושמת
  const n = Object.keys(ops).length, confirmed = Object.values(ops).filter((r) => r.declaredRank === 0).length, swaps = Object.values(ops).filter((r) => r.swap).length, proven = Object.values(ops).filter((r) => r.swap && r.swap.proof && r.swap.proof.proven).length;
  const fresh = JSON.stringify({ summary: { ops: n, confirmed, swapsProposed: swaps, swapsProven: proven, reach: (ops.reach || []).length }, ops, reach: ops.reach || [] }, null, 1) + '\n';   // reach ⇒ truth.mjs (L91)
  if (process.argv.includes('--gate')) {
    if (!fs.existsSync(OUT) || fs.readFileSync(OUT, 'utf8') !== fresh) { console.log('🔴 autologic: auto-logic.json ≠ בורר-טרי (הרץ node machtzev/generator/auto-logic.mjs)'); process.exit(1); }
    console.log(`✓ autologic: ${n} פעולות-לוגיקה × ${catalog().N} מנועים · הזהב מאושר-כטוב-ביותר ${confirmed}/${n} · החלפות מוצעות ${swaps} · מוכחות ${proven}`); process.exit(0);
  }
  fs.writeFileSync(OUT, fresh);
  for (const [op, r] of Object.entries(ops)) console.log(`${op.padEnd(12)} ${r.declared.padEnd(22)} ${r.declaredRank === 0 ? '✓' : '✗ #' + (r.declaredRank + 1)} · ${r.candidates} מועמדים · ${r.top3.join(' · ')}${r.swap ? ` ⇒ swap ${r.swap.to} [${r.swap.mode}]${r.swap.proof ? ' ' + (r.swap.proof.proven ? '✓' : '✗') + r.swap.proof.verdict : r.swap.mode === 'unadaptable' ? ' (אין עטיפה כשרה)' : ' (טרם הוכח)'}` : ''}`);
  console.log(`✍️ auto-logic.json · ${n} פעולות · מאושר ${confirmed}/${n} · החלפות ${swaps} (מוכחות ${proven})`);
}
