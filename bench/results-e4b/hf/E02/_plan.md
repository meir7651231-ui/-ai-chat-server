# Plan: Add Priority Field to Case Entity

**Goal:** Add a closed-choice priority field `עדיפות` with values `{גבוהה|בינונית|נמוכה}` to the `תיק` (case) entity in peruk02.txt without breaking anything.

## 10-Step Decomposition

1. **Verify current entity definition** — read line 6 of peruk02.txt, identify all current fields
2. **Check spec language** — confirm closed-choice syntax `{val1|val2|val3}` in SPEC-LANG.md
3. **Search for existing patterns** — run search-record.mjs for "priority עדיפות" to see if similar fields exist
4. **Identify insertion point** — determine where in the field list to add the new field (alphabetically or logically)
5. **Apply the change** — edit peruk02.txt line 6 to add `עדיפות{גבוהה|בינונית|נמוכה}`
6. **Verify no hand-edits** — ensure generated files in new/ remain byte-identical
7. **Run machine verification** — execute police-bench.mjs to check for regressions
8. **Byte-verify claims** — use grep/diff to verify the change took effect
9. **Document findings** — add learning entry to LEARNINGS.md if patterns discovered
10. **Audit via inspection lenses** — run _insp.md checklist (task-coverage, edge-cases, navigation)
