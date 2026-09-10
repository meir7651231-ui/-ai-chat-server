# PLAN: Add computed field תקרה מחייבת (binding ceiling) to בטוחה entity

**Goal (one line):** Add a computed field תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש) to the בטוחה entity in sechirut.txt, calculated by the app without breaking anything.

## 10-Step Decomposition

1. **Requirement & Acceptance:** Add בטוחה field `תקרה מחייבת` as a computed field (formula = `max(תקרה לפי 3 חודשים, תקרה לפי שליש)`)
   - Does not break existing fields or tests
   - Syntax valid in spec-lang
   - Field appears in generated Dart code

2. **Dependencies:** 
   - `תקרה לפי 3 חודשים` (existing, formula = שכירות * 3)
   - `תקרה לפי שליש` (existing, formula = שכירות * חודשים / 3)
   - `max()` function (available in spec-lang)

3. **Existing patterns check:**
   - Other computed fields in בטוחה: סך בטוחות, חורג מול 3 חודשים, חורג מול שליש
   - All use `field = formula` syntax
   - Will add `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)` on line 8

4. **Design (signature + behavior):**
   - Computed field (no input, no storage)
   - Returns numeric value (max of two numbers)
   - Recalculated on each entity render

5. **Write spec change:**
   - Add line to בטוחה entity definition in sechirut.txt
   - Use comma separator like other fields

6. **Search for existing usage patterns:**
   - Run `node machtzev/search-record.mjs "תקרה מחייבת"` to check if referenced anywhere
   - (Should be 0, since it's new)

7. **Verify spec parsing:**
   - Check that entity.mjs parses the line correctly
   - Formula extraction: should capture `max(תקרה לפי 3 חודשים, תקרה לפי שליש)`

8. **Generate and check Dart output:**
   - Run generator on sechirut.txt
   - Verify בטוחה entity includes the new field in gen_app_ds_* files
   - Check formula is compiled to Dart correctly

9. **Run gates:**
   - `node machtzev/police.mjs --fast` to check wiring + contracts + gates
   - No new gates needed (formula processing already covered)

10. **Final verification:**
    - Run full police check
    - Generate claims.json
    - Run machine report
