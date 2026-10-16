// fg/learn.mjs - Track C: the machine learns from its own history («לומדת מעצמה»).
// After every solved task (hook at the end of brain-all.mjs solveAny) the machine adds its own solution to its history:
//   * the program it accepted (machine code), keyed by the task's BEHAVIOUR (never by name or source text):
//       list kinds: answers on the 40 index probes (sig) + answers on all 109,601 valid lists (full);
//       num: the whole truth table over its input cells.
//     Next time the same behaviour arrives, stage 'זיכרון' returns that program in milliseconds (the usual strict check follows).
//   * the G0 AST when the grammar stage found it, plus its typed sub-terms ⇒ history entries of the index ("delta"),
//     matched like index entries (direct / m16 / cap, meet-in-the-middle with each other and with the whole index, ite masks).
// After a suite (batched: `node fg/learn.mjs refit`):
//   * every stored program is checked on ALL valid inputs by running the machine itself (ver ok / bad; bad ones are never reused);
//   * adapters: a solution of an older family stage (keysort, filtcomp, runframes, walkframes, ...) becomes a G0 AST when
//     it is expressible: the family's own machine program is the oracle of a G0 search (index + history + live), and the AST
//     is accepted only if it equals the program on all 109,601 lists;
//   * one-hole neighbours of every history AST (each sub-term replaced by small fillers from the machine's enumerator) are
//     added as history entries, so nearby tasks become index hits;
//   * the learned costs / templates are refit (prior.mjs: anti-unification + MDL, alpha smoothing, per shape class), and
//     search.mjs keeps the uniform-order configuration in its portfolio;
//   * optionally (`refit --rebuild`, heavy, ~17 min) the prior-dependent index parts are rebuilt and merged with the uniform part.
// Nothing here reads a task's name or source: a task is an oracle (spec.src is run as a black box, as the fg stage does).
import fs from 'fs'; import path from 'path'; import crypto from 'crypto'; import { fileURLToPath } from 'url';
import { P, PI, glob, compile, show, parse, size } from './grammar.mjs';
import { PROBES, allLists, packList, hashI, hstr, makeCtx, enumerate, shapeOf, solveLists } from './search.mjs';
import { learnPrior } from './prior.mjs';
import { run } from '../machine3s.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
export const HDIR = () => process.env.FGHIST || path.join(DIR, 'history');
export const learnOn = (spec) => process.env.LEARN !== '0' && !!spec && !!spec.src;
const F = (n) => path.join(HDIR(), n);
const NONINT = -0x7fffff01, BIG = -32768;
const clamp16 = (x) => (x === NONINT || !Number.isInteger(x) || x > 32000 || x < -32000 ? BIG : x);
const md5 = (s) => crypto.createHash('md5').update(s).digest('hex').slice(0, 16);
const rows = (f) => { try { return fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean); } catch { return []; } };
const append = (f, o) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.appendFileSync(f, JSON.stringify(o) + '\n'); };

// ───────── behaviour keys ─────────
export function oracleOf(spec) { const f = new Function('return (' + spec.src + ')')(); return spec.kind === 'list2num' ? (l) => f([...l]) & 15 : spec.kind === 'list2list' ? (l) => f([...l]) : (...a) => f(...a) & 15; }
const enc = (kind, y) => (kind === 'list2list' ? packList(y) : Number.isInteger(y) ? y : NONINT);
export function sigOf(kind, oracle) { const v = new Int32Array(PROBES.length); for (let k = 0; k < PROBES.length; k++) { let y; try { y = oracle([...PROBES[k]]); } catch { y = null; } v[k] = enc(kind, y); } return kind + ':' + hstr(hashI(v)); }
export function fullOf(kind, oracle) { const A = allLists(); const v = new Int32Array(A.length); for (let i = 0; i < A.length; i++) { let y; try { y = oracle([...A[i]]); } catch { y = null; } v[i] = enc(kind, y); } return { key: kind + ':' + hstr(hashI(v)), v }; }
export function numTable(spec, f = oracleOf(spec)) { const ins = spec.ins || []; const n = 16 ** ins.length; let s = ''; for (let c = 0; c < n; c++) { const a = ins.map((_, j) => (c >> (4 * j)) & 15); let y; try { y = f(...a); } catch { y = 0; } s += (y & 15).toString(16); } return s; }
export const numKey = (spec, f = oracleOf(spec)) => 'num:' + (spec.ins || []).join(',') + ':' + md5(numTable(spec, f));
const ttOracle = (ins, tt) => (...a) => parseInt(tt[a.reduce((c, x, j) => c + ((x & 15) << (4 * j)), 0)], 16);

// ───────── the machine program as an oracle (adapters, exhaustive check of stored programs) ─────────
const walk = (m) => { const o = []; let a = m[1]; for (let i = 0; a && i < 10; i++) { o.push(a); a = m[a]; } return o; };
const GARB = [[0, 0, 0, 0, 0, 0, 0], [5, 11, 3, 14, 7, 9, 2], [15, 15, 15, 15, 15, 15, 15]];
export function runList(kind, prog, l, g = 1) {
  // the machine's list contract (listcomp/listlist LISTC): cell 0 starts at 0, the list cells hold the chain, cells 2..7 hold garbage.
  // LEARN_STRICT0=1 also puts garbage in cell 0 (stricter than the contract; compile.mjs strictGen does that).
  const m = new Array(16).fill(0); m[1] = l[0] || 0; l.forEach((a, i) => { m[a] = l[i + 1] || 0; }); const G = GARB[g % GARB.length]; [0, 2, 3, 4, 5, 6, 7].forEach((c, j) => { if (c || process.env.LEARN_STRICT0 === '1') m[c] = G[j]; });
  const keep = [1, 8, 9, 10, 11, 12, 13, 14, 15].map((c) => m[c]);
  const z = run(prog, m, { maxSteps: 600000 }); if (!z || z.st.length) return undefined;
  if (kind === 'list2num') { if (![1, 8, 9, 10, 11, 12, 13, 14, 15].every((c, i) => z.mem[c] === keep[i])) return undefined; return z.mem[2]; }
  return walk(z.mem);
}
// every valid list, the program's answers (as the same codes fullOf uses) ⇒ {key, v}; undefined answers make the key unmatchable
// want (optional): the task's answers (fullOf(...).v); the check stops at the first list where the program fails or differs
export function progFull(kind, prog, want = null) { const A = allLists(); const v = new Int32Array(A.length);
  for (let i = 0; i < A.length; i++) { const y = runList(kind, prog, A[i], i); if (y === undefined) return { key: null, v: null, bad: 1, at: i }; v[i] = enc(kind, y); if (want && v[i] !== want[i]) return { key: null, v: null, bad: 1, at: i, differs: true }; }
  return { key: kind + ':' + hstr(hashI(v)), v, bad: 0 }; }
export function progNumOk(spec, prog, f = oracleOf(spec)) {   // all input combinations × 3 garbage patterns, inputs unchanged, empty stack
  const ins = spec.ins || []; const n = 16 ** ins.length;
  for (let g = 0; g < 3; g++) for (let c = 0; c < n; c++) { const a = ins.map((_, j) => (c >> (4 * j)) & 15); const m = Array.from({ length: 16 }, (_, k) => (k * 5 + g * 7 + c) & 15); ins.forEach((cell, j) => { m[cell] = a[j]; });
    const z = run(prog, m, { maxSteps: 600000 }); if (!z || z.st.length || z.mem[2] !== (f(...a) & 15) || !ins.every((cell, j) => z.mem[cell] === a[j])) return false; }
  return true; }

// ───────── history state (append-only files; later rows update earlier ones by id) ─────────
let MEM = null;   // id -> row ; bySig, byKey
function loadMem() {
  if (MEM) return MEM; MEM = { rows: new Map(), bySig: new Map(), byKey: new Map() };
  for (const r of rows(F('memory.jsonl'))) addMem(r, false);
  for (const u of rows(F('updates.jsonl'))) { const r = MEM.rows.get(u.id); if (r) Object.assign(r, u.set); }
  return MEM;
}
function addMem(r, persist = true) {
  const M = loadMem(); if (M.rows.has(r.id)) return false;
  M.rows.set(r.id, r); if (r.sig) { if (!M.bySig.has(r.sig)) M.bySig.set(r.sig, []); M.bySig.get(r.sig).push(r); }
  if (r.key) { if (!M.byKey.has(r.key)) M.byKey.set(r.key, []); M.byKey.get(r.key).push(r); }
  if (persist) append(F('memory.jsonl'), r); return true;
}
function update(id, set) { const r = loadMem().rows.get(id); if (!r) return; Object.assign(r, set); append(F('updates.jsonl'), { id, set }); }
export function memoryRows() { return [...loadMem().rows.values()]; }

// ───────── delta: history entries of the index ─────────
let DELTA = null; let CTX = null;
const ctx = () => CTX || (CTX = makeCtx(PROBES));
const RT = (name) => (PI.has(name) ? P[PI.get(name)].ret : null);
function valuesOf(T, ast) {   // values on the index probes, index convention (N: Int16-style clamp, L: packed, B: 0/1)
  const f = compile(ast, []); const c = ctx();
  if (T === 'N') { const v = c.valsN(f); return Int32Array.from(v, clamp16); }
  if (T === 'L') { const v = c.valsL(f); return v.raw ? null : v; }
  if (T === 'B') return c.valsB(f);
  return null;
}
function loadDelta() {
  if (DELTA) return DELTA; DELTA = { N: [], L: [], B: [], seen: new Set() };
  for (const e of rows(F('delta.jsonl'))) addDeltaEntry(e, false);
  return DELTA;
}
function addDeltaEntry(e, persist = true) {
  const D = loadDelta(); const k = e.T + ':' + e.h; if (D.seen.has(k)) return false; D.seen.add(k);
  let a = null; const nd = { v: e.T === 'B' ? Uint8Array.from(e.v) : Int32Array.from(e.v), c: 0, src: e.src, get ast() { return a || (a = parse(e.a)); } };
  D[e.T].push(nd); if (persist) append(F('delta.jsonl'), e); return true;
}
// an AST and its typed sub-terms (N / L / B) become history entries
export function addAstToDelta(ast, src = 'hist', from = null) {
  let n = 0; const seen = new Set();
  const visit = (t) => { if (t.h) return; const T = RT(t.p); if ((T === 'N' || T === 'L' || T === 'B') && size(t) >= 1) { const s = show(t); if (!seen.has(s)) { seen.add(s); n += addValued(T, t, s === show(ast) ? src : src + '-sub', from) ? 1 : 0; } } t.a.forEach(visit); };
  visit(ast); return n;
}
function addValued(T, t, src, from) { let v; try { v = valuesOf(T, t); } catch { return false; } if (!v) return false; if (T === 'N' && v.every((x) => x === BIG)) return false;
  return addDeltaEntry({ T, h: hstr(hashI(v)), v: Array.from(v), a: show(t), src, from }); }
export const delta = { forKind(kind) { const D = loadDelta(); return kind === 'list2num' ? { N: D.N, L: [], B: D.B } : { N: [], L: D.L, B: D.B }; }, size() { const D = loadDelta(); return D.N.length + D.L.length + D.B.length; } };
export function deltaOrNull() { if (process.env.LEARN === '0' || process.env.LEARN_DELTA === '0') return null; return delta.size() ? delta : null; }

// ───────── stage 'זיכרון': a behaviour seen before ⇒ the program the machine accepted then ─────────
export async function memoryStage(spec) {
  if (!learnOn(spec)) return { prog: null };
  const M = loadMem(); if (!M.rows.size) return { prog: null };
  const f = oracleOf(spec); let cands = [];
  if (spec.kind === 'num') { const k = numKey(spec, f); cands = (M.byKey.get(k) || []).filter((r) => r.prog && r.ver !== 'bad'); }
  else { const sg = sigOf(spec.kind, f); const bySig = (M.bySig.get(sg) || []).filter((r) => r.prog && r.ver !== 'bad' && r.kind === spec.kind); if (!bySig.length) return { prog: null };
    const full = fullOf(spec.kind, f).key; cands = bySig.filter((r) => r.key === full); }
  cands.sort((a, b) => (a.ver === 'ok' ? 0 : 1) - (b.ver === 'ok' ? 0 : 1) || a.len - b.len);
  for (const r of cands) {
    if (r.ver !== 'ok') {   // not yet checked on every input: check it now with the machine itself (batch refit normally does this)
      const ok = spec.kind === 'num' ? progNumOk(spec, r.prog, f) : progFull(spec.kind, r.prog).key === r.key;
      update(r.id, { ver: ok ? 'ok' : 'bad', verAt: new Date().toISOString() }); if (!ok) continue; }
    return { prog: r.prog, how: 'זיכרון: ' + (r.how || r.stage || ''), from: r.id, ast: r.ast ? parse(r.ast) : undefined };
  }
  return { prog: null };
}

// ───────── hook: after every solved task ─────────
export function recordSolved(spec, res) {
  if (!learnOn(spec) || !res || !res.ok || !res.prog || res.stage === 'זיכרון') return null;
  const t0 = Date.now();
  try {
    const f = oracleOf(spec); const row = { kind: spec.kind, prog: res.prog, len: res.prog.length, stage: res.stage, how: (res.how || '').slice(0, 300), name: spec.name || null, at: new Date().toISOString(), ver: 'pending' };
    if (spec.kind === 'num') { row.ins = spec.ins; row.tt = numTable(spec, f); row.key = 'num:' + (spec.ins || []).join(',') + ':' + md5(row.tt); }
    else { row.sig = sigOf(spec.kind, f); row.key = fullOf(spec.kind, f).key; row.cls = shapeOf(spec.kind, PROBES, PROBES.map((l) => f([...l]))); }
    row.id = md5(row.key + '|' + JSON.stringify(res.prog));
    if (res.ast && spec.kind !== 'num') { try { row.ast = typeof res.ast === 'string' ? res.ast : show(res.ast); row.astSrc = 'fg'; } catch {} }
    const isNew = addMem(row);
    let nd = 0; if (isNew && row.ast && process.env.LEARN_DELTA !== '0') nd = addAstToDelta(parse(row.ast), 'hist', row.id);
    return { id: row.id, isNew, delta: nd, ms: Date.now() - t0 };
  } catch (e) { return { err: String(e.message || e).slice(0, 80) }; }
}

// ───────── hook: the grammar stage found an AST (equal to the task on every valid list), compiled or not ─────────
export function recordAst(spec, r) {
  if (!learnOn(spec) || !r || !r.ok || !r.ast || spec.kind === 'num') return null;
  try {
    const f = oracleOf(spec); const s = show(r.ast); const key = fullOf(spec.kind, f).key;
    const row = { id: md5(key + '|ast|' + s), kind: spec.kind, sig: sigOf(spec.kind, f), key, cls: shapeOf(spec.kind, PROBES, PROBES.map((l) => f([...l]))), prog: null, len: 1e9, stage: 'דקדוק', ast: s, astSrc: 'fg-found', name: spec.name || null, at: new Date().toISOString(), ver: 'none' };
    const isNew = addMem(row); const nd = isNew && process.env.LEARN_DELTA !== '0' ? addAstToDelta(r.ast, 'hist', row.id) : 0;
    return { id: row.id, isNew, delta: nd };
  } catch (e) { return { err: String(e.message || e).slice(0, 80) }; }
}

// ───────── batch: exhaustive check of stored programs ─────────
export function verifyPending({ say = () => {} } = {}) {
  let ok = 0, bad = 0;
  for (const r of memoryRows()) { if (!r.prog || r.ver !== 'pending') continue;   // 'seed' rows (imported history) are checked only if they are ever reused
    let good;
    if (r.kind === 'num') good = progNumOk({ kind: 'num', ins: r.ins }, r.prog, ttOracle(r.ins, r.tt));   // the stored truth table is the oracle
    else good = progFull(r.kind, r.prog).key === r.key;
    update(r.id, { ver: good ? 'ok' : 'bad', verAt: new Date().toISOString() }); good ? ok++ : bad++; say(`verify ${r.kind} ${good ? 'ok' : 'BAD'} ${r.id}`); }
  return { ok, bad };
}

// ───────── batch: adapters (family solutions ⇒ G0 ASTs where expressible) ─────────
export function adaptRow(r, { index = null, prior = null, ms = 60000, live = true } = {}) {
  if (r.kind === 'num' || r.ast || !r.prog) return null;
  const pf = progFull(r.kind, r.prog); if (!pf.key) return { ok: false, why: 'program fails on some valid list' };
  if (pf.key !== r.key) { update(r.id, { ver: 'bad' }); return { ok: false, why: 'program differs from the task on some list' }; }
  if (r.ver !== 'ok') update(r.id, { ver: 'ok', verAt: new Date().toISOString() });
  const A = allLists(); const pos = new Map(); A.forEach((l, i) => pos.set(packList(l), i));
  const oracle = (l) => { const i = pos.get(packList(l)); if (i === undefined) return null; const c = pf.v[i]; return r.kind === 'list2list' ? (() => { const n = c & 15, o = []; for (let j = 0; j < n; j++) o.push(8 + ((c >>> (4 + 3 * j)) & 7)); return o; })() : c; };
  const res = solveLists(r.kind, oracle, { ms, index, prior, delta: deltaOrNull(), live });
  if (!res.ok) return { ok: false, why: 'not found', ms: res.ms };
  update(r.id, { ast: res.prog, astSrc: 'adapter', adaptMs: res.ms });
  const nd = addAstToDelta(res.ast, 'adapt', r.id);
  return { ok: true, prog: res.prog, via: res.via, ms: res.ms, delta: nd };
}

// ───────── batch: one-hole neighbours of the history ASTs ─────────
let POOLS = null;
export function fillers(maxC = 3, secs = 20) {
  if (POOLS) return POOLS; const out = {}; enumerate({ ctx: ctx(), costs: new Map(), maxCost: maxC, timeMs: secs * 1000, poolsOut: out, onNode: () => false });
  POOLS = {}; for (const [T, byC] of Object.entries(out.pools)) { POOLS[T] = []; byC.forEach((arr, c) => { if (arr) for (const nd of arr) POOLS[T].push(nd.ast); }); }
  return POOLS;
}
const typeAt = (t) => (t.h ? t.h : RT(t.p));
export function neighbours(ast, { maxPer = 4000 } = {}) {
  const pools = fillers(); const out = []; const root = typeAt(ast); if (root !== 'N' && root !== 'L') return out;
  const paths = []; (function rec(t, p) { if (t.h) return; if (p.length) paths.push(p); t.a.forEach((c, j) => rec(c, [...p, j])); })(ast, []);
  const at = (t, p) => p.reduce((x, j) => x.a[j], t);
  const repl = (t, p, s) => (p.length ? { p: t.p, a: t.a.map((c, j) => (j === p[0] ? repl(c, p.slice(1), s) : c)) } : s);
  // every sub-term position gets its share of the fillers (cheapest first), so the neighbourhood is spread over the whole tree
  const perPath = Math.max(30, Math.ceil(maxPer / Math.max(1, paths.length)));
  for (const p of paths) { const cur = show(at(ast, p)); const T = typeAt(at(ast, p)); let n = 0; for (const s of pools[T] || []) { if (show(s) === cur) continue; out.push(repl(ast, p, s)); if (++n >= perPath || out.length >= maxPer) break; } if (out.length >= maxPer) break; }
  return out;
}
export function addNeighbours({ say = () => {}, maxPer = 4000, index = null } = {}) {
  let added = 0, tried = 0; const astRows = memoryRows().filter((r) => r.ast && !r.nbDone && r.kind !== 'num');
  for (const r of astRows) { const ast = parse(r.ast); const T = typeAt(ast); let n = 0;
    for (const v of neighbours(ast, { maxPer })) { tried++; let vals; try { vals = valuesOf(T, v); } catch { continue; } if (!vals) continue;
      if (index && index.has(T, vals)) continue;   // already an index entry: nothing new
      if (addDeltaEntry({ T, h: hstr(hashI(vals)), v: Array.from(vals), a: show(v), src: 'nb', from: r.id })) n++; }
    update(r.id, { nbDone: true }); added += n; say(`neighbours ${r.id} +${n}`); }
  return { added, tried };
}

// ───────── batch: refit the learned costs / templates ─────────
export function refitPrior({ K = 16, out = F('prior.json'), extra = [] } = {}) {
  const best = new Map(); for (const r of memoryRows()) if (r.ast && r.kind !== 'num') { const b = best.get(r.key); if (!b || r.ast.length < b.ast.length) best.set(r.key, r); }   // one AST per behaviour (the shortest)
  const sols = [...[...best.values()].map((r) => ({ ast: parse(r.ast), cls: r.cls })), ...extra];
  if (sols.length < 4) return { n: sols.length, skipped: true };
  const pr = learnPrior(sols, K); pr.from = 'history:' + sols.length; pr.at = new Date().toISOString();
  fs.mkdirSync(path.dirname(out), { recursive: true }); const tmp = out + '.tmp'; fs.writeFileSync(tmp, JSON.stringify(pr)); fs.renameSync(tmp, out);
  return { n: sols.length, lib: pr.lib.length, out };
}

// ───────── CLI ─────────
if ((process.argv[1] || '').endsWith('learn.mjs')) {
  const [cmd, ...args] = process.argv.slice(2); const say = (s) => console.log(s);
  if (cmd === 'status') { const R = memoryRows(); const by = {}; for (const r of R) { const k = r.kind + ':' + (r.ver || '?') + (r.ast ? ':ast' : ''); by[k] = (by[k] || 0) + 1; } console.log(JSON.stringify({ rows: R.length, by, delta: delta.size() })); }
  else if (cmd === 'refit') {
    const t0 = Date.now(); const { loadIndex } = await import('./index.mjs');
    const ixF = process.env.FGINDEX || (fs.existsSync(path.join(DIR, 'index-learned.bin')) ? path.join(DIR, 'index-learned.bin') : path.join(DIR, 'index.bin'));
    const v = verifyPending({ say }); say('verify ' + JSON.stringify(v));
    let index = null; try { index = loadIndex(ixF); } catch {}
    const prior = (() => { try { return JSON.parse(fs.readFileSync(F('prior.json'), 'utf8')); } catch { return null; } })();
    let ad = 0, adt = 0; for (const r of memoryRows()) { if (r.kind === 'num' || r.ast || r.adaptTried) continue; adt++; const x = adaptRow(r, { index, prior, ms: +process.env.ADAPTMS || 30000 }); update(r.id, { adaptTried: true }); if (x && x.ok) ad++; say(`adapt ${r.stage} ${x && x.ok ? 'OK ' + x.prog : '-- ' + (x && x.why)}`); }
    const nb = args.includes('--no-nb') ? null : addNeighbours({ say: () => {}, index });
    const pr = refitPrior(); say('prior ' + JSON.stringify(pr));
    console.log(JSON.stringify({ verify: v, adapted: ad, adaptTried: adt, neighbours: nb, prior: pr, delta: delta.size(), ms: Date.now() - t0 }));
  }
  else console.log('usage: node fg/learn.mjs status | refit [--no-nb]');
}

// ───────── optional: multi-level abstraction (depth 2-3 templates learned from the history) ─────────
// level 1 = prior.mjs templates (anti-unification + MDL); level 2 (and 3) are learned on the corpus REWRITTEN with the
// previous levels, so a template may contain earlier templates; every template is expanded back to base productions for
// the enumerator. TESTED AND NOT USED: on the LOSO suites 5+6 (uniform part + one prior part, no history entries) it found 25 vs 26
// for the prior without templates (fg/loso/ml-*.jsonl); the rule was "keep only if it beats prior-only by >= 3 tasks".
export async function learnPriorML(sols, { K = 16, levels = 2, alpha = 0.3 } = {}) {
  const PR = await import('./prior.mjs');
  const { instantiate } = await import('./grammar.mjs');
  const LIB = new Map(); let all = [];
  const retOf = (t) => (t.h ? t.h : PI.has(t.p) ? P[PI.get(t.p)].ret : LIB.get(t.p).ret);
  const subtrees = (t, out = []) => { if (t.h) return out; out.push(t); for (const c of t.a) subtrees(c, out); return out; };
  const au = (x, y, holes) => { if (!x.h && !y.h && x.p === y.p && x.a.length === y.a.length) return { p: x.p, a: x.a.map((c, j) => au(c, y.a[j], holes)) }; const T = retOf(x); const k = holes.length; holes.push(T); return { h: T, k }; };
  const match = (tm, t, b) => { if (tm.h) { if (retOf(t) !== tm.h) return false; if (b[tm.k] && show(b[tm.k]) !== show(t)) return false; b[tm.k] = t; return true; } if (t.h || t.p !== tm.p || t.a.length !== tm.a.length) return false; for (let j = 0; j < t.a.length; j++) if (!match(tm.a[j], t.a[j], b)) return false; return true; };
  const renum = (t, m = { n: 0, types: [] }) => { if (t.h) { const k = m.n++; m.types.push(t.h); return { h: t.h, k }; } return { p: t.p, a: t.a.map((c) => renum(c, m)) }; };
  const expand = (t) => { if (t.h) return t; const a = t.a.map(expand); if (LIB.has(t.p)) return instantiate(LIB.get(t.p).base, a); return { p: t.p, a }; };
  const rewrite = (t, lib) => { if (t.h) return t; for (const L of lib) { const b = []; if (match(L.tmpl, t, b) && b.length === L.args.length && b.every(Boolean)) return { p: L.name, a: b.map((c) => rewrite(c, lib)) }; } return { p: t.p, a: t.a.map((c) => rewrite(c, lib)) }; };
  let corpus = sols.map((s) => s.ast);
  for (let lv = 1; lv <= levels; lv++) {
    const flat = corpus.flatMap((t, ti) => subtrees(t).filter((x) => size(x) >= 2).map((x) => ({ ti, x })));
    const byRoot = new Map(); for (const e of flat) { if (!byRoot.has(e.x.p)) byRoot.set(e.x.p, []); byRoot.get(e.x.p).push(e); }
    const cand = new Map();
    for (const [, es] of byRoot) for (let i = 0; i < es.length && i < 400; i++) for (let j = i + 1; j < es.length && j < 400; j++) { if (es[i].ti === es[j].ti) continue; const tm = au(es[i].x, es[j].x, []); if (size(tm) < 2) continue; const r = renum(tm); const k = show(r); if (!cand.has(k)) cand.set(k, r); }
    const scored = [...cand.values()].map((tm) => ({ tm, tasks: corpus.map((t, ti) => (subtrees(t).some((s) => match(tm, s, [])) ? ti : -1)).filter((x) => x >= 0), sz: size(tm) })).filter((c) => c.tasks.length >= 2);
    // a level > 1 template must use at least one earlier template (otherwise level 1 would have had it)
    const useLib = (t) => !t.h && (LIB.has(t.p) || t.a.some(useLib));
    const chosen = []; const covered = corpus.map(() => new Set());
    for (let r = 0; r < K; r++) { let best = null, bg = 0;
      for (const c of scored) { if (chosen.includes(c) || (lv > 1 && !useLib(c.tm))) continue; const fresh = c.tasks.filter((ti) => ![...covered[ti]].some((o) => show(o).includes(show(c.tm)))).length; const g = fresh * (c.sz - 1) - c.sz; if (g > bg) { bg = g; best = c; } }
      if (!best) break; chosen.push(best); for (const ti of best.tasks) covered[ti].add(best.tm); }
    const lib = chosen.map((c) => { const m = { n: 0, types: [] }; const tm = renum(c.tm, m); const name = 'lib' + (LIB.size + chosen.indexOf(c)); return { name, ret: retOf(tm), args: m.types, tmpl: tm, tasks: c.tasks.length, level: lv }; });
    for (const L of lib) { L.base = expand(L.tmpl); LIB.set(L.name, L); }
    all = [...all, ...lib]; if (!lib.length) break;
    corpus = corpus.map((t) => rewrite(t, [...lib].sort((x, y) => size(y.tmpl) - size(x.tmpl))));
  }
  // enumerator view: every template over base productions; costs fitted on the fully rewritten corpus
  const libOut = all.map((L) => ({ name: L.name, ret: L.ret, args: L.args, tmpl: L.base, tasks: L.tasks, level: L.level, show: show(L.base) }));
  const costs = PR.fitCosts(corpus, libOut, alpha); for (const l of libOut) l.cost = costs[l.name];
  const by = {}; sols.forEach((s, j) => { (by[s.cls] ||= []).push(corpus[j]); });
  const byClass = {}; for (const c of PR.CLASSES) byClass[c] = PR.fitCosts([...(by[c] || []), ...(by[c] || []), ...corpus], libOut, alpha);
  return { costs, lib: libOut, byClass, n: sols.length, levels };
}
