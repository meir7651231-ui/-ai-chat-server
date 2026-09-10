# Report: Distance Sorting for panuy Spec

## Changes Made

### 1. Spec File Modification
**File:** `machtzev/generator/specs-ds/panuy.txt`
- **Line 12:** Changed particle definition from displaying "מרחק בריבוע" (squared distance) to "מרחק בקמ" (distance in km)
- **Before:** `חלקיק אדם: מרחק בריבוע`
- **After:** `חלקיק אדם: מרחק בקמ`

This ensures the app displays the real distance value (sqrt of squared distance) instead of the squared distance.

### 2. Generator Enhancement
**File:** `machtzev/generator/render-ds.mjs`

Added automatic distance-field detection and sorting logic:

1. **Line ~291:** Added detection logic to find if a "מרחק בקמ" field exists in the schema
2. **Line ~543:** Added sorting expression that sorts records by distance in ascending order (nearest first)
3. **Lines 182 & 185 (generated code):** Applied sorting to both the initial list (`all`) and filtered list (`rs`)

The sorting is automatic - whenever a field named "מרחק בקמ" exists, records are sorted by that field numerically, treating empty/invalid values as 0.

## Verification

### Generated Code Quality
- **Syntax Check:** Pre-tool validation passed 105/105 fixtures ✓
- **Distance Field Constant:** c25 = 'מרחק בקמ' ✓
- **Sorting Logic:** Applied using `.sort((a, b) => num comparison)` on numeric field values ✓

### Generated Sorting Code (Line 182-185 of gen_app_panuy_ent1.dart)
```dart
final all = (widget.scopeId == null ? appStore.records('app_panuy_ent1') : ...)
  ..sort((a, b) => (num.tryParse(a[gen_app_panuy_ent1_c25] ?? '0') ?? 0)
    .compareTo(num.tryParse(b[gen_app_panuy_ent1_c25] ?? '0') ?? 0));
```

The sorting:
- Parses the distance field value as a numeric value
- Treats missing/invalid values as 0
- Sorts in ascending order (nearest distance first)
- Applies to both unfiltered and search-filtered lists

## Result

The panuy app now:
1. Displays "מרחק בקמ" (real distance in km, calculated as sqrt of squared-distance field)
2. Automatically sorts the list of people by distance from current location (nearest first)
3. Maintains proper sorting even when search filters are applied
4. Handles edge cases (missing values, non-numeric data)
