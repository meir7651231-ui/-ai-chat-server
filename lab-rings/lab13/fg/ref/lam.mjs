// lam.mjs - lambda pools for the list DSL (vectorized).
// A lambda is an expression tree over context variables, compiled to a JS closure f(e) where e is an env array.
// Pools are built bottom-up by size with observational equivalence: each entry carries its value vector on a probe
// domain (ints: Float64Array, bools: bitset Uint32Array); dedup by exact vector. Closures are made only for admitted entries.
// Nothing here knows about any task: the grammar is generic arithmetic / comparison / boolean logic over context variables.

export const mk = (s, z, t, f) => ({ s, z, t, f });
const BIN_I = [
  ['+', (a, b) => a + b, true], ['-', (a, b) => a - b, false], ['*', (a, b) => a * b, true],
  ['ad', (a, b) => Math.abs(a - b), true], ['mn', (a, b) => Math.min(a, b), true], ['mx', (a, b) => Math.max(a, b), true],
  ['%', (a, b) => (b > 0 ? ((a % b) + b) % b : 0), false], ['/', (a, b) => (b > 0 ? Math.floor(a / b) : 0), false],
  ['&', (a, b) => a & b, true],
];
const CMP = [['<', (a, b) => a < b], ['<=', (a, b) => a <= b], ['==', (a, b) => a === b], ['!=', (a, b) => a !== b]];
const CMPC = [...CMP, ['>', (a, b) => a > b], ['>=', (a, b) => a >= b]];
function hashF(v) { let h1 = 0x811c9dc5 | 0, h2 = 0x1234567 | 0; for (let i = 0; i < v.length; i++) { const x = v[i] | 0; h1 = Math.imul(h1 ^ x, 16777619); h2 = Math.imul(h2 ^ (x + i), 2246822519); } return (h1 >>> 0) + ':' + (h2 >>> 0); }
const eqV = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; };
// leaves: [{s,z,t,f}] ; dom: env arrays ; opts below
export function buildPool(leaves, dom, opts = {}) {
  const { maxI = 5, maxB = 7, capI = 20000, capB = 40000, consts = [0, 1, 2, 3, 4, 8, 15], cmpConsts = consts, boolOps = true, deadline = Infinity, binOps = BIN_I, andMaxZ = 3, quotaB = {}, quotaI = {} } = opts;
  const D = dom.length, W = (D + 31) >>> 5;
  const blocks = opts.blocks || null;   // [[start,end)] per example: a value constant inside every block is 'global' (same for all elements)
  const isLocal = (v) => { if (!blocks) return true; for (const [s0, e0] of blocks) for (let d = s0 + 1; d < e0; d++) if (v[d] !== v[s0]) return true; return false; };
  const bitAt = (b, d) => (b[d >>> 5] >>> (d & 31)) & 1;
  const isLocalB = (b) => { if (!blocks) return true; for (const [s0, e0] of blocks) { const x = bitAt(b, s0); for (let d = s0 + 1; d < e0; d++) if (bitAt(b, d) !== x) return true; } return false; };
  const seenI = new Map(), seenB = new Map();
  const I = [], B = []; let nI = 0, nB = 0;
  const admitI = (s, z, v, mkf, ex) => { for (let i = 0; i < D; i++) if (!Number.isFinite(v[i]) || Math.abs(v[i]) > 1e6) return false;
    const h = 'i' + hashF(v); const L = seenI.get(h); if (L && L.some((u) => eqV(u.v, v))) return false;
    const n = { s, z, t: 'i', v, f: mkf(), loc: isLocal(v), e: ex }; (I[z] ||= []).push(n); if (L) L.push(n); else seenI.set(h, [n]); nI++; return true; };
  const zcount = []; const admitB = (s, z, bits, mkf, ex) => { if ((quotaB[z] ?? Infinity) <= (zcount[z] || 0)) return false; if (!isLocalB(bits)) return false;
    const h = hashF(bits); const L = seenB.get(h); if (L && L.some((u) => eqV(u.v, bits))) return false;
    const n = { s, z, t: 'b', v: bits, f: mkf(), e: ex }; (B[z] ||= []).push(n); if (L) L.push(n); else seenB.set(h, [n]); nB++; zcount[z] = (zcount[z] || 0) + 1; return true; };
  const vecOf = (f) => { const v = new Float64Array(D); for (let d = 0; d < D; d++) { const x = f(dom[d]); v[d] = x === true ? 1 : x === false ? 0 : x; } return v; };
  const bitsOf = (f) => { const b = new Uint32Array(W); for (let d = 0; d < D; d++) if (f(dom[d])) b[d >>> 5] |= 1 << (d & 31); return b; };
  for (const L of leaves) { if (L.t === 'b') admitB(L.s, L.z, bitsOf(L.f), () => L.f, L.e || { leaf: L.s }); else admitI(L.s, L.z, vecOf(L.f), () => L.f, L.e || { leaf: L.s }); }
  for (const c of consts) { const v = new Float64Array(D).fill(c); admitI(String(c), 1, v, () => () => c, { c }); }
  const maxZ = Math.max(maxI, maxB);
  const tmp = new Float64Array(D);
  for (let z = 2; z <= maxZ; z++) {
    if (Date.now() > deadline) break;
    if (z <= maxI) {
      // fair share: every (left size, right size) split and every operator gets its part of this size's quota
      const splits = z - 2, zq = Math.min(capI - nI, quotaI[z] ?? Infinity);
      for (let za = 1; za <= z - 2 && nI < capI; za++) { const zb = z - 1 - za; const A = I[za] || [], Bb = I[zb] || [];
        for (const [o, op, comm] of binOps) { if (nI >= capI) break; const lim = nI + Math.ceil(zq / splits / binOps.length);
          for (let ia = 0; ia < A.length && nI < lim; ia++) { const a = A[ia], va = a.v;
            for (let ib = 0; ib < Bb.length; ib++) { const b = Bb[ib]; if (comm && za === zb && ib < ia) continue; if (a === b && o !== '+' && o !== '*') continue;
              const vb = b.v; const v = new Float64Array(D); for (let d = 0; d < D; d++) v[d] = op(va[d], vb[d]);
              const fa = a.f, fb = b.f; admitI(`(${a.s}${o}${b.s})`, z, v, () => (e) => op(fa(e), fb(e)), { op: o, a: a.e, b: b.e }); if (nI >= lim) break; } } } }
    }
    if (z <= maxB && nB < capB) {
      let fam = 0, famCap = Infinity; const startFam = (share) => { fam = zcount[z] || 0; famCap = fam + Math.ceil((quotaB[z] ?? Infinity) * share); };
      const full = () => nB >= capB || (zcount[z] || 0) >= (quotaB[z] ?? Infinity) || (zcount[z] || 0) >= famCap;
      // int ⋈ int
      startFam(0.4);
      for (let za = 1; za <= z - 2 && !full(); za++) { const zb = z - 1 - za; const A = I[za] || [], Bb = I[zb] || [];
        for (const [o, op] of CMP) { if (full()) break; for (const a of A) { if (full()) break; const va = a.v, fa = a.f;
          for (const b of Bb) { if (a === b || (!a.loc && !b.loc)) continue; const vb = b.v, fb = b.f; const bits = new Uint32Array(W); for (let d = 0; d < D; d++) if (op(va[d], vb[d])) bits[d >>> 5] |= 1 << (d & 31); admitB(`(${a.s}${o}${b.s})`, z, bits, () => (e) => op(fa(e), fb(e)), { op: o, a: a.e, b: b.e }); } } } }
      // not
      startFam(0.1);
      if (boolOps) for (const a of B[z - 1] || []) { if (full()) break; const bits = new Uint32Array(W); for (let w = 0; w < W; w++) bits[w] = ~a.v[w]; if (D & 31) bits[W - 1] &= (1 << (D & 31)) - 1; const fa = a.f; admitB(`!${a.s}`, z, bits, () => (e) => !fa(e), { op: '!', a: a.e }); }
      // int ⋈ const (size a+2); wide constants only for small ints
      startFam(0.25);
      { const CC = z - 2 <= 3 ? cmpConsts : cmpConsts.filter((c) => c <= 16);
        for (const a of I[z - 2] || []) { if (full()) break; if (!a.loc) continue; const va = a.v, fa = a.f;
          for (const c of CC) for (const [o, op] of CMPC) { const bits = new Uint32Array(W); for (let d = 0; d < D; d++) if (op(va[d], c)) bits[d >>> 5] |= 1 << (d & 31); admitB(`(${a.s}${o}${c})`, z, bits, () => (e) => op(fa(e), c), { op: o, a: a.e, b: { c } }); } } }
      if (boolOps) { startFam(1);
        const pri = (L) => [...L].sort((a, b) => (/\d/.test(b.s) ? 1 : 0) - (/\d/.test(a.s) ? 1 : 0));   // threshold atoms first
        for (let za = 1; za <= z - 2 && za <= andMaxZ && !full(); za++) { const zb = z - 1 - za; if (zb < za || zb > andMaxZ) continue; const A2 = pri(B[za] || []), B2 = pri(B[zb] || []);
          for (let ia = 0; ia < A2.length && !full(); ia++) { const a = A2[ia], fa = a.f, xa = a.v;
            for (let ib = 0; ib < B2.length; ib++) { if (za === zb && ib <= ia) continue; const b = B2[ib], fb = b.f, xb = b.v;
              const and = new Uint32Array(W), or = new Uint32Array(W), xn = new Uint32Array(W);
              for (let w = 0; w < W; w++) { and[w] = xa[w] & xb[w]; or[w] = xa[w] | xb[w]; xn[w] = ~(xa[w] ^ xb[w]); }
              if (D & 31) xn[W - 1] &= (1 << (D & 31)) - 1;
              admitB(`(${a.s}&&${b.s})`, z, and, () => (e) => fa(e) && fb(e), { op: '&&', a: a.e, b: b.e });
              admitB(`(${a.s}||${b.s})`, z, or, () => (e) => fa(e) || fb(e), { op: '||', a: a.e, b: b.e });
              admitB(`(${a.s}==${b.s})`, z, xn, () => (e) => fa(e) === fb(e), { op: 'xnor', a: a.e, b: b.e });
              if (full()) break; } } }
      }
    }
  }
  const flat = (arr) => arr.flatMap((x) => x || []);
  return { I: flat(I), B: flat(B), Iz: I, Bz: B, D };
}
