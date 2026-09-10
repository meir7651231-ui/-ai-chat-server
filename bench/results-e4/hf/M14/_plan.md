# Task M14: Add stages to אדם entity in panuy.txt

## Goal
Add person entity stages (פנוי, הוזמן, בוצע) to machtzev/generator/specs-ds/panuy.txt without breaking other apps.

## ≤10-step decomposition
1. Read current panuy.txt structure — person (אדם) entity with fields and particles
2. Search existing specs for stage examples (שלבים/סטטוסים/מצבים pattern)
3. Identify correct spec syntax for adding stages to entity definition
4. Add stages line to אדם entity: `| שלבים: פנוי, הוזמן, בוצע`
5. Verify spec syntax aligns with SPEC-LANG.md reference
6. Run generator to emit Dart code
7. Check that panuy.txt output Dart compiles (flutter analyze 0 errors)
8. Verify other apps (if any) remain byte-identical
9. Write claims.json with test results
10. Document decision in _adr.md and LEARNINGS.md entry

## Key Constraints
- Spec-first: express as spec line, not engine change
- No hand-edits of generated Dart
- Other apps must stay byte-identical (machine checks)
- Final report: machine VERDICT line only
