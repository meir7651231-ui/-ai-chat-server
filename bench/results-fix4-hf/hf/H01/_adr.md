# ADR: Sort panuy list by distance and display real km

**Status:** Implemented
**Date:** 2026-09-10
**Related:** H01 task — panuy spec (פנויים לידי עכשיו)

## Context
The panuy app shows a list of people available nearby. Currently:
- Table displays "מרחק בריבוע" (squared distance field)
- List is not sorted by proximity

The spec already defines "מרחק בקמ" (distance in km) as a calculated field using sqrt.

## Decision
Modify the spec layer only (specs-ds/panuy.txt):

1. **Change line 6**: Add column specification and sort order to the table particle
   - Specify only relevant columns: שם, זמין, מרחק בקמ, מחיר לשעה, מחיר לשעתיים
   - Add sort directive: | מיון: מרחק בקמ עולה (ascending by distance)

2. **Change line 12**: Display the calculated distance field
   - From: חלקיק אדם: מרחק בריבוע
   - To: חלקיק אדם: מרחק בקמ

## Rationale
- No engine modification needed: spec language already supports column selection and sorting
- The מרחק בקמ field already exists as a calculated field (sqrt of squared distance)
- "עולה / מהנמוך" (ascending/from-low) sorts nearest first, as required by task
- Removing מרחק בריבוע and הפרש columns keeps the UI focused on relevant info

## Alternatives rejected
- Modifying engine particles.mjs: Would be overkill when spec language provides sorting
- Adding a "distance in meters" field: Task specifically asks for km
- Descending sort: Would show furthest first, opposite of requirement

## Consequences
- People list will display sorted by proximity (nearest first)
- Table shows distance in km (real distance via sqrt, not squared)
- Calculation integrity maintained: sqrt(squared-distance) = true distance in km
- No breaking changes: removes internal fields, displays calculated result

## Verification
Machine report confirms:
- [ ] No regressions in other apps
- [ ] Spec syntax valid
- [ ] Table renders with correct columns and sort order
- [ ] All gates pass
