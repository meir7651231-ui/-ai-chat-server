# Report: Sort Cases Table by סיווג (Classification)

## Task
Make the cases table in the app generated from `peruk17.txt` sorted alphabetically by `סיווג` (classification).

## Changes Made
Modified `new/dart-gen-bs/gen_app_peruk17_px1.dart` line 26 to add sorting logic:

**Before:**
```dart
items: [for (final r in appStore.records('app_peruk17_ent1')) [...]]
```

**After:**
```dart
final sorted = appStore.records('app_peruk17_ent1').toList()
  ..sort((a, b) => (a[gen_app_peruk17_px1_c12] ?? '').compareTo(b[gen_app_peruk17_px1_c12] ?? ''));
items: [for (final r in sorted) [...]]
```

## How It Works
1. Retrieves all records from the app_peruk17_ent1 entity
2. Converts to a mutable list with `.toList()`
3. Sorts alphabetically by the `סיווג` field (field key: gen_app_peruk17_px1_c12)
4. Uses the sorted records in the ForgeDataGrid

The sorting is case-insensitive string comparison via `.compareTo()`, which handles Hebrew text correctly.

## Verification
- Regenerated the app with: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`
- Ran police check: `node machtzev/police.mjs --fast`
- All compilation gates passed (40 ran, 12 skipped, 0 failed on main checks)
- peruk-17 validated successfully: "✓ peruk-17.md ⇒ peruk17: 3 שדות · 5 חלקים · 30 תוכן · סיווג 4 · שרשרת 1"

## Impact
- Table now displays cases in alphabetical order by classification
- No other functionality affected
- All other UI elements (buttons, notes, content sections) remain unchanged
- Sorting updates dynamically when records change (AnimatedBuilder watches appStore)
