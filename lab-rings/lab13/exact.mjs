import { add4 } from './lifted-add.mjs';
// exact.mjs — חיפוש מלא, שכבה אחרי שכבה (כמו במספרים): כל התוכניות באורך 1, אחר כך 2, ...
//   שתי תוכניות שמגיעות לאותו מצב בדיוק (כל התאים + מחסנית + כתובות, בכל הדוגמאות) — מתאחדות, כי ההמשך שלהן זהה.
//   כך לא נזרקת אף דרך ⇒ הראשונה שעובדת היא בוודאות הקצרה ביותר. רק תוכניות בלי «לך לשורה».
import fs from 'node:fs';
const WORK = 8, BITS = 15;
const TOK = [...Array.from({ length: WORK }, (_, k) => ['WHERE', k]), ['WHERE@'], ['GO'], ['TAKE'], ['PUT'], ['CALC'], ['ADD']];
const NAME = { ADD: 'חשב+', WHERE: 'לאן', 'WHERE@': 'לאן@', GO: 'לך', TAKE: 'קח', PUT: 'שים', CALC: 'חשב' };
function step(s, [op, k]) { // s = {mem, st, A, P} — מחזיר מצב חדש או null
  const mem = s.mem, st = s.st;
  if (op === 'WHERE') return { mem, st, A: k, P: s.P };
  if (op === 'WHERE@') { if (!st.length) return null; return { mem, st: st.slice(0, -1), A: st[st.length - 1] % 16, P: s.P }; }
  if (op === 'GO') return { mem, st, A: s.A, P: s.A };
  if (op === 'TAKE') { if (st.length >= 4) return null; return { mem, st: [...st, mem[s.P]], A: s.A, P: s.P }; }
  if (op === 'PUT') { if (!st.length) return null; const m = mem.slice(); m[s.P] = st[st.length - 1]; return { mem: m, st: st.slice(0, -1), A: s.A, P: s.P }; }
  if (op === 'ADD') { if (st.length < 2) return null; const b = st[st.length - 1], a = st[st.length - 2]; return { mem, st: [...st.slice(0, -2), add4(a, b)], A: s.A, P: s.P }; }
  if (op === 'CALC') { if (st.length < 2) return null; const b = st[st.length - 1], a = st[st.length - 2]; return { mem, st: [...st.slice(0, -2), ~(a & b) & BITS], A: s.A, P: s.P }; }
}
export function shortest(goal, { maxLen = 20, maxStates = 4e6, pieces = [] } = {}) {
  const PIPES = [...TOK.map((t) => ({ name: null, prog: [t] })), ...pieces];
  const t = Date.now();
  let layer = [{ S: goal.examples.map((e) => ({ mem: e.mem.slice(), st: [], A: 0, P: 0 })), prog: [] }];
  const seen = new Set([key(layer[0].S)]);
  function key(S) { return S.map((s) => s.mem.join(',') + '|' + s.st.join(',') + '|' + s.A + ',' + s.P).join('/'); }
  const done = (S) => S.every((s, i) => s.mem[goal.examples[i].out ?? goal.out] === goal.examples[i].want);
  if (done(layer[0].S)) return { len: 0, prog: [], states: 1, ms: 0 };
  for (let L = 1; L <= maxLen; L++) {
    const next = [];
    for (const n of layer) for (const pp of PIPES) {
      const S = []; let bad = false; for (const s0 of n.S) { let s = s0; for (const tk of pp.prog) { s = step(s, tk); if (!s) break; } if (!s) { bad = true; break; } S.push(s); } if (bad) continue;
      const k = key(S); if (seen.has(k)) continue; seen.add(k); if (seen.size > maxStates) return { len: null, reached: L, states: seen.size, ms: Date.now() - t };
      const prog = [...n.prog, ...pp.prog]; const used = pp.name ? [...(n.used || []), pp.name] : (n.used || []); if (done(S)) return { len: prog.length, steps: L, prog, used, states: seen.size, ms: Date.now() - t };
      next.push({ S, prog, used }); }
    if (seen.size > maxStates) return { len: null, reached: L, states: seen.size, ms: Date.now() - t };
    layer = next; }
  return { len: null, reached: maxLen, states: seen.size, ms: Date.now() - t };
}
const show = (p) => p.map(([o, k]) => NAME[o] + (k != null ? k : '')).join(' ');

if (import.meta.url === 'file://' + process.argv[1]) {
let seed = 7; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return Math.floor((seed / 2147483648) * k); };
const cell = (n, f) => ({ out: 2, examples: Array.from({ length: n }, () => { const m = new Array(16).fill(0); m[0] = rnd(16); m[1] = rnd(16); m[3] = rnd(16); return { mem: m, want: f(m) }; }) });
const found = { 'העתק': 4, 'לא (מספר)': 6, 'וגם (מספרים)': 12, 'קבוע 15': 6, 'קח מהכתובת שבתא': 7, 'או (מספרים)': null, 'שונה (מספרים)': null };
const GOALS = {
  'העתק': cell(12, (m) => m[0]), 'לא (מספר)': cell(16, (m) => ~m[0] & 15), 'קבוע 15': cell(12, () => 15),
  'קח מהכתובת שבתא': { out: 2, examples: Array.from({ length: 16 }, () => { const m = new Array(16).fill(0); const a = 8 + rnd(8); m[0] = a; m[a] = rnd(16); return { mem: m, want: m[a] }; }) },
  'וגם (מספרים)': cell(16, (m) => m[0] & m[1]), 'או (מספרים)': cell(16, (m) => m[0] | m[1]), 'שונה (מספרים)': cell(16, (m) => m[0] ^ m[1]),
};
for (const [name, g] of Object.entries(GOALS)) {
  const r = shortest(g);
  const was = found[name];
  console.log(r.len != null
    ? `${name}: הכי קצר שקיים = ${r.len} פעולות · המנוע מצא ${was ?? 'לא מצא'} ${was == null ? '' : was === r.len ? '✓ הכי קצר' : '✗ יש קצר יותר'} · ${r.states} מצבים · ${r.ms}ms\n   ${show(r.prog)}`
    : `${name}: לא הגיע (נבדקו כל התוכניות עד ${r.reached} פעולות · ${r.states} מצבים · ${r.ms}ms)`);
}
}
