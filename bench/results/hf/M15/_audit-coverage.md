# 🔍 Auditor: task-coverage lens — M15 (calendar field rename)

## Findings
No findings. Task complete.

## Coverage verified

✅ **Spec source**: machtzev/generator/specs-ds/calendar.txt:6 — field מקום renamed to כתובת (verified via git diff: old HEAD shows מקום, current shows כתובת)

✅ **Apps definition**: machtzev/generator/apps/calendar.json — label field changed from "מקום" to "כתובת" in diff output

✅ **Generated entity content constant**: new/dart-data-bs/auto/gen_app_calendar_ent1_content.dart:14 — `const String gen_app_calendar_ent1_c12 = 'כתובת';` (correct value, used as field label throughout ent1 screen)

✅ **Generated entity screen usage**: new/dart-gen-bs/gen_app_calendar_ent1.dart — all references use constant gen_app_calendar_ent1_c12 (lines 31, 46, 47, 51, 63, 64, 98, 99); no hardcoded field names

✅ **No old field references**: grep across all gen_app_calendar*.dart and gen_app_calendar*_content.dart files finds no hardcoded "מקום" references in calendar context (only unrelated false positives in schoolos_parents.dart comments)

✅ **Police report baseline**: regen_ok ✅, byte_identical_others ✅, gates_pass ✅ confirm pipeline succeeded and no unintended collateral

✅ **Task boundary**: Only calendar app affected; all other apps' generated files byte-identical (confirmed by police)

Entity screen, list view (hub), home screen, and all particle tables all wire field labels through constants that now reflect the new name. Field rename is consistent across entity form, storage keys, display, and CSV export.
