# Sechirut Table Sort - Completion Report

## Task
Make the cases table (תיק particle screen) in the sechirut app sorted by rent (שכירות), highest first.

## Solution
Modified the spec file to add explicit sort specification to the table particle:

### Change Made
**File**: `machtzev/generator/specs-ds/sechirut.txt` (line 22)
- **Before**: `חלקיק תיק: [טבלה]`
- **After**: `חלקיק תיק: [טבלה] | מיון: שכירות יורד`

The `| מיון: שכירות יורד` clause specifies sorting by the שכירות (rent) field in descending order (יורד = descending).

## How It Works
The generator's particle module (`machtzev/generator/particles.mjs`) parses this specification and generates a Dart sort lambda for the ForgeDataGrid widget in `gen_app_sechirut_px1.dart`:

```dart
appStore.records('app_sechirut_ent1').toList()..sort((a, b) {
  { 
    final x = a[gen_app_sechirut_px1_c19] ?? '';  // שכירות field
    final y = b[gen_app_sechirut_px1_c19] ?? '';
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1;
    final nx = num.tryParse(x), ny = num.tryParse(y);
    final c = (nx != null && ny != null) ? 
      nx.compareTo(ny) : 
      x.compareTo(y);
    if (c != 0) return -c;  // -c for descending
  }
  return 0;
})
```

## Verification
✓ App regenerated successfully with spec change
✓ Generated code is syntactically valid
✓ Sort lambda properly implemented in ForgeDataGrid widget
✓ Police validation passed for app-related checks:
  - autoskin: 27 roles selected
  - autologic: 30 operations × 850 engines
  - skingolden: 9/9 modules with forge skin
✓ Sort field confirmed as c19 = 'שכירות' (rent field)

## No Regressions
- All other table columns remain unchanged
- Other particles and screens unaffected
- App structure and logic preserved
