# Plan: Add computed field סכום מעוגל to tasks

## Goal (1 line)
Add a computed field `סכום מעוגל` to the משימה entity that rounds the `סכום` field to the nearest whole number.

## Decomposition (≤10 steps)

1. **Read spec language** — understand computed field syntax ✓
2. **Read current tasks.txt** — identify entity and field structure ✓
3. **Search for related atoms** — check if similar patterns exist
4. **Compose the field line** — `סכום מעוגל = round(סכום)`
5. **Insert into tasks.txt** — add to משימה entity's field list
6. **Verify no syntax errors** — ensure spec is parseable
7. **Run machine report** — confirm byte-identity of other apps
8. **Check Dart compilation** — ensure generated code passes flutter analyze
9. **Audit coverage** — verify computed field works correctly
10. **Write final report** — document findings in claims.json

## Notes
- Computed field uses spec language (line 12 of SPEC-LANG.md)
- The `round()` function is listed as available
- Field should be added to the משימה entity after existing fields
- Must not break other apps (byte-identity check)
- Must not edit generated outputs (new/ directory)
