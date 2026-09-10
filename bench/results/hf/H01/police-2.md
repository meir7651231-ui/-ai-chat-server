# 🚔 police-bench — H01 (panuy) · signature da761d7e16e07b65

| check | result |
|---|---|
| regen_ok | ✅ |
| no_hand_edit | ✅ |
| byte_identical_others | ✅ |
| gates_pass | ✅ |
| no_hebrew_in_engine | ❌ |
| dart_math_sane | ✅ |
| sqrt | ✅ import=true fn=true method=false |
| sort_px | ✅ sortlines=1 |
| sort_ent (info) | ❌ sortlines=0 |

hebrew in engine: ? (entity.schema.find((f) => f.label.includes('km') || f.label.includes('בקמ')) || ‖ entity.schema.find((f) => /^(distance|מרחק).*km/.test(f.label)) ||

## claims vs machine
| claim | check | verdict |
|---|---|---|


## VERDICT: **NOT DONE** — missing: no_hebrew_in_engine
