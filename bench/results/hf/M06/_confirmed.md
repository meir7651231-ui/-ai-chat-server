# Validator Report — panuy קרוב field task

## Confirmed Findings (ranked by severity)

1. **IMPORT-DISTCAT** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:1-16` no import statement for distance_category · Add `import '../dart/distance_category.dart';` after line 11

2. **IMPORT-MATH** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:1-16` no import for dart:math (needed for sqrt in c25) · Add `import 'dart:math';` after line 11

3. **CALC-C26-SAVE** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:49` קרוב field line reads `gen_app_panuy_ent1_c26: _v[12] ?? '',` storing raw user input instead of `distanceCategory(num.tryParse(_v[10] ?? '') ?? 0)` · Replace with computed expression

4. **CALC-C25-SAVE** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:49` מרחק בקמ field line reads `gen_app_panuy_ent1_c25: _v[11] ?? '',` storing raw input instead of `(sqrt(num.tryParse(_v[10] ?? '') ?? 0)).toStringAsFixed(2)` · Replace with computed sqrt expression

5. **EDITABLE-C26** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:175` renders קרוב as `ForgeDsField(...value: _v[12] ?? ''...)` making it user-editable; should be display-only via `_live()` · Replace line 175 with `_live(gen_app_panuy_ent1_c26, distanceCategory(num.tryParse(_v[10] ?? '') ?? 0)),`

6. **EDITABLE-C25** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:174` renders מרחק בקמ as `ForgeDsField(...value: _v[11] ?? ''...)` making it user-editable; should be display-only via `_calc()` · Replace line 174 with `_calc(gen_app_panuy_ent1_c25, sqrt(num.tryParse(_v[10] ?? '') ?? 0)),`

7. **EDIT-LOAD-C26** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:61` loads קרוב into _v[12] via `12: r[gen_app_panuy_ent1_c26] ?? ''` in _edit(); computed fields must not be loaded from storage · Remove the `12: r[gen_app_panuy_ent1_c26] ?? ''` pair from line 61

8. **EDIT-LOAD-C25** · CONFIRMED · `new/dart-gen-bs/gen_app_panuy_ent1.dart:61` loads מרחק בקמ into _v[11] via `11: r[gen_app_panuy_ent1_c25] ?? ''` in _edit(); computed fields must not be loaded from storage · Remove the `11: r[gen_app_panuy_ent1_c25] ?? ''` pair from line 61

## Summary

**Task Status**: NOT DONE — קרוב field created in spec and labeled in generated constants, but NOT computed. Field stored as raw user input and rendered as editable instead of calculated/display-only. Related field מרחק בקמ has same pattern breakage. Both need fixes.

**Police Report Correlation**:
- `calc ❌ consts=1 calc=0`: Label exists (c26, c25) but zero calculations invoked
- `far ❌ 0×`: String 'רחוק' never appears in Dart because distanceCategory() is not called

**Byte Evidence Quality**: 8/8 findings verified line-by-line against git diff of gen_app_panuy_ent1.dart

---

FIX-LIST: IMPORT-DISTCAT, IMPORT-MATH, CALC-C26-SAVE, CALC-C25-SAVE, EDITABLE-C26, EDITABLE-C25, EDIT-LOAD-C26, EDIT-LOAD-C25
