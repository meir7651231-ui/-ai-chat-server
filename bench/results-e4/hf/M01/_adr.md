# ADR-M01 — Add תשלום (Payment) Entity to peruk02

## Opening Question (§ג.1 MASTER_PROTOCOL)

**מה:** Add a third entity תשלום (payment) to machtzev/generator/specs-ds/peruk02.txt.
- Belongs to תיק (case) with required link
- Fields: תיק (required link), סכום (required amount), שולם (yes/no toggle)
- Cascade delete: deleting a case deletes its payments
- Add a table screen for payments

**מקור:** peruk02 spec. Proto: None (no Preact equiv; engine-only entity).

**תרגום ל-engine:** Spec addition only (no UI flow, no new dials). Table screen renders all payments for a case.

**מחרוזות verbatim:** None new (שולם = payment status toggle, סכום = amount; both already in domain).

**חסום (⛔):** None. Pure spec expansion within allowed language.

## Assumed Answer

1. **Placement:** Add תשלום as third ישות after ממצא in peruk02.txt (line ~17).
2. **Cascade:** Use `מחיקה: תיק=מפל` (cascade) — matches ממצא pattern (line 7).
3. **Table screen:** `חלקיק תשלום: [טבלה] תיק, סכום, שולם` with default sort by תיק.
4. **No extra particles:** Minimal — just the table. Reuse existing דוח if any reference is needed.
5. **Byte-identity:** Only peruk02.txt touched; all other generated files stay identical.

## Rationale

- The spec language explicitly supports cascade delete via `מחיקה: <ישות>=מפל`.
- `שולם` is a boolean field (כן/לא) — inferred from keyword "שולם" (paid/yes-no).
- סכום = amount (number type via keyword).
- Table is the minimal UI for a list of payments — matches SPEC-LANG particle syntax.

## Verification

Machine report: all checks pass, byte-identical for non-peruk02, no orphans, gates green.
