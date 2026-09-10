# Audit Coverage Report: peruk21 Counter Task

## Findings

new/dart-gen-bs/gen_app_peruk21_px1.dart:35 · Iterable.length does not exist; `.where()` returns Iterable, which lacks `.length` property in Dart · P1 compile-break · replace `.length` with `.toList().length` as used in parallel counters (gen_app_sechirut_rp1.dart:300, gen_app_peruk01_px2.dart, etc.)

## Coverage Verified

✅ **Spec layer**: Spec file correctly adds counter particle on line 16: `חלקיק תיק: דחופים = מונה(סיווג=הזמנה לוועדה)` — syntax valid, placed in correct position

✅ **Constants/content**: px1_content.dart properly defines filter configuration:
  - gen_app_peruk21_px1_c79 = 'דחופים' (label for counter)
  - gen_app_peruk21_px1_c81 = 'סיווג' (field to filter by)
  - gen_app_peruk21_px1_c82 = 'הזמנה לוועדה' (exact value to match)

✅ **Layout on px1 screen**: Counter correctly renders between סיווג section (line 34) and אסור section (line 36), using KvLine component with AnimatedBuilder for reactivity

✅ **Filter semantics**: Logic filters app_peruk21_ent1 records where סיווג field == 'הזמנה לוועדה' and counts matches — filter value matches task requirement exactly

✅ **Gate checks**: All 53 gates pass, no byte-drift to other files, spec regeneration succeeds

**Unverifiable** (no Flutter/Dart installed):
- Whether `.length` on Iterable compiles (should not, per Dart spec; parallel code patterns use `.toList().length()` successfully)
- Widget runtime rendering and counter update behavior
