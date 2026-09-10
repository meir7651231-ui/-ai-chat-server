# Report: Panuy App Distance Sorting Fix

## Changes Made

### 1. Spec File Modification (`machtzev/generator/specs-ds/panuy.txt`)

**Line 6 - Added sorting to table particle:**
- Before: `חלקיק אדם: [טבלה]`
- After: `חלקיק אדם: [טבלה] | מיון: מרחק בקמ עולה`
- Effect: Table now sorts by distance ascending (nearest first)

**Line 12 - Changed displayed distance field:**
- Before: `חלקיק אדם: מרחק בריבוע`
- After: `חלקיק אדם: מרחק בקמ`
- Effect: Lists show real distance in km (sqrt of squared-distance) instead of squared values

### 2. Entity Definition (Already Present in Line 4)
The entity `אדם` already contained:
- Field calculation: `מרחק בקמ = sqrt(מרחק בריבוע)`
- This uses the built-in `sqrt()` function to convert squared distance to km

## Verification

**Code Generation:**
- App regenerated successfully: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
- Output: 6 screens generated, 12/12 particles found and wired

**Generated Dart Code (`gen_app_panuy_px1.dart`):**
- Sorting field identified: `gen_app_panuy_px1_c15 = 'מרחק בקמ'`
- Numeric comparison used: `nx.compareTo(ny)` for ascending sort
- Displayed field: `gen_app_panuy_px1_c27 = 'מרחק בקמ'`
- Sorting applied in ForgeDataGrid: `.toList()..sort((a, b) { ... })`

**Particle Definition Comment:**
```
טבלה מיון מרחק בקמ עולה = [טבלה] | מיון: מרחק בקמ עולה
מרחק בקמ = מרחק בקמ ⇒ raw ⇒ [fact] ⇒ DsChip
```

## No Breaking Changes

- Entity schema unchanged; calculated field `מרחק בקמ` already existed
- Only particle/display layer modified
- All 12 particles correctly wired
- No validation errors in spec-lang parsing
