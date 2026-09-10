# 🔍 Audit Coverage — Task H09 (סכום מעוגל computed field)

## Findings

**new/dart-gen-bs/gen_app_peruk06_root.dart:30–31 · P0 · collateral damage — DsPrimaryButton→DsChipButton unrelated to tasks.txt change · reverting this entire file is required**
**new/dart-gen-bs/gen_app_peruk06_shell.dart:* · P0 · same widget replacement, unrelated to task**
**new/dart-gen-bs/gen_app_peruk23_root.dart:* · P0 · same widget replacement, unrelated to task**
**new/dart-gen-bs/gen_app_peruk23_shell.dart:* · P0 · same widget replacement, unrelated to task**
**new/dart-gen-bs/gen_app_peruk24_root.dart:* · P0 · same widget replacement, unrelated to task**
**new/dart-gen-bs/gen_app_peruk24_shell.dart:* · P0 · same widget replacement, unrelated to task**
**new/dart-gen-bs/gen_app_peruk27_root.dart:* · P0 · same widget replacement, unrelated to task**
**new/dart-gen-bs/gen_app_peruk27_shell.dart:* · P0 · same widget replacement, unrelated to task**

---

## Task Coverage Verified ✅

### Core Implementation
- **Spec added correctly**: `machtzev/generator/specs-ds/tasks.txt` now declares `סכום מעוגל = ~סכום`
- **Field definition**: `new/dart-data-bs/auto/gen_app_tasks_ent1_content.dart:14` — `c12 = 'סכום מעוגל'` ✓
- **Computed logic (form input)**: `new/dart-gen-bs/gen_app_tasks_ent1.dart:160` — displays `_calc(c12, (num.tryParse(_v[2]).round()))` ✓
- **Computed logic (save)**: `new/dart-gen-bs/gen_app_tasks_ent1.dart:51` — computes and stores `(((num.tryParse(_v[2] ?? '') ?? 0)).round()).toStringAsFixed(2)` ✓
- **Dart semantics correct**: `num.tryParse()` → `num?` → `?? 0` default → `.round()` (returns `int`) → `.toStringAsFixed(2)` (displays with 2 decimals) ✓

### Surfaces Covered
- **Entity screen (form)**: reads-only display via `_calc()` green box (L160) ✓
- **Record card**: included in `_labelsAll` (L32), displayed in `DsRecordCard.values` (L92) ✓
- **Table view**: column 4 (gen_app_tasks_ent1_c12) in `ForgeDataGrid` (L173) ✓
- **Kanban board**: not displayed (design decision: title-only view, reasonable for board metaphor)
- **Calendar**: not displayed (design decision: title+date-only view)
- **Home screen**: title field only (federated to ent1 tab)

### Police Checks
- `calc ✅ consts=1 calc=1` — one constant declaration, one computed field ✓
- `round ✅ 2×` — two round() calls (form display + save logic) ✓
- `regen_ok ✅` — machine regenerated successfully ✓
- `gates_pass ✅` — validation gates passed ✓

---

## **VERDICT: TASK INCOMPLETE — byte_identical_others failed (P0 task blocker)**

The implementation of the computed field `סכום מעוגל` is **semantically sound and covers all task surfaces**, but **8 collateral files outside the tasks app were inadvertently regenerated** with unrelated widget-skin changes (DsPrimaryButton→DsChipButton in peruk06/23/24/27 root+shell). This violates "don't break anything"; the task is blocked until those peruk files are reverted to their unchanged state.

