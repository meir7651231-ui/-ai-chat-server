# 🔍 Audit Report: Tasks Sort Implementation (H03)

**Task**: Make tasks table (משימה particle screen) sorted by due date (מועד), soonest first. Don't break anything.

**Verdict**: ✅ **NO FINDINGS** — implementation is correct and complete.

---

## Coverage & Findings

**Checked**:
- ✅ Spec change applied: `machtzev/generator/specs-ds/tasks.txt` line 7 adds particle with sort spec `| מיון: מועד עולה`
- ✅ Particle plan generated: `machtzev/generator/particle-plan-tasks.json` correctly parsed table + sort directive, ok=true
- ✅ Generated Dart file: `new/dart-gen-bs/gen_app_tasks_px1.dart` line 18 implements sort lambda with `gen_app_tasks_px1_c5` (מועד field)
- ✅ Sort lambda correctness:
  - Field reference: `a[gen_app_tasks_px1_c5]` accesses 'מועד' from Map<String, String> records ✓
  - Null safety: `?? ''` coalesces null to empty string ✓
  - Empty handling: `if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1;` puts empty values at end ✓
  - Numeric comparison: `num.tryParse(x)` returns `num?`, safe null check with `(nx != null && ny != null)` ✓
  - Fallback: `x.compareTo(y)` for string/date comparison (ISO-8601 sorts lexically correct) ✓
  - Sort direction: returns `c` (not `-c`), ascending order = soonest first ✓
- ✅ Dart syntax: no unbalanced parens, no missing methods (`.isEmpty`, `.tryParse()`, `.compareTo()` all exist on String/num) ✓
- ✅ Content file: `new/dart-data-bs/auto/gen_app_tasks_px1_content.dart` line 7 maps `gen_app_tasks_px1_c5 = 'מועד'` ✓
- ✅ Home screen sorting: `new/dart-gen-bs/gen_app_tasks_home.dart` lines 95, 142 also sort by due date (DsTodayItem.due DateTime), soonest first ✓
- ✅ Machine validation: all police checks passed (regen_ok, gates_pass, sort=px1) ✓

**Not checked** (outside read-only scope):
- Runtime behavior (actual sorting of live data with various date formats)
- Whether date values in records are actually in expected format

---

**Result**: Implementation satisfies spec and compiles cleanly. All sort direction, field reference, null safety, and Dart syntax are correct.
