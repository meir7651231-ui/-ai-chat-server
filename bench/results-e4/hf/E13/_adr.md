# ADR: Add Numeric & Computed Fields to תיק

## Opening Question (per ג.1)
How should the new fields be declared in peruk12.txt spec?

### Assumed Answer
1. `קילומטראז׳` (mileage/odometer) as a numeric field in the תיק entity declaration line (word "קילומטראז׳" signals numeric type)
2. `מחיר לקמ` (price per km) as a computed field using the formula `מחיר / קילומטראז׳`
   - Syntax: `מחיר לקמ = מחיר / קילומטראז׳`
   - Per SPEC-LANG.md line 12: computed fields use `שם = <נוסחה>` with +,-,*,/ operators

## Context
- Task: Add numeric field `קילומטראז׳` and computed field `מחיר לקמ` to entity `תיק` in peruk12.txt
- Current entity line (line 7): `ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת | שלבים …`
- SPEC-LANG.md specifies type inference from field names (line 11-12)

## Decision
1. Add `קילומטראז׳` as a numeric field (like `מחיר`) in the entity field list
2. Declare `מחיר לקמ = מחיר / קילומטראז׳` as a separate computed field line
3. Do NOT edit generated outputs; regenerate via `app-ds.mjs`
4. Run the machine report to verify no breakage

## Verification
- Check that peruk12.txt compiles with no errors
- Verify no other app's output changes (byte_identical_others gate)
- Confirm both fields appear in generated Dart
- Run full police report for green status
