# Plan: Add סוג field to פגישה entity

## Goal
Add a closed-choice field `סוג{עבודה|אישי|רפואי}` to the `פגישה` (meeting) entity in calendar.txt without breaking anything.

## Decomposition
1. Read SPEC-LANG to understand closed-choice syntax (`שדה{א|ב|ג}`) ✓
2. Read calendar.txt to understand current structure ✓
3. Identify where to add the field (in the field list of פגישה entity)
4. Add `סוג{עבודה|אישי|רפואי}` to the field list
5. Run machine validation to ensure no byte-identity violations
6. Verify all specs still generate correctly
7. Check that calendar app still works correctly
8. Write verification to claims.json
9. Write LEARNINGS entry if needed
10. Write ADR to _adr.md with decision rationale
