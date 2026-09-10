# 🔍 Auditor: Compile + Edge-Crash Lens — peruk17 Sorting

## Findings
**No defects found.** Task properly implemented.

## Coverage

**Verified correct:**
- **Generator logic (particles.mjs:387–392)**: Conditional sort applied only when `entity.slug === 'app_peruk17_ent1'` AND enum field exists. Checked: no `.sorted()` expression generated for other peruk apps (gen_app_peruk17_audit/behavior/ent1/… all have count=0; only gen_app_peruk17_px1.dart has count=1).
- **Dart method validity**: `.sorted(Comparator)` is stable method on Iterable in Dart 2.17+. Available in police's passing dart_math_sane gate.
- **Null safety**: Expression `(a[gen_app_peruk17_px1_c7] ?? '').compareTo(b[gen_app_peruk17_px1_c7] ?? '')` correctly coalesces null to empty string before comparing. Type is `String.compareTo(String)` ✓.
- **Field reference**: `gen_app_peruk17_px1_c7 = 'סיווג'` (constant verified in gen_app_peruk17_px1_content.dart:9). Sorts by correct field ✓.
- **Alphabetic sort**: `.compareTo()` does lexicographic (Unicode code-point) comparison; works for these Hebrew characters (ד < ה < ז < נ, matching linguistic order) ✓.
- **Applied to correct table**: Only the particle screen (px1 = table particle in spec) receives the sort, line 26 of gen_app_peruk17_px1.dart. Other screens (ent1, home, etc.) unaffected.
- **No collateral damage**: Police gate `byte_identical_others ✅` confirms all other apps (peruk01–16, schoolos, etc.) remain byte-identical; generator change is scoped ✓.
- **Integration**: Sorting applied inside for-loop: `[for (final r in appStore.records('app_peruk17_ent1').sorted(...)) [...]]`. Correct position; ForgeDataGrid receives sorted `items` list ✓.

**What could not be checked** (no runtime):
- Actual sort order at app runtime (would need Flutter execution).
- User interaction with sorted table.

## Verdict
✅ **READY**: Sorting correctly implemented, Dart sound, task complete, no other apps broken.
