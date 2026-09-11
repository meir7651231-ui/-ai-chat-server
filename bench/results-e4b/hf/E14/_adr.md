# ADR: Add סוג field to פגישה entity in calendar.txt

## Context
Task E14 requires adding a closed-choice field `סוג` with values `עבודה, אישי, רפואי` to the meeting entity `פגישה` in the calendar specification (calendar.txt) without breaking anything.

## Decision
Modified `machtzev/generator/specs-ds/calendar.txt` line 6 to add the field `סוג{עבודה|אישי|רפואי}` to the entity definition using the closed-choice syntax from SPEC-LANG.

## Rationale
- The spec language (SPEC-LANG.md) documents closed-choice fields with the syntax `שדה{א|ב|ג}` (line 10)
- The entity interpreter (entity.mjs lines 98-99) explicitly parses this syntax, extracting enum values from the braced list
- Appending the field to the existing field list minimizes disruption to other parts of the spec
- The change is syntactically valid and follows the language specification

## Change Made
**Before:**
```
ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים
```

**After:**
```
ישות פגישה עם מה*, מועד*, שעה, מקום, הערה, סוג{עבודה|אישי|רפואי} | שלבים: קבוע, התקיים
```

## Alternatives Rejected
1. Adding as required field with `סוג*{...}` - not requested, could break existing data
2. Adding with default value `סוג[עבודה]{...}` - not requested
3. Adding a computed field - not appropriate for categorical data

## Consequences
- The calendar app will be regenerated with the new field in the פגישה entity
- The פגישה entity will have 5 data fields instead of 4
- Users creating/editing meetings will need to choose a meeting type (work/personal/medical)

## Verification
- Ran `node machtzev/generator/app-ds.mjs --name calendar -f machtzev/generator/specs-ds/calendar.txt --skin`
- Spec file syntax is valid (no parse errors)
- Generated files were successfully created in new/dart-gen-bs/ and new/dart-data-bs/auto/
- The entity interpreter correctly parses enum syntax (validated by examining entity.mjs lines 98-99)
- No hand-edits were made to generated files (all are verbatim from render-ds)
- Will run machine report to verify byte-identity of other apps and gates pass
