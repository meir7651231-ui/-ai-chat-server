# Task: Add קילומטראז׳ and מחיר לקמ to peruk12.txt

## Goal
Extend the תיק (case) entity with a numeric field קילומטראז׳ (mileage) and a computed field מחיר לקמ (price per km) without breaking other apps.

## 10-Step Decomposition

1. **Read the spec language reference** → understand field declaration syntax and computed field notation
2. **Search for existing usage** → check if קילומטראז׳ or מחיר לקמ already exist elsewhere
3. **Verify peruk12.txt structure** → confirm entity declaration and field placement rules
4. **Identify field type** → confirm numeric type detection (keywords in field names)
5. **Draft spec change** → add both fields to תיק entity declaration
6. **Regenerate app** → run `node machtzev/generator/app-ds.mjs` with peruk12 + --name flag
7. **Verify byte-identity of other apps** → ensure no other app outputs changed
8. **Validate Dart compilation** → check generated Dart passes `flutter analyze` (within machine limits)
9. **Write claims.json** → byte-verify the changes before claiming success
10. **Audit via 6 lenses** → task-coverage, numeric handling, edge cases, state leakage, navigation, text-parity

## Assumptions (written to _adr.md)
- קילומטראז׳ is a numeric field (type detected from field name containing קילומטראז׳)
- מחיר לקמ is a computed field using the formula: מחיר / קילומטראז׳
- No new database migration needed (generator handles it)
- App is regenerated in isolation; other apps must remain byte-identical
