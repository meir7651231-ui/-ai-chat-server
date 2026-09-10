# 🚔 Audit Report — Task H03 (tasks table sort by מועד)

## Findings (Severity Ranked)

1. **machtzev/generator/ship.mjs:1** · File replaced entirely with quarantine error message (138→2 lines) · **P0 COMPILE-BREAK** · Restore file from HEAD or rebuild from git history; ship.mjs is a critical deployment pipeline tool

2. **machtzev/generator/specs-ds/tasks.txt:7-8** · Duplicate particle definition; lines 7 and 8 identical (`חלקיק משימה: [טבלה] | מיון: מועד עולה` appears twice) · **P1 WRONG-RESULT** · Delete line 8 (the duplicate); particle should appear once

3. **new/dart-gen-bs/gen_app_tasks_px1.dart:2-3** · Duplicate comment reflects duplicate particle definition; code generates TWO identical ForgeDataGrid tables instead of one (lines 19-20) · **P1 WRONG-RESULT** · Delete the second table (line 20) and its corresponding sort closure; regenerate after fixing spec

4. **new/dart-data-bs/auto/gen_app_*_content.dart (orphans)** · Police report flags 6+ orphan files: gen_app_audit_content.dart, gen_app_bind4_content.dart, gen_app_ent1_content.dart, gen_app_ent2_content.dart, gen_app_ent3_content.dart, gen_app_ent4_content.dart · **P0 TASK-NOT-DONE** · Delete these 6 files before commit (no corresponding app-ds specs)

## Correctness of Sorting (Where Implemented)

Both table sort closures use the same logic: parse field as number if possible, else string compare, ascending order. Field `gen_app_tasks_px1_c5` and `gen_app_tasks_px1_c15` both map to `'מועד'` (due date) in the content file. Sorting is **ascending (soonest first)**, which matches the task requirement. However, sorting correctness cannot be fully verified without seeing actual date field format — if dates are rendered in Hebrew (e.g., "15 בספטמבר") rather than ISO format, numeric/lexicographic sorting may not produce correct order.

## Coverage Summary

**Verified**:
- Generator ran without errors (regen_ok ✅ per police report)
- Compilation succeeds (compiles ✅)
- Sort direction is ascending, field target is מועד ✅
- Hebrew only in spec, not engine (no_hebrew_in_engine ✅)

**NOT Verified** (Flutter/Dart not available; reason read-only auditor):
- Actual rendering: whether two tables appear in UI or one
- Date sorting semantics: whether dates sort correctly by actual chronology (depends on date representation)
- Behavior with empty/missing מועד values

**Reported as Failed** (per _police.md):
- no_orphans ❌ — 6+ orphan content files remain
- no_hand_edit ❌ — spec.txt edited manually (expected for particle add, but duplicate is error)

## Verdict

**NOT DONE** — Ship-blocking issues (P0):
1. ship.mjs file corrupted (replaces entire pipeline with error)
2. Orphan files not cleaned
3. Duplicate particle definition creates wrong output (two tables instead of one)

Recommended action: Fix all three P0 items before landing.
