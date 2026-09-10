# Goal
Add a computed field `סכום כולל מעמ` (total with VAT) to the `משימה` (task) entity in tasks.txt, equal to `סכום * 1.18`.

## 10-Step Decomposition

1. **Verify spec language** — Confirm computed field syntax from SPEC-LANG.md (format: `name = formula`)
2. **Understand current state** — Read tasks.txt to see current משימה entity definition
3. **Search for similar fields** — Use search-record.mjs to check if סכום כולל מעמ or similar computed fields exist
4. **Add computed field** — Edit tasks.txt to add `סכום כולל מעמ = סכום * 1.18` to משימה entity
5. **Verify spec correctness** — Ensure syntax is valid per SPEC-LANG.md line 12 (formula syntax)
6. **Run spec validation** — Execute app-ds.mjs to regenerate and check for spec errors
7. **Verify Dart compilation** — Ensure generated Dart passes `flutter analyze` equivalent check
8. **Byte-verify outputs** — Confirm only tasks.txt changed, all other app files are byte-identical
9. **Write claims.json** — Document all verifications as claims with proof
10. **Run machine report** — Execute police-bench.mjs to validate all checks pass

## Assumptions
- The spec language allows computed fields with multiplication (line 12 mentions + - * / operators)
- The entity משימה needs no structural changes, only field addition
- סכום is already defined as a numeric field and can be used in the formula
