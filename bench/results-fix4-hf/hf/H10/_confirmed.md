# 🔍 VALIDATOR — Calendar Sort (H10)

**Verification against auditors' findings**

## Audit Summary
- _audit-compile.md: No findings
- _audit-coverage.md: No defects found
- _audit-regression.md: No findings
- _police.md: All checks pass (regen_ok ✅, byte_identical_others ✅, gates_pass ✅, sort_list ✅ ent1)

## Verification Performed

### Spec Correctness (machtzev/generator/specs-ds/calendar.txt)
✅ Line 6: Sort directive present `| מיון: שעה עולה` (sort by time ascending)
✅ Field name correctly references 'שעה' from entity fields

### Generated Code (gen_app_calendar_ent1.dart)
✅ Line 157: Sort lambda correctly implemented
  - Empty values sort last: `if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1`
  - Numeric comparison available: `num.tryParse()` (valid Dart static method; no dart:math needed)
  - String fallback: `x.compareTo(y)`
  - Ascending order: returns c directly (not negated)
✅ Syntax: Double brace `{ { ... } return 0; }` is valid Dart scoped block
✅ Null safety: `?? ''` patterns correct, compareTo() on non-null values

### View Coverage (gen_app_calendar_ent1.dart)
✅ Line 158, board view (kR = rs): sorted
✅ Line 159, calendar view (rs passed to DsCalendar.grid): sorted
✅ Line 160, table view (rs.map()): sorted
✅ Line 164–165, list view (rs[i]): sorted

### Field Mapping (gen_app_calendar_ent1_content.dart)
✅ c16 = 'שעה' (line 18): correct sort field name
✅ c11 = 'שעה' (line 13): correct field label
✅ c10 = 'מועד' (line 12): date field (not time, correctly not used for sort)

### Task Completeness
✅ Entity list screen (ent1): sort applied ✓
❌ Particle screen: does not exist in spec (task mentions "particle screen" but none defined in calendar.txt)
  - Police marks `sort_second_surface (info) ❌ none` as informational only (not a code defect)
  - No generated Dart files for particles; no regression

## Findings

**None.** All auditor findings are CORRECT. The implementation is sound:
- Spec directive is properly applied by generator
- Sort lambda is syntactically and logically correct
- All four display modes use the sorted list
- Null safety and Dart APIs are correct
- No regressions in other files (byte_identical_others ✅)

The only task specification gap (no particle screen) is noted as informational in police report, not a code defect.

---

**FIX-LIST:** none
