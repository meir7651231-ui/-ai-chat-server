# Auditor Report — peruk12 Task (E13)

## Findings

new/dart-gen-bs/gen_app_peruk12_ent1.dart:162 · computed field מחיר לקמ treated as editable form input instead of calculated read-only value · **P1 task not done** · Remove from form fields array; add _calc() function to compute מחיר / קילומטראז on display and save.

machtzev/generator/apps/peruk12.json:65-68 · field קילומטראז typed as "text" but computation מחיר / קילומטראז requires numeric type · **P1 wrong result** · Change line 66 from `"type": "text"` to `"type": "num"` so values can be parsed as numbers for division.

new/dart-gen-bs/gen_app_peruk12_ent1.dart:48,158-159 · maleage field (קילומטראז) stored as string in Map<int,String> but formula מחיר/קילומטראז requires parsing to num before division; no num.tryParse() calls exist · **P1 wrong result** · Add conversion: `final km = num.tryParse(_v[4] ?? '0') ?? 0; final price = num.tryParse(_v[3] ?? '0') ?? 0;` and compute `_v[7] = (km > 0 ? (price / km).toStringAsFixed(2) : '').trim();` before save.

new/dart-gen-bs/gen_app_peruk12_ent1.dart:29 · field count says "8 שדות" but this includes non-editable computed field; should be "7 שדות · 1 מחושב" to reflect actual form inputs · **P2 minor** · Update c1 label in content file or adjust field count logic.

./_police.md:20-24 · verdict NOT DONE with failures: byte_identical_others (changes leaked to unrelated files), field (0 fields detected), calc (0 computed fields detected) · **P1 task not done** · Original builder output did not complete the task; requires implementation of computation logic and field restructuring.

## Coverage

**Verified correct:**
- Spec file (peruk12.txt line 7) correctly declares the formula: `מחיר לקמ = מחיר / קילומטראז'`
- Content file (gen_app_peruk12_ent1_content.dart) correctly lists both field names (c14=קילומטראז, c17=מחיר לקמ)
- No Dart syntax errors in generated form code (parsing would succeed)
- No unmatched parens or null-safety violations that prevent compile

**Could not check (read-only audit):**
- Runtime behavior (whether form displays/saves correctly without _calc implementation)
- Whether CSV export would include/exclude computed field
- Whether other generated files (gen_app_peruk12_home.dart, reports, etc.) were updated
- Whether tests pass with current state (Flutter unavailable)

**Summary:** Task is NOT DONE. Three critical structural issues: (1) computed field is editable instead of calculated, (2) mileage field type is text not num, (3) computation logic completely missing. No compile-break detected, but feature will not work at runtime. Police report correctly identifies all three failures.
