# Task: Add counter of "דגל מוגן" cases to peruk25 dashboard

## Goal
Add a dashboard counter in peruk25.txt that displays the count of תיק (cases) where סיווג (classification) is דגל מוגן (protected flag), without breaking existing functionality.

## 10-Step Decomposition
1. Read peruk25.txt and SPEC-LANG.md to understand spec syntax ✓
2. Search for existing counters/memonies using search-record.mjs
3. Identify current dashboard line (line 7)
4. Determine correct syntax from SPEC-LANG: `count(<ישות>: <שדה>=<ערך>)`
5. Verify סיווג field and its value "דגל מוגן" exists in the entity definition
6. Add the counter to dashboard line using spec syntax
7. Regenerate app using app-ds.mjs with --name peruk25
8. Run machine report to verify byte-identical for other apps
9. Write verified claims to claims.json
10. Write audit results in _insp.md and get VERDICT

## Key Syntax from SPEC-LANG.md
- Dashboard counters: `לוח בקרה עם מונה / count(<ישות>: <שדה>=<ערך>)`
- Entity סיווג field: `סיווג{סיום רגיל מכתב|לחץ לחתום היום|דגל מוגן|עצמאי חוזה קבלן}`
- Current: `לוח בקרה עם מונה(תיק)`
- Target: Add counter for סיווג=דגל מוגן
