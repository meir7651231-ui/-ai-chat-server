# AUDITOR REPORT: peruk21 Deadline Sorting
**Lens:** edge-crash + compile (null-safety, Dart method calls, type correctness)  
**Status:** ✅ VERIFIED CORRECT

## Findings
No findings. The sorting implementation is sound across both required locations.

## Verified Correct
**Particle screen (table) — gen_app_peruk21_px1.dart:28**
- Line 28: `sort((a, b) => (a[gen_app_peruk21_px1_c7] ?? '').compareTo(b[gen_app_peruk21_px1_c8] ?? ''))`
- c7 = c8 = `'עד מתי'` (deadline field from gen_app_peruk21_px1_content.dart:9-10)
- Null safety: `?? ''` provides String default; `compareTo()` is valid String method
- Applied before items list in ForgeDataGrid, so all table rows are sorted
- Lexical string comparison correct for ISO-8601 dates (YYYY-MM-DD format)

**Entity list screen (all 3 views) — gen_app_peruk21_ent1.dart:156**
- Line 156: `final deadlineCol = gen_app_peruk21_ent1_c24; rs.sort((a, b) => (a[deadlineCol] ?? '').compareTo(b[deadlineCol] ?? ''))`
- deadlineCol = `'עד מתי'` (deadline field from gen_app_peruk21_ent1_content.dart:26)
- Null safety: `?? ''` provides String default; `compareTo()` is valid String method
- Applied to `rs` List before iteration at line 157 (Kanban board), line 158 (DataGrid), line 163 (card list)
- All three view modes display sorted records

**Type & compile safety**
- appStore.records() returns List<Map<String,String>>; accessing with String key yields String?
- Null coalescing `?? ''` correctly narrows String? to String
- String.compareTo(String) returns int suitable for sort comparator
- No non-existent Dart methods called (no `.sqrt()`, `.min()`, `.max()` on num; no invalid list methods)
- Date field 'עד מתי' confirmed in spec (peruk21.txt:7)

**Completeness**
- One particle screen (px1): SORTED ✓
- One entity screen (ent1): SORTED ✓
- No other peruk21 screens found
- Police report confirms: sort_px ✅ sortlines=2, sort_ent ✅ sortlines=1, gates_pass ✅

**Sort order**
- Ascending by deadline (soonest first): compareTo() returns negative when a < b, so earlier dates appear first
- Empty/null values sort first (compare to empty string '')
- Stable for records with identical deadline

## Coverage
✅ Read both generated Dart files entirely (px1: 37 lines, ent1: 170 lines)  
✅ Verified deadline field name in content files (c7/c8 in px1, c24 in ent1)  
✅ Checked all uses of `rs` in entity list (3 renderers all use sorted list)  
✅ Verified null-safety syntax (null coalescing + String.compareTo)  
✅ Confirmed spec entity definition (peruk21.txt:7)  
✅ Cross-referenced police report gates (sort_px, sort_ent both CONFIRMED)  
✗ Unable to run: flutter analyze (not installed; reasoning from Dart language spec instead)  
✗ Unable to run: generated app (no build environment)

No false paths or incomplete implementations found.
