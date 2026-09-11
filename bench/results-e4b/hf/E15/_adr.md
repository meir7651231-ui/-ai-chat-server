# ADR: Add computed field סכום כולל מעמ (total with VAT)

## Context
The task is to add a computed field to the task entity (משימה) in the spec file. This field should calculate the total amount including 18% VAT.

## Opening Question & Assumed Answer
**Q:** Where should the computed field be added in the spec file syntax?
**A:** According to SPEC-LANG.md line 12, computed fields use syntax: `שם = <נוסחה>`. I will add it as an inline computed field within the entity definition on the same line or as a continuation.

## Decision
Add the field as a computed field in the משימה entity definition:
- Field name: `סכום כולל מעמ` (total with VAT)
- Formula: `סכום * 1.18`
- Location: tasks.txt, line 6 (the משימה entity definition)

## Rationale
- The spec language supports computed fields with arithmetic expressions
- This follows the pattern: `שם = <נוסחה>` where formula can use existing field names
- No code/logic change needed — spec-level change only
- The generator will automatically emit Dart code to compute this field

## Alternatives Rejected
- Manual computation in UI code: Would require engine changes; spec-driven is cleaner
- Storing both גרוס and נטו values: Would duplicate data; computed is better

## Consequences
- The computed field will be available in all screens/reports showing the task entity
- No Dart generation changes needed (formula is interpreted by the engine)
- No hand-edits to generated code

## Verification
- Machine report will confirm:
  - ✓ regen_ok: regenerated successfully
  - ✓ no_hand_edit: no manual edits to generated files
  - ✓ byte_identical_others: other apps unchanged
  - ✓ gates_pass: all gates pass
