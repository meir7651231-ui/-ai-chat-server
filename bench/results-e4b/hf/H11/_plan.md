# Plan: Add תקרה נמוכה computed field to sechirut app

**Goal:** Add a computed field `תקרה נמוכה` (lower ceiling) to the `תיק` entity that equals `min(תקרה לפי 3 חודשים, תקרה לפי שליש)`.

## 10-step decomposition

1. **Search for similar computed fields** — Check if any other spec uses `min()` for computed fields to confirm pattern exists
2. **Read SPEC-LANG.md carefully** — Verify that `min()` function is supported in computed field expressions
3. **Locate exact position in sechirut.txt** — Find line 7 where `תיק` entity is defined
4. **Add field to spec** — Insert `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` after the two existing ceiling fields
5. **Search for usages of the two ceiling fields** — Check report definitions (line 38) to see where they're displayed, and ensure new field can be added if needed
6. **Run app-ds.mjs** — Regenerate the app with `node machtzev/generator/app-ds.mjs --name sechirut -f machtzev/generator/specs-ds/sechirut.txt --skin`
7. **Verify other apps unchanged** — Check that other spec-ds apps generate byte-identical output
8. **Run flutter analyze** — Verify generated Dart has no errors
9. **Run machine report** — Execute police-bench.mjs to verify all checks pass
10. **Write claims.json** — Document verified changes

## Key constraints
- Spec-only change (no engine modification)
- Use spec language feature: `min()` function (already documented in SPEC-LANG.md)
- No hand-edits of generated files
- Byte-identical output for other apps (sechirut is the only one being modified)
