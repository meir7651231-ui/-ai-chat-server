# Peruk17 Cases Table Sorting — סיווג Alphabetical Order

## Changes Made

### 1. Updated Spec File (machtzev/generator/specs-ds/peruk17.txt)
Reordered the `סיווג` (classification) enum values from arbitrary order to alphabetical order:

**Before:**
```
סיווג{השלמת מסמכים|דחייה לגופה|זימון ועדה|נגמר השעון}
```

**After:**
```
סיווג{דחייה לגופה|השלמת מסמכים|זימון ועדה|נגמר השעון}
```

Order: דחייה לגופה → השלמת מסמכים → זימון ועדה → נגמר השעון (alphabetically by Hebrew)

### 2. Regenerated App (machtzev/generator/apps/peruk17.json)
The enum values in the generated app spec were automatically updated by `app-ds.mjs` to match the spec order.

### 3. Added Table Sorting Logic (new/dart-gen-bs/gen_app_peruk17_px1.dart)
Modified the table rendering code to sort cases by סיווג before displaying:

**Before:**
```dart
items: [for (final r in appStore.records('app_peruk17_ent1')) [(r[c7] ?? ''), ...]]
```

**After:**
```dart
final recs = appStore.records('app_peruk17_ent1').toList()
  ..sort((a, b) => (a[gen_app_peruk17_px1_c12] ?? '')
    .compareTo(b[gen_app_peruk17_px1_c12] ?? ''));
return ForgeDataGrid(..., items: [for (final r in recs) [...]])
```

Where `c12` = `סיווג` field. The `.sort()` uses `compareTo()` for Hebrew string comparison.

## Verification

✅ Spec file updated with alphabetical enum order  
✅ App spec regenerated with new enum order  
✅ Table rendering code sorts by סיווג field before display  
✅ No breaking changes to other components  
✅ String constants in gen_app_peruk17_ent1_content.dart confirm alphabetical order (c15–c18)

## How It Works

1. Cases are fetched from the data store
2. Converted to a list and sorted by the סיווג field value
3. Hebrew `compareTo()` ensures correct alphabetical ordering
4. Table displays rows in sorted order

The sorting is applied every time the UI rebuilds via `AnimatedBuilder`, ensuring new cases maintain alphabetical order by classification.
