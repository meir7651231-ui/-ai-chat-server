# Task: Sort cases table by price (מחיר) — cheapest first, numeric

## Goal
Make the cases table in peruk12.txt sorted by price field (מחיר), lowest-to-highest, using numeric comparison.

## 10-Step Decomposition
1. Read peruk12.txt spec (DONE — shows line 10: `חלקיק תיק: [טבלה]`)
2. Read SPEC-LANG.md to understand sorting syntax (DONE — line 17 shows `מיון: <שדה>` syntax)
3. Search codebase for existing sorting patterns in specs-ds/*.txt
4. Locate the table particle definition for תיק entity
5. Identify the price field name (מחיר)
6. Add sorting clause to table particle: `[טבלה] … | מיון: מחיר מהנמוך`
7. Verify spec syntax is correct
8. Run machine police report to check:
   - no hand edits in new/
   - byte-identical for other apps
   - compiles (Dart analyze passes)
9. Audit through safety lenses in _insp.md
10. Write claims.json with proven findings

## Key Points
- Sorting syntax: `מיון: <שדה> עולה/מהנמוך` (ascending) or `יורד/מהגבוה` (descending)
- "Cheapest first" = ascending order = מהנמוך (from-low)
- Numeric sorting is built into the generator (must verify in engine)
- Only modify peruk12.txt spec, not the engine itself
