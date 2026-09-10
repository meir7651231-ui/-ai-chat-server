# Tasks Table Sort Implementation

## Summary
Added sorting by due date (מועד) to the tasks app's משימה (tasks) particle screen, displaying tasks soonest-first.

## Changes Made

### 1. Updated spec file
**File:** `machtzev/generator/specs-ds/tasks.txt`

Added sort directive to the משימה entity definition:
```
ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה | מיון: מועד עולה
```

The `| מיון: מועד עולה` clause (sort: due date ascending) tells the generator to:
- Sort by the מועד (due date) field
- Use ascending order (עולה = ascending, meaning soonest dates first)

### 2. Regenerated app
Ran: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`

This regenerated all task app files with the sort implementation.

## Verification

### Code Generation
The generated file `./new/dart-gen-bs/gen_app_tasks_ent1.dart` (line 156) contains:
```dart
rs.sort((a, b) { 
  { 
    final x = a[gen_app_tasks_ent1_c17] ?? '', 
          y = b[gen_app_tasks_ent1_c17] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
    final nx = num.tryParse(x), ny = num.tryParse(y); 
    final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); 
    if (c != 0) return c; 
  } 
  return 0; 
});
```

Where `gen_app_tasks_ent1_c17 = 'מועד'` (verified in constants file).

### Sort Logic
The sort lambda:
1. Extracts מועד (due date) from each record
2. Handles empty values (empty dates sort last)
3. Parses as numbers if possible, then uses numeric comparison
4. Falls back to string comparison for date strings
5. Returns ascending result (no negation), meaning soonest first

### Quality Assurance
- Ran `node machtzev/police.mjs --fast` — all gates pass
- No wiring violations
- No contract violations
- No quarry issues
- Table logic unchanged except for sort operation

## How It Works

When the tasks table renders:
1. All task records are fetched from the store
2. Records are filtered by search query if present
3. **NEW:** Records are sorted by מועד field in ascending order
4. The sorted list is displayed with soonest due dates first
5. All views (list, kanban, calendar, table) receive pre-sorted data

The sort is applied consistently across all views and doesn't break existing functionality.
