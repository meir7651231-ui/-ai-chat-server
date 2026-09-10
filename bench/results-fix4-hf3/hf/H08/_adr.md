# ADR: Add Computed Field מרחק אבסולוטי to panuy.txt

## Context
Task H08: Add a computed field `מרחק אבסולוטי` (absolute distance) equal to `abs(הפרש רוחב)` (absolute value of width difference) in the panuy.txt spec. This field should be computed by the app.

## Opening Question (ג.1)
**Q:** What is the spec syntax for a computed field with an absolute value function?
**A (assumed):** Per SPEC-LANG.md line 12, computed fields use syntax `שם = <נוסחה>` and support `abs(…)` function. The field should be added to the אדם entity declaration as:
```
מרחק אבסולוטי = abs(הפרש רוחב)
```

## 10-Step Decomposition (ג.2)
1. Read SPEC-LANG.md ✓ (confirms abs() syntax and computed field pattern)
2. Read panuy.txt ✓ (found entity אדם with field הפרש רוחב)
3. Add computed field line to entity declaration in panuy.txt
4. Verify no hand-edits to generated files
5. Regenerate app with: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
6. Run machine verification
7. Verify computed field appears in generated Dart files
8. Record claims in claims.json
9. Write lesson to LEARNINGS.md
10. Run final inspection and VERDICT

## Design Decision
The field will be added as a sibling to existing computed fields like `הפרש רוחב` and `מרחק בריבוע`. Its position in the entity declaration matters (affects render order), so it will be placed after `הפרש רוחב` for logical grouping. The spec language supports abs() natively (line 12 of SPEC-LANG.md), so no engine changes needed.

## Current State
- panuy.txt exists with entity אדם
- Field הפרש רוחב is computed: `קו רוחב - קו רוחב שלי`
- Need to add: `מרחק אבסולוטי = abs(הפרש רוחב)`
