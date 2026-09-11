# 🚔 police-bench — E09 (peruk25) · signature bf1280c01275c6ca

| check | result |
|---|---|
| regen_ok | ✅ |
| byte_identical_others | ✅ |
| no_orphans | ✅ |
| gates_pass | ✅ |
| no_hebrew_in_engine | ✅ |
| dart_math_sane | ✅ |
| compiles | ✅ |
| no_hand_edit (info) | ✅ |
| field | ✅ 1× |
| calc | ✅ consts=1 calc=1 |

compile: analyzer errors total=0 in-app=0

## claims vs machine
| claim | check | verdict |
|---|---|---|
| סכום פיצויים numeric field added to תיק entity and generated as gen_app_peruk25_ent1_c19 | field | CONFIRMED |
| פיצויים לשנה computed field correctly calculates סכום פיצויים * 12 with formula ((num.tryParse(_v[6] ?? '') ?? 0) * 12).toStringAsFixed(2) | calc | CONFIRMED |
| App regenerated successfully with node app-ds.mjs --name peruk25 | regen_ok | CONFIRMED |
| All other 27 peruk apps remain byte-identical | byte_identical_others | CONFIRMED |
| Dart compilation passes with 0 analyzer errors in generated Dart code | compiles | CONFIRMED |

## VERDICT: **DONE**
