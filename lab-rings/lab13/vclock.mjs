// Virtual clock for the value builder (tzoref-value.mjs + tzoref-value-fast.mjs).
// The value builder's budgets (VMS, and the ms other builders pass to it) were set for the original search engine.
// The fast engine does the same search steps in less real time. So that it explores exactly as far as the original did
// within a budget (same results, only sooner), its time checks use this clock: real time, except that the time spent
// inside the fast search is replaced by what the original engine spends on the same steps, from a cost model fitted on
// the original engine (vprobe/calib-run.mjs + vprobe/fit.mjs; NOTES.md). The clock never runs slower than real time.
// VREAL=1: plain real time (the fast engine then searches further within the same real budget).
import { performance } from 'perf_hooks';
let skew = 0;                 // virtual minus real, ms
export const vnow = () => Date.now() + skew;
// ms per step of the original engine (fitted on suite-1 tasks only). Steps in SCALED cost proportionally to NN/96.
// candH / sortH: extra cost per candidate / per sort unit for each GB of the original engine's heap (its garbage collector);
// candM: extra cost per candidate per doubling of the number of stored values (bigger hash map, more cache misses).
export const SAFETY = 0.92;   // charge 92% of the modelled cost: the model's error on single runs was within +-7%, so the fast engine never stops short of where the original would have stopped
export const COEF = { ev1: 1.6003e-03, ev2: 1.7220e-03, ev3: 1.6934e-03, addNew: 1.7373e-03, addDup: 2.4270e-06, addFull: 6.4105e-04, inv: 2.3043e-05, invKey: 0.0000e+00, cover: 1.1908e-04, coverD: 4.1364e-03, pair: 0.0000e+00, trip: 2.4390e-05, close: 0.0000e+00, sortNL: 1.7658e-04, csortNL: 0.0000e+00, candH: 0.0000e+00, sortH: 5.6609e-05, candM: 7.0294e-06 };   // fitted coefficients x SAFETY (vprobe/coef-final.json)
const SCALED = new Set(['ev1', 'ev2', 'ev3', 'addNew', 'addDup', 'addFull', 'invKey', 'cover', 'close']);
const BASE = Object.keys(COEF).filter(k => k !== 'candH' && k !== 'sortH' && k !== 'candM');
// heap of the original engine at this point: this process's heap + what the original kept per stored value
export const PERVAL = NN => 300 + NN;
let heapReal = 0, heapAt = -1e9;
const heapNow = () => { const t = performance.now(); if (t - heapAt > 100) { heapReal = process.memoryUsage().heapUsed; heapAt = t; } return heapReal; };
export const stats = { model: 0, real: 0 };
// C: counters of one fast search (C.NN vector length, C.made stored values). Each tick adds the modelled cost of the
// steps done since the previous tick (of this C) and moves the clock forward by (modelled - real) when that is positive.
const ST = new WeakMap();
export function tick(C) {
  const now = performance.now(); let s = ST.get(C);
  if (!s) { s = { real: now, c: {} }; for (const k of BASE) s.c[k] = C[k] || 0; ST.set(C, s); return; }
  const NN = C.NN || 96, sc = NN / 96; let dm = 0, dCand = 0, dSort = 0;
  for (const k of BASE) { const v = C[k] || 0, d = v - s.c[k]; if (!d) continue; s.c[k] = v; dm += d * COEF[k] * (SCALED.has(k) ? sc : 1);
    if (k === 'ev1' || k === 'ev2' || k === 'ev3' || k === 'addNew' || k === 'addDup' || k === 'addFull') dCand += d; else if (k === 'sortNL' || k === 'csortNL') dSort += d; }
  if (dCand || dSort) { const made = C.made || 0; const H = (heapNow() + made * PERVAL(NN)) / 1e9;
    dm += dCand * sc * (COEF.candH * H + COEF.candM * Math.log2(made + 2)) + dSort * COEF.sortH * H; }
  const dr = now - s.real; s.real = now; stats.model += dm; stats.real += dr;
  if (!process.env.VREAL && dm > dr) skew += dm - dr; }
export function modelMs() { return stats.model; }
