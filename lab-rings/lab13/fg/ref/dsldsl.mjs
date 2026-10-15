// dsl.mjs - a small typed list language + ONE bottom-up enumerative search over it (observational equivalence on probe lists).
// Types: I (int per example), B (bool), L (list of ints), S (list of segments).
// Lambda argument types come from generic pools (lam.mjs): EI/EB element context, RI/RB pair (a,b), R3 (c,x,i), W (i,x,n), T3 (a,b,c).
// The search sees only input/output examples. No task names, no sources.
import { buildPool, mk } from './lam.mjs';

// ───────────────────────── list helpers (total: empty ⇒ 0 / -1) ─────────────────────────
const sum = (L) => { let s = 0; for (const x of L) s += x; return s; };
const mx = (L) => (L.length ? Math.max(...L) : 0), mn = (L) => (L.length ? Math.min(...L) : 0);
const asc = (a, b) => a - b;
const MAXLEN = 16;
// segment aggregators
const SAGG = [['len', (s) => s.length], ['sum', sum], ['max', mx], ['min', mn], ['hd', (s) => (s.length ? s[0] : 0)], ['lst', (s) => (s.length ? s[s.length - 1] : 0)]];

// ───────────────────────── lambda contexts ─────────────────────────
// E env: [x, i, L, G]  (G = globals of the ORIGINAL input: head,last,second,sum,max,min,n0)
const GN = ['hd', 'last', 'sec', 'sum', 'max', 'min', 'n0'];
export const globalsOf = (l) => [l[0] ?? 0, l.length ? l[l.length - 1] : 0, l[1] ?? 0, sum(l), mx(l), mn(l), l.length];

// pair relation pool (a,b) - task independent. domain: a,b in -8..15
let RPOOL = null;
export function rpool() {
  if (RPOOL) return RPOOL;
  const dom = []; for (let a = -8; a <= 15; a++) for (let b = -8; b <= 15; b++) dom.push([a, b]);
  const leaves = [mk('a', 1, 'i', (e) => e[0]), mk('b', 1, 'i', (e) => e[1])];
  RPOOL = buildPool(leaves, dom, { maxI: 5, maxB: 7, capI: 3000, capB: 6000, consts: [0, 1, 2, 3, 4, 15] });
  return RPOOL;
}
// relation forms for pair counts: key(a) cmp key(b) ; (a op b) cmp C   (key from a small unary pool)
let RFORMS = null;
export function rforms() {
  if (RFORMS) return RFORMS;
  const dom = []; for (let v = -8; v <= 100; v++) dom.push([v]);
  const U = buildPool([mk('v', 1, 'i', (e) => e[0])], dom, { maxI: 3, maxB: 0, capI: 200, consts: [1, 2, 3, 4, 8] }).I.filter((u) => !/^\d+$/.test(u.s));
  const out = []; const seen = new Set();
  const rdom = []; for (let a = 8; a <= 15; a++) for (let b = 8; b <= 15; b++) if (a !== b) rdom.push([a, b]);
  const push = (s, z, f) => { const k = rdom.map((e) => (f(e) ? 1 : 0)).join(''); if (seen.has(k) || !k.includes('1')) return; seen.add(k); out.push(mk(s, z, 'b', f)); };
  const CM = [['<', (x, y) => x < y], ['>', (x, y) => x > y], ['==', (x, y) => x === y], ['!=', (x, y) => x !== y]];
  for (const u of U.sort((a, b) => a.z - b.z)) for (const [o, op] of CM) { const g = u.f; push(`(${u.s.replace(/v/g, 'a')}${o}${u.s.replace(/v/g, 'b')})`, u.z + 1, (e) => op(g([e[0]]), g([e[1]]))); }
  const OPS = [['+', (a, b) => a + b], ['ad', (a, b) => Math.abs(a - b)], ['-', (a, b) => a - b]];
  const CC = [['==', (x, y) => x === y], ['<', (x, y) => x < y], ['>', (x, y) => x > y]];
  for (const [on, op] of OPS) for (let C = -7; C <= 31; C++) for (const [cn, cp] of CC) push(`((a${on}b)${cn}${C})`, 3, (e) => cp(op(e[0], e[1]), C));
  RFORMS = out.sort((a, b) => a.z - b.z); return RFORMS;
}
let R3POOL = null;
function r3pool() {
  if (R3POOL) return R3POOL;
  const dom = []; for (let c = 8; c <= 15; c++) for (let x = 8; x <= 15; x++) for (let i = 0; i < 8; i++) dom.push([c, x, i]);
  const leaves = [mk('c', 1, 'i', (e) => e[0]), mk('x', 1, 'i', (e) => e[1]), mk('i', 1, 'i', (e) => e[2])];
  R3POOL = buildPool(leaves, dom, { maxI: 5, maxB: 9, capI: 2000, capB: 8000, consts: [0, 1, 2, 3], andMaxZ: 5 });
  return R3POOL;
}
let WPOOL = null;
function wpool() {   // index step g(i, x, n)
  if (WPOOL) return WPOOL;
  const dom = []; for (let n = 1; n <= 8; n++) for (let i = 0; i < n; i++) for (let x = 8; x <= 15; x++) dom.push([i, x, n]);
  const leaves = [mk('i', 1, 'i', (e) => e[0]), mk('x', 1, 'i', (e) => e[1]), mk('n', 1, 'i', (e) => e[2])];
  WPOOL = buildPool(leaves, dom, { maxI: 7, maxB: 0, capI: 40000, capB: 0, consts: [1, 2, 3, 4, 8] });
  return WPOOL;
}
let T3POOL = null;
function t3pool() {
  if (T3POOL) return T3POOL;
  const dom = []; for (let a = 8; a <= 15; a++) for (let b = 8; b <= 15; b++) for (let c = 8; c <= 15; c++) if (a !== b && b !== c && a !== c) dom.push([a, b, c]);
  const leaves = [mk('a', 1, 'i', (e) => e[0]), mk('b', 1, 'i', (e) => e[1]), mk('c', 1, 'i', (e) => e[2])];
  const cc = []; for (let c = 24; c <= 45; c++) cc.push(c);
  T3POOL = buildPool(leaves, dom, { maxI: 5, maxB: 7, capI: 600, capB: 1500, consts: [], cmpConsts: cc, binOps: undefined });
  return T3POOL;
}

// element pool - per task (globals are per example). domain: positions of l, of prefix sums of l, of adjacent diffs of l, of sorted l
export function epool(examples, opts = {}) {
  const dom = [], blocks = [];
  for (const ex of examples) { const l = ex.l, G = ex.G; const lists = [l, scanSum(l)]; const s0 = dom.length;
    for (const L of lists) for (let i = 0; i < L.length; i++) dom.push([L[i], i, L, G]); blocks.push([s0, dom.length]); }
  const pcRel = rforms();
  const leaves = [
    mk('x', 1, 'i', (e) => e[0]), mk('i', 1, 'i', (e) => e[1]), mk('n', 1, 'i', (e) => e[2].length),
    mk('prv', 1, 'i', (e) => (e[1] > 0 ? e[2][e[1] - 1] : 0)), mk('nxt', 1, 'i', (e) => (e[1] + 1 < e[2].length ? e[2][e[1] + 1] : 0)),
    mk('srt', 2, 'i', (e) => [...e[2]].sort(asc)[e[1]]),
    ...GN.map((g, k) => mk(g, 1, 'i', (e) => e[3][k])),
  ];
  // x-only tables: x ∈ S for every subset S of 8..15 (a learned table; compiles to a shelf tool learned by the value builder)
  for (let m = 1; m < 255; m++) { const S = []; for (let v = 0; v < 8; v++) if (m >> v & 1) S.push(v + 8); leaves.push(mk(`x∈{${S.join(',')}}`, 4, 'b', (e) => e[0] >= 8 && e[0] <= 15 && ((m >> (e[0] - 8)) & 1) === 1)); }
  // pair counts: #{j in J(i): R(x, L[j])}
  const J = [['<', (j, i) => j < i], ['>', (j, i) => j > i], ['≠', (j, i) => j !== i]];
  for (const [jn, jf] of J) for (const r of pcRel) { const rf = r.f; leaves.push(mk(`#${jn}${r.s}`, 1 + r.z, 'i', (e) => { const L = e[2], i = e[1], x = e[0]; let c = 0; for (let j = 0; j < L.length; j++) if (jf(j, i) && rf([x, L[j]])) c++; return c; })); }
  const cc = []; for (let c = 0; c <= 63; c++) cc.push(c);
  const P = buildPool(leaves, dom, { maxI: opts.maxI || 5, maxB: opts.maxB || 7, capI: opts.capI || 20000, capB: opts.capB || 100000, quotaB: { 5: 40000, 6: 15000, 7: 30000 }, consts: [0, 1, 2, 3, 4, 8, 12, 15, 16], cmpConsts: cc, deadline: opts.deadline, blocks });
  P.dom = dom; P.blocks = blocks; return P;
}
export function scanSum(L) { const r = []; let s = 0; for (const x of L) { s += x; r.push(s); } return r; }
export function diffs(L) { const r = []; for (let i = 1; i < L.length; i++) r.push(L[i] - L[i - 1]); return r; }

// ───────────────────────── productions ─────────────────────────
// each: [name, ret, argTypes, fn(ctx, ...args)]; lambda args arrive as closures; K/C/SA args as numbers
const E = (f, x, i, L, G) => f([x, i, L, G]);
const P = [
  // ints
  ['len', 'I', ['L'], (c, L) => L.length], ['sum', 'I', ['L'], (c, L) => sum(L)], ['max', 'I', ['L'], (c, L) => mx(L)], ['min', 'I', ['L'], (c, L) => mn(L)],
  ['hd', 'I', ['L'], (c, L) => L[0] ?? 0], ['lst', 'I', ['L'], (c, L) => (L.length ? L[L.length - 1] : 0)],
  ['nth', 'I', ['I', 'L'], (c, i, L) => (i >= 0 && i < L.length ? L[i] : 0)], ['idx', 'I', ['I', 'L'], (c, v, L) => L.indexOf(v)],
  ['cnt', 'I', ['EB', 'L'], (c, p, L) => { let k = 0; for (let i = 0; i < L.length; i++) if (E(p, L[i], i, L, c.G)) k++; return k; }],
  ['fidx', 'I', ['EB', 'L'], (c, p, L) => { for (let i = 0; i < L.length; i++) if (E(p, L[i], i, L, c.G)) return i; return -1; }],
  ['amax', 'I', ['EI', 'L'], (c, f, L) => { let b = -1, bv = -Infinity; for (let i = 0; i < L.length; i++) { const v = E(f, L[i], i, L, c.G); if (v > bv) { bv = v; b = i; } } return b; }],
  ['amin', 'I', ['EI', 'L'], (c, f, L) => { let b = -1, bv = Infinity; for (let i = 0; i < L.length; i++) { const v = E(f, L[i], i, L, c.G); if (v < bv) { bv = v; b = i; } } return b; }],
  ['dist', 'I', ['L'], (c, L) => new Set(L).size],
  ['fold', 'I', ['RI', 'I', 'L'], (c, f, a0, L) => { let a = a0; for (const x of L) { a = f([a, x]); if (!Number.isFinite(a) || Math.abs(a) > 4096) return NaN; } return a; }],
  ['cyc', 'I', ['L'], (c, L) => { const n = L.length, seen = new Array(n).fill(false); let k = 0; for (let i = 0; i < n; i++) { if (L[i] < 0 || L[i] >= n) return -1; } for (let i = 0; i < n; i++) if (!seen[i]) { k++; let j = i; while (!seen[j]) { seen[j] = true; j = L[j]; } } return k; }],
  ['pcnt', 'I', ['RB', 'L'], (c, r, L) => { let k = 0; for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) if (r([L[i], L[j]])) k++; return k; }],
  ['pdist', 'I', ['RI', 'L'], (c, f, L) => { const s = new Set(); for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) s.add(f([L[i], L[j]])); return s.size; }],
  ['tcnt', 'I', ['T3', 'L'], (c, p, L) => { let k = 0; const n = L.length; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let m = j + 1; m < n; m++) if (p([L[i], L[j], L[m]])) k++; return k; }],
  ['wcnt', 'I', ['W', 'L'], (c, g, L) => walkIdx(g, L).length],
  ['scnt', 'I', ['S'], (c, S) => S.length],
  ['add', 'I', ['I', 'I'], (c, a, b) => a + b, 'comm'], ['sub', 'I', ['I', 'I'], (c, a, b) => a - b], ['mul', 'I', ['I', 'I'], (c, a, b) => a * b, 'comm'],
  ['ad', 'I', ['I', 'I'], (c, a, b) => Math.abs(a - b), 'comm'], ['imn', 'I', ['I', 'I'], (c, a, b) => Math.min(a, b), 'comm'], ['imx', 'I', ['I', 'I'], (c, a, b) => Math.max(a, b), 'comm'],
  ['mod', 'I', ['I', 'I'], (c, a, b) => (b > 0 ? ((a % b) + b) % b : 0)], ['div', 'I', ['I', 'I'], (c, a, b) => (b > 0 ? Math.floor(a / b) : 0)],
  ['m16', 'I', ['I'], (c, a) => a & 15], ['cap', 'I', ['I'], (c, a) => Math.min(15, a)], ['dflt', 'I', ['I', 'I'], (c, a, b) => (a < 0 ? b : a)],
  // bools (used by the case split)
  ['lt', 'B', ['I', 'I'], (c, a, b) => a < b], ['eq', 'B', ['I', 'I'], (c, a, b) => a === b, 'comm'], ['odd', 'B', ['I'], (c, a) => (a & 1) === 1],
  // lists
  ['rev', 'L', ['L'], (c, L) => [...L].reverse()], ['srt', 'L', ['L'], (c, L) => [...L].sort(asc)], ['srtd', 'L', ['L'], (c, L) => [...L].sort((a, b) => b - a)],
  ['tl', 'L', ['L'], (c, L) => L.slice(1)], ['ini', 'L', ['L'], (c, L) => L.slice(0, -1)],
  ['take', 'L', ['I', 'L'], (c, k, L) => (k < 0 ? null : L.slice(0, k))], ['drop', 'L', ['I', 'L'], (c, k, L) => (k < 0 ? null : L.slice(k))],
  ['rot', 'L', ['I', 'L'], (c, k, L) => { const n = L.length; if (!n) return []; const r = ((k % n) + n) % n; return [...L.slice(r), ...L.slice(0, r)]; }],
  ['rmat', 'L', ['I', 'L'], (c, k, L) => L.filter((_, i) => i !== k)],
  ['cat', 'L', ['L', 'L'], (c, A, B) => (A.length + B.length > MAXLEN ? null : [...A, ...B])],
  ['ilv', 'L', ['L', 'L'], (c, A, B) => { const r = []; for (let i = 0; i < Math.max(A.length, B.length); i++) { if (i < A.length) r.push(A[i]); if (i < B.length) r.push(B[i]); } return r.length > MAXLEN ? null : r; }],
  ['flt', 'L', ['EB', 'L'], (c, p, L) => L.filter((x, i) => E(p, x, i, L, c.G))],
  ['tw', 'L', ['EB', 'L'], (c, p, L) => { const r = []; for (let i = 0; i < L.length; i++) { if (!E(p, L[i], i, L, c.G)) break; r.push(L[i]); } return r; }],
  ['dw', 'L', ['EB', 'L'], (c, p, L) => { let i = 0; while (i < L.length && E(p, L[i], i, L, c.G)) i++; return L.slice(i); }],
  ['map', 'L', ['EI', 'L'], (c, f, L) => L.map((x, i) => E(f, x, i, L, c.G))],
  ['sby', 'L', ['EI', 'L'], (c, f, L) => L.map((x, i) => [E(f, x, i, L, c.G), i, x]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((t) => t[2])],
  ['scan', 'L', ['L'], (c, L) => scanSum(L)], ['dif', 'L', ['L'], (c, L) => diffs(L)],
  ['stkC', 'L', ['RB', 'L'], (c, r, L) => { const s = []; for (const x of L) { if (s.length && r([s[s.length - 1], x])) s.pop(); else s.push(x); } return s; }],
  ['stkM', 'L', ['RB', 'L'], (c, r, L) => { const s = []; for (const x of L) { while (s.length && r([s[s.length - 1], x])) s.pop(); s.push(x); } return s; }],
  ['stkR', 'L', ['RB', 'L'], (c, r, L) => { const s = []; for (const x of L) { if (s.length && r([s[s.length - 1], x])) s[s.length - 1] = x; else s.push(x); } return s; }],
  ['carry', 'L', ['R3', 'L'], (c, r, L) => { if (!L.length) return []; const o = []; let cr = L[0]; for (let i = 1; i < L.length; i++) { const x = L[i]; if (r([cr, x, i - 1])) o.push(x); else { o.push(cr); cr = x; } } o.push(cr); return o; }],
  ['deq', 'L', ['RB', 'L'], (c, r, L) => { const o = []; let i = 0, j = L.length - 1; while (i <= j) { if (r([L[i], L[j]])) o.push(L[i++]); else o.push(L[j--]); } return o; }],
  ['deqB', 'L', ['RB', 'C', 'L'], (c, r, C, L) => { const o = []; let i = 0, j = L.length - 1, s = 0; while (i <= j) { const t = r([L[i], L[j]]); const x = t ? L[i] : L[j]; if (s + x > C) break; s += x; o.push(x); if (t) i++; else j--; } return o; }],
  ['jos', 'L', ['KJ', 'L'], (c, k, L) => { const a = [...L], o = []; let i = 0; while (a.length) { i = (i + k) % a.length; o.push(a.splice(i, 1)[0]); } return o; }],
  ['walk', 'L', ['W', 'L'], (c, g, L) => walkIdx(g, L).map((i) => L[i])],
  ['crev', 'L', ['S'], (c, S) => S.flatMap((s) => [...s].reverse())], ['csrt', 'L', ['S'], (c, S) => S.flatMap((s) => [...s].sort(asc))],
  ['magg', 'L', ['SA', 'S'], (c, a, S) => S.map(SAGG[a][1])],
  ['sbest', 'L', ['SA', 'S'], (c, a, S) => { let b = null, bv = -Infinity; for (const s of S) { const v = SAGG[a][1](s); if (v > bv) { bv = v; b = s; } } return b || []; }],
  ['sworst', 'L', ['SA', 'S'], (c, a, S) => { let b = null, bv = Infinity; for (const s of S) { const v = SAGG[a][1](s); if (v < bv) { bv = v; b = s; } } return b || []; }],
  ['slast', 'L', ['S'], (c, S) => S[S.length - 1] || []],
  // segments
  ['runs', 'S', ['RB', 'L'], (c, r, L) => { if (!L.length) return []; const S = [[L[0]]]; for (let i = 1; i < L.length; i++) { if (r([L[i - 1], L[i]])) S[S.length - 1].push(L[i]); else S.push([L[i]]); } return S; }],
  ['spl', 'S', ['EB', 'L'], (c, p, L) => { const S = []; let cur = null; for (let i = 0; i < L.length; i++) { if (E(p, L[i], i, L, c.G)) { if (!cur) { cur = []; S.push(cur); } cur.push(L[i]); } else cur = null; } return S; }],
  ['win', 'S', ['K2', 'L'], (c, k, L) => { const S = []; for (let i = 0; i + k <= L.length; i++) S.push(L.slice(i, i + k)); return S; }],
  ['chk', 'S', ['K2', 'L'], (c, k, L) => { const S = []; for (let i = 0; i < L.length; i += k) S.push(L.slice(i, i + k)); return S; }],
  ['segs', 'S', ['L'], (c, L) => { const S = []; for (let i = 0; i < L.length; i++) for (let j = i + 1; j <= L.length; j++) S.push(L.slice(i, j)); return S; }],
];
function walkIdx(g, L) { const n = L.length, seen = new Set(), out = []; let i = 0; while (i >= 0 && i < n && !seen.has(i)) { seen.add(i); out.push(i); i = g([i, L[i], n]); } return out; }
export const PRODS = P;
const PMAP = new Map(P.map((x) => [x[0], x]));

// fast paths: element lambda applied to the input list l itself — read the lambda's precomputed values on l's block of the probe domain
const bit = (b, d) => (b[d >>> 5] >>> (d & 31)) & 1;
const FAST = {
  flt: (l, P, s0) => l.filter((x, i) => bit(P.v, s0 + i)),
  cnt: (l, P, s0) => { let k = 0; for (let i = 0; i < l.length; i++) k += bit(P.v, s0 + i); return k; },
  fidx: (l, P, s0) => { for (let i = 0; i < l.length; i++) if (bit(P.v, s0 + i)) return i; return -1; },
  tw: (l, P, s0) => { const r = []; for (let i = 0; i < l.length; i++) { if (!bit(P.v, s0 + i)) break; r.push(l[i]); } return r; },
  dw: (l, P, s0) => { let i = 0; while (i < l.length && bit(P.v, s0 + i)) i++; return l.slice(i); },
  spl: (l, P, s0) => { const S = []; let cur = null; for (let i = 0; i < l.length; i++) { if (bit(P.v, s0 + i)) { if (!cur) { cur = []; S.push(cur); } cur.push(l[i]); } else cur = null; } return S; },
  map: (l, F, s0) => l.map((x, i) => F.v[s0 + i]),
  sby: (l, F, s0) => l.map((x, i) => [F.v[s0 + i], i, x]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((t) => t[2]),
  amax: (l, F, s0) => { let b = -1, bv = -Infinity; for (let i = 0; i < l.length; i++) { const v = F.v[s0 + i]; if (v > bv) { bv = v; b = i; } } return b; },
  amin: (l, F, s0) => { let b = -1, bv = Infinity; for (let i = 0; i < l.length; i++) { const v = F.v[s0 + i]; if (v < bv) { bv = v; b = i; } } return b; },
};
// small constant arg types
const KV = { K2: [2, 3], KJ: [1, 2, 3], SA: [0, 1, 2, 3, 4, 5], C: Array.from({ length: 48 }, (_, i) => i + 16) };
const KZ = { K2: 1, KJ: 1, SA: 1, C: 2 };

// ───────────────────────── value keys ─────────────────────────
const vkey = (v) => (typeof v === 'number' ? String(v) : typeof v === 'boolean' ? (v ? 'T' : 'F') : Array.isArray(v) ? (v.length && Array.isArray(v[0]) ? v.map((s) => s.join(',')).join('/') : v.join(',')) : '?');
const valid = (t, v) => { if (v === null || v === undefined) return false; if (t === 'I') return Number.isFinite(v) && Math.abs(v) <= 4096; if (t === 'B') return typeof v === 'boolean'; if (t === 'L') return v.length <= MAXLEN && v.every(Number.isFinite); if (t === 'S') return v.length <= 64; return true; };

// ───────────────────────── term display / usage ─────────────────────────
export function show(t) { if (t.leaf) return t.leaf; return `${t.p}(${t.a.map((x) => (x && x.p !== undefined) || (x && x.leaf) ? show(x) : x && x.s ? x.s : String(x)).join(', ')})`; }
export function usage(t, out = new Set()) { if (t.leaf) { out.add('atom:' + t.leaf.replace(/\d+/, 'k')); return out; } out.add(t.p); for (const a of t.a) { if (a && (a.p !== undefined || a.leaf)) usage(a, out); else if (a && a.s) lamUsage(a.s, out); } return out; }
function lamUsage(s, out) { for (const m of s.match(/#[<>≠]|prv|nxt|srt|hd|last|sec|sum|max|min|n0/g) || []) out.add('lam:' + m); }

// ───────────────────────── the search ─────────────────────────
// examples: [{l, out}] ; kind: 'list2num' | 'list2list'
// production order: cheap unary wrappers first, arithmetic on two ints last (fair share: capPerProd new terms per production per size)
const PORDER = [...P].sort((a, b) => rank(a) - rank(b));
function rank(p) { const at = p[2]; const nI = at.filter((t) => t === 'I').length; if (at.length === 1) return 0; if (nI >= 2) return 3; if (at.length === 2) return 1; return 2; }
export function search(examples, kind, { ms = 20000, maxSize = 12, capPerLevel = 15000, capArith = 3000, say = () => {}, prof = null, accept = null } = {}) {
  const T0 = Date.now(), deadline = T0 + ms;
  const K = examples.length; const ctx = examples.map((e) => ({ l: e.l, G: globalsOf(e.l) }));
  const target = kind === 'list2num' ? 'I' : 'L';
  const tkeys = examples.map((e) => vkey(e.out)); const tkey = tkeys.join('|');
  // lambda pools
  const ep = epool(examples.map((e, k) => ({ l: e.l, G: ctx[k].G })), { deadline: T0 + ms * 0.25 });
  const pools = { EI: ep.Iz, EB: ep.Bz, RI: rpool().Iz, RB: rpool().Bz, R3: r3pool().Bz, W: wpool().Iz, T3: t3pool().Bz };
  // a lambda's cost in the program grammar grows with half its own size (lambdas are cheap relative to list structure)
  const lamCost = (z) => 1 + ((z - 1) >> 1);
  const byCost = {}; for (const [t, P2] of Object.entries(pools)) { const bc = []; (P2 || []).forEach((arr, z) => { if (!arr) return; const c = lamCost(z); (bc[c] ||= []).push(...arr); }); byCost[t] = bc; }
  const lamAt = (t, z) => { if (KV[t]) return z === KZ[t] ? KV[t] : []; const P2 = byCost[t]; return (P2 && P2[z]) || []; };
  const minZ = (t) => (KV[t] ? KZ[t] : 1);
  // banks
  const bank = { I: [], B: [], L: [], S: [] }; const seen = { I: new Map(), B: new Map(), L: new Map(), S: new Map() };
  const view16 = new Map(), viewCap = new Map(); let fresh = [];   // views of int terms (x&15, min(15,x)) for meet-in-the-middle
  const stats = { terms: 0, evals: 0 };
  const masks = new Map(); // mask -> term (target type only), K<=30 bits
  const cands = [];
  const add = (type, z, term, vals) => {
    const ks = vals.map(vkey); const key = ks.join('|'); if (seen[type].has(key)) return null;
    const ent = { ...term, z, v: vals }; seen[type].set(key, ent); (bank[type][z] ||= []).push(ent); stats.terms++;
    if (type === target) fresh.push(ent);
    if (type === 'I') { const k16 = vals.map((x) => x & 15).join('|'); if (!view16.has(k16)) view16.set(k16, ent); const kc = vals.map((x) => Math.min(15, x)).join('|'); if (!viewCap.has(kc)) viewCap.set(kc, ent); }
    if (type === target) { if (key === tkey) cands.push(ent);
      let m = 0; for (let k = 0; k < Math.min(K, 30); k++) if (ks[k] === tkeys[k]) m |= 1 << k; if (!masks.has(m)) masks.set(m, ent); }
    return ent; };
  // atoms
  const atomL = add('L', 1, { leaf: 'l' }, ctx.map((c) => c.l)); const eBlocks = ep.blocks;
  add('I', 1, { leaf: 'n' }, ctx.map((c) => c.l.length));
  for (let k = 0; k <= 15; k++) add('I', 1, { leaf: String(k) }, ctx.map(() => k));
  const argsOf = (t, z) => (bank[t] ? bank[t][z] || [] : lamAt(t, z));
  let level = 1;
  for (let z = 2; z <= maxSize && !cands.length; z++) {
    level = z;
    for (const [name, ret, at, fn, comm] of PORDER) { let made = 0; const tp = Date.now(); const ev0 = stats.evals;
      if (Date.now() > deadline || cands.length) break;
      const k = at.length; const budget = z - 1;
      // enumerate size compositions
      const comps = []; const rec = (i, left, acc) => { if (i === k) { if (left === 0) comps.push(acc.slice()); return; } for (let s = minZ(at[i]); s <= left - (k - i - 1); s++) { acc.push(s); rec(i + 1, left - s, acc); acc.pop(); } }; rec(0, budget, []);
      for (const cz of comps) {
        if (Date.now() > deadline || cands.length) break;
        const lists = cz.map((s, i) => argsOf(at[i], s)); if (lists.some((x) => !x.length)) continue;
        // cartesian product
        const idx = new Array(k).fill(0); let done = false;
        while (!done) {
          if (comm && k === 2 && cz[0] === cz[1] && idx[1] < idx[0]) { /* skip symmetric */ } else {
            const args = idx.map((j, i) => lists[i][j]);
            const vals = new Array(K); let ok = true;
            const fast = FAST[name] && k === 2 && args[1] === atomL && args[0].v ? FAST[name] : null;
            if (fast) { const lam = args[0]; for (let e = 0; e < K; e++) { const v = fast(ctx[e].l, lam, eBlocks[e][0]); if (!valid(ret, v)) { ok = false; break; } vals[e] = v; } }
            else if (k === 1) { const a0 = args[0], b0 = !!bank[at[0]], c0 = !!KV[at[0]];
              for (let e = 0; e < K; e++) { let v; try { v = fn(ctx[e], b0 ? a0.v[e] : c0 ? a0 : a0.f); } catch { v = null; } if (!valid(ret, v)) { ok = false; break; } vals[e] = v; } }
            else if (k === 2) { const a0 = args[0], b0 = !!bank[at[0]], c0 = !!KV[at[0]], a1 = args[1], b1 = !!bank[at[1]], c1 = !!KV[at[1]];
              for (let e = 0; e < K; e++) { let v; try { v = fn(ctx[e], b0 ? a0.v[e] : c0 ? a0 : a0.f, b1 ? a1.v[e] : c1 ? a1 : a1.f); } catch { v = null; } if (!valid(ret, v)) { ok = false; break; } vals[e] = v; } }
            else for (let e = 0; e < K; e++) { const av = args.map((a, i) => (bank[at[i]] ? a.v[e] : KV[at[i]] ? a : a.f)); let v; try { v = fn(ctx[e], ...av); } catch { v = null; } if (!valid(ret, v)) { ok = false; break; } vals[e] = v; }
            stats.evals++;
            if (ok) { if (add(ret, z, { p: name, a: args }, vals)) made++; }
            if (made > (rank([0, 0, at]) === 3 ? capArith : capPerLevel) || (stats.evals & 1023) === 0 && Date.now() > deadline) { done = true; break; }
          }
          let i = k - 1; while (i >= 0) { idx[i]++; if (idx[i] < lists[i].length) break; idx[i] = 0; i--; } if (i < 0) done = true;
          if (cands.length) break;
        }
      }
      if (prof) { const q = prof[name] ||= { ms: 0, ev: 0, made: 0 }; q.ms += Date.now() - tp; q.ev += stats.evals - ev0; q.made += made; }
    }
    // meet in the middle: out = A ++ B (lists) ; out = A ± B, (A ± B) & 15, A & 15, min(15, A) (ints) — B looked up by its needed value vector
    if (!cands.length) {
      const tryC = (ent) => { if (!accept || accept(ent)) { cands.push(ent); return true; } return false; };
      const outs = examples.map((e) => e.out);
      if (target === 'L') {
        for (const A of fresh) { if (cands.length) break;
          let pre = true, suf = true; for (let e = 0; e < K; e++) { const a = A.v[e], o = outs[e]; if (a.length > o.length) { pre = suf = false; break; }
            if (pre) for (let i = 0; i < a.length; i++) if (a[i] !== o[i]) { pre = false; break; }
            if (suf) for (let i = 0; i < a.length; i++) if (a[i] !== o[o.length - a.length + i]) { suf = false; break; }
            if (!pre && !suf) break; }
          if (pre) { const B = seen.L.get(outs.map((o, e) => o.slice(A.v[e].length).join(',')).join('|')); if (B && B !== A && tryC({ p: 'cat', a: [A, B], z: 1 + A.z + B.z })) break; }
          if (suf) { const B = seen.L.get(outs.map((o, e) => o.slice(0, o.length - A.v[e].length).join(',')).join('|')); if (B && B !== A && tryC({ p: 'cat', a: [B, A], z: 1 + A.z + B.z })) break; }
        }
      } else {
        const t16 = outs.join('|'); const u16 = view16.get(t16), uc = viewCap.get(t16);
        if (u16 && tryC({ p: 'm16', a: [u16], z: 1 + u16.z })) {} else if (uc && tryC({ p: 'cap', a: [uc], z: 1 + uc.z })) {}
        for (const A of cands.length ? [] : fresh) {
          const av = A.v; let B;
          if ((B = seen.I.get(outs.map((o, e) => o - av[e]).join('|'))) && tryC({ p: 'add', a: [A, B], z: 1 + A.z + B.z })) break;
          if ((B = seen.I.get(outs.map((o, e) => av[e] - o).join('|'))) && tryC({ p: 'sub', a: [A, B], z: 1 + A.z + B.z })) break;
          if ((B = seen.I.get(outs.map((o, e) => o + av[e]).join('|'))) && tryC({ p: 'sub', a: [B, A], z: 1 + A.z + B.z })) break;
          if ((B = view16.get(outs.map((o, e) => (o - av[e]) & 15).join('|'))) && tryC({ p: 'm16', a: [{ p: 'add', a: [A, B], z: 1 + A.z + B.z }], z: 2 + A.z + B.z })) break;
          if ((B = view16.get(outs.map((o, e) => (av[e] - o) & 15).join('|'))) && tryC({ p: 'm16', a: [{ p: 'sub', a: [A, B], z: 1 + A.z + B.z }], z: 2 + A.z + B.z })) break;
        }
      }
      fresh = [];
    }
    // case split on the target: ite(B, A, C) from banked bools and partial matches (masks)
    if (!cands.length && Date.now() < deadline) {
      const full = K >= 30 ? (2 ** 30 - 1) : (2 ** K - 1);
      const ms2 = [...masks.entries()].sort((a, b) => a[1].z - b[1].z);
      const bools = (bank.B.flat ? bank.B.flat() : []).filter(Boolean);
      // n<=t splits as bools too
      const extra = [0, 1, 2].map((t) => ({ p: 'le', a: [{ leaf: 'n' }, { leaf: String(t) }], z: 3, v: ctx.map((c) => c.l.length <= t) }));
      outer: for (const b of [...extra, ...bools.filter((x) => x.z <= 5)]) {
        if (Date.now() > deadline) break;
        let bm = 0; for (let e = 0; e < Math.min(K, 30); e++) if (b.v[e]) bm |= 1 << e; const nm = full & ~bm;
        if (bm === 0 || nm === 0) continue;
        let A = null, C = null; for (const [m, t] of ms2) { if (!A && (m & bm) === bm) A = t; if (!C && (m & nm) === nm) C = t; if (A && C) break; }
        if (A && C && A !== C) { const ent = { p: 'ite', a: [b, A, C], z: 1 + b.z + A.z + C.z };
          // check on all K examples (masks cover only the first 30)
          let ok = true; for (let e = 0; e < K; e++) { const v = b.v[e] ? A.v[e] : C.v[e]; if (vkey(v) !== tkeys[e]) { ok = false; break; } }
          if (ok && (!accept || accept(ent))) { cands.push(ent); break outer; } }
      }
    }
    say(`  size ${z}: terms=${stats.terms} evals=${stats.evals} t=${Date.now() - T0}ms`);
    if (Date.now() > deadline) break;
  }
  return { cands, stats, level, ms: Date.now() - T0, bank, prof };
}

// evaluate a found term on a new input list (for verification)
export function evalTerm(t, l) {
  const c = { l, G: globalsOf(l) };
  const ev = (u) => {
    if (u.leaf !== undefined) { if (u.leaf === 'l') return l; if (u.leaf === 'n') return l.length; return +u.leaf; }
    if (u.p === 'ite') { const b = ev(u.a[0]); return b ? ev(u.a[1]) : ev(u.a[2]); }
    if (u.p === 'le') return ev(u.a[0]) <= ev(u.a[1]);
    const pr = PMAP.get(u.p); const at = pr[2];
    const av = u.a.map((a, i) => (at[i] in KV ? a : (at[i] === 'I' || at[i] === 'L' || at[i] === 'S' || at[i] === 'B') ? ev(a) : a.f));
    return pr[3](c, ...av);
  };
  return ev(t);
}
