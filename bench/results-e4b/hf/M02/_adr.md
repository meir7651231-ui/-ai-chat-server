# ADR: Add בדיקה (Inspection) Entity to peruk12

## Opening Question (§ג.1)

**What**: Add second entity `בדיקה` (inspection) to peruk12 with table screen and dashboard counter
**Source**: Task requirement
**Translation to spec**: Two entities linked by FK: `תיק` (case) ← `בדיקה` (inspection). New inspection has required fields: תיק* (link), מה נבדק* (what-was-inspected), תקין{כן|לא} (valid-yes/no). Screens: table + actions. Dashboard: counter of inspections where תקין=לא.
**Blocked**: None

## Assumption

The new entity should:
- Use same pattern as existing `תיק` entity in peruk12
- Have table screen showing all inspections
- Have "add inspection" action button
- Have dashboard counter showing inspections where `תקין` is `לא` (no/invalid)
- Not break existing functionality

**Answer**: Implement as spec-level change only. No engine modification needed.
