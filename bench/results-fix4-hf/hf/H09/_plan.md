# Plan: Add סכום מעוגל Computed Field

**Goal:** Add a computed field `סכום מעוגל` to the משימה entity that rounds the `סכום` amount to the nearest whole number.

## 10-Step Decomposition

1. **Verify spec syntax** — Read SPEC-LANG.md to understand computed field syntax (✅ `name = round(field)`)
2. **Search existing Hebrew words** — Run search-record.mjs to verify "סכום מעוגל" hasn't been used, or find existing usage
3. **Analyze current tasks.txt** — Confirm the entity structure and field positioning
4. **Compose the new field line** — Add `סכום מעוגל = round(סכום)` to the ישות line
5. **Edit tasks.txt** — Insert the computed field after סכום field (before הערה)
6. **Run generator** — Execute the machine report to verify no syntax errors
7. **Check output** — Verify the generated Dart code includes the rounded field
8. **Verify gates pass** — Run full police check to ensure no regressions
9. **Document in LEARNINGS** — Record the lesson about computed fields
10. **Commit changes** — Stage and commit with proper attribution

## Current State
- File: `machtzev/generator/specs-ds/tasks.txt` (line 6: entity definition)
- Target: Add computed field after סכום, before הערה
- No changes to generated outputs (new/ directories)

## Key Constraints
- Only edit the spec file, never touch generated outputs
- Computed field syntax: `name = formula` with functions: round, floor, ceil, min, max, sqrt, pow, abs
- Must pass all gates before commit
