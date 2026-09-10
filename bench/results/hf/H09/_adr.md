# ADR: Add Computed Field "סכום מעוגל" (Rounded Amount)

## Context
The Task entity in tasks.txt currently has fields: מה (what), מועד (due), סכום (amount), הערה (note).
Need to add a new computed field "סכום מעוגל" (rounded amount) that rounds סכום to the nearest whole number using Math.round.

## Opening Question
**Q: What function should I use for rounding to the nearest whole number?**

**Assumed Answer**: 
- Check if `round` operation exists in ops-map.json → It does NOT exist
- `round2` exists but rounds to 2 decimal places (for money)
- Need to either:
  (A) Create a new `round` operation in ops-map.json and new atom
  (B) Use a formula syntax if it supports function calls like `round(סכום)`
  (C) Use arithmetic to simulate rounding (least desirable)

Based on examining render-ds.mjs compileFormula() and examples in panuy.txt, formulas can include function calls. Will try approach (B) first: specify the field as `סכום מעוגל = round(סכום)` and let the generator resolve it. If that fails, will create a new round atom.

## Decision
Add the field to tasks.txt as:
```
סכום מעוגל = round(סכום)
```

This follows the pattern: `fieldName = formula`

## Rationale
- Minimal change to existing spec format
- Formula compiler in render-ds.mjs (line 201) handles both arithmetic and function calls
- panuy.txt shows examples of function calls in formulas: `sqrt(field)`, `boqLineAmount(...)`
- If `round` is not recognized, machine report will fail and indicate need to register it

## Alternatives Rejected
1. Manual arithmetic formula like `סכום - (סכום % 1)` — inflexible, less readable
2. Create new atom immediately — premature; test simple formula first per protocol
3. Add to a separate spec — breaks cohesion with Task entity

## Consequences
- If successful: Rounded amount appears as read-only computed field in Task
- If `round` is not registered: Machine report will fail with indication of missing operation
- Generated Dart will include the computed field in form display and table display

## Verification
- Machine report must show no hand-edits in generated outputs
- Gates must pass
- Spec syntax must be valid (no parse errors)
- Dart compilation must succeed
