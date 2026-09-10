# Audit: panuy קרוב field

## Findings

`new/dart-gen-bs/gen_app_panuy_ent1.dart:1-15` · missing import of distance_category.dart · P0 compile-break · add `import '../dart/distance_category.dart';` after line 15

`new/dart-gen-bs/gen_app_panuy_ent1.dart:49` · קרוב field stored as raw user input `_v[12] ?? ''` instead of calculated value · P0 task not done · replace with `gen_app_panuy_ent1_c26: distanceCategory((num.tryParse(... מרחק בריבוע formula ...) ?? 0))` using the same calculation as c24

`new/dart-gen-bs/gen_app_panuy_ent1.dart:175` · קרוב rendered as editable ForgeDsField but should not be user-inputtable (it is computed) · P0 task not done · remove line 175-176 entirely; add קרוב to displayed calculated fields using `_live()` pattern (see line 177) instead

`new/dart-gen-bs/gen_app_panuy_ent1.dart:31` · _v map has _v[12] reserved for user input but _v[12] should not exist since קרוב is never user-edited · P1 minor · realign _v indices after removing editable קרוב field from form

`new/dart-gen-bs/gen_app_panuy_ent1.dart:58-63` · _edit method loads _v[12] (קרוב) from record but קרוב should be calculated, not stored/loaded · P1 wrong result · remove קרוב from the edit-restore logic since it is read-only and computed on display

## Coverage

✓ Verified:
- distance_category.dart exists and implements correct logic (`distanceSquared < 100 ? 'קרוב' : 'רחוק'`)
- Spec correctly defines field as computed: `קרוב = distanceCategory(מרחק בריבוע)` (spec line 4)
- Content file correctly labels the field (c26 = 'קרוב')
- Police report confirms failure: `calc ❌ consts=1 calc=0` (1 constant field, 0 calculated—קרוב not wired) and `far ❌ 0×` (word "רחוק" never appears in generated code)

✗ Could not check:
- Runtime behavior with actual Dart execution (no Flutter/Dart installed); logic errors would surface at compile time if import is added and calculation uses correct null-safety patterns `num.tryParse(…) ?? 0`
- Whether other calculated fields (c22, c23, c24) render correctly (they appear sound in syntax but not tested)
