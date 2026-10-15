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
import { show, parse, size } from './grammar.mjs';
import { PROBES, makeCtx, enumerate, hashI, Matcher, configsFor } from './search.mjs';

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
export function buildPart(file, cfgName, prior, secs, { log = true } = {}) {
  const cfg = cfgName === 'uni' ? { name: 'uni', costs: new Map(), lib: [] } : configsFor(prior, cfgName.startsWith('shape:') ? cfgName.slice(6) : null).find((c) => c.name === cfgName);
  if (!cfg) throw new Error('no config ' + cfgName);
  const ctx = makeCtx(PROBES); const K = PROBES.length;
  const acc = { N: [], L: [], B: [] };
  const st = enumerate({ ctx, costs: cfg.costs, lib: cfg.lib, timeMs: secs * 1000, log,
    onNode: (T, node) => { if (T === 'level') return false; if (!node.v) return false; acc[T].push([node.v, show(node.ast), node.c]); return false; } });
  const sections = {};
  for (const T of ['N', 'L', 'B']) {
    const n = acc[T].length; const V = T === 'B' ? new Uint8Array(n * K) : T === 'N' ? new Int16Array(n * K) : new Int32Array(n * K); const C = new Uint16Array(n);
    acc[T].forEach(([v, , c], i) => { if (T === 'N') for (let k = 0; k < K; k++) V[i * K + k] = clamp16(v[k]); else V.set(v, i * K); C[i] = c; });
    sections[T + 'v'] = V; sections[T + 'c'] = C; sections[T + 'a'] = acc[T].map((x) => x[1]).join('\n');
  }
  writeBin(file, { kind: 'part', cfg: cfgName, K, secs, made: st.made, lastCost: st.lastCost, counts: { N: acc.N.length, L: acc.L.length, B: acc.B.length } }, sections);
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
    header, probes: header.probes, K, counts: header.counts,
    // direct lookup only (the < 1 s answer): returns [ast...]
    direct(kind, t) {
      const h = hashI(t); const out = [];
      if (kind === 'list2list') { for (const i of lookupAll(sec.Lt, h)) out.push([node('L', i).ast, 'direct']); return out; }
      for (const i of lookupAll(sec.Nt, h)) out.push([node('N', i).ast, 'direct']);
      for (const i of lookupAll(sec.N16t, h)) out.push([{ p: 'g.and15', a: [node('N', i).ast] }, 'm16']);
      for (const i of lookupAll(sec.Ncapt, h)) out.push([{ p: 'g.cap15', a: [node('N', i).ast] }, 'cap']);
      return out;
    },
    match(kind, t, tryCand, { deadline = Infinity, mitm = true, ite = true } = {}) {
      for (const [a, how] of this.direct(kind, t)) if (tryCand(a, 'index:' + how)) return true;
      const d = new Int32Array(K);
      if (mitm && kind === 'list2num') {
        // four needed-partner hashes per entry A in one pass: B = t-A, B = A-t, B&15 = (t-A)&15, B&15 = (A-t)&15
        const NV = sec.Nv, n = header.counts.N;
        for (let i = 0; i < n; i++) {
          if ((i & 4095) === 0 && Date.now() > deadline) return false;
          const k0 = i * K; let a1 = 2166136261 | 0, a2 = 5381, b1 = a1, b2 = 5381, c1 = a1, c2 = 5381, e1 = a1, e2 = 5381, big = false;
          for (let k = 0; k < K; k++) { const a = NV[k0 + k]; if (a === BIG) { big = true; break; } const o = t[k];
            let c = o - a; a1 = Math.imul(a1 ^ c, 16777619); a2 = (Math.imul(a2, 33) + c) | 0;
            c = a - o; b1 = Math.imul(b1 ^ c, 16777619); b2 = (Math.imul(b2, 33) + c) | 0;
            c = (o - a) & 15; c1 = Math.imul(c1 ^ c, 16777619); c2 = (Math.imul(c2, 33) + c) | 0;
            c = (a - o) & 15; e1 = Math.imul(e1 ^ c, 16777619); e2 = (Math.imul(e2, 33) + c) | 0; }
          if (big) continue;
          const A = () => node('N', i).ast;
          for (const j of lookupAll(sec.Nt, [a1 >>> 0, a2 >>> 0], 2)) if (tryCand(() => ({ p: 'g.add', a: [node('N', j).ast, A()] }), 'index:A+B')) return true;
          for (const j of lookupAll(sec.Nt, [b1 >>> 0, b2 >>> 0], 2)) if (tryCand(() => ({ p: 'g.sub', a: [A(), node('N', j).ast] }), 'index:A-B')) return true;
          for (const j of lookupAll(sec.N16t, [c1 >>> 0, c2 >>> 0], 2)) if (tryCand(() => ({ p: 'g.and15', a: [{ p: 'g.add', a: [node('N', j).ast, A()] }] }), 'index:m16(A+B)')) return true;
          for (const j of lookupAll(sec.N16t, [e1 >>> 0, e2 >>> 0], 2)) if (tryCand(() => ({ p: 'g.and15', a: [{ p: 'g.sub', a: [A(), node('N', j).ast] }] }), 'index:m16(A-B)')) return true;
        }
      }
      if (mitm && kind === 'list2list') {
        const LV = sec.Lv, n = header.counts.L;
        for (let i = 0; i < n; i++) {
          if ((i & 4095) === 0 && Date.now() > deadline) return false;
          const k0 = i * K; let pre = true, suf = true; const d2 = new Int32Array(K);
          for (let k = 0; k < K && (pre || suf); k++) {
            const a = LV[k0 + k], o = t[k], na = a & 15, no = o & 15; if (na > no || !na && false) { pre = suf = false; break; }
            const ae = a >>> 4, oe = o >>> 4, m = na ? (1 << (3 * na)) - 1 : 0;
            if (pre) { if (((ae ^ oe) & m) !== 0) pre = false; else d[k] = (no - na) | ((oe >>> (3 * na)) << 4); }
            if (suf) { if (((oe >>> (3 * (no - na))) & m) !== ae) suf = false; else d2[k] = (no - na) | ((oe & ((1 << (3 * (no - na))) - 1)) << 4); }
          }
          if (pre) for (const j of lookupAll(sec.Lt, hashI(d), 2)) if (j !== i && tryCand(() => ({ p: 'l.cat', a: [node('L', i).ast, node('L', j).ast] }), 'index:A++B')) return true;
          if (suf) for (const j of lookupAll(sec.Lt, hashI(d2), 2)) if (j !== i && tryCand(() => ({ p: 'l.cat', a: [node('L', j).ast, node('L', i).ast] }), 'index:A++B')) return true;
        }
      }
      if (ite) {
        const m = new Matcher(kind, t, (a, how) => tryCand(a, 'index:' + how), { mitm: false, ite: true });
        const T = kind === 'list2num' ? 'N' : 'L'; const n = header.counts[T];
        const TV = sec[T + 'v']; for (let i = 0; i < n && m.nm < 60000; i++) m.addMask(TV, () => node(T, i), i * K);
        for (let i = 0; i < Math.min(header.counts.B, 4000); i++) m.bools.push(node('B', i));
        if (m.iteScan(deadline)) return true;
      }
      return false;
    },
  };
  return idx;
}

if ((process.argv[1] || '').endsWith('index.mjs')) {
  const [cmd, ...a] = process.argv.slice(2);
  if (cmd === 'build') { const [file, cfg, priorF, secs] = a; const prior = priorF && priorF !== '-' ? JSON.parse(fs.readFileSync(priorF, 'utf8')) : null; const r = buildPart(file, cfg, prior, +secs); console.log(JSON.stringify({ file, cfg, ...r })); }
  else if (cmd === 'merge') { const [out, ...parts] = a; console.log(JSON.stringify(merge(out, parts))); }
  else if (cmd === 'info') { const t0 = Date.now(); const ix = loadIndex(a[0]); console.log(JSON.stringify({ ...ix.header, probes: undefined, loadMs: Date.now() - t0 })); }
}
