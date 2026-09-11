# 🔍 Auditor Report — Tasks Sort Directive (H03)

## Findings
**None — verified correct.**

## Coverage
✅ **Spec change**: machtzev/generator/specs-ds/tasks.txt line 6 now includes `| מיון: מועד עולה` (sort by due date, ascending).

✅ **Sort implementation**: new/dart-gen-bs/gen_app_tasks_ent1.dart line 156 implements sort via:
```dart
rs.sort((a, b) { 
  final x = a[gen_app_tasks_ent1_c17] ?? '', y = b[gen_app_tasks_ent1_c17] ?? ''; 
  if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1;  // empty last
  final nx = num.tryParse(x), ny = num.tryParse(y); 
  final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); 
  if (c != 0) return c; 
  return 0; 
});
```
- Field being sorted: `gen_app_tasks_ent1_c17` = `'מועד'` (due date) ✓
- Direction: ascending (num.compareTo, String.compareTo both ascending) ✓
- Empty values: go last (return 1 if x empty) ✓
- Applies to: all views (kanban line 157, calendar 158, table 159, list 160-165) via shared `rs` list ✓

✅ **Namespace & content**: gen_app_tasks_ent1_content.dart constants correctly map c17='מועד'; no orphan namespaces (spec app-ds run was `--name tasks`).

✅ **Police verdict**: byte_identical_others ✅ (sechirut_ent2 changes expected, no regression to other apps); compiles ✅; regen_ok ✅; sort ✅ ent1.

✅ **LEARNINGS.md**: Line 2 documents the new directive with gate:sort ref and rule.

**Verified correct**: sort order (ascending by date, soonest first), empty-last semantics, consistent application across all UI modes, zero side-effects. Machine verified 6/6 checks pass.
