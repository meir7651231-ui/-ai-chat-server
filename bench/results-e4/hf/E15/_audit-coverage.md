# Audit Report: Computed Field סכום כולל מעמ (VAT Total)

## Findings
None. The implementation is sound.

## Coverage Verified

### 1. Entity Definition & Persistence
- **new/dart-gen-bs/gen_app_tasks_ent1.dart:52** · Formula `((num.tryParse(_v[2] ?? '') ?? 0) * 1.18).toStringAsFixed(2)` correctly computes סכום כולל מעמ from סכום on save
- **new/dart-gen-bs/gen_app_tasks_ent1.dart:160** · Calculated field displayed as read-only widget via `_calc()` method with calculate icon
- **new/dart-data-bs/auto/gen_app_tasks_ent1_content.dart:14** · Label "סכום כולל מעמ" (c12) properly indexed

### 2. Entity List Screen (ent1.dart)
- **Line 92** · Field appears in card view: `labels: const [..., gen_app_tasks_ent1_c12, ...]`
- **Line 98** · Field included in CSV export header
- **Line 100** · Field exported in CSV rows with stored value
- **Line 173** · Field rendered in data grid (table view): column index c12 shown
- **Line 63** · Field loaded correctly when editing: indexed as position 3 in _v map
- **Line 64** · Field re-displayed in edit form without modification

### 3. Particle Table & Hub
- The entity screen itself (ent1.dart) IS the particle table — field appears across all views (list, board, calendar, table)
- Board view (line 172): Field filtered for display in kanban columns
- Calendar view (line 172): Field available to grid builder

### 4. Home Screen / Money Display (gen_app_tasks_home.dart)
- **Line 8 (content)** · `gen_app_tasks_home_c6 = 'סכום כולל מעמ'` constant defined
- **Line 21 (home.dart)** · Field ADDED to `_nums` list: `[gen_app_tasks_home_c5, gen_app_tasks_home_c6]`
- **Line 22** · `_moneyOf()` now iterates over both סכום and סכום כולל מעמ for money calculation
- Field properly used in home screen rendering for total display

### 5. Formula Implementation
- **Spec**: `סכום כולל מעמ = סכום * 1.18` (correct VAT formula: multiply by 1.18)
- **Dart**: `(num.tryParse(_v[2] ?? '') ?? 0) * 1.18` 
  - ✓ Safe null handling via `tryParse()` returning `num?`
  - ✓ Default to 0 if source field is missing/non-numeric
  - ✓ Multiplication with `num` type (not `int` — correct for Dart)
  - ✓ Formatted to 2 decimals via `.toStringAsFixed(2)`

### 6. Type & Generation
- **new/dart-gen-bs/gen_app_tasks_home.dart** & **new/dart-data-bs/auto/gen_app_tasks_ent1_content.dart** regenerated successfully
- Police confirms: `compiles ✅` · `dart_math_sane ✅` · `regen_ok ✅`
- No hand edits detected in generated files

## What Was Checked
- All generated Dart surfaces: entity form, list views (card/board/calendar/table), CSV export, home screen money display
- Formula correctness and Dart type safety
- Field inclusion in data persistence (AppStore save/load)
- Specification syntax parsing (computed field with arithmetic formula)
- Read-only display (field not user-editable in form)
- Cross-module usage (field added to _nums in home screen for multi-entity aggregation)

## Not Checked (out of scope for this audit lens)
- Runtime tests (no test files found for this app)
- Flutter rendering/UI appearance (tooling not available)
- Multi-user concurrency (not applicable to this generated schema)
