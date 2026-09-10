# Audit Coverage: Calendar Task (M10)

## Findings

machtzev/generator/apps/calendar.json:63 · Field "משך בדקות" declared as type "text" but task requires numeric field; will silently coerce non-numeric input to 0 in compute formula (line 51 of gen_app_calendar_ent1.dart: `num.tryParse(_v[5] ?? '') ?? 0`)  · P1 wrong result · Change `"type": "text"` to `"type": "num"` for consistency with the division formula and task requirement

## Verified Correct

✅ **Spec modification**: calendar.txt line 6 correctly updated to add both fields with proper syntax: `משך בדקות, משך בשעות = משך בדקות / 60`

✅ **Computed field formula**: gen_app_calendar_ent1_content.dart c14/c15 labels correct; gen_app_calendar_ent1.dart:51 formula `((num.tryParse(_v[5] ?? '') ?? 0) / 60).toStringAsFixed(2)` is valid Dart arithmetic

✅ **Field count and structure**: 7 total fields (5 original + 2 new) correctly reflected in content (line 3); _labelsAll has 7 entries (indices 0-6); data mapping correct across _save/_edit/_card/_csv

✅ **Computed field type**: gen_app_calendar_ent1.json shows type "num" for משך בשעות (line 64 of diff output)

✅ **Required fields**: Only orig required fields (מה, מועד) marked required; new fields correctly set `required: false` per spec (no * modifier on new fields)

✅ **No side effects**: All other app specs (tasks.txt, balagan.txt, etc.) byte-identical; no orphan files; all 53 gates pass; compile 0 errors

✅ **UI surface coverage**: Rendered in entity form (ent1.dart), list view (_card), table/CSV export, all record stages. No missing display surface.

**Coverage note**: Read-only audit only. Checked: spec syntax, field labels in content file, formula arithmetic, data type consistency in Dart, field mappings in form/card/export, test of surface inclusion. Cannot verify: runtime parsing behavior (requires actual input), end-to-end form submission (requires running app), UI field rendering widget selection (is 'text' input widget numerically constrained?).
