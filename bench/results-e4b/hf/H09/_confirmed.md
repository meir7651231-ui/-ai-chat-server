# ✅ VALIDATOR REPORT — H09 (סכום מעוגל)

## Verified Findings

### P1-PREFILL: Computed field can be prefilled, violating "הנוסחה היא המקור-היחיד"

**VERDICT: CONFIRMED**

**Evidence:** 
- `new/dart-gen-bs/gen_app_tasks_ent1.dart:37` · prefill loop does not exclude computed field
- Quoted: `widget.initial!.forEach((f, v) { final i = _labelsAll.indexOf(f); if (i >= 0 && v.trim().isNotEmpty) _v[i] = v; });`
- `_labelsAll` on line 33 includes computed field at index 3: `gen_app_tasks_ent1_c12` = `'סכום מעוגל'`
- When gen_app_tasks_root.dart copies a record (line shown in grep), it includes all fields: `{for (final e in r0.entries) if (!e.key.startsWith('__') && !const <String>[gen_app_tasks_root_c34].contains(e.key)) e.key: e.value}`
- Result: computed field value can be passed in widget.initial, set into _v[3], then silently discarded on save when formula recalculates (line 52: `gen_app_tasks_ent1_c12: (_m_round(...)).toStringAsFixed(2)`)

**Fix:** Exclude computed field from prefill by label check:  
Change line 37 from `if (i >= 0 && v.trim().isNotEmpty)` to `if (i >= 0 && !_labelsAll[i].contains('מעוגל') && v.trim().isNotEmpty)` in the widget.initial.forEach loop.

---

## Auditor Findings Review

### Three Blocked Files (REJECTED as FALSE-POSITIVE)

**Findings flagged in _audit-regression.md:**
- machtzev/generator/ship.mjs:1 · "protocol quarantine (likely intentional)" · P1 informational
- machtzev/generator/tighten-types.mjs:1 · same
- machtzev/one.mjs:1 · same

**Verdict: FALSE-POSITIVE** — These files are intentionally blocked per bench task protocol (blocking message: "🔒 BLOCKED by protocol: ... The only pipeline you may run is the machine: police-bench.mjs..."). Police report passed all checks including regen_ok, gates_pass, compiles with 0 errors. No defect.

---

## All Other Checks PASSED ✅

| check | result | notes |
|---|---|---|
| regen_ok | ✅ | Task regenerated with new computed field |
| byte_identical_others | ✅ | No side effects to other apps |
| no_orphans | ✅ | |
| gates_pass | ✅ | |
| no_hebrew_in_engine | ✅ | |
| dart_math_sane | ✅ | `.round()` is valid; `_m_round(num x) => x.round()` correct |
| compiles | ✅ | flutter analyze: 0 errors |
| calc | ✅ | consts=1 calc=1 · computed field properly segregated |
| round | ✅ | 1× instance of round() found and correct |

---

## FIX-LIST:

1. **P1-PREFILL** · new/dart-gen-bs/gen_app_tasks_ent1.dart:37 · exclude computed field from prefill: `if (i >= 0 && !_labelsAll[i].contains('מעוגל') && v.trim().isNotEmpty) _v[i] = v;` · This prevents "סכום מעוגל" from being prefilled from widget.initial, ensuring formula is sole source per spec.
