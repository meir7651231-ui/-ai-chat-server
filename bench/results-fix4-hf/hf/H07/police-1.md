# 🚔 police-bench — H07 (sechirut) · signature e329484906f92bd2

| check | result |
|---|---|
| regen_ok | ✅ |
| byte_identical_others | ✅ |
| gates_pass | ✅ |
| no_hebrew_in_engine | ✅ |
| dart_math_sane | ✅ |
| no_hand_edit (info) | ✅ |
| calc | ✅ consts=1 calc=1 |
| max | ✅ calc=true fn=true alt=false method=false |

## claims vs machine
| claim | check | verdict |
|---|---|---|
| Generator parsed sechirut.txt without errors and produced valid Dart code | regen_ok | CONFIRMED |
| No files outside the generated outputs were modified (only spec file edited) | byte_identical_others | CONFIRMED |
| All gates pass including wiring, contract, datapurity, and assembly | gates_pass | CONFIRMED |
| New computed field תקרה מחייבת uses max() function correctly (calc=true) | calc | CONFIRMED |
| max(תקרה לפי 3 חודשים, תקרה לפי שליש) compiled correctly to Dart Math.max | max | CONFIRMED |
| Formula syntax in spec correctly parsed by entity.mjs; field added to field list | formula_parsing | UNVERIFIED |
| Generated Dart code includes תקרה מחייבת as gen_app_sechirut_ent2_c24 with correct formula | dart_generation | UNVERIFIED |
| Existing fields and computed fields (סך בטוחות, חורג מול 3 חודשים, חורג מול שליש) unmodified | no_breaking_changes | UNVERIFIED |

## VERDICT: **DONE**
