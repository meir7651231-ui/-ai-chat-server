# ADR: Add payment entity to peruk02.txt

## Context
Task: Add a third entity `תשלום` (payment) to peruk02.txt with:
- Fields: `תיק` (required link), `סכום` (required amount), `שולם` (yes/no)
- Cascade delete on case deletion
- Add a table screen for payments

## Decision
Add payment entity after finding entity, with:
1. Entity definition with cascade deletion like finding does
2. Particles for table view, empty state, action button
3. Report pieces for displaying payments in case context
4. No content/examples needed - focus on core functionality

## Rationale
The cascade deletion pattern already exists for findings (ממצא). Payments relate 1:N to cases, so same pattern applies.
Field `שולם` is yes/no which maps to enum {כן|לא}.

## Verification
- Machine report confirms no_hand_edit on all outputs
- Table screen renders correctly
- Cascade deletion works (checked in generated code)
