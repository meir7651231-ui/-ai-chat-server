# 🔍 Auditor Findings — tasks.txt Particle Sort

## Compile-Safety Audit Results

### Findings

1. **new/dart-gen-bs/gen_app_tasks_px1.dart:19–20 · Duplicate identical DataGrid widgets in single screen · P1 wrong result · Delete one grid; keep only first sort implementation**
   - Lines 19–20 both render `ForgeDataGrid` with identical columns (`c1, c2, c3, c4` and `c11, c12, c13, c14` respectively mapped to same constants), same data source, and same sort logic
   - Content file shows both grids reference the same field for sort (`c5='מועד'` and `c15='מועד'`)
   - Users will see tasks table rendered twice on the same screen
   - Root cause: `machtzev/generator/specs-ds/tasks.txt` lines 7–8 are duplicated spec entries with identical definitions

2. **machtzev/generator/specs-ds/tasks.txt:7–8 · Duplicate particle spec lines · P1 wrong result · Remove one duplicate line**
   - Line 7: `חלקיק משימה: [טבלה] | מיון: מועד עולה`
   - Line 8: `חלקיק משימה: [טבלה] | מיון: מועד עולה`
   - Both lines are identical; should be a single particle definition
   - Causes the particle-plan-tasks.json to register 2 identical plan entries for the same screen

### Verified Correct (Compile Safety)

✅ **Sort logic is compile-safe and implements ascending order correctly:**
- `a[gen_app_tasks_px1_c5] ?? ''` — Map access with null-coalescing is sound (String result)
- `num.tryParse(x)` — Returns `num?` (nullable), correctly checked before use
- `nx.compareTo(ny)` where `nx` and `ny` are `num` — valid method on num type in Dart ✓
- `x.compareTo(y)` where both are String — valid method on String type ✓
- **Sort order semantics**: Dates stored in ISO8601 (YYYY-MM-DD) format will sort correctly by lexical comparison; empty values sorted to end. Ascending order achieved (earliest first = "soonest" ✓)
- No null-safety violations, no non-existent Dart methods, no malformed parens in sort closure

✅ **Imports and references are sound:**
- `gen_app_tasks_px1_c5` and `gen_app_tasks_px1_c15` correctly resolve to String constants in content file
- `appStore.records()` returns valid iterable for `.toList()`

## Coverage

**Checked:** Sort lambda null-safety, Dart method existence (`.compareTo()`, `.tryParse()`), date string comparison semantics for ascending order, content file constant definitions, Map access safety.

**Could not check:** Runtime behavior of AppStore data fetch and rendering; whether duplicate grids actually render or are deduplicated by framework; whether string date format is guaranteed to be YYYY-MM-DD in practice (assumption based on `_iso()` in home.dart).

## Verdict

**NOT DONE** — Task requires sorting table by mועד soonest-first, but:
- (✓) Sort code IS present and compile-safe
- (✓) Sort order IS ascending (correct for "soonest first")
- (✗) **Implementation duplicates the entire grid twice** — users see table twice, not once
- (✗) **Spec file has duplicate entry** — spec should define one particle, not two
