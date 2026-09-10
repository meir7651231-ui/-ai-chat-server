# Task M15: Rename מקום field to כתובת in calendar.txt

## Goal
Rename the meeting field מקום (place/location) to כתובת (address) in the calendar spec and ensure the generated app correctly uses the new name everywhere.

## 10-Step Decomposition

1. **Verify current state** — Read calendar.txt, identify exactly where מקום appears as a field name (not in content)
2. **Search for dependencies** — Use search-record.mjs to find all references to this field in engine code
3. **Make spec change** — Edit calendar.txt, replace "מקום" field with "כתובת" 
4. **Verify spec syntax** — Ensure the spec file remains valid after the change
5. **Search in engine source** — Check machtzev/generator/*.mjs files for hardcoded field name references
6. **Make engine changes if needed** — Update any field name mappings in the engine (likely in spec-lang.mjs or similar)
7. **Run generator** — Execute the machine report (police-bench.mjs) to regenerate the app
8. **Verify byte integrity** — Ensure new/ generated files are correct and no hand-edits in source
9. **Document findings** — Create _adr.md with decision rationale and _insp.md with audit checkpoints
10. **Submit claims** — Create claims.json with verified checks, run final police report for VERDICT

## Key Files
- `machtzev/generator/specs-ds/calendar.txt` — The spec file to modify
- `machtzev/generator/spec-lang.mjs` — Likely processes entity definitions
- `new/dart-gen-bs/gen_app_calendar_*.dart` — Generated output files that should update
