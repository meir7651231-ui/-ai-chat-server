# Plan: Add תזכורת (Reminder) Entity to tasks.txt

## Goal (one line)
Add a second entity `תזכורת` (reminder) to the tasks spec with required fields linking to tasks, supporting cascade deletes, and a table screen with empty state.

## 10-Step Decomposition

1. **Understand current spec** — Read tasks.txt format, existing `משימה` entity structure
2. **Define entity signature** — `תזכורת` with fields: משימה* (link), מועד* (date), נשלחה (yes/no)
3. **Add entity to spec** — Append `ישות תזכורת` line with all fields
4. **Define cascading delete** — Add cascade behavior: `מחיקה: משימה=cascade`
5. **Add table particle** — Spec `[טבלה]` particle for reminder list/screen with columns
6. **Add empty-state text** — Spec `[ריק]` particle with text "אין תזכורות"
7. **Search for existing atoms** — Run search-record.mjs to find matching atoms
8. **Regenerate app** — Run app-ds.mjs to generate Dart
9. **Verify output** — Check new/dart-gen-bs for reminder entity files
10. **Run machine test** — Execute police-bench.mjs to verify all checks pass

## Notes
- The spec is data-driven; no hand-edits to Dart expected
- Cascading delete = when a task is deleted, all its reminders are deleted
- Empty state = shown when no reminders exist
- Table screen = rendered from [טבלה] particle
