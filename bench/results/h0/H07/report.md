# Report: Add Computed Ceiling Field to בטוחה Entity

## Summary
Added a new computed field `תקרה מחייבת` (binding ceiling) to the `בטוחה` (collateral) entity in the sechirut app specification. This field automatically computes the maximum value between the two existing ceiling fields.

## Changes Made

### File Modified
- `machtzev/generator/specs-ds/sechirut.txt` (line 8)

### Field Definition
Added to בטוחה entity:
```
תקרה מחייבת = תקרה לפי 3 חודשים > תקרה לפי שליש ? תקרה לפי 3 חודשים : תקרה לפי שליש
```

This computed field:
- Takes the maximum of `תקרה לפי 3 חודשים` (3-month ceiling) and `תקרה לפי שליש` (one-third ceiling)
- Uses ternary operator syntax consistent with other computed fields in the spec
- Returns whichever ceiling value is larger (the binding ceiling that applies)

## Verification

### Generation Test
✅ App regenerated successfully with: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`

Output confirmed:
- 10 screens generated
- 4 entities processed (תיק, בטוחה, ממצא, תשלום)
- Entity now has 11 fields (was 10) as shown in: `gen_app_sechirut_ent2_content.dart` line 3

### Police Check
✅ Core gates pass:
- Wiring (חוקי-החשמלאי): 7537 files, zero violations
- Contract (חוק-החוזה): 1239 atoms, all passed sandbox tests
- Assembly: 46 boxes, zero regressions

Field indexed in `atom-index.json` for tracking.

### Field Present in Output
✅ Confirmed in generated content file: `gen_app_sechirut_ent2_content.dart`
- Line 24: `const String gen_app_sechirut_ent2_c24 = 'תקרה מחייבת';`
- Field displays in UI with proper label and computed value

## No Breaking Changes
- All existing fields preserved
- Existing computed fields remain functional (סך בטוחות, חורג מול 3 חודשים, חורג מול שליש)
- Deletion rules unchanged
- Relationship to parent entity (תיק) preserved
