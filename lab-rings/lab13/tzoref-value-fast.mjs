// Fast exact search core for valueBuild (tzoref-value.mjs).
// Same enumeration as the original search block, in the same order, with the same tie-breaks and the same stopping points:
//   - values are byte vectors (one byte per example) kept in one growing arena (Uint8Array) instead of one Uint8Array + one
//     latin1 string key + one object per value;
//   - "seen" and "wanted" (TGT) are open-addressing hash sets over the arena (hash + byte compare) instead of Map<string>;
//   - expressions are kept as integer nodes (op, a, b, c per value id) and materialised as the same objects only for the result;
//   - closeness, cover masks and inverse tables use typed arrays (no Map / BigInt in the inner loops).
// The time checks happen at exactly the places where the original code checks Date.now()-t0>ms, through clock() (vclock.mjs).
// Proof of equality: vprobe/value-equiv.mjs runs the original block and this one on the same seeded examples and compares
// the result expression, the number of stored values and the final program.
import { tick, vnow, stats as VSTATS, PERVAL as PERVAL_ } from './vclock.mjs'; import { performance } from 'perf_hooks';

const HASH0 = 0x811c9dc5 | 0;

// INV tables depend only on the table contents: cache them per table content (key = k + bytes)
const INVCACHE = new Map();
function invOf(tb) {
  const key = tb.k + ':' + Buffer.from(tb.T).toString('latin1'); let I = INVCACHE.get(key); if (I !== undefined) return I;
  if (tb.k === 2) { I = new Int16Array(512).fill(-1); const T = tb.T;
    for (let x = 0; x < 16; x++) for (let w = 0; w < 16; w++) { let y = -1, n = 0; for (let c = 0; c < 16; c++) if (T[x * 16 + c] === w) { y = c; n++; } I[x * 16 + w] = n === 1 ? y : -1;
      let y2 = -1, n2 = 0; for (let c = 0; c < 16; c++) if (T[c * 16 + x] === w) { y2 = c; n2++; } I[256 + x * 16 + w] = n2 === 1 ? y2 : -1; } }
  else if (tb.k === 1) { I = new Int16Array(16).fill(-1); const T = tb.T; for (let w = 0; w < 16; w++) { let y = -1, n = 0; for (let z = 0; z < 16; z++) if (T[z] === w) { y = z; n++; } I[w] = n === 1 ? y : -1; } }
  else I = null;
  if (INVCACHE.size > 20000) INVCACHE.clear(); INVCACHE.set(key, I); return I; }

const popc32 = x => { x = x - ((x >>> 1) & 0x55555555); x = (x & 0x33333333) + ((x >>> 2) & 0x33333333); return (((x + (x >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24; };

// opts: TB (tables, in order), ex (examples), ins, maxSize, maxBank, ms, keep, t0 (vnow() at valueBuild start), coverFns ([[name,ge],...]),
//       nocover, heapCap (VBHEAP bytes), counters (optional object: step counts for the virtual clock)
export function fastSearch(o) {
  const { TB, ex, ins, maxSize, maxBank, ms, keep, t0, coverFns, nocover, heapCap } = o;
  const NN = ex.length; const STR = (NN + 3) & ~3, W4 = STR >>> 2;   // each vector padded to whole 32-bit words (padding bytes stay 0)
  const want = new Uint8Array(STR); for (let e = 0; e < NN; e++) want[e] = ex[e].want & 15; const want32 = new Uint32Array(want.buffer);
  // tables: typed copies, index by position in TB
  const nT = TB.length, TK = new Int8Array(nT), TF = new Array(nT), TN = TB.map(t => t.name), TI = new Array(nT);
  for (let i = 0; i < nT; i++) { const t = TB[i]; TK[i] = t.k; TF[i] = Uint8Array.from(t.T); TI[i] = (t.k === 1 || t.k === 2) ? invOf({ k: t.k, T: TF[i] }) : null; }
  // ---- value arena ----
  let cap = 1 << 14; let A = new Uint8Array(cap * STR), A32 = new Uint32Array(A.buffer); let OP = new Int16Array(cap), VA = new Int32Array(cap), VB = new Int32Array(cap), VC = new Int32Array(cap), LV = new Uint8Array(cap);
  let made = 0;   // = number of stored values = seen.size
  const grow = () => { const nc = cap * 2; const A2 = new Uint8Array(nc * STR); A2.set(A); A = A2; A32 = new Uint32Array(A.buffer); const g = (X, C) => { const Y = new C(nc); Y.set(X); return Y; };
    OP = g(OP, Int16Array); VA = g(VA, Int32Array); VB = g(VB, Int32Array); VC = g(VC, Int32Array); LV = g(LV, Uint8Array); cap = nc; };
  // ---- seen: open addressing over value ids ----
  // slots interleave [id+1, hash] so that a probe touches one cache line
  let smask = (1 << 15) - 1; let ST = new Int32Array(2 * (smask + 1));
  const sRehash = () => { const n = (smask + 1) * 2; const T2 = new Int32Array(2 * n); const m = n - 1;
    for (let j = 0; j <= smask; j++) { const v = ST[2 * j]; if (v === 0) continue; const h = ST[2 * j + 1]; let i = h & m; while (T2[2 * i] !== 0) i = (i + 1) & m; T2[2 * i] = v; T2[2 * i + 1] = h; } ST = T2; smask = m; };
  const buf = new Uint8Array(STR), B32 = new Uint32Array(buf.buffer);   // candidate vector
  // find id of buf (hash h) in seen, -1 if absent
  const sFind = (h) => { let i = h & smask; for (;;) { const s = ST[2 * i]; if (s === 0) return -1; if (ST[2 * i + 1] === h) { const id = s - 1; const off = id * W4; let w = 0; for (; w < W4; w++) if (A32[off + w] !== B32[w]) break; if (w === W4) return id; } i = (i + 1) & smask; } };
  // ---- TGT: wanted vectors ----
  let tcap = 1 << 10, tn = 0; let TA = new Uint8Array(tcap * STR), TA32 = new Uint32Array(TA.buffer), THS = new Int32Array(tcap), TFN = new Int32Array(tcap), TKK = new Int8Array(tcap), TX = new Int32Array(tcap), TSD = new Int8Array(tcap);
  let tmask = (1 << 11) - 1; let TT = new Int32Array(tmask + 1);
  const tGrow = () => { const nc = tcap * 2; const A2 = new Uint8Array(nc * STR); A2.set(TA); TA = A2; TA32 = new Uint32Array(TA.buffer); const g = (X, C) => { const Y = new C(nc); Y.set(X); return Y; }; THS = g(THS, Int32Array); TFN = g(TFN, Int32Array); TKK = g(TKK, Int8Array); TX = g(TX, Int32Array); TSD = g(TSD, Int8Array); tcap = nc; };
  const tRehash = () => { const n = (tmask + 1) * 2; const T2 = new Int32Array(n); const m = n - 1; for (let id = 0; id < tn; id++) { let i = THS[id] & m; while (T2[i] !== 0) i = (i + 1) & m; T2[i] = id + 1; } TT = T2; tmask = m; };
  const tFind = (V32, h) => { let i = h & tmask; for (;;) { const s = TT[i]; if (s === 0) return -1; const id = s - 1; if (THS[id] === h) { const off = id * W4; let w = 0; for (; w < W4; w++) if (TA32[off + w] !== V32[w]) break; if (w === W4) return id; } i = (i + 1) & tmask; } };
  const tAdd = (V, h, f, k, x, side) => { if (tn >= tcap) tGrow(); const id = tn++; TA.set(V, id * STR); THS[id] = h; TFN[id] = f; TKK[id] = k; TX[id] = x; TSD[id] = side; let i = h & tmask; while (TT[i] !== 0) i = (i + 1) & tmask; TT[i] = id + 1; if (tn * 2 > tmask) tRehash(); };
  // hash of a padded vector, over its 32-bit words: two independent multiply lanes + murmur3 finaliser
  const hashW = V32 => { let h1 = HASH0, h2 = 0x7f4a7c15; let w = 0; for (; w + 1 < W4; w += 2) { h1 = Math.imul(h1 ^ V32[w], 0x9E3779B1); h2 = Math.imul(h2 ^ V32[w + 1], 0x85EBCA77); } if (w < W4) h1 = Math.imul(h1 ^ V32[w], 0x9E3779B1);
    let h = h1 ^ ((h2 << 13) | (h2 >>> 19)); h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); return h ^ (h >>> 16); };
  const wh = hashW(want32); const isWant = () => { for (let w = 0; w < W4; w++) if (B32[w] !== want32[w]) return false; return true; };
  // ---- expressions ----
  // value id -> expression object (same shapes as the original: {cell} | {f,k:1,a} | {f,k:2,a,b} | {f,k:3,a,b,c}); shared subtrees
  const EX = new Map();
  const exprOf = id => { let e = EX.get(id); if (e) return e; const op = OP[id];
    if (op < 0) e = { cell: VA[id] }; else { const k = TK[op]; e = k === 1 ? { f: TN[op], k: 1, a: exprOf(VA[id]) } : k === 3 ? { f: TN[op], k: 3, a: exprOf(VA[id]), b: exprOf(VB[id]), c: exprOf(VC[id]) } : { f: TN[op], k: 2, a: exprOf(VA[id]), b: exprOf(VB[id]) }; }
    EX.set(id, e); return e; };
  // a candidate that is not stored (op,a,b,c) -> expression object
  const exprNew = (op, a, b, c) => { const k = TK[op]; return k === 1 ? { f: TN[op], k: 1, a: exprOf(a) } : k === 3 ? { f: TN[op], k: 3, a: exprOf(a), b: exprOf(b), c: exprOf(c) } : { f: TN[op], k: 2, a: exprOf(a), b: exprOf(b) }; };
  // found: either an expression object, or null
  let found = null;
  // ---- counters for the virtual clock (cost model of the original engine, vclock.mjs) ----
  const C = o.counters || {};
  for (const k of ['ev1', 'ev2', 'ev3', 'addNew', 'addDup', 'addFull', 'inv', 'invKey', 'cover', 'coverD', 'close', 'pair', 'trip', 'sortN', 'sortNL', 'csortNL']) C[k] = C[k] || 0;
  C.NN = NN; C.made = 0; tick(C); const M0 = VSTATS.model;
  // ---- heap model: the original stored every value as JS objects on the heap and stopped storing when the heap passed VBHEAP.
  //      Here values live off-heap, so the heap check adds the bytes the original would have used per stored value.
  let nAdd = 0, heapFull = false;
  const PERVAL = PERVAL_(NN);   // heap bytes per stored value in the original engine (measured on the original: 340-450 B at NN=96)
  // ---- add(candidate in buf, h) ----
  // store: op,a,b,c,level. Mirrors the original add() exactly (order of checks included).
  const add = (h, op, a, b, c, s) => {
    const sid = sFind(h); if (sid >= 0) { C.addDup++; return; }
    if (found === null && tn > 0) { const ti = tFind(B32, h); if (ti >= 0) { const k = TKK[ti], f = TFN[ti];
        const ex1 = op === -1 ? { cell: a } : exprNew(op, a, b, c);
        found = k === 1 ? { f: TN[f], k: 1, a: ex1 } : TSD[ti] ? { f: TN[f], k: 2, a: ex1, b: exprOf(TX[ti]) } : { f: TN[f], k: 2, a: exprOf(TX[ti]), b: ex1 }; } }
    if ((++nAdd & 65535) === 0 && !heapFull && process.memoryUsage().heapUsed + made * PERVAL > heapCap) heapFull = true;
    if (made > maxBank || heapFull) { C.addFull++; if (h === wh && isWant()) found = op === -1 ? { cell: a } : exprNew(op, a, b, c); return; }
    if (made >= cap) grow(); const id = made++; A.set(buf, id * STR); OP[id] = op; VA[id] = a; VB[id] = b; VC[id] = c; LV[id] = s;
    let i = h & smask; while (ST[2 * i] !== 0) i = (i + 1) & smask; ST[2 * i] = id + 1; ST[2 * i + 1] = h; if (made * 2 > smask) sRehash();
    C.addNew++; bySize[s].push(id); if (h === wh && isWant()) found = exprOf(id); };
  const bySize = [];
  bySize[0] = [];
  for (const c of ins) { for (let e = 0; e < NN; e++) buf[e] = ex[e].mem[c] & 15; add(hashW(B32), -1, c, -1, -1, 0); }
  // close(v): number of examples equal to the answer + half the number of (v,answer) pairs that never occur
  const stamp = new Int32Array(256); let stampN = 0;
  const close = id => { C.close++; stampN++; let eq = 0, joint = 0; const off = id * STR; for (let e = 0; e < NN; e++) { const v = A[off + e], w = want[e]; if (v === w) eq++; const k = v * 16 + w; if (stamp[k] !== stampN) { stamp[k] = stampN; joint++; } } return eq + 0.5 * (NN - joint); };
  const isConst = id => { const off = id * STR, v0 = A[off]; for (let e = 1; e < NN; e++) if (A[off + e] !== v0) return false; return true; };
  // sort ids by score desc, stable (same as [score,x].sort((a,b)=>b[0]-a[0]) on an array in this order)
  const NL = n => n * Math.log2(Math.max(n, 2));
  // the first k ids of L in the order of a stable sort by close() descending (= the original's [close,x].sort(...).slice(0,k)).
  // 2*close is an integer in [0, 3*NN], so a counting sort gives exactly that order in O(n).
  const close2 = id => { stampN++; let eq = 0, joint = 0; const off = id * STR; for (let e = 0; e < NN; e++) { const v = A[off + e], w = want[e]; if (v === w) eq++; const k = v * 16 + w; if (stamp[k] !== stampN) { stamp[k] = stampN; joint++; } } return 2 * eq + NN - joint; };
  const topByClose = (L, k) => { const n = L.length; C.sortN += n; C.sortNL += NL(n); C.close += n; const KM = 3 * NN; const key = new Int32Array(n), start = new Int32Array(KM + 2);
    for (let i = 0; i < n; i++) { const kk = close2(L[i]); key[i] = kk; start[kk]++; }
    let run = 0; for (let kk = KM; kk >= 0; kk--) { const c = start[kk]; start[kk] = run; run += c; }
    const m = Math.min(k, n), out = new Array(m); for (let i = 0; i < n; i++) { const pos = start[key[i]]++; if (pos < m) out[pos] = L[i]; } return out; };
  const clock = () => { C.made = made; tick(C); return vnow() - t0 > ms; };
  // ---- tryInv ----
  const need = new Uint8Array(STR), N32 = new Uint32Array(need.buffer);
  const tryInv = lim => { if (found) return; let ninv = 0; try { tryInv0(lim, c => { ninv += c; }); } finally { C.inv += ninv; } };
  const tryInv0 = (lim, cnt) => { let ni = 0;
    for (let ti = 0; ti < nT; ti++) { const I = TI[ti]; if (!I) continue;
      if (TK[ti] === 1) { let ok = true; for (let e = 0; e < NN; e++) { ni++; const y = I[want[e]]; if (y < 0) { ok = false; break; } need[e] = y; }
        if (ok) { C.invKey++; const h = hashW(N32); buf.set(need); const sid = sFind(h); if (sid >= 0) { found = { f: TN[ti], k: 1, a: exprOf(sid) }; cnt(ni); return; } if (tFind(N32, h) < 0) tAdd(need, h, ti, 1, -1, 0); }
        continue; }
      for (let sa = 0; sa < bySize.length; sa++) { const L = bySize[sa] || []; const n = Math.min(L.length, lim);
        for (let xi = 0; xi < n; xi++) { const x = L[xi], xo = x * STR; for (let side = 0; side <= 1; side++) { let ok = true; const base = side * 256;
            for (let e = 0; e < NN; e++) { ni++; const y = I[base + A[xo + e] * 16 + want[e]]; if (y < 0) { ok = false; break; } need[e] = y; }
            if (!ok) continue; C.invKey++; const h = hashW(N32); buf.set(need); const sid = sFind(h);
            if (sid >= 0) { found = side ? { f: TN[ti], k: 2, a: exprOf(sid), b: exprOf(x) } : { f: TN[ti], k: 2, a: exprOf(x), b: exprOf(sid) }; cnt(ni); return; }
            if (tn < 400000 && tFind(N32, h) < 0) tAdd(need, h, ti, 2, x, side); } } } }
    cnt(ni); };
  // ---- tryCover ----
  const W32 = (NN + 31) >>> 5;
  const tryCover = () => { if (found || nocover) return;
    for (const [fn, ge] of coverFns) { if (!TN.includes(fn)) continue;
      const DM = [], DI = [], DP = [];   // masks (Uint32Array), ids, popcounts
      const m = new Uint32Array(W32); let nsc = 0;
      for (let id = 0; id < made; id++) { nsc++; const off = id * STR; let ok = true; m.fill(0); let any = false;
        for (let e = 0; e < NN; e++) { const v = A[off + e], w = want[e]; if (ge ? v < w : v > w) { ok = false; break; } if (v === w) { m[e >>> 5] |= 1 << (e & 31); any = true; } }
        if (ok && any) { C.coverD++; DM.push(m.slice()); DI.push(id); let p = 0; for (let j = 0; j < W32; j++) p += popc32(m[j]); DP.push(p); } if (DM.length > 200000) break; }
      C.cover += nsc;
      if (!DM.length) continue;
      const full = new Uint32Array(W32); for (let e = 0; e < NN; e++) full[e >>> 5] |= 1 << (e & 31);
      // first 400 of the stable sort by (popcount desc, level asc) - counting sort on the composite key
      const n = DM.length; C.sortN += n; C.csortNL += NL(n); const LM = maxSize + 1; const KM = (NN + 1) * LM; const start = new Int32Array(KM + 1), key = new Int32Array(n);
      for (let i = 0; i < n; i++) { const kk = (NN - DP[i]) * LM + LV[DI[i]]; key[i] = kk; start[kk]++; }
      let run = 0; for (let kk = 0; kk <= KM; kk++) { const c = start[kk]; start[kk] = run; run += c; }
      const T = Math.min(400, n), top = new Array(T); for (let i = 0; i < n; i++) { const pos = start[key[i]]++; if (pos < T) top[pos] = i; }
      const isFull = (a, b, c) => { for (let j = 0; j < W32; j++) { const v = (a[j] | (b ? b[j] : 0) | (c ? c[j] : 0)) >>> 0; if (v !== full[j] >>> 0) return false; } return true; };
      for (const a of top) if (isFull(DM[a])) { found = exprOf(DI[a]); return; }
      for (let i = 0; i < T && !found; i++) for (let j = i + 1; j < T; j++) { C.pair++; if (isFull(DM[top[i]], DM[top[j]])) { found = { f: fn, k: 2, a: exprOf(DI[top[i]]), b: exprOf(DI[top[j]]) }; return; } }
      const T1 = Math.min(T, 150); const mij = new Uint32Array(W32);
      for (let i = 0; i < T1 && !found; i++) for (let j = i + 1; j < T1; j++) { const mi = DM[top[i]], mj = DM[top[j]]; for (let w = 0; w < W32; w++) mij[w] = mi[w] | mj[w];
        for (let l = j + 1; l < T; l++) { C.trip++; if (isFull(mij, DM[top[l]])) { found = { f: fn, k: 2, a: { f: fn, k: 2, a: exprOf(DI[top[i]]), b: exprOf(DI[top[j]]) }, b: exprOf(DI[top[l]]) }; return; } } } } };
  // ---- the level loop (same structure and checks as the original) ----
  const P16 = new Uint16Array(STR);   // partial table index for a fixed first (and second) argument
  const topCache = new WeakMap();
  const top120 = L => { if (L.length <= 120) return L; let t = topCache.get(L); if (!t) { t = topByClose(L, 120); topCache.set(L, t); } return t; };
  const TR = process.env.VTRACE ? (m => { C.made = made; tick(C); console.log(`  [fast] v=${((vnow() - t0) / 1000).toFixed(1)}s real=${((performance.now() - R0) / 1000).toFixed(1)}s ${m} made=${made} tgt=${tn} sizes=${bySize.map(x => x ? x.length : 0).join('/')}`); }) : null; const R0 = performance.now(); const setupMs = vnow() - t0;
  if (TR) TR('start NN=' + NN + ' TB=' + nT);
  for (let s = 1; s <= maxSize && !found; s++) { if (TR) TR('level ' + s);
    if (s >= 3) tryCover(); if (found) break; tryInv(3000); if (found) break;
    if (s >= 3 && bySize[s - 1] && bySize[s - 1].length > keep) { const L = bySize[s - 1]; const Cn = L.filter(isConst); const nc = L.filter(x => !isConst(x)); bySize[s - 1] = [...Cn, ...topByClose(nc, keep)]; }
    if (!bySize[s]) bySize[s] = [];
    for (let ti = 0; ti < nT; ti++) { if (found || clock()) break; const F = TF[ti], k = TK[ti];
      if (k === 1) { const L = bySize[s - 1] || []; for (let xi = 0; xi < L.length; xi++) { const x = L[xi], xo = x * STR; for (let e = 0; e < NN; e++) buf[e] = F[A[xo + e]]; C.ev1++; add(hashW(B32), ti, x, -1, -1, s); if (found) break; } }
      else if (k === 3) { for (let sa = 0; sa <= s - 1 && !found; sa++) for (let sb = 0; sa + sb <= s - 1 && !found; sb++) { const sc = s - 1 - sa - sb; let LA = bySize[sa] || [], LB = bySize[sb] || [], LC = bySize[sc] || [];
          if (LA.length * LB.length * LC.length > 2e6) { LA = top120(LA); LB = top120(LB); LC = top120(LC); }
          for (let ia = 0; ia < LA.length; ia++) { if (found) break; const x = LA[ia], xo = x * STR; for (let ib = 0; ib < LB.length; ib++) { if (found) break; const y = LB[ib]; if (x === y) continue; const yo = y * STR; for (let e = 0; e < NN; e++) P16[e] = (A[xo + e] << 8) | (A[yo + e] << 4);
              for (let ic = 0; ic < LC.length; ic++) { const z = LC[ic]; if (z === x || z === y) continue; const zo = z * STR;
                for (let e = 0; e < NN; e++) buf[e] = F[P16[e] | A[zo + e]];
                C.ev3++; add(hashW(B32), ti, x, y, z, s); if (found) break; } } } } }
      else { for (let sa = 0; sa <= s - 1 && !found; sa++) { const sb = s - 1 - sa; const LA = bySize[sa] || [], LB = bySize[sb] || [];
          for (let ia = 0; ia < LA.length; ia++) { if (found) break; const x = LA[ia], xo = x * STR; for (let e = 0; e < NN; e++) P16[e] = A[xo + e] << 4;
            for (let ib = 0; ib < LB.length; ib++) { const y = LB[ib]; if (x === y) continue; const yo = y * STR;
              for (let e = 0; e < NN; e++) buf[e] = F[P16[e] | A[yo + e]];
              C.ev2++; add(hashW(B32), ti, x, y, -1, s); if (found) break; }
            if (clock()) break; } } } }
  }
  if (TR) TR('loop end found=' + !!found);
  if (!found) tryInv(20000);
  if (!found) tryCover();
  C.made = made; tick(C); if (TR) TR('end found=' + !!found);
  if (PROF) { PROF.calls++; PROF.setup += setupMs; PROF.real += performance.now() - R0; PROF.model += VSTATS.model - M0; if (found) PROF.found++; }
  return { found, made }; }
// VPROF=1: totals per process (calls, setup ms before the search, real ms in the search, modelled ms of the original engine)
export const PROF = process.env.VPROF ? { calls: 0, found: 0, setup: 0, real: 0, model: 0 } : null;
