# Sorting Fix Report: peruk02 Cases Table

## Objective
Sort the cases table in the peruk02 app by "תאריך מסירת מפתח" (key-handover date), earliest first.

## Changes Made
Modified spec file: `machtzev/generator/specs-ds/peruk02.txt`

**Line 6** (Entity definition):
- **Before**: `ישות תיק עם ... | שלבים התקבל, שולם, בבדיקה, נמסר, סגור`
- **After**: `ישות תיק עם ... | שלבים התקבל, שולם, בבדיקה, נמסר, סגור | מיון: תאריך מסירת מפתח עולה`

Added sort directive to entity specification to automatically apply sorting to all views of the cases table.

## How It Works
1. Entity interpreter (`entity.mjs`) parses the `| מיון:` section
2. Extracts field name and direction (עולה=ascending, יורד=descending)
3. Passes sort configuration to `renderEntity()` function
4. Generated code (`gen_app_peruk02_ent1.dart`) includes sort lambda that:
   - Compares records by the date field
   - Handles empty values (pushed to end)
   - Tries numeric parsing first, falls back to string comparison
   - Sorts in ascending order (earliest dates first)

## Verification
The generated file `new/dart-gen-bs/gen_app_peruk02_ent1.dart` includes:

```dart
rs.sort((a, b) { 
  { 
    final x = a[gen_app_peruk02_ent1_c34] ?? '', 
          y = b[gen_app_peruk02_ent1_c34] ?? '';
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1;
    final nx = num.tryParse(x), ny = num.tryParse(y);
    final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y);
    if (c != 0) return c;
  }
  return 0;
});
```

Where `c34` maps to `'תאריך מסירת מפתח'` field.

This sorting applies to:
- List view (cards)
- Board view (kanban)
- Calendar view (events by date)
- Table view (ForgeDataGrid)

## Integrity Check
- No breaking changes to functionality
- Sorting applied at the record filtering stage (after search)
- All view types benefit from the same sorting
- Spec syntax is valid (matches `| מיון: <field> <direction>` pattern)
- Field name matches schema exactly
- Regeneration succeeded with no errors

## Build Status
✓ App regenerated successfully
✓ All 9 particles found and wired
✓ All 66 content items parsed correctly
✓ Generated 8 screens, 2 entities, 1 dashboard, 4 system screens
