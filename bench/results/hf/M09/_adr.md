# Opening Question (ADR-01)

## Context
Task: Add a second entity `תזכורת` (reminder) to `machtzev/generator/specs-ds/tasks.txt`

The reminder entity:
- Belongs to a task (`משימה`) via required link field
- Has fields: `משימה` (required link), `מועד` (required date), `נשלחה` (yes/no boolean)
- Should render as a table screen (auto-generated from spec)
- Should show empty state text: "אין תזכורות" (no reminders)
- Should cascade-delete when parent task is deleted

## Decision
Add the entity line to tasks.txt spec file using existing syntax from peruk01.txt:
```
ישות תזכורת עם משימה*, מועד*, נשלחה{כן|לא} | מחיקה: משימה=מפל
```

Also add table and empty state particles following the spec-language pattern:
```
חלקיק תזכורת: [טבלה]
חלקיק תזכורת: [ריק] אין תזכורות
```

## Rationale
1. The syntax `משימה*` creates a required link field to the משימה entity
2. The syntax `מועד*` creates a required date field (same type as in משימה entity)
3. The syntax `נשלחה{כן|לא}` creates a boolean enum field with yes/no values
4. The syntax `| מחיקה: משימה=מפל` implements cascade delete on parent deletion
5. The particle syntax `[טבלה]` creates a table view screen for the entity
6. The particle syntax `[ריק] אין תזכורות` sets the empty state message

## Alternatives rejected
- Creating a new spec file: No, reminders belong to tasks app
- Adding as a field to משימה entity: No, needs to be a separate entity with its own screen
- Not implementing cascade delete: No, the task explicitly requires it

## Consequences
- The generator will create a new דאטה (reminder) entity class in Dart
- A table screen will be auto-generated to list reminders
- The rendering engine will handle the empty state text
- The foreign key constraint will cascade deletes from tasks to reminders

## Verification
✓ Byte-verified against peruk01.txt syntax
✓ Run police-bench to confirm no regressions
✓ Verify empty-state rendering in output
✓ Verify cascade delete in generated code
