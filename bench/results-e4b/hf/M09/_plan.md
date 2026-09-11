# M09 Task Plan — Add תזכורת (Reminder) Entity

## Goal
Add a new entity `תזכורת` (reminder) to tasks.txt with:
- Fields: `משימה*` (required link to task), `מועד*` (required date), `נשלחה` (yes/no)
- Cascade deletion when task deleted
- Table screen + empty state "אין תזכורות"

## 10-Step Decomposition

1. **Read spec language reference** — understand particle syntax for reminders
2. **Search for conflicts** — check no "תזכורת" or "reminder" already defined
3. **Design entity line** — write spec syntax for reminder with fields
4. **Design cascade rule** — express deletion cascade in spec syntax
5. **Design table screen** — choose which fields + sorting for table particle
6. **Design empty state** — register "אין תזכורות" particle
7. **Edit tasks.txt** — add entity, cascade rule, particles (table + empty)
8. **Verify syntax** — run spec-lang parser (implicit in generator)
9. **Run machine report** — test byte-identity of other apps
10. **Register findings** — write to claims.json and LEARNINGS.md

## Key References
- Spec language: lines 14 (links), 17-22 (particles), cascade syntax L5
- Current tasks.txt: entity משימה with שלבים + שדות
- Mirror: reminders belong-to tasks (one-to-many, delete task → delete reminders)
