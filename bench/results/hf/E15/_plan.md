# E15 Plan: Add סכום כולל מעמ Computed Field

## Goal (One Line)
Add a computed field `סכום כולל מעמ` to the task entity that equals `סכום` × 1.18 (VAT inclusive), without breaking any existing functionality.

## 10-Step Decomposition

1. **Search for similar patterns:** Grep the generator code and other specs to find how computed fields are defined in the spec language.
2. **Identify spec syntax:** Confirm the formula syntax (likely `fieldName = expression`).
3. **Verify no duplicates:** Check the task entity doesn't already have a VAT-related field.
4. **Edit spec file:** Add the field declaration to `tasks.txt` in the correct format.
5. **Run generator:** Execute `node machtzev/one.mjs` (or equivalent) to regenerate outputs.
6. **Byte-verify new files:** Compare generated files against machine-reported baseline; confirm no unintended changes.
7. **Check test suite:** Run `flutter test` if applicable, or verify no new errors in `flutter analyze`.
8. **Audit for edge cases:** Confirm computed field renders correctly when `סכום` is null, zero, or negative.
9. **Register claim:** Write findings to `claims.json` with check IDs from machine report.
10. **Final machine report:** Run `police-bench.mjs --task E15 --claims ./claims.json` → expect DONE.

## Key Files
- **Source (edit):** `machtzev/generator/specs-ds/tasks.txt`
- **Verification:** `police-bench.mjs --task E15` report
- **Record:** `claims.json` (only after machine run confirms success)
