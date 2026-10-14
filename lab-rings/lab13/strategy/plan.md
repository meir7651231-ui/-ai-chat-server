# Judge's plan: from one family per failure to one searched grammar

Judge workspace: `scratchpad/strat-judge` (union.mjs, u6.mjs, rerun logs). All reruns used nice -n 10, and the box load average was 1.3 to 4.4.

## 1. What I re-measured

| Check | Claimed | Rerun result |
|---|---|---|
| library, suite5 failures, learned prior + lib, 120 s, full rerun | 13/23 | **13/23**. Same set, 0 false hits, slowest hit 42 s |
| library, LOSO table (analyze.mjs) | 32 / 40 / 40 / 42 of 106 | **identical** |
| library, reach.mjs expressibility | 38/40 | **38/40**. In-sample: the grammar was written to express these |
| dsl, v3 result files | s2 16, s3 13, s4 5, s5 12; blind s6 33/66 | **identical** row counts |
| dsl, suite5 spot rerun at 45 s (4 tasks) | 3 found, "max per pair" times out | **same**. 12 s, 9 s, 46 s; timeout on max-per-pair |
| dsl, loso.mjs | 46 found, coreOnly 33, losoSpecial 37, strict 22, temporal 10 | **identical** |
| dsl, compiler: found programs that pass strict | "8" | **7 of 63** found programs PASS. 54 are outside the fragment and 2 are refused |
| dsl, recompile + strict 20000 + pads 0/3/17 | PASS | **PASS** on 2 programs: min(flt(hd<x)) = 200 instructions, cat(srt(take 3),drop 3) = 513 instructions |
| compose, suite5 spot rerun (4 tasks, 60 s) | all found | **all 4 found**, 3.5 to 28 s |
| compose, history ablation | 14/24 without history | matches ablate-hist.log |

Source peeking: in all three, the reference function is used only as an oracle on generated inputs. Library's reach.mjs hand witnesses are not imported by its search. Compose's history pool stands in for earlier-suite shelf tools by running their reference functions. That is acceptable only because the real ladder holds those programs, so it needs a real-shelf check in Track B.

**Real leak, in all three:** each grammar was written after reading the suite4/5 failures. dsl's jos/deq/tcnt/wcnt/cyc, library's josephus/twoPtr/passRL/stack*, and compose's PASS/SEGMAP were all added that way. On those 40 tasks the numbers are in-sample. The out-of-sample evidence is:
- blind suite6 (dsl and library; grammar frozen before the run);
- compose's LOSO on suites 2-4: 14/83 compose-only;
- library's learned prior on blind suite6: 26 → 34 of 66. This is the one measured self-learned gain on unseen data.

## 2. Union analysis (new)

- On the 40 suite4+5 failures: dsl 17, compose 13, library 21. **Union 27/40.** All three miss the same 13: cancelling stack, insert-last, distance between the two smallest, repeated remainder, farthest from mean, longest arithmetic run, longest even segment, balanced split, between-evens, two selection passes, has-complement, sort by remainder frequency, jumps.
- On the 106 failures-at-the-time: union 64. This number is contaminated.
- **Blind suite6 (66 list tasks): dsl 33, library 35, both 27, union 41.** The two typed grammars are complementary at the margin. Their differences come from productions such as ite / meet-in-the-middle tops (dsl) versus aggregates and segments (library), not from the search method.
- The machine has not run suite6, so the denominator of machine failures is unknown. Library measured grammar coverage on machine-failed vs machine-solved tasks of suite5: 43% vs 53%.

## 3. Scores

| | dsl | compose | library |
|---|---|---|---|
| Measured coverage of the 40 (in-sample) | 17 | 13 | **21** |
| Clean unseen evidence | blind s6 33/66 | LOSO s2-4 14/83 (17%) | **blind s6 34-35/66; learned prior +8 over base on blind** |
| Credible gain on next unseen suite (my estimate) | +2 to +6 | +1 to +4 | +3 to +8 |
| Compile risk | **only one with evidence**: 7/63 compile today, 7/7 inside the fragment PASS | low per leaf (existing families), but glue is unbuilt and atom models are optimistic (Josephus posmap, product fold, 3-nibble fold tables) | highest: 0 measured; 15-25 h critical path |
| Owner's rule | OK; loop schemas are post-hoc frames | best: leaves are the machine's own families and ladder tools | OK; the prior is learned from the machine's own history (strongest "self-built" story) |
| Cost | 40-55 h | 35 h | 30-50 h |
| Search speed | per task, 9 s median, size-6 wall | 2 s median, 60 s on misses | **task-independent shared enumeration**: one 120 s pass serves all tasks; can become an offline index |

Verdict:
- **Library's engine** is the best search: shared, cheapest per task, and the only measured self-learning gain on unseen tasks.
- **dsl** brings the only working compiler and CEGIS.
- **compose** brings the right compile fallback. Hand any sub-term that has no brick to the machine's existing stages as an ordinary sub-task (spec.pairs). This turns "compile an arbitrary AST" into "compile glue + call solveAny on sub-specs", which is much smaller.

None of the three is near 1000x. The honest expectation is +4 to +8 points per unseen suite, with no new hand family per round. After that, the self-learned prior/index keeps adding without hand work.

## 4. Combined plan

**First:** compile-rate measurement, before any search port. Compile is the binding risk (7/63 today). Everything else is wasted if found programs cannot become strict machine code.

Freeze now: library `dsl.mjs` + selected dsl productions = **grammar G0**. After the freeze, no grammar change until the suite6 measurement is done. Any later frame must be generic and added before a new test, never after reading its failures.

### Track A: grammar G0 + search stage (`lab13/fg/`)
- **Files.**
  - `fg/grammar.mjs`: port of strat-library/dsl.mjs.
  - Add only these generic dsl productions: `ite(B,A,C)` with held-out acceptance, the top-level meet-in-the-middle (A++B, A±B, m16, cap), and lambda leaves prv/nxt. Each is justified by suite6 hits that library missed; list them from u6.mjs.
  - `fg/search.mjs`: shared enumerator, learned costs, CEGIS loop from strat-dsl/solve.mjs, with exhaustive 109,601-list verification.
  - `fg/index.mjs`: offline dream index, signature → AST, cached at `fg/index.bin`.
- **Hook.** brain-all.mjs `solveAny`: new stage `'דקדוק'` for list2num and list2list, placed after the cheap stages and before the long families. It is registered in STAGE_ENV/STAGE_DEFAULT (stagestats learns its budget; default 60 s JS), with env `FG=0` to disable. The stage returns an AST to Track B; it does not emit code itself.
- **Acceptance.**
  - JS-only, frozen G0, 120 s: suite5 failures ≥ 13/23.
  - Blind suite6 list tasks ≥ 41/66, the measured union, with 0 accepted programs that fail the exhaustive check.
  - Index lookup answers ≥ 25 suite6 tasks in < 1 s.

### Track B: AST → strict code, with sub-spec fallback (`lab13/fg/compile.mjs`, `fg/subspec.mjs`)
- **Bricks.** Start from strat-dsl/cc:
  - list2num stream fusion: sink ∘ flt/map/chk, plus globals pre-pass;
  - list2list chain surgery: take/drop/cat, chainOp srt/rev;
  - the reloc.mjs trampoline.
- Add relinking bricks in this order: flt, rot, tw/dw, sortBy-with-key-tool, runsMap/segmap.
- **Fallback (compose's idea).** For any L→L or L→N sub-term without a brick:
  - build `spec.pairs` (a gen that draws a parent list, applies the witness, and yields (l', y') with the list at cell 1);
  - call the existing `solveAny` on it;
  - inline the result with shiftC as pipeline.mjs does.
  - For list2num, wrap the mutating parts in keepList.
  - Lambda holes → value builder / callTool by truth table (as walkframes does).
- Check the history-pool assumption here: a ladder tool is used only if it is actually on the shelf.
- **Acceptance (the gate for the whole plan).** Take the frozen corpus: all union-found programs on the 40 suite4/5 failures (27) plus the blind suite6 hits (41). Report the strict compile rate: 20000 lists, pads 0/3/17, list cells intact, empty stack, deepRelocOk.
  - Milestone 1 (about 12 h): ≥ 40%.
  - Milestone 2: ≥ 70%.

### Track C: learning from the machine's own history (`lab13/fg/learn.mjs`)
- **Inputs.** Port strat-library learn.mjs + shape.mjs. Inputs are all shelved fg solutions, plus adapters that turn existing family plans (keysort, filtcomp, runframes, walkframes, tupleframes, pickat, poscompose) into G0 ASTs, so the whole ladder is the history.
- **After each bench.** Refit costs (with alpha smoothing, plus a uniform-order portfolio) and rebuild the index.
- **Then test multi-level abstraction** (depth 2-3 templates), the only path to the 35-56-bit misses.
- **Acceptance.** Temporal LOSO, where the prior sees only suites < k: ≥ 40/106 (matches the measured result). Library + multi-level must beat prior-only by ≥ 3 tasks, or that sub-part is dropped. Measured today: 40 vs 40, so it is unproven.

### Track D: integration and the unseen measurement
- **Prerequisite.** Run the current machine once on suite6 when the box is free. That gives the real denominator (machine failures).
- **Steps.**
  1. Merge A+B (C optional).
  2. Run suite6 with the 'דקדוק' stage and without it.
  3. Regression on suites 1-5.
- **Gate.** No lost tasks; stage time on already-passing tasks ≤ 5 s (probe-plan).
- **Report** gain on machine-failed suite6 tasks only, compile rate, and time.
- For a pristine check, generate suite7 after G0 is frozen and run it once.

### What to measure, always
- Found / compiled / strict-pass, counted only on tasks the machine fails at the time.
- Seconds per hit, and the bit cost of misses (dl.mjs).
- Number of hand-written productions added since the last freeze. The target is 0 per round.

### Abandon or redirect if
- Track B is below 40% strict compile on the frozen corpus after about 15 builder-hours. Then keep the search only as a planner for compose-style sub-spec decomposition into existing families. That is cheaper, and its gain is +1 to +4.
- Suite6 machine-level gain is < +3 on machine-failed tasks with A+B merged. Stop adding productions; the grammar is not paying for itself.
- The stage costs > 10 min per 100-task run on tasks other stages already solve, and stagestats cannot cut it.
- The learned prior does not beat uniform order on the next unseen suite. Then the "self-improving" claim is false, so drop Track C and treat G0 as one more (bigger) hand frame.
