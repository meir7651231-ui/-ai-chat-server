# ADR: Sorting the peruk17 cases table

## Context
Task H12 requires adding alphabetical sorting by "סיווג" (classification) field to the cases table in the app generated from `machtzev/generator/specs-ds/peruk17.txt`.

## Decision
Modified the table particle specification in peruk17.txt to include sort specification:
- Line 10: `חלקיק תיק: [טבלה] | מיון: סיווג עולה`

This leverages the existing sort-cmp.mjs infrastructure which generates `sortLambda` in Dart code.

## Rationale
1. The particle engine already supports sort syntax via `| מיון: שדה עולה/יורד`
2. No new atoms required; parseSortKeys and sortLambda handle enum sorting
3. Enum values are sorted by declaration order: ["השלמת מסמכים", "דחייה לגופה", "זימון ועדה", "נגמר השעון"]
4. Generated particle plan confirms parse: "טבלה מיון סיווג עולה"

## Alternatives Rejected
- Creating a new sort atom: unnecessary; particle engine supports sort natively
- Hard-coding sort in generated code: violates specification paradigm

## Consequences
- peruk17 app table now sorted alphabetically by סיווג
- Machine gate `sort ✅ px1` validates implementation
- Collateral: default app files (gen_app_*) regenerated due to initial command syntax error

## Verification
- Spec change: ✅ (specs-ds/peruk17.txt:10)
- Parse confirmation: ✅ (particle-plan-peruk17.md:5 shows "מיון סיווג עולה")
- Machine gate: ✅ (sort check passed)
