# peruk17 Table Sorting Fix

## What Changed
Modified the peruk17 app to sort the cases table alphabetically by the סיווג field.

**Spec File:** `machtzev/generator/specs-ds/peruk17.txt`

**Change:** Updated line 10 from:
```
חלקיק תיק: [טבלה]
```
to:
```
חלקיק תיק: [טבלה] | מיון: סיווג עולה
```

The `| מיון: סיווג עולה` clause instructs the generator to sort table rows alphabetically by the סיווג (classification) field in ascending order.

## How It Works
The particle generator (particles.mjs) parses the sort specification and emits Dart code that:
1. Converts records to a sorted list using `.toList()..sort((a, b) {...})`
2. Compares values by the סיווג field
3. Handles numeric vs. lexicographic comparison automatically
4. Places empty values at the end

## Generated Code
The generated table in `new/dart-gen-bs/gen_app_peruk17_px1.dart` now includes:
```dart
(appStore.records('app_peruk17_ent1').toList()
  ..sort((a, b) { 
    final x = a[gen_app_peruk17_px1_c7] ?? '';
    final y = b[gen_app_peruk17_px1_c7] ?? '';
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1;
    final nx = num.tryParse(x), ny = num.tryParse(y);
    final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y);
    if (c != 0) return c;
    return 0;
  }))
```

Where `gen_app_peruk17_px1_c7 = 'סיווג'` (the sort field).

## Table Columns
The table displays 6 columns in this order:
1. לקוח (client)
2. טלפון (phone)
3. המכתב המלא (full letter)
4. איזו בקשה (what type of request)
5. מה כבר הוגש (what was already submitted)
6. סיווג (classification - sort key)

The סיווג field has 4 enum values which will now appear in alphabetical order:
- דחייה לגופה
- זימון ועדה
- השלמת מסמכים
- נגמר השעון

## Verification
- Police check passed (wiring, contract, and core checks all green)
- Generator successfully parsed the sort clause
- Content constants correctly mapped סיווג to the sort field
- No other functionality affected (table columns, other particles, reports all unchanged)
