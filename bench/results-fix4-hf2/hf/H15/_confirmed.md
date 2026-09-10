# Validator Verdict — H15 (peruk21) · Sort Cases by Deadline

## Generic Checks Status
All generic checks passed ✅:
- `regen_ok` ✅ · Generator pipeline completed successfully
- `byte_identical_others` ✅ · No unintended side effects to other apps
- `gates_pass` ✅ · All gates in gates.tsv passed
- `no_hebrew_in_engine` ✅ · No Hebrew in engine code; changes limited to spec
- `dart_math_sane` ✅ · All generated Dart math expressions valid (no custom sqrt/min/max)
- `compiles` ✅ · Generated Dart compiles with zero analyzer errors

No automatic P0 findings triggered by machine failures.

## Auditor Finding Review

**Coverage auditor finding:**
- **Claim:** Board/calendar view at gen_app_peruk21_px1.dart:35 not sorted by deadline
- **Evidence:** Line 35 iterates `appStore.records('app_peruk21_ent1')` unsorted, while table at line 28 is sorted
- **Verdict:** FALSE-POSITIVE

**Justification:**
The task explicitly specifies sorting in two locations: (1) "cases table on the particle screen" and (2) "entity list screen." The board/calendar view is not listed as a required sort location. Spec-ds/peruk21.txt line 10 specifies sorting only for the table particle (`[טבלה] | מיון: עד מתי עולה`), not for the board particle. The machine's sort checks (`sort_px ✅ px1` and `sort_ent ✅ ent1`) verify the two required locations:
- Line 28 (px1 table): Sorted correctly by `gen_app_peruk21_px1_c7` (עד מתי)
- Line 155 (ent1 list): Sorted correctly by `gen_app_peruk21_ent1_c24` (עד מתי), applies to all three views (list/kanban/table)

While consistency across all case listings would be a design principle, the auditor's finding falls outside the stated task scope.

**Regression auditor:** No defects found ✅

**Compile auditor:** No findings detected ✅

## Summary

FIX-LIST: none
