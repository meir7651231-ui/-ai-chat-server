// fg/prior.mjs - learned costs for G0 from the search's own earlier solutions (port of strat-library/learn.mjs):
//   templates by anti-unification + greedy MDL, then production costs in bits per return type (alpha smoothing),
//   globally and per example-shape class. Unused productions (including the G0 additions) get the smoothed
//   zero-count cost of their type, so nothing is hand-priced.
// usage: node fg/prior.mjs <out.json> <K templates> <history.jsonl ...>   (rows: {ok, ast, cls})
import fs from 'fs';
import { P, PI, show, size } from './grammar.mjs';
const retOf = (t, LIB) => (t.h ? t.h : PI.has(t.p) ? P[PI.get(t.p)].ret : LIB.get(t.p).ret);
function au(x, y, holes) {
  if (!x.h && !y.h && x.p === y.p && x.a.length === y.a.length) return { p: x.p, a: x.a.map((c, j) => au(c, y.a[j], holes)) };
  const T = retOf(x); const k = holes.length; holes.push(T); return { h: T, k };
}
const subtrees = (t, out = []) => { if (t.h) return out; out.push(t); for (const c of t.a) subtrees(c, out); return out; };
function match(tm, t, b) { if (tm.h) { if (retOf(t) !== tm.h) return false; if (b[tm.k] && show(b[tm.k]) !== show(t)) return false; b[tm.k] = t; return true; } if (t.h || t.p !== tm.p || t.a.length !== tm.a.length) return false; for (let j = 0; j < t.a.length; j++) if (!match(tm.a[j], t.a[j], b)) return false; return true; }
const usesIn = (tm, t) => subtrees(t).some((s) => match(tm, s, []));
const renum = (t, m = { n: 0, types: [] }) => { if (t.h) { const k = m.n++; m.types.push(t.h); return { h: t.h, k }; } return { p: t.p, a: t.a.map((c) => renum(c, m)) }; };
export function learnLibrary(sols, K = 12) {
  const flat = sols.flatMap((s, ti) => subtrees(s.ast).filter((x) => size(x) >= 2).map((x) => ({ ti, x })));
  const byRoot = new Map(); for (const e of flat) { if (!byRoot.has(e.x.p)) byRoot.set(e.x.p, []); byRoot.get(e.x.p).push(e); }
  const cand = new Map();
  for (const [, es] of byRoot) for (let i = 0; i < es.length; i++) for (let j = i + 1; j < es.length; j++) {
    if (es[i].ti === es[j].ti) continue;
    const tm = au(es[i].x, es[j].x, []); if (size(tm) < 2) continue;
    const r = renum(tm); const k = show(r); if (!cand.has(k)) cand.set(k, r);
  }
  const chosen = []; const covered = sols.map(() => new Set());
  const scored = [...cand.values()].map((tm) => ({ tm, tasks: sols.map((s, ti) => (usesIn(tm, s.ast) ? ti : -1)).filter((x) => x >= 0), sz: size(tm) })).filter((c) => c.tasks.length >= 2);
  for (let r = 0; r < K; r++) {
    let best = null, bg = 0;
    for (const c of scored) { if (chosen.includes(c)) continue; const fresh = c.tasks.filter((ti) => ![...covered[ti]].some((o) => show(o).includes(show(c.tm)))).length; const g = fresh * (c.sz - 1) - c.sz; if (g > bg) { bg = g; best = c; } }
    if (!best) break; chosen.push(best); for (const ti of best.tasks) covered[ti].add(best.tm);
  }
  return chosen.map((c, j) => { const m = { n: 0, types: [] }; const tm = renum(c.tm, m); return { name: 'lib' + j, ret: P[PI.get(tm.p)].ret, args: m.types, tmpl: tm, tasks: c.tasks.length, show: show(tm) }; });
}
export function rewrite(t, LIB) { if (t.h) return t; for (const L of LIB) { const b = []; if (match(L.tmpl, t, b) && b.length === L.args.length && b.every(Boolean)) return { p: L.name, a: b.map((c) => rewrite(c, LIB)) }; } return { p: t.p, a: t.a.map((c) => rewrite(c, LIB)) }; }
export function fitCosts(asts, LIBARR, alpha = 0.3) {
  const cnt = new Map(); const walk = (t) => { cnt.set(t.p, (cnt.get(t.p) || 0) + 1); t.a.forEach(walk); };
  asts.forEach(walk);
  const byT = new Map(); for (const p of P) { if (p.tag === 'top') continue; if (!byT.has(p.ret)) byT.set(p.ret, []); byT.get(p.ret).push(p.name); }
  for (const l of LIBARR) byT.get(l.ret).push(l.name);
  const costs = {};
  for (const [, names] of byT) { const tot = names.reduce((s, n) => s + (cnt.get(n) || 0), 0); for (const n of names) costs[n] = Math.max(1, Math.min(9, Math.round(-Math.log2(((cnt.get(n) || 0) + alpha) / (tot + alpha * names.length))))); }
  return costs;
}
export const CLASSES = ['L-perm', 'L-contig', 'L-subseq', 'L-other', 'N-count', 'N-elem', 'N-other'];
export function learnPrior(sols, K = 16) {
  const lib = learnLibrary(sols, K);
  const rw = sols.map((s) => rewrite(s.ast, lib));
  const costs = fitCosts(rw, lib);
  for (const l of lib) l.cost = costs[l.name];
  const by = {}; sols.forEach((s, j) => { (by[s.cls] ||= []).push(rw[j]); });
  const byClass = {}; for (const c of CLASSES) byClass[c] = fitCosts([...(by[c] || []), ...(by[c] || []), ...rw], lib);
  return { costs, lib, byClass, n: sols.length };
}
if ((process.argv[1] || '').endsWith('prior.mjs')) {
  const [out, K, ...files] = process.argv.slice(2);
  const sols = files.flatMap((f) => fs.readFileSync(f, 'utf8').trim().split('\n').map((x) => JSON.parse(x))).filter((r) => r.ok && r.ast);
  const pr = learnPrior(sols, +K);
  pr.from = files.map((f) => f.split('/').pop());
  fs.writeFileSync(out, JSON.stringify(pr));
  console.log('solutions', sols.length, 'templates', pr.lib.length); for (const l of pr.lib) console.log(' ', l.name, 'cost', l.cost, 'tasks', l.tasks, l.show);
}
