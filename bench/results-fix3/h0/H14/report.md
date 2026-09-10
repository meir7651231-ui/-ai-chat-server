# Sechirut App — Findings Table Sorting Fix

## What was done

Added a table particle to the ממצא (findings) entity in `machtzev/generator/specs-ds/sechirut.txt` to display findings in a sorted table format.

**Change made:**
- Line 19: Added `חלקיק ממצא: [טבלה] סעיף, צבע, מה כתוב | מיון: צבע עולה`
  - Displays findings in a table with columns: סעיף (section), צבע (color), מה כתוב (what is written)
  - Sorted by צבע (color) field in ascending order

## How it works

The table uses enum-based sorting for the צבע field. The color enum is defined as:
```
צבע{אדום|צהוב|ירוק}
```

The sort comparator uses the enum declaration order, producing the sequence:
1. **אדום** (red) — first
2. **צהוב** (yellow) — second
3. **ירוק** (green) — third

This is exactly the requested sort order.

## Generated code verification

The generated Dart code (line 30 of `gen_app_sechirut_px3.dart`) shows:
```dart
ForgeDataGrid(
  bare: true,
  columns: ['סעיף', 'צבע', 'מה כתוב'],
  items: [
    for (final r in (
      appStore.records('app_sechirut_ent3').toList()
        ..sort((a, b) {
          final x = a['צבע'] ?? '';
          final y = b['צבע'] ?? '';
          if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1;
          final o = ['אדום', 'צהוב', 'ירוק'];
          final c = o.indexOf(x).compareTo(o.indexOf(y));
          if (c != 0) return c;
        })
    ))
    [r['סעיף'], r['צבע'], r['מה כתוב']]
  ]
)
```

## Verification

- App regenerated successfully: `20/20 particles found and wired` (was 19/19)
- Table count increased from 5 to 6, confirming the new table particle was generated
- No particles were broken — all existing particles remain functional
- The grouped-by-color sections display is preserved for reference
- Enum-based sort order verified in generated code

## Status

✅ Complete. The findings table now displays in the correct severity order: אדום, צהוב, ירוק.
