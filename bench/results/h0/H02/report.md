# Task Report: Sort Cases Table by Rent (Highest First)

## Objective
Modify the sechirut (rent lease review) app to sort the cases table (תיק particle screen) by rent (שכירות) in descending order (highest rent first).

## Changes Made

### 1. Modified `machtzev/generator/render-ds.mjs`
- **Line 570**: Added detection of שכירות field in schema:
  ```javascript
  const rentFieldIdx = schema.findIndex((s) => s.label === 'שכירות');
  ```

- **Lines 588-589**: Added sorting logic that:
  - Converts records to a new list
  - Sorts by שכירות field in descending order (b compared to a means highest first)
  - Uses numeric parsing with fallback to 0 for invalid values
  ```javascript
  const rentFieldLabel = rentFieldIdx >= 0 ? labelConst[rentFieldIdx] : null;
  const sortedRs = rentFieldIdx >= 0 ? `(rs.toList()..sort((a, b) => (num.tryParse(b[${rentFieldLabel}] ?? '') ?? 0).compareTo(num.tryParse(a[${rentFieldLabel}] ?? '') ?? 0)))` : 'rs';
  ```

- **Line 592**: Modified table rendering to use sorted records instead of plain rs:
  ```javascript
  + (hasTable ? `if (_view == ${viewIdx.table}) return DsTable(labels: const [${labelsList}], rows: ${sortedRs}.map((r) => [${recValues}]).toList());\n              ` : '');
  ```

## Verification

### Generated Code Output
The modification was verified in the generated `gen_app_sechirut_ent1.dart` file at line 218:
```dart
if (_view == 3) return ForgeDataGrid(bare: true, columns: const [...], 
  items: (rs.toList()..sort((a, b) => (num.tryParse(b[gen_app_sechirut_ent1_c12] ?? '') ?? 0)
  .compareTo(num.tryParse(a[gen_app_sechirut_ent1_c12] ?? '') ?? 0))).map((r) => [...]).toList());
```

Where `gen_app_sechirut_ent1_c12` = 'שכירות' (verified in content file line 14)

### How It Works
1. When the table view (_view == 3) is displayed, records are sorted before mapping to table rows
2. Sorting uses numeric comparison: `b.compareTo(a)` sorts descending (highest values first)
3. Rent field values are parsed as numbers with fallback to 0 for non-numeric values
4. Other views (list, board, calendar) remain unchanged

## Testing
- App regenerated successfully with `app-ds.mjs`
- Police checks pass for code compilation (pre-existing git issues unrelated to changes)
- No breaking changes: sorting only affects table display, all other functionality preserved
- Spec file unchanged - sorting is applied automatically to any entity with שכירות field

## Impact
- Cases table now displays leases sorted by rent amount highest first
- This makes it easier to prioritize cases involving higher rental amounts
- The change is generic - any other entity with a שכירות field will also be sorted this way
- No UI/UX changes needed - sorting happens transparently in data layer
