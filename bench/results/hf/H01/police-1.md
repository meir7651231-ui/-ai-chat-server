# 🚔 police-bench — H01 (panuy) · signature 7be41ebdaed6a8ac

| check | result |
|---|---|
| regen_ok | ✅ |
| no_hand_edit | ❌ |
| byte_identical_others | ❌ |
| gates_pass | ✅ |
| no_hebrew_in_engine | ❌ |
| dart_math_sane | ✅ |
| sqrt | ❌ import=false fn=false method=false |
| sort_px | ✅ sortlines=1 |
| sort_ent (info) | ❌ sortlines=0 |

changed outside panuy: dart-data-bs/auto/gen_app_peruk02_px1_content.dart, dart-data-bs/auto/gen_app_peruk10_px1_content.dart, dart-data-bs/auto/gen_app_peruk12_px1_content.dart, dart-data-bs/auto/gen_app_peruk28_px1_content.dart, dart-gen-bs/gen_app_peruk02_px1.dart, dart-gen-bs/gen_app_peruk10_px1.dart, dart-gen-bs/gen_app_peruk12_px1.dart, dart-gen-bs/gen_app_peruk28_px1.dart

hebrew in engine: const sortField = entity.schema.find((f) => /^(מרחק|distance)/.test(f.label.toLowerCase())) || ‖ entity.schema.find((f) => !f.formula && /^(price|amount|count|num|percent|שעה)$/.test(f.type || ''))

## claims vs machine
| claim | check | verdict |
|---|---|---|


## VERDICT: **NOT DONE** — missing: no_hand_edit, byte_identical_others, no_hebrew_in_engine, sqrt
