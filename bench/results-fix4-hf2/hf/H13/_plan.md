# 10-Step Plan: Table Column Selection for panuy App

**Goal:** Make the people table in panuy show only 4 columns (שם, זמין, מרחק בקמ, מחיר לשעה) in that order by letting the spec language express column selection.

## Decomposition

1. **Verify spec language support** — Confirm SPEC-LANG.md line 17 documents table column syntax
   - Pattern: `[טבלה] עמודה1, עמודה2, …`
   - Verify the engine already parses this (no new code needed)

2. **Identify current spec state** — Read panuy.txt line 6 to see current table definition
   - Current: `חלקיק אדם: [טבלה]` (all fields)
   - Target: `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`

3. **Find column names in panuy spec** — Verify the 4 column names exist as fields
   - Read entire panuy.txt to list all entity fields
   - Confirm שם, זמין, מרחק בקמ, מחיר לשעה are all defined

4. **Check column order requirement** — Verify the required order in the spec matches the task
   - Task requires: שם, זמין, מרחק בקמ, מחיר לשעה
   - No synonyms or variants—use exact field names

5. **Edit spec file** — Change line 6 of panuy.txt to specify the 4 columns
   - Replace with: `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
   - No other changes to the file

6. **Verify byte-equivalence for other files** — Ensure change affects ONLY panuy app
   - Run police-bench to check byte_identical_others passes
   - No hand-edits to generated files allowed

7. **Regenerate app** — Run the machine to regenerate from new spec
   - Run: `node /tmp/claude-0/.../police-bench.mjs --root . --task H13 --claims ./claims.json --base /tmp/base-hashes-fix4.txt --compile /tmp/claude-0/.../repos/bs-compile-1`

8. **Gate validation** — Verify all gates pass
   - Check: regen_ok, no_hand_edit, byte_identical_others, gates_pass, no_hebrew_in_engine, dart_math_sane, compiles

9. **Functional verification** — Check Dart output quality
   - Confirm generated table widget has exactly 4 columns in order
   - No syntax errors (flutter analyze → 0 errors)

10. **Write claims.json** — Document verified findings
    - claim: "spec_supports_column_selection" ✓
    - claim: "panuy_table_shows_4_columns" ✓
    - claim: "no_other_apps_affected" ✓
    - All checks PASSED

## Success Criteria
- Machine verdict: DONE
- All claims verified by byte-grep
- gates_pass: true
- compiles: true
