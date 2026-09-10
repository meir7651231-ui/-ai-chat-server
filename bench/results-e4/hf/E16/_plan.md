# Goal
Add stage "הוחזר הכסף" (money refunded) to תיק entity after "נמסר" in peruk08.txt.

## 10-step decomposition

1. Read current peruk08.txt — identify line with שלבים (stages)
2. Understand current stage sequence: התקבל, שולם, בבדיקה, נמסר, סגור
3. Plan insertion: נמסר → הוחזר הכסף → סגור
4. Run `node machtzev/search-record.mjs "הוחזר הכסף refund money"` to check if this term exists
5. Edit peruk08.txt line 6: insert "הוחזר הכסף" after "נמסר" in stages list
6. Verify byte-change is isolated to this file only
7. Regenerate app with `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk08.txt --name peruk08 --skin`
8. Run machine's police-bench with claims.json
9. Audit against lenses (task-coverage, money-numeric, edge-crash, state-leakage, navigation, text-parity)
10. Write VERDICT: GO or NO-GO
