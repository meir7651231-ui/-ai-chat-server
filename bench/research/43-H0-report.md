# Report: Sort People List by Distance and Show Real Distance in km

## Changes Made

### 1. Spec Modification: `machtzev/generator/specs-ds/panuy.txt`
- **Line 12**: Changed `חלקיק אדם: מרחק בריבוע` to `חלקיק אדם: מרחק בקמ`
- **Effect**: The particle for people list now displays real distance in kilometers (computed as sqrt of squared distance) instead of the squared distance value
- The spec already defined `מרחק בקמ = sqrt(מרחק בריבוע)` on line 4, so this was just wiring it to display

### 2. Code Generation: `machtzev/generator/particles.mjs`
- **Lines 385-389**: Modified table generation to sort records by distance
- **Implementation**:
  - Auto-detect distance field in entity schema (looks for "מרחק" + "קמ")
  - Generate Dart sort code: `.toList()..sort((a, b) => compareTo(numParse(distance), numParse(distance)))`
  - Sorts numerically in ascending order (nearest first)
  - Fallback to any distance-like field if exact match not found

**Generated Dart Code** (gen_app_panuy_px1.dart line 34):
```dart
appStore.records('app_panuy_ent1').toList()..sort((a, b) => 
  (num.tryParse(a['מרחק בקמ'] ?? '0') ?? 0).compareTo(
   num.tryParse(b['מרחק בקמ'] ?? '0') ?? 0))
```

## How It Works

1. **Distance Calculation**: The spec already defines `מרחק בקמ = sqrt(מרחק בריבוע)`, which calculates the actual Euclidean distance using the haversine-like formula with scale factors (12321 for latitude, 8649 for longitude)

2. **List Sorting**: When the table particle renders, records are sorted by the `מרחק בקמ` field numerically in ascending order, putting nearest people first

3. **Display**: The individual particle for distance (line 12) now shows `מרחק בקמ` instead of `מרחק בריבוע`, so users see the real distance value in km, not a squared intermediate

## Verification

✓ **Generator Test**: All 448 particles across 32 specs pass - no breakage
✓ **Spec Syntax**: Valid Hebrew particle definitions
✓ **Generated Code**: Correct Dart sort syntax with proper null handling
✓ **Distance Field**: Correctly identified and used for sorting
✓ **Type Safety**: Numeric parsing with fallback (tryParse) prevents runtime errors

## Files Modified

1. `/tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad/repos/exp-H0/machtzev/generator/specs-ds/panuy.txt` - 1 line changed
2. `/tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad/repos/exp-H0/machtzev/generator/particles.mjs` - 4 lines modified

## Output

The generated Flutter/Dart app now:
- Shows distance in real km units (not squared values)
- Sorts the people list by nearest distance first
- Maintains all other functionality and particles
