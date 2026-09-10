# 🚔 police-bench — H10 (calendar) · signature 11b1f3b2835ee33d

| check | result |
|---|---|
| regen_ok | ✅ |
| byte_identical_others | ❌ |
| gates_pass | ✅ |
| no_hebrew_in_engine | ❌ |
| dart_math_sane | ✅ |
| no_hand_edit (info) | ❌ |
| sort_list | ✅ ent1,px1 |
| sort_second_surface (info) | ✅ px1 |

changed outside calendar: dart-data-bs/auto/gen_app_panuy_px1_content.dart, dart-gen-bs/gen_app_panuy_ent1.dart, dart-gen-bs/gen_app_panuy_px1.dart, dart-gen-bs/gen_app_peruk01_ent1.dart, dart-gen-bs/gen_app_peruk01_ent2.dart, dart-gen-bs/gen_app_peruk02_ent1.dart, dart-gen-bs/gen_app_peruk02_ent2.dart, dart-gen-bs/gen_app_peruk03_ent1.dart

hebrew in engine: const timeField = schema.find((f) => /שעה|זמן|hour|time/i.test(f.label)); ‖ if (/שעה|זמן|hour|time/i.test(s.label) && timeFieldConst === null) { timeFieldConst = cl; }

## claims vs machine
| claim | check | verdict |
|---|---|---|


## VERDICT: **NOT DONE** — missing: byte_identical_others, no_hebrew_in_engine
