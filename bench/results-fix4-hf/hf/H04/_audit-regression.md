# Auditor Report: Calendar App Sorting Task (H04)

## Findings

**Status: CLEAN** — No regressions or state-leakage detected.

---

## Verification Checklist

### Spec & Data Integrity
✅ **calendar.txt** — Single line added at EOF with correct syntax:
```
חלקיק פגישה: רשימה = [טבלה] מה, מועד, שעה, מקום | מיון: מועד עולה, שעה עולה
```
Field order: מה, מועד, שעה, מקום (unchanged)
Sort directive: correct (date ascending, then time ascending)

✅ **particle-plan-calendar.json** — Valid JSON structure, single particle:
- entity: "פגישה"
- expr: matches spec exactly
- ok: true (parser acceptance)
- wired: ["DsTable"] (correct widget selection)

### Generated Dart Code
✅ **gen_app_calendar_px1.dart** — Sort logic verified (line 18):
```dart
.toList()..sort((a, b) { 
  // Block 1: c5 = 'מועד' (date)
  { final x = a[gen_app_calendar_px1_c5] ?? '', y = b[gen_app_calendar_px1_c5] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
    final nx = num.tryParse(x), ny = num.tryParse(y); 
    final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); 
    if (c != 0) return c; } 
  // Block 2: c6 = 'שעה' (time)
  { final x = a[gen_app_calendar_px1_c6] ?? '', y = b[gen_app_calendar_px1_c6] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
    final nx = num.tryParse(x), ny = num.tryParse(y); 
    final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); 
    if (c != 0) return c; } 
  return 0; 
})
```
- **Primary key**: c5 (מועד) — numeric or lexical ascending ✓
- **Secondary key**: c6 (שעה) — numeric or lexical ascending ✓
- **Order**: matches spec (מועד first, שעה second) ✓
- **Dart Semantics**: 
  - `num.tryParse()` returns `num?` ✓ (sound null-safety)
  - numeric `.compareTo()` returns `int` for sort ✓
  - string `.compareTo()` returns `int` for lexical order ✓
  - empty-last handling correct: `x.isEmpty ? 1 : -1` ✓

✅ **Content Constants** — gen_app_calendar_px1_content.dart:
- c5 = 'מועד' (date) ✓
- c6 = 'שעה' (time) ✓
- c7–c10 = display columns in correct order ✓

### Isolation & No State-Leakage
✅ **Calendar app only**: Only gen_app_calendar_px1.dart contains the two-field sort pattern
✅ **No mutation of other apps**: Police report confirms ✅ byte_identical_others
✅ **Other particle files unchanged**: particle-plan-peruk*.json, particle-plan-tasks.json, particle-plan-panuy.json all remain untouched
✅ **Other calendar screens unaffected**: gen_app_calendar_home.dart, gen_app_calendar_root.dart, etc. have pre-existing sorts unrelated to this change

### Learning & Documentation
✅ **LEARNINGS.md** — Entry L2026-09-10-particle-sort-a3f18e added:
- Gate: particles ✓
- Ref: calendar.txt ✓
- Pattern matches implemented code ✓
- No hand-edit claim in generator files (all logic in spec) ✓

### Test Results
✅ **Machine Verdict** (./_police.md):
- regen_ok: ✅ (generator ran without error)
- byte_identical_others: ✅ (no spillover to unrelated code)
- gates_pass: ✅ (all 53+ validation gates green)
- sort_both: ✅ (px1 now sorted by מועד then שעה, both ascending)
- no_hebrew_in_engine: ✅ (logic is language-neutral)
- dart_math_sane: ✅ (all numeric operations valid)

---

## Coverage Summary

**What was checked:**
- Spec syntax & completeness (calendar.txt line 7)
- Generated JSON structure & consistency (particle-plan-calendar.json)
- Dart sort lambda correctness: order, nullability, numeric vs lexical, ascending vs descending
- Field mapping (c5→מועד, c6→שעה) matches spec intent
- Isolation: calendar particle change did not affect other 28 apps (peruk01–28, tasks, panuy, sechirut)
- No string-based regex or pattern over-trigger on other code
- LEARNINGS.md entry format and gate reference
- Machine's verification of all 53+ gates + dedicated sort_both test

**What could not be checked (Dart runtime / Flutter not installed):**
- Actual date/time string formats in records (assumed ISO 8601 or numeric YYYYMMDD based on machine's ✅ sort_both)
- Runtime behavior of `ForgeDataGrid` rendering with sorted items
- Timezone or locale handling in string comparisons

---

## Conclusion

**No findings.** The calendar app particle sorting implementation is:
- **Complete**: Task done (meetings table sorted by date, then time)
- **Correct**: Sort order matches spec (מועד עולה, שעה עולה)
- **Clean**: No state-leakage, no regressions to other apps
- **Well-documented**: Learning pattern recorded in LEARNINGS.md with gate reference

The builder and generator executed correctly; the machine's police report confirms all checks passed.

