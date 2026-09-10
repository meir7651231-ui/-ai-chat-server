# 🔍 Audit: Computed Field סכום כולל מעמ = סכום * 1.18

## Findings
**None. Task completed correctly.**

## Coverage Verified

### Spec Layer
✅ **machtzev/generator/specs-ds/tasks.txt:6** — Field added with correct formula syntax: `סכום כולל מעמ = סכום * 1.18` (using ASCII `*` operator, not Hebrew `×`)

### Generated Entity Screen (ent1)
✅ **new/dart-gen-bs/gen_app_tasks_ent1.dart:32** — Field included in `_labelsAll` list
✅ **new/dart-gen-bs/gen_app_tasks_ent1.dart:51** — Formula compiled to Dart: `((num.tryParse(_v[2] ?? '') ?? 0) * 1.18).toStringAsFixed(2)` (correct: uses `num.tryParse()` not invalid `.sqrt()/.min()`)
✅ **new/dart-gen-bs/gen_app_tasks_ent1.dart:63** — Field restored on edit (loads value at index 4)
✅ **new/dart-gen-bs/gen_app_tasks_ent1.dart:92** — Field displayed in card view via `DsRecordCard`
✅ **new/dart-gen-bs/gen_app_tasks_ent1.dart:98–100** — Field included in CSV export (header + values)
✅ **new/dart-gen-bs/gen_app_tasks_ent1.dart:161** — Field displayed read-only via `_calc()` function (not editable, correct)
✅ **new/dart-gen-bs/gen_app_tasks_ent1.dart:173** — Field included in table/grid view

### Content & Metadata
✅ **new/dart-data-bs/auto/gen_app_tasks_ent1_content.dart:15** — Label constant `gen_app_tasks_ent1_c13 = 'סכום כולל מעמ'` defined
✅ **new/dart-data-bs/auto/gen_app_tasks_home_content.dart:6–7** — Field included in home screen numeric fields (c5=סכום, c6=סכום כולל מעמ) for money display
✅ **machtzev/generator/apps/tasks.json:58–62** — Field correctly defined with `"type": "num"` in app schema

### Home Screen Integration
✅ **new/dart-gen-bs/gen_app_tasks_home.dart:21** — Field included in `_nums` list for money-display calculation: `static const List<String> _nums = [gen_app_tasks_home_c5, gen_app_tasks_home_c6]`

### Quality Assurance
✅ **_police.md** — Machine validation: all checks passed
  - `regen_ok` ✅ — generator executed successfully
  - `gates_pass` ✅ — all validation gates passed
  - `calc` ✅ — `consts=1 calc=1` (1 computed field detected, 1 correctly compiled)
  - `dart_math_sane` ✅ — no invalid math method calls
  - `no_hebrew_in_engine` ✅ — Hebrew preserved in spec layer only
  - `byte_identical_others` ✅ — no unintended changes to other files

✅ **machtzev/LEARNINGS.md** — Learning documented: formula syntax requires ASCII `*` operator (not Unicode `×`)

### Surfaces Covered
- ✅ Entity form (read-only display)
- ✅ List screen (card view)
- ✅ Table screen (grid view)
- ✅ Kanban/board screen (all fields supported)
- ✅ Calendar screen (all fields supported)
- ✅ Home/today screen (numeric fields list)
- ✅ Data persistence (CSV export)

**No defects found. All surfaces covered. Task is complete.**
