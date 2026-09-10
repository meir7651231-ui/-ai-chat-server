# 🔬 Validation Report — H09 (סכום מעוגל)

## Task Assessment
**Core Implementation:** ✅ SEMANTICALLY CORRECT
- Spec: machtzev/generator/specs-ds/tasks.txt line 6 correctly declares `סכום מעוגל = ~סכום` (computed field)
- Rounding logic (line 51): `(((num.tryParse(_v[2] ?? '') ?? 0)).round()).toStringAsFixed(2)` — null-safe, correct `num.round()` method, proper string formatting
- Display logic (line 160): `((num.tryParse(_v[2] ?? '') ?? 0)).round()` — correct roundtrip to _calc widget
- Constants (c12): correctly assigned 'סכום מעוגל' with field index shifted
- Surfaces: form (160), card (92), grid (173), CSV (98) all correctly include new field

**Police Checks:** ✅ All pass except byte_identical_others
- regen_ok ✅, gates_pass ✅, dart_math_sane ✅, calc ✅ (consts=1 calc=1), round ✅ (2×)

---

## Findings

### Collateral Damage (Critical Scope Violation)

**peruk06_root.dart:30-31** · CONFIRMED · P0 · 
new/dart-gen-bs/gen_app_peruk06_root.dart line 30: `DsPrimaryButton(label: gen_app_peruk06_root_c49` changed to `DsChipButton(label: gen_app_peruk06_root_c49` + line 31 identical pattern
fix: revert file to HEAD state

**peruk06_shell.dart:45** · CONFIRMED · P0 · 
new/dart-gen-bs/gen_app_peruk06_shell.dart line 45: `DsPrimaryButton(label: gen_app_peruk06_shell_c4` changed to `DsChipButton(label: gen_app_peruk06_shell_c4`
fix: revert file to HEAD state

**peruk23_root.dart:29** · CONFIRMED · P0 · 
new/dart-gen-bs/gen_app_peruk23_root.dart line 29: DsPrimaryButton→DsChipButton, unrelated to tasks app
fix: revert file to HEAD state

**peruk23_shell.dart** · CONFIRMED · P0 · 
new/dart-gen-bs/gen_app_peruk23_shell.dart: DsPrimaryButton→DsChipButton widget replacement, unrelated scope
fix: revert file to HEAD state

**peruk24_root.dart** · CONFIRMED · P0 · 
new/dart-gen-bs/gen_app_peruk24_root.dart: DsPrimaryButton→DsChipButton widget replacement, unrelated scope
fix: revert file to HEAD state

**peruk24_shell.dart** · CONFIRMED · P0 · 
new/dart-gen-bs/gen_app_peruk24_shell.dart: DsPrimaryButton→DsChipButton widget replacement, unrelated scope
fix: revert file to HEAD state

**peruk27_root.dart** · CONFIRMED · P0 · 
new/dart-gen-bs/gen_app_peruk27_root.dart: DsPrimaryButton→DsChipButton widget replacement, unrelated scope
fix: revert file to HEAD state

**peruk27_shell.dart** · CONFIRMED · P0 · 
new/dart-gen-bs/gen_app_peruk27_shell.dart: DsPrimaryButton→DsChipButton widget replacement, unrelated scope
fix: revert file to HEAD state

---

## Verdict

**TASK BLOCKED ON COLLATERAL DAMAGE** — The computed field סכום מעוגל is correctly implemented across all surfaces (form, card, grid, CSV export) with correct Dart semantics, but the build violated scope by regenerating 8 unrelated peruk app files (peruk06/23/24/27 root+shell) with button-widget changes (DsPrimaryButton→DsChipButton). This fails the `byte_identical_others` gate. Auditors' findings are valid.

---

FIX-LIST: revert gen_app_peruk06_root.dart, gen_app_peruk06_shell.dart, gen_app_peruk23_root.dart, gen_app_peruk23_shell.dart, gen_app_peruk24_root.dart, gen_app_peruk24_shell.dart, gen_app_peruk27_root.dart, gen_app_peruk27_shell.dart to HEAD state; retain tasks app changes (gen_app_tasks_ent1*.dart + gen_app_tasks_ent1_content.dart correct)
