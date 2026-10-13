# lab13-value — FASTER VALUE BUILDER (speed-up agent, KEY=value)
Workdir: this dir (copy of lab13 made 2026-10-13 01:41; shelf reset from *.before-bench100.json).
Task: make tzoref-value.mjs valueBuild reach the same solutions faster; measure with ../speedrun.mjs on ../speedset.json.
Rules: nice -n 5, one heavy node at a time, new code in new modules + minimal hooks, no Hebrew in code logic.

## Log
- 01:41 copied lab13 -> lab13-value, reset shelf.
- Baseline: all 6 num speed-set tasks FAIL in valueBuild after 92-102 s (budget VMS=90000; learned budget stays 90 s
  because max win in history is 177 s). So for these tasks the stage is budget-bound, not result-bound.
- 01:55 profile (node --cpu-prof, vprobe/cp3): valueBuild time is ALL search (add/Map/string keys, k2 loop, close(), GC);
  tables3/partTables are cheap now (0.3 s). Trace (vprobe/value-trace.mjs, VTRACE=1): task#3 level4 runs 10s..90s, bank full (3M);
  task#0 round0 found wrong expr at 75 s -> round1 gets 15 s. Search is budget-bound; nothing completes.
- caseBuild (פיצול-מקרים) calls valueBuild at leaves (leafValue, 6-8 s budgets): task#1 case 82 s of which 63 s inside valueBuild.
- PLAN: (1) tzoref-value-fast.mjs = same search, typed arena + own hash sets (exact same order/ties/stops).
  (2) vclock.mjs = virtual clock: time checks see the ORIGINAL engine's cost for the same steps (fitted cost model),
      so the frontier reached in a budget is the same as before, only sooner in real time. VREAL=1 = plain real time.
  Hook in tzoref-value.mjs: VSLOW=1 keeps the original search; Date.now() -> vnow() inside valueBuild.
  Equivalence: vprobe/vb-det.mjs (seeded) + vprobe/value-equiv.mjs (old vs fast: expr, made, prog).
- 02:40 equivalence config a (maxSize 3, all 68 num tasks of both suites, seeded): 68/68 SAME (expr, made, prog). [v1 engine]
- v2: vectors padded to 32-bit words, word hash (2 lanes + murmur fmix), interleaved [id,hash] slots, precomputed partial
  table index for k2/k3. Search of a 3M-value level: original 74 s, fast 13.5 s (5.5x). Remaining cost = hash-table cache misses.
  Running equivalence b (maxSize4,maxBank150k,keep200), c (maxSize5,maxBank60k,keep120), a2 (subset) -> vprobe/equiv-*.log
- 03:45 equivalence ALL SAME: a 68/68, a2 13/13 (v2 engine), b 11/11 (bank-full mode, keep pruning, k3 top lists), c 9/9 (maxSize 5).
  Search speed vs original on the same steps: 5.3-8.2x (full-bank mode is the biggest win: 363 s -> 44 s).
- 03:46 launched calibration (vprobe/calib-all.sh -> vprobe/calib.jsonl, suite-1 tasks only, 90 s + 6 s budgets)
  then validation (vprobe/valid-all.sh -> vprobe/valid.jsonl: the 6 speed-set num tasks, original engine). ~25 min.
  Next: node vprobe/fit.mjs vprobe/calib.jsonl vprobe/valid.jsonl -> put coef into vclock.mjs COEF.
- 04:25 first calibration had a bug (counter object C shadowed by the k3 list C inside the k3 branch -> ev3/top-sort
  counts lost); renamed to CC, added `made` per row, re-running calib (vprobe/calib.jsonl) + validation (vprobe/valid.jsonl).
  First fit (vprobe/calib-v1-shadowed.jsonl): big searches model/actual 0.98-1.03; small 6 s searches 1.05-1.27
  (model overestimates small, cache-friendly searches) -> added features candH (cand x heapGB), candM (cand x log2 made).
- vclock.mjs rewritten: incremental per-tick model with heap/made terms; heap of original = heapUsed + made*(300+NN).
- Heap-full emulation: original stopped storing when heap>VBHEAP(3GB); fast engine uses heapUsed + made*PERVAL.
- 05:10 recalibrated (fixed counters): fit on 16 suite-1 runs: total model/actual 1.003, single runs 0.90-1.07.
  Held-out validation on the 6 speed-set num tasks (original engine, 90 s): 0.96-1.01, total 0.994.
  vclock COEF = fitted x SAFETY 0.92 (so the fast engine goes at least as far as the original would). coef: vprobe/coef-final.json
- top-level valueBuild alone on speed-set num tasks with virtual clock: 18-22 s real (original ~95-101 s), same frontier
  (task#3: level5 at v=90 s, made 3M, level-4 list 1.63M vs original 1.61M).
- caseBuild alone (CASEMS=78 s): #0 36.8->24.8 s; #4 50->52 s (basicBuild-bound); #1 fails both (82 s); valueBuild share 63->30 s.
  Case calls are dominated by pruning sorts + cover scans -> v4: counting-sort top-k (exact same order), cover scratch masks,
  local counters. Equivalence rerun on v4: vprobe/equiv-v4.sh (a3, b2, c2 logs; slow outputs cached in vprobe/slow-cache.json).
- NOTE: another agent's speedrun (../speedrun.mjs . ../order-run2-off.jsonl) is running on the machine since ~05:05.
- 04:10 launched official speedrun #1 (v4 engine, virtual clock) -> speedrun-value.jsonl/.log; other agent's speedrun running concurrently (order-run2-off)
- RUN #1 (speedrun-value.jsonl/.log, started 04:10, v4 engine + virtual clock): valid 16/24, lost 0, new 0.
  wall 1663.7 s (base 2092.0, x1.26) · cpu 1840.8 s (base 2339.6, x1.27). value stage 18-24 s on all 6 num tasks (base 92-102).
  num: #0 105 (191.6) #1 272 (287) #2 253 (265) #3 158 (253, case solved) #4 137 (219) #5 76 (166, loop solved)
  #1/#2 absorb the saving: case budget grows to its learned 107 s, and bits uses ALL time left (build + shorten until NUMMS).
  Another agent's speedrun (order-run2-off) overlapped the first ~25 min of this run.
- 04:38 RUN #2 (repeat, same config) -> speedrun-value2.*; other agent's order-run3 running concurrently
- RUN #2 (speedrun-value2.*): valid 16/24, lost 0; wall 1659.9 s (x1.26), cpu 1837.9 s (x1.27). Very close to run #1.
  Groups (wall/cpu): num 1381.5/1572.0 -> 1000.0/1122.0 (r1), 1023.8/1146.5 (r2); list2num-unsolved 449.6 -> 390.8 / 362.3
  (scan stage noise, NOT attributable to this change); other groups +-5 s.
  Stage sums: value builder 573 s -> 124 / 127 s; case 334 -> 372 / 385 (gets its learned 107 s on failing tasks);
  bits 100 -> 134 / 140 (bits uses all the time left until NUMMS=280 s, so tasks #1/#2 save almost nothing).
- Late-win check (suite-1 tasks the value builder solved at 27-170 s in bench4/5): vprobe/lateset.json, fast vs VSLOW=1,
  via speedrun.mjs SPEEDSET=... -> late-fast.* / late-slow.* (vprobe/late.sh)
- Late-win check: fast 4/4 valid, all still by the value builder: 25.6 / 18.9 / 9.5 / 0.1 s; original (VSLOW=1) 67.3 / 75.9 / 24.0 / 0.2 s.
  (late-fast.log, late-slow.log). Total 54.1 s vs 167.4 s wall.
- DONE. Shelf reset after the runs. Files: tzoref-value-fast.mjs (new), vclock.mjs (new), tzoref-value.mjs (hook; original kept
  as tzoref-value.before-fast.mjs; VSLOW=1 runs the original search, VREAL=1 uses plain real time for the budget).
  Next targets (not done, outside this key): basicBuild (tzoref-basic.mjs) is now most of the case builder's time (same
  string-key Map pattern); bits fills all time left until NUMMS, so earlier savings on bits-solved tasks do not show in wall.
