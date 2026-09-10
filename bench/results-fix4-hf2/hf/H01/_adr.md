# ADR: Sorting People List by Distance

## Context
Task: Sort panuy app list by distance (nearest first) and show real distance in km.
- panuy.txt spec defines: entity "אדם" (person) with fields including "מרחק בקמ" (distance in km)
- Spec syntax allows: `חלקיק אדם: [טבלה] | מיון: מרחק בקמ עולה` (sort by distance ascending)

## Decision
Modified panuy.txt line 6 from:
- `חלקיק אדם: [טבלה]`
to:
- `חלקיק אדם: [טבלה] | מיון: מרחק בקמ עולה`

## Rationale
1. SPEC-LANG.md explicitly documents table sorting syntax: `[טבלה] ... | מיון: <שדה> עולה/יורד, <שדה2>`
2. particles.mjs contains sort parsing logic (lines 125-138) and applies sorting via sortLambda (line 406)
3. renderEntity accepts sort parameter which is used to generate Dart sort() code
4. Distance field already calculated: מרחק בקמ = sqrt(מרחק בריבוע)

## Alternatives Rejected
- Hand-editing generated Dart files: Violates protocol (never edit generated files)
- Engine modification: Unnecessary - spec language already supports sorting

## Consequences
- Generator must be re-run to apply specification (app-ds.mjs done)
- Particles may generate separate screens OR integrate into entity screen
- Must verify sorting is applied in final Dart output via police-bench

## Verification
TBD: Run police-bench to check:
- Generated Dart compiles
- Table rendering includes sortLambda call for מרחק בקמ
- Byte-identity maintained for other apps
