# Plan: Add computed field סכום כולל מעמ to משימה entity

## Goal (1 line)
Add a computed field `סכום כולל מעמ = סכום * 1.18` to the task entity in tasks.txt spec file.

## 10-step decomposition

1. **Read spec-lang reference** → Understand computed field syntax from SPEC-LANG.md
2. **Inspect current tasks.txt** → See current משימה definition (already done)
3. **Search for similar computed fields** → Find examples in other specs (if any)
4. **Plan spec modification** → Determine exact syntax and placement
5. **Edit tasks.txt** → Add the computed field to the משימה entity line
6. **Verify spec syntax** → Ensure it matches SPEC-LANG.md grammar
7. **Run generator** → Execute app-ds.mjs to regenerate (with --name tasks)
8. **Check generated output** → Verify Dart code includes the computed field
9. **Run machine report** → Verify all gates pass and no byte-identical violations
10. **Write lessons & INSP report** → Document findings and conclude

## Fixed aspects
- **Where:** tasks.txt line 6 (משימה entity definition)
- **What:** Add computed field to existing entity (not create new field type)
- **Language:** Use spec-lang formula syntax: `סכום כולל מעמ = סכום * 1.18`
- **Scope:** tasks.txt only; other specs must remain byte-identical
