# 🚔 police-bench — H06 (peruk12) · signature 72db303b4bcf98d2

| check | result |
|---|---|
| regen_ok | ✅ |
| byte_identical_others | ✅ |
| gates_pass | ✅ |
| no_hebrew_in_engine | ❌ |
| dart_math_sane | ✅ |
| no_hand_edit (info) | ✅ |
| sort | ✅ sortlines=1 |
| numeric | ✅ 2× |

hebrew in engine: const stemOf = (w) => w.replace(/^[בלהומשכ](?=..)/, '').replace(/(יות|ים|ות|ה)$/, '');

## claims vs machine
| claim | check | verdict |
|---|---|---|


## VERDICT: **NOT DONE** — missing: no_hebrew_in_engine
