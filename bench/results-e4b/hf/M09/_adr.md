# ADR — Context/Decision/Rationale for M09

## Opening Question (per MASTER_PROTOCOL.md §ג.1)

**Q: Should תזכורת (reminder) be a separate screen or a sub-table within task sheet?**

**Assumed Answer:** Separate entity with its own table screen. Rationale:
- Protocol specifies "table screen" and "empty-state text"
- Reminders are independent records (each has own date, sent status)
- One task ↔ many reminders (one-to-many relationship)
- Cascade deletion is the binding (task gone → reminders gone)

**Alternatives rejected:**
- Sub-table in task detail: would require shell-level screen nesting (not dial-drill; violates R2)
- Inline field: can't store multiple reminders per task

---

## Decision
- Add `ישות תזכורת` as standalone entity to tasks.txt
- Fields: `משימה*` (link), `מועד*` (date), `נשלחה` (yes/no)
- Particle `[טבלה]` for table screen
- Particle `[ריק] אין תזכורות` for empty state
- Deletion rule: `מחיקה: משימה=cascade`

## Rationale
- Follows established pattern (tasks.txt has משימה + שלבים)
- Spec language supports links and cascade
- Generator will wire table + empty state automatically
- No engine changes needed; all expressible in spec

## Consequences
- Users see "reminders" as separate list (navigable from tasks hub)
- No breaking changes to משימה entity
- All other apps remain byte-identical

## Verification
- Machine report: `byte_identical_others` must PASS
- Spec parses without errors (implicit in generator run)
- Table screen renders (manual or via screenshot if Flutter available)
