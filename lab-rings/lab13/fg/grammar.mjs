// fg/grammar.mjs - grammar G0 (frozen, see fg/FROZEN).
// G0 = port of strat-library/dsl.mjs (generic list frames with typed holes), plus ONLY these generic
// productions from strat-dsl, each named by the judge's plan (strat-plan.md, Track A):
//   * lambda leaves e.prv / e.nxt      (previous / next element of the current list, 0 at the edges)
//   * ite(B,A,C) for lists (l.ite)     + the conditions it needs (g.lt, g.eq, g.odd; dsl's lt/eq/odd).
//     (g.ite for numbers already exists in the library grammar.) Built only by the case split, which
//     must pass held-out lists before it is accepted (search.mjs).
//   * top-level meet-in-the-middle:   l.cat (A++B), g.add / g.sub (A±B), g.and15 (m16), g.cap15 (cap).
//     g.add/g.sub/g.and15/g.cap15 already exist; l.cat is new and is built only by meet-in-the-middle.
// The enumerator, signatures and verification live in search.mjs; this file is only the grammar.
// Nothing here knows any task: no names, no sources.
//
// Contexts / types
//   Ne,Be : element lambda  (x,i | cur list)        Np,Bp : pair lambda (a,b,i | cur list)
//   Bt    : triple lambda   (a,b,c | cur list)       K     : integer constant 0..47
//   N,B   : number of the current list              D     : numeric derived list    L : element list
// Every list op rebinds "cur" to its input list, so frames compose (a frame can run on a sub-list).

export const glob = (l) => { const n = l.length; let s = 0, mn = 0, mx = 0; if (n) { mn = 99; for (const v of l) { s += v; if (v < mn) mn = v; if (v > mx) mx = v; } } return { n, l0: n ? l[0] : 0, last: n ? l[n - 1] : 0, sum: s, mn, mx }; };
const MOD = (a, b) => (b > 0 ? ((a % b) + b) % b : 0);

// ---------- productions ----------
// each: {name, ret, args:[types], mk(argFns) -> fn}. Signatures of fn per ret type:
//  Ne/Be: (x,i,l,G)  Np/Bp: (a,b,i,l,G)  Bt: (a,b,c,l,G)  N/B/D/L: (l,G)  K: value
export const P = [];
const def = (name, ret, args, mk, tag = 'base') => P.push({ name, ret, args, mk, tag });

// element numeric
for (const v of ['x', 'i', 'n', 'l0', 'last', 'sum', 'mn', 'mx']) def('e.' + v, 'Ne', [], () => v === 'x' ? (x) => x : v === 'i' ? (x, i) => i : (x, i, l, G) => G[v]);
for (const c of [0, 1, 2, 3, 4]) def('e.c' + c, 'Ne', [], () => () => c);
const BIN = { add: (a, b) => a + b, sub: (a, b) => a - b, absd: (a, b) => Math.abs(a - b), mod: MOD, min: Math.min, max: Math.max, mul: (a, b) => a * b };
for (const [k, f] of Object.entries(BIN)) {
  def('e.' + k, 'Ne', ['Ne', 'Ne'], ([p, q]) => (x, i, l, G) => f(p(x, i, l, G), q(x, i, l, G)));
  def('p.' + k, 'Np', ['Np', 'Np'], ([p, q]) => (a, b, i, l, G, j) => f(p(a, b, i, l, G, j), q(a, b, i, l, G, j)));
  def('g.' + k, 'N', ['N', 'N'], ([p, q]) => (l, G) => f(p(l, G), q(l, G)));
}
def('e.half', 'Ne', ['Ne'], ([p]) => (x, i, l, G) => p(x, i, l, G) >> 1);
// nested aggregate inside an element lambda: count y in scope with pair-pred(a=x, b=y)
for (const sc of ['all', 'before', 'after']) def('e.cnt_' + sc, 'Ne', ['Bp'], ([p]) => (x, i, l, G) => { let c = 0; const lo = sc === 'after' ? i + 1 : 0, hi = sc === 'before' ? i : l.length; for (let j = lo; j < hi; j++) if (j !== i && p(x, l[j], i, l, G, j)) c++; return c; });
// pair numeric
for (const v of ['a', 'b', 'i', 'n', 'l0', 'sum']) def('p.' + v, 'Np', [], () => v === 'a' ? (a) => a : v === 'b' ? (a, b) => b : v === 'i' ? (a, b, i) => i : (a, b, i, l, G) => G[v]);
for (const c of [0, 1, 2, 3, 4]) def('p.c' + c, 'Np', [], () => () => c);
def('p.half', 'Np', ['Np'], ([p]) => (a, b, i, l, G, j) => p(a, b, i, l, G, j) >> 1);
// constants
for (let c = 0; c < 48; c++) def('k' + c, 'K', [], () => c);
// predicates
const REL = { lt: (a, b) => a < b, le: (a, b) => a <= b, eq: (a, b) => a === b, ne: (a, b) => a !== b };
for (const [k, f] of Object.entries(REL)) {
  def('e.' + k, 'Be', ['Ne', 'Ne'], ([p, q]) => (x, i, l, G) => f(p(x, i, l, G), q(x, i, l, G)));
  def('p.' + k, 'Bp', ['Np', 'Np'], ([p, q]) => (a, b, i, l, G, j) => f(p(a, b, i, l, G, j), q(a, b, i, l, G, j)));
}
for (const [k, f] of Object.entries({ eqK: (a, b) => a === b, ltK: (a, b) => a < b, gtK: (a, b) => a > b })) {
  def('e.' + k, 'Be', ['Ne', 'K'], ([p, c]) => (x, i, l, G) => f(p(x, i, l, G), c));
  def('p.' + k, 'Bp', ['Np', 'K'], ([p, c]) => (a, b, i, l, G, j) => f(p(a, b, i, l, G, j), c));
}
def('e.k', 'Ne', ['K'], ([k]) => () => k);
def('p.k', 'Np', ['K'], ([k]) => () => k);
def('g.k', 'N', ['K'], ([k]) => () => k);
def('e.or', 'Be', ['Be', 'Be'], ([p, q]) => (x, i, l, G) => p(x, i, l, G) || q(x, i, l, G));
def('p.or', 'Bp', ['Bp', 'Bp'], ([p, q]) => (a, b, i, l, G, j) => p(a, b, i, l, G, j) || q(a, b, i, l, G, j));
def('e.xor', 'Be', ['Be', 'Be'], ([p, q]) => (x, i, l, G) => !p(x, i, l, G) !== !q(x, i, l, G));
def('p.xor', 'Bp', ['Bp', 'Bp'], ([p, q]) => (a, b, i, l, G, j) => !p(a, b, i, l, G, j) !== !q(a, b, i, l, G, j));
def('e.and', 'Be', ['Be', 'Be'], ([p, q]) => (x, i, l, G) => p(x, i, l, G) && q(x, i, l, G));
def('e.not', 'Be', ['Be'], ([p]) => (x, i, l, G) => !p(x, i, l, G));
def('p.and', 'Bp', ['Bp', 'Bp'], ([p, q]) => (a, b, i, l, G, j) => p(a, b, i, l, G, j) && q(a, b, i, l, G, j));
def('p.not', 'Bp', ['Bp'], ([p]) => (a, b, i, l, G, j) => !p(a, b, i, l, G, j));
// triple predicates
def('t.chain', 'Bt', ['Bp'], ([p]) => (a, b, c, l, G) => p(a, b, 0, l, G) && p(b, c, 0, l, G));
def('t.sumK', 'Bt', ['K'], ([k]) => (a, b, c) => a + b + c === k);
def('t.sumgK', 'Bt', ['K'], ([k]) => (a, b, c) => a + b + c > k);

// global numbers
for (const v of ['n', 'l0', 'last', 'sum', 'mn', 'mx']) def('g.' + v, 'N', [], () => (l, G) => G[v]);
for (const c of [0, 1, 2, 3, 4, 15]) def('g.c' + c, 'N', [], () => () => c);
def('g.half', 'N', ['N'], ([p]) => (l, G) => p(l, G) >> 1);
def('g.cap15', 'N', ['N'], ([p]) => (l, G) => Math.min(15, p(l, G)));
def('g.and15', 'N', ['N'], ([p]) => (l, G) => p(l, G) & 15);
def('g.inc', 'N', ['N'], ([p]) => (l, G) => p(l, G) + 1);
const AGG = {
  len: (d) => d.length, sum: (d) => { let s = 0; for (const v of d) s += v; return s; },
  min: (d) => d.length ? Math.min(...d) : 0, max: (d) => d.length ? Math.max(...d) : 0,
  first: (d) => d.length ? d[0] : 0, last: (d) => d.length ? d[d.length - 1] : 0,
  distinct: (d) => new Set(d).size,
  mode: (d) => { const c = new Map(); let b = 0, bc = 0; for (const v of d) c.set(v, (c.get(v) || 0) + 1); for (const [v, k] of c) if (k > bc || (k === bc && v < b)) { b = v; bc = k; } return b; },
  argmax: (d) => { let b = -1; for (let i = 0; i < d.length; i++) if (b < 0 || d[i] > d[b]) b = i; return b; },
  argmin: (d) => { let b = -1; for (let i = 0; i < d.length; i++) if (b < 0 || d[i] < d[b]) b = i; return b; },
  maxrun: (d) => { let b = 0, c = 0; for (let i = 0; i < d.length; i++) { c = i && d[i] === d[i - 1] ? c + 1 : 1; if (c > b) b = c; } return b; },
};
for (const [k, f] of Object.entries(AGG)) def('agg.' + k, 'N', ['D'], ([d]) => (l, G) => f(d(l, G)));
def('g.findIdx', 'N', ['D', 'Be'], ([d, p]) => (l0, G0) => { const l = d(l0, G0), G = glob(l); for (let i = 0; i < l.length; i++) if (p(l[i], i, l, G)) return i; return -1; });
def('g.findLast', 'N', ['D', 'Be'], ([d, p]) => (l0, G0) => { const l = d(l0, G0), G = glob(l); for (let i = l.length - 1; i >= 0; i--) if (p(l[i], i, l, G)) return i; return -1; });
def('g.fold', 'N', ['D', 'Np', 'K'], ([d, p, k]) => (l, G) => { const m = d(l, G); let acc = k; m.forEach((x, i) => { acc = p(acc, x, i, m, G); }); return acc; });
def('g.at', 'N', ['L', 'N'], ([q, p]) => (l, G) => { const m = q(l, G); const k = p(l, G); return k >= 0 && k < m.length ? m[k] : 0; });
def('g.indexOf', 'N', ['N'], ([p]) => (l, G) => l.indexOf(p(l, G)));
def('g.cntPairs', 'N', ['Bp'], ([p]) => (l, G) => { let c = 0; for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) if (p(l[i], l[j], i, l, G, j)) c++; return c; });
def('g.cntTriples', 'N', ['Bt'], ([p]) => (l, G) => { let c = 0; const n = l.length; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) if (p(l[i], l[j], l[k], l, G)) c++; return c; });
def('g.ite', 'N', ['B', 'N', 'N'], ([b, p, q]) => (l, G) => b(l, G) ? p(l, G) : q(l, G));
def('g.ltK', 'B', ['N', 'K'], ([p, k]) => (l, G) => p(l, G) < k);
// derived numeric lists
def('d.map', 'D', ['Ne'], ([p]) => (l, G) => l.map((x, i) => p(x, i, l, G)));
def('d.adj', 'D', ['Np'], ([p]) => (l, G) => { const r = []; for (let i = 0; i + 1 < l.length; i++) r.push(p(l[i], l[i + 1], i, l, G, i + 1)); return r; });
def('d.chunk2', 'D', ['Np'], ([p]) => (l, G) => { const r = []; for (let i = 0; i < l.length; i += 2) r.push(i + 1 < l.length ? p(l[i], l[i + 1], i, l, G, i + 1) : l[i]); return r; });
def('d.pairs', 'D', ['Np'], ([p]) => (l, G) => { const r = []; for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) r.push(p(l[i], l[j], i, l, G, j)); return r; });
def('d.scan', 'D', ['D'], ([d]) => (l, G) => { let s = 0; return d(l, G).map((v) => (s += v)); });
def('d.mapD', 'D', ['D', 'Ne'], ([d, p]) => (l, G) => { const m = d(l, G); const H = glob(m); return m.map((x, i) => p(x, i, m, H)); });
def('d.adjD', 'D', ['D', 'Np'], ([d, p]) => (l, G) => { const m = d(l, G); const H = glob(m); const r = []; for (let i = 0; i + 1 < m.length; i++) r.push(p(m[i], m[i + 1], i, m, H, i + 1)); return r; });
def('d.runlens', 'D', ['D', 'Bp'], ([d, p]) => (l, G) => { const m = d(l, G); const H = glob(m); const r = []; let c = 0; for (let i = 0; i < m.length; i++) { if (i && p(m[i - 1], m[i], i, m, H)) c++; else { if (i) r.push(c); c = 1; } } if (m.length) r.push(c); return r; });
def('d.segs', 'D', ['Np', 'Bp'], ([v, p]) => (l, G) => { const r = []; for (let i = 0; i < l.length; i++) { let s = 0; for (let j = i; j < l.length; j++) { s += l[j]; if (p(s, j - i + 1, i, l, G)) r.push(v(s, j - i + 1, i, l, G)); } } return r; });
def('d.walk', 'D', ['Ne'], ([p]) => (l, G) => { const n = l.length, seen = new Uint8Array(n), r = []; let i = 0; while (n && !seen[i]) { seen[i] = 1; r.push(i); i = MOD(p(l[i], i, l, G), n); } return r; });

// element lists (frames)
const sub = (f, m) => f(m, glob(m));
const at = (L) => (l, G) => { const m = L(l, G); return [m, m === l ? G : glob(m)]; };
def('l.id', 'L', [], () => (l) => l);
def('l.filter', 'L', ['L', 'Be'], ([L, p]) => { const A = at(L); return (l, G) => { const [m, H] = A(l, G); return m.filter((x, i) => p(x, i, m, H)); }; });
def('l.sortBy', 'L', ['L', 'Ne'], ([L, p]) => { const A = at(L); return (l, G) => { const [m, H] = A(l, G); const k = m.map((x, i) => p(x, i, m, H)); return m.map((x, i) => i).sort((a, b) => k[a] - k[b] || a - b).map((i) => m[i]); }; });
def('l.sortByDesc', 'L', ['L', 'Ne'], ([L, p]) => { const A = at(L); return (l, G) => { const [m, H] = A(l, G); const k = m.map((x, i) => p(x, i, m, H)); return m.map((x, i) => i).sort((a, b) => k[b] - k[a] || a - b).map((i) => m[i]); }; });
def('l.sortBy2', 'L', ['L', 'Ne', 'Ne'], ([L, p, q]) => { const A = at(L); return (l, G) => { const [m, H] = A(l, G); const k = m.map((x, i) => p(x, i, m, H)), k2 = m.map((x, i) => q(x, i, m, H)); return m.map((x, i) => i).sort((a, b) => k[a] - k[b] || k2[a] - k2[b] || a - b).map((i) => m[i]); }; });
def('l.rev', 'L', ['L'], ([L]) => (l, G) => [...L(l, G)].reverse());
def('l.take', 'L', ['L', 'N'], ([L, p]) => { const A = at(L); return (l, G) => { const [m, H] = A(l, G); return m.slice(0, Math.max(0, p(m, H))); }; });
def('l.drop', 'L', ['L', 'N'], ([L, p]) => { const A = at(L); return (l, G) => { const [m, H] = A(l, G); return m.slice(Math.max(0, p(m, H))); }; });
def('l.slice', 'L', ['L', 'N', 'N'], ([L, p, q]) => { const A = at(L); return (l, G) => { const [m, H] = A(l, G); const a = p(m, H), b = q(m, H); return a < 0 ? [] : m.slice(a, Math.max(a, b)); }; });
def('l.rotate', 'L', ['L', 'N'], ([L, p]) => { const A = at(L); return (l, G) => { const [m, H] = A(l, G); if (!m.length) return m; const k = MOD(p(m, H), m.length); return [...m.slice(k), ...m.slice(0, k)]; }; });
def('l.splitAt', 'L', ['L', 'N', 'L', 'L'], ([L__, p, F1, F2]) => { const A__ = at(L__); return (l0, G0) => { const [l, G] = A__(l0, G0); const k = Math.max(0, p(l, G)); return [...sub(F1, l.slice(0, k)), ...sub(F2, l.slice(k))]; }; });
def('l.runsMap', 'L', ['L', 'Bp', 'L'], ([L__, p, F]) => { const A__ = at(L__); const inner = (l, G) => { const r = []; let s = 0; for (let i = 1; i <= l.length; i++) if (i === l.length || !p(l[i - 1], l[i], i, l, G)) { r.push(...sub(F, l.slice(s, i))); s = i; } return r; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.runsBest', 'L', ['L', 'Bp'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { let bs = 0, bl = 0, s = 0; for (let i = 1; i <= l.length; i++) if (i === l.length || !p(l[i - 1], l[i], i, l, G)) { if (i - s > bl) { bl = i - s; bs = s; } s = i; } return l.slice(bs, bs + bl); }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.stackCancel', 'L', ['L', 'Bp'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { const s = []; l.forEach((x, i) => { if (s.length && p(s[s.length - 1], x, i, l, G)) s.pop(); else s.push(x); }); return s; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.stackWhile', 'L', ['L', 'Bp'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { const s = []; l.forEach((x, i) => { while (s.length && p(s[s.length - 1], x, i, l, G)) s.pop(); s.push(x); }); return s; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.passLR', 'L', ['L', 'Bp'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { const r = [...l]; for (let i = 0; i + 1 < r.length; i++) if (p(r[i], r[i + 1], i, l, G)) { const t = r[i]; r[i] = r[i + 1]; r[i + 1] = t; } return r; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.passRL', 'L', ['L', 'Bp'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { const r = [...l]; for (let i = r.length - 2; i >= 0; i--) if (p(r[i], r[i + 1], i, l, G)) { const t = r[i]; r[i] = r[i + 1]; r[i + 1] = t; } return r; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.twoPtr', 'L', ['L', 'Bp'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { const r = []; let i = 0, j = l.length - 1; while (i <= j) r.push(p(l[i], l[j], i, l, G, j) ? l[i++] : l[j--]); return r; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.hop', 'L', ['L', 'Ne'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { const r = []; let i = 0; while (i < l.length) { r.push(l[i]); const s = p(l[i], i, l, G); if (s < 1) break; i += s; } return r; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.walk', 'L', ['L', 'Ne'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { const n = l.length, seen = new Uint8Array(n), r = []; let i = 0; while (n && !seen[i]) { seen[i] = 1; r.push(l[i]); i = MOD(p(l[i], i, l, G), n); } return r; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.josephus', 'L', ['L', 'K'], ([L__, k]) => { const A__ = at(L__); const inner = (l, G) => { if (k > 4) return l; const a = [...l], r = []; let i = 0; while (a.length) { i = (i + k) % a.length; r.push(a.splice(i, 1)[0]); } return r; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.move', 'L', ['L', 'N', 'N'], ([L__, p, q]) => { const A__ = at(L__); const inner = (l, G) => { const f = p(l, G), t = q(l, G); if (f < 0 || f >= l.length) return l; const r = [...l]; const [v] = r.splice(f, 1); const tt = t < 0 || t > r.length ? r.length : t; r.splice(tt, 0, v); return r; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.removeAt', 'L', ['L', 'N', 'K'], ([L, p, k]) => { const A = at(L); return (l, G) => { const [m, H] = A(l, G); const f = p(m, H); if (f < 0 || f >= m.length || k < 1 || k > 3) return m; return [...m.slice(0, f), ...m.slice(f + k)]; }; });
def('l.swap', 'L', ['L', 'N', 'N'], ([L__, p, q]) => { const A__ = at(L__); const inner = (l, G) => { const a = p(l, G), b = q(l, G); if (a < 0 || b < 0 || a >= l.length || b >= l.length) return l; const r = [...l]; const t = r[a]; r[a] = r[b]; r[b] = t; return r; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.takeWhile', 'L', ['L', 'Be'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { let i = 0; while (i < l.length && p(l[i], i, l, G)) i++; return l.slice(0, i); }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });
def('l.dropWhile', 'L', ['L', 'Be'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { let i = 0; while (i < l.length && p(l[i], i, l, G)) i++; return l.slice(i); }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; });

// ---------- G0 additions (from strat-dsl, named by the plan) ----------
// prv/nxt: neighbours in the current list (0 at the edges, as in strat-dsl)
def('e.prv', 'Ne', [], () => (x, i, l) => (i > 0 ? l[i - 1] : 0), 'g0');
def('e.nxt', 'Ne', [], () => (x, i, l) => (i + 1 < l.length ? l[i + 1] : 0), 'g0');
// conditions for the case split ite(B,A,C) (strat-dsl lt/eq/odd)
def('g.lt', 'B', ['N', 'N'], ([p, q]) => (l, G) => p(l, G) < q(l, G), 'g0');
def('g.eq', 'B', ['N', 'N'], ([p, q]) => (l, G) => p(l, G) === q(l, G), 'g0');
def('g.odd', 'B', ['N'], ([p]) => (l, G) => (p(l, G) & 1) === 1, 'g0');
// built only by the top-level searches (meet-in-the-middle / case split), never bottom-up
def('l.cat', 'L', ['L', 'L'], ([A, B]) => (l, G) => [...A(l, G), ...B(l, G)], 'top');
def('l.ite', 'L', ['B', 'L', 'L'], ([b, A, C]) => (l, G) => (b(l, G) ? A(l, G) : C(l, G)), 'top');

// ---------- G1 additions (generic; see fg/FROZEN for the justification of each) ----------
// Every production below is a FRAME with typed holes; the holes (keys, relations, constants) are filled by the search
// from examples. Nothing here knows a task. Tag 'g1' (the G0 pass of the stage enumerates without them).
// (3) wider arithmetic: the floor mean of a stream (sum kept in two cells by the compiler) and the exact scaled
//     deviation of an element from the mean of the current list (x*n - sum: no rounding, wide, signed / absolute).
def('agg.mean', 'N', ['D'], ([d]) => (l, G) => { const m = d(l, G); if (!m.length) return 0; let s = 0; for (const v of m) s += v; return Math.floor(s / m.length); }, 'g1');
def('e.dev', 'Ne', [], () => (x, i, l, G) => x * G.n - G.sum, 'g1');
def('e.adev', 'Ne', [], () => (x, i, l, G) => Math.abs(x * G.n - G.sum), 'g1');
// (2) small "all possibilities" frames: consecutive triples (a=l[i-1], b=l[i], c=l[i+1]) with a learned triple relation,
//     two generic triple relations built from a pair relation (flip: the relation changes between the two steps;
//     peak: it holds on the first step and not on the second), and the index distance of a pair (pair counts / pair streams).
def('g.cntWin3', 'N', ['Bt'], ([p]) => (l, G) => { let c = 0; for (let i = 1; i + 1 < l.length; i++) if (p(l[i - 1], l[i], l[i + 1], l, G)) c++; return c; }, 'g1');
def('t.flip', 'Bt', ['Bp'], ([p]) => (a, b, c, l, G) => !p(a, b, 0, l, G, 1) !== !p(b, c, 0, l, G, 1), 'g1');
def('t.peak', 'Bt', ['Bp'], ([p]) => (a, b, c, l, G) => !!p(a, b, 0, l, G, 1) && !p(b, c, 0, l, G, 1), 'g1');
def('p.di', 'Np', [], () => (a, b, i, l, G, j) => (j === undefined ? 0 : Math.abs(j - i)), 'g1');
// (1) structures built while scanning, each with a learned rule and a generic read-out:
//   stackPops : each element pops the stack while rel(top, x), then is pushed; the rest pops at the end. Read-out: pop order.
//   heapPush  : each element is appended to an array and sifted up while rel(parent, child). Read-out: the array (level order).
//   groupBy   : groups by a learned key, groups in order of first appearance, stable inside a group.
//   tdep      : depth (root = 1) of x in the search tree built by inserting the current list in order (left when key(x) < key(node)).
//   takeUntilK / dropUntilK : the scan stops at the k-th element where a learned condition holds (k = 1..4).
def('l.stackPops', 'L', ['L', 'Bp'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { const s = [], r = []; l.forEach((x, i) => { while (s.length && p(s[s.length - 1], x, i, l, G)) r.push(s.pop()); s.push(x); }); while (s.length) r.push(s.pop()); return r; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; }, 'g1');
def('l.heapPush', 'L', ['L', 'Bp'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { const h = []; for (const x of l) { h.push(x); let i = h.length - 1; while (i > 0) { const q = (i - 1) >> 1; if (!p(h[q], h[i], i, l, G)) break; const t = h[q]; h[q] = h[i]; h[i] = t; i = q; } } return h; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; }, 'g1');
def('l.groupBy', 'L', ['L', 'Ne'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { const k = l.map((x, i) => p(x, i, l, G)); const ord = []; for (const v of k) if (!ord.includes(v)) ord.push(v); const r = []; for (const v of ord) l.forEach((x, i) => { if (k[i] === v) r.push(x); }); return r; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; }, 'g1');
// knockout: rounds of adjacent matches; rel(a, b) = a beats b (a advances, b leaves); an odd last advances. Read-out: the order
// in which elements leave, then the champion.
def('l.knockout', 'L', ['L', 'Bp'], ([L__, p]) => { const A__ = at(L__); const inner = (l, G) => { let a = [...l]; const r = []; while (a.length > 1) { const b = []; for (let i = 0; i < a.length; i += 2) { if (i + 1 < a.length) { if (p(a[i], a[i + 1], i, l, G)) { r.push(a[i + 1]); b.push(a[i]); } else { r.push(a[i]); b.push(a[i + 1]); } } else b.push(a[i]); } a = b; } return [...r, ...a]; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; }, 'g1');
def('e.tdep', 'Ne', ['Ne'], ([p]) => (x, i, l, G) => { const k = l.map((y, j) => p(y, j, l, G)); let d = 1; for (let j = 0; j < i; j++) { let anc = true; for (let z = 0; z < j; z++) if ((k[j] < k[z]) !== (k[i] < k[z])) { anc = false; break; } if (anc) d++; } return d; }, 'g1');
def('l.takeUntilK', 'L', ['L', 'Be', 'K'], ([L__, p, k]) => { if (!(k >= 1 && k <= 4)) throw new Error('k'); const A__ = at(L__); const inner = (l, G) => { let c = 0; for (let i = 0; i < l.length; i++) if (p(l[i], i, l, G) && ++c === k) return l.slice(0, i); return l; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; }, 'g1');
def('l.dropUntilK', 'L', ['L', 'Be', 'K'], ([L__, p, k]) => { if (!(k >= 1 && k <= 4)) throw new Error('k'); const A__ = at(L__); const inner = (l, G) => { let c = 0; for (let i = 0; i < l.length; i++) if (p(l[i], i, l, G) && ++c === k) return l.slice(i); return []; }; return (l0, G0) => { const [l, G] = A__(l0, G0); return inner(l, G); }; }, 'g1');

export const PI = new Map(P.map((p, k) => [p.name, k]));

// ---------- compile an AST {p:name, a:[...]} (or {h:type,k} hole) ----------
export function compile(ast, holes) {
  if (ast.h) return holes[ast.k];
  const pr = P[PI.get(ast.p)];
  return pr.mk(ast.a.map((c) => compile(c, holes)));
}
export const show = (t) => (t.h ? '?' + t.h + t.k : t.a.length ? t.p + '(' + t.a.map(show).join(',') + ')' : t.p);
export const size = (t) => (t.h ? 0 : 1 + t.a.reduce((s, c) => s + size(c), 0));


// parse the show() form back into an AST
export function parse(str) {
  let i = 0;
  const rd = () => {
    let j = i; while (j < str.length && str[j] !== '(' && str[j] !== ')' && str[j] !== ',') j++;
    const name = str.slice(i, j); i = j;
    const a = [];
    if (str[i] === '(') { i++; while (true) { a.push(rd()); if (str[i] === ',') { i++; continue; } if (str[i] === ')') { i++; break; } throw new Error('parse ' + str); } }
    if (name.startsWith('?')) { const m = name.match(/^\?([A-Za-z]+)(\d+)$/); return { h: m[1], k: +m[2] }; }
    if (!PI.has(name)) throw new Error('unknown production ' + name);
    return { p: name, a };
  };
  const t = rd(); if (i !== str.length) throw new Error('parse tail ' + str); return t;
}
// evaluate an AST on one input list (a plain array of values 8..15)
export const evalAst = (ast, l) => compile(ast, [])(l, glob(l));
export const RET = (name) => P[PI.get(name)].ret;
export function instantiate(tmpl, args) { if (tmpl.h) return args[tmpl.k]; return { p: tmpl.p, a: tmpl.a.map((c) => instantiate(c, args)) }; }
