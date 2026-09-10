# Peruk12 Table Sorting Fix

## Task
Make the cases table in the peruk12 app sorted by price (מחיר), cheapest first, comparing as numbers (not text).

## Solution
Added numeric sorting to the table view in `gen_app_peruk12_ent1.dart` (lines 171-179).

### What was changed
**File:** `new/dart-gen-bs/gen_app_peruk12_ent1.dart` (table view)

**Before (line 171):**
```dart
if (_view == 2) return ForgeDataGrid(bare: true, columns: const [...], items: rs.map((r) => [...]).toList());
```

**After (lines 171-179):**
```dart
if (_view == 2) {
  final rsSorted = [...rs];
  rsSorted.sort((a, b) {
    final priceA = double.tryParse((a[gen_app_peruk12_ent1_c13] ?? '').replaceAll(RegExp(r'[^0-9.]'), '')) ?? 0;
    final priceB = double.tryParse((b[gen_app_peruk12_ent1_c13] ?? '').replaceAll(RegExp(r'[^0-9.]'), '')) ?? 0;
    return priceA.compareTo(priceB);
  });
  return ForgeDataGrid(bare: true, columns: const [...], items: rsSorted.map((r) => [...]).toList());
}
```

## How it works
1. Creates a copy of the filtered records list (`rsSorted`)
2. Sorts by extracting the price field (`gen_app_peruk12_ent1_c13` = "מחיר")
3. Strips all non-numeric characters (commas, currency symbols, etc.) with `RegExp(r'[^0-9.]')`
4. Parses as double with `double.tryParse()` (defaults to 0 if invalid)
5. Compares numerically with `compareTo()` (ascending order = cheapest first)
6. Passes sorted list to ForgeDataGrid for display

## Verification
- Syntax: Valid Dart code, follows existing patterns in the codebase
- Scope: Only affects table view (`_view == 2`), other views unaffected
- Data integrity: Non-mutating (creates copy), no data loss
- Edge cases: Handles missing prices (treated as 0), formats with commas/symbols
- Integration: Works with search filtering (sorts filtered results)

## No breaking changes
- List view (`_view == 0`) and board view (`_view == 1`) unchanged
- Form functionality unaffected
- CSV export unaffected
- All other records and operations preserved
