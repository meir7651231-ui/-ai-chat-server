# Plan: Add דחופים Counter to peruk21

## Goal
Add a counter named "דחופים" to peruk21 case screen that counts cases where סיווג = "הזמנה לוועדה"

## Decomposition (10 steps)

1. **Search for existing counter patterns** — Look for how counters are used in other specs to verify syntax
2. **Read SPEC-LANG.md** — Confirm conditional counter syntax (already done; line 6 shows `count(<ישות>: <שדה>=<ערך>)`)
3. **Identify correct location** — Line 8 has `לוח בקרה עם מונה(תיק)` (dashboard); add new counter there
4. **Construct spec line** — Create line with syntax: `לוח בקרה עם מונה / count(תיק: סיווג=הזמנה לוועדה), שם דחופים`
5. **Run search-record** — Execute `node machtzev/search-record.mjs "דחופים counter cases" --none` to register atom search
6. **Edit peruk21.txt** — Add new counter line after line 8 (the existing dashboard line)
7. **Verify edit** — Grep the file to confirm counter line was added correctly
8. **Generate app** — Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk21.txt --name peruk21 --skin`
9. **Verify output** — Check generated Dart/data files contain the new counter with correct logic
10. **Run police bench** — Execute machine verification to confirm no breaking changes and all checks pass

## Assumptions
- The syntax `מונה / count(תיק: סיווג=הזמנה לוועדה)` is correct for conditional counting
- The counter will automatically get label "דחופים" via the name in the dashboard spec
- No other files need modification
