# INSP-E15 — Add computed field סכום כולל מעמ to משימה entity

**Task:** Add a computed field `סכום כולל מעמ = סכום * 1.18` (total with VAT) to the task entity in machtzev/generator/specs-ds/tasks.txt.

**Status:** ✅ DONE

**Date:** 2026-09-11

## Scope of Changes

| File | Change |
|---|---|
| `machtzev/generator/specs-ds/tasks.txt` | Added computed field to משימה entity line 6 |
| `machtzev/LEARNINGS.md` | Added lesson L107 about computed fields in spec language |

## Execution Summary

1. **Read protocol & spec-lang reference** — Understood computed field syntax: `שם = <נוסחה>`
2. **Searched for examples** — Found patterns in panuy.txt (sqrt, arithmetic) and sechirut.txt (multiplication)
3. **Applied spec modification** — Added `סכום כולל מעמ = סכום * 1.18` as inline field in entity definition
4. **Regenerated app** — Ran `node machtzev/generator/app-ds.mjs --name tasks --skin` successfully
5. **Verified compilation** — Machine report confirms:
   - ✅ regen_ok: Regeneration successful
   - ✅ byte_identical_others: No other apps affected
   - ✅ no_orphans: No orphan files created
   - ✅ gates_pass: All gates pass
   - ✅ no_hebrew_in_engine: No Hebrew in engine logic
   - ✅ dart_math_sane: Math operations valid (Dart top-level functions)
   - ✅ compiles: Flutter analyze produced 0 errors
   - ✅ calc: Counter increased (consts=1, calc=1)
6. **Documented lesson** — Added L107 to LEARNINGS.md with rule about computed fields being spec-level, not hand-edited

## Quality Checks

| Check | Result | Evidence |
|---|---|---|
| **task-coverage** | ✅ | Computed field added to משימה entity; formula is multiplication (סכום * 1.18) |
| **money-numeric** | ✅ | Multiplicand 1.18 is correct (118% = 100% + 18% VAT); סכום is number type |
| **edge-crash** | ✅ | Division by zero impossible; multiplication always safe; null סכום handled by engine |
| **state-leakage** | ✅ | Computed field is read-only; no state mutation; pure formula evaluation |
| **navigation** | ✅ | No navigation changes; spec-level change only |
| **text-parity** | ✅ | Hebrew field names match spec exactly; no UI strings added |

## Machine Report Excerpt

```
| check | result |
|---|---|
| regen_ok | ✅ |
| byte_identical_others | ✅ |
| no_orphans | ✅ |
| gates_pass | ✅ |
| no_hebrew_in_engine | ✅ |
| dart_math_sane | ✅ |
| compiles | ✅ |
| calc | ✅ consts=1 calc=1 |

## VERDICT: **DONE**
```

## VERDICT: **GO**

All checks pass. The computed field is correctly defined at the spec level, the generator successfully emits Dart code with the formula, all gates pass, and no other applications are affected.
