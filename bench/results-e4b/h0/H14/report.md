# Sechirut App: Findings Table Sorting Fix

## Task
Sort the findings table (ממצא particle screen) by severity color (צבע) in the order: אדום (red), צהוב (yellow), ירוק (green).

## Solution
Modified the sechirut app specification to add explicit sorting by the color field.

### Changes Made

1. **Updated spec file**: `machtzev/generator/specs-ds/sechirut.txt`
   - Line 9: Added `| מיון: צבע` to the ממצא entity definition
   - This tells the generator to sort findings by the "צבע" (color) field
   - Enum values were already in correct order: אדום|צהוב|ירוק

2. **Regenerated app**: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`

### Verification

The generated Dart code now includes sorting logic:
```dart
rs.sort((a, b) { 
  { final x = a[gen_app_sechirut_ent3_c20] ?? '', y = b[gen_app_sechirut_ent3_c20] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
    final o = [gen_app_sechirut_ent3_c21, gen_app_sechirut_ent3_c22, gen_app_sechirut_ent3_c23]; 
    final c = o.indexOf(x).compareTo(o.indexOf(y)); 
    if (c != 0) return c; 
  } 
  return 0; 
});
```

Where:
- c20 = "צבע" (color field)
- c21 = "אדום" (red - sorted first)
- c22 = "צהוב" (yellow - sorted second)
- c23 = "ירוק" (green - sorted third)

### How It Works
The sort-cmp.mjs engine generates a comparator that sorts enum fields by their declaration order in the schema. Since the schema lists colors as אדום|צהוב|ירוק, findings are now sorted with red findings first, yellow second, green last.

### Testing
- Police check (--fast) passed ✓
- Full police check running in background
- No other functionality affected - only added sorting to the findings list

## Files Modified
- machtzev/generator/specs-ds/sechirut.txt (1 line)

## Regenerated Files
- All gen_app_sechirut_*.dart files in new/dart-gen-bs and new/dart-data-bs
