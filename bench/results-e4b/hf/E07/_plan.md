# Plan: Add דחופים counter to peruk21

## Goal
Add a counter named דחופים to the case screen that counts cases whose סיווג is "הזמנה לוועדה" (committee invitation).

## Decomposition (≤10 steps)

1. Read SPEC-LANG.md to understand counter syntax
2. Read peruk21.txt to understand current dashboard structure
3. Verify the סיווג field and its valid values in line 7
4. Compose the conditional counter syntax using count(<ישות>: <שדה>=<ערך>)
5. Modify line 8 of peruk21.txt to add the דחופים counter
6. Run machine verification to ensure no byte breaks in other apps
7. Verify compiled Dart passes flutter analyze
8. Write gate check if needed (probably not for this spec-only change)
9. Document learnings in LEARNINGS.md
10. Generate final inspection report and get VERDICT

## Notes
- This is a spec-only change; no engine code modification needed
- The סיווג field has 4 valid values: בקשת מסמך, הזמנה לוועדה, דחיית סיוע, הילד מפריע בלי
- Other apps should remain byte-identical since we're only changing peruk21.txt
