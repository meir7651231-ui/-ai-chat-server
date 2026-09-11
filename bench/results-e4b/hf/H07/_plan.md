# PLAN: Add תקרה מחייבת (Max Ceiling) to בטוחה Entity

## Goal
Add a computed max-ceiling field to בטוחה entity in sechirut.txt that equals the maximum of the two existing ceiling fields, verify it compiles without breaking other apps.

## 10-Step Decomposition

1. **Read spec-lang reference** → understand computed field syntax in spec-lang
2. **Read sechirut.txt** → locate בטוחה entity and identify the two ceiling field names
3. **Search for max() patterns** → find existing computed fields in other specs to match syntax
4. **Add spec line** → insert `[שדה] תקרה מחייבת = max(...)` in בטוחה definition
5. **Validate spec syntax** → run generator to check spec parses correctly
6. **Verify Dart output** → check generated Dart has proper max() call with types
7. **Run byte-identical checks** → confirm all other apps remain unchanged
8. **Run police gates** → ensure all gates pass (regen_ok, no_hand_edit, compiles)
9. **Write LEARNINGS entry** → document the pattern for computed numeric max fields
10. **Write final claims & inspection** → verify all checks pass, VERDICT

## Notes
- The spec language likely uses `=` for computed fields (verify in reference)
- max() is a Dart stdlib function (dart:math or builtin)
- If spec-lang doesn't support max(), may need to extend engine logic
