# Sechirut App: Findings Table Sorting Fix

## What was done

Modified the sechirut app to add a findings table (ממצא particle) with proper severity color sorting.

### Changes made:

1. **spec-ds/sechirut.txt** (line 17)
   - Added a new table particle for the ממצא (findings) entity
   - Displays columns: סעיף (section), צבע (color), מה כתוב (what's written)
   - Added sorting by צבע (color) field in ascending order

2. **machtzev/generator/particles.mjs** (lines 404-415)
   - Enhanced the table sorting logic to handle enum fields specially
   - For enum fields, uses enum value order instead of alphabetical comparison
   - Created a mapping of enum values to their positions for correct sorting
   - Now sorts: אדום (red) = 0, צהוב (yellow) = 1, ירוק (green) = 2

## How it works

The findings table now:
- Displays all findings in a single sortable table (instead of just grouped by color)
- Sorts findings by severity color in the correct order: אדום (red) first, then צהוב (yellow), then ירוק (green)
- Uses the enum field mapping to ensure proper ordering regardless of string comparison

## Verification

✓ App regenerated successfully: `node machtzev/generator/app-ds.mjs`
✓ Table particle count increased from 5 to 6
✓ Police check passed (sechirut in balagan-look with green status)
✓ Generated sorting code uses enum-aware comparator mapping
✓ Nothing else broken - existing particles (red count, request field, empty state, etc.) unchanged

## Generated code

The sorting in gen_app_sechirut_px3.dart now uses:
```dart
{"gen_app_sechirut_px3_c11":0,"gen_app_sechirut_px3_c12":1,"gen_app_sechirut_px3_c13":2}
```
Which maps to: אדום→0, צהוב→1, ירוק→2
