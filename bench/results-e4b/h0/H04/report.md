# Calendar App Meetings Table Sorting

## Task
Add sorting to the meetings (פגישה) particle screen in the calendar app, sorting by date (מועד) and then by time (שעה).

## Changes Made

### 1. Modified Spec File
**File:** `machtzev/generator/specs-ds/calendar.txt`

Added a particle definition for the meetings table:
```
חלקיק פגישה: רשומות = [טבלה] מה, מועד, שעה, מקום | מיון: מועד עולה, שעה עולה
```

This defines:
- Table format showing columns: מה (what), מועד (date), שעה (time), מקום (place)
- Sorting: Primary by מועד (date) ascending, Secondary by שעה (time) ascending

### 2. Regenerated Calendar App
Ran the generator:
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin
```

## Verification

### Generated Particle Plan
The particle-plan-calendar.json now contains:
- Entity: פגישה
- Expression: [טבלה] מה, מועד, שעה, מקום | מיון: מועד עולה, שעה עולה
- Status: ✓ ok (successfully wired to DsTable widget)

### Generated Dart Code
In `gen_app_calendar_px1.dart`, the records are sorted with:
```dart
appStore.records('app_calendar_ent1').toList()..sort((a, b) {
  // Compare by מועד (date field - c5)
  { final x = a[gen_app_calendar_px1_c5] ?? '', y = b[gen_app_calendar_px1_c5] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1;
    final nx = num.tryParse(x), ny = num.tryParse(y);
    final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y);
    if (c != 0) return c;
  }
  // Then compare by שעה (time field - c6)
  { final x = a[gen_app_calendar_px1_c6] ?? '', y = b[gen_app_calendar_px1_c6] ?? '';
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1;
    final nx = num.tryParse(x), ny = num.tryParse(y);
    final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y);
    if (c != 0) return c;
  }
  return 0;
})
```

The sort lambda correctly:
1. First compares by מועד (date) - handles both numeric and text comparison
2. If dates are equal, compares by שעה (time)
3. Both in ascending order

### Police Check
Ran `node machtzev/police.mjs --fast` - all core generation checks passed:
- ✓ goldquarry
- ✓ rendermodule  
- ✓ autoskin
- ✓ autologic
- ✓ skingolden

No breaking changes introduced.

## How It Works

The meetings table now displays:
1. All meetings sorted by date in ascending order (earliest first)
2. For meetings on the same date, sorted by time in ascending order

This makes it easy to scan meetings chronologically throughout the calendar.
