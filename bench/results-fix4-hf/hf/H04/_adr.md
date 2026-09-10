# ADR: Sort פגישה particle by מועד then שעה

## Opening Question (from ג.1 of MASTER_PROTOCOL)
**Do we add a particle definition to the spec or is there already one that needs to be modified?**

## Assumed Answer
The calendar.txt spec currently defines only the entity, not a particle. Based on the task description mentioning "the פגישה particle screen", there must be an auto-generated or default particle. However, to add sorting, we must explicitly define a particle with table kind and sort keys in the spec.

**Decision: Add a particle definition to calendar.txt with explicit sorting by מועד (ASC) then שעה (ASC).**

## Rationale
- The spec file is the single source of truth per THE-WAY.md (step 4: never hand-draw)
- The particle generator (particles.mjs) reads particle definitions from spec files via `parseParticleLines()`
- Sort keys are parsed via `parseSortKeys()` which extracts field names and sort direction
- The sort is emitted in generated code via `sortLambda()` which creates a Dart comparator

## Implementation Path
1. Add particle definition to calendar.txt: `חלקיק פגישה: רשימה = [טבלה] ... | מיון: מועד עולה, שעה עולה`
2. Run generator to produce new sorted code
3. Verify with machine report

## Alternatives Rejected
- Hand-editing generated Dart code (violates protocol, layer-3 fix only)
- Modifying generator's default sort (too broad, affects all particle tables)
