# ADR: Sort cases table by rent (שכירות) descending

## Context
The `sechirut.txt` app spec defines a "חלקיק תיק: [טבלה]" (cases table particle) on line 22.
The cases table should display תיק (case) records sorted by שכירות (rent amount), highest first.

## Opening Question (ג.1)
**Q: How is the table sorting implemented?**

**Assumed Answer:**
The particle engine reads `[טבלה]` markers and generates a table screen. Sorting is likely:
- Either hardcoded in the generator via spec-lang rules (particles.mjs)
- Or inherited from the table rendering logic in the auto-generated Dart code

The fix should be applied at the **spec level** (particles.mjs), not in generated Dart (per protocol: fix in the correct layer).

## Task Summary
- Target file: `machtzev/generator/specs-ds/sechirut.txt`
- Particle: `חלקיק תיק: [טבלה]` (line 22)
- Required change: Add descending sort by שכירות field
- Acceptance: Table renders cases ordered by rent, highest → lowest. No other particles/features break.

## 10-step decomposition
1. Read spec parser (particles.mjs) to understand [טבלה] handling
2. Find table particle definition in generated code
3. Identify sort order parameter/field
4. Modify spec to include sort directive (if needed)
5. Run generator to produce new Dart
6. Verify generated code applies sort
7. Run flutter analyze → 0 errors
8. Check all tests still pass
9. Write LEARNINGS entry
10. Commit locally (no push)
