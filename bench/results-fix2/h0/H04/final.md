# 🚔 police-bench — H04 (calendar) · signature 6ecd392de36dbfa3

| check | result |
|---|---|
| regen_ok | ✅ |
| byte_identical_others | ❌ |
| gates_pass | ✅ |
| no_hebrew_in_engine | ❌ |
| dart_math_sane | ✅ |
| no_hand_edit (info) | ❌ |
| sort_both | ✅ ent1 |

changed outside calendar: dart-gen-bs/gen_app_panuy_ent1.dart, dart-gen-bs/gen_app_peruk01_ent1.dart, dart-gen-bs/gen_app_peruk01_ent2.dart, dart-gen-bs/gen_app_peruk02_ent1.dart, dart-gen-bs/gen_app_peruk02_ent2.dart, dart-gen-bs/gen_app_peruk03_ent1.dart, dart-gen-bs/gen_app_peruk04_ent1.dart, dart-gen-bs/gen_app_peruk04_ent2.dart

hebrew in engine: if (s.label === 'מועד') dateFieldConst = cl; ‖ if (s.label === 'שעה') timeFieldConst = cl;

## claims vs machine
| claim | check | verdict |
|---|---|---|


## VERDICT: **NOT DONE** — missing: byte_identical_others, no_hebrew_in_engine
