// ir.mjs - one intermediate form for the programs the grammar search finds (Track B compiler input).
// Input dialects: library ASTs {p,a} (strat-library dsl.mjs, the base of grammar G0) and dsl show-strings (strat-dsl).
// Both become IR nodes {p, a:[...]} with library names for list/number/derived nodes, and lambdas as expression trees:
//   {k:c} constant · {v:name} variable · {op, a:[...]} operator · {cnt:'all'|'before'|'after', rel:E} nested pair count
// lambda variables: x i n prv nxt srt (element ctx) · a b (pair ctx; a = earlier/left) · c (triple) · g.<stat> (current list) · o.<stat> (original input)
//   stats: n l0 last sec sum mn mx
// Nothing here knows a task: this is a syntax translation plus a reference evaluator (the witness used to make sub-specs).
const MOD = (a, b) => (b > 0 ? ((a % b) + b) % b : 0);
export const STATS = ['n', 'l0', 'last', 'sec', 'sum', 'mn', 'mx'];
export const statsOf = (l) => { const n = l.length; let s = 0, mn = 0, mx = 0; if (n) { mn = 99; for (const v of l) { s += v; if (v < mn) mn = v; if (v > mx) mx = v; } } return { n, l0: n ? l[0] : 0, last: n ? l[n - 1] : 0, sec: n > 1 ? l[1] : 0, sum: s, mn, mx }; };

// ───────── lambda operators ─────────
export const OPS = {
  '+': (a, b) => a + b, '-': (a, b) => a - b, '*': (a, b) => a * b, ad: (a, b) => Math.abs(a - b), mn: Math.min, mx: Math.max,
  '%': MOD, '/': (a, b) => (b > 0 ? Math.floor(a / b) : 0), '&': (a, b) => a & b, half: (a) => a >> 1,
  '<': (a, b) => a < b, '<=': (a, b) => a <= b, '==': (a, b) => a === b, '!=': (a, b) => a !== b, '>': (a, b) => a > b, '>=': (a, b) => a >= b,
  '&&': (a, b) => !!(a && b), '||': (a, b) => !!(a || b), '!': (a) => !a, xor: (a, b) => !a !== !b, xnor: (a, b) => !a === !b,
  in: null,   // {op:'in', set:[...], a:[E]}
  rng: (v, n) => (v >= 0 && v < n ? v : 15),   // a next index, or 15 when it leaves the list (walk frames)
};
export const BOOLOPS = new Set(['<', '<=', '==', '!=', '>', '>=', '&&', '||', '!', 'xor', 'xnor', 'in']);
// env: {x,i,n,prv,nxt,srt,a,b,c, L (current list), G (stats of current), O (stats of original), j (pair index)}
export function evalLam(e, env) {
  if (e.k !== undefined) return e.k;
  if (e.v !== undefined) { const v = e.v; if (v.startsWith('g.')) return env.G[v.slice(2)]; if (v.startsWith('o.')) return env.O[v.slice(2)]; const r = env[v]; if (r === undefined) throw new Error('unbound ' + v); return r; }
  if (e.cnt) { const L = env.L, i = env.i, x = env.x; let c = 0; const lo = e.cnt === 'after' ? i + 1 : 0, hi = e.cnt === 'before' ? i : L.length;
    for (let j = lo; j < hi; j++) if (j !== i && evalLam(e.rel, { ...env, a: x, b: L[j] })) c++; return c; }
  if (e.op === 'in') return e.set.includes(evalLam(e.a[0], env));
  const f = OPS[e.op]; if (!f) throw new Error('op ' + e.op);
  return e.a.length === 1 ? f(evalLam(e.a[0], env)) : f(evalLam(e.a[0], env), evalLam(e.a[1], env));
}
export const lamVars = (e, s = new Set()) => { if (e.v !== undefined) s.add(e.v); else if (e.cnt) { s.add('x'); s.add('i'); s.add('L'); lamVars(e.rel, new Set()).forEach((v) => { if (v !== 'a' && v !== 'b') s.add(v); }); } else if (e.a) e.a.forEach((c) => lamVars(c, s)); return s; };
export const showLam = (e) => e.k !== undefined ? String(e.k) : e.v !== undefined ? e.v : e.cnt ? `#${e.cnt}${showLam(e.rel)}` : e.op === 'in' ? `${showLam(e.a[0])}∈{${e.set}}` : e.a.length === 1 ? `${e.op}(${showLam(e.a[0])})` : `(${showLam(e.a[0])} ${e.op} ${showLam(e.a[1])})`;

// ───────── library dialect → IR ─────────
const LIBBIN = { add: '+', sub: '-', absd: 'ad', mod: '%', min: 'mn', max: 'mx', mul: '*', lt: '<', le: '<=', eq: '==', ne: '!=', or: '||', and: '&&', xor: 'xor' };
function libLam(t) {   // e.* / p.* / t.* nodes → expression
  const [ns, nm] = [t.p.slice(0, t.p.indexOf('.')), t.p.slice(t.p.indexOf('.') + 1)];
  if (/^c\d+$/.test(nm)) return { k: +nm.slice(1) };
  if (nm === 'k') return { k: kval(t.a[0]) };
  if (ns === 'e' && ['x', 'i', 'prv', 'nxt'].includes(nm)) return { v: nm };
  if (ns === 'p' && ['a', 'b'].includes(nm)) return { v: nm };
  if (ns === 'p' && nm === 'i') return { v: 'i' };
  if (['n', 'l0', 'last', 'sum', 'mn', 'mx'].includes(nm)) return { v: 'g.' + nm };
  if (LIBBIN[nm]) return { op: LIBBIN[nm], a: [libLam(t.a[0]), libLam(t.a[1])] };
  if (nm === 'half') return { op: 'half', a: [libLam(t.a[0])] };
  if (nm === 'not') return { op: '!', a: [libLam(t.a[0])] };
  if (nm === 'eqK') return { op: '==', a: [libLam(t.a[0]), { k: kval(t.a[1]) }] };
  if (nm === 'ltK') return { op: '<', a: [libLam(t.a[0]), { k: kval(t.a[1]) }] };
  if (nm === 'gtK') return { op: '>', a: [libLam(t.a[0]), { k: kval(t.a[1]) }] };
  if (nm.startsWith('cnt_')) return { cnt: nm.slice(4), rel: libLam(t.a[0]) };
  if (t.p === 't.chain') { const r = libLam(t.a[0]); const sub = (e, m) => e.v !== undefined ? (m[e.v] ?? e) : e.a ? { ...e, a: e.a.map((c) => sub(c, m)) } : e;
    return { op: '&&', a: [sub(r, { a: { v: 'a' }, b: { v: 'b' } }), sub(r, { a: { v: 'b' }, b: { v: 'c' } })] }; }
  if (t.p === 't.sumK') return { op: '==', a: [{ op: '+', a: [{ op: '+', a: [{ v: 'a' }, { v: 'b' }] }, { v: 'c' }] }, { k: kval(t.a[0]) }] };
  if (t.p === 't.sumgK') return { op: '>', a: [{ op: '+', a: [{ op: '+', a: [{ v: 'a' }, { v: 'b' }] }, { v: 'c' }] }, { k: kval(t.a[0]) }] };
  throw new Error('lib lambda ' + t.p);
}
const kval = (t) => +t.p.slice(1);
const LAMTYPES = { 'l.filter': [1], 'l.sortBy': [1], 'l.sortByDesc': [1], 'l.sortBy2': [1, 2], 'l.runsMap': [1], 'l.runsBest': [1], 'l.stackCancel': [1], 'l.stackWhile': [1], 'l.passLR': [1], 'l.passRL': [1], 'l.twoPtr': [1], 'l.hop': [1], 'l.walk': [1], 'l.takeWhile': [1], 'l.dropWhile': [1],
  'g.findIdx': [1], 'g.findLast': [1], 'g.fold': [1], 'g.cntPairs': [0], 'g.cntTriples': [0], 'd.map': [0], 'd.adj': [0], 'd.chunk2': [0], 'd.pairs': [0], 'd.mapD': [1], 'd.adjD': [1], 'd.runlens': [1], 'd.segs': [0, 1], 'd.walk': [0] };
const IMPLICIT = new Set(['d.map', 'd.adj', 'd.chunk2', 'd.pairs', 'd.walk', 'd.segs', 'g.cntPairs', 'g.cntTriples']);
const G0ALIAS = { 'g.lt': 'b.lt', 'g.eq': 'b.eq', 'g.odd': 'b.odd', 'g.le': 'b.le', 'g.m16': 'g.and15', 'g.cap': 'g.cap15' };   // Track A's G0 names for the dsl additions
export function fromLib(t) {
  if (G0ALIAS[t.p]) return fromLib({ ...t, p: G0ALIAS[t.p] });
  if (/^k\d+$/.test(t.p)) return { p: '#', v: kval(t) };
  if (t.p === 'g.k') return { p: '#', v: kval(t.a[0]) };
  if (/^g\.c\d+$/.test(t.p)) return { p: '#', v: +t.p.slice(3) };
  const lam = LAMTYPES[t.p] || [];
  const a = t.a.map((c, i) => (lam.includes(i) ? { lam: libLam(c) } : fromLib(c)));
  // producers that read the current list implicitly get it as an explicit first argument (uniform shape: list first)
  if (IMPLICIT.has(t.p)) return { p: t.p, a: [{ p: 'l.id', a: [] }, ...a] };
  return { p: t.p, a };
}

// ───────── dsl dialect (show strings) → IR ─────────
const LEAVES = ['prv', 'nxt', 'srt', 'last', 'sec', 'sum', 'max', 'min', 'n0', 'hd', 'x', 'i', 'n', 'a', 'b', 'c'];
const BINOPS = ['<=', '>=', '==', '!=', '&&', '||', 'ad', 'mn', 'mx', '<', '>', '+', '-', '*', '%', '/', '&'];
const DLEAF = { hd: 'o.l0', last: 'o.last', sec: 'o.sec', sum: 'o.sum', max: 'o.mx', min: 'o.mn', n0: 'o.n', n: 'g.n' };
// ctx: 'E' element (x,i,n,prv,nxt,srt + originals) · 'R' pair (a,b) · 'R3' (c,x,i) · 'W' (i,x,n) · 'T3' (a,b,c)
export function parseLam(s, ctx) {
  let p = 0;
  const expr = () => {
    if (s[p] === '(') { p++; const A = expr(); const op = BINOPS.find((o) => s.startsWith(o, p)); if (!op) throw new Error('op at ' + p + ' in ' + s); p += op.length; const B = expr(); if (s[p] !== ')') throw new Error(') at ' + p + ' in ' + s); p++; return { op: op === '==' && BOOLY(A) && BOOLY(B) ? 'xnor' : op, a: [A, B] }; }
    if (s[p] === '!') { p++; return { op: '!', a: [expr()] }; }
    if (s[p] === '#') { p++; const j = s[p]; p++; const rel = expr(); return { cnt: j === '<' ? 'before' : j === '>' ? 'after' : 'all', rel: relabel(rel) }; }
    if (s.startsWith('x∈{', p)) { const q = s.indexOf('}', p); const set = s.slice(p + 3, q).split(',').map(Number); p = q + 1; return { op: 'in', set, a: [{ v: 'x' }] }; }
    const m = /^-?\d+/.exec(s.slice(p)); if (m) { p += m[0].length; return { k: +m[0] }; }
    const lf = LEAVES.find((v) => s.startsWith(v, p)); if (!lf) throw new Error('leaf at ' + p + ' in ' + s); p += lf.length;
    if (ctx === 'E') return { v: DLEAF[lf] || lf };
    if (ctx === 'W' && lf === 'n') return { v: 'g.n' };
    return { v: lf };
  };
  const e = expr(); if (p !== s.length) throw new Error('trailing in ' + s); return e;
}
const BOOLY = (e) => e.op && BOOLOPS.has(e.op);
const relabel = (e) => e;   // pair-count relations are over (a = this element x, b = the other element)
// dsl production table: argument kinds
const DSIG = { len: 'L', sum: 'L', max: 'L', min: 'L', hd: 'L', lst: 'L', nth: 'IL', idx: 'IL', cnt: 'EL', fidx: 'EL', amax: 'EL', amin: 'EL', dist: 'L', fold: 'RIL', cyc: 'L', pcnt: 'RL', pdist: 'RL', tcnt: 'TL', wcnt: 'WL', scnt: 'S',
  add: 'II', sub: 'II', mul: 'II', ad: 'II', imn: 'II', imx: 'II', mod: 'II', div: 'II', m16: 'I', cap: 'I', dflt: 'II', lt: 'II', eq: 'II', odd: 'I', le: 'II',
  rev: 'L', srt: 'L', srtd: 'L', tl: 'L', ini: 'L', take: 'IL', drop: 'IL', rot: 'IL', rmat: 'IL', cat: 'LL', ilv: 'LL', flt: 'EL', tw: 'EL', dw: 'EL', map: 'EL', sby: 'EL', scan: 'L', dif: 'L',
  stkC: 'RL', stkM: 'RL', stkR: 'RL', carry: '3L', deq: 'RL', deqB: 'RCL', jos: 'KL', walk: 'WL', crev: 'S', csrt: 'S', magg: 'KS', sbest: 'KS', sworst: 'KS', slast: 'S',
  runs: 'RL', spl: 'EL', win: 'KL', chk: 'KL', segs: 'L', ite: 'BXX' };
export function parseDsl(s) {
  let p = 0;
  const skip = () => { while (s[p] === ' ') p++; };
  const argStr = () => { skip(); let d = 0, q = p; while (q < s.length) { const ch = s[q]; if (ch === '(' || ch === '{') d++; else if (ch === ')' || ch === '}') { if (d === 0) break; d--; } else if (ch === ',' && d === 0) break; q++; } const r = s.slice(p, q); p = q; return r; };
  const term = () => {
    skip(); const m = /^[a-zA-Z][a-zA-Z0-9]*/.exec(s.slice(p)); const m2 = /^-?\d+/.exec(s.slice(p));
    if (m2 && !m) { p += m2[0].length; return { lit: +m2[0] }; }
    if (!m) throw new Error('term at ' + p + ' in ' + s);
    const name = m[0]; p += name.length;
    if (s[p] !== '(') return { leaf: name };
    p++; const sig = DSIG[name]; if (!sig) throw new Error('dsl prod ' + name);
    const args = [];
    for (let k = 0; k < sig.length; k++) { if (k) { skip(); if (s[p] !== ',') throw new Error(', in ' + s); p++; } const t = sig[k];
      if (t === 'E' || t === 'R' || t === 'W' || t === 'T' || t === '3') { const str = argStr().trim(); args.push({ lamS: str, ctx: t === 'E' ? 'E' : t === 'R' ? 'R' : t === 'W' ? 'W' : t === 'T' ? 'T3' : 'R3' }); }
      else if (t === 'K' || t === 'C') { args.push({ lit: +argStr().trim() }); }
      else args.push(term()); }
    skip(); if (s[p] !== ')') throw new Error(') in ' + s + ' at ' + p); p++;
    return { name, args };
  };
  const t = term(); return t;
}
// dsl tree → IR. Lists are typed 'L' (element list), numbers 'N'. Segment lists S stay dsl-only (wrapped).
const lam = (a) => ({ lam: parseLam(a.lamS, a.ctx) });
const N = (x) => ({ p: '#', v: x });
export function fromDsl(t, top = true) {
  if (t.lit !== undefined) return N(t.lit);
  if (t.leaf === 'l') return { p: 'l.id', a: [] };
  if (t.leaf === 'n') return { p: 'g.n', a: [] };
  if (t.leaf !== undefined && /^\d+$/.test(t.leaf)) return N(+t.leaf);
  const A = t.args, X = (i) => fromDsl(A[i], false);
  const isL = (i) => A[i].leaf === 'l' || (A[i].name && 'rev srt srtd tl ini take drop rot rmat cat ilv flt tw dw sby stkC stkM stkR carry deq deqB jos walk crev csrt slast sbest sworst ite'.split(' ').includes(A[i].name));
  switch (t.name) {
    case 'len': return { p: 'agg.len', a: [X(0)] }; case 'sum': return { p: 'agg.sum', a: [X(0)] }; case 'max': return { p: 'agg.max', a: [X(0)] }; case 'min': return { p: 'agg.min', a: [X(0)] };
    case 'hd': return { p: 'agg.first', a: [X(0)] }; case 'lst': return { p: 'agg.last', a: [X(0)] }; case 'dist': return { p: 'agg.distinct', a: [X(0)] };
    case 'nth': return { p: 'g.at', a: [X(1), X(0)], orgN: [1] };
    case 'idx': return { p: 'g.indexOfIn', a: [X(1), X(0)], orgN: [1] };
    case 'cnt': return { p: 'agg.len', a: [{ p: 'l.filter', a: [X(1), lam(A[0])] }] };
    case 'fidx': return { p: 'g.findIdx', a: [X(1), lam(A[0])] };
    case 'amax': return { p: 'agg.argmax', a: [{ p: 'd.map', a: [X(1), lam(A[0])] }] };
    case 'amin': return { p: 'agg.argmin', a: [{ p: 'd.map', a: [X(1), lam(A[0])] }] };
    case 'pcnt': return { p: 'g.cntPairs', a: [X(1), lam(A[0])] };
    case 'pdist': return { p: 'agg.distinct', a: [{ p: 'd.pairs', a: [X(1), lam(A[0])] }] };
    case 'tcnt': return { p: 'g.cntTriples', a: [X(1), lam(A[0])] };
    case 'wcnt': return { p: 'agg.len', a: [{ p: 'd.walkIdx', a: [X(1), lam(A[0])] }] };
    case 'scnt': return { p: 'agg.len', a: [A[0].name === 'spl' || A[0].name === 'runs' || A[0].name === 'segs' ? segOnly(A[0]) : X(0)] };
    case 'add': return { p: 'g.add', a: [X(0), X(1)] }; case 'sub': return { p: 'g.sub', a: [X(0), X(1)] }; case 'mul': return { p: 'g.mul', a: [X(0), X(1)] };
    case 'ad': return { p: 'g.absd', a: [X(0), X(1)] }; case 'imn': return { p: 'g.min', a: [X(0), X(1)] }; case 'imx': return { p: 'g.max', a: [X(0), X(1)] };
    case 'mod': return { p: 'g.mod', a: [X(0), X(1)] }; case 'div': return { p: 'g.div', a: [X(0), X(1)] };
    case 'm16': return { p: 'g.and15', a: [X(0)] }; case 'cap': return { p: 'g.cap15', a: [X(0)] }; case 'dflt': return { p: 'g.dflt', a: [X(0), X(1)] };
    case 'lt': return { p: 'b.lt', a: [X(0), X(1)] }; case 'eq': return { p: 'b.eq', a: [X(0), X(1)] }; case 'odd': return { p: 'b.odd', a: [X(0)] }; case 'le': return { p: 'b.le', a: [X(0), X(1)] };
    case 'ite': return { p: isL(1) ? 'l.ite' : 'g.ite', a: [X(0), X(1), X(2)] };
    case 'rev': return { p: 'l.rev', a: [X(0)] }; case 'srt': return { p: 'l.sortBy', a: [X(0), { lam: { v: 'x' } }] }; case 'srtd': return { p: 'l.sortByDesc', a: [X(0), { lam: { v: 'x' } }] };
    case 'tl': return { p: 'l.drop', a: [X(0), N(1)] };
    case 'ini': return { p: 'l.take', a: [X(0), { p: 'g.sub', a: [{ p: 'g.n', a: [] }, N(1)] }] };
    case 'take': return { p: 'l.take', a: [X(1), X(0)], orgN: [1] }; case 'drop': return { p: 'l.drop', a: [X(1), X(0)], orgN: [1] };
    case 'rot': return { p: 'l.rotate', a: [X(1), X(0)], orgN: [1] };
    case 'rmat': return { p: 'l.removeAt', a: [X(1), X(0), N(1)], orgN: [1] };
    case 'cat': return { p: 'l.cat', a: [X(0), X(1)] }; case 'ilv': return { p: 'l.ilv', a: [X(0), X(1)] };
    case 'flt': return { p: 'l.filter', a: [X(1), lam(A[0])] }; case 'tw': return { p: 'l.takeWhile', a: [X(1), lam(A[0])] }; case 'dw': return { p: 'l.dropWhile', a: [X(1), lam(A[0])] };
    case 'map': return { p: 'd.map', a: [X(1), lam(A[0])] };
    case 'sby': return { p: 'l.sortBy', a: [X(1), lam(A[0])] };
    case 'scan': return { p: 'd.scan', a: [X(0)] }; case 'dif': return { p: 'd.adj', a: [X(0), { lam: { op: '-', a: [{ v: 'b' }, { v: 'a' }] } }] };
    case 'stkC': return { p: 'l.stackCancel', a: [X(1), lam(A[0])] }; case 'stkM': return { p: 'l.stackWhile', a: [X(1), lam(A[0])] }; case 'stkR': return { p: 'l.stackRepl', a: [X(1), lam(A[0])] };
    case 'deq': return { p: 'l.twoPtr', a: [X(1), lam(A[0])] };
    case 'jos': return { p: 'l.josephus', a: [X(1), N(A[0].lit)] };
    case 'walk': return { p: 'l.walkIdx', a: [X(1), lam(A[0])] };
    case 'crev': return segs(A[0], { p: 'l.rev', a: [{ p: 'l.id', a: [] }] });
    case 'csrt': return segs(A[0], { p: 'l.sortBy', a: [{ p: 'l.id', a: [] }, { lam: { v: 'x' } }] });
    case 'slast': return { p: 'l.segLast', a: [segOnly(A[0])] };
  }
  return { p: 'dsl.' + t.name, a: [], dsl: t };   // opaque: kept with its dsl subtree (evaluated by the dsl reference)
}
// segment producers map to frames that take a per-segment list program
function segs(S, F) {
  if (S.name === 'runs') return { p: 'l.runsMap', a: [fromDsl(S.args[1], false), lam(S.args[0]), F] };
  if (S.name === 'chk') return { p: 'l.chunksMap', a: [fromDsl(S.args[1], false), N(S.args[0].lit), F] };
  return { p: 'dsl.segmap', a: [], dsl: { name: F.p === 'l.rev' ? 'crev' : 'csrt', args: [S] } };
}
function segOnly(S) { return { p: 'seg.' + S.name, a: S.args.map((x) => (x.lamS ? lam(x) : x.lit !== undefined ? N(x.lit) : fromDsl(x, false))) }; }

// ───────── evaluator (witness) ─────────
let DSLREF = null; export async function loadRefs() { if (!DSLREF) DSLREF = await import('./ref/dsldsl.mjs'); }
const asc = (a, b) => a - b;
const argBest = (d, better) => { let b = -1; for (let i = 0; i < d.length; i++) if (b < 0 || better(d[i], d[b])) b = i; return b; };
// ev(node, L, O): L = the current list (input of this node), O = stats of the ORIGINAL input. hook(node, env) observes lambda calls.
export function evalIR(node, l, opts = {}) { const O = statsOf(l); O.__l = l; return ev(node, l, O, opts.hook || null); }
// value of node when its current list is m and the original input is l
export function evalAt(node, m, l, opts = {}) { const O = statsOf(l); O.__l = l; return ev(node, m, O, opts.hook || null); }
function lamF(n, L, O, hook) { const G = statsOf(L); const e = n.lam; if (n._srt === undefined) n._srt = lamVars(e).has('srt'); const S = n._srt ? [...L].sort(asc) : null;
  return (env) => { const E = { ...env, L, G, O }; if (S) E.srt = S[env.i]; if (hook) { if (hook.lam) hook.lam(n, E); } return evalLam(e, E); }; }
const elemEnv = (L, i) => ({ x: L[i], i, n: L.length, prv: i > 0 ? L[i - 1] : 0, nxt: i + 1 < L.length ? L[i + 1] : 0 });
function ev(t, L, O, hook) { const v = ev0(t, L, O, hook); if (hook && hook.node) hook.node(t, v, L); return v; }
function ev0(t, L, O, hook) {
  const A = t.a, sub = (k, M = L) => ev(A[k], M, O, hook);
  const NN = (k, M) => ev(A[k], t.orgN?.includes(k) ? O.__l : M, O, hook);
  switch (t.p) {
    case '#': return t.v;
    case 'l.id': return L;
    case 'g.n': return L.length;
    case 'g.l0': return L.length ? L[0] : 0; case 'g.last': return L.length ? L[L.length - 1] : 0;
    case 'g.sum': return L.reduce((a, b) => a + b, 0); case 'g.mn': return statsOf(L).mn; case 'g.mx': return statsOf(L).mx;
  }
  const [ns] = t.p.split('.');
  // number combinators
  const BIN = { 'g.add': (a, b) => a + b, 'g.sub': (a, b) => a - b, 'g.absd': (a, b) => Math.abs(a - b), 'g.mod': MOD, 'g.min': Math.min, 'g.max': Math.max, 'g.mul': (a, b) => a * b, 'g.div': (a, b) => (b > 0 ? Math.floor(a / b) : 0), 'g.dflt': (a, b) => (a < 0 ? b : a),
    'b.lt': (a, b) => a < b, 'b.eq': (a, b) => a === b, 'b.le': (a, b) => a <= b };
  if (BIN[t.p]) return BIN[t.p](sub(0), sub(1));
  switch (t.p) {
    case 'g.half': return sub(0) >> 1; case 'g.cap15': return Math.min(15, sub(0)); case 'g.and15': return sub(0) & 15; case 'g.inc': return sub(0) + 1; case 'b.odd': return (sub(0) & 1) === 1;
    case 'g.ite': case 'l.ite': return sub(0) ? sub(1) : sub(2);
    case 'g.ltK': return sub(0) < A[1].v;
    case 'g.at': { const m = sub(0); const k = NN(1, L); return k >= 0 && k < m.length ? m[k] : 0; }
    case 'g.indexOf': return L.indexOf(sub(0));
    case 'g.indexOfIn': { const m = sub(0); return m.indexOf(NN(1, L)); }
    case 'g.findIdx': case 'g.findLast': { const m = sub(0); const f = lamF(A[1], m, O, hook); if (t.p === 'g.findIdx') { for (let i = 0; i < m.length; i++) if (f(elemEnv(m, i))) return i; } else for (let i = m.length - 1; i >= 0; i--) if (f(elemEnv(m, i))) return i; return -1; }
    case 'g.cntPairs': { const m = sub(0); const f = lamF(A[1], m, O, hook); let c = 0; for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) if (f({ a: m[i], b: m[j], i, j })) c++; return c; }
    case 'g.cntTriples': { const m = sub(0); const f = lamF(A[1], m, O, hook); let c = 0; for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) for (let k = j + 1; k < m.length; k++) if (f({ a: m[i], b: m[j], c: m[k] })) c++; return c; }
    case 'g.fold': { const m = sub(0); const f = lamF(A[1], m, O, hook); let acc = A[2].v; m.forEach((x, i) => { acc = f({ a: acc, b: x, i }); }); return acc; }
  }
  if (ns === 'agg') { const d = sub(0);
    switch (t.p) {
      case 'agg.len': return d.length; case 'agg.sum': return d.reduce((a, b) => a + b, 0);
      case 'agg.min': return d.length ? Math.min(...d) : 0; case 'agg.max': return d.length ? Math.max(...d) : 0;
      case 'agg.first': return d.length ? d[0] : 0; case 'agg.last': return d.length ? d[d.length - 1] : 0;
      case 'agg.distinct': return new Set(d).size;
      case 'agg.mode': { const c = new Map(); let b = 0, bc = 0; for (const v of d) c.set(v, (c.get(v) || 0) + 1); for (const [v, k] of c) if (k > bc || (k === bc && v < b)) { b = v; bc = k; } return b; }
      case 'agg.argmax': return argBest(d, (a, b) => a > b); case 'agg.argmin': return argBest(d, (a, b) => a < b);
      case 'agg.maxrun': { let b = 0, c = 0; for (let i = 0; i < d.length; i++) { c = i && d[i] === d[i - 1] ? c + 1 : 1; if (c > b) b = c; } return b; }
    } }
  if (ns === 'd') { const m = sub(0); const f = A[1] && A[1].lam ? lamF(A[1], m, O, hook) : null;
    switch (t.p) {
      case 'd.map': case 'd.mapD': return m.map((x, i) => f(elemEnv(m, i)));
      case 'd.adjD': { const r = []; for (let i = 0; i + 1 < m.length; i++) r.push(f({ a: m[i], b: m[i + 1], i })); return r; }
      case 'd.segs': { const fp = lamF(A[2], m, O, hook); const r = []; for (let i = 0; i < m.length; i++) { let sm = 0; for (let j = i; j < m.length; j++) { sm += m[j]; const e = { a: sm, b: j - i + 1, i }; if (fp(e)) r.push(f(e)); } } return r; }
      case 'd.adj': { const r = []; for (let i = 0; i + 1 < m.length; i++) r.push(f({ a: m[i], b: m[i + 1], i })); return r; }
      case 'd.chunk2': { const r = []; for (let i = 0; i < m.length; i += 2) r.push(i + 1 < m.length ? f({ a: m[i], b: m[i + 1], i }) : m[i]); return r; }
      case 'd.pairs': { const r = []; for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) r.push(f({ a: m[i], b: m[j], i })); return r; }
      case 'd.scan': { let s = 0; return m.map((v) => (s += v)); }
      case 'd.runlens': { const r = []; let c = 0; for (let i = 0; i < m.length; i++) { if (i && f({ a: m[i - 1], b: m[i], i })) c++; else { if (i) r.push(c); c = 1; } } if (m.length) r.push(c); return r; }
      case 'd.walk': { const n = m.length, seen = new Uint8Array(n), r = []; let i = 0; while (n && !seen[i]) { seen[i] = 1; r.push(i); i = MOD(f(elemEnv(m, i)), n); } return r; }
      case 'd.walkIdx': { const n = m.length, seen = new Set(), r = []; let i = 0; while (i >= 0 && i < n && !seen.has(i)) { seen.add(i); r.push(i); i = f({ i, x: m[i], n }); } return r; }
    } }
  if (ns === 'seg') { const m = ev(A[A.length - 1], L, O, hook); let segsV;
    if (t.p === 'seg.spl') { const f = lamF(A[0], m, O, hook); segsV = []; let cur = null; for (let i = 0; i < m.length; i++) { if (f(elemEnv(m, i))) { if (!cur) { cur = []; segsV.push(cur); } cur.push(m[i]); } else cur = null; } }
    else if (t.p === 'seg.segs') { segsV = []; for (let i = 0; i < m.length; i++) for (let j = i + 1; j <= m.length; j++) segsV.push(m.slice(i, j)); }
    else if (t.p === 'seg.runs') { const f = lamF(A[0], m, O, hook); segsV = []; if (m.length) { segsV.push([m[0]]); for (let i = 1; i < m.length; i++) { if (f({ a: m[i - 1], b: m[i], i })) segsV[segsV.length - 1].push(m[i]); else segsV.push([m[i]]); } } }
    else throw new Error('seg ' + t.p);
    return segsV; }
  if (t.p === 'l.segLast') { const S = sub(0); return S[S.length - 1] || []; }
  if (ns === 'l') { const m = sub(0); const G = statsOf(m);
    const f1 = A[1] && A[1].lam ? lamF(A[1], m, O, hook) : null;
    const pair = (a, b, i) => f1({ a, b, i });
    switch (t.p) {
      case 'l.filter': return m.filter((x, i) => f1(elemEnv(m, i)));
      case 'l.sortBy': case 'l.sortByDesc': { const k = m.map((x, i) => f1(elemEnv(m, i))); const s = t.p === 'l.sortBy' ? 1 : -1; return m.map((x, i) => i).sort((a, b) => s * (k[a] - k[b]) || a - b).map((i) => m[i]); }
      case 'l.sortBy2': { const f2 = lamF(A[2], m, O, hook); const k = m.map((x, i) => f1(elemEnv(m, i))), k2 = m.map((x, i) => f2(elemEnv(m, i))); return m.map((x, i) => i).sort((a, b) => k[a] - k[b] || k2[a] - k2[b] || a - b).map((i) => m[i]); }
      case 'l.rev': return [...m].reverse();
      case 'l.take': return m.slice(0, Math.max(0, NN(1, m)));
      case 'l.drop': return m.slice(Math.max(0, NN(1, m)));
      case 'l.slice': { const a = sub(1, m), b = sub(2, m); return a < 0 ? [] : m.slice(a, Math.max(a, b)); }
      case 'l.rotate': { if (!m.length) return m; const k = MOD(NN(1, m), m.length); return [...m.slice(k), ...m.slice(0, k)]; }
      case 'l.splitAt': { const k = Math.max(0, sub(1, m)); return [...ev(A[2], m.slice(0, k), O, hook), ...ev(A[3], m.slice(k), O, hook)]; }
      case 'l.cat': return [...m, ...sub(1)];
      case 'l.ilv': { const B = sub(1); const r = []; for (let i = 0; i < Math.max(m.length, B.length); i++) { if (i < m.length) r.push(m[i]); if (i < B.length) r.push(B[i]); } return r; }
      case 'l.runsMap': { const r = []; let s = 0; for (let i = 1; i <= m.length; i++) if (i === m.length || !pair(m[i - 1], m[i], i)) { r.push(...ev(A[2], m.slice(s, i), O, hook)); s = i; } return r; }
      case 'l.chunksMap': { const k = A[1].v; const r = []; for (let i = 0; i < m.length; i += k) r.push(...ev(A[2], m.slice(i, i + k), O, hook)); return r; }
      case 'l.runsBest': { let bs = 0, bl = 0, s = 0; for (let i = 1; i <= m.length; i++) if (i === m.length || !pair(m[i - 1], m[i], i)) { if (i - s > bl) { bl = i - s; bs = s; } s = i; } return m.slice(bs, bs + bl); }
      case 'l.stackCancel': { const s = []; m.forEach((x, i) => { if (s.length && pair(s[s.length - 1], x, i)) s.pop(); else s.push(x); }); return s; }
      case 'l.stackWhile': { const s = []; m.forEach((x, i) => { while (s.length && pair(s[s.length - 1], x, i)) s.pop(); s.push(x); }); return s; }
      case 'l.stackRepl': { const s = []; m.forEach((x, i) => { if (s.length && pair(s[s.length - 1], x, i)) s[s.length - 1] = x; else s.push(x); }); return s; }
      case 'l.passLR': { const r = [...m]; for (let i = 0; i + 1 < r.length; i++) if (pair(r[i], r[i + 1], i)) { const q = r[i]; r[i] = r[i + 1]; r[i + 1] = q; } return r; }
      case 'l.passRL': { const r = [...m]; for (let i = r.length - 2; i >= 0; i--) if (pair(r[i], r[i + 1], i)) { const q = r[i]; r[i] = r[i + 1]; r[i + 1] = q; } return r; }
      case 'l.twoPtr': { const r = []; let i = 0, j = m.length - 1; while (i <= j) r.push(pair(m[i], m[j], i) ? m[i++] : m[j--]); return r; }
      case 'l.hop': { const r = []; let i = 0; while (i < m.length) { r.push(m[i]); const s = f1(elemEnv(m, i)); if (s < 1) break; i += s; } return r; }
      case 'l.walk': { const n = m.length, seen = new Uint8Array(n), r = []; let i = 0; while (n && !seen[i]) { seen[i] = 1; r.push(m[i]); i = MOD(f1(elemEnv(m, i)), n); } return r; }
      case 'l.walkIdx': { const n = m.length, seen = new Set(), r = []; let i = 0; while (i >= 0 && i < n && !seen.has(i)) { seen.add(i); r.push(m[i]); i = f1({ i, x: m[i], n }); } return r; }
      case 'l.josephus': { const k = A[1].v; if (k > 4) return m; const a = [...m], r = []; let i = 0; while (a.length) { i = (i + k) % a.length; r.push(a.splice(i, 1)[0]); } return r; }
      case 'l.move': { const f = sub(1, m), to = sub(2, m); if (f < 0 || f >= m.length) return m; const r = [...m]; const [v] = r.splice(f, 1); const tt = to < 0 || to > r.length ? r.length : to; r.splice(tt, 0, v); return r; }
      case 'l.removeAt': { const f = NN(1, m), k = A[2].v; if (f < 0 || f >= m.length || k < 1 || k > 3) return m; return [...m.slice(0, f), ...m.slice(f + k)]; }
      case 'l.swap': { const a = sub(1, m), b = sub(2, m); if (a < 0 || b < 0 || a >= m.length || b >= m.length) return m; const r = [...m]; const q = r[a]; r[a] = r[b]; r[b] = q; return r; }
      case 'l.takeWhile': { let i = 0; while (i < m.length && f1(elemEnv(m, i))) i++; return m.slice(0, i); }
      case 'l.dropWhile': { let i = 0; while (i < m.length && f1(elemEnv(m, i))) i++; return m.slice(i); }
      case 'l.segLast': return m;   // unreachable (seg.* below)
    } }
  if (t.p.startsWith('dsl.')) { if (!DSLREF) throw new Error('call loadRefs() first'); return DSLREF.evalTerm(toDslTerm(t.dsl), O.__l); }
  throw new Error('eval ' + t.p);
}
// rebuild a dsl term with closures for the reference evaluator (opaque nodes only)
function toDslTerm(t) { if (t.leaf !== undefined) return { leaf: t.leaf }; if (t.lit !== undefined) return t.lit;
  return { p: t.name, a: t.args.map((x) => (x.lamS ? { s: x.lamS, f: lamClosure(x) } : x.lit !== undefined ? x.lit : toDslTerm(x))) }; }
function lamClosure(x) { const e = parseLam(x.lamS, x.ctx);
  if (x.ctx === 'E') return (env) => { const [xx, i, L, G] = env; const srt = [...L].sort(asc); return evalLam(e, { x: xx, i, n: L.length, prv: i > 0 ? L[i - 1] : 0, nxt: i + 1 < L.length ? L[i + 1] : 0, srt: srt[i], L, G: statsOf(L), O: { l0: G[0], last: G[1], sec: G[2], sum: G[3], mx: G[4], mn: G[5], n: G[6] } }); };
  if (x.ctx === 'R') return (env) => evalLam(e, { a: env[0], b: env[1] });
  if (x.ctx === 'R3') return (env) => evalLam(e, { c: env[0], x: env[1], i: env[2] });
  if (x.ctx === 'W') return (env) => evalLam(e, { i: env[0], x: env[1], G: { n: env[2] } });
  return (env) => evalLam(e, { a: env[0], b: env[1], c: env[2] }); }
export function showIR(t) { if (t.lam) return showLam(t.lam); if (t.p === '#') return String(t.v); if (t.p.startsWith('dsl.')) return t.p; return t.a.length ? `${t.p}(${t.a.map(showIR).join(', ')})` : t.p; }
// library show-string ⇒ library AST {p,a}
export function parseLib(s) { let p = 0; const term = () => { const m = /^[a-zA-Z0-9_.]+/.exec(s.slice(p)); if (!m) throw new Error('lib term at ' + p); p += m[0].length; const a = []; if (s[p] === '(') { p++; while (true) { a.push(term()); if (s[p] === ',') { p++; continue; } if (s[p] === ')') { p++; break; } throw new Error('lib , at ' + p); } } return { p: m[0], a }; }; const t = term(); if (p !== s.length) throw new Error('lib trailing'); return t; }
