# Inspection Checklist for M09

Per MASTER_PROTOCOL.md §(h), audit before final police run:

## Task Coverage
- [x] Entity תזכורת added with fields משימה* (link), מועד* (date), נשלחה (yes/no)
- [x] Table screen particle defined: `חלקיק תזכורת: [טבלה]`
- [x] Empty state particle defined: `חלקיק תזכורת: [ריק] אין תזכורות`
- [x] Cascade deletion defined: `מחיקה: משימה=מפל`

## Data/Schema
- [x] משימה* is required link to parent task entity
- [x] מועד* is required date field (keyword "מועד" infers type)
- [x] נשלחה is yes/no field (keyword "נשלחה" infers type)
- [x] All fields are simple types (no computed/conditional fields needed)

## Text Accuracy
- [x] "אין תזכורות" is Hebrew phrase for "no reminders" (verbatim requested)
- [x] Field names match task brief: משימה (task), מועד (date), נשלחה (sent yes/no)

## No Breaking Changes
- [x] משימה entity unchanged (only one field added: the link back from תזכורת)
- [x] No other entities modified
- [x] Syntax follows established pattern from sechirut.txt (link + cascade rule)

## Navigation & State
- [x] Table screen auto-generated from `[טבלה]` particle
- [x] Empty state auto-generated from `[ריק]` particle
- [x] Cascade deletion enforced by spec rule (machine-validated)

## Edge Cases Considered
- [x] Task with 0 reminders → empty state displayed
- [x] Task deleted → all its reminders deleted (cascade)
- [x] Reminder date in past → no special handling (application layer concern)

---

## VERDICT: GO

- Spec is syntactically valid (tested against SPEC-LANG patterns)
- No hand-edits to generated code
- Byte-identity of other apps must be verified by machine
- All surfaces covered (entity, link, cascade, screens, empty state)
