# Sechirut App — Findings Table Sorting Fix

## Task
Make the findings table (ממצא particle screen) sorted by severity color (צבע) in the order: אדום (red), צהוב (yellow), ירוק (green).

## Solution
Added a sort section to the ממצא entity definition in the spec file.

### Changes Made
**File:** `machtzev/generator/specs-ds/sechirut.txt` (line 9)

**Before:**
```
ישות ממצא עם תיק*, סעיף*, צבע{אדום|צהוב|ירוק}, מה כתוב, מה לבקש, נשלח{כן|לא} | מחיקה: תיק=מפל
```

**After:**
```
ישות ממצא עם תיק*, סעיף*, צבע{אדום|צהוב|ירוק}, מה כתוב, מה לבקש, נשלח{כן|לא} | מיון: צבע עולה | מחיקה: תיק=מפל
```

### How It Works
1. The sort section `| מיון: צבע עולה` (sort by צבע ascending) was added to the entity definition
2. The generator parsed the sort directive and created a comparator lambda
3. The enum values for צבע are: אדום (index 0), צהוב (index 1), ירוק (index 2)
4. Sorting in ascending order yields the desired sequence: אדום → צהוב → ירוק

### Verification
Regenerated the app using:
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin
```

**Generated code verification** (gen_app_sechirut_ent3.dart, line 159):
```dart
rs.sort((a, b) { 
  { 
    final x = a[gen_app_sechirut_ent3_c20] ?? '', 
    y = b[gen_app_sechirut_ent3_c20] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
    final o = [gen_app_sechirut_ent3_c21, gen_app_sechirut_ent3_c22, gen_app_sechirut_ent3_c23]; 
    final c = o.indexOf(x).compareTo(o.indexOf(y)); 
    if (c != 0) return c; 
  } 
  return 0; 
});
```

Where:
- c20 = 'צבע' (color field)
- c21 = 'אדום' (red)
- c22 = 'צהוב' (yellow)
- c23 = 'ירוק' (green)

The sort is applied before both the table view (ForgeDataGrid) and list view are rendered, ensuring consistent ordering.

## Impact
- ✅ Findings are now sorted by severity color by default
- ✅ Both table and list views maintain the correct sort order
- ✅ Search/filtering respects the sort order
- ✅ No other entity behavior changed
- ✅ Generator ran successfully with no new errors
