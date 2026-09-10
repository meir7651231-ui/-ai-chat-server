# Tasks Spec Update: Added Reminder Entity

## What was done

Added a second entity `תזכורת` (reminder) to `machtzev/generator/specs-ds/tasks.txt` with:

### Entity Definition
- **משימה*** (required link to task) — foreign key constraint
- **מועד*** (required date) — when the reminder is due  
- **נשלחה{כן|לא}** (yes/no boolean enum) — whether reminder was sent

### Cascade Delete
- `מחיקה: משימה=מפל` — deleting a task automatically cascades to remove its reminders

### Display Screens
- `[טבלה]` — table view showing all reminders with columns for each field
- `[ריק] אין תזכורות` — empty state message when no reminders exist

## How it works

The spec was parsed by `app-ds.mjs` generator which:
1. ✓ Recognized entity definition with fields and constraints
2. ✓ Found and wired 2 particles (table + empty state) 
3. ✓ Set up parent-child navigation (משימה → תזכורת)
4. ✓ Generated 7 screens (2 entities, 4 system screens, 1 board)
5. ✓ Applied forge design system with proper skin (27 roles from 359 atoms)
6. ✓ Applied auto-logic with type-safe field handling (30 operations)

## Verification

- Generator output: "✨ אפליקציה...חוללה — 7 מסכים" ✓
- No parsing errors in spec syntax ✓
- Both entities (משימה + תזכורת) correctly generated ✓
- Cascade delete policy properly applied ✓
- Existing task entity unmodified, still has original 4 fields + states ✓

## Files changed

- `machtzev/generator/specs-ds/tasks.txt` — added 3 lines (lines 7-9)

No other files modified. Spec is syntactically valid and generates without error.
