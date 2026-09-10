# ADR: Case Sorting by Deadline in Peruk21 App

## Context
Task required sorting cases by deadline (עד מתי field) in the peruk21 application. Two display locations needed sorting:
1. Cases table on particle screen  
2. Cases in entity list screen

## Decision
Use spec language sorting syntax to implement sorting at the source (spec file peruk21.txt) rather than engine-level code changes. This follows the principle of fixing in the correct layer (spec first, engine only when spec cannot express it).

## Rationale
1. **Spec Language Support**: SPEC-LANG.md documents sorting syntax for both entity-level (line 5) and particle-level (line 17): `מיון: <שדה> עולה | יורד`
2. **Correctness**: Date fields automatically sort chronologically when ascending (עולה = soonest first)
3. **No Engine Changes**: Keeps engine untouched, preserving byte-identical outputs for all other apps
4. **Maintainability**: Sorting specified alongside entity definition, clear intent in spec
5. **Verification**: Machine checks both sort_px (particle) and sort_ent (entity) targets

## Implementation
Modified `/machtzev/generator/specs-ds/peruk21.txt`:
- Line 7: Added `| מיון: עד מתי עולה` to entity definition
- Line 10: Added `| מיון: עד מתי עולה` to table particle definition

Both use the same field name (עד מתי) to ensure consistent sorting across all representations.

## Alternatives Rejected
1. Engine-level sorting in app-from-sentences.mjs: Would require touching machinery, risked breaking other apps
2. Manual sorting in generated Dart: Would require hand-edits, violates byte-identical constraint
3. Partial sorting: Only sorting one location would create inconsistency

## Consequences
- Cases now display in deadline order everywhere in the app
- Earliest deadlines appear first (ascending date order)
- User can see urgent cases immediately
- No performance impact (sorting done at generation time, not runtime)

## Verification
✅ Machine report shows DONE with all checks passing:
- regen_ok: Generator succeeded
- byte_identical_others: No side effects
- sort_px: Particle sorting verified
- sort_ent: Entity sorting verified
- compiles: Dart code valid (0 errors)
