# Audit: Calendar Meeting Particle Sorting (px1)

## Findings

**No defects found.**

## Coverage

**Verified correct:**
- **Spec compliance** (machtzev/generator/specs-ds/calendar.txt): Particle definition `חלקיק פגישה: רשימה = [טבלה] מה, מועד, שעה, מקום | מיון: מועד עולה, שעה עולה` added correctly.
- **Data source** (gen_app_calendar_px1.dart:18): `appStore.records('app_calendar_ent1')` retrieves correct entity type as `List<Map<String, String>>`.
- **Sort field mappings** (gen_app_calendar_px1_content.dart): Constants c5='מועד' (date) and c6='שעה' (time) correctly match entity field names.
- **Sort order** (gen_app_calendar_px1.dart:18): First sort key uses c5 (מועד), second uses c6 (שעה), matching spec `מועד עולה, שעה עולה`.
- **Dart null-safety**: 
  - `a[key] ?? ''` correctly provides default empty string
  - `num.tryParse(x)` valid on String, returns `num?`
  - `.isEmpty` valid on String, `.compareTo()` valid on both num and String
- **Comparator logic** (line 18): 
  - Handles empty values correctly (pushed to end with `x.isEmpty ? 1 : -1`)
  - Numeric comparison when both values parse as numbers
  - Lexical comparison fallback using `String.compareTo()`
  - Early return on first non-zero comparison (`if (c != 0) return c`)
  - Correct chaining: first sort key, then second sort key, final return 0
- **Items transformation** (line 18): Table data correctly extracted as `[(r[c7] ?? ''), (r[c8] ?? ''), (r[c9] ?? ''), (r[c10] ?? '')]` (columns: מה, מועד, שעה, מקום).
- **Syntax & compilation**: No parenthesis nesting errors, cascade operator `..sort()` valid, for-loop comprehension correct.
- **Machine validation** (_police.md): All 53+ gates passed including `sort_both` gate (✅ px1), confirming sort implementation is correct.

**Could not check:**
- Runtime data types at execution time (no Flutter/Dart runtime available, only static analysis).
- Actual meeting records in store to verify sort produces correct order (would require live app instance).
