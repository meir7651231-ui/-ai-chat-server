# Task: Sort cases table by price (מחיר) ascending, numeric comparison

## Goal
Make the table particle for תיק (case/ticket) entity in peruk12 app sort by מחיר (price) field numerically, cheapest first.

## 10-Step Decomposition
1. Read SPEC-LANG to find sorting syntax → `[טבלה] | מיון: <שדה> מהנמוך`
2. Read current peruk12.txt line 10 (table particle definition)
3. Verify there is a `מחיר` field in the תיק entity (line 7)
4. Update spec line 10 to add sorting directive
5. Run search-record.mjs to check for existing sorting patterns
6. Regenerate app with `app-ds.mjs --name peruk12 --skin`
7. Verify generated Dart sorts numerically (check dart-gen-bs output)
8. Run machine police check to verify no breakage
9. Write lessons to LEARNINGS.md
10. Report VERDICT from machine

## Current State
- Spec line 10: `חלקיק תיק: [טבלה]` (no sorting)
- Spec line 7 declares entity with `מחיר` field
- Sorting syntax in SPEC-LANG: `| מיון: <שדה> עולה / מהנמוך | יורד / מהגבוה`

## Expected Change
Line 10 will become: `חלקיק תיק: [טבלה] | מיון: מחיר מהנמוך`
