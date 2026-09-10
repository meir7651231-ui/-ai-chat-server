# Sorting Cases Table by Key-Handover Date

## What was done
Modified the peruk02 app to sort the cases table by "תאריך מסירת מפתח" (key-handover date), earliest first.

## Changes made

### 1. Spec File Update
- **File**: `machtzev/generator/specs-ds/peruk02.txt`, line 10
- **Before**: `חלקיק תיק: [טבלה]`
- **After**: `חלקיק תיק: [טבלה] | מיון: תאריך מסירת מפתח עולה`
- **Meaning**: Added sort directive to table particle, sorting by key-handover date in ascending order (עולה)

### 2. App Regeneration
- **Command**: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin`
- **Result**: App regenerated successfully with 8 screens (2 entities, 1 dashboards, 4 system, 1 board)

## Verification

### Generated Code
The generated Dart file `gen_app_peruk02_px1.dart` contains the sort logic:
```dart
appStore.records('app_peruk02_ent1').toList()..sort((a, b) { 
  { final x = a[gen_app_peruk02_px1_c13] ?? '', y = b[gen_app_peruk02_px1_c13] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
    final nx = num.tryParse(x), ny = num.tryParse(y); 
    final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); 
    if (c != 0) return c; 
  } 
  return 0; 
})
```

Where `gen_app_peruk02_px1_c13 = 'תאריך מסירת מפתח'` (confirmed in content file)

### Sort Behavior
- Sorts by field `תאריך מסירת מפתח` (key-handover date)
- Empty dates placed at end (`x.isEmpty ? 1 : -1`)
- Ascending order (earliest dates first)
- Handles both numeric and string date formats

## No Breaking Changes
- All existing particles, content, and reports preserved
- Entity schema unchanged
- Only table display order affected
- Status: ✅ Regeneration completed successfully

