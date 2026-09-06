#!/usr/bin/env node
// 🧠 auto-logic — בורר-מנוע-לוגיקה-לפי-ייעוד מכל הקטלוג (GENMAX·G18 · הכרעה-25: צעד-3 כמנוע מלא — גם הלוגיקה).
//   לכל פעולת-לוגיקה של מנוע-ההרכבה (טבלת-ATOM: match⇒smartFilter · serialize⇒toCsv …) המנוע מדרג את **כל** 848 מנועי-הלוגיקה
//   באינדקס-האמת לפי: (א) התאמת-חתימה (argc · טיפוסי-פרמטרים · החזרה — dynamic תואם הכל, טיפוס-מפורש חייב שוויון) ·
//   (ב) הסכמת-טיפוסים (פרמטר מפורש-ושווה = +1) · (ג) חפיפת-ייעוד: הביקוש (הערות-ה-import של הזהב + שמות-החלקיקים) מול
//   כותרת-ה-doc של המנוע (מהמקור, לא מילון) — משוקלל idf (טוקן נדיר שווה יותר) עם נרמול-מורפולוגי קל (ה/ו/ב/ל/מ/ש בראש) ·
//   (ד) מוצא משותף (`מוצא: <קובץ-JS>`) = אחים מאותו מודול-מקור. שוויון ⇒ המנוע-של-הזהב (חוק-4: הקוד-החלוץ קדוש).
//   החלפה מוצעת רק כשהמועמד ≡ בחתימה ומנצח בניקוד; היא **מיושמת** (logicPass) רק אחרי הוכחה: מודול-הזהב עם ההחלפה עובר את
//   בדיקות-הזהב שלו (--prove). פלט: auto-logic.json · --gate: מחויב ≡ טרי.
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
const norm = (t) => String(t || 'dynamic').replace(/\s+/g, '').replace(/\?$/, '').replace(/^(\w+(?:<[^>]*>)?)Function.*$/, '$1Function');
export const ident = (c, d) => c.argc === d.argc && c.params.every((p, i) => norm(p) === norm(d.params[i])) && norm(c.ret) === norm(d.ret);
const compat = (c, d) => { if (c.argc !== d.argc) return false; for (let i = 0; i < c.argc; i++) { const a = norm(c.params[i]), b = norm(d.params[i]); if (a !== 'dynamic' && b !== 'dynamic' && a !== b) return false; } const ra = norm(c.ret), rb = norm(d.ret); return ra === 'dynamic' || rb === 'dynamic' || ra === rb; };
const agree = (c, d) => { let n = 0; for (let i = 0; i < c.argc; i++) { const a = norm(c.params[i]); if (a !== 'dynamic' && a === norm(d.params[i])) n++; } if (norm(c.ret) !== 'dynamic' && norm(c.ret) === norm(d.ret)) n++; return n; };

export function rankAll() {
  const { rows, idf } = catalog(); const { ATOM, particlesOf } = composeOps();
  const byId = new Map(rows.map((r) => [r.id, r]));
  const gold = fs.readdirSync(path.join(NEW, 'dart-gen-bs')).filter((f) => /^schoolos.*\.dart$/.test(f)).map((f) => fs.readFileSync(path.join(NEW, 'dart-gen-bs', f), 'utf8')).join('\n');
  const impCom = {}; for (const m of gold.matchAll(/^import '\.\.\/(dart-maor|dart)\/([^']+)';\s*\/\/\s*(.+)$/gm)) { const k = m[1] + '/' + m[2]; (impCom[k] ||= []).push(...heTok(m[3])); }
  const out = {};
  for (const [op, atom] of Object.entries(ATOM)) {
    const d = byId.get(atom); if (!d) continue;   // אטום-תצוגה — לא כאן (auto-skin)
    const demand = bag([...(impCom[d.file] || []), ...particlesOf(op).flatMap(heTok)]);
    const score = (c) => { let s = 0; for (const t of c.titleTok) if (demand.has(t)) s += 2 * idf(t); for (const t of c.bodyTok) if (demand.has(t) && !c.titleTok.has(t)) s += idf(t); return s + agree(c, d) + (d.origin && c.origin === d.origin ? 1.5 : 0); };
    const cands = rows.filter((c) => compat(c, d)).map((c) => ({ id: c.id, file: c.file, score: +score(c).toFixed(2), ident: ident(c, d) }))
      .sort((x, y) => y.score - x.score || (x.id === atom ? -1 : y.id === atom ? 1 : 0) || (x.id < y.id ? -1 : 1));
    const top = cands[0]; const declaredRank = cands.findIndex((c) => c.id === atom);
    const swap = top && top.id !== atom && top.ident && top.score > (cands[declaredRank] ? cands[declaredRank].score : 0) ? { to: top.id, file: top.file } : null;
    out[op] = { declared: atom, declaredFile: d.file, pick: swap ? top.id : atom, candidates: cands.length, declaredRank, top3: cands.slice(0, 3).map((c) => `${c.id}:${c.score}${c.ident ? '≡' : ''}`), swap };
  }
  return out;
}
// הוכחה: מודול-זהב שמשתמש במנוע המוחלף ⇒ העתק עם ההחלפה למראה ⇒ בדיקות-הזהב ⇒ שחזור. ירוק = ההחלפה מוכחת-לייעוד.
const TESTS = { 'schoolos.dart': ['genesis_inventory_states_test.dart', 'genesis_schoolos_nav_test.dart'] };
const testsOf = (m) => TESTS[m] || [`genesis_${m.replace(/^schoolos_/, '').replace(/\.dart$/, '')}_test.dart`];
export function applySwap(code, from, to, toFile) {
  const fromFile = (code.match(new RegExp(`^import '\\.\\./(?:dart-maor|dart)/([^']+)';.*\\b${from}\\b|^import '\\.\\./(?:dart-maor|dart)/([^']+)';`, 'm')) || []);
  let out = code.replace(new RegExp(`\\b${from}\\(`, 'g'), `${to}(`);
  const rel = '../' + toFile;   // dart-maor/x.dart ⇒ ../dart-maor/x.dart
  // ה-import של המנוע-הישן ⇒ של החדש (אם קיים); אחרת מוסיפים
  const re = new RegExp(`^import '\\.\\./(?:dart-maor|dart)/[^']*';(\\s*//[^\\n]*)?$`, 'gm');
  let replaced = false;
  out = out.replace(re, (line) => { if (!replaced && new RegExp(`\\b${from}\\b`).test(line) || (!replaced && line.includes(from.replace(/([A-Z])/g, '-$1').toLowerCase()))) { replaced = true; return `import '${rel}'; // G18 · מנוע-לפי-ייעוד: ${from} ⇒ ${to}`; } return line; });
  if (!replaced) out = out.replace(/\n(import ')/, `\nimport '${rel}'; // G18 · מנוע-לפי-ייעוד: ${from} ⇒ ${to}\n$1`);
  return out;
}
export function prove(res) {
  if (!fs.existsSync(path.join(BS, 'pubspec.yaml'))) return res;
  for (const [op, r] of Object.entries(res)) {
    if (!r.swap) continue;
    const users = fs.readdirSync(path.join(NEW, 'dart-gen-bs')).filter((f) => /^schoolos.*\.dart$/.test(f) && new RegExp(`\\b${r.declared}\\(`).test(fs.readFileSync(path.join(NEW, 'dart-gen-bs', f), 'utf8')));
    let ok = 0, n = 0;
    for (const m of users) {
      const mirror = path.join(BS, 'lib/genesis/dart-gen-bs', m);
      const src = fs.readFileSync(path.join(NEW, 'dart-gen-bs', m), 'utf8');
      fs.writeFileSync(mirror, applySwap(src, r.declared, r.swap.to, r.swap.file));
      try { for (const t of testsOf(m)) { const x = spawnSync(FLUTTER, ['test', 'test/' + t, '--reporter', 'compact'], { cwd: BS, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); const last = [...((x.stdout || '') + (x.stderr || '')).matchAll(/\+(\d+)(?:\s+-(\d+))?:/g)].pop(); const p = last ? +last[1] : 0, f = last && last[2] ? +last[2] : 0; ok += p; n += p + f; if (x.status !== 0) n = Math.max(n, ok + 1); } }
      finally { fs.writeFileSync(mirror, src); }
    }
    r.swap.proof = { modules: users, tests: `${ok}/${n}`, proven: n > 0 && ok === n };
    if (!r.swap.proof.proven) r.pick = r.declared;   // לא הוכח ⇒ המנוע-של-הזהב נשאר (§20-ג · חוק-4)
  }
  return res;
}
export function provenSwaps() { if (!fs.existsSync(OUT)) return []; const j = JSON.parse(fs.readFileSync(OUT, 'utf8')); return Object.values(j.ops || {}).filter((r) => r.swap && r.swap.proof && r.swap.proof.proven).map((r) => ({ from: r.declared, to: r.swap.to, file: r.swap.file })); }
// logicPass — מיישם החלפות-מוכחות בקוד-מודול מחולל (retarget/skin-golden)
export function logicPass(code) { let n = 0; for (const s of provenSwaps()) if (new RegExp(`\\b${s.from}\\(`).test(code)) { code = applySwap(code, s.from, s.to, s.file); n++; } return { code, swaps: n }; }

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { ops: {} };
  let ops = rankAll();
  // הוכחות נשמרות (יקרות): הוכחה קודמת תקפה כל עוד אותה החלפה מוצעת; --prove מריץ מחדש
  for (const [op, r] of Object.entries(ops)) { const p = prev.ops && prev.ops[op]; if (r.swap && p && p.swap && p.swap.to === r.swap.to && p.swap.proof && !process.argv.includes('--prove')) { r.swap.proof = p.swap.proof; if (!p.swap.proof.proven) r.pick = r.declared; } }
  if (process.argv.includes('--prove')) ops = prove(ops);
  for (const r of Object.values(ops)) if (r.swap && !r.swap.proof) r.pick = r.declared;   // החלפה שטרם הוכחה אינה מיושמת
  const n = Object.keys(ops).length, confirmed = Object.values(ops).filter((r) => r.declaredRank === 0).length, swaps = Object.values(ops).filter((r) => r.swap).length, proven = Object.values(ops).filter((r) => r.swap && r.swap.proof && r.swap.proof.proven).length;
  const fresh = JSON.stringify({ summary: { ops: n, confirmed, swapsProposed: swaps, swapsProven: proven }, ops }, null, 1) + '\n';
  if (process.argv.includes('--gate')) {
    if (!fs.existsSync(OUT) || fs.readFileSync(OUT, 'utf8') !== fresh) { console.log('🔴 autologic: auto-logic.json ≠ בורר-טרי (הרץ node machtzev/generator/auto-logic.mjs)'); process.exit(1); }
    console.log(`✓ autologic: ${n} פעולות-לוגיקה × ${catalog().N} מנועים · הזהב מאושר-כטוב-ביותר ${confirmed}/${n} · החלפות מוצעות ${swaps} · מוכחות ${proven}`); process.exit(0);
  }
  fs.writeFileSync(OUT, fresh);
  for (const [op, r] of Object.entries(ops)) console.log(`${op.padEnd(12)} ${r.declared.padEnd(22)} ${r.declaredRank === 0 ? '✓' : '✗ #' + (r.declaredRank + 1)} · ${r.candidates} מועמדים · ${r.top3.join(' · ')}${r.swap ? ` ⇒ swap ${r.swap.to}${r.swap.proof ? (r.swap.proof.proven ? ' ✓מוכח' : ' ✗נכשל') : ' (טרם הוכח)'}` : ''}`);
  console.log(`✍️ auto-logic.json · ${n} פעולות · מאושר ${confirmed}/${n} · החלפות ${swaps} (מוכחות ${proven})`);
}
