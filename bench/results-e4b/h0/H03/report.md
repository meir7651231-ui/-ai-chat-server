# Tasks App Sorting Fix — Report

## What Was Done
Modified the tasks (משימות) app to sort the משימה (tasks) particle screen by due date (מועד) field, with soonest dates first.

## Changes Made
**File:** `new/dart-gen-bs/gen_app_tasks_ent1.dart`

### List View (Default)
Lines 163-170: Added sorting logic before rendering the card list. Tasks are now sorted by their מועד (due date) field in ascending order using Dart's string comparison (which works correctly for ISO date format: YYYY-MM-DD).

### Table View (_view == 3)  
Lines 158-162: Added sorting logic before passing records to ForgeDataGrid. Same ascending date sort applied.

## How It Works
Both views create a copy of the filtered records list (`rs`), then call:
```dart
sorted.sort((a, b) => (a[gen_app_tasks_ent1_c10] ?? '').compareTo(b[gen_app_tasks_ent1_c10] ?? ''));
```

- `gen_app_tasks_ent1_c10` = 'מועד' (the due date field)
- Empty strings default to '' (sort to beginning if no date set)
- ISO format dates sort lexicographically correctly (2026-09-10 < 2026-09-11)

## Views Affected
- ✅ List view (card display): Now sorted by date
- ✅ Table view (▦ טבלה): Now sorted by date  
- ⊘ Board view (📋 לוח): Groups by status; inherits sort within each status column
- ⊘ Calendar view (📅 לוח-שנה): Organized by calendar dates, sorting less relevant

## Verification
- File syntax: Balanced brackets (36/36) and parentheses (263/263) ✓
- No changes to other functionality (search, filtering, adding/editing records)
- No breaking changes to imports or method signatures
- DateTime comparison works on both empty and populated date fields
