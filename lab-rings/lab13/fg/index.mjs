// fg/index.mjs - the offline "dream" index of grammar G0: signature -> AST.
// The shared enumerator runs once per configuration (uniform costs, learned prior, prior per shape class) on the
// machine's fixed probe lists; every N / L / B node it keeps is stored with its values on the probes and its AST.
// Nothing here depends on a task. At solve time a task's outputs on the same probes are hashed and looked up:
//   direct hit, m16 / cap views, meet-in-the-middle (A±B, m16(A±B), A++B) and the case split ite(B,A,C).
// usage:
//   node fg/index.mjs build <part.bin> <uni|prior|shape:CLS> <prior.json|-> <secs>
//   node fg/index.mjs merge <index.bin> <part.bin ...>
//   node fg/index.mjs info <index.bin>
import fs from 'fs';
import { show, parse, size, P } from './grammar.mjs';
import { PROBES, makeCtx, enumerate, hashI, Matcher, configsFor } from './search.mjs';
const hstrI = (h) => (h[0] >>> 0).toString(36) + ':' + (h[1] >>> 0).toString(36);

const MAGIC = 'FGIX1';
const v16 = (x) => (x === BIG ? 99 : x & 15), vcap = (x) => (x === BIG ? 99 : Math.min(15, x));
const NONINT = -0x7fffff01, BIG = -32768;   // N values are stored as Int16; anything outside +-32000 becomes BIG
const clamp16 = (x) => (x === NONINT || x > 32000 || x < -32000 ? BIG : x);

// ---------- file format: MAGIC | u32 header length | header JSON | 8-aligned sections ----------
function writeBin(file, header, sections) {
  const parts = []; let off = 0; const secs = {};
  for (const [name, arr] of Object.entries(sections)) {
    const buf = typeof arr === 'string' ? Buffer.from(arr, 'utf8') : Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
    secs[name] = { off, len: buf.length, type: typeof arr === 'string' ? 'str' : arr.constructor.name };
    parts.push(buf); const pad = (8 - (buf.length % 8)) % 8; if (pad) parts.push(Buffer.alloc(pad)); off += buf.length + pad;
  }
  const hj = Buffer.from(JSON.stringify({ ...header, secs }), 'utf8'); const hl = Buffer.alloc(4); hl.writeUInt32LE(hj.length);
  const pre = Buffer.concat([Buffer.from(MAGIC), hl, hj]); const pad0 = Buffer.alloc((8 - (pre.length % 8)) % 8);
  const tmp = file + '.tmp'; fs.writeFileSync(tmp, Buffer.concat([pre, pad0, ...parts])); fs.renameSync(tmp, file);
}
function readBin(file) {
  const raw = fs.readFileSync(file); if (raw.slice(0, 5).toString() !== MAGIC) throw new Error('bad index file ' + file);
  const hl = raw.readUInt32LE(5); const header = JSON.parse(raw.slice(9, 9 + hl).toString('utf8'));
  let base = 9 + hl; base += (8 - (base % 8)) % 8;
  const ab = new ArrayBuffer(raw.length - base); new Uint8Array(ab).set(raw.subarray(base));
  const out = {};
  for (const [name, s] of Object.entries(header.secs)) {
    if (s.type === 'str') out[name] = Buffer.from(ab, s.off, s.len).toString('utf8');
    else { const C = { Int32Array, Int16Array, Uint32Array, Uint8Array, Uint16Array }[s.type]; out[name] = new C(ab, s.off, s.len / C.BYTES_PER_ELEMENT); }
  }
  return { header, sec: out };
}

// ---------- build one part ----------
// G1: with g1 = true the enumeration uses the G1 productions too and the part keeps only nodes whose AST uses one of them
// (the G0 index already holds every pure-G0 node; the stage looks there first).
const G1NAMES = new Set(P.filter((p) => p.tag === 'g1').map((p) => p.name));
const usesG1 = (t) => G1NAMES.has(t.p) || (t.a || []).some(usesG1);
export function buildPart(file, cfgName, prior, secs, { log = true, g1 = false } = {}) {
  const cfg = cfgName === 'uni' ? { name: 'uni', costs: new Map(), lib: [] } : configsFor(prior, cfgName.startsWith('shape:') ? cfgName.slice(6) : null).find((c) => c.name === cfgName);
  if (!cfg) throw new Error('no config ' + cfgName);
  const ctx = makeCtx(PROBES); const K = PROBES.length;
  const acc = { N: [], L: [], B: [] };
  // FG_HEAPSTOP (MB): stop the enumeration cleanly when the heap grows past it (long uniform builds), and keep what was made
  const heapStop = +process.env.FG_HEAPSTOP || 0; let nn = 0, stoppedByHeap = false;
  const st = enumerate({ ctx, costs: cfg.costs, lib: cfg.lib, timeMs: secs * 1000, log, g1,
    onNode: (T, node) => { if (T === 'level') return false; if (!node.v) return false; if (g1 && !usesG1(node.ast)) return false; acc[T].push([node.v, show(node.ast), node.c]);
      if (heapStop && (++nn & 8191) === 0 && process.memoryUsage().heapUsed > heapStop * 1e6) { stoppedByHeap = true; return true; } return false; } });
  if (stoppedByHeap) st.stoppedByHeap = true;
  const sections = {};
  for (const T of ['N', 'L', 'B']) {
    const n = acc[T].length; const V = T === 'B' ? new Uint8Array(n * K) : T === 'N' ? new Int16Array(n * K) : new Int32Array(n * K); const C = new Uint16Array(n);
    acc[T].forEach(([v, , c], i) => { if (T === 'N') for (let k = 0; k < K; k++) V[i * K + k] = clamp16(v[k]); else V.set(v, i * K); C[i] = c; });
    sections[T + 'v'] = V; sections[T + 'c'] = C; sections[T + 'a'] = acc[T].map((x) => x[1]).join('\n');
  }
  writeBin(file, { kind: 'part', cfg: cfgName, g1, K, secs, made: st.made, lastCost: st.lastCost, counts: { N: acc.N.length, L: acc.L.length, B: acc.B.length } }, sections);
  return { ...st, counts: { N: acc.N.length, L: acc.L.length, B: acc.B.length } };
}

// ---------- merge parts into the index (dedup by values, smallest AST first, sorted hash tables) ----------
export function merge(out, parts) {
  const K = PROBES.length; const ent = { N: new Map(), L: new Map(), B: new Map() };
  for (const p of parts) {
    const { header, sec } = readBin(p); if (header.K !== K) throw new Error('K mismatch');
    for (const T of ['N', 'L', 'B']) {
      const V = sec[T + 'v'], C = sec[T + 'c'], A = sec[T + 'a'] ? sec[T + 'a'].split('\n') : [];
      for (let i = 0; i < C.length; i++) {
        let v = V.slice(i * K, (i + 1) * K); if (T === 'N') v = Int16Array.from(v, clamp16); const h = hashI(v); const key = h[0] + ':' + h[1];
        const z = A[i].length; const old = ent[T].get(key);
        if (!old || z < old.z) ent[T].set(key, { v, a: A[i], z, cfg: header.cfg });
      }
    }
  }
  const sections = {}; const counts = {};
  for (const T of ['N', 'L', 'B']) {
    const arr = [...ent[T].values()].sort((x, y) => x.z - y.z); const n = arr.length; counts[T] = n;
    const V = T === 'B' ? new Uint8Array(n * K) : T === 'N' ? new Int16Array(n * K) : new Int32Array(n * K); arr.forEach((e, i) => V.set(e.v, i * K));
    sections[T + 'v'] = V; sections[T + 'a'] = arr.map((e) => e.a).join('\n');
    // sorted hash tables: [h1, h2, idx] triples
    const mkTab = (mapf) => { const rows = arr.map((e, i) => { const h = hashI(e.v, mapf); return [h[0], h[1], i]; }); rows.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]); const U = new Uint32Array(rows.length * 3); rows.forEach((r, i) => { U[3 * i] = r[0]; U[3 * i + 1] = r[1]; U[3 * i + 2] = r[2]; }); return U; };
    if (T !== 'B') sections[T + 't'] = mkTab(null);
    if (T === 'N') { sections.N16t = mkTab(v16); sections.Ncapt = mkTab(vcap); }
  }
  writeBin(out, { kind: 'index', K, probes: PROBES, parts: parts.map((p) => p.split('/').pop()), counts, built: new Date().toISOString() }, sections);
  return counts;
}

// ---------- load + match ----------
function lookupAll(U, h, max = 4) {
  let lo = 0, hi = U.length / 3; while (lo < hi) { const m = (lo + hi) >> 1; const a = U[3 * m], b = U[3 * m + 1]; if (a < h[0] || (a === h[0] && b < h[1])) lo = m + 1; else hi = m; }
  const out = []; for (let i = lo; i < U.length / 3 && out.length < max && U[3 * i] === h[0] && U[3 * i + 1] === h[1]; i++) out.push(U[3 * i + 2]); return out;
}
export function loadIndex(file) {
  const { header, sec } = readBin(file); const K = header.K;
  const asts = { N: sec.Na.split('\n'), L: sec.La.split('\n'), B: sec.Ba ? sec.Ba.split('\n') : [] };
  const node = (T, i) => { let a = null; return { i, c: 0, v: sec[T + 'v'].subarray(i * K, (i + 1) * K), get ast() { return a || (a = parse(asts[T][i])); } }; };
  const idx = {
    header, probes: header.probes, K, counts: header.counts, sec, node,
    has(T, v) { return T !== 'B' && lookupAll(sec[T + 't'], hashI(v), 1).length > 0; },   // learn.mjs: is this behaviour already an index entry?
    // direct lookup only (the < 1 s answer): returns [ast...]
    direct(kind, t) {
      const h = hashI(t); const out = [];
      if (kind === 'list2list') { for (const i of lookupAll(sec.Lt, h)) out.push([node('L', i).ast, 'direct']); return out; }
      for (const i of lookupAll(sec.Nt, h)) out.push([node('N', i).ast, 'direct']);
      for (const i of lookupAll(sec.N16t, h)) out.push([{ p: 'g.and15', a: [node('N', i).ast] }, 'm16']);
      for (const i of lookupAll(sec.Ncapt, h)) out.push([{ p: 'g.cap15', a: [node('N', i).ast] }, 'cap']);
      return out;
    },
    // extra (learn.mjs): the machine's own history entries {N,L,B: [{v (values on the same probes, index convention), ast}]}.
    // They are matched like index entries: direct / m16 / cap, meet-in-the-middle with each other AND with the whole index,
    // and as masks / conditions of the case split (history first).
    match(kind, t, tryCand, { deadline = Infinity, mitm = true, ite = true, extra = null } = {}) {
      const X = extra || { N: [], L: [], B: [] }; const th = hstrI(hashI(t));
      // history maps keyed by the first 32 bits of the hash (numeric keys: the index loop below does millions of lookups)
      const XN = new Map(), XN16 = new Map(), XL = new Map();
      const put = (m, hh, nd) => { const r = m.get(hh[0]); if (!r) m.set(hh[0], [[hh[1], nd]]); else if (r.length < 8) r.push([hh[1], nd]); };
      const get = (m, a, b) => { const r = m.get(a); if (!r) return null; const out = []; for (const [h2, nd] of r) if (h2 === b && out.length < 2) out.push(nd); return out; };
      if (kind === 'list2num') for (const nd of X.N) { const hh = hashI(nd.v), hh16 = hashI(nd.v, v16);
        if (hstrI(hh) === th && tryCand(nd.ast, 'hist:direct')) return true;
        if (hstrI(hh16) === th && tryCand({ p: 'g.and15', a: [nd.ast] }, 'hist:m16')) return true;
        if (hstrI(hashI(nd.v, vcap)) === th && tryCand({ p: 'g.cap15', a: [nd.ast] }, 'hist:cap')) return true;
        put(XN, hh, nd); put(XN16, hh16, nd); }
      if (kind === 'list2list') for (const nd of X.L) { const hh = hashI(nd.v); if (hstrI(hh) === th && tryCand(nd.ast, 'hist:direct')) return true; put(XL, hh, nd); }
      for (const [a, how] of this.direct(kind, t)) if (tryCand(a, 'index:' + how)) return true;
      const hasX = X.N.length + X.L.length > 0;
      if (mitm && kind === 'list2num') {
        // four needed-partner hashes per entry A in one pass: B = t-A, B = A-t, B&15 = (t-A)&15, B&15 = (A-t)&15
        const hs = new Uint32Array(8);
        const partners = (V, k0) => { let a1 = 2166136261 | 0, a2 = 5381, b1 = a1, b2 = 5381, c1 = a1, c2 = 5381, e1 = a1, e2 = 5381;
          for (let k = 0; k < K; k++) { const a = V[k0 + k]; if (a === BIG) return false; const o = t[k];
            let c = o - a; a1 = Math.imul(a1 ^ c, 16777619); a2 = (Math.imul(a2, 33) + c) | 0;
            c = a - o; b1 = Math.imul(b1 ^ c, 16777619); b2 = (Math.imul(b2, 33) + c) | 0;
            c = (o - a) & 15; c1 = Math.imul(c1 ^ c, 16777619); c2 = (Math.imul(c2, 33) + c) | 0;
            c = (a - o) & 15; e1 = Math.imul(e1 ^ c, 16777619); e2 = (Math.imul(e2, 33) + c) | 0; }
          hs[0] = a1; hs[1] = a2; hs[2] = b1; hs[3] = b2; hs[4] = c1; hs[5] = c2; hs[6] = e1; hs[7] = e2; return true; };
        const tryPartners = (A, tag) => {   // A: () => ast of the first operand; partners from the index and from the history
          const Bs = (tab, xm, q) => { const out = []; for (const j of lookupAll(sec[tab], [hs[q], hs[q + 1]], 2)) out.push(() => node('N', j).ast); if (hasX) for (const nd of get(xm, hs[q], hs[q + 1]) || []) out.push(() => nd.ast); return out; };
          for (const B of Bs('Nt', XN, 0)) if (tryCand(() => ({ p: 'g.add', a: [B(), A()] }), tag + 'A+B')) return true;
          for (const B of Bs('Nt', XN, 2)) if (tryCand(() => ({ p: 'g.sub', a: [A(), B()] }), tag + 'A-B')) return true;
          for (const B of Bs('N16t', XN16, 4)) if (tryCand(() => ({ p: 'g.and15', a: [{ p: 'g.add', a: [B(), A()] }] }), tag + 'm16(A+B)')) return true;
          for (const B of Bs('N16t', XN16, 6)) if (tryCand(() => ({ p: 'g.and15', a: [{ p: 'g.sub', a: [A(), B()] }] }), tag + 'm16(A-B)')) return true;
          return false; };
        for (const nd of X.N) if (partners(nd.v, 0) && tryPartners(() => nd.ast, 'hist:')) return true;
        const NV = sec.Nv, n = header.counts.N;
        for (let i = 0; i < n; i++) {
          if ((i & 4095) === 0 && Date.now() > deadline) return false;
          if (!partners(NV, i * K)) continue;
          if (tryPartners(() => node('N', i).ast, 'index:')) return true;
        }
      }
      if (mitm && kind === 'list2list') {
        const d = new Int32Array(K), d2 = new Int32Array(K); let pre, suf;
        const resid = (V, k0) => { pre = true; suf = true;
          for (let k = 0; k < K && (pre || suf); k++) {
            const a = V[k0 + k], o = t[k], na = a & 15, no = o & 15; if (na > no) { pre = suf = false; break; }
            const ae = a >>> 4, oe = o >>> 4, m = na ? (1 << (3 * na)) - 1 : 0;
            if (pre) { if (((ae ^ oe) & m) !== 0) pre = false; else d[k] = (no - na) | ((oe >>> (3 * na)) << 4); }
            if (suf) { if (((oe >>> (3 * (no - na))) & m) !== ae) suf = false; else d2[k] = (no - na) | ((oe & ((1 << (3 * (no - na))) - 1)) << 4); } } };
        const tryRest = (A, self, tag) => {   // A ++ rest (pre) and rest ++ A (suf); rest from the index or the history
          const rest = (dd) => { const h = hashI(dd); const out = []; for (const j of lookupAll(sec.Lt, h, 2)) if (j !== self) out.push(() => node('L', j).ast); if (hasX) for (const nd of get(XL, h[0], h[1]) || []) out.push(() => nd.ast); return out; };
          if (pre) for (const B of rest(d)) if (tryCand(() => ({ p: 'l.cat', a: [A(), B()] }), tag + 'A++B')) return true;
          if (suf) for (const B of rest(d2)) if (tryCand(() => ({ p: 'l.cat', a: [B(), A()] }), tag + 'A++B')) return true;
          return false; };
        for (const nd of X.L) { resid(nd.v, 0); if ((pre || suf) && tryRest(() => nd.ast, -1, 'hist:')) return true; }
        const LV = sec.Lv, n = header.counts.L;
        for (let i = 0; i < n; i++) {
          if ((i & 4095) === 0 && Date.now() > deadline) return false;
          resid(LV, i * K); if (!pre && !suf) continue;
          if (tryRest(() => node('L', i).ast, i, 'index:')) return true;
        }
      }
      if (ite) {
        const m = new Matcher(kind, t, (a, how) => tryCand(a, (hasX ? 'index+hist:' : 'index:') + how), { mitm: false, ite: true });
        const T = kind === 'list2num' ? 'N' : 'L'; const n = header.counts[T];
        for (const nd of X[T]) if (nd.src !== 'nb') m.addMask(nd.v, nd);   // neighbours are many: only real history entries get mask slots
        const TV = sec[T + 'v']; for (let i = 0; i < n && m.nm < 60000; i++) m.addMask(TV, () => node(T, i), i * K);
        for (const nd of X.B) if (m.bools.length < 2000) m.bools.push(nd);
        for (let i = 0; i < Math.min(header.counts.B, 4000); i++) m.bools.push(node('B', i));
        if (m.iteScan(deadline)) return true;
      }
      return false;
    },
  };
  return idx;
}

// ---------- G1 lookup: the G1 supplement index (nodes that use a G1 production) next to the G0 index ----------
// direct / m16 / cap on the G1 entries, then meet-in-the-middle with one side from G1 and the partner from either index
// (A±B, B−A, m16 of each; A++B and B++A for lists). The case split is left to the G0 pass and to live search.
export function matchG1(g1, g0, kind, t, tryCand, { deadline = Infinity } = {}) {
  for (const [a, how] of g1.direct(kind, t)) if (tryCand(a, 'g1:' + how)) return true;
  const K = g1.K; const idxs = g0 ? [g1, g0] : [g1];
  if (kind === 'list2num') {
    const NV = g1.sec.Nv, n = g1.counts.N;
    for (let i = 0; i < n; i++) {
      if ((i & 2047) === 0 && Date.now() > deadline) return false;
      const k0 = i * K; const H = [[2166136261 | 0, 5381], [2166136261 | 0, 5381], [2166136261 | 0, 5381], [2166136261 | 0, 5381], [2166136261 | 0, 5381], [2166136261 | 0, 5381]]; let big = false;
      for (let k = 0; k < K; k++) { const a = NV[k0 + k]; if (a === BIG) { big = true; break; } const o = t[k];
        const cs = [o - a, a - o, o + a, (o - a) & 15, (a - o) & 15, (o + a) & 15];
        for (let q = 0; q < 6; q++) { const c = cs[q]; H[q][0] = Math.imul(H[q][0] ^ c, 16777619); H[q][1] = (Math.imul(H[q][1], 33) + c) | 0; } }
      if (big) continue;
      const A = () => g1.node('N', i).ast; const hh = H.map(([x, y]) => [x >>> 0, y >>> 0]);
      for (const ix of idxs) {
        const B = (j) => ix.node('N', j).ast;
        for (const j of lookupAll(ix.sec.Nt, hh[0], 2)) if (tryCand(() => ({ p: 'g.add', a: [B(j), A()] }), 'g1:A+B')) return true;
        for (const j of lookupAll(ix.sec.Nt, hh[1], 2)) if (tryCand(() => ({ p: 'g.sub', a: [A(), B(j)] }), 'g1:A-B')) return true;
        for (const j of lookupAll(ix.sec.Nt, hh[2], 2)) if (tryCand(() => ({ p: 'g.sub', a: [B(j), A()] }), 'g1:B-A')) return true;
        for (const j of lookupAll(ix.sec.N16t, hh[3], 2)) if (tryCand(() => ({ p: 'g.and15', a: [{ p: 'g.add', a: [B(j), A()] }] }), 'g1:m16(A+B)')) return true;
        for (const j of lookupAll(ix.sec.N16t, hh[4], 2)) if (tryCand(() => ({ p: 'g.and15', a: [{ p: 'g.sub', a: [A(), B(j)] }] }), 'g1:m16(A-B)')) return true;
        for (const j of lookupAll(ix.sec.N16t, hh[5], 2)) if (tryCand(() => ({ p: 'g.and15', a: [{ p: 'g.sub', a: [B(j), A()] }] }), 'g1:m16(B-A)')) return true;
      }
    }
  }
  if (kind === 'list2list') {
    const LV = g1.sec.Lv, n = g1.counts.L; const d = new Int32Array(K), d2 = new Int32Array(K);
    for (let i = 0; i < n; i++) {
      if ((i & 2047) === 0 && Date.now() > deadline) return false;
      const k0 = i * K; let pre = true, suf = true;
      for (let k = 0; k < K && (pre || suf); k++) {
        const a = LV[k0 + k], o = t[k], na = a & 15, no = o & 15; if (na > no) { pre = suf = false; break; }
        const ae = a >>> 4, oe = o >>> 4, m = na ? (1 << (3 * na)) - 1 : 0;
        if (pre) { if (((ae ^ oe) & m) !== 0) pre = false; else d[k] = (no - na) | ((oe >>> (3 * na)) << 4); }
        if (suf) { if (((oe >>> (3 * (no - na))) & m) !== ae) suf = false; else d2[k] = (no - na) | ((oe & ((1 << (3 * (no - na))) - 1)) << 4); }
      }
      if (!pre && !suf) continue;
      const A = () => g1.node('L', i).ast; const h1 = pre ? hashI(d) : null, h2 = suf ? hashI(d2) : null;
      for (const ix of idxs) {
        if (pre) for (const j of lookupAll(ix.sec.Lt, h1, 2)) if (!(ix === g1 && j === i) && tryCand(() => ({ p: 'l.cat', a: [A(), ix.node('L', j).ast] }), 'g1:A++B')) return true;
        if (suf) for (const j of lookupAll(ix.sec.Lt, h2, 2)) if (!(ix === g1 && j === i) && tryCand(() => ({ p: 'l.cat', a: [ix.node('L', j).ast, A()] }), 'g1:A++B')) return true;
      }
    }
  }
  return false;
}

if ((process.argv[1] || '').endsWith('index.mjs')) {
  const [cmd, ...a] = process.argv.slice(2);
  if (cmd === 'build') { const [file, cfg, priorF, secs, g1f] = a; const prior = priorF && priorF !== '-' ? JSON.parse(fs.readFileSync(priorF, 'utf8')) : null; const r = buildPart(file, cfg, prior, +secs, { g1: g1f === 'g1' }); console.log(JSON.stringify({ file, cfg, g1: g1f === 'g1', ...r })); }
  else if (cmd === 'merge') { const [out, ...parts] = a; console.log(JSON.stringify(merge(out, parts))); }
  else if (cmd === 'info') { const t0 = Date.now(); const ix = loadIndex(a[0]); console.log(JSON.stringify({ ...ix.header, probes: undefined, loadMs: Date.now() - t0 })); }
}
