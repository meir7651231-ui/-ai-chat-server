# Auditor Report: sechirut counter for מתווך=כן

## Findings

new/dart-gen-bs/gen_app_sechirut_px1.dart:35 · particle filter accesses wrong field name · P0 (compile-break) · Replace `gen_app_sechirut_px1_c8` with `gen_app_sechirut_px1_c19` in the where() clause filter argument. Currently reads `(r[gen_app_sechirut_px1_c8] ?? '') == gen_app_sechirut_px1_c9` where c8='תיק מתווך' (entity-field concatenation), should use c19='מתווך' (field name only), causing the filter to search for a non-existent field and return zero.

new/dart-data-bs/auto/gen_app_sechirut_scr5_content.dart:31-32 · dashboard metric labels wrong · P1 (wrong result) · Change c29 from `'כן'` to `'עם מתווך'` and c30 from `'תיק · כן'` to `'תיק · עם מתווך'`. Currently the dashboard shows "כן" (yes) as the metric label instead of the particle name "עם מתווך", confusing users about what is being counted.

## Verified Correct

✓ **spec-to-particle generation**: sechirut.txt line 22 particle definition added correctly to particle-plan-sechirut.json (shape=count, expr=מונה(תיק: מתווך=כן), wired to headline⇒KpiTile).

✓ **px1_content labels**: gen_app_sechirut_px1_content.dart has correct particle label in c6='עם מתווך' and correct expression in c11='מונה(תיק: מתווך=כן)'.

✓ **dashboard integration**: Dashboard spec-line 11 includes the new counter in לוח בקרה definition. Dashboard screen (gen_app_sechirut_scr5.dart line 25) correctly instantiates the KvLine counter with correct entity ('app_sechirut_ent1'), correct field name via c33='מתווך', correct filter value c34='כן'. Chart data on line 27 includes the new metric in values array.

✓ **hub navigation**: gen_app_sechirut_hub.dart correctly navigates to Px1Screen and Scr5Screen. Content constants in hub_content.dart correctly state '7 מדדים' for dashboard.

⚠️  **Null-safety review**: Field accesses use `(r[fieldName] ?? '')` pattern which is safe for missing fields. However, if the field name itself is malformed (as in finding 1), it will always return empty string. No crash risk from type mismatch since comparison is string-to-string.

## Coverage

**Checked**: Dart code generation for particles (px1) and dashboard (scr5) — field access patterns, content string alignment, entity/field references, KvLine instantiation, ForgeWaveformBars chart data inclusion. Read spec→content→generated Dart flow for מתווך counter.

**Did not check**: buildsmart compilation/flutter analyze (no Dart compiler available); runtime behavior with actual data; Android/iOS platform differences.
