# Plan: Add תשלום (Payment) Entity to peruk02.txt

**Goal:** Add third entity תשלום to specs-ds/peruk02.txt, properly wired with cascade delete, table screen.

## 10-step Decomposition

1. **Read peruk02.txt** — current structure, entity order, cascade pattern (lines 1–26).
2. **Read spec-lang.data.json** — verify available keywords for types (תאריך, סכום, כן/לא).
3. **Search for "תשלום"** — check if name exists in other apps (search-record).
4. **Draft entity line** — `ישות תשלום עם תיק*, סכום*, שולם`
   - `תיק*` = required link to case (pattern: matches ממצא line 7)
   - `סכום*` = required amount (type: number via keyword)
   - `שולם` = yes/no toggle (type: boolean via keyword)
   - `| מחיקה: תיק=מפל` = cascade on case deletion
5. **Insert at correct line** — after ממצא entity (after line 7), before לוח בקרה (line 8).
6. **Add table particle** — `חלקיק תשלום: [טבלה] תיק, סכום, שולם`
   - Minimal UI: just the columns, default sort by תיק.
   - Insert after ממצא particles (after line 17), before דוח lines (line 18).
7. **Verify cascade syntax** — ממצא uses `| מחיקה: תיק=מפל` (line 7); copy pattern exactly.
8. **Search-record** — run search for "תשלום" + "payment" (Hebrew + English). Choose --none if new.
9. **No hand-edits to generated** — peruk02.txt is the only file touched. Verify after regen.
10. **Machine validation** — run police-bench: must see DONE with byte_identical_others ✓.

## Acceptance Criteria

- [ ] Entity תשלום added with correct fields (תיק*, סכום*, שולם).
- [ ] Cascade delete syntax matches ממצא pattern exactly.
- [ ] Table particle renders all three columns.
- [ ] peruk02.txt is the only file edited by me (no gen_* changes).
- [ ] All other apps byte-identical.
- [ ] Machine reports DONE.
