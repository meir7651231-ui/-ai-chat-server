// pieces.mjs — search in whole pieces: every step chooses a whole piece the engine already learned
// (with any choice of cells), or "if cell x is not zero, jump" (back to the start of an earlier piece, or to the end).
// The judge is the same machine: a program is correct only if it passed all the examples.
import fs from 'node:fs';
import { run } from './machine2.mjs';
const END = 1000, CELLS = 6;
let seed = 5; const rnd = (k) => { seed = (seed * 1103515245 + 12345) % 2147483648; return Math.floor((seed / 2147483648) * k); };
// ---- piece variants: the piece's cells → other cells. Checked on 60 random memories that it really does the same thing.
function remap(prog, map) { return prog.map(([o, k, t]) => (o === 'WHERE' && t !== 'code' ? ['WHERE', map[k]] : [o, k, t].filter((x) => x !== undefined))); }
export function variants(lib) { const out = [];
  for (const m of lib.filter((m) => !m.prog.some(([o]) => o === 'JUMP'))) {
    const body = m.prog;   // including the "WHERE 0; GO" at the start — it too moves to the new cell
    const scratch = m.data.filter((a) => !m.ins.includes(a) && a !== m.out);
    const pick = (n, pre = []) => (pre.length === n ? [pre] : Array.from({ length: CELLS }, (_, c) => c).filter((c) => !pre.includes(c)).flatMap((c) => pick(n, [...pre, c])));
    for (const ins of pick(m.ins.length)) for (let o = 0; o < CELLS; o++) {
      const map = {}; m.ins.forEach((a, i) => { map[a] = ins[i]; }); if (map[m.out] != null && map[m.out] !== o) continue; map[m.out] = o;
      const free = [7, 6, 5, 4, 3].filter((c) => !Object.values(map).includes(c)); if (free.length < scratch.length) continue; scratch.forEach((a, i) => { map[a] = free[i]; });
      const prog = remap(body, map); const dirty = new Set([o, ...scratch.map((a) => map[a])]);
      let good = true; for (let t = 0; t < 80 && good; t++) { const addr = m.prog.some(([op]) => op === 'WHERE@'); const mem = Array.from({ length: 16 }, (_, c) => (addr && c < 8 ? 8 + rnd(8) : rnd(16))); for (const c of dirty)   // a piece that reads from an address: cells hold addresses (8–15), like in a list
        if (!ins.includes(c)) mem[c] = 0;
        const orig = mem.slice(); for (const a of m.data) orig[a] = mem[map[a]]; const want = run(m.prog, orig); const r = run(prog, mem);
        if (!r || !want || r.st.length || r.mem[o] !== want.mem[m.out]) good = false; else for (let c = 0; c < 16; c++) if (!dirty.has(c) && r.mem[c] !== mem[c]) good = false; }
      if (good) out.push({ kind: m.name, label: `${m.name}(${ins.join(',')}→${o})`, prog }); } }
  return out; }
// ---- assembly: a list of pieces → a program for the machine
export function assemble(ps) { const starts = []; let n = 0; for (const p of ps) { starts.push(n); n += p.jump ? 5 : p.prog.length; } starts.push(n);
  const target = (p, i) => (p.to === END ? END : p.skip ? (i + 1 + p.skip < ps.length ? starts[i + 1 + p.skip] : END) : starts[p.to]);
  return ps.flatMap((p, i) => (p.jump ? [['WHERE', p.cell], ['GO'], ['TAKE'], ['WHERE', target(p, i), 'code'], ['JUMP']] : p.prog)); }
const jumps = (n) => [...Array.from({ length: CELLS }, (_, c) => ({ kind: 'קפוץ לסוף', jump: true, cell: c, to: END, label: `אם ${c}≠0 ⇒ סוף` })),
  ...[1, 2, 3].flatMap((k) => Array.from({ length: CELLS }, (_, c) => ({ kind: 'דלג קדימה', jump: true, cell: c, skip: k, label: `אם ${c}≠0 ⇒ דלג ${k}` }))),
  ...Array.from({ length: n }, (_, b) => Array.from({ length: CELLS }, (_, c) => ({ kind: 'קפוץ אחורה', jump: true, cell: c, to: b, label: `אם ${c}≠0 ⇒ חלק ${b + 1}` }))).flat()];
export const KINDS = (vs) => [...new Set(vs.map((v) => v.kind)), 'קפוץ לסוף', 'קפוץ אחורה', 'דלג קדימה'];
// ---- the search. prior(kindsSoFar) → which kinds to allow now (null = all, without a network)
export function searchPieces(goal, vs, { beam = 200, maxPieces = 7, deadline = Infinity, prior = null, rank = null } = {}) {
  const ex = goal.examples, total = ex.length; let runs = 0; const seen = new Set();
  const score = (ps) => { runs++; const prog = assemble(ps); const rs = [];
    for (const [i, e] of ex.entries()) { const r = run(prog, e.mem, { maxSteps: 900, scramble: i % 2 ? i + 1 : 0 }); if (!r) return null; rs.push(r); }
    let s = 0, near = 0; rs.forEach((r, i) => { if (r.mem[ex[i].out ?? goal.out] === ex[i].want) s++; if (r.mem.slice(0, 8).includes(ex[i].want)) near++; });
    return { s, near, sig: rs.map((r) => r.mem.slice(0, 8).join(',')).join('/') }; };
  let inner = [{ ps: [], s: 0, near: 0, lp: 0 }];
  for (let depth = 0; depth < maxPieces && Date.now() < deadline; depth++) {
    const outer = [];
    for (const c of inner) { const allowed = prior ? prior(c.ps.map((p) => p.kind)) : null; const probs = rank ? rank(c.ps.map((p) => p.kind)) : null;
      for (const p of [...vs, ...jumps(c.ps.length)]) { if (allowed && !allowed.has(p.kind)) continue;
        const ps = [...c.ps, p]; const r = score(ps); if (!r) continue; if (r.s === total) return { solved: true, ps, runs, depth: depth + 1 };
        if (seen.has(r.sig + '#' + ps.length)) continue; seen.add(r.sig + '#' + ps.length); outer.push({ ps, s: r.s, near: r.near, lp: c.lp + (probs ? Math.log(probs.get(p.kind) + 1e-6) : 0) }); } }
    const a = [...outer].sort((x, y) => y.s - x.s || y.near - x.near), b = [...outer].sort((x, y) => y.near - x.near || y.s - x.s);
    const n3 = rank ? [...outer].sort((x, y) => y.lp - x.lp || y.s - x.s) : [];   // third: the paths the network believes in, even if they don't show progress yet
    const pick = new Set(); for (let i = 0; pick.size < beam && (a[i] || b[i] || n3[i]); i++) for (const q of [a[i], b[i], n3[i]]) if (q && pick.size < beam) pick.add(q); inner = [...pick]; }
  return { solved: false, runs };
}
