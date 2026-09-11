# 🔍 Audit Report — Task E04 (tasks.txt: add בוטל stage)

## Findings

new/dart-gen-bs/gen_app_tasks_ent1.dart:92 · stageDone condition broken by stage count change · P1 wrong result · Change `stageDone: appStore.stageOf('app_tasks_ent1', rid) >= 2` to `stageDone: appStore.stageOf('app_tasks_ent1', rid) >= 1` (or `== 1` if only נעשה should mark done, not בוטל)

## Explanation

**What broke:** When the builder added the third stage בוטל, the auto-generated code correctly added it to the stages list (`const [gen_app_tasks_ent1_c13, gen_app_tasks_ent1_c14, gen_app_tasks_ent1_c15]`), updated the `onAdvance` count to 3, but the `stageDone` condition was not updated correctly by the generator.

**Old code (2 stages):**
- `stageDone: appStore.stageOf('app_tasks_ent1', rid) >= 1`
- Indices: 0=פתוח, 1=נעשה
- True when stage ≥ 1 (completed state)

**New code (3 stages):**
- `stageDone: appStore.stageOf('app_tasks_ent1', rid) >= 2`
- Indices: 0=פתוח, 1=נעשה, 2=בוטל
- True when stage == 2 only (cancelled state only, not completed)

**Impact:** Tasks marked נעשה (completed, index 1) will NOT be marked as done anymore. Only cancelled tasks (בוטל, index 2) will show as done. This breaks the visual/behavioral semantics: נעשה should be the "done" state, not בוטל (cancelled).

**Fix:** Change the condition to `>= 1` to preserve original semantics (both נעשה and בוטל are terminal), or use `== 1` if ONLY the completed state should be "done".

## Coverage Verified

✓ Spec-level change correct: tasks.txt has third stage בוטל (cancelled) · confirmed in diff
✓ Content constants generated correctly: gen_app_tasks_ent1_content.dart c15='בוטל' · confirmed line 17
✓ Array indexing safe: 3-element stages list, indices 0/1/2 all valid · confirmed line 92 stage accessor
✓ onAdvance count correct: 3 stages → `onAdvance(...rid, 3)` · confirmed line 92
✓ Police report confirms regen_ok and no manual edits

⚠ **Cannot verify:** Whether the generator intentionally changed `>= 1` to `>= 2` (design decision about cancelled vs completed) or if this is an auto-generated bug. The logic appears to be inconsistent with stage semantics.

## Builder Script Issue (Not blocking generation)

Files quarantined by builder:
- machtzev/generator/ship.mjs: 3 lines (blocking message, was ~140 lines)
- machtzev/generator/tighten-types.mjs: 3 lines (blocking message, was ~250 lines)  
- machtzev/one.mjs: 3 lines (blocking message, was ~240 lines)

**Status:** These scripts are non-functional, but generation still completed (likely via police-bench pipeline). Not a compilation blocker since generated output exists, but a deployment risk if anyone tries to use these scripts.
