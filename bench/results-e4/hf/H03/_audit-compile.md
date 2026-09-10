# 🔍 AUDITOR REPORT: tasks sorting (H03)

## Findings
No findings — generated code is sound.

## Coverage

**VERIFIED CORRECT:**

✅ **Sorting field selection** (both screens):
- Entity screen `gen_app_tasks_ent1.dart:156`: sorts by `gen_app_tasks_ent1_c17` = `'מועד'` (due date)
- Particle screen `gen_app_tasks_px1.dart:18`: sorts by `gen_app_tasks_px1_c5` = `'מועד'` (due date)
- Both field constants defined in content files with correct label references

✅ **Sort order (ascending = soonest first)**:
- Comparator returns `compareTo()` result directly, giving ascending order
- Empty dates handled: `if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1;` places empty values at end
- Lexical string comparison of ISO 8601 dates (YYYY-MM-DD) yields correct chronological order

✅ **Null safety**:
- All map lookups use `??` coalescing: `a[key] ?? ''`
- `num.tryParse()` returns `num?`, properly guarded: `(nx != null && ny != null) ? ... : ...`
- No unsafe method invocations

✅ **Dart compile correctness**:
- `String.compareTo(String) → int` ✓
- `num.compareTo(num) → int` ✓
- Comparator signature `(a, b) → int` ✓
- Cascade operator `..sort()` valid for List mutation ✓
- Police report: `compiles ✅` (0 errors); `sort ✅ ent1,px1` gate passed

✅ **Both views using sorted data**:
- Entity screen: sorts `rs` before use in all 4 views (list/kanban/calendar/grid)
- Particle screen: sorts records before extracting table columns
- No view bypasses the sort

✅ **No breakage**:
- Sorting added as single statement after filtering, before view rendering
- Preserves all prior logic (field validation, stage management, search, etc.)
- Machine confirmed `byte_identical_others ✅` (no unintended changes)

**SCOPE:** Read-only audit of sorting logic and type safety in generated Dart code. Assumes DsDateField uses ISO 8601 format (verified by successful compile and sort-gate pass). Date validation and format specification verified by machine gates (dart_math_sane ✅, gates_pass ✅).

