# ADR — Add Stages to אדם Entity

**Task:** In machtzev/generator/specs-ds/panuy.txt give the person entity אדם stages: פנוי, הוזמן, בוצע.

## Context
The panuy.txt spec defines a "פנויים לידי עכשיו" (available people now) application with an אדם (person) entity.
Currently, the entity has fields for availability (זמין{כן|לא}), location, price, etc., but no lifecycle stages.

## Decision
Add stages to the אדם entity definition using the Hebrew DSL syntax:
```
שלבים פנוי, הוזמן, בוצע
```
These represent three states in a person's lifecycle:
- פנוי (available/free)
- הוזמן (booked)
- בוצע (completed/done)

## Rationale
1. **Syntax consistency:** The pattern `שלבים ערך1, ערך2, ערך3` is established in peruk01.txt line 7
2. **Location:** Stages are appended to the entity definition with pipe separator: `| שלבים ...`
3. **Semantic clarity:** These three stages cover the full lifecycle of a booking transaction
4. **Minimal change:** Only the entity line (line 4) is modified; no other lines are affected

## Alternatives Rejected
- Defining stages as a separate enum field `שלבים{פנוי|הוזמן|בוצע}` — not consistent with existing pattern
- Adding stages as a computed field — would require complex logic, simpler as a lifecycle state

## Consequences
- The אדם entity now has explicit lifecycle stages that downstream generators can use
- Particles can reference or filter by stage (e.g., `אדם: שלבים=פנוי`)
- No breaking changes to existing particles (lines 6-17)

## Verification
- File: `machtzev/generator/specs-ds/panuy.txt` line 4
- Change: appended `| שלבים פנוי, הוזמן, בוצע` to entity definition
- Validation: police-bench --task M14 confirms syntax and no regressions
