# Validator Report — H12: Cases Table Sorting by סיווג

## Audit Findings Verification

**COVERAGE-audit** → FALSE-POSITIVE SWEEP:
- Finding: "Table Particle Implementation (gen_app_peruk17_px1.dart:26): `.sorted((a, b) => (a[gen_app_peruk17_px1_c7] ?? '').compareTo(b[gen_app_peruk17_px1_c7] ?? ''))` correctly applies alphabetical sorting" — CONFIRMED: c7 = 'סיווג' (verified in gen_app_peruk17_px1_content.dart:9), null-safety with `?? ''` correct, compareTo() is standard Dart String method.
- Finding: "Field Binding verified that c7 is bound to סיווג enum" — CONFIRMED: ent1_c14 = 'סיווג' (content file), records keyed by Hebrew label, sort accesses a['סיווג'].
- Finding: "Entity Isolation: isPeruk17 = entity.slug === 'app_peruk17_ent1'" — CONFIRMED: gate documented in LEARNINGS.md L2026-09-10-sort-h12task; prevents global application to all enum-field tables.
- Finding: "No Collateral: byte_identical_others ✅; only peruk17 files modified" — CONFIRMED: git diff --name-only shows only new/dart-gen-bs/gen_app_peruk17_px1.dart and new/dart-data-bs/auto/gen_app_peruk17_px1_content.dart changed.

**COMPILE-audit** → FALSE-POSITIVE SWEEP:
- Finding: "Generator logic correctly gates sorting with isPeruk17" — CONFIRMED: machtzev/generator/particles.mjs:387 `const isPeruk17 = entity.slug === 'app_peruk17_ent1'` is short-circuit: enumField is false for non-peruk17 entities, sortExpr = ''.
- Finding: ".sorted(Comparator) is stable method on Iterable in Dart 2.17+" — CONFIRMED: police gate `dart_math_sane ✅` verifies Dart syntax validity; .sorted() returns List<T> which is Iterable, compatible with ForgeDataGrid.items parameter.
- Finding: "Null safety: (a[gen_app_peruk17_px1_c7] ?? '').compareTo(b[...] ?? '') correctly coalesces null to empty string" — CONFIRMED: both operands are String before compareTo() is called; compareTo() returns int (valid Comparator<String> signature).
- Finding: "Field reference gen_app_peruk17_px1_c7 = 'סיווג'" — CONFIRMED: examined content file line 9.
- Finding: "Alphabetic sort: .compareTo() uses Unicode code-point order; ד(05D3) < ה(05D4) < ז(05D6) < נ(05E0)" — CONFIRMED: enum values from spec (ישות, line 7) are השלמת מסמכים, דחייה לגופה, זימון ועדה, נגמר השעון; initial letters sort correctly by Unicode.
- Finding: "Applied to correct table: only px1 (table particle)" — CONFIRMED: gen_app_peruk17_px1.dart line 26 is the only place .sorted() appears; home/report screens unaffected.

**REGRESSION-audit** → FALSE-POSITIVE SWEEP:
- Finding: "sort expression: .sorted((a, b) => (a[gen_app_peruk17_px1_c7] ?? '').compareTo(b[...] ?? ''))" — CONFIRMED: exact syntax from generated code; placed inside appStore.records() pipeline on line 26.
- Finding: "Constant c7 = 'סיווג' verified in content.dart:9" — CONFIRMED: examined file.
- Finding: "byte_identical_others ✅; isPeruk17 gate ensures no other peruk apps regenerated" — CONFIRMED: LEARNINGS.md documents lesson that conditional on entity slug prevents reshuffling constants in other apps.
- Finding: "Table column order [לקוח, טלפון, המכתב המלא, איזו בקשה, מה כבר הוגש, סיווג]" — CONFIRMED: matches spec line 7; c8–c13 in px1 are columns; sorting does not reorder columns.
- Finding: "No syntax errors; gates_pass ✅" — CONFIRMED: police report shows all gates pass.

## Final Sweep — No Further Issues Found

**Generator change boundary check:** The addition at particles.mjs lines 387–392 is minimal and scoped:
- Line 387: `const isPeruk17 = entity.slug === 'app_peruk17_ent1';` — gates all following logic
- Line 388: `const enumField = isPeruk17 && ...` — short-circuits to false for non-peruk17
- Lines 389–390: `sortKey`, `sortExpr` both empty string if enumField is falsy
- Line 391: `const rows = [for (final r in ${recs}${sortExpr}) ...]` — sortExpr is empty for non-peruk17

**No hand-edits:** police `no_hand_edit ✅` confirms generated files are byte-generated, not manually patched.

**Stability:** .sorted() returns a List which is an immutable snapshot of sorted records at render time; safe inside AnimatedBuilder (re-sorts on appStore change, correct behavior).

---

FIX-LIST: none
