# Plan: Sort Tasks Table by Due Date (מועד), Soonest First

## Goal (one line)
Add sorting directive to tasks.txt particle definition so the משימה (tasks) table displays items sorted by מועד (due date) in ascending order.

## 10-Step Decomposition

### Phase 1: Research & Verification
1. **Confirm spec language syntax** — Read SPEC-LANG.md line 17 to verify `מיון:` directive exists and syntax is correct
2. **Locate particle definition** — Identify where the משימה particle is currently defined in tasks.txt (likely implicit via default table render)
3. **Confirm มועד field exists** — Verify the due date field is named מועד in the ישות משימה definition (line 6 of tasks.txt)

### Phase 2: Spec Modification
4. **Add particle directive** — If no explicit particle, add: `חלקיק משימה: [טבלה] מה, מועד, סכום, הערה | מיון: מועד עולה`
   OR if implicit, verify implicit behavior includes sorting in the generated output
5. **Use correct sorting keyword** — Verify the word עולה means ascending (low→high) and is the right choice for "soonest first"

### Phase 3: Generation & Verification
6. **Regenerate app** — Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`
7. **Check byte-identity of other apps** — Run `node /tmp/claude-0/.../police-bench.mjs ... --claims ./claims.json` and verify `byte_identical_others` passes (no unintended side-effects)
8. **Verify compilation** — Check `compiles` gate passes (flutter analyze on generated Dart)

### Phase 4: Validation & Reporting
9. **Manually verify sort order** — If possible, inspect generated code to confirm sort-by-מועד logic is present
10. **Write claims.json** — Document what was proven (check IDs and text), note any unproven claims

## Deliverables
- Modified specs-ds/tasks.txt with sorting directive
- Passing machine report (DONE verdict)
- claims.json with proven checks
