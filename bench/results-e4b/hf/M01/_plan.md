# PLAN: Add Payment Entity (תשלום) to peruk02.txt

**Goal:** Add a new "תשלום" (payment) entity to peruk02.txt with cascade delete and table screen without breaking existing functionality.

## 10-Step Decomposition

1. **Verify existing peruk02 structure** — Understand the current ישות/חלקיק/דוח structure, existing particles, and how ממצא entity uses cascade delete as a pattern.

2. **Check spec-lang.data.json for type inference** — Verify that field name "סכום" is recognized as amount type and "שולם" is recognized as yes/no type.

3. **Search for similar patterns** — Use search-record.mjs to check if any entity naming or field combinations already exist (הערה, סכום, etc.).

4. **Compose the entity definition** — Write the `ישות תשלום` line with correct field syntax, including cascade delete from parent תיק.

5. **Add table particle** — Write `חלקיק תשלום: [טבלה]` to provide the table screen interface.

6. **Run app-ds.mjs regeneration** — Regenerate peruk02 app to verify spec syntax is correct and produces valid Dart.

7. **Check Dart analysis** — Run flutter analyze (via machine) to ensure no type errors in generated Dart.

8. **Verify byte-identity of other apps** — Ensure no other app's output changed (byte_identical_others check).

9. **Write police gate** — If needed, register new spec validation rule in gates.tsv and police.mjs.

10. **Run machine verification** — Execute police-bench with claims.json to verify all checks pass.

## Key Constraints
- No Hebrew in engine logic (spec-lang.data.json, *.mjs files)
- No hand-edits to generated files (new/dart-gen-bs, etc.)
- Cascade delete syntax: `מחיקה: תיק=cascade`
- Table particle: `[טבלה]` with optional column selection
- Only peruk02.txt changes; all other apps must be byte-identical
