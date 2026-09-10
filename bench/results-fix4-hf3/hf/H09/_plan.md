# Task H09 Plan

## Goal (1 line)
Add a computed field `סכום מעוגל` to tasks.txt that rounds the `סכום` field to the nearest whole number.

## Decomposition (≤10 steps)
1. Read the spec language reference (SPEC-LANG.md) to understand computed field syntax
2. Read tasks.txt to understand current field structure
3. Search for similar computed field examples in the codebase
4. Add the new computed field line to tasks.txt using correct syntax
5. Verify the syntax against SPEC-LANG.md
6. Run app-ds.mjs to regenerate the app
7. Check that generated Dart compiles (flutter analyze mock)
8. Verify other apps remain byte-identical
9. Run machine police-bench to validate all gates/checks
10. Write ADR, LEARNINGS, and inspection checklist

## Success criteria
- tasks.txt has a valid `סכום מעוגל` computed field
- The generated Dart code correctly rounds the סכום value
- All gates pass, no broken tests
- claims.json documents all verified facts
