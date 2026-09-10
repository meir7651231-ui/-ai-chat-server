# ADR: Sort cases table by סיווג alphabetically

## Context
The app generated from peruk17.txt displays a cases table (חלקיק תיק: [טבלה]). Currently it has no explicit sorting. The task is to make it sorted alphabetically by סיווג.

## Decision
Modify peruk17.txt line 10 from:
```
חלקיק תיק: [טבלה]
```
to:
```
חלקיק תיק: [טבלה] | מיון: סיווג עולה
```

The spec-lang syntax from SPEC-LANG.md line 17 allows:
`[טבלה] עמודה, עמודה, … | מיון: <שדה> עולה / מהנמוך|יורד / מהגבוה, <שדה2>`

"עולה" (ascending) sorts alphabetically for string fields.

## Rationale
- סיווג is an enum field in the תיק entity (values: השלמת מסמכים, דחייה לגופה, זימון ועדה, נגמר השעון)
- No columns are specified, so the table defaults to showing all fields (per spec-lang)
- Adding meiyon directive allows sorting by that field
- This is a spec-level change, not an engine change, so no other apps are affected

## Alternatives rejected
- Adding sorting at the engine level: violates the principle that the spec language should express intent first
- Hardcoding the sort in Dart: spec is the source of truth

## Consequences
- Regenerating the app will produce a cases table sorted alphabetically by סיווג
- The machine check byte_identical_others will verify no other apps are affected
- Must verify the generated Dart compiles and runs correctly

## Verification
After regeneration:
1. Check that peruk17 spec is used
2. Verify generated Dart sorts the table
3. Run machine report to confirm no regressions

