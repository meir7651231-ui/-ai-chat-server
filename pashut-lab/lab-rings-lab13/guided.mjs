// guided.mjs — המנוע + רשת: אותו חיפוש-עיגולים של rings2.solve, אבל בכל צעד רשת קטנה
// (למדה מהתוכניות שכבר נמצאו ב-lib2.json) אומרת אילו פעולות שווה לנסות. השאר — לא נבדק.
// השופט לא משתנה: תוכנית נחשבת נכונה רק אם עברה את כל הדוגמאות. הרשת רק מציעה.
import fs from 'node:fs';
import { run } from './machine2.mjs';
import { solve as solveBase } from './rings2.mjs';
const WORK = 8, END = 1000;
// ---- סוגי פעולות (מה הרשת בוחרת ביניהם)
export const ACTS = ['לאן', 'לאן@', 'לך', 'קח', 'שים', 'חשב', 'חשב+', 'לך-לשורה'];
const actOfTok = (op) => ({ WHERE: 0, 'WHERE@': 1, GO: 2, TAKE: 3, PUT: 4, CALC: 5, ADD: 6, JUMP: 7 })[op];
function actions(prog) { const out = []; for (let i = 0; i < prog.length; i++) { const [o, , t] = prog[i];
  if (o === 'WHERE' && t === 'code') { out.push(7); i++; } else out.push(actOfTok(o)); } return out; }
// ---- מה הרשת רואה: שתי הפעולות האחרונות, עומק המחסנית, האם «לאן»=«איפה»
const NIN = 9 * 2 + 5 + 2, NH = 32, NO = 8;
function feats(acts, depth, aEqP, len) { const x = new Array(NIN).fill(0);
  const a1 = acts.length ? acts[acts.length - 1] : 8, a2 = acts.length > 1 ? acts[acts.length - 2] : 8;
  x[a1] = 1; x[9 + a2] = 1; x[18 + Math.min(depth, 4)] = 1; x[23] = aEqP ? 1 : 0; x[24] = 1; return x; }
function stateOf(prog, mem) { const r = run(prog, mem, { maxSteps: 600 }); return r ? { depth: r.st.length, aEqP: r.A === r.P } : { depth: 0, aEqP: false }; }
// ---- הרשת (אותה רשת כמו ב«לומד»: שכבה נסתרת tanh, יציאה softmax)
export function makeNet(seed = 1) { let s = seed; const R = () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648 - 0.5; };
  return { W1: Array.from({ length: NH }, () => Array.from({ length: NIN }, () => R() * 0.6)), W2: Array.from({ length: NO }, () => Array.from({ length: NH + 1 }, () => R() * 0.6)) }; }
function fwd(net, x) { const h = net.W1.map((w) => Math.tanh(w.reduce((s, v, i) => s + v * x[i], 0)));
  const z = net.W2.map((w) => w.reduce((s, v, j) => s + v * (j < NH ? h[j] : 1), 0)); const m = Math.max(...z); const e = z.map((v) => Math.exp(v - m)); const S = e.reduce((a, b) => a + b); return { h, p: e.map((v) => v / S) }; }
export function predict(net, x) { return fwd(net, x).p; }
export function train(net, data, epochs = 300, lr = 0.05) {
  for (let ep = 0; ep < epochs; ep++) for (const { x, y } of data) { const { h, p } = fwd(net, x);
    const g = p.map((v, o) => (o === y ? 1 : 0) - v);
    const gh = h.map((hj, j) => (1 - hj * hj) * g.reduce((s, go, o) => s + go * net.W2[o][j], 0));
    net.W2.forEach((w, o) => { for (let j = 0; j <= NH; j++) w[j] += lr * g[o] * (j < NH ? h[j] : 1); });
    net.W1.forEach((w, j) => { for (let i = 0; i < NIN; i++) if (x[i]) w[i] += lr * gh[j] * x[i]; }); }
  return net; }
// דוגמאות-אימון: כל תוכנית שנמצאה ⇒ בכל נקודה: (מה היה עד עכשיו) → (מה בא אחר כך)
export function dataFrom(lib, examplesFor) { const data = [];
  for (const m of lib) { const exs = examplesFor(m); const acts = actions(m.prog); let tok = 0;
    for (let k = 0; k < acts.length; k++) { const prefix = m.prog.slice(0, tok); const st = stateOf(prefix, exs[0].mem);
      data.push({ x: feats(acts.slice(0, k), st.depth, st.aEqP, k), y: acts[k] }); tok += acts[k] === 7 ? 2 : 1; } }
  return data; }
// ---- החיפוש המונחה: כמו rings2.solve, אבל לכל מועמד בודקים רק פעולות שהרשת נותנת להן סיכוי
const base = (len) => [...Array.from({ length: WORK }, (_, k) => [['WHERE', k]]), [['WHERE@']], [['GO']], [['TAKE']], [['PUT']], [['CALC']], [['ADD']],
  ...Array.from({ length: len + 13 }, (_, c) => [['WHERE', c, 'code'], ['JUMP']]), [['WHERE', END, 'code'], ['JUMP']]];
const firstAct = (prog) => (prog[0][0] === 'WHERE' && prog[0][2] === 'code' ? 7 : actOfTok(prog[0][0]));
export function solveGuided(goal, net, { beam = 300, maxRounds = 45, patience = 12, keep = 3, deadline = Infinity } = {}) {
  const ex = goal.examples, total = ex.length; let runs = 0;
  const score = (prog) => { runs++; const rs = []; for (const [i, e] of ex.entries()) { const r = run(prog, e.mem, { maxSteps: 600, scramble: i % 2 ? i + 1 : 0 }); if (!r) return null; rs.push(r); }   // half with scrambling, half without: a program that relies on the scrambling fails
    let s = 0, near = 0; for (let i = 0; i < ex.length; i++) { const r = rs[i]; if (r.mem[ex[i].out ?? goal.out] === ex[i].want) s++; if (r.mem.slice(0, WORK).includes(ex[i].want) || r.st.includes(ex[i].want)) near++; }
    if (s < total) { const seen = new Map(); for (let i = 0; i < ex.length; i++) { const k = rs[i].mem.join(',') + '|' + rs[i].st.join(','); const p = seen.get(k); if (p != null && p !== ex[i].want) return null; seen.set(k, ex[i].want); } }
    return { s, near, depth: rs[0].st.length, aEqP: rs[0].A === rs[0].P, sig: rs.map((r) => r.mem.slice(0, WORK).join(',') + '|' + r.st.join(',') + '|' + r.A + ',' + r.P).join('/') }; };
  const st0 = score([]); let inner = [{ prog: [], acts: [], s: st0.s, near: st0.near, depth: 0, aEqP: true }]; const seen = new Set([st0.sig]); let best = st0.s, still = 0, rounds = 0;
  for (; rounds < maxRounds && best < total && Date.now() < deadline; rounds++) {
    const outer = [];
    for (const c of inner) {
      const p = predict(net, feats(c.acts, c.depth, c.aEqP, c.acts.length));
      const allowed = new Set(p.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, keep).map(([, i]) => i));   // רק הפעולות שהרשת הכי מאמינה בהן
      for (const q of base(c.prog.length)) { const a = firstAct(q); if (!allowed.has(a)) continue;
        const prog = [...c.prog, ...q]; const r = score(prog); if (!r || seen.has(r.sig)) continue; seen.add(r.sig);
        outer.push({ prog, acts: [...c.acts, a], s: r.s, near: r.near, depth: r.depth, aEqP: r.aEqP }); } }
    if (!outer.length) break;
    if (seen.size > 1.5e6) seen.clear();
    const a = [...outer].sort((x, y) => y.s - x.s || y.near - x.near || x.prog.length - y.prog.length), b = [...outer].sort((x, y) => y.near - x.near || y.s - x.s || x.prog.length - y.prog.length);
    const pick = new Set(); for (let i = 0; pick.size < beam && (a[i] || b[i]); i++) for (const q of [a[i], b[i]]) if (q && pick.size < beam) pick.add(q); inner = [...pick];
    const nb = Math.max(...inner.map((c) => c.s)); if (nb > best) { best = nb; still = 0; } else if (++still >= patience) break; }
  const win = inner.find((c) => c.s === total);
  return { solved: !!win, prog: win ? win.prog : [], best, total, rounds, runs };
}
