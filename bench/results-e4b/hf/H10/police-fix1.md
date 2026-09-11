# 🚔 police-bench — H10 (calendar) · signature 643e322af2961935

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
| sort_list | ✅ ent1,px1 |
| sort_second_surface (info) | ✅ px1 |

compile: analyzer errors total=0 in-app=0

## claims vs machine
| claim | check | verdict |
|---|---|---|
| Calendar app regenerated from spec without errors | regen_ok | CONFIRMED |
| Only spec file (calendar.txt) modified; no generated code edited manually | no_hand_edit | CONFIRMED |
| Entity list sorting by time implemented: gen_app_calendar_ent1.dart:157 sorts by time field | sorting_entity_list | UNVERIFIED |
| Particle table sorting by time implemented: gen_app_calendar_px1.dart:18 sorts by time field | sorting_particle_table | UNVERIFIED |
| All Hebrew text in spec and data files; no hardcoded Hebrew in generator | no_hebrew_in_engine | CONFIRMED |
| Sorting uses String.compareTo() and num.compareTo(); no complex math | dart_math_sane | CONFIRMED |

## VERDICT: **DONE**
