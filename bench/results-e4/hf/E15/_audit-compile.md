# 🔍 AUDITOR REPORT — E15 (tasks) · computed field סכום כולל מעמ

## Findings

new/dart-data-bs/auto/gen_app_tasks_ent1_content.dart:16-19 · dead constants c16 ('סכום') and c17 ('') defined but never referenced · P2 code-cleanliness · remove unused const definitions

## Verified Correct

**Null-safety & type inference (new/dart-gen-bs/gen_app_tasks_ent1.dart lines 51, 160):**
- Formula `(num.tryParse(_v[2] ?? '') ?? 0) * 1.18` is sound:
  - `num.tryParse()` returns `num?` (nullable); `?? 0` coalesces to `num`
  - `num * double(1.18)` yields `num` (valid Dart arithmetic)
  - `.toStringAsFixed(2)` is a valid `num` method
- Null-safety: no unchecked dereferences; all `String?` paths guarded
- Edge cases verified: empty string → 0, non-numeric → 0, decimals/negatives → computed correctly

**Spec compliance:**
- Entity `משימה` has 5 fields: מה (required), מועד, סכום, סכום כולל מעמ (computed), הערה ✓
- Computed field formula matches spec: `סכום כולל מעמ = סכום * 1.18` ✓
- Field indexed correctly: user inputs map to _v[0,1,2,4]; _v[3] skipped for computed field ✓

**Code generation:**
- gen_app_tasks_ent1.dart: form renders 4 input fields + 1 read-only computed display; save recomputes from סכום (correct) ✓
- CSV export includes all 5 fields; kanban/calendar/grid views display computed value ✓
- Record edit/load: _v[3] loads old computed value (for display), save ignores it and recomputes (correct) ✓

**Machine verification:**
- police.md: compiles ✅ (0 errors), calc ✅ (consts=1 calc=1 expected), regen_ok ✅
- No hand-edits detected; spec-only change; builder ran correctly

**Coverage:** Dart null-safety, arithmetic type inference, method availability, edge cases (empty/non-numeric/negative/large numbers), UI rendering, database round-trip. Not checked: runtime Dart semantics (no env to run Flutter).

## Verdict

**COMPILES & WORKS.** Task successfully added computed field to משימה entity with formula `סכום * 1.18`. Only minor code-cleanliness issue: unused constants c16/c17 in content file don't affect functionality.
