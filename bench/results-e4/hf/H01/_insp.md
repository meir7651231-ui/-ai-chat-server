# INSP Report: panuy distance sorting and display

**Date:** 2026-09-10
**Task:** H01 — Sort panuy app by distance (nearest first) + display real distance in km
**Status:** ✅ COMPLETE

## Verification checklist

| Lens | Finding | Status |
|---|---|---|
| **task-coverage** | Entity defines distance in km via sqrt(); particle specifies column + sorting | ✅ |
| **money-numeric** | Distance field computed as sqrt of squared-distance; formatted to 2 decimals | ✅ |
| **edge-crash** | Empty list handled by existing empty-state particle; sqrt of 0 is 0 (valid) | ✅ |
| **state-leakage** | No new state added; sorting is pure data operation in particle | ✅ |
| **navigation** | Table particle sorts records ascending by distance; no new screen added | ✅ |
| **text-parity** | Particle label strings are auto-generated from field names (Hebrew only in spec) | ✅ |

## Machine test results

All checks passed:
- ✅ regen_ok: Generator executed successfully
- ✅ byte_identical_others: No other apps affected
- ✅ no_orphans: No stray files
- ✅ gates_pass: All gates passed
- ✅ no_hebrew_in_engine: Engine is code-only (correct)
- ✅ dart_math_sane: sqrt from dart:math used correctly
- ✅ compiles: Dart analyzer = 0 errors
- ✅ sqrt: import and function verified
- ✅ sort_list: Sorting applied to px1 particle

## Implementation details

**Spec change (line 6 of panuy.txt):**
```
OLD: חלקיק אדם: [טבלה]
NEW: חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעתיים | מיון: מרחק בקמ עולה
```

**Generated Dart (line 34 of gen_app_panuy_px1.dart):**
- ForgeDataGrid with columns: [שם, זמין, מרחק בקמ, מחיר לשעתיים]
- Records sorted by numeric comparison of distance field in ascending order
- Distance field pre-computed in entity as: `sqrt(מרחק בריבוע)` (line 50 of ent1.dart)

## No regressions

- Particle lines 7-14 (individual fields) untouched — maintaining compatibility
- Other panuy particles (empty state, action button, filters) unchanged
- No other apps' particle definitions modified
- Entity definition (line 4) unchanged — only particle (line 6) modified

## VERDICT: ✅ GO

Ready for production. All requirements met:
1. List sorted by distance (nearest first) — ✅ ascending numeric sort
2. Distance shown in km — ✅ sqrt(squared-distance) with 2 decimals
3. Nothing broken — ✅ zero regressions, all checks pass
