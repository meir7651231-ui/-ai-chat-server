# ADR: Sort Cases Table by סיווג Field

## Context
The app generated from `machtzev/generator/specs-ds/peruk17.txt` creates a cases (תיקים) table in the particle screen `gen_app_peruk17_px1.dart`. The table displays cases with fields: לקוח, טלפון, המכתב המלא, איזו בקשה, מה כבר הוגש, and סיווג.

The סיווג field is an enum with 4 values:
- השלמת מסמכים (Document Completion)
- דחייה לגופה (Denial)
- זימון ועדה (Committee Convening)
- נגמר השעון (Time Expired)

Currently, the table items are generated without any sorting.

## Decision
Sort the table items alphabetically by the סיווג field (the rightmost column, index 5 in the items array). The sort should happen in the generator that produces `gen_app_peruk17_px1.dart`.

## Assumed Answer
The sorting should be done in the particles.mjs generator, where table particles are rendered. The sort should be applied to the records before they are converted to table items, sorting by the סיווג field value.

## Implementation Strategy
1. Find the generator code that creates table particles (in particles.mjs)
2. Identify where ForgeDataGrid items are generated for [טבלה] particles
3. Add sorting by the סיווג field (alphabetically)
4. Run police-bench.mjs to verify the change works

## Notes
- This only affects the generated file in dart-gen-bs, not the specification itself
- The sorting will be visible when the app is rendered
