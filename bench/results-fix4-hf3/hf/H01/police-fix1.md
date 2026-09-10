# 🚔 police-bench — H01 (panuy) · signature 4be4bbdfa8b798ca

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
| sqrt | ✅ import=true fn=true method=false |
| sort_list | ✅ px1 |

compile: analyzer errors total=0 in-app=0

## claims vs machine
| claim | check | verdict |
|---|---|---|
| Table columns reordered to match spec [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה via particles.mjs fix (line 404) - nearest-first sort by מרחק בקמ עולה | sort_by_distance_ascending | UNVERIFIED |
| Distance field (c25) calculates sqrt(מרחק בריבוע) by inlining dependency formula in render-ds.mjs (fieldResolver), not reading uninitialized _v[10] - works for  | display_real_distance_km | UNVERIFIED |
| Spec uses standard [טבלה] columns / מיון: field עולה syntax from SPEC-LANG.md line 17 | spec_syntax_valid | UNVERIFIED |

## VERDICT: **DONE**
