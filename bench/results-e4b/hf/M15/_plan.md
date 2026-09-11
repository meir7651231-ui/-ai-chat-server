# Task: Rename מקום → כתובת in calendar.txt

## Goal
Rename the meeting location field from "מקום" to "כתובת" in the calendar spec, regenerate the app, and verify zero breakage in other apps.

## 10-Step Decomposition
1. Read machtzev/generator/specs-ds/SPEC-LANG.md to understand field syntax
2. Read current calendar.txt to locate מקום field and understand its structure
3. Check for any atoms/particles that reference this field name
4. Rename מקום → כתובת in calendar.txt spec
5. Run search-record.mjs to document the field name change
6. Regenerate calendar app with: node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin
7. Verify generated Dart compiles (flutter analyze equivalent)
8. Run police.mjs --fast to check gates/wiring
9. Verify byte-identity of all OTHER apps (not calendar)
10. Document findings in claims.json and run final machine report

## Key Constraints
- Never edit generated outputs (new/dart-gen-bs, new/dart-data-bs, new/dart-forge-bs)
- All other apps must remain byte-identical
- No Hebrew literals in engine logic
- Generated Dart must pass analyze
