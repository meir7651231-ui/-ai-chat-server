// fg/search.mjs - the shared enumerator over grammar G0 + task matching + CEGIS.
//   * enumerate(): cost-ordered bottom-up enumeration with observational-equivalence pruning on a probe set
//     (port of strat-library/dsl.mjs enumerate). It does not know any task: every new N / L / B node is
//     handed to onNode(type, node). The same enumerator feeds the offline index (index.mjs) and the live search.
//   * Matcher: given the task's target vector it checks each node: direct hit, m16 / cap views,
//     meet-in-the-middle (A++B, A+B, A-B, m16(A±B)) and the case split ite(B,A,C) (held-out acceptance).
//   * solveLists(): index first, then live CEGIS rounds (strat-dsl/solve.mjs): every candidate must pass the
//     held-out lists and the exhaustive check on all 109,601 valid lists (distinct values 8..15, length 0..8);
//     a counterexample is added to the probes and the search restarts.
// The task is only an oracle (input list => output); nothing here reads a task's source or name.
import { P, PI, glob, compile, show, size, instantiate } from './grammar.mjs';

// ---------- inputs chosen by the machine (not by the task) ----------
let seed = 1;
const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x80000000;
export function randList(n) { const p = [8, 9, 10, 11, 12, 13, 14, 15]; for (let i = 7; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } return p.slice(0, n); }
export function probes(K = 40, s = 1234567) {
  seed = s; const L = [[]];
  for (const n of [1, 1, 2, 2, 2, 3, 3, 3]) L.push(randList(n));
  L.push([8, 9, 10, 11, 12, 13, 14, 15]); L.push([15, 14, 13, 12, 11, 10, 9, 8]);
  while (L.length < K) L.push(randList(4 + Math.floor(rnd() * 5)));
  return L;
}
export const PROBES = probes(40);
let VAL = null; export function heldOut() { if (!VAL) { seed = 777; VAL = Array.from({ length: 80 }, (_, k) => randList(k < 9 ? k : 3 + (k % 6))); } return VAL; }
let ALL = null, ALLG = null;
export function allLists() {
  if (ALL) return ALL; ALL = []; const cur = []; const used = new Array(16).fill(false);
  (function rec() { ALL.push(cur.slice()); if (cur.length === 8) return; for (let v = 8; v <= 15; v++) if (!used[v]) { used[v] = true; cur.push(v); rec(); cur.pop(); used[v] = false; } })();
  ALLG = ALL.map(glob); return ALL;
}

// ---------- values and hashes ----------
// N: Int32Array per probe (non-integers -> sentinel); L: packed lists (len | elems 3 bits each from 8) ; B: bits
const NONINT = -0x7fffff01, UNPACK = -1;
export function packList(v) { if (!Array.isArray(v) || v.length > 8) return UNPACK; let c = v.length; for (let j = 0; j < v.length; j++) { const x = v[j]; if (!(x >= 8 && x <= 15) || (x | 0) !== x) return UNPACK; c |= (x - 8) << (4 + 3 * j); } return c; }
export function unpackList(c) { const n = c & 15, r = []; for (let j = 0; j < n; j++) r.push(8 + ((c >>> (4 + 3 * j)) & 7)); return r; }
export function hashI(v, map) { let h1 = 2166136261 | 0, h2 = 5381; for (let i = 0; i < v.length; i++) { const c = map ? map(v[i]) : v[i]; h1 = Math.imul(h1 ^ c, 16777619); h2 = (Math.imul(h2, 33) + c) | 0; } return [h1 >>> 0, h2 >>> 0]; }
export const hkey = (h) => h[0] * 4294967296 + h[1];   // exact 64-bit key as a double is not exact; use string below
export const hstr = (h) => h[0].toString(36) + ':' + h[1].toString(36);
const v16 = (x) => x & 15, vcap = (x) => (x === NONINT ? NONINT : Math.min(15, x));
const hashArr = (vals) => { let h1 = 2166136261 | 0, h2 = 5381; const mix = (c) => { h1 = Math.imul(h1 ^ c, 16777619); h2 = (Math.imul(h2, 33) + c) | 0; };
  for (const v of vals) { if (typeof v === 'object') { if (v === null) mix(7777); else { mix(9999 + v.length); for (const x of v) mix(x | 0); } } else if (typeof v === 'boolean') mix(v ? 1 : 2); else if (Number.isInteger(v)) mix(v | 0); else mix(123457); mix(55555); }
  return (h1 >>> 0).toString(36) + ':' + (h2 >>> 0).toString(36); };

export function makeCtx(PR) {
  const PG = PR.map(glob); const K = PR.length;
  const E = []; PR.forEach((l, k) => l.forEach((x, i) => E.push([x, i, l, PG[k]])));
  const PP = []; PR.forEach((l, k) => { for (let i = 0; i < l.length; i++) for (let j = 0; j < l.length; j++) if (i !== j && (Math.abs(i - j) === 1 || (i * 7 + j * 3 + k) % 4 === 0)) PP.push([l[i], l[j], i, l, PG[k], j]); });
  for (let a = -3; a < 20; a += 2) for (let b = -2; b < 20; b += 3) PP.push([a, b, 1, PR[PR.length - 1], PG[PG.length - 1]]);
  const TR = []; PR.forEach((l, k) => { for (let i = 0; i < l.length; i++) for (let j = i + 1; j < l.length; j++) for (let m = j + 1; m < l.length; m++) if (TR.length < 4000 && (i + j + m + k) % 3 === 0) TR.push([l[i], l[j], l[m], l, PG[k]]); });
  const valsN = (f) => { const v = new Int32Array(K); for (let k = 0; k < K; k++) { const x = f(PR[k], PG[k]); v[k] = Number.isInteger(x) && Math.abs(x) < 1e9 ? x : NONINT; } return v; };
  const valsL = (f) => { const v = new Int32Array(K); const raw = []; let ok = true; for (let k = 0; k < K; k++) { const x = f(PR[k], PG[k]); raw.push(x); const c = packList(x); if (c === UNPACK) ok = false; v[k] = c; } return ok ? v : { raw }; };
  const valsB = (f) => { const v = new Uint8Array(K); for (let k = 0; k < K; k++) v[k] = f(PR[k], PG[k]) ? 1 : 0; return v; };
  const sig = {
    Ne: (f) => hashArr(E.map(([x, i, l, G]) => f(x, i, l, G))),
    Be: (f) => hashArr(E.map(([x, i, l, G]) => (f(x, i, l, G) ? 1 : 0))),
    Np: (f) => hashArr(PP.map(([a, b, i, l, G, j]) => f(a, b, i, l, G, j))),
    Bp: (f) => hashArr(PP.map(([a, b, i, l, G, j]) => (f(a, b, i, l, G, j) ? 1 : 0))),
    Bt: (f) => hashArr(TR.map(([a, b, c, l, G]) => (f(a, b, c, l, G) ? 1 : 0))),
    K: (f) => 'k' + f,
    D: (f) => hashArr(PR.map((l, k) => f(l, PG[k]))),
  };
  return { PR, PG, K, sig, valsN, valsL, valsB };
}

// ---------- the shared enumerator ----------
// costs: Map name->cost (missing => 1). lib: learned templates [{name, ret, args, tmpl, cost}].
// onNode(T, node) for T in N/L/B; node = {ast(), c, v (values), f}. Return true to stop.
const TYPES_ORDER = ['K', 'Ne', 'Be', 'Np', 'Bp', 'Bt', 'N', 'B', 'D', 'L'];
export function enumerate({ ctx, costs, lib = [], onNode, maxCost = 40, timeMs = 60000, capProd = 1500, capArgs = 120000, log = false, deadline = null, poolsOut = null, g1 = false }) {
  const t0 = Date.now(); const end = deadline ?? t0 + timeMs;
  const prods = [];
  for (const p of P) if (p.tag !== 'top' && (g1 || p.tag !== 'g1')) prods.push({ name: p.name, ret: p.ret, args: p.args, cost: Math.max(1, costs.get(p.name) ?? 1), mk: p.mk, ast: (a) => ({ p: p.name, a }) });
  for (const L of lib) prods.push({ name: L.name, ret: L.ret, args: L.args, cost: L.cost, mk: (fs) => compile(L.tmpl, fs), ast: (a) => instantiate(L.tmpl, a) });
  const pools = {}; const seen = {}; if (poolsOut) poolsOut.pools = pools;   // learn.mjs: the fillers of every type (one-hole neighbours)
  for (const T of TYPES_ORDER) { pools[T] = []; seen[T] = new Set(); }
  let made = 0, evald = 0, stop = false;
  const add = (T, c, ast, f) => {
    let s, v = null;
    try {
      if (T === 'N') { v = ctx.valsN(f); const h = hashI(v); s = hstr(h); }
      else if (T === 'L') { v = ctx.valsL(f); s = v.raw ? 'r' + hashArr(v.raw) : hstr(hashI(v)); if (v.raw) v = null; }
      else if (T === 'B') { v = ctx.valsB(f); s = hstr(hashI(v)); }
      else s = ctx.sig[T](f);
    } catch { return; }
    evald++;
    if (seen[T].has(s)) return; seen[T].add(s);
    const node = { ast, f, c, v };
    (pools[T][c] ||= []).push(node); made++;
    if (T === 'L') { let sd; try { sd = ctx.sig.D(f); } catch { sd = null; } if (sd && !seen.D.has(sd)) { seen.D.add(sd); (pools.D[c] ||= []).push(node); } }
    if ((T === 'N' || T === 'L' || T === 'B') && onNode && onNode(T, node)) stop = true;
  };
  let lastCost = 0;
  for (let c = 1; c <= maxCost && !stop; c++) {
    lastCost = c;
    for (const T of TYPES_ORDER) {
      for (const pr of prods) {
        if (stop) break;
        if (pr.ret !== T || pr.cost > c) continue;
        const rest = c - pr.cost; const k = pr.args.length;
        if (k === 0) { if (rest === 0) add(T, c, pr.ast([]), pr.mk([])); continue; }
        if (rest < k) continue;
        const splits = []; (function rec(j, left, acc) { if (j === k - 1) { splits.push([...acc, left]); return; } for (let x = 1; x <= left - (k - 1 - j); x++) rec(j + 1, left - x, [...acc, x]); })(0, rest, []);
        let tried = 0; const before = made; const cap = capProd * (T === 'L' || T === 'N' || T === 'D' ? 3 : 1);
        for (const sp of splits) {
          const lists = sp.map((cc, j) => pools[pr.args[j]][cc] || []);
          if (lists.some((x) => !x.length)) continue;
          const idx = new Array(k).fill(0);
          outer: while (true) {
            const ch = idx.map((ii, j) => lists[j][ii]);
            let f; try { f = pr.mk(ch.map((n) => n.f)); } catch { f = null; }
            if (f) add(T, c, pr.ast(ch.map((n) => n.ast)), f);
            if (stop || ++tried > capArgs || made - before > cap) break;
            if ((evald & 1023) === 0 && Date.now() > end) return { made, evald, ms: Date.now() - t0, lastCost: c, timeout: true };
            for (let j = k - 1; j >= 0; j--) { if (++idx[j] < lists[j].length) continue outer; idx[j] = 0; }
            break;
          }
          if (stop || tried > capArgs || made - before > cap) break;
        }
      }
      if (stop) break;
    }
    if (log) console.error('cost', c, ((Date.now() - t0) / 1000).toFixed(1) + 's', TYPES_ORDER.map((T) => T + ':' + (pools[T][c]?.length || 0)).join(' '));
    if (onNode && onNode('level', { c })) stop = true;
    if (Date.now() > end) return { made, evald, ms: Date.now() - t0, lastCost: c, timeout: true };
  }
  return { made, evald, ms: Date.now() - t0, lastCost };
}

// ---------- matching a task against nodes (live pools or the index) ----------
// target: Int32Array (list2num: f(l)&15 per probe; list2list: packed lists). Candidates go to tryCand(ast, how) which
// returns true when the candidate is verified (then the matcher stops).
export class Matcher {
  constructor(kind, target, tryCand, { mitm = true, ite = true } = {}) {
    this.kind = kind; this.t = target; this.K = target.length; this.tryCand = tryCand; this.mitm = mitm; this.iteOn = ite;
    this.tkey = hstr(hashI(target)); this.N = new Map(); this.N16 = new Map(); this.L = new Map();
    this.masks = new Map(); this.mlo = new Int32Array(60000); this.mhi = new Int32Array(60000); this.mnode = []; this.nm = 0; this.bools = []; this.done = false; this.nIte = 0;
  }
  // node: {v, ast (object or ()=>object), c}
  feed(T, node) {
    if (this.done) return true;
    const t = this.t, K = this.K;
    const A = node;
    if (T === 'B') { if (this.iteOn && (node.c ?? 0) <= 12 && this.bools.length < 20000) this.bools.push(node); return false; }
    if (this.kind === 'list2num' && T === 'N') {
      const v = node.v; const h = hstr(hashI(v));
      if (h === this.tkey && this.tryCand(node.ast, 'direct')) return (this.done = true);
      const k16 = hstr(hashI(v, v16));
      if (k16 === this.tkey && this.tryCand({ p: 'g.and15', a: [node.ast] }, 'm16')) return (this.done = true);
      if (hstr(hashI(v, vcap)) === this.tkey && this.tryCand({ p: 'g.cap15', a: [node.ast] }, 'cap')) return (this.done = true);
      if (this.mitm) {
        const d = new Int32Array(K); let B;
        const look = (m, fn) => { for (let k = 0; k < K; k++) d[k] = v[k] === NONINT ? 0x7ffffff : fn(t[k], v[k]); return m.get(hstr(hashI(d))); };
        if ((B = look(this.N, (o, a) => o - a)) && this.tryCand({ p: 'g.add', a: [B.ast, node.ast] }, 'A+B')) return (this.done = true);
        if ((B = look(this.N, (o, a) => a - o)) && this.tryCand({ p: 'g.sub', a: [node.ast, B.ast] }, 'A-B')) return (this.done = true);
        if ((B = look(this.N, (o, a) => o + a)) && this.tryCand({ p: 'g.sub', a: [B.ast, node.ast] }, 'A-B')) return (this.done = true);
        if ((B = look(this.N16, (o, a) => (o - a) & 15)) && this.tryCand({ p: 'g.and15', a: [{ p: 'g.add', a: [B.ast, node.ast] }] }, 'm16(A+B)')) return (this.done = true);
        if ((B = look(this.N16, (o, a) => (a - o) & 15)) && this.tryCand({ p: 'g.and15', a: [{ p: 'g.sub', a: [node.ast, B.ast] }] }, 'm16(A-B)')) return (this.done = true);
        if ((B = look(this.N16, (o, a) => (o + a) & 15)) && this.tryCand({ p: 'g.and15', a: [{ p: 'g.sub', a: [B.ast, node.ast] }] }, 'm16(A-B)')) return (this.done = true);
        if (!this.N.has(h)) this.N.set(h, node); if (!this.N16.has(k16)) this.N16.set(k16, node);
      }
      if (this.iteOn) this.addMask(v, node, (a, o) => a === o);
      return false;
    }
    if (this.kind === 'list2list' && T === 'L') {
      const v = node.v; if (!v) return false; const h = hstr(hashI(v));
      if (h === this.tkey && this.tryCand(node.ast, 'direct')) return (this.done = true);
      if (this.mitm) {
        // A as prefix: out = A ++ B ; A as suffix: out = B ++ A
        let pre = true, suf = true; const d1 = new Int32Array(K), d2 = new Int32Array(K);
        for (let k = 0; k < K && (pre || suf); k++) {
          const a = v[k], o = t[k], na = a & 15, no = o & 15; if (na > no) { pre = suf = false; break; }
          const ae = a >>> 4, oe = o >>> 4, m = na ? (1 << (3 * na)) - 1 : 0;
          if (pre) { if (((ae ^ oe) & m) !== 0) pre = false; else d1[k] = (no - na) | ((oe >>> (3 * na)) << 4); }
          if (suf) { if (((oe >>> (3 * (no - na))) & m) !== ae) suf = false; else d2[k] = (no - na) | ((oe & ((1 << (3 * (no - na))) - 1)) << 4); }
        }
        let B;
        if (pre && (B = this.L.get(hstr(hashI(d1)))) && this.tryCand({ p: 'l.cat', a: [node.ast, B.ast] }, 'A++B')) return (this.done = true);
        if (suf && (B = this.L.get(hstr(hashI(d2)))) && this.tryCand({ p: 'l.cat', a: [B.ast, node.ast] }, 'A++B')) return (this.done = true);
        if (!this.L.has(h)) this.L.set(h, node);
        // the other order: node is the second half of an earlier A (B looked up when A arrives later is covered above;
        // here we look back for an earlier A whose remainder equals this node)
        const back = this.rem && this.rem.get(h);
        if (back) for (const [A2, side] of back) { const ast = side === 'pre' ? { p: 'l.cat', a: [A2.ast, node.ast] } : { p: 'l.cat', a: [node.ast, A2.ast] }; if (this.tryCand(ast, 'A++B')) return (this.done = true); }
        (this.rem ||= new Map());
        if (pre && this.rem.size < 200000) { const k1 = hstr(hashI(d1)); if (!this.rem.has(k1)) this.rem.set(k1, []); const r = this.rem.get(k1); if (r.length < 4) r.push([node, 'pre']); }
        if (suf && this.rem.size < 200000) { const k2 = hstr(hashI(d2)); if (!this.rem.has(k2)) this.rem.set(k2, []); const r = this.rem.get(k2); if (r.length < 4) r.push([node, 'suf']); }
      }
      if (this.iteOn) this.addMask(v, node, (a, o) => a === o);
      return false;
    }
    return false;
  }
  // node may be a function returning the node (index: built only when the mask is new)
  addMask(v, node, off = 0) { const t = this.t; let lo = 0, hi = 0, n = 0; for (let k = 0; k < this.K; k++) if (v[off + k] === t[k]) { n++; if (k < 32) lo |= 1 << k; else hi |= 1 << (k - 32); } if (n < 2 || this.nm >= 60000) return; let set = this.masks.get(hi); if (!set) this.masks.set(hi, (set = new Set())); if (set.has(lo)) return; set.add(lo); this.mlo[this.nm] = lo; this.mhi[this.nm] = hi; this.mnode.push(typeof node === 'function' ? node() : node); this.nm++; }
  // case split: ite(B, A, C) with A covering the probes where B holds and C the others (held-out acceptance in tryCand)
  iteScan(deadline = Infinity) {
    if (!this.iteOn || this.done) return false;
    const K = this.K; const flo = K >= 32 ? -1 : (1 << K) - 1, fhi = K > 32 ? (K >= 64 ? -1 : (1 << (K - 32)) - 1) : 0;
    const ML = this.nm, mlo = this.mlo, mhi = this.mhi; this.bst ||= [];
    for (let bi = 0; bi < this.bools.length && bi < 4000; bi++) {
      if ((bi & 15) === 0 && Date.now() > deadline) return false;
      let st = this.bst[bi];
      if (!st) { const b = this.bools[bi]; let blo = 0, bhi = 0; for (let k = 0; k < K; k++) if (b.v[k]) { if (k < 32) blo |= 1 << k; else bhi |= 1 << (k - 32); }
        st = this.bst[bi] = { b, blo, bhi, nlo: flo & ~blo, nhi: fhi & ~bhi, A: -1, C: -1, to: 0, dead: false };
        if ((blo === 0 && bhi === 0) || (st.nlo === 0 && st.nhi === 0)) st.dead = true; }
      if (st.dead || st.to >= ML) continue;
      const hadBoth = st.A >= 0 && st.C >= 0;
      const blo = st.blo, bhi = st.bhi, nlo = st.nlo, nhi = st.nhi; let A = st.A, C = st.C;
      for (let j = st.to; j < ML && (A < 0 || C < 0); j++) { const lo = mlo[j], hi = mhi[j];
        if (A < 0 && (lo & blo) === blo && (hi & bhi) === bhi) A = j;
        if (C < 0 && (lo & nlo) === nlo && (hi & nhi) === nhi) C = j; }
      st.A = A; st.C = C; st.to = ML;
      if (!hadBoth && A >= 0 && C >= 0 && A !== C) { this.nIte++; st.dead = true; const ast = { p: this.kind === 'list2num' ? 'g.ite' : 'l.ite', a: [st.b.ast, this.mnode[A].ast, this.mnode[C].ast] }; if (this.tryCand(ast, 'ite')) return (this.done = true); }
    }
    return false;
  }
}

// ---------- verification ----------
const sameOut = (kind, v, w) => (kind === 'list2list' ? Array.isArray(v) && v.length === w.length && v.every((x, i) => x === w[i]) : v === w);
export function makeTask(kind, oracle) {
  // oracle: list -> machine answer (list2num: already &15). Exhaustive answers are computed lazily, once.
  let W = null;
  const want = () => { if (!W) { allLists(); W = ALL.map((l) => oracle([...l])); } return W; };
  const check = (f, lists) => { for (const l of lists) { let v; try { v = f(l, glob(l)); } catch { return l; } if (!sameOut(kind, v, oracle([...l]))) return l; } return null; };
  const exhaustive = (f) => { const w = want(); for (let i = 0; i < ALL.length; i++) { let v; try { v = f(ALL[i], ALLG[i]); } catch { return ALL[i]; } if (!sameOut(kind, v, w[i])) return ALL[i]; } return null; };
  return { kind, oracle, check, exhaustive };
}
export function targetOf(task, PR) { const v = new Int32Array(PR.length); for (let k = 0; k < PR.length; k++) { const o = task.oracle([...PR[k]]); v[k] = task.kind === 'list2list' ? packList(o) : (Number.isInteger(o) ? o : NONINT); } return v; }

// shape class of a task from its examples only (strat-library shape.mjs)
export function shapeOf(kind, ins, outs) {
  if (kind === 'list2num') { const mx = Math.max(...outs); const lenLike = ins.every((l, k) => outs[k] <= l.length); return lenLike ? 'N-count' : mx <= 15 && outs.every((v, k) => v === 0 || ins[k].includes(v)) ? 'N-elem' : 'N-other'; }
  const same = ins.every((l, k) => outs[k].length === l.length);
  const subseq = ins.every((l, k) => { let j = 0; for (const x of l) if (j < outs[k].length && outs[k][j] === x) j++; return j === outs[k].length; });
  const contig = subseq && ins.every((l, k) => { const o = outs[k]; if (!o.length) return true; const s = l.indexOf(o[0]); return o.every((x, j) => l[s + j] === x); });
  return same ? 'L-perm' : contig ? 'L-contig' : subseq ? 'L-subseq' : 'L-other';
}

// ---------- configurations (portfolio): uniform costs, learned prior, learned prior per shape class ----------
export function configsFor(prior, cls) {
  const out = [];
  if (prior && prior.byClass && prior.byClass[cls]) out.push({ name: 'shape:' + cls, costs: new Map(Object.entries(prior.byClass[cls])), lib: prior.lib || [] });
  if (prior && prior.costs) out.push({ name: 'prior', costs: new Map(Object.entries(prior.costs)), lib: prior.lib || [] });
  out.push({ name: 'uni', costs: new Map(), lib: [] });
  return out;
}

// ---------- solve one task: index ⇒ live enumeration ⇒ CEGIS ----------
// opts: {ms, index (loaded index.mjs object or null), prior, say, live:boolean}
export function solveLists(kind, oracle, opts = {}) {
  const { ms = 60000, index = null, prior = null, say = () => {}, live = 'auto', maxRounds = 6, g1 = false } = opts;
  const T0 = Date.now(), deadline = T0 + ms;
  const task = makeTask(kind, oracle);
  const cexs = []; const rejected = []; let found = null; const stats = { cands: 0, heldOutRejects: 0, exhaustRejects: 0, rounds: 0, phase: null };
  const tried = new Set();
  const tryCand = (astOrFn, how) => {
    const ast = typeof astOrFn === 'function' ? astOrFn() : astOrFn;
    const key = show(ast); if (tried.has(key)) return false; tried.add(key); stats.cands++;
    let f; try { f = compile(ast, []); } catch { return false; }
    // held-out acceptance (all candidates; required for the case split) + the counterexamples found so far
    if (task.check(f, heldOut()) || (cexs.length && task.check(f, cexs))) { stats.heldOutRejects++; return false; }
    const bad = task.exhaustive(f);
    if (bad) { stats.exhaustRejects++; cexs.push(bad); rejected.push(key); return false; }
    found = { ast, how, prog: key, size: size(ast) }; return true;
  };
  const cls = shapeOf(kind, PROBES, PROBES.map((l) => oracle([...l])));
  // phase 1: the offline index (fixed probes)
  if (index) {
    stats.phase = 'index';
    const t = targetOf(task, index.probes);
    const extra = opts.delta ? opts.delta.forKind(kind) : null;   // learn.mjs history entries (G0 pass); the G1 pass (indexMatch = matchG1) gets none
    if (opts.indexMatch) opts.indexMatch(kind, t, tryCand, { deadline, extra }); else index.match(kind, t, tryCand, { deadline, extra });
    if (found) return { ok: true, ...found, via: String(found.how).includes('hist') ? 'history' : 'index', ms: Date.now() - T0, cls, cexs: cexs.length, stats };
  } else if (opts.delta) {   // learn.mjs history entries without the offline index: the live matcher on the same probes
    stats.phase = 'history';
    const t = targetOf(task, PROBES); const m = new Matcher(kind, t, (a, how) => tryCand(a, 'hist:' + how));
    const ex = opts.delta.forKind(kind); for (const T of ['B', kind === 'list2num' ? 'N' : 'L']) for (const nd of ex[T]) if (m.feed(T, nd)) break;
    if (!found) m.iteScan(deadline);
    if (found) return { ok: true, ...found, via: 'history', ms: Date.now() - T0, cls, cexs: cexs.length, stats };
  }
  // phase 2: live enumeration (only when there is no index, or the index produced counterexamples, or forced)
  const goLive = live === true || (live === 'auto' && (!index || cexs.length > 0));
  if (!goLive) return { ok: false, via: null, ms: Date.now() - T0, cls, cexs: cexs.length, stats, rejected: rejected.slice(0, 3) };
  const cfgs = configsFor(prior, cls);
  for (let round = 0; round < maxRounds && !found && Date.now() < deadline; round++) {
    stats.rounds++;
    const PR = [...PROBES, ...cexs.slice(0, 24)];
    const ctx = makeCtx(PR); const t = targetOf(task, PR);
    const nc0 = cexs.length;
    for (let ci = 0; ci < cfgs.length && !found && Date.now() < deadline; ci++) {
      const cfg = cfgs[ci]; const left = deadline - Date.now(); const share = ci === cfgs.length - 1 ? left : Math.floor(left / (cfgs.length - ci));
      const m = new Matcher(kind, t, tryCand);
      const dl = Date.now() + share;
      stats.phase = 'live:' + cfg.name;
      enumerate({ ctx, costs: cfg.costs, lib: cfg.lib, deadline: dl, g1,
        onNode: (T, node) => { if (T === 'level') { return m.iteScan(dl) || (cexs.length > nc0 + 2); } return m.feed(T, node) || (cexs.length > nc0 + 2); } });
      if (!found) m.iteScan(dl);
      say(`  live ${cfg.name} round ${round} ${((Date.now() - T0) / 1000).toFixed(1)}s cands ${stats.cands} cex ${cexs.length}`);
      if (cexs.length > nc0) break;   // restart the round with the new counterexamples
    }
    if (cexs.length === nc0) break;   // nothing new to learn from: the round was exhausted without a counterexample
  }
  return found ? { ok: true, ...found, via: stats.phase, ms: Date.now() - T0, cls, cexs: cexs.length, stats } : { ok: false, via: null, ms: Date.now() - T0, cls, cexs: cexs.length, stats, rejected: rejected.slice(0, 3) };
}
