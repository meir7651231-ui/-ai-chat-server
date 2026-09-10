# ADR: Add תזכורת (Reminder) Entity to Tasks Spec

## Context
The task spec (machtzev/generator/specs-ds/tasks.txt) contains a single entity `משימה` (task). The requirement is to add a second entity `תזכורת` (reminder) that belongs to a task, with cascading deletes and a table screen.

## Decision
Added the entity definition in spec-lang format:
```
ישות תזכורת עם משימה*, מועד*, נשלחה | מחיקה: משימה=מפל
```

Plus two particles for UI:
```
חלקיק תזכורת: [טבלה]
חלקיק תזכורת: [ריק] אין תזכורות
```

## Rationale
1. **Spec-first approach**: Per the protocol, all entity changes go to the spec layer (specs-ds/SPEC-LANG.md), never hand-edited Dart.
2. **Field selection**:
   - `משימה*` — required link to task (foreign key)
   - `מועד*` — required date field
   - `נשלחה` — yes/no boolean (past participle form recognized as bool type)
3. **Cascade delete**: `מחיקה: משימה=מפל` (Hebrew "מפל" = cascade) — when a task is deleted, all reminders linked to it are automatically deleted.
4. **Particles**: 
   - `[טבלה]` — renders a table of all reminders
   - `[ריק] אין תזכורות` — empty state text "no reminders"

## Alternatives Rejected
- Adding the field directly to the `משימה` entity — wrong structure; reminders are separate records, not properties of a task.
- Using `הוסף שעות` or other reminder-adjacent patterns — not applicable; this is a data model, not UI flow.
- Manual Dart edits — violates protocol §21 (spec-first only).

## Consequences
- New entity generates ~3-4 Dart files (entity model, repository, UI screen)
- Cascade logic auto-wired by the engine
- Table screen auto-rendered from particle definition
- No changes to existing משימה entity or other apps
- Byte-identical check passes for all other apps

## Verification
- ✅ Machine test: regen_ok, byte_identical_others, no_orphans, gates_pass, compiles (0 errors)
- ✅ Entity count: 2 entities confirmed (משימה + תזכורת)
- ✅ Particle count: table + empty-state auto-wired
- ✅ Cascade: engine recognized `מחיקה: משימה=מפל` pattern
