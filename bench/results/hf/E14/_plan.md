# Plan E14 — Add סוג field to פגישה entity

## Goal (1 line)
Add a closed-choice field `סוג` with values [עבודה, אישי, רפואי] to the פגישה entity in calendar.txt.

## 10-Step Decomposition

1. **Search for spec syntax** — Grep specs-ds/ for closed-choice field examples (enum, choices, {values})
2. **Examine grammar** — Read spec-lang.mjs or grammar file to understand closed-choice declaration
3. **Check existing fields** — Look at other entities in calendar.txt to see if any already have choice fields
4. **Determine field position** — Decide where in the entity line to add סוג (before or after existing fields)
5. **Write the field declaration** — Add `סוג{עבודה|אישי|רפואי}` or equivalent syntax to calendar.txt
6. **Search-record** — Run `node machtzev/search-record.mjs "סוג פגישה עבודה אישי רפואי"` to validate no hidden duplicates
7. **Test no-hand-edit** — Verify calendar.txt matches expected format (no spec generation artifacts yet)
8. **Run machine report** — Execute the police bench to validate entire pipeline
9. **Inspect results** — Write _insp.md with checklist (FND/FRM/WIR/VRB/OPS)
10. **Final verdict** — Report DONE if all gates pass, fix if any fail
