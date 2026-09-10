# Task: Add numeric and computed fields to תיק entity in peruk25.txt

## Goal
Add two fields to תיק entity: numeric field `סכום פיצויים` and computed field `פיצויים לשנה = סכום פיצויים * 12`

## 10-Step Decomposition
1. Read SPEC-LANG.md to understand field syntax ✓
2. Examine current peruk25.txt entity definition ✓
3. Review examples of numeric and computed fields (sechirut.txt, panuy.txt) ✓
4. Search existing codebase for סכום פיצויים / פיצויים לשנה patterns
5. Add numeric field סכום פיצויים to תיק entity definition
6. Add computed field פיצויים לשנה to תיק entity definition
7. Run spec-lang validation (if exists)
8. Regenerate app using app-ds.mjs with --name peruk25 --skin
9. Verify byte-identical for other apps (no breaking changes)
10. Run machine check and collect claims

## Key Syntax
- Numeric field: `סכום פיצויים` (keyword "סכום" = number type)
- Computed field: `פיצויים לשנה = סכום פיצויים * 12`
- Line 6 of peruk25.txt contains entity definition; add fields before `| שלבים`
