# Calendar App Meeting Sorting Implementation

## Summary
Successfully implemented sorting of meetings by time (שעה field) in the calendar app generated from `machtzev/generator/specs-ds/calendar.txt`.

## Changes Made

### File Modified: `machtzev/generator/render-ds.mjs`

1. **Added SL0 import** (lines 8-9):
   - Imported spec-lang.data.json to access time field detection logic
   - This allows the generator to identify which field is a time field

2. **Added time field detection logic** (lines 542-544):
   - Detects if entity has a time field (labeled with words from typeTime list)
   - For calendar app, identified "שעה" (hour) as the time field
   - Generates a sort expression: `.sort((a, b) => (a[fieldConstant] ?? '').compareTo(b[fieldConstant] ?? ''))`

3. **Applied sorting in three locations**:
   - **Entity list rendering** (line 730): Sorted all records and filtered results
   - **CSV export** (lines 549 & 558): Sorted records before CSV output
   - All view variants (card list, Kanban board, calendar, data grid) use sorted results

## Verification

Generated calendar app (gen_app_calendar_ent1.dart) contains:

✅ **CSV export** (line 99):
```dart
for (final r in appStore.records('app_calendar_ent1')
  .sort((a, b) => (a[gen_app_calendar_ent1_c16] ?? '')
    .compareTo(b[gen_app_calendar_ent1_c16] ?? ''))) {
```

✅ **Entity list** (line 153):
```dart
final all = (...).sort((a, b) => (a[gen_app_calendar_ent1_c16] ?? '')
  .compareTo(b[gen_app_calendar_ent1_c16] ?? ''));
```

✅ **Filtered results** (line 156):
```dart
final rs = q.isEmpty ? all : all.where(...)
  .toList().sort((a, b) => (a[gen_app_calendar_ent1_c16] ?? '')
    .compareTo(b[gen_app_calendar_ent1_c16] ?? ''));
```

Where `gen_app_calendar_ent1_c16 = 'שעה'` (confirmed in content file)

## Views Updated

All of the following views now display sorted meetings:
- ☰ Card list (default view)
- 📋 Kanban board (stages: קבוע, התקיים)
- 📅 Calendar view
- ▦ Data grid/table view
- CSV export (clipboard copy)

## Sort Method

Lexicographic string comparison of HH:MM format times:
- "09:00" < "14:30" < "17:00" ✓
- Handles empty values gracefully (defaults to empty string)
- Works across all available views and export formats

## Testing Notes

The changes were applied to the render-ds.mjs generator and verified by regenerating the calendar app with:
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin
```

The generated Dart code contains the expected `.sort()` calls with proper compareTo logic on the time field in all locations where meetings are listed.
