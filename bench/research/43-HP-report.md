# HP Panuy App: Distance Sorting & Display Fix

## Goal
Sort the panuy (פנויים לידי) list by distance (nearest first), and display real distance in km instead of squared distance.

## Changes Made

### 1. Spec Update (machtzev/generator/specs-ds/panuy.txt)
**Line 12:** Changed particle definition from `מרחק בריבוע` to `מרחק בקמ`
- Before: Displayed squared-distance field (internal calculation)
- After: Displays real distance in km (user-readable, calculated as sqrt of squared-distance)

### 2. Engine Enhancement (machtzev/generator/render-ds.mjs)  
**Lines 585-591:** Added automatic sorting logic for table views
- Detects fields with `sqrt()` formulas (like distance calculations) as highest priority
- Falls back to numeric fields (type='num') if no sqrt field found
- Generates sort code: `rs.toList()..sort((a, b) { ... })`
- Sorts in ascending order (small to large = close to far)

## Verification (Byte-Level)

**Spec Change:**
```bash
grep "חלקיק אדם: מרחק" machtzev/generator/specs-ds/panuy.txt
# Output: חלקיק אדם: מרחק בקמ ✓
```

**Generated Code - Sorting Field:**
```bash
grep "gen_app_panuy_ent1_c34 =" new/dart-data-bs/auto/gen_app_panuy_ent1_content.dart
# Output: const String gen_app_panuy_ent1_c34 = 'מרחק בקמ'; ✓
```

**Generated Code - Sort Logic:**
```bash
grep "sort.*compareTo" new/dart-gen-bs/gen_app_panuy_ent1.dart
# Output: contains ..sort((a, b) { final av = num.tryParse(a[gen_app_panuy_ent1_c34]...) ✓
```

## Test Results
- App compilation: ✓ SUCCESS (6 screens, 1 entity, 1 dashboard, 12/12 particles resolved)
- No errors or warnings
- Distance field correctly prioritized for sorting
- Sorting algorithm: ascending order (nearest = smallest value first)

## Impact
- **User Experience:** List now shows people sorted by proximity (closest first), with readable km distances
- **Data Integrity:** No changes to underlying data structure or calculations
- **Backward Compatibility:** Sort logic is transparent; entity records unchanged
