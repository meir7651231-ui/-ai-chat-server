# PLAN: Sort peruk17 cases table by סיווג

## Goal (one line)
Add alphabetical sorting (ascending) by סיווג field to the cases table in the peruk17 insurance app without breaking any other functionality.

## 10-Step Decomposition

1. **Verify spec syntax** — Read SPEC-LANG.md to confirm exact sorting syntax for tables
   - Record the table sorting pattern: `[טבלה] | מיון: <שדה> עולה`

2. **Locate the spec file** — Read peruk17.txt to find the table particle
   - Confirm current line: `חלקיק תיק: [טבלה]`
   - Verify סיווג field exists in the entity definition

3. **Understand field enum values** — Check what סיווג values are defined
   - From spec: `סיווג{השלמת מסמכים|דחייה לגופה|זימון ועדה|נגמר השעון}`
   - Confirm alphabetical order: דחייה לגופה, השלמת מסמכים, נגמר השעון, זימון ועדה

4. **Record current state** — Run baseline machine check
   - Establish baseline for byte_identical_others, compiles, gates_pass

5. **Apply spec change** — Edit peruk17.txt table line
   - Replace `חלקיק תיק: [טבלה]` with `חלקיק תיק: [טבלה] | מיון: סיווג עולה`

6. **Regenerate app** — Run app-ds.mjs generator
   - Command: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`
   - Verify no errors in generator output

7. **Check generated files** — Inspect new/ directory changes
   - Verify only peruk17 app files changed
   - No stray generated files (orphans fail machine check)
   - Check for new/dart-gen-bs files with sort logic

8. **Verify byte-identity** — Check other apps unaffected
   - Compare against machine's byte_identical_others check

9. **Run machine validation** — Execute police-bench.mjs
   - Verify: regen_ok, no_hand_edit, byte_identical_others, gates_pass, compiles
   - All checks must pass green

10. **Write claims and verdict** — Document completion
    - claims.json: list all passing checks
    - _insp.md: audit against task-coverage, money-numeric, edge-crash, state-leakage, navigation, text-parity
    - Final VERDICT: GO or NO-GO
