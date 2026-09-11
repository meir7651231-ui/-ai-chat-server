# 🚔 police-bench — H07 (sechirut) · signature 1acfb98b49bc5c36

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
| calc | ✅ consts=1 calc=1 |
| max | ✅ calc=true fn=true alt=false method=false |

compile: analyzer errors total=0 in-app=0

## claims vs machine
| claim | check | verdict |
|---|---|---|
| Spec parses and generator completes without syntax errors for sechirut app | regen_ok | CONFIRMED |
| Generated Dart files in new/dart-gen-bs and new/dart-data-bs contain only auto-generated code, no manual edits | no_hand_edit | CONFIRMED |
| All apps except sechirut remain byte-identical; only sechirut entity 2 (בטוחה) files modified | byte_identical_others | CONFIRMED |
| Generated Dart max() function calls are valid syntax: max((num.tryParse(...) ?? 0), (num.tryParse(...) ?? 0)) with .toStringAsFixed(2) | compiles | CONFIRMED |
| Hebrew words (תקרה מחייבת) appear only in spec file and spec-lang data, not in engine logic (.mjs files) | no_hebrew_in_engine | CONFIRMED |
| max() is called as builtin Dart function with two numeric arguments, both safely parsed with ?? 0 fallback | dart_math_sane | CONFIRMED |
| Computed field formula max(תקרה לפי 3 חודשים, תקרה לפי שליש) correctly maps to max() of field indices [6] and [7] in generated code | formula_correct | UNVERIFIED |

## VERDICT: **DONE**
