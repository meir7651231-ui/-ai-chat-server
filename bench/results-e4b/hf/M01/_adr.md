# ADR: Add Payment Entity to peruk02

## Opening Question
**מה:** Add a new entity "תשלום" (payment) to peruk02.txt for tracking case-related payments.

**מקור:** Task requirement — peruk02.txt (existing deposit case spec)

**תרגום:** 
- New entity "תשלום" (payment) 
- Fields: 
  - תיק* (required link to case entity)
  - סכום (required amount, detected by "סכום" in field name)
  - שולם (yes/no, detected by "האם" or "שולם" in field name)
- Delete behavior: cascade (when a case is deleted, all its payments are deleted)
- Screen: table particle for listing all payments

**Context/Decision:**
The spec language supports:
- `ישות <שם> עם <שדה>, <שדה>, …` to define entities
- `מחיקה: <ישות>=cascade` for cascade delete
- `חלקיק <ישות>: [טבלה]` for table screen particle

**Rationale:**
- Payment entity must belong to case (תיק*) to establish the relationship
- Cascade delete ensures data integrity (orphaned payments are impossible)
- Table particle provides the UI to view/manage payments
- No Hebrew in engine logic — all text stays in spec file

**Alternatives rejected:**
- Manual delete (no cascade): Would leave orphaned payments
- Link without required (*): Would allow payments without a case
- Form particle instead of table: Task specifically asks for table screen

**Consequences:**
- Once a case is deleted, all related payments are deleted
- The table screen becomes available automatically via the spec language
- No changes needed to engine logic
- Byte-identical output for existing apps (only peruk02 changes)

**Verification:**
- Machine checks: regen_ok, no_hand_edit, byte_identical_others, gates_pass
- Dart compile: flutter analyze must pass
- Police gate: spec-lang must validate the new syntax
