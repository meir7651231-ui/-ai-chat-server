machtzev/generator/specs-ds/tasks.txt:8 · duplicate particle definition: identical line 7 "חלקיק משימה: [טבלה] | מיון: מועד עולה" repeated on line 8 causes two identical tables in gen_app_tasks_px1.dart:19-20 rendering same data twice · P2 minor · delete line 8

## Coverage

**Verified correct:**
- Sorting field: Both ForgeDataGrid tables (px1.dart:19-20) sort by 'מועד' (due date) field, correctly identified as gen_app_tasks_px1_c5 and gen_app_tasks_px1_c15 in content.dart
- Sort order: Both use ascending order comparator (empty values last, then numeric/lexical ascending) — correct for "מיון: מועד עולה" (ascending)
- Sorting logic: Null-safe extraction with `?? ''`, empty-handling, num.compareTo() for numeric dates, String.compareTo() fallback — sound Dart

**Could not verify (requires runtime):**
- Actual table rendering and sorting on sample data (no Flutter/Dart runtime)
- Hub navigation to px1 screen (traced in gen_app_tasks_hub.dart, appears wired correctly)

**Not checked (outside lens):**
- Other app surfaces (home, hub, entity list, report screens) — all exist in generated files per task spec coverage
- Orphan content files (unrelated app gen_app_panuy_*) were caught by police, not audit scope
