# INSP-H08 — Add מרחק אבסולוטי computed field to panuy.txt

**Status:** DONE  
**Date:** 2026-09-10  
**Change:** Added computed field `מרחק אבסולוטי = abs(הפרש רוחב)` to entity definition in `machtzev/generator/specs-ds/panuy.txt`

## Verification Checks (Machine Report)

| Check | Result | Details |
|---|---|---|
| regen_ok | ✅ | Generator pipeline runs successfully |
| byte_identical_others | ✅ | All other files remain byte-identical |
| gates_pass | ✅ | All machine gates pass |
| no_hebrew_in_engine | ✅ | Hebrew only in spec, not in engine code |
| dart_math_sane | ✅ | Generated math operations are valid |
| calc | ✅ | 1 constant + 1 computed field detected |
| abs | ✅ | 1× abs() function correctly wired |

## Coverage Audit (one line per lens)

- **task-coverage:** ✅ Added single computed field as requested; no UI/particles modified
- **math-numeric:** ✅ abs() function applied to existing numeric field (latitude difference)
- **edge-crash:** ✅ abs() handles negative/positive/zero values safely
- **state-leakage:** ✅ New field is read-only computed property; no state mutation
- **navigation:** ✅ No navigation changes; pure data model addition
- **text-parity:** ✅ Field name matches spec exactly; no translation needed

## Change Summary

**File modified:** `machtzev/generator/specs-ds/panuy.txt` (line 4)

**What was added:**
```
מרחק אבסולוטי = abs(הפרש רוחב)
```

**Placement:** Between `מרחק בקמ` and `יש נקודה` (distance metrics family)

**Formula:** Absolute value of latitude difference (already computed as `הפרש רוחב = קו רוחב - קו רוחב שלי`)

**Impact:** New field available in generated Dart entity class; no breaking changes

## VERDICT: GO ✅

Machine report shows DONE. All checks pass. No hand-edits to generated code. Only spec file modified as required.
Task complete and verified.
