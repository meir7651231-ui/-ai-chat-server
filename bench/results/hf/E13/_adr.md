# ADR: Add Numeric Field and Computed Field to תיק Entity

## Context
Task E13: Add to the תיק entity in peruk12.txt:
1. A numeric field `קילומטראז'` (mileage/kilometers)
2. A computed field `מחיר לקמ` (price per km) = מחיר / קילומטראז'

## Decision
Modify line 7 of peruk12.txt (the entity definition) to include both new fields in the spec syntax format observed in panuy.txt, which uses `fieldName = formula` for computed fields.

## Rationale
The spec language syntax (from panuy.txt examples) shows:
- Regular fields listed in comma-separated entity definition
- Computed fields use `name = expression` syntax within the same entity definition
- Division operator `/` is supported in field formulas

This approach maintains spec syntax consistency and allows the generator to properly parse and emit the new fields.

## Alternatives Rejected
1. Adding the computed field in a separate section - violates the spec language structure where all entity fields are in one ישות line
2. Using a different formula syntax - inconsistent with panuy.txt examples

## Consequences
- The תיק entity will have a new numeric input field
- The computed field will automatically derive price-per-km values
- The generator must support division operator in formula expressions
- Reports and display logic using תיק will need to accommodate the new fields

## Verification Plan
1. Syntax check: Generator must parse the modified spec without errors
2. Field generation check: Both קילומטראז' and מחיר לקמ appear in generated output
3. Semantics check: Formula evaluation works correctly (price / mileage)
4. Non-regression check: All existing peruk12 functionality continues working
5. Machine report passes all checks

## Assumed Answer
The syntax should follow the panuy.txt pattern where computed fields are integrated directly in the entity definition with the `=` operator, using the standard formula syntax already supported by the generator.
