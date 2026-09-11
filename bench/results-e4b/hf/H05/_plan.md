# Task Plan: Sort cases table by key-handover date

## Goal
In the app generated from peruk02.txt, make the cases (תיק) table sorted by תאריך מסירת מפתח, earliest first.

## Decomposition (10 steps)

1. Read peruk02.txt spec to understand current table particle definition
2. Read SPEC-LANG.md to understand table sorting syntax
3. Check that תאריך מסירת מפתח is a field of תיק entity
4. Record the search for sorting functionality with `search-record.mjs`
5. Modify line 10 of peruk02.txt to add sorting specification
6. Regenerate the app with `app-ds.mjs`
7. Verify generated output files are correct (byte-check other apps)
8. Run police checks to ensure no compilation errors
9. Write claims.json with verification
10. Run machine's police-bench.mjs to verify task completion

## Key constraints
- Fix in spec first (SPEC-LANG allows sorting syntax)
- Don't break other apps (byte-identical check)
- Regenerate only peruk02 with --name flag to avoid orphans
- Verify via bytes, not prose
- No hand-edits to generated files
