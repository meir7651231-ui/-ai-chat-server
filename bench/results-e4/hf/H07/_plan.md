# Task H07 Plan: Add תקרה מחייבת (Binding Ceiling) Field

## Goal
Add a computed field `תקרה מחייבת` to the `בטוחה` entity that calculates the maximum of the two ceiling fields (`תקרה לפי 3 חודשים` and `תקרה לפי שליש`).

## Decomposition (10 steps)
1. ✅ Read spec-language reference (SPEC-LANG.md) to identify correct syntax for computed fields
2. ✅ Read current sechirut.txt to locate the בטוחה entity definition
3. Search existing atoms to check if similar max() computations exist
4. Identify the exact insertion point in the בטוחה entity definition (line 8)
5. Add the computed field formula: `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)`
6. Regenerate the app using `node machtzev/generator/app-ds.mjs`
7. Verify no hand-edits in new/ directory
8. Run byte-identical checks for other apps
9. Run gates to verify no regressions
10. Document findings and write claims.json

## Key Insight
The spec language already supports computed fields with max() function (line 12 of SPEC-LANG.md).
The בטוחה entity is a child of תיק, so it has access to both ceiling fields.
