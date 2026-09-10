# ADR: Table Sorting by Key-Handover Date

## Context
The task requires sorting the cases table in the peruk02 app by "תאריך מסירת מפתח" (key-handover date), earliest first. The spec language supports table sorting via the `[טבלה]` particle with `| מיון:` clause.

## Opening Question
**Q: Should the table show only the key-handover date column, or should it include other relevant columns with key-handover date as the primary sort key?**

**A (Assumed Answer):** Based on the spec language (line 17 of SPEC-LANG.md), tables can specify columns: `[טבלה] עמודה, עמודה, …`. The current spec line 10 uses `[טבלה]` without column specification, which means all fields are shown. To avoid breaking functionality and only address the sorting requirement, I will:
- Keep all columns visible (don't restrict columns)
- Add sorting by תאריך מסירת מפתח in ascending order (earliest first)
- Syntax: `חלקיק תיק: [טבלה] | מיון: תאריך מסירת מפתח עולה`

## Decision
Modify line 10 of peruk02.txt from:
```
חלקיק תיק: [טבלה]
```
to:
```
חלקיק תיק: [טבלה] | מיון: תאריך מסירת מפתח עולה
```

This uses the spec language's table sorting feature without breaking existing column display.

## Rationale
- Spec language explicitly supports this syntax (SPEC-LANG.md line 17)
- "עולה" (ascending) matches "earliest first" requirement
- Preserving all columns maintains existing functionality
- Uses spec layer, not engine layer, as per protocol (fix in correct layer)

## Alternatives Rejected
1. Sorting descending (יורד) — violates "earliest first" requirement
2. Adding column restrictions — unnecessary and changes functionality
3. Modifying engine code — violates protocol to fix in spec first

## Consequences
- Table will display cases ordered by key-handover date, earliest to latest
- Users see actionable timeline of cases
- No breaking changes to columns or other features

## Verification
1. Verify generated Dart contains sort logic for the field
2. Run police report: all checks pass
3. Byte-verify: peruk02 app changes only, others identical
