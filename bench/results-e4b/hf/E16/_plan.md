# Plan: Add stage "הוחזר הכסף" to תיק entity

## Goal
Add the stage "הוחזר הכסף" (money refunded) to the case entity "תיק" in peruk08.txt after "נמסר" (delivered).

## 10-Step Decomposition

1. **Verify current spec** — Read line 6 of peruk08.txt to confirm current stages
2. **Understand spec language** — Review SPEC-LANG.md stage syntax (already read)
3. **Locate insertion point** — Find exact position after "נמסר" in the stages list
4. **Edit spec file** — Insert "הוחזר הכסף" between "נמסר" and "סגור"
5. **Byte-verify change** — Grep the file to confirm new stage is present
6. **Search for dependencies** — Check if any other apps reference peruk08 stages (byte-identical check)
7. **Run machine report** — Execute police-bench.mjs to verify no breakage
8. **Check other apps** — Verify byte_identical_others passes
9. **Verify gates pass** — Confirm all gates in gates.tsv pass
10. **Confirm DONE** — Machine report shows DONE with all checks passing

## Current Stages
Line 6: `שלבים התקבל, שולם, בבדיקה, נמסר, סגור`

## New Stages
After modification: `שלבים התקבל, שולם, בבדיקה, נמסר, הוחזר הכסף, סגור`

## Risk Assessment
- **Spec-only change**: New stage added to stage list
- **No schema/logic changes**: Pure additive to existing entity
- **No hand-editing of generated files**: All edits within spec/.
- **Byte-identical others**: peruk08 is single-app spec, check other peruk files are unchanged
