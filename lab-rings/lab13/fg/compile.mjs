// compile.mjs - Track B: a program found by the grammar search (AST) ⇒ strict machine code.
//   await compileAst(ast, spec, opts?) ⇒ {ok:true, prog, len, how, parts, fallbacks, notes, ms, ir} | {ok:false, reason, notes, ms}
//   ast: a library-dialect / G0 AST {p,a} (Track A's grammar.mjs names), an IR node (ir.mjs), or a dsl show-string. spec: {kind, src?}.
//   opts: noFallback (bricks only) · selfCheck:false (skip the witness self-check) · obsN (sample instead of all 109,601 lists) · throwOnCrash
//   ok:true means the program already passed a self-check against the AST's own witness (3000 strict examples + deepRelocOk). It never throws.
//   The compiler never reads spec.src: it uses the AST's own witness (ir.mjs evaluator) to learn hole tables and to make sub-specs.
//   spec.src (if given) is used only by the final strict check, the same way brain-all.mjs checks any stage's program.
// Structure:
//   list ⇒ list : chain surgery. Every list operation reads the chain at cell 1 and writes its result chain back to cell 1.
//                 Most operations are EMITTERS: they walk the input chain (unchanged) pushing the output elements on the stack, and
//                 RELINK rebuilds the chain from the stack (bricks.mjs). Sorts are stable key-value sweeps, reversal is pointer reversal.
//   list ⇒ number: stream fusion. A producer (elements / map / adjacent pairs / chunk pairs / all pairs) feeds a sink (len, sum, min, max,
//                 first, last, argmax, argmin, maxrun) in one pass; number operators are holes filled by table. Any list transformation
//                 under a sink runs inside SAVEL/RESTL (the list is restored), so the answer leaves the list intact.
//   FALLBACK:     any list⇒list or list⇒number sub-term without a brick (or whose holes cannot be filled) becomes a sub-spec for
//                 the machine's own stages (subspec.mjs ⇒ brain-all solveAny) and its program is inlined.
import fs from 'fs';
import { run } from '../machine3s.mjs';
import { assemble, JLT, JNE, JEQ, callTool, ADDW, SUBW } from '../greedylib.mjs';
import { deepRelocOk } from '../jumpfix.mjs';
import { T_, P_, MV, SET, INC, DEC, GOTO, LOADAT, STOREAT, PUSHK, JZ, JNZ, NEXT, SAVEL, RESTL, RELINK, CANON, scan, walkTo, countN, chainRev, lab, LISTC } from './bricks.mjs';
import { compileVals, compileTable, LCELLS, varOf } from './lamc.mjs';
import { evalIR, evalAt, statsOf, fromLib, fromDsl, parseDsl, loadRefs, showIR, lamVars, evalLam, BOOLOPS } from './ir.mjs';
import { solveSub, SUBSTATS } from './subspec.mjs';
const shiftC = (p, o) => p.map((x) => (x[2] === 'code' && x[1] >= 0 ? ['WHERE', x[1] + o, 'code'] : x));
const say = (...a) => { if (process.env.FGDBG) console.error('[fg]', ...a); };
const R = (k) => Math.floor(Math.random() * k);
function* allLists() { const cur = []; const used = new Array(16).fill(false);
  function* rec() { yield cur.slice(); if (cur.length === 8) return; for (let v = 8; v <= 15; v++) if (!used[v]) { used[v] = true; cur.push(v); yield* rec(); cur.pop(); used[v] = false; } } yield* rec(); }
const ALL = [...allLists()];
const sampleLists = (n) => { if (n >= ALL.length) return ALL; const out = [[]]; for (let k = 0; k < 9; k++) out.push(ALL.find((l) => l.length === k)); while (out.length < n) out.push(ALL[R(ALL.length)]); return out; };

// ───────── observation: what the witness computes, where ─────────
function observe(ir, lists) {
  const lam = new Map(), vals = new Map(), ops = new Map(), last = new Map();
  const hook = {
    lam(n, E) { let m = lam.get(n); if (!m) { m = { vars: [...lamVars(n.lam)].filter((v) => v !== 'L'), map: new Map(), cnt: hasCnt(n.lam) }; lam.set(n, m); }
      const k = m.vars.map((v) => varOf(E, v)).join(',') + '|' + E.i + '|' + (E.G ? E.G.n : '') + (m.cnt ? '|' + cntNodes(n.lam).map((c) => evalLam(c, E)).join(',') : ''); if (!m.map.has(k)) m.map.set(k, E); },
    node(t, v) { last.set(t, v); let s = vals.get(t); if (!s) { s = { min: Infinity, max: -Infinity, n: 0, nonInt: 0, set: new Set(), emin: Infinity, emax: -Infinity }; vals.set(t, s); }
      if (typeof v === 'number') { if (v < s.min) s.min = v; if (v > s.max) s.max = v; if (!Number.isInteger(v)) s.nonInt++; if (s.set.size < 64) s.set.add(v); }
      else if (typeof v === 'boolean') { const x = v ? 1 : 0; if (x < s.min) s.min = x; if (x > s.max) s.max = x; s.bool = true; }
      else if (Array.isArray(v)) { let sm = 0; for (const x of v) if (typeof x === 'number') { sm += x; if (x < s.emin) s.emin = x; if (x > s.emax) s.emax = x; } s.maxLen = Math.max(s.maxLen || 0, v.length); s.maxSum = Math.max(s.maxSum || 0, sm); }
      s.n++;
      if (t.a && t.a.length && !t.p.startsWith('l.') && !t.p.startsWith('d.')) { const ks = t.a.map((c) => (c.lam ? null : last.get(c))); let m = ops.get(t); if (!m) { m = new Map(); ops.set(t, m); } const key = ks.join(','); if (!m.has(key)) m.set(key, { k: ks, y: v }); } },
  };
  for (const l of lists) { try { evalIR(ir, [...l], { hook }); } catch (e) { /* witness may throw on odd inputs: those lists are skipped */ } }
  return { lam: (n) => [...(lam.get(n)?.map.values() || [])], vals: (t) => vals.get(t), ops: (t) => [...(ops.get(t)?.values() || [])] };
}
const hasCnt = (e) => !!e && (!!e.cnt || !!e.tdep || (e.a || []).some(hasCnt));   // G1: a tree depth also reads the whole list
const cntNodes = (e, out = []) => { if (!e) return out; if (e.cnt || e.tdep) out.push(e); else (e.a || []).forEach((c) => cntNodes(c, out)); return out; };

// ───────── compile context ─────────
class Fail extends Error {}
const RECOVER = /no tool|not available|out of|needs|no temp|no room|not a function|unsupported|nested|key has|var |no scratch|cells|wide|range|negative|no brick|not solved|stat/;
const recoverable = (e) => e instanceof Fail || RECOVER.test(e.message || '');
function mkCtx(ir, spec, opts) { return { ir, spec, obs: null, parts: [], fallbacks: 0, opts, notes: [] }; }
const inRange = (s, lo = 0, hi = 15) => !!s && s.min >= lo && s.max <= hi && !s.nonInt;
const width = (s) => (s ? s.max - s.min : Infinity);
class Pool { constructor(cells = [0, 2, 3, 4, 5, 6, 7]) { this.f = [...cells]; } take() { const c = this.f.shift(); if (c == null) throw new Fail('no temp (cells)'); return c; } has() { return this.f.length > 0; } peek() { return this.f[0]; } rest() { return [...this.f]; } drop(c) { this.f = this.f.filter((x) => x !== c); } }
// stat variables ⇒ synthetic N nodes on the current list
const LID = () => ({ p: 'l.id', a: [] });
const STATNODE = { 'g.n': () => ({ p: 'agg.len', a: [LID()] }), 'g.l0': () => ({ p: 'agg.first', a: [LID()] }), 'g.last': () => ({ p: 'agg.last', a: [LID()] }),
  'g.mn': () => ({ p: 'agg.min', a: [LID()] }), 'g.mx': () => ({ p: 'agg.max', a: [LID()] }), 'g.sum': () => ({ p: 'agg.sum', a: [LID()] }),
  'g.q': () => ({ p: 'agg.mean', a: [LID()] }), 'g.r': () => ({ p: 'agg.meanrem', a: [LID()] }),   // G1: floor mean and remainder of the current list
  'g.sec': () => ({ p: 'g.at', a: [LID(), { p: '#', v: 1 }] }) };
const statKey = (v) => 'g.' + v.slice(2);
// G1 compiler: after Sx ⇐ Sx + v (mod 16), a wrap shows as Sx < v: saturate at 15
function BORROWJ(Sx, v, SC, K) { const W = lab('sw'); return [...JLT(Sx, v, SC, W), ...GOTO(K), W, ...SET(Sx, 15), K]; }
// jump to l if cell c == constant k (stack only)
function JEQK(c, k, l) { const s = lab('eqk'); return [...T_(c), ...PUSHK((16 - k) & 15), ['ADD'], ['J', s], ...GOTO(l), s]; }
// a = b - c (mod 16) without holes: b + not(c) + 1
const SUBC = (a, b, c) => [...T_(b), ...T_(c), ...T_(c), ['CALC'], ['ADD'], ...PUSHK(1), ['ADD'], ...P_(a)];

// ═════════ numbers: genN(t, env) ⇒ code leaving t's value in cell 2, list (1, 8..15) intact, stack balanced ═════════
// env: {cur: IR node of the current list (null = original input), orig: chain at cell 1 is the original input, mod16: value needed only mod 16, cap: value needed as min(15, v)}
async function genN(C, t, env) {
  const s = C.obs.vals(t);
  if (!env.mod16 && !env.cap && s && !s.bool && !inRange(s)) throw new Fail(`${t.p} value ${s.min}..${s.max} needs wide arithmetic`);
  try { return await genN0(C, t, env); }
  catch (e) { if (!recoverable(e)) throw e; say('N brick failed', t.p, e.message); C.notes.push(`${t.p}: ${e.message}`); return await fallbackN(C, t, env); }
}
async function fallbackN(C, t, env) {
  if (C.opts.noFallback) throw new Fail('no brick for ' + t.p + ' (fallback off)');
  const sv = C.obs.vals(t);
  if (!env.mod16 && sv && !sv.bool && !inRange(sv)) throw new Fail('sub-spec value out of range');
  const cur = env.cur;
  const input = (l) => (cur ? evalIR(cur, l) : l), want = (l) => { const v = evalAt(t, input(l), l); const x = typeof v === 'boolean' ? (v ? 1 : 0) : v; return env.cap ? Math.min(15, x) : x; };
  const r = await solveSub({ kind: 'list2num', input, want, label: showIR(t).slice(0, 80) });
  if (!r || !r.prog) throw new Fail('sub-spec for ' + t.p + ' not solved' + (r && r.why ? ' (' + r.why + ')' : ''));
  C.fallbacks++; C.parts.push({ sub: showIR(t).slice(0, 80), kind: 'list2num', stage: r.stage, len: r.prog.length, input: cur ? 'derived list' : 'input list', whole: t === C.ir, reloc: r.reloc || null, cached: !!r.cached });
  return [{ code: r.prog }];   // the machine's list⇒number programs keep the list intact and answer in cell 2
}
const BINOPS = new Set(['g.add', 'g.sub', 'g.absd', 'g.mod', 'g.min', 'g.max', 'g.mul', 'g.div', 'g.dflt', 'b.lt', 'b.eq', 'b.le']);
const UNOPS = new Set(['g.half', 'g.cap15', 'g.and15', 'g.inc', 'b.odd', 'g.ltK']);
const HOMO = new Set(['g.add', 'g.sub', 'g.mul', 'g.and15', 'g.inc']);   // (x mod 16) in ⇒ (y mod 16) out
const COUNTS = new Set(['agg.len', 'g.cntPairs', 'g.cntTriples']);
async function genN0(C, t, env) {
  const p = t.p;
  if (p === '#') { if (!env.mod16 && (t.v < 0 || t.v > 15)) throw new Fail('constant out of range'); return SET(2, t.v & 15); }
  if (STATNODE[p]) return await genSink(C, STATNODE[p](), env, t);
  if (p === 'g.ite') { const c0 = await genN(C, t.a[0], { ...env, mod16: false, cap: false }); const E = lab('ie'), D = lab('id'); const a = await genN(C, t.a[1], env), b = await genN(C, t.a[2], env);
    return [...c0, ...JZ(2, E), ...a, ...GOTO(D), E, ...b, D]; }
  if (BINOPS.has(p) || UNOPS.has(p)) {
    const kids = p === 'g.ltK' ? [t.a[0]] : t.a;
    // operand representation: exact 0..15 · mod 16 (homomorphic parent, or values span ≤ 16 numbers) · capped at 15 (under cap15, counts)
    let reps; try { reps = kids.map((k) => { const s = C.obs.vals(k); if (s && (s.bool || inRange(s))) return 'exact'; if ((env.mod16 && HOMO.has(p)) || width(s) <= 15) return 'mod16'; if (p === 'g.cap15' && (COUNTS.has(k.p) || (k.p === 'agg.sum' && s && s.min >= 0))) return 'cap'; throw new Fail(`operand of ${p} needs wide arithmetic`); }); }
    catch (e) { return await fusedN(C, t, env); }
    const code = [];
    for (let j = 0; j < kids.length; j++) code.push(...(await genN(C, kids[j], { ...env, mod16: reps[j] === 'mod16', cap: reps[j] === 'cap' })), ...T_(2));
    const cells = kids.length === 1 ? [3] : [3, 4]; for (let j = kids.length - 1; j >= 0; j--) code.push(...P_(cells[j]));
    const rep = (x, j) => (typeof x === 'boolean' ? (x ? 1 : 0) : reps[j] === 'mod16' ? x & 15 : reps[j] === 'cap' ? Math.min(15, x) : x);
    const rows = C.obs.ops(t).filter((r) => r.k.slice(0, kids.length).every((x) => typeof x === 'number' || typeof x === 'boolean')).map((r) => ({ k: r.k.slice(0, kids.length).map(rep), y: typeof r.y === 'boolean' ? (r.y ? 1 : 0) : env.cap ? Math.min(15, r.y) : r.y }));
    // booleans produced by bricks are 'nonzero'; normalise operands that are booleans to 1/0 first
    for (let j = 0; j < kids.length; j++) if (C.obs.vals(kids[j])?.bool) { const F = lab('nb'); code.push(...JZ(cells[j], F), ...SET(cells[j], 1), F); }
    const vars = kids.map((_, j) => '$' + j); const cm = {}; vars.forEach((v, j) => { cm[v] = cells[j]; });
    code.push(...compileTable(vars, rows, cm, 2, { mode: env.mod16 ? 'mod16' : 'num', live: [], free: LCELLS.filter((c) => !cells.includes(c)) }));
    return code; }
  if (p.startsWith('agg.') || ['g.findIdx', 'g.findLast', 'g.cntPairs', 'g.cntTriples', 'g.at', 'g.indexOf', 'g.indexOfIn', 'g.fold', 'g.cntWin3'].includes(p)) return await genSink(C, t, env, t);
  throw new Fail('unsupported number node ' + p);
}
// an arithmetic sub-tree whose intermediate values are wide but whose leaves are small: one hole over the leaves (table from the witness)
const ARITH = new Set([...BINOPS, ...UNOPS]);
function fusedLeaves(t, out = []) { if (ARITH.has(t.p)) { for (const k of t.p === 'g.ltK' ? [t.a[0]] : t.a) fusedLeaves(k, out); } else if (t.p !== '#' && !out.includes(t)) out.push(t); return out; }
async function fusedN(C, t, env) {
  const leaves = fusedLeaves(t); if (!leaves.length || leaves.length > 3) throw new Fail('wide arithmetic over ' + leaves.length + ' terms');
  const reps = leaves.map((k) => { const s = C.obs.vals(k); if (s && (s.bool || inRange(s))) return 'exact'; if (width(s) <= 15) return 'mod16'; throw new Fail('wide leaf ' + k.p); });
  const code = []; for (let j = 0; j < leaves.length; j++) code.push(...(await genN(C, leaves[j], { ...env, mod16: reps[j] === 'mod16', cap: false })), ...T_(2));
  const cells = [3, 4, 5].slice(0, leaves.length); for (let j = leaves.length - 1; j >= 0; j--) code.push(...P_(cells[j]));
  const rep = (x, j) => (typeof x === 'boolean' ? (x ? 1 : 0) : reps[j] === 'mod16' ? x & 15 : x);
  const rows = []; const seen = new Set();
  for (const l of C.obsLists) { const m = env.cur ? evalIR(env.cur, l) : l; let ks, y; try { ks = leaves.map((k, j) => rep(evalAt(k, m, l), j)); y = evalAt(t, m, l); } catch { continue; }
    if (typeof y === 'boolean') y = y ? 1 : 0; if (env.cap) y = Math.min(15, y); const key = ks.join(','); if (!seen.has(key)) { seen.add(key); rows.push({ k: ks, y }); } }
  for (let j = 0; j < leaves.length; j++) if (C.obs.vals(leaves[j])?.bool) { const F = lab('nb'); code.push(...JZ(cells[j], F), ...SET(cells[j], 1), F); }
  const vars = leaves.map((_, j) => '$' + j); const cm = {}; vars.forEach((v, j) => { cm[v] = cells[j]; });
  code.push(...compileTable(vars, rows, cm, 2, { mode: env.mod16 ? 'mod16' : 'num', live: [], free: LCELLS.filter((c) => !cells.includes(c)) }));
  return code; }
// numbers parked in cells before a frame runs: each computed on the current list, pushed, then popped into pool cells.
// item: {n: node, rep: 'exact'|'idx'} (idx: an index bound, clamped to 0..15, so take(-1) = take(0)) | {stat: 'g.n' ..}
async function park(C, items, env, pool) { const r = await park0(C, items, env, pool); return { code: [...r.comp, ...r.pops], cells: r.cells }; }
async function park0(C, items, env, pool) {
  const code = []; const cells = [];
  for (const it of items) {
    if (it.stat) { const z = STATNODE[it.stat]?.(); if (!z) throw new Fail('stat ' + it.stat + ' not available'); code.push(...(await genSink(C, z, { ...env, mod16: false, cap: false }, null)), ...T_(2)); continue; }
    const n = it.n;
    if (n.synth) { code.push(...(await genNsynth(C, n, env)), ...T_(2)); continue; }
    const s = C.obs.vals(n);
    if (!s || inRange(s)) { code.push(...(await genN(C, n, { ...env, mod16: false, cap: false })), ...T_(2)); continue; }
    if (it.rep === 'idx' && width(s) <= 15) { code.push(...(await genN(C, n, { ...env, mod16: true, cap: false })));
      const rows = [...s.set].map((v) => ({ k: [v & 15], y: Math.max(0, Math.min(15, v)) })); code.push(...compileTable(['$0'], rows, { $0: 2 }, 2, { mode: 'num', free: [0, 3, 4, 5, 6, 7] }), ...T_(2)); continue; }
    if (it.rep === 'mod16') { code.push(...(await genN(C, n, { ...env, mod16: true, cap: false })), ...T_(2)); continue; }
    throw new Fail('parked number out of range');
  }
  const pops = []; for (let j = items.length - 1; j >= 0; j--) { const c = pool.take(); cells[j] = c; pops.push(...P_(c)); }
  return { comp: code, pops, cells };
}
// synthetic operator over real nodes (removeAt's f+k, rotate's K mod n): parts computed, operator filled by table from the parts' witness values
async function genNsynth(C, n, env) {
  const parts = n.a; const code = []; const reps = [];
  for (const k of parts) { const s = C.obs.vals(k); const rp = !s || inRange(s) ? 'exact' : width(s) <= 15 ? 'mod16' : null; if (!rp) throw new Fail('synthetic operand out of range'); reps.push(rp); code.push(...(await genN(C, k, { ...env, mod16: rp === 'mod16', cap: false })), ...T_(2)); }
  code.push(...P_(4), ...P_(3));
  const rows = []; const seen = new Set();
  for (const l of C.obsLists) { const m = env.cur ? evalIR(env.cur, l) : l; let a, b; try { a = evalAt(parts[0], m, l); b = evalAt(parts[1], m, l); } catch { continue; }
    const y = n.p === 'g.add' ? a + b : n.p === 'g.sub' ? a - b : n.p === 'g.mod' ? (b > 0 ? ((a % b) + b) % b : 0) : null; const ka = reps[0] === 'mod16' ? a & 15 : a, kb = reps[1] === 'mod16' ? b & 15 : b; const k = ka + ',' + kb; if (!seen.has(k)) { seen.add(k); rows.push({ k: [ka, kb], y: Math.max(0, Math.min(15, y)) }); } }
  code.push(...compileTable(['$0', '$1'], rows, { $0: 3, $1: 4 }, 2, { mode: 'num', free: [0, 2, 5, 6, 7] }));
  return code; }

// ───────── nested pair counts inside element lambdas (#before / #after / #all): a loop over the chain at cell 1 ─────────
function mkExtra(C, cells, lamNode) {
  return { cntCode: (node, out, live, free, obs) => {
    if (node.tdep) return tdepCode(C, cells, node, out, live, free, obs);
    const fr = free.filter((c) => !live.includes(c) && c !== out && c !== 1); if (fr.length < 2) throw new Fail('no temp for nested count');
    const Y = fr[0], G = fr[1]; const X = cells.x; if (X == null) throw new Fail('nested count needs x');
    // rel obs: every (x, other element) pair seen
    const robs = []; const seen = new Set(); const rv = [...lamVars(node.rel)].filter((v) => v !== 'L');
    for (const o of obs) { const L = o.L; if (!L) continue; for (let j = 0; j < L.length; j++) { if (j === o.i) continue; const z = { ...o, a: o.x, b: L[j] }; const k = rv.map((v) => varOf(z, v)).join(','); if (!seen.has(k)) { seen.add(k); robs.push(z); } } }
    const rcells = { ...cells, a: X, b: Y };
    const relCode = compileVals(node.rel, robs, rcells, G, { mode: 'bool', live: [...live, X, Y, out], free: fr.slice(2).concat([G]).filter((c) => c !== Y), valf: (o) => evalLam(node.rel, o) });
    const L = lab('nc'), D = lab('ncd'), S = lab('ncs');
    const start = node.cnt === 'after' ? [...MV(X, Y), ...NEXT(Y)] : MV(1, Y);
    const stop = node.cnt === 'before' ? JEQ(Y, X, G, D) : node.cnt === 'all' ? JEQ(Y, X, G, S) : [];
    return [...SET(out, 0), ...start, L, ...JZ(Y, D), ...stop, ...relCode, ...JZ(G, S), ...INC(out), S, ...NEXT(Y), ...GOTO(L), D]; } };
}
// G1: depth of the current element x in the search tree built by inserting the chain at cell 1 in order (left when key < key(node)).
// No tree is stored: y (before x) is an ancestor of x exactly when every z before y sends y and x to the same side.
function tdepCode(C, cells, node, out, live, free, obs) {
  const fr = free.filter((c) => !live.includes(c) && c !== out && c !== 1); const X = cells.x; if (X == null) throw new Fail('tree depth needs x');
  const key = node.tdep; const ident = key.v === 'x';
  const kv = [...lamVars(key)].filter((v) => v !== 'L'); if (kv.some((v) => ['i', 'prv', 'nxt'].includes(v))) throw new Fail('tree key reads the position');
  if (fr.length < (ident ? 3 : 6)) throw new Fail('no temp for tree depth');
  const [Y, Z, S, KX0, KY0, KZ0] = fr; const KX = ident ? X : KX0, KY = ident ? Y : KY0, KZ = ident ? Z : KZ0;
  let kcode = () => [];
  if (!ident) { // the key as a hole over x (and list stats), from every element of every list seen; ranked when it leaves 0..15
    const kobs = []; const seen = new Set(); for (const o of obs) { const L = o.L; if (!L) continue; for (let j = 0; j < L.length; j++) { const z = { ...o, x: L[j], i: j }; const k = kv.map((v) => varOf(z, v)).join(','); if (!seen.has(k)) { seen.add(k); kobs.push(z); } } }
    const vals = [...new Set(kobs.map((o) => evalLam(key, o)))].sort((a, b) => a - b); if (vals.length > 16) throw new Fail('key has more than 16 values');
    const rk = vals.every((v) => v >= 0 && v <= 15) ? null : new Map(vals.map((v, i) => [v, i])); const valf = (o) => (rk ? rk.get(evalLam(key, o)) : evalLam(key, o));
    const rest = fr.slice(6);
    kcode = (src, dst, lv) => compileVals(key, kobs, { ...cells, x: src }, dst, { mode: 'num', live: lv, free: [...rest, dst], valf }); }
  const LY = lab('ty'), LZ = lab('tz'), YL = lab('tl'), NZ = lab('tn'), ANC = lab('ta'), NA = lab('tb'), DONE = lab('td');
  const lv0 = [...live, X, out, Y, Z, S, ...(ident ? [] : [KX, KY, KZ])];
  return [...(ident ? [] : kcode(X, KX, lv0.filter((c) => c !== KX))), ...SET(out, 1), ...MV(1, Y),
    LY, ...JEQ(Y, X, S, DONE), ...(ident ? [] : kcode(Y, KY, lv0.filter((c) => c !== KY))), ...MV(1, Z),
    LZ, ...JEQ(Z, Y, S, ANC), ...(ident ? [] : kcode(Z, KZ, lv0.filter((c) => c !== KZ))),
    ...JLT(KY, KZ, S, YL), ...JLT(KX, KZ, S, NA), ...GOTO(NZ), YL, ...JLT(KX, KZ, S, NZ), ...GOTO(NA),
    NZ, ...NEXT(Z), ...GOTO(LZ), ANC, ...INC(out), NA, ...NEXT(Y), ...GOTO(LY), DONE]; }
// a hole inside a frame: every cell the frame holds (not in its pool) is live; if the hole needs more temps than are free,
// frame cells that the hole does not read are spilled to the stack around it
function lamCode(C, n, cells, out, live, pool, mode, valf) {
  return holeCode(n.lam, C.obs.lam(n), cells, out, live, pool, { mode, valf: valf || ((o) => evalLam(n.lam, o)), extra: mkExtra(C, cells, n) }); }
function holeCode(e, obs, cells, out, live, pool, args) {
  const free0 = pool.rest(); const held = LCELLS.filter((c) => !free0.includes(c) && c !== out);
  const liveAll = [...new Set([...live, ...held])].filter((c) => c !== out);
  try { return compileVals(e, obs, cells, out, { ...args, live: liveAll, free: free0.filter((c) => !liveAll.includes(c) && c !== out).concat([out]) }); }
  catch (err) { if (!/no temp|no room/.test(err.message)) throw err; }
  const reads = new Set([...lamVars(e)].map((v) => cells[v]).filter((c) => c != null));
  const spill = liveAll.filter((c) => !reads.has(c));
  for (let k = 1; k <= spill.length; k++) { const sp = spill.slice(0, k); const lv = liveAll.filter((c) => !sp.includes(c));
    try { const body = compileVals(e, obs, cells, out, { ...args, live: lv, free: [...free0, ...sp].filter((c) => !lv.includes(c) && c !== out).concat([out]) });
      return [...sp.flatMap((c) => T_(c)), ...body, ...[...sp].reverse().flatMap((c) => P_(c))]; } catch (err) { if (!/no temp|no room/.test(err.message)) throw err; } }
  throw new Fail('no temp for hole even with spilling');
}

// ───────── producers ⇒ sinks (stream fusion) ─────────
// parse a stream term: base producer over a list + stream transformers (scan, drop K, take K)
function streamOf(d) {
  const BASE = { 'd.map': 'map', 'd.mapD': 'map', 'd.adj': 'adj', 'd.adjD': 'adj', 'd.chunk2': 'chunk2', 'd.pairs': 'pairs', 'd.walk': 'walk', 'd.walkIdx': 'walkIdx', 'd.runlens': 'runlens' };
  if (d.p === 'd.runlens' && d.a[0].p.startsWith('d.')) { const s = streamOf(d.a[0]); s.steps.push({ k: 'runlens', lam: d.a[1] }); return s; }   // run lengths of a derived stream
  if ((d.p === 'd.mapD' || d.p === 'd.adjD') && d.a[0].p.startsWith('d.')) throw new Fail('map/adj over a derived stream');
  if (d.p === 'd.segs') return { base: 'segs', L: d.a[0], lam: d.a[1], pred: d.a[2], steps: [] };
  if (BASE[d.p]) return { base: BASE[d.p], L: d.a[0], lam: d.a[1], steps: [] };
  if (d.p === 'd.scan') { const s = streamOf(d.a[0]); s.steps.push({ k: 'scan' }); return s; }
  if ((d.p === 'l.drop' || d.p === 'l.take') && d.a[0].p.startsWith('d.') && d.a[1].p === '#') { const s = streamOf(d.a[0]); s.steps.push({ k: d.p === 'l.drop' ? 'drop' : 'take', v: d.a[1].v }); return s; }
  if (d.p === 'seg.spl') return { base: 'segstart', L: d.a[1], lam: d.a[0], steps: [] };
  if (d.p.startsWith('l.')) return { base: 'elem', L: d, lam: null, steps: [] };
  throw new Fail('unsupported producer ' + d.p);
}
// code that runs the producer over the chain at cell 1, calling item(vCell) for every stream item; brk label ends the stream early
function produce(C, S, pool, live, item, opts = {}) {
  // transformers wrap the item callback (inner-most first); finalizers flush state at the end of the stream (inner-most first)
  let emit = item; const pre = [], fin = [];
  for (const st of [...S.steps].reverse()) { const nxt = emit;
    if (st.k === 'scan') { const A = pool.take(); pre.push(...SET(A, 0)); live = [...live, A]; emit = (v) => [...T_(A), ...T_(v), ['ADD'], ...P_(A), ...nxt(A)]; }
    else if (st.k === 'drop' || st.k === 'take') { const K = pool.take(); pre.push(...SET(K, st.v)); live = [...live, K]; const kind = st.k;
      emit = (v) => { const s = lab('ds'), z = lab('dz'); return kind === 'drop' ? [...JZ(K, z), ...DEC(K), ...GOTO(s), z, ...nxt(v), s] : [...JZ(K, s), ...DEC(K), ...nxt(v), s]; }; }
    else if (st.k === 'runlens') { const RL = pool.take(), PV = pool.take(), IX = pool.take(); pre.push(...SET(RL, 0), ...SET(IX, 0)); live = [...live, RL, PV, IX]; const lv = live;
      emit = (v) => { const G = pool.peek(); if (G == null) throw new Fail('no temp (cells)'); const FIRST = lab('rf'), NEW = lab('rn'), DONE = lab('rd'); const cells = { ...(opts.statCells || {}), a: PV, b: v, i: IX };
        return [...JZ(IX, FIRST), ...lamCode(C, st.lam, cells, G, [...lv, v], pool, 'bool'), ...JZ(G, NEW), ...INC(RL), ...GOTO(DONE), NEW, ...nxt(RL), FIRST, ...SET(RL, 1), DONE, ...MV(v, PV), ...INC(IX)]; };
      fin.push(...(() => { const OUT = lab('ro'); return [...JZ(IX, OUT), ...nxt(RL), OUT]; })()); } }
  return [...pre, ...produceBase(C, S, pool, live, emit, opts), ...fin];
}
function produceBase(C, S, pool, live, emit, { mode = 'num', statCells = {}, valf = null, noValue = false } = {}) {
  const lamVarsOf = S.lam ? [...lamVars(S.lam.lam)] : [];
  const usesI = lamVarsOf.includes('i'); const cells0 = { ...statCells };
  for (const v of lamVarsOf) if ((v.startsWith('g.') || v.startsWith('o.')) && cells0[v] == null && !(v === 'g.n' && (S.base === 'walk' || S.base === 'walkIdx'))) throw new Fail('stat var ' + v + ' not parked');
  const X = pool.take();
  const code = [];
  const lamC = (cells, out, lv) => (noValue ? [] : lamCode(C, S.lam, cells, out, lv, pool, mode, valf));   // a sink that only counts items needs no item values
  if (S.base === 'elem') { const I = usesI ? pool.take() : null; code.push(...scan({ X, I }, () => emit(X))); return code; }
  if (S.base === 'map') { const I = usesI ? pool.take() : null; const needPrv = lamVarsOf.includes('prv'), needNxt = lamVarsOf.includes('nxt'); const PRV = needPrv ? pool.take() : null, NXT = needNxt ? pool.take() : null;
    const V = pool.take(); const cells = { ...cells0, x: X, ...(I != null ? { i: I } : {}), ...(PRV != null ? { prv: PRV } : {}), ...(NXT != null ? { nxt: NXT } : {}) };
    const lv = [...live, X, V, ...[I, PRV, NXT].filter((c) => c != null)];
    code.push(...scan({ X, I, PRV, NXT }, () => [...lamC(cells, V, lv), ...emit(V)])); return code; }
  if (S.base === 'adj' || S.base === 'chunk2') { const A = pool.take(); const I = usesI ? pool.take() : null; const V = pool.take(); const DI = lamVarsOf.includes('di') ? pool.take() : null; if (DI != null) code.push(...SET(DI, 1)); const cells = { ...cells0, a: A, b: X, ...(I != null ? { i: I } : {}), ...(DI != null ? { di: DI } : {}) }; const lv = [...live, X, A, V, ...(I != null ? [I] : []), ...(DI != null ? [DI] : [])];
    if (S.base === 'adj') { const F = lab('adf'); code.push(...SET(A, 0), ...scan({ X, I }, () => [...JZ(A, F), ...(I != null ? DEC(I) : []), ...lamC(cells, V, lv), ...(I != null ? INC(I) : []), ...emit(V), F, ...MV(X, A)])); return code; }
    if (I != null) throw new Fail('chunk2 with i'); const F = lab('chf'), OUT = lab('cho');
    code.push(...SET(A, 0), ...scan({ X }, ({ cont }) => [...JNZ(A, F), ...MV(X, A), ...GOTO(cont), F, ...lamC(cells, V, lv), ...SET(A, 0), ...emit(V)]), ...JZ(A, OUT), ...emit(A), OUT); return code; }
  if (S.base === 'pairs') { if (usesI) throw new Fail('pairs with i'); const Y = pool.take(), V = pool.take(); const DI = lamVarsOf.includes('di') ? pool.take() : null; const cells = { ...cells0, a: X, b: Y, ...(DI != null ? { di: DI } : {}) }; const lv = [...live, X, Y, V, ...(DI != null ? [DI] : [])]; const L2 = lab('pl'), D2 = lab('pd');
    code.push(...scan({ X }, () => [...MV(X, Y), ...(DI != null ? SET(DI, 0) : []), L2, ...NEXT(Y), ...(DI != null ? INC(DI) : []), ...JZ(Y, D2), ...lamC(cells, V, lv), ...emit(V), ...GOTO(L2), D2])); return code; }
  if (S.base === 'walk' || S.base === 'walkIdx') { pool.f.unshift(X); code.push(...walkCode(C, S.lam, S.base === 'walk', pool, cells0, { onVisit: (Xc, CUR) => emit(CUR) })); return code; }
  if (S.base === 'segs') { // every contiguous segment [i..j]: a = its sum (kept mod 16: the holes must be functions of it mod 16), b = its length
    if (usesI || (S.pred && lamVars(S.pred.lam).has('i'))) throw new Fail('segs with i');
    const Y = pool.take(), SM = pool.take(), LN = pool.take(), V = pool.take(); const cells = { ...cells0, a: SM, b: LN }; const lv = [...live, X, Y, SM, LN, V];
    const m16obs = (n) => C.obs.lam(n).map((o) => ({ ...o, a: o.a & 15, __o: o }));
    const hole = (n, out, md, vf) => holeCode(n.lam, m16obs(n), cells, out, lv.filter((c) => c !== out), pool, { mode: md, valf: vf || ((o) => evalLam(n.lam, o.__o)), extra: {} });
    const SK = lab('sgk'), L2 = lab('sgl');
    code.push(...scan({ X }, () => [...MV(X, Y), ...SET(SM, 0), ...SET(LN, 0), L2, ...T_(SM), ...T_(Y), ['ADD'], ...P_(SM), ...INC(LN), ...hole(S.pred, V, 'bool'), ...JZ(V, SK), ...(noValue ? [] : hole(S.lam, V, mode, valf ? (o) => valf(o.__o) : null)), ...emit(V), SK, ...NEXT(Y), ...JNZ(Y, L2)])); return code; }
  if (S.base === 'runlens') { // lengths of the runs where P(previous, this) holds; i = index of this
    const I = pool.take(), PRV = pool.take(), RL = pool.take(), G = pool.take(); const cells = { ...cells0, a: PRV, b: X, i: I }; const lv = [...live, X, I, PRV, RL];
    const OUT = lab('rlo'); code.push(...SET(RL, 0), ...scan({ X, I, PRV }, ({ cont }) => { const NEW = lab('rln'), F = lab('rlf'); return [...JZ(I, F), ...lamCode(C, S.lam, cells, G, lv, pool, 'bool'), ...JZ(G, NEW), ...INC(RL), ...GOTO(cont), NEW, ...emit(RL), F, ...SET(RL, 1)]; }), ...JZ(RL, OUT), ...emit(RL), OUT); return code; }
  if (S.base === 'segstart') { // one item per maximal segment where P holds
    const I = usesI ? pool.take() : null, FL = pool.take(), G = pool.take(); const cells = { ...cells0, x: X, ...(I != null ? { i: I } : {}) }; const lv = [...live, X, FL, ...(I != null ? [I] : [])];
    code.push(...SET(FL, 0), ...scan({ X, I }, ({ cont }) => { const OFF = lab('ssf'), ON = lab('sso'); return [...lamCode(C, S.lam, cells, G, lv, pool, 'bool'), ...JZ(G, OFF), ...JNZ(FL, ON), ...emit(X), ON, ...SET(FL, 15), ...GOTO(cont), OFF, ...SET(FL, 0)]; })); return code; }
  throw new Fail('producer ' + S.base);
}
// prepare the list a producer runs on (a list term other than the current list is computed on a saved copy: SAVEL..RESTL)
async function onList(C, L, env) {
  if (L.p === 'l.id') return { pre: [], post: [], orig: env.orig, cur: env.cur };
  const code = await genL(C, L, { ...env }); return { pre: [...SAVEL(), ...code], post: RESTL(), orig: false, cur: L };
}
const lamsOf = (t) => { const out = []; const rec = (x) => { if (!x) return; if (x.lam) { out.push(x); return; } if (x.p && x.p.startsWith('seg.')) (x.a || []).forEach(rec); }; (t.a || []).forEach(rec); return out; };
const statVarsOf = (lamNodes) => { const s = new Set(); for (const n of lamNodes) if (n) for (const v of lamVars(n.lam)) if (v.startsWith('g.') || v.startsWith('o.')) s.add(v); return [...s]; };
// stats + extra numbers: everything is computed (pushed) before anything is popped into its cell, so later computing code cannot clobber
// a parked value. Original-list stats parked across a transformation (env.parkedO) sit below them on the stack and are popped last.
async function parkStats(C, vars, env, pool, extra = []) {
  const map = {};
  const useParked = !env.orig && vars.some((v) => v.startsWith('o.'));
  if (useParked) { const ok = env.parkedO && vars.filter((v) => v.startsWith('o.')).every((v) => env.parkedO.includes(statKey(v))); if (!ok) throw new Fail('original-list stats on a derived list'); }
  const keys = [...new Set(vars.filter((v) => !(useParked && v.startsWith('o.'))).map(statKey))];
  const items = [...keys.map((k) => ({ stat: k })), ...extra];
  const { comp, pops, cells } = await park0(C, items, env, pool);
  const code = [...comp, ...pops];
  if (useParked) for (let j = env.parkedO.length - 1; j >= 0; j--) { const c = pool.take(); code.push(...P_(c)); map['o.' + env.parkedO[j].slice(2)] = c; }
  keys.forEach((k, j) => { map[k] = cells[j]; if (env.orig) map['o.' + k.slice(2)] = cells[j]; });
  return { code, map, cells: cells.slice(keys.length) }; }
async function genSink(C, t, env, vnode) {
  const p = t.p; const st = vnode ? C.obs.vals(vnode) : null;
  if (p === 'g.at' || p === 'g.indexOfIn') { // element of L at index N / index of value N in L  (N on the current list)
    const L = t.a[0], N = t.a[1]; const sN = C.obs.vals(N); const nrep = !sN || inRange(sN) ? 'exact' : (sN.min >= -8 && sN.max <= 15 && p === 'g.at') ? 'mod16' : null; if (!nrep) throw new Fail('index out of range');
    const nC = await genN(C, N, { ...env, mod16: nrep === 'mod16', cap: false }); const J = 4, X = 3, CNT = 5;
    const body = p === 'g.at' ? [...P_(J), ...walkTo(J, X, CNT), ...MV(X, 2)] : [...P_(J), ...SET(2, 15), ...SET(6, 0), ...scan({ X }, ({ brk }) => { const F = lab('fi'); return [...JNE(X, J, 0, F), ...MV(6, 2), ...GOTO(brk), F, ...INC(6)]; })];
    if (L.p === 'l.id') return [...nC, ...T_(2), ...body];
    const Lc = await genL(C, L, { ...env }); return [...SAVEL(), ...nC, ...T_(2), ...Lc, ...body, ...RESTL()]; }
  if (p === 'g.indexOf') { const nC = await genN(C, t.a[0], { ...env, mod16: false, cap: false }); const J = 4, X = 3; const F = lab('fi');
    return [...nC, ...MV(2, J), ...SET(2, 15), ...SET(6, 0), ...scan({ X }, ({ brk }) => [...JNE(X, J, 0, F), ...MV(6, 2), ...GOTO(brk), F, ...INC(6)])]; }
  if (p === 'g.cntWin3') { // G1: consecutive triples (a = previous, b = this, c = next) where the learned triple relation holds
    const L = t.a[0], lamT = t.a[1]; const { pre, post, orig } = await onList(C, L, env); const env2 = { ...env, orig, cur: L.p === 'l.id' ? env.cur : L };
    const pool = new Pool([0, 3, 4, 5, 6, 7]); const { code: sc, map: statCells } = await parkStats(C, statVarsOf([lamT]), env2, pool);
    const X = pool.take(), PRV = pool.take(), NXT = pool.take(), G = pool.take(); const cells = { ...statCells, a: PRV, b: X, c: NXT }; const lv = [2, ...Object.values(statCells), X, PRV, NXT];
    const tp = lamT.lam.tpair;
    if (tp) { // t.flip / t.peak: the pair relation is one hole, applied to (previous, this) and to (this, next)
      const H = pool.take(); const pobs = []; const seen = new Set(); const pv = [...lamVars(tp.rel)].filter((v) => v !== 'L');
      for (const o of C.obs.lam(lamT)) for (const [a, b] of [[o.a, o.b], [o.b, o.c]]) { const z = { ...o, a, b }; const k = pv.map((v) => varOf(z, v)).join(','); if (!seen.has(k)) { seen.add(k); pobs.push(z); } }
      const hole = (ca, cb, out, lv2) => holeCode(tp.rel, pobs, { ...statCells, a: ca, b: cb }, out, lv2, pool, { mode: 'bool', valf: (o) => evalLam(tp.rel, o), extra: {} });
      return [...pre, ...sc, ...SET(2, 0), ...scan({ X, PRV, NXT }, ({ cont }) => { const CNT = lab('wc'), Z1 = lab('wz');
        if (tp.kind === 'peak') return [...JZ(PRV, cont), ...JZ(NXT, cont), ...hole(PRV, X, G, lv), ...JZ(G, cont), ...hole(X, NXT, H, lv), ...JNZ(H, cont), ...INC(2)];
        return [...JZ(PRV, cont), ...JZ(NXT, cont), ...hole(PRV, X, G, lv), ...hole(X, NXT, H, [...lv, G]), ...JZ(G, Z1), ...JNZ(H, cont), ...GOTO(CNT), Z1, ...JZ(H, cont), CNT, ...INC(2)]; }), ...post]; }
    return [...pre, ...sc, ...SET(2, 0), ...scan({ X, PRV, NXT }, ({ cont }) => [...JZ(PRV, cont), ...JZ(NXT, cont), ...lamCode(C, lamT, cells, G, lv, pool, 'bool'), ...JZ(G, cont), ...INC(2)]), ...post]; }
  // stream sinks
  let agg = p.startsWith('agg.') ? p.slice(4) : p; let prod = t.a[0]; let pred = null;
  if (p === 'g.findIdx' || p === 'g.findLast') { pred = t.a[1]; }
  if (p === 'g.cntPairs') { prod = { p: 'd.pairs', a: [t.a[0], t.a[1]] }; agg = 'count-true'; }
  if (p === 'g.cntTriples') { agg = 'triples'; }
  if (p === 'g.fold') { agg = 'fold'; }
  const S = agg === 'triples' ? { base: 'elem', L: t.a[0], steps: [] } : streamOf(prod);
  // G1: arg-best over the deviation from the mean. x·n − sum grows with x, so its arg-best is the elements' own; the exact
  // distance |x·n − sum| is compared pairwise: y beats x ⟺ (y − x)·((x + y)·n − 2·sum) has the right sign, and (x + y)·n vs 2·sum
  // is x + y vs floor(2·sum/n) (+ remainder test): every number stays in one cell (x + y and the quotient taken mod 16).
  if ((agg === 'argmin' || agg === 'argmax') && S.base === 'map' && !S.steps.length && S.lam && S.lam.lam.op === 'dev') S.lam = { lam: { v: 'x' } };
  // the same pairwise comparison serves the first / last element of the list sorted by that distance (stable; a second key x)
  let adevBest = null;
  if ((agg === 'argmin' || agg === 'argmax') && S.base === 'map' && !S.steps.length && S.lam && S.lam.lam.op === 'adev') adevBest = { L: S.L, best: agg === 'argmin' ? 'min' : 'max', tie: 'first', out: 'index' };
  if ((agg === 'first' || agg === 'last') && S.base === 'elem' && !S.steps.length && ['l.sortBy', 'l.sortByDesc', 'l.sortBy2'].includes(S.L.p) && S.L.a[0].p === 'l.id' && S.L.a[1].lam && S.L.a[1].lam.op === 'adev' && (S.L.p !== 'l.sortBy2' || (S.L.a[2].lam && S.L.a[2].lam.v === 'x'))) {
    const asc = S.L.p !== 'l.sortByDesc', last = agg === 'last'; const best = asc === last ? 'max' : 'min';
    adevBest = { L: LID(), best, tie: S.L.p === 'l.sortBy2' ? (best === 'max' ? 'xmax' : 'xmin') : (last ? 'last' : 'first'), out: 'value' }; }
  if (adevBest) {
    const { best, tie, out } = adevBest;
    if (out === 'index' && !env.mod16 && st && st.min < 0) throw new Fail('argmax of empty is −1');
    const { pre, post } = await onList(C, adevBest.L, env);
    const pool = new Pool([0, 3, 4, 5, 6, 7]); const X = pool.take(), BX = pool.take(), M = pool.take(), R2 = pool.take(), U = pool.take(), SC = pool.take();
    const EMP = lab('ae'), DL = lab('ad'), DE = lab('af'), END = lab('ax');
    const onTie = (cont, TK) => tie === 'first' ? GOTO(cont) : tie === 'last' ? GOTO(TK) : tie === 'xmax' ? [...JLT(BX, X, SC, TK), ...GOTO(cont)] : [...JLT(X, BX, SC, TK), ...GOTO(cont)];
    const code = [...pre, ...SET(U, 0), ...SET(R2, 0), ...SET(BX, 0), ...scan({ X }, () => [...INC(U), ...ADDW(R2, BX, X, SC), ...ADDW(R2, BX, X, SC)]),
      ...SET(M, 0), ...JZ(U, EMP), DL, ...SUBW(R2, BX, U, SC, DE), ...INC(M), ...GOTO(DL), DE,
      ...SET(BX, 0), ...scan({ X }, ({ cont }) => { const TK = lab('at'), NEG = lab('an'), POS = lab('ap');
        const better = (lo, hi) => [...JLT(lo, hi, SC, TK), ...GOTO(cont)];
        return [...JZ(BX, TK), ...T_(X), ...T_(BX), ['ADD'], ...P_(U), ...JLT(U, M, SC, NEG), ...JLT(M, U, SC, POS), ...T_(R2), ['J', NEG], ...onTie(cont, TK),
          NEG, ...(best === 'min' ? better(BX, X) : better(X, BX)), POS, ...(best === 'min' ? better(X, BX) : better(BX, X)), TK, ...MV(X, BX)]; }),
      ...(out === 'index' ? [...SET(2, 0), ...scan({ X }, ({ brk }) => [...JEQ(X, BX, SC, brk), ...INC(2)]), ...GOTO(END), EMP, ...SET(2, 15), END] : [...MV(BX, 2), EMP, ...(() => { const Z = lab('az'); return [...JNZ(U, Z), ...SET(2, 0), Z]; })()]), ...post];
    return code; }
  // machine lists hold distinct values: mode of a list = its minimum, distinct of a list = its length
  if (S.base === 'elem' && !S.steps.length && agg === 'mode') agg = 'min';
  if (S.base === 'elem' && !S.steps.length && agg === 'distinct') agg = 'len';
  const { pre, post, orig } = await onList(C, S.L, env);
  const env2 = { ...env, orig, cur: S.L.p === 'l.id' ? env.cur : S.L };
  const pool = new Pool([0, 3, 4, 5, 6, 7]);
  const lams = [S.lam, pred, agg === 'triples' ? t.a[1] : null].filter(Boolean);
  const { code: sc, map: statCells } = await parkStats(C, statVarsOf(lams).filter((v) => !(v === 'g.n' && (S.base === 'walk' || S.base === 'walkIdx'))), env2, pool);
  const live0 = [2, ...Object.values(statCells)];
  const Sx = 2; const code = [...pre, ...sc];
  const iv = S.lam ? (() => { let lo = Infinity, hi = -Infinity; for (const o of C.obs.lam(S.lam)) { const v = evalLam(S.lam.lam, o); if (typeof v === 'number') { if (v < lo) lo = v; if (v > hi) hi = v; } } return { lo, hi }; })() : { lo: 8, hi: 15 };
  const window16 = iv.lo >= 0 && Math.floor(iv.lo / 16) === Math.floor(iv.hi / 16);
  const itemMode = agg === 'count-true' ? 'bool' : (env.mod16 && (agg === 'sum' || agg === 'first' || agg === 'last' || ((agg === 'min' || agg === 'max') && window16))) ? 'mod16' : 'num';
  // compare-only sinks over items that span ≤ 16 values but leave 0..15: items are shifted by their least value (order kept); min/max shift back
  const shift = itemMode === 'num' && S.lam && ['min', 'max', 'argmax', 'argmin'].includes(agg) && !(iv.lo >= 0 && iv.hi <= 15) && iv.hi - iv.lo <= 15 ? iv.lo : 0;
  const itemValf = shift ? (o) => evalLam(S.lam.lam, o) - shift : null;
  let unshift = [];
  const brk = lab('sb');
  if (agg === 'triples') { // all i<j<k
    const X = pool.take(), Y = pool.take(), Z = pool.take(), G = pool.take(); const cells = { ...statCells, a: X, b: Y, c: Z }; const L2 = lab('tl'), D2 = lab('td'), L3 = lab('tm'), D3 = lab('te'), F = lab('tf');
    const sat = env.cap ? JEQK(Sx, 15, F) : [];
    code.push(...SET(Sx, 0), ...scan({ X }, () => [...MV(X, Y), L2, ...NEXT(Y), ...JZ(Y, D2), ...MV(Y, Z), L3, ...NEXT(Z), ...JZ(Z, D3), ...lamCode(C, t.a[1], cells, G, [...live0, X, Y, Z], pool, 'bool'), ...JZ(G, F), ...sat, ...INC(Sx), F, ...GOTO(L3), D3, ...GOTO(L2), D2]));
    return [...code, brk, ...post]; }
  if (pred) { // index of the first / last element with P (−1 ⇒ 15)
    if (!env.mod16 && st && st.min < 0) throw new Fail('find index −1 needs mod 16');
    const X = pool.take(), I = pool.take(), G = pool.take(); const cells = { ...statCells, x: X, i: I };
    code.push(...SET(Sx, 15), ...scan({ X, I }, ({ cont, brk: b2 }) => [...lamCode(C, pred, cells, G, [...live0, X, I], pool, 'bool'), ...JZ(G, cont), ...MV(I, Sx), ...(p === 'g.findIdx' ? GOTO(b2) : [])]));
    return [...code, brk, ...post]; }
  // value-sweep sinks (distinct, mode): for every candidate value, one pass of the producer
  if (agg === 'distinct' || agg === 'mode') { const s = C.obs.vals(prod); const lo = Math.max(0, s ? s.emin : 0), hi = Math.min(15, s ? s.emax : 15); if (!(s && s.emin >= 0 && s.emax <= 15)) throw new Fail('stream values out of range for a value sweep');
    const VV = pool.take(); const CNT = agg === 'mode' ? pool.take() : null, BC = agg === 'mode' ? pool.take() : null; const SC = pool.take();
    const NV = lab('vn'), L = lab('vl'), D = lab('vd');
    const inner = produce(C, S, pool, [...live0, VV, SC, ...(CNT != null ? [CNT, BC] : [])], (v) => { const F = lab('vf'); return agg === 'distinct' ? [...JNE(v, VV, SC, F), ...INC(Sx), ...GOTO(NV), F] : [...JNE(v, VV, SC, F), ...INC(CNT), F]; }, { mode: 'num', statCells });
    code.push(...SET(Sx, 0), ...(BC != null ? SET(BC, 0) : []), ...SET(VV, lo), L, ...(CNT != null ? SET(CNT, 0) : []), ...inner, NV,
      ...(agg === 'mode' ? (() => { const U = lab('mu'), K = lab('mk'); return [...JLT(BC, CNT, SC, U), ...GOTO(K), U, ...MV(CNT, BC), ...MV(VV, Sx), K]; })() : []),
      ...JEQK(VV, hi, D), ...INC(VV), ...GOTO(L), D);
    return [...code, brk, ...post]; }
  // one-pass sinks
  let init = [], upd, finish = [];
  switch (agg) {
    case 'len': case 'count-true': init = SET(Sx, 0); upd = (v) => { if (agg === 'count-true') { const F = lab('ct'); return [...JZ(v, F), ...(env.cap ? JEQK(Sx, 15, F) : []), ...INC(Sx), F]; } if (env.cap) { const F = lab('cp'); return [...JEQK(Sx, 15, F), ...INC(Sx), F]; } return INC(Sx); }; break;
    case 'sum': if (env.cap && !env.mod16) { const SC = pool.take(); init = SET(Sx, 0); upd = (v) => { const K2 = lab('sk'); return [...T_(Sx), ...T_(v), ['ADD'], ...P_(Sx), ...BORROWJ(Sx, v, SC, K2)]; }; break; }   // G1 compiler: min(15, sum) by saturation
      if (!env.mod16 && !inRange(st)) throw new Fail('sum needs wide arithmetic'); init = SET(Sx, 0); upd = (v) => [...T_(Sx), ...T_(v), ['ADD'], ...P_(Sx)]; break;
    case 'first': init = SET(Sx, 0); upd = (v) => [...MV(v, Sx), ...GOTO(brk)]; break;
    case 'last': init = SET(Sx, 0); upd = (v) => MV(v, Sx); break;
    case 'min': case 'max': { const FL = pool.take(), SC = pool.take(); init = [...SET(Sx, 0), ...SET(FL, 0)]; if (shift) { const SK = lab('us'); unshift = [...JZ(FL, SK), ...T_(Sx), ...PUSHK(shift & 15), ['ADD'], ...P_(Sx), SK]; } upd = (v) => { const F = lab('mf'), K = lab('mk'), D = lab('md');
      return [...JNZ(FL, F), ...MV(v, Sx), ...SET(FL, 15), ...GOTO(D), F, ...(agg === 'min' ? JLT(v, Sx, SC, K) : JLT(Sx, v, SC, K)), ...GOTO(D), K, ...MV(v, Sx), D]; }; break; }
    case 'argmax': case 'argmin': { if (!env.mod16 && st && st.min < 0) throw new Fail('argmax of empty is −1'); const BV = pool.take(), K = pool.take(), SC = pool.take(); init = [...SET(Sx, 15), ...SET(BV, 0), ...SET(K, 0)];
      upd = (v) => { const T = lab('ak'), D = lab('ad'); return [...JEQK(Sx, 15, T), ...(agg === 'argmax' ? JLT(BV, v, SC, T) : JLT(v, BV, SC, T)), ...GOTO(D), T, ...MV(v, BV), ...MV(K, Sx), D, ...INC(K)]; }; break; }
    case 'maxrun': { const PV = pool.take(), RL = pool.take(), SC = pool.take(); init = [...SET(Sx, 0), ...SET(PV, 0), ...SET(RL, 0)];
      upd = (v) => { const N1 = lab('mr'), D = lab('mrd'), K = lab('mrk'), U = lab('mru'); return [...JZ(RL, N1), ...JNE(v, PV, SC, N1), ...INC(RL), ...GOTO(K), N1, ...SET(RL, 1), K, ...MV(v, PV), ...JLT(Sx, RL, SC, U), ...GOTO(D), U, ...MV(RL, Sx), D]; }; break; }
    case 'fold': { // acc ⇐ hole(acc, item, i) from a constant start; the hole is a table over (acc, item) seen in the witness (acc kept mod 16 when wide)
      const F = t.a[1], k0 = t.a[2].v; const fo = C.obs.lam(F); const wide = fo.some((o) => !(o.a >= 0 && o.a <= 15) || !(evalLam(F.lam, o) >= 0 && evalLam(F.lam, o) <= 15));
      if (wide && !env.mod16) throw new Fail('fold needs wide arithmetic'); if (lamVars(F.lam).has('i')) throw new Fail('fold with i');
      const obsF = wide ? fo.map((o) => ({ ...o, a: o.a & 15, __o: o })) : fo; const vf = wide ? (o) => evalLam(F.lam, o.__o) : (o) => evalLam(F.lam, o);
      init = SET(Sx, k0 & 15); upd = (v) => { const G = pool.peek(); if (G == null) throw new Fail('no temp (cells)'); return [...holeCode(F.lam, obsF, { ...statCells, a: Sx, b: v }, G, [Sx, v], pool, { mode: wide ? 'mod16' : 'num', valf: vf, extra: {} }), ...MV(G, Sx)]; }; break; }
    case 'mean': case 'meanrem': { // G1: floor mean of the stream; the sum is kept in two cells (LO, HI), then divided by repeated subtraction
      const plain = S.base === 'elem' && S.L.p === 'l.id'; const sp = C.obs.vals(prod); if (!plain && (!sp || sp.maxLen > 15 || sp.maxSum > 255)) throw new Fail('mean: stream too long or sum too wide');
      const LO = pool.take(), HI = pool.take(), CN = pool.take(); init = [...SET(LO, 0), ...SET(HI, 0), ...SET(CN, 0)];   // the answer cell is the adder's scratch until the end
      upd = (v) => [...ADDW(LO, HI, v, Sx), ...INC(CN)];
      const DL = lab('mnl'), DE = lab('mne'); const DS = [0, 3, 4, 5, 6, 7].find((c) => ![LO, HI, CN].includes(c));   // the stream is over: any other cell is free for the division
      finish = [...SET(Sx, 0), ...JZ(CN, DE), DL, ...SUBW(LO, HI, CN, DS, DE), ...INC(Sx), ...GOTO(DL), DE, ...(agg === 'meanrem' ? MV(LO, Sx) : [])]; break; }
    default: throw new Fail('unsupported sink agg.' + agg);
  }
  const extraLive = [...live0];
  code.push(...init, ...produce(C, S, pool, extraLive, upd, { mode: itemMode, statCells, valf: itemValf, noValue: agg === 'len' && !S.steps.length }), ...unshift, ...finish);
  return [...code, brk, ...post];
}

// ═════════ lists: genL(t, env) ⇒ code turning the chain at cell 1 (= the original input when env.orig) into t's value ═════════
async function genL(C, t, env = { cur: null, orig: true }) {
  if (t.p === 'l.id') return [];
  try { const f = toForm(C, t); if (f) return await emitForm(C, f, env); }
  catch (e) { if (!recoverable(e)) throw e; say('form failed', t.p, e.message); C.notes.push('form ' + t.p + ': ' + e.message); }
  if (t.p === 'l.ite') { const c0 = await genN(C, t.a[0], { ...env, mod16: false, cap: false }); const E = lab('le'), D = lab('ld'); const a = await genL(C, t.a[1], env), b = await genL(C, t.a[2], env); return [...c0, ...JZ(2, E), ...a, ...GOTO(D), E, ...b, D]; }
  const child = t.p === 'l.segLast' && t.a[0].p === 'seg.spl' ? t.a[0].a[1] : t.a[0];
  if (child && child.p && child.p.startsWith('l.') && t.p.startsWith('l.')) {
    let pre = null; let parkedO = null;
    try { pre = await genL(C, child, env); } catch (e) { if (!recoverable(e)) throw e; }
    // the operation's holes read original-list stats but its input is derived: compute them first, keep them on the stack across the child
    const oKeys = [...new Set(statVarsOf(lamsOf(t)).filter((v) => v.startsWith('o.')).map(statKey))];
    const pre0 = pre;
    if (pre && oKeys.length && child.p !== 'l.id' && env.orig) { try { const pc = []; for (const k of oKeys) pc.push(...(await genSink(C, STATNODE[k](), { ...env, mod16: false, cap: false }, null)), ...T_(2)); pre = [...pc, ...pre]; parkedO = oKeys; } catch (e) { if (!recoverable(e)) throw e; } }
    if (pre) { const env2 = { cur: child.p === 'l.id' ? env.cur : child, orig: env.orig && child.p === 'l.id', parkedO };
      try { return [...pre, ...(await opBrick(C, t, env2))]; }
      catch (e) { if (!recoverable(e)) throw e; say('op brick failed', t.p, e.message); C.notes.push(t.p + ': ' + e.message); }
      const r = await subL(C, t, child.p === 'l.id' ? env.cur : child, false, pre0.length > 0 || !env.orig); if (r) return [...pre0, ...r]; }
  }
  const r = await subL(C, t, env.cur, true, !env.orig); if (r) return r;
  throw new Fail('no brick and no sub-spec for ' + t.p);
}
async function subL(C, t, inputNode, whole = false, derived = true) {
  if (C.opts.noFallback) return null;
  const input = (l) => (inputNode && inputNode.p !== 'l.id' ? evalIR(inputNode, l) : l);
  const want = (l) => evalAt(t, input(l), l);
  const r = await solveSub({ kind: 'list2list', input, want, label: (whole ? '[whole] ' : '') + showIR(t).slice(0, 80) });
  if (!r || !r.prog) { C.notes.push('sub-spec ' + t.p + ': ' + ((r && r.why) || 'not solved')); return null; }
  C.fallbacks++; C.parts.push({ sub: showIR(t).slice(0, 80), kind: 'list2list', stage: r.stage, len: r.prog.length, input: inputNode && inputNode.p !== 'l.id' ? 'derived list' : 'input list', whole: t === C.ir && !(inputNode && inputNode.p !== 'l.id'), reloc: r.reloc || null, cached: !!r.cached });
  // the machine's list programs were made on fresh memory: unlisted cells 8..15 = 0 and cell 0 = 0
  return [...(derived ? CANON(3, 4, 5) : []), ...SET(0, 0), { code: r.prog }];
}

// ───────── emitter forms ─────────
// form = [seg...]; seg = {conds:[{lam}|{idx:'lt'|'ge', n:N-node}], order:'fwd'|'rev', keys:[{lam, desc}]}
function toForm(C, t) {
  const p = t.p; const A = t.a;
  const isBase = (x) => x.p === 'l.id';
  const one = (seg) => [seg]; const seg0 = () => ({ conds: [], order: 'fwd', keys: [] });
  const lamOk = (n, allowed) => [...lamVars(n.lam)].every((v) => allowed.includes(v) || v.startsWith('o.'));
  switch (p) {
    case 'l.id': return one(seg0());
    case 'l.filter': { const f = toForm(C, A[0]); if (!f || f.length !== 1 || f[0].keys.length || f[0].order !== 'fwd') return null; if (!isBase(A[0]) && !lamOk(A[1], ['x'])) return null; return one({ ...f[0], conds: [...f[0].conds, { lam: A[1] }] }); }
    case 'l.take': case 'l.drop': { if (!isBase(A[0])) return null; return one({ ...seg0(), conds: [{ idx: p === 'l.take' ? 'lt' : 'ge', n: A[1] }] }); }
    case 'l.slice': { if (!isBase(A[0])) return null; return one({ ...seg0(), conds: [{ idx: 'ge', n: A[1] }, { idx: 'lt', n: A[2] }] }); }
    case 'l.removeAt': { if (!isBase(A[0])) return null; return [{ ...seg0(), conds: [{ idx: 'lt', n: A[1] }] }, { ...seg0(), conds: [{ idx: 'ge', n: { p: 'g.add', a: [A[1], A[2]], synth: true } }] }]; }
    case 'l.sortBy': case 'l.sortByDesc': case 'l.sortBy2': { const f = toForm(C, A[0]); if (!f || f.length !== 1 || f[0].keys.length || f[0].order !== 'fwd') return null;
      const keys = p === 'l.sortBy2' ? [{ lam: A[1] }, { lam: A[2] }] : [{ lam: A[1], desc: p === 'l.sortByDesc' }];
      if (!isBase(A[0])) { const allowed = A[0].p === 'l.take' && isBase(A[0].a[0]) ? ['x', 'i'] : ['x']; if (!keys.every((k) => lamOk(k.lam, allowed))) return null; }
      return one({ ...f[0], keys }); }
    case 'l.rev': { const f = toForm(C, A[0]); if (!f || f.length !== 1 || f[0].keys.length || f[0].order !== 'fwd') return null; if (isBase(A[0])) return null; if (f[0].conds.some((c) => c.lam && !lamOk(c.lam, ['x', 'i']))) return null; return one({ ...f[0], order: 'rev' }); }
    case 'l.cat': { const a = toForm(C, A[0]), b = toForm(C, A[1]); if (!a || !b) return null; return [...a, ...b]; }
    case 'l.splitAt': { if (!isBase(A[0])) return null; const K = A[1];
      const a = toForm(C, substId(A[2], { p: 'l.take', a: [LID(), K] })), b = toForm(C, substId(A[3], { p: 'l.drop', a: [LID(), K] })); if (!a || !b) return null; return [...a, ...b]; }
    case 'l.takeWhile': case 'l.dropWhile': { if (!isBase(A[0])) return null; return one({ ...seg0(), conds: [{ [p === 'l.takeWhile' ? 'whileLam' : 'skipLam']: A[1] }] }); }
    case 'l.segLast': { const S = A[0]; if (S.p !== 'seg.segs') return null; const L = S.a[0]; // the last of all segments of L is L's last element
      if (isBase(L)) { const K = { p: 'g.sub', a: [{ p: 'g.n', a: [] }, { p: '#', v: 1 }], synth: true }; return one({ ...seg0(), conds: [{ idx: 'ge', n: K }] }); }
      if (L.p === 'l.take' && isBase(L.a[0])) { const K = L.a[1]; return one({ ...seg0(), conds: [{ idx: 'ge', n: { p: 'g.sub', a: [K, { p: '#', v: 1 }], synth: true } }, { idx: 'lt', n: K }] }); }
      return null; }
    case 'l.rotate': { if (!isBase(A[0])) return null; const K = { p: 'g.mod', a: [A[1], { p: 'g.n', a: [] }], synth: true }; return [{ ...seg0(), conds: [{ idx: 'ge', n: K }] }, { ...seg0(), conds: [{ idx: 'lt', n: K }] }]; }
  }
  return null;
}
function substId(t, by) { if (t.p === 'l.id') return by; if (!t.a) return t; return { ...t, a: t.a.map((c) => (c.lam ? c : substId(c, by))) }; }
function keyCode(C, n) { const obs = C.obs.lam(n); const vals = [...new Set(obs.map((o) => evalLam(n.lam, o)))].sort((a, b) => a - b); if (vals.length > 16) throw new Fail('key has more than 16 values');
  if (vals.every((v) => v >= 0 && v <= 15)) return { lo: vals[0] ?? 0, hi: vals[vals.length - 1] ?? 0, valf: (o) => evalLam(n.lam, o) };
  const rk = new Map(vals.map((v, i) => [v, i])); return { lo: 0, hi: vals.length - 1, valf: (o) => rk.get(evalLam(n.lam, o)) }; }
async function emitForm(C, segs, env) {
  const pool = new Pool();
  const nnodes = []; for (const s of segs) for (const c of s.conds) if (c.idx && !nnodes.includes(c.n)) nnodes.push(c.n);
  const lams = []; for (const s of segs) { for (const c of s.conds) { if (c.lam) lams.push(c.lam); if (c.whileLam) lams.push(c.whileLam); if (c.skipLam) lams.push(c.skipLam); } for (const k of s.keys) lams.push(k.lam); }
  const vars = new Set(); for (const n of lams) for (const v of lamVars(n.lam)) vars.add(v);
  const needRev = segs.some((s) => s.order === 'rev');
  const needI = needRev || nnodes.length > 0 || vars.has('i') || [...vars].length === 0 || lams.some((n) => hasCnt(n.lam));
  // parked numbers: index bounds, list stats, length (for reversed segments)
  const { code: c1, map: statCells, cells: ncells } = await parkStats(C, statVarsOf(lams), env, pool, nnodes.map((n) => ({ n, rep: 'idx' })));
  const code = [...c1]; const cellOf = new Map(nnodes.map((n, j) => [n, ncells[j]]));
  let LEN = null; if (needRev) { LEN = pool.take(); const X0 = pool.take(); code.push(...countN(LEN, X0)); pool.f.unshift(X0); }
  const X = pool.take(), I = needI ? pool.take() : null; const PRV = vars.has('prv') ? pool.take() : null, NXT = vars.has('nxt') ? pool.take() : null;
  const cells = { ...statCells, x: X, ...(I != null ? { i: I } : {}), ...(PRV != null ? { prv: PRV } : {}), ...(NXT != null ? { nxt: NXT } : {}) };
  const live = [...ncells, ...Object.values(statCells), ...(LEN != null ? [LEN] : []), X, ...[I, PRV, NXT].filter((c) => c != null)];
  code.push(...PUSHK(0));
  for (const s of segs) {
    const keyCells = s.keys.map(() => pool.take()); const FLc = s.conds.some((c) => c.skipLam) ? pool.take() : null; const liveAll = [...live, ...keyCells, ...(FLc != null ? [FLc] : [])];
    const scr = pool.peek(); if (scr == null) throw new Fail('no scratch cell');
    if (FLc != null) code.push(...SET(FLc, 0));
    const guard = ({ cont, brk }) => { const g = [];
      for (const c of s.conds) {
        if (c.idx) { const K = cellOf.get(c.n); const ok = lab('ok'); g.push(...(c.idx === 'lt' ? [...JLT(I, K, scr, ok), ...GOTO(cont), ok] : JLT(I, K, scr, cont))); }
        else if (c.whileLam) { if (!brk) throw new Fail('while in a reversed/keyed segment'); g.push(...lamCode(C, c.whileLam, cells, scr, liveAll, pool, 'bool'), ...JZ(scr, brk)); }
        else if (c.skipLam) { if (!brk) throw new Fail('skip-while in a reversed/keyed segment'); const PU = lab('sk'); g.push(...JNZ(FLc, PU), ...lamCode(C, c.skipLam, cells, scr, liveAll, pool, 'bool'), ...JNZ(scr, cont), ...SET(FLc, 15), PU); }
        else g.push(...lamCode(C, c.lam, cells, scr, liveAll, pool, 'bool'), ...JZ(scr, cont)); }
      return g; };
    if (s.order === 'rev') { if (s.keys.length) throw new Fail('rev with keys'); if (PRV != null || NXT != null) throw new Fail('rev with prv/nxt');
      const J = I; const L = lab('rv'), D = lab('rvd'), Cn = lab('rvc');
      code.push(...MV(LEN, J), L, ...JZ(J, D), ...DEC(J), ...walkTo(J, X, scr), ...guard({ cont: Cn, brk: null }), ...T_(X), Cn, ...GOTO(L), D); continue; }
    if (!s.keys.length) { code.push(...scan({ X, I, PRV, NXT }, ({ cont, brk }) => [...guard({ cont, brk }), ...T_(X)])); if (FLc != null) pool.f.unshift(FLc); continue; }
    // stable key sweep: for every key value in order, the elements with that key, in list order
    const kinfo = s.keys.map((k) => keyCode(C, k.lam));
    const scr2 = pool.rest().find((q) => q !== scr); if (scr2 == null) throw new Fail('no scratch cell for key compare');
    // cheap keys (a bare variable) are compared first, so an expensive key is computed only for the element that can match
    const cost = (n) => (n.lam.v !== undefined ? 0 : hasCnt(n.lam) ? 2 : 1);
    const order = s.keys.map((k, j) => j).sort((a, b) => cost(s.keys[a].lam) - cost(s.keys[b].lam));
    const body = ({ cont }) => { const g = []; for (const j of order) { const k = s.keys[j]; g.push(...lamCode(C, k.lam, cells, scr, liveAll, new Pool(pool.rest().filter((q) => q !== scr2)), 'num', kinfo[j].valf), ...JNE(scr, keyCells[j], scr2, cont)); } g.push(...guard({ cont, brk: null }), ...T_(X)); return g; };
    const nest = (j) => { if (j === s.keys.length) return scan({ X, I, PRV, NXT }, body);
      const desc = !!s.keys[j].desc; const lo = kinfo[j].lo, hi = kinfo[j].hi; const L = lab('kv'), D = lab('kd');
      return [...SET(keyCells[j], desc ? hi : lo), L, ...nest(j + 1), ...JEQK(keyCells[j], desc ? lo : hi, D), ...(desc ? DEC(keyCells[j]) : INC(keyCells[j])), ...GOTO(L), D]; };
    code.push(...nest(0));
    for (const c of keyCells) pool.f.unshift(c);
  }
  code.push(...RELINK(2, 3));
  return code;
}

// ───────── walks: i ⇐ H(x_i, i, n) from index 0 until an index repeats (library: H = f mod n) or leaves the list (dsl: H = f if in range)
// no memory for 'seen': phase 1 counts the steps K, re-simulating the walk from 0 to test each new index; phase 2 replays K steps.
function walkHole(C, lamN, modMode) { const f = lamN.lam; const e = { op: modMode ? '%' : 'rng', a: [f, { v: 'g.n' }] };
  const valf = (o) => { const v = evalLam(f, o); const n = o.G.n; return modMode ? (n > 0 ? ((v % n) + n) % n : 0) : (v >= 0 && v < n ? v : 15); };
  return { e, valf, obs: C.obs.lam(lamN) }; }
function walkCode(C, lamN, modMode, pool, statCells, { onVisit }) {
  const H = walkHole(C, lamN, modMode);
  const N = pool.take(), CUR = pool.take(), RI = pool.take(), X = pool.take(), G = pool.take(), K = pool.take();
  const hole = (xc, ic, out) => holeCode(H.e, H.obs, { ...statCells, x: xc, i: ic, 'g.n': N }, out, [], pool, { mode: 'num', valf: H.valf, extra: {} });
  const DONE = lab('wd'), LOOP = lab('wl'), CHK = lab('wc'), NS = lab('wn'), SEEN = lab('ws'), P2L = lab('w2l'), P2D = lab('w2d');
  return [...countN(N, X), ...SET(K, 0), ...JZ(N, DONE), ...SET(CUR, 0),
    LOOP, ...INC(K), ...walkTo(CUR, X, G), ...hole(X, CUR, G), ...MV(G, CUR),
    ...(modMode ? [] : JEQK(CUR, 15, DONE)),
    // seen? replay the K visited indices from 0 (K parked on the stack, its cell counts down)
    ...T_(K), ...SET(RI, 0), CHK, ...JEQ(RI, CUR, G, SEEN), ...DEC(K), ...JZ(K, NS), ...walkTo(RI, X, G), ...hole(X, RI, G), ...MV(G, RI), ...GOTO(CHK),
    SEEN, ...P_(K), ...GOTO(DONE), NS, ...P_(K), ...GOTO(LOOP), DONE,
    // phase 2: replay K steps, visiting
    ...SET(CUR, 0), ...MV(K, RI), P2L, ...JZ(RI, P2D), ...walkTo(CUR, X, G), ...onVisit(X, CUR), ...hole(X, CUR, G), ...MV(G, CUR), ...DEC(RI), ...GOTO(P2L), P2D]; }

// ───────── single list operations on the chain at cell 1 (emitters + RELINK, or pointer surgery) ─────────
async function opBrick(C, t, env) {
  const p = t.p, A = t.a;
  if (p === 'l.rev') return chainRev(1, 2, 3, 4);
  const f = toForm(C, { ...t, a: [LID(), ...A.slice(1)] });
  if (f) return await emitForm(C, f, env);
  const pool = new Pool();
  const lamN = A[1] && A[1].lam ? A[1] : null;
  const moveItems = p === 'l.move' || p === 'l.swap' ? [{ n: A[1], rep: 'mod16' }, { n: A[2], rep: 'mod16' }] : [];
  const { code: sc, map: statCells, cells: moveCells } = await parkStats(C, statVarsOf(lamsOf(t)), env, pool, moveItems);
  const live0 = Object.values(statCells); const code = [...sc];
  const uses = (v) => !!lamN && lamVars(lamN.lam).has(v);
  if (p === 'l.passLR' || p === 'l.passRL') { // bubble pass as a carry: the carried element meets each next one
    if (p === 'l.passRL' && uses('i')) throw new Fail('passRL with i');
    const X = pool.take(), CR = pool.take(), I = uses('i') ? pool.take() : null, G = pool.take();
    const cells = { ...statCells, ...(p === 'l.passLR' ? { a: CR, b: X } : { a: X, b: CR }), ...(I != null ? { i: I } : {}) };
    const L = lab('pl'), FIN = lab('pf'), END = lab('pe'), NS = lab('pn'), STEP = lab('ps');
    if (p === 'l.passRL') code.push(...chainRev(1, X, CR, G));
    code.push(...PUSHK(0), ...MV(1, X), ...JZ(X, END), ...MV(X, CR), ...NEXT(X), ...(I != null ? SET(I, 0) : []),
      L, ...JZ(X, FIN), ...lamCode(C, lamN, cells, G, [...live0, X, CR, ...(I != null ? [I] : [])], pool, 'bool'), ...JZ(G, NS), ...T_(X), ...GOTO(STEP), NS, ...T_(CR), ...MV(X, CR), STEP, ...NEXT(X), ...(I != null ? INC(I) : []), ...GOTO(L),
      FIN, ...T_(CR), END, ...RELINK(2, 3));
    if (p === 'l.passRL') code.push(...chainRev(1, 2, 3, 4));
    return code; }
  if (p === 'l.twoPtr') { // front index FI, back bound BK (exclusive); take from the front while P(front, back)
    const FI = pool.take(), BK = pool.take(), AV = pool.take(), BV = pool.take(), CNT = pool.take(), G = pool.take();
    const cells = { ...statCells, a: AV, b: BV, ...(uses('i') ? { i: FI } : {}) };
    const L = lab('tp'), BODY = lab('tb'), BACK = lab('tk'), DONE = lab('td');
    code.push(...PUSHK(0), ...countN(BK, AV), ...SET(FI, 0),
      L, ...JLT(FI, BK, G, BODY), ...GOTO(DONE), BODY, ...walkTo(FI, AV, CNT), ...MV(BK, CNT), ...DEC(CNT), ...walkTo(CNT, BV, CNT),
      ...lamCode(C, lamN, cells, G, [...live0, FI, BK, AV, BV], pool, 'bool'), ...JZ(G, BACK), ...T_(AV), ...INC(FI), ...GOTO(L), BACK, ...T_(BV), ...DEC(BK), ...GOTO(L), DONE, ...RELINK(2, 3));
    return code; }
  if (p === 'l.stackWhile' || p === 'l.stackCancel' || p === 'l.stackRepl') { // the machine stack is the frame's stack (sentinel 0 at the bottom)
    const X = pool.take(), TP = pool.take(), I = uses('i') ? pool.take() : null, G = pool.take();
    const cells = { ...statCells, a: TP, b: X, ...(I != null ? { i: I } : {}) }; const lv = [...live0, X, TP, ...(I != null ? [I] : [])];
    code.push(...PUSHK(0), ...scan({ X, I }, ({ cont }) => { const LP = lab('sw'), EM = lab('se'), PX = lab('sx'), KP = lab('sk');
      if (p === 'l.stackWhile') return [LP, ...P_(TP), ...JZ(TP, EM), ...lamCode(C, lamN, cells, G, lv, pool, 'bool'), ...JNZ(G, LP), ...T_(TP), ...GOTO(PX), EM, ...T_(TP), PX, ...T_(X)];
      if (p === 'l.stackCancel') return [...P_(TP), ...JZ(TP, EM), ...lamCode(C, lamN, cells, G, lv, pool, 'bool'), ...JZ(G, KP), ...GOTO(cont), KP, EM, ...T_(TP), ...T_(X)];
      return [...P_(TP), ...JZ(TP, EM), ...lamCode(C, lamN, cells, G, lv, pool, 'bool'), ...JZ(G, KP), ...T_(X), ...GOTO(cont), KP, EM, ...T_(TP), ...T_(X)]; }), ...RELINK(2, 3));
    return code; }
  if (p === 'l.runsBest') { // pass 1: best run (end BE, length BL); pass 2: emit [BE−BL, BE)
    const X = pool.take(), I = pool.take(), PRV = pool.take(), RL = pool.take(), BL = pool.take(), BE = pool.take(), G = pool.take();
    const cells = { ...statCells, a: PRV, b: X, i: I }; const lv = [...live0, X, I, PRV, RL, BL, BE];
    const close = () => { const U = lab('ru'), D = lab('rd'); return [...JLT(BL, RL, G, U), ...GOTO(D), U, ...MV(RL, BL), ...MV(I, BE), D]; };
    code.push(...SET(BL, 0), ...SET(BE, 0), ...SET(RL, 0), ...scan({ X, I, PRV }, ({ cont }) => { const NEW = lab('rn'); return [...JZ(I, NEW), ...lamCode(C, lamN, cells, G, lv, pool, 'bool'), ...JZ(G, NEW), ...INC(RL), ...GOTO(cont), NEW, ...close(), ...SET(RL, 1)]; }), ...close());
    // BS = BE − BL in PRV ; emit
    code.push(...SUBC(PRV, BE, BL), ...PUSHK(0), ...scan({ X, I }, ({ cont }) => { const ok = lab('ok'); return [...JLT(I, PRV, G, cont), ...JLT(I, BE, G, ok), ...GOTO(cont), ok, ...T_(X)]; }), ...RELINK(2, 3));
    return code; }
  if (p === 'l.runsMap' || p === 'l.chunksMap') { // segments [S, E): runs of P / chunks of k; F on each: id, rev, sort by x
    const F = A[2]; const kind = F.p === 'l.id' ? 'id' : F.p === 'l.rev' && F.a[0].p === 'l.id' ? 'rev' : F.p === 'l.sortBy' && F.a[0].p === 'l.id' && F.a[1].lam.v === 'x' ? 'sort' : null;
    if (!kind) throw new Fail('segment map F unsupported');
    const S = pool.take(), E = pool.take(), X = pool.take(), PRV = pool.take(), G = pool.take(), J = pool.take(), CNT = pool.take();
    const cells = { ...statCells, a: PRV, b: X, i: E }; const lv = [...live0, S, E, X, PRV, J, CNT];
    const SEG = lab('sg'), EXT = lab('sx'), EMIT = lab('sm'), DONE = lab('sd'), NX = lab('sn');
    const ext = p === 'l.runsMap' ? [...lamCode(C, lamN || A[1], cells, G, lv, pool, 'bool'), ...JZ(G, EMIT)] : (() => { const k = A[1].v; return [...SUBC(G, E, S), ...JEQK(G, k, EMIT)]; })();
    let emit;
    if (kind === 'rev') { const RL = lab('er'), RD = lab('erd'); emit = [...MV(E, J), RL, ...JEQ(J, S, G, RD), ...DEC(J), ...walkTo(J, X, CNT), ...T_(X), ...GOTO(RL), RD]; }
    else if (kind === 'id') { const IL = lab('ei'), ID = lab('eid'); emit = [...MV(S, J), IL, ...JEQ(J, E, G, ID), ...walkTo(J, X, CNT), ...T_(X), ...INC(J), ...GOTO(IL), ID]; }
    else { const VL = lab('ev'), VD = lab('evd'), IL = lab('ew'), ID = lab('ewd'), SK = lab('es'); const V = PRV;
      emit = [...SET(V, 8), VL, ...MV(S, J), IL, ...JEQ(J, E, G, ID), ...walkTo(J, X, CNT), ...JNE(X, V, G, SK), ...T_(X), SK, ...INC(J), ...GOTO(IL), ID, ...JEQK(V, 15, VD), ...INC(V), ...GOTO(VL), VD]; }
    code.push(...PUSHK(0), ...SET(S, 0), SEG, ...walkTo(S, X, CNT), ...JZ(X, DONE), ...MV(S, E), ...INC(E), ...MV(X, PRV), ...NEXT(X),
      EXT, ...JZ(X, EMIT), ...ext, ...INC(E), ...MV(X, PRV), ...NEXT(X), ...GOTO(EXT), EMIT, ...emit, ...MV(E, S), ...GOTO(SEG), DONE, ...RELINK(2, 3));
    return code; }
  if (p === 'l.hop') { // visit, then skip step−1 elements (countdown D); a step < 1 stops
    const s = C.obs.lam(lamN).map((o) => evalLam(lamN.lam, o)); if (s.some((v) => v < 0 || v > 15)) throw new Fail('hop step out of range');
    const X = pool.take(), I = uses('i') ? pool.take() : null, D = pool.take(), G = pool.take(); const cells = { ...statCells, x: X, ...(I != null ? { i: I } : {}) };
    code.push(...PUSHK(0), ...SET(D, 0), ...scan({ X, I }, ({ brk }) => { const SK = lab('hs'); return [...JNZ(D, SK), ...T_(X), ...lamCode(C, lamN, cells, G, [...live0, X, D, ...(I != null ? [I] : [])], pool, 'num'), ...JZ(G, brk), ...MV(G, D), SK, ...DEC(D)]; }), ...RELINK(2, 3));
    return code; }
  if (p === 'l.takeWhile' || p === 'l.dropWhile') {
    const X = pool.take(), I = uses('i') ? pool.take() : null, FL = pool.take(), G = pool.take(); const cells = { ...statCells, x: X, ...(I != null ? { i: I } : {}) };
    const needPrv = uses('prv'), needNxt = uses('nxt'); const PRV = needPrv ? pool.take() : null, NXT = needNxt ? pool.take() : null; if (PRV != null) cells.prv = PRV; if (NXT != null) cells.nxt = NXT;
    const lv = [...live0, X, FL, ...[I, PRV, NXT].filter((c) => c != null)];
    code.push(...PUSHK(0), ...SET(FL, 0), ...scan({ X, I, PRV, NXT }, ({ cont, brk }) => { const PU = lab('wp');
      if (p === 'l.takeWhile') return [...lamCode(C, lamN, cells, G, lv, pool, 'bool'), ...JZ(G, brk), ...T_(X)];
      return [...JNZ(FL, PU), ...lamCode(C, lamN, cells, G, lv, pool, 'bool'), ...JNZ(G, cont), ...SET(FL, 15), PU, ...T_(X)]; }), ...RELINK(2, 3));
    return code; }
  if (p === 'l.takeUntilK' || p === 'l.dropUntilK') { // G1: the scan counts the elements where P holds; the K-th one ends the prefix / starts the suffix
    const K = A[2].v; if (!(K >= 1 && K <= 15)) throw new Fail('until k');
    const X = pool.take(), I = uses('i') ? pool.take() : null, CN = pool.take(), FL = pool.take(), G = pool.take(); const cells = { ...statCells, x: X, ...(I != null ? { i: I } : {}) };
    const needPrv = uses('prv'), needNxt = uses('nxt'); const PRV = needPrv ? pool.take() : null, NXT = needNxt ? pool.take() : null; if (PRV != null) cells.prv = PRV; if (NXT != null) cells.nxt = NXT;
    const lv = [...live0, X, CN, FL, ...[I, PRV, NXT].filter((c) => c != null)];
    code.push(...PUSHK(0), ...SET(CN, K), ...SET(FL, 0), ...scan({ X, I, PRV, NXT }, ({ cont, brk }) => { const EM = lab('tu'), PU = lab('du');
      if (p === 'l.takeUntilK') return [...lamCode(C, lamN, cells, G, lv, pool, 'bool'), ...JZ(G, EM), ...DEC(CN), ...JZ(CN, brk), EM, ...T_(X)];
      return [...JNZ(FL, PU), ...lamCode(C, lamN, cells, G, lv, pool, 'bool'), ...JZ(G, cont), ...DEC(CN), ...JNZ(CN, cont), ...SET(FL, 15), PU, ...T_(X)]; }), ...RELINK(2, 3));
    return code; }
  if (p === 'l.stackPops') { // G1: the machine stack is the frame's stack (sentinel 0); popped elements are linked into the output chain as they leave
    const X = pool.take(), TP = pool.take(), HD = pool.take(), TL = pool.take(), I = uses('i') ? pool.take() : null, G = pool.take();
    const cells = { ...statCells, a: TP, b: X, ...(I != null ? { i: I } : {}) }; const lv = [...live0, X, TP, HD, TL, ...(I != null ? [I] : [])];
    const link = () => { const F = lab('spf'), D2 = lab('spd'); return [...JZ(TL, F), ...STOREAT(TL, TP), ...GOTO(D2), F, ...MV(TP, HD), D2, ...MV(TP, TL)]; };
    const FIN = lab('spn'), END = lab('spe'), NOT = lab('spz');
    code.push(...PUSHK(0), ...SET(HD, 0), ...SET(TL, 0), ...scan({ X, I }, () => { const LP = lab('spl'), EM = lab('spm'), KP = lab('spk'), PX = lab('spx');
      return [LP, ...P_(TP), ...JZ(TP, EM), ...lamCode(C, lamN, cells, G, lv, pool, 'bool'), ...JZ(G, KP), ...link(), ...GOTO(LP), KP, ...T_(TP), ...GOTO(PX), EM, ...T_(TP), PX, ...T_(X)]; }),
      FIN, ...P_(TP), ...JZ(TP, END), ...link(), ...GOTO(FIN), END, ...JZ(TL, NOT), ...SET(G, 0), ...STOREAT(TL, G), NOT, ...MV(HD, 1));
    return code; }
  if (p === 'l.groupBy') { // G1: for each element that is the first of its key, every element with that key, in order
    if (['i', 'prv', 'nxt'].some(uses)) throw new Fail('group key reads the position');
    const Y = pool.take(), KY = pool.take(), Z = pool.take(), KZ = pool.take(), SC = pool.take();
    const kc = keyCode(C, lamN); const keyAt = (xc, out, lv) => lamCode(C, lamN, { ...statCells, x: xc }, out, lv, pool, 'num', kc.valf);
    code.push(...PUSHK(0), ...scan({ X: Y }, ({ cont }) => { const L1 = lab('gb1'), FI = lab('gbf'), L2 = lab('gb2'), D2 = lab('gbd'), SK = lab('gbs');
      return [...keyAt(Y, KY, [...live0, Y]),
        ...MV(1, Z), L1, ...JEQ(Z, Y, SC, FI), ...keyAt(Z, KZ, [...live0, Y, KY, Z]), ...JEQ(KZ, KY, SC, cont), ...NEXT(Z), ...GOTO(L1),
        FI, ...MV(1, Z), L2, ...JZ(Z, D2), ...keyAt(Z, KZ, [...live0, Y, KY, Z]), ...JNE(KZ, KY, SC, SK), ...T_(Z), SK, ...NEXT(Z), ...GOTO(L2), D2]; }), ...RELINK(2, 3));
    return code; }
  if (p === 'l.heapPush') { // G1: array mode — the chain is unloaded into cells 8.. (A[k] = mem[8+k], 0 after the end), sifted in place, relinked
    if (uses('prv') || uses('nxt')) throw new Fail('heap rule reads neighbours');
    const K = pool.take(), I = pool.take(), Q = pool.take(), AV = pool.take(), BV = pool.take(), G = pool.take();
    const cells = { ...statCells, a: AV, b: BV, ...(uses('i') ? { i: I } : {}) }; const lv = [...live0, K, I, Q, AV, BV];
    const ADDR = (c) => [...T_(c), ...PUSHK(8), ['ADD']];                 // push 8 + mem[c]
    const LOADA = (c, d) => [...ADDR(c), ['WHERE@'], ['GO'], ['TAKE'], ...P_(d)];   // d ⇐ A[mem[c]]
    const STOREA = (c, v) => [...T_(v), ...ADDR(c), ['WHERE@'], ['GO'], ['PUT']];    // A[mem[c]] ⇐ mem[v]
    const UL = lab('hu'), UD = lab('hd'), ZL = lab('hz'), PL = lab('hp'), PD = lab('hq'), KL = lab('hk'), KD = lab('he'), SL = lab('hs'), SD = lab('ht'), OL = lab('ho'), OD = lab('hn');
    code.push(
      // unload: push the elements, count them in K, zero cells 8..15, pop them into A[K-1] .. A[0]
      ...SET(K, 0), ...MV(1, AV), UL, ...JZ(AV, UD), ...T_(AV), ...INC(K), ...NEXT(AV), ...GOTO(UL), UD,
      ...[8, 9, 10, 11, 12, 13, 14, 15].flatMap((c) => SET(c, 0)),
      PL, ...JZ(K, PD), ...DEC(K), ...ADDR(K), ['WHERE@'], ['GO'], ['PUT'], ...GOTO(PL), PD,
      // sift: K = 1, 2, .. while K < 8 and A[K] != 0
      ...SET(K, 1), KL, ...JEQK(K, 8, KD), ...LOADA(K, BV), ...JZ(BV, KD), ...MV(K, I),
      SL, ...JZ(I, SD), ...T_(I), ...PUSHK(15), ['ADD'], ['SHR'], ...P_(Q), ...LOADA(Q, AV), ...LOADA(I, BV),
      ...lamCode(C, lamN, cells, G, lv, pool, 'bool'), ...JZ(G, SD), ...STOREA(Q, BV), ...STOREA(I, AV), ...MV(Q, I), ...GOTO(SL), SD,
      ...INC(K), ...GOTO(KL), KD,
      // relink A[0..]: push 0, then A[0], A[1], ..
      ...PUSHK(0), ...SET(K, 0), OL, ...JEQK(K, 8, OD), ...LOADA(K, BV), ...JZ(BV, OD), ...T_(BV), ...INC(K), ...GOTO(OL), OD, ...RELINK(2, 3));
    return code; }
  if (p === 'l.knockout') { // G1: array mode; each round compacts the winners to the front (W ≤ R), the losers go on the stack in order
    if (['prv', 'nxt'].some(uses)) throw new Fail('match rule reads neighbours');
    const LN = pool.take(), W = pool.take(), R = pool.take(), AV = pool.take(), BV = pool.take(), G = pool.take();
    const cells = { ...statCells, a: AV, b: BV, ...(uses('i') ? { i: R } : {}) }; const lv = [...live0, LN, W, R, AV, BV];
    const ADDR = (c) => [...T_(c), ...PUSHK(8), ['ADD']]; const LOADA = (c, d) => [...ADDR(c), ['WHERE@'], ['GO'], ['TAKE'], ...P_(d)]; const STOREA = (c, v) => [...T_(v), ...ADDR(c), ['WHERE@'], ['GO'], ['PUT']];
    const UL = lab('ku'), UD = lab('kd'), PL = lab('kp'), PD = lab('kq'), RL = lab('kr'), RD = lab('ks'), ML = lab('km'), MD = lab('kn'), ODD = lab('ko'), LOS = lab('kl'), NX = lab('kx'), FIN = lab('kf');
    code.push(
      ...SET(LN, 0), ...MV(1, AV), UL, ...JZ(AV, UD), ...T_(AV), ...INC(LN), ...NEXT(AV), ...GOTO(UL), UD,
      ...MV(LN, W), PL, ...JZ(W, PD), ...DEC(W), ...ADDR(W), ['WHERE@'], ['GO'], ['PUT'], ...GOTO(PL), PD,
      ...PUSHK(0),
      RL, ...SET(G, 1), ...JLT(G, LN, BV, ML), ...GOTO(RD),                     // a round while LEN > 1
      ML, ...SET(W, 0), ...SET(R, 0),
      MD, ...JLT(R, LN, G, ODD), ...MV(W, LN), ...GOTO(RL),                     // round over: LEN ⇐ W
      ODD, ...MV(R, AV), ...INC(AV), ...JLT(AV, LN, G, LOS), ...LOADA(R, AV), ...STOREA(W, AV), ...INC(R), ...INC(W), ...GOTO(MD),   // odd last advances
      LOS, ...LOADA(R, AV), ...INC(R), ...LOADA(R, BV), ...DEC(R), ...lamCode(C, lamN, cells, G, lv, pool, 'bool'),
      ...JZ(G, NX), ...T_(BV), ...STOREA(W, AV), ...GOTO(FIN), NX, ...T_(AV), ...STOREA(W, BV), FIN, ...INC(R), ...INC(R), ...INC(W), ...GOTO(MD),
      RD, ...JZ(LN, PD + 'z'), ...SET(R, 0), ...LOADA(R, AV), ...T_(AV), PD + 'z', ...RELINK(2, 3));
    return code; }
  if (p === 'l.move') { // the element at F moves before the T-th of the others (end if T ≥ their count)
    const [F, T] = moveCells;
    const XF = pool.take(), X = pool.take(), I = pool.take(), K = pool.take(), G = pool.take(); const END = lab('mv');
    code.push(...walkTo(F, XF, G), ...JZ(XF, END), ...PUSHK(0), ...SET(K, 0), ...scan({ X, I }, ({ cont }) => { const NI = lab('mn'); return [...JEQ(I, F, G, cont), ...JNE(K, T, G, NI), ...T_(XF), NI, ...T_(X), ...INC(K)]; }),
      ...(() => { const D = lab('md'); return [...JLT(T, K, G, D), ...T_(XF), D]; })(), ...RELINK(2, 3), END);
    return code; }
  if (p === 'l.josephus') { // circular chain; k steps, unlink the next one, push it
    const k = A[1].v; if (!(k >= 0 && k <= 4)) throw new Fail('josephus k');
    const PV = pool.take(), Y = pool.take(), N = pool.take(), K = pool.take(), Z = pool.take(); const END = lab('je'), L = lab('jl'), ST = lab('js'), SD = lab('jd'), LL = lab('jw'), LD = lab('jx');
    code.push(...PUSHK(0), ...MV(1, Y), ...JZ(Y, END), ...SET(N, 0),
      // PV = last element; close the circle
      ...MV(1, PV), LL, ...INC(N), ...LOADAT(PV, Z), ...JZ(Z, LD), ...MV(Z, PV), ...GOTO(LL), LD, ...STOREAT(PV, Y),
      L, ...SET(K, k), ST, ...JZ(K, SD), ...LOADAT(PV, Z), ...MV(Z, PV), ...DEC(K), ...GOTO(ST), SD,
      ...LOADAT(PV, Y), ...T_(Y), ...LOADAT(Y, Z), ...STOREAT(PV, Z), ...DEC(N), ...JNZ(N, L), END, ...RELINK(2, 3));
    return code; }
  if (p === 'l.swap') { // the elements at A and B trade places (identity when either is out of range)
    const [IA, IB] = moveCells; const XA = pool.take(), XB = pool.take(), X = pool.take(), I = pool.take(), G = pool.take(); const END = lab('swe');
    code.push(...walkTo(IA, XA, G), ...JZ(XA, END), ...walkTo(IB, XB, G), ...JZ(XB, END), ...PUSHK(0),
      ...scan({ X, I }, ({ cont }) => { const NA = lab('sna'), NB = lab('snb'); return [...JNE(I, IA, G, NA), ...T_(XB), ...GOTO(cont), NA, ...JNE(I, IB, G, NB), ...T_(XA), ...GOTO(cont), NB, ...T_(X)]; }), ...RELINK(2, 3), END);
    return code; }
  if (p === 'l.walk' || p === 'l.walkIdx') { code.push(...PUSHK(0), ...walkCode(C, lamN, p === 'l.walk', pool, statCells, { onVisit: (X) => T_(X) }), ...RELINK(2, 3)); return code; }
  if (p === 'l.segLast' && A[0].p === 'seg.spl') { // the last maximal segment where P holds
    const P0 = A[0].a[0]; const X = pool.take(), I = pool.take(), FL = pool.take(), CS = pool.take(), LS = pool.take(), LE = pool.take(), G = pool.take();
    const cells = { ...statCells, x: X, i: I }; const lv = [...live0, X, I, FL, CS, LS, LE];
    code.push(...SET(FL, 0), ...SET(LS, 0), ...SET(LE, 0), ...scan({ X, I }, ({ cont }) => { const OFF = lab('lsf'), ON = lab('lso'); return [...lamCode(C, P0, cells, G, lv, pool, 'bool'), ...JZ(G, OFF), ...JNZ(FL, ON), ...MV(I, CS), ...SET(FL, 15), ON, ...MV(I, LE), ...INC(LE), ...MV(CS, LS), ...GOTO(cont), OFF, ...SET(FL, 0)]; }),
      ...PUSHK(0), ...scan({ X, I }, ({ cont }) => { const ok = lab('ok'); return [...JLT(I, LS, G, cont), ...JLT(I, LE, G, ok), ...GOTO(cont), ok, ...T_(X)]; }), ...RELINK(2, 3));
    return code; }
  throw new Fail('unsupported list op ' + p);
}

// ═════════ the API ═════════
export async function compileAst(ast, spec, opts = {}) {
  const t0 = Date.now(); await loadRefs();
  let ir = ast;
  try { if (typeof ast === 'string') ir = fromDsl(parseDsl(ast)); else if (ast && ast.p && isLib(ast)) ir = fromLib(ast); evalIR(ir, [8, 9, 10]); }
  catch (e) { return { ok: false, err: 'front end: ' + e.message, reason: 'front end: ' + e.message, ms: Date.now() - t0 }; }
  const C = mkCtx(ir, spec, opts);
  C.obsLists = opts.obsN ? sampleLists(opts.obsN) : ALL;   // every machine list (109,601): the hole tables are complete and deterministic
  C.obs = observe(ir, C.obsLists);
  const f0 = SUBSTATS.calls;
  let code;
  try {
    if (spec.kind === 'list2list') code = await genL(C, ir, { cur: null, orig: true });
    else code = await genN(C, ir, { cur: null, orig: true, mod16: true });
  } catch (e) { const crash = !recoverable(e); if (crash && opts.throwOnCrash) throw e; return { ok: false, crash, err: (crash ? 'crash: ' : '') + e.message, reason: (crash ? 'crash: ' + (e.stack || '').split('\n').slice(0, 3).join(' | ') : e.message), notes: C.notes, parts: C.parts, fallbacks: C.fallbacks, ms: Date.now() - t0, ir: showIR(ir) }; }
  let prog; try { prog = assemble(code); } catch (e) { return { ok: false, err: 'assemble: ' + e.message, reason: 'assemble: ' + e.message, ms: Date.now() - t0 }; }
  const how = 'דקדוק: ' + showIR(ir) + (C.fallbacks ? ' · ' + C.parts.map((q) => 'תת-משימה ⇐ ' + q.stage).join(' · ') : '');
  // self-check against the program's own witness (never the task's source): catches a compiler bug before anyone trusts the code
  if (opts.selfCheck !== false) { const sc = selfCheck(prog, ir, spec.kind, opts.selfN || 3000); if (!sc.ok) return { ok: false, err: 'self-check: ' + sc.why, reason: 'self-check: ' + sc.why, prog, notes: C.notes, parts: C.parts, fallbacks: C.fallbacks, ms: Date.now() - t0, ir: showIR(ir) }; }
  return { ok: true, prog, len: prog.length, how, parts: C.parts, fallbacks: C.fallbacks, notes: C.notes, ms: Date.now() - t0, ir: showIR(ir) };
}
function selfCheck(prog, ir, kind, n) {
  const f = (l) => evalIR(ir, l); const gen = strictGen(kind, (l) => { const v = f(l); return typeof v === 'boolean' ? (v ? 1 : 0) : v; });
  for (let k = 0; k < n; k++) { const e = gen(); const r = run(prog, e.mem, { maxSteps: 600000 }); if (!r || r.st.length || !e.ok(r.mem)) return { ok: false, why: 'wrong on ' + JSON.stringify(e.l) }; }
  if (!deepRelocOk(prog, gen)) return { ok: false, why: 'not movable' };
  return { ok: true }; }
const irMarks = (t) => !!t && (t.lam !== undefined || t.dsl !== undefined || t.p === '#' || /^(dsl|seg)\./.test(t.p || '') || (t.a || []).some(irMarks));
const isLib = (t) => !irMarks(t);   // a library/G0 AST never holds IR lambdas or '#' constants (an AST with neither is the same in both)

// ═════════ strict check (as brain-all + dsl/cc): 20000 examples, pads 0/3/17, list cells intact, empty stack, deepRelocOk ═════════
const LISTCELLS = [1, 8, 9, 10, 11, 12, 13, 14, 15];
const walk = (m) => { const o = []; let a = m[1]; for (let i = 0; a && i < 10; i++) { o.push(a); a = m[a]; } return o; };
export function strictGen(kind, f) { return () => { const p8 = [8, 9, 10, 11, 12, 13, 14, 15]; for (let i = 7; i > 0; i--) { const j = R(i + 1); [p8[i], p8[j]] = [p8[j], p8[i]]; } const l = p8.slice(0, R(9));
  const m = new Array(16).fill(0); m[1] = l[0] || 0; l.forEach((a, i) => { m[a] = l[i + 1] || 0; }); const mem = m.map((v, k) => (LISTCELLS.includes(k) ? v : R(16)));
  if (kind === 'list2num') { const w = f([...l]) & 15; const keep = LISTCELLS.map((c) => mem[c]); return { l, mem, want: w, ok: (r) => r[2] === w && LISTCELLS.every((c, i) => r[c] === keep[i]) }; }
  const w = JSON.stringify(f([...l])); return { l, mem, want: w, ok: (r) => JSON.stringify(walk(r)) === w }; }; }
export function strictCheck(prog, spec, { n = 20000, pads = [0, 3, 17] } = {}) {
  const f = new Function('return (' + spec.src + ')')(); const gen = strictGen(spec.kind, f);
  for (const pad of pads) { const pre = Array.from({ length: Math.ceil(pad / 3) }, () => [['WHERE', 0], ['GO'], ['TAKE']]).flat().slice(0, pad); const p = [...pre, ...shiftC(prog, pad)]; const junk = pre.filter((x) => x[0] === 'TAKE').length;
    for (let k = 0; k < (pad ? n / 10 : n); k++) { const e = gen(); const r = run(p, e.mem, { maxSteps: 600000 });
      if (!r || r.st.length !== junk || !e.ok(r.mem)) return { ok: false, pad, l: e.l, want: e.want, got: r ? (spec.kind === 'list2num' ? r.mem[2] : walk(r.mem)) : null, st: r ? r.st.length : null, steps: r ? r.steps : null }; } }
  if (!deepRelocOk(prog, gen)) return { ok: false, why: 'deepRelocOk' };
  return { ok: true }; }
