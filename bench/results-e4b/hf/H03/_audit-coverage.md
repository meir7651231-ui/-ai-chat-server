# Audit Coverage: Tasks Table Sorting by Due Date

## Findings

No defects found. All task surfaces verified as correctly sorted.

## Verification Summary

### Entity List Screen (gen_app_tasks_ent1.dart:156) ✅
- **Sorting applied:** Line 156 sorts `rs` (all records) by `gen_app_tasks_ent1_c17` (field 'מועד' = due date)
- **Sort order:** Ascending via `compareTo()` → soonest first as required
- **Empty dates:** Correctly pushed to end (line 156: `if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1`)
- **Type handling:** ISO date strings ("YYYY-MM-DD") sort correctly lexically; numeric values parse-aware
- **All views covered:** Sorted list `rs` used by all 4 views before branching:
  - View 0 (list): `_card(rs[i])` on sorted rs ✅
  - View 1 (board): `rs` as source for ForgeKanbanBoard ✅
  - View 2 (calendar): `rs` as source for ForgeEventCalendar ✅
  - View 3 (table): `ForgeDataGrid(items: rs.map(...))` uses sorted rs ✅

### Hub Screen (gen_app_tasks_home.dart) ✅
- **items() method (line 95):** `out.sort((a, b) => a.due.compareTo(b.due))` → ascending DateTime sort ✅
- **stale() method (line 142):** Same ascending sort pattern ✅
- **Comment confirms intent:** Line 95 says "P2 · מועד קרוב ראשון" (closest date first) = ascending ✅

### Record Detail Screen (gen_app_tasks_root.dart)
- Single-record view; sorting not applicable N/A

### Spec Compliance ✅
- Task spec line 6: `מיון: מועד עולה` (sort by due date ascending)
- Spec field index: c17 = 'מועד' (confirmed in content.dart:19)
- Police gate "sort": ✅ CONFIRMED in ./_police.md
- Compilation: ✅ zero errors (analyzer + flutter build)

### Test Coverage
- LEARNINGS.md L2026-09-10-sort-particle-e7c92f documents the rule: spec-level sort directive applies to implicit particle ✅
- Machine-bench detected pure sort pattern in rendered Dart output ✅

---

**Coverage statement:**
Verified: (1) sorting code location and logic (gen_app_tasks_ent1.dart:156 + gen_app_tasks_home.dart:95,142); (2) sort direction (ascending/commute-based); (3) empty date handling; (4) all rendering paths (list/board/calendar/table); (5) hub integration; (6) compilation success; (7) spec compliance (c17='מועד', direction='עולה'). 

Could not check: Runtime sort correctness via Flutter execution (read-only auditor); live app rendering verification (static analysis only).

**Result: No breaking changes. All task surfaces covered. Sort gate passes. Ready for merge.**
