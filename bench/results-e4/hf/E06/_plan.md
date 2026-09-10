# Plan: Add action button "שלח תזכורת" to case screen

## Goal
Add an action button labeled "שלח תזכורת" (Send reminder) to the particle screen of תיק (case).

## 10-Step Decomposition
1. ✅ Read SPEC-LANG.md to understand particle syntax
2. ✅ Read current peruk17.txt to see existing particles
3. Verify the action particle syntax for buttons (`[פעולה] <label>`)
4. Add new particle line to peruk17.txt for the reminder button
5. Verify spec syntax is correct (no typos, proper format)
6. Run machine check (police-bench.mjs) to verify spec compiles
7. Check that generated Dart contains the new button
8. Verify byte-identical check on other apps
9. Write verification to claims.json with proof from generated code
10. Report VERDICT based on machine check results

## Key Decisions
- Location: peruk17.txt (specified in task)
- Format: `חלקיק תיק: [פעולה] שלח תזכורת`
- No hand-edits to generated files (only spec change)
- Verify with police-bench.mjs machine check

## Blocked/Unknown
- None identified yet
