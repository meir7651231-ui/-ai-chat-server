# Calendar App Sorting Implementation Report

## Task
Make the meetings table (פגישה particle screen) in the calendar app sorted by date (מועד) and then by time (שעה).

## Changes Made

### 1. Updated Spec File
**File:** `machtzev/generator/specs-ds/calendar.txt`

Added sorting directive to entity definition:
```
ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים | מיון: מועד עולה, שעה עולה
```

The `| מיון: מועד עולה, שעה עולה` clause tells the generator to sort records by:
- Primary: מועד (date) in ascending order (עולה)
- Secondary: שעה (time) in ascending order (עולה)

### 2. Regenerated Calendar App
**Command:** `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`

The generator processed the sorting directive and automatically:
- Added sort constants (c16='מועד', c17='שעה') to content file
- Injected sorting logic into the generated screen class

### 3. Sorting Implementation
**File:** `new/dart-gen-bs/gen_app_calendar_ent1.dart` (line 157)

Generated sorting code:
```dart
rs.sort((a, b) { 
  // Sort by מועד (c16) first
  { final x = a[c16] ?? '', y = b[c16] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
    final c = numCompare(x, y); 
    if (c != 0) return c; 
  } 
  // Then by שעה (c17)
  { final x = a[c17] ?? '', y = b[c17] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
    final c = numCompare(x, y); 
    if (c != 0) return c; 
  } 
  return 0; 
});
```

## How It Works
1. Meetings are filtered by search query (if any)
2. Filtered list is sorted by the above logic before being displayed
3. Sorting applies to all views: list, board, calendar, and table
4. Empty date fields appear last, followed by records sorted numerically (if dates) or lexicographically
5. Records with equal dates are sorted by time

## Verification
- Spec file updated with correct sorting syntax ✓
- Generator ran successfully without errors ✓
- Generated code contains proper sort logic ✓
- Constants mapped correctly (c16=מועד, c17=שעה) ✓
- Sorting applies to filtered results before rendering ✓

## Non-Breaking
- No existing code was modified manually
- Change is purely additive (spec-driven)
- All views (list, board, calendar, table) inherit the sorting
- Form, search, and other functionality unchanged
