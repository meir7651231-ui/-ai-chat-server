# 🚔 police-bench — M10 (calendar) · signature 5f5e2f1efe86041d

| check | result |
|---|---|
| regen_ok | ✅ |
| byte_identical_others | ✅ |
| no_orphans | ✅ |
| gates_pass | ✅ |
| no_hebrew_in_engine | ✅ |
| dart_math_sane | ✅ |
| compiles | ✅ |
| no_hand_edit (info) | ❌ |
| field | ✅ 1× |
| calc | ✅ consts=1 calc=1 |

compile: analyzer errors total=0 in-app=0

## claims vs machine
| claim | check | verdict |
|---|---|---|
| Generator successfully parsed calendar.txt with new numeric field and computed field with division | regen_ok | CONFIRMED |
| All generated files in new/dart-gen-bs and new/dart-data-bs produced by app-ds.mjs engine only | no_hand_edit | FALSE |
| Division operator correct in formula; num.tryParse() for type conversion; toStringAsFixed(2) formatting | dart_math_sane | CONFIRMED |
| First field recognized as numeric via type keyword in spec-lang.data.json | field_type_numeric | UNVERIFIED |
| String constants verified with Hebrew field names in generated dart-data-bs | field_name_hebrew | UNVERIFIED |
| Generated code at line 51: (num.tryParse / 60).toStringAsFixed(2) implements correct division formula | computed_formula_correct | UNVERIFIED |

## VERDICT: **DONE**
