# Task: Add Computed Field to בטוחה Entity

## Summary
Added computed field `תקרה מחייבת` to the `בטוחה` (collateral) entity in `machtzev/generator/specs-ds/sechirut.txt`.

## What Was Done
1. **Edited spec file** (sechirut.txt, line 8)
   - Added new computed field: `תקרה מחייבת = תקרה לפי 3 חודשים > תקרה לפי שליש ? תקרה לפי 3 חודשים : תקרה לפי שליש`
   - Positioned after the existing two ceiling fields and before the existing computed fields
   - Uses ternary operator to return the maximum of the two ceilings

2. **Verified compilation**
   - Ran `node machtzev/generator/app-ds.mjs` to regenerate the app
   - All checks passed without errors
   - Generated 10 screens across 4 entities with forge skin applied
   - Field appears in generated content file: `gen_app_sechirut_ent2_content.dart` (line 26)

## Verification
✅ **App generation succeeded** (no parsing errors)
✅ **Police check passed** (autoskin, autologic, core all green)
✅ **Field count increased** (from 10 to 11 fields in בטוחה)
✅ **No existing fields broken** (all original fields still present and functional)

## Technical Details
- Formula syntax: `field > field ? field : field` (standard ternary conditional)
- Field type: Computed (derived from two numeric references)
- Used by: Can be referenced in particles, reports, and display logic via `בטוחה.תקרה מחייבת`
