# Round 7 integration summary (lab13-r7)

## Numbers

### 1. suite7: the clean test, run once on each machine with the same protocol

| suite7 | lab13 (lab13-r7base, B7) | lab13-r7 (N-S7) |
|---|---|---|
| list2list | 18/33, 5.4 min | 18/33, 5.1 min |
| list2num | 21/33, 40.9 min | 23/33, 40.4 min |
| num | 34/34, 8.2 min | 34/34, 8.1 min |
| **total** | **73/100, 54.4 min** | **75/100, 53.6 min** |
| wall clock (refits included) | 54.5 min | 57.4 min |

(Minutes are summed per-task time, as in the O-* references.)

- **Gains: +2. Losses: 0.**
  - `ממוצע החצי השני` (list2num) is a **real gain**. The G1 pass found `agg.mean(l.drop(l.id, g.half(g.n)))`, which solved it in 7 s. Rerun alone: r7 1/1 (12 s), lab13 0/1 (168 s, every stage failed).
  - `זוגיים מאחרים` (list2num), solved by `זוגות` in 184 s, is **noise**. Rerun alone: lab13 1/2, r7 2/2. The `זוגות` stage is random.
- **Net effect of the round-7 changes on the clean test: +1 task.**
- **G1** found 3 ASTs on suite7:
  - `ממוצע החצי השני`: solved.
  - `מתחת לממוצע`: lab13 also solves it, through מצב-רחב-2 in 15 s; with G1 it takes 2 s.
  - `מיון לפי קרבה לממוצע`: `l.sortBy(l.id, e.adev)` was found but not compiled. This is the known compiler gap: a sortBy key with more than 16 values.
- **Track C (learning from its own history)** gave no new solve on suite7. The `זיכרון` (memory) stage got 0 hits, because there are no behaviour repeats.
  - History entries were matched for 6 tasks that lab13 solves anyway.
  - One cost: `זוגיים בפתיחה` went from 4 s to 201 s. History meet-in-the-middle returned a different exact AST first: `g.sub(agg.sum(...), g.cntPairs(...))`. It did not compile, which cost 87 s, and the task was then solved by `זוגות`.
- **Unsolved suite7 tasks by difficulty:**
  - list2list: easy 10/10, medium 8/13, hard 0/10.
  - list2num: easy 10/10, medium 11/13, hard 2/10.
  - num: 34/34.
- Failed list tasks:
  - list2list: next permutation, unsorted-stretch reversal, merge heads, both-ends insertion, pile tops, variable blocks, rank composition, rotate evens, sum-closest-to-40 window, count by value, plus 5 medium.
  - list2num: the DP / "all possibilities" class (two transactions, LIS count, warmer-day wait, pancake flips, min-start segments, equal-step subsequence, shortest window ≥30, near chain), plus `מאזן זוגיים` and `ציר חציוני`.

### 2. Regression of lab13-r7 on suites 2-6 against r5-runs/O-S*

| suite | O (solved, min) | r7 (solved, min) | lost | gained | r7 wall clock incl. refits |
|---|---|---|---|---|---|
| S2 | 99, 26.0 | 99, 27.2 | 0 | 0 | 41.7 min |
| S3 | 100, 26.0 | 100, 28.2 | 0 | 0 | 52.8 min |
| S4 | 100, 23.0 | 100, 23.3 | 0 | 0 | 40.5 min |
| S5 | 93, 28.2 | 92, 33.4 | 2 | 1 | 39.8 min |
| S6 | 82, 48.1 | 94, 31.3 | 0 | 12 | 39.4 min |
| **total** | **474, 151.4** | **485, 143.4** | 2 | 13 | |

**Per kind:**
- S6: list2list 33/33 (was 26), list2num 27/33 (was 22), num 34/34. These are the same 12 gains as g1's builder run.
- S5: list2list 29/33 (was 30), list2num 29/33 (unchanged count, one lost and one gained), num 34/34.
- Every other kind matches O exactly.

**Lost tasks, each rerun ALONE from the reset state with the same history seed:**
1. **S5 list2list `שכן קרוב`.** O solved it with `סינון-סטטיסטי` in 35 s. In the suite run, `סינון-סטטיסטי` failed after 17 s.
   - Rerun alone on r7: **3/3 solved** by `סינון-סטטיסטי` in 36-37 s (`rr5-new.jsonl`).
   - Verdict: **flakiness**. The stage uses Math.random, and the same task also failed in the older non-G1 run r5-runs/C-S5 and in g1's first S5 run.
2. **S5 list2num `שלשות עולות`.** O solved it with `דקדוק` in 5 s. In the suite run, the G0 AST `g.cap15(g.cntTriples(t.chain(p.lt(p.a,p.b))))` was found but not compiled, and the run failed after 221 s.
   - Rerun alone: r7 **2/2 solved** (8-9 s) and lab13 1/1 (8 s).
   - At the end of the suite run, lab13-r7d/shelf3.json holds the shelf tool `שלישיית-ערכים #400d38416354`, learned earlier in the suite by `סינון-סטטיסטי`. The giveup builder found the same tool to be the cause: lamc picks it, and the cntTriples brick then fails with "no temp for hole".
   - Verdict: a **pre-existing, state-dependent compiler fragility**, not a loss caused by the merge. The giveup verifier (L13-S5) and the g1 verifier (GV-S5) also lose it with unmodified lab13 under the same cold-cache protocol. O solved it with warm caches.

**Gained in S5:** `הרחוק מהממוצע` (G1: `agg.last(l.sortBy2(l.id, adev, x))`).

**Slower without being lost (more than 30 s):**
- S3 `חריגה מקצובה של 11 לפריט`: 11 s → 49 s. The G1 compiler compiles the G0 AST through a sub-spec; g1's builder saw the same.
- S5 `כמה גדולים מהשני`: 3 s → 38 s.
- S5 num `שורש ספרתי של מכפלה`: 96 s → 222 s. Case split failed after 197 s, then bits solved it. The num code path is unchanged, so this is noise; my reruns were sharing the CPU at that time.

**Exhaustive check** (learn's runs/exhaustive.mjs; list programs on all 109,601 lists, num programs on every input × 3 garbage patterns): **every accepted program passes**, with 0 failures.
- N-S2 99/99, N-S3 100/100, N-S4 100/100, N-S5 92/92, N-S6 94/94.
- N-S7 75/75, B7 73/73.

### 3. Wall clock
The parallel runner (giveup) was **not accepted**, so there is no parallel wall-clock figure. The sequential wall clocks are in the tables above. Two runs shared the 2 heavy slots throughout, and the whole r7 measurement took 07:48 → 10:58.

Track C's batched refit runs after each kind inside runbench, outside per-task time. It added this much wall clock per suite:
- S2 14 min, S3 24 min, S4 17 min, S5 6 min, S6 8 min, S7 4 min.
- Most of it is the 30 s adapters (`adaptTried` 14-16 per list kind on S2/S3).
- Adapters produced 6 ASTs in total.

## What was merged

Only the accepted builders were merged: **learn** (Track C) and **g1** (grammar G1). giveup was rejected and is not merged; stagestats.mjs, tzoref-case.mjs and pairframes.mjs are unchanged from lab13.
- **learn:**
  - brain-all.mjs: the `זיכרון` (memory) stage comes first, followed by the `!r&&` branch guards and the recordSolved hook.
  - runbench.mjs: the refit hook.
  - New files: fg/learn.mjs, fg/rebuild-learned.sh, fg/history-seed-s1to5/.
  - These are taken verbatim from lab13-r7learn; g1 did not touch these files.
- **g1:**
  - fg/grammar.mjs (frozen; its sha256 23b960b9… matches fg/FROZEN), fg/compile.mjs, fg/ir.mjs, fg/lamc.mjs, fg/FROZEN, fg/FROZEN.G0, fg/prior/upto5-g1.json.
  - fg/history/base-suite*.jsonl: offline inputs of g1/mk-g1costs.mjs only.
  - g1/ tools and held-out files. g1/build-g1index.sh now points at lab13-r7.
  - **fg/index-g1.bin is a real file** (95,918,120 bytes, sha256 8dd8661eff2203e9…, a byte copy of g1's).
- **Conflicts resolved by hand:**
  - **fg/index.mjs:** learn's `match` with history entries, `has()` and FG_HEAPSTOP, plus g1's `g1` option in buildPart, `sec`/`node` on the index object, `matchG1` and the build CLI.
  - **fg/search.mjs:** learn's `poolsOut` and history phase, plus g1's pair index `j`, the `g1` filter in enumerate and `opts.indexMatch`. The G1 pass gets no history extra.
  - **fg/stage.mjs:** g1's G0-then-G1 structure, plus learn's index and prior choice, `delta` on the G0 pass, and `recordAst` after **both** passes. This last part is the only new integration choice: a G1 AST and its sub-terms join the history.
  - Smoke test: G0, G1, history and memory hits all work, and refit with G1 ASTs works (neighbours, prior refit that includes G1 costs).
- Backups of every changed file: `*.before-r7.mjs`, `fg/FROZEN.before-r7`, `MACHINE.before-r7.md`.
- **fg/index.bin (G0) is still the symlink to lab13-fgE**, exactly as in lab13. g1's design keeps the G0 index unchanged and adds index-g1.bin as a supplement. I rebuilt nothing, so there are no temporary parts.
- **fg/history** now holds what the merged machine lived through: the s1-5 seed, then its own suite6 run (N-S6), then suite7 (N-S7). That is 588 rows and 68,787 history entries.
  - fg/history-seed-s1to6 is the state before suite7. Use FGHIST=fg/history-seed-s1to6 to re-measure suite7, and fg/history-seed-s1to5 for suite6.
- MACHINE.md has a short round-7 bullet.

## Protocol and deviations

- **run.sh:** r7-runs/run.sh is a copy of r5-runs/run.sh: reset once, then list2list → list2num → num on one shelf, resumable. It also resets fg/subspec-cache.json, fg/learned-tools.json and numloop-prims.json to lab13's copies (r7-runs/pristine/). That way the baseline and r7 start from identical caches; both verifiers flagged that these caches leak between runs. Each run has its own FGFOUND and FGHIST.
- **History for each run** (only suites before the measured one):
  - S2-S5: temporal cuts of learn's s1-5 seed (r7-runs/seeds/seed-k, rows of suites < k) with learn's LOSO prior for suites < k.
  - S6: the s1-5 seed.
  - S7: the history the merged machine itself left after N-S6.
- **Machines used:**
  - The baseline is a fresh copy of the current lab13 (lab13-r7base).
  - Code-identical twins carried the parallel runs: lab13-r7b (S2-S4), lab13-r7d (S5; it keeps the S5 end state) and lab13-r7c (single-task reruns).
- All suite runs and the exhaustive checks went through heavy.sh. The single-task reruns (1 process, 6 tasks in total across separate invocations) ran at nice 5 without the semaphore, beside at most 2 heavy runs; peak RSS stayed below 11 GB in total.
- I did not open suite7 other than to run it.

## Files
- Runs:
  - suite7: r7-runs/B7-*, N-S7-*
  - regression: r7-runs/N-S{2..6}-{list2list,list2num,num}.jsonl, plus .log and found.jsonl
  - progress.txt
- Reruns: rr7-base.jsonl, rr7-new.jsonl, rr5-new.jsonl, rr5-base.jsonl.
- Exhaustive check: *-exhaustive.jsonl, exhaustive.log.
- History after each run: hist/N-S*.
- Tools: run.sh, rerun.sh, compare.mjs (`node compare.mjs <ref prefix> <new prefix> [--stages]`), smoke.mjs, cutseed.mjs, drive.sh, drive2.sh.
