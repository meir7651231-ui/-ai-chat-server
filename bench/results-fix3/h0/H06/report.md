# Peruk12 Table Sorting Fix — Report

## What Was Done

Modified the peruk12 app's table particle to sort by price (מחיר) numerically, cheapest first.

### Changes Made

1. **Updated spec**: `machtzev/generator/specs-ds/peruk12.txt`
   - Line 10: Changed `חלקיק תיק: [טבלה]` to `חלקיק תיק: [טבלה] | מיון: מחיר עולה`
   - This adds a sort specification to the table particle definition

2. **Regenerated app**: Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin`
   - Generator created `new/dart-gen-bs/gen_app_peruk12_px1.dart` with embedded sort logic
   - Sorting uses numeric comparison: tries `num.tryParse()` first, falls back to text comparison
   - Empty values sort to the end

## How It Works

The generated code in `gen_app_peruk12_px1.dart` line 25 includes:
```dart
..sort((a, b) { 
  { 
    final x = a[gen_app_peruk12_px1_c7] ?? '', y = b[gen_app_peruk12_px1_c7] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
    final nx = num.tryParse(x), ny = num.tryParse(y); 
    final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); 
    if (c != 0) return c; 
  } 
  return 0; 
})
```

- Field `gen_app_peruk12_px1_c7` is 'מחיר' (verified in content file)
- Numeric values compared numerically (1000 < 5000, not 1000 < 5000 as text)
- Text values compared as text fallback
- Empty/null values sorted to end

## Verification

1. **Spec syntax valid**: Used correct Hebrew keywords from spec-lang.data.json
   - "מיון" = sort keyword
   - "עולה" = ascending (cheapest first)

2. **Generator produced correct output**: Police check completed, peruk12 app successfully regenerated
   - No new errors introduced
   - Particle identified: "טבלה מיון מחיר עולה"
   - Sort logic generated correctly

3. **No breakage**: Generator applied to full app context
   - 6/6 particles wired
   - 7 screens generated
   - All content and structure preserved
