#!/usr/bin/env node
// 🤝 op-twins — תאומי-הרצה לפעולות-היסוד של dart-maor (הכרעת-בעלים 24.9 «תסגור הכל מהצד שלך»).
//   נמדד: 374 מ-905 אטומי-מאגר-הסינתזה בלי תאום-JS — בהם כל 59 פעולות-היסוד (op-*.dart: lengthStr · addNum · gtNum …),
//   ולכן synth לא מצא אפילו «אבג ⇒ 3». כל פעולת-יסוד היא ביטוי-Dart יחיד באחת מ-8 צורות; כאן הצורה נקראת מהמקור,
//   ממומשת בסמנטיקת-Dart (טיפוסי-הפרמטרים מההצהרה; dynamic = מחרוזת-מושחלת כמו במסך; % אוקלידי; ~/ זורק על 0;
//   תוצאת-מספר עשרונית מודפסת כמו Dart «5.0»), ו**מאומתת מול Dart עצמו** על דגימות. רק מה שזהה בכל הדגימות נכנס
//   ל-knowledge/op-twins.json (עם sha של המקור) — twins.mjs קורא משם כשאין new/atoms/<base>.mjs. שינוי במקור ⇒ sha לא תואם ⇒ לא נטען.
//   שימוש: node machtzev/generator/op-twins.mjs [--check]   (--check: הקטלוג ≡ טרי)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const MAOR = path.join(ROOT, 'new/dart-maor');
const OUT = path.join(HERE, 'knowledge/op-twins.json');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const SIG = /^\s*(num|int|double|bool|String|dynamic)\s+(\w+)\(([^)]*)\)\s*=>\s*(.+?);\s*$/m;
/** מקור-Dart ⇒ { name, ret, params:[{type,name}], expr } או null (לא פעולת-יסוד בצורה נתמכת) */
export function parseOp(src) {
  const code = src.split('\n').filter((l) => !/^\s*(\/\/|import )/.test(l)).join('\n'); const m = code.match(SIG); if (!m) return null;
  const params = m[3].split(',').map((p) => p.trim()).filter(Boolean).map((p) => { const q = p.match(/^(num|int|double|bool|String|dynamic)\s+(\w+)$/); return q ? { type: q[1], name: q[2] } : null; });
  if (!params.length || params.some((p) => !p)) return null;
  return { ret: m[1], name: m[2], params, expr: m[4].trim() };
}
const isNum = (v) => typeof v === 'number';
const T = (msg) => { throw new Error(msg); };
const dmod = (a, b) => { if (b === 0) { if (Number.isInteger(a) && Number.isInteger(b)) T('mod0'); return NaN; } const r = a % b; return r < 0 ? r + Math.abs(b) : r; };
const BIN = {
  '+': (a, b) => (isNum(a) && isNum(b) ? a + b : typeof a === 'string' && typeof b === 'string' ? a + b : T('+')),
  '-': (a, b) => (isNum(a) && isNum(b) ? a - b : T('-')),
  '*': (a, b) => (isNum(a) && isNum(b) ? a * b : typeof a === 'string' && Number.isInteger(b) && b >= 0 ? a.repeat(b) : T('*')),
  '%': (a, b) => (isNum(a) && isNum(b) ? dmod(a, b) : T('%')),
  '~/': (a, b) => (isNum(a) && isNum(b) ? (b === 0 ? T('idiv0') : Math.trunc(a / b)) : T('~/')),
  '==': (a, b) => a === b, '!=': (a, b) => a !== b,
  '>': (a, b) => (isNum(a) && isNum(b) ? a > b : T('>')), '<': (a, b) => (isNum(a) && isNum(b) ? a < b : T('<')),
  '>=': (a, b) => (isNum(a) && isNum(b) ? a >= b : T('>=')), '<=': (a, b) => (isNum(a) && isNum(b) ? a <= b : T('<=')),
};
const cmp = (a, b) => (typeof a === typeof b && (typeof a === 'string' || isNum(a)) ? (a < b ? -1 : a > b ? 1 : 0) : T('compareTo'));
const UN0 = { abs: (a) => (isNum(a) ? Math.abs(a) : T('abs')), floor: (a) => (isNum(a) ? (Number.isFinite(a) ? Math.floor(a) : T('floor')) : T('floor')), toLowerCase: (a) => (typeof a === 'string' ? a.toLowerCase() : T('lc')), trim: (a) => (typeof a === 'string' ? a.trim() : T('trim')) };
const PROP = { length: (a) => (typeof a === 'string' ? a.length : T('len')), isEmpty: (a) => (typeof a === 'string' ? a.length === 0 : T('ie')), isNotEmpty: (a) => (typeof a === 'string' ? a.length > 0 : T('ine')) };
const UN1 = { contains: (a, b) => (typeof a === 'string' && typeof b === 'string' ? a.includes(b) : T('c')), startsWith: (a, b) => (typeof a === 'string' && typeof b === 'string' ? a.startsWith(b) : T('sw')) };
const INT_RESULT = new Set(['floor', 'length', '~/']);   // Dart מחזיר int גם מקלט עשרוני
/** הצורה ⇒ פונקציית-JS בסמנטיקת-Dart. הפלט: מספר עשרוני שלם מודפס «x.0» (כמו toString של Dart); שאר הערכים כמות-שהם. */
export function twinOf(op) {
  const P = op.params.map((p) => p.name); const at = (n) => P.indexOf(n); const e = op.expr; let body = null, intOut = false;
  let m;
  if ((m = e.match(/^(\w+)\s*(~\/|==|!=|>=|<=|\+|-|\*|%|>|<)\s*(\w+)$/)) && at(m[1]) >= 0 && at(m[3]) >= 0) { const f = BIN[m[2]]; const i = at(m[1]), j = at(m[3]); body = (a) => f(a[i], a[j]); intOut = INT_RESULT.has(m[2]); }
  else if ((m = e.match(/^(\w+)\.(abs|floor|toLowerCase|trim)\(\)$/)) && at(m[1]) >= 0) { const f = UN0[m[2]]; const i = at(m[1]); body = (a) => f(a[i]); intOut = INT_RESULT.has(m[2]); }
  else if ((m = e.match(/^(\w+)\.(length|isEmpty|isNotEmpty)$/)) && at(m[1]) >= 0) { const f = PROP[m[2]]; const i = at(m[1]); body = (a) => f(a[i]); intOut = true; }
  else if ((m = e.match(/^(\w+)\.(contains|startsWith)\((\w+)\)$/)) && at(m[1]) >= 0 && at(m[3]) >= 0) { const f = UN1[m[2]]; const i = at(m[1]), j = at(m[3]); body = (a) => f(a[i], a[j]); }
  else if ((m = e.match(/^(\w+)\.compareTo\((\w+)\)\s*(>=|<=|>|<)\s*0$/)) && at(m[1]) >= 0 && at(m[2]) >= 0) { const i = at(m[1]), j = at(m[2]), o = m[3]; body = (a) => { const c = cmp(a[i], a[j]); return o === '>' ? c > 0 : o === '<' ? c < 0 : o === '>=' ? c >= 0 : c <= 0; }; }
  else if ((m = e.match(/^(\w+)\s*(==|!=)\s*null$/)) && at(m[1]) >= 0) { const i = at(m[1]), eq = m[2] === '=='; body = (a) => (eq ? a[i] == null : a[i] != null); }
  if (!body) return null;
  const fn = (...a) => { const r = body(a); if (isNum(r) && Number.isInteger(r) && !intOut && a.some((x) => isNum(x) && !Number.isInteger(x))) return r.toFixed(1); return r; };
  Object.defineProperty(fn, 'length', { value: P.length }); return fn;
}
// ── אימות מול Dart: דגימות לפי טיפוס; dynamic = מחרוזת (כך הוא מושחל במסך) ──
const SAMPLES = { num: [0, 1, 3, -2, 2.5, 10], int: [0, 1, 3, -2, 10], double: [0.5, 2.5, -1.5, 3], String: ['', 'abc', 'אבג', ' x ', '12', 'ABC'], dynamic: ['', 'abc', '12', 'אבג'], bool: [true, false] };
const combos = (ps) => ps.reduce((acc, p) => acc.flatMap((c) => SAMPLES[p.type].map((v) => [...c, v])), [[]]);
const dLit = (v) => (typeof v === 'string' ? "'" + v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$') + "'" : String(v));
const jOut = (v) => (typeof v === 'boolean' ? String(v) : isNum(v) ? (Number.isNaN(v) ? 'NaN' : String(v)) : String(v));
export function build({ dart = process.env.DART_BIN || '/root/flutter/bin/cache/dart-sdk/bin/dart' } = {}) {
  const cands = [];
  for (const f of fs.readdirSync(MAOR).filter((x) => /^op-.*\.dart$/.test(x) && !/_test\.dart$/.test(x)).sort()) {
    const base = f.replace(/\.dart$/, ''); if (fs.existsSync(path.join(ROOT, 'new/atoms', base + '.mjs'))) continue;
    const src = fs.readFileSync(path.join(MAOR, f), 'utf8'); const op = parseOp(src); if (!op) continue; const fn = twinOf(op); if (!fn) continue;
    cands.push({ file: f, src, op, fn, cases: combos(op.params) });
  }
  const prog = [...cands.map((c) => c.src.split('\n').filter((l) => !/^\s*import /.test(l)).join('\n')), 'void main() {',
    ...cands.flatMap((c) => c.cases.map((args, k) => `  try { print('${c.op.name}|${k}|' + (${c.op.name}(${args.map(dLit).join(', ')})).toString()); } catch (e) { print('${c.op.name}|${k}|!THROW'); }`)), '}'].join('\n');
  const tmp = fs.mkdtempSync('/tmp/op-twins-'); fs.writeFileSync(path.join(tmp, 'm.dart'), prog);
  const r = spawnSync(dart, ['run', path.join(tmp, 'm.dart')], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); fs.rmSync(tmp, { recursive: true, force: true });
  if (r.status !== 0) throw new Error('dart: ' + (r.stderr || r.stdout).slice(0, 400));
  const got = new Map(r.stdout.split('\n').filter(Boolean).map((l) => { const [n, k, ...v] = l.split('|'); return [`${n}|${k}`, v.join('|')]; }));
  const ok = {}, rejected = [];
  for (const c of cands) { const bad = c.cases.map((args, k) => { let j; try { j = jOut(c.fn(...args)); } catch { j = '!THROW'; } const d = got.get(`${c.op.name}|${k}`); return d === j ? null : `(${args.map(dLit).join(', ')}) Dart ${d} ≠ JS ${j}`; }).filter(Boolean);
    if (bad.length) rejected.push({ name: c.op.name, why: bad.slice(0, 2) }); else ok[c.op.name] = { file: c.file, sha: sha(c.src), params: c.op.params, ret: c.op.ret, expr: c.op.expr, samples: c.cases.length }; }
  return { ok, rejected, candidates: cands.length };
}
/** לטעינה ב-twins.mjs: פונקציית-התאום של אטום, רק אם מאומת וה-sha של המקור הנוכחי תואם. */
let _cat = null;
export function verifiedTwin(name, dartFile) {
  if (_cat === null) { try { _cat = JSON.parse(fs.readFileSync(OUT, 'utf8')).ok || {}; } catch { _cat = {}; } }
  const e = _cat[name]; if (!e) return null; const p = dartFile && fs.existsSync(dartFile) ? dartFile : path.join(MAOR, e.file); if (!fs.existsSync(p)) return null;
  const src = fs.readFileSync(p, 'utf8'); if (sha(src) !== e.sha) return null; const op = parseOp(src); return op ? twinOf(op) : null;
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const res = build(); const out = { _: 'נגזר ע"י machtzev/generator/op-twins.mjs — תאומי-JS לפעולות-היסוד, מאומתים מול Dart על דגימות; sha = מקור-ה-Dart. אל תערוך ידנית.', ok: res.ok, rejected: res.rejected };
  const txt = JSON.stringify(out, null, 1) + '\n';
  if (process.argv.includes('--check')) { const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : ''; if (cur !== txt) { console.log('🔴 op-twins: הקטלוג ≠ טרי (הרץ node machtzev/generator/op-twins.mjs)'); process.exit(1); } }
  else fs.writeFileSync(OUT, txt);
  console.log(`🤝 op-twins: ${res.candidates} פעולות-יסוד בצורה נתמכת · ${Object.keys(res.ok).length} זהות ל-Dart בכל הדגימות · ${res.rejected.length} נדחו`);
  for (const x of res.rejected) console.log(`   ✗ ${x.name}: ${x.why.join(' ; ')}`);
}
