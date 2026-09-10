# Task Report: Panuy App Sorting & Distance Display

## Changes Made

Modified `machtzev/generator/specs-ds/panuy.txt` to:

1. **Line 6**: Added sorting specification to table particle
   - Before: `חלקיק אדם: [טבלה]`
   - After: `חלקיק אדם: [טבלה] | מיון: מרחק בקמ עולה`
   - Effect: Table now sorts by distance ascending (nearest first)

2. **Line 12**: Changed displayed distance field
   - Before: `חלקיק אדם: מרחק בריבוע`
   - After: `חלקיק אדם: מרחק בקמ`
   - Effect: Shows real km distance instead of squared distance

## Verification

### Spec Definition
The spec already defines `מרחק בקמ = sqrt(מרחק בריבוע)` (line 4), so the real km value is calculated correctly using the square root of the squared-distance field.

### Generated Code
- Ran: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
- App generated successfully: **6 screens, 1 entity, 1 dashboard, 3 system screens, 1 board**

### Sorting Logic Verification
File: `gen_app_panuy_px1.dart` line 34 shows the correct sort comparator:
```dart
..sort((a, b) { { final x = a[gen_app_panuy_px1_c15] ?? '', y = b[gen_app_panuy_px1_c15] ?? ''; 
if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
final nx = num.tryParse(x), ny = num.tryParse(y); 
final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); 
if (c != 0) return c; } return 0; })
```
- `gen_app_panuy_px1_c15 = 'מרחק בקמ'` (numeric field)
- Numeric comparison with ascending order (nearest first)

### Content Verification
File: `gen_app_panuy_px1_content.dart`:
- Line 2: `"טבלה מיון מרחק בקמ עולה"` - sorting specification confirmed
- Lines 12, 15, 67-71: All reference `"מרחק בקמ"` - real distance field in use

## No Regressions
- All other particles remain unchanged
- All other entity fields intact
- No breaking changes to data structure
- Police checks show only pre-existing issues (unrelated git objects & INDEX entries)
