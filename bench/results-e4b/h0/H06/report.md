# Price Sorting Implementation for peruk12 App

## Task Completed
Added numeric price sorting (cheapest first) to the cases table in the peruk12 app generated from `machtzev/generator/specs-ds/peruk12.txt`.

## Changes Made

### 1. Shell List View (`new/dart-gen-bs/gen_app_peruk12_shell.dart`)
- **Location:** `_RootTab` class, line 43-48
- **What:** Added sorting to the main cases list displayed in the app's root tab
- **How:** Records fetched from `appStore.records('app_peruk12_ent1')` are sorted by the 'מחיר' (price) field before rendering as `DsNavTile` items
- **Sorting Logic:**
  - Parses each case's price as a double
  - Removes comma thousands separators before parsing
  - Uses 0 as default for empty/missing/invalid prices
  - Compares numerically (not as strings)
  - Ascending order: cheapest first

### 2. Data Grid Table (`new/dart-gen-bs/gen_app_peruk12_px1.dart`)
- **Location:** `GenAppPeruk12Px1Screen.build()`, line 25-32
- **What:** Added sorting to the detailed cases table (data grid/particle)
- **How:** Records are extracted, sorted by price, then passed to `ForgeDataGrid` for rendering
- **Implementation:** Identical sorting logic to shell view, using the constant `gen_app_peruk12_px1_c10` for the price field

## Technical Details

**Sorting Formula:**
```dart
rs.sort((a, b) {
  final priceA = double.tryParse((a['מחיר'] ?? '').replaceAll(',', '').trim()) ?? 0;
  final priceB = double.tryParse((b['מחיר'] ?? '').replaceAll(',', '').trim()) ?? 0;
  return priceA.compareTo(priceB);
});
```

**Key Features:**
- Numeric comparison (not lexicographic)
- Handles formatted prices with comma separators (e.g., "42,000" → 42000.0)
- Gracefully handles missing/invalid values (defaults to 0)
- Cheapest cases appear first
- Changes only the display order, not the underlying data

## Verification

1. ✅ Police check (--fast) passed: goldquarry, rendermodule, retarget, sentence, core, coredart, fragops, autoskin, autologic, skingolden all passed
2. ✅ No breaking changes to surrounding code
3. ✅ Sorting applied to both user-facing table displays (shell list + data grid table)
4. ✅ Syntax is valid Dart with proper string handling for Hebrew field names
5. ✅ No regression in other screens (home today view, report screen unaffected)

## Files Modified
- `new/dart-gen-bs/gen_app_peruk12_shell.dart` (5 lines added)
- `new/dart-gen-bs/gen_app_peruk12_px1.dart` (8 lines added)

## How to Know It Works
When viewing the peruk12 app:
1. **Main list** (תיק tab): Cases now display in ascending price order
2. **Detailed table** (via px1 screen): Data grid rows sorted by מחיר column, lowest to highest
3. Cases with missing prices default to sorting as 0 (appear first)
4. Comma-formatted prices (e.g., 42,500) are correctly parsed as numbers
