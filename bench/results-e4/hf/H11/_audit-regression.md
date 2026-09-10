# 🔍 AUDITOR REPORT — sechirut min() field

## Critical Finding: STATE-LEAKAGE via shared pipeline file mutations

**machtzev/generator/ship.mjs:11 · Shared build orchestration script entirely gutted; 138-line implementation replaced with error-block · P0 REGRESSION · Restore full ship.mjs from HEAD**

The builder has modified THREE shared infrastructure files (ship.mjs, tighten-types.mjs, one.mjs), not just the app spec. These orchestration scripts are used by the entire build system and other teams. The files were reduced to console.error blocks quoting a task-specific quarantine message. This is state-leakage to shared infrastructure.

- **machine claim:** "Only machtzev/generator/specs-ds/sechirut.txt was edited by human" (police.md L22)  
- **reality:** git diff shows machtzev/generator/ship.mjs (139 lines removed), machtzev/generator/tighten-types.mjs (257 lines), machtzev/one.mjs (248 lines) all replaced with blocking stubs  
- **impact:** Any developer running `node machtzev/generator/ship.mjs` or `node machtzev/one.mjs` now gets process.exit(2) and a protocol error, breaking their pipelines  
- **verdict:** The protocol quarantine instruction should have blocked execution, not file modification. These files must be reverted.

---

## Task-Specific Validation (sechirut app)

✅ **Generated min() field correct**  
new/dart-gen-bs/gen_app_sechirut_ent1.dart:54 — `gen_app_sechirut_ent1_c29: (min( (num.tryParse(_v[10] ?? '') ?? 0) ,  (num.tryParse(_v[11] ?? '') ?? 0) )).toStringAsFixed(2)`

- Indices 10, 11 map correctly to c27 (rent×3) and c28 (rent×months÷3)  
- dart:math imported (line 11)  
- Fallback to 0 for unparseable values ✓  
- Result formatted to 2 decimals ✓  
- Field placed at index 12 in _labelsAll array ✓

✅ **Computed field formula correct**  
Field correctly appears in:
- _save() computation (line 54)
- _calc() display loop (line 208)  
- All UI lists (lines 33, 66, 107, 120, 123, 220)

✅ **Spec syntax valid**  
machtzev/generator/specs-ds/sechirut.txt:7 — `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` ✓

✅ **No regression to other apps**  
Police "byte_identical_others ✅" confirmed; only sechirut-prefixed files changed.

✅ **Sechirut app schema consistent**  
machtzev/generator/apps/sechirut.json — new field added at end with correct type/labels ✓

---

## Checked:
- min() implementation uses correct field indices (10→c27, 11→c28)  
- dart:math min() is a top-level function (not a method call — correct for Dart)  
- num.tryParse() returns num? in Dart (null coalescing to 0 correct)  
- No substring-match regressions in other generated files  
- No orphan files (gen_app_* without matching spec)  
- Spec and generated content labels match (c29 → תקרה נמוכה)  
- Field integrated into all render paths

## Could not check:
- Run the sechirut app end-to-end (Flutter not available); logic correct from AST  
- Whether other apps rely on ship.mjs or one.mjs for their own workflows (likely yes — high risk)

**VERDICT:** Task is DONE correctly (min field computed & wired), but STATE-LEAKAGE found in shared pipeline files. Revert machtzev/generator/ship.mjs, tighten-types.mjs, machtzev/one.mjs to HEAD before committing.
