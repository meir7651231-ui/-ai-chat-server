# Plan: Add Priority Field to תיק Entity

## Goal
Add a priority field `עדיפות` with closed-choice values `{גבוהה|בינונית|נמוכה}` to the תיק entity in peruk02.txt without breaking existing functionality.

## Decomposition (10 steps)

1. **Search for similar patterns** — Use search-record.mjs to find how choice fields are defined in existing specs
2. **Locate insertion point** — Identify where in the entity definition line to add the new field
3. **Understand the grammar** — Verify the closed-choice syntax `{value|value|...}` by examining existing examples
4. **Add the field** — Insert `עדיפות{גבוהה|בינונית|נמוכה}` into the entity definition
5. **Verify syntax** — Ensure the line remains valid according to the spec language grammar
6. **Check for breaking changes** — Scan for any hard-coded references that might assume the exact field set
7. **Write lesson entry** — Document what was learned about the spec language in LEARNINGS.md
8. **Run audit checklist** — Verify task coverage (entity, particles, dohot) in _insp.md
9. **Run machine report** — Execute the bench police to verify no hand-edits, byte-integrity, gates pass, etc.
10. **Document verification** — Write VERDICT to claims.json with proven status

## Expected Changes
- File: machtzev/generator/specs-ds/peruk02.txt (1 line edit)
- Generated outputs will include the new field in entity schema
- No layer-2/3 changes needed (engine should auto-detect from spec)
