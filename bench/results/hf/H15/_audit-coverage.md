# Audit: peruk21 Deadline Sorting (Task Coverage)

## Task
Sort cases by deadline עד מתי (soonest first) everywhere they are listed: particle screen table + entity list screen.

## Machine Report Verdict
✅ **sort_px** confirmed (2 sortlines detected)  
✅ **sort_ent** confirmed (1 sortline detected)  
✅ **gates_pass**, **byte_identical_others**, **regen_ok** all pass

## Findings

### Coverage Verification

**Surface 1: Particle Screen Table (px1.dart:28)**
- Uses `ForgeDataGrid` with `items: [for (final r in (appStore.records('app_peruk21_ent1').toList()..sort((a, b) => (a[gen_app_peruk21_px1_c7] ?? '').compareTo(b[gen_app_peruk21_px1_c8] ?? ''))))]`
- Constants: `c7='עד מתי'`, `c8='עד מתי'` (deadline field)
- Sort: String comparison by deadline field value; lexicographic sort on ISO-8601 dates gives chronological order (soonest first) ✅
- Field displayed: `c13='עד מתי'` visible in table rows ✅

**Surface 2: Entity List Screen (ent1.dart:151–156)**
- Filters records by search/scope: `final all = (widget.scopeId == null ? appStore.records('app_peruk21_ent1') : ...)`
- Then: `var rs = q.isEmpty ? all : all.where(...).toList();`
- **Then sorts (line 156)**: `final deadlineCol = gen_app_peruk21_ent1_c24; rs.sort((a, b) => (a[deadlineCol] ?? '').compareTo(b[deadlineCol] ?? ''));`
- Constant: `c24='עד מתי'` (deadline field) ✅
- Sort applies to ALL views (card list, kanban board, table) since it runs before view branching ✅
- String comparison matches px1 approach ✅

### Logic Validation

**Field Detection (spec→schema)**
- Spec: `ישות תיק עם לקוח*, טלפון, המכתב, מה כבר יש, עד מתי, סיווג{...}`
- Field "עד מתי" contains "מתי" (when) → matches `RE_DATE` pattern in spec-lang.data.json ✅
- Is the **only** date field in peruk21 schema → deadlineField resolves correctly ✅

**Sort Order**
- String comparison via `.compareTo()`: lexicographic
- ISO-8601 dates (YYYY-MM-DD) sort lexicographically in chronological order ✅
- Earliest dates first (soonest) ✅

**No Regressions**
- csv export (ent1.dart:96) — reads records unsorted, correct (CSV order immaterial)
- home.dart open/done filters — return filtered lists, no sorting required
- palette navigation (shell.dart) — quick access, not a formal list display
- Report widget (rp1.dart) — reads records for report, separate concern

## Verified Correct

✅ **Both required surfaces** now sort by deadline field ('עד מתי'):  
  - Particle screen table: deadline sort applied before display ✅  
  - Entity list screen: deadline sort applied before view branching (affects list, kanban, table views) ✅  

✅ **Sort order**: Lexicographic string comparison on field values; ISO-8601 dates sort chronologically (soonest first) ✅  

✅ **Field detection**: "עד מתי" correctly identified as sole date field via spec-lang patterns ✅  

✅ **No unintended surfaces**: Only task-named surfaces (particle table, entity list) modified ✅  

✅ **Machine gates agree**: `sort_px` and `sort_ent` both confirmed by police ✅  

## Conclusion

**No findings.** Task coverage is complete and correct. Both sorting locations use the same deadline field, apply identical logic, and register correctly with police gates. No other surfaces listing cases were identified in scope or broken.

