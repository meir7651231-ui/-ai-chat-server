# Price Sorting Implementation for peruk12 App

## Summary
Successfully added price (מחיר) sorting to the cases table in the peruk12 app, with prices sorted numerically in ascending order (cheapest first).

## Changes Made
**File:** `machtzev/generator/specs-ds/peruk12.txt`

**Changed line 10 from:**
```
חלקיק תיק: [טבלה]
```

**To:**
```
חלקיק תיק: [טבלה] | מיון: מחיר עולה
```

## How It Works
The table sorting uses the spec-lang syntax for tables:
- `[טבלה]` - declares a table particle
- `| מיון: <field> <direction>` - adds sorting directive
- `מחיר` - field name (price)
- `עולה` - ascending sort (cheapest first)

## Verification

### 1. Spec Parsing ✓
The particles.mjs generator correctly parses the sort directive:
- File: `machtzev/generator/particles.mjs` lines 124-138
- Extracts sort keys: `{field: 'מחיר', desc: false}`

### 2. Code Generation ✓
Generated table code in `new/dart-gen-bs/gen_app_peruk12_px1.dart` line 25:
```dart
appStore.records('app_peruk12_ent1').toList()..sort((a, b) {
  { 
    final x = a['מחיר'] ?? '', y = b['מחיר'] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
    final nx = num.tryParse(x), ny = num.tryParse(y); 
    final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); 
    if (c != 0) return c; 
  } 
  return 0; 
})
```

### 3. Sort Algorithm ✓
The generated code correctly:
- Extracts the price field (מחיר) from each record
- Handles empty values (puts them last)
- **Parses as numbers first** using `num.tryParse()`
- Compares numerically with `nx.compareTo(ny)` when both are numbers
- Falls back to lexical comparison only for non-numeric values
- Sorts ascending (no `desc` negation) = cheapest first

### 4. Generator Success ✓
```
✓ autoskin: 27 תפקידים נבחרו מבנית
✓ autologic: 30 פעולות-לוגיקה × 850 מנועים
```

## Testing Notes
- No existing functionality broken (all core checks pass)
- Numeric sorting ensures "100" < "20" (numeric) not "20" < "100" (lexical)
- Empty prices sort last
- Sorting applies at render time (live, reactive)

## Files Modified
1. `machtzev/generator/specs-ds/peruk12.txt` - spec definition
2. Generated files (auto-generated, do not edit):
   - `new/dart-gen-bs/gen_app_peruk12_px1.dart` - particle screen with sort
   - `new/dart-data-bs/auto/gen_app_peruk12_px1_content.dart` - constants
