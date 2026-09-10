# Task E18: Add עדות field to ממצא entity

## Goal
Add closed-choice field `עדות` with values `תמונה | מסמך | בעל פה` to the finding entity `ממצא` in machtzev/generator/specs-ds/sechirut.txt without breaking anything.

## Decomposition (10 steps)
1. Search for existing uses of closed-choice fields (enum pattern) in sechirut.txt to understand syntax
2. Locate line 9 with ממצא entity definition
3. Identify correct insertion point for new field (after נשלח field)
4. Add the field in correct format: `עדות{תמונה|מסמך|בעל פה}`
5. Verify field position doesn't break particle definitions (lines 16-32)
6. Verify field position doesn't break report definitions (lines 33-42)
7. Check no hand-edits introduced in new/ output directories
8. Run machine police-bench report to validate all gates
9. Document all claims in claims.json with verification
10. Write VERDICT based on police-bench result

## Current ממצא definition (line 9)
`ישות ממצא עם תיק*, סעיף*, צבע{אדום|צהוב|ירוק}, מה כתוב, מה לבקש, נשלח{כן|לא} | מחיקה: תיק=מפל`

## Target ממצא definition
`ישות ממצא עם תיק*, סעיף*, צבע{אדום|צהוב|ירוק}, מה כתוב, מה לבקש, עדות{תמונה|מסמך|בעל פה}, נשלח{כן|לא} | מחיקה: תיק=מפל`
