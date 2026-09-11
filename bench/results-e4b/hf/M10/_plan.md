# Plan: Add duration fields to calendar meeting entity

## Goal (one line)
Add numeric field משך בדקות and computed field משך בשעות to the meeting entity in calendar.txt, ensuring no breakage in other apps.

## 10-Step Decomposition

1. **Verify current spec structure**: Read calendar.txt to understand the current meeting entity definition and existing fields
2. **Check spec language support**: Verify that computed fields with division are supported in spec-lang (CONFIRMED: line 12 of SPEC-LANG.md shows division support)
3. **Identify integration points**: Search for any existing uses of calendar.txt in other apps that must remain byte-identical
4. **Update meeting entity**: Add משך בדקות field (numeric type) and משך בשעות = משך בדקות / 60 (computed)
5. **Run app-ds.mjs generator**: Generate the calendar app with --name calendar --skin to create new artifacts
6. **Verify Dart compilation**: Check that flutter analyze produces 0 errors on generated Dart code
7. **Run police check**: Execute police-bench.mjs to verify byte-identity for other apps and gates pass
8. **Write LEARNINGS entry**: Document the pattern used (numeric + computed division field)
9. **Register claims**: Write verification of field types, formulas, and test coverage
10. **Final audit**: Run machine report and record VERDICT

## Key Checks
- Spec-lang supports computed fields with / operator (sqrt, min, max, pow, abs, round, floor, ceil in line 12)
- No other apps depend on calendar.txt structure (isolation check via byte_identical_others gate)
- Generated code compiles (Dart facts: division is /, no .sqrt() on num)
