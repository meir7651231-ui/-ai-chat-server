# Plan: Add computed field סכום מעוגל to tasks.txt

## Goal
Add a computed field `סכום מעוגל` (rounded amount) to the tasks entity in machtzev/generator/specs-ds/tasks.txt. This field should round the `סכום` (amount) field to the nearest whole number using the round() function, and not break any existing functionality.

## Decomposition (10 steps)

1. **Read the spec file** - Understand current tasks.txt structure
2. **Read spec-lang reference** - Understand computed field syntax
3. **Verify סכום field exists and is numeric** - Ensure we can reference it
4. **Plan the addition** - Determine exact line to add
5. **Add the computed field** - Insert `סכום מעוגל = round(סכום)` to ישות משימה definition
6. **Verify syntax correctness** - Check the spec-lang syntax
7. **Regenerate the app** - Run app-ds.mjs with --name tasks
8. **Check Dart compile** - Run the machine verification to ensure no errors
9. **Verify no other apps broke** - Use machine check for byte_identical_others
10. **Document findings** - Write final claims.json

## Key files
- `machtzev/generator/specs-ds/tasks.txt` - The spec to modify
- `machtzev/generator/specs-ds/SPEC-LANG.md` - Spec language reference (line 12)
- Computed field syntax: `שם = <נוסחה>` with round() function support

## Verification strategy
- Use machine verification tool to check:
  - No syntax errors in generated Dart
  - Other apps remain byte-identical
  - All gates pass
  - No hand-edits in new/ directory
