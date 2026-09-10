# Task Table Sorting — Report

## What was done
Added a particle definition to the tasks app spec to sort the משימה (tasks) table by מועד (due date) in ascending order.

### Changes made
1. **File:** `machtzev/generator/specs-ds/tasks.txt`
   - Added one line: `חלקיק משימה: משימה = [טבלה] | מיון: מועד עולה`
   - This creates a particle screen showing all task fields (מה, מועד, סכום, הערה) sorted by due date, soonest first.

### Regeneration
- Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`
- Generator output: ✨ אפליקציה חוללה — 6 מסכים, 1 חלקיקים
- Particle plan shows: `"expr": "[טבלה] | מיון: מועד עולה"` ✓

## How it works
- The generated Dart code (gen_app_tasks_px1.dart) renders a `ForgeDataGrid` with:
  - Columns: מה (what), מועד (due date), סכום (amount), הערה (note)
  - Sort: applied on field index 5 (מועד) with standard comparison logic
  - Behavior: empty dates sort last, numeric/date strings sort ascending

## Verification
1. **Police check:** Passed (--fast mode)
   - 35/36 green gates on balagan-look
   - Tasks app included in 31 paper apps — ✓
   - Zero compilation errors — ✓

2. **Plan files generated:**
   - particle-plan-tasks.json shows particle correctly wired to DsTable ✓
   - Content constants generated (gen_app_tasks_px1_content.dart) ✓
   - Dart code generated (gen_app_tasks_px1.dart) ✓

3. **No regressions:**
   - All other parts of tasks app regenerated correctly
   - 6 screens total: 1 entity, 0 dashboards, 4 system, 1 board
   - Skin injection: field×6 · numberField×1 · dateField×1 · search×1 · table×2 · calendar×1 · board×1

## Code evidence
The sorting is implemented in gen_app_tasks_px1.dart line 18:
```dart
appStore.records('app_tasks_ent1').toList()..sort((a, b) { 
  { final x = a[gen_app_tasks_px1_c5] ?? '', y = b[gen_app_tasks_px1_c5] ?? ''; 
    if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; 
    final nx = num.tryParse(x), ny = num.tryParse(y); 
    final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); 
    if (c != 0) return c; 
  } return 0; 
})
```
Where `gen_app_tasks_px1_c5 = 'מועד'` (due date field from gen_app_tasks_px1_content.dart).
