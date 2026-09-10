# 🔍 AUDIT REPORT — tasks.txt rounded-amount field

## Findings

`new/dart-gen-bs/gen_app_peruk06_root.dart:30 · DsPrimaryButton changed to DsChipButton (collateral scope creep) · P0 · revert peruk files (not part of task); regenerate only tasks outputs`

`new/dart-gen-bs/gen_app_peruk06_shell.dart · DsPrimaryButton→DsChipButton (unrelated app) · P0 · exclude peruk regeneration from this run`

`new/dart-gen-bs/gen_app_peruk23_root.dart:29 · DsPrimaryButton→DsChipButton (unrelated) · P0 · task scope: tasks app only`

`new/dart-gen-bs/gen_app_peruk23_shell.dart · same pattern · P0 · revert`

`new/dart-gen-bs/gen_app_peruk24_root.dart · same pattern · P0 · revert`

`new/dart-gen-bs/gen_app_peruk24_shell.dart · same pattern · P0 · revert`

`new/dart-gen-bs/gen_app_peruk27_root.dart · same pattern · P0 · revert`

`new/dart-gen-bs/gen_app_peruk27_shell.dart · same pattern · P0 · revert`

---

## Coverage

✅ **Verified correct:**
- Spec addition `סכום מעוגל = ~סכום` in tasks.txt properly marks field as computed
- Generated formula: `(((num.tryParse(_v[2] ?? '') ?? 0)).round()).toStringAsFixed(2)` correctly parses סכום with safe null-coalescing
- Computed field displayed but NOT user-editable in form (line 160: `_calc(...)` display-only)
- Value correctly saved when record created/edited (line 51: map includes computed value)
- Field properly included in card display (line 92), grid columns (line 173), CSV headers (line 98)
- No orphaned _v map indices (5-element user form maps to fields 0,1,2,4 with 3 computed/display-only; loading at line 63 loads _v[3] but never edits it, which is correct)
- All string→num conversions use safe `num.tryParse(...) ?? 0` pattern with proper type awareness

❌ **Could not verify (no Dart analyzer available):**
- Whether `.round()` method exists on `num` type returned by null-coalesce
- Actual flutter analyze output (police reports dart_math_sane ✅, but unclear exact scope)

---

## VERDICT

**TASK NOT DONE** — Collateral damage broke byte_identical_others check. 8 peruk root/shell files changed scope when only tasks app should have regenerated. The computed-field logic itself is sound, but build failed the integrity gate.
