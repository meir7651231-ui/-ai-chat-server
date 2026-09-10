# 🔍 Auditor Regression Report — panuy (M06)

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:1 · Missing import for distanceCategory function (used at line 49 and 174-175) · P0 compile-break · Add `import '../dart/distance_category.dart';` after line 9

new/dart-gen-bs/gen_app_panuy_ent1.dart:1 · Missing import for dart:math sqrt function (needed for line 49 c25 computation) · P0 compile-break · Add `import 'dart:math';` with other imports

new/dart-gen-bs/gen_app_panuy_ent1.dart:49 · Field c25 (מרחק בקמ) saved from user input `_v[11]` instead of computed from c24 via sqrt() · P1 wrong result · Replace `gen_app_panuy_ent1_c25: _v[11] ?? '',` with `gen_app_panuy_ent1_c25: (sqrt(num.tryParse(_v[10] ?? '') ?? 0)).toStringAsFixed(2),`

new/dart-gen-bs/gen_app_panuy_ent1.dart:49 · Field c26 (קרוב) saved from user input `_v[12]` instead of computed from c24 via distanceCategory() · P1 wrong result · Replace `gen_app_panuy_ent1_c26: _v[12] ?? '',` with `gen_app_panuy_ent1_c26: distanceCategory(num.tryParse(_v[10] ?? '') ?? 0),`

new/dart-gen-bs/gen_app_panuy_ent1.dart:174 · Field c25 (מרחק בקמ) rendered as ForgeDsField (editable text input) instead of _calc() (displayed computed value) · P1 wrong result · Replace ForgeDsField line with `_calc(gen_app_panuy_ent1_c25, sqrt(num.tryParse(_v[10] ?? '') ?? 0)),`

new/dart-gen-bs/gen_app_panuy_ent1.dart:175 · Field c26 (קרוב) rendered as ForgeDsField (editable text input) instead of _live() (displayed computed value) · P1 wrong result · Replace ForgeDsField line with `if (true) _live(gen_app_panuy_ent1_c26, distanceCategory(num.tryParse(_v[10] ?? '') ?? 0)),`

## Verified Correct

✅ **distanceCategory function definition** (new/dart/distance_category.dart:6–7): Function correctly implements the spec — returns "קרוב" when distanceSquared < 100, "רחוק" otherwise. Logic is sound.

✅ **Other computed fields** (line 49): Fields c22, c23, c24, c28 are correctly computed using formulas and imported functions (boqLineAmount).

✅ **Byte-identical for other apps** (per police report): No regression detected in other generated files; changes isolated to panuy spec and outputs.

✅ **Gates pass** (per police report): Hebrew validation, math safety, no hand-edits in generated code all pass.

## Coverage

- Checked: line-by-line _save(), _edit(), form rendering, card display, CSV export of gen_app_panuy_ent1.dart
- Checked: constant mapping in gen_app_panuy_ent1_content.dart
- Checked: distanceCategory function definition and signature
- Checked: import statements present/missing
- Could not check: actual flutter compilation/runtime behavior (Dart not installed; reasoning from language semantics)
- Could not check: how app-wide state mutation (AppStore) behaves with wrong-typed saved values

## Task Status

**NOT DONE** — The task was to add field קרוב computed as `distanceCategory(מרחק בריבוע)`, showing קרוב when < 100, רחוק otherwise. The generator:
- Created the constant label ✅
- Did NOT import the distanceCategory function ❌
- Did NOT compute the field at save time ❌
- Did NOT render the field as computed display ❌
- Treated it as editable user input instead ❌

Also broke the related field מרחק בקמ = sqrt(מרחק בריבוע) using same pattern.

