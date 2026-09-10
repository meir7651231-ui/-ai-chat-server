# Task: Add numeric + computed fields to תיק entity in peruk25.txt

## Goal (one line)
Add סכום פיצויים (numeric) and פיצויים לשנה (computed = סכום פיצויים × 12) fields to the תיק entity.

## 10-Step Decomposition

1. **Read & understand current entity schema** — Line 6 of peruk25.txt defines תיק entity structure
2. **Verify field naming & syntax** — Check generator grammar for field declarations (numeric, computed)
3. **Search-record both field names** — Query existing atoms for סכום פיצויים, פיצויים לשנה
4. **Add סכום פיצויים field** — Insert numeric field to line 6 entity definition
5. **Add פיצויים לשנה computed field** — Insert formula-based computed field (סכום פיצויים * 12)
6. **Verify byte-identical changes** — Diff shows only new fields, no other edits
7. **Run generator** — Test that specs-ds/peruk25.txt parses without error
8. **Check no hand-edits in generated/** — Verify new/ artifacts are machine-generated, not touched
9. **Write claims.json** — Document what fields were added and verified
10. **Run police check** — Full validation passes with new fields present

## Notes
- Entity line is line 6; add fields after סיווג{...} enum, before | (stage separator)
- Computed field uses formula syntax (likely `פיצויים לשנה = סכום פיצויים * 12`)
- No changes to any other lines
