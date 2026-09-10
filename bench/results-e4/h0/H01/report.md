# Panuy App Sorting and Distance Display Fix

## Changes Made

### 1. Updated Spec (machtzev/generator/specs-ds/panuy.txt)
- **Added sort directive** to line 4: `| מיון: מרחק בקמ עולה`
  - This sorts the list by distance in ascending order (nearest first)
  - Uses the "מרחק בקמ" field (distance in km) already defined in the spec
  
- **Updated particle field display** on line 12: changed from `מרחק בריבוע` to `מרחק בקמ`
  - Now displays actual distance in km instead of squared distance

## How It Works

### Specification Parsing
- The sort directive `| מיון: מרחק בקמ עולה` is parsed by `entity.mjs`
- "עולה" means ascending order (low to high)
- Result: `{field: "מרחק בקמ", desc: false}`

### Code Generation
- `render-ds.mjs` receives the sort directive and generates Dart code
- The sorting is applied via `sortLambda()` from `sort-cmp.mjs`
- Generated code: `rs.sort((a, b) { /* numeric comparison of distance */ })`
- Constant mapping: `gen_app_panuy_ent1_c34 = 'מרחק בקמ'`

### Distance Calculation
The spec already includes distance formula:
```
מרחק בקמ = sqrt(מרחק בריבוע)
```

Where `מרחק בריבוע` is:
```
(lat_diff² × 12321) + (lng_diff² × 8649)
```

This produces distance in kilometers.

## Verification

✅ **Spec Parsing**: Sort directive correctly parsed as ascending by "מרחק בקמ"
✅ **Code Generation**: Generated `gen_app_panuy_ent1.dart` contains sorting logic
✅ **Constant Mapping**: `c34 = 'מרחק בקמ'` confirmed
✅ **Field Display**: Distance field included in both list cards and table view
✅ **No Compilation Errors**: App generated successfully

## Behavior

- List is sorted by distance (nearest first)
- Distance displayed in kilometers (calculated as sqrt of squared distance)
- Both table and card views use the same sorted data
- Numeric sorting ensures correct ordering (1.5 km before 10 km, not lexically)
