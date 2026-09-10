# Task: Sort findings table by severity color

## Goal
Make the ממצא (findings) particle screen in the sechirut app display findings sorted by color severity in the order: אדום (red), צהוב (yellow), ירוק (green).

## 10-step decomposition

1. **Read spec-lang reference** — understand if sorting syntax exists in `spec-lang.data.json`
2. **Locate findings rendering** — find which particle/screen displays the findings table
3. **Test current behavior** — regenerate app and observe current findings order
4. **Search for similar patterns** — check if other apps use sorting; use `search-record.mjs`
5. **Design the spec change** — express the sort requirement in spec syntax if possible, else in engine logic
6. **Verify spec validity** — run generator to check for parse errors
7. **Generate app** — run `node machtzev/generator/app-ds.mjs` for sechirut
8. **Inspect generated Dart** — verify sorting is correctly wired into the UI layer
9. **Run machine report** — verify no byte-identical-other failures, gates pass
10. **Write claims** — record verification of the sorting behavior

## Context
- Spec file: `machtzev/generator/specs-ds/sechirut.txt`
- App name: `sechirut` (tenancy contract review app)
- Key entity: `ממצא` (findings) with field `צבע` (color: אדום/צהוב/ירוק)
- Current rendering: particle `חלקיק ממצא: רשימת בדיקה`
