# Audit Report: Rounded Amount Field (tasks.txt)

## Findings

**Regressions (byte_identical_others failure — police report):**
new/dart-gen-bs/gen_app_peruk06_root.dart:30–31 · DsPrimaryButton → DsChipButton (button style changes) · P1 unwanted side effect · Revert peruk files; builder should regenerate tasks app only

new/dart-gen-bs/gen_app_peruk06_shell.dart · Similar button changes outside scope · P1 unwanted side effect · Revert

new/dart-gen-bs/gen_app_peruk23_root.dart:29 · Similar button changes outside scope · P1 unwanted side effect · Revert

new/dart-gen-bs/gen_app_peruk23_shell.dart · Similar button changes outside scope · P1 unwanted side effect · Revert

new/dart-gen-bs/gen_app_peruk24_root.dart · Similar button changes outside scope · P1 unwanted side effect · Revert

new/dart-gen-bs/gen_app_peruk24_shell.dart · Similar button changes outside scope · P1 unwanted side effect · Revert

new/dart-gen-bs/gen_app_peruk27_root.dart · Similar button changes outside scope · P1 unwanted side effect · Revert

new/dart-gen-bs/gen_app_peruk27_shell.dart · Similar button changes outside scope · P1 unwanted side effect · Revert

## Verified Correct

✅ **Rounding implementation (both occurrences):**
- new/dart-gen-bs/gen_app_tasks_ent1.dart:51 — `(((num.tryParse(_v[2] ?? '') ?? 0)).round()).toStringAsFixed(2)` correctly rounds סכום to nearest integer and formats with 2 decimals for storage
- new/dart-gen-bs/gen_app_tasks_ent1.dart:160 — `((num.tryParse(_v[2] ?? '') ?? 0)).round()` correctly rounds for display via _calc widget
- Dart semantics verified: num.round() returns int, chained to .toStringAsFixed(num) produces correct output

✅ **Specification correctly updated:** machtzev/generator/specs-ds/tasks.txt line 6 properly defines `סכום מעוגל = ~סכום` with computed field syntax

✅ **Constant layer correct:** new/dart-data-bs/auto/gen_app_tasks_ent1_content.dart
- c12 = 'סכום מעוגל' ✓
- Subtitle updated from "4 שדות · 2 שלבים" to "5 שדות · 2 שלבים" ✓
- All field indices shifted correctly after insertion

✅ **Form rendering correct:** 
- Line 160 displays computed field as read-only calculated value using _calc widget ✓
- Input section (lines 157–161): only _v[0,1,2,4] are editable; computed value displayed inline ✓
- Edit loading (line 63) properly loads stored computed value for display ✓
- CSV export (lines 98–100) and data grid (line 173) include computed column ✓

✅ **Field mapping sound:**
- _labelsAll correctly includes all 5 fields for prefill/edit scenarios
- Computed field (_v[3]) never participates in save() input (only _v[0,1,2,4] sent)
- _save() computes c12 fresh from סכום input on line 51 ✓

✅ **Police checks passed:** regen_ok, gates_pass, no_hebrew_in_engine, dart_math_sane, calc (consts=1 calc=1), round (2×) all ✅

## Coverage

Checked: rounding logic (both places), formula implementation, Dart null-safety semantics, field ordering, constant definitions, form input/output structure, spec syntax, police validation checks, CSV/grid export.

Could not check: Flutter runtime rendering (not installed), AppStore integration, real UI display.

## Status

**REGRESSION DETECTED (P1):** Task marked "NOT DONE" per police report — `byte_identical_others` failure. Rounded amount feature itself is correctly implemented, but builder violated scope by regenerating 8 peruk files outside the tasks app.
