# Plan: Add ותק בשנים field to אדם entity

## Goal (1 line)
Add a years-of-experience field (ותק בשנים) with range 0–77 to the person (אדם) entity in panuy.txt spec.

## 10-step decomposition

1. **Understand spec format** — Read the full panuy.txt to identify entity structure and field syntax
2. **Identify field syntax** — Determine how ranges/constraints are expressed (e.g., [min..max] or {values})
3. **Locate אדם entity** — Find the line where אדם entity fields are declared
4. **Search existing patterns** — Use search-record.mjs to find similar range constraints in other specs
5. **Draft field syntax** — Write the new field in the correct format (ותק בשנים with 0–77 constraint)
6. **Edit panuy.txt** — Add the field to the אדם entity declaration
7. **Verify no conflicts** — Check that the new field doesn't break parsing or existing logic
8. **Run police.mjs --fast** — Verify wiring/contracts/quarry and pins are clean
9. **Run full gates** — Run police.mjs (no flag) to ensure selftest/mutation pass
10. **Write claims.json** — Document what was changed and why, with byte-verification

---

## Initial questions (write assumed answers to _adr.md)
- Q1: What syntax is used for numeric ranges in specs-ds/?
- Q2: Is the field numeric or enum-based?
- Q3: Should it have a default value?
