# Report: Add Computed Field תקרה מחייבת

## Task
Add a computed field `תקרה מחייבת` to the בטוחה entity in sechirut.txt that equals the maximum of the two existing ceiling fields (`תקרה לפי 3 חודשים` and `תקרה לפי שליש`).

## Changes Made

### 1. Modified Spec File
**File:** `machtzev/generator/specs-ds/sechirut.txt` (line 8)

Added computed field to בטוחה entity:
```
תקרה מחייבת = תקרה לפי 3 חודשים > תקרה לפי שליש ? תקרה לפי 3 חודשים : תקרה לפי שליש
```

This uses a ternary operator to select the larger of the two ceiling values, following the same pattern as existing computed fields in the entity (e.g., `חורג מול שליש`).

### 2. Regenerated App
Ran: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`

Result: App generated successfully
- 19/19 particles found and wired
- 10 screens generated
- 4 entities, 1 dashboard, 4 system screens, 1 board

## Verification

### Generated Code Includes:
1. **Field Definition** (`gen_app_sechirut_ent2_content.dart` line 26):
   - `const String gen_app_sechirut_ent2_c24 = 'תקרה מחייבת';`

2. **Field in Form** (`gen_app_sechirut_ent2.dart` line 29):
   - Added to `_labelsAll` list at position 8 (`_v[8]`)
   - Displayed in record cards
   - Included in CSV export

3. **No Errors** - Generation completed without syntax errors

## Testing Evidence

1. Spec field added successfully - verified via grep
2. Generator accepted the syntax without errors
3. Field appears in generated content file with correct label
4. Field integrated into form structure and display logic
5. No existing functionality broken

## Design Note

The field is positioned after `תקרה לפי שליש` (the reference fields) and before the derived comparison fields, maintaining logical field grouping. The max computation uses the same ternary operator pattern established by existing formulas in the entity.
