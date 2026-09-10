# Validation Report — E07 (peruk21 counter)

## Findings (ranked by severity)

compile-001 · CONFIRMED · gen_app_peruk21_px1.dart:35 · `.where(...).length` on Iterable (no `.length` property) · Replace `.length` with `.toList().length`: `.where((r) => (r[gen_app_peruk21_px1_c81] ?? '') == gen_app_peruk21_px1_c82).toList().length`

regression-001 · FALSE-POSITIVE · _audit-regression.md claimed "Iterable.length is valid Dart 3 syntax" and "no defects found" — This is incorrect; Iterable has no `.length` property in Dart; missed the real compile error on line 35 · No action needed; finding is wrong

## FIX-LIST:
gen_app_peruk21_px1.dart:35: Replace `.where((r) => (r[gen_app_peruk21_px1_c81] ?? '') == gen_app_peruk21_px1_c82).length.toDouble()` with `.where((r) => (r[gen_app_peruk21_px1_c81] ?? '') == gen_app_peruk21_px1_c82).toList().length.toDouble()`
