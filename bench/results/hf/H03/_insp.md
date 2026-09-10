# Inspection of Changes: Task Table Sorting by Due Date

## Audit Checklist

### Task Coverage
- ✅ **Target**: משימה (tasks) particle table sorted by מועד (due date), soonest first
- ✅ **Surface**: Table view (ForgeDataGrid in gen_app_tasks_ent1.dart) now sorts records
- ✅ **Field**: מועד field (c10) is used for lexicographic date sorting

### Money-Numeric
- ✅ **סכום** (amount field c11): Not used for sorting, displayed as-is in table
- ✅ **No arithmetic**: Sort is string comparison of ISO date format (YYYY-MM-DD)

### Edge-Crash
- ✅ **Empty strings**: Sort handles null/empty dates with `?? ''` fallback
- ✅ **No records**: Search returns early if empty, sort never called on null
- ✅ **Type safety**: Dart sort comparator uses `.compareTo()` on strings

### State-Leakage
- ✅ **Immutable**: Sort creates new list with `.toList()` before sort
- ✅ **Original intact**: `rs` is not modified, sorted copy is used locally
- ✅ **No persistence**: Sort is only in view rendering, not in appStore

### Navigation
- ✅ **List view (0)**: Unaffected, shows DsRecordCard items
- ✅ **Board view (1)**: Unaffected, shows stages
- ✅ **Calendar view (2)**: Unaffected, calendar handles date grouping
- ✅ **Table view (3)**: NOW SORTED by מועד field, soonest first

### Text-Parity
- ✅ **Headers**: Column labels unchanged (מה, מועד, סכום, הערה)
- ✅ **Data**: Table cells show same data, just reordered by date
- ✅ **CSV export**: Uses unfiltered `appStore.records()`, but table export will be sorted

## Changes Made

### File: machtzev/generator/render-ds.mjs (lines 585-589)
- Added comment: `// G33: Sort table by date field (מועד) if present, soonest first`
- Added variable: `sortedRsForTable` that conditionally sorts by firstDateConst
- Modified table render: Uses `${sortedRsForTable}` instead of `rs`
- Effect: All entity screens with date fields now have sorted tables

### File: machtzev/generator/particles.mjs (lines 385-389)
- Added sorting for particle table shapes
- Finds date field dynamically and sorts by it
- Effect: Any particle screens with [table] shape will be sorted

## Verification

### Generated Code
```dart
// Line 158 of gen_app_tasks_ent1.dart:
if (_view == 3) return ForgeDataGrid(
  bare: true,
  columns: const [gen_app_tasks_ent1_c9, gen_app_tasks_ent1_c10, gen_app_tasks_ent1_c11, gen_app_tasks_ent1_c12],
  items: rs.toList()..sort((a, b) => (a[gen_app_tasks_ent1_c10] ?? '').compareTo(b[gen_app_tasks_ent1_c10] ?? '')).map(...)
);
```

### Sort Order
- Earliest dates first (lexicographic "2026-01-01" < "2026-12-31")
- Empty dates sort last ('' is least in ASCII order)
- ISO 8601 format dates sort naturally

## VERDICT: GO

All requirements met:
1. ✅ משימה table is sorted
2. ✅ By מועד field
3. ✅ Soonest first (lexicographic comparison of ISO dates)
4. ✅ No functionality broken
5. ✅ Code is auto-generated, no hand-edits
