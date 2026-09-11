# ADR: Add Maximum Ceiling Computed Field to בטוחה Entity

## Context
The בטוחה (collateral) entity in sechirut.txt has two ceiling fields:
- תקרה לפי 3 חודשים (3-month ceiling)
- תקרה לפי שליש (third ceiling)

Users need a computed field that shows the binding ceiling (the larger of the two).

## Decision
Add a computed field `תקרה מחייבת` (binding ceiling) to בטוחה entity as:
`[שדה] תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)`

## Rationale
- Computed fields are expressed in the spec-lang using the `=` operator with a formula
- This is cheaper than storing a third value; it's always fresh
- The app (Dart) will compute it at render time
- No breaking changes: existing fields untouched, only new field added

## Alternatives Rejected
1. Manual computation in the UI layer — no, should be spec-driven
2. Store as a third input field — no, breaks single-source-of-truth

## Consequences
- בטוחה entity definition grows by 1 field
- No other entities affected
- Spec must be valid per spec-lang syntax
- Generated Dart must compile (flutter analyze)

## Verification
1. Run spec through generator without errors
2. Check generated Dart has max() call with correct wiring
3. Run byte-identical checks on all other apps
4. Police gates pass
