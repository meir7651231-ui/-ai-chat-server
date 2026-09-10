# Task E19: Add Counter to Dashboard

## Goal
Add a counter in the dashboard (לוח בקרה) of peruk25.txt that counts cases where סיווג = דגל מוגן (protected flag classification).

## 10-Step Decomposition
1. **Search** for existing counter patterns in specs-ds/ using search-record.mjs
2. **Read** the current peruk25.txt to understand structure of לוח בקרה
3. **Understand** how counters bind to fields in the generator
4. **Identify** the correct syntax for filtered counter in the spec language
5. **Modify** line 7 or add new line to peruk25.txt with דגל מוגן counter
6. **Run** police-bench to verify no syntax errors
7. **Check** that generator produces valid dart code without breaking existing dashboard
8. **Verify** counter renders on the dashboard with correct count
9. **Write** lesson to LEARNINGS.md about filtered counters
10. **Finalize** claims.json with proven changes

## Current State
- peruk25.txt line 7: `לוח בקרה עם מונה(תיק)` = dashboard with generic case counter
- Line 6 defines סיווג with 4 enum values including דגל מוגן
- Need to add filtered counter without breaking existing functionality
