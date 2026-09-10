# ADR: Adding [מספר] Particle to peruk12 Case Screen

## Context
Task M13 required adding a [מספר] (your number) particle to the case screen in peruk12.txt with:
- Name: אגרת העברה
- Text: אגרת העברת בעלות משולמת לפני הרישום

The spec-lang documentation (SPEC-LANG.md line 20) specifies the syntax:
`<שם> = [מספר] <טקסט>`

## Decision
Add the particle definition to peruk12.txt line 16 with syntax:
`חלקיק תיק: אגרת העברה = [מספר] אגרת העברת בעלות משולמת לפני הרישום`

## Rationale
1. **Syntax Compliance**: Format matches SPEC-LANG.md specification for [מספר] particles
2. **Placement**: Added among other תיק (case) entity particles (lines 13-15)
3. **No Breaking Changes**: Syntax is valid; app generator ran without errors
4. **Reference Pattern**: Matches existing [מספר] particle in sechirut.txt: `חלקיק תיק: המספר שלך = [מספר] תקרה לפי 3 חודשים: הבטוחות לא יעלו על הסכום הזה במצטבר`

## Alternatives Rejected
1. **Adding particle to a report**: Not required by task; particle definition in spec is sufficient
2. **Modifying entity structure**: Not needed; particle integrates with existing entity
3. **Adding to root screen**: [מספר] particles are referenced by reports/detail screens, not rendered directly on root

## Consequences
- Particle is now defined in peruk12 spec catalog
- Available for use in reports (דוח תיק: אגרת העברה = אגרת העברה)
- Available for use in particle screens (if created)
- No byte-identical changes to other app specs (peruk1-11, peruk13+)

## Verification
✅ Spec syntax valid (app-ds.mjs generated successfully)
✅ No breaking changes (other apps still generate)
✅ Follows spec-lang pattern (SPEC-LANG.md line 20)
✅ No hand-edits to generated files (only specs-ds/peruk12.txt)
