# ADR: Add דחופים Counter to peruk21 Case Screen

## Context
- peruk21.txt defines a "מכתב מבית ספר / ועדה / שילוב" (school letter/committee/inclusion) application
- Entity תיק (case) has a סיווג (classification) field with options: {בקשת מסמך|הזמנה לוועדה|דחיית סיוע|הילד מפריע בלי}
- Currently line 8 has: `לוח בקרה עם מונה(תיק)` (dashboard with case counter)
- Task: Add a counter named "דחופים" that counts cases whose סיווג = "הזמנה לוועדה"

## Decision
- Use the spec language syntax for conditional counter: `מונה / count(<ישות>: <שדה>=<ערך>)`
- Add a new counter line after line 8 following the pattern: `לוח בקרה עם מונה / count(תיק: סיווג=הזמנה לוועדה), שם דחופים`
- The name "דחופים" (urgent) will be displayed as the counter label

## Rationale
- SPEC-LANG.md line 6 shows conditional counter syntax is supported
- Adding to the existing "לוח בקרה" (dashboard control) keeps counters grouped
- No changes needed to entity definition or particles; only specification language

## Alternatives Rejected
- Creating a new dashboard line vs. extending existing line 8 (not possible; each counter is independent)
- Using a computed field on תיק (overkill; spec language has built-in counter syntax)

## Consequences
- New counter "דחופים" will appear on the dashboard
- Counts only cases with סיווג = "הזמנה לוועדה"
- No logic/data layer changes needed

## Verification
- Machine will regenerate app and verify no output changes in other apps
- Counter must appear correctly and be byte-identical with expected output
