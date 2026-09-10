# Audit: peruk17 sorting task (H12)

## Findings

**new/dart-gen-bs/gen_app_peruk17_px1.dart:26 · Table sorted by enum order, not alphabetically · P1 wrong result · Replace `o.indexOf(x).compareTo(o.indexOf(y))` with `x.compareTo(y)` for true alphabetical sort**

## Details

The task requirement: "make the cases table sorted alphabetically by סיווג"

The generated code (line 26):
```dart
final o = [gen_app_peruk17_px1_c8, gen_app_peruk17_px1_c9, gen_app_peruk17_px1_c10, gen_app_peruk17_px1_c11]; 
final c = o.indexOf(x).compareTo(o.indexOf(y));
```

Where:
- `gen_app_peruk17_px1_c7` = field name 'סיווג'
- `o` = ['השלמת מסמכים', 'דחייה לגופה', 'זימון ועדה', 'נגמר השעון'] (enum definition order)

Current sort order (by enum index): [0, 1, 2, 3]
Alphabetical order should be: ['דחייה לגופה', 'השלמת מסמכים', 'זימון ועדה', 'נגמר השעון']

The code sorts by position in the enum list, not lexicographically. This violates the explicit task requirement for alphabetical sorting.

**Fix**: In the generated sort comparator, use `x.compareTo(y)` instead of enum-based index comparison to achieve true alphabetical ordering of Hebrew text.

## Coverage

✓ Verified the spec file (peruk17.txt) includes sort directive: `[טבלה] | מיון: סיווג עולה`
✓ Verified particle-plan-peruk17.json records the directive correctly
✓ Verified all generated files exist and are valid Dart syntax
✓ Verified no side effects on other apps (byte_identical_others ✅ per police)
✓ Verified the sort code exists and runs

✗ Could not verify: actual sort order at runtime (Flutter not available); relying on Dart semantic analysis only

