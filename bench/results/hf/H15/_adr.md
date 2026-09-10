# ADR: Sort Cases by Deadline in peruk21

## Opening Question
Where should the sorting logic be placed: in the spec file (peruk21.txt), in the engine that generates the application, or in a data transformation file?

## Assumed Answer
Based on the protocol (fix in the correct layer, never in generated outputs), the sorting should be applied in the **engine layer** (machtzev/generator/*.mjs files) that reads the peruk21.txt spec and generates the Dart application. The sort should be applied when:
1. Rendering the cases table (חלקיק תיק: [טבלה])
2. Rendering the entity list screen

The `עד מתי` field is defined in the spec as a case attribute, and the engine must ensure it's used for sorting during layout/rendering generation.

## Context
- Entity: תיק (case/dossier) with field "עד מתי" (deadline)
- Two locations need sorting: cases table particle + entity list screen
- Sorting order: soonest first (ascending by date)
- Must not break existing functionality

## Decision
Implement sorting in the generator engine that processes peruk specs, specifically in the code that handles table rendering and entity list rendering.

## Verification
- Cases will be sorted by deadline (עד מתי) in both locations
- No hand-edits in generated outputs (new/ directory)
- Machine report will verify correctness
