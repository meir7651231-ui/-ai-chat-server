# Plan: Add sorting to משימה particle table by מועד

## Goal (1 line)
Sort the table rows by "מועד" field (due date), soonest first, in the particle generator.

## 10-Step Decomposition

1. **Understand data shape**: Confirm מועד field is in tasks.txt schema and is a date/string type
2. **Locate sort point**: Line 385-389 in particles.mjs builds the table rows without sorting
3. **Find field index**: Determine which position מועד appears in entity.schema (likely 2nd after מה)
4. **Implement sort**: Modify line 387 `rows` generation to sort records before iteration
5. **Test generation**: Run app-ds to regenerate tasks particle and check Dart output
6. **Verify bytes**: Confirm no hand-edits in generated files (new/dart-gen-bs, new/dart-data-bs, new/dart-forge-bs)
7. **Check gates**: Run gates on particles to ensure no new violations
8. **Update claims.json**: Record what was changed and proof (byte-identical verification)
9. **Write LEARNINGS.md**: Add lesson about particle table sorting
10. **Run final police**: Execute machine report to confirm DONE

## Implementation Point
Fix is in layer 3 (engine, not spec or generated output):
- File: `machtzev/generator/particles.mjs`
- Section: `particleWidgets()` function, table shape handling (lines 385-389)
- Change: Add `.sort()` to `recs` before building rows, keyed by מועד field position
