# Plan — Add תקרה נמוכה Field to תיק Entity

**Goal:** Add computed field `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` to the `תיק` entity.

## 10-Step Decomposition

1. **Verify current spec structure** — Read sechirut.txt, locate `תיק` entity definition, confirm existing computed fields pattern
2. **Search for existing min/min operations** — Use search-record to check if min() operation is already known to the generator
3. **Identify insertion point** — Determine where in the entity definition line to add the new field (after existing computed fields)
4. **Draft the addition** — Write the syntax: `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)`
5. **Edit spec file** — Add the new field to sechirut.txt in the תיק entity definition
6. **Byte-verify** — Grep the file to confirm the addition is present and syntactically placed correctly
7. **Check no hand-edits in new/** — Verify no generated files are manually modified (git status)
8. **Run machine report** — Execute `police-bench.mjs --root . --task H11 --claims ./claims.json`
9. **Record claims** — Write claims.json with the checks that passed
10. **Final verdict** — Report VERDICT from machine output

## Risks & Mitigations

- **Generator doesn't support min():** Check search-record first. If unsupported, this becomes a NO-GO.
- **Syntax mismatch:** Follow existing computed field syntax exactly (entity line 7 shows pattern: `fieldname = expression`)
- **Byte verification fails:** Ensure ONLY sechirut.txt is modified; all generated outputs must remain unchanged.
