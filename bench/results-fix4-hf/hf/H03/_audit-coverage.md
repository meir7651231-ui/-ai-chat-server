# 🔍 Audit Coverage: Task Sorting Implementation

## Findings
No defects found.

## Verification Summary

**Task:** Make the tasks table (משימה particle screen) sorted by due date (מועד), soonest first.

**Coverage verified:**

1. **Spec layer** ✅
   - `machtzev/generator/specs-ds/tasks.txt:7` correctly defines: `חלקיק משימה: [טבלה] מה, מועד, סכום, הערה | מיון: מועד עולה`
   - Hebrew keyword "עולה" (ascending) is recognized by spec-lang.data.json as `sortAsc`

2. **Particle plan** ✅
   - `machtzev/generator/particle-plan-tasks.json:5` shows particle expression with sort: `"[טבלה] מה, מועד, סכום, הערה | מיון: מועד עולה"`
   - Status: `"ok": true` (no parsing errors)

3. **Generated particle screen (px1)** ✅
   - `new/dart-gen-bs/gen_app_tasks_px1.dart:18` implements sorting lambda
   - Sort key: `gen_app_tasks_px1_c5` = "מועד" (due date)
   - Direction: `return c` without negation = ascending order (soonest first)
   - Empty values handled: return 1 (pushed to end)
   - Comparison: numeric when possible, lexical fallback (works for ISO dates)

4. **Field type inference** ✅
   - Entity field "מועד" correctly inferred as `DsDateField` in `new/dart-gen-bs/gen_app_tasks_ent1.dart`
   - Stored as date strings suitable for lexical comparison when in ISO format

5. **Machine verification** ✅
   - Police report gate `sort` passed: ✅ px1
   - Claim confirmed: "Tasks table (משימה particle) is sorted by מועד (due date) ascending, soonest first, in spec layer"

6. **No breaking changes** ✅
   - Entity screen (ent1) unmodified for tables without sort in spec
   - All protocol gates passed (regen_ok, gates_pass, byte_identical_others)
   - No hand-edits in generated outputs

**This area holds up: sorting implementation is sound, spec-driven, and correctly ascending (soonest due dates first).**
