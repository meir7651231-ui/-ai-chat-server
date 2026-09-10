# Task: Add תקרה נמוכה (Low Ceiling) Computed Field

## Goal
Add a computed field `תקרה נמוכה` to the `תיק` entity in machtzev/generator/specs-ds/sechirut.txt that equals the minimum of `תקרה לפי 3 חודשים` and `תקרה לפי שליש`.

## 10-Step Decomposition

1. Read SPEC-LANG.md to confirm computed field syntax (min function available)
2. Review sechirut.txt to find exact location where תיק entity fields are declared
3. Run `node machtzev/search-record.mjs` to check for existing "תקרה נמוכה" references
4. Add `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` to תיק entity definition
5. Verify spec syntax using generated documentation
6. Check if בטוחה entity should also reference this new field
7. Regenerate the app using `node machtzev/generator/app-ds.mjs`
8. Run police checks for byte-identity of other apps and gates
9. Verify generated Dart contains no errors
10. Document in claims.json and _insp.md

## Key References
- Entity: `תיק` (case/file) in sechirut.txt line 7
- New field: `תקרה נמוכה` (low ceiling)
- Formula: `min(תקרה לפי 3 חודשים, תקרה לפי שליש)`
- Spec language: Supports `min()` function per SPEC-LANG.md line 12
