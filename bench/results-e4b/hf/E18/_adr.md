# Opening Question (Protocol ג.1)

## Context
Task: Add to the ממצא (finding) entity a closed-choice field עדות with values תמונה, מסמך, בעל פה.

## Decision
The field עדות will be:
1. **Optional** (no `*` suffix) — findings may not always have evidence source
2. **Appended** to the entity definition after נשלח field — preserves existing field order
3. **Syntax**: `עדות{תמונה|מסמך|בעל פה}` per spec-lang closed-choice pattern

## Rationale
- No requirement specified for mandatory; optional is safer (no data backfill needed)
- Appending preserves existing particle order and backward compatibility
- Closed-choice syntax matches existing צבע and נשלח fields

## Verification
- Run police-bench to confirm no byte-identity violations in other apps
- Verify ממצא entity syntax and particle rendering
