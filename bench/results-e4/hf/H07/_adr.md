# ADR: Add תקרה מחייבת Computed Field to בטוחה Entity

## Context
The בטוחה (collateral) entity in sechirut.txt has two ceiling fields calculated from the parent תיק (lease) entity:
- `תקרה לפי 3 חודשים` (ceiling based on 3 months of rent)
- `תקרה לפי שליש` (ceiling based on 1/3 of total rent for contract period)

## Decision
Add a computed field `תקרה מחייבת` (binding ceiling) that computes the maximum of these two values using the max() function defined in the spec language.

## Rationale
1. The spec language (SPEC-LANG.md, line 12) explicitly supports computed fields with the max() function
2. The example in the spec language documentation shows this exact pattern: `תקרה = max(תקרה א, תקרה ב)`
3. The בטוחה entity has access to both ceiling fields through the parent תיק reference
4. The max() function is natively available in Dart through the dart:math library, which is already imported in generated code
5. This change requires only a spec modification, no engine changes needed

## Alternatives Rejected
1. **Manual max calculation in particles**: Would require duplicating logic in multiple places
2. **Adding to תיק entity instead**: Less appropriate since it's contextual to collateral constraints
3. **Using conditional field**: More verbose than the simple max() formula

## Consequences
- The בטוחה entity now has an additional computed field that automatically calculates the binding ceiling
- This field will be available in all particles and reports that reference בטוחה
- The machine verified no other apps were affected (byte_identical_others: ✅)
- Generated Dart code properly imports dart:math and uses the top-level max() function

## Verification
- ✅ Spec regenerated without errors (regen_ok)
- ✅ Max function correctly compiled and used (dart_math_sane, max check)
- ✅ No other apps affected (byte_identical_others)
- ✅ Generated code has zero analyzer errors (compiles)
- ✅ No hand-edits needed (no_hand_edit)
