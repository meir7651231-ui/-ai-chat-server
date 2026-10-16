// lamc.mjs - lambda holes ⇒ machine code, by TRUTH TABLE (never by the lambda's name):
//   the table is what the witness computes on the environments it was actually seen in (examples), and it is filled by
//   1. a shelf closure (scanfold lib(): shelf tools and small compositions of them, matched by table on the seen domain),
//   2. a structural split (each operand is its own hole, the operator a 1/2-input hole over the operand values),
//   3. the value builder (tzoref-value.mjs valueBuild) learning a new tool from the table (cached in fg/learned-tools.json).
// cells: var ⇒ cell holding it at run time. mode: 'bool' (nonzero = true) · 'num' (exact 0..15) · 'mod16' (value & 15) · 'key' (any order-preserving 0..15 code).
import fs from 'fs';
import { run } from '../machine3s.mjs';
import { assemble, T_, P_, MV, SET, callTool, JLT, JNE } from '../greedylib.mjs';
import { lib } from '../scanfold.mjs';
import { scanTools } from '../scan-tools.mjs';
import { valueBuild } from '../tzoref-value.mjs';
import { relocate } from '../chainsafe.mjs';
import { evalLam, lamVars, showLam, BOOLOPS } from './ir.mjs';
const R = (k) => Math.floor(Math.random() * k);
export const LCELLS = [0, 2, 3, 4, 5, 6, 7];
export const varOf = (env, v) => (v.startsWith('g.') ? env.G?.[v.slice(2)] : v.startsWith('o.') ? env.O?.[v.slice(2)] : env[v]);
export const STATS = { log: [] };
const say = (...a) => { if (process.env.FGDBG) console.error('[lamc]', ...a); };

// ───────── closure ⇒ code (scanfold expression {v} | {f:tool, a:[...]}) ─────────
export function emitClosure(e, varCell, out, live, free) {
  const code = []; const pool = free.filter((c) => c !== out && !Object.values(varCell).includes(c) && !live.includes(c)); const held = new Set();
  const rec = (x, target) => {
    if (x.v != null) { const c = varCell[x.v]; if (c == null) throw new Error('closure var ' + x.v); return c; }
    const args = []; const mine = [];
    for (const ch of x.a) { let r = rec(ch, null); if (args.includes(r)) { const t = pool.shift(); if (t == null) throw new Error('closure: no temp'); code.push(...MV(r, t)); held.add(t); mine.push(t); r = t; } else if (held.has(r)) mine.push(r); args.push(r); }
    let t = target; if (t == null || args.includes(t)) { t = pool.shift(); if (t == null) throw new Error('closure: no temp'); }
    const c = callTool(x.f, args, t, new Set([...live, ...Object.values(varCell), ...held, ...args, t === target ? [] : []].flat()));
    if (!c) throw new Error('closure: no room for tool');
    code.push(...c);
    for (const m of mine) { held.delete(m); pool.unshift(m); }
    held.add(t); return t;
  };
  const r = rec(e, out); if (r !== out) code.push(...MV(r, out));
  return code;
}
const showC = (e) => (e.v != null ? e.v : `${e.f.name}(${e.a.map(showC).join(',')})`);

// ───────── table search over shelf closures ─────────
// rows: [{k:[v1..vk], y}] ; accept(tabValue, y) decides a match (exact / bool / mod16)
function matchUnary(rows, acc) { const { UC } = lib(); for (const u of UC) { let ok = true; for (const r of rows) { const w = u.tab[r.k[0]]; if (w < 0 || !acc(w, r.y)) { ok = false; break; } } if (ok) return { e: u.e, vars: ['a'] }; } return null; }
function matchBinary(rows, acc) { const { BC } = lib();
  for (const b of BC) { if (!b.useR || !b.useS) continue; for (const sw of [0, 1]) { let ok = true; for (const r of rows) { const p = sw ? r.k[1] : r.k[0], q = sw ? r.k[0] : r.k[1]; const w = b.tab[(p << 4) | q]; if (w < 0 || !acc(w, r.y)) { ok = false; break; } } if (ok) return { e: b.e, vars: sw ? ['s', 'r'] : ['r', 's'] }; } }
  return null; }
const PERM3 = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
function matchTernary(rows, acc) { const { T } = scanTools();
  for (const t of T) for (const pm of PERM3) { let ok = true; for (const r of rows) { const a = r.k[pm[0]], b = r.k[pm[1]], c = r.k[pm[2]]; const w = t.T[(a << 8) | (b << 4) | c]; if (w < 0 || !acc(w, r.y)) { ok = false; break; } }
    if (ok) { const V = ['p', 'q', 'u']; const e = { f: t, a: [0, 1, 2].map((j) => ({ v: V[pm[j]] })) }; return { e, vars: V }; } }
  return null; }

// ───────── learned tools (value builder), cached by table ─────────
const LT_FILE = new URL('./learned-tools.json', import.meta.url);
let LT = null; const ltLoad = () => { if (!LT) { try { LT = JSON.parse(fs.readFileSync(LT_FILE, 'utf8')); } catch { LT = {}; } } return LT; };
const ltSave = () => { try { fs.writeFileSync(LT_FILE, JSON.stringify(LT)); } catch {} };
function toolOk(prog, k, rows, acc) {
  const tool = { ins: [0, 1, 3].slice(0, k), out: 2, prog };
  const maps = [[[3, 4, 5].slice(0, k), 6, [7]], [[5, 6, 7].slice(0, k), 2, [3, 4]], [[0, 2, 6].slice(0, k), 4, [3, 5]]];
  for (const [ic, oc, lv] of maps) { const c = callTool(tool, ic, oc, new Set(lv)); if (!c) return false; let p; try { p = assemble(c); } catch { return false; }
    for (const r of rows) { const m = Array.from({ length: 16 }, () => R(16)); ic.forEach((cc, j) => { m[cc] = r.k[j]; }); const m0 = m.slice(); const z = run(p, m, { maxSteps: 60000 });
      if (!z || z.st.length || !acc(z.mem[oc], r.y) || ic.some((cc, j) => z.mem[cc] !== r.k[j]) || lv.some((cc) => z.mem[cc] !== m0[cc]) || [1, 8, 9, 10, 11, 12, 13, 14, 15].some((cc) => z.mem[cc] !== m0[cc])) return false; } }
  return true; }
function learnTool(rows, k, mode, { ms = +process.env.FG_VBMS || 60000 } = {}) {
  const key = k + ':' + mode + ':' + rows.map((r) => r.k.join(',') + '>' + r.y).sort().join(';');
  const C = ltLoad(); const acc = ACC[mode];
  if (C[key]) { if (!C[key].prog) return null; return { tool: { ins: [0, 1, 3].slice(0, k), out: 2, prog: C[key].prog, name: 'נלמד' }, k }; }
  if (process.env.FG_NOVB) return null;
  const ins = [0, 1, 3].slice(0, k);
  const gen = () => { const r = rows[R(rows.length)]; const mem = Array.from({ length: 16 }, () => R(16)); ins.forEach((c, j) => { mem[c] = r.k[j]; }); const m0 = mem.slice();
    const want = mode === 'bool' ? (r.y ? 15 : 0) : mode === 'mod16' ? r.y & 15 : r.y; return { mem, want, ok: (z) => acc(z[2], r.y) && ins.every((c, j) => z[c] === r.k[j]) && [8, 9, 10, 11, 12, 13, 14, 15].every((c) => z[c] === m0[c]) }; };
  const t0 = Date.now(); let prog = null;
  for (let attempt = 0; attempt < 3 && !prog && Date.now() - t0 < ms; attempt++) {   // the value builder is randomised: a quick failure is retried
    let v = null; try { v = valueBuild(gen, { name: 'fg-hole', ins, out: 2, ms: ms - (Date.now() - t0) }); } catch (e) { v = null; }
    prog = v && v.prog ? relocate(v.prog) : null; if (prog && !toolOk(prog, k, rows, acc)) prog = null; }
  say('valueBuild', k, mode, rows.length, 'rows', prog ? 'OK ' + prog.length : 'fail', Date.now() - t0, 'ms');
  STATS.log.push({ vb: true, ok: !!prog, ms: Date.now() - t0 });
  C[key] = { prog, ms: Date.now() - t0 }; ltSave();
  return prog ? { tool: { ins, out: 2, prog, name: 'נלמד' }, k } : null; }
const ACC = { num: (w, y) => w === y, mod16: (w, y) => w === (y & 15), bool: (w, y) => (w !== 0) === !!y, key: (w, y) => w === y };

// ───────── the lambda compiler ─────────
// obs: environments seen while the witness ran (objects with x,i,a,b,..,G,O). cells: var ⇒ cell. Returns code items (labels allowed).
// extra: {cntCode(node, outCell, live, free) ⇒ code} supplied by the frame for nested pair counts (#before/#after/#all)
export function compileLam(e, obs, cells, out, { mode = 'num', live = [], free = LCELLS, extra = {}, depth = 0 } = {}) {
  // rank transform for sort keys: order is all that matters
  if (mode === 'key') { const vals = [...new Set(obs.map((o) => evalLam(e, o)))].sort((a, b) => a - b); if (vals.length > 16) throw new Error('key has more than 16 values');
    if (vals.every((v) => v >= 0 && v <= 15)) mode = 'num'; else { const rk = new Map(vals.map((v, i) => [v, i])); return compileVals(e, obs, cells, out, { mode: 'num', live, free, extra, depth, valf: (o) => rk.get(evalLam(e, o)) }); } }
  return compileVals(e, obs, cells, out, { mode, live, free, extra, depth, valf: (o) => evalLam(e, o) });
}
function rowsOf(vars, obs, valf, mode) { const m = new Map(); for (const o of obs) { const k = vars.map((v) => varOf(o, v)); if (k.some((x) => !(x >= 0 && x <= 15))) return { bad: 'var out of 0..15' }; const y = valf(o); const key = k.join(','); const yy = mode === 'bool' ? !!y : y;
    if (m.has(key) && m.get(key).y !== yy) return { bad: 'not a function of its vars' }; m.set(key, { k, y: yy }); }
  return { rows: [...m.values()] }; }
export function compileVals(e, obs, cells, out, o) {
  const { mode, live, free, valf } = o; const depth = o.depth || 0; const extra = o.extra || {}; const acc = ACC[mode];
  // nested counts: compute them first into temps, then they are plain vars
  if (hasCnt(e)) { const { e2, cnts } = liftCnt(e); const code = []; const cl = { ...cells }; let fr = free.filter((c) => c !== out && !live.includes(c) && !Object.values(cells).includes(c)); const lv = [...live];
    for (const [name, node] of cnts) { const t = fr.shift(); if (t == null) throw new Error('no temp for count');
      if (isDev(node)) { const sc = fr.find((c) => c !== t); if (sc == null) throw new Error('no temp for deviation'); code.push(...devSignCode(cl, t, sc)); }
      else { if (!extra.cntCode) throw new Error('nested count needs a frame loop'); code.push(...extra.cntCode(node, t, [...lv, ...Object.values(cl)], fr.filter((c) => c !== t), obs)); }
      cl[name] = t; lv.push(t); }
    const obs2 = obs.map((ob) => { const z = { ...ob }; for (const [name, node] of cnts) z[name] = liftVal(node, ob); return z; });
    code.push(...compileVals(e2, obs2, cl, out, { ...o, live: lv, free: fr, valf: (ob) => valf(ob) }));
    return code; }
  const vars = [...lamVars(e)].filter((v) => v !== 'L');
  for (const v of vars) if (cells[v] == null) throw new Error('var ' + v + ' not available in this frame');
  if (!vars.length) { const y = valf(obs[0] || {}); const yy = mode === 'bool' ? (y ? 15 : 0) : mode === 'mod16' ? y & 15 : y; if (!(yy >= 0 && yy <= 15)) throw new Error('const out of range'); return SET(out, yy); }
  const rr = rowsOf(vars, obs, valf, mode);
  if (rr.bad) throw new Error(rr.bad + ' in ' + showLam(e));
  const rows = rr.rows;
  if (mode === 'num' && rows.some((r) => !(r.y >= 0 && r.y <= 15))) { if (e.op && depth < 4) return structural(e, obs, cells, out, o); throw new Error('value out of 0..15: ' + showLam(e)); }
  // identity
  if (vars.length === 1 && rows.every((r) => acc(r.k[0], r.y))) { const c = cells[vars[0]]; return c === out ? [] : MV(c, out); }
  // 1. shelf closures by table
  let m = null;
  if (vars.length === 1) m = matchUnary(rows, acc); else if (vars.length === 2) m = matchBinary(rows, acc); else if (vars.length === 3) m = matchTernary(rows, acc);
  if (m) { const vc = {}; m.vars.forEach((v, j) => { vc[v] = cells[vars[j]]; }); say('closure', showLam(e), '⇐', showC(m.e)); return emitClosure(m.e, vc, out, live, free); }
  // 2. structural split
  let tempErr = null; if (e.op && depth < 4) { try { return structural(e, obs, cells, out, o); } catch (err) { say('structural failed', showLam(e), err.message); if (/no temp|no room/.test(err.message)) tempErr = err; } }
  // 3. value builder (learned tool)
  if (vars.length <= 2) { const t = learnTool(rows, vars.length, mode); if (t) { const c = callTool(t.tool, vars.map((v) => cells[v]), out, new Set([...live, ...vars.map((v) => cells[v])])); if (c) return c; } }
  if (tempErr) throw tempErr;
  throw new Error('no tool for ' + showLam(e) + ' (' + vars.length + ' vars, ' + rows.length + ' rows)');
}
function structural(e, obs, cells, out, o) {
  const { live, free, extra, valf, mode } = o; const depth = o.depth || 0;
  if (e.k !== undefined || e.v !== undefined || e.cnt) throw new Error('leaf');
  const kids = e.op === 'in' ? [e.a[0]] : e.a;
  // operand reps: numbers exact 0..15; booleans as 15/0
  const code = []; let fr = free.filter((c) => c !== out && !live.includes(c) && !Object.values(cells).includes(c)); const lv = [...live]; const cl = { ...cells }; const names = []; const wraps = [];
  kids.forEach((k, j) => {
    if (k.v !== undefined && cells[k.v] != null) { names.push(k.v); return; }
    if (k.k !== undefined) { names.push({ k: k.k }); return; }
    const t = fr.shift(); if (t == null) throw new Error('no temp for operand');
    const isB = k.op && BOOLOPS.has(k.op);
    // a wide operand whose values span at most 16 numbers is kept mod 16 (still one-to-one, so the parent's table stays a function)
    let lo = Infinity, hi = -Infinity; if (!isB) for (const ob of obs) { const v = evalLam(k, ob); if (v < lo) lo = v; if (v > hi) hi = v; }
    const wrap = !isB && !(lo >= 0 && hi <= 15) && hi - lo <= 15; wraps[j] = wrap;
    code.push(...compileVals(k, obs, cells, t, { ...o, mode: wrap ? 'mod16' : 'num', live: [...lv, ...Object.values(cl)], free: fr, depth: depth + 1, valf: (ob) => { const v = evalLam(k, ob); return isB ? (v ? 15 : 0) : v; } }));
    const nm = '$' + depth + '_' + j; cl[nm] = t; lv.push(t); names.push(nm);
  });
  const sub = { op: e.op, set: e.set, a: names.map((nm) => (typeof nm === 'string' ? { v: nm } : { k: nm.k })) };
  const kidVal = (ob, j) => { const k = kids[j]; const v = evalLam(k, ob); return k.op && BOOLOPS.has(k.op) ? (v ? 15 : 0) : wraps[j] ? v & 15 : v; };
  const obs2 = obs.map((ob) => { const z = { ...ob }; names.forEach((nm, j) => { if (typeof nm === 'string' && nm.startsWith('$')) z[nm] = kidVal(ob, j); }); return z; });
  code.push(...compileVals(sub, obs2, cl, out, { ...o, live, free: fr, depth: depth + 1, valf }));
  return code;
}
// nested parts that are lifted out of a hole and computed first: pair counts (#), G1 tree depths, G1 deviation signs
const isDev = (x) => !!x && (x.op === 'dev' || x.op === 'adev');
const hasCnt = (e) => !!e && (!!e.cnt || !!e.tdep || isDev(e) || (e.a || []).some(hasCnt));
function liftCnt(e) { const cnts = []; const rec = (x) => { if (x.cnt || x.tdep || isDev(x)) { const nm = '#' + cnts.length; cnts.push([nm, x]); return { v: nm }; } if (x.a) return { ...x, a: x.a.map(rec) }; return x; }; return { e2: rec(e), cnts }; }
// value a lifted part stands for in the table: a count / a depth as is; a deviation only by its sign (0 below the mean, 1 on it, 2 above)
const liftVal = (node, ob) => { if (isDev(node)) { const d = evalLam({ ...node, op: 'dev' }, ob); return d < 0 ? 0 : d === 0 ? 1 : 2; } return evalLam(node, ob); };
// sign of x·n − sum from the parked floor mean q and remainder r: above ⟺ x > q ; on it ⟺ x = q and r = 0
function devSignCode(cells, out, scr) { const X = cells.x, Q = cells['g.q'], Rr = cells['g.r']; if (X == null || Q == null || Rr == null) throw new Error('var g.q not available in this frame');
  const D = 'dv' + (++DVU); return [...SET(out, 2), ...JLT(Q, X, scr, D), ...SET(out, 0), ...JNE(X, Q, scr, D), ...T_(Rr), ['J', D], ...SET(out, 1), D]; }
let DVU = 0;

// a hole given directly as a table over named cell vars: rows [{k:[..], y}] (used for operators between computed numbers)
export function compileTable(vars, rows, cells, out, { mode = 'num', live = [], free = LCELLS } = {}) {
  const acc = ACC[mode];
  const m2 = new Map(); for (const r of rows) { const key = r.k.join(','); const y = mode === 'bool' ? !!r.y : mode === 'mod16' ? r.y & 15 : r.y; if (m2.has(key) && m2.get(key).y !== y) throw new Error('operator table is not a function'); m2.set(key, { k: r.k, y }); }
  const R2 = [...m2.values()];
  if (R2.some((r) => r.k.some((x) => !(x >= 0 && x <= 15)))) throw new Error('operand out of 0..15');
  if (mode === 'num' && R2.some((r) => !(r.y >= 0 && r.y <= 15))) throw new Error('operator value out of 0..15');
  if (!vars.length || R2.every((r) => r.y === R2[0].y && mode !== 'bool')) { if (!R2.length) throw new Error('no rows'); return SET(out, mode === 'bool' ? (R2[0].y ? 15 : 0) : R2[0].y); }
  if (vars.length === 1 && R2.every((r) => acc(r.k[0], r.y))) { const c = cells[vars[0]]; return c === out ? [] : MV(c, out); }
  let m = vars.length === 1 ? matchUnary(R2, acc) : vars.length === 2 ? matchBinary(R2, acc) : vars.length === 3 ? matchTernary(R2, acc) : null;
  if (m) { const vc = {}; m.vars.forEach((v, j) => { vc[v] = cells[vars[j]]; }); return emitClosure(m.e, vc, out, live, free); }
  if (vars.length <= 2) { const t = learnTool(R2, vars.length, mode); if (t) { const c = callTool(t.tool, vars.map((v) => cells[v]), out, new Set([...live, ...vars.map((v) => cells[v])])); if (c) return c; } }
  throw new Error('no tool for operator table (' + vars.length + ' inputs, ' + R2.length + ' rows)');
}
